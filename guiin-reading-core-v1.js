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
  if(J.god2&&CHAIN[J.god2])head+=' 같은 계열 안에서 '+J.god2+'도 같이 있어서, 상황에 따라 '+CHAIN[J.god2].core.replace(/ 사람$/,'')+' 모습이 섞여 나와.';
  paras.push(head.trim());
  paras.push('예를 들어 '+C.sit+', '+topic(n)+' '+C.think+'. 그래서 '+C.act+'. '+C.react+'. 이때 남는 건 '+ida(C.gain)+'. 다만 같은 방식이 반복되면 '+subj(C.cost)+' 부담으로 남기 쉬워.');
  var lim=[];
  if(J.limited)lim.push(LIMIT[J.hyp]);
  if(J.tierNote)lim.push(TIER[J.tierNote]);
  if(lim.length)paras.push(lim.join(' '));
  paras.push('이 힘이 가장 잘 쓰이는 곳은 '+ida(C.use)+'. 이 강점을 오래 쓰려면 '+subj(C.keep)+' 필요해. '+obj(C.flaw)+' 들을 때가 있다면, 그건 '+subj(C.flawWhy)+' 강하게 나온 거라고 봐도 돼.');
  var unk=['실제로 어떤 일을 하고 어떤 관계 속에 있는지는 명식만으로 알 수 없어서, 위 장면은 가능한 상황으로 읽어 줘.'];
  if(J.unknownHour)unk.push('출생시간을 몰라서 시주에서 나오는 신호는 빼고 판단했어.');
  if(J.pctHyp&&J.top===J.hyp)unk.push('십성 분포에서도 '+subj(J.hyp)+' '+J.pctHyp+'%로 가장 크지만, 같은 글자에서 나온 크기라 별도 근거로 세지는 않았어.');
  paras.push(unk.join(' '));
  var share=topic(n)+' '+ida(C.core)+'.';
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
  X.__readingCore=true;return true;
}
install();
root.GuiinReadingCore={enabled:ON,version:'reading-core-v1',judge:judge,personSection:personSection,pairLoop:pairLoop,log:function(){return LOG.slice()}};
})(typeof globalThis!=='undefined'?globalThis:this);
