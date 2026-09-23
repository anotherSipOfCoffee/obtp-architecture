(function(){'use strict';
const c=window.OBTP_SITE_CONFIG||{},id=c.measurementId||'',key='obtp.analytics-consent.v1',panel=document.getElementById('analytics-consent'),status=document.getElementById('analytics-status');
const ready=c.analyticsEnabled===true&&/^G-[A-Z0-9]+$/.test(id)&&!!c.operatorName&&!!c.contactEmail&&location.protocol==='https:';
let enabled=false,loaded=false,choice=null;
try{const v=JSON.parse(localStorage.getItem(key));if(v&&Date.now()-v.at<180*86400000)choice=v.choice;}catch(_){}
window.dataLayer=window.dataLayer||[];window.gtag=function(){window.dataLayer.push(arguments);};
window.gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
function start(){if(!ready)return;enabled=true;window['ga-disable-'+id]=false;window.gtag('consent','update',{analytics_storage:'granted'});if(!loaded){loaded=true;window.gtag('js',new Date());window.gtag('config',id,{allow_google_signals:false,allow_ad_personalization_signals:false,page_location:location.origin+location.pathname,page_title:'OBTP configurator',page_referrer:''});const tag=document.createElement('script');tag.async=true;tag.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(id);document.head.appendChild(tag);}}
function clearCookies(){const host=location.hostname.split('.');for(const cookie of document.cookie.split(';')){const name=cookie.split('=')[0].trim();if(!/^_ga(?:_|$)/.test(name))continue;document.cookie=name+'=; Max-Age=0; path=/';for(let i=0;i<host.length-1;i++)document.cookie=name+'=; Max-Age=0; path=/; domain=.'+host.slice(i).join('.');}}
function decide(value){choice=value;try{localStorage.setItem(key,JSON.stringify({choice:value,at:Date.now()}));}catch(_){}panel.hidden=true;if(value==='accepted')start();else{enabled=false;window['ga-disable-'+id]=true;window.gtag('consent','update',{analytics_storage:'denied'});clearCookies();if(loaded){location.reload();return;}}status.textContent=value==='accepted'?'Analytics accepted':'Analytics declined';}
document.getElementById('analytics-accept').addEventListener('click',()=>decide('accepted'));
document.getElementById('analytics-decline').addEventListener('click',()=>decide('declined'));
document.getElementById('analytics-settings').addEventListener('click',()=>{panel.hidden=false;document.getElementById('analytics-decline').focus();});
document.getElementById('analytics-settings').hidden=!ready;
if(ready){panel.hidden=choice!==null;if(choice==='accepted')start();status.textContent=choice==='accepted'?'Analytics accepted':choice==='declined'?'Analytics declined':'';}else{panel.hidden=true;status.textContent='Analytics is off';}
window.addEventListener('obtp:choice',e=>{if(!enabled||!ready)return;const allowed=['bedrooms','workspace','size','view','palette','section','slider','contrast','room'];const d=e.detail;if(!d||!allowed.includes(d.control))return;window.gtag('event','configurator_choice',{control:d.control,choice:String(d.value),bedrooms:d.bedrooms,workspace:d.workspace?'yes':'no',size:d.size,model_id:d.modelId});});
})();
