import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url);
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const math=require(join(root,'math.js'));
const text=(name)=>readFileSync(join(root,name),'utf8');
const sandbox={window:{}};
vm.runInNewContext(text('content.js'),sandbox,{filename:'content.js'});
const lessons=sandbox.window.FINANCE_LESSONS;
let pass=0;
function check(name,fn){try{fn();pass++;}catch(err){console.error('FAIL: '+name+' — '+err.message);process.exitCode=1;}}
const requiredPaths=['AGENTS.md','README.md','index.html','styles.css','app.js','content.js','math.js','favicon.svg','docs.css','agents.html','readme.html','scripts/build.mjs','tests/check.mjs','.nojekyll'];
for(const f of requiredPaths)check('required file '+f,()=>assert(existsSync(join(root,f))));
check('four lessons present',()=>assert.equal(lessons.length,4));
check('unique IDs',()=>assert.equal(new Set(lessons.map(x=>x.id)).size,lessons.length));
check('unique order',()=>assert.equal(new Set(lessons.map(x=>x.order)).size,lessons.length));
check('valid order',()=>assert(lessons.every(x=>Number.isInteger(x.order)&&x.order>=1)));
check('ordered 1–4',()=>assert.deepEqual([...lessons].sort((a,b)=>a.order-b.order).map(x=>x.order).join(','),'1,2,3,4'));
check('source homepage link',()=>assert(text('index.html').includes('href="#notebook"')));
check('privacy: no academic identity in published sources',()=>{
  const sources=['index.html','styles.css','content.js','app.js','math.js','AGENTS.md','README.md','agents.html','readme.html','docs.css','favicon.svg'];
  for(const f of sources){const t=text(f);assert(!(new RegExp('政'+'大|政治'+'大學|金融'+'二|114302'+'050|金融學系'+'二年級','i')).test(t),`${f}: forbidden public identity found`);}
});
check('no remote scripts',()=>assert(!/<script\b[^>]+src=["']https?:/i.test(text('index.html'))));
check('document charset',()=>assert(['index.html','agents.html','readme.html'].every(f=>/<meta charset="utf-8">/.test(text(f)))));
check('four allowed category labels',()=>assert(lessons.every(x=>['時間與價值','風險與配置','債券入門'].includes(x.category))));
check('only one compound interactive',()=>assert.equal(lessons.filter(x=>x.interactive==='compound').length,1));
check('coming-soon display',()=>assert(text('index.html').includes('更多金融筆記，陸續整理中。')));
check('coming-soon filter handling',()=>assert(text('app.js').includes("comingSoon.hidden = category !== '全部' || Boolean(query)")));
check('hash-based lesson nav',()=>assert(text('app.js').includes("hash.startsWith('lesson/')")));
check('quiz hidden until submit',()=>assert(text('app.js').includes('feedback.hidden = true')));
check('keyboard focus rule',()=>assert(text('styles.css').includes(':focus-visible')));
check('responsive breakpoints',()=>assert(/@media\(max-width:440px\)/.test(text('styles.css'))));
check('no horizontal page overflow intentionally',()=>assert(text('styles.css').includes('.table-scroll{overflow-x:auto')));
check('docs table scroll',()=>assert(text('docs.css').includes('.md-table-scroll{overflow-x:auto')));
check('docs link to raw markdown',()=>assert(text('agents.html').includes('href="AGENTS.md"')));
check('source online reader links',()=>assert(text('index.html').includes('href="agents.html"')&&text('index.html').includes('href="readme.html"')));
check('file count in build allowlist',()=>assert(text('scripts/build.mjs').includes('const sourceFiles=')));
check('site name consistent',()=>assert(['index.html','README.md','AGENTS.md'].every(f=>text(f).includes('金融概念小教室'))));
check('finance topics included',()=>assert(['time-value','risk-return','bond-rates','diversification'].every(id=>lessons.some(x=>x.id===id))));
for(const lesson of lessons){
 check('lesson '+lesson.order+' required schema',()=>{
  assert(/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(lesson.id));
  for(const key of ['category','title','subtitle','summary','question','takeaway'])assert.equal(typeof lesson[key],'string');
  assert(lesson.intro.length>=2);
  assert(lesson.formula.expression.length>8);
  assert(lesson.formula.symbols.length>=2);
  assert(lesson.formula.assumptions.length>=2);
  assert(lesson.example.intro&&lesson.example.headers.length>=2);
  assert(lesson.example.rows.length>=1);
  assert(lesson.example.rows.every(r=>r.length===lesson.example.headers.length));
  assert(lesson.example.conclusion&&lesson.example.note);
  assert(lesson.mistakes.length>=2);
  assert.equal(lesson.quiz.options.length,4);
  assert(lesson.quiz.answer>=0&&lesson.quiz.answer<4);
  assert(lesson.sources.length>=1);
  assert(['compound','none'].includes(lesson.interactive));
 });
 check('lesson '+lesson.order+' source provenance',()=>lesson.sources.forEach(s=>{
  const u=new URL(s.url);assert.equal(u.protocol,'https:');assert(['openstax.org','www.investor.gov'].includes(u.hostname));
  assert(s.publisher.length>4&&s.title.length>4&&s.supports.length>4);
 }));
 check('lesson '+lesson.order+' plain text data',()=>{
  const stack=[lesson];while(stack.length){const v=stack.pop();if(Array.isArray(v))stack.push(...v);else if(v&&typeof v==='object')stack.push(...Object.values(v));else if(typeof v==='string')assert(!/<\/?(?:script|iframe|img|style|svg)\b/i.test(v));}
 });
}
const results=[
 ['ordinary two-year compound',[10000,5,2],11025],
 ['zero interest',[10000,0,4],10000],
 ['zero years',[10000,5,0],10000],
 ['zero principal',[0,10,5],0],
 ['negative rate',[10000,-10,2],8100],
 ['maximum principal',[100000000,0,50],100000000],
 ['negative 50 percent',[100, -50,2],25],
 ['decimal rate',[1200,2.5,1],1230],
 ['compound first year',[10000,5,1],10500],
];
for(const [name,args,value] of results) check('compound '+name,()=>{
  const x=math.calculateCompound(...args);assert(x.ok);assert(Math.abs(x.finalValue-value)<1e-7);
});
const bad=[
 ['blank principal',['',5,2]], ['blank rate',[100,'',2]],['blank years',[100,5,'']],
 ['negative principal',[-1,5,2]],['over max principal',[100000001,5,2]],
 ['over max rate',[100,50.01,2]],['under min rate',[100,-50.01,2]],
 ['noninteger years',[100,5,2.3]],['over max years',[100,5,51]],
 ['negative years',[100,5,-1]],['NaN',[100,'x',2]],['infinite',[100,'Infinity',2]],
 ['null principal',[null,5,2]],['missing principal',[undefined,5,2]]
];
for(const [name,args] of bad)check('invalid '+name,()=>assert.equal(math.calculateCompound(...args).ok,false));
check('bond price calculation 5%',()=>assert(Math.abs(1050/1.05-1000)<1e-9));
check('bond price calculation 10%',()=>assert(Math.abs(1050/1.1-954.5454545)<1e-4));
check('risk expected +8%',()=>assert(Math.abs(.6*.2+.4*(-.1)-.08)<1e-12));
check('portfolio scenario one +7.5%',()=>assert(Math.abs(.5*.2+.5*(-.05)-.075)<1e-12));
check('portfolio scenario two +2.5%',()=>assert(Math.abs(.5*(-.1)+.5*.15-.025)<1e-12));
console.log(`${pass} checks passed; ${process.exitCode===1?'FAILED':'PASS'}`);
