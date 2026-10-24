import {readFileSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const base=new URL('../src/',import.meta.url);
function edit(file,changes){const path=fileURLToPath(new URL(file,base));let text=readFileSync(path,'utf8');for(const [from,to] of changes){if(!text.includes(from))throw Error(`Missing edit in ${file}: ${from.slice(0,70)}`);text=text.replaceAll(from,to);}writeFileSync(path,text);}
edit('components/TimeFigure.tsx',[
 ["import { updateQuery }", "import {useThemePaint} from '../useThemePaint';\nimport {Icon} from './Icon';\nimport { updateQuery }"],
 ["  const [mode,setMode]", "  const theme=useThemePaint();\n  const [mode,setMode]"],
 ["const w = el.parentElement!.clientWidth; const h = Math.max(1,el.parentElement!.clientHeight);", "const w = el.clientWidth; const h = Math.max(1,el.clientHeight);"],
 ["c.strokeStyle=color('--line');", "c.strokeStyle=color('--plot-rule');"],
 ["c.fillStyle=color('--series-up');c.beginPath();band", "c.fillStyle=color('--median');c.beginPath();band"],
 ["c.strokeStyle=color('--series-down');c.globalAlpha=.12", "c.strokeStyle=color('--series-line');c.globalAlpha=.16"],
 ["color('--series-line'):color('--series-down')", "color('--series-line'):color(mode==='up'?'--series-up':'--series-down')"],
 ["c.strokeStyle=color('--series-up');c.lineWidth=1.5", "c.strokeStyle=color('--median');c.lineWidth=1.75"],
 ["12,24);", "12,36);"],
 ["},[t,hidden,q,iso,cursor,mode,range,full,expanded,showAll]);", "},[t,hidden,q,iso,cursor,mode,range,full,expanded,showAll,theme]);"],
 ["iso?valueAt(series[iso][mode],cursor)", "iso&&series[iso]?valueAt(series[iso][mode],cursor)"],
 ["<button onClick={replay}>{playing?'■ Stop':'▶ Replay'}</button>", "<button aria-label={playing?'■ Stop':'▶ Replay'} onClick={replay}><Icon name={playing?'pause':'play'} size={16}/>{playing?'Stop':'Replay'}</button>"],
 ['aria-label="Repository UP step lines, top 10 by default; arrow keys move one trade"', 'aria-label={`Repository ${mode.toUpperCase()} step lines, top 10 by default; arrow keys move one trade`}'],
 ["${iso?'UP':'median'}", "${iso?mode.toUpperCase():'median'}"],
 ["left:Math.min(tip.x+14,(canvas.current?.clientWidth??600)-210)", "left:Math.max(8,Math.min(tip.x+14,(canvas.current?.clientWidth??600)-270))"],
 ["</aside>}</div></section>", "</aside>}</div><div className=\"plot-key\"><span><i/>Global median</span><span><i className=\"band-key\"/>10th–90th percentile</span><span>Price · {full?'0–1':mode==='up'?'0.55–0.95':'0–0.45'}</span></div></section>"],
]);
edit('components/Swarm.tsx',[
 ["import { Delaunay }", "import {useThemePaint} from '../useThemePaint';\nimport { Delaunay }"],
 ["  const [layer,setLayer]", "  const theme=useThemePaint();\n  const [layer,setLayer]"],
 ["const w=parent.clientWidth,h=Math.max(180,parent.clientHeight)", "const w=el.clientWidth,h=Math.max(180,el.clientHeight)"],
 ["el.width=w*dpr;el.height=h*dpr;el.style.height=`${h}px`;", "el.width=w*dpr;el.height=h*dpr;"],
 ["c.font=`${vertical?72:Math.min(210,w*.25)}px sans-serif`", "c.font=`${vertical?48:Math.min(100,w*.15)}px sans-serif`"],
 ["c.strokeStyle=color('--series-up');c.setLineDash", "c.strokeStyle=color('--median');c.setLineDash"],
 ["48,color('--series-up'))", "48,color('--median'))"],
 ["},[markets,q,iso,hidden,predictions,t,layer]);", "},[markets,q,iso,hidden,predictions,t,layer,theme]);"],
]);
edit('components/ReplayStrip.tsx',[
 ["import { envelope }", "import {Icon} from './Icon';\nimport { envelope }"],
 ["{playing?'Ⅱ':'▶'}</button>", "<Icon name={playing?'pause':'play'}/></button>"],
]);
edit('components/Masthead.tsx',[
 ["import { Menu }", "import {Icon} from './Icon';\nimport { Menu }"],
 ["label={<>Contests", "label={<><Icon name=\"contests\" size={18}/>Contests"],
 [">↻</button>", "><Icon name=\"refresh\" size={16}/></button>"],
 [">×</button>", "><Icon name=\"close\" size={14}/></button>"],
 [">Profile</button>", "><Icon name=\"profile\" size={18}/>Profile</button>"],
 [">Disconnect</button>", "><Icon name=\"logout\" size={18}/>Disconnect</button>"],
]);
edit('components/Predictions.tsx',[
 ["import { markets }", "import {Icon} from './Icon';\nimport { markets }"],
 ["{step.done?'✓':i+1}", "{step.done?<Icon name=\"check\" size={14}/>:i+1}"],
 [">Upload predictions</button>", "><Icon name=\"upload\" size={16}/>Upload predictions</button>"],
 [">Export market weights</button>", "><Icon name=\"export\" size={16}/>Export market weights</button>"],
]);
edit('components/Dialogs.tsx',[
 ["import { Menu }", "import {Icon} from './Icon';\nimport { Menu }"],
 ["aria-label=\"Close funds\">×", "aria-label=\"Close funds\"><Icon name=\"close\"/>"],
]);
edit('components/Guide.tsx',[
 ["import { markets }", "import {Icon} from './Icon';\nimport { markets }"],
 [">×</button>", "><Icon name=\"close\"/></button>"],
 ["<div className=\"guide-content\" role=\"tabpanel\">", "<div className=\"guide-content\" role=\"tabpanel\">{tab==='Trade'&&<p className=\"guide-note\">This build simulates funding and execution locally. The documentation below describes the full workflow; starting-amount and rebalancing controls are not implemented here.</p>}"],
 ["<small>UP {m.up.toFixed(4)}", "<small>UP {m.up.toFixed(4)}"],
 ["<div className=\"bar\"><i", "<div className=\"bar\" aria-label={`UP ${m.up.toFixed(4)}, DOWN ${m.down.toFixed(4)}, residual ${m.residual.toFixed(4)}`}><i"],
 ["/></div><small>UP", "/><i className={m.residual<0?'over hatch':'gap hatch'} style={{left:`${Math.min(m.up,1-m.down)*100}%`,width:`${Math.abs(m.residual)*100}%`}}/></div><small>UP"],
]);
edit('components/RankedTable.tsx',[
 ["export function Identicon({address}:{address:string}){const p=profiles[address.toLowerCase()];return p?.avatarUrl?<img className=\"identicon\" src={p.avatarUrl} alt=\"\" referrerPolicy=\"no-referrer\"/>", "export function Identicon({address}:{address:string}){const p=profiles[address.toLowerCase()];const [failed,setFailed]=useState(false);return p?.avatarUrl&&!failed?<img className=\"identicon\" src={p.avatarUrl} alt=\"\" referrerPolicy=\"no-referrer\" onError={()=>setFailed(true)}/>"],
]);
edit('App.tsx',[
 ["import { Inspector }", "import {Icon,type IconName} from './components/Icon';\nimport { Inspector }"],
 ["{expanded?'Close · Esc':'⛶ Expand · F'}</button>", "<Icon name={expanded?'close':'expand'} size={16}/>{expanded?'Close · Esc':'Expand · F'}</button>"],
 ["{v[0].toUpperCase()+v.slice(1)}</button>)}</div><div className=\"desk-body\">", "<Icon name={v==='desk'?'desk':v==='repository'?'list':'wallet'} size={16}/>{v[0].toUpperCase()+v.slice(1)}</button>)}</div><div className=\"desk-body\">"],
 ["{v[0].toUpperCase()+v.slice(1)}</button>)}</nav>", "<Icon name={v as IconName} size={18}/>{v[0].toUpperCase()+v.slice(1)}</button>)}</nav>"],
]);
console.log('Applied component refinements with exact source matching');
