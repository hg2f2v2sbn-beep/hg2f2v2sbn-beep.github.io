/* 귀인사주 궁합 깊이 풀이 모듈 (demo) — 화면 표시 전용.
   궁합 엔진 점수·해석 문구는 읽기만 하고 바꾸지 않는다. guiin-deep-voice.js 뒤에 로드한다. */
(function(){
'use strict';
var V='20261011-deep-compat-demo';
function DV(){return window.GUIIN_DEEP_VOICE||{}}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function given(n){n=String(n||'').trim();if(!n)return '상대';/* 수정: 한글 3글자(또는 두 글자 성) 이름만 성을 빼고 부름. 영어·닉네임·4글자는 그대로 */if(/^[가-힣]{3}$/.test(n))return n.slice(1);if(/^[가-힣]{4}$/.test(n)&&/^(남궁|황보|제갈|선우|독고|사공|서문|동방|어금|망절|소봉)/.test(n))return n.slice(2);return n}
function fin(n){var c=String(n).charCodeAt(String(n).length-1);return c>=0xAC00&&c<=0xD7A3&&((c-0xAC00)%28)!==0}
var JO={'은':['은','는'],'이':['이','가'],'을':['을','를'],'과':['과','와']};
function T(str,x,y){return String(str).replace(/\{([xy])(은|이|을|과)?\}/g,function(_,w,j){var n=w==='x'?x:y;return j?n+(fin(n)?JO[j][0]:JO[j][1]):n})}
var LAB={year:'어린 시절 환경',month:'일터·사회 모습',day:'가까운 사람 앞의 모습',hour:'앞으로의 방향'};
var GROUP_FILL={'비겁':'자기 기준을 세우고 지키는 힘','식상':'생각을 말과 결과물로 꺼내는 힘','재성':'현실 조건을 챙기는 힘','관성':'책임과 질서를 잡는 힘','인성':'곁에서 받쳐 주고 이해해 주는 힘'};

/* 한쪽의 단점이 상대에게 어떻게 닿는지 ({x}=단점 가진 사람, {y}=곁의 사람) */
var OTHER={
 'b-low':'{x은} 자기 기준을 말하지 않고 다 맞춰 주다가, 어느 날 지쳐서 마음을 닫아. {y은} “괜찮다”는 말을 믿고 있다가 갑자기 거리가 생긴 것 같아 당황해.',
 'b-high':'{x은} 자기 방식이 확고해서 의견을 내도 결국 자기 쪽으로 끌고 가. {y은} 점점 의견을 내지 않게 되고, 그게 쌓이면 말 없이 멀어져.',
 'g-high':'{x은} 책임과 체면을 짊어지느라 곁에 있어도 여유가 없어. {y은} 부담을 줄까 봐 눈치를 보게 돼.',
 'g-low':'{x은} 약속과 마무리가 흐릿해질 때가 있어. {y은} 뒷수습하는 역할이 되고, 그게 반복되면 신뢰가 떨어져.',
 'i-low':'{x은} 힘들어도 혼자 해결하려 하고 말하지 않아. {y은} 도울 방법을 몰라 답답하고, 나중에 알면 서운해해.',
 'i-high':'{x은} 생각이 길고 결정이 느려. {y은} 기다리다 지쳐 결국 먼저 결정하는 역할이 돼.',
 'j-high':'{x은} 계산과 현실 조건이 먼저 나와서, 감정 얘기가 “그래서 얼마인데”로 끝나는 느낌을 줘. {y은} 마음을 이해받지 못한 기분이 들 수 있어.',
 's-high':'{x은} 말이 먼저 나가서 가볍게 던진 한마디가 {y}에게는 오래 남아. 본인은 기억도 못 하는데 {y은} 며칠씩 곱씹어.',
 's-low':'{x은} 마음이 있어도 그걸 꾸준히 말로 확인시켜 주는 데는 서툰 편이야. 좋을 때는 표현하다가도 바쁘거나 지치면 말이 확 줄어서, {y은} 사랑받고 있는지 헷갈리는 순간이 생겨.',
 'quiet':'{x은} 서운해도 말하지 않고 거리를 둬. {y은} 이유도 모른 채 눈치만 보다가 지쳐.',
 'ruminate':'{x은} 사소한 말도 오래 곱씹어서, {y은} 이미 끝났다고 생각한 일을 몇 번이고 다시 해명하게 돼.',
 'sharp':'{x은} 화가 쌓이면 한마디가 날카로워져. {y은} 그 말을 오래 기억하고, 사과를 받아도 상처가 남아.',
 'strong':'{x은} 한번 부딪히면 물러서지 않아. {y은} 이겨도 남는 게 없는 싸움에 계속 끌려 들어가.',
 'charm':'{x은} 매력 때문에 주변 시선이 따라와. {y은} 괜히 불안해지는 순간이 생길 수 있어.',
 'clash':'{x은} 사회에서의 모습과 속마음이 서로 달라서, {y은} “진짜 어느 쪽이야” 하고 헷갈려해.',
 'top':'{x은} 잘하는 쪽에 기대는 만큼 다른 쪽이 비어서, {y은} 그 빈 부분을 혼자 메워야 하는 순간이 와.'
};
var LUCK_MARRY={
 '비견':'동료 같은 관계에 힘이 실려. 각자 주장이 세지니 결정 전에 서로 의견을 먼저 들어 줘야 해.',
 '겁재':'돈과 사람 문제로 흔들리기 쉬워. 큰 결정과 돈 거래는 문서로 남겨 둬.',
 '식신':'생활이 안정되고 일상을 같이 쌓기 좋아.',
 '상관':'변화를 원하는 마음이 커져. 이직·이사 같은 변동이 관계에 영향을 줘.',
 '편재':'돈 흐름이 커져서 씀씀이에 대한 합의가 중요해.',
 '정재':'가정 경제의 기반을 세우기 좋은 시기야.',
 '편관':'책임과 압박이 커져 여유가 줄어. 짜증이 상대에게 옮겨 가지 않게 조심해.',
 '정관':'책임감 있는 관계로 자리 잡기 좋은 시기야.',
 '편인':'혼자 생각할 시간이 늘어. 거리를 두는 걸 마음이 변한 것으로 오해하지 마.',
 '정인':'마음이 안정되고 서로 받쳐 주는 힘이 커져.'
};

function angerType(p){var t=String((p&&(p.trait&&p.trait.angerText||p.anger))||'');return t.indexOf('참고')>=0?'hold':t.indexOf('말투와 결론이 먼저')>=0?'fast':'mix'}
function cutType(p){var t=String((p&&(p.trait&&p.trait.cutoffText||p.cutoff))||'');return t.indexOf('늦게 선')>=0?'late':t.indexOf('경계를 분명히')>=0?'quick':'mix'}
function ageNow(c){var I=c.input||{};var bd=new Date(I.year,(I.month||1)-1,I.day||1,I.hour||0,I.minute||0);return (Date.now()-bd.getTime())/(365.2425*86400000)}
function curLuck(c){var L=Array.isArray(c.luck)?c.luck:[],age=ageNow(c);for(var i=0;i<L.length;i++){if(age>=+L[i].fromAgeExact&&age<+L[i].toAgeExact)return L[i]}return null}
function pcs(P,g){return P.pct[g]|0}
function needAlone(P){return pcs(P,'비겁')>=25||pcs(P,'인성')>=32||DV()._has&&DV()._has(P,'화개살')}

function info(c){var A=window.GUIIN_INTERPRETATION_V4.engine.analyze;var P=A(c);var F=DV()._flaws?DV()._flaws(P):[];return {P:P,F:F,name:given(P.name),c:c}}

/* ---------- 섹션 ---------- */
function sVerdict(a,b,M){
 var q=M.q||{},sc=M.score,out=[];
 var v=(typeof guiinCompatBand==='function')?guiinCompatBand(sc,q.sig).verdict:sc>=80?'끌림도 크고 생활도 맞는 편이야. 이 정도면 잘 맞는 쪽이라고 말할 수 있어.':sc>=70?'잘 맞는 편이야. 다만 약한 한 곳만 제대로 다루면 오래 가.':sc>=60?'끌리는 건 이상하지 않아. 그런데 같이 살면 피곤해지는 구간이 분명히 있어. 조율하는 두 사람만 오래 가는 관계야.':'솔직히 쉬운 관계는 아니야. 끌림보다 마찰이 큰 구조라서, 서로의 방식을 배울 각오가 있어야 해.';
 out.push('<p><b>총점 '+sc+'점. '+esc(v)+'</b></p>');
 var items=[['연애 흐름',M.love],['성향 조화',M.personality],['돈 감각',M.money],['앞으로의 방향',M.future]];
 var mx=items.slice().sort(function(x,y){return y[1]-x[1]})[0],mn=items.slice().sort(function(x,y){return x[1]-y[1]})[0];
 out.push('<p>'+items.map(function(i){return i[0]+' '+i[1]}).join(' · ')+'. 가장 강한 건 <b>'+mx[0]+'('+mx[1]+')</b>, 가장 약한 건 <b>'+mn[0]+'('+mn[1]+')</b>이야.</p>');
 if(q.archetype)out.push('<p>이 관계의 유형은 “'+esc(q.archetype)+'”이야.'+(q.dayRel==='충'?' 일지가 정면으로 부딪히는 구조(충)라서 감정의 속도와 생활 리듬이 다르면 차이가 크게 느껴져.':String(q.dayRel||'').indexOf('합')>=0?' 일지가 합으로 묶여 있어 말이 덜 필요한 편안함이 있어.':'')+'</p>');
 return {title:'이 관계는 이런 관계야',html:out.join(''),ev:'총점 '+sc+' · 연애 '+M.love+' · 성향 '+M.personality+' · 돈 '+M.money+' · 방향 '+M.future+(q.dayRel&&q.dayRel!=='직접 관계 없음'?' · 일지 관계 '+q.dayRel:'')};
}
function sGood(a,b,M){
 var q=M.q||{},sig=q.sig||{hits:[],types:[]},L=[],ev=[];
 var hit=(sig.hits||[]).filter(function(h){return /합/.test(h.type)}).sort(function(x,y){return y.weight-x.weight})[0];
 if(hit){L.push(T('{x}의 '+LAB[hit.ak]+'과 {y}의 '+LAB[hit.bk]+' 사이에 '+hit.type+'이 있어서, 길게 설명하지 않아도 통하는 순간이 자주 와. 이건 억지로 만드는 게 아니라 원래 있는 연결이야.',a.name,b.name));ev.push(hit.type+'('+a.name+' '+({year:'년주',month:'월주',day:'일주',hour:'시주'}[hit.ak])+'–'+b.name+' '+({year:'년주',month:'월주',day:'일주',hour:'시주'}[hit.bk])+')')}
 [[a,b],[b,a]].forEach(function(p){var x=p[0],y=p[1];var g=Object.keys(GROUP_FILL).filter(function(k){return pcs(x.P,k)<=10&&pcs(y.P,k)>=22}).sort(function(m,n){return pcs(y.P,n)-pcs(y.P,m)})[0];
  if(g){L.push(T('{y은} {x}에게 얇은 쪽을 채워 줘. '+GROUP_FILL[g]+'이 약한 {x은} {y} 곁에서 훨씬 편해져.',x.name,y.name));ev.push(x.name+' '+g+' '+pcs(x.P,g)+'% ↔ '+y.name+' '+g+' '+pcs(y.P,g)+'%')}});
 if(M.money>=75){L.push('돈을 보는 기준이 비슷해서 생활비와 소비 문제로 크게 싸울 구조가 아니야.');ev.push('돈 감각 '+M.money)}
 if(M.personality>=75){L.push('성향이 잘 맞아서 같은 일에 비슷하게 반응하는 순간이 많아.');ev.push('성향 조화 '+M.personality)}
 if(M.future>=75){L.push('앞으로 가고 싶은 방향이 겹쳐서 같은 쪽을 보고 걸을 수 있어.');ev.push('앞으로의 방향 '+M.future)}
 if(L.length<3){L.push('서로 다른 강점이 분명해서 역할을 나누면 혼자일 때보다 선택지가 넓어져.')}
 var html='<ol class="gdvFlaw">'+L.slice(0,4).map(function(t){return '<li><div>'+esc(t)+'</div></li>'}).join('')+'</ol>';
 return {title:'잘 맞는 점',html:html,ev:ev.join(' · ')||'궁합 지수 4가지'};
}
function dir(x,y,skip,both){ /* x 때문에 y가 힘든 점 · skip: 앞 사람에게 이미 쓴 단점 id(같은 문장 반복 방지) · both: 두 사람 공통 단점 id */
 skip=skip||{};both=both||{};
 var F=x.F.filter(function(f){return !skip[f.id]}).slice(0,2);if(!F.length)return '';
 return '<p><b>'+esc(T('{x} 때문에 {y이} 힘든 점',x.name,y.name))+'</b></p><ol class="gdvFlaw">'+F.map(function(f){var t=T(OTHER[f.id]||OTHER.top,x.name,y.name);if(both[f.id])t+=' '+T('이 모습은 {y}에게도 똑같이 있어서, 두 사람이 같은 서운함을 주고받기 쉬워.',x.name,y.name);return '<li><div>'+esc(t)+'</div></li>'}).join('')+'</ol>';
}
function angerLoop(a,b,q){
 var ta=angerType(q.pa),tb=angerType(q.pb);
 var X=a,Y=b;
 if(ta==='hold'&&tb==='fast')return T('{y은} 답답하면 말투와 결론이 먼저 강해지고, {x은} 바로 대꾸하지 않고 참으면서 정리하는 쪽이야. 이 조합은 {y이} 말로 먼저 치고 {x이} 삼키는 모양이 돼. {y은} 말했으니 끝났다고 생각하는데 {x은} 그때부터 정리를 시작해서, 한참 뒤에 한꺼번에 선을 그어. 이 차이를 모르면 {y은} “갑자기 왜?”라고 하고 {x은} “그동안 계속 참았어”라고 하게 돼.',a.name,b.name);
 if(tb==='hold'&&ta==='fast')return T('{x은} 답답하면 말투와 결론이 먼저 강해지고, {y은} 바로 대꾸하지 않고 참으면서 정리하는 쪽이야. 이 조합은 {x이} 말로 먼저 치고 {y이} 삼키는 모양이 돼. {x은} 말했으니 끝났다고 생각하는데 {y은} 그때부터 정리를 시작해서, 한참 뒤에 한꺼번에 선을 그어. 이 차이를 모르면 {x은} “갑자기 왜?”라고 하고 {y은} “그동안 계속 참았어”라고 하게 돼.',a.name,b.name);
 if(ta==='hold'&&tb==='hold')return '둘 다 참고 정리하는 쪽이라 싸움이 조용해. 문제는 조용해서 문제가 오래 안 보인다는 거야. 어느 날 갑자기 거리가 생기고, 서로 이유를 모른 채 끝날 수 있어. 서운함은 일주일에 한 번씩 꺼내서 말하는 시간을 정해 둬.';
 if(ta==='fast'&&tb==='fast')return '둘 다 말과 결론이 먼저 강해져서 싸움이 빨리 커져. 대신 빨리 식으니까, 감정이 올라간 상태에서 “끝”이라는 말만 하지 않으면 돼. 그 한 가지만 약속해 둬.';
 return '한쪽은 상황에 따라 참기도 하고 말하기도 해서 싸움의 모양이 매번 달라. 그래서 “저번엔 안 그랬잖아”가 자주 나와. 싸웠을 때 어떻게 할지를 평온한 때 한 번 정해 두는 게 도움이 돼.';
}
function sHard(a,b,M){
 var q=M.q||{},out=[];
 out.push('<p>듣기 좋은 말만 하면 도움이 안 되니까, 서로에게 힘든 점을 콕 짚을게.</p>');
 var aIds={},bIds={},both={};a.F.slice(0,2).forEach(function(f){aIds[f.id]=1});b.F.slice(0,2).forEach(function(f){bIds[f.id]=1});Object.keys(aIds).forEach(function(k){if(bIds[k]&&k!=='top')both[k]=1});
 out.push(dir(a,b,{},both));out.push(dir(b,a,both,{}));
 var ct=[cutType(q.pa),cutType(q.pb)];
 if(ct.indexOf('quick')>=0&&ct.indexOf('late')>=0){var qk=ct[0]==='quick'?a:b,lt=ct[0]==='quick'?b:a;out.push(T('<p><b>선을 긋는 속도가 달라.</b> {x은} 기준을 넘으면 빠르게 거리를 두고, {y은} 여러 번 이해하려다 늦게 선을 그어. {x이} “이미 끝난 일”이라고 말해도 {y은} 아직 시작도 못 했다고 느낄 수 있어서, 이 차이가 이별 얘기가 나올 때 가장 크게 어긋나.</p>',qk.name,lt.name))}
 var tn=(q.sig&&q.sig.tension)||0;
 if(tn>=5)out.push('<p><b>원국의 충·형·파·해 신호가 '+tn+'점으로 많은 편이야.</b> 이건 “자주 싸운다”가 아니라 “같은 문제가 모양을 바꿔서 반복된다”는 뜻이야. 한 번 풀었다고 끝났다고 생각하지 마.</p>');
 return {title:'상대 때문에 힘든 점',html:out.join(''),ev:dedupe(who(a,a.F.slice(0,2)).concat(who(b,b.F.slice(0,2))).concat(['충·형·파·해 신호 '+tn]))};
}
function who(p,F){return F.map(function(f){return String(f.ev||'').split(' · ').filter(Boolean).map(function(y){return p.name+' '+y}).join(' · ')})}
function dedupe(a){var s={},o=[];a.forEach(function(x){String(x).split(' · ').forEach(function(y){if(y&&!s[y]){s[y]=1;o.push(y)}})});return o.join(' · ')}
function sFight(a,b,M){
 var q=M.q||{},out=[];
 out.push('<p>'+esc(angerLoop(a,b,q))+'</p>');
 var ta=angerType(q.pa),tb=angerType(q.pb);
 var fast=ta==='fast'?a:tb==='fast'?b:null,hold=ta==='hold'?a:tb==='hold'?b:null;
 var rule=[];
 if(fast)rule.push(T('{x은} 화가 난 날 하루 뒤에 말해. 감정이 올라간 채로 한 말은 결론이 아니라 반응이야.',fast.name,''));
 if(hold)rule.push(T('{x은} 서운함을 3일 넘기기 전에 “그때 이런 느낌이 들었어”까지만 말해. 해결을 요구하지 않아도 돼.',hold.name,''));
 if(!rule.length)rule.push('싸운 날은 하루 쉬고 다음 날 사실 한 줄과 부탁 한 줄로만 다시 말해.');
 out.push('<p><b>싸웠을 때 지킬 규칙</b></p><ol class="gdvFlaw">'+rule.map(function(r){return '<li><div>'+esc(r)+'</div></li>'}).join('')+'</ol>');
 out.push('<p><b>이렇게 말해 봐</b> “아까 말이 세게 나갔어. 다시 말할게. 내가 원하는 건 ___야.” / “그때 이런 느낌이 들었어. 해결해 달라는 건 아니고 알아 줬으면 해서.”</p>');
 return {title:'싸우면 이렇게 돼',html:out.join(''),ev:'분노 반응 '+a.name+' '+ta+' · '+b.name+' '+tb+' · 선 긋기 '+cutType(q.pa)+'/'+cutType(q.pb)};
}
function sMarry(a,b,M){
 var q=M.q||{},sig=q.sig||{combine:0,tension:0,hits:[]},out=[],ev=[];
 var idx=Math.round(.30*M.future+.30*M.money+.25*M.personality+.15*M.love)-Math.min(8,Math.round((sig.tension||0)*.8))+Math.min(6,Math.round((sig.combine||0)*1.5));
 var v=idx>=78?'결혼 궁합은 좋은 편이야. 같이 살아도 구조적으로 크게 부딪히는 신호가 적어. 다만 좋은 궁합이 노력 없이 좋은 결혼을 뜻하지는 않아. 아래 두 가지만 지켜.':idx>=68?'결혼 궁합은 조건을 지키면 오래 가는 편이야. 맞는 부분도 확실하고 부딪히는 부분도 확실해. 아래 조건을 지키면 오래 가고, 안 지키면 같은 일로 반복해서 싸우게 돼.':idx>=58?'솔직히 쉬운 결혼은 아니야. 끌림은 있어도 같이 살면 피곤해지는 구간이 분명해. 그렇다고 구조적으로 안 되는 관계는 아니고, 합의가 있어야 가능한 관계야. 결혼 전에 아래 세 가지는 반드시 말로 정해 두고 가.':'결혼 전에 풀어야 할 숙제가 큰 관계야. 감정만 믿고 가면 같은 문제로 지쳐. 아래 세 가지가 합의되지 않았다면 서두르지 마.';
 out.push('<p><b>'+esc(v)+'</b></p>');
 var tierS=M.score>=80?3:M.score>=70?2:M.score>=60?1:0,tierM=idx>=78?3:idx>=68?2:idx>=58?1:0;
 if(tierM<tierS)out.push('<p class="gdvNote">총점('+M.score+'점)은 끌림과 연애 흐름까지 함께 본 점수야. 결혼은 같이 사는 문제라 돈 감각·앞으로의 방향·생활 합의를 더 무겁게 봐서, 총점보다 조심스럽게 읽었어.</p>');
 /* 돈 */
 var ta=a.P.top,tb=b.P.top,money;
 var lead=pcs(a.P,'재성')>=pcs(b.P,'재성')?a:b,other=lead===a?b:a;
 money='<b>돈</b> 돈 감각 지수가 '+M.money+'점이야. ';
 money+=(M.money>=70?(ta===tb?'돈을 보는 기준은 크게 어긋나지 않는 편이야. 다만 둘이 새는 곳도 비슷해서, 같이 느슨해지는 달은 조심해.':'돈을 보는 기준은 크게 어긋나지 않는 편이야. 다만 새는 곳이 서로 달라서, 상대 지출이 낭비처럼 보이는 순간은 있을 수 있어.'):(ta===tb?'두 사람이 같은 방식으로 돈이 새기 쉬워서, 둘 다 막지 않으면 같이 샌다는 뜻이야.':'두 사람이 서로 다른 곳에서 돈이 새기 쉬워서, 서로를 감시하는 구도가 되기 쉬워.'))+' '+T('{x이} 가계 계산을 맡고 {y은} 큰 지출의 상한선을 확인하는 식으로 역할을 나눠. 큰 결제는 하루 뒤에 결정하기로 정해 두면 돼.',lead.name,other.name);
 out.push('<p>'+money+'</p>');ev.push('돈 감각 '+M.money+' · '+a.name+' 재성 '+pcs(a.P,'재성')+'% · '+b.name+' 재성 '+pcs(b.P,'재성')+'%');
 /* 생활·거리 */
 var na=needAlone(a.P),nb=needAlone(b.P),live;
 if(na&&nb)live='<b>생활과 거리</b> 둘 다 혼자 있는 시간이 필요한 쪽이야. 같이 있어도 편한 대신, 시간이 지나면 각자 방에서 지내는 사이가 되기 쉬워. 일주일에 한 번은 일부러 같이 하는 시간을 일정에 넣어 둬.';
 else if(na||nb){var al=na?a:b,tg=na?b:a;live='<b>생활과 거리</b> '+T('{x은} 혼자 있는 시간이 필요하고 {y은} 그 시간을 거리 두기로 읽기 쉬워.',al.name,tg.name)+' 한쪽이 물러나면 다른 쪽이 따라가는 고리가 생겨. “혼자 쉬는 시간은 마음이 변한 게 아니야”를 결혼 전에 말로 합의해 둬.'}
 else live='<b>생활과 거리</b> 둘 다 같이 있는 걸 편하게 여기는 쪽이야. 대신 개인 시간이 없으면 서로 숨 막힐 수 있어서, 각자 혼자 쓰는 시간을 주 1회 일정으로 정해 둬.';
 out.push('<p>'+live+'</p>');
 /* 가족 */
 var fam=(sig.hits||[]).filter(function(h){return /충|형|파|해/.test(h.type)&&(h.ak==='year'||h.bk==='year'||h.ak==='month'||h.bk==='month')});
 out.push('<p><b>가족과 집안</b> '+(fam.length?'두 사람의 자란 환경과 사회적 모습 쪽에서 '+fam[0].type+' 신호가 있어, 양가 일이나 명절, 부모의 의견 같은 데서 결이 어긋나기 쉬워. 가족 문제는 각자 자기 가족을 맡아서 먼저 말하는 식으로 정해 둬.':'자란 환경 쪽에서 큰 충돌 신호는 없어. 그래도 양가 일은 “각자 자기 가족을 먼저 설득한다”를 원칙으로 두면 편해.')+'</p>');
 /* 시기 */
 var la=curLuck(a.c),lb=curLuck(b.c),tl=[];
 if(la)tl.push(T('{x은} 지금 '+la.ko+' 대운('+la.god+')이야. ',a.name,'')+(LUCK_MARRY[la.god]||''));
 if(lb)tl.push(T('{x은} 지금 '+lb.ko+' 대운('+lb.god+')이야. ',b.name,'')+(LUCK_MARRY[lb.god]||''));
 if(tl.length)out.push('<p><b>지금 시기</b> '+esc(tl.join(' '))+'</p>');
 ev.push((la?a.name+' 대운 '+la.ko+' '+la.god:'')+(lb?' · '+b.name+' 대운 '+lb.ko+' '+lb.god:''));
 /* 처방 */
 var cond=['가계는 한 사람이 총괄하고 월 1회 같이 점검한다.','싸웠을 때 지킬 규칙(하루 뒤 말하기, 3일 안에 서운함 말하기)을 결혼 전에 정해 둔다.',(na||nb)?'혼자 있는 시간은 마음이 변한 게 아니라는 합의를 해 둔다.':'각자 혼자 쓰는 시간을 주 1회 정해 둔다.'];
 out.push('<p><b>결혼 전에 합의할 3가지</b></p><ol class="gdvFlaw">'+cond.map(function(c){return '<li><div>'+esc(c)+'</div></li>'}).join('')+'</ol>');
 out.push('<p class="gdvNote">궁합은 결혼의 성패를 판정하는 표가 아니야. 같은 구조도 두 사람이 어떻게 말하고 역할을 나누느냐에 따라 체감이 달라져.</p>');
 return {title:'결혼하면 이렇게 돼',html:out.join(''),ev:dedupe(ev)};
}

/* ---------- 렌더 ---------- */
function ensureCss(){if(document.getElementById('gdvCss'))return;try{DV()._css&&DV()._css()}catch(e){}}
function build(which){
 var m=(typeof matchMeta!=='undefined')?matchMeta:null;if(!m||!m.a||!m.b)return null;
 if(!window.GUIIN_INTERPRETATION_V4||!GUIIN_INTERPRETATION_V4.engine||typeof guiinCompatMetricsV56!=='function')return null;
 var M=guiinCompatMetricsV56(m.a,m.b);if(!M||!M.q)return null;
 var a=info(m.a),b=info(m.b);
 var S={verdict:sVerdict,good:sGood,hard:sHard,fight:sFight,marry:sMarry};
 var secs=which.map(function(k){return S[k](a,b,M)});
 var html='<div class="gdvKick">✦ 궁합 깊이 풀이</div><h2>'+esc(a.name)+'님과 '+esc(b.name)+'님, 있는 그대로 읽어 줄게</h2>';
 html+=secs.map(function(s){return '<div class="gdvSec"><h3>'+esc(s.title)+'</h3>'+s.html+'<div class="gdvEv">근거: '+esc(s.ev)+'</div></div>'}).join('');
 html+='<div class="gdvCta">두 사람의 상황에 맞춰 더 구체적으로 묻고 싶다면, AI 상담에서 이어서 물어볼 수 있어.<br><button type="button" data-gdv-ask="1">AI 상담으로 이어서 묻기</button></div>';
 return html;
}
var TABS={summary:['verdict','good','hard','marry'],love:['verdict','good','hard','fight'],marriage:['verdict','marry'],partner:['hard']};
function render(){
 try{
  var v=document.getElementById('matchView');if(!v)return;
  var tab=(typeof matchTab!=='undefined')?matchTab:'summary';
  var old=v.querySelector(':scope > .gdv');
  var which=TABS[tab];
  if(!which||typeof matchMeta==='undefined'||!matchMeta||!matchMeta.a||typeof hasPremiumCompat!=='function'||!hasPremiumCompat()||!v.querySelector('.matchHero')){if(old)old.remove();return}
  var key=[matchMeta.a.input&&matchMeta.a.input.name,matchMeta.b.input&&matchMeta.b.input.name,matchMeta.score,tab].join('|');
  if(old&&old.getAttribute('data-gdv')===key)return;
  if(old)old.remove();
  var html=build(which);if(!html)return;
  ensureCss();
  var d=document.createElement('div');d.className='gdv';d.setAttribute('data-gdv',key);d.innerHTML=html;
  var hero=v.querySelector(':scope > .matchHero');
  if(hero&&hero.parentNode===v)v.insertBefore(d,hero.nextSibling);else v.insertBefore(d,v.firstChild);
  var b=d.querySelector('[data-gdv-ask]');if(b)b.addEventListener('click',function(){try{if(typeof go==='function')go('ask')}catch(e){}});
 }catch(e){try{window.GUIIN_DEEP_COMPAT.lastError=String(e&&e.stack||e)}catch(_e){}}
}
var busy=false;
function sched(){if(busy)return;busy=true;setTimeout(function(){busy=false;render()},60)}
function boot(){render();var n=document.getElementById('matchView');if(n)new MutationObserver(sched).observe(n,{childList:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
window.GUIIN_DEEP_COMPAT={version:V,render:render,build:build,lastError:null};
})();
