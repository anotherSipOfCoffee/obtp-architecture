"""Rebuild R04 example from exported model, retaining R03 user bathroom blocks."""
import pathlib,ezdxf,gzip,subprocess,sys
from ezdxf.addons import Importer
from ezdxf.addons.drawing import RenderContext,Frontend,layout,svg
from ezdxf.addons.drawing.config import Configuration,ColorPolicy,BackgroundPolicy
P=pathlib.Path(__file__).parent
# export_example.py is the existing R03 exporter, with output revision changed to R04.
subprocess.run([sys.executable,str(P/'export-pocket-cad.py')],check=True)
d=ezdxf.readfile(P/'B3-O1-C-F1_R04.dxf');s=d.modelspace()
source=ezdxf.read(gzip.open(P/'B3-O1-C-F1_R03.dxf.gz','rt'))
for e in list(s):
 if e.has_xdata('OBTP'):
  i=e.get_xdata('OBTP')[-1].value
  if any(i.startswith(r+'-user-') for r in ['g-wet','u-bath']) or i in ['g-wet-door','g-wet-door-swing','u-bath-door','u-bath-door-swing']:s.delete_entity(e)
im=Importer(source,d);im.import_blocks(['BL-002','BL-006']);im.finalize()
for fi,name in enumerate(['BL-002','BL-006']):s.add_blockref(name,(4350+16000*fi,4600))
for e in s.query('TEXT'):
 if 'RETURN:' in e.dxf.text:e.dxf.text='R04 DRESSING POCKET / USER BATHROOMS RETAINED / DRAFT'
for ly in d.layers:
 off=ly.is_off();ly.dxf.color=7
 if off:ly.off()
 if ly.dxf.lineweight<0:ly.dxf.lineweight=35 if 'WALL' in ly.dxf.name else 18
for e in d.entitydb.values():
 if not e.is_alive:continue
 if e.dxftype()!='LAYER' and e.dxf.is_supported('color'):e.dxf.color=256
 if e.dxf.hasattr('true_color'):e.dxf.discard('true_color')
assert not d.audit().has_errors
f=P/'B3-O1-C-F1_R04.dxf';d.saveas(f)
(P/'B3-O1-C-F1_R04.dxf.gz').write_bytes(gzip.compress(f.read_bytes(),mtime=0))
b=svg.SVGBackend();Frontend(RenderContext(d),b,config=Configuration(background_policy=BackgroundPolicy.WHITE,color_policy=ColorPolicy.BLACK)).draw_layout(s,finalize=True)
(P/'B3-O1-C-F1_R04.svg.gz').write_bytes(gzip.compress(b.get_string(layout.Page(420,220,layout.Units.mm),settings=layout.Settings(fit_page=True)).encode(),mtime=0))
