"""Make review sheets from actual captures; individual originals remain unchanged."""
from pathlib import Path
import json
from PIL import Image, ImageOps, ImageDraw
root=Path(__file__).resolve().parents[1]
out=root/'after'/'review-sheets';out.mkdir(exist_ok=True)
groups={'baseline':sorted((root/'baseline').glob('*.png')),'alignment':sorted((root/'after').glob('*.png'))}
for theme in ('dark','light'):
 for width in (1440,390):groups[f'{theme}-{width}']=sorted((root/'after'/'states').glob(f'{theme}-{width}-*.png'))
manifest=[]
for group,files in groups.items():
 for offset in range(0,len(files),6):
  batch=files[offset:offset+6];tilew=720 if '1440' in group or group in ('baseline','alignment') else 390
  tileh=500 if tilew==720 else 876
  sheet=Image.new('RGB',(tilew*3,tileh*2),'#dedee2');draw=ImageDraw.Draw(sheet)
  for i,path in enumerate(batch):
   im=Image.open(path).convert('RGB');im.thumbnail((tilew,tileh-30))
   x=(i%3)*tilew;y=(i//3)*tileh;sheet.paste(im,(x,y+30));draw.text((x+6,y+7),path.name,fill='#17171c')
  dest=out/f'{group}-{offset//6+1:02}.jpg';sheet.save(dest,quality=93)
  manifest.append({'sheet':str(dest),'screenshots':[str(p) for p in batch]})
(out/'manifest.json').write_text(json.dumps(manifest,indent=2))
print(json.dumps({'sheets':len(manifest),'screenshots':sum(len(x['screenshots']) for x in manifest)}))
