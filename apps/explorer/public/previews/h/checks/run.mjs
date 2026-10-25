import {spawnSync} from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import {H} from './lib.mjs';
const results=[];for(const name of ['open-trade','scroll-panel','dropdowns','parity','alignment','contrast','perf']){const r=spawnSync(process.execPath,[path.join(H,'checks',name+'.mjs')],{cwd:H,encoding:'utf8',env:process.env});process.stdout.write(r.stdout||'');process.stderr.write(r.stderr||'');results.push({name,exit:r.status});}await fs.writeFile(path.join(H,'checks/results/SUITE_SUMMARY.json'),JSON.stringify(results,null,2));if(results.some(r=>r.exit!==0))process.exitCode=1;
