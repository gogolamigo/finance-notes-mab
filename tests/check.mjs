import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {dirname,resolve,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import {generatedDocuments,renderMarkdown,renderTemplate} from '../scripts/documents.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..'),require=createRequire(import.meta.url);
let count=0;const check=(name,fn)=>{fn();count++;console.log('PASS '+name);};
const context=vm.createContext({window:{}});vm.runInContext(readFileSync(join(root,'content.js'),'utf8'),context,{timeout:1000});
const lessons=context.window.FINANCE_LESSONS;const {compound}=require('../math.js');
check('nonempty lesson collection',()=>assert.ok(Array.isArray(lessons)&&lessons.length>0));
const ids=new Set(),orders=new Set();
const text=x=>assert.ok(typeof x==='string'&&x.trim());
for(const l of lessons){
 check(l.id+' schema',()=>{
  assert.match(l.id,/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/);assert.ok(!ids.has(l.id));ids.add(l.id);
  assert.ok(Number.isInteger(l.order)&&l.order>0&&!orders.has(l.order));orders.add(l.order);
  assert.ok(['時間與價值','風險與配置','債券入門'].includes(l.category));
  for(const k of ['title','subtitle','summary','question','takeaway'])text(l[k]);
  assert.ok(l.intro.length>=2);l.intro.forEach(text);text(l.formula.expression);
  assert.ok(l.formula.symbols.length>0);l.formula.symbols.forEach(x=>{text(x.symbol);text(x.meaning);});
  assert.ok(l.formula.assumptions.length>0);l.formula.assumptions.forEach(text);
  for(const k of ['intro','conclusion','note'])text(l.example[k]);
  assert.ok(l.example.headers.length>0&&l.example.rows.length>0);l.example.headers.forEach(text);
  l.example.rows.forEach(row=>{assert.equal(row.length,l.example.headers.length);row.forEach(text);});
  assert.ok(l.mistakes.length>=2);l.mistakes.forEach(x=>{text(x.myth);text(x.fact);});
  text(l.quiz.question);assert.equal(l.quiz.options.length,4);l.quiz.options.forEach(o=>{text(o.text);text(o.explanation);});
  assert.ok(Number.isInteger(l.quiz.answer)&&l.quiz.answer>=0&&l.quiz.answer<4);
  assert.ok(l.sources.length>0);l.sources.forEach(s=>{text(s.publisher);text(s.title);text(s.supports);assert.equal(new URL(s.url).protocol,'https:');});
  assert.ok(['compound','none'].includes(l.interactive));
 });
}
for(const [name,input,fv,interest] of [
 ['annual compound',{principal:10000,ratePercent:5,years:2},11025,1025],
 ['zero rate',{principal:10000,ratePercent:0,years:2},10000,0],
 ['zero years',{principal:10000,ratePercent:5,years:0},10000,0],
 ['zero principal',{principal:0,ratePercent:5,years:2},0,0],
 ['negative return',{principal:10000,ratePercent:-10,years:2},8100,-1900],
 ['lower rate',{principal:10000,ratePercent:-50,years:1},5000,-5000],
 ['upper rate',{principal:10000,ratePercent:50,years:1},15000,5000]
])check(name,()=>{const r=compound(input);assert.ok(Math.abs(r.futureValue-fv)<1e-8);assert.ok(Math.abs(r.interest-interest)<1e-8);});
const valid={principal:10000,ratePercent:5,years:2};
for(const key of ['principal','ratePercent','years'])for(const value of [NaN,Infinity,-Infinity,'',null,undefined,'5'])check('reject '+key+' '+String(value),()=>assert.throws(()=>compound({...valid,[key]:value})));
for(const [key,values] of [['principal',[-1,100000001]],['ratePercent',[-50.1,50.1]],['years',[-1,51,1.5]]])for(const value of values)check('range '+key+' '+value,()=>assert.throws(()=>compound({...valid,[key]:value})));
for(const input of [null,undefined,[],5])check('reject invalid object '+String(input),()=>assert.throws(()=>compound(input)));
check('upper accepted boundary',()=>assert.ok(Number.isFinite(compound({principal:100000000,ratePercent:50,years:50}).futureValue)));
for(const name of ['content.js','math.js','app.js'])check('syntax '+name,()=>new vm.Script(readFileSync(join(root,name),'utf8')));
for(const name of ['AGENTS.md','README.md'])check('UTF-8 BOM '+name,()=>{const s=readFileSync(join(root,name),'utf8');assert.ok(s.startsWith('\uFEFF')&&!s.startsWith('\uFEFF\uFEFF'));assert.ok(!s.includes('\uFFFD'));});
for(const doc of generatedDocuments())check('generated '+doc.html,()=>assert.equal(readFileSync(join(root,doc.html),'utf8'),doc.content));
check('template digit token',()=>assert.equal(renderTemplate('<h1>{{H1}}</h1>',{H1:'Title'}),'<h1>Title</h1>'));
check('template underscore token',()=>assert.equal(renderTemplate('{{CURRENT_PAGE}}',{CURRENT_PAGE:'yes'}),'yes'));
check('template unknown token stops',()=>assert.throws(()=>renderTemplate('{{UNKNOWN2}}',{})));
check('template malformed token stops',()=>assert.throws(()=>renderTemplate('{{H1}',{H1:'Title'})));
for(const [md,html] of [['AGENTS.md','agents.html'],['README.md','readme.html']])check('visible heading '+html,()=>{
 const title=/^# (.+)$/m.exec(readFileSync(join(root,md),'utf8').replace(/^\uFEFF/,''))[1];
 const output=readFileSync(join(root,html),'utf8');assert.ok(output.includes('<h1>'+title+'</h1>'));assert.ok(!/\{\{|\}\}/.test(output));
});
for(const name of ['index.html','agents.html','readme.html'])check('HTML resource graph '+name,()=>{
 const html=readFileSync(join(root,name),'utf8');assert.match(html,/<meta charset="utf-8">/);assert.ok(!html.includes('/cdn-cgi/'));
 for(const m of html.matchAll(/(?:href|src)="([^"#]+)(?:#[^"]*)?"/g)){
  if(/^https?:|^data:/.test(m[1]))continue;
  const p=resolve(root,m[1].split('#')[0]);assert.ok(p.startsWith(root+'/')&&existsSync(p),m[1]);
 }
});
check('Markdown parser escapes markup',()=>assert.ok(renderMarkdown('# Test\n\n## Section\n\n<script>alert(1)</script>').body.includes('&lt;script&gt;')));
check('Markdown parser rejects malformed table',()=>assert.throws(()=>renderMarkdown('# Test\n\n## Section\n\n|a|b|\n|---|---|\n|only one|')));
console.log(JSON.stringify({passed:count,failed:0,lessons:lessons.length}));
