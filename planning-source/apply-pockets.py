"""Apply the reviewed R01 pocket study once to R03 models; dimensions are study assumptions."""
import gzip,json,pathlib,copy
P=pathlib.Path(__file__).parent
models=json.loads(gzip.decompress((P/'models.json.gz').read_bytes()))
assert not any(m.get('pocketRevision') for m in models), 'Already applied'
for m in models:
 f=m['floors'][1];r=next(r for r in f['rooms'] if r['id']=='bed1');q=copy.deepcopy(r['rects'][0]);x,y,L,H=[q[k] for k in ('x','y','w','h')];three=m['input']['bedrooms']==3
 r.update(rects=[dict(x=x+1650,y=y,w=L-1650,h=H)],area=(L-1650)*H/1e6,name='Main bedroom')
 f['rooms'].append(dict(id='main-pocket',name='Dressing pocket',kind='storage',rects=[dict(x=x,y=y,w=1500,h=H)],area=1500*H/1e6))
 oldids={o['id'] for o in f['furniture'] if o['room']=='bed1'}
 f['furniture']=[o for o in f['furniture'] if o['room']!='bed1']
 for key in ('clearances','targets','operations'):
  f[key]=[o for o in f[key] if o.get('room')!='bed1' and o.get('fixture') not in oldids and not o.get('id','').startswith(('main-','night'))]
 def furn(i,t,room,xx,yy,w,h,**extra):f['furniture'].append(dict(id=i,type=t,name=t,room=room,x=xx,y=yy,w=w,h=h,**extra))
 furn('main-bed','bed','bed1',x+L-2100,y+(H-1800)/2,2100,1800,head='east')
 for i,yy in enumerate([y+(H-1800)/2-500,y+(H+1800)/2+50]):furn('night'+str(i+1),'bedside','bed1',x+L-500,yy,500,450)
 # Side-entry family keeps clear space below storage for its existing entrance swing.
 start=1200 if three else 0
 furn('main-wardrobe','wardrobe','main-pocket',x,y+start,600,H-start)
 door=next(d for d in f['doors'] if d['id']=='bed1-door')
 if three:door['to']='main-pocket'
 else:
  door.update(x=1700,width=900,clearWidth=900,kind='opening-study',gap=dict(x=1700,y=3100,w=900,h=150),threshold=dict(x=2150,y=3100));door.pop('sweep',None)
 opening=1200 if three else 1000
 f['doors'].append(dict(id='main-pocket-opening',**{'from':'main-pocket','to':'bed1'},kind='opening-study',orientation='east',x=x+1500,y=y+opening,width=900,clearWidth=900,gap=dict(x=x+1500,y=y+opening,w=150,h=900),threshold=dict(x=x+1650,y=y+opening+450)))
 m['areas']['roomNet']=sum(r['area'] for fl in m['floors'] for r in fl['rooms'])
 m['pocketRevision']='R04';m['version']='R04 pocket coordination draft'
 m['review']['level']='Unapproved pocket coordination draft'
 m['review']['notes']+=['R01 pocket adapted to existing hall entry; door hardware, windows, desk and whole-house functionality require review.','One-bedroom separate dressing room retained pending duplication review.' if not three and m['input']['bedrooms']==1 else 'Sleeping area excludes dressing pocket.']
 m['pocketStudy']=dict(originalBoundary=q,storageDepth=600,aisle=900,partitionAllowance=150,footGap=L-3750,sideGap=(H-1800)/2,storageRun=H-start,professionalApproval=False)
(P/'models.json.gz').write_bytes(gzip.compress(json.dumps(models,separators=(',',':')).encode(),mtime=0))
print('Applied pockets:',len(models))
