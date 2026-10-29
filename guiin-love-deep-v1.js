/* 귀인사주 연애·결혼 심화 v1 (2026-10-29)
 * 배우자 자리(일지)와 배우자 별(여성: 관성, 남성: 재성)의 개수·위치·종류, 일지와 다른 기둥의 관계,
 * 앞으로 10년 동안 배우자 별·일지 합이 들어오는 해를 묶어 연애·결혼 패턴을 읽는다.
 * 상대 속마음이나 결혼 성패는 단정하지 않는다.
 * 유료 전체 풀이의 "4. 주는 건 …" 섹션 바로 뒤에 붙는다. 끄려면 window.GUIIN_LOVE_DEEP_OFF = true
 */
(function(root){
'use strict';
if(root.GuiinLoveDeep)return;
var KEYS=['year','month','day','hour'];
var POS={year:'년주',month:'월주',day:'일지',hour:'시주'};
function G(){return root.GuiinSaju;}
function mainHidden(bi){var S=G(),h=S.HIDDEN_STEMS&&S.HIDDEN_STEMS[bi];if(!h||!h.length)return -1;var x=h[0];return Array.isArray(x)?Number(x[0]):typeof x==='number'?x:(x&&x.stemIndex!=null?x.stemIndex:-1);}
function godAt(c,si){return si>=0?G().tenGod(c.pillars.day.stemIndex,si):null;}

/* 배우자 별 위치 목록 */
function spouseStars(c,female){
  var want=female?['정관','편관']:['정재','편재'],out=[];
  KEYS.forEach(function(k){var p=c.pillars[k];if(!p)return;
    if(k!=='day'){var g=godAt(c,p.stemIndex);if(want.indexOf(g)>=0)out.push({god:g,key:k,layer:'천간'});}
    var g2=godAt(c,mainHidden(p.branchIndex));if(want.indexOf(g2)>=0)out.push({god:g2,key:k,layer:'지지'});
  });
  return out;
}
function rels(a,b){try{return G().chartRelations([a,null,null,b])||[];}catch(_e){return [];}}

var DAY_GOD={
 비견:'곁에 있는 사람과 대등한 친구 같은 관계를 원해. 한쪽이 끌고 가는 관계보다 같이 걷는 관계에서 편해.',
 겁재:'가까운 사람과 주도권을 나누는 문제가 자주 생겨. 다정하다가도 내 몫이 침범당하면 바로 선을 그어.',
 식신:'함께 먹고 쉬고 웃는 일상이 맞아야 마음이 놓여. 생활의 편안함이 사랑의 기준이야.',
 상관:'말이 통하고 나를 있는 그대로 봐 주는 사람에게 끌려. 대신 서운하면 말이 날카로워지기 쉬워.',
 편재:'함께 돌아다니고 새로운 걸 해 보는 관계에서 살아나. 반복되는 일상만 남으면 마음이 식기 쉬워.',
 정재:'생활을 같이 꾸리는 안정감이 중요해. 약속·돈·시간을 성실하게 지키는 사람에게 마음이 가.',
 편관:'나를 긴장시키고 끌어 주는 강한 사람에게 끌려. 대신 그 사람에게 휘둘리지 않는 선이 필요해.',
 정관:'예의와 책임을 지키는 사람, 믿을 수 있는 사람이 기준이야. 가벼운 관계는 오래 못 가.',
 편인:'혼자만의 시간과 생각을 존중받아야 편해. 너무 붙어 있으면 숨이 막혀.',
 정인:'보살펴 주고 이해해 주는 사람에게 기대고 싶어 해. 다만 기대기만 하면 관계가 한쪽으로 기울어.'};

var TYPE={
 female:{정관:'믿음직하고 원칙 있는 사람, 약속을 지키는 사람',편관:'추진력 있고 카리스마 있는 사람, 나를 긴장시키는 사람'},
 male:{정재:'성실하고 생활을 같이 꾸릴 수 있는 사람',편재:'활발하고 함께 있으면 새로운 일이 생기는 사람'}};
var NEED={
 비겁:'내 편이 되어 주고 내 기준을 존중해 주는 사람',
 식상:'편하게 웃고 표현할 수 있게 해 주는 사람',
 재성:'현실 감각이 있어서 생활을 같이 굴러가게 하는 사람',
 관성:'적당한 책임감과 질서를 가진 사람',
 인성:'말없이 기다려 주고 생각을 정리할 시간을 주는 사람'};
var GROUP={비견:'비겁',겁재:'비겁',식신:'식상',상관:'식상',편재:'재성',정재:'재성',편관:'관성',정관:'관성',편인:'인성',정인:'인성'};
function groupPct(c){
  var cnt={비겁:0,식상:0,재성:0,관성:0,인성:0},tot=0;
  KEYS.forEach(function(k){var p=c.pillars[k];if(!p)return;if(k!=='day'){var g=GROUP[godAt(c,p.stemIndex)];if(g){cnt[g]++;tot++;}}var g2=GROUP[godAt(c,mainHidden(p.branchIndex))];if(g2){cnt[g2]++;tot++;}});
  var o={};Object.keys(cnt).forEach(function(k){o[k]=tot?Math.round(cnt[k]/tot*100):0;});return o;
}

function read(c,fromYear){
  if(!c||!c.pillars||!c.pillars.day||!G())return null;
  var female=String((c.input||{}).gender||'')==='여',S=G(),day=c.pillars.day;
  var dayGod=godAt(c,mainHidden(day.branchIndex));
  var stars=spouseStars(c,female),kinds={};stars.forEach(function(s){kinds[s.god]=(kinds[s.god]||0)+1;});
  var pct=groupPct(c),thin=Object.keys(pct).sort(function(a,b){return pct[a]-pct[b];})[0];
  var lines=[],cautions=[],ev=[];
  lines.push(DAY_GOD[dayGod]||'');ev.push('일지 '+day.branch+'('+(dayGod||'-')+')');
  /* 배우자 별 개수·종류 */
  var starName=female?'관성(남편·연인 별)':'재성(아내·연인 별)';
  var mix=female?(kinds.정관&&kinds.편관):(kinds.정재&&kinds.편재);
  if(!stars.length){lines.push('원국에 '+starName+'이 드러나 있지 않아. 연애 감각이 늦게 깨거나, 사람보다 내 일과 생활을 먼저 세운 뒤에 인연이 들어오는 편이야.');ev.push(starName+' 없음');}
  else if(stars.length>=3){lines.push(starName+'이 '+stars.length+'곳에 있어서 연애와 관계가 삶에서 차지하는 비중이 커. 끌리는 사람도, 다가오는 사람도 많은 편이야.');cautions.push('관계에 마음을 많이 쓰는 만큼, 상대 기분이 내 하루를 좌우하지 않게 내 일정 하나는 지켜 둬.');ev.push(starName+' '+stars.length+'곳');}
  else{var first=stars.filter(function(s){return s.key!=='day';})[0]||stars[0];
    lines.push({month:'배우자 별이 월주에 있어서, 일하고 사회생활을 하는 자리에서 인연이 닿기 쉬워.',year:'배우자 별이 년주에 있어서, 일찍부터 연애에 관심이 많거나 주변 소개로 인연이 이어지기 쉬워.',hour:'배우자 별이 시주에 있어서, 연애는 천천히 무르익고 정착은 늦게 하는 편이 맞아.',day:'배우자 별이 바로 내 옆자리(일지)에 있어서, 가까운 사람에게 마음을 깊게 두는 편이야.'}[first.key]);
    ev.push(starName+' '+stars.map(function(s){return POS[s.key]+(s.layer==='천간'?'천간':'지지')+' '+s.god;}).join(', '));}
  if(mix){lines.push((female?'정관과 편관이':'정재와 편재가')+' 같이 있어서, 안정적인 사람과 자극적인 사람 사이에서 마음이 오가기 쉬워.');cautions.push('끌림이 클수록 3개월은 생활 습관(연락·돈·약속)을 지켜보고 결정해.');}
  /* 끌리는 타입 / 잘 맞는 타입 */
  var T=TYPE[female?'female':'male'],main=Object.keys(kinds).sort(function(a,b){return kinds[b]-kinds[a];})[0];
  var pull=main?T[main]:(female?T.정관:T.정재);
  var fit=NEED[thin];
  /* 배우자 자리와 다른 기둥의 관계 */
  ['month','year','hour'].forEach(function(k){var p=c.pillars[k];if(!p)return;rels(p,day).forEach(function(r){if(r.layer!=='지지')return;
    if(r.type==='충'){cautions.push(k==='month'?'일과 연애가 서로 시간을 뺏기 쉬운 구조야. 바쁜 시기엔 바쁘다고 먼저 말해 두는 게 관계를 지켜.':k==='year'?'집안·주변 사람의 의견이 연애에 끼어들기 쉬워. 둘의 결정은 둘이 먼저 정하고 알려.':'미래 계획(결혼 시기·사는 곳)에서 생각이 갈리기 쉬워. 큰 계획은 일찍 맞춰 봐.');ev.push(POS[k]+' '+p.branch+' ↔ 일지 '+day.branch+' 충');}
    else if(r.type==='육합'){lines.push(k==='month'?'일터나 소속에서 인연이 이어지기 쉬운 구조야.':k==='year'?'소개나 오래 알던 사이에서 인연이 이어지기 쉬워.':'함께 미래를 그리는 사람과 오래 가는 편이야.');ev.push(POS[k]+' '+p.branch+' ↔ 일지 '+day.branch+' 합');}
    else if(r.type==='형'||r.type==='원진'||r.type==='해'){cautions.push('가까운 사이에서 같은 서운함이 되풀이되기 쉬워. 같은 일이 두 번 반복되면 그때 규칙으로 정해.');ev.push(POS[k]+' '+p.branch+' ↔ 일지 '+day.branch+' '+r.type);}
  });});
  /* 10년 안에서 관계 이야기가 진지해지기 쉬운 해 */
  fromYear=fromYear||new Date().getFullYear();var good=[],want=female?['정관','편관']:['정재','편재'];
  for(var y=fromYear;y<fromYear+10;y++){var yp=null;try{yp=S.calendarPillars(y,7,1).year;}catch(_e){}if(!yp)continue;
    var why=[];var g=godAt(c,yp.stemIndex);if(want.indexOf(g)>=0)why.push(g+' 해');
    rels(day,yp).forEach(function(r){if(r.layer==='지지'&&r.type==='육합')why.push('일지 합');});
    if(why.length)good.push({year:y,ko:yp.stem+yp.branch,why:why.join('·')});}
  var age=fromYear-Number((c.input||{}).year||fromYear);
  /* 대화 문장 */
  var script=female?(main==='편관'?'“나는 끌려가는 것보다 같이 정하는 게 좋아. 중요한 건 같이 정하자.”':'“약속이 바뀔 땐 미리 한 줄만 남겨 줘. 그거면 돼.”'):(main==='편재'?'“같이 새로운 거 하는 것도 좋지만, 한 달에 한 번은 우리 계획 얘기하자.”':'“나는 큰 이벤트보다 매일 연락이 더 좋아.”');
  return {female:female,dayGod:dayGod,stars:stars,mix:!!mix,pull:pull,fit:fit,thin:thin,lines:lines.filter(Boolean),cautions:cautions.filter(function(x,i,a){return a.indexOf(x)===i;}).slice(0,3),years:good.slice(0,4),age:age,script:script,evidence:ev};
}

/* ---------- 화면 ---------- */
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];});}
function cardHTML(R,name){
  var yrs=R.years.length?'<div class="gldBox"><b>관계 이야기가 진지해지기 쉬운 해</b><p>'+R.years.map(function(x){return x.year+'('+esc(x.why)+')';}).join(' · ')+'</p><p class="gldS">이 해에 인연이 “생긴다”는 뜻이 아니라, 만남·결혼·정리 같은 관계 결정이 자주 화제가 되는 해야.</p></div>':'';
  return '<section class="gldCard" data-gld="1" data-polish-skip="1"><div class="mini">연애·결혼 깊게 보기</div><h3>'+esc(name)+'님의 사랑 방식과 맞는 사람</h3>'
    +R.lines.map(function(x){return '<p>'+esc(x)+'</p>';}).join('')
    +'<div class="gldPair"><div><b>끌리는 사람</b><p>'+esc(R.pull)+'</p></div><div><b>오래 편한 사람</b><p>'+esc(R.fit)+'</p></div></div>'
    +(R.pull&&R.fit?'<p class="gldS">끌리는 사람과 오래 편한 사람이 다를 수 있어. 처음엔 끌림으로 시작해도, 고를 땐 오른쪽 기준을 한 번 더 봐.</p>':'')
    +(R.cautions.length?'<div class="gldBox warn"><b>반복되기 쉬운 지점</b><ul>'+R.cautions.map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ul></div>':'')
    +yrs
    +'<div class="gldBox"><b>이렇게 말해 봐</b><p>'+esc(R.script)+'</p></div>'
    +'<details class="gldEv"><summary>명리 근거 보기</summary><p>'+esc(R.evidence.join(' · '))+'</p></details></section>';
}
var CSS='#resultView.gR1 > .gldCard{order:4}#resultView .gldCard{margin:14px 0;padding:18px 16px;border-radius:18px;background:#fdf7f8;border:1px solid #f1dfe3}#resultView .gldCard .mini{font-size:12px;color:#a0566a;font-weight:700;margin-bottom:6px}#resultView .gldCard h3{font-size:18px;margin:0 0 8px}'
 +'#resultView .gldCard p{font-size:14px;line-height:1.65;margin:6px 0;color:#3f3a3b}#resultView .gldCard p.gldS{font-size:12.5px;color:#7a6f72}'
 +'#resultView .gldPair{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:10px 0}#resultView .gldPair>div{background:#fff;border:1px solid #f0e2e5;border-radius:12px;padding:10px}#resultView .gldPair b,#resultView .gldBox b{font-size:13px;color:#a0566a}#resultView .gldCard .gldPair p{font-size:13.5px;margin:4px 0 0}'
 +'#resultView .gldBox{background:#fff;border:1px solid #f0e2e5;border-radius:12px;padding:10px 12px;margin:10px 0}#resultView .gldBox.warn b{color:#9a5a17}#resultView .gldBox ul{margin:6px 0 0;padding-left:18px}#resultView .gldBox li{font-size:13.5px;line-height:1.6;margin:3px 0}#resultView .gldCard .gldBox p{margin:4px 0 0}'
 +'#resultView .gldEv summary{font-size:12px;color:#a0566a;cursor:pointer}#resultView .gldCard .gldEv p{font-size:12px;color:#7a6f72}';
function ensureCss(){if(root.document.getElementById('gldCss'))return;var s=root.document.createElement('style');s.id='gldCss';s.textContent=CSS;root.document.head.appendChild(s);}
function currentChart(){try{return typeof chart!=='undefined'?chart:null;}catch(_e){return null;}}
function anchor(view){var hs=view.querySelectorAll('h3,h4');for(var i=0;i<hs.length;i++){if(/^4\.\s*주는 건/.test((hs[i].textContent||'').trim()))return hs[i].closest('article,section');}return null;}
function matchOrder(el,ref){try{var o=root.getComputedStyle(ref).order;if(o&&o!=='0')el.style.order=o;}catch(_e){}}
function enhance(){
  if(root.GUIIN_LOVE_DEEP_OFF||!root.document)return;
  var view=root.document.getElementById('resultView');if(!view||view.querySelector('[data-gld]'))return;
  var a=anchor(view);if(!a||!a.parentNode)return;
  var c=currentChart();var R=null;try{R=read(c);}catch(e){try{console.warn('GUIIN_LOVE_DEEP',e);}catch(_){}}
  if(!R||R.age<16)return;
  ensureCss();var h=root.document.createElement('div');h.innerHTML=cardHTML(R,(c.input&&c.input.name)||'너');
  var card=h.firstChild;a.parentNode.insertBefore(card,a.nextSibling);matchOrder(card,a);
}
if(root.document&&root.MutationObserver){
  var pending=false;
  var mo=new root.MutationObserver(function(){if(pending)return;pending=true;root.requestAnimationFrame(function(){pending=false;try{enhance();}catch(_e){}});});
  var start=function(){try{mo.observe(root.document.body,{childList:true,subtree:true});enhance();}catch(_e){}};
  if(root.document.body)start();else root.document.addEventListener('DOMContentLoaded',start);
}
root.GuiinLoveDeep={read:read,version:'love-deep-v1'};
})(typeof globalThis!=='undefined'?globalThis:this);
