/* 귀인사주 장면 일러스트 모듈 (demo) — 화면 표시만 담당, 계산/해설 로직은 읽지도 바꾸지도 않음 */
(function(){
'use strict';
var V='20261011-scene-art-demo';
var CSS='.gaScene{margin:0 0 12px;border-radius:20px;overflow:hidden;background:linear-gradient(180deg,#fffdf6,#fbf6e8);border:1px solid rgba(196,170,110,.28);box-shadow:0 6px 18px rgba(80,70,40,.06)}'+
'.gaScene img{display:block;width:100%;height:auto;aspect-ratio:var(--gar,2/1);object-fit:contain}'+
'#todayView .todayHero .todayArt,#todayView .todayHero .todayArtClassic{display:none!important}'+
'#todayView .todayHero.gaHasScene{padding-top:0!important}'+
'.dayMasterBadge .gaDm{display:block;width:84px;height:84px;object-fit:contain;margin:-2px auto 2px}.dayMasterBadge.gaDmOn{width:100px!important;min-width:100px!important}.dayMasterBadge.gaDmOn strong{font-size:20px!important;margin:2px 0 1px!important}';
var TODAY={today:['today_day.webp','오늘의 운세를 전하는 까치 일러스트',1486/691],week:['today_week.webp','징검다리를 건너는 토끼 일러스트',1492/787],month:['today_month.webp','보름달 아래 앉은 올빼미 일러스트',1490/841]};
var YEAR={daeun:['luck_daeun.webp','길 위를 천천히 걸어가는 거북이 일러스트',1488/693],yeon:['today_year.webp','사계절 나무 곁에 선 학 일러스트',1486/693],wol:['luck_wolun.webp','달 아래 연못가의 여우 일러스트',1490/587]};
var SEUN=['luck_seun.webp','큰 나무 아래 도토리를 안은 다람쥐 일러스트',1488/791];
var DM={'甲':['gap','갑목','청설모'],'乙':['eul','을목','달팽이'],'丙':['byeong','병화','병아리'],'丁':['jeong','정화','반딧불이'],'戊':['mu','무토','어린 곰'],'己':['gi','기토','두더지'],'庚':['gyeong','경금','어린 호랑이'],'辛':['sin','신금','까치'],'壬':['im','임수','어린 고래'],'癸':['gye','계수','개구리']};
var yearKind='daeun';
function css(){if(document.getElementById('gaSceneCss'))return;var s=document.createElement('style');s.id='gaSceneCss';s.textContent=CSS;(document.head||document.documentElement).appendChild(s)}
function fig(a,id){var f=document.createElement('div');f.className='gaScene';f.setAttribute('data-ga-scene',id);f.style.setProperty('--gar',String(a[2]));var i=document.createElement('img');i.src=a[0];i.alt=a[1];i.loading='eager';i.decoding='async';i.setAttribute('fetchpriority','high');i.onerror=function(){f.remove()};f.appendChild(i);return f}
function period(){var b=document.querySelector('#fortuneTabs button.on');var t=b?b.textContent:'';return /주간/.test(t)?'week':/월간/.test(t)?'month':'today'}
function put(root,a,id,anchor){
  if(!root)return;var cur=root.querySelector(':scope > .gaScene');
  if(cur&&cur.getAttribute('data-ga-scene')===id)return;if(cur)cur.remove();
  var f=fig(a,id);
  if(anchor&&anchor.parentNode===root)root.insertBefore(f,anchor.nextSibling);else root.insertBefore(f,root.firstChild)}
function today(){
  var v=document.getElementById('todayView');if(!v||!v.firstElementChild)return;
  var p=period(),a=TODAY[p];
  if(p==='today'){var h=v.querySelector('.todayHero');if(h){h.classList.add('gaHasScene');var c=h.querySelector(':scope > .gaScene');if(!c||c.getAttribute('data-ga-scene')!==p){if(c)c.remove();h.insertBefore(fig(a,p),h.firstChild)}}}
  else{var hero=v.querySelector(':scope > .guiinVisualHero');put(v,a,p,hero)}
}
function year(){
  var v=document.getElementById('yearView');if(!v||!v.firstElementChild)return;
  put(v,YEAR[yearKind]||YEAR.daeun,yearKind,v.querySelector(':scope > .guiinVisualHero'));
}
function seun(){
  var v=document.getElementById('resultView');if(!v)return;
  var h=v.querySelector('.guiinVisualHero .eyebrow');
  var isFlow=(h&&/대운·세운/.test(h.textContent))||(typeof currentTab!=='undefined'&&currentTab==='flow');var cur=v.querySelector(':scope > .gaScene');
  if(!isFlow){if(cur)cur.remove();return}
  put(v,SEUN,'seun',v.querySelector(':scope > .guiinVisualHero'));
}
function dm(){
  var b=document.querySelector('.dayMasterBadge');if(!b||b.querySelector('.gaDm'))return;
  var g=b.querySelector('strong');var d=g&&DM[(g.textContent||'').trim().charAt(0)];if(!d)return;
  var i=document.createElement('img');i.className='gaDm';i.src='star_dm_'+d[0]+'.webp';i.alt=d[1]+' 일간을 상징하는 '+d[2]+' 일러스트';i.loading='lazy';i.decoding='async';i.onerror=function(){i.remove();b.classList.remove('gaDmOn')};
  b.classList.add('gaDmOn');b.insertBefore(i,b.firstChild);
}
function run(){try{css();today();year();seun();dm()}catch(e){}}
var busy=false;
function sched(){if(busy)return;busy=true;setTimeout(function(){busy=false;run()},30)}
function boot(){run();['todayView','yearView','resultView'].forEach(function(id){var n=document.getElementById(id);if(n)new MutationObserver(sched).observe(n,{childList:true})});
  var yt=document.querySelectorAll('#yearLuck .tabs button');
  var K=['daeun','seun','yeon','wol'];
  yt.forEach(function(btn,ix){btn.addEventListener('click',function(){if(K[ix]==='seun')return;yearKind=K[ix];yt.forEach(function(x){x.classList.remove('on')});btn.classList.add('on');sched()},true)});
  var tb=document.getElementById('fortuneTabs');if(tb)tb.addEventListener('click',sched,true)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
window.GUIIN_SCENE_ART={version:V,run:run};
})();
