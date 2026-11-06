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
 비겁:{pers:'내 방식이 맞다는 확신이 기본값이야. 남이 대신 정해 주면 맞는 말이어도 반발심부터 올라와.',work:'내 이름으로 하는 일, 혼자 굴릴 수 있는 일(프리랜서·창업·전문직)',stuck:'남이 내 영역에 간섭할 때'},
 식상:{pers:'머릿속에서 말이 먼저 튀어나와. 하고 싶은 말을 삼킨 날은 그 말이 밤까지 맴돌아.',work:'말·글·기획·콘텐츠처럼 머릿속에 있는 걸 결과물로 꺼내는 일',stuck:'말해도 바뀌지 않는 구조 안에 갇혀 있을 때'},
 재성:{pers:'뭘 하든 "그래서 남는 게 뭔데?"가 먼저 계산돼. 감보다 손익이 빠른 사람이야.',work:'영업·유통·재무·사업처럼 성과가 숫자로 보이는 일',stuck:'노력에 비해 결과가 손에 안 잡힐 때'},
 관성:{pers:'할 일 목록이 머릿속에서 꺼지지 않는 타입이야. 맡았다 하면 "내가 끝내야 돼"가 먼저 튀어나와.',work:'조직·공공기관·관리직처럼 역할과 기준이 분명한 일',stuck:'규칙이 흐리고 누가 책임질지 정해지지 않을 때'},
 인성:{pers:'납득이 안 되면 한 발짝도 안 움직여. 대신 이해가 끝나면 누구보다 깊게 파.',work:'연구·교육·상담·자격이 필요한 분야처럼 깊이 파는 일',stuck:'충분히 생각할 시간 없이 바로 결정을 요구받을 때'}};
var STING={비겁:'도와준다는 말을 간섭으로 듣는 순간이 많아. 혼자 다 하다가 혼자 지치는 건 실력이 아니라 고집 값이야.',식상:'맞는 말을 틀린 타이밍에 해. 말 한마디로 다 된 밥에 재 뿌린 적, 솔직히 있지?',재성:'손해 안 보려다가 사람을 잃는 장면이 반복돼. 계산이 빠른 만큼 정 떨어지는 속도도 빨라.',관성:'"잘해야 해"가 "다 내 탓이야"로 바뀌는 순간이 제일 위험해. 남 실수까지 떠안고 혼자 밤새는 거, 그거 책임감 아니고 과로야.',인성:'생각만 하다 타이밍을 놓쳐. 준비 끝나면 한다는 그 준비, 솔직히 영원히 안 끝나.'};
var STEMSTING={갑:'그리고 한번 정한 방향은 틀려도 안 꺾어. 꺾이면 지는 거라고 생각하지?',을:'그리고 다 맞춰 주는 척하다가 마지막에 혼자 서운해해. 말 안 하면 아무도 몰라.',병:'그리고 기분이 얼굴에 다 써 있어. 숨긴 줄 아는 건 너뿐이야.',정:'그리고 남 기분은 다 챙기면서 네 기분은 맨 뒤로 미뤄. 그게 쌓이면 한 번에 꺼져.',무:'그리고 괜찮다는 말이 습관이야. 안 괜찮은 것까지 괜찮다고 해서 주변이 몰라.',기:'그리고 걱정을 미리 다 해 둬. 일어나지도 않은 일 때문에 오늘을 다 써 버려.',경:'그리고 말이 칼이야. 맞는 말이어도 베이면 아파.',신:'그리고 기준이 높아서 칭찬이 짜. 남한테도, 너 자신한테도.',임:'그리고 생각이 너무 넓게 퍼져서, 정작 결정은 남한테 넘겨.',계:'그리고 눈치로 다 알면서 모른 척해. 그러다 혼자 지쳐.'};
var STFIX={비겁:'이번 주에 딱 하나만 남한테 맡겨 봐.',식상:'할 말이 올라오면 3초 세고, 질문으로 바꿔서 말해.',재성:'이번 달엔 계산 안 하고 먼저 한 번 사 봐.',관성:'오늘 할 일 중 하나는 "안 해도 되는 일"로 지워.',인성:'생각만 하던 일 하나, 30%만 된 상태로 이번 주에 시작해.'};
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

