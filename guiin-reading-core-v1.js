/* 귀인사주 · 핵심 판단 레이어 V1
 * - 계산 엔진과 판정 결과는 읽기만 한다 (GuiinSaju 결과 + GUIIN_INTERPRETATION_V4.engine.analyze).
 * - 사주: 풀이 맨 앞에 '핵심 결론' 한 섹션을 붙인다. 중심 가설 → 지지 근거 → 제한 근거 → 행동 연결 → 알 수 없는 부분.
 * - 궁합: 두 사람이 만드는 반복 고리 하나를 핵심 결론으로 고른다(기존 엔진의 같은 반응 사전을 그대로 쓴다).
 * - 같은 판단을 AI 상담 자료(deep_reading)에도 넘길 수 있게 GuiinReadingCore로 공개한다.
 * - 스위치: window.GUIIN_READING_CORE_ON (false면 끔). 실패하면 기존 풀이를 그대로 돌려준다.
 */
(function(root){
'use strict';
if(root.GuiinReadingCore)return;
var ON=root.GUIIN_READING_CORE_ON!==false;
var LOG=[];
var G2={비견:'비겁',겁재:'비겁',식신:'식상',상관:'식상',정재:'재성',편재:'재성',정관:'관성',편관:'관성',정인:'인성',편인:'인성'};
var KE={비겁:'관성',식상:'인성',재성:'비겁',관성:'식상',인성:'재성'}; /* 이 그룹을 누르는 그룹 */
var SAENG={비겁:'인성',식상:'비겁',재성:'식상',관성:'재성',인성:'관성'}; /* 이 그룹을 만들어 주는 그룹 */
var OUTWARD={식상:1,재성:1,관성:1};
var POS=[{k:'mainGod',label:'태어난 달의 중심 기운(월령)',w:2},{k:'mg',label:'월간',w:1.5},{k:'dayGod',label:'일지',w:1.5},{k:'hourGod',label:'시간',w:1},{k:'yearGod',label:'연간',w:0.5}];

/* 십성별 행동 연결: 상황 → 먼저 하는 생각 → 행동 → 주변 반응 → 남는 것 / 반복될 때의 부담
   (sit·think·act·react는 문장, gain·cost는 '남는 것'과 '부담'을 나타내는 명사구) */
var CHAIN={
비견:{core:'스스로 정한 기준대로 끝까지 해내는 사람',sit:'일의 방향이 애매하거나 남이 대신 정하려 할 때',think:'“이건 내가 판단해야 제대로 돼”라는 생각이 먼저 들어',act:'결정권을 쥐고 직접 움직여',react:'주변은 맡겨 두면 결론이 난다고 믿고 기대',gain:'내 손으로 결과를 만들었다는 확신',cost:'도움을 받는 게 번거롭게 느껴져서 혼자 지는 몫이 커지는 것',use:'책임 범위와 결정권이 분명한 자리',keep:'혼자 할 일과 같이 정할 일을 시작할 때 나눠 두는 것',flaw:'고집이 세다는 말',flawWhy:'남의 기준에 휩쓸리지 않으려고 자기 판단을 지키는 방식'},
겁재:{core:'사람 사이에서 판을 키우고 자기 몫을 빠르게 챙기는 사람',sit:'여럿이 같이 움직이는데 누가 앞장설지 정해지지 않았을 때',think:'“지금 움직이지 않으면 기회를 놓쳐”라는 생각이 먼저 들어',act:'사람을 모아 먼저 치고 나가',react:'주변은 덕분에 일이 빨리 굴러간다고 느끼지만 속도를 따라가기 버거워하기도 해',gain:'같이 해서 판이 커졌다는 성취감',cost:'경쟁과 비교가 이어지면서 쉬어야 할 때도 멈추지 못하는 것',use:'협업과 경쟁이 함께 있는 빠른 현장',keep:'같이 쓰는 돈과 시간의 경계를 미리 정해 두는 것',flaw:'욕심이 많다는 말',flawWhy:'뒤처져서 내 몫을 잃지 않으려는 방식'},
식신:{core:'좋아하는 일을 꾸준히 손으로 만들어 내는 사람',sit:'관심 가는 일이 생기거나 누군가 필요한 걸 말할 때',think:'“이건 내가 직접 만들어 보면 되겠다”가 먼저 떠올라',act:'서두르지 않고 손에 익을 때까지 꾸준히 만들어',react:'주변은 결과물이 늘 일정한 수준으로 나온다고 믿어',gain:'내가 만든 게 누군가에게 쓰였다는 만족',cost:'좋아하는 방식대로만 하고 싶어서 마감과 남의 요구가 몰리면 의욕이 확 꺼지는 것',use:'자기 속도로 품질을 쌓을수록 가치가 커지는 자리',keep:'잘하는 일 사이에 내가 즐거운 시간을 일부러 남겨 두는 것',flaw:'느긋하다는 말',flawWhy:'급하게 만들어서 품질이 흔들리는 걸 막으려는 방식'},
상관:{core:'더 나은 방법이 보이면 바로 말로 바꾸려는 사람',sit:'답답한 방식이 반복되거나 비효율이 눈에 보일 때',think:'“이렇게 하면 훨씬 나은데”가 먼저 떠올라',act:'바로 말로 꺼내서 판을 바꾸려고 해',react:'주변은 덕분에 일이 새로워진다고 느끼지만 지적받았다고 느끼는 사람도 생겨',gain:'내 말로 상황이 바뀌었다는 생기',cost:'꺼낸 말이 평가로 들려서 그 뒤를 수습하는 데 드는 힘',use:'새로운 방식이 필요하고 말과 기획이 결과로 이어지는 자리',keep:'꺼내기 전에 상대가 원하는 게 공감인지 해결인지 한 번 확인하는 것',flaw:'말이 세다는 말',flawWhy:'답답한 걸 그냥 두지 못하고 더 나은 쪽으로 바꾸려는 방식'},
편재:{core:'기회와 사람을 넓게 연결해 판을 움직이는 사람',sit:'새로운 사람이나 기회가 눈앞에 보일 때',think:'“이걸 저기랑 연결하면 되겠다”가 먼저 보여',act:'빠르게 사람과 자원을 이어서 일을 성사시켜',react:'주변은 덕분에 기회가 넓어진다고 느껴',gain:'일이 실제로 굴러가는 걸 확인하는 재미',cost:'벌여 놓은 일이 많아져서 정작 마무리할 힘이 모자라는 것',use:'사람과 기회를 연결해 결과를 내는 자리',keep:'새 일을 늘리기 전에 끝낼 일 하나를 먼저 정하는 것',flaw:'일을 너무 벌인다는 말',flawWhy:'기회를 놓쳐서 후회하는 걸 피하려는 방식'},
정재:{core:'계획한 만큼 꾸준히 관리해서 손해를 막는 사람',sit:'계획이 막연하거나 비용·시간이 새는 게 보일 때',think:'“그래서 실제로 얼마나 들고, 언제까지 되는데?”부터 따져',act:'숫자와 일정으로 정리해서 새는 곳을 먼저 막아',react:'주변은 덕분에 현실에서 발이 묶이는 일이 줄어',gain:'계획대로 쌓여 간다는 안도감',cost:'성과가 안 보이는 시간이 비용처럼 느껴져서 쉬는 날에도 마음이 바쁜 것',use:'비용·일정·약속을 꼼꼼히 관리해 결과를 지키는 자리',keep:'성과와 상관없는 시간을 일정에 먼저 넣어 두는 것',flaw:'계산적이라는 말',flawWhy:'막연한 기대보다 실제로 지킬 수 있는 약속을 지키려는 방식'},
편관:{core:'압박이 큰 상황에서 책임을 떠안고 돌파하는 사람',sit:'일이 급하게 터지거나 아무도 나서지 않을 때',think:'“결국 누군가는 해야 해”라는 생각이 들어',act:'부담을 떠안고 앞에서 정면으로 밀고 나가',react:'주변은 덕분에 위기를 넘겼다고 느끼고 다음에도 기대',gain:'버텨서 해냈다는 단단함',cost:'긴장 상태가 기본값이 돼서 위기가 끝나도 몸이 쉬는 법을 잊는 것',use:'빠른 판단과 책임이 필요한 자리',keep:'위기가 끝나면 쉬는 날을 먼저 달력에 박아 두는 것',flaw:'너무 세게 몰아붙인다는 말',flawWhy:'일이 무너지는 걸 끝까지 막으려는 방식'},
정관:{core:'맡은 역할과 약속을 기준대로 지키는 사람',sit:'규칙이 흐리거나 누가 책임질지 정해지지 않았을 때',think:'“이건 누군가 제대로 정리해야 해”라는 생각이 들어',act:'기준과 순서를 세우고 그 역할을 맡아',react:'주변은 덕분에 각자 할 일이 분명해졌다고 느껴',gain:'믿을 만한 사람이라는 신뢰',cost:'평가가 끝나지 않는 느낌 때문에 쉬어도 긴장이 다 풀리지 않는 것',use:'기준과 책임이 분명하고 신뢰가 쌓이는 자리',keep:'내가 맡지 않아도 되는 일을 한 가지씩 내려놓는 연습',flaw:'융통성이 없다는 말',flawWhy:'약속이 가볍게 바뀌어 누군가 손해 보는 걸 막으려는 방식'},
편인:{core:'남들이 안 보는 각도로 혼자 깊이 파고드는 사람',sit:'다들 당연하게 넘기는 일이 이상하게 느껴질 때',think:'“이건 다른 이유가 있을 거야”라는 생각에 빠져들어',act:'혼자 조용히 파고들어서 자기만의 답을 찾아',react:'주변은 생각지 못한 관점이라며 놀라기도 하고, 무슨 생각인지 몰라 거리를 느끼기도 해',gain:'남이 못 본 걸 찾아냈다는 확신',cost:'혼자 내린 결론을 설명하지 않아서 오해가 쌓이는 것',use:'깊이 있는 분석과 독자적인 관점이 가치가 되는 자리',keep:'혼자 내린 결론을 한 줄이라도 먼저 말로 꺼내는 것',flaw:'속을 모르겠다는 말',flawWhy:'충분히 확신하기 전에는 섣불리 말하지 않으려는 방식'},
정인:{core:'충분히 이해하고 배운 다음에 움직이는 사람',sit:'처음 겪는 일이나 판단할 정보가 부족할 때',think:'“먼저 제대로 알아보고 싶어”가 앞서',act:'자료와 사람 말을 모아 충분히 정리한 뒤 움직여',react:'주변은 깊이 있게 본다고 믿고 의견을 물어',gain:'이해가 끝났을 때 오래 흔들리지 않는 확신',cost:'정리가 끝나기 전엔 움직이지 않아서 속도를 원하는 사람과 엇갈리는 것',use:'충분히 배우고 깊이 볼수록 가치가 커지는 자리',keep:'다 알기 전이라도 지금까지 이해한 만큼을 중간에 꺼내는 것',flaw:'생각만 많다는 말',flawWhy:'잘못 판단해서 일을 되돌리는 걸 피하려는 방식'}
};

var EXTRA={"비견": ["혼자서도 방향을 정하고 끝까지 책임지는 능력", "맡겨 두면 결론이 난다는 안심", "‘이건 같이 정하자’를 일 시작할 때 한 번 말하는 것", "혼자 지는 몫이 커져"], "겁재": ["사람을 모아 판을 빠르게 키우는 능력", "일이 멈춰 있을 때 먼저 움직여 주는 추진력", "같이 쓰는 돈과 시간의 한도를 먼저 말해 두는 것", "비교와 경쟁이 길어지면 멈추지 못해"], "식신": ["꾸준히 손에 익혀 일정한 품질을 내는 능력", "믿고 맡길 수 있는 결과물", "마감이 몰리기 전에 ‘이 속도로 하면 언제 끝나’를 먼저 공유하는 것", "내 속도가 깨지면 의욕이 확 꺼져"], "상관": ["막힌 방식을 알아보고 더 나은 길을 말로 여는 능력", "답답한 상황을 바꾸는 새 관점", "지적하기 전에 잘된 점 하나를 사실로 먼저 짚는 것", "맞는 말이 평가로 들려서 수습이 길어져"], "편재": ["흩어진 사람과 기회를 하나로 엮는 능력", "혼자서는 몰랐을 기회와 연결", "새 일을 하나 늘릴 때 끝낼 일 하나를 같이 정하는 것", "벌인 일이 많아지면 마무리할 힘이 먼저 모자라"], "정재": ["흩어진 비용과 일정을 실제 숫자로 묶는 능력", "현실에서 발이 묶이지 않는 안정감", "‘이번 주 성과 없는 시간’ 하나를 일정에 미리 넣어 두는 것", "성과가 안 보이는 시간이 비용처럼 느껴져"], "편관": ["위기에서 겁먹지 않고 책임을 떠안는 능력", "무너질 뻔한 일을 붙잡아 주는 든든함", "위기가 끝난 날 바로 쉬는 날을 정하는 것", "위기가 끝나도 몸이 긴장을 놓지 못해"], "정관": ["기준을 세워 모두가 헤매지 않게 하는 능력", "각자 할 일이 분명해지는 질서", "내가 맡지 않아도 되는 일 하나를 이름 붙여 넘기는 것", "평가가 끝나지 않는 느낌에 쉬어도 쉬는 것 같지 않아"], "편인": ["남이 놓친 각도에서 답을 찾는 능력", "생각지 못한 관점", "혼자 내린 결론을 한 줄이라도 먼저 말로 꺼내는 것", "혼자 내린 결론을 말하지 않아서 오해가 쌓여"], "정인": ["충분히 이해해서 흔들리지 않는 판단을 내리는 능력", "믿고 물어볼 수 있는 깊이", "다 알기 전이라도 ‘지금까지는 여기까지야’를 중간에 꺼내는 것", "정리가 끝나기 전엔 움직이지 않아서 속도가 엇갈려"]};
Object.keys(EXTRA).forEach(function(k){var e=EXTRA[k];if(CHAIN[k]){CHAIN[k].gift=e[0];CHAIN[k].help=e[1];CHAIN[k].fix=e[2];CHAIN[k].costShort=e[3];}});
/* 일간이 정하는 '어떻게': 같은 십성이라도 일간에 따라 그 방식이 드러나는 결이 다르다 */
var STEM_TONE={갑:'한번 정한 방향으로 곧게 밀고 가는 쪽',을:'상황에 맞춰 유연하게 길을 바꾸는 쪽',병:'밝고 빠르게 드러내는 쪽',정:'조용히 오래 공들이는 쪽',무:'묵직하게 버티는 쪽',기:'사람을 품고 세심하게 챙기는 쪽',경:'단호하고 분명하게 정리하는 쪽',신:'정확하고 깔끔하게 따지는 쪽',임:'넓게 보고 여유 있게 가는 쪽',계:'조용히 스며들듯 움직이는 쪽'};
var STEM_HOW={갑:'한번 정한 방향으로 곧게',을:'상황에 맞춰 유연하게 돌아가면서',병:'밝고 빠르게 드러내면서',정:'조용히 오래 공들여서',무:'묵직하게 버티면서',기:'사람을 품고 세심하게 챙기면서',경:'단호하고 분명하게',신:'정확하고 깔끔하게 따져서',임:'넓게 보고 여유 있게',계:'조용히 스며들듯'};
var LIMIT={ /* 누르는 그룹이 같이 있을 때: 언제 드러나고 언제 막히는지 */
비겁:'이 패턴이 늘 같은 모습으로 나오지는 않아. 기준과 평가가 강하게 들어오는 자리에서는 자기 판단을 바로 꺼내지 않고 한 번 눌러 두는 면도 같이 있어. 혼자 정할 수 있을 때와 위에서 정해 줄 때 모습이 꽤 달라.',
식상:'이 패턴이 늘 같은 모습으로 나오지는 않아. 충분히 이해하기 전에는 말을 아끼는 면도 같이 있어서, 낯선 자리에서는 표현이 늦게 나와. 편한 사람 앞과 처음 보는 자리에서 모습이 달라.',
재성:'이 패턴이 늘 같은 모습으로 나오지는 않아. 내 방식과 내 몫을 지키려는 마음도 같이 커서, 같이 쓰는 돈이나 공동 일정에서는 조율이 쉽지 않을 수 있어.',
관성:'이 패턴이 늘 같은 모습으로 나오지는 않아. 답답하면 바로 말로 꺼내는 면도 같이 있어서, 기준을 지키다가도 불합리하다고 느끼면 정면으로 문제를 짚어. 지키는 모습과 따지는 모습이 상황에 따라 번갈아 나와.',
인성:'이 패턴이 늘 같은 모습으로 나오지는 않아. 현실 조건을 먼저 챙겨야 하는 상황에서는 충분히 알아볼 시간을 스스로 줄여. 여유가 있을 때와 쫓길 때 판단 방식이 달라.'
};
var TIER={
drain:'이 방식은 밖으로 힘을 쓰는 쪽인데, 계산에서 일간을 받쳐 주는 힘이 약한 편으로 나와. 잘하는 일인데도 유독 빨리 지친다면 능력보다 회복할 틈이 부족해서일 가능성이 커.',
over:'이 방식을 받쳐 주는 힘도 넉넉한 편으로 나와. 그래서 여유가 있을 땐 강점이지만, 피곤할 때는 같은 방식을 더 세게 밀어붙이는 쪽으로 기울기 쉬워.'
};

function txt(s){return String(s==null?'':s);}
function jong(w){w=txt(w);var c=w.charCodeAt(w.length-1);return c>=0xAC00&&c<=0xD7A3&&(c-0xAC00)%28!==0;}
function topic(w){return w+(jong(w)?'은':'는');}
function obj(w){return w+(jong(w)?'을':'를');}
function subj(w){return w+(jong(w)?'이':'가');}
function ida(w){return w+(jong(w)?'이야':'야');}
var WHERE={both:'일과 사회에서도, 가까운 사람 앞에서도 같은 방식이 나오는 편이야.',work:'이 방식은 일과 사회생활에서 먼저 드러나고, 가까운 사람 앞에서는 조금 덜 보여.',close:'이 방식은 일보다 가까운 사람 앞과 일상에서 더 선명하게 드러나.',other:''};
function engine(){var V=root.GUIIN_INTERPRETATION_V4;return V&&V.engine&&typeof V.engine.analyze==='function'?V.engine:null;}

function judge(c){
  var E=engine();if(!E||!c||!c.pillars)return null;
  var P=E.analyze(c);if(!P)return null;
  var score={},seats={};
  var godW={},keys={};
  POS.forEach(function(p){
    if(p.k==='hourGod'&&P.unknownHour)return;
    var g=G2[P[p.k]];if(!g)return;
    score[g]=(score[g]||0)+p.w;(seats[g]=seats[g]||[]).push(p.label+' '+P[p.k]);(keys[g]=keys[g]||[]).push(p.k);
    godW[P[p.k]]=(godW[P[p.k]]||0)+p.w;
  });
  var groups=Object.keys(score).sort(function(a,b){return score[b]-score[a]||(seats[b].length-seats[a].length);});
  var hyp=groups[0];if(!hyp)return null;
  var support=seats[hyp]||[],firm=support.length>=2;
  var god=Object.keys(godW).filter(function(k){return G2[k]===hyp}).sort(function(x,y){return godW[y]-godW[x]})[0];
  var ks=keys[hyp]||[],work=ks.indexOf('mainGod')>=0||ks.indexOf('mg')>=0,close=ks.indexOf('dayGod')>=0;
  var where=work&&close?'both':close?'close':work?'work':'other';
  var god2=Object.keys(godW).filter(function(k){return G2[k]===hyp&&k!==god})[0]||'';
  var lim=KE[hyp],limSeats=seats[lim]||[],limPct=(P.pct&&P.pct[lim])||0,limited=limSeats.length>0||limPct>=20;
  var outward=!!OUTWARD[hyp],tierNote=(P.tier==='약'&&outward)?'drain':(P.tier==='강'&&!outward)?'over':'';
  var pctHyp=(P.pct&&P.pct[hyp])||0;
  return {P:P,name:P.name,hyp:hyp,god:god,god2:god2,where:where,firm:firm,support:support,pctHyp:pctHyp,top:P.top,lim:lim,limSeats:limSeats,limPct:limPct,limited:limited,tierNote:tierNote,tier:P.tier,unknownHour:!!P.unknownHour,low:P.hasLow?P.low:'',lowPct:P.hasLow?(P.pct[P.low]||0):null,tension:(P.tension||[])[0]||null};
}

function personSection(c){
  var J=judge(c);if(!J)return null;
  var C=CHAIN[J.god]||CHAIN[{비겁:'비견',식상:'식신',재성:'정재',관성:'정관',인성:'정인'}[J.hyp]],n=J.name,paras=[];
  var sup=J.support.join(', ');
  var head=J.firm
    ?topic(n)+' '+C.core+'에 가까워. '+subj(sup)+' 같은 쪽을 가리켜서 이걸 중심 패턴으로 읽었어. '+WHERE[J.where]
    :topic(n)+' '+C.core+' 쪽 신호가 가장 먼저 보여. 다만 '+sup+' 한 자리에서만 보이는 신호라, 중심 패턴이라고 단정하지는 않을게.';
  var tone=STEM_TONE[J.P.stem];if(tone&&J.firm)head+=' 같은 '+J.god+' 중심이라도 일간이 '+J.P.stem+(J.P.el||'')+'라서 '+n+'의 방식은 '+ida(tone)+'.';
  if(J.god2&&CHAIN[J.god2])head+=' 같은 계열 안에서 '+J.god2+'도 같이 있어서, 상황에 따라 '+CHAIN[J.god2].core.replace(/ 사람$/,'')+' 모습이 섞여 나와.';
  paras.push(head.trim());
  var how=STEM_HOW[J.P.stem]||'';
  paras.push('예를 들어 '+C.sit+', '+topic(n)+' '+C.think+'. 그래서 '+(how?how+' ':'')+C.act+'. '+C.react+'. 이때 남는 건 '+ida(C.gain)+'.');
  paras.push('이건 '+ida(C.gift)+'. '+C.use+'에서 가장 빛나고, 곁의 사람에게는 '+subj(C.help)+' 돼. 이 강점을 오래 쓰려면 '+subj(C.keep)+' 필요해.');
  paras.push(obj(C.flaw)+' 들을 때가 있다면, 그건 '+ida(C.flawWhy)+'. 이 방식이 문제로 커지는 건 같은 방식이 반복돼서 '+subj(C.cost)+' 쌓일 때야. 그럴 땐 '+C.fix+'부터 해 봐.');
  var lim=[];
  if(J.limited)lim.push(LIMIT[J.hyp]);
  if(J.tierNote)lim.push(TIER[J.tierNote]);
  if(lim.length)paras.push(lim.join(' '));
  var unk=['실제로 어떤 일을 하고 어떤 관계 속에 있는지는 명식만으로 알 수 없어서, 위 장면은 가능한 상황으로 읽어 줘.'];
  if(J.unknownHour)unk.push('출생시간을 몰라서 시주에서 나오는 신호는 빼고 판단했어.');
  if(J.pctHyp&&J.top===J.hyp)unk.push('십성 분포에서도 '+subj(J.hyp)+' '+J.pctHyp+'%로 가장 크지만, 같은 글자에서 나온 크기라 별도 근거로 세지는 않았어.');
  paras.push(unk.join(' '));
  var share=C.core+(tone&&J.firm?', 그중에서도 '+tone:'')+'. 다만 '+C.costShort+'.';
  return {id:'core-judgment',eyebrow:'핵심 결론',title:'핵심 결론 — '+C.core,paragraphs:paras,body:paras.join('\n\n'),
    evidence:['중심: '+J.hyp+(J.god?'·'+J.god:'')+' ('+J.support.join(' · ')+')',J.limited?('제한: '+J.lim+(J.limSeats.length?' ('+J.limSeats.join(' · ')+')':' '+J.limPct+'%')):'',J.tierNote?('강약: '+J.tier):''].filter(Boolean).join(' · '),
    share:share,judgment:{hypothesis:J.hyp,god:J.god,where:J.where,core:C.core,support:J.support,limit:J.limited?{group:J.lim,seats:J.limSeats,pct:J.limPct}:null,strengthTier:J.tier,firm:J.firm,unknownHour:J.unknownHour}};
}

/* 궁합: 기존 엔진의 반응 사전(STRESS)을 그대로 읽어 반복 고리 하나를 고른다 */
function pairLoop(a,b){
  var E=engine();if(!E)return null;
  var PA=E.analyze(a),PB=E.analyze(b),S=E.STRESS||root.GUIIN_INTERPRETATION_V4&&root.GUIIN_INTERPRETATION_V4.STRESS;
  if(!PA||!PB||!S||!S[PA.stress]||!S[PB.stress])return null;
  var an=PA.name,bn=PB.name,sa=S[PA.stress],sb=S[PB.stress],same=PA.stress===PB.stress;
  return {an:an,bn:bn,same:same,a:{tag:sa.tag,act:sa.act,felt:sa.felt,fix:sa.fix},b:{tag:sb.tag,act:sb.act,felt:sb.felt,fix:sb.fix},
    text:same
      ?('이 관계의 핵심 고리는 둘이 같은 방식으로 반응한다는 점이야. 부담이 생기면 '+an+'도 '+bn+'도 '+sa.tag+' 쪽이라, 서로 상대가 먼저 움직이길 기다리는 사이에 같은 일이 쌓여. 그래서 누가 잘못했느냐보다 누가 먼저 이 순서를 끊느냐가 중요해.')
      :('이 관계의 핵심 고리는 이거야. 부담이 생기면 '+topic(an)+' '+sa.act+'. '+topic(bn)+' 그 모습을 보면서 '+sa.felt+'. 그러면 '+topic(bn)+' '+sb.act+'. '+topic(an)+' 그런 '+obj(bn)+' 보며 '+sb.felt+'. 둘 다 상대를 밀어내려는 게 아니라 각자 편한 방식으로 버티는 건데, 순서가 맞물리면서 거리가 생겨.')};
}

function wrapPerson(fn){
  return function(c){
    var rows=fn.apply(this,arguments);
    if(!ON)return rows;
    try{
      if(!Array.isArray(rows)||!rows.length||rows.some(function(r){return r&&r.id==='core-judgment'}))return rows;
      var s=personSection(c);if(!s||/undefined|NaN|\[object /.test(s.body))return rows;
      return [s].concat(rows);
    }catch(e){LOG.push({fn:'person',reason:String(e&&e.message||e)});return rows;}
  };
}
function install(){
  var X=root.GuiinExpert;if(!X||X.__readingCore)return false;
  if(typeof X.fullSections==='function')X.fullSections=wrapPerson(X.fullSections);
  if(typeof X.premiumCompatibilitySections==='function')X.premiumCompatibilitySections=wrapPair(X.premiumCompatibilitySections);
  X.__readingCore=true;return true;
}

/* 궁합: 모든 쌍에 똑같이 들어가는 연결·안내 문장과 반복 면책 문구를 덜어낸다.
   폭력·통제 안전 문구, 현실 점검 기준, 계산 근거는 그대로 둔다. */
var TRIM=[
'구체적인 방법은 아래 조건에서 풀어 줄게.',
'끌림이 큰 것과 대화가 편한 것, 생활이 맞는 것, 오래 가는 것은 서로 다른 문제라서 이 글에서는 따로 읽을게.',
'이 순서를 누가 끊느냐가 이 관계의 핵심이야.',
'이제 장점과 부담을 양쪽 방향으로 나눠 볼게.',
'이 숫자와 원국 관계는 어느 영역이 구조상 편하고 어느 영역에 의식적인 합의가 필요한지 보여 줘.',
'관계가 잘될지, 끝날지, 서로의 속마음이 어떤지를 정하는 근거로 쓰지는 않았어.',
'원하는 마음 놓임의 방식이 달라서 같은 날을 보내도 만족하는 지점이 다를 수 있어.',
'각자 맡을 행동을 나눠 볼게.',
'차이를 두 종류로 나눠서 풀어야 해.',
'그래서 어느 한쪽 기분만으로 관계를 판단하면 놓치는 게 생겨.',
'이 해도 같은 흐름이야.',
'이 결론은 구조에서 읽은 경향이고, 이어 갈지는 두 사람의 실제 행동으로 정해져.'
];
var TRIM_SET={};TRIM.forEach(function(t){TRIM_SET[t]=1});
function splitS(p){return String(p||'').match(/[^.!?…]+[.!?…]+[”"’']?\s*|[^.!?…]+$/g)||[];}
function trimRow(r,hasLoop){
  var paras=(r.paragraphs&&r.paragraphs.length?r.paragraphs:String(r.body||'').split(/\n\n+/)).map(function(p){
    var kept=splitS(p).filter(function(s){var t=s.trim();if(!t)return false;if(TRIM_SET[t])return false;
      if(hasLoop&&r.id==='pair-core'&&(/^계속 만나면 반복되기 쉬운 건 /.test(t)||/^부담은 .*(에서 와|때 생겨)\.$/.test(t)))return false;
      return true;});
    return kept.join('').trim();
  }).filter(Boolean);
  if(!paras.length)return r;
  return Object.assign({},r,{paragraphs:paras,body:paras.join('\n\n')});
}
function wrapPair(fn){
  return function(){
    var rows=fn.apply(this,arguments);
    if(!ON||!Array.isArray(rows))return rows;
    try{
      var core=rows.find(function(r){return r&&r.id==='pair-core'});
      var hasLoop=!!(core&&/이 관계의 핵심 고리는/.test(String(core.body||(core.paragraphs||[]).join(' '))));
      var out=rows.filter(function(r){return !(r&&r.id==='pair-pull'&&/끌림과 불편이 섞여 있는 관계/.test(String(r.title||'')))}).map(function(r){return r?trimRow(r,hasLoop):r});
      if(out.some(function(r){return r&&/undefined|NaN|\[object /.test(String(r.body||''))}))return rows;
      return out;
    }catch(e){LOG.push({fn:'pair',reason:String(e&&e.message||e)});return rows;}
  };
}
install();

/* ===== 화면: 공유 카드 + 맞아/조금 달라 =====
 * - 공유 문장은 핵심 결론에서 그대로 가져온다(이름·생년월일은 넣지 않음).
 * - '맞아/조금 달라'는 이 브라우저에 기록하고 'guiin:reading-feedback' 이벤트로도 알린다(수집 서버는 아직 없음).
 * - '조금 달라'는 상담 화면 입력창에 질문만 채운다. 자동 전송·이용권 차감 없음.
 */
var FB_KEY='guiin_reading_feedback_v1';
function fbRead(){try{return JSON.parse(root.localStorage.getItem(FB_KEY)||'[]')||[]}catch(_e){return []}}
function fbWrite(rows){try{root.localStorage.setItem(FB_KEY,JSON.stringify(rows.slice(-200)))}catch(_e){}}
function pairShare(L){if(!L)return '';return L.same
  ?'둘 다 '+L.a.tag+' 쪽이라, 불편이 생겨도 서로 먼저 꺼내길 기다리다 거리가 생기는 사이.'
  :'한 사람은 '+L.a.tag+' 쪽, 다른 한 사람은 '+L.b.tag+' 쪽. 둘 다 각자 편한 방식으로 버티다 엇갈리는 사이.';}
function escH(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function cardHTML(kind,text,core){
  return '<div class="grcCard" data-grc="'+kind+'"><div class="grcQuote">'+escH(text)+'</div>'+
    '<div class="grcRow"><button type="button" class="grcBtn grcShare" data-grc-share>이 문장 공유하기</button></div>'+
    '<div class="grcAsk">이 풀이, 너랑 맞아?</div>'+
    '<div class="grcRow"><button type="button" class="grcBtn" data-grc-fb="yes">맞아</button><button type="button" class="grcBtn" data-grc-fb="no">조금 달라</button></div>'+
    '<div class="grcMsg" role="status" aria-live="polite"></div></div>';
}
var CSS='.grcCard{margin:14px 0 4px;padding:14px;border:1px solid #e7dcc7;border-radius:16px;background:#fffaf0}.grcQuote{font-weight:700;line-height:1.6;color:#2f3b2f;margin-bottom:10px}.grcRow{display:flex;gap:8px;margin-top:6px}.grcBtn{flex:1;min-height:44px;border:1px solid #d9caa8;border-radius:12px;background:#fff;color:#315643;font-size:15px}.grcBtn.on{background:#315643;color:#fff;border-color:#315643}.grcShare{background:#315643;color:#fff;border-color:#315643}.grcAsk{margin-top:12px;font-size:14px;color:#66708c}.grcMsg{margin-top:8px;font-size:14px;color:#66708c;min-height:1em}';
function ensureCss(){if(!root.document||root.document.getElementById('grcCss'))return;var st=root.document.createElement('style');st.id='grcCss';st.textContent=CSS;root.document.head.appendChild(st);}
function currentChart(){try{return typeof chart!=='undefined'?chart:null}catch(_e){return null}}
function currentPair(){try{return typeof matchMeta!=='undefined'?matchMeta:null}catch(_e){return null}}
function enhance(){
  if(!ON||!root.document)return;
  var arts=root.document.querySelectorAll('[data-human-section="core-judgment"]:not([data-grc-done]),[data-human-section="pair-core"]:not([data-grc-done])');
  if(!arts.length)return;ensureCss();
  Array.prototype.forEach.call(arts,function(a){
    a.setAttribute('data-grc-done','1');
    var pair=a.getAttribute('data-human-section')==='pair-core',text='',core='';
    try{
      if(pair){var P=currentPair();var L=P&&P.a&&P.b?pairLoop(P.a,P.b):null;text=pairShare(L);core=L?(L.an+'·'+L.bn+' 반응 고리'):'';}
      else{var c=currentChart();var sct=c?personSection(c):null;text=sct?sct.share:'';core=sct?sct.judgment.core:'';}
    }catch(_e){text='';}
    if(!text)return;
    var holder=root.document.createElement('div');holder.innerHTML=cardHTML(pair?'pair':'person',text,core);
    var card=holder.firstChild,ask=a.querySelector('.guiinMidAsk');
    if(ask)a.insertBefore(card,ask);else a.appendChild(card);
    card.__grc={kind:pair?'pair':'person',text:text,core:core};
  });
}
function onClick(e){
  var t=e.target,card=t&&t.closest?t.closest('.grcCard'):null;if(!card||!card.__grc)return;
  var info=card.__grc,msg=card.querySelector('.grcMsg');
  if(t.closest('[data-grc-share]')){
    var url='https://gwiinsaju.com/';try{if(typeof guiinPublicShareUrl==='function')url=guiinPublicShareUrl();}catch(_e){}
    var body=info.text+'\n\n— 귀인사주 '+(info.kind==='pair'?'궁합':'사주')+' 풀이';
    (async function(){try{
      if(root.navigator.share){await root.navigator.share({title:'귀인사주',text:body,url:url});return;}
      if(root.navigator.clipboard&&root.navigator.clipboard.writeText){await root.navigator.clipboard.writeText(body+'\n'+url);if(msg)msg.textContent='문장과 주소를 복사했어.';return;}
    }catch(err){if(err&&err.name==='AbortError')return;}
    if(msg)msg.textContent='공유를 열지 못했어. 문장을 길게 눌러 복사해 줘.';})();
    return;
  }
  var fb=t.closest('[data-grc-fb]');if(!fb)return;
  var v=fb.getAttribute('data-grc-fb');
  card.querySelectorAll('[data-grc-fb]').forEach(function(b){b.classList.toggle('on',b===fb)});
  var row={v:v,kind:info.kind,core:info.core,ver:'reading-core-v1',at:new Date().toISOString()};
  var rows=fbRead();rows.push(row);fbWrite(rows);
  try{root.dispatchEvent(new CustomEvent('guiin:reading-feedback',{detail:row}))}catch(_e){}
  if(v==='yes'){if(msg)msg.textContent='알려 줘서 고마워. 이 결론을 기준으로 상담에서도 이어서 볼게.';return;}
  if(msg)msg.textContent='어느 부분이 다른지 상담에서 같이 짚어 볼게. 질문만 채워 두고 보내지는 않아.';
  var q=info.kind==='pair'
    ?'궁합 핵심 고리에서 우리 관계랑 조금 다른 부분이 있어. 실제로는 이렇게 달라: '
    :'핵심 결론의 "'+info.core+'" 부분이 나랑 조금 달라. 실제로는 이래: ';
  try{if(typeof root.guiinOpenResultConsultation==='function')setTimeout(function(){root.guiinOpenResultConsultation(info.kind==='pair'?'compatibility':'personal',q)},350);}catch(_e){}
}
if(root.document&&root.MutationObserver){
  var pending=false;
  var mo=new root.MutationObserver(function(){if(pending)return;pending=true;root.requestAnimationFrame(function(){pending=false;try{enhance()}catch(_e){}})});
  var start=function(){try{mo.observe(root.document.body,{childList:true,subtree:true});root.document.addEventListener('click',onClick);enhance();}catch(_e){}};
  if(root.document.body)start();else root.document.addEventListener('DOMContentLoaded',start);
}
root.GuiinReadingCore={feedback:fbRead,enabled:ON,version:'reading-core-v1',judge:judge,personSection:personSection,pairLoop:pairLoop,log:function(){return LOG.slice()}};
})(typeof globalThis!=='undefined'?globalThis:this);
