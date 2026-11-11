import argparse, json, os, sys, traceback
from io import BytesIO
from pathlib import Path
from urllib.parse import urljoin
from PIL import Image, ImageChops
from playwright.sync_api import sync_playwright

ap=argparse.ArgumentParser()
ap.add_argument('--source',required=True); ap.add_argument('--target',required=True)
ap.add_argument('--negative');ap.add_argument('--output',required=True)
a=ap.parse_args(); out=Path(a.output);out.mkdir(parents=True,exist_ok=True)
report={'source':a.source,'target':a.target,'checks':[],'visual':[],'negative':None,'status':'RUNNING'}

def check(name,condition,observed=None):
    record={'name':name,'passed':bool(condition)}
    if observed is not None:record['observed']=observed
    report['checks'].append(record)
    if not condition:raise AssertionError(name+': '+str(observed))

def diff(left,right):
    l=Image.open(BytesIO(left)).convert('RGB');r=Image.open(BytesIO(right)).convert('RGB')
    if l.size!=r.size:return {'same':False,'left_size':l.size,'right_size':r.size,'changed_ratio':1.0}
    d=ImageChops.difference(l,r);mask=d.convert('L').point(lambda x:255 if x else 0)
    changed=sum(v for i,v in enumerate(mask.histogram()) if i>0)
    return {'same':d.getbbox() is None,'left_size':l.size,'right_size':r.size,'changed_ratio':changed/(l.width*l.height)}

def ready(page,url,document=False):
    response=page.goto(url,wait_until='load',timeout=60000)
    if response is None: response=page.reload(wait_until='load',timeout=60000)
    check('HTTP '+url,response is not None and response.status==200,response.status if response else None)
    if document: page.locator('.document-body').wait_for()
    else:
        page.wait_for_function('window.FINANCE_LESSONS && window.FINANCE_LESSONS.length === 4')
        if '#lesson/' in url:page.locator('.article h1').wait_for()
        else:page.wait_for_function('document.querySelectorAll(".lesson-card").length===4')
    page.evaluate('document.fonts.ready');page.wait_for_timeout(120)
    check('no horizontal page overflow '+url,page.evaluate('document.documentElement.scrollWidth <= window.innerWidth+1'))
    check('Chinese text intact '+url,'\ufffd' not in page.locator('body').inner_text())
    page.evaluate('window.scrollTo({top:0,behavior:"instant"})')

