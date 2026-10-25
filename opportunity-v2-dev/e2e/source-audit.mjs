import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
export async function auditSource(root){
  const files=[];async function walk(dir){for(const entry of await readdir(dir,{withFileTypes:true})){const path=dir+'/'+entry.name;if(entry.isDirectory())await walk(path);else if(/\.(css|tsx?|html)$/.test(path))files.push(path);}}await walk(root+'src');
  const allowed=new Set(['101013','1a1a1e','1f1f24','ededf2','a8a8b3','67676f','7b3aff','241e33','9c6ff2','4a2f99','cdb8ff','3ddc97','ff5c72','ffffff','f7f7f9','f0f0f3','17171c','5c5c66','8e8e99','efe9fc','6c2bd9','12915f','d1334a']);
  const findings=[];for(const file of files){const source=(await readFile(file,'utf8')).replace(/\/\*[\s\S]*?\*\//g,'');
   for(const match of source.matchAll(/#[\da-f]{3,8}\b/gi)){if(!file.endsWith('/tokens.css'))findings.push(`${file}: raw colour ${match[0]}`);else if(!allowed.has(match[0].slice(1).toLowerCase()))findings.push(`${file}: non-EF colour ${match[0]}`);}
   for(const match of source.matchAll(/rgba?\(([\d., ]+)\)/g)){const channels=match[1].split(',').slice(0,3).map(Number);const hex=channels.map(v=>v.toString(16).padStart(2,'0')).join('');if(!file.endsWith('/tokens.css')||!allowed.has(hex))findings.push(`${file}: non-token colour ${match[0]}`);}
   if(file.endsWith('.css'))for(const match of source.matchAll(/(?:^|[;{])\s*((?:padding|margin)(?:-(?:inline|block|top|bottom|left|right))?|(?:row-|column-)?gap)\s*:\s*([^;}]+)/g)){
    for(const px of match[2].matchAll(/(-?\d+(?:\.\d+)?)px/g))if(Number(px[1])%4!==0)findings.push(`${file}: ${match[1]} ${match[2]} off 4px scale`);
    if(/(?:clamp|min|max)\([^)]*(?:vw|vh)/.test(match[2]))findings.push(`${file}: fluid spacing ${match[1]} ${match[2]}`);
   }
  }assert.deepEqual(findings,[]);
}
