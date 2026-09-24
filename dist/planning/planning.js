/* Independent planning selection: never writes the legacy 3D state. */
(()=>{'use strict';
const root=document.getElementById('obtp-plan-configurator'),cat=window.OBTPPlanCatalogue;
const q=s=>root.querySelector(s),keys=['bedrooms','office','size','bathrooms'];
const text=(el,v)=>{if(el&&el.textContent!==v)el.textContent=v;};
let selected=null;
function read(){const v=Object.fromEntries(keys.map(k=>[k,q(`input[name="planning-${k}"]:checked`).value]));return cat.find(m=>m.bedrooms===+v.bedrooms&&m.office===(v.office==='1')&&m.size===v.size&&m.bathrooms===+v.bathrooms);}
function refresh(){selected=read();if(!selected)return;
 const m=selected,label=`${m.bedrooms} bedroom${m.bedrooms===1?'':'s'}${m.office?' + office':''} · ${m.size}`;
 const status='R04 dressing pocket applied; door hardware, windows and desk remain under review. '+(m.revised?'Bathroom batch 1 applied to this example. Other rooms and bathroom operating clearances remain under review.':'Earlier planning draft. The revised bathroom batch has not yet been applied to this option.');
 text(q('h2'),'Linear / '+label);text(q('.mode-note'),'Two-storey plan study');
 text(q('#planning-bath-note'),m.bathrooms===1?'Upstairs shower bathroom + downstairs WC/laundry.':'Shower bathroom on each floor; downstairs laundry.');
 text(q('#planning-revision'),status);text(q('.study-note'),'Plan selection '+m.id+' · '+status);
 text(q('.result-status'),status);text(q('.validation-note'),'24 draft combinations; none are approved construction designs. Blocks are refined in batches, then all complete houses will be reviewed.');
 text(q('.feedback'),'Selected plan '+m.id+' · 3D reference unchanged');
 text(q('.view-caption'),'Earlier 3D reference · independent of the selected floor plans');
 const facts=`<div><strong>${m.bedrooms}${m.office?' + office':''}</strong><small>selected plan</small></div><div><strong>${m.area.toFixed(1)} m²</strong><small>gross internal study area · 2 floors</small></div><div><strong>7.60 × ${m.length.toFixed(2)} m</strong><small>selected plan envelope</small></div>`;
 if(q('.facts').innerHTML!==facts)q('.facts').innerHTML=facts;
 const rows=[['Variant',m.id],['Bedrooms',m.bedrooms],['Separate office',m.office?'Yes':'No'],['Size',m.size==='compact'?'Compact':'Generous'],['Full bathrooms',m.bathrooms],['Storeys',2],['External width','7.60 m'],['Length',m.length.toFixed(2)+' m'],['Gross internal study area',m.area.toFixed(1)+' m²'],['Footprint',m.footprint.toFixed(2)+' m²']].map(([k,v])=>`<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
 if(q('.result-summary').innerHTML!==rows)q('.result-summary').innerHTML=rows;
 root.querySelectorAll('.planning-pdf').forEach(a=>{a.href='planning/pdfs/'+m.id+'.pdf?rev=R04';a.download=m.id+'.pdf';});
 text(q('#download-drawings'),'Download selected plans (PDF)');
}
for(const k of keys)root.querySelectorAll(`input[name="planning-${k}"]`).forEach(el=>el.addEventListener('change',()=>{refresh();const m=selected;history.replaceState(null,'','#plan='+m.id);text(q('.feedback'),'Selected '+m.id);window.dispatchEvent(new CustomEvent('obtp:choice',{detail:{control:'planning-'+k,value:el.value,modelId:m.id,scope:'two-storey-planning'}}));}));
function restore(){const id=new URLSearchParams(location.hash.slice(1)).get('plan'),m=cat.find(x=>x.id===id);if(m){for(const k of keys){const v=k==='office'?String(+m[k]):String(m[k]);q(`input[name="planning-${k}"][value="${v}"]`).checked=true;}}refresh();}
q('#download-drawings').addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();refresh();const a=document.createElement('a');a.href='planning/pdfs/'+selected.id+'.pdf?rev=R04';a.download=selected.id+'.pdf';a.click();text(q('#pdf-status'),'Selected ground and upper plans requested. The 3D reference and cuts are unchanged.');},true);
// Legacy rendering writes this title on every view/appearance/resize update.
// Restore only planning text after that render; do not touch its canvas, camera or state.
new MutationObserver(()=>refresh()).observe(q('h2'),{childList:true,characterData:true,subtree:true});
window.addEventListener('hashchange',restore);restore();
window.OBTPPlanning={getSelected:()=>({...selected}),count:cat.length};
})();
