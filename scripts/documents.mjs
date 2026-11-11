import {readFileSync, writeFileSync} from 'node:fs';
import {dirname, resolve, join} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const inline=s=>escape(s).replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
export function renderMarkdown(text){
 const lines=text.replace(/^\uFEFF/,'').replace(/\r/g,'').split('\n');
 const body=[],toc=[]; let title='',section='',n=0;
 for(let i=0;i<lines.length;){
  const line=lines[i];
  if(!line.trim()){i++;continue;}
  if(/^# /.test(line)){if(title)throw Error('Repeated document title');title=line.slice(2);i++;continue;}
  if(/^## /.test(line)){section=line.slice(3);const id='section-'+(++n);body.push(`<h2 id="${id}">${inline(section)}</h2>`);toc.push(`<li><a href="#${id}">${inline(section)}</a></li>`);i++;continue;}
  if(/^### /.test(line)){body.push(`<h3>${inline(line.slice(4))}</h3>`);i++;continue;}
  if(/^\|/.test(line)){
   const rows=[];while(i<lines.length&&/^\|/.test(lines[i]))rows.push(lines[i++].trim().slice(1,-1).split('|').map(x=>x.trim()));
   if(rows.length<2||!rows[1].every(x=>/^:?-+:?$/.test(x))||rows.some(x=>x.length!==rows[0].length))throw Error('Invalid Markdown table');
   body.push(`<div class="table-wrap document-table" role="region" aria-label="${escape(section)}表格" tabindex="0"><table><thead><tr>${rows[0].map(x=>`<th scope="col">${inline(x)}</th>`).join('')}</tr></thead><tbody>${rows.slice(2).map(row=>`<tr>${row.map(x=>`<td>${inline(x)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);
   body.push('<p class="document-table-hint">窄螢幕可在表格內左右滑動。</p>');continue;
  }
  const list=/^(- |\d+\. )/.exec(line);
  if(list){const ordered=/^\d/.test(line),tag=ordered?'ol':'ul',pattern=ordered?/^\d+\. /:/^- /,items=[];
   while(i<lines.length&&pattern.test(lines[i]))items.push(`<li>${inline(lines[i++].replace(pattern,''))}</li>`);
   body.push(`<${tag}>${items.join('')}</${tag}>`);continue;
  }
  if(/^\s*(#|```|>|\*)/.test(line))throw Error('Unsupported Markdown block');
  const paragraph=[];while(i<lines.length&&lines[i].trim()&&!/^(#|\||- |\d+\. )/.test(lines[i]))paragraph.push(lines[i++].trim());
  body.push(`<p>${inline(paragraph.join(' '))}</p>`);
 }
 if(!title||!toc.length)throw Error('Document needs a title and sections');
 return {title,body:body.join('\n'),toc:toc.join('')};
}
const specs=[
 {md:'AGENTS.md',html:'agents.html',title:'專案規則',eyebrow:'PROJECT RULES',description:'固定內容格式與開發方式，讓每一篇新筆記都有一致的品質。'},
 {md:'README.md',html:'readme.html',title:'專案介紹',eyebrow:'ABOUT THE NOTEBOOK',description:'從金融觀念到網站結構，看看這本筆記如何持續增加內容。'}
];
export function generatedDocuments(){
 const template=readFileSync(join(root,'scripts/document-template.html'),'utf8');
 return specs.map(spec=>{
  const parsed=renderMarkdown(readFileSync(join(root,spec.md),'utf8'));
  const values={TITLE:escape(spec.title),H1:inline(parsed.title),EYEBROW:spec.eyebrow,DESCRIPTION:escape(spec.description),MARKDOWN:spec.md,BODY:parsed.body,TOC:parsed.toc,AGENTS_CURRENT:spec.html==='agents.html'?' aria-current="page"':'',README_CURRENT:spec.html==='readme.html'?' aria-current="page"':''};
  const html=template.replace(/\{\{([A-Z_]+)\}\}/g,(_,key)=>{if(!(key in values))throw Error('Unknown template token '+key);return values[key];});
  return {...spec,content:html};
 });
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const check=process.argv.includes('--check');
 for(const item of generatedDocuments()){
  if(check){if(readFileSync(join(root,item.html),'utf8')!==item.content)throw Error(item.html+' is out of sync');}
  else writeFileSync(join(root,item.html),item.content,'utf8');
 }
 console.log(check?'Document synchronization verified.':'Document reading pages updated with the approved template.');
}
