import { readFileSync, writeFileSync, mkdirSync, rmSync, copyFileSync, existsSync } from 'node:fs';
import { dirname, resolve, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const out=join(root,'dist');
const sourceFiles=['index.html','styles.css','content.js','app.js','math.js','favicon.svg','.nojekyll','AGENTS.md','README.md'];
function escape(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function inline(s){let result=escape(s);result=result.replace(/`([^`]+)`/g,(_,v)=>`<code>${v}</code>`);result=result.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');result=result.replace(/\[([^\]]+)\]\((https:\/\/[^)]+)\)/g,(_,label,url)=>`<a href="${escape(url)}" target="_blank" rel="noopener noreferrer">${label}</a>`);return result;}
function markdownToHtml(md){
 const lines=md.replace(/^\uFEFF/,'').replace(/\r/g,'').split('\n');
 let h='',list=false,table=false,tableRows=[];
 function closeList(){if(list){h+='</ul>\n';list=false;}}
 function closeTable(){if(table){h+='<div class="md-table-scroll"><table><thead><tr>'+tableRows[0].map(c=>`<th>${inline(c)}</th>`).join('')+'</tr></thead><tbody>'+tableRows.slice(2).map(row=>'<tr>'+row.map(c=>`<td>${inline(c)}</td>`).join('')+'</tr>').join('')+'</tbody></table></div>\n';table=false;tableRows=[];}}
 for(const line of lines){
  if(/^\s*\|.+\|\s*$/.test(line)){closeList();table=true;tableRows.push(line.trim().slice(1,-1).split('|').map(x=>x.trim()));continue;}closeTable();
  if(/^\s*[-*] /.test(line)){if(!list){h+='<ul>\n';list=true;}h+='<li>'+inline(line.replace(/^\s*[-*] /,''))+'</li>\n';continue;}closeList();
  if(/^#{1,4} /.test(line)){const match=line.match(/^(#{1,4}) (.*)$/);const depth=match[1].length;const id=match[2].toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu,'').trim().replace(/\s+/g,'-');h+=`<h${depth} id="${escape(id)}">${inline(match[2])}</h${depth}>\n`;continue;}
  if(line.trim()){const item=line.trim();if(/^\d+\. /.test(item)){h+='<p>'+inline(item)+'</p>\n';}else h+='<p>'+inline(item)+'</p>\n';}
 }
 closeTable();closeList();return h;
}
function docPage(md,title){return `<!doctype html><html lang="zh-Hant-TW"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="金融概念小教室的公開專案文件"><title>${escape(title)}｜金融概念小教室</title><link rel="icon" href="favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="styles.css"><link rel="stylesheet" href="docs.css"></head><body><a class="skip-link" href="#doc-main">跳到主要內容</a><header class="site-header"><div class="shell header-inner"><a class="brand" href="index.html#home"><span class="brand-icon" aria-hidden="true">▤</span><span class="brand-words"><strong>金融概念小教室</strong><small>FINANCE NOTES</small></span></a><nav class="main-nav" aria-label="文件導覽"><a href="index.html#notebook">概念筆記</a><a href="agents.html">專案規則</a><a href="readme.html">專案介紹</a></nav></div></header><main id="doc-main" class="doc-main shell"><a class="back-link" href="index.html#about">← 返回關於專案</a><div class="doc-label">PROJECT DOCUMENTATION · UTF-8</div><article class="markdown-body">${markdownToHtml(md)}</article><div class="doc-bottom"><a href="AGENTS.md" download>下載 AGENTS.md</a><a href="README.md" download>下載 README.md</a></div></main><footer class="footer"><div class="shell footer-inner"><span>金融概念小教室 ／ FINANCE NOTES</span><span>2026 · 作者 林泓基</span></div></footer></body></html>`;}
function writeDocuments(dir){
 writeFileSync(join(dir,'agents.html'),docPage(readFileSync(join(root,'AGENTS.md'),'utf8'),'專案規則'),'utf8');
 writeFileSync(join(dir,'readme.html'),docPage(readFileSync(join(root,'README.md'),'utf8'),'專案介紹'),'utf8');
}
writeDocuments(root);
rmSync(out,{recursive:true,force:true});mkdirSync(out,{recursive:true});
for(const name of [...sourceFiles,'agents.html','readme.html','docs.css']){const src=join(root,name);if(!existsSync(src))throw Error('缺少必要檔案：'+name);copyFileSync(src,join(out,basename(name)));}
console.log('Built '+out+' ('+(sourceFiles.length+3)+' files)');
