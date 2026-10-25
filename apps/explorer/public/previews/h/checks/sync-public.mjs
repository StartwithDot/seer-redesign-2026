import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';

const source=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const root=path.resolve(source,'../../../../../');
const check=process.argv.includes('--check');
const hash=data=>createHash('sha256').update(data).digest('hex');
const jobs=[
  {from:source,to:path.join(root,'public/explorer/previews/h'),names:['index.html','app.js','app.css','icons.js','seer-shell.js','seer-shell.css','seer-subbar.css','subbar.css','assets','data']},
  {from:path.join(root,'apps/deep-h/dist'),to:path.join(root,'public/deep/previews/h')},
];
let files=0;
async function copy(from,to,destination){
  assert.ok(to.startsWith(destination+path.sep),'Destination escaped product preview');
  const stat=await fs.lstat(from);
  assert.ok(!stat.isSymbolicLink(),'Preview inputs must not be symlinks');
  if(stat.isDirectory()){
    for(const name of await fs.readdir(from))await copy(path.join(from,name),path.join(to,name),destination);
  }else{
    const bytes=await fs.readFile(from);
    if(!check){await fs.mkdir(path.dirname(to),{recursive:true});await fs.writeFile(to,bytes);}
    assert.equal(hash(await fs.readFile(to)),hash(bytes),'Deployment differs from source: '+to);
    files++;
  }
}
for(const job of jobs){
  assert.ok(job.to.startsWith(path.join(root,'public')+path.sep));
  for(const name of job.names||await fs.readdir(job.from))await copy(path.join(job.from,name),path.join(job.to,name),job.to);
}
console.log(JSON.stringify({mode:check?'verify':'copy',files,deleted:0,landingChanged:false}));
