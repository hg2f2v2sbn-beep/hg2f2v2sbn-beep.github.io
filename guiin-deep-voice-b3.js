/* 귀인사주 깊이 풀이 모듈 (demo) — 화면 표시 전용.
   계산 엔진·기존 해석 문구·점수는 읽기만 하고 바꾸지 않는다.
   입력: 엔진이 계산한 chart (GUIIN_INTERPRETATION_V4.engine.analyze 결과 P + c.luck)
   출력: 결제 완료 사용자의 결과 화면 위에 얹는 카드(성격·단점·재물·시기). */
(function(){
'use strict';
var V='20261011-deep-voice-demo';

/* ---------- 표현 사전 ---------- */
var DM={
 '갑':{m:'곧게 뻗어 올라가는 큰 나무',g:'방향을 정하면 흔들리지 않고 위로 자라는 사람. 사람들이 그늘을 찾아 네 곁으로 와.'},
 '을':{m:'바위 틈에서도 길을 찾아 뻗는 덩굴',g:'부드럽게 휘어도 꺾이지 않는 사람. 환경이 거칠수록 살아남는 힘이 드러나.'},
 '병':{m:'어디에 있어도 눈에 띄는 태양',g:'환하게 비추고 먼저 다가가는 사람. 네가 있는 자리는 분위기가 달라져.'},
 '정':{m:'어둠 속에서 한 곳을 오래 비추는 촛불',g:'한 사람, 한 가지를 끝까지 비추는 사람. 작은 신호도 놓치지 않는 섬세함이 무기야.'},
 '무':{m:'움직이지 않고 중심을 잡는 큰 산',g:'말수는 적어도 곁에 있으면 든든한 사람. 사람들이 흔들릴 때 기대는 쪽이 바로 너야.'},
 '기':{m:'씨앗을 품고 키워 내는 논밭',g:'받아 주고 길러 내는 사람. 네 손을 거친 것들이 자라는 건 우연이 아니야.'},
 '경':{m:'단단하게 벼려진 원석과 칼',g:'결단이 빠르고 의리가 분명한 사람. 한번 정하면 끝을 보는 힘이 있어.'},
 '신':{m:'다듬을수록 빛나는 보석',g:'기준이 분명하고 안목이 높은 사람. 대충 넘어가지 않는 눈이 네 품격이야.'},
 '임':{m:'막힘없이 흘러가는 큰 강',g:'생각의 폭이 넓고 흐름을 읽는 사람. 큰 판을 보는 눈이 있어서 작은 일에 갇히지 않아.'},
 '계':{m:'조용히 스며드는 이슬과 비',g:'눈치 빠르고 감각이 섬세한 사람. 말하지 않은 마음까지 먼저 느끼는 사람이야.'}
};
var SEASON={
 '겨울':'추운 계절에 태어나 안으로 모으고 깊이 생각하는 쪽이 기본값이야. 겉으론 조용해 보여도 속에 쌓아 둔 게 많아.',
 '봄':'싹이 올라오는 계절에 태어나, 시작하고 키우는 일에 기운이 붙어.',
 '여름':'가장 뜨거운 계절에 태어나, 움직임과 표현이 앞서고 에너지가 밖으로 나가는 쪽이 기본값이야.',
 '가을':'거두고 다듬는 계절에 태어나, 기준이 분명하고 마무리를 짓는 쪽이 기본값이야.',
 '환절':'계절이 바뀌는 달에 태어나, 두 가지 결을 오가며 적응하는 힘이 있어.'
};
var POS={year:'초년·바깥 환경',month:'일터·사회',day:'가까운 관계·본인 자리',hour:'후반·결과'};
var STAR={
 '천을귀인':'위기 때 사람이 나타나는 별이야. 혼자 다 해결하지 않아도 되는 운을 타고났어.',
 '문창귀인':'배운 걸 글과 말로 풀어내는 재능이 있어. 정리해서 전할수록 평가가 올라가.',
 '태극귀인':'한 번 파고들면 본질까지 들어가는 탐구력이 있어.',
 '학당귀인':'공부와 훈련이 몸에 오래 남는 별이야. 쌓은 만큼 그대로 실력이 돼.',
 '월덕귀인':'큰 위기에서 한숨 돌릴 틈이 생기는 별이야.',
 '천덕귀인':'꼬인 일이 큰 탈 없이 풀리도록 막아 주는 별이야.',
 '암록':'드러나지 않게 챙겨 주는 도움이 따라오는 별이야.',
 '건록':'누구 힘도 빌리지 않고 스스로 서는 힘이 있어.',
 '도화살':'사람의 시선과 호감을 끄는 매력이 있어.',
 '홍염살':'한 번 보면 잊히지 않는 분위기가 있어.',
 '화개살':'혼자 깊이 파고드는 몰입과 예술적 감성이 있어.',
 '역마살':'움직일 때 살아나는 운이야. 한자리에 오래 묶이면 답답해져.',
 '괴강살':'결단력과 카리스마가 있어. 한번 정하면 끝까지 가는 사람이야.',
 '양인살':'승부처에서 오히려 강해지는 날카로운 힘이 있어.',
 '백호살':'위기를 정면으로 돌파하는 힘이 있어.',
 '장성살':'중심에 서서 사람을 이끄는 기운이 있어.'
};
var STAR_ORDER=['천을귀인','문창귀인','태극귀인','학당귀인','월덕귀인','천덕귀인','암록','건록','괴강살','양인살','백호살','장성살','도화살','홍염살','화개살','역마살'];
var NOBLE=['천을귀인','문창귀인','태극귀인','학당귀인','월덕귀인','천덕귀인','암록','건록'];

var GOD_LUCK={
 '비견':'나와 비슷한 사람과 동료가 늘어. 돈은 나눠 쓰기 쉬운 시기라 동업·보증은 조심하고 내 몫의 기준을 분명히 해야 해.',
 '겁재':'경쟁과 나눔이 커져. 지출이 늘고 기회를 뺏기기 쉬우니 돈 거래는 반드시 문서로 남겨.',
 '식신':'재능이 꾸준히 결과물로 쌓이는 시기야. 만든 걸 팔 수 있는 모양으로 다듬을수록 돈이 따라와.',
 '상관':'바꾸고 표현하고 싶은 마음이 커져. 이직·독립·창작의 기회가 오지만 말 한마디로 관계가 틀어질 수 있어.',
 '편재':'돈의 흐름이 커지고 사람을 통해 기회가 와. 큰돈이 움직이는 만큼 새는 구멍도 커져.',
 '정재':'꾸준한 수입이 쌓이는 시기야. 저축과 자산의 기반을 만들기에 가장 좋아.',
 '편관':'책임과 압박이 커져. 힘들지만 직책·자격으로 올라설 수 있는 시기고, 이때는 건강 관리가 곧 돈이야.',
 '정관':'역할과 평가가 분명해져. 신뢰를 쌓은 만큼 자리가 올라가.',
 '편인':'새로운 공부와 전환, 남다른 길이 열려. 전문성을 바꾸거나 깊게 파기 좋지만 수입은 천천히 따라와.',
 '정인':'받쳐 주는 힘이 들어와 마음이 안정돼. 자격·문서·자산을 안정시키기에 좋은 시기야.'
};
var GOD_YEAR={
 '비견':'올해는 같은 편이 늘고 자기 주장이 세지는 해야.',
 '겁재':'올해는 사람과 경쟁, 나눔이 커져. 동업·보증·돈 빌려주기는 특히 조심해.',
 '식신':'올해는 만든 것이 쌓이는 해야. 꾸준히 낸 결과가 보이기 시작해.',
 '상관':'올해는 바꾸고 말하고 싶은 마음이 커져. 불만은 개선안으로 바꿔서 말해.',
 '편재':'올해는 큰돈과 새 기회가 움직여. 서두른 결정만 피하면 크게 얻을 수 있어.',
 '정재':'올해는 수입이 안정적으로 쌓여. 새는 돈을 막으면 그대로 남아.',
 '편관':'올해는 압박과 책임이 들어와. 버티면 자리가 올라가는 해야.',
 '정관':'올해는 평가와 신뢰의 해야. 약속과 원칙을 지키는 만큼 인정받아.',
 '편인':'올해는 새 공부와 방향 전환의 해야. 한 가지로 좁혀서 깊게 파.',
 '정인':'올해는 도움과 귀인이 들어와. 자격·문서·계약이 유리하게 풀려.'
};

var GROUP_LEAK={
 '재성':'기회라고 느낀 곳에 서둘러 넣는 돈, 사람 관리에 드는 비용',
 '식상':'일이 잘 풀린 직후 기분 좋아서 쓰는 보상성 지출, 취향과 구독',
 '비겁':'체면과 경쟁심에서 쓰는 돈, 동업·보증·빌려주는 돈',
 '인성':'배우고 준비하느라 끝없이 들어가는 강의·자격·도구 비용',
 '관성':'남 눈과 체면, 책임져야 한다는 마음에서 나가는 돈'
};
var GROUP_EARN={
 '재성':'사람과 기회를 연결해 현금 흐름을 만드는 타입이야.',
 '식상':'재능과 표현이 곧 수입인 타입이야. 팔 줄 아는 만큼 벌어.',
 '관성':'직책과 자격이 곧 소득인 타입이야. 올라간 자리만큼 돈이 따라와.',
 '인성':'자격·지식·문서와 후원으로 돈이 만들어지는 타입이야. 공부가 곧 자산이야.',
 '비겁':'내 힘으로 직접 부딪쳐 버는 타입이야. 동업과 경쟁에서 갈림길이 생겨.'
};

/* ---------- 유틸 ---------- */
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function givenName(n){n=String(n||'').trim();if(!n)return '당신';/* 수정: 한글 3글자(또는 두 글자 성) 이름만 성을 빼고 부름. 영어·닉네임·4글자는 그대로 */if(/^[가-힣]{3}$/.test(n))return n.slice(1);if(/^[가-힣]{4}$/.test(n)&&/^(남궁|황보|제갈|선우|독고|사공|서문|동방|어금|망절|소봉)/.test(n))return n.slice(2);return n}
function has(P,name){return P.stars.some(function(s){return s.name===name})}
function posOf(P,name){var r=P.stars.filter(function(s){return s.name===name});if(!r.length)return '';var seen={},t=[];r.forEach(function(s){if(!seen[s.pillar]){seen[s.pillar]=1;t.push(s.pillar)}});return t.map(function(k){return {year:'년주',month:'월주',day:'일주',hour:'시주'}[k]}).join('·')}
function dedupe(a){var seen={},o=[];a.forEach(function(x){String(x).split(' · ').forEach(function(y){if(y&&!seen[y]){seen[y]=1;o.push(y)}})});return o.join(' · ')}
function pc(P,g){return P.pct[g]|0}
function tierWord(P){return P.tier==='약'?'신약 쪽':P.tier==='강'?'신강 쪽':'중간'}

/* ---------- 1. 나는 이런 사람 ---------- */
function secSelf(P){
 var d=DM[P.stem]||DM['무'];var nm=givenName(P.name);
 var out=[];
 out.push('<p><b>'+esc(nm)+', 너는 '+esc(d.m)+'이야.</b> '+esc(d.g)+'</p>');
 if(SEASON[P.season])out.push('<p>'+esc(SEASON[P.season])+'</p>');
 var ev=['일간 '+P.stem+P.el+'('+P.yin+')','일주 '+P.c.pillars.day.ko,'월령 '+P.c.pillars.month.branch+'월'+(P.season?'('+P.season+')':'')];
 /* 귀인·신살 특별함 */
 var names=[],seen={};
 STAR_ORDER.forEach(function(n){if(has(P,n)&&!seen[n]){seen[n]=1;names.push(n)}});
 var noble=names.filter(function(n){return NOBLE.indexOf(n)>=0});
 var pick=names.slice(0,4);
 if(noble.length>=3){
  out.push('<p>귀인과 재능을 뜻하는 별이 <b>'+noble.length+'가지</b>나 성립해 있어('+noble.slice(0,4).join('·')+(noble.length>4?' 외':'')+'). 필요한 순간에 도움이 붙고 재능이 눈에 띄는 쪽으로 풀리는 바탕이 네 명식에 들어 있다는 뜻이야.</p>');
 }
 if(pick.length){
  out.push('<ul class="gdvList">'+pick.map(function(n){return '<li><b>'+esc(n)+'</b> <span class="gdvTag">'+esc(posOf(P,n))+'</span><br>'+esc(STAR[n])+'</li>'}).join('')+'</ul>');
  pick.forEach(function(n){ev.push(n+'('+posOf(P,n)+')')});
 }
 var USE={'재성':'사람과 현실 조건을 챙기는 데','식상':'표현하고 만들어 내는 데','관성':'책임과 역할을 감당하는 데','인성':'배우고 이해하고 받쳐 주는 데','비겁':'스스로 버티고 증명하는 데'};
 out.push('<p>너는 평범한 사람이 아니야. 다만 지금까지는 그 재능을 '+(USE[P.top]||'남을 챙기는 데')+' 먼저 써 왔을 거야. 이제는 네 쪽으로 쓸 차례야.</p>');
 return {title:'너는 이런 사람이야',html:out.join(''),ev:ev.join(' · ')};
}

/* ---------- 2. 단점 콕 + 처방 ---------- */
function flaws(P){
 var L=[];
 function add(id,text,fix,ev){L.push({id:id,text:text,fix:fix,ev:ev})}
 var b=pc(P,'비겁'),s=pc(P,'식상'),j=pc(P,'재성'),g=pc(P,'관성'),i=pc(P,'인성');
 if(b<=8)add('b-low','거절을 못 해. 착해서가 아니야. 자기 기준을 세우고 지키는 힘(비겁 '+b+'%)이 얇아서, 남의 기대에 맞추다 보면 네 속도가 사라져. 그러고는 속으로 소진돼.','하루 일정에 “내가 정하는 시간” 한 칸을 먼저 막아 둬. 거절은 “지금은 어려워, 이번 주 안에 다시 말해 줄게”로 시작하면 쉬워.','비겁 '+b+'%');
 if(b>=30)add('b-high','내 방식이 확고해서 도움을 청하거나 양보하는 데 인색해. 혼자 해내는 힘이 큰 만큼, 곁에서 사람이 멀어지는 순간이 생겨.','결정하기 전에 한 사람에게 “내 생각은 이런데 어때?”를 먼저 물어봐. 답이 같아도 괜찮아. 묻는 것 자체가 관계를 지켜 줘.','비겁 '+b+'%');
 if(g>=28)add('g-high','책임과 체면을 너무 많이 짊어져. “해야 한다”가 “하고 싶다”를 눌러서, 지쳐도 내려놓질 못해.','책임을 맡기 전에 결정권과 끝나는 기준을 먼저 확인해. 끝이 보이는 책임만 받아.','관성 '+g+'%');
 if(g<=6)add('g-low','규칙이나 평가가 답답해서 피하다가, 중요한 순간에 기준이 흔들려. 자유로운 게 장점인데 믿고 맡기기엔 불안하다는 말을 들을 수 있어.','약속은 눈에 보이는 곳에 적어 두고, 끝낸 일은 한 줄로 공유해. 신뢰는 작은 마무리가 쌓여서 만들어져.','관성 '+g+'%');
 if(i<=8)add('i-low','도움받는 데 서툴러. 받쳐 주는 힘이 얇은 구조인데 혼자 해결하려 해서, 같은 일도 남보다 무겁게 느껴져.','한 달에 한 번, 도움받을 일 하나를 일부러 사람에게 맡겨 봐. 맡기는 연습이 네 체력을 아껴 줘.','인성 '+i+'%');
 if(i>=32)add('i-high','준비가 끝나야 움직여. 생각과 공부는 충분한데 시작이 늦어서 기회가 지나가는 경우가 있어.','70% 정도 준비되면 시작해. 나머지 30%는 하면서 채우는 게 네 구조에 맞아.','인성 '+i+'%');
 if(j>=30)add('j-high','쉬는 시간이 비용처럼 느껴져. 결과와 계산이 눈앞에 보여서, 쉬는 동안에도 머릿속 계산이 꺼지지 않아.','쉬는 시간을 일정표에 계획으로 넣고 이름을 붙여. “충전 1시간”처럼 이름이 있으면 죄책감이 줄어.','재성 '+j+'%');
 if(s>=32)add('s-high','머릿속에 있는 걸 바로 말로 꺼내서, 말이 생각보다 앞서 나갈 때가 있어. 말하고 나서 “굳이 그렇게까지 말했나” 하고 곱씹는 날이 생겨.','중요한 말은 메모에 먼저 적고 하루 뒤에 보내. 급한 말 한 번이 쌓은 신뢰를 흔들 수 있어.','식상 '+s+'%');
 if(s<=8)add('s-low','하고 싶은 말을 삼켜. 표현하지 않은 마음은 상대가 알 수 없고, 쌓이다가 어느 날 한꺼번에 터져.','하루에 한 문장만 내 마음을 말로 해 봐. “나는 이게 좋아” 같은 작은 문장부터면 돼.','식상 '+s+'%');
 if(P.yin==='음'&&(s<=24||(i>=32&&s<=30)))add('quiet','서운함을 말하지 않고 품다가 거리를 둬. 상대는 이유도 모른 채 눈치만 보다가 지쳐 가. “알아주길 기다렸다”고 하겠지만, 말하지 않은 마음은 상대에게는 그냥 거리야.','서운함은 3일을 넘기지 말고 “그때 이런 느낌이 들었어”까지만 말해. 해결을 요구하지 않아도 돼.','일간 '+P.stem+'('+P.yin+') · 식상 '+s+'%');
 if(has(P,'귀문관살')||has(P,'원진살')){var nn=[has(P,'귀문관살')?'귀문관살('+posOf(P,'귀문관살')+')':'',has(P,'원진살')?'원진살('+posOf(P,'원진살')+')':''].filter(Boolean).join('·');add('ruminate','곱씹는 버릇이 있어. 사소한 말도 밤에 다시 꺼내 보고, 상대 표정 하나로 하루가 흔들려.','밤에 곱씹는 생각은 메모장에 한 줄로 적고 덮어 둬. 내일 아침에도 그대로면 그때 말해.',nn)}
 if(has(P,'현침살'))add('sharp','말이 날카롭게 꽂힐 때가 있어. 평소엔 부드러운데 화가 쌓이면 한마디가 칼이 돼서, 아끼는 사람이 제일 먼저 다쳐.','화가 난 날은 문장을 “사실 하나 + 부탁 하나”로만 말해. 평가하는 말은 빼.','현침살('+posOf(P,'현침살')+')');
 ['괴강살','양인살','백호살'].some(function(n){if(has(P,n)){add('strong','성격이 강해서 한번 부딪히면 물러서지 않아. 이긴 싸움이 관계를 잃게 만들 때도 있어.','이기고 싶은 순간에 “이 사람과 오래 갈 건가?”를 먼저 물어봐. 답이 “그렇다”면 한 발 물러서는 쪽이 이기는 거야.',n+'('+posOf(P,n)+')');return true}return false});
 ['도화살','홍염살'].some(function(n){if(has(P,n)){add('charm','끌리는 매력이 관계를 복잡하게 만들기도 해. 선을 정해 두지 않으면 오해가 따라와.','가까워지는 사람에게 처음부터 “내 기준은 이거야”를 한 번 말해 둬. 선이 있는 매력이 오래 가.',n+'('+posOf(P,n)+')');return true}return false});
 if(P.main&&P.main.type==='충')add('clash','사회에서의 모습과 가까운 사람 앞에서의 마음이 서로 반대로 당겨서, 결정을 하고도 마음이 따로 움직여.','결정할 때 두 쪽에 각각 “이건 지킨다”를 하나씩 정해 두면 흔들림이 줄어.','원국 '+(P.main.label||'충'));
 if(L.length<3){var tg=P.top;add('top','가장 큰 힘('+tg+' '+pc(P,tg)+'%)이 넘칠 때가 문제야. 잘하는 것에 기대다 보면 다른 쪽 힘이 비어 버려.','한 주에 한 번, 평소 잘 안 쓰는 방식으로 일을 처리해 봐.',tg+' '+pc(P,tg)+'%')}
 return L.slice(0,5);
}
function secFlaw(P){
 var F=flaws(P);
 var html='<p>듣기 편한 말만 하면 도움이 안 되니까, 콕 짚어서 말할게.</p><ol class="gdvFlaw">'+F.map(function(f){return '<li><div>'+esc(f.text)+'</div><div class="gdvFix"><b>이렇게 바꿔 봐</b> '+esc(f.fix)+'</div></li>'}).join('')+'</ol>';
 html+='<p>이 단점들은 네가 부족해서가 아니라, 강점이 한쪽으로 쏠려서 생기는 그림자야. 알고 쓰면 그대로 무기가 돼.</p>';
 return {title:'네 단점은 이거야',html:html,ev:dedupe(F.map(function(f){return f.ev}))};
}

/* ---------- 3. 돈 ---------- */
function godsOf(P){return [P.yearGod,P.mg,P.dayGod,P.hourGod].filter(Boolean)}
function secMoney(P){
 var s=pc(P,'식상'),j=pc(P,'재성'),g=pc(P,'관성'),i=pc(P,'인성'),b=pc(P,'비겁');
 var out=[],gods=godsOf(P);
 var strongWealth=(j>=25&&s>=20)||j>=30;
 var holds=P.tier!=='약';
 var verdict;
 if(strongWealth&&holds)verdict='결론부터 말할게. <b>큰돈이 지나가는 구조이고, 그 돈을 감당할 힘도 있어.</b> 부자가 되는 쪽에 가까워. 남기는 습관만 붙으면 상위권으로 갈 수 있어.';
 else if(strongWealth)verdict='결론부터 말할게. <b>돈이 크게 지나가는 구조는 맞아.</b> 그런데 부자가 되느냐는 “남기는 힘” 하나로 갈려. 버는 건 문제가 아닌데, 쥐고 있을 힘이 약한 구조라서 벌어도 사람과 기회에 흩어지기 쉬워.';
 else if(j<=12)verdict='결론부터 말할게. <b>돈 자체를 목표로 두면 힘이 안 붙는 구조야.</b> 재능이나 직책을 먼저 키우면 돈이 따라오는 순서라서, 순서를 거꾸로 가면 허탈해져.';
 else if(g>=20||i>=25)verdict='결론부터 말할게. <b>한 방으로 버는 사람이 아니라, 직책과 전문성으로 올라가는 부(富)야.</b> 시간이 네 편이라 속도를 내기보다 쌓는 게 맞아.';
 else verdict='결론부터 말할게. <b>무난하게 모아 갈 수 있는 구조야.</b> 큰 부자가 되느냐는 구조보다 습관이 결정해.';
 out.push('<p>'+verdict+'</p>');
 /* 버는 방식 */
 var earn=[];
 var out_god=(P.mg==='식신'||P.mg==='상관')?P.mg:(gods.indexOf('식신')>=0?'식신':gods.indexOf('상관')>=0?'상관':'');
 if(j>=25&&s>=20&&out_god)earn.push('재능을 결과물로 만들어 돈으로 바꾸는 구조('+out_god+'생재)야. '+(out_god==='상관'?'새로운 방식으로 풀어내고 직접 팔 때 돈이 커져.':'한 가지를 반복해서 상품이나 서비스로 만들 때 돈이 커져.'));
 else earn.push(GROUP_EARN[P.top]);
 if(gods.indexOf('편재')>=0)earn.push('편재가 들어 있어서 사람을 통해 들어오는 큰 흐름의 돈에 인연이 있어.');
 else if(gods.indexOf('정재')>=0)earn.push('정재가 들어 있어서 꾸준히 쌓이는 월급·고정 수입 쪽이 안정적이야.');
 out.push('<p><b>버는 방식</b> '+esc(earn.join(' '))+'</p>');
 /* 지키는 힘 */
 var keep;
 if(j>=28&&P.tier==='약')keep='재성이 '+j+'%로 큰데 일간은 '+tierWord(P)+'('+P.score+'점)이야. 돈이 들어오는 길은 넓은데 혼자 쥐고 있을 힘이 약해. 이런 구조는 혼자 다 책임지는 순간 돈이 무거워져.';
 else if(j>=28)keep='재성이 '+j+'%로 크고 일간은 '+tierWord(P)+'('+P.score+'점)이라, 큰돈을 다루는 부담을 견딜 힘이 받쳐 줘.';
 else if(j<=12)keep='재성은 '+j+'%로 얇은 편이라 돈에 대한 욕심이 구조상 크지 않아. 대신 재능과 자리가 올라가면 자연스럽게 따라와.';
 else keep='재성은 '+j+'%로 중간 크기야. 돈이 한쪽으로 몰리지 않고 보통 크기로 들어오는 대신, 새는 곳을 막는 만큼 그대로 남아.';
 if(i>=20&&P.tier==='약')keep+=' 다행히 인성이 '+i+'%로 받쳐 줘서, 자격·전문성·후원자를 갖출수록 돈 그릇이 커져.';
 out.push('<p><b>지키는 힘</b> '+esc(keep)+'</p>');
 /* 새는 곳 */
 var leak=[GROUP_LEAK[P.top]];
 if(P.second&&P.second!==P.top&&pc(P,P.second)>=25)leak.push(GROUP_LEAK[P.second]);
 var extra=[];
 if(has(P,'역마살'))extra.push('역마살 때문에 이동·여행·이사 같은 움직임에 드는 돈');
 if(has(P,'도화살')||has(P,'홍염살'))extra.push('사람을 만나고 꾸미고 선물하는 데 드는 돈');
 out.push('<p><b>새는 곳</b> '+esc(leak.join(', '))+'.'+(extra.length?' 여기에 '+esc(extra.join(', '))+'도 같이 새기 쉬워.':'')+'</p>');
 /* 습관 */
 var habits=['돈이 들어오는 날, 자동이체로 먼저 빼 둬. 남는 돈이 아니라 먼저 빠지는 돈이 네 몫이야.','투자·동업·큰 결제는 하루 뒤에 결정해. 서두를 때 새는 구조라서 하루만 늦춰도 막혀.'];
 habits.push(i>=15?'자격증·전문성에 쓰는 돈은 아끼지 마. 새는 돈이 아니라 네 그릇을 키우는 돈이야.':'돈 얘기가 나오는 약속은 문서나 메시지로 남겨 둬. 말로만 한 약속에서 새는 돈이 제일 커.');
 out.push('<p><b>돈 습관 3개</b></p><ol class="gdvFlaw">'+habits.map(function(h){return '<li><div>'+esc(h)+'</div></li>'}).join('')+'</ol>');
 out.push('<p class="gdvNote">재물 흐름에 대한 해석이고 투자 조언이 아니야. 결과를 보증하지 않아.</p>');
 var ev=['재성 '+j+'%','식상 '+s+'%','인성 '+i+'%','관성 '+g+'%','비겁 '+b+'%','일간 '+tierWord(P)+'('+P.score+'점)'];
 if(gods.length)ev.push('십성 '+gods.join('·'));
 return {title:'돈, 솔직하게 말할게',html:out.join(''),ev:ev.join(' · ')};
}

/* ---------- 4. 시기 ---------- */
function ageNow(c){var I=c.input||{};var bd=new Date(I.year,(I.month||1)-1,I.day||1,I.hour||0,I.minute||0);return (Date.now()-bd.getTime())/(365.2425*86400000)}
function secTime(P){
 var c=P.c,out=[],ev=[],age=ageNow(c),I=c.input||{};
 var L=Array.isArray(c.luck)?c.luck:[];
 var cur=null,nxt=null;
 for(var k=0;k<L.length;k++){var a=+L[k].fromAgeExact,z=+L[k].toAgeExact;if(age>=a&&age<z){cur=L[k];nxt=L[k+1]||null;break}}
 if(!cur&&L.length&&age<+L[0].fromAgeExact)nxt=L[0];
 if(cur){out.push('<p><b>지금 대운은 '+esc(cur.ko)+'('+esc(cur.god)+', '+cur.fromAge+'~'+cur.toAge+'세)</b>이야. '+esc(GOD_LUCK[cur.god]||'')+'</p>');ev.push('현재 대운 '+cur.ko+' '+cur.god)}
 if(nxt){
  var bd=new Date(I.year,(I.month||1)-1,I.day||1,I.hour||0,I.minute||0);
  var when=new Date(bd.getTime()+(+nxt.fromAgeExact)*365.2425*86400000);
  var days=Math.round((when.getTime()-Date.now())/86400000);
  var wtxt=when.getFullYear()+'년 '+(when.getMonth()+1)+'월 '+(when.getDate()<=10?'초':when.getDate()<=20?'중순':'말')+'쯤';
  if(days>=-30&&days<=400)out.push('<p><b>대운이 곧 바뀌어.</b> 엔진 계산으로는 '+esc(wtxt)+' '+esc(nxt.ko)+' 대운('+esc(nxt.god)+', '+nxt.fromAge+'~'+nxt.toAge+'세)으로 넘어가. '+esc(GOD_LUCK[nxt.god]||'')+' <span class="gdvTag">학파마다 며칠 차이가 날 수 있어</span></p>');
  else out.push('<p>다음 대운은 '+esc(nxt.ko)+'('+esc(nxt.god)+', '+nxt.fromAge+'세부터)이야. '+esc(GOD_LUCK[nxt.god]||'')+'</p>');
  ev.push('다음 대운 '+nxt.ko+' '+nxt.god);
 }
 var yr=P.transit&&P.transit.year;
 if(yr&&yr.god){out.push('<p><b>올해 세운은 '+esc(yr.pillar)+'('+esc(yr.god)+')</b>이야. '+esc(GOD_YEAR[yr.god]||'')+'</p>');ev.push('올해 세운 '+yr.pillar+' '+yr.god)}
 out.push('<p>대운과 세운은 네 사건을 정해 주는 게 아니라 어떤 과제가 자주 들어올지 알려 주는 신호야. 어떻게 쓰느냐는 여전히 네 몫이야.</p>');
 return {title:'지금 네 시기',html:out.join(''),ev:ev.join(' · ')};
}

/* ---------- 렌더 ---------- */
var CSS='.gdv{margin:0 0 14px;border-radius:20px;background:linear-gradient(180deg,#fffdf8,#fff8ec);border:1px solid rgba(190,150,70,.30);box-shadow:0 6px 18px rgba(80,60,20,.07);padding:18px 18px 8px}'
+'.gdvKick{font-size:12px;font-weight:800;color:#b07a1c;letter-spacing:.04em;margin-bottom:4px}'
+'.gdv h2{font-size:19px;line-height:1.35;margin:0 0 6px;color:#3b2a10}'
+'.gdvSec{padding:14px 0;border-top:1px solid rgba(190,150,70,.22)}.gdvSec:first-of-type{border-top:0}'
+'.gdvSec h3{font-size:16px;margin:0 0 8px;color:#4a3410}'
+'.gdv p{font-size:15px;line-height:1.75;margin:0 0 9px;color:#3a3226;word-break:keep-all}'
+'.gdv b{color:#2d200c}.gdvList{margin:6px 0 10px;padding:0;list-style:none}.gdvList li{padding:9px 12px;margin:0 0 7px;border-radius:12px;background:rgba(255,255,255,.7);border:1px solid rgba(190,150,70,.18);font-size:14.5px;line-height:1.65;color:#3a3226}'
+'.gdvTag{display:inline-block;font-size:11px;font-weight:700;color:#9a6a12;background:rgba(220,180,90,.18);border-radius:8px;padding:1px 7px;margin-left:4px}'
+'.gdvFlaw{margin:6px 0 10px;padding-left:20px}.gdvFlaw li{margin:0 0 12px;font-size:15px;line-height:1.7;color:#3a3226;word-break:keep-all}'
+'.gdvFix{margin-top:5px;padding:8px 10px;border-radius:10px;background:rgba(120,170,110,.12);font-size:14px;line-height:1.65}.gdvFix b{color:#3d6a35;margin-right:4px}'
+'.gdvNote{font-size:12.5px!important;color:#8a7d66!important}'
+'.gdvEv{font-size:11.5px;line-height:1.5;color:#9b8f78;margin:0 0 4px}'
+'.gdvCta{margin:6px 0 12px;padding:12px 14px;border-radius:14px;background:rgba(255,255,255,.75);border:1px dashed rgba(190,150,70,.4);font-size:14px;line-height:1.65;color:#4a3d28}'
+'.gdvCta button{margin-top:8px;border:0;border-radius:12px;padding:10px 16px;font-weight:800;background:#e9b949;color:#3b2a10;cursor:pointer}';
function css(){if(document.getElementById('gdvCss'))return;var s=document.createElement('style');s.id='gdvCss';s.textContent=CSS;(document.head||document.documentElement).appendChild(s)}

function build(c,which){
 var A=window.GUIIN_INTERPRETATION_V4&&GUIIN_INTERPRETATION_V4.engine&&GUIIN_INTERPRETATION_V4.engine.analyze;
 if(!A)return null;
 var P=A(c);
 var S={self:secSelf,flaw:secFlaw,money:secMoney,time:secTime};
 var secs=which.map(function(k){return S[k](P)});
 var html='<div class="gdvKick">✦ 깊이 풀이</div><h2>'+esc(givenName(P.name))+'님의 사주를 있는 그대로 읽어 줄게</h2>';
 html+=secs.map(function(s){return '<div class="gdvSec"><h3>'+esc(s.title)+'</h3>'+s.html+'<div class="gdvEv">근거: '+esc(s.ev)+'</div></div>'}).join('');
 html+='<div class="gdvCta">이 풀이를 내 지금 상황에 맞춰 더 깊이 묻고 싶다면, AI 상담에서 이어서 물어볼 수 있어.<br><button type="button" data-gdv-ask="1">AI 상담으로 이어서 묻기</button></div>';
 return html;
}
var TABS={personality:['self','flaw'],fields:['money','time'],summary:['self','flaw','money','time']};
function render(){
 try{
  var v=document.getElementById('resultView');if(!v)return;
  var tab=(typeof currentTab!=='undefined')?currentTab:'';
  var old=v.querySelector(':scope > .gdv');
  var which=TABS[tab];
  if(!which||typeof chart==='undefined'||!chart||!chart.pillars||typeof hasPremiumLifetime!=='function'||!hasPremiumLifetime()){if(old)old.remove();return}
  var key=(v.dataset.chartSignature||'')+'|'+tab;
  if(old&&old.getAttribute('data-gdv')===key)return;
  if(old)old.remove();
  var html=build(chart,which);if(!html)return;
  css();
  var d=document.createElement('div');d.className='gdv';d.setAttribute('data-gdv',key);d.innerHTML=html;
  var hero=v.querySelector(':scope > .guiinVisualHero');
  var scene=v.querySelector(':scope > .gaScene');
  var anchor=scene||hero;
  if(anchor&&anchor.parentNode===v)v.insertBefore(d,anchor.nextSibling);else v.insertBefore(d,v.firstChild);
  var b=d.querySelector('[data-gdv-ask]');if(b)b.addEventListener('click',function(){try{if(typeof go==='function')go('ask')}catch(e){}});
 }catch(e){try{window.GUIIN_DEEP_VOICE.lastError=String(e&&e.stack||e)}catch(_e){}}
}
var busy=false;
function sched(){if(busy)return;busy=true;setTimeout(function(){busy=false;render()},60)}
function boot(){render();var n=document.getElementById('resultView');if(n)new MutationObserver(sched).observe(n,{childList:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
window.GUIIN_DEEP_VOICE={version:V,render:render,build:build,lastError:null,_flaws:flaws,_has:has,_pc:pc,_given:givenName,_esc:esc,_tierWord:tierWord,_GOD_LUCK:GOD_LUCK,_css:css};
})();
