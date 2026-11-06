/* 귀인사주 테마운 보강 v1 (이별 · 재회 · 짝사랑 · 궁합 · 신살)
 * - guiin-theme-voice-v1.js 의 결과 위에 한 번 더 얹는 층이다. 계산값은 읽기만 한다.
 * - 두 사람 테마: 맨 앞에 '사주 글자로 보면' 카드를 붙여 실제 일주·교차 십성·일지 관계·오행 글자 수·올해 세운을
 *   테마별 관점(왜 끌리는지 / 왜 지치는지 / 왜 다시 생각나는지 / 어떻게 다가가야 하는지)으로 풀어 준다.
 * - 신살 테마: 성립한 별을 기둥 자리 의미와 함께 하나씩 풀어 주는 카드를 붙이고, 존댓말 설명을 반말로 맞춘다.
 * - 공통: 본문 중간의 메타 안내 문장 제거, 닫히지 않은 따옴표 보정, 이름·십성 뒤 조사 보정.
 * - 끄려면 window.GUIIN_THEME_BOOST_OFF = true. 실패하면 원래 결과를 그대로 돌려준다.
 */
(function(root){
'use strict';
if(root.GUIIN_THEME_BOOST_OFF)return;
var V='theme-boost-v1-20261106';
var IMG={갑:'큰 나무',을:'덩굴꽃',병:'한낮의 해',정:'촛불',무:'큰 산',기:'논밭',경:'무쇠',신:'보석',임:'큰 바다',계:'빗물'};
var ELN={목:'나무',화:'불',토:'흙',금:'쇠',수:'물'};
var GODS=['비견','겁재','식신','상관','편재','정재','편관','정관','편인','정인'];

/* 상대가 나에게 어떤 십성인지 → 끌림 / 깨지는 지점 / 통하는 방식 */
var ROLE={
 비견:{who:'나랑 같은 편, 친구 같은 사람',pull:'말 안 해도 속도가 맞고, 같이 있으면 내 편이 하나 더 생긴 기분이 들어',risk:'둘 다 자기 방식이 있어서 누가 먼저 숙이느냐로 자존심 싸움이 붙어',key:'친구처럼 대등하게, "같이 하자"는 말로 다가가는 게 먹혀. 위에서 챙기거나 밑에서 맞추면 오히려 멀어져'},
 겁재:{who:'나랑 닮았는데 은근히 경쟁하게 되는 사람',pull:'나를 자극하고 승부욕을 깨워서, 옆에 있으면 심장이 빨리 뛰어',risk:'양보가 손해처럼 느껴져서 사소한 결정에서도 기싸움이 길어져',key:'밀당보다 정면으로 가. 솔직하게 원하는 걸 말하고, 이기려 들지 말고 같은 팀이라는 신호를 계속 줘'},
 식신:{who:'편하게 챙겨 주고 싶어지는 사람',pull:'같이 먹고 웃는 시간이 제일 자연스럽고, 내가 가장 나다워져',risk:'편한 게 당연해지면 설렘이 빠지고, 한쪽만 계속 챙기는 구조가 굳어져',key:'맛집, 산책, 같이 웃을 거리처럼 가볍고 즐거운 걸로 다가가. 무거운 얘기는 그다음이야'},
 상관:{who:'내 안의 말과 끼를 끌어내는 사람',pull:'이 사람 앞에서는 평소 안 하던 말과 표현이 튀어나와서 생기가 돌아',risk:'말이 세게 나가기 쉬워. 농담 한마디가 상처로 꽂히고, 그 말이 오래 남아',key:'재치 있고 가벼운 대화로 다가가. 대신 지적이나 평가처럼 들리는 말은 딱 끊어'},
 편재:{who:'자꾸 눈이 가고 갖고 싶어지는 사람',pull:'신선하고 자극적이라 자꾸 생각나고, 먼저 움직이고 싶어져',risk:'손에 들어오면 흥미가 식거나, 반대로 놓칠까 봐 조급해져서 무리하게 돼',key:'선물이나 이벤트보다 같이 새로운 걸 해 보자고 제안해. 대신 속도는 상대 반응 보면서 한 템포 늦춰'},
 정재:{who:'곁에 두고 아끼고 싶은, 생활이 그려지는 사람',pull:'같이 있으면 안정되고, 이 사람이랑 사는 그림이 자연스럽게 그려져',risk:'아끼는 만큼 관리하려 들어서, 상대는 챙김을 간섭으로 느낄 수 있어',key:'약속을 정확히 지키고 꾸준히 연락하는 걸로 믿음을 쌓아. 한 방보다 꾸준함이 먹히는 상대야'},
 편관:{who:'긴장되는데 끌리는, 나를 시험하는 사람',pull:'어렵고 긴장되는데 그래서 더 끌려. 이 사람한테 인정받고 싶어져',risk:'눈치를 보다가 내 할 말을 삼키게 되고, 그게 쌓여서 숨이 막혀',key:'잘 보이려고 맞추지 말고, 네 기준을 분명하게 보여 줘. 당당할 때 오히려 이 사람이 너를 다시 봐'},
 정관:{who:'믿음직하고 기대고 싶은, 기준이 되어 주는 사람',pull:'이 사람 말이면 믿어지고, 옆에 있으면 내가 바르게 서는 느낌이 들어',risk:'기대치가 높아서 실망도 크고, "이래야 한다"는 틀이 서로를 답답하게 해',key:'예의 있고 진지하게 다가가. 가볍게 떠보는 방식은 안 먹혀. 말한 걸 지키는 모습이 제일 큰 무기야'},
 편인:{who:'말 안 해도 나를 이해해 줄 것 같은, 묘하게 깊이 엮이는 사람',pull:'대화가 깊어지고, 남한테 안 한 얘기까지 꺼내게 돼',risk:'속을 다 안다고 믿다가, 서로 말을 안 해서 오해가 쌓여',key:'깊은 대화로 다가가. 취향, 생각, 고민 같은 얘기에서 마음이 열리는 상대야. 대신 혼자 있는 시간은 건드리지 마'},
 정인:{who:'나를 품어 주고 쉬게 해 주는 사람',pull:'옆에 있으면 쉬는 느낌이 들고, 기대도 괜찮다는 안심이 생겨',risk:'기대는 게 익숙해지면 한쪽만 받는 관계가 되고, 받는 쪽은 미안함을, 주는 쪽은 서운함을 쌓아',key:'고민을 털어놓거나 조언을 구하는 식으로 다가가. 이 사람은 도와줄 때 마음이 열려'}
};
/* 일지(배우자 자리)끼리의 관계 */
var REL={
 육합:'둘 일지가 육합이야. 생활 리듬이 저절로 맞물려서, 같이 있으면 설명 안 해도 편한 조합이야.',
 합:'둘 일지가 합으로 묶여 있어. 생활 리듬이 저절로 맞물려서, 같이 있으면 설명 안 해도 편한 조합이야.',
 삼합:'둘 일지가 삼합 계열로 이어져 있어. 같은 목표가 생기면 둘이 한 팀처럼 움직여.',
 반합:'둘 일지가 반합으로 이어져 있어. 같은 목표가 생기면 둘이 한 팀처럼 움직여.',
 충:'둘 일지가 충이야. 배우자 자리끼리 정면으로 부딪혀서, 끌림도 세고 싸움도 세. 조용히 넘어가는 날이 별로 없어.',
 형:'둘 일지가 형이야. 같은 문제로 서로를 고치려 들다가 상처를 주고받기 쉬운 자리야.',
 파:'둘 일지가 파야. 큰 사건보다 생활 속 작은 금이 쌓여서 깨지는 구조야. 사소한 데서 깨져.',
 해:'둘 일지가 해야. 겉으론 괜찮은데 속으로 서운함이 조용히 쌓이는 자리야.',
 원진:'둘 일지가 원진이야. 이유 없이 미운 순간이 있고, 좋다가도 갑자기 짜증이 확 올라오는 조합이야.'
};
/* 올해 세운이 각자에게 무슨 십성인지 */
var YEAR={
 비견:'내 주관과 자존심이 세지는 해',겁재:'밀어붙이고 경쟁하는 힘이 커지는 해',식신:'여유가 생기고 표현이 부드러워지는 해',상관:'할 말이 튀어나오고 틀을 깨고 싶어지는 해',
 편재:'새 사람과 새 기회에 눈이 가는 해',정재:'생활과 현실을 꼼꼼히 챙기게 되는 해',편관:'압박과 책임이 몰려서 예민해지는 해',정관:'관계를 정식으로 정리하고 싶어지는 해',
 편인:'생각이 깊어지고 혼자 정리하고 싶어지는 해',정인:'기대고 싶고 위로가 필요해지는 해'
};
var MOOD={비견:'자존심을 세운 채로',겁재:'지기 싫은 마음으로',식신:'한결 여유로운 마음으로',상관:'할 말은 하겠다는 마음으로',편재:'새로운 걸 원하는 마음으로',정재:'현실을 따지는 마음으로',편관:'예민하고 지친 채로',정관:'확실히 정리하고 싶은 마음으로',편인:'혼자 생각을 굳힌 채로',정인:'기대고 싶은 마음으로'};
/* 기둥 자리 의미(신살용) */
var POS={year:'년주',month:'월주',day:'일주',hour:'시주'};
var POSM={
 year:'년주는 집안, 윗사람, 어릴 때 환경 자리야. 그래서 이 별은 가족이나 선배, 오래된 인연을 통해 드러나기 쉬워.',
 month:'월주는 일터와 사회생활 자리야. 그래서 이 별은 회사, 학교, 동료 사이에서 제일 티가 나.',
 day:'일주는 나 자신과 배우자 자리야. 그래서 이 별은 네 성격 그 자체이고, 가까운 연인 관계에서 제일 세게 나와.',
 hour:'시주는 결과, 후배, 앞으로 만들어 갈 것의 자리야. 그래서 이 별은 나이 들수록, 네가 뭔가를 만들어 낼 때 힘을 써.'
};

function jong(w){w=String(w||'');var c=w.charCodeAt(w.length-1)-44032;return c>=0&&c<=11171&&c%28!==0}
function rieul(w){w=String(w||'');var c=w.charCodeAt(w.length-1)-44032;return c>=0&&c<=11171&&c%28===8}
function J(w,pair){var p=pair.split('/'),has=jong(w);if(pair==='으로/로')return w+(has&&!rieul(w)?'으로':'로');return w+(has?p[0]:p[1])}
function YA(w){return w+(jong(w)?'이야':'야')}
function GO(w){return w+(jong(w)?'이고':'고')}
function nameCall(n){return n+(jong(n)?'아':'야')}
function esc(s){return String(s==null?'':s)}

function counts(ch){
 var out={목:0,화:0,토:0,금:0,수:0},p=ch&&ch.pillars||{},keys=['year','month','day','hour'];
 var unk=ch&&ch.input&&ch.input.hourUnknown;
 keys.forEach(function(k){if(k==='hour'&&unk)return;var x=p[k];if(!x)return;if(out[x.stemEl]!=null)out[x.stemEl]++;if(out[x.branchEl]!=null)out[x.branchEl]++});
 return out;
}
function countLine(c){
 var arr=Object.keys(c).map(function(k){return [k,c[k]]}).sort(function(a,b){return b[1]-a[1]});
 var top=arr[0],zero=arr.filter(function(x){return x[1]===0}).map(function(x){return x[0]});
 return {top:top[0],topN:top[1],zero:zero,low:arr[arr.length-1][0],txt:arr.filter(function(x){return x[1]>0}).map(function(x){return x[0]+' '+x[1]+'자'}).join(' · ')};
}
function dayKo(ch){return ch&&ch.pillars&&ch.pillars.day&&ch.pillars.day.ko||''}
function stem(ch){return ch&&ch.pillars&&ch.pillars.day&&ch.pillars.day.stem||''}

/* ---------- 두 사람 테마: 사주 글자 카드 ---------- */
function pairCard(k,f,a,b){
 if(!f||!a||!b||!f.tg)return null;
 var nA=f.nA||'나',nB=f.nB||'상대',ra=ROLE[f.tg.aSeesB],rb=ROLE[f.tg.bSeesA];
 if(!ra||!rb)return null;
 var sa=stem(a),sb=stem(b),ca=countLine(counts(a)),cb=countLine(counts(b)),ps=[];
 ps.push(nA+'는 '+dayKo(a)+' 일주, '+nB+'는 '+dayKo(b)+' 일주야. '+(IMG[sa]||sa)+'랑 '+(IMG[sb]||sb)+'가 만난 거지.');
 ps[0]=J(nA,'은/는')+' '+dayKo(a)+' 일주, '+J(nB,'은/는')+' '+dayKo(b)+' 일주야. '+J(IMG[sa]||sa,'과/와')+' '+J(IMG[sb]||sb,'이/가')+' 만난 거지.';
 var tgLine=nA+'한테 '+J(nB,'은/는')+' '+YA(f.tg.aSeesB)+'. '+ra.who+'. '+nB+'한테 '+J(nA,'은/는')+' '+GO(f.tg.bSeesA)+'. '+rb.who+'.';
 if(k==='crush'){
  ps.push(tgLine+' 그래서 네가 끌리는 이유는 딱 이거야. '+ra.pull+'.');
  ps.push(nB+' 쪽에서 보면 너는 '+f.tg.bSeesA+' 자리에 들어와. 그러니까 다가가는 방법도 정해져 있어. '+rb.key+'.');
 }else if(k==='breakup'){
  ps.push(tgLine+' 그래서 지금 못 놓는 이유는 이거야. '+ra.pull+'.');
  ps.push('근데 지치는 이유도 같은 자리에서 나와. '+ra.risk+'. '+nB+' 쪽에서도 마찬가지야. '+rb.risk+'.');
 }else if(k==='reunion'){
  ps.push(tgLine+' 헤어지고도 자꾸 생각나는 이유가 여기 있어. '+ra.pull+'.');
  ps.push('그때 무너진 지점도 같은 자리야. '+ra.risk+'. 다시 연락한다면 방식부터 달라야 해. '+rb.key+'.');
 }else{
  ps.push(tgLine);
  ps.push(nA+' 쪽에서 끌리는 건 이거야. '+ra.pull+'. '+nB+' 쪽은 이거고. '+rb.pull+'. 대신 부딪히는 곳도 정확히 알아 둬. '+ra.risk+'.');
 }
 var rel=REL[f.dayRel];
 if(rel)ps.push(rel);
 else ps.push('둘 일지 사이엔 합도 충도 없어. 크게 끌어당기지도, 크게 부딪히지도 않아서 관계 온도는 둘이 만드는 만큼 가.');
 var fillA=cb.zero.length===0||ca.zero.some(function(e){return counts(b)[e]>0});
 var elLine=J(nA,'은/는')+' '+ca.txt+(ca.zero.length?', '+J(ca.zero.join('·'),'은/는')+' 0자':'')+'야. '+J(nB,'은/는')+' '+cb.txt+(cb.zero.length?', '+J(cb.zero.join('·'),'은/는')+' 0자':'')+'고.';
 var miss=ca.zero.filter(function(e){return counts(b)[e]>0});
 if(miss.length)elLine+=' '+nA+'한테 없는 '+miss.map(function(e){return e+'('+ELN[e]+')'}).join('·')+' 기운을 '+J(nB,'이/가')+' 갖고 있어. 그래서 '+nB+' 옆에 있으면 빈칸이 채워지는 느낌이 드는 거야.';
 else if(ca.top===cb.top)elLine+=' 둘 다 '+ca.top+'('+ELN[ca.top]+') 기운이 제일 많아. 잘 통하는 대신 같은 쪽으로 같이 치우쳐서, 브레이크 걸어 줄 사람이 없어.';
 else elLine+=' '+nA+'는 '+ca.top+', '+nB+'는 '+cb.top+' 쪽으로 힘이 몰려 있어서, 같은 일을 해도 접근하는 방식이 처음부터 달라.';
 elLine=elLine.replace(new RegExp(nA+'는 ','g'),J(nA,'은/는')+' ').replace(new RegExp(nB+'는 ','g'),J(nB,'은/는')+' ');
 ps.push(elLine);
 var tA=f.tA||{},tB=f.tB||{};
 if(tA.yearKo&&YEAR[tA.yearGod]&&YEAR[tB.yearGod]){
  var y='올해 '+tA.yearKo+'년은 '+nA+'한테 '+tA.yearGod+', 그러니까 '+YEAR[tA.yearGod]+'야. '+nB+'한테는 '+tB.yearGod+', '+YEAR[tB.yearGod]+'고.';
  if(k==='reunion')y+=' 그래서 올해 다시 말이 오간다면, '+nA+'는 '+(MOOD[tA.yearGod]||'')+', '+nB+'는 '+(MOOD[tB.yearGod]||'')+' 대화에 들어와. 이 온도 차를 알고 시작해.';
  else if(k==='crush')y+=' 다가갈 타이밍을 고른다면, '+nB+'의 올해 흐름에 맞춰서 '+(/(편재|식신|상관)/.test(tB.yearGod)?'가볍고 새로운 제안으로 열어 봐.':/(정인|편인)/.test(tB.yearGod)?'고민을 들어 주거나 털어놓는 대화로 열어 봐.':/(정관|정재)/.test(tB.yearGod)?'진지하고 분명한 태도로 열어 봐.':'부담 없는 거리에서 꾸준히 신호를 줘 봐.');
  else if(k==='breakup')y+=' 결론을 내리기 전에, 지금 서운한 게 이 사람 때문인지 올해 내 흐름 때문인지 한 번만 나눠 봐.';
  else y+=' 올해 서로 예민해지는 지점이 다르니까, 상대가 왜 저러는지 모를 땐 이 문장을 떠올려.';
  ps.push(y.replace(new RegExp(nA+'는 ','g'),J(nA,'은/는')+' ').replace(new RegExp(nB+'는 ','g'),J(nB,'은/는')+' '));
 }
 var T={crush:'사주 글자로 보는 너와 그 사람',breakup:'사주 글자로 보는 지금 이 관계',reunion:'사주 글자로 보는 다시 생각나는 이유',compat:'사주 글자로 보면 이 조합이야'}[k]||'사주 글자로 보면';
 return {t:T,b:ps,_boost:1};
}

/* ---------- 신살 테마 ---------- */
function banmal(s){
 return String(s||'')
  .replace(/읽습니다/g,'읽어').replace(/참고합니다/g,'참고하면 돼').replace(/사용하지 않습니다/g,'쓰지 않아').replace(/않습니다/g,'않아').replace(/아니에요/g,'아니야').replace(/입니다/g,'이야').replace(/합니다/g,'해').replace(/됩니다/g,'돼').replace(/있습니다/g,'있어').replace(/습니다/g,'어')
  .replace(/있어요/g,'있어').replace(/없어요/g,'없어').replace(/돼요/g,'돼').replace(/해요/g,'해').replace(/이에요/g,'이야').replace(/예요/g,'야')
  .replace(/보세요/g,'봐').replace(/하세요/g,'해').replace(/주세요/g,'줘').replace(/세요/g,'셔').replace(/워요/g,'워').replace(/져요/g,'져').replace(/나요/g,'나').replace(/와요/g,'와').replace(/줘요/g,'줘').replace(/어요/g,'어').replace(/아요/g,'아');
}
function starCards(a){
 var hits=a&&a.stars&&a.stars.hits||[];if(!hits.length)return null;
 var by={},order=[];
 hits.forEach(function(h){if(!h||!h.name)return;if(!by[h.name]){by[h.name]={name:h.name,pillars:[],meta:h.meta||{}};order.push(h.name)}if(h.pillar&&by[h.name].pillars.indexOf(h.pillar)<0)by[h.name].pillars.push(h.pillar)});
 var rank=function(n){var m=by[n].meta||{};return /귀인|천의|건록|덕/.test(n)?0:m.tone==='good'?1:2};
 order.sort(function(x,y){return rank(x)-rank(y)});
 var ps=[];
 order.slice(0,8).forEach(function(n){
  var s=by[n],m=s.meta,where=s.pillars.map(function(p){return POS[p]||p}).join('·');
  var sh=String(m.short||'').replace(/을 상징$/,'의 상징').replace(/를 상징$/,'의 상징');
  var line=n+(where?' · '+where:'')+'. '+(sh?J(n,'은/는')+' '+YA(sh)+'. ':'');
  var p0=s.pillars[0];
  if(p0&&POSM[p0])line+=POSM[p0]+' ';
  if(m.good)line+=banmal(m.good)+' ';
  if(m.watch)line+='다만 '+banmal(m.watch).replace(/^다만\s*/,'');
  ps.push(line.replace(/\s+/g,' ').trim());
 });
 if(order.length>8)ps.push('나머지 '+(order.length-8)+'개 별('+order.slice(8).join(', ')+')은 평생사주 신살 탭에서 같이 볼 수 있어.');
 return {t:'별 하나씩, 어느 자리에 떴는지까지',b:ps,_boost:1};
}

/* ---------- 공통 문장 정리 ---------- */
var META=[/참고값이고/,/지표는 아니야/,/명식에서 읽는 관계 성향이야/,/실제 속마음은 대화와 행동으로 확인/,/아래 내용은 실제 기대 차이를/];
function splitS(p){return String(p).match(/[^.!?]+[.!?]+["”’]?\s*|[^.!?]+$/g)||[p]}
function fixQuote(p){var o=(p.match(/“/g)||[]).length,c=(p.match(/”/g)||[]).length;return o>c?p.replace(/\s*$/,'')+'”':p}
function fixJosa(p,names){
 var toks=GODS.concat(names||[]).filter(Boolean).map(function(t){return t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')});
 if(!toks.length)return p;
 var re=new RegExp('(^|[^가-힣])('+toks.join('|')+')(이|가|을|를|과|와|으로|로)(?=[\\s,.!?·)]|$)','g');
 return p.replace(re,function(all,pre,w,j){
  var pair={이:'이/가',가:'이/가',을:'을/를',를:'을/를',과:'과/와',와:'과/와',으로:'으로/로',로:'으로/로'}[j];
  return pre+J(w,pair);
 });
}
function tidy(arr,names){
 return (arr||[]).map(function(p){
  var ss=splitS(p).filter(function(s){return !META.some(function(r){return r.test(s)})});
  var t=ss.join('').trim();
  return fixJosa(fixQuote(t),names);
 }).filter(function(p){return p&&p.length>1});
}

function boost(k,out,f,a,b){
 if(!out||!out.cards)return out;
 var names=f?[f.nA,f.nB]:[a&&a.input&&a.input.name];
 out.cards=out.cards.map(function(c){var c2=Object.assign({},c);if(c2.b)c2.b=tidy(c2.b,names);if(c2.list)c2.list=tidy(c2.list,names);return c2}).filter(function(c){return (c.b&&c.b.length)||(c.list&&c.list.length)||c.chips||c.stars});
 if(out.sum)out.sum=tidy(out.sum,names);
 if(out.head)out.head=fixJosa(out.head,names);
 if(k==='shinsal'){
  out.cards=out.cards.map(function(c){var c2=Object.assign({},c);if(c2.b)c2.b=c2.b.map(banmal);if(c2.list)c2.list=c2.list.map(banmal);return c2});
  var sc=starCards(a);
  if(sc){var at=Math.min(2,out.cards.length);out.cards.splice(at,0,sc)}
 }else{
  var pc=pairCard(k,f,a,b);
  if(pc)out.cards.unshift(pc);
 }
 return out;
}

function install(){
 var TV=root.GuiinThemeVoice;
 if(!TV||typeof TV.apply!=='function'||TV.__boosted)return false;
 var orig=TV.apply;
 TV.apply=function(k,out,f,a,b,x){
  var r=orig.apply(this,arguments)||out;
  try{return boost(k,r,f,a,b,x)||r}catch(e){try{(root.GUIIN_THEME_BOOST_LOG=root.GUIIN_THEME_BOOST_LOG||[]).push(String(e&&e.message))}catch(_){}return r}
 };
 TV.__boosted=V;
 return true;
}
if(!install()){var n=0,t=setInterval(function(){if(install()||++n>40)clearInterval(t)},150)}
root.GuiinThemeBoost={version:V,_pairCard:pairCard,_starCards:starCards,_tidy:tidy};
})(typeof globalThis!=='undefined'?globalThis:this);