var CORE={갑:'방향을 먼저 세우고',을:'부딪히기 전에 길을 찾아내고',병:'분위기를 먼저 데우고',정:'한 사람을 오래 헤아리고',무:'흔들릴 때 중심을 잡고',기:'빠진 칸을 조용히 채우고',경:'애매한 걸 끝내 주고',신:'마지막 한 군데까지 확인하고',임:'여러 사정을 한꺼번에 읽고',계:'분위기의 변화를 먼저 읽고'};
var IMG={갑:'곧게 뻗어 올라가는 큰 나무',을:'바람에 휘어도 끝내 자리를 잡는 덩굴',병:'모두를 환하게 비추는 해',정:'한 곳을 오래 비추는 촛불',무:'자리를 지키는 큰 산',기:'씨앗을 키워 내는 논밭',경:'단단하게 벼려진 쇠',신:'정교하게 세공된 보석',임:'넓게 흐르는 큰 물',계:'조용히 스며드는 비와 이슬'};
var TAIL={비겁:'그걸 내 방식으로 밀고 가는 사람',식상:'그걸 말과 결과물로 꺼내는 사람',재성:'그걸 현실적인 성과로 바꾸는 사람',관성:'그걸 책임과 기준으로 정리하는 사람',인성:'그걸 깊이 이해해서 자기 답으로 만드는 사람'};
var TOPD={비겁:'결국엔 남 말보다 내 판단을 믿고 움직이는 쪽이야',식상:'느낀 걸 그냥 두지 못하고 말이나 행동으로 꺼내야 속이 풀려',재성:'생각이 늘 "그래서 실제로 뭐가 남는데?" 쪽으로 향해',관성:'해야 할 일과 지켜야 할 선이 늘 머릿속에 켜져 있어',인성:'이해되기 전에는 쉽게 움직이지 않고, 납득되면 오래 가'};
var SEASON={봄:'새로 시작하는 일에서 힘이 붙는 계절',여름:'사람과 활동이 많은 곳에서 살아나는 계절',가을:'정리하고 마무리하는 단계에서 빛나는 계절',겨울:'조용히 깊게 파고들 때 힘이 모이는 계절'};
var DAYPERS={비겁:'가까운 사이에선 대등한 관계를 원하고, 기싸움에선 쉽게 안 져.',식상:'친한 사람 앞에선 말이 많아지고 장난기도 확 올라와.',재성:'가까운 사람한테는 말보다 현실적으로 챙겨 주는 걸로 마음을 표현해.',관성:'아무리 가까워도 예의와 선은 지키는 편이라, 처음엔 조금 어렵게 보일 수 있어.',인성:'친한 사람에게는 기대고 싶고, 내 마음을 이해받고 싶어 해.'};
var SECD={비겁:'한번 시작한 건 남 눈치 안 보고 끝까지 가는 뚝심도 있어',식상:'생각을 말과 글로 풀어내는 표현력도 좋아',재성:'그 감각을 돈이나 결과로 바꾸는 현실 감각도 빨라',관성:'맡은 자리에서 차곡차곡 신뢰를 쌓는 힘도 있어',인성:'새로운 걸 빨리 이해하고 자기 것으로 만드는 흡수력도 있어'};
var CHARMDAY={비겁:'친해지면 "의리 있는 사람"으로 오래 기억돼.',식상:'친해질수록 "생각보다 진짜 재밌다"는 말을 들어.',재성:'가까운 사람에게는 은근히 잘 챙겨 주는 사람으로 보여.',관성:'"이 사람한테는 믿고 맡겨도 되겠다"는 평이 따라와.',인성:'얘기를 잘 들어 줘서 고민 상담을 자주 받는 편이야.'};
var WORKTOP={비겁:'내 이름을 걸고 하는 일, 혼자 판단해서 굴릴 수 있는 일',식상:'말·글·기획·콘텐츠처럼 머릿속에 있는 걸 결과물로 꺼내는 일',재성:'영업·유통·재무·사업처럼 성과가 숫자로 보이는 일',관성:'조직·공공기관·관리직처럼 역할과 기준이 분명한 일',인성:'연구·교육·상담·자격이 필요한 분야처럼 깊이 파는 일'};
var WORKSUB={비겁:'재량이 큰 자리',식상:'아이디어를 내고 바꾸는 자리',재성:'성과가 바로 보이는 자리',관성:'책임과 권한이 분명한 자리',인성:'전문성을 쌓아 가는 자리'};
var WORKBAD={비겁:'혼자 결정하고 밀어붙여야 하는 자리',식상:'계속 말하고 앞에 나서야 하는 자리',재성:'실적 숫자로만 평가받는 자리',관성:'규칙과 보고가 촘촘한 자리',인성:'깊이 생각할 틈 없이 계속 쳐내야 하는 자리'};
var LUCKD={비겁:'이럴 땐 남과 비교하는 대신, 내 속도에 맞는 목표 하나만 정하는 게 좋아.',식상:'바꾸고 싶은 걸 한 번에 다 바꾸기보다 하나씩 작게 시험해 봐.',재성:'모을 금액과 기간을 숫자로 정해 두면 막연한 압박이 계획으로 바뀌어.',관성:'맡은 일의 범위를 글로 정해 두면 부담이 훨씬 줄어.',인성:'배우는 건 좋지만, "언제까지 해 본다"는 날짜를 꼭 붙여.'};
var DAYWANT={비겁:'친구처럼 대등하게 지내는 관계를 원해',식상:'말이 잘 통하고 같이 웃을 수 있는 게 제일 중요해',재성:'생활을 같이 꾸리는 안정감을 원해',관성:'믿고 기댈 수 있는 사람을 원해',인성:'나를 이해해 주고 기다려 주는 사람을 원해'};
function seasonOf(b){return '인묘진'.indexOf(b)>=0?'봄':'사오미'.indexOf(b)>=0?'여름':'신유술'.indexOf(b)>=0?'가을':'겨울';}
function jo(w,a,b){var ch=w.charCodeAt(w.length-1);var has=ch>=0xAC00&&ch<=0xD7A3&&(ch-0xAC00)%28!==0;return w+(has?a:b);}
function read(c){
  if(!c||!c.pillars||!c.pillars.day||!G())return null;
  var stem=c.pillars.day.stem,S=STEM[stem];if(!S)return null;
  var cs=census(c),el=elPct(c),st=starNames(c),T=GTOP[cs.top],yang='갑병무경임'.indexOf(stem)>=0;
  var dayG=GROUP[godAt(c,mainHidden(c.pillars.day.branchIndex))]||cs.top;
  var desc=Object.keys(cs.pct).sort(function(a,b){return cs.pct[b]-cs.pct[a];}),second=desc[1];
  var self=(cs.pct.비겁||0)+(cs.pct.인성||0),season=seasonOf(c.pillars.month?c.pillars.month.branch:'');
  var nm=stem+S.el,rows=[];
  rows.push({k:'넌 이런 사람이야',t:season+'에 태어난 '+jo(nm,'이라','라')+', '+CORE[stem]+' '+TAIL[cs.top]+'이야.',
    d:IMG[stem]+'에 가까운 기운이고, '+SEASON[season]+'에 태어났어. 원국에서 '+jo(cs.top,'이','가')+' '+cs.pct[cs.top]+'%로 가장 커서 '+TOPD[cs.top]+'.',
    ev:nm+' 일간 · '+season+'('+(c.pillars.month?c.pillars.month.branch:'')+'월) · '+cs.top+' '+cs.pct[cs.top]+'%'});
  var strength=self>=45?'혼자서도 버티고 밀고 가는 힘이 있어서, 남한테 쉽게 휘둘리지 않아.':self<=20?'혼자 다 짊어지기보다 곁에 받쳐 주는 사람이 있을 때 실력이 훨씬 잘 나와.':'';
  rows.push({k:'성격',t:T.pers+' '+DAYPERS[dayG],d:S.pers+(strength?' '+strength:''),ev:'일간 · 일지 '+dayG+' · 비겁+인성 '+self+'%'});
  var hasSec=second&&cs.pct[second]>0&&second!==cs.top;
  rows.push({k:'장점',t:jo(S.str,'이','가')+' 네 무기야.'+(hasSec?' 거기에 '+SECD[second].replace(/도 (좋아|빨라|있어)$/,'까지 $1')+'.':''),d:(hasSec?jo(second,'이','가')+' '+cs.pct[second]+'%로 두 번째로 커서 이 힘이 같이 붙어. ':'')+'원국에서 '+jo(cs.top,'이','가')+' 가장 커서, 이 무기를 '+({비겁:'내 방식대로 밀고 갈 때',식상:'말이나 결과물로 꺼낼 때',재성:'현실적인 성과로 바꿀 때',관성:'책임 있는 자리에서 쓸 때',인성:'깊이 이해한 뒤에 쓸 때'})[cs.top]+' 제일 빛나.',ev:'일간 · 두 번째 힘 '+second});
  rows.push({k:'남들이 느끼는 매력',t:S.charm+' '+CHARMDAY[dayG]+(st['도화살']?' 처음 본 사람도 눈길이 가는 끌림까지 있어.':''),d:'처음 만난 사람은 '+nm+' 일간 특유의 분위기에 먼저 끌리고, 가까워질수록 배우자 자리(일지)의 '+dayG+' 기운이 드러나서 그런 평을 듣게 돼.'+(st['도화살']?' 도화살은 사람의 시선을 끄는 별이야.':''),ev:'일간 · 일지 '+dayG+(st['도화살']?' · 도화살':'')});
  rows.push({k:'쓴소리 한 줄',t:STING[cs.top]+(STEMSTING[stem]?' '+STEMSTING[stem]:''),d:'원국에서 '+jo(cs.top,'이','가')+' '+cs.pct[cs.top]+'%로 가장 커서, 이 힘이 과해지면 딱 이렇게 튀어나와. 고칠 건 하나야. '+STFIX[cs.top],ev:'가장 큰 힘 '+cs.top+' '+cs.pct[cs.top]+'%'});
  rows.push({k:'잘 맞는 일',t:WORKTOP[cs.top]+(second&&second!==cs.top&&cs.pct[second]>0?', 그중에서도 '+WORKSUB[second]:'')+'에서 힘이 제일 잘 나와.',d:'반대로 '+WORKBAD[cs.thin]+'에서는 능력과 상관없이 쉽게 지쳐. 원국에 '+jo(cs.thin,'이','가')+' '+cs.pct[cs.thin]+'%로 가장 얇아서 그래.',ev:'가장 큰 힘 '+cs.top+' · 두 번째 '+second+' · 가장 얇은 힘 '+cs.thin});
  var L=curLuck(c);
  if(L&&GROUP[L.god]){var lg=GROUP[L.god],extra=cs.pct[lg]<=10?' 원래 익숙하지 않은 힘이라 더 크게 느껴질 수 있어.':'';
    var rel='';try{(G().chartRelations([c.pillars.day,null,null,L])||[]).forEach(function(r){if(r.layer!=='지지')return;if(r.type==='충')rel=' 특히 이 대운은 배우자 자리(일지)와 부딪혀서, 가까운 관계나 생활 리듬이 흔들리기 쉬운 10년이야.';else if(r.type==='육합'&&!rel)rel=' 이 대운은 배우자 자리(일지)와 묶여서, 가까운 사람과 더 단단해지는 10년이기도 해.';});}catch(_e){}
    rows.push({k:'지금 대운',t:'지금 '+(L.stem+L.branch)+' 대운은 '+LUCK[lg]+extra,d:LUCKD[lg]+rel,ev:'현재 대운 '+L.stem+L.branch+'('+L.god+')'});}
  rows.push({k:'잘 맞는 사람',t:'넌 '+NEED[cs.thin]+'이랑 잘 맞아.',d:'원국에 '+jo(cs.thin,'이','가')+' '+cs.pct[cs.thin]+'%로 가장 얇아서, 그 빈자리를 채워 주는 사람 곁에서 편해져. 배우자 자리(일지)에는 '+dayG+' 기운이 있어서 '+DAYWANT[dayG]+'.',ev:'가장 얇은 힘 '+cs.thin+' · 일지 '+dayG});
  var mood=[],mev=[],tip='';
  if(st['귀문관살']){mood.push('생각이 많아지는 밤이면 감정이 가라앉거나 예민해질 수 있어.');mev.push('귀문관살');tip='밤에 떠오른 생각으로 결론을 내리지 말고, 메모만 해 두고 아침에 다시 봐.';}
  if((el['화']||0)>=30||(cs.gods['상관']||0)>=2||cs.monthGod==='상관'){mood.push('참다가 한 번에 욱하는 면이 있어. 대신 금방 식는 편이야.');mev.push((el['화']||0)>=30?'화 '+el['화']+'%':'상관');tip=tip||'욱할 것 같으면 그 자리에서 답하지 말고 10분만 자리를 떠 봐.';}
  else if(cs.top==='관성'&&cs.gods['편관']){mood.push('압박이 쌓이면 예민해지고 말이 짧아져.');mev.push('편관');tip=tip||'말이 짧아지는 날은 "오늘 좀 지쳤어"라고 먼저 말해 두면 오해가 줄어.';}
  if(mood.length<2&&((el['수']||0)>=30||cs.top==='인성')){mood.push('혼자 있는 시간에 생각이 깊어져서 감정이 오래 가는 편이야.');mev.push((el['수']||0)>=30?'수 '+el['수']+'%':'인성');tip=tip||'생각이 꼬리를 물면 몸을 먼저 움직여. 산책 20분이 생각 2시간보다 나아.';}
  if(mood.length<2&&st['원진살']){mood.push('가까운 사람에게 이유 없이 서운함이 쌓이는 날이 있어.');mev.push('원진살');tip=tip||'서운함은 쌓아 두지 말고 그 주 안에 한 줄로 말해.';}
  if(!mood.length){mood.push(yang?'감정이 빨리 끓고 빨리 식는 편이야.':'겉으로는 괜찮은 척해도 속으로 오래 담아 두는 편이야.');mev.push(yang?'양간':'음간');tip=yang?'화난 순간의 말이 오래 남으니, 중요한 얘기는 한숨 돌리고 해.':'괜찮은 척이 길어지기 전에, 믿는 사람 한 명에게는 털어놔.';}
  rows.push({k:'감정 패턴',t:mood.slice(0,2).join(' '),d:tip,ev:mev.slice(0,2).join(' · ')});
  rows.push({k:'이럴 때 답답해',t:T.stuck+' 제일 답답해.',d:S.stuck.replace(/때$/,'때도')+' 마음이 쉬지 못해. 원국에서 '+jo(cs.top,'이','가')+' 가장 큰 힘이라, 그 힘을 쓸 수 없는 상황이 오면 숨이 막히는 거야.',ev:'일간 · 가장 큰 힘 '+cs.top});
  return {stem:stem,rows:rows};
}

