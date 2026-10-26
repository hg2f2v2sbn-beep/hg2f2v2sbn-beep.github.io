/* 귀인사주 · 관계 테마 V1 (신살·귀인 / 궁합 / 이별 고민 / 짝사랑 / 재회운)
 * - 스위치: window.GUIIN_THEME_V1_ON (true=켜기, false=끄기, 정하지 않음=demo.html에서만 켜짐)
 * - 계산은 기존 엔진만 읽는다: GuiinSaju.calculate, GuiinSajuEngine2(강약·세운), GuiinCompat(일지 관계·교차 십신·합충), guiinCompatMetricsV56(궁합 점수)
 * - 결제·로그인·회원 데이터·AI 요청을 하지 않는다. 기존 유료 화면으로 이동할 때는 기존 함수(submitMatch, openResultTab)만 호출한다.
 * - 문장에 undefined/NaN/빈 값이 생기면 해당 카드만 빼고 기록한다(GUIIN_THEME_V1.fallbackLog()).
 */
(function(){
'use strict';
if(window.GUIIN_THEME_V1)return;
var flag=window.GUIIN_THEME_V1_ON;
var isDemo=/(^|\/)demo\.html$/.test(location.pathname||'');
var ON=flag===true||(flag===undefined&&isDemo);
var LOG=[];
window.GUIIN_THEME_OPEN=function(){};/* OFF면 아무 일도 하지 않음. ON이면 아래에서 실제 open으로 교체 */
window.GUIIN_THEME_V1={enabled:ON,interpretationVersion:'relationship-v2.5-priority-qa-45a34d6',fallbackLog:function(){return LOG.slice()}};
if(!ON)return;
window.GUIIN_THEME_OPEN=function(k){return open(k)};

/* ───────── 공통 도구 ───────── */
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function $(id){return document.getElementById(id)}
function hasBat(w){w=String(w||'');for(var i=w.length-1;i>=0;i--){var c=w.charCodeAt(i);if(c>=0xAC00&&c<=0xD7A3)return (c-0xAC00)%28!==0;if(/[0-9]/.test(w[i]))return '0136780'.indexOf(w[i])>=0;if(/[A-Za-z]/.test(w[i]))return null}return null}
function Y(w){var b=hasBat(w);return w+(b===false?'야':'이야')}
function J(w,p){var b=hasBat(w),x=p.split('/');return w+(b===null?x[0]+'('+x[1]+')':(b?x[0]:x[1]))}
function nm(c,fb){var n=String(c&&c.input&&c.input.name||'').trim().replace(/님$/,'');return n&&n!=='사용자'?n:fb}
function hash(s){var h=2166136261;s=String(s);for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function pick(arr,seed){return arr[seed%arr.length]}
var EL=['목','화','토','금','수'];
var GEN={목:'화',화:'토',토:'금',금:'수',수:'목'},CTRL={목:'토',토:'수',수:'화',화:'금',금:'목'};
var EL_WORD={목:'나무',화:'불',토:'흙',금:'쇠',수:'물'};
function grp(g){g=String(g||'');if(/비견|겁재/.test(g))return '비겁';if(/식신|상관/.test(g))return '식상';if(/편재|정재/.test(g))return '재성';if(/편관|정관/.test(g))return '관성';if(/편인|정인/.test(g))return '인성';return ''}
function pctOf(c){try{if(window.GuiinCompat&&GuiinCompat.pct)return GuiinCompat.pct(c)}catch(_e){}var t=0,o={};EL.forEach(function(e){t+=+((c.elCount||{})[e])||0});EL.forEach(function(e){o[e]=Math.round(((+((c.elCount||{})[e])||0)/(t||1))*100)});return o}
function domWeak(p){var s=EL.slice().sort(function(x,y){return p[y]-p[x]});return {dom:s[0],weak:s[4]}}
function eng2(c){try{if(c.engine2&&c.engine2.strength)return c.engine2}catch(_e){}try{if(window.GuiinSajuEngine2&&GuiinSajuEngine2.analyze){c.engine2=GuiinSajuEngine2.analyze(c);return c.engine2}}catch(_e){}return null}
function strengthOf(c){var e=eng2(c),s=e&&e.strength;if(!s||!isFinite(+s.score))return {grade:'중간',score:null,band:'mid'};var g=String(s.grade||'중간');return {grade:g,score:Math.round(+s.score),band:/^강|중강/.test(g)?'strong':/^약|중약/.test(g)?'weak':'mid'}}
function transitOf(c){var e=eng2(c),t=e&&e.transit;if(!t)return null;var y=t.year||{},l=t.luck||null;return {yearKo:y.pillar&&y.pillar.ko||'',yearGod:y.god||'',yearRel:(y.relations||[]).slice(),luckKo:l&&l.ko||'',luckGod:l&&l.god||''}}
function strengthWord(s){return s.score==null?'강약 '+s.grade:'강약 '+s.grade+'('+s.score+'점)'}

/* ───────── 두 사람 사실값 (기존 엔진 결과만 읽음) ───────── */
function facts(a,b,opt){
 opt=opt||{};
 var nA=nm(a,'나'),nB=nm(b,opt.bFallback||'상대');
 if(nA===nB){nB=nB+'(상대)'}
 var C=window.GuiinCompat;
 var dayRel=C.dayBranchRelation(a,b);
 var sig=C.relationSignals(a,b)||{combine:0,tension:0,types:[]};
 var tg=C.crossTenGod(a,b)||{aSeesB:'',bSeesA:''};
 var pa=pctOf(a),pb=pctOf(b),wa=domWeak(pa),wb=domWeak(pb);
 var eA=a.dayMaster.el,eB=b.dayMaster.el;
 var dm=eA===eB?'same':GEN[eA]===eB?'aGen':GEN[eB]===eA?'bGen':CTRL[eA]===eB?'aCtl':CTRL[eB]===eA?'bCtl':'x';
 var sA=strengthOf(a),sB=strengthOf(b);
 var fill=pb[wa.weak]>=22,fillB=pa[wb.weak]>=22;
 return {a:a,b:b,nA:nA,nB:nB,dayRel:dayRel,sig:sig,tg:tg,gA:grp(tg.aSeesB),gB:grp(tg.bSeesA),pa:pa,pb:pb,wa:wa,wb:wb,eA:eA,eB:eB,dm:dm,sA:sA,sB:sB,fill:fill,fillB:fillB,
  tA:transitOf(a),tB:transitOf(b),seed:hash(a.pillars.day.ko+b.pillars.day.ko+a.pillars.month.ko+b.pillars.month.ko+(opt.theme||''))};
}
var REL_KIND={'육합':'bond','충':'clash','형':'knot','해':'hurt','파':'break','직접 관계 없음':'none'};

/* 관계에서 상대를 어떻게 받아들이는지 (교차 십신 그룹) */
var SEE={
 관성:{feel:'기준이 되고 긴장감을 주는 사람',pull:'곁에 있으면 나도 모르게 자세를 고쳐 앉게 되는 끌림',need:'약속과 책임을 지키는 모습',conflict:'상대의 기준이 간섭이나 평가처럼 들릴 때'},
 재성:{feel:'챙기고 함께 현실을 만들어 가고 싶은 사람',pull:'곁에 두고 직접 돌보고 싶어지는 끌림',need:'함께하는 시간이 실제 생활로 이어지는 것',conflict:'내가 챙기는 만큼 상대가 따라와 주지 않는다고 느낄 때'},
 인성:{feel:'기대고 이해받고 싶은 사람',pull:'말하지 않아도 알아줄 것 같은 편안함에서 오는 끌림',need:'충분히 이해받고 있다는 확인',conflict:'기대한 만큼 알아주지 않는다고 느낄 때'},
 식상:{feel:'편하게 표현하고 마음을 쓰게 되는 사람',pull:'함께 있으면 말과 표현이 많아지는 끌림',need:'내 표현과 마음 씀을 알아봐 주는 반응',conflict:'표현한 만큼 반응이 돌아오지 않거나 말이 지적으로 바뀔 때'},
 비겁:{feel:'친구처럼 대등하게 느껴지는 사람',pull:'눈높이가 맞고 편하게 통하는 데서 오는 끌림',need:'서로를 대등하게 존중하는 태도',conflict:'누가 맞는지, 누가 양보하는지의 자존심 싸움이 될 때'}
};
var SEE_DEF={feel:'쉽게 한마디로 정리되지 않는 사람',pull:'다른 기둥의 신호에서 오는 끌림',need:'서로의 속도를 확인하는 대화',conflict:'기대가 말로 확인되지 않은 채 쌓일 때'};
function see(g){return SEE[g]||SEE_DEF}

/* 일지 관계(생활·정서 자리) */
var DAYREL={
 bond:{short:'일지 육합이라 생활과 정서가 서로를 끌어당기는 연결이 있어.',why:'두 사람의 일지가 육합으로 묶여 있어. 생활 리듬과 정서가 서로 끌어당기는 구조라, 떨어져 있어도 쉽게 끊기지 않는 연결감이 있어.',hard:'묶이는 힘이 큰 만큼 서운함을 말하지 않고 넘기다가 한꺼번에 터지기 쉬워.',fix:'좋을 때 서로 맞춰 온 생활 리듬이 이미 있어서, 그 리듬을 기준으로 다시 맞춰 볼 여지가 큰 편이야.'},
 clash:{short:'일지 충이라 끌림만큼 생활 리듬의 충돌도 큰 조합이야.',why:'두 사람의 일지가 충이야. 생활 리듬과 감정의 속도가 정면으로 부딪히기 쉬운 자리라, 끌림도 강하지만 반응도 크게 나와.',hard:'한 사람이 다가갈 때 다른 사람은 물러나고 싶어지는 엇박자가 반복되기 쉬워.',fix:'부딪히는 시점이 비교적 분명해서, 어떤 상황에서 충돌하는지 정리하면 조율할 지점도 분명해져.'},
 knot:{short:'일지 형이라 같은 문제가 같은 자리에서 반복되기 쉬운 조합이야.',why:'두 사람의 일지가 형으로 얽혀 있어. 같은 문제를 서로 고쳐 주려다 오히려 같은 자리에서 다시 걸리는 구조야.',hard:'상대를 바꾸려는 말이 많아질수록 관계가 무거워지기 쉬워.',fix:'고치려는 대상을 상대가 아니라 둘의 규칙으로 옮기면 얽힌 부분이 풀리기 시작해.'},
 hurt:{short:'일지 해(害)라 작은 서운함이 조용히 쌓이기 쉬운 조합이야.',why:'두 사람의 일지가 해(害) 관계야. 큰 싸움보다 작은 서운함이 조용히 쌓이는 구조라, 문제가 늦게 드러나는 편이야.',hard:'말하지 않은 기대가 오해로 바뀌어 쌓이기 쉬워.',fix:'서운함을 작을 때 바로 말하는 습관만 생겨도 쌓이는 속도가 크게 줄어.'},
 break:{short:'일지 파(破)라 약속과 계획이 흐트러지기 쉬운 조합이야.',why:'두 사람의 일지가 파(破) 관계야. 함께 세운 계획이나 약속이 중간에 흐트러지기 쉬운 구조야.',hard:'약속이 바뀌는 일이 반복되면 신뢰가 조금씩 깎이기 쉬워.',fix:'약속을 작게 나누고 지킨 것을 서로 확인하면 흐트러짐을 줄일 수 있어.'},
 none:{short:'일지에 직접적인 합·충이 없어서 관계의 색은 다른 기둥에서 드러나.',why:'두 사람의 일지 사이에는 직접적인 합이나 충이 없어. 관계의 색은 일간과 다른 기둥의 신호에서 더 많이 드러나.',hard:'뚜렷한 계기가 없으면 관계가 서서히 느슨해지기 쉬워.',fix:'자연스럽게 묶이는 힘이 약한 대신 큰 충돌도 적어서, 의식적으로 함께하는 시간을 만들면 안정되기 쉬워.'}
};

/* 일간 생극 */
function dmLine(f){
 var A=J(f.nA,'은/는'),B=J(f.nB,'은/는');
 switch(f.dm){
  case 'same':return '두 사람 모두 일간이 '+f.eA+'('+EL_WORD[f.eA]+') 기운이라 반응하는 방식과 중요하게 여기는 지점이 닮았어. 잘 통하는 만큼 둘 다 물러서지 않는 순간도 비슷하게 와.';
  case 'aGen':return f.nA+'의 '+f.eA+' 기운이 '+f.nB+'의 '+f.eB+' 기운을 생하는 방향이야. '+A+' 먼저 마음을 쓰고 채워 주는 역할을 맡기 쉬워.';
  case 'bGen':return f.nB+'의 '+f.eB+' 기운이 '+f.nA+'의 '+f.eA+' 기운을 생하는 방향이야. '+B+' '+f.nA+'에게 힘을 보태 주는 쪽에 서기 쉬워.';
  case 'aCtl':return f.nA+'의 '+f.eA+' 기운이 '+f.nB+'의 '+f.eB+' 기운을 제어하는 방향이야. '+A+' 기준과 속도를 잡으려 하고, '+B+' 그걸 압박으로 받기 쉬워.';
  case 'bCtl':return f.nB+'의 '+f.eB+' 기운이 '+f.nA+'의 '+f.eA+' 기운을 제어하는 방향이야. '+f.nB+'의 기준이나 요구가 '+f.nA+'에게 압박처럼 느껴질 때가 있어.';
 }
 return '두 사람의 일간 오행은 직접적인 생극보다 다른 기둥과 함께 봐야 관계의 방향이 보여.';
}
function strengthPair(f){
 var A=J(f.nA,'은/는'),B=J(f.nB,'은/는');
 if(f.sA.band==='strong'&&f.sB.band==='strong')return '두 사람 모두 자기 기운이 받쳐 주는 편('+f.sA.grade+'·'+f.sB.grade+')이라 각자 자기 방식이 분명해. 둘 다 먼저 굽히기 어려운 장면이 생기기 쉬워.';
 if(f.sA.band==='weak'&&f.sB.band==='weak')return '두 사람 모두 환경의 영향을 크게 받는 편('+f.sA.grade+'·'+f.sB.grade+')이야. 서로 눈치를 보다가 정작 중요한 결정을 미루기 쉬워.';
 if(f.sA.band==='strong'&&f.sB.band!=='strong')return A+' 자기 기운이 상대적으로 단단하고('+f.sA.grade+'), '+B+' 상황에 더 민감한 편('+f.sB.grade+')이야. 결정의 무게가 '+f.nA+' 쪽으로 쏠리기 쉬워.';
 if(f.sB.band==='strong'&&f.sA.band!=='strong')return B+' 자기 기운이 상대적으로 단단하고('+f.sB.grade+'), '+A+' 상황에 더 민감한 편('+f.sA.grade+')이야. 관계의 속도를 '+f.nB+' 쪽이 정하기 쉬워.';
 return '두 사람의 강약은 한쪽으로 크게 치우치지 않아('+f.sA.grade+'·'+f.sB.grade+'). 누가 이끄는지는 상황에 따라 바뀌는 편이야.';
}
function complementLine(f){
 if(f.fill&&f.fillB)return f.nA+'에게 적은 '+f.wa.weak+' 기운을 '+f.nB+' 쪽이 갖고 있고('+f.pb[f.wa.weak]+'%), '+f.nB+'에게 적은 '+f.wb.weak+' 기운은 '+f.nA+' 쪽이 갖고 있어('+f.pa[f.wb.weak]+'%). 서로 비어 있는 곳을 채워 주는 구조야.';
 if(f.fill)return f.nA+'에게 적은 '+f.wa.weak+' 기운('+f.pa[f.wa.weak]+'%)을 '+f.nB+' 쪽이 넉넉히 갖고 있어('+f.pb[f.wa.weak]+'%). '+f.nA+' 입장에서는 '+f.nB+'에게서 부족한 부분을 채우는 느낌을 받기 쉬워.';
 if(f.fillB)return f.nB+'에게 적은 '+f.wb.weak+' 기운('+f.pb[f.wb.weak]+'%)을 '+f.nA+' 쪽이 넉넉히 갖고 있어('+f.pa[f.wb.weak]+'%). '+f.nB+' 입장에서는 '+f.nA+'에게서 채워지는 느낌을 받기 쉬워.';
 if(f.wa.dom===f.wb.dom)return '두 사람 모두 '+f.wa.dom+' 기운이 가장 강해('+f.pa[f.wa.dom]+'%·'+f.pb[f.wb.dom]+'%). 잘 통하는 대신 같은 쪽으로 함께 치우치기 쉬워.';
 return '오행 분포로 보면 '+f.nA+' 쪽은 '+f.wa.dom+', '+f.nB+' 쪽은 '+f.wb.dom+' 기운이 가장 강해. 서로 채워 주기보다 각자 강한 쪽이 달라서 생기는 차이가 더 눈에 띄는 조합이야.';
}

function complementPos(f){if(f.fill||f.fillB||f.wa.dom===f.wb.dom)return complementLine(f);return ''}
/* 일간별 일반적인 연애 성향 (명식의 경향일 뿐, 실제 마음을 단정하지 않음) */
var STEM_LOVE={
 갑:{key:'함께 미래를 그려 볼 때 마음이 움직이는 타입',tend:'관계에서도 방향과 성장을 중요하게 여기는 편이야. 마음이 생기면 앞으로의 계획을 함께 그려 보려 해.',approach:'함께 해 볼 수 있는 구체적인 계획이나 목표 이야기로 다가가는 편이 자연스러워.',sign:'앞으로의 일정이나 계획에 너를 넣어서 이야기하는지'},
 을:{key:'편안함을 먼저 확인하고 천천히 다가오는 타입',tend:'분위기와 관계의 결을 섬세하게 살피는 편이야. 마음을 바로 드러내기보다 상대가 편한지 먼저 봐.',approach:'부담 없는 대화를 자주, 짧게 이어 가는 방식이 잘 맞아.',sign:'작은 이야기에도 다시 질문을 돌려주며 대화를 이어 가는지'},
 병:{key:'좋으면 밝게 드러내는 타입',tend:'좋으면 밝게 드러내는 편이야. 표현이 시원한 대신 관심이 다른 곳으로 옮겨 가는 속도도 빠를 수 있어.',approach:'즐거운 경험을 함께 만드는 쪽이 말로 마음을 묻는 것보다 잘 통해.',sign:'여럿이 있을 때도 너에게 따로 반응하거나 먼저 연락하는지'},
 정:{key:'마음을 오래 품고 천천히 여는 타입',tend:'겉으로는 조용해도 마음을 오래, 깊게 품는 편이야. 신뢰가 쌓이기 전에는 속을 잘 보이지 않아.',approach:'꾸준함이 가장 큰 설득이야. 한 번에 크게보다 오래 일정하게 다가가는 편이 좋아.',sign:'사소한 고민이나 속이야기를 너에게 털어놓기 시작하는지'},
 무:{key:'확신이 들 때까지 신중하게 움직이는 타입',tend:'관계에서도 안정과 책임을 먼저 보는 편이야. 마음이 생겨도 확신이 들 때까지 천천히 움직여.',approach:'믿을 만한 사람이라는 인상이 먼저야. 약속을 정확히 지키는 모습이 가장 큰 신호가 돼.',sign:'바쁜 와중에도 시간을 비워 두거나 약속을 먼저 잡는지'},
 기:{key:'말보다 챙김으로 마음을 보이는 타입',tend:'상대를 세심하게 챙기는 방식으로 마음을 표현하는 편이야. 말보다 행동으로 보여 주려 해.',approach:'고마움을 구체적으로 말해 주는 것이 이 사람에게는 큰 반응으로 닿아.',sign:'네 상황을 기억했다가 필요한 걸 챙겨 주는지'},
 경:{key:'좋고 싫음이 분명한 담백한 타입',tend:'좋고 싫음이 분명하고, 애매한 관계를 오래 두지 않으려는 편이야.',approach:'돌려 말하기보다 담백하고 솔직한 태도가 신뢰를 줘.',sign:'너의 의견을 묻고 그 의견을 실제 결정에 반영하는지'},
 신:{key:'작은 말투와 태도에 크게 반응하는 섬세한 타입',tend:'감각이 예민하고 자기 기준이 섬세한 편이야. 작은 말투나 태도에서 마음이 크게 움직여.',approach:'디테일을 기억해 주는 세심함이 잘 통해. 무리한 속도는 오히려 거리를 만들어.',sign:'네가 한 말을 정확히 기억하고 다시 꺼내는지'},
 임:{key:'자유로운 대화에서 끌리는 타입',tend:'넓게 보고 자유롭게 움직이는 편이야. 묶인다는 느낌이 들면 한발 물러서기 쉬워.',approach:'대화의 폭을 넓혀 주는 사람에게 끌려. 답을 재촉하지 않는 여유가 중요해.',sign:'깊은 이야기나 생각을 길게 나누려 하는지'},
 계:{key:'속으로 오래 생각하고 늦게 표현하는 타입',tend:'겉으로 드러내기보다 속으로 오래 생각하는 편이야. 마음이 있어도 표현이 늦게 나와.',approach:'조용하고 안전한 분위기에서 천천히 가까워지는 방식이 맞아.',sign:'대답이 늦어도 대화를 끊지 않고 다시 이어 오는지'}
};
var YEAR_GOD={
 관성:'관계와 약속을 진지하게 따지게 되는 흐름',
 재성:'관계를 현실적인 조건과 생활 속에서 보게 되는 흐름',
 인성:'생각을 정리하고 마음을 회복하는 쪽으로 기우는 흐름',
 식상:'마음을 말과 행동으로 표현하고 싶어지는 흐름',
 비겁:'내 판단과 자존심이 앞에 서기 쉬운 흐름'
};
function yearLine(n,t,alt){
 if(!t||!t.yearKo)return '';
 var g=grp(t.yearGod),s=n+'에게 올해 세운 '+J(t.yearKo+'('+t.yearGod+')','은/는')+' '+(YEAR_GOD[g]||'평소와 다른 자극이 들어오는 흐름')+'이야.';
 var r=t.yearRel||[];
 if(r.some(function(x){return /충/.test(x)}))s+=alt?' '+n+' 쪽도 세운이 원국을 충해서, 익숙한 자리가 바뀌는 자극을 받기 쉬운 해야.':' 원국과 충 신호가 있어서 생활이나 마음의 기반이 흔들리는 느낌을 받기 쉬워.';
 else if(r.some(function(x){return /합/.test(x)}))s+=alt?' '+n+' 쪽도 세운이 원국과 합을 이뤄서, 새로운 인연이나 묶임이 생기기 쉬운 해야.':' 원국과 합 신호가 있어서 사람과의 연결이 새로 생기거나 묶이기 쉬워.';
 return s;
}
function luckLine(n,t){if(!t||!t.luckKo)return '';return n+'의 현재 대운은 '+Y(t.luckKo+(t.luckGod?'('+t.luckGod+')':''))+'.'}

/* ───────── 근거(명리 데이터) ───────── */
function evidenceRowsV1(f){
 var rows=[
  ['일간',f.nA+' '+f.a.pillars.day.stem+'('+f.eA+') · '+f.nB+' '+f.b.pillars.day.stem+'('+f.eB+')'],
  ['일주',f.a.pillars.day.ko+' · '+f.b.pillars.day.ko],
  ['일지 관계',f.dayRel],
  ['교차 십신',f.nA+'→'+f.nB+' '+(f.tg.aSeesB||'-')+' · '+f.nB+'→'+f.nA+' '+(f.tg.bSeesA||'-')],
  ['합·긴장 신호','합 '+f.sig.combine+' · 충형파해 '+f.sig.tension+(f.sig.types&&f.sig.types.length?' ('+f.sig.types.join(', ')+')':'')],
  ['오행 분포',f.nA+' 강 '+f.wa.dom+' '+f.pa[f.wa.dom]+'% / 약 '+f.wa.weak+' '+f.pa[f.wa.weak]+'% · '+f.nB+' 강 '+f.wb.dom+' '+f.pb[f.wb.dom]+'% / 약 '+f.wb.weak+' '+f.pb[f.wb.weak]+'%'],
  ['강약',f.nA+' '+strengthWord(f.sA)+' · '+f.nB+' '+strengthWord(f.sB)]
 ];
 if(f.tA&&f.tA.yearKo)rows.push(['올해 세운',f.tA.yearKo+' · '+f.nA+' '+f.tA.yearGod+(f.tB?' · '+f.nB+' '+f.tB.yearGod:'')]);
 if(f.tA&&f.tA.luckKo)rows.push(['현재 대운',f.nA+' '+f.tA.luckKo+(f.tB&&f.tB.luckKo?' · '+f.nB+' '+f.tB.luckKo:'')]);
 if(f.a.input.hourUnknown||f.b.input.hourUnknown)rows.push(['참고','출생시간을 모르는 사람은 시주를 빼고 계산했어.']);
 return rows;
}

/* ───────── 테마별 해석 ───────── */
function headTone(f){var t=f.sig.tension,c=f.sig.combine;return t>=c+3?'tense':c>=t+2?'bond':'mix'}

function buildCompatV1(f,metrics){
 var k=REL_KIND[f.dayRel]||'none',d=DAYREL[k],sa=see(f.gA),sb=see(f.gB),la=STEM_LOVE[f.a.pillars.day.stem]||{},lb=STEM_LOVE[f.b.pillars.day.stem]||{};
 var tone=headTone(f);
 var head=tone==='bond'?'서로를 붙잡는 힘이 분명한 관계야.':tone==='tense'?'끌림만큼 조율할 숙제도 분명한 관계야.':'끌림과 차이가 함께 있는 관계야.';
 var cards=[
  {t:'끌림',b:[f.gA&&f.gA===f.gB?'두 사람은 서로를 '+sa.feel+'으로 받아들이는 같은 구조야. '+sa.pull+'이 양쪽에서 비슷하게 생겨.':f.nA+'에게 '+J(f.nB,'은/는')+' '+sa.feel+'이고, '+f.nB+'에게 '+J(f.nA,'은/는')+' '+sb.feel+'이야.',f.gA&&f.gA===f.gB?'':sa.pull+'이 '+f.nA+' 쪽에서 먼저 생기기 쉬워.',f.sig.combine?'두 사람 원국 사이에 합 신호가 '+f.sig.combine+'만큼 있어서 함께 있을 때 연결감이 쉽게 생겨.':'원국 사이의 합 신호는 약한 편이라, 끌림은 첫인상보다 함께 보낸 시간에서 자라기 쉬워.']},
  {t:'성격 차이',b:[dmLine(f),strengthPair(f)]},
  {t:'감정 표현',b:f.a.pillars.day.stem===f.b.pillars.day.stem?['두 사람 모두 일간이 '+f.a.pillars.day.stem+'('+f.eA+')이라 감정을 다루는 방식이 닮았어. '+(la.tend||''),'닮은 만큼 둘 다 먼저 표현하지 않고 기다리는 순간이 겹치기 쉬워. 한 사람이 먼저 말을 꺼내는 순서를 정해 두면 좋아.']:[J(f.nA,'은/는')+' '+(la.tend||''),J(f.nB,'은/는')+' '+(lb.tend||'')]},
  {t:'갈등',b:[d.why,d.hard,(f.gA===f.gB?'특히 두 사람 모두 '+sa.conflict+' 갈등이 커지기 쉬워.':'특히 '+f.nA+' 쪽에서는 '+sa.conflict+', '+f.nB+' 쪽에서는 '+sb.conflict+' 갈등이 커지기 쉬워.')]},
  {t:'소통',b:[f.gA==='식상'||f.gB==='식상'?'한쪽이 상대 앞에서 말이 많아지는 구조라 대화량 자체는 많은 편이야. 대신 말이 조언이나 지적으로 넘어가지 않게 조심해야 해.':f.gA==='인성'||f.gB==='인성'?'한쪽이 상대에게 이해받기를 기대하는 구조라, 말하지 않아도 알아주길 바라는 순간이 생겨. 기대는 말로 꺼내야 전달돼.':f.gA===f.gB?'두 사람은 서로를 같은 무게로 받아들여서 말이 잘 통하는 편이야. 대신 둘 다 자기 말이 맞다고 느낄 때 대화가 길어지기 쉬워.':'두 사람은 서로를 다르게 받아들여. '+f.nA+' 쪽은 '+sa.feel+'으로, '+f.nB+' 쪽은 '+sb.feel+'으로 느끼기 쉬워서 같은 말도 다르게 들릴 수 있어.',complementLine(f)]},
  {t:'생활·재물',b:[
    '토·금 기운 비중이 '+f.nA+' '+(f.pa['토']+f.pa['금'])+'%, '+f.nB+' '+(f.pb['토']+f.pb['금'])+'%야. '+(Math.abs((f.pa['토']+f.pa['금'])-(f.pb['토']+f.pb['금']))>=15?'현실 감각의 무게가 꽤 달라서 돈·일정·집안일 기준을 미리 맞춰 두는 게 좋아.':'현실 감각의 무게가 비슷해서 생활 기준은 비교적 쉽게 맞춰지는 편이야.'),
    (f.gA==='재성'||f.gB==='재성')?'한쪽이 상대를 현실적으로 챙기려는 구조라, 돈과 생활을 누가 얼마나 맡는지 분명히 해야 서운함이 줄어.':'돈과 생활 이야기는 감정이 좋을 때 먼저 정해 두는 편이 갈등을 줄여.']},
  {t:'장기 관계',b:[d.fix,(f.tA&&f.tA.luckKo&&f.tB&&f.tB.luckKo)?'지금 두 사람은 각각 '+f.tA.luckKo+' 대운과 '+f.tB.luckKo+' 대운을 지나고 있어. 각자 인생에서 중요하게 보는 것이 다를 수 있는 시기라, 서로의 우선순위를 주기적으로 확인하는 게 좋아.':'오래 가려면 반복되는 갈등 하나를 정해 두 사람만의 규칙으로 바꾸는 게 가장 효과가 커.']}
 ];
 var sum=[d.short,f.gA&&f.gA===f.gB?'두 사람은 서로를 '+sa.feel+'으로 느끼는 같은 구조야.':f.nA+'에게 '+J(f.nB,'은/는')+' '+sa.feel+'이야.'];
 if(metrics&&isFinite(metrics.score))sum.push('궁합 지수는 '+metrics.score+'점이야. 점수보다 반복되는 패턴을 함께 봐.');
 return {head:head,sum:sum,cards:cards};
}

function buildBreakupV1(f,x){
 var k=REL_KIND[f.dayRel]||'none',d=DAYREL[k],sa=see(f.gA),sb=see(f.gB);
 var tone=headTone(f);
 var head=tone==='tense'?'감정보다 풀어야 할 구조가 먼저 보이는 관계야.':tone==='bond'?'연결은 깊지만 지쳐 있는 지점이 있는 관계야.':'감정은 남아 있지만 풀어야 할 과제가 있는 관계야.';
 var len={short:'만난 지 아직 오래되지 않아서, 지금 힘든 이유가 관계의 구조인지 서로를 아직 덜 아는 것인지 구분해 볼 필요가 있어.',mid:'1년 안팎을 함께하면서 서로의 패턴이 드러나기 시작한 시기야.',long:'오래 함께한 만큼 반복된 패턴이 이미 굳어 있을 수 있어.'}[x.len]||'';
 var state={now:'지금도 만나는 중이라면 결론보다 패턴을 먼저 확인하는 게 좋아.',pause:'잠시 거리를 둔 상태라면 감정이 가라앉은 뒤의 판단을 더 믿어도 돼.'}[x.state]||'';
 var cards=[
  {t:'관계가 힘든 이유',b:[d.why,dmLine(f),len]},
  {t:'반복되는 갈등',b:[d.hard,(f.gA===f.gB?'명식으로 보면 '+J(f.nA,'과/와')+' '+f.nB+' 모두 '+sa.conflict+' 지치기 쉬운 구조야.':'명식으로 보면 '+J(f.nA,'은/는')+' '+sa.conflict+' 지치기 쉽고, '+J(f.nB,'은/는')+' '+sb.conflict+' 지치기 쉬운 구조야.'),strengthPair(f)]},
  {t:'서로의 관계 욕구',b:f.gA===f.gB?[J(f.nA,'과/와')+' '+f.nB+'의 명식은 모두 '+J(sa.need,'을/를')+' 중요하게 여기는 경향을 보여. 바라는 것이 같아서, 그게 채워지지 않을 때 둘 다 같은 이유로 서운해지기 쉬워.','명식은 경향일 뿐이야. '+f.nB+'의 실제 마음은 직접 확인해야 해.']:[J(f.nA,'은/는')+' 이 관계에서 '+J(sa.need,'을/를')+' 중요하게 여기는 경향이 있어.',f.nB+'의 명식은 '+J(sb.need,'을/를')+' 중요하게 여기는 경향을 보여. 실제 마음은 직접 확인해야 해.']},
  {t:'개선 가능한 부분',b:[d.fix,complementPos(f),f.sig.combine?'두 사람 사이에는 합 신호('+f.sig.combine+')도 있어서, 갈등만 있는 관계는 아니야.':'']},
  {t:'실제로 확인해야 할 행동',list:[
    ({clash:'최근 다툰 날짜를 적고, 같은 주제로 부딪힌 날이 두 번 이상인지 세어 봐.',knot:'약속·연락·역할 중 어떤 규칙이 자주 깨지는지 적어 봐. 같은 규칙이 반복되면 구조의 문제야.',hurt:'서운했던 장면을 하나씩 적고, 그중 실제로 말로 꺼낸 것이 몇 개인지 세어 봐.',break:'약속이 깨진 횟수와 이유를 기록해 봐. 같은 이유가 반복되는지가 핵심이야.'}[k]||'최근 같은 이유로 다툰 일을 떠올려 봐. 같은 이유가 반복되는지 확인하는 게 먼저야.'),
    '다툰 뒤에 누가 먼저, 어떻게 회복을 시도하는지 봐. 회복 시도가 한쪽에만 있다면 그 점을 먼저 이야기해야 해.',
    J(sa.need.replace(/것$/,'것'),'을/를')+' 상대에게 한 문장으로 요청해 보고, '+({short:'3~4주',mid:'2주',long:'한 달'}[x.len]||'2주')+' 동안 실제 행동이 바뀌는지 확인해.',
    state]}
 ];
 return {head:head,sum:[d.short,pick(['가장 먼저 볼 것은 같은 갈등이 같은 방식으로 반복되는지야.','먼저 확인할 것은 다툼의 주제가 바뀌는지, 같은 주제가 돌아오는지야.','이 관계에서는 싸움의 내용보다 회복 방식이 더 큰 힌트야.'],f.seed),pick(['결정은 사주가 아니라 실제 행동의 변화로 하는 게 좋아.','판단 근거는 명식이 아니라 최근 두 달의 행동이어야 해.','명식은 방향을 보여 줄 뿐, 결론은 두 사람이 실제로 바꾼 행동이 내려.'],f.seed+1)],cards:cards};
}

function buildCrushV1(f,x){
 var k=REL_KIND[f.dayRel]||'none',d=DAYREL[k],lb=STEM_LOVE[f.b.pillars.day.stem]||STEM_LOVE['갑'],sa=see(f.gA),sb=see(f.gB);
 var dist={far:'아직 연락이 거의 없는 사이라면 관계의 첫 단추는 자연스러운 접점을 만드는 데서 시작해.',know:'아는 사이라면 둘만의 대화 시간을 조금씩 늘리는 게 다음 단계야.',close:'이미 친한 사이라면 지금의 편안함을 잃지 않는 속도가 중요해.'}[x.dist]||'';
 var head=k==='bond'?'자연스럽게 가까워질 연결 고리가 있는 인연이야.':k==='clash'?'끌림은 강하지만 속도 조절이 필요한 인연이야.':k!=='none'?'가까워질수록 조심스럽게 다뤄야 할 인연이야.':({관성:'상대에게 믿음직한 사람으로 남을 때 가까워지는 인연이야.',재성:'상대가 먼저 챙기고 싶어질 여지가 있는 인연이야.',인성:'상대가 편안함을 느낄 때 열리는 인연이야.',식상:'대화가 이어질수록 가까워지는 인연이야.',비겁:'친구 같은 편안함에서 시작하는 인연이야.'})[f.gB]||'천천히 쌓아 갈수록 선명해지는 인연이야.';
 var cards=[
  {t:'상대의 일반적인 연애 성향',b:[f.nB+'의 일간은 '+Y(f.b.pillars.day.stem+'('+f.eB+')')+'. '+lb.tend,f.nB+'의 강약은 '+Y(f.sB.grade)+'. '+(f.sB.band==='strong'?'자기 기준이 분명해서 마음이 정해지면 스스로 움직이는 편이야.':f.sB.band==='weak'?'주변 분위기와 상황의 영향을 크게 받는 편이라 타이밍이 중요해.':'상황에 따라 적극적이기도, 조심스럽기도 한 편이야.'),'이건 명식에 나타난 일반적인 경향이야. '+f.nB+'의 실제 속마음을 알려 주는 것은 아니야.']},
  {t:'두 사람의 관계 특징',b:[d.why,(f.gA===f.gB?J(f.nA,'과/와')+' '+J(f.nB,'은/는')+' 명식상 서로를 '+sa.feel+'으로 받아들이기 쉬운 같은 구조야. 편하게 가까워질 수 있지만 그 이상의 신호를 만드는 계기가 필요해.':f.nA+'에게 '+J(f.nB,'은/는')+' '+sa.feel+'으로 다가오고, 명식상 '+f.nB+' 쪽에서는 '+J(f.nA,'을/를')+' '+sb.feel+'으로 받아들이기 쉬운 구조야.')]},
  {t:'접근 방식',b:[lb.approach,dist]},
  {t:'부담을 줄일 방법',b:[k==='clash'||k==='knot'?'두 사람 사이에 부딪히는 신호가 있어서, 마음을 서둘러 확인하려 할수록 상대가 물러서기 쉬워. 답을 재촉하지 않는 게 가장 중요해.':'한 번에 마음을 고백하기보다 상대가 편하게 응할 수 있는 작은 제안부터 시작하는 게 좋아.',f.sB.band==='weak'?J(f.nB,'은/는')+' 주변 상황에 영향을 많이 받는 편이라, 바쁘거나 지친 시기에는 연락 빈도를 줄여 주는 배려가 오히려 호감이 돼.':'거절해도 관계가 어색해지지 않을 정도의 가벼운 제안이 서로의 부담을 줄여.']},
  {t:'현실에서 확인해야 할 호감 신호',list:[lb.sign,'약속을 미룰 때 대신할 날짜를 먼저 제안하는지','대화가 끝날 때 다음에 이어질 이야기를 남기는지',pick(['신호는 한 번이 아니라 2~3주 동안 반복되는지로 판단해','한 번의 호의보다 여러 번 이어지는 행동을 보면 돼','상대가 바쁠 때도 같은 태도를 유지하는지 봐'],f.seed+2)]}
 ];
 return {head:head,sum:[f.nB+'의 명식은 '+lb.key+'에 가까워.',d.short,pick(['상대의 실제 마음은 사주로 단정할 수 없어. 현실의 신호로 확인해.','상대의 마음은 명식으로 단정할 수 없어. 행동이 반복되는지로 확인해.','상대의 속마음은 사주로 단정할 수 없어. 상대가 보여 주는 반응이 답이야.'],f.seed)],cards:cards};
}

function buildReunionV1(f,x){
 var k=REL_KIND[f.dayRel]||'none',d=DAYREL[k],sa=see(f.gA),sb=see(f.gB);
 var head=k==='bond'?'떨어져 있어도 연결감이 쉽게 끊기지 않는 관계야.':f.sig.combine>f.sig.tension?'두 사람은 아직 서로에게 영향을 주는 관계야.':({clash:'다시 만나면 같은 충돌을 먼저 정리해야 하는 관계야.',knot:'다시 만나도 같은 문제가 반복되기 쉬워서 규칙이 먼저 필요한 관계야.',hurt:'말하지 못한 서운함을 먼저 풀어야 하는 관계야.',break:'약속을 다시 세우는 것부터 시작해야 하는 관계야.'})[k]||'다시 끌릴 이유와 다시 부딪힐 이유가 함께 있는 관계야.';
 var since={short:'헤어진 지 3개월이 안 됐다면 아직 감정의 여운이 판단을 크게 좌우하는 시기야.',mid:'헤어진 지 1년이 안 됐다면 감정과 현실을 나눠 볼 수 있는 시기야.',long:'1년 이상 지났다면 두 사람 모두 이미 달라져 있을 가능성을 먼저 인정해야 해.'}[x.since]||'';
 var contact={on:'지금도 연락이 이어지고 있다면, 연락의 횟수보다 대화의 내용이 달라졌는지가 더 중요해.',off:'연락이 끊긴 상태라면, 다시 연락할지보다 연락해서 무엇을 확인하고 싶은지를 먼저 정리해.'}[x.contact]||'';
 var flow=[yearLine(f.nA,f.tA),yearLine(f.nB,f.tB,true),luckLine(f.nA,f.tA)+(f.tB&&f.tB.luckKo?' '+luckLine(f.nB,f.tB):''),'세운과 대운은 시기의 분위기를 보여 줄 뿐이야. 특정 날짜에 연락이 온다거나 다시 만난다고 정해 주지 않아.'];
 var cards=[
  {t:'관계에서 반복된 문제',b:[d.hard,(f.gA===f.gB?'명식으로 보면 '+J(f.nA,'과/와')+' '+f.nB+' 모두 '+sa.conflict+' 지치기 쉬워.':'명식으로 보면 '+J(f.nA,'은/는')+' '+sa.conflict+', '+J(f.nB,'은/는')+' '+sb.conflict+' 지치기 쉬워.'),strengthPair(f)]},
  {t:'다시 끌리는 이유',b:[f.nA+'에게 '+J(f.nB,'은/는')+' '+sa.feel+'이야. '+sa.pull+'이 쉽게 사라지지 않아.',complementPos(f),f.sig.combine?'원국 사이 합 신호('+f.sig.combine+')가 있어서 떨어져 있어도 연결감이 남기 쉬운 구조야.':'']},
  {t:'현재 시기의 명리적 흐름',b:flow},
  {t:'재접촉을 고민할 때의 기준',list:[since,contact,'헤어진 이유가 지금은 달라졌는지 한 문장으로 말할 수 있는지 확인해.','상대의 반응과 상관없이 내가 감당할 수 있는 선에서만 연락해.']},
  {t:'재회 후 조율할 부분',b:[d.fix,f.gA===f.gB?'두 사람의 명식은 모두 '+J(sa.need,'을/를')+' 중요하게 여기는 경향이 있어. 다시 만난다면 이걸 어떤 행동으로 확인할지 처음부터 말로 맞춰 둬.':J(f.nA,'은/는')+' '+sa.need+', '+f.nB+'의 명식은 '+J(sb.need,'을/를')+' 중요하게 여기는 경향이 있어. 다시 만난다면 이 두 가지를 처음부터 말로 맞춰 둬.']}
 ];
 return {head:head,sum:[d.short,sa.pull+'이 남아 있기 쉬운 구조야.',pick(['시기는 분위기일 뿐, 결과는 두 사람의 실제 행동이 정해.','때가 맞는지보다 다시 만났을 때 같은 문제를 어떻게 다루는지가 더 중요해.','명식은 흐름을 보여 줄 뿐, 재회 여부는 두 사람이 정해.'],f.seed+3)],cards:cards};
}

/* ───────── 관계 해석 V2.3: 최신 a08091e 위에 premium-evidence-v5.14 해석 자산을 관계 테마에 연결 ─────────
 * 계산식을 새로 만들지 않는다.
 * GuiinCompatQuality634 / GuiinExpert가 제공하는 계산·해석 결과를 우선 사용하고,
 * 사용할 수 없거나 오류가 나면 바로 V1 문장으로 되돌린다.
 */
function richPairContext(f){
 if(window.GUIIN_RELATION_V2_ON===false)return {rows:[],by:{},metrics:null,model:null};
 var metrics=null,model=null,rows=[],by={};
 try{if(typeof guiinCompatMetricsV56==='function')metrics=guiinCompatMetricsV56(f.a,f.b)}catch(_e){}
 try{if(window.GuiinCompatQuality634&&typeof GuiinCompatQuality634.model==='function')model=GuiinCompatQuality634.model(f.a,f.b)}catch(_e){}
 var x;
 if(model){
  x=Object.assign({},model);
  x.a=f.a;x.b=f.b;
  x.A=Object.assign({},model.A||{},{name:f.nA,c:f.a});
  x.B=Object.assign({},model.B||{},{name:f.nB,c:f.b});
  if(!x.m&&metrics)x.m=metrics;
 }else{
  x={a:f.a,b:f.b,A:{name:f.nA,c:f.a},B:{name:f.nB,c:f.b},m:metrics||{},
    d:{q:{dayRel:f.dayRel,sig:{bond:+f.sig.combine||0,combine:+f.sig.combine||0,tension:+f.sig.tension||0}}}};
 }
 try{
  if(window.GuiinExpert&&typeof GuiinExpert.premiumCompatibilitySections==='function'){
   rows=GuiinExpert.premiumCompatibilitySections(x)||[];
  }
 }catch(e){LOG.push({theme:'relationship-v2.3',reason:'premiumCompatibilitySections:'+(e&&e.message)})}
 rows.forEach(function(r){if(r&&r.id)by[r.id]=r});
 return {rows:rows,by:by,metrics:metrics,model:x};
}
function richParas(ctx,id){
 var r=ctx&&ctx.by&&ctx.by[id],a=r&&r.paragraphs;
 return Array.isArray(a)?a.filter(function(x){return typeof x==='string'&&x.trim()}):[];
}
function uniqTextV2(a){
 var out=[],seen={};
 (a||[]).forEach(function(x){
  x=String(x||'').trim();
  if(!x)return;
  var k=x.replace(/\s+/g,' ');
  if(seen[k])return;
  seen[k]=1;out.push(x);
 });
 return out;
}
function firstSentenceV2(s){
 s=String(s||'').trim();if(!s)return '';
 var cut=s.length,chars=['.','!','?'];
 chars.forEach(function(c){var i=s.indexOf(c);if(i>=0&&i<cut)cut=i});
 return cut<s.length?s.slice(0,cut+1):s;
}
function breakupHeadV2(f,k){
 var sa=see(f.gA),sb=see(f.gB);
 if(k==='bond')return '붙는 힘은 분명하지만, 가까워질수록 서로 원하는 행동을 말로 맞춰야 하는 관계야.';
 if(k==='clash')return '마음의 크기보다 생활 속도와 반응 방식의 충돌을 먼저 풀어야 하는 관계야.';
 if(k==='knot')return '좋아하는 마음과 별개로 같은 문제를 같은 자리에서 반복하기 쉬운 관계야.';
 if(k==='hurt')return '큰 싸움보다 말하지 않은 서운함이 쌓이는 방식을 먼저 봐야 하는 관계야.';
 if(k==='break')return '감정보다 약속이 바뀌는 방식과 책임의 빈칸을 먼저 정리해야 하는 관계야.';
 if(f.gA&&f.gB&&f.gA!==f.gB)return J(f.nA,'은/는')+' '+J(sa.need,'을/를')+' 중요하게 보고, '+J(f.nB,'은/는')+' '+J(sb.need,'을/를')+' 중요하게 보는 관계야.';
 if(f.gA&&f.gA===f.gB)return '둘 다 비슷한 것을 원해서, 채워지지 않을 때 같은 지점에서 더 크게 서운해지기 쉬운 관계야.';
 if(f.sA.band!==f.sB.band)return '한쪽이 관계의 속도와 결정을 더 많이 잡기 쉬워서 부담의 균형을 먼저 봐야 하는 관계야.';
 return '겉으로 큰 충돌이 없어도 가까운 생활에서 무엇을 주고받는지가 관계를 가르는 조합이야.';
}
function evidenceRows(f){
 if(window.GUIIN_RELATION_V2_ON===false)return evidenceRowsV1(f);
 var rows=evidenceRowsV1(f),pa=null,pb=null,extra=[];
 try{
  if(window.GuiinExpert&&typeof GuiinExpert.narrativeProfile==='function'){
   pa=GuiinExpert.narrativeProfile(f.a);pb=GuiinExpert.narrativeProfile(f.b);
  }
 }catch(_e){}
 if(f.a&&f.a.pillars&&f.a.pillars.month&&f.b&&f.b.pillars&&f.b.pillars.month){
  extra.push(['월주',f.nA+' '+f.a.pillars.month.ko+' · '+f.nB+' '+f.b.pillars.month.ko]);
 }
 if(pa&&pb&&(pa.social||pb.social))extra.push(['월간 십성',f.nA+' '+(pa.social||'-')+' · '+f.nB+' '+(pb.social||'-')]);
 if(pa&&pb&&(pa.intimate||pb.intimate))extra.push(['일지 본기 십성',f.nA+' '+(pa.intimate||'-')+' · '+f.nB+' '+(pb.intimate||'-')]);
 function pill(c){var P=c&&c.pillars||{},h=P.hour?P.hour.ko:'시주 없음';return [P.year&&P.year.ko,P.month&&P.month.ko,P.day&&P.day.ko,h].join(' ')}
 var fillTxt=f.fill&&f.fillB?'양쪽 모두 보완 구조':f.fill?f.nA+'의 부족 오행을 '+f.nB+'이 채움':f.fillB?f.nB+'의 부족 오행을 '+f.nA+'이 채움':'없음';
 var ordered=[
  ['기둥',f.nA+' '+pill(f.a)+' · '+f.nB+' '+pill(f.b)],
  ['일간·교차 십신',rows[0][1]+' / '+rows[3][1]],
  ['일지 관계',f.dayRel],
  ['결속·긴장','결속 '+f.sig.combine+' / 긴장 '+f.sig.tension],
  ['부족 오행 보완',fillTxt],
  ['오행 분포',rows[5][1]]
 ];
 var rest=rows.filter(function(r){return ['일간','일주','일지 관계','교차 십신','합·긴장 신호','오행 분포'].indexOf(r[0])<0});
 return ordered.concat(extra,rest);
}
function softV2(s){
 s=String(s||'').trim();if(!s)return '';
 return s
  .replace(/에 끌려\./g,'에 끌리기 쉬워.')
  .replace(/에 마음이 가\./g,'에 마음이 가기 쉬워.')
  .replace(/평가당했다고 느끼고 마음이 닫혀\./g,'평가받는 느낌으로 받아들여 마음을 닫기 쉬워.')
  .replace(/관계가 식어 간다고 느껴\./g,'관계가 식는 것처럼 느끼기 쉬워.')
  .replace(/방어부터 하게 돼\./g,'방어적으로 반응하기 쉬워.')
  .replace(/눈치만 보게 돼\./g,'눈치를 보게 되기 쉬워.');
}
function themeParas(ctx,id,allowScore){
 var a=richParas(ctx,id).map(softV2);
 if(allowScore)return a;
 return a.filter(function(p){return !/(궁합|\d+점|점수\(|맞는 쪽|연애 흐름\s*\d|성향 조화\s*\d|돈 감각\s*\d|앞으로의 방향\s*\d)/.test(p)});
}
function axisHeadV2(m){
 var axes=[['끌림',m&&m.love],['대화',m&&m.personality],['생활·돈',m&&m.money],['장기 조율',m&&m.future]].filter(function(r){return isFinite(+r[1])}).sort(function(a,b){return +b[1]-+a[1]});
 if(axes.length<2)return '';
 if(+axes[0][1]-+axes[axes.length-1][1]>=8)return J(axes[0][0],'은/는')+' 강점인데 '+J(axes[axes.length-1][0],'은/는')+' 따로 맞춰야 하는 관계야.';
 return J(axes[0][0],'과/와')+' '+J(axes[1][0],'은/는')+' 비교적 잘 맞고, 다른 영역은 생활 속에서 맞춰 가는 관계야.';
}
function crushHeadV2(f,k){
 var sa=see(f.gA),sb=see(f.gB);
 if(k==='bond')return '편하게 가까워질 연결은 있지만, 호감 여부는 상대가 반복해서 내는 시간과 행동으로 확인해야 해.';
 if(k==='clash')return '끌림이 생겨도 반응 속도가 엇갈리기 쉬워서, 답을 재촉하지 않는 접근이 중요한 인연이야.';
 if(k==='knot')return '가까워질수록 같은 지점을 다시 확인하기 쉬워서, 서두르기보다 편한 대화가 반복되는지 보는 게 중요해.';
 if(k==='hurt')return '큰 표현보다 작은 오해가 남지 않게 확인하면서 가까워지는 편이 맞는 인연이야.';
 if(k==='break')return '호감보다 약속과 연락 방식이 자주 바뀌지 않는지를 먼저 봐야 하는 인연이야.';
 if(f.gA&&f.gB&&f.gA!==f.gB)return f.nA+'에게 '+J(f.nB,'은/는')+' '+sa.feel+'으로 다가오기 쉽고, '+f.nB+' 쪽에서는 '+J(f.nA,'을/를')+' '+sb.feel+'으로 받아들이기 쉬운 조합이야.';
 return '친해지는 속도보다 서로 편하다고 느끼는 행동이 반복되는지를 보는 게 중요한 인연이야.';
}

/* ───────── 관계 해석 V2.5: 첫 문장 근거 우선순위 + 일지 단독결론 방지 + QA ───────── */
function profilePairV25(f){
 var a=null,b=null;
 try{
  if(window.GuiinExpert&&typeof GuiinExpert.narrativeProfile==='function'){
   a=GuiinExpert.narrativeProfile(f.a);b=GuiinExpert.narrativeProfile(f.b);
  }
 }catch(_e){}
 return {a:a||{},b:b||{}};
}
function evidenceCandidatesV25(f,ctx,theme){
 var P=profilePairV25(f),a=P.a,b=P.b,c=[];
 function add(id,score,clause,label){if(clause)c.push({id:id,score:score,clause:clause,label:label||id})}
 var k=REL_KIND[f.dayRel]||'none';
 if(k!=='none'){
  var ds={clash:86,knot:81,hurt:76,break:74,bond:72}[k]||65;
  add('day-relation',ds,
    k==='clash'?'일지 충으로 생활 리듬과 반응 속도가 부딪히기 쉽고':
    k==='knot'?'일지 형으로 같은 문제가 같은 자리에서 반복되기 쉽고':
    k==='hurt'?'일지 해로 작은 서운함이 말없이 남기 쉽고':
    k==='break'?'일지 파로 약속과 계획이 흔들릴 때 피로가 쌓이기 쉽고':
    '일지 육합으로 가까워지는 힘이 비교적 분명하고','일지 관계');
 }
 var gap=(f.sA.score!=null&&f.sB.score!=null)?Math.abs(f.sA.score-f.sB.score):null;
 if(gap!=null&&gap>=12)add('strength-gap',gap>=30?91:gap>=20?84:77,'강약 차이가 '+gap+'점이라 같은 상황에서도 감당하는 속도와 부담이 다르기 쉽고','강약 차이');
 else if(f.sA.band!==f.sB.band)add('strength-gap',75,'두 사람의 강약 등급이 달라 관계의 속도와 주도권이 한쪽으로 기울기 쉽고','강약 차이');
 if(f.tg&&f.tg.aSeesB&&f.tg.bSeesA){
  if(f.tg.aSeesB!==f.tg.bSeesA)add('cross-ten-god',88,'서로를 받아들이는 역할이 '+f.tg.aSeesB+'과 '+f.tg.bSeesA+'로 달라 기대하는 반응도 엇갈리기 쉽고','교차 십신');
  else add('cross-ten-god',70,'서로를 '+f.tg.aSeesB+'의 역할로 비슷하게 받아들여 이해는 빠르지만 같은 기대가 겹치기 쉽고','교차 십신');
 }
 if(a.social&&b.social){
  if(a.social!==b.social)add('month-ten-god',83,'월간 십성이 '+a.social+'과 '+b.social+'로 달라 밖에서 문제를 처리하는 방식이 서로 다르고','월간 십성');
  else add('month-ten-god',66,'월간 십성이 둘 다 '+a.social+'이라 겉으로 문제를 푸는 방식이 닮아 있고','월간 십성');
 }
 if(a.intimate&&b.intimate){
  if(a.intimate!==b.intimate)add('day-hidden-god',82,'일지 본기 십성이 '+a.intimate+'과 '+b.intimate+'로 달라 가까운 관계에서 편안함을 느끼는 조건도 다르고','일지 본기 십성');
  else add('day-hidden-god',67,'일지 본기 십성이 둘 다 '+a.intimate+'이라 가까운 관계에서 원하는 기준이 비슷하고','일지 본기 십성');
 }
 if(f.fill&&f.fillB)add('element-complement',85,'서로 부족한 오행을 상대가 채워 주는 보완 구조가 양쪽에 같이 있고','오행 보완');
 else if(f.fill||f.fillB)add('element-complement',78,'한쪽의 부족한 오행을 다른 쪽이 채워 주는 보완 구조가 있고','오행 보완');
 else if(f.wa&&f.wb&&f.wa.dom===f.wb.dom)add('element-pattern',63,'두 사람 모두 '+f.wa.dom+' 기운이 강해 잘 통하는 만큼 같은 방향으로 과해질 수 있고','오행 분포');
 else if(f.wa&&f.wb&&f.wa.dom&&f.wb.dom)add('element-pattern',68,'강한 오행이 '+f.wa.dom+'과 '+f.wb.dom+'으로 달라 힘을 쓰는 방향이 다르고','오행 분포');
 var combine=+f.sig.combine||0,tension=+f.sig.tension||0;
 if(combine||tension){
  if(tension>=combine+3)add('relation-signals',89,'전체 기둥의 긴장 신호가 결속 신호보다 강해 일지 밖에서도 조율할 장면이 반복되기 쉽고','합·긴장 신호');
  else if(combine>=tension+2)add('relation-signals',80,'전체 기둥의 결속 신호가 긴장 신호보다 강해 서로를 붙잡아 주는 장면이 여러 층에서 생기기 쉽고','합·긴장 신호');
  else if(combine&&tension)add('relation-signals',79,'전체 기둥에서 결속 신호와 긴장 신호가 함께 잡혀 끌림과 피로가 같은 관계 안에 공존하기 쉽고','합·긴장 신호');
 }
 if((theme==='reunion'||theme==='breakup')&&(f.tA||f.tB))add('timing',61,'현재 대운·세운에서 두 사람이 각자 에너지를 써야 하는 자리가 달라 관계 여유도 같지 않을 수 있고','대운·세운');
 c.sort(function(x,y){if(y.score!==x.score)return y.score-x.score;return (hash(f.seed+x.id)%97)-(hash(f.seed+y.id)%97)});
 return c;
}
function priorityHeadV25(f,ctx,theme,fallback){
 var c=evidenceCandidatesV25(f,ctx,theme);if(c.length<2)return fallback;
 var first=c[0],second=null;for(var i=1;i<c.length;i++){if(c[i].id!==first.id){second=c[i];break}}if(!second)return fallback;
 var end={compat:'이 두 축을 같이 보면 끌리는 이유와 맞춰야 할 지점이 동시에 선명한 관계야.',breakup:'지금 힘든 이유를 감정 하나보다 이 두 축에서 함께 봐야 하는 관계야.',crush:'호감의 가능성보다 두 사람이 편하게 가까워질 속도와 방식을 먼저 봐야 하는 조합이야.',reunion:'재회 여부보다 예전과 다른 방식으로 관계를 맞출 수 있는지를 먼저 봐야 하는 조합이야.'}[theme]||'이 두 근거를 함께 봐야 관계의 핵심이 보여.';
 return first.clause+', '+second.clause+' '+end;
}
function daySupportV25(f){var k=REL_KIND[f.dayRel]||'none';return k==='none'?'':(DAYREL[k]&&DAYREL[k].short||'')}
function tagEvidenceV25(card,ids){card._evidenceIds=(ids||[]).filter(Boolean);return card}
function qaRelationV25(out,theme,priority){
 try{
  var weak=[];(out.cards||[]).forEach(function(c){if((c.b||c.list)&&(!c._evidenceIds||c._evidenceIds.length<2))weak.push(c.t)});
  out._qa={version:'v2.5',priorityEvidence:(priority||[]).map(function(x){return x.id}),weakEvidenceCards:weak};
  if(weak.length)LOG.push({theme:theme,reason:'v2.5 evidence<2',cards:weak.slice()});
 }catch(_e){}
 return out;
}
function buildCompat(f,metrics){
 var ctx=richPairContext(f);
 if(!ctx.rows.length)return buildCompatV1(f,metrics);
 var core=themeParas(ctx,'pair-core',true),attr=themeParas(ctx,'pair-attraction',true),conf=themeParas(ctx,'pair-conflict',true),
     cool=themeParas(ctx,'pair-cooling',true),space=themeParas(ctx,'pair-space',true),rules=themeParas(ctx,'pair-rules',true),
     money=themeParas(ctx,'pair-money',true),conditions=themeParas(ctx,'pair-conditions',true),fin=themeParas(ctx,'pair-final',true);
 var m=metrics||ctx.metrics||{},fallbackHead=axisHeadV2(m)||firstSentenceV2(core[0])||'두 사람은 끌리는 지점과 맞춰야 할 지점이 함께 있는 관계야.',head=priorityHeadV25(f,ctx,'compat',fallbackHead),priority=evidenceCandidatesV25(f,ctx,'compat');
 var sum=uniqTextV2([firstSentenceV2(attr[0]),firstSentenceV2(conf[0]),firstSentenceV2(core[0])]).slice(0,3);
 var timing=uniqTextV2([yearLine(f.nA,f.tA),yearLine(f.nB,f.tB,true),luckLine(f.nA,f.tA)+(f.tB&&f.tB.luckKo?' '+luckLine(f.nB,f.tB):'')]);
 var cards=[
  tagEvidenceV25({t:'끌리는 이유',b:uniqTextV2(attr.slice(0,3).concat([dmLine(f)])).slice(0,4)},['premium-attraction','day-master']),
  tagEvidenceV25({t:'잘 맞는 점',b:uniqTextV2(core.slice(3,5).concat([complementPos(f)])).slice(0,4)},['premium-core','element-pattern']),
  tagEvidenceV25({t:'갈등 포인트',b:uniqTextV2(conf.slice(0,4).concat([strengthPair(f)])).slice(0,4)},['premium-conflict','strength-gap']),
  tagEvidenceV25({t:'소통',b:uniqTextV2(cool.slice(0,3).concat(rules.slice(0,1))).slice(0,4)},['premium-cooling','premium-rules']),
  tagEvidenceV25({t:'생활·돈',b:uniqTextV2(money.slice(0,4)).slice(0,4)},['a-profile','b-profile']),
  tagEvidenceV25({t:'장기 관계',b:uniqTextV2(timing.concat(conditions.slice(0,2),fin.slice(0,1))).slice(0,4)},['timing','premium-conditions'])
 ];
 return qaRelationV25({head:head,sum:sum,cards:cards},'compat',priority);
}
function buildBreakup(f,x){
 var ctx=richPairContext(f);
 if(!ctx.rows.length)return buildBreakupV1(f,x);
 var k=REL_KIND[f.dayRel]||'none',d=DAYREL[k];
 var attr=themeParas(ctx,'pair-attraction',false),conf=themeParas(ctx,'pair-conflict',false),cool=themeParas(ctx,'pair-cooling',false),
     space=themeParas(ctx,'pair-space',false),rules=themeParas(ctx,'pair-rules',false),conditions=themeParas(ctx,'pair-conditions',false);
 var len={short:'만난 지 아직 오래되지 않았기 때문에, 지금의 불편이 서로를 덜 알아서 생긴 건지 이미 반복되는 구조인지 분리해서 봐야 해.',mid:'1년 안팎을 지나며 서로의 습관과 역할이 드러나는 시기라, 한 번의 싸움보다 반복되는 장면이 더 중요한 자료야.',long:'오래 함께한 관계라면 지금의 갈등 하나보다 이미 굳어진 역할과 회복 방식이 바뀔 수 있는지를 봐야 해.'}[x.len]||'';
 var state={now:'지금도 만나는 중이라면 결론을 먼저 정하기보다, 다음 갈등에서 실제 행동 하나가 달라지는지 확인해.',pause:'잠시 거리를 둔 상태라면 연락의 횟수보다, 다시 대화했을 때 이전과 다른 행동이 가능한지를 확인해.'}[x.state]||'';
 var fallbackHead=breakupHeadV2(f,k),head=priorityHeadV25(f,ctx,'breakup',fallbackHead),priority=evidenceCandidatesV25(f,ctx,'breakup');
 var sum=uniqTextV2([firstSentenceV2(conf[0]||d.short),firstSentenceV2(attr[0]||dmLine(f)),firstSentenceV2(conditions[0]||state)]).slice(0,3);
 var cards=[
  tagEvidenceV25({t:'지금 힘든 이유',b:uniqTextV2(conf.slice(0,2).concat([dmLine(f),len])).slice(0,4)},['premium-conflict','day-master']),
  tagEvidenceV25({t:'반복되는 갈등',b:uniqTextV2(conf.slice(2,4).concat(space.slice(1,3),[strengthPair(f)])).slice(0,4)},['premium-conflict','strength-gap']),
  tagEvidenceV25({t:'아직 붙잡게 되는 이유',b:uniqTextV2(attr.slice(0,3).concat([complementPos(f),daySupportV25(f)])).slice(0,4)},['premium-attraction','element-pattern']),
  tagEvidenceV25({t:'개선 가능한 부분',b:uniqTextV2(conditions.slice(0,4).concat([k==='none'?'':d.fix])).slice(0,4)},['premium-conditions','premium-rules']),
  tagEvidenceV25({t:'확인해야 할 행동',list:uniqTextV2(rules.slice(0,3).concat([state,'계속 만날지의 결론은 명식보다 실제 행동이 달라지는지로 판단하는 게 좋아.'])).slice(0,5)},['premium-rules','relationship-state'])
 ];
 return qaRelationV25({head:head,sum:sum,cards:cards},'breakup',priority);
}
function buildCrush(f,x){
 var ctx=richPairContext(f);
 if(!ctx.rows.length)return buildCrushV1(f,x);
 var k=REL_KIND[f.dayRel]||'none',d=DAYREL[k],lb=STEM_LOVE[f.b.pillars.day.stem]||STEM_LOVE['갑'];
 var attr=themeParas(ctx,'pair-attraction',false),conf=themeParas(ctx,'pair-conflict',false),cool=themeParas(ctx,'pair-cooling',false),
     space=themeParas(ctx,'pair-space',false),rules=themeParas(ctx,'pair-rules',false);
 var dist={far:'아직 연락이 거의 없다면 먼저 자연스럽게 답할 수 있는 작은 접점을 만드는 게 우선이야.',know:'아는 사이라면 둘만의 대화가 실제로 반복되는지부터 확인해.',close:'이미 친한 사이라면 친밀함 자체를 호감으로 단정하지 말고, 둘만을 위해 따로 시간과 행동을 내는지 봐.'}[x.dist]||'';
 var fallbackHead=crushHeadV2(f,k),head=priorityHeadV25(f,ctx,'crush',fallbackHead),priority=evidenceCandidatesV25(f,ctx,'crush');
 var cards=[
  tagEvidenceV25({t:'상대의 연애 성향',b:uniqTextV2([f.nB+'의 일간은 '+Y(f.b.pillars.day.stem+'('+f.eB+')')+'. '+lb.tend,firstSentenceV2(cool[1]||cool[0]),'이건 명식에서 읽는 관계 성향이야. '+f.nB+'의 실제 속마음은 대화와 행동으로 확인하는 게 가장 정확해.']).slice(0,3)},['b-profile','premium-cooling']),
  tagEvidenceV25({t:'두 사람의 관계 특징',b:uniqTextV2(attr.slice(0,3).concat([dmLine(f),daySupportV25(f)])).slice(0,4)},['premium-attraction','day-master']),
  tagEvidenceV25({t:'접근 방법',b:uniqTextV2([lb.approach,firstSentenceV2(rules[0]),dist]).slice(0,3)},['b-profile','premium-rules']),
  tagEvidenceV25({t:'부담이 되는 방식',b:uniqTextV2(conf.slice(0,2).concat(space.slice(0,2))).slice(0,4)},['premium-conflict','premium-space']),
  tagEvidenceV25({t:'현실에서 볼 신호',list:uniqTextV2([lb.sign,'약속을 미룰 때 대신 가능한 날짜나 시간을 먼저 제안하는지','대화가 끝난 뒤 상대 쪽에서도 다음 이야기를 다시 꺼내는지','한 번의 친절보다 2~3주 동안 비슷한 행동이 반복되는지']).slice(0,4)},['b-profile','observable-behavior'])
 ];
 var sum=uniqTextV2([firstSentenceV2(attr[0]||daySupportV25(f)),firstSentenceV2(space[0]),'상대의 실제 마음은 사주로 단정하지 않고 현실의 반복 행동으로 확인해.']).slice(0,3);
 return qaRelationV25({head:head,sum:sum,cards:cards},'crush',priority);
}
function buildReunion(f,x){
 var ctx=richPairContext(f);
 if(!ctx.rows.length)return buildReunionV1(f,x);
 var k=REL_KIND[f.dayRel]||'none',d=DAYREL[k];
 var attr=themeParas(ctx,'pair-attraction',false),conf=themeParas(ctx,'pair-conflict',false),rules=themeParas(ctx,'pair-rules',false),
     conditions=themeParas(ctx,'pair-conditions',false),space=themeParas(ctx,'pair-space',false);
 var fallbackHead=k==='bond'?'다시 끌리는 힘은 남기 쉬워도, 재회 여부는 예전과 다른 행동이 가능한지를 먼저 봐야 해.':
  k==='clash'?'다시 만나면 감정보다 먼저 같은 충돌을 다른 방식으로 풀 수 있는지 확인해야 하는 관계야.':
  k==='knot'?'재회 자체보다, 다시 만났을 때 같은 문제가 반복되지 않을 새 규칙이 필요한 관계야.':
  k==='hurt'?'남은 마음보다 말하지 못했던 서운함을 어떻게 확인할지 먼저 정해야 하는 관계야.':
  k==='break'?'다시 이어지려면 마음보다 약속과 책임을 다시 세우는 과정이 먼저 필요한 관계야.':
  (f.gA&&f.gB&&f.gA!==f.gB?f.nA+'에게 '+J(f.nB,'은/는')+' '+see(f.gA).feel+'으로 남기 쉽고, '+f.nB+' 쪽에서는 '+J(f.nA,'을/를')+' '+see(f.gB).feel+'으로 받아들이기 쉬워서 다시 끌리는 이유와 지치는 이유를 따로 봐야 해.':
   f.sA.band!==f.sB.band?'강약 차이가 있어서 예전과 같은 속도로 다시 시작하기보다 서로 감당할 수 있는 속도를 먼저 맞춰야 하는 관계야.':
   '다시 끌릴 이유와 다시 지칠 이유가 함께 있어서, 재회 여부보다 바뀐 조건을 먼저 확인해야 하는 관계야.');
 var head=priorityHeadV25(f,ctx,'reunion',fallbackHead),priority=evidenceCandidatesV25(f,ctx,'reunion');
 var since={short:'헤어진 지 3개월이 안 됐다면 아직 감정의 여운이 판단에 섞일 수 있어서, 연락 전에 헤어진 이유가 실제로 달라졌는지 먼저 적어 보는 게 좋아.',mid:'헤어진 지 1년이 안 됐다면 감정과 현실에서 달라진 부분을 나눠 보기 좋은 시기야.',long:'1년 이상 지났다면 예전 관계를 그대로 복원하려 하기보다 두 사람이 지금 어떻게 달라졌는지를 먼저 봐야 해.'}[x.since]||'';
 var contact={on:'지금도 연락이 이어진다면 횟수보다 대화 내용과 행동이 예전과 달라졌는지가 더 중요해.',off:'연락이 끊긴 상태라면 다시 연락할지보다, 연락해서 확인할 한 가지가 무엇인지 먼저 정리해.'}[x.contact]||'';
 var flow=uniqTextV2([yearLine(f.nA,f.tA),yearLine(f.nB,f.tB,true),luckLine(f.nA,f.tA)+(f.tB&&f.tB.luckKo?' '+luckLine(f.nB,f.tB):''),'대운과 세운은 시기의 분위기를 보여 주는 참고값이야. 특정 날짜의 연락이나 재회를 확정하지 않아.']);
 var cards=[
  tagEvidenceV25({t:'다시 끌리는 이유',b:uniqTextV2(attr.slice(0,3).concat([complementPos(f),daySupportV25(f)])).slice(0,4)},['premium-attraction','element-pattern']),
  tagEvidenceV25({t:'과거 문제',b:uniqTextV2(conf.slice(0,3).concat([strengthPair(f)])).slice(0,4)},['premium-conflict','strength-gap']),
  tagEvidenceV25({t:'현재 관계 흐름',b:flow},['daeun','seun']),
  tagEvidenceV25({t:'재접촉을 고민할 때 기준',list:uniqTextV2([since,contact,firstSentenceV2(conditions[1]||conditions[0]),firstSentenceV2(rules[0])]).slice(0,4)},['premium-conditions','premium-rules']),
  tagEvidenceV25({t:'재회 후 조율할 부분',b:uniqTextV2(rules.slice(0,2).concat(conditions.slice(1,3),space.slice(0,1),[k==='none'?'':d.fix])).slice(0,4)},['premium-rules','premium-space'])
 ];
 var sum=uniqTextV2([firstSentenceV2(attr[0]||daySupportV25(f)),firstSentenceV2(conf[0]),'재회가 정해져 있다고 보지 않고, 이전과 다른 행동이 실제로 가능한지를 기준으로 봐.']).slice(0,3);
 return qaRelationV25({head:head,sum:sum,cards:cards},'reunion',priority);
}

/* 신살·귀인 (한 사람) */
var STAR_PRI=['천을귀인','천덕귀인','월덕귀인','문창귀인','학당귀인','태극귀인','암록','건록','천의성','복성귀인','금여성','문곡귀인','협록','천문성','관귀학관','화개살','도화살','홍염살','역마살','양인살','괴강살','귀문관살','원진살','공망','백호살','현침살','고란살','고신살','과숙살'];
var PIL={day:'일주',month:'월주',hour:'시주',year:'년주'},PILW={day:3,month:2,hour:1,year:1};
var TONE_TXT={good:'도움과 배움이 사람을 통해 들어오는 흐름이 강한 편이야.',move:'변화와 이동이 있는 환경에서 오히려 활력이 살아나는 편이야.',deep:'혼자 깊게 몰입하고 생각을 오래 다듬는 시간이 중요한 편이야.',power:'결단과 추진의 힘이 강해서, 마음먹은 일은 밀고 나가는 편이야.',popular:'사람의 시선을 끄는 매력과 표현력이 드러나는 편이야.',relation:'관계에서 미묘한 거리감을 조율하는 일이 자주 생기는 편이야.'};
var G_GUIIN=/귀인|자립·기반|돌봄·회복|배움·전문성/,G_TALENT=/배움|통찰|몰입|감각|매력·표현|추진|주도|변화/,G_WATCH=/강한 기운|관계·조정|매력·관계/;
function buildShinsal(c){
 var n=nm(c,'나'),hits=(c.stars&&c.stars.hits)||[],M=(window.GuiinSaju&&GuiinSaju.SINSAL_META)||{};
 var by={};hits.forEach(function(h){if(!h||!h.name)return;var o=by[h.name]||(by[h.name]={name:h.name,pillars:[],meta:h.meta||M[h.name]||{}});if(o.pillars.indexOf(h.pillar)<0)o.pillars.push(h.pillar)});
 var list=Object.keys(by).map(function(k){var o=by[k],pi=STAR_PRI.indexOf(k);o.score=(pi<0?0:40-pi)+o.pillars.reduce(function(s,p){return s+(PILW[p]||0)},0)*3;return o});
 if(!list.length)return {head:J(n,'은/는')+' 눈에 띄는 신살·귀인이 적은 명식이야.',sum:[pick(['신살은 보조 정보야. 원국과 오행이 해석의 중심이야.','신살은 참고용 표식이야. 성격의 중심은 원국에서 봐.','신살이 적다고 부족한 사주가 아니야. 원국이 기본 틀이야.'],hash(n))],cards:[{t:'성립한 신살·귀인',b:['이 명식에서는 대표적인 신살·귀인이 잡히지 않았어. 신살이 적다고 부족한 사주라는 뜻은 아니야.']}],stars:[]};
 list.sort(function(x,y){return y.score-x.score});
 var seenS={},top=list.filter(function(o){if(!o.meta||!o.meta.short||seenS[o.meta.short])return false;seenS[o.meta.short]=1;return true}).slice(0,3);
 var guiin=list.filter(function(o){return G_GUIIN.test(o.meta.group||'')||/귀인$/.test(o.name)}),talent=list.filter(function(o){return G_TALENT.test(o.meta.group||'')}),watch=list.filter(function(o){return G_WATCH.test(o.meta.group||'')||o.meta.tone==='power'});
 var dayG=guiin.filter(function(o){return o.pillars.indexOf('day')>=0});
 var head=guiin.length>=3?J(n,'은/는')+' 도움을 주는 귀인과 재능의 별이 많은 사주야.':guiin.length?J(n,'은/는')+' 필요한 순간에 도움이 닿는 귀인이 있는 사주야.':J(n,'은/는')+' 귀인보다 자기 힘으로 길을 여는 별이 두드러진 사주야.';
 var talentNames=talent.slice(0,3).map(function(o){return o.name});
 var cards=[
  {t:'성립한 신살·귀인',chips:list.map(function(o){return o.name+' · '+o.pillars.map(function(p){return PIL[p]||p}).join('/')})},
  {t:'가장 영향력이 큰 별 TOP 3',stars:top.map(function(o){return {name:o.name,where:o.pillars.map(function(p){return PIL[p]||p}).join('·'),short:o.meta.short}})},
  {t:'재능과 장점',b:[talentNames.length?J(talentNames.join(', '),'이/가')+' 성립해 있어. 그중 '+talent[0].name+(talent[0].meta.short?'('+talent[0].meta.short+')':'')+'이 대표적인 장점으로 읽혀.':'재능을 상징하는 별보다 원국의 오행 구조가 장점을 더 잘 보여 주는 명식이야.']},
  {t:'인복과 도움',b:[guiin.length?'귀인 계열 별이 '+guiin.length+'개('+guiin.slice(0,4).map(function(o){return o.name}).join(', ')+') 성립해 있어.':'귀인 계열 별은 뚜렷하지 않아. 도움은 내가 먼저 쌓은 관계에서 돌아오는 구조로 읽어.',dayG.length?'그중 '+J(dayG.map(function(o){return o.name}).join(', '),'이/가')+' 일주에 있어서, 가까운 사람과 배우자 자리에서 도움이 닿기 쉬운 상징이야.':'']},
  {t:'삶에서 나타나는 특징',b:(function(){var cnt={};list.forEach(function(o){var t=o.meta&&o.meta.tone;if(TONE_TXT[t])cnt[t]=(cnt[t]||0)+1+(o.pillars.indexOf('day')>=0?1:0)});return Object.keys(cnt).sort(function(x,y){return cnt[y]-cnt[x]}).slice(0,2).map(function(t){return TONE_TXT[t]})})()},
  {t:'주의할 점',b:(watch=watch.filter(function(o){return o.meta.watch&&!/단정하지 않/.test(o.meta.watch)})).length?watch.slice(0,2).map(function(o){return o.name+': '+(o.meta.watch||o.meta.short||'')}).concat(['신살 하나로 사건을 단정하지 않아. 원국·오행·대운과 함께 읽어야 해.']):['강하게 주의할 별은 두드러지지 않아. 신살 하나로 사건을 단정하지 않아.']}
 ];
 return {head:head,sum:[top.length?'가장 영향력이 큰 별은 '+Y(top.map(function(o){return o.name}).join(', '))+'.':'',guiin.length?'귀인 계열 별 '+guiin.length+'개가 성립해 있어.':'귀인보다 다른 별이 두드러진 명식이야.','신살은 보조 정보야. 성격과 흐름의 중심은 원국이야.'],cards:cards,evidence:[['일주',c.pillars.day.ko],['월주',c.pillars.month.ko],['성립 신살 수',String(list.length)],['기준','신살 판정은 기존 계산 엔진(saju-engine) 결과를 그대로 사용']]};
}

/* ───────── 값 검사 (빈 값·undefined·NaN 제거) ───────── */
var BAD=/undefined|NaN|\[object|null(?![가-힣])/;
/* 풀이 문장 규칙 V3: 추정·과장 표현이 든 문장은 빼고, 단정 어조는 가능성 표현으로 바꾼다. */
var SPEC_DROP=/식었|자존심 때문|자존심이 원인|끊기 어렵|완벽|대칭|확실히|반드시|무조건|운명|절대/;
var SPEC_SOFT=[];
function specV3(s){
 if(typeof s!=='string')return s;
 var out=s;
 SPEC_SOFT.forEach(function(r){out=out.replace(r[0],r[1])});
 return out;
}
function specDropV3(s,theme){
 if(typeof s!=='string')return false;
 if(SPEC_DROP.test(s)){LOG.push({theme:theme,reason:'spec-v3 drop'});return false}
 return true;
}
function clean(out,theme){
 function ok(s){return typeof s==='string'&&s.trim()&&!BAD.test(s)}
 out.sum=(out.sum||[]).filter(ok);
 out.cards=(out.cards||[]).map(function(c){
  if(c.b){c.b=c.b.filter(function(s){if(s===''||s==null)return false;if(!ok(s)){LOG.push({theme:theme,card:c.t,reason:'bad text'});return false}return true})}
  if(c.list){c.list=c.list.filter(function(s){if(!s)return false;if(!ok(s)){LOG.push({theme:theme,card:c.t,reason:'bad item'});return false}return true})}
  if(c.chips)c.chips=c.chips.filter(ok);
  if(c.stars)c.stars=c.stars.filter(function(s){return ok(s.name)&&ok(s.short)});
  return c}).filter(function(c){var n=(c.b||[]).length+(c.list||[]).length+(c.chips||[]).length+(c.stars||[]).length;if(!n)LOG.push({theme:theme,card:c.t,reason:'empty card dropped'});return n>0});
 if(!ok(out.head))out.head='두 사람의 명식을 함께 읽었어.';
 if(['compat','breakup','crush','reunion'].indexOf(theme)>=0){
  out.head=specV3(out.head);
  out.sum=(out.sum||[]).filter(function(x){return specDropV3(x,theme)}).map(specV3);
  out.cards=(out.cards||[]).map(function(c){
   if(c.b)c.b=c.b.filter(function(x){return specDropV3(x,theme)}).map(specV3);
   if(c.list)c.list=c.list.filter(function(x){return specDropV3(x,theme)}).map(specV3);
   return c}).filter(function(c){return ((c.b||[]).length+(c.list||[]).length)>0});
 }
 /* 같은 문장은 한 결과에서 한 번만 쓴다. 앞에서 나온 문장을 우선 남긴다. */
 var seenS={};
 function dedupeS(s){
  if(typeof s!=='string')return s;
  var parts=s.match(/[^.]*\.+\s*|[^.]+$/g)||[s];
  return parts.filter(function(p){var k=p.trim();if(k.length<6)return true;if(seenS[k])return false;seenS[k]=1;return true}).join('');
 }
 out.head=dedupeS(out.head);
 out.sum=(out.sum||[]).map(dedupeS).filter(function(x){return typeof x==='string'&&x.trim()});
 out.cards=(out.cards||[]).filter(function(c){
  var had=(c.b&&c.b.length)||(c.list&&c.list.length);
  if(c.b)c.b=c.b.map(dedupeS).filter(function(x){return typeof x==='string'&&x.trim()});
  if(c.list)c.list=c.list.map(dedupeS).filter(function(x){return typeof x==='string'&&x.trim()});
  return !had||(c.b&&c.b.length)||(c.list&&c.list.length)});
 return out;
}

/* ───────── 테마 정의 ───────── */
/* 이미지 경로는 여기 한 곳에서만 관리해.
   banner-*: 홈 카드와 테마 목록용 (1536×1024, 3:2).
   hero-*: 테마 상세 화면 상단용 (1536×1024, 3:2). banner를 hero 대신 쓰지 않아.
   hero 파일 로드가 실패하면 이미지를 숨기고 배경 gradient만 보여 줘. 깨진 아이콘은 나오지 않아. */
var THEME_ASSETS={
 compat:{banner:'banner-compat.webp',hero:'hero-compat.webp',pos:'50% 50%'},
 breakup:{banner:'banner-breakup.webp',hero:'hero-breakup.webp',pos:'50% 50%'},
 crush:{banner:'banner-crush.webp',hero:'hero-crush.webp',pos:'50% 50%'},
 reunion:{banner:'banner-reunion.webp',hero:'hero-reunion.webp',pos:'50% 50%'},
 shinsal:{banner:'banner-shinsal.webp',hero:'hero-shinsal.webp',icon:'fox-clover.webp',pos:'50% 50%'},
 homePenguin:'home-today-penguin.webp'
};
var IMG={compat:THEME_ASSETS.compat.banner,breakup:THEME_ASSETS.breakup.banner,crush:THEME_ASSETS.crush.banner,reunion:THEME_ASSETS.reunion.banner,shinsal:THEME_ASSETS.shinsal.banner};
var THEMES={
 shinsal:{title:'내 사주에 숨겨진 신살·귀인',kicker:'신살·귀인',intro:'타고난 재능과 인연, 나를 도와주는 귀인까지. 내 명식에 실제로 성립한 별만 골라 읽어 줄게.',img:IMG.shinsal,hero:THEME_ASSETS.shinsal.hero,icon:THEME_ASSETS.shinsal.icon,pair:false,cls:'sh',btn:'신살·귀인 살펴보기'},
 compat:{title:'궁합으로 보는 두 사람의 인연',kicker:'우리 궁합',intro:'두 사람의 끌림과 갈등, 함께하는 미래를 살펴봐.',img:IMG.compat,hero:THEME_ASSETS.compat.hero,pair:true,cls:'cp',btn:'궁합 알아보기',pos:'50% 50%',hpos:'50% 50%'},
 breakup:{title:'이별 고민, 계속 만나야 할까?',kicker:'이별 고민',intro:'계속 만나야 할지, 관계를 다시 생각해야 할지 고민된다면.',img:IMG.breakup,hero:THEME_ASSETS.breakup.hero,pair:true,cls:'bk',btn:'관계 흐름 살펴보기',pos:'50% 50%',hpos:'50% 50%',
  extra:[{k:'len',label:'함께한 기간',opts:[['short','1년 미만'],['mid','1~3년'],['long','3년 이상']]},{k:'state',label:'지금 상태',opts:[['now','만나는 중'],['pause','잠시 거리 두는 중']]}]},
 crush:{title:'짝사랑하는 상대의 마음',kicker:'짝사랑',intro:'좋아하는 사람과 어떤 관계를 만들어 갈 수 있을까?',img:IMG.crush,hero:THEME_ASSETS.crush.hero,pair:true,cls:'cr',btn:'인연 가능성 살펴보기',pos:'50% 50%',hpos:'50% 50%',
  extra:[{k:'dist',label:'지금 사이',opts:[['far','연락이 거의 없음'],['know','아는 사이'],['close','친한 사이']]}]},
 reunion:{title:'재회운으로 보는 다시 이어질 인연',kicker:'재회운',intro:'헤어진 사람과 다시 이어질 가능성과 관계의 흐름을 살펴봐.',img:IMG.reunion,hero:THEME_ASSETS.reunion.hero,pair:true,cls:'ru',btn:'재회운 살펴보기',pos:'50% 50%',hpos:'50% 50%',
  extra:[{k:'since',label:'헤어진 지',opts:[['short','3개월 미만'],['mid','1년 미만'],['long','1년 이상']]},{k:'contact',label:'연락',opts:[['on','가끔 연락함'],['off','연락 끊김']]}]}
};
var HOME_POS={compat:'50% 50%',breakup:'50% 50%',crush:'50% 50%',reunion:'50% 50%'};
var HOME_ORDER=['compat','breakup','crush','reunion'];
var HOME_IMG={compat:'c2-guiin-theme-compatibility.webp',breakup:'c2-guiin-theme-breakup.webp',crush:'c2-guiin-theme-crush.webp',reunion:'c2-guiin-theme-reunion.webp'};
var HOME_TXT={compat:['궁합','인연 흐름','알아보기'],breakup:['이별 고민','마음 정리','살펴보기'],crush:['짝사랑','다가갈 기회','살펴보기'],reunion:['재회운','다시 인연','살펴보기']};

/* ───────── 스타일 ───────── */
var CSS=[
'.gtSec{margin:18px 0 6px}.gtSec>h2{font-size:20px;line-height:1.35;margin:0 2px 4px;color:#2b2b2b;font-weight:800}.gtSec>p.lead{font-size:14px;color:#6b6b6b;margin:0 2px 12px;line-height:1.5}',
'.gtGrid{display:grid;grid-template-columns:1fr;gap:12px}@media (min-width:600px){.gtGrid{grid-template-columns:1fr 1fr}}',
'.gtCard{background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 14px rgba(120,90,60,.08);border:1px solid #f3e6da;display:flex;flex-direction:column;min-width:0}',
'.gtCard .ph{position:relative;aspect-ratio:3/2;background:linear-gradient(135deg,#ffe3ec,#fff4d6);overflow:hidden}.gtCard .ph img{width:100%;height:100%;object-fit:cover;display:block}',
'.gtCard .bd{padding:11px 12px 12px;display:flex;flex-direction:column;gap:6px;flex:1}.gtCard h3{font-size:17px;line-height:1.3;margin:0;color:#2b2b2b;font-weight:800}.gtCard p{font-size:14px;line-height:1.5;margin:0;color:#5d5d5d;flex:1;word-break:keep-all}',
'.gtCard button{margin-top:4px;border:0;border-radius:14px;background:#fff1f5;color:#c2405f;font-size:15px;font-weight:800;padding:10px 6px;min-height:44px;cursor:pointer;line-height:1.3;word-break:keep-all}',
'.gtCard.bk button{background:#f5eefe;color:#7a4bc0}.gtCard.cr button{background:#ffeef6;color:#c23c7c}.gtCard.ru button{background:#eaf0ff;color:#3f5bb8}',
'#theme{background:#fffaf4;min-height:100vh}#theme .gtPad{padding:12px 16px 120px}',
'.gtList{display:flex;flex-direction:column;gap:12px}',
'.gtBan{position:relative;display:flex;flex-direction:column;border-radius:22px;overflow:hidden;border:0;padding:0;text-align:left;cursor:pointer;width:100%;background:#fff;box-shadow:0 4px 14px rgba(120,90,60,.1)}',
'.gtBan .tx{position:relative;padding:14px 16px 16px;display:flex;flex-direction:column;gap:6px;min-width:0}.gtBan .mini{width:40px;height:40px;border-radius:12px;background:#fff;display:block}.gtBan .tx b{font-size:19px;line-height:1.3;color:#2b2b2b;font-weight:800;word-break:keep-all}.gtBan .tx span{font-size:14px;line-height:1.45;color:#5d5d5d;word-break:keep-all}',
'.gtBan .im{position:relative;display:block;width:100%;aspect-ratio:3/2;background:#f6eee6}.gtBan .im img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}',
'.gtBan.cp{background:linear-gradient(120deg,#fff0f4,#ffe1ea)}.gtBan.bk{background:linear-gradient(120deg,#f7f0ff,#f1e4ff)}.gtBan.cr{background:linear-gradient(120deg,#fff2f7,#ffe4ef)}.gtBan.ru{background:linear-gradient(120deg,#2d3364,#4b3f7a)}.gtBan.ru .tx b{color:#fff}.gtBan.ru .tx span{color:#e4e2ff}.gtBan.sh{background:linear-gradient(120deg,#fffbe6,#eaf7d9)}.gtBan.sh .im img{object-position:50% 50%}',
'.gtHero{position:relative;border-radius:24px;overflow:hidden;background:#3a2a44;margin-bottom:14px;display:flex;flex-direction:column}.gtHero .pic{position:relative;aspect-ratio:3/2;background:linear-gradient(160deg,#ffd6e3,#e9d6ff)}.gtHero .pic img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.gtHero.cp{background:#8a3c5c}.gtHero.bk{background:#5b4380}.gtHero.cr{background:#9a4a78}.gtHero.ru{background:#2f3466}.gtHero.sh{background:#7a4a3a}',
'.gtHero.sh .pic{background:#f6eee6}',
'.gtHero .cap{position:relative;padding:14px 18px 18px;color:#fff}',
'.gtHero .cap small{display:inline-block;font-size:12px;font-weight:800;background:rgba(255,255,255,.22);border-radius:99px;padding:3px 10px;margin-bottom:6px}.gtHero .cap h2{font-size:22px;line-height:1.3;margin:0 0 6px;font-weight:800;word-break:keep-all;text-shadow:0 1px 6px rgba(0,0,0,.25)}.gtHero .cap p{font-size:14px;line-height:1.5;margin:0;word-break:keep-all;opacity:.96}',
'.gtForm{background:#fff;border-radius:20px;padding:16px;border:1px solid #f1e5d8;margin-bottom:12px}.gtForm h3{font-size:18px;margin:0 0 10px;color:#2b2b2b;display:flex;align-items:center;gap:6px}.gtForm h3 i{width:8px;height:8px;border-radius:50%;background:#ff7a9a;display:inline-block}.gtForm.b h3 i{background:#6b8cff}',
'.gtF{display:grid;grid-template-columns:72px 1fr;gap:8px 10px;align-items:center}.gtF label{font-size:14px;color:#555;font-weight:700}.gtF input,.gtF select{width:100%;min-width:0;box-sizing:border-box;font-size:16px;padding:10px 12px;border:1px solid #e6dccf;border-radius:12px;background:#fffdf9;color:#2b2b2b;min-height:44px}',
'.gtSeg{display:flex;gap:6px;flex-wrap:wrap}.gtSeg button{flex:1;min-width:0;min-height:42px;font-size:15px;border-radius:12px;border:1px solid #e6dccf;background:#fff;color:#555;font-weight:700;cursor:pointer;padding:6px 8px;word-break:keep-all}.gtSeg button.on{background:#ff8fab;border-color:#ff8fab;color:#fff}.gtForm.b .gtSeg button.on{background:#7b98ff;border-color:#7b98ff}.gtForm.x .gtSeg button.on{background:#ffc94d;border-color:#ffc94d;color:#4a3500}',
'.gtHint{font-size:13.5px;color:#7a7a7a;line-height:1.5;margin:8px 0 0}.gtMsg{font-size:14px;color:#c0392b;margin:8px 2px 0;min-height:0}',
'.gtGo{display:block;width:100%;border:0;border-radius:18px;background:linear-gradient(180deg,#ffd75e,#ffc23a);color:#3b2a00;font-size:16px;font-weight:800;min-height:52px;cursor:pointer;margin:6px 0 4px;box-shadow:0 4px 12px rgba(230,170,0,.25)}',
'.gtRes{margin-top:14px}.gtSum{background:#fff;border-radius:22px;padding:18px;border:1px solid #f6d9e2;margin-bottom:12px}.gtSum small{font-size:12.5px;font-weight:800;color:#c2405f}.gtSum h3{font-size:20px;line-height:1.4;margin:6px 0 10px;color:#2b2b2b;word-break:keep-all}.gtSum p{font-size:16px;line-height:1.65;margin:0 0 6px;color:#3d3d3d;word-break:keep-all}',
'.gtD{background:#fff;border-radius:18px;border:1px solid #efe4d8;margin-bottom:10px;overflow:hidden}.gtD>summary{list-style:none;cursor:pointer;padding:15px 44px 15px 16px;position:relative;font-size:18px;font-weight:800;color:#2b2b2b;line-height:1.4}.gtD>summary::-webkit-details-marker{display:none}.gtD>summary:after{content:"";position:absolute;right:18px;top:50%;width:9px;height:9px;border-right:2px solid #b9a99a;border-bottom:2px solid #b9a99a;transform:translateY(-70%) rotate(45deg);transition:transform .2s}.gtD[open]>summary:after{transform:translateY(-30%) rotate(-135deg)}',
'.gtD>summary .lead{display:block;font-size:15px;font-weight:500;color:#666;margin-top:4px;line-height:1.5}.gtD[open]>summary .lead{display:none}',
'.gtD .in{padding:0 16px 16px}.gtD .in p{font-size:16px;line-height:1.7;color:#3d3d3d;margin:0 0 10px;word-break:keep-all}.gtD .in ul{margin:0;padding:0 0 0 2px;list-style:none}.gtD .in li{font-size:16px;line-height:1.6;color:#3d3d3d;padding:6px 0 6px 26px;position:relative;word-break:keep-all}.gtD .in li:before{content:"";position:absolute;left:4px;top:13px;width:12px;height:12px;border-radius:4px;border:2px solid #ffb3c6}',
'.gtChips{display:flex;flex-wrap:wrap;gap:6px}.gtChips span{font-size:14px;background:#fff6dc;color:#6b5000;border-radius:99px;padding:6px 11px;line-height:1.3}',
'.gtStar{display:flex;gap:12px;align-items:center;padding:10px 0;border-bottom:1px dashed #efe4d8}.gtStar:last-child{border-bottom:0}.gtStar img{width:52px;height:52px;border-radius:14px;background:#fff6dc;object-fit:cover;flex:0 0 52px}.gtStar b{font-size:17px;color:#2b2b2b;display:block}.gtStar em{font-style:normal;font-size:12.5px;color:#a07c00;margin-left:4px;font-weight:700}.gtStar span{font-size:15px;color:#555;line-height:1.5;display:block}',
'.gtEv{background:#fbf7f1}.gtEv table{width:100%;border-collapse:collapse}.gtEv th,.gtEv td{font-size:14px;text-align:left;padding:7px 4px;border-bottom:1px solid #eee3d6;vertical-align:top;line-height:1.5;word-break:keep-all}.gtEv th{width:88px;color:#8a7a6a;font-weight:700}.gtEv td{color:#3d3d3d}',
'.gtNext{display:flex;flex-direction:column;gap:8px;margin:14px 0}.gtNext button{min-height:50px;border-radius:16px;font-size:16px;font-weight:800;cursor:pointer;border:1px solid #f0c9d4;background:#fff;color:#c2405f}.gtNext button.main{border:0;background:linear-gradient(180deg,#ffd75e,#ffc23a);color:#3b2a00}',
'.gtNote{font-size:13.5px;color:#888;line-height:1.55;margin:10px 2px 0}',
'.gtErr{background:#fff3f3;border:1px solid #f3c7c7;border-radius:16px;padding:14px;font-size:15px;color:#8a3030;line-height:1.55}',
'@media (max-width:359px){.gtCard h3{font-size:17px}.gtCard button{font-size:15px;padding:9px 4px}.gtF{grid-template-columns:1fr}.gtBan .tx b{font-size:18px}}'
].join('\n');

/* ───────── 화면 ───────── */
function imgTag(src,alt,pos,cls,dims){var dd=dims?' width="'+dims[0]+'" height="'+dims[1]+'"':'';return '<img'+(cls?' class="'+cls+'"':'')+' src="'+esc(src)+'" alt="'+esc(alt||'')+'"'+dd+' loading="lazy" decoding="async"'+(pos?' style="object-position:'+pos+'"':'')+' onerror="this.style.display=\'none\'">'}
function homeSection(){
 var s=document.createElement('section');s.className='gtSec';s.id='gThemeHome';s.setAttribute('aria-label','사랑과 인연이 궁금할 때');
 s.innerHTML='<h2>사랑과 인연이 궁금할 때</h2><p class="lead">두 사람의 명식을 같은 기준으로 읽어 줄게.</p><div class="gtGrid">'+HOME_ORDER.map(function(k){var T=THEMES[k],h=HOME_TXT[k];return '<article class="gtCard '+T.cls+'"><div class="ph">'+imgTag(HOME_IMG[k]||T.img,'',HOME_POS[k]||T.pos,null,[1536,1024])+'</div><div class="bd"><h3>'+esc(h[0])+'</h3><p>'+esc(h[1])+'</p><button type="button" data-gt="'+k+'">'+esc(h[2])+' ›</button></div></article>'}).join('')+'</div>';
 s.addEventListener('click',function(e){var b=e.target.closest('[data-gt]');if(b){e.stopPropagation();open(b.getAttribute('data-gt'))}});
 return s;
}
function screen(){
 var el=$('theme');if(el)return el;
 var home=$('home');if(!home||!home.parentNode)return null;
 el=document.createElement('section');el.id='theme';el.className='screen';el.setAttribute('aria-label','관계 테마');
 el.innerHTML='<div class="topbar"><button class="ghost" type="button" data-gtback aria-label="뒤로"><svg viewBox="0 0 24 24" width="20" height="20"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2"/></svg></button><div class="brand"><div class="brandline" data-gttitle>관계 테마 보기</div></div><span></span></div><div class="gtPad" data-gtbody></div>';
 home.parentNode.insertBefore(el,home.nextSibling);
 el.addEventListener('click',onClick);
 return el;
}
var state={theme:null,data:null};
function listHTML(){
 return '<div class="gtList">'+['compat','breakup','crush','reunion','shinsal'].map(function(k){var T=THEMES[k];return '<button type="button" class="gtBan '+T.cls+'" data-gt="'+k+'"><span class="im">'+imgTag(T.img,'',T.pos,null,[1536,1024])+'</span><span class="tx">'+(T.icon?imgTag(T.icon,'',null,'mini',[512,512]):'')+'<b>'+esc(T.title)+'</b><span>'+esc(T.intro)+'</span></span></button>'}).join('')+'</div>';
}
function profileDefault(){
 try{if(typeof chart!=='undefined'&&chart&&chart.input)return chart.input}catch(_e){}
 try{var s=localStorage.getItem('guiin_last');if(s){var o=JSON.parse(s);if(o&&o.year)return o}}catch(_e){}
 return null;
}
function pad(n){return (n<10?'0':'')+n}
function personForm(p,who,d){
 d=d||{};var date=d.year?d.year+'-'+pad(d.month)+'-'+pad(d.day):'',time=d.year&&!d.hourUnknown&&d.hour!=null?pad(d.hour)+':'+pad(d.minute||0):'';
 var g=d.gender==='남'?'남':'여';
 return '<div class="gtForm '+(p==='b'?'b':'a')+'"><h3><i></i>'+esc(who)+'</h3><div class="gtF">'+
 '<label for="gt'+p+'Name">이름</label><input id="gt'+p+'Name" autocomplete="off" maxlength="12" placeholder="이름(선택)" value="'+esc(d.name&&d.name!=='사용자'?d.name:'')+'">'+
 '<label for="gt'+p+'Date">생년월일</label><input id="gt'+p+'Date" type="date" min="1920-01-01" max="2025-12-31" value="'+date+'">'+
 '<label for="gt'+p+'Time">출생시간</label><input id="gt'+p+'Time" type="time" value="'+time+'">'+
 '<label>성별</label><div class="gtSeg" data-seg="gt'+p+'Gender"><button type="button" data-v="여" class="'+(g==='여'?'on':'')+'">여자</button><button type="button" data-v="남" class="'+(g==='남'?'on':'')+'">남자</button></div>'+
 '</div><p class="gtHint">양력 생년월일 기준이야. 태어난 시간을 모르면 비워 둬.</p></div>';
}
/* 고민 키워드(최대 3개): 사용자가 고른 주제를 풀이 끝에 한 카드로 이어 줘. 원문은 저장·전송하지 않아. */
var KW=[['money','돈·생활'],['talk','대화 방식'],['time','연락·시간 차이'],['trust','신뢰·불안'],['family','가족·주변 시선'],['future','앞으로의 방향']];
var KW_NOTE={
 money:'돈과 생활 리듬을 어떻게 나눌지가 함께 정해야 할 주제로 읽혀요.',
 talk:'결론부터 말할지 감정부터 말할지 맞추면 오해가 크게 줄어들 가능성이 커요.',
 time:'연락 빈도와 만남 간격에 대한 기대치를 서로 한 번 확인해 보면 좋아요.',
 trust:'불안이 올라올 때 확인하는 방법을 미리 정해 두면 흔들림이 덜해요.',
 family:'주변 시선이나 가족 의견이 관계에 끼어드는 순간을 따로 정리해 두세요.',
 future:'지금 관계를 어디까지 이어 갈지 기준을 짧게 적어 보는 게 도움이 돼요.'
};
function kwForm(T){
 if(!T.pair)return '';
 return '<div class="gtF" style="margin-top:8px"><label>고민 키워드<br><small>최대 3개</small></label><div class="gtKw gtSeg" data-kw>'+KW.map(function(o){return '<button type="button" data-v="'+o[0]+'">'+esc(o[1])+'</button>'}).join('')+'</div></div><p class="gtHint" data-kwmsg></p>';
}
function extraForm(T){
 if(!T.extra)return kwForm(T)?'<div class="gtForm x"><h3>고민 키워드</h3>'+kwForm(T)+'</div>':'';
 return '<div class="gtForm x"><h3>관계 정보</h3>'+kwForm(T)+T.extra.map(function(x){return '<div class="gtF" style="margin-bottom:8px"><label>'+esc(x.label)+'</label><div class="gtSeg" data-seg="gtx_'+x.k+'">'+x.opts.map(function(o,i){return '<button type="button" data-v="'+o[0]+'" class="'+(i===0?'on':'')+'">'+esc(o[1])+'</button>'}).join('')+'</div></div>'}).join('')+'<p class="gtHint">관계 정보는 행동 조언에만 쓰고, 명리 계산에는 넣지 않아.</p></div>';
}
function detailHTML(k){
 var T=THEMES[k],d=profileDefault();
 var hero='<div class="gtHero '+T.cls+'"><div class="pic">'+imgTag(T.hero,'',T.hpos||T.pos,null,[1536,1024])+'</div><div class="cap"><small>'+esc(T.kicker)+'</small><h2>'+esc(T.title)+'</h2><p>'+esc(T.intro)+'</p></div></div>';
 return hero+personForm('a',T.pair?'나':'내 정보',d)+(T.pair?personForm('b',k==='crush'?'좋아하는 사람':k==='reunion'?'헤어진 사람':'상대',null):'')+extraForm(T)+
  '<button type="button" class="gtGo" data-gtrun>'+esc(T.btn)+' ›</button><div class="gtMsg" role="alert" aria-live="polite" data-gtmsg></div><div class="gtRes" data-gtres></div>';
}
function render(k){
 var el=screen();if(!el)return;
 var body=el.querySelector('[data-gtbody]'),title=el.querySelector('[data-gttitle]');
 state.theme=k||null;
 if(!k){title.textContent='관계 테마 보기';body.innerHTML=listHTML();return}
 title.textContent=THEMES[k].kicker;body.innerHTML=detailHTML(k);
}
function open(k){
 try{if(!THEMES[k])k=null;render(k);go('theme');try{history.replaceState(null,'','#theme')}catch(_e){}}catch(e){LOG.push({theme:k,reason:'open:'+(e&&e.message)})}
}
function segV(root,name){var s=root.querySelector('[data-seg="'+name+'"] button.on');return s?s.getAttribute('data-v'):''}
function readPerson(root,p,label){
 var name=(root.querySelector('#gt'+p+'Name').value||'').trim().slice(0,12);
 var dv=root.querySelector('#gt'+p+'Date').value,tv=root.querySelector('#gt'+p+'Time').value;
 if(!/^\d{4}-\d{2}-\d{2}$/.test(dv))return {err:label+' 생년월일을 입력해 줘.'};
 var y=+dv.slice(0,4),m=+dv.slice(5,7),dd=+dv.slice(8,10),unk=!/^\d{2}:\d{2}$/.test(tv);
 var inp={name:name||(p==='a'?'나':'상대'),gender:segV(root,'gt'+p+'Gender')||'여',calendar:'양력',year:y,month:m,day:dd,hour:unk?12:+tv.slice(0,2),minute:unk?0:+tv.slice(3,5),hourUnknown:unk,leapMonth:false,dayBoundary:'23',trueSolarApply:false,longitude:126.98};
 try{if(typeof validateBirthInput==='function'){var v=validateBirthInput(inp,{label:label+' 생년월일',calendar:'양력'});if(v)return {err:label+': '+v}}}catch(_e){}
 return {inp:inp};
}
function cardHTML(c,i,open){
 var first=(c.b&&c.b[0])||(c.list&&c.list[0])||'';
 var inner='';
 if(c.b)inner+=c.b.map(function(s){return '<p>'+esc(s)+'</p>'}).join('');
 if(c.list)inner+='<ul>'+c.list.map(function(s){return '<li>'+esc(s)+'</li>'}).join('')+'</ul>';
 if(c.chips)inner+='<div class="gtChips">'+c.chips.map(function(s){return '<span>'+esc(s)+'</span>'}).join('')+'</div>';
 if(c.stars){var A=window.GUIIN_STAR_ART,map=A&&Object.assign({},A.map||{},A.more||{})||{};inner+=c.stars.map(function(s){var m=map[s.name];return '<div class="gtStar">'+(m&&m.f?imgTag(m.f+'.webp',m.alt||s.name):'')+'<div><b>'+esc(s.name)+'<em>'+esc(s.where)+'</em></b><span>'+esc(s.short)+'</span></div></div>'}).join('')}
 var lead=c.chips||c.stars?'':'<span class="lead">'+esc(first.length>46?first.slice(0,44)+'…':first)+'</span>';
 return '<details class="gtD"'+(open?' open':'')+'><summary>'+esc(c.t)+lead+'</summary><div class="in">'+inner+'</div></details>';
}
function evidenceHTML(rows){return '<details class="gtD gtEv"><summary>명리 근거 보기</summary><div class="in"><table>'+rows.map(function(r){return '<tr><th>'+esc(r[0])+'</th><td>'+esc(r[1])+'</td></tr>'}).join('')+'</table></div></details>'}
var NEXT={
 compat:['궁합 전체 풀이 보기','기존 궁합 화면에서 점수와 전체 풀이를 이어서 볼 수 있어.'],
 shinsal:['내 평생사주에서 신살·귀인 전체 보기','기존 결과 화면의 신살·귀인 탭으로 이동해.']
};
var AI_THEME_Q={
 compat:'방금 본 궁합 풀이를 바탕으로 우리 관계에서 가장 중요한 장점과 반복해서 부딪힐 지점을 내 상황에 맞게 더 자세히 상담해줘.',
 breakup:'방금 본 이별 고민 풀이를 바탕으로 지금 관계에서 내가 먼저 확인해야 할 행동과 바꿀 수 있는 부분을 내 상황에 맞게 같이 정리해줘.',
 crush:'방금 본 짝사랑 풀이를 바탕으로 상대의 속마음을 단정하지 말고, 부담 없이 다가갈 방법과 현실에서 확인할 신호를 내 상황에 맞게 상담해줘.',
 reunion:'방금 본 재회운 풀이를 바탕으로 재회 가능성을 단정하지 말고, 다시 연락하기 전에 확인할 기준과 다시 만난다면 조율할 부분을 내 상황에 맞게 상담해줘.'
};
function aiThemeSnapshot(k,out,ev,x,f){
 var labels={compat:'궁합',breakup:'이별 고민',crush:'짝사랑',reunion:'재회운'};
 var kw=(x&&x.kw||[]).map(function(v){var row=KW.find(function(o){return o[0]===v});return row?row[1]:v}).filter(Boolean);
 return {
  version:'relationship-theme-v2.4',theme:k,theme_label:labels[k]||k,
  relationship_state:Object.keys(x||{}).filter(function(key){return key!=='kw'}).reduce(function(o,key){o[key]=x[key];return o},{}),
  selected_keywords:kw,
  headline:String(out&&out.head||'').slice(0,300),
  summary:(out&&out.sum||[]).slice(0,4).map(function(v){return String(v).slice(0,500)}),
  sections:(out&&out.cards||[]).slice(0,7).map(function(c){return {title:String(c.t||'').slice(0,120),body:(c.b||c.list||[]).slice(0,5).map(function(v){return String(v).slice(0,700)})}}),
  evidence:(ev||[]).slice(0,14).map(function(r){return {label:String(r[0]||'').slice(0,80),value:String(r[1]||'').slice(0,500)}}),
  pair:{a_name:f&&f.nA||'',b_name:f&&f.nB||'',day_relation:f&&f.dayRel||'',cross_ten_god:f&&f.tg?{a_sees_b:f.tg.aSeesB||'',b_sees_a:f.tg.bSeesA||''}:null}
 };
}
function handoffThemeAI(k,d){
 if(!d||!d.a||!d.b||!AI_THEME_Q[k])return false;
 try{
  var metrics=d.metrics||null;
  if(!metrics&&typeof guiinCompatMetricsV56==='function')metrics=guiinCompatMetricsV56(d.a,d.b);
  var pair={a:d.a,b:d.b,score:metrics&&metrics.score,love:metrics&&metrics.love,personality:metrics&&metrics.personality,money:metrics&&metrics.money,future:metrics&&metrics.future};
  pair.aiRelationship={signals:metrics&&metrics.q&&metrics.q.sig||null,dayRelation:metrics&&metrics.q&&metrics.q.dayRel||null,theme_reading:d.aiReading||null};
  if(typeof guiinOpenResultConsultation==='function'){
   var old=null,had=false;
   try{had=typeof matchMeta!=='undefined';if(had){old=matchMeta;matchMeta=pair}}
   catch(_e){}
   try{guiinOpenResultConsultation('compatibility',AI_THEME_Q[k])}
   finally{if(had){try{matchMeta=old}catch(_e){}}}
   return true;
  }
  if(typeof go==='function'){go('ask');return true}
 }catch(e){LOG.push({theme:k,reason:'ai-bridge:'+(e&&e.message)})}
 return false;
}
function openThemeAI(){return handoffThemeAI(state.theme,state.data)}

function run(){
 var el=$('theme'),k=state.theme,T=THEMES[k];if(!el||!T)return;
 var msg=el.querySelector('[data-gtmsg]'),res=el.querySelector('[data-gtres]');msg.textContent='';
 var A=readPerson(el,'a',T.pair?'내':'');if(A.err){msg.textContent=A.err.replace(/^ /,'');return}
 var B=null;if(T.pair){B=readPerson(el,'b',k==='crush'?'좋아하는 사람':k==='reunion'?'헤어진 사람':'상대');if(B.err){msg.textContent=B.err;return}}
 var x={};(T.extra||[]).forEach(function(e){x[e.k]=segV(el,'gtx_'+e.k)});
 x.kw=Array.prototype.map.call(el.querySelectorAll('[data-kw] button.on'),function(b){return b.getAttribute('data-v')}).slice(0,3);
 try{
  if(!window.GuiinSaju||typeof GuiinSaju.calculate!=='function')throw new Error('engine');
  var a=GuiinSaju.calculate(A.inp),out,ev,metrics=null,b=null;
  if(!a||!a.pillars||!a.pillars.day)throw new Error('calc');
  if(k==='shinsal'){out=buildShinsal(a);ev=out.evidence||[]}
  else{
   b=GuiinSaju.calculate(B.inp);if(!b||!b.pillars||!b.pillars.day)throw new Error('calc');
   if(!window.GuiinCompat)throw new Error('compat');
   var f=facts(a,b,{theme:k,bFallback:'상대'});
   if(k==='compat'){try{if(typeof guiinCompatMetricsV56==='function')metrics=guiinCompatMetricsV56(a,b)}catch(_e){metrics=null}out=buildCompat(f,metrics)}
   else if(k==='breakup')out=buildBreakup(f,x);
   else if(k==='crush')out=buildCrush(f,x);
   else out=buildReunion(f,x);
   ev=evidenceRows(f);
  }
  if(T.pair&&x.kw&&x.kw.length&&out&&out.cards){out.cards=out.cards.concat([{t:'고민 키워드로 본 포인트',b:x.kw.map(function(v){return KW_NOTE[v]}).filter(Boolean)}])}
  out=clean(out,k);
  state.data={a:a,b:b,A:A.inp,B:B&&B.inp,metrics:metrics,x:x,aiReading:T.pair?aiThemeSnapshot(k,out,ev,x,f):null};
  var html='<div class="gtSum"><small>핵심 요약</small><h3>'+esc(out.head)+'</h3>'+out.sum.map(function(s){return '<p>'+esc(s)+'</p>'}).join('')+'</div>';
  if(metrics&&isFinite(metrics.score)){html+='<div class="gtD"><div class="in" style="padding-top:14px">'+[['연애·끌림',metrics.love],['성격·대화',metrics.personality],['돈·생활',metrics.money],['장기조율',metrics.future]].filter(function(r){return isFinite(r[1])}).map(function(r){return '<p style="margin:0 0 6px;display:flex;justify-content:space-between"><span>'+r[0]+'</span><b>'+r[1]+'</b></p>'}).join('')+'<p class="gtNote" style="margin:4px 0 0">기존 궁합 화면과 같은 계산값이야.</p></div></div>'}
  html+=out.cards.map(function(c,i){return cardHTML(c,i,i===0)}).join('');
  html+=evidenceHTML(ev);
  if(T.pair)html+='<div class="gtNext"><button type="button" class="main" data-gtai>AI 상담으로 이어서 묻기 ›</button></div><p class="gtNote">방금 본 '+esc(T.title)+' 계산값과 풀이를 AI 상담에 이어서 참고해.</p>';
  if(NEXT[k])html+='<div class="gtNext"><button type="button" class="main" data-gtnext>'+esc(NEXT[k][0])+' ›</button></div><p class="gtNote">'+esc(NEXT[k][1])+'</p>';
  html+='<p class="gtNote">사주 풀이는 참고 정보야. 사람의 실제 마음이나 특정 날짜의 일을 정해 주지 않아.</p>';
  res.innerHTML=html;
  try{res.scrollIntoView({behavior:'smooth',block:'start'})}catch(_e){}
 }catch(e){
  LOG.push({theme:k,reason:'run:'+(e&&e.message)});
  res.innerHTML='<div class="gtErr">풀이를 만들지 못했어. 생년월일과 시간을 다시 확인한 뒤 한 번 더 눌러 줘.</div>';
 }
}
function setv(id,v){var e=$(id);if(e)e.value=v==null?'':v}
function setSeg(id,v){var s=$(id);if(!s)return;s.querySelectorAll('button').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-v')===v)})}
function next(){
 var k=state.theme,d=state.data;if(!d)return;
 if(k==='compat'){
  [['a',d.A],['b',d.B]].forEach(function(r){var p=r[0],i=r[1];setv(p+'Name',i.name);setv(p+'Year',i.year);setv(p+'Month',i.month);setv(p+'Day',i.day);setv(p+'Hour',i.hourUnknown?'':i.hour);setv(p+'Min',i.hourUnknown?'':i.minute);setSeg(p+'Gender',i.gender)});
  if(typeof submitMatch==='function')submitMatch();else go('match');
  return;
 }
 if(k==='shinsal'){
  var same=false;try{var c=(typeof chart!=='undefined')&&chart;same=!!(c&&c.input&&c.input.year===d.A.year&&c.input.month===d.A.month&&c.input.day===d.A.day&&(c.input.gender||'여')===(d.A.gender||'여')&&!!c.input.hourUnknown===!!d.A.hourUnknown&&(d.A.hourUnknown||(+c.input.hour===+d.A.hour&&+(c.input.minute||0)===+(d.A.minute||0))))}catch(_e){}
  if(same&&typeof openResultTab==='function'){openResultTab('stars');return}
  setv('name',d.A.name==='나'?'':d.A.name);setv('year',d.A.year);setv('month',d.A.month);setv('day',d.A.day);setv('hour',d.A.hourUnknown?'':d.A.hour);setv('minute',d.A.hourUnknown?'':d.A.minute);setSeg('genderSeg',d.A.gender);setSeg('calendarSeg','양력');
  var hu=$('hourUnknown');if(hu){hu.checked=!!d.A.hourUnknown;if(typeof syncHourUnknownUI==='function'){try{syncHourUnknownUI()}catch(_e){}}else{['hour','minute'].forEach(function(id){var x=$(id);if(x)x.disabled=hu.checked})}}
  go('saju');
 }
}
function onClick(e){
 var t=e.target;
 var kb=t.closest('[data-kw] button');if(kb){var grp=kb.parentNode,on=kb.classList.contains('on'),n=grp.querySelectorAll('button.on').length,hint=grp.parentNode.parentNode.querySelector('[data-kwmsg]');if(!on&&n>=3){if(hint)hint.textContent='키워드는 최대 3개까지 고를 수 있어요.';return}if(hint)hint.textContent='';kb.classList.toggle('on');return}
 var seg=t.closest('.gtSeg button');if(seg){seg.parentNode.querySelectorAll('button').forEach(function(b){b.classList.toggle('on',b===seg)});return}
 if(t.closest('[data-gtback]')){if(state.theme)render(null);else go('home');window.scrollTo(0,0);return}
 var g=t.closest('[data-gt]');if(g){render(g.getAttribute('data-gt'));window.scrollTo(0,0);return}
 if(t.closest('[data-gtrun]')){run();return}
 if(t.closest('[data-gtai]')){openThemeAI();return}
 if(t.closest('[data-gtnext]')){next();return}
}
function homeArt(){
 /* 홈 '오늘의 운세' 카드의 캐릭터를 투명 펭귄으로 바꿔. 실패하면 기존 그림으로 되돌려. */
 var w=$('gHomeV2');if(!w)return;var im=w.querySelector('.hv2Hero .art img');if(!im||im.getAttribute('data-gt-art'))return;
 var fb=im.getAttribute('src');im.setAttribute('data-gt-art','1');
 im.onerror=function(){im.onerror=null;im.setAttribute('src',fb)};
 im.setAttribute('width','512');im.setAttribute('height','512');im.setAttribute('src',THEME_ASSETS.homePenguin);
}
function mountHome(){
 homeArt();
 if($('gThemeHome'))return;
 var w=$('gHomeV2');
 var sec=homeSection();
 if(w){var duo=w.querySelector('.hv2Duo')||w.querySelector('.hv2Mini');if(duo)w.insertBefore(sec,duo);else w.appendChild(sec)}
 else{var h=$('home');if(!h)return;var pb=h.querySelector(':scope>.profilebar');if(pb&&pb.nextSibling)h.insertBefore(sec,pb.nextSibling.nextSibling||null);else h.appendChild(sec)}
}
function hookStars(){
 /* 홈의 '내 사주에 숨겨진 특별한 별' 카드 → 신살·귀인 테마 화면 */
 document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('#gHomeV2 [data-hv2="stars"]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();open('shinsal')},true);
}
function boot(){
 try{
  var st=document.createElement('style');st.id='gThemeV1Css';st.textContent=CSS;document.head.appendChild(st);
  screen();mountHome();hookStars();
  var tries=0,iv=setInterval(function(){tries++;if($('gHomeV2')&&!$('gHomeV2').querySelector('#gThemeHome')){var o=$('gThemeHome');if(o)o.remove();mountHome()}if(tries>20)clearInterval(iv)},250);
  if(location.hash==='#theme')open(null);
  window.GUIIN_THEME_V1.open=open;
  window.GUIIN_THEME_V1._test={facts:facts,buildCompat:buildCompat,buildBreakup:buildBreakup,buildCrush:buildCrush,buildReunion:buildReunion,buildShinsal:buildShinsal,richPairContext:richPairContext,evidenceRows:evidenceRows,evidenceCandidatesV25:evidenceCandidatesV25,priorityHeadV25:priorityHeadV25,aiThemeSnapshot:aiThemeSnapshot,handoffThemeAI:handoffThemeAI,clean:clean};
 }catch(e){LOG.push({reason:'boot:'+(e&&e.message)});try{var s=$('gThemeHome');if(s)s.remove()}catch(_){}}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
