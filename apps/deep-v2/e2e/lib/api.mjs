import { readFile } from 'node:fs/promises';
const real = new URL('../../src/data/real/',import.meta.url);
const json = async name => JSON.parse(await readFile(new URL(name,real),'utf8'));
export const fixtures = {
  rows: await json('rows.json'), charts: await json('get-market-charts.json'),
  markets: await json('markets-data.json'), volumes: await json('refresh-market-volume.json'),
  leaderboard: Object.fromEntries(await Promise.all(['all','1d','1w','1m'].map(async p=>[p,await json(`leaderboard-${p}.json`)]))),
};
export const counts = {all:76,'1d':29,'1w':34,'1m':45};
export async function installAPI(page, base) {
  const calls = {}, overrides = new Map();
  // Fixtures are byte-faithful real captures. Imported/bundled fixture data needs no invented endpoint.
  // Stub only matching API requests; an uncalled endpoint is reported, never claimed as exercised.
  const endpoints = {
    'get-market-charts': fixtures.charts,
    'refresh-market-volume': fixtures.volumes,
    ...Object.fromEntries(Object.entries(fixtures.leaderboard).map(([p,d])=>[`leaderboard-${p}`,d])),
  };
  await page.context().route('**/*',async route=>{
    const u=new URL(route.request().url());
    if(u.origin!==new URL(base).origin && !['data:','blob:','about:'].includes(u.protocol)) {
      // Fulfill external popup destinations without reaching third parties.
      return route.fulfill({status:200,contentType:'text/html',body:'<!doctype html><title>External link test</title>'});
    }
    const key=Object.keys(endpoints).find(k=>u.pathname.includes(k)&&!u.pathname.endsWith('.js'));
    if(!key)return route.continue();
    calls[key]=(calls[key]||0)+1;
    const override=overrides.get(key);
    if(override?.delay)await new Promise(resolve=>setTimeout(resolve,override.delay));
    return route.fulfill({status:override?.status??200,contentType:'application/json',body:JSON.stringify(override?.data??endpoints[key])});
  });
  return {calls, set:(key,value)=>overrides.set(key,value)};
}
