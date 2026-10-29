/* 귀인사주 궁합 시기 겹쳐 보기 v1 (2026-10-29)
 * 두 사람에게 앞으로 10년 동안 해마다 들어오는 세운을 겹쳐 본다.
 *  - 그해 글자가 두 사람의 배우자 자리(일지)와 합/충인지
 *  - 배우자 별(여: 관성, 남: 재성)이 들어오는 해인지
 *  - 누구의 대운이 바뀌는 해인지, 두 사람이 같은 주제/반대 리듬인지
 * "관계 이야기를 꺼내기 좋은 해 / 흔들리기 쉬운 해 / 따로 바빠지기 쉬운 해"를 근거와 함께 고른다.
 * 결혼 성패·이별 여부는 단정하지 않는다. 궁합 요약 탭 하단(추가 질문 카드 앞)에 붙는다.
 * 끄려면 window.GUIIN_PAIR_TIMING_OFF = true
 */
(function(root){
'use strict';
if(root.GuiinPairTiming)return;
var GROUP={비견:'비겁',겁재:'비겁',식신:'식상',상관:'식상',편재:'재성',정재:'재성',편관:'관성',정관:'관성',편인:'인성',정인:'인성'};
var WORD={비겁:'내 기준',식상:'표현·변화',재성:'돈·현실',관성:'책임·평가',인성:'생각·배움'};
function G(){return root.GuiinSaju;}
function yp(y){try{return G().calendarPillars(y,7,1).year;}catch(_e){return null;}}
function rels(a,b){try{return G().chartRelations([a,null,null,b])||[];}catch(_e){return [];}}
function relTo(p,branchPillar){var out={};rels(branchPillar,p).forEach(function(r){if(r.layer==='지지')out[r.type]=1;});return out;}
function given(n){n=String(n||'').trim();if(/^[가-힣]{3}$/.test(n))return n.slice(1);return n||'상대';}
function josa(w,pair){var ch=w.charCodeAt(w.length-1);var has=ch>=0xAC00&&ch<=0xD7A3&&(ch-0xAC00)%28!==0;var p=pair.split('/');return w+(has?p[0]:p[1]);}
function female(c){return String((c.input||{}).gender||'')==='여';}
function luckStarts(c){var by=Number((c.input||{}).year)||0;return (c.luck||[]).map(function(l){return {y:Math.floor(by+Number(l.fromAgeExact!=null?l.fromAgeExact:l.fromAge)),ko:l.stem+l.branch,god:l.god};});}

function personYear(c,p){
  var S=G(),god=S.tenGod(c.pillars.day.stemIndex,p.stemIndex),grp=GROUP[god];
  var spouse=female(c)?grp==='관성':grp==='재성';
  var r=relTo(p,c.pillars.day);
  return {god:god,grp:grp,spouse:spouse,dayHe:!!r.육합,dayChung:!!r.충,dayHyung:!!(r.형||r.파)};
}
function read(a,b,from){
  if(!a||!b||!a.pillars||!b.pillars||!G())return null;
  from=from||new Date().getFullYear();
  var an=given((a.input||{}).name||'나'),bn=given((b.input||{}).name||'상대'),la=luckStarts(a),lb=luckStarts(b),rows=[];
  for(var y=from;y<from+10;y++){
    var p=yp(y);if(!p)continue;var A=personYear(a,p),B=personYear(b,p),good=[],shake=[],apart=[],note=[];
    if(A.spouse)good.push(an+'에게 배우자 별이 들어와');if(B.spouse)good.push(bn+'에게 배우자 별이 들어와');
    if(A.dayHe&&B.dayHe)good.push('두 사람의 배우자 자리가 함께 묶여(합)');else{if(A.dayHe)good.push(an+'의 배우자 자리가 묶여(합)');if(B.dayHe)good.push(bn+'의 배우자 자리가 묶여(합)');}
    if(A.dayChung)shake.push(josa(an,'의/의')+' 배우자 자리가 흔들려(충)');if(B.dayChung)shake.push(josa(bn,'의/의')+' 배우자 자리가 흔들려(충)');
    if(A.dayHyung&&!A.dayHe)shake.push(an+' 쪽에서 같은 서운함이 되풀이되기 쉬워');if(B.dayHyung&&!B.dayHe)shake.push(bn+' 쪽에서 같은 서운함이 되풀이되기 쉬워');
    var ta=la.filter(function(x){return x.y===y;})[0],tb=lb.filter(function(x){return x.y===y;})[0];
    if(ta)note.push(an+'의 10년 흐름이 '+ta.ko+' 대운으로 바뀌어');if(tb)note.push(bn+'의 10년 흐름이 '+tb.ko+' 대운으로 바뀌어');
    var busy=function(g){return g==='관성'||g==='재성';},rest=function(g){return g==='인성'||g==='비겁';};
    if((busy(A.grp)&&rest(B.grp))||(busy(B.grp)&&rest(A.grp)))apart.push(josa(busy(A.grp)?an:bn,'은/는')+' 바깥일이 커지고 '+josa(busy(A.grp)?bn:an,'은/는')+' 안으로 정리하고 싶은 해');
    var same=A.grp===B.grp;
    var tag=shake.length&&!good.length?'shake':good.length&&!shake.length?'good':good.length&&shake.length?'mixed':apart.length?'apart':note.length?'turn':'calm';
    rows.push({year:y,ko:p.stem+p.branch,A:A,B:B,good:good,shake:shake,apart:apart,note:note,same:same,tag:tag});
  }
  var pick=function(t){return rows.filter(function(r){return r.tag===t;}).map(function(r){return r.year;});};
  return {an:an,bn:bn,rows:rows,good:pick('good'),shake:pick('shake'),mixed:pick('mixed'),apart:pick('apart'),turn:pick('turn')};
}

/* ---------- 화면 ---------- */
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];});}
function paid(){try{return !!(typeof GUIIN_VERIFIED_ENTITLEMENTS!=='undefined'&&GUIIN_VERIFIED_ENTITLEMENTS.compat);}catch(_e){return false;}}
var TAG={turn:['큰 흐름이 바뀌는 해','apart'],good:['이야기 꺼내기 좋은 해','good'],shake:['흔들리기 쉬운 해','shake'],mixed:['기회와 마찰이 같이 오는 해','mixed'],apart:['따로 바빠지기 쉬운 해','apart'],calm:['',''] };
function advice(r,R){
  if(r.tag==='good')return '같이 사는 문제, 결혼, 가족 소개처럼 미뤄 둔 관계 이야기를 꺼내기 좋아.';
  if(r.tag==='shake')return '큰 결정은 서두르지 말고, 서운한 일은 쌓기 전에 그 주 안에 말해.';
  if(r.tag==='mixed')return '가까워질 계기와 부딪힐 일이 같이 와. 좋은 흐름일 때 규칙을 같이 정해 둬.';
  if(r.tag==='turn')return '한 사람의 10년 흐름이 바뀌는 해야. 생활 리듬이 달라지니, 달라진 점을 서로 말로 알려 줘.';
  if(r.tag==='apart')return '한쪽이 바쁘다고 마음이 식은 게 아니야. 일주일에 한 번은 둘만의 시간을 고정해.';
  return r.same?'둘 다 '+WORD[r.A.grp]+' 쪽 고민이 많은 해라 서로를 잘 이해해. 같이 지치지 않게 번갈아 쉬어.':'큰 변수 없이 지나가기 쉬운 해야. 평소 리듬을 지키면 돼.';
}
function rowHTML(r,R,locked){
  var t=TAG[r.tag];
  var head='<div class="gptY"><b>'+r.year+'</b><span>'+esc(r.ko)+'</span></div>';
  var who='<p class="gptW">'+esc(R.an)+' '+esc(r.A.god)+' · '+esc(R.bn)+' '+esc(r.B.god)+(t[0]?'<em class="gptTag '+t[1]+'">'+esc(t[0])+'</em>':'')+'</p>';
  if(locked)return '<li class="gptRow locked">'+head+'<div class="gptB">'+who+'<p class="gptL">궁합 프리미엄에서 열려</p></div></li>';
  var why=r.good.concat(r.shake,r.apart);
  var seen={};why=why.filter(function(x){if(seen[x])return false;seen[x]=1;return true;});
  return '<li class="gptRow">'+head+'<div class="gptB">'+who+'<p class="gptL">'+esc(advice(r,R))+'</p>'+(why.length?'<p class="gptX">'+esc(why.join(', '))+'.</p>':'')+(r.note.length?'<p class="gptX">'+esc(r.note.join(', '))+'.</p>':'')+'</div></li>';
}
function cardHTML(R){
  var isPaid=paid(),FREE=2;
  var pick=function(list,label){return list.length?'<div class="gptPick"><b>'+label+'</b><span>'+list.join(' · ')+'</span></div>':'';};
  return '<section class="gptCard" data-gpt="1" data-polish-skip="1"><div class="mini">두 사람의 10년 · 시기 겹쳐 보기</div><h3>'+esc(R.an)+'·'+esc(R.bn)+'의 '+R.rows[0].year+'~'+R.rows[R.rows.length-1].year+'년</h3>'
    +'<p class="gptLead">해마다 들어오는 글자를 두 사람의 배우자 자리(일지)·배우자 별·대운 변화에 겹쳐 봤어. 관계가 어떻게 될지 정하는 표가 아니라, 어느 해에 무엇을 조심하고 무엇을 꺼낼지 고르는 표야.</p>'
    +(isPaid?'<div class="gptPicks">'+pick(R.good,'관계 이야기 꺼내기 좋은 해')+pick(R.shake,'흔들리기 쉬운 해')+pick(R.mixed,'기회와 마찰이 같이 오는 해')+pick(R.apart,'따로 바빠지기 쉬운 해')+pick(R.turn,'큰 흐름이 바뀌는 해')+'</div>':'')
    +'<ol class="gptList">'+R.rows.map(function(r,i){return rowHTML(r,R,!isPaid&&i>=FREE);}).join('')+'</ol>'
    +(isPaid?'':'<div class="gptCta"><button type="button" data-gpt-buy="1">나머지 8년 겹쳐 보기 ›</button></div>')+'</section>';
}
var CSS='#matchView .gptCard{margin:14px 0;padding:18px 16px;border-radius:18px;background:#fbf7fd;border:1px solid #ece2f3}#matchView .gptCard .mini{font-size:12px;color:#7a55a0;font-weight:700;margin-bottom:6px}#matchView .gptCard h3{font-size:18px;margin:0 0 8px}'
 +'#matchView .gptCard p.gptLead{font-size:13.5px;line-height:1.6;color:#5e5866;margin:0 0 10px}#matchView .gptPicks{display:grid;gap:6px;margin:6px 0 12px}#matchView .gptPick{display:flex;flex-wrap:wrap;gap:8px;font-size:13.5px;padding:8px 10px;border-radius:10px;background:#fff;border:1px solid #ece2f3}#matchView .gptPick b{color:#6a3f93}'
 +'#matchView .gptList{list-style:none;margin:0;padding:0}#matchView .gptRow{display:flex;gap:10px;padding:10px 0;border-top:1px solid #eee6f3}#matchView .gptY{flex:0 0 52px}#matchView .gptY b{display:block;font-size:15px}#matchView .gptY span{font-size:12px;color:#8f879a}#matchView .gptB{flex:1;min-width:0}'
 +'#matchView .gptCard p.gptW{font-size:13.5px;font-weight:700;margin:0 0 3px;line-height:1.5}#matchView .gptCard p.gptL{font-size:13.5px;line-height:1.6;margin:0;color:#3f3a45}#matchView .gptCard p.gptX{font-size:12.5px;line-height:1.55;margin:4px 0 0;color:#6e6877}'
 +'#matchView .gptCard em.gptTag{display:inline-block!important;width:auto!important;font-style:normal;font-size:11px;font-weight:700;padding:1px 7px;border-radius:999px;margin-left:6px}#matchView em.gptTag.good{background:#e3f3e8;color:#23704a}#matchView em.gptTag.shake{background:#fbe9e7;color:#a8432f}#matchView em.gptTag.mixed{background:#fbefe2;color:#9a5a17}#matchView em.gptTag.apart{background:#ece8fb;color:#5543a8}'
 +'#matchView .gptRow.locked{opacity:.55}#matchView .gptCta button{width:100%;margin-top:10px;padding:11px;border-radius:12px;border:0;background:#6a3f93;color:#fff;font-weight:700;font-size:14px}';
