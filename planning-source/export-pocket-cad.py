import json,math,pathlib,ezdxf,gzip
from shapely.geometry import box
from shapely.ops import unary_union
OUT=pathlib.Path(__file__).parent
models=json.loads(gzip.decompress((OUT/'models.json.gz').read_bytes()))
ids=['B3-O1-C-F1']
manifest={'revision':'R04','status':'Existing v2 baseline for manual editing; no compact redesign applied','units':'millimetres','floor_origins':{'ground':[0,0],'upper':[16000,0]},'models':[]}
for mid in ids:
 m=next(x for x in models if x['id']==mid);d=ezdxf.new('R2000');d.units=4;d.appids.new('OBTP');s=d.modelspace();L=m['dimensions']['internalLength'];W=6800
 for name,col in [('WALL',7),('ROOM',8),('DOOR',3),('WINDOW',4),('FURNITURE',2),('STAIR',5),('CLEARANCE',9),('TEXT',7),('DIM',6),('USER_NOTES',1)]:
  for prefix in ['G','U']:
   ly=d.layers.new(prefix+'-'+name,dxfattribs={'color':col})
   if name in ['ROOM','CLEARANCE']:ly.off()
 def tag(e,i):e.set_xdata('OBTP',[(1000,mid),(1000,i)]);return e
 def poly(points,layer,i,closed=True):return tag(s.add_lwpolyline(points,close=closed,dxfattribs={'layer':layer}),i)
 def txt(t,x,y,layer,h=120):return s.add_text(t,dxfattribs={'height':h,'insert':(x,y),'layer':layer})
 for f in m['floors']:
  fi=f['index'];p='U' if fi else 'G';dx=16000*fi
  def rect(r,layer,i):return poly([(dx+r['x'],r['y']),(dx+r['x']+r['w'],r['y']),(dx+r['x']+r['w'],r['y']+r['h']),(dx+r['x'],r['y']+r['h'])],p+'-'+layer,i)
  def b(r):return box(r['x'],r['y'],r['x']+r['w'],r['y']+r['h'])
  gaps=[b(q) for r in f['rooms'] for q in r['rects']]+[b(q['gap']) for q in f['doors']]
  for i,w in enumerate(f['windows']):
   r={'x':w['start'] if w['side'] in ['north','south'] else (L if w['side']=='east' else -400),'y':(W if w['side']=='north' else -400) if w['side'] in ['north','south'] else w['start'],'w':w['length'] if w['side'] in ['north','south'] else 400,'h':400 if w['side'] in ['north','south'] else w['length']}
   gaps.append(b(r));rect(r,'WINDOW','window-'+str(i))
  walls=box(-400,-400,L+400,W+400).difference(unary_union(gaps))
  for i,g in enumerate(getattr(walls,'geoms',[walls])):
   poly([(dx+x,y) for x,y in g.exterior.coords],p+'-WALL','wall-'+str(i))
   for j,hole in enumerate(g.interiors):poly([(dx+x,y) for x,y in hole.coords],p+'-WALL',f'wall-{i}-hole-{j}')
  for r in f['rooms']:
   for i,q in enumerate(r['rects']):rect(q,'ROOM',r['id']+'-'+str(i))
   q=max(r['rects'],key=lambda q:q['w']*q['h'])
   tx=dx+q['x']+150;ty=q['y']+q['h']/2
   if r['id']=='bed1':ty=q['y']+350
   if r['id']=='main-pocket':tx=dx+q['x']+650;ty=q['y']+q['h']-350
   if r['id']=='g-living':tx=dx+7400;ty=3850
   txt('Dressing' if r['id']=='main-pocket' else r['name'],tx,ty,p+'-TEXT',85)
   txt(f"{r['area']:.2f} m2",tx,ty-150,p+'-TEXT',85)
  for q in f['furniture']:
   # Each object is an editable named block, with a stable source ID.
   name=p+'_'+q['id'];bl=d.blocks.new(name=name)
   bl.add_lwpolyline([(0,0),(q['w'],0),(q['w'],q['h']),(0,q['h'])],close=True)
   bl.add_text(q['type'],dxfattribs={'height':80,'insert':(30,q['h']/2)})
   tag(s.add_blockref(name,(dx+q['x'],q['y']),dxfattribs={'layer':p+'-FURNITURE'}),q['id'])
  for q in f['clearances']:rect(q,'CLEARANCE',q['id'])
  for q in f['doors']:
   if 'sweep' not in q:continue
   a=q['sweep'];v=q['orientation'];start=q['hinge']=='start'
   if v in ['south','north']:
    hx=a['x'] if start else a['x']+a['w'];hy=a['y']+a['h'] if v=='south' else a['y'];cx=a['x']+a['w'] if start else a['x'];cy=hy;ox=hx;oy=a['y'] if v=='south' else a['y']+a['h']
   else:
    hx=a['x'] if v=='east' else a['x']+a['w'];hy=a['y'] if start else a['y']+a['h'];cx=hx;cy=a['y']+a['h'] if start else a['y'];ox=a['x']+a['w'] if v=='east' else a['x'];oy=hy
   tag(s.add_line((dx+hx,hy),(dx+ox,oy),dxfattribs={'layer':p+'-DOOR'}),q['id'])
   aa=math.degrees(math.atan2(cy-hy,cx-hx));bb=math.degrees(math.atan2(oy-hy,ox-hx))
   if (bb-aa)%360>180:aa,bb=bb,aa
   tag(s.add_arc((dx+hx,hy),q['width'],aa,bb,dxfattribs={'layer':p+'-DOOR'}),q['id']+'-swing')
  for y in [4600,5750]:
   for k in range(9):s.add_line((dx+1000+k*260,y),(dx+1000+k*260,y+1050),dxfattribs={'layer':p+'-STAIR'})
  txt(mid+' / '+('UPPER' if fi else 'GROUND')+' / R04 POCKET STUDY',dx,8050,p+'-TEXT',220)
  txt('EDITABLE PLANNING STUDY - NOT CONSTRUCTION DOCUMENTS',dx,7700,p+'-TEXT',140)
  for p1,p2,base,angle in [((dx-400,-400),(dx+L+400,-400),(dx,-1100),0),((dx-400,-400),(dx-400,W+400),(dx-1100,0),90)]:
   dim=s.add_linear_dim(base=base,p1=p1,p2=p2,angle=angle,dimstyle='Standard',override={'dimtxt':140,'dimasz':100,'dimexo':100,'dimexe':100},dxfattribs={'layer':p+'-DIM'});dim.render()
 txt('RETURN: keep origins and units. Edit geometry; place comments on G/U-USER_NOTES.',0,-2100,'G-TEXT',160)
 d.set_modelspace_vport(14000,center=(14000,3300));d.saveas(OUT/(mid+'_R04.dxf'))
 errors=d.audit();assert not errors.has_errors
 manifest['models'].append({'id':mid,'dimensions':m['dimensions'],'entities':len(s),'rooms':[{'floor':f['index'],'id':r['id'],'area':r['area']} for f in m['floors'] for r in f['rooms']]})
(OUT/'manifest.json').write_text(json.dumps(manifest,indent=2))
print(json.dumps([(q['id'],q['entities']) for q in manifest['models']]))
