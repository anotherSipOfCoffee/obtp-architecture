(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.OBTPRender=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const COLORS={living:'#f5e6c7',bedroom:'#e1deef',office:'#d9e8f4',wet:'#d9eae5',hall:'#f0f1ec',stair:'#e2e8ee',storage:'#eee7dc'};
function plan(m,index,{furniture=true,clearances=false,dimensions=true}={}){
 const f=m.floors[index],L=m.dimensions.internalLength,W=m.dimensions.internalWidth;
 const ry=r=>W-r.y-r.h;
 const rect=(r,attrs='')=>`<rect x="${r.x}" y="${ry(r)}" width="${r.w}" height="${r.h}" ${attrs}/>`;
 const line=(x1,y1,x2,y2,attrs='')=>`<line x1="${x1}" y1="${W-y1}" x2="${x2}" y2="${W-y2}" ${attrs}/>`;
 const text=(x,y,s,size=130,attrs='')=>`<text x="${x}" y="${W-y}" font-size="${size}" text-anchor="middle" ${attrs}>${esc(s)}</text>`;
 let s=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1400 -1250 ${L+2500} ${W+2500}" role="img" aria-label="${index?'Upper':'Ground'} floor ${esc(m.id)}"><style>text{font-family:Arial,sans-serif;fill:#263a40}line,path{vector-effect:non-scaling-stroke} .wall{fill:#43565a}.furn{fill:#fffaf0;stroke:#536567;stroke-width:14}.label{font-weight:600}</style>`;
 s+=text(L/2,W+920,index?'UPPER FLOOR':'GROUND FLOOR',230,'class="label"');
 s+=text(L/2,W+640,`${m.id} · planning prototype · dimensions in metres`,125);
 s+=rect({x:-400,y:-400,w:L+800,h:W+800},'class="wall"');
 for(const r of f.rooms)for(const q of r.rects)s+=rect(q,`fill="${COLORS[r.kind]}"`);
 // Clear opening cuts through partition allowance.
 for(const d of f.doors)s+=rect(d.gap,'fill="#fffdf7"');
 // Glazing symbol through outer-wall band; positions are planning assumptions.
 for(const w of f.windows){
  if(w.side==='north'||w.side==='south'){
   const y=w.side==='north'?W: -400;s+=rect({x:w.start,y,w:w.length,h:400},'fill="#d5eff6" stroke="#405e6b" stroke-width="12"');s+=line(w.start,y+200,w.start+w.length,y+200,'stroke="#405e6b" stroke-width="1"');
  }else{
   const x=w.side==='east'?L:-400;s+=rect({x,y:w.start,w:400,h:w.length},'fill="#d5eff6" stroke="#405e6b" stroke-width="12"');s+=line(x+200,w.start,x+200,w.start+w.length,'stroke="#405e6b" stroke-width="1"');
  }
 }
 // Stair: opposing flights, full mid landing, shared end landing.
 for(const y of [4600,5750]){
  s+=rect({x:1000,y,w:2080,h:1050},'fill="#ced9e2" stroke="#536567" stroke-width="10"');
  for(let k=0;k<=8;k++)s+=line(1000+k*260,y,1000+k*260,y+1050,'stroke="#627681" stroke-width=".65"');
  s+=line(1000,y+75,3080,y+75,'stroke="#35464c" stroke-width="1.2"');s+=line(1000,y+975,3080,y+975,'stroke="#35464c" stroke-width="1.2"');
 }
 s+=rect({x:0,y:4600,w:1000,h:2200},'fill="#dce5eb" stroke="#627681" stroke-width="10"');
 s+=text(1900,5620,'18R · 167/260',100);
 s+=line(2700,5125,1400,5125,'stroke="#35464c" stroke-width="1.2"');s+=line(1400,5125,1590,5040,'stroke="#35464c"');s+=line(1400,5125,1590,5210,'stroke="#35464c"');
 s+=line(1400,6275,2700,6275,'stroke="#35464c" stroke-width="1.2"');s+=line(2700,6275,2510,6190,'stroke="#35464c"');s+=line(2700,6275,2510,6360,'stroke="#35464c"');
 if(index===1)s+=line(3080,4600,3080,5750,'stroke="#35464c" stroke-width="3"');
 if(index===1)s+=rect({x:0,y:4600,w:3080,h:2200},'fill="none" stroke="#708591" stroke-width="18" stroke-dasharray="65 40"');
 if(clearances)for(const c of f.clearances)s+=rect(c,'fill="#b4d8eb" fill-opacity=".26" stroke="#4e88a1" stroke-width="10" stroke-dasharray="50 35"');
 if(clearances)for(const o of f.operations||[])s+=rect(o,'fill="#edbcb3" fill-opacity=".3" stroke="#a96860" stroke-width="12" stroke-dasharray="50 35"');
 if(furniture)for(const q of f.furniture){
  s+=rect(q,`class="furn" ${q.type==='shower'?'fill-opacity=".65"':''}`);
  if(q.type==='bed'){
   if(q.head==='east'){
    s+=rect({x:q.x+q.w-420,y:q.y+60,w:380,h:q.h-120},'fill="#ffffff" stroke="#000000" stroke-width="10"');
    s+=line(q.x+q.w-420,q.y+q.h/2,q.x+q.w-40,q.y+q.h/2,'stroke="#000000"');
    s+=line(q.x+q.w-600,q.y,q.x+q.w-600,q.y+q.h,'stroke="#000000"');
   }else if(q.head==='west'){
    s+=rect({x:q.x+40,y:q.y+60,w:380,h:q.h-120},'fill="#eee9de" stroke="#536567" stroke-width="10"');
    if(q.h>1000)s+=line(q.x+40,q.y+q.h/2,q.x+420,q.y+q.h/2,'stroke="#536567"');
    s+=line(q.x+600,q.y,q.x+600,q.y+q.h,'stroke="#536567"');
   }else{
    const double=q.w>1000;s+=rect({x:q.x+60,y:q.head==='north'?q.y+q.h-420:q.y+40,w:q.w-120,h:380},'fill="#eee9de" stroke="#536567" stroke-width="10"');
    if(double)s+=line(q.x+q.w/2,q.head==='north'?q.y+q.h-420:q.y+40,q.x+q.w/2,q.head==='north'?q.y+q.h-40:q.y+420,'stroke="#536567"');
    s+=line(q.x,q.head==='north'?q.y+q.h-600:q.y+600,q.x+q.w,q.head==='north'?q.y+q.h-600:q.y+600,'stroke="#536567"');
   }
  }else if(q.type==='sofa'){
   s+=rect({x:q.x+100,y:q.y+100,w:q.w-200,h:q.h-180},'fill="#e5dfd1" stroke="#536567" stroke-width="10"');if(q.facing==='east'){s+=line(q.x+120,q.y+100,q.x+120,q.y+q.h-100,'stroke="#536567" stroke-width="2"');for(const n of [1,2])s+=line(q.x+100,q.y+q.h*n/3,q.x+q.w-100,q.y+q.h*n/3,'stroke="#536567"');}else s+=line(q.x+q.w/2,q.y+100,q.x+q.w/2,q.y+q.h-80,'stroke="#536567"');
  }else if(q.type==='wc'){
   s+=`<ellipse cx="${q.x+q.w/2}" cy="${W-(q.y+q.h*.4)}" rx="${q.w*.3}" ry="${q.h*.35}" fill="#fdfcf6" stroke="#536567" stroke-width="12"/>`;
  }else if(q.type==='basin'){
   s+=`<ellipse cx="${q.x+q.w/2}" cy="${W-(q.y+q.h/2)}" rx="${q.w*.35}" ry="${q.h*.3}" fill="none" stroke="#536567" stroke-width="12"/>`;
  }else if(q.type==='shower'){
   s+=line(q.x,q.y,q.x+q.w,q.y+q.h,'stroke="#91a9ab"');s+=line(q.x,q.y+q.h,q.x+q.w,q.y,'stroke="#91a9ab"');s+=text(q.x+q.w/2,q.y+q.h/2,'SH',100);
  }else if(q.type==='kitchen'){
   for(let i=1;i<5;i++)s+=line(q.x,q.y+i*660,q.x+q.w,q.y+i*660,'stroke="#536567"');
   for(const [i,label] of ['PREP','SINK','DW','HOB','FR'].entries())s+=text(q.x+q.w/2,q.y+i*660+280,label,90);
  }else if(['wardrobe','storage','plant','washer','desk','bedside','drawers','counter','hob','sink','fridge','pantry','dishwasher'].includes(q.type)){
   const lab={wardrobe:'WARDROBE',storage:'STORE',plant:'SERVICES',washer:'W/D',desk:'DESK',bedside:'SIDE',drawers:'DRAWERS',counter:'PREP',hob:'HOB/OV',sink:'SINK',fridge:'FRIDGE',pantry:'PANTRY',dishwasher:'DW'}[q.type];
   s+=text(q.x+q.w/2,q.y+q.h/2-35,lab,Math.min(105,q.w/Math.max(4,lab.length)*1.4));
  }
 }
 // Door leaf and quarter-circle sweep, matching the collision test.
 for(const d of f.doors.filter(d=>d.sweep)){
  const b=d.sweep;let hx,hy,cx,cy,ox,oy;
  if(d.orientation==='south'||d.orientation==='north'){
   hx=d.hinge==='start'?b.x:b.x+b.w;hy=d.orientation==='south'?b.y+b.h:b.y;
   cx=d.hinge==='start'?b.x+b.w:b.x;cy=hy;ox=hx;oy=d.orientation==='south'?b.y:b.y+b.h;
  }else{
   hx=d.orientation==='east'?b.x:b.x+b.w;hy=d.hinge==='start'?b.y:b.y+b.h;
   cx=hx;cy=d.hinge==='start'?b.y+b.h:b.y;ox=d.orientation==='east'?b.x+b.w:b.x;oy=hy;
  }
  s+=line(hx,hy,ox,oy,'stroke="#334e56" stroke-width="1.2"');
  // Parametric arc avoids directional ambiguity across rotated door types.
  const a0=Math.atan2(cy-hy,cx-hx),a1=Math.atan2(oy-hy,ox-hx);let da=a1-a0;while(da>Math.PI)da-=2*Math.PI;while(da< -Math.PI)da+=2*Math.PI;
  let path='';for(let i=0;i<=12;i++){const a=a0+da*i/12,x=hx+d.width*Math.cos(a),y=hy+d.width*Math.sin(a);path+=(i?'L':'M')+x.toFixed(1)+' '+(W-y).toFixed(1)+' ';}
  s+=`<path d="${path}" fill="none" stroke="#8b9c9f" stroke-width=".7"/>`;
 }
 for(const r of f.rooms){
  if(r.kind==='stair')continue;
  let x,y;
  if(r.id==='main-pocket'){const q=r.rects[0];x=q.x+1050;y=q.y+q.h-400;}
  else if(r.id==='bed1'){const q=r.rects[0];x=q.x+q.w/2;y=q.y+320;}
  else if(r.id==='g-living'){x=L-3300;y=4020;}
  else if(r.kind==='wet'){x=4880;y=5030;}
  else if(r.kind==='hall'){x=r.id==='g-hall'?2350:(m.input.bedrooms===3?2100:4300);y=3850;}
  else if(r.id==='g-office'){x=1550;y=2350;}
  else if(r.id==='bed1'&&m.input.bedrooms===3){x=(6700+L)/2;y=3900;}
  else if(r.id==='u-store'){x=(6700+L)/2;y=5100;}
  else if(r.id==='dressing'){x=(5400+L)/2;y=2100;}
  else {const q=r.rects[0];x=q.x+q.w*.57;y=2250;}
  const label=r.kind==='wet'?(r.id==='g-wet'?(m.input.bathrooms===2?'Shower / WC':'WC / laundry'):'Bathroom'):r.name;
  s+=text(x,y,label,r.id==='main-pocket'?90:r.kind==='wet'?110:140,'class="label"');
  s+=text(x,y-185,`${r.area.toFixed(1)} m²`,115);
  if(dimensions&&r.id!=='bed1'&&r.id!=='main-pocket'&&r.rects.length===1&&r.kind!=='wet'&&r.kind!=='hall')s+=text(x,y-345,`${(r.rects[0].w/1000).toFixed(2)} × ${(r.rects[0].h/1000).toFixed(2)} m`,100);
 }
 if(index===0&&!m.input.office)s+=text(1650,2250,'Reading / flexible space',135,'class="label"');
 if(dimensions){
  const dy=-800;
  s+=line(-400,dy,L+400,dy,'stroke="#43565a"');
  for(const x of [-400,L+400])s+=line(x,dy-80,x,dy+80,'stroke="#43565a"');
  s+=text(L/2,dy+100,`${(m.dimensions.externalLength/1000).toFixed(2)} m external`,150);
  s+=line(-900,-400,-900,W+400,'stroke="#43565a"');for(const y of [-400,W+400])s+=line(-980,y,-820,y,'stroke="#43565a"');
  s+=`<text x="-1040" y="${W/2}" font-size="150" text-anchor="middle" transform="rotate(-90 -1040 ${W/2})">7.60 m external · fixed</text>`;
  s+=text(L/2,-1100,'400 mm external wall allowance · 150 mm partitions · north shown up for reference only',105);
 }
 s+='</svg>';return s;
}
function stairSection(m){
 const st=m.stair,scale=1,top=6200;let path='M 0 '+top;let x=0,z=0;
 for(let flight=0;flight<2;flight++){
  for(let riser=0;riser<9;riser++){z+=st.rise;path+=` V ${top-z}`;if(riser<8){x+=st.going;path+=` H ${x}`;}}
  x+=flight===0?1000:1120;path+=` H ${x}`;
 }
 const txt=(x,y,t,size=140)=>`<text x="${x}" y="${y}" font-size="${size}" font-family="Arial" fill="#263a40">${esc(t)}</text>`;
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-650 -350 8500 7300" role="img" aria-label="Dimensioned unfolded stair study"><rect x="-650" y="-350" width="8500" height="7300" fill="#faf9f3"/>${txt(0,0,'Unfolded stair study · not a construction section',230)}${txt(0,270,'Two flights of 9 risers · rise 166.7 mm · going 260 mm · pitch 32.7°',150)}<path d="${path}" stroke="#43565a" stroke-width="30" fill="none"/><line x1="-150" y1="${top-5700}" x2="6600" y2="${top-5700}" stroke="#7d9298" stroke-width="15" stroke-dasharray="70 40"/>${txt(3500,top-5800,'Upper ceiling +5.70 m',140)}${txt(600,top-100,'Ground floor ±0.00')}${txt(2200,top-1500-120,'Landing +1.50 m')}${txt(5200,top-3000-120,'Upper floor +3.00 m')}<line x1="6800" y1="${top-3000}" x2="6800" y2="${top-5700}" stroke="#47768a" stroke-width="20"/>${txt(6900,top-4400,'2.70 m',170)}${txt(6900,top-4200,'headroom',130)}${txt(0,top+330,'Plan zone 4.20 × 2.20 m · opening 3.08 × 2.20 m · clear flights 0.90 m',150)}${txt(0,top+560,'Full opening above both flights and mid-landing; beams and stair fabrication require design.',130)}</svg>`;
}
function csv(models){
 const header=['id','bedrooms','office','size_level','full_bathrooms','wc_count','occupancy_study','external_width_m','external_length_m','gross_internal_study_m2','professional_approval'];
 return [header.join(','),...models.map(m=>[m.id,m.input.bedrooms,+m.input.office,m.input.size,m.input.bathrooms,2,m.occupancy,7.6,m.dimensions.externalLength/1000,m.areas.grossInternalStudy.toFixed(2),false].join(','))].join('\n');
}
return {plan,stairSection,csv,escape:esc};
});
