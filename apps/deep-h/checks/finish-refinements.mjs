import {readFileSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const root=new URL('../',import.meta.url);
function edit(file,changes){const p=fileURLToPath(new URL(file,root));let s=readFileSync(p,'utf8');for(const [a,b] of changes){if(!s.includes(a))throw Error(`Missing ${file}: ${a.slice(0,70)}`);s=s.replaceAll(a,b);}writeFileSync(p,s);}
edit('src/App.tsx',[
 ['const before=document.activeElement as HTMLElement|null;const chart=chartRef.current;', 'const before=document.activeElement as HTMLElement|null;const background=Array.from(document.querySelectorAll<HTMLElement>(\'#seer-global-header,.masthead,.contest-band,.desk,.repository-box,.mobile-tabs\'));background.forEach(el=>el.inert=true);const chart=chartRef.current;'],
 ["chart?.removeEventListener('keydown',trap);before?.focus();", "chart?.removeEventListener('keydown',trap);background.forEach(el=>el.inert=false);before?.focus();"],
]);
edit('src/components/Leaderboard.tsx',[
 ["import { RankedTable }", "import {Icon} from './Icon';\nimport { RankedTable }"],
 ["{following.includes(selected.address)?'★ Following':'☆ Follow'}</button>", "<Icon name=\"follow\" size={16}/>{following.includes(selected.address)?'Following':'Follow'}</button>"],
 ["{compare.includes(selected.address)?'Remove comparison':`Compare ${compare.length}/3`}</button>", "<Icon name=\"compare\" size={16}/>{compare.includes(selected.address)?'Remove comparison':`Compare ${compare.length}/3`}</button>"],
 ["{replaying?'■ Stop':'▶ Replay periods'}</button>", "<Icon name={replaying?'pause':'play'} size={16}/>{replaying?'Stop':'Replay periods'}</button>"],
]);
edit('vendor/ef/seer-shell.js',[
 ["let open = false, pinned = false, hoverBlock = false, tIn, tOut;", "let open = false, pinned = false, hoverBlock = false, hoverArmed = false, tIn, tOut;"],
 ["menu.addEventListener('pointerenter', (e) => { if (!hoverable(e) || hoverBlock) return; clearTimeout(tOut); if (!open) { clearTimeout(tIn); tIn = setTimeout(() => set(true), 90); } });", "menu.addEventListener('pointerenter', () => clearTimeout(tOut));\n  menu.addEventListener('pointermove', (e) => { if (!hoverable(e) || hoverBlock || open || hoverArmed) return; hoverArmed = true; clearTimeout(tOut); tIn = setTimeout(() => set(true), 90); });"],
 ["hoverBlock = false; clearTimeout(tIn);", "hoverBlock = false; hoverArmed = false; clearTimeout(tIn);"],
 ['stroke-width="1.5"', 'stroke-width="1.75"'],
 ['stroke-width="1.6"', 'stroke-width="1.75"'],
 ['stroke-width="1.8"', 'stroke-width="1.75"'],
]);
console.log('Completed local shell, icons and expanded focus refinements');
