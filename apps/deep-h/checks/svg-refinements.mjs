import {readFileSync,writeFileSync} from 'node:fs';
const root=new URL('../src/',import.meta.url);
function edit(file,changes){const path=new URL(file,root);let s=readFileSync(path,'utf8');for(const [a,b] of changes){if(!s.includes(a))throw Error(file+': '+a.slice(0,70));s=s.replaceAll(a,b);}writeFileSync(path,s);}
edit('components/Leaderboard.tsx',[
 ["import {Icon} from './Icon';", "import {Icon} from './Icon';\nimport {useSVGText} from '../useSVGText';"],
 [" const [view,setView]", " const mapText=useSVGText(960,560);\n const [view,setView]"],
 ['<svg viewBox="0 0 960 560" role="img"', '<svg ref={mapText.ref} style={{fontSize:mapText.size}} data-compact={mapText.size>24} viewBox="0 0 960 560" role="img"'],
 ['[-10000,-1000,-100,-10,-1,0,1,10,100,1000,10000].map(v=><g key={v}>', '[-10000,-1000,-100,-10,-1,0,1,10,100,1000,10000].map(v=><g className="axis-tick" data-axis="y" data-value={v} key={v}>'],
 ['[.01,.1,1,10,100,1000,10000].map(v=><g key={v}>', '[.01,.1,10,100,1000,10000].map(v=><g className="axis-tick" data-axis="x" data-value={v} key={v}>'],
 ['className="wallet-label" pointerEvents="none"', 'className={`wallet-label wallet-label-${i}`} pointerEvents="none"'],
]);
edit('components/Detail.tsx',[
 ['<text x="820" y="332">Oct 18, 2026', '<text x="920" y="332" textAnchor="end">Oct 18, 2026'],
]);
edit('components/ContestMarket.tsx',[
 ['<div><small>{yes?\'ZCASH · Q3 2026\':contest.name.toUpperCase()}</small><h2>{yes?\'Approval odds over time\':pair?\'Share of original work over time\':\'Market prices\'}</h2></div>', '<div><h2>{yes?\'Approval odds over time\':pair?\'Share of original work over time\':\'Market prices\'}</h2><p className="archive-context">{yes?\'ZCASH · Q3 2026\':contest.name}</p></div>'],
 ['<text x="940" y={y(v)}>', '<text x="985" y={y(v)} textAnchor="end">'],
 ['<text x="820" y="480">', '<text x="928" y="480" textAnchor="end">'],
]);
console.log('Responsive SVG labels and archive metadata refined');
