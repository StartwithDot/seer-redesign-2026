import { useId } from 'react';

/** Optical studies, deliberately abstract rather than simulated product data. */
export function GlassGeometry({ kind }: { kind: number }) {
  const id = useId().replace(/:/g, '');
  const glass = `url(#${id}-glass)`;
  const edge = `url(#${id}-edge)`;
  const rim = `url(#${id}-rim)`;
  return <svg viewBox="48 48 544 544" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id={`${id}-glass`} x1="12%" y1="4%" x2="88%" y2="96%">
        <stop stopColor="white" stopOpacity=".99"/><stop offset=".07" stopColor="#f5f3f8" stopOpacity=".34"/>
        <stop offset=".31" stopColor="currentColor" stopOpacity=".045"/><stop offset=".455" stopColor="#4a4255" stopOpacity=".39"/>
        <stop offset=".482" stopColor="white" stopOpacity=".99"/><stop offset=".505" stopColor="white" stopOpacity=".025"/>
        <stop offset=".78" stopColor="currentColor" stopOpacity=".085"/><stop offset=".93" stopColor="#31283c" stopOpacity=".56"/><stop offset="1" stopColor="white" stopOpacity=".94"/>
      </linearGradient>
      <linearGradient id={`${id}-edge`} x1="4%" y1="0%" x2="76%" y2="100%"><stop stopColor="white"/><stop offset=".2" stopColor="#aaa3b9" stopOpacity=".75"/><stop offset=".455" stopColor="#241d31" stopOpacity=".92"/><stop offset=".478" stopColor="white"/><stop offset=".68" stopColor="white"/><stop offset="1" stopColor="#241d31" stopOpacity=".86"/></linearGradient>
      <linearGradient id={`${id}-rim`} x1="0%" y1="0%" x2="100%" y2="100%"><stop stopColor="white"/><stop offset=".14" stopColor="#e4e1ea" stopOpacity=".58"/><stop offset=".44" stopColor="#2b2338" stopOpacity=".34"/><stop offset=".66" stopColor="white"/><stop offset="1" stopColor="currentColor" stopOpacity=".24"/></linearGradient>
      <filter id={`${id}-shadow`} x="-60%" y="-60%" width="220%" height="240%"><feDropShadow dx="0" dy="54" stdDeviation="36" floodColor="#242034" floodOpacity=".1"/><feDropShadow dx="0" dy="18" stdDeviation="10" floodColor="#242034" floodOpacity=".16"/><feDropShadow dx="0" dy="3" stdDeviation="1.3" floodColor="#242034" floodOpacity=".36"/></filter>
    </defs>
    <ellipse cx="340" cy="526" rx="154" ry="12" fill="#242034" opacity=".13" filter={`url(#${id}-shadow)`}/>
    <g fill={glass} stroke={edge} strokeWidth="2" filter={`url(#${id}-shadow)`}>
      {kind === 0 && <g transform="translate(320 310) rotate(-28)">
        {[0,1,2].map(i => <g key={i} transform={`translate(${i*12} ${i*38-65})`}><ellipse cy="4" rx={215-i*35} ry={134-i*19} fill="none" stroke="#30273e" strokeOpacity=".18" strokeWidth="28"/><ellipse rx={215-i*35} ry={134-i*19} fill="none" stroke={rim} strokeWidth="23"/><ellipse cy="-3" rx={215-i*35} ry={134-i*19} fill="none" stroke={edge} strokeWidth="1.7"/></g>)}
        <ellipse cx="25" cy="35" rx="80" ry="112"/><ellipse cx="25" cy="35" rx="76" ry="108" fill="none" stroke={edge} strokeWidth=".8"/><path d="M-18-61C-62-16-51 64-12 107" fill="none" stroke="white" strokeOpacity=".8" strokeWidth="2"/>
      </g>}
      {kind === 1 && <g transform="translate(0 12)"><path d="M132 320C280 320 251 130 505 158L505 197C292 173 299 348 132 356Z"/><path d="M132 320C280 320 251 510 505 482L505 443C292 467 299 292 132 284Z"/><ellipse cx="176" cy="320" rx="74" ry="116" transform="rotate(-20 176 320)"/><path d="M129 242Q100 320 145 397" fill="none" stroke="white" strokeWidth="4"/><path d="M319 227Q389 164 486 174M319 413Q389 476 486 466" fill="none" stroke="white" strokeOpacity=".8"/></g>}
      {kind === 2 && <g transform="translate(320 315) rotate(-24)">{[0,1,2,3].map(i => <g key={i} transform={`rotate(${i*37})`}><ellipse cy="3" rx={215-i*24} ry={105-i*12} fill="none" stroke="#30273e" strokeWidth="24" strokeOpacity=".17"/><ellipse rx={215-i*24} ry={105-i*12} fill="none" stroke={rim} strokeWidth="18"/><ellipse cy="-2" rx={215-i*24} ry={105-i*12} fill="none" stroke={edge} strokeWidth="1.7"/></g>)}<ellipse rx="62" ry="80"/></g>}
      {kind === 3 && <g>{[0,1,2,3,4].map(i => { const x=95+i*74,y=400-i*49; return <g key={i} className={i===3?'s26-glass-lit':undefined}><path d={`M${x} ${y}l96-48 80 39-96 48Z`}/><path d={`M${x} ${y}v19l80 40v-19Zm80 40 96-48v19l-96 48Z`} fill={glass}/><path d={`M${x+8} ${y-1}l87-43 64 31`} fill="none" stroke="white" strokeWidth="3"/></g>; })}</g>}
      {kind === 4 && <g transform="translate(320 350)">{Array.from({length:11},(_,i) => <g key={i} transform={`rotate(${i*16-80})`}><path d="M-19-220Q0-225 19-220L15-143Q0-148-15-143Z"/><path d="M-19-220v13M19-220v13" fill="none" stroke="white" strokeWidth="3"/><path d="M0-247v-12" stroke="currentColor" strokeOpacity=".5"/></g>)}<path d="M-13 4 66-144 13 12Z"/><ellipse rx="30" ry="24"/><path d="M-147 70H147" stroke="currentColor" strokeOpacity=".2"/></g>}
    </g>
  </svg>;
}