try:
 with sync_playwright() as p:
    opts={'headless':True,'args':['--no-sandbox']}
    if os.environ.get('CHROMIUM_PATH'):opts['executable_path']=os.environ['CHROMIUM_PATH']
    browser=p.chromium.launch(**opts)
    context=browser.new_context(reduced_motion='reduce',locale='zh-TW',device_scale_factor=1)
    source=context.new_page();target=context.new_page();errors=[]
    target.on('pageerror',lambda e:errors.append(str(e)))
    lessons=[('time-value-of-money',2),('risk-and-return',1),('bond-price-and-interest-rate',0),('diversification',3)]
    snapshots=[]
    for width,height in [(1365,900),(779,1000),(390,844),(340,800)]:
        source.set_viewport_size({'width':width,'height':height});target.set_viewport_size({'width':width,'height':height})
        for path,label in [('', 'home')]+([(f'#lesson/{slug}',slug) for slug,_ in lessons] if width in (1365,390) else []):
            ready(source,urljoin(a.source,path));ready(target,urljoin(a.target,path))
            left=source.screenshot(full_page=True,animations='disabled');right=target.screenshot(full_page=True,animations='disabled')
            (out/f'source-{label}-{width}.png').write_bytes(left);(out/f'target-{label}-{width}.png').write_bytes(right)
            result=diff(left,right);result.update({'page':label,'width':width});report['visual'].append(result)
            check('pixel equality '+label+' '+str(width),result['same'],result)
        if width in (1365,390):
            for doc in ['agents.html','readme.html']:
                ready(source,urljoin(a.source,doc),True);ready(target,urljoin(a.target,doc),True)
                (out/f'target-{doc}-{width}.png').write_bytes(target.screenshot(full_page=True,animations='disabled'))
                first=source.locator('.document-header').screenshot();second=target.locator('.document-header').screenshot()
                result=diff(first,second);check('document header equality '+doc+' '+str(width),result['same'],result)
                for selector in ['body','.document-body','.document-toc','.brand-name']:
                    js='e=>({font:getComputedStyle(e).fontFamily,size:getComputedStyle(e).fontSize,line:getComputedStyle(e).lineHeight,weight:getComputedStyle(e).fontWeight,color:getComputedStyle(e).color})'
                    x=source.locator(selector).evaluate(js);y=target.locator(selector).evaluate(js)
                    check('document typography '+doc+' '+str(width)+' '+selector,x==y,{'source':x,'target':y})
                check('document download '+doc,target.locator('a[download]').count()==1)
    if a.negative:
        source.set_viewport_size({'width':1365,'height':900});target.set_viewport_size({'width':1365,'height':900})
        ready(source,a.source)
        response=target.goto(a.negative,wait_until='load',timeout=60000)
        check('negative fixture HTTP',response.status==200,response.status)
        target.wait_for_function('document.querySelectorAll(".lesson-card").length===4')
        target.evaluate('document.fonts.ready');target.wait_for_timeout(120)
        result=diff(source.screenshot(full_page=True),target.screenshot(full_page=True))
        report['negative']=result
        check('reject actual rejected reconstruction',not result['same'] and result['changed_ratio']>0.01,result)
    target.set_viewport_size({'width':1365,'height':900});ready(target,a.target)
    check('four lessons and exact count',target.locator('.lesson-card').count()==4 and target.locator('[data-lesson-count]').inner_text()=='4')
    check('continuation initial',target.locator('#notebook-continuation').is_visible())
    target.get_by_role('button',name='風險與配置',exact=True).click()
    check('risk filter two',target.locator('.lesson-card').count()==2)
    check('continuation filtered hidden',target.locator('#notebook-continuation').is_hidden())
    target.locator('#lesson-search').fill('分散')
    check('combined search one',target.locator('.lesson-card').count()==1)
    target.locator('#lesson-search').fill('不存在的測試主題')
    check('no result state',target.locator('#empty-state').is_visible() and target.locator('.lesson-card').count()==0)
    target.locator('#reset-search').click()
    check('reset state',target.locator('.lesson-card').count()==4 and target.locator('#notebook-continuation').is_visible())
    for slug,answer in lessons:
        ready(target,urljoin(a.target,'#lesson/'+slug))
        check('six sections '+slug,target.locator('.article-section').count()==6)
        check('answer hidden '+slug,target.locator('#answer-details').is_hidden() and target.locator('#quiz-submit').is_disabled())
        target.locator('input[name="quiz-answer"]').nth((answer+1)%4).check();target.locator('#quiz-submit').click()
        check('wrong answer '+slug,'再想一下' in target.locator('#quiz-status').inner_text() and target.locator('.answer-detail').count()==4)
        check('answers locked '+slug,target.locator('input[name="quiz-answer"]:disabled').count()==4)
        target.locator('#quiz-reset').click()
        check('reset quiz '+slug,target.locator('#answer-details').is_hidden() and target.locator('input[name="quiz-answer"]:checked').count()==0)
        target.locator('input[name="quiz-answer"]').nth(answer).check();target.locator('#quiz-submit').click()
        check('correct answer '+slug,'答對了' in target.locator('#quiz-status').inner_text())
        check('sources HTTPS '+slug,all(u.startswith('https://') for u in target.locator('.source-list a').evaluate_all('(els)=>els.map(e=>e.href)')))
        check('pagination links '+slug,target.locator('.article-pagination a').count()==2)
    ready(target,urljoin(a.target,'#lesson/time-value-of-money'))
    check('compound default',target.locator('#calc-future').inner_text()=='NT$11,025')
    for pv,rate,years,expected in [('10000','0','2','NT$10,000'),('10000','5','0','NT$10,000'),('0','5','2','NT$0'),('10000','-10','2','NT$8,100')]:
        for selector,value in [('#calc-principal',pv),('#calc-rate',rate),('#calc-years',years)]:target.locator(selector).fill(value)
        check('calculator '+','.join((pv,rate,years)),target.locator('#calc-future').inner_text()==expected and target.locator('#calc-output').is_visible())
    check('negative label',target.locator('#calc-interest-label').inner_text()=='累積損失')
    for selector,value in [('#calc-principal',''),('#calc-principal','100000001'),('#calc-rate','51'),('#calc-years','1.5')]:
        for s,v in [('#calc-principal','10000'),('#calc-rate','5'),('#calc-years','2')]:target.locator(s).fill(v)
        target.locator(selector).fill(value)
        check('invalid hides stale result '+selector+' '+value,target.locator('#calc-output').is_hidden() and target.locator('#calc-error').is_visible())
    target.goto(urljoin(a.target,'#lesson/not-a-real-note'),wait_until='load')
    check('invalid article safe',target.locator('.not-found').is_visible())
    target.locator('.not-found a').click();check('invalid article return',target.locator('#home-view').is_visible())
    check('no runtime exceptions',not errors,errors)
    browser.close()
 report['status']='PASS'
except Exception as e:
 report['status']='FAIL';report['error']=str(e);report['traceback']=traceback.format_exc()
finally:
 (out/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
 print(json.dumps({'status':report['status'],'checks':len(report['checks']),'failed':[x for x in report['checks'] if not x['passed']],'error':report.get('error')},ensure_ascii=False))
 if report['status']!='PASS':sys.exit(1)