/* ---------- 화면 ---------- */
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];});}
function cardHTML(R,name,full){
  var FREE=5;
  var rows=R.rows.map(function(r,i){if(!full&&i>=FREE)return '<li class="lock"><b>'+esc(r.k)+'</b><p>평생사주에서 열려</p></li>';return '<li><b>'+esc(r.k)+'</b><p>'+esc(r.t)+'</p>'+(r.d?'<p class="gptrD">'+esc(r.d)+'</p>':'')+'<span>근거 · '+esc(r.ev)+'</span></li>';}).join('');
  return '<section class="gptrCard" data-gptr="1" data-full="'+(full?1:0)+'" data-polish-skip="1"><div class="mini">한눈에 보는 나</div><h3>'+esc(name)+', 넌 이런 사람이야</h3>'
    +'<ul class="gptrList">'+rows+'</ul>'
    +(full?'<p class="gptrNote">아래부터는 이 문장들이 왜 나왔는지, 일·관계·돈·시기별로 자세히 풀어 줄게.</p>':'<button type="button" class="gptrBuy" data-gptr-buy="1">잘 맞는 일·지금 대운·감정 패턴까지 보기 ›</button>')+'</section>';
}
var CSS='#resultView.gR1 > .gptrCard{order:4}#resultView .gptrCard{margin:14px 0;padding:20px 16px;border-radius:20px;background:linear-gradient(180deg,#fffaf0,#fdf5e6);border:1px solid #efdfbf}'
 +'#resultView .gptrCard .mini{font-size:12px;color:#a07a2c;font-weight:800;margin-bottom:6px}#resultView .gptrCard h3{font-size:19px;margin:0 0 10px;color:#2f2a20}'
 +'#resultView .gptrList{list-style:none;margin:0;padding:0}#resultView .gptrList li{padding:11px 0;border-top:1px solid #f0e4cb}#resultView .gptrList li:first-child{border-top:0}'
 +'#resultView .gptrList b{display:block;font-size:12.5px;color:#a07a2c;margin-bottom:3px}#resultView .gptrCard .gptrList p{font-size:15px;line-height:1.6;margin:0;color:#2b2720;font-weight:600}'
 +'#resultView .gptrList li.lock{opacity:.5}#resultView .gptrCard .gptrBuy{width:100%;margin-top:12px;padding:12px;border:0;border-radius:12px;background:#2f5d46;color:#fff;font-weight:700;font-size:14px}#resultView.gR1 > .gptrCard.free{order:0}'
 +'#resultView .gptrCard .gptrList p.gptrD{font-size:13.5px;font-weight:400;color:#5c5446;margin-top:4px;line-height:1.65}'
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
