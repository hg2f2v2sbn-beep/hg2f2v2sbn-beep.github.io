/* 귀인사주 한눈에 보는 나 v1 (2026-10-31)
 * 풀이 맨 위에 "넌 이런 사람이야"를 짧은 문장 9개로 먼저 보여 준다.
 * 사람 / 성격 / 장점 / 남들이 느끼는 매력 / 잘 맞는 일 / 지금 대운 / 잘 맞는 사람 / 감정 패턴 / 답답해지는 순간
 * 문장마다 근거(일간, 가장 큰 십성, 가장 얇은 십성, 현재 대운, 신살, 오행 비율)를 작게 붙인다.
 * 감정 문장은 진단이 아니라 기분 흐름의 경향으로만 쓴다.
 * 전체 풀이의 "핵심 결론" 섹션 바로 앞에 붙는다. 끄려면 window.GUIIN_PORTRAIT_OFF = true
 */
(function(root){
'use strict';
if(root.GuiinPortrait)return;
var GROUP={비견:'비겁',겁재:'비겁',식신:'식상',상관:'식상',편재:'재성',정재:'재성',편관:'관성',정관:'관성',편인:'인성',정인:'인성'};
var KEYS=['year','month','day','hour'];
var STEM={
 갑:{el:'목',who:'한번 정하면 앞장서서 길을 여는 사람',pers:'생각보다 행동이 먼저고, 돌려 말하는 걸 답답해해.',str:'망설이는 사람들 앞에서 먼저 방향을 잡아 주는 추진력',charm:'같이 있으면 "일단 해 보자"는 힘이 생겨서 믿고 따라가고 싶어져.',stuck:'정한 방향이 흐지부지되거나, 결정을 계속 미루는 사람 옆에 있을 때'},
 을:{el:'목',who:'부드럽게 휘어도 끝내 자기 자리를 찾아가는 사람',pers:'겉으로는 잘 맞춰 주지만 속으로는 원하는 방향이 분명해.',str:'부딪히지 않고 둘 다 사는 길을 찾는 조율력',charm:'곁에 있으면 긴장이 풀리고 편하게 말하게 돼.',stuck:'누군가 불편한 채로 남아 있는데 풀 방법이 안 보일 때'},
 병:{el:'화',who:'어디서든 분위기를 먼저 데우는 사람',pers:'감정이 얼굴과 말에 바로 드러나고, 좋으면 확 좋아.',str:'굳은 자리를 먼저 풀고 사람 마음을 여는 밝은 에너지',charm:'같이 있으면 기분이 올라가서 자꾸 찾게 돼.',stuck:'내가 한 말에 반응이 없거나, 무거운 분위기가 길어질 때'},
 정:{el:'화',who:'한 사람을 오래 헤아리는 따뜻한 사람',pers:'티는 안 내도 속으로 계속 살피고 신경 써.',str:'말하지 않은 마음까지 알아채는 섬세함',charm:'"이 사람은 나를 봐 주고 있구나" 하는 안정감을 줘.',stuck:'누군가 마음에 걸리는데 확인할 수가 없을 때'},
 무:{el:'토',who:'흔들려도 중심을 지키는 산 같은 사람',pers:'말수는 적어도 한번 맡으면 끝까지 책임져.',str:'모두가 당황할 때 현실을 붙잡고 정리하는 든든함',charm:'기대도 될 것 같은 묵직한 믿음을 줘.',stuck:'내 몫의 부담만 늘어나는데 아무도 알아주지 않을 때'},
 기:{el:'토',who:'빠진 칸을 조용히 채워서 일이 굴러가게 하는 사람',pers:'큰소리보다 실제로 되는 게 중요하고, 챙길 게 늘 머릿속에 있어.',str:'작은 것까지 챙겨서 결과로 만드는 실무력',charm:'같이 일하면 "이 사람 있으면 안심"이라는 느낌을 줘.',stuck:'열심히 챙긴 건 티가 안 나고, 하나 빠진 것만 지적받을 때'},
 경:{el:'금',who:'애매한 걸 시원하게 끝내 주는 사람',pers:'기준이 분명하고, 아닌 건 아니라고 말해.',str:'흐릿한 상황을 단번에 정리하는 결단력',charm:'말이 시원하고 뒤끝 없는 사람이라는 인상을 줘.',stuck:'결론 없이 시간만 끌거나 약속이 슬쩍 바뀔 때'},
 신:{el:'금',who:'마지막 한 군데까지 확인하는 섬세한 완벽주의자',pers:'대충은 못 넘기고, 작은 어긋남이 먼저 눈에 들어와.',str:'완성도를 끌어올리는 예리한 눈',charm:'깔끔하고 세련됐다는 인상을 줘서 믿고 맡기고 싶어져.',stuck:'고치고 싶은데 손댈 수 없는 일이 눈앞에 있을 때'},
 임:{el:'수',who:'여러 사정을 한꺼번에 품는 넓은 사람',pers:'생각의 폭이 넓고, 한쪽으로 단정하는 걸 싫어해.',str:'서로 다른 입장을 한 줄로 이어 주는 이해력',charm:'말이 잘 통하고, 뭐든 얘기해도 받아 줄 것 같은 여유를 줘.',stuck:'선택지는 많은데 당장 결정을 내려야 할 때'},
 계:{el:'수',who:'분위기의 변화를 누구보다 먼저 읽는 사람',pers:'조용해 보여도 속으로는 많은 걸 느끼고 정리하고 있어.',str:'말 안 해도 불편한 기류를 먼저 알아채는 감지력',charm:'같이 있으면 편하고, 내 마음을 알아줄 것 같은 느낌을 줘.',stuck:'어색한 공기가 안 풀리거나, 상대 마음을 확인 못 했을 때'}};
var GTOP={
 비겁:{pers:'자존심이 세고, 내 방식대로 하고 싶은 마음이 커.',work:'내 이름으로 하는 일, 혼자 굴릴 수 있는 일(프리랜서·창업·전문직)',stuck:'남이 내 영역에 간섭할 때'},
 식상:{pers:'하고 싶은 말과 아이디어가 많아서 가만히 있는 걸 못 견뎌.',work:'말·글·기획·콘텐츠처럼 머릿속에 있는 걸 결과물로 꺼내는 일',stuck:'말해도 바뀌지 않는 구조 안에 갇혀 있을 때'},
 재성:{pers:'현실 감각이 빠르고, 손익 계산이 자연스럽게 돼.',work:'영업·유통·재무·사업처럼 성과가 숫자로 보이는 일',stuck:'노력에 비해 결과가 손에 안 잡힐 때'},
 관성:{pers:'책임감이 강하고, 맡은 역할은 끝까지 해내려 해.',work:'조직·공공기관·관리직처럼 역할과 기준이 분명한 일',stuck:'규칙이 흐리고 누가 책임질지 정해지지 않을 때'},
 인성:{pers:'생각이 깊고, 이해가 돼야 움직여.',work:'연구·교육·상담·자격이 필요한 분야처럼 깊이 파는 일',stuck:'충분히 생각할 시간 없이 바로 결정을 요구받을 때'}};
var LUCK={
 비겁:'남과 비교되면서 "나도 뭔가 해내야 한다"는 조급함이 생기기 쉬운 시기야.',
 식상:'지금 하는 걸 바꾸고 싶고 하고 싶은 말이 많아져서, 틀에 갇힌 느낌이 답답할 수 있어.',
 재성:'돈을 모아야 한다, 현실을 챙겨야 한다는 압박감이 들기 쉬운 시기야.',
 관성:'책임과 평가가 커져서 "잘해야 한다"는 부담이 늘 따라다니기 쉬워.',
 인성:'생각이 많아지고 배우고 싶은 게 늘지만, 실행이 늦어져서 스스로 답답할 수 있어.'};
var NEED={
 비겁:'내 편이 되어 주고 내 기준을 존중해 주는 사람',
 식상:'편하게 웃고 표현할 수 있게 해 주는 사람',
 재성:'현실 감각이 있어서 생활을 같이 굴러가게 하는 사람',
 관성:'적당한 책임감과 약속을 지키는 사람',
 인성:'말없이 기다려 주고 생각할 시간을 주는 사람'};

function G(){return root.GuiinSaju;}
function mainHidden(bi){var S=G(),h=S.HIDDEN_STEMS&&S.HIDDEN_STEMS[bi];if(!h||!h.length)return -1;var x=h[0];return Array.isArray(x)?Number(x[0]):typeof x==='number'?x:(x&&x.stemIndex!=null?x.stemIndex:-1);}
function godAt(c,si){return si>=0?G().tenGod(c.pillars.day.stemIndex,si):null;}
function census(c){
  var cnt={비겁:0,식상:0,재성:0,관성:0,인성:0},gods={},tot=0;
  KEYS.forEach(function(k){var p=c.pillars[k];if(!p)return;
    if(k!=='day'){var g=godAt(c,p.stemIndex);if(GROUP[g]){cnt[GROUP[g]]++;tot++;gods[g]=(gods[g]||0)+1;}}
    var g2=godAt(c,mainHidden(p.branchIndex));if(GROUP[g2]){cnt[GROUP[g2]]++;tot++;gods[g2]=(gods[g2]||0)+1;}});
  var pct={};Object.keys(cnt).forEach(function(k){pct[k]=tot?Math.round(cnt[k]/tot*100):0;});
  var order=Object.keys(pct).sort(function(a,b){return pct[b]-pct[a];}),asc=Object.keys(pct).sort(function(a,b){return pct[a]-pct[b];});
  var mg=c.pillars.month?godAt(c,c.pillars.month.stemIndex):null;
  return {pct:pct,gods:gods,top:order[0],thin:asc[0],monthGod:mg};
}
function elPct(c){var e=c.elCount||{},t=0;Object.keys(e).forEach(function(k){t+=Number(e[k])||0;});var o={};Object.keys(e).forEach(function(k){o[k]=t?Math.round(e[k]/t*100):0;});return o;}
function starNames(c){var h=(c.stars&&c.stars.hits)||[];var o={};h.forEach(function(x){o[x.name]=1;});return o;}
function ageNow(c){var I=c.input||{};return (Date.now()-new Date(I.year,(I.month||1)-1,I.day||1).getTime())/(365.2425*86400000);}
function curLuck(c){var a=ageNow(c);return (c.luck||[]).find(function(l){var f=Number(l.fromAgeExact!=null?l.fromAgeExact:l.fromAge),t=Number(l.toAgeExact!=null?l.toAgeExact:l.toAge);return f<=a&&a<t;})||null;}

function read(c){
  if(!c||!c.pillars||!c.pillars.day||!G())return null;
  var stem=c.pillars.day.stem,S=STEM[stem];if(!S)return null;
  var cs=census(c),el=elPct(c),st=starNames(c),T=GTOP[cs.top],yang='갑병무경임'.indexOf(stem)>=0;
  var rows=[];
  rows.push({k:'넌 이런 사람이야',t:S.who+'이야.',ev:stem+S.el+' 일간'});
  rows.push({k:'성격',t:S.pers+' '+T.pers,ev:'일간 + 가장 큰 힘 '+cs.top+' '+cs.pct[cs.top]+'%'});
  rows.push({k:'장점',t:S.str+'이 네 무기야.',ev:stem+S.el+' 일간'});
  rows.push({k:'남들이 느끼는 매력',t:S.charm,ev:stem+S.el+' 일간'+(st['도화살']?' · 도화살':'')});
  if(st['도화살'])rows[3].t+=' 처음 본 사람도 눈길이 가는 끌림이 있는 편이야.';
  rows.push({k:'잘 맞는 일',t:T.work+'에서 힘이 제일 잘 나와.',ev:'가장 큰 힘 '+cs.top});
  var L=curLuck(c);
  if(L&&GROUP[L.god]){var lg=GROUP[L.god],extra=cs.pct[lg]<=10?' 원래 익숙하지 않은 힘이라 더 크게 느껴질 수 있어.':'';
    rows.push({k:'지금 대운',t:'지금 '+(L.stem+L.branch)+' 대운은 '+LUCK[lg]+extra,ev:'현재 대운 '+L.stem+L.branch+'('+L.god+')'});}
  rows.push({k:'잘 맞는 사람',t:'넌 '+NEED[cs.thin]+'이랑 잘 맞아.',ev:'가장 얇은 힘 '+cs.thin+' '+cs.pct[cs.thin]+'%를 채워 주는 사람'});
  /* 감정 패턴: 신살·오행·십성 신호에서 최대 2개 */
  var mood=[],mev=[];
  if(st['귀문관살']){mood.push('생각이 많아지는 밤이면 감정이 가라앉거나 예민해질 수 있어.');mev.push('귀문관살');}
  if((el['화']||0)>=30||(cs.gods['상관']||0)>=2||cs.monthGod==='상관'){mood.push('참다가 한 번에 욱하는 면이 있어. 대신 금방 식는 편이야.');mev.push((el['화']||0)>=30?'화 '+el['화']+'%':'상관');}
  else if(cs.top==='관성'&&cs.gods['편관']){mood.push('압박이 쌓이면 예민해지고 말이 짧아져.');mev.push('편관');}
  if(mood.length<2&&((el['수']||0)>=30||cs.top==='인성')){mood.push('혼자 있는 시간에 생각이 깊어져서 감정이 오래 가는 편이야.');mev.push((el['수']||0)>=30?'수 '+el['수']+'%':'인성');}
  if(mood.length<2&&st['원진살']){mood.push('가까운 사람에게 이유 없이 서운함이 쌓이는 날이 있어.');mev.push('원진살');}
  if(!mood.length){mood.push(yang?'감정이 빨리 끓고 빨리 식는 편이야.':'겉으로는 괜찮은 척해도 속으로 오래 담아 두는 편이야.');mev.push(yang?'양간':'음간');}
  rows.push({k:'감정 패턴',t:mood.slice(0,2).join(' '),ev:mev.slice(0,2).join(' · ')});
  rows.push({k:'이럴 때 답답해',t:S.stuck+', 그리고 '+T.stuck+' 제일 답답해.',ev:'일간 + '+cs.top});
  return {stem:stem,rows:rows};
}

/* ---------- 화면 ---------- */
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];});}
function cardHTML(R,name,full){
  var FREE=4;
  var rows=R.rows.map(function(r,i){if(!full&&i>=FREE)return '<li class="lock"><b>'+esc(r.k)+'</b><p>평생사주에서 열려</p></li>';return '<li><b>'+esc(r.k)+'</b><p>'+esc(r.t)+'</p><span>근거 · '+esc(r.ev)+'</span></li>';}).join('');
  return '<section class="gptrCard" data-gptr="1" data-full="'+(full?1:0)+'" data-polish-skip="1"><div class="mini">한눈에 보는 나</div><h3>'+esc(name)+', 넌 이런 사람이야</h3>'
    +'<ul class="gptrList">'+rows+'</ul>'
    +(full?'<p class="gptrNote">아래부터는 이 문장들이 왜 나왔는지, 일·관계·돈·시기별로 자세히 풀어 줄게.</p>':'<button type="button" class="gptrBuy" data-gptr-buy="1">잘 맞는 일·지금 대운·감정 패턴까지 보기 ›</button>')+'</section>';
}
var CSS='#resultView.gR1 > .gptrCard{order:4}#resultView .gptrCard{margin:14px 0;padding:20px 16px;border-radius:20px;background:linear-gradient(180deg,#fffaf0,#fdf5e6);border:1px solid #efdfbf}'
 +'#resultView .gptrCard .mini{font-size:12px;color:#a07a2c;font-weight:800;margin-bottom:6px}#resultView .gptrCard h3{font-size:19px;margin:0 0 10px;color:#2f2a20}'
 +'#resultView .gptrList{list-style:none;margin:0;padding:0}#resultView .gptrList li{padding:11px 0;border-top:1px solid #f0e4cb}#resultView .gptrList li:first-child{border-top:0}'
 +'#resultView .gptrList b{display:block;font-size:12.5px;color:#a07a2c;margin-bottom:3px}#resultView .gptrCard .gptrList p{font-size:15px;line-height:1.6;margin:0;color:#2b2720;font-weight:600}'
 +'#resultView .gptrList li.lock{opacity:.5}#resultView .gptrCard .gptrBuy{width:100%;margin-top:12px;padding:12px;border:0;border-radius:12px;background:#2f5d46;color:#fff;font-weight:700;font-size:14px}#resultView.gR1 > .gptrCard.free{order:0}'
 +'#resultView .gptrList span{display:block;font-size:11.5px;color:#9b9180;margin-top:3px}#resultView .gptrCard p.gptrNote{font-size:12.5px;color:#7d7362;margin:10px 0 0}';
