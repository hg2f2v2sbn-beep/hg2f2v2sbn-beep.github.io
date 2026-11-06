/* 귀인사주 장문 해설 v1
 * - 평생사주(결제): 14개 항목 장문 해설. 궁합(결제): 10개 항목.
 * - 서버(/api/reading/longform)가 명식별로 한 번 만들고 저장해 두며, 다시 열면 저장본을 보여 준다.
 * - 무료 화면에는 목차 미리보기와 결제 버튼만 보인다. 끄려면 window.GUIIN_LONGFORM_OFF = true
 */
(function(root){
'use strict';
var SAJU_TOC=['한마디로','오행으로 본 나','일주와 십성','쓴소리 좀 할게요','나만의 매력','나라는 사람','나에게 맞는 일','재물운','연애·결혼운','가족과 인연','곁에 두면 좋은 사람','지금 대운과 앞으로','나를 살리는 습관','마지막 한마디'];
var COMPAT_TOC=['한마디로','오행의 조화','잘 맞는 부분','부딪히는 부분','연애 궁합','결혼·생활 궁합','돈 궁합','서로가 보는 나','앞으로의 시기','관계를 위한 한 줄'];
var CSS='.glfCard{margin:14px 0;padding:18px 16px;border-radius:18px;background:#fffdf8;border:1px solid #efe3cf;color:#2d261d}'+
'.glfCard .glfMini{font-size:12px;font-weight:700;color:#9a7440;margin-bottom:6px}'+
'.glfCard h3.glfH{font-size:19px;line-height:1.4;margin:0 0 8px;font-weight:800}'+
'.glfCard .glfLead{font-size:14px;line-height:1.65;color:#5b5145;margin:0 0 12px}'+
'.glfCard .glfToc{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 14px;padding:0;list-style:none}'+
'.glfCard .glfToc li{font-size:12.5px;padding:4px 10px;border-radius:999px;background:#f6eedf;color:#6b5434}'+
'.glfCard .glfToc li.lock{opacity:.6}'+
'.glfCard button.glfBtn{width:100%;padding:13px;border-radius:12px;border:0;background:#2f7a43;color:#fff;font-weight:800;font-size:15px;cursor:pointer}'+
'.glfCard button.glfBtn[disabled]{opacity:.6;cursor:default}'+
'.glfCard .glfWait{font-size:13.5px;line-height:1.6;color:#6b5d4b;text-align:center;padding:14px 4px}'+
'.glfCard .glfWait .dot{display:inline-block;animation:glfB 1.2s infinite}'+
'@keyframes glfB{0%,100%{opacity:.25}50%{opacity:1}}'+
'.glfCard .glfSec{border-top:1px solid #f0e6d6;padding:16px 0 4px}'+
'.glfCard .glfSec .glfLabel{display:inline-block;font-size:12px;font-weight:700;color:#fff;background:#b0874d;border-radius:999px;padding:2px 10px;margin-bottom:8px}'+
'.glfCard .glfSec h4{font-size:17px;line-height:1.45;margin:0 0 10px;font-weight:800;color:#2b2318}'+
'.glfCard .glfSec .glfEv{font-size:12.5px;line-height:1.5;color:#8a6a3c;background:#faf3e6;border-radius:8px;padding:6px 10px;margin:0 0 12px}'+
'.glfCard .glfSec p{font-size:15px;line-height:1.8;margin:0 0 12px;color:#3a3127;word-break:keep-all}'+
'.glfCard .glfFoot{font-size:12px;color:#9b8f80;margin-top:6px;line-height:1.5}'+
'.glfCard .glfErr{font-size:13.5px;color:#a8432f;margin:8px 0}';
function ensureCss(){var d=root.document;if(d.getElementById('glfCss'))return;var s=d.createElement('style');s.id='glfCss';s.textContent=CSS;d.head.appendChild(s);}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function ent(){try{return typeof GUIIN_VERIFIED_ENTITLEMENTS!=='undefined'?GUIIN_VERIFIED_ENTITLEMENTS:(root.GUIIN_VERIFIED_ENTITLEMENTS||{});}catch(_){return {};}}
function getChart(){try{return typeof chart!=='undefined'?chart:null;}catch(_){return null;}}
function getMatch(){try{return typeof matchMeta!=='undefined'?matchMeta:null;}catch(_){return null;}}
function matchTabNow(){try{return typeof matchTab!=='undefined'?matchTab:'summary';}catch(_){return 'summary';}}
function personKey(c){var I=(c&&c.input)||{};return [I.year,I.month,I.day,I.hour,I.minute,I.gender,I.calendar].join('.');}
var STATE={};/* key -> {status, reading, error} */
function payload(kind){
  if(typeof root.guiinChartPayload!=='function')return null;
  if(kind==='saju'){var c=getChart();if(!c||!c.pillars)return null;var p=root.guiinChartPayload(c);p.consultation_kind='personal';return {chart:p,name:(c.input&&c.input.name)||c.name||''};}
  var m=getMatch();if(!m||!m.a||!m.b||!m.a.pillars||!m.b.pillars)return null;
  var a=root.guiinChartPayload(m.a),b=root.guiinChartPayload(m.b);
  var cp=Object.assign({},a);cp.consultation_kind='compatibility';cp.compatibility_requested=true;
  var rel=null;try{rel=typeof root.guiinAIRelationshipPayload==='function'?root.guiinAIRelationshipPayload(m):null;}catch(_){}
  cp.compatibility={a:a,b:b,metrics:{score:m.score,love:m.love,personality:m.personality,money:m.money,future:m.future},relationship:rel};
  return {chart:cp,name:a.name||''};
}
async function call(kind,peek){
  var code=kind==='saju'?'LIFETIME_SAJU':'PREMIUM_COMPAT';
  if(typeof root.guiinEnsurePaidResourceSnapshot!=='function'||typeof root.guiinApi!=='function')throw new Error('not_ready');
  var ctx=await root.guiinEnsurePaidResourceSnapshot(code);
  var body={kind:kind,chartSnapshotId:ctx.chartSnapshotId,peek:!!peek};
  if(!peek){var p=payload(kind);if(!p)throw new Error('chart_missing');body.chart=p.chart;body.name=p.name;}
  var ctl=new AbortController(),t=setTimeout(function(){ctl.abort();},170000);
  try{
    var res=await root.guiinApi('/api/reading/longform',{method:'POST',cache:'no-store',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(body),signal:ctl.signal});
    var data=await res.json().catch(function(){return {};});
    if(res.status===202||data.pending)return {pending:true};
    if(!res.ok)throw new Error(data.error||('HTTP '+res.status));
    if(data.missing)return {missing:true};
    return {reading:data.reading};
  }finally{clearTimeout(t);}
}
function rerender(){try{enhance(true);}catch(_){}}
async function load(kind,key,generate){
  var st=STATE[key]||(STATE[key]={});
  if(st.busy)return;st.busy=true;st.error=null;st.status=generate?'making':(st.status||'checking');rerender();
  try{
    var tries=0;
    while(true){
      var r=await call(kind,!generate);
      if(r.reading){st.reading=r.reading;st.status='done';break;}
      if(r.missing){st.status='idle';break;}
      if(r.pending){st.status='making';rerender();if(++tries>25)throw new Error('timeout');await new Promise(function(ok){setTimeout(ok,8000);});generate=false;continue;}
      break;
    }
  }catch(e){
    var m=String(e&&e.message||e);
    st.status=st.reading?'done':'idle';
    if(!/not_ready|paid_resource_input_required/.test(m))st.error=m==='entitlement_required'?'결제 확인이 아직 안 끝났어요. 잠시 후 다시 눌러 주세요.':'해설을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.';
  }finally{st.busy=false;rerender();}
}
function readingHTML(rd){
  var secs=(rd&&rd.sections)||[];
  return secs.map(function(s){
    var paras=String(s.body||'').split(/\n{2,}|\n/).map(function(x){return x.trim();}).filter(Boolean);
    return '<div class="glfSec"><span class="glfLabel">'+esc(s.label||'')+'</span><h4>'+esc(s.title||s.label||'')+'</h4>'+(s.evidence?'<div class="glfEv">근거 · '+esc(s.evidence)+'</div>':'')+paras.map(function(p){return '<p>'+esc(p)+'</p>';}).join('')+'</div>';
  }).join('');
}
function cardHTML(kind,paid,st,name){
  var toc=kind==='saju'?SAJU_TOC:COMPAT_TOC;
  var mini=kind==='saju'?'평생사주 장문 해설':'궁합 장문 해설';
  if(!paid){
    return '<div class="glfMini">'+mini+'</div><h3 class="glfH">'+(kind==='saju'?esc(name||'나')+'님만을 위해 길게 써 내려간 '+toc.length+'개 이야기':'두 사람을 위한 '+toc.length+'개 이야기')+'</h3>'
      +'<p class="glfLead">'+(kind==='saju'?'타고난 오행과 일주, 쓴소리와 매력, 맞는 일·재물·연애·가족, 지금 대운과 나를 살리는 습관까지. 명식 근거를 하나하나 짚어 가며 길게 풀어 드려요.':'오행의 조화, 잘 맞는 부분과 부딪히는 부분, 연애·결혼·돈 궁합, 서로가 보는 나까지 두 사람의 명식으로 길게 풀어 드려요.')+'</p>'
      +'<ul class="glfToc">'+toc.map(function(t,i){return '<li class="'+(i>1?'lock':'')+'">'+(i>1?'🔒 ':'')+esc(t)+'</li>';}).join('')+'</ul>'
      +'<button type="button" class="glfBtn" data-glf-buy="'+kind+'">'+(kind==='saju'?'평생사주로 장문 해설 열기 ›':'프리미엄 궁합으로 장문 해설 열기 ›')+'</button>';
  }
  var head='<div class="glfMini">'+mini+'</div>';
  if(st.status==='done'&&st.reading){
    return head+'<h3 class="glfH">'+esc(st.reading.headline||mini)+'</h3>'+readingHTML(st.reading)
      +'<p class="glfFoot">사주는 타고난 경향과 시기의 흐름을 읽는 도구예요. 중요한 결정은 지금의 상황과 함께 판단해 주세요.</p>';
  }
  if(st.status==='making'){
    return head+'<h3 class="glfH">'+(kind==='saju'?esc(name||'')+'님의 해설을 쓰고 있어요':'두 사람의 해설을 쓰고 있어요')+'</h3>'
      +'<div class="glfWait">명식 근거를 하나씩 짚어 가며 '+toc.length+'개 항목을 쓰는 중이에요<span class="dot">…</span><br>1~2분 정도 걸려요. 한 번 만들어 두면 다음부터는 바로 열려요.</div>';
  }
  return head+'<h3 class="glfH">'+(kind==='saju'?esc(name||'')+'님만을 위한 '+toc.length+'개 이야기':'두 사람을 위한 '+toc.length+'개 이야기')+'</h3>'
    +'<ul class="glfToc">'+toc.map(function(t){return '<li>'+esc(t)+'</li>';}).join('')+'</ul>'
    +(st.error?'<div class="glfErr">'+esc(st.error)+'</div>':'')
    +'<button type="button" class="glfBtn" data-glf-make="'+kind+'"'+(st.status==='checking'?' disabled':'')+'>'+(st.status==='checking'?'확인하는 중…':'장문 해설 만들기')+'</button>';
}
function sajuPlace(view){
  var hs=view.querySelectorAll('h3,h4'),core=null;
  for(var i=0;i<hs.length;i++){if(/^핵심 결론/.test((hs[i].textContent||'').trim())){core=hs[i].closest('article,section');break;}}
  var portrait=view.querySelector('[data-gptr]');
  if(portrait&&portrait.parentNode===view)return {after:portrait,paidView:!!core};
  if(core)return {before:core,paidView:true};
  var m=view.querySelector(':scope > .manseSnapshot');if(m)return {after:m,paidView:false};
  return null;
}
function compatPlace(view){
  var list=view.querySelectorAll(':scope > *');
  for(var i=0;i<list.length;i++){if(/조금 더 물어보고 싶다면/.test(list[i].textContent||'')&&list[i].offsetHeight<600){var t=view.querySelector(':scope > [data-gpt]');return {before:t||list[i]};}}
  return null;
}
function put(view,card,place){
  if(place.before){if(card.nextElementSibling!==place.before)view.insertBefore(card,place.before);}
  else if(place.after){if(place.after.nextElementSibling!==card)place.after.after(card);}
  var ref=place.before||place.after;try{var o=root.getComputedStyle(ref).order;card.style.order=(o&&o!=='0')?o:'';}catch(_){}
  if(!card.style.order&&view.classList.contains('gR1'))card.style.order='4';
}
function one(kind,force){
  var d=root.document,view=d.getElementById(kind==='saju'?'resultView':'matchView');if(!view)return;
  var id=kind==='saju'?'gxLongformCard':'gxLongformCompat';
  var card=d.getElementById(id);
  if(kind==='compat'&&matchTabNow()!=='summary'){if(card)card.remove();return;}
  var subj=kind==='saju'?getChart():getMatch();
  if(!subj||(kind==='saju'?!subj.pillars:!(subj.a&&subj.b)))return;
  var place=kind==='saju'?sajuPlace(view):compatPlace(view);if(!place)return;
  var e=ent(),paid=kind==='saju'?e.lifetimeSaju===true:e.compat===true;
  var key=kind+'|'+(kind==='saju'?personKey(subj):[personKey(subj.a),personKey(subj.b)].sort().join('|'));
  var st=STATE[key]||(STATE[key]={status:'idle'});
  var name=kind==='saju'?((subj.input&&subj.input.name)||subj.name||''):'';
  var sig=key+'|'+(paid?'p':'f')+'|'+st.status+'|'+(st.error||'')+'|'+(st.reading?st.reading.generatedAt:'');
  if(card&&card.getAttribute('data-sig')===sig&&!force){put(view,card,place);return;}
  ensureCss();
  if(!card){card=d.createElement('section');card.id=id;card.className='glfCard';card.setAttribute('data-polish-skip','1');}
  card.setAttribute('data-sig',sig);card.setAttribute('data-glf-key',key);
  card.innerHTML=cardHTML(kind,paid,st,name);
  put(view,card,place);
  if(paid&&!st.checked&&!st.busy){st.checked=true;load(kind,key,false);}
}
function enhance(force){if(root.GUIIN_LONGFORM_OFF||!root.document)return;one('saju',force);one('compat',force);}
function onClick(ev){
  var t=ev.target&&ev.target.closest?ev.target.closest('[data-glf-make],[data-glf-buy]'):null;if(!t)return;
  var buy=t.getAttribute('data-glf-buy');
  if(buy){try{root.guiinPaymentCenterStart&&root.guiinPaymentCenterStart(buy==='saju'?'LIFETIME_SAJU':'PREMIUM_COMPAT');}catch(_){}return;}
  var kind=t.getAttribute('data-glf-make'),card=t.closest('.glfCard'),key=card&&card.getAttribute('data-glf-key');
  if(key)load(kind,key,true);
}
if(root.document&&root.MutationObserver){
  var pending=false;
  var mo=new root.MutationObserver(function(){if(pending)return;pending=true;root.requestAnimationFrame(function(){pending=false;try{enhance(false);}catch(_){}});});
  var start=function(){try{mo.observe(root.document.body,{childList:true,subtree:true});root.document.addEventListener('click',onClick);enhance(false);}catch(_){}};
  if(root.document.body)start();else root.document.addEventListener('DOMContentLoaded',start);
}
root.GuiinLongform={version:'longform-v1',refresh:function(){enhance(true);}};
})(typeof globalThis!=='undefined'?globalThis:this);
