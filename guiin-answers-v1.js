/* 귀인사주 "그래서 결론" 해설 v1 (2026-11-07)
 * "그래서 뭐?"가 남지 않도록, 사람들이 실제로 묻는 여섯 가지에 결론부터 답한다.
 *   1) 내 성격의 장점과 단점  2) 무슨 일이 맞는지  3) 돈은 언제 붙는지
 *   4) 연애운은 언제 들어오는지  5) 어떤 사람이 나랑 맞는지  6) 우울감·가라앉음은 어디서 오는지
 * 이미 계산된 명식(GuiinSaju.calculate 결과)만 읽고, 해마다의 간지는 연도 공식과 엔진의 tenGod·월주 계산으로 구한다.
 * 쓰는 곳: 프리미엄 전체 풀이(GuiinExpert.fullSections 앞에 붙음), 무료 '한눈에 보는 나'의 결론 미리보기 한 줄.
 * 끄려면 window.GUIIN_ANSWERS_OFF = true
 */
(function(root){
'use strict';
if(root.GUIIN_ANSWERS_OFF)return;
var V='answers-v1-20261107';
function S(){return root.GuiinSaju}
var STEMS='갑을병정무기경신임계'.split(''),BRS='자축인묘진사오미신유술해'.split('');
var ANI={자:'쥐',축:'소',인:'호랑이',묘:'토끼',진:'용',사:'뱀',오:'말',미:'양',신:'원숭이',유:'닭',술:'개',해:'돼지'};
var SEL={갑:'목',을:'목',병:'화',정:'화',무:'토',기:'토',경:'금',신:'금',임:'수',계:'수'};
var BEL={자:'수',축:'토',인:'목',묘:'목',진:'토',사:'화',오:'화',미:'토',신:'금',유:'금',술:'토',해:'수'};
var BMAIN={자:'계',축:'기',인:'갑',묘:'을',진:'무',사:'병',오:'정',미:'기',신:'경',유:'신',술:'무',해:'임'};
var GRP={비견:'비겁',겁재:'비겁',식신:'식상',상관:'식상',편재:'재성',정재:'재성',편관:'관성',정관:'관성',편인:'인성',정인:'인성'};
var ELN={목:'나무',화:'불',토:'흙',금:'쇠',수:'물'};
var IMG={갑:'큰 나무',을:'덩굴꽃',병:'한낮의 해',정:'촛불',무:'큰 산',기:'논밭',경:'무쇠',신:'보석',임:'큰 바다',계:'빗물'};
var LIUHE={자:'축',축:'자',인:'해',해:'인',묘:'술',술:'묘',진:'유',유:'진',사:'신',신:'사',오:'미',미:'오'};
var CHONG={자:'오',오:'자',축:'미',미:'축',인:'신',신:'인',묘:'유',유:'묘',진:'술',술:'진',사:'해',해:'사'};
var SANHE={신:['자','진'],자:['신','진'],진:['신','자'],해:['묘','미'],묘:['해','미'],미:['해','묘'],인:['오','술'],오:['인','술'],술:['인','오'],사:['유','축'],유:['사','축'],축:['사','유']};
var STEMHE={갑:'기',기:'갑',을:'경',경:'을',병:'신',신:'병',정:'임',임:'정',무:'계',계:'무'};
var TAOHUA={인:'묘',오:'묘',술:'묘',신:'유',자:'유',진:'유',사:'오',유:'오',축:'오',해:'자',묘:'자',미:'자'};

function jong(w){w=String(w||'');var c=w.charCodeAt(w.length-1)-44032;return c>=0&&c<=11171&&c%28!==0}
function J(w,a,b){w=String(w);var k=w.replace(/\([^)]*\)$/,'');return w+(jong(k)?a:b)}
function tg(day,st){var a=STEMS.indexOf(day),b=STEMS.indexOf(st);if(a<0||b<0)return '';try{return S().tenGod(a,b)}catch(_e){return ''}}
function yearPillar(y){var s=STEMS[((y-4)%10+10)%10],b=BRS[((y-4)%12+12)%12];return {stem:s,branch:b,ko:s+b}}
function nowYear(){try{return new Date().getFullYear()}catch(_e){return 2026}}

/* 십성 그룹 비율: 천간(일간 제외) 1점, 지지 지장간 가중치 */
function census(c){
 var d=c.pillars.day.stem,cnt={비겁:0,식상:0,재성:0,관성:0,인성:0},gods={},tot=0;
 ['year','month','day','hour'].forEach(function(k){
  var p=c.pillars[k];if(!p)return;if(k==='hour'&&c.input&&c.input.hourUnknown)return;
  if(k!=='day'){var g=tg(d,p.stem);if(GRP[g]){cnt[GRP[g]]+=1;tot+=1;gods[g]=(gods[g]||0)+1}}
  (p.hidden||[]).forEach(function(h){var g2=h.god||tg(d,h.stem),w=+h.weight||0;if(GRP[g2]){cnt[GRP[g2]]+=w;tot+=w;gods[g2]=(gods[g2]||0)+w}});
 });
 var pct={};Object.keys(cnt).forEach(function(k){pct[k]=tot?Math.round(cnt[k]/tot*100):0});
 var ord=Object.keys(pct).sort(function(a,b){return pct[b]-pct[a]});
 return {pct:pct,ord:ord,top:ord[0],second:ord[1],low:ord[4],gods:gods};
}
function elCount(c){
 var o={목:0,화:0,토:0,금:0,수:0};
 ['year','month','day','hour'].forEach(function(k){var p=c.pillars[k];if(!p)return;if(k==='hour'&&c.input&&c.input.hourUnknown)return;o[SEL[p.stem]]++;o[BEL[p.branch]]++});
 return o;
}
function starSet(c){var o={};((c.stars&&c.stars.hits)||[]).forEach(function(h){if(h&&h.name)o[h.name]=1});return o}
function luckAt(c,y){
 var by=c.input&&c.input.year,age=y-by+1;var L=(c.luck||[]).find(function(l){return age>=l.fromAge&&age<=l.toAge});return L||null;
}
function strengthTier(c){var s=c.engine2&&c.engine2.strength;var sc=s&&(s.score!=null?s.score:s.total);if(sc==null)return '중';return sc>=60?'강':sc<=42?'약':'중'}

/* ---------- 1. 성격: 장점·단점 ---------- */
var STEMP={
 갑:{g:'방향을 먼저 잡는 힘. 다들 "어떡하지?" 할 때 "이렇게 하자"를 먼저 말하는 사람이 너야.',b:'한번 정한 방향을 잘 안 꺾어. 틀린 걸 알아도 "조금만 더"를 붙들다가 손해를 키우기도 해.'},
 을:{g:'끊어질 것 같은 관계도 이어 붙이는 유연함. 부딪히지 않고 돌아가서 결국 원하는 걸 얻어.',b:'다 맞춰 주다가 정작 네 마음은 말을 안 해. 그러다 혼자 서운함이 쌓여서 어느 날 조용히 멀어져.'},
 병:{g:'자리를 데우는 밝음. 네가 웃으면 분위기가 풀리고, 처음 보는 사람도 너한테는 금방 마음을 열어.',b:'기분이 얼굴에 다 써 있어. 그리고 분위기 띄우느라 에너지를 다 쓰고, 혼자 남으면 확 꺼져.'},
 정:{g:'사람의 작은 변화를 알아보는 섬세함. 남들이 못 보는 표정 하나, 말끝 하나를 너는 다 읽어.',b:'남 기분은 다 챙기면서 네 기분은 맨 뒤로 미뤄. 그게 쌓이면 이유 없이 지치고 예민해져.'},
 무:{g:'흔들리지 않는 무게감. 위기일수록 사람들이 너부터 찾고, 네가 "괜찮아" 하면 진짜 괜찮아져.',b:'괜찮은 척이 습관이야. 힘든 걸 말 안 해서 주변은 네가 무너지기 직전까지 몰라.'},
 기:{g:'빈 곳을 채우는 실속. 말보다 손이 먼저 가고, 네가 맡은 일은 구멍이 안 나.',b:'걱정을 미리 다 해. 일어나지도 않은 일 때문에 잠 못 자고, 남의 일까지 떠안아.'},
 경:{g:'끊고 정리하는 결단력. 질질 끄는 걸 못 참아서, 네가 있으면 일이 끝이 나.',b:'말이 칼이야. 맞는 말을 너무 세게 해서, 이겨도 사람을 잃는 장면이 생겨.'},
 신:{g:'완성도를 끌어올리는 안목. 디테일 하나 차이를 알아보고, 네 손을 거치면 결과물이 반짝여.',b:'기준이 높아서 칭찬이 짜. 남한테도 그렇지만, 너 자신한테 제일 가혹해.'},
 임:{g:'큰 그림을 보는 시야. 여러 사람 사정과 흐름을 한 번에 읽어서 판을 넓게 봐.',b:'생각이 너무 넓게 퍼져서 정작 결정은 미뤄. 이것저것 다 가능해 보여서 하나를 못 골라.'},
 계:{g:'분위기와 사람 마음을 먼저 알아채는 감각. 말 안 해도 상대가 뭘 원하는지 알아.',b:'눈치로 다 알면서 모른 척해. 그러다 혼자 감정을 삼키고, 밤에 생각이 많아져.'}
};
var GRPP={
 비겁:{g:'자기 기준이 확실하고 쉽게 안 휘둘려. 남들 다 흔들릴 때 끝까지 버티는 뚝심이 있어.',b:'고집이 세서 도움을 간섭으로 들어. 혼자 다 하다가 혼자 지치는 패턴이 반복돼.'},
 식상:{g:'표현력과 아이디어가 넘쳐. 말 한마디, 글 한 줄로 사람 마음을 움직여.',b:'할 말을 못 참아. 맞는 말을 틀린 타이밍에 해서 다 된 일에 재를 뿌리기도 해.'},
 재성:{g:'현실 감각이 빨라. 뭐가 남고 뭐가 손해인지 남보다 먼저 계산이 끝나.',b:'손해 안 보려다 사람을 잃어. 계산이 빠른 만큼 정 떨어지는 속도도 빨라.'},
 관성:{g:'책임과 약속을 지켜. 맡기면 끝까지 해내서 어딜 가든 믿을 사람이 돼.',b:'"잘해야 해"가 "다 내 탓이야"로 바뀌는 순간이 많아. 남 실수까지 떠안고 혼자 밤새워.'},
 인성:{g:'이해력과 깊이가 있어. 한번 파고들면 남들이 못 가는 데까지 가.',b:'생각만 하다 타이밍을 놓쳐. 준비가 끝나면 한다는데, 그 준비가 잘 안 끝나.'}
};
var DAYG={
 비겁:'배우자 자리(일지)에 비겁이 있어서, 가까운 사이일수록 대등함을 원하고 기싸움에서 안 져.',
 식상:'배우자 자리(일지)에 식상이 있어서, 친한 사람 앞에선 말이 많아지고 장난기가 확 올라와.',
 재성:'배우자 자리(일지)에 재성이 있어서, 가까운 사람을 챙기고 관리하려는 마음이 커.',
 관성:'배우자 자리(일지)에 관성이 있어서, 가까운 사이에서도 예의와 선을 지키고 책임감이 앞서.',
 인성:'배우자 자리(일지)에 인성이 있어서, 가까운 사람에게 기대고 이해받고 싶은 마음이 커.'
};
function secPersona(c,C){
 var st=c.pillars.day.stem,sp=STEMP[st],gp=GRPP[C.top],gp2=GRPP[C.second],dg=GRP[tg(st,BMAIN[c.pillars.day.branch])];
 var nm=c.input.name||'너';
 var ans='장점은 '+sp.g.split('.')[0]+', 단점은 '+sp.b.split('.')[0]+'.';
 var ps=[];
 ps.push('결론부터 말할게. '+ans);
 ps.push('장점 첫째, '+sp.g+' '+st+SEL[st]+' 일간, 그러니까 '+IMG[st]+'로 태어난 사람의 기본값이야.');
 ps.push('장점 둘째, '+gp.g+' 원국에서 '+J(C.top,'이','가')+' 제일 커서 그래.'+(gp2&&C.pct[C.second]>=15?' 거기에 '+J(C.second,'이','가')+' 받쳐 줘서, '+gp2.g.split('.')[0]+'는 면도 같이 있어.':''));
 ps.push('이제 단점. 첫째, '+sp.b);
 ps.push('둘째, '+gp.b+' 장점이랑 같은 자리에서 나오는 거라, 고치려고 하기보다 "과해지는 순간"만 알아채면 돼.');
 if(DAYG[dg])ps.push('그리고 하나 더. '+DAYG[dg]+' 밖에서 보는 '+nm+'랑 가까운 사람이 보는 '+nm+'가 다르게 느껴지는 이유가 이거야.');
 return {id:'ans-persona',title:'그래서 내 성격, 장점과 단점은?',answer:ans,paragraphs:ps,evidence:'일간 '+st+SEL[st]+' · 가장 큰 힘 '+C.top+' · 일지 '+(dg||'')};
}

/* ---------- 2. 일 ---------- */
function secWork(c,C,stars,tier){
 var GC=root.GuiinCareer;if(!GC)return null;
 var L=luckAt(c,nowYear());
 var ps=GC.build({top:C.top,second:C.second,low:C.low,pct:C.pct,stem:c.pillars.day.stem,tier:tier,stars:Object.keys(stars),luckGod:L&&L.god,seed:(c.pillars.day.stemIndex||0)*12+(c.pillars.day.branchIndex||0)+7,name:c.input.name})||[];
 if(!ps.length)return null;
 var short=GC.short({top:C.top,seed:(c.pillars.day.stemIndex||0)*12+(c.pillars.day.branchIndex||0)+7});
 return {id:'ans-work',title:'그래서 무슨 일이 잘 맞는데?',answer:'제일 잘 맞는 건 '+short+' 쪽이야.',paragraphs:['결론부터 말하면 '+short+' 쪽이야. 이유를 하나씩 풀어 줄게.'].concat(ps),evidence:'가장 큰 힘 '+C.top+' · 두 번째 '+C.second+' · 가장 얇은 힘 '+C.low};
}

/* ---------- 3. 돈 시기 ---------- */
function yearScoreMoney(c,C,y,tier){
 var d=c.pillars.day.stem,yp=yearPillar(y),gs=tg(d,yp.stem),gb=tg(d,BMAIN[yp.branch]),s=0,why=[];
 [[gs,'천간'],[gb,'지지']].forEach(function(x){var g=GRP[x[0]];
  if(g==='재성'){s+=x[0]==='정재'?3:2.6;why.push(x[0])}
  else if(g==='식상'){s+=C.pct.재성>=10?1.4:0.8;why.push(x[0])}
  else if(x[0]==='겁재'){s-=1.6;why.push('겁재')}
  else if(x[0]==='비견'&&C.pct.재성<15){s-=0.6}
 });
 var L=luckAt(c,y);if(L&&GRP[L.god]==='재성')s+=1.2;if(L&&GRP[L.god]==='식상')s+=0.6;
 var hasJae=GRP[gs]==='재성'||GRP[gb]==='재성';
 if(hasJae&&tier==='약')s-=0.8;
 var rel=c.pillars.day.branch&&LIUHE[c.pillars.day.branch]===yp.branch;if(rel)s+=0.5;
 return {y:y,yp:yp,s:s,gs:gs,gb:gb,luck:L,why:why,weak:hasJae&&tier==='약',rob:gs==='겁재'||gb==='겁재'};
}
var MONEYWHY={정재:'꾸준히 쌓이는 돈',편재:'크게 한 번 들어오는 돈, 부수입, 기회성 수입',식신:'잘하는 걸 반복해서 버는 돈',상관:'아이디어와 말재주로 버는 돈'};
function secMoney(c,C,tier){
 var y0=nowYear(),arr=[];for(var y=y0;y<y0+10;y++)arr.push(yearScoreMoney(c,C,y,tier));
 var best=arr.slice().sort(function(a,b){return b.s-a.s}).slice(0,3).sort(function(a,b){return a.y-b.y});
 var bad=arr.filter(function(x){return x.rob}).slice(0,2);
 var top=arr.slice().sort(function(a,b){return b.s-a.s})[0];
 var ans='돈이 제일 크게 붙는 해는 '+top.y+'년('+top.yp.ko+'), 그다음은 '+best.filter(function(x){return x.y!==top.y}).map(function(x){return x.y+'년'}).join('·')+'이야.';
 var ps=['결론부터. '+ans+' 앞으로 10년의 해마다 들어오는 글자를 네 일간에 대 보고, 돈의 별(재성)과 돈을 만드는 별(식상)이 들어오는 해, 대운이 받쳐 주는 해를 골랐어.'];
 best.forEach(function(x){
  var kinds=x.why.filter(function(g){return MONEYWHY[g]}).map(function(g){return MONEYWHY[g]});
  var line=x.y+'년('+x.yp.ko+'년)은 네 일간 기준으로 천간이 '+x.gs+', 지지가 '+J(x.gb,'이야','야')+'. ';
  line+=kinds.length?'그래서 이 해 돈의 모양은 '+kinds.filter(function(v,i,a){return a.indexOf(v)===i}).join(', ')+'에 가까워. ':'';
  if(x.luck&&GRP[x.luck.god]==='재성')line+='게다가 이때 대운('+x.luck.ko+')도 재성이라 10년짜리 바람이 같은 방향으로 불어. ';
  if(x.weak)line+='다만 네 원국은 힘이 약한 편이라, 돈이 들어와도 지키는 게 더 어려워. 들어오는 순간 절반은 묶어 두는 규칙을 먼저 정해. ';
  else line+='이 해엔 연봉 협상, 이직, 부업 시작, 가격 올리기처럼 수입 구조를 바꾸는 결정을 미루지 마. ';
  ps.push(line.trim());
 });
 if(bad.length)ps.push('반대로 '+bad.map(function(x){return x.y+'년('+x.yp.ko+')'}).join(', ')+'은 겁재가 들어오는 해야. 경쟁과 지출, 남한테 빌려주는 돈이 커지기 쉬워서, 이 해엔 동업, 보증, 큰 투자는 한 번 더 미뤄.');
 /* 올해·내년 월 */
 var months=[];try{var d=c.pillars.day.stem;[y0,y0+1].forEach(function(yy){for(var m=1;m<=12;m++){if(yy===y0&&m<(new Date().getMonth()+1))continue;var cp=S().calendarPillars(yy,m,15,12,0,{});var mp=cp&&cp.month;if(!mp)continue;var g=tg(d,mp.stem),g2=tg(d,BMAIN[mp.branch]);var sc=(GRP[g]==='재성'?2:GRP[g]==='식상'?0.8:0)+(GRP[g2]==='재성'?2:GRP[g2]==='식상'?0.8:0);if(sc>=2)months.push({y:yy,m:m,s:sc,ko:mp.ko})}});}catch(_e){}
 months.sort(function(a,b){return b.s-a.s||a.y-b.y||a.m-b.m});
 if(months.length){var mm=months.slice(0,3).sort(function(a,b){return a.y-b.y||a.m-b.m});ps.push('가까운 달로 좁히면 '+mm.map(function(x){return x.y+'년 '+x.m+'월('+x.ko+'월)'}).join(', ')+'에 돈의 별이 들어와. 이 달엔 견적을 내고, 제안을 하고, 미뤄 둔 정산을 받아 내.')}
 var pc=C.pct.재성;
 ps.push(pc<=8?'참고로 네 원국엔 재성이 얇아. 돈 욕심이 없는 게 아니라, 돈을 "쫓는" 방식이 안 맞는 거야. 잘하는 걸 키우면 돈이 따라오는 순서로 가.':pc>=30?'네 원국엔 재성이 두꺼워. 돈 감각은 타고났는데, 그만큼 돈 때문에 마음이 흔들리기도 쉬워. 수입보다 "지키는 규칙"이 먼저야.':'네 원국의 재성은 중간 정도야. 들어오는 해에 크게 벌고, 나머지 해엔 지키는 리듬으로 가면 돼.');
 return {id:'ans-money',title:'그래서 돈은 언제 버는데?',answer:ans,paragraphs:ps,evidence:'앞으로 10년 세운 대조 · 재성·식상·겁재'};
}

/* ---------- 4. 연애 시기 ---------- */
function secLove(c,C){
 var d=c.pillars.day.stem,db=c.pillars.day.branch,yb=c.pillars.year.branch,g=(c.input&&c.input.gender)||'';
 var want=g==='남'?['재성']:g==='여'?['관성']:['재성','관성'];
 var th=[TAOHUA[db],TAOHUA[yb]].filter(Boolean);
 var y0=nowYear(),arr=[];
 for(var y=y0;y<y0+10;y++){
  var yp=yearPillar(y),gs=tg(d,yp.stem),gb=tg(d,BMAIN[yp.branch]),s=0,why=[];
  if(want.indexOf(GRP[gs])>=0){s+=gs==='정관'||gs==='정재'?2.6:2.2;why.push(gs+'(인연의 별)')}
  if(want.indexOf(GRP[gb])>=0){s+=1.6;if(why.indexOf(gb)<0)why.push(gb)}
  if(LIUHE[db]===yp.branch){s+=2.2;why.push('일지 육합')}
  if((SANHE[db]||[]).indexOf(yp.branch)>=0){s+=1;why.push('일지 삼합')}
  if(th.indexOf(yp.branch)>=0){s+=1.6;why.push('도화')}
  if(STEMHE[d]===yp.stem){s+=1.4;why.push('일간 합')}
  var ch=CHONG[db]===yp.branch;if(ch){s+=0.6;why.push('일지 충')}
  arr.push({y:y,yp:yp,s:s,why:why,ch:ch});
 }
 var best=arr.slice().sort(function(a,b){return b.s-a.s}).slice(0,3).sort(function(a,b){return a.y-b.y});
 var top=arr.slice().sort(function(a,b){return b.s-a.s})[0];
 var ans='연애운이 제일 세게 들어오는 해는 '+top.y+'년('+top.yp.ko+'), 그다음은 '+best.filter(function(x){return x.y!==top.y}).map(function(x){return x.y+'년'}).join('·')+'이야.';
 var ps=['결론부터. '+ans];
 ps.push('어떻게 골랐는지 말해 줄게. 전통 명리에서는 '+(g==='남'?'남자에게 재성':g==='여'?'여자에게 관성':'재성과 관성')+'을 인연의 별로 봐. 여기에 배우자 자리(일지 '+db+')와 합이 되는 해, 사람을 끌어당기는 도화가 뜨는 해, 네 일간과 천간합이 되는 해를 같이 겹쳐서 점수를 매겼어.');
 var LT={'일지 육합':'배우자 자리와 그해 글자가 육합으로 묶여. 자연스럽게 가까워지고, 관계가 "정식"이 되기 쉬운 흐름이야','일지 삼합':'배우자 자리와 삼합으로 이어져서, 모임이나 소개처럼 사람을 통해 인연이 이어지기 쉬워','도화':'도화가 떠서 네 매력이 평소보다 잘 보여. 연락 오는 사람이 늘고, 새로운 만남의 장이 열려','일지 충':'배우자 자리가 흔들리는 해야. 새 사람이 들어오거나, 지금 관계가 크게 바뀌는 계기가 생겨','일간 합':'네 일간과 그해 천간이 합을 해서, 마음이 확 끌리는 사람이 나타나기 쉬워'};
 var said=0;
 best.forEach(function(x){
  var line=x.y+'년('+x.yp.ko+'년)에는 '+J(x.why.join(', '),'이','가')+' 겹쳐. ';
  x.why.forEach(function(w){if(LT[w])line+=LT[w]+'. '});
  if(!said&&x.why.some(function(w){return /인연의 별/.test(w)})&&(said=1))line+=(g==='여'?'관성':'재성')+'은 상대가 "들어오는" 신호라서, 솔로라면 소개나 모임을 거절하지 말고, 연애 중이라면 다음 단계를 이야기하기 좋은 해야. ';
  ps.push(line.trim());
 });
 var chs=arr.filter(function(x){return x.ch&&best.every(function(b){return b.y!==x.y})}).slice(0,1);
 if(chs.length)ps.push(chs[0].y+'년('+chs[0].yp.ko+')은 배우자 자리가 충을 맞는 해야. 이별이나 이사처럼 관계의 모양이 바뀌기 쉬우니, 이 해엔 감정적으로 결론 내리지 말고 한 달만 시간을 두고 정해.');
 var dg=GRP[tg(d,BMAIN[db])];
 ps.push({비겁:'네 일지에는 비겁이 앉아 있어서, 친구처럼 시작한 관계가 오래 가. 소개팅보다 동호회, 스터디, 운동 모임에서 만난 인연을 눈여겨봐.',식상:'네 일지에는 식상이 앉아 있어서, 말이 잘 통하고 같이 웃는 사람에게 빠져. 대화가 재미없으면 조건이 좋아도 오래 못 가.',재성:'네 일지에는 재성이 앉아 있어서, 생활이 그려지는 사람에게 마음이 가. 같이 장 보고 밥 먹는 장면이 편한 사람이 네 사람이야.',관성:'네 일지에는 관성이 앉아 있어서, 믿음직하고 약속을 지키는 사람에게 끌려. 가볍게 시작하는 관계보다 천천히 신뢰가 쌓이는 관계가 맞아.',인성:'네 일지에는 인성이 앉아 있어서, 나를 이해해 주고 기다려 주는 사람에게 마음을 열어. 급하게 다가오는 사람은 오히려 부담스러워.'}[dg]||'');
 return {id:'ans-love',title:'그래서 내 연애운은 언제 들어오는데?',answer:ans,paragraphs:ps.filter(Boolean),evidence:'일지 '+db+' · 도화 기준 '+th.join('·')+' · 앞으로 10년 세운 대조'};
}

/* ---------- 5. 맞는 사람 ---------- */
var ELTYPE={
 목:'계획을 세우고 앞으로 나아가게 해 주는 사람. 같이 있으면 "해 보자"는 힘이 생기는 타입',
 화:'밝고 표현이 풍부해서 너를 웃게 하는 사람. 분위기를 데워 주고 감정을 숨기지 않는 타입',
 토:'묵직하고 한결같아서 기댈 수 있는 사람. 약속을 지키고 쉽게 흔들리지 않는 타입',
 금:'결단력 있고 정리를 잘하는 사람. 애매한 걸 딱 끊어 주고 기준을 세워 주는 타입',
 수:'차분하고 생각이 깊은 사람. 네 얘기를 끝까지 들어 주고 마음을 식혀 주는 타입'
};
function secMatch(c,C){
 var d=c.pillars.day.stem,db=c.pillars.day.branch,ec=elCount(c);
 var ord=Object.keys(ec).sort(function(a,b){return ec[a]-ec[b]}),need=ord[0],over=ord[4];
 var he=STEMHE[d],lh=LIUHE[db],sh=SANHE[db]||[],ch=CHONG[db];
 var ans=J(ELN[need]+'('+need+') 기운이 강한 사람','이','가')+'고, 띠로는 '+ANI[lh]+'띠, 일간으로는 '+he+SEL[he]+' 일간인 사람이 제일 잘 맞아.';
 var ps=['결론부터. 너랑 잘 맞는 건 '+ans];
 ps.push('첫째, 오행으로 보면 네 원국에 '+J(need,'이','가')+' '+ec[need]+'자로 제일 적어. 그래서 '+ELTYPE[need]+'한테 끌리고, 그 사람 옆에서 숨이 쉬어져. 반대로 '+J(over,'이','가')+' '+ec[over]+'자로 제일 많아서, 너처럼 '+over+' 기운이 센 사람끼리는 처음엔 잘 통해도 같이 과열되기 쉬워.');
 ps.push('둘째, 네 일간 '+J(d+SEL[d],'은','는')+' '+J(he+SEL[he],'과','와')+' 천간합을 해. 그래서 일간이 '+J(he,'인','인')+' 사람을 만나면 설명 안 되게 마음이 끌려. 사주를 볼 일이 있으면 상대 일간이 '+he+'인지 한번 봐.');
 ps.push('셋째, 배우자 자리(일지)가 '+db+'('+ANI[db]+')야. '+lh+'('+ANI[lh]+')랑 육합이라, '+ANI[lh]+'띠이거나 일지가 '+lh+'인 사람과는 생활 리듬이 저절로 맞물려. '+sh.map(function(b){return ANI[b]}).join('·')+'띠와는 삼합이라 같은 목표를 향해 한 팀처럼 움직이기 좋아.');
 ps.push('조심할 조합도 있어. '+ch+'('+ANI[ch]+')는 네 일지와 충이라, '+ANI[ch]+'띠나 일지가 '+ch+'인 사람과는 끌림도 세고 싸움도 세. 나쁜 인연이란 뜻은 아니고, 둘 다 한 발씩 물러나는 규칙이 꼭 필요한 조합이야.');
 ps.push('띠나 일간은 참고 신호일 뿐이야. 결국 제일 중요한 건 첫째에서 말한 것, 네가 부족한 '+need+' 기운을 채워 주는 사람이냐는 거야. 만나 보면 "이 사람 옆에선 내가 편하다"는 느낌으로 알게 돼.');
 return {id:'ans-match',title:'그래서 어떤 사람이 나랑 잘 맞는데?',answer:ans,paragraphs:ps,evidence:'오행 최소 '+need+' '+ec[need]+'자 · 일간 '+d+'-'+he+' 합 · 일지 '+db+'-'+lh+' 육합 · '+db+'-'+ch+' 충'};
}

/* ---------- 6. 우울감·가라앉음 ---------- */
function secMood(c,C,stars){
 var ec=elCount(c),mb=c.pillars.month.branch,winter='해자축'.indexOf(mb)>=0,sig=[];
 if(C.pct.인성>=35)sig.push({w:C.pct.인성,t:'생각이 너무 많은 구조',d:'인성이 크게 자리 잡고 있어. 인성은 생각하고 이해하는 힘인데, 이게 넘치면 같은 생각을 계속 되감아. 이미 지난 대화, 하지 못한 말, 일어나지도 않은 일을 밤새 돌려 보다가 기분이 가라앉아.',f:'생각이 세 번 같은 자리를 돌면 그때 멈추고 종이에 적어. 머리에서 꺼내면 무게가 반으로 줄어.'});
 if(C.pct.식상<=8)sig.push({w:30-C.pct.식상,t:'감정의 출구가 좁은 구조',d:'식상이 얇아. 식상은 느낀 걸 밖으로 꺼내는 힘이라, 이게 얇으면 서운함, 화, 슬픔을 말로 못 빼고 안에 쌓아. 겉으론 괜찮은데 속은 꽉 찬 상태가 오래 가.',f:'하루 한 줄이라도 감정을 밖으로 꺼내. 일기, 노래, 운동, 믿는 사람 한 명한테 보내는 메시지, 뭐든 좋아.'});
 if((ec.수>=3&&ec.화<=2)||ec.화===0||(winter&&ec.화<=1))sig.push({w:(ec.수*8)+(ec.화===0?20:0)+(winter?8:0),t:'몸과 마음이 차가워지기 쉬운 구조',d:(ec.수>=3?'물(수) 기운이 '+ec.수+'자로 많고 ':'')+'불(화) 기운이 '+ec.화+'자'+(winter?'인데 겨울('+mb+'월)에 태어났어':'야')+'. 명리에서는 이걸 조후, 즉 사주의 온도로 봐. 온도가 낮은 사주는 해가 짧아지는 계절, 혼자 있는 밤, 비 오는 날에 기분이 같이 가라앉기 쉬워.',f:'햇볕을 일부러 챙겨. 아침 산책 20분, 따뜻한 음식, 밝은 조명, 사람 많은 곳에 한 번 나가는 것만으로도 차이가 커.'});
 if(C.pct.관성>=35)sig.push({w:C.pct.관성,t:'스스로를 몰아붙이는 구조',d:'관성이 크게 자리 잡고 있어. 관성은 나를 다스리는 힘이라 책임감이 되지만, 넘치면 "이것밖에 못 했어"라고 스스로를 평가하는 목소리가 돼. 우울감이 슬픔보다 자책의 모양으로 와.',f:'오늘 한 일을 세 개만 적어. 못 한 것 말고, 한 것. 그리고 "이 정도면 됐다"를 소리 내서 한 번 말해.'});
 if(C.pct.비겁>=40&&C.pct.재성<=10)sig.push({w:C.pct.비겁,t:'혼자 다 떠안는 구조',d:'비겁이 크고 재성이 얇아. 자존심이 세서 힘든 걸 티 안 내고 혼자 버텨. 그러다 아무한테도 기대지 못한 채 고립감이 오는 게 네 가라앉음의 모양이야.',f:'"나 요즘 좀 힘들어" 한 문장을 한 사람한테만 해 봐. 해결은 바라지 말고, 말한 것 자체로 충분해.'});
 if(ec.화>=4)sig.push({w:ec.화*7,t:'확 타고 확 꺼지는 구조',d:'불(화) 기운이 '+ec.화+'자로 많아. 신날 땐 누구보다 뜨거운데, 에너지를 한 번에 다 써서 그 뒤에 급격히 꺼져. 번아웃 뒤에 오는 무기력이 네 우울감의 정체일 가능성이 커.',f:'신나는 날일수록 일정 하나를 비워 둬. 100을 다 쓰지 말고 70에서 멈추는 연습이 제일 좋은 약이야.'});
 if(stars['귀문관살'])sig.push({w:28,t:'예민한 감각의 별',d:'귀문관살이 있어. 감각이 예민해서 남이 못 느끼는 분위기까지 다 느끼는 별인데, 그만큼 피곤하고 밤에 생각이 많아져서 잠이 얕아지기 쉬워.',f:'밤에 떠오른 생각으로는 결론을 내리지 마. 메모만 해 두고 아침에 다시 봐. 아침의 너가 훨씬 정확해.'});
 if(stars['원진살'])sig.push({w:22,t:'이유 없는 서운함의 별',d:'원진살이 있어. 가까운 사람에게 이유 없이 서운하고 미운 순간이 생기는 별이라, 관계에서 받은 작은 상처가 기분 전체를 끌어내려.',f:'서운함은 일주일 안에 한 문장으로 말해. 쌓아 두면 원진이 커져.'});
 var rel=(c.relations||[]).filter(function(r){return (r.type==='충'||r.type==='형')&&(r.aKey==='day'||r.bKey==='day')})[0];
 if(rel)sig.push({w:20,t:'가까운 자리가 흔들리는 구조',d:'원국 안에서 배우자 자리(일지)가 '+(rel.aLabel||'')+'·'+(rel.bLabel||'')+' 사이 '+rel.type+'을 맞아. 가장 편해야 할 자리가 흔들려서, 가까운 관계나 집안 일이 꼬이면 기분이 같이 무너져.',f:'관계 문제로 힘들 땐, 그 사람과 상관없는 나만의 일상 하나(운동, 취미, 루틴)를 꼭 지켜.'});
 if(C.pct.식상>=30)sig.push({w:C.pct.식상*0.6,t:'쏟아낸 뒤 공허해지는 구조',d:'식상이 크게 자리 잡고 있어. 감정이든 에너지든 밖으로 다 꺼내 쓰는 사람이라, 사람 만나고 말 많이 한 날 밤에 갑자기 텅 빈 느낌이 와. 남들은 네가 늘 밝다고 생각해서 이 공허함을 잘 몰라.',f:'사람 많이 만난 다음 날은 일부러 아무 약속도 잡지 마. 혼자 충전하는 시간도 일정이야.'});
 if(C.pct.재성>=30)sig.push({w:C.pct.재성*0.6,t:'현실 압박에 짓눌리는 구조',d:'재성이 크게 자리 잡고 있어. 돈, 일정, 해야 할 일처럼 현실을 챙기는 힘이 큰데, 이게 과하면 "이것도 해야 하고 저것도 해야 하는데"가 머릿속에 쌓여서 숨이 막혀.',f:'해야 할 일을 전부 적고, 이번 주에 꼭 할 것 세 개만 동그라미 쳐. 나머지는 다음 주의 너한테 넘겨.'});
 if(C.pct.비겁<=8)sig.push({w:18,t:'남 기준에 나를 맞추다 지치는 구조',d:'비겁이 얇아. 내 편, 내 기준을 세우는 힘이 약해서, 남의 기대에 맞추다가 정작 내가 뭘 원하는지 모르게 되는 순간 기분이 꺼져.',f:'오늘 하루 중 "내가 정하는 시간" 30분을 먼저 막아 둬. 그 시간엔 남 부탁을 안 받아.'});
 var ZERO={목:'시작할 힘이 안 나는 구조',토:'중심이 흔들리면 불안해지는 구조',금:'정리 못 하고 끌려다니는 구조',수:'쉬지 못하고 달리다 꺼지는 구조'},ZD={목:'나무(목) 기운이 0자야. 새로 시작하고 뻗어 나가는 힘이 비어 있어서, 계획이 멈추면 "나 뭐 하고 있지" 하는 무력감이 와.',토:'흙(토) 기운이 0자야. 버팀목이 되는 힘이 비어 있어서, 생활 리듬이나 기댈 사람이 흔들리면 불안이 확 커져.',금:'쇠(금) 기운이 0자야. 끊고 정리하는 힘이 비어 있어서, 싫은 부탁이나 끝난 관계를 못 끊고 끌려다니다 지쳐.',수:'물(수) 기운이 0자야. 식히고 쉬는 힘이 비어 있어서, 계속 달리다가 어느 순간 방전되듯 꺼져.'},ZF={목:'아주 작은 새 계획 하나를 정해. 동네 산책 코스 바꾸기 같은 것도 충분해.',토:'매일 같은 시간에 일어나고 먹는 것, 그 단순한 리듬이 네 버팀목이 돼.',금:'이번 주에 거절 하나만 해 봐. "이번엔 어려워" 한 문장이면 돼.',수:'하루 한 번은 아무것도 안 하는 10분을 만들어. 폰도 내려놓고.'};
 Object.keys(ZERO).forEach(function(e){if(ec[e]===0)sig.push({w:16,t:ZERO[e],d:ZD[e],f:ZF[e]})});
 sig.sort(function(a,b){return b.w-a.w});
 if(!sig.length)sig.push({w:1,t:'쌓아 두다 한 번에 오는 구조',d:'네 원국은 크게 한쪽으로 치우친 신호가 없어. 그래서 우울감도 큰 원인 하나보다, 피곤함, 관계 서운함, 일 압박이 조금씩 쌓이다가 한 번에 오는 모양이야.',f:'"요즘 왜 이렇게 지치지?" 싶을 때, 최근 2주 동안 잠, 밥, 사람 중 뭐가 무너졌는지부터 봐.'});
 var top=sig.slice(0,3);
 var ans='네 가라앉음은 주로 "'+top[0].t+'"에서 와'+(top[1]?'. 그다음은 "'+top[1].t+'"야.':'.');
 var ps=['결론부터. '+ans+' 네 탓이 아니라 타고난 구조가 그쪽으로 기울어 있는 거야. 원인을 알면 빠져나오는 길도 보여.'];
 top.forEach(function(x,i){ps.push((i+1)+'. '+x.t+'. '+x.d+' 이럴 땐 이렇게 해 봐. '+x.f)});
 ps.push('그리고 꼭 기억해. 사주는 기울기를 보여 줄 뿐이야. 가라앉은 기분이 2주 넘게 이어지거나 일상이 버거울 정도라면, 혼자 버티지 말고 가까운 사람이나 전문 상담을 꼭 찾아. 그게 제일 용기 있는 선택이야.');
 return {id:'ans-mood',title:'그래서 내 우울감은 어디서 오는 건데?',answer:ans,paragraphs:ps,evidence:'수 '+ec.수+'자 · 화 '+ec.화+'자 · 월지 '+mb};
}

function build(c){
 if(!c||!c.pillars||!c.pillars.day||!S())return [];
 var C=census(c),stars=starSet(c),tier=strengthTier(c),out=[];
 [function(){return secPersona(c,C)},function(){return secWork(c,C,stars,tier)},function(){return secMoney(c,C,tier)},function(){return secLove(c,C)},function(){return secMatch(c,C)},function(){return secMood(c,C,stars)}].forEach(function(f){try{var r=f();if(r){r.eyebrow='그래서 결론';r.lead=false;r.body=r.paragraphs.join('\n\n');r.ask=r.title.replace(/^그래서 /,'')+' 더 자세히 알려 줘';out.push(r)}}catch(e){(root.GUIIN_ANSWERS_LOG=root.GUIIN_ANSWERS_LOG||[]).push(String(e&&e.message))}});
 return out;
}
function teaser(c){
 try{var rows=build(c),pick=function(id){var r=rows.find(function(x){return x.id===id});return r&&r.answer};
  var m=pick('ans-money'),l=pick('ans-love'),w=pick('ans-work');
  var yy=function(s){var x=String(s||'').match(/(\d{4})년/);return x?x[1]+'년':''};
  return {money:yy(m),love:yy(l),work:w?String(w).replace(/^제일 잘 맞는 건 /,'').replace(/ 쪽이야\.$/,'').split(',')[0]:''};
 }catch(_e){return null}
}
/* 따로 섹션을 만들지 않고, 기존 풀이의 해당 섹션 안에 이어 붙인다 */
var TARGET={'ans-persona':['self','장점과 단점을 딱 정리하면 이래.'],'ans-mood':['inside','그럼 기분이 가라앉는 건 어디서 오냐면,'],'ans-match':['people','그래서 어떤 사람이 너랑 맞냐면,'],'ans-love':['love','그럼 연애운은 언제 들어오냐면,'],'ans-money':['money','그럼 돈은 언제 붙냐면,'],'ans-work':['work','']};
function mergeInto(base,add){
 var out=base.map(function(r){return Object.assign({},r)});
 add.forEach(function(a){
  var t=TARGET[a.id];if(!t)return;var row=out.find(function(r){return r.id===t[0]});if(!row)return;
  var ps=(a.paragraphs||[]).slice();
  if(a.id==='ans-work'){ /* 직업 상세는 이미 work 섹션에 있으니 결론 한 줄만 맨 앞에 */
   var lead=String(ps[0]||'').replace(/ 이유를 하나씩 풀어 줄게\.$/,'');
   if(lead)row.paragraphs=[lead].concat(row.paragraphs||[]);
  }else{
   if(ps[0]){var f0=String(ps[0]).replace(/^결론부터( 말할게)?\.\s*/,'');
    f0=f0.replace(/^돈이 제일 크게 붙는 해는/,'그럼 돈은 언제 붙냐면, 제일 크게 붙는 해는').replace(/^연애운이 제일 세게 들어오는 해는/,'그럼 연애운은 언제 들어오냐면, 제일 세게 들어오는 해는').replace(/^너랑 잘 맞는 건/,'그래서 너랑 잘 맞는 사람은 딱 이래.').replace(/^네 가라앉음은 주로/,'그럼 기분이 가라앉는 건 어디서 오냐면, 주로').replace(/^장점은/,'딱 정리하면, 장점은');
    ps[0]=f0;}
   row.paragraphs=(row.paragraphs||[]).concat(ps);
  }
  row.body=(row.paragraphs||[]).join('\n\n');
  if(a.evidence)row.evidence=[row.evidence,a.evidence].filter(Boolean).join(' · ');
 });
 return out;
}

function install(){
 var E=root.GuiinExpert;if(!E||typeof E.fullSections!=='function'||E.__answers)return false;
 var orig=E.fullSections;
 E.fullSections=function(c){var base=orig.apply(this,arguments)||[];try{if(!Array.isArray(base))return base;return mergeInto(base,build(c))}catch(_e){return base}};
 E.__answers=V;return true;
}
if(!install()){var n=0,t=setInterval(function(){if(install()||++n>60)clearInterval(t)},150)}
root.GuiinAnswers={version:V,build:build,teaser:teaser,_census:census};
})(typeof globalThis!=='undefined'?globalThis:this);
