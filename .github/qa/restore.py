import hashlib,json,re,shutil,subprocess
from pathlib import Path
from urllib.request import Request,urlopen
ORIGIN='https://finance-notes-hongji-2026.amusingbroom4.chatgpt.site/'
PUBLIC=['index.html','styles.css','content.js','math.js','app.js','AGENTS.md','README.md','agents.html','readme.html','.nojekyll']
EXPECTED={
'.nojekyll':'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
'AGENTS.md':'519b5c0d734f5a22765763c6a4b04f3295a7d2b1a14944c225d9acc7741e166e',
'README.md':'15668b2458892f401ebcbca91d923a5f0d0c3ca41fbc9d32d19f07d2250fe164',
'agents.html':'f0be3730563470a2f916dfcf6126ddde84431b93cbaef0203ab922f0178b48a8',
'app.js':'959b71172ead4d5eefbe0db71482826e60e37a9449e829ae20d65b0b87e30864',
'content.js':'0b981b560690224b811773d6f3b4f12c92bed601704118bec1cbafd98582f2dd',
'index.html':'63a41ccc0a56fd54f9975586bcd3aeb6c11e472019cd90b4f1ea0060311c33d9',
'math.js':'940ee366385001b69c93bd093eda016a9c2cd23dca4f470c5e2520e8b74ee43f',
'readme.html':'4cf828f7e4d250801baab8f23788902f59891b99b654f5487cb0947c903fc632',
'scripts/build.mjs':'2c480e995469d9ccb28a570dea1337edf751d1c48453ffa4b943cc55b68f4e6c',
'scripts/document-template.html':'b4ecb843671ae19217b9f368a392f31e21428ef254749b2451c4f99803a3fa16',
'scripts/documents.mjs':'686075b95aeab1ed9806d8d0b2681c06c8a242ca9d0f161eb5c86ca3db1d18cf',
'styles.css':'c62bb029f7f4eaefc2dc27f9ebbba9ca28734e31810606cc317181d0fa6c9a44',
 'tests/check.mjs':'e12e622c63629947381fb41f90513db3b2912e5a688c14d04d3b45de807acacf'}
observations=[]
for name in PUBLIC:
 if name=='.nojekyll':Path(name).write_bytes(b'');continue
 with urlopen(Request(ORIGIN+name,headers={'User-Agent':'FinanceNotes-Restore-QA/1.0'}),timeout=30) as r:
  assert r.status==200 and r.url.startswith(ORIGIN)
  data=r.read(2000001);assert len(data)<=2000000
 raw_sha=hashlib.sha256(data).hexdigest();removed=[]
 if name.endswith('.html'):
  def strip(m):
   text=m.group(0)
   if 'window.__CF$cv$params=' in text and '/cdn-cgi/challenge-platform/' in text:
    removed.append(hashlib.sha256(text.encode()).hexdigest());return ''
   return text
  data=re.sub(r'<script\b[^>]*>[\s\S]*?</script>',strip,data.decode('utf-8')).encode('utf-8')
  assert len(removed)<=1
 if name not in ['AGENTS.md','agents.html','readme.html']:
  assert hashlib.sha256(data).hexdigest()==EXPECTED[name], 'Approved source changed: '+name
 Path(name).write_bytes(data)
 observations.append({'path':name,'url':ORIGIN+name,'raw_sha256':raw_sha,'removed_host_scripts':removed,'retained_sha256':hashlib.sha256(data).hexdigest()})
p=Path('AGENTS.md');text=p.read_text(encoding='utf-8-sig')
old='- `.openai/hosting.json`：網站託管設定；不存放金鑰，不因新增文章而修改。'
new='- `scripts/document-template.html`：兩份文件閱讀頁共用的原版版型；只在調整文件版型時修改。\n- `.nojekyll`：GitHub Pages 的靜態網站設定，保留此空白檔案。'
assert text.count(old)==1;p.write_text('\ufeff'+text.replace(old,new),encoding='utf-8')
template=Path('agents.html').read_text()
m=re.search(r'(<article[^>]+>)[\s\S]*?(</article>)',template);assert m
template=template[:m.start()]+m.group(1)+'\n{{BODY}}\n'+m.group(2)+template[m.end():]
template=re.sub(r'(<nav class="document-toc"[\s\S]*?<ol>)[\s\S]*?(</ol></nav>)',r'\1{{TOC}}\2',template)
template=template.replace('固定內容格式與開發方式，讓每一篇新筆記都有一致的品質。','{{DESCRIPTION}}')
template=template.replace('金融概念小教室｜專案規則','{{H1}}').replace('專案規則｜金融概念小教室','{{TITLE}}｜金融概念小教室')
template=template.replace('PROJECT RULES','{{EYEBROW}}')
template=template.replace('href="./agents.html" aria-current="page"','href="./agents.html"{{AGENTS_CURRENT}}').replace('href="./readme.html"','href="./readme.html"{{README_CURRENT}}')
template=template.replace('AGENTS.md','{{MARKDOWN}}').replace('aria-label="專案規則全文"','aria-label="{{TITLE}}全文"')
Path('scripts/document-template.html').write_text(template)
subprocess.run(['node','scripts/documents.mjs'],check=True)
actual={name:hashlib.sha256(Path(name).read_bytes()).hexdigest() for name in EXPECTED}
assert actual==EXPECTED, 'Final-byte mismatch: '+str([n for n in EXPECTED if actual[n]!=EXPECTED[n]])
for name in ['docs.css','favicon.svg']:
 if Path(name).exists():Path(name).unlink()
preview=Path('preview/finance-notes-mab');preview.mkdir(parents=True,exist_ok=True)
for name in PUBLIC:shutil.copyfile(name,preview/name)
Path('evidence').mkdir(exist_ok=True)
Path('evidence/restoration.json').write_text(json.dumps({'source':ORIGIN,'sources':observations,'files':actual,'public_files':PUBLIC},ensure_ascii=False,indent=2))
print('Restored and verified',len(actual),'files; main remains unchanged.')
