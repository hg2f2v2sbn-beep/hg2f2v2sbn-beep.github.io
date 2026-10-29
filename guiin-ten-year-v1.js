/* 귀인사주 앞으로 10년 흐름 v1 (2026-10-29)
 * 올해부터 10년 동안 해마다 들어오는 세운을 원국·현재 대운과 맞대어 한 줄씩 보여 주고,
 * "힘을 싣기 좋은 해 / 한 번 더 확인할 해 / 큰 흐름이 바뀌는 해"를 근거와 함께 고른다.
 * 좋은 해·나쁜 해로 자르지 않고, 어디에 힘을 쓰고 어디서 확인할지로 쓴다.
 * '인생 흐름' 탭의 신년운세 카드 바로 뒤에 붙는다. 무료 화면은 3년까지만 보여 준다.
 * 끄려면 window.GUIIN_TEN_YEAR_OFF = true
 */
(function(root){
'use strict';
if(root.GuiinTenYear)return;
var GROUP={비견:'비겁',겁재:'비겁',식신:'식상',상관:'식상',편재:'재성',정재:'재성',편관:'관성',정관:'관성',편인:'인성',정인:'인성'};
var WORD={비견:'내 기준',겁재:'경쟁·관계',식신:'꾸준한 생산',상관:'표현·변화',편재:'기회·활동',정재:'실속·관리',편관:'압박·책임',정관:'약속·평가',편인:'생각·탐구',정인:'배움·도움'};
var LINE={
 비견:'내 방식으로 해 보고 싶은 일이 늘어. 혼자 정하고 밀고 가는 연습을 하기 좋은 해야.',
 겁재:'함께하는 사람이 늘고 돈도 같이 움직여. 내 몫과 남의 몫을 처음부터 나눠 둬.',
 식신:'꾸준히 만든 게 결과로 남는 해야. 하던 일을 한 단계 키우기 좋아.',
 상관:'바꾸고 싶은 마음이 커지는 해야. 새 시도는 좋지만 말과 약속이 앞서지 않게 해.',
 편재:'기회와 활동이 넓어지는 해야. 움직인 만큼 들어오지만 돈과 시간의 한도를 먼저 정해.',
 정재:'실속을 쌓는 해야. 계획한 만큼 모이고 생활 기반을 다지기 좋아.',
 편관:'책임과 압박이 커지는 해야. 버틴 경험이 실력이 되지만 쉬는 시간을 먼저 막아 둬.',
 정관:'평가와 신뢰가 쌓이는 해야. 약속을 지킨 만큼 자리와 인정이 따라와.',
 편인:'생각을 정리하고 파고드는 해야. 준비와 공부에 좋지만 실행 날짜를 정해 둬.',
 정인:'배우고 도움받는 해야. 자격·문서·사람의 도움이 힘이 돼.'};
var LINE_TEEN={
 비견:'내 생각대로 해 보고 싶은 해야. 친구와 비교하는 마음은 조금 내려놔.',
 겁재:'친구와 함께하는 일이 늘어. 빌려주고 받는 건 분명하게 해.',
 식신:'좋아하는 걸 꾸준히 하면 실력이 쌓이는 해야.',
 상관:'표현하고 싶은 게 많아지는 해야. 말투만 챙기면 좋아.',
 편재:'관심사와 활동이 넓어지는 해야. 시간과 용돈의 한도를 정해.',
 정재:'공부 습관과 생활 리듬을 다지기 좋은 해야.',
 편관:'해야 할 일과 압박이 늘어. 잠과 쉬는 시간을 꼭 지켜.',
 정관:'규칙 안에서 인정받기 쉬운 해야.',
 편인:'관심 분야를 깊게 파고들기 좋은 해야.',
 정인:'공부와 주변 도움이 힘이 되는 해야.'};
var PLACE={year:'집안·바깥 관계',month:'일·소속',day:'가까운 관계와 내 컨디션',hour:'진로·계획'};
var LABEL={year:'년지',month:'월지',day:'일지',hour:'시지'};

function G(){return root.GuiinSaju;}
function ageAt(c,y){return y-Number((c.input||{}).year||y);}
function yearPillar(y){try{return G().calendarPillars(y,7,1).year;}catch(_e){return null;}}
function mainHidden(bi){var S=G(),h=S.HIDDEN_STEMS&&S.HIDDEN_STEMS[bi];if(!h||!h.length)return -1;var x=h[0];if(Array.isArray(x))return Number(x[0]);if(typeof x==='number')return x;if(x&&x.stemIndex!=null)return x.stemIndex;return S.STEMS.indexOf(x&&x.stem||x);}
function groupPct(c){
  var S=G(),ds=c.pillars.day.stemIndex,cnt={비겁:0,식상:0,재성:0,관성:0,인성:0},tot=0;
  ['year','month','day','hour'].forEach(function(k){var p=c.pillars[k];if(!p)return;
    if(k!=='day'){var g=GROUP[S.tenGod(ds,p.stemIndex)];if(g){cnt[g]++;tot++;}}
    var hs=mainHidden(p.branchIndex);if(hs>=0){var g2=GROUP[S.tenGod(ds,hs)];if(g2){cnt[g2]++;tot++;}}});
  var o={};Object.keys(cnt).forEach(function(k){o[k]=tot?Math.round(cnt[k]/tot*100):0;});return o;
}
function rels(a,b){try{return (G().chartRelations([a,null,null,b])||[]);}catch(_e){return [];}}
function lucks(c){return Array.isArray(c.luck)?c.luck:[];}
function luckAtYear(c,y){var by=Number((c.input||{}).year)||0;return lucks(c).find(function(l){var f=by+Number(l.fromAgeExact!=null?l.fromAgeExact:l.fromAge),t=by+Number(l.toAgeExact!=null?l.toAgeExact:l.toAge);return f<=y+0.5&&y+0.5<t;})||null;}
function luckStartYear(c,l){return Math.floor(Number((c.input||{}).year)+Number(l.fromAgeExact!=null?l.fromAgeExact:l.fromAge));}

function readYear(c,y,pct){
  var S=G(),p=yearPillar(y);if(!p)return null;
  var ds=c.pillars.day.stemIndex,god=S.tenGod(ds,p.stemIndex),grp=GROUP[god],teen=ageAt(c,y)<19;
  var push=[],check=[],ev=[];
  ['day','month','year','hour'].forEach(function(k){var np=c.pillars[k];if(!np)return;
    var hit={},stemHe=false;
    rels(np,p).forEach(function(r){
      if(r.layer==='지지'){
        if((r.type==='육합'||r.type==='삼합'||r.type==='반합')&&(k==='day'||k==='month'))hit.합=1;
        else if(r.type==='충'&&k!=='hour')hit.충=1;
        else if((r.type==='형'||r.type==='파')&&k==='day')hit[r.type]=1;
        else return;
        ev.push(y+' '+p.branch+' ↔ '+LABEL[k]+' '+np.branch+' '+r.type);
      } else if(r.type==='천간합'&&k==='day'){stemHe=true;ev.push(y+' '+p.stem+' ↔ 일간 '+np.stem+' 합');}
    });
    if(stemHe)push.push('나와 바로 묶이는 글자가 들어와(천간합)');
    var bad=['충','형','파'].filter(function(t){return hit[t];});
    if(hit.합&&bad.length)check.push(PLACE[k]+' 쪽에서 가까워지는 힘과 부딪힘이 같이 들어와(합·'+bad.join('·')+')');
    else if(hit.합)push.push(PLACE[k]+' 쪽에서 붙는 힘(합)이 생겨');
    else if(hit.충)check.push(PLACE[k]+' 쪽이 흔들려(충)');
    else if(bad.length)check.push(PLACE[k]+' 쪽에서 같은 문제가 되풀이되기 쉬워('+bad.join('·')+')');
  });
  var L=luckAtYear(c,y);
  if(L){rels(L,p).forEach(function(r){if(r.layer==='지지'&&r.type==='충'){check.push('10년 흐름(대운)과 올해 흐름이 서로 부딪혀');ev.push(y+' '+p.branch+' ↔ 대운 '+L.branch+' 충');}});}
  var turn=false;lucks(c).forEach(function(l){if(luckStartYear(c,l)===y&&Number(l.fromAge)>0){turn=l;}});
  if(pct[grp]<=10&&!check.length){push.push('원국에 얇던 '+grp+' 힘이 채워져');ev.push('원국 '+grp+' '+pct[grp]+'%');}
  var seen={};push=push.filter(function(x){if(seen[x])return false;seen[x]=1;return true;});check=check.filter(function(x){if(seen[x])return false;seen[x]=1;return true;});
  var score=push.length*2-check.length*2;
  return {year:y,ko:p.stem+p.branch,god:god,word:WORD[god],line:(teen?LINE_TEEN:LINE)[god],push:push,check:check,turn:turn?{ko:turn.stem+turn.branch,god:turn.god}:null,score:score,evidence:ev,age:ageAt(c,y)};
}
function read(c,from){
  if(!c||!c.pillars||!c.pillars.day||!G())return null;
  from=from||new Date().getFullYear();var pct=groupPct(c),rows=[];
  for(var y=from;y<from+10;y++){var r=readYear(c,y,pct);if(r)rows.push(r);}
  var push=rows.filter(function(r){return r.push.length&&r.score>0;}).sort(function(a,b){return b.score-a.score||a.year-b.year;}).slice(0,3).sort(function(a,b){return a.year-b.year;});
  var check=rows.filter(function(r){return r.check.length;}).sort(function(a,b){return a.score-b.score||a.year-b.year;}).slice(0,3).sort(function(a,b){return a.year-b.year;});
  var turns=rows.filter(function(r){return r.turn;});
  return {rows:rows,push:push,check:check,turns:turns,pct:pct};
}

/* ---------- 화면 ---------- */
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];});}
function paid(){try{return !!(typeof GUIIN_VERIFIED_ENTITLEMENTS!=='undefined'&&GUIIN_VERIFIED_ENTITLEMENTS.lifetimeSaju);}catch(_e){return false;}}
function rowHTML(r,locked){
  var tags=(r.turn?'<em class="gtyTag turn">대운 바뀜</em>':'')+(r.push.length&&r.score>0?'<em class="gtyTag push">힘 싣기</em>':'')+(r.check.length?'<em class="gtyTag check">한 번 더 확인</em>':'');
  if(locked)return '<li class="gtyRow locked"><div class="gtyY"><b>'+r.year+'</b><span>'+esc(r.ko)+'</span></div><div class="gtyB"><p class="gtyW">'+esc(r.god)+' · '+esc(r.word)+'</p><p class="gtyL">평생사주에서 열려</p></div></li>';
  var why=r.push.concat(r.check);
  return '<li class="gtyRow"><div class="gtyY"><b>'+r.year+'</b><span>'+esc(r.ko)+'</span></div><div class="gtyB"><p class="gtyW">'+esc(r.god)+' · '+esc(r.word)+tags+'</p><p class="gtyL">'+esc(r.line)+'</p>'
    +(r.turn?'<p class="gtyX">이해부터 10년 흐름이 '+esc(r.turn.ko)+' 대운('+esc(r.turn.god)+')으로 바뀌어. 지난 10년의 방식을 한 번 정리하기 좋은 때야.</p>':'')
    +(why.length?'<p class="gtyX">'+esc(why.join(', '))+'.</p>':'')+'</div></li>';
}
function pickLine(list,label,turn){if(!list.length)return '';return '<div class="gtyPick"><b>'+label+'</b><span>'+list.map(function(r){return r.year+'('+(turn&&r.turn?esc(r.turn.ko)+' 대운 시작':esc(r.god))+')';}).join(' · ')+'</span></div>';}
function cardHTML(R,name){
  var isPaid=paid(),FREE=3;
  var rows=R.rows.map(function(r,i){return rowHTML(r,!isPaid&&i>=FREE);}).join('');
  var summary=isPaid?('<div class="gtyPicks">'+pickLine(R.push,'힘을 싣기 좋은 해')+pickLine(R.check,'한 번 더 확인할 해')+pickLine(R.turns,'큰 흐름이 바뀌는 해',true)+'</div>'):'';
  var ev=isPaid?'<details class="gtyEv"><summary>명리 근거 보기</summary><p>'+esc(R.rows.map(function(r){return r.evidence.join(', ');}).filter(Boolean).join(' / ')||'원국·대운과 크게 걸리는 해가 적어.')+'</p></details>':'';
  var cta=isPaid?'':'<div class="gtyCta"><button type="button" data-gty-buy="1">나머지 7년과 해별 근거 보기 ›</button></div>';
  return '<section class="gtyCard" data-gty="1"><div class="mini">앞으로 10년 · 해마다 한 줄</div><h3>'+esc(name)+'님의 '+R.rows[0].year+'~'+R.rows[R.rows.length-1].year+'년</h3>'
    +'<p class="gtyLead">해마다 들어오는 글자를 원국·지금 대운과 맞대어 봤어. 좋은 해·나쁜 해가 아니라, 어디에 힘을 싣고 어디서 한 번 더 확인할지로 읽어 줘.</p>'
    +summary+'<ol class="gtyList">'+rows+'</ol>'+ev+cta+'</section>';
}
var CSS='#resultView .gtyCard{margin:14px 0;padding:18px 16px;border-radius:18px;background:#f7faf8;border:1px solid #dfeae3}#resultView .gtyCard .mini{font-size:12px;color:#5b7d6a;font-weight:700;margin-bottom:6px}#resultView .gtyCard h3{font-size:18px;margin:0 0 8px}'
 +'#resultView .gtyCard p.gtyLead{font-size:13.5px;line-height:1.6;color:#59615c;margin:0 0 10px}#resultView .gtyPicks{display:grid;gap:6px;margin:6px 0 12px}#resultView .gtyPick{display:flex;gap:8px;align-items:baseline;flex-wrap:wrap;font-size:13.5px;padding:8px 10px;border-radius:10px;background:#fff;border:1px solid #e3ece6}#resultView .gtyPick b{min-width:110px;color:#2f5d46}'
 +'#resultView .gtyList{list-style:none;margin:0;padding:0}#resultView .gtyRow{display:flex;gap:10px;padding:10px 0;border-top:1px solid #e6eee9}#resultView .gtyY{flex:0 0 52px}#resultView .gtyY b{display:block;font-size:15px}#resultView .gtyY span{font-size:12px;color:#8a948e}#resultView .gtyB{flex:1;min-width:0}'
 +'#resultView .gtyCard p.gtyW{font-size:14px;font-weight:700;margin:0 0 3px;line-height:1.5}#resultView .gtyCard p.gtyL{font-size:13.5px;line-height:1.6;margin:0;color:#3d443f}#resultView .gtyCard p.gtyX{font-size:12.5px;line-height:1.55;margin:4px 0 0;color:#6b736e}'
 +'#resultView .gtyCard em.gtyTag{display:inline-block!important;width:auto!important;font-style:normal;font-size:11px;font-weight:700;padding:1px 7px;border-radius:999px;margin-left:6px;vertical-align:1px}#resultView .gtyTag.push{background:#e3f3e8;color:#23704a}#resultView .gtyTag.check{background:#fbefe2;color:#9a5a17}#resultView .gtyTag.turn{background:#ece8fb;color:#5543a8}'
 +'#resultView .gtyRow.locked{opacity:.55}#resultView .gtyEv summary{font-size:12px;color:#5b7d6a;cursor:pointer;margin-top:8px}#resultView .gtyCard .gtyEv p{font-size:12px;color:#6b736e;margin:4px 0 0;line-height:1.5}#resultView .gtyCta button{width:100%;margin-top:10px;padding:11px;border-radius:12px;border:0;background:#2f5d46;color:#fff;font-weight:700;font-size:14px}';
