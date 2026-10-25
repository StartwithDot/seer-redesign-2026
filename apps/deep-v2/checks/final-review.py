from pathlib import Path
from PIL import Image,ImageDraw
import json,hashlib
root=Path(__file__).resolve().parents[1];out=root/'after'/'review-final';out.mkdir(exist_ok=True)
groups={}
for theme in ('dark','light'):
 for width in (1440,390):groups[f'maps-{theme}-{width}']=sorted((root/'after'/'states').glob(f'{theme}-{width}-leaderboard-*-map.png'))+sorted((root/'after'/'states').glob(f'{theme}-{width}-leaderboard-*-table-map.png'))
for state in ('all-series','csv-pending'):groups[state]=sorted((root/'after'/'states').glob(f'*-{state}.png'))
manifest=[]
for name,paths in groups.items():
 paths=list(dict.fromkeys(paths))
 for offset in range(0,len(paths),6):
  batch=paths[offset:offset+6];tw=390 if '390' in name else 720;th=876 if tw==390 or name in ('all-series','csv-pending') else 500
  sheet=Image.new('RGB',(tw*3,th*2),'#dedee2');draw=ImageDraw.Draw(sheet)
  for i,p in enumerate(batch):
   im=Image.open(p).convert('RGB');im.thumbnail((tw,th-30));x=i%3*tw;y=i//3*th;sheet.paste(im,(x,y+30));draw.text((x+5,y+8),p.name,fill='#17171c')
  dest=out/f'{name}-{offset//6+1:02}.jpg';sheet.save(dest,quality=94)
  manifest.append({'sheet':str(dest),'sha256':hashlib.sha256(dest.read_bytes()).hexdigest(),'sources':[str(p) for p in batch]})
(out/'manifest.json').write_text(json.dumps(manifest,indent=2));print(json.dumps({'sheets':len(manifest),'screenshots':sum(len(x['sources']) for x in manifest)}))