function ensureCss(){if(root.document.getElementById('gptCss'))return;var s=root.document.createElement('style');s.id='gptCss';s.textContent=CSS;root.document.head.appendChild(s);}
function pair(){try{return typeof matchMeta!=='undefined'?matchMeta:null;}catch(_e){return null;}}
function tab(){try{return typeof matchTab!=='undefined'?matchTab:'summary';}catch(_e){return 'summary';}}
function keyOf(m){var f=function(c){var I=c.input||{};return [I.year,I.month,I.day,I.hour,I.gender].join('.');};return f(m.a)+'|'+f(m.b)+'|'+(paid()?'p':'f');}
function anchor(view){var list=view.querySelectorAll(':scope > *');for(var i=0;i<list.length;i++){var h=list[i].querySelector('h3,h4,b');if(/조금 더 물어보고 싶다면/.test(list[i].textContent||'')&&list[i].offsetHeight<600)return list[i];}return null;}
function enhance(){
  if(root.GUIIN_PAIR_TIMING_OFF||!root.document)return;
  var view=root.document.getElementById('matchView');if(!view)return;
  var old=view.querySelector('[data-gpt]');
  if(tab()!=='summary'){if(old)old.remove();return;}
  var m=pair();if(!m||!m.a||!m.b)return;var k=keyOf(m);
  if(old&&old.getAttribute('data-k')===k)return;
  var a=anchor(view);if(!a)return;
  var R=null;try{R=read(m.a,m.b);}catch(e){try{console.warn('GUIIN_PAIR_TIMING',e);}catch(_){}}
  if(!R||!R.rows.length)return;
  if(old)old.remove();ensureCss();
  var h=root.document.createElement('div');h.innerHTML=cardHTML(R);var card=h.firstChild;card.setAttribute('data-k',k);
  a.parentNode.insertBefore(card,a);try{var o=root.getComputedStyle(a).order;if(o&&o!=='0')card.style.order=o;}catch(_e){}
}
function onClick(e){var t=e.target&&e.target.closest?e.target.closest('[data-gpt-buy]'):null;if(!t)return;try{if(typeof root.guiinPaymentCenterStart==='function')root.guiinPaymentCenterStart('PREMIUM_COMPAT');}catch(_e){}}
if(root.document&&root.MutationObserver){
  var pending=false;
  var mo=new root.MutationObserver(function(){if(pending)return;pending=true;root.requestAnimationFrame(function(){pending=false;try{enhance();}catch(_e){}});});
  var start=function(){try{mo.observe(root.document.body,{childList:true,subtree:true});root.document.addEventListener('click',onClick);enhance();}catch(_e){}};
  if(root.document.body)start();else root.document.addEventListener('DOMContentLoaded',start);
}
root.GuiinPairTiming={read:read,version:'pair-timing-v1'};
})(typeof globalThis!=='undefined'?globalThis:this);
