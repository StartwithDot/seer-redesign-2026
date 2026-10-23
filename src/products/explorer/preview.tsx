import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource-variable/inter-tight';


const root = ReactDOM.createRoot(document.getElementById('root')!);
// Keep import failures visible: a React boundary cannot catch a failed module load.
void import('./index').then(({ Page }) => {
  root.render(<React.StrictMode><Page /></React.StrictMode>);
}).catch(() => {
  root.render(<main role="alert" style={{ padding: '48px', color: '#ededf2', background: '#0e0e12', minHeight: '100vh', fontFamily: 'sans-serif' }}><h1>Explorer could not load</h1><p>The application files are unavailable. Reload to try again.</p><button onClick={() => window.location.reload()}>Reload Explorer</button></main>);
});
