"""Rebuild monochrome review PDFs: pip install reportlab svglib; Node.js required."""
import io,json,pathlib,re,subprocess,gzip
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A3,landscape
from reportlab.graphics import renderPDF
from svglib.svglib import svg2rlg
P=pathlib.Path(__file__).resolve().parent
OUT=P.parent/'dist/planning/pdfs';OUT.mkdir(parents=True,exist_ok=True)
models=json.loads(gzip.decompress((P/'models.json.gz').read_bytes()).decode())
svgs=json.loads(subprocess.check_output(['node','-e',"const r=require('./render.js'),m=JSON.parse(require('zlib').gunzipSync(require('fs').readFileSync('./models.json.gz'))); console.log(JSON.stringify(m.map(x=>[r.plan(x,0),r.plan(x,1)])))"],cwd=P))
def draw(c,s,x,y,w,h):
 d=svg2rlg(io.BytesIO(s.encode())); scale=min(w/d.width,h/d.height)
 c.saveState();c.translate(x+(w-d.width*scale)/2,y+(h-d.height*scale)/2);c.scale(scale,scale);renderPDF.draw(d,c,0,0);c.restoreState()
for m,pair in zip(models,svgs):
 ident=m['id'];revised=ident=='B3-O1-C-F1';w,h=landscape(A3)
 c=canvas.Canvas(str(OUT/(ident+'.pdf')),pagesize=(w,h));c.setTitle('OBTP review plans '+ident);c.setAuthor('OBTP')
 c.setFont('Helvetica-Bold',18);c.drawString(30,h-40,'OBTP / '+ident)
 c.setFont('Helvetica',10);c.drawString(30,h-60,'Two-storey planning study / 24-option catalogue / 24 September 2026')
 c.drawString(30,h-78,'DRAFT: bathroom batch 1 applied to this example only.' if revised else 'DRAFT: earlier v2 planning geometry; revised bathroom batch not applied.')
 if revised:
  draw(c,gzip.decompress((P/'B3-O1-C-F1_R03.svg.gz').read_bytes()).decode(),25,125,w-50,h-230)
 else:
  for i,s in enumerate(pair):
   s=re.sub(r'fill="#[0-9a-fA-F]{6}"', 'fill="#ffffff"', s)
   s=re.sub(r'stroke="#[0-9a-fA-F]{6}"', 'stroke="#000000"', s)
   s=re.sub(r'<style>.*?</style>', '<style>text{font-family:Arial;fill:#000000}.wall{fill:#000000}.furn{fill:#ffffff;stroke:#000000;stroke-width:14}.label{font-weight:600}</style>', s)
   draw(c,s,20+i*w/2,125,w/2-40,h-225)
 c.setFont('Helvetica',9)
 notes=['External width: 7.60 m. Two full storeys; gable-roof brief. Plans do not update the website 3D reference.',
 'Room boundaries, wall build-ups, furniture and opening positions remain planning assumptions; not construction drawings.',
 'Blocks are refined in batches, then all 24 whole-house layouts require coordination and professional review.',
 'User-drawn bathroom geometry retained. Operating clearances and upstairs washer location await review.' if revised else 'Furniture and room planning remain unrefined; earlier automated checks are not architectural approval.']
 for i,n in enumerate(notes):c.drawString(30,90-i*14,n)
 c.save()
print('Built',len(models),'PDFs')