function ensureCss(){if(root.document.getElementById('gtyCss'))return;var s=root.document.createElement('style');s.id='gtyCss';s.textContent=CSS;root.document.head.appendChild(s);}
function currentChart(){try{return typeof chart!=='undefined'?chart:null;}catch(_e){return null;}}
function tabNow(){try{return typeof currentTab!=='undefined'?currentTab:'';}catch(_e){return '';}}
function keyOf(c){var I=c.input||{};return [I.year,I.month,I.day,I.hour,I.minute,I.gender,paid()?'p':'f'].join('-');}
function matchOrder(el,ref){try{var o=root.getComputedStyle(ref).order;if(o&&o!=='0')el.style.order=o;}catch(_e){}}
function enhance(){
  if(root.GUIIN_TEN_YEAR_OFF||!root.document)return;
  var view=root.document.getElementById('resultView');if(!view)return;
  var old=view.querySelector('[data-gty]');
  if(tabNow()!=='flow'){if(old)old.remove();return;}
  var c=currentChart();if(!c)return;var k=keyOf(c);
  if(old&&old.getAttribute('data-k')===k)return;
  var anchor=view.querySelector(':scope > .guiinNewYear')||view.querySelector(':scope > .guiinDaeunHead');if(!anchor)return;
  var R=null;try{R=read(c);}catch(e){try{console.warn('GUIIN_TEN_YEAR',e);}catch(_){}}
  if(!R||!R.rows.length)return;
  if(old)old.remove();ensureCss();
  var holder=root.document.createElement('div');holder.innerHTML=cardHTML(R,(c.input&&c.input.name)||'너');
  var card=holder.firstChild;card.setAttribute('data-k',k);anchor.parentNode.insertBefore(card,anchor.nextSibling);matchOrder(card,anchor);
}
function onClick(e){var t=e.target&&e.target.closest?e.target.closest('[data-gty-buy]'):null;if(!t)return;try{if(typeof root.guiinPaymentCenterStart==='function')root.guiinPaymentCenterStart('LIFETIME_SAJU');}catch(_e){}}
if(root.document&&root.MutationObserver){
  var pending=false;
  var mo=new root.MutationObserver(function(){if(pending)return;pending=true;root.requestAnimationFrame(function(){pending=false;try{enhance();}catch(_e){}});});
  var start=function(){try{mo.observe(root.document.body,{childList:true,subtree:true});root.document.addEventListener('click',onClick);enhance();}catch(_e){}};
  if(root.document.body)start();else root.document.addEventListener('DOMContentLoaded',start);
}
root.GuiinTenYear={read:read,version:'ten-year-v1'};
})(typeof globalThis!=='undefined'?globalThis:this);
