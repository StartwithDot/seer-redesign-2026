import {Icon} from './Icon';
import { envelope } from '../data/envelope';
import { START, END } from '../data/series';
export function ReplayStrip({t,playing,togglePlay,scrub}:{t:number;playing:boolean;togglePlay:()=>void;scrub:(t:number)=>void}){
  const x=(t:number)=>(t-START)/(END-START)*1000,y=(v:number)=>64-(v-.5)/.45*60;
  const band=`M${envelope.map(p=>`${x(p.t)},${y(p.p90)}`).join(' L')} L${[...envelope].reverse().map(p=>`${x(p.t)},${y(p.p10)}`).join(' L')} Z`;
  return <div className="replay-strip"><button className="primary" onClick={togglePlay} aria-label={playing?'Pause replay':'Play replay'}><Icon name={playing?'pause':'play'}/></button><div className="replay-track"><svg viewBox="0 0 1000 72" preserveAspectRatio="none" aria-hidden="true"><path className="envelope-band" d={band}/><path className="envelope-median" d={`M${envelope.map(p=>`${x(p.t)},${y(p.p50)}`).join(' L')}`}/><path className="replay-now" d={`M${x(t)},0 V72`}/></svg><input type="range" min={START} max={END} step={1800} value={t} aria-label="Replay date" aria-valuetext={new Date(t*1000).toUTCString()} onChange={e=>scrub(Number(e.target.value))}/><div className="replay-dates">{[2,4,6,8,10,12,14,16,18].map(d=><span key={d}>Oct {d}</span>)}</div></div></div>;
}
