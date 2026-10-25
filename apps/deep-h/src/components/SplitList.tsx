import {useState} from 'react';
import {Menu} from './Menu';
import {markets,signed} from '../data/markets';
import type {Market} from '../data/types';
import {series} from '../data/series';
import {updateQuery} from '../router';
export function SplitList({rows,params,predictions,select}:{rows:Market[];params:URLSearchParams;predictions:Record<string,number>;select:(m:Market)=>void}){
 const [positions,setPositions]=useState(false),[help,setHelp]=useState(''),[identity,setIdentity]=useState('');
 const q=params.get('q')??'',sort=params.get('sort')??'up';
 const filtered=rows.filter(m=>m.name.toLowerCase().includes(q.toLowerCase())).sort((a,b)=>sort==='name'?a.name.localeCompare(b.name):sort==='-name'?b.name.localeCompare(a.name):sort==='diff'?Math.abs((predictions[b.id]??b.up)-b.up)-Math.abs((predictions[a.id]??a.up)-a.up):sort==='change'?(b.up-series[b.id].up[0].value)-(a.up-series[a.id].up[0].value):b.up-a.up);
 return <section data-testid="split-table" className={`repository-box ${positions?'positions-view':''}`}>
  <div className="list-tools"><b>Repositories <small>{filtered.length}</small></b>
   <input data-testid="search-outcomes" aria-label="Search outcomes" placeholder="Search outcomes" value={q} onChange={e=>updateQuery({q:e.target.value||null},true)}/>
   <Menu testId="positions-menu" label={positions?'Positions':'Market'}>{close=><>{['Market','Positions'].map(v=><button role="menuitem" aria-checked={positions===(v==='Positions')} key={v} onClick={()=>{setPositions(v==='Positions');close();}}>{v}</button>)}</>}</Menu>
   <Menu label="Sort">{close=><>{[['up','UP ↓'],['name','Repository A–Z'],['-name','Repository Z–A'],['change','Change'],['diff','Difference']].map(([value,label])=><button role="menuitem" aria-checked={sort===value} key={value} onClick={()=>{updateQuery({sort:value});close();}}>{label}</button>)}</>}</Menu>
  </div>
  {help&&<div data-testid="help-popover" className="position-help" role="status">{help}<button onClick={()=>setHelp('')}>Close</button></div>}
  <div className="repository-grid">
   <div className="list-columns"><span>#</span><button data-testid="sort-name" aria-sort={sort==='name'?'ascending':sort==='-name'?'descending':'none'} onClick={()=>updateQuery({sort:sort==='name'?'-name':'name'})}>Repository</button><span>{positions?'Predicted':'UP · gap · DOWN'}</span><button data-testid="sort-market" disabled={sort==='up'} title={sort==='up'?'Already sorted by UP price':undefined} aria-sort={sort==='up'?'descending':'none'} onClick={()=>updateQuery({sort:'up'})}>UP ↓</button>
    {positions?<><button data-testid="help-up" aria-label="UP ?" onClick={()=>setHelp('UP difference = predicted − UP market price')}>Δ UP ?</button><button data-testid="help-down" onClick={()=>setHelp('DOWN difference = 1 − predicted − DOWN market price')}>DOWN ?</button><button data-testid="sort-difference" disabled={sort==='diff'} title={sort==='diff'?'Already sorted by difference':undefined} onClick={()=>updateQuery({sort:'diff'})}>Difference ↓</button></>:<button disabled={sort==='change'} title={sort==='change'?'Already sorted by change':undefined} onClick={()=>updateQuery({sort:'change'})}>Δ Oct 1</button>}
   </div>
   <div data-testid="split-table-scroll" className="repository-scroll" onMouseLeave={()=>updateQuery({iso:null},true)}>
    {filtered.map(m=><button data-testid="split-row" data-repo={m.name} data-id={m.id} data-hatch={m.residual<0?'over':'gap'} aria-label={`${m.name}, UP ${m.up.toFixed(4)}, DOWN ${m.down.toFixed(4)}`} aria-description={`Independent prices. ${m.residual<0?'Overlap':'Unpriced gap'} ${Math.abs(m.residual).toFixed(4)}. Click for Repository desk, Enter for full detail.`} className="repository-row" key={m.id}
     onDoubleClick={()=>{location.hash=`#/repo/${m.name}`;}}
     onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();location.hash=`#/repo/${m.name}`;}if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();const next=e.key==='ArrowDown'?e.currentTarget.nextElementSibling:e.currentTarget.previousElementSibling;(next as HTMLElement|null)?.focus();}}}
     onMouseEnter={()=>updateQuery({iso:m.id},true)} onFocus={()=>{updateQuery({iso:m.id},true);setIdentity(m.name);}} onBlur={()=>setIdentity('')} onClick={()=>select(m)}>
     <span>{markets.findIndex(r=>r.id===m.id)+1}</span><span data-testid="col-repository" data-col="repository" className="repository-name" title={m.name}><span>{m.owner}/</span>{m.repo}</span>
     {positions?<span data-testid="col-predicted" data-col="predicted">{predictions[m.id]?.toFixed(4)??'—'}</span>:<span className="bar" aria-hidden="true"><i className="up" style={{width:`${m.up*100}%`}}/><i className="down" style={{width:`${m.down*100}%`}}/><i className={m.residual<0?'over hatch':'gap hatch'} style={{left:`${Math.min(m.up,1-m.down)*100}%`,width:`${Math.abs(m.residual)*100}%`}}/></span>}
     <span data-testid="up-market" data-col="up">{m.up.toFixed(4)}</span>
     {positions?<><span data-testid="up-diff">{predictions[m.id]===undefined?'—':(predictions[m.id]-m.up).toFixed(4)}</span><span data-testid="down-market">{m.down.toFixed(4)}</span><span data-testid="down-diff">{predictions[m.id]===undefined?'—':(1-predictions[m.id]-m.down).toFixed(4)}</span></>:<span className={m.up<series[m.id].up[0].value?'loss':'gain'}>{signed(m.up-series[m.id].up[0].value).slice(0,-1)}</span>}
    </button>)}
    {!filtered.length&&<div className="empty"><span>No repositories match</span><button onClick={()=>updateQuery({q:null})}>Clear search</button></div>}
   </div>
  </div>
  <div className="identity-reveal" aria-live="polite">{identity}</div>
 </section>;
}
