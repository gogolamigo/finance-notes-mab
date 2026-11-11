import {readFileSync, copyFileSync, mkdirSync, rmSync, realpathSync, existsSync, lstatSync} from 'node:fs';
import {dirname,resolve,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {generatedDocuments} from './documents.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const out=join(root,'dist');
export const publicFiles=['index.html','styles.css','content.js','math.js','app.js','AGENTS.md','README.md','agents.html','readme.html','.nojekyll'];
for(const item of generatedDocuments())if(readFileSync(join(root,item.html),'utf8')!==item.content)throw Error(item.html+' is out of sync; run node scripts/documents.mjs');
for(const name of publicFiles)if(realpathSync(join(root,name))!==join(root,name))throw Error('Unexpected source link: '+name);
if(existsSync(out)&&lstatSync(out).isSymbolicLink())throw Error('dist must not be a link');
rmSync(out,{recursive:true,force:true});mkdirSync(out);
for(const name of publicFiles){copyFileSync(join(root,name),join(out,name));if(!readFileSync(join(root,name)).equals(readFileSync(join(out,name))))throw Error('Copy mismatch: '+name);}
console.log('Built and reread '+publicFiles.length+' public files; source files unchanged.');