function ensureCss(){if(root.document.getElementById('gptrCss'))return;var s=root.document.createElement('style');s.id='gptrCss';s.textContent=CSS;root.document.head.appendChild(s);}
function currentChart(){try{return typeof chart!=='undefined'?chart:null;}catch(_e){return null;}}
function anchor(view){var hs=view.querySelectorAll('h3,h4');for(var i=0;i<hs.length;i++){if(/^핵심 결론/.test((hs[i].textContent||'').trim()))return hs[i].closest('article,section');}return null;}
function paid(){try{return !!(typeof GUIIN_VERIFIED_ENTITLEMENTS!=='undefined'&&GUIIN_VERIFIED_ENTITLEMENTS.lifetimeSaju);}catch(_e){return false;}}
function tabNow(){try{return typeof currentTab!=='undefined'?currentTab:'summary';}catch(_e){return 'summary';}}
function enhance(){
  if(root.GUIIN_PORTRAIT_OFF||!root.document)return;
  var view=root.document.getElementById('resultView');if(!view)return;
  var old=view.querySelector('[data-gptr]');
  if(tabNow()!=='summary'){if(old)old.remove();return;}
  var full=paid(),a=anchor(view),before=a;
  if(!a){var m=view.querySelector(':scope > .manseSnapshot');if(!m)return;before=m.nextElementSibling;full=false;}
  if(old&&old.getAttribute('data-full')===(full?'1':'0'))return;
  var c=currentChart();var R=null;try{R=read(c);}catch(e){try{console.warn('GUIIN_PORTRAIT',e);}catch(_){}}
  if(!R||!before||!before.parentNode)return;if(old)old.remove();ensureCss();
  var h=root.document.createElement('div');h.innerHTML=cardHTML(R,(c.input&&c.input.name)||'너',full);var card=h.firstChild;
  if(!a)card.classList.add('free');before.parentNode.insertBefore(card,before);
  try{var o=root.getComputedStyle(before).order;if(o&&o!=='0'&&!a)card.style.order=o;}catch(_e){}
}
function onClick(e){var t=e.target&&e.target.closest?e.target.closest('[data-gptr-buy]'):null;if(!t)return;try{if(typeof root.guiinPaymentCenterStart==='function')root.guiinPaymentCenterStart('LIFETIME_SAJU');}catch(_e){}}
if(root.document&&root.MutationObserver){
  var pending=false;
  var mo=new root.MutationObserver(function(){if(pending)return;pending=true;root.requestAnimationFrame(function(){pending=false;try{enhance();}catch(_e){}});});
  var start=function(){try{mo.observe(root.document.body,{childList:true,subtree:true});root.document.addEventListener('click',onClick);enhance();}catch(_e){}};
  if(root.document.body)start();else root.document.addEventListener('DOMContentLoaded',start);
}
root.GuiinPortrait={read:read,version:'portrait-v1'};
})(typeof globalThis!=='undefined'?globalThis:this);
