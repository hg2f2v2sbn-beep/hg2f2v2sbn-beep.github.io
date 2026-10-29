/* 귀인사주 지나온 대운 읽기 v1 (2026-10-29)
 * 이미 지나간 대운(10년 단위)을 원국과 맞대어 "그 시기에 자주 들어왔을 주제"를 보여 준다.
 * 사건을 단정하지 않고, 기억과 맞춰 볼 수 있는 장면과 질문으로 쓴다.
 * 근거: 대운 천간·지지의 십성, 원국 십성 분포(많고 적음), 대운 지지와 원국 네 기둥의 합·충·형·파·해.
 * 사주 결과 '전체 풀이'의 "7. 지금 시기" 앞에 카드로 붙는다. 끄려면 window.GUIIN_PAST_DAEUN_OFF = true
 */
(function(root){
'use strict';
if(root.GuiinPastDaeun)return;

var GROUP={비견:'비겁',겁재:'비겁',식신:'식상',상관:'식상',편재:'재성',정재:'재성',편관:'관성',정관:'관성',편인:'인성',정인:'인성'};
var KEYS=['year','month','day','hour'];
var PLACE={year:'집안이나 바깥 환경',month:'학교나 일터',day:'가까운 관계',hour:'진로와 계획'};
var PLACE_SHORT={year:'집안',month:'학교나 일터',day:'가까운 관계',hour:'진로'};
function places(ks){return ks.length>1?ks.map(function(k){return PLACE_SHORT[k];}).join(', '):PLACE[ks[0]];}

/* 나이대별 무대 */
function stageOf(from,to){var m=(Number(from)+Number(to))/2;return m<17?'kid':m<28?'young':m<45?'mid':'late';}
var STAGES=['kid','young','mid','late'];
var STAGE_NAME={kid:'어린 시절~학창 시절',young:'20대 전후',mid:'30대 전후',late:'중년 이후'};

/* 십성 묶음별로 그 10년에 자주 들어오는 주제(나이대별 장면 2개) */
var THEME={
 비겁:{core:'내 편과 경쟁자가 같이 늘어나, 나만의 기준을 세워야 했던',
  kid:['친구 무리 안에서 내 자리를 찾거나, 형제·친구와 비교당하는 일이 많았을 거야','누가 시키지 않아도 “내 방식대로 하겠다”는 고집이 처음 또렷해진 시기야'],
  young:['친구·동료와 같이 움직이는 일이 많았고, 그만큼 비교와 경쟁도 자주 느꼈을 거야','독립하고 싶은 마음이 커져서 집이나 조직의 방식과 부딪혔을 가능성이 커'],
  mid:['동업·팀 안에서 내 몫을 지키는 문제가 자주 생겼을 거야','사람 때문에 돈이나 시간이 새는 일이 반복됐을 수 있어'],
  late:['곁에 남는 사람과 정리되는 사람이 분명해진 시기야','내 방식을 지키느냐, 함께 가느냐를 자주 고민했을 거야']},
 식상:{core:'하고 싶은 것과 하고 싶은 말이 밖으로 터져 나오던',
  kid:['말이 많아지거나 그림·글·운동처럼 뭔가를 표현하는 데 빠졌을 거야','어른이 정한 규칙에 “왜요?”라고 묻다가 혼난 기억이 있을 수 있어'],
  young:['진로나 전공을 틀고 싶다는 마음이 자주 올라왔을 거야','하고 싶은 말을 참지 않다가 관계나 조직에서 마찰을 겪었을 가능성이 커'],
  mid:['내 재능을 일이나 결과물로 꺼내 보려는 시도가 많았을 거야','틀에 맞춰 사는 게 답답해서 방향을 바꾸고 싶은 마음이 컸을 거야'],
  late:['배운 걸 남에게 전하거나 가르치는 일이 늘었을 거야','하고 싶은 말을 돌려 말하지 않게 된 시기야']},
 재성:{core:'돈과 현실 조건, 손에 잡히는 결과를 챙겨야 했던',
  kid:['집안의 돈 사정이나 현실적인 형편을 일찍 의식했을 수 있어','용돈·물건처럼 내 것을 관리하는 감각이 빨리 생겼을 거야'],
  young:['아르바이트·첫 수입처럼 돈을 직접 벌고 쓰는 경험이 많았을 거야','하고 싶은 것보다 현실적으로 되는 쪽을 고르는 선택을 자주 했을 거야'],
  mid:['수입 구조를 바꾸거나 돈 관리 방식을 새로 세우는 일이 많았을 거야','일의 결과가 숫자로 평가되는 상황이 잦았을 거야'],
  late:['자산을 지키고 정리하는 문제가 중심에 있었을 거야','실속 없는 관계를 정리하는 일이 생겼을 거야']},
 관성:{core:'규칙과 평가, 책임을 많이 짊어졌던',
  kid:['시험·성적·규칙처럼 평가받는 일이 유난히 무겁게 느껴졌을 거야','엄한 어른이나 선생님의 기대에 맞추느라 긴장했던 기억이 있을 수 있어'],
  young:['시험·취업·조직 적응처럼 “합격선을 넘어야 하는” 과제가 이어졌을 거야','윗사람이나 정해진 틀에 맞추느라 내 속도를 잃었다고 느꼈을 가능성이 커'],
  mid:['맡은 자리와 책임이 커지면서 평가 압박도 같이 커졌을 거야','조직 안에서 위치가 바뀌거나 역할이 무거워지는 일이 있었을 거야'],
  late:['책임을 내려놓을지 더 질지 고민하는 일이 많았을 거야','명예나 체면이 걸린 일이 중요해진 시기야']},
 인성:{core:'배우고 생각하고, 누군가에게 기대거나 보호받던',
  kid:['공부·책·한 가지 관심사에 깊이 빠졌을 수 있어','엄마나 보호자의 영향이 특히 컸던 시기야'],
  young:['공부·자격·학위처럼 준비하는 시간이 길었을 거야','생각이 많아져서 실행이 늦어진다고 느낀 적이 많았을 거야'],
  mid:['일을 바꾸기보다 전문성을 다시 공부하는 쪽으로 방향을 잡았을 거야','도와주는 사람 덕분에 버틴 시기가 있었을 거야'],
  late:['배운 것을 정리하고 내 기준으로 다시 세우는 시기야','혼자 생각하는 시간이 크게 늘었을 거야']}
};
/* 여성 원국에서 관성, 남성 원국에서 재성은 연애 상대 쪽 신호이기도 하다 */
var LOVE={관성:'연애에서도 상대에게 맞추거나, 나를 끌어 주는 사람에게 마음이 가는 일이 많았을 거야',재성:'연애에서 내가 챙기고 이끄는 쪽이 되는 일이 많았을 거야'};

/* 대운 지지와 원국 기둥 사이의 관계 → 그 영역에서 나타나는 모습 */
var REL={
 충:function(ks,st){var pl=ks[0];if(st==='kid'&&(pl==='day'||pl==='hour'))return '전학·이사·가족 변화처럼 생활 리듬이 크게 바뀌는 일이 있었을 수 있어';return pl==='year'?'이사·전학·집안 사정처럼 사는 환경이 크게 흔들렸을 수 있어':pl==='month'?'학교나 일터, 소속을 바꾸거나 진로를 크게 튼 일이 있었을 가능성이 커':pl==='day'?'가까운 관계에서 큰 변화가 있었거나, 내 생활 리듬 자체가 뒤집혔을 수 있어':'하려던 계획을 접고 다른 방향으로 틀었던 일이 있었을 거야';},
 육합:function(ks,st){var pl=ks[0];if(st==='kid'&&pl==='day')return '단짝처럼 깊게 붙어 다닌 친구가 있었을 가능성이 커';if(st==='kid'&&pl==='hour')return '꿈이나 하고 싶은 걸 같이 키워 준 사람이 있었을 수 있어';return pl==='year'?'집안이나 바깥 인연에 묶이는 일이 많았을 거야':pl==='month'?'한 소속·한 분야에 깊이 들어가 자리를 잡았을 가능성이 커':pl==='day'?'가까운 사람과 깊게 묶이는 인연이 생겼을 가능성이 커':'앞으로의 방향을 함께 정하는 사람이 생겼을 수 있어';},
 형:function(ks){return josa(places(ks),'에서/에서')+' 비슷한 문제가 모양만 바꿔 되풀이됐을 거야';},
 파:function(ks){if(ks.length===1&&ks[0]==='hour')return '하려던 일이 중간에 어긋나 처음부터 다시 짜야 했던 적이 있었을 거야';return josa(places(ks),'에서/에서')+' 잘 되던 일이 중간에 어긋나 다시 짜야 했던 적이 있었을 거야';},
 해:function(ks){return josa(places(ks),'에서/에서')+' 믿었던 사람에게 서운함이 쌓였던 일이 있었을 수 있어';},
 원진:function(ks){return josa(places(ks),'에서/에서')+' 이유 없이 마음이 안 맞는 사람 때문에 지쳤을 수 있어';}
};
var REL_ORDER=['충','육합','형','파','원진','해'];
var REL_WEIGHT={day:4,month:3,year:2,hour:1};

function G(){return root.GuiinSaju;}
function groupPct(c){
  var S=G(),ds=c.pillars.day.stemIndex,cnt={비겁:0,식상:0,재성:0,관성:0,인성:0},tot=0;
  KEYS.forEach(function(k){var p=c.pillars[k];if(!p)return;
    if(k!=='day'){var g=GROUP[S.tenGod(ds,p.stemIndex)];if(g){cnt[g]+=1;tot+=1;}}
    var h=(p.hidden&&p.hidden[0])||null;var hs=h?h.stemIndex:(S.HIDDEN_STEMS&&S.HIDDEN_STEMS[p.branchIndex]&&S.HIDDEN_STEMS[p.branchIndex][0]);
    if(hs!=null){var g2=GROUP[S.tenGod(ds,typeof hs==='object'?hs.stemIndex:hs)];if(g2){cnt[g2]+=1;tot+=1;}}
  });
  var out={};Object.keys(cnt).forEach(function(k){out[k]=tot?Math.round(cnt[k]/tot*100):0;});return out;
}
function branchGod(c,l){
  var S=G(),hs=S.HIDDEN_STEMS&&S.HIDDEN_STEMS[l.branchIndex];if(!hs||!hs.length)return null;
  var h=hs[0];var si=Array.isArray(h)?Number(h[0]):typeof h==='number'?h:(h&&h.stemIndex!=null?h.stemIndex:S.STEMS.indexOf(h&&h.stem||h));
  return si>=0?S.tenGod(c.pillars.day.stemIndex,si):null;
}
function relsWith(c,l){
  var S=G(),out=[];
  KEYS.forEach(function(k){var p=c.pillars[k];if(!p)return;
    var rs=[];try{rs=S.chartRelations([p,null,null,l])||[];}catch(_e){}
    rs.forEach(function(r){if(r.layer!=='지지')return;var t=r.type;if(REL_ORDER.indexOf(t)<0)return;out.push({type:t,place:k,a:p.branch,b:l.branch});});
  });
  out.sort(function(x,y){return (REL_ORDER.indexOf(x.type)-REL_ORDER.indexOf(y.type))||(REL_WEIGHT[y.place]-REL_WEIGHT[x.place]);});
  var by={},order=[];out.forEach(function(r){if(!by[r.type]){by[r.type]={type:r.type,places:[],pairs:[]};order.push(r.type);}if(by[r.type].places.indexOf(r.place)<0){by[r.type].places.push(r.place);by[r.type].pairs.push(r);}});
  return order.map(function(t){return by[t];});
}
function ageNow(c){var I=c.input||{};var bd=new Date(I.year,(I.month||1)-1,I.day||1,I.hour||0,I.minute||0);return (Date.now()-bd.getTime())/(365.2425*86400000);}
function yearSpan(c,l){var by=Number((c.input||{}).year)||0;if(!by)return '';
  var a=Math.floor(by+Number(l.fromAgeExact!=null?l.fromAgeExact:l.fromAge)),b=Math.floor(by+Number(l.toAgeExact!=null?l.toAgeExact:l.toAge));return a+'~'+b+'년쯤';}
function josa(w,pair){var ch=w.charCodeAt(w.length-1);var has=ch>=0xAC00&&ch<=0xD7A3&&(ch-0xAC00)%28!==0;var p=pair.split('/');return w+(has?p[0]:p[1]);}

function pick(used,cands){for(var i=0;i<cands.length;i++){if(cands[i]&&!used[cands[i]]){used[cands[i]]=1;return cands[i];}}return null;}
function readPeriod(c,l,pct,female,used){
  used=used||{};
  var nm=l.stem+l.branch,sg=l.god,sgG=GROUP[sg],bg=branchGod(c,l),bgG=GROUP[bg]||sgG,stage=stageOf(l.fromAge,l.toAge);
  var main=THEME[sgG]||THEME.인성,si=STAGES.indexOf(stage),near=[stage,STAGES[si+1],STAGES[si-1]].filter(Boolean);
  var c1=[],c2=[];near.forEach(function(st){c1.push(main[st][0],main[st][1]);if(bgG&&bgG!==sgG&&THEME[bgG])c2.push(THEME[bgG][st][1],THEME[bgG][st][0]);});
  var scenes=[pick(used,c1)];var s2=pick(used,c2.length?c2.concat(c1):c1);if(s2)scenes.push(s2);scenes=scenes.filter(Boolean);
  var love=(stage!=='kid'&&((female&&(sgG==='관성'||bgG==='관성'))||(!female&&(sgG==='재성'||bgG==='재성'))))?LOVE[female?'관성':'재성']:'';
  /* 원국과의 균형: 원래 얇은 힘이 들어왔는지, 이미 센 힘이 더 세졌는지 */
  var p=pct[sgG]||0,top=Object.keys(pct).sort(function(a,b){return pct[b]-pct[a];})[0],balance='';
  if(p<=10)balance='원국에 거의 없던 '+sgG+' 힘이 처음 크게 들어온 시기라, 익숙하지 않은 방식으로 부딪히며 배운 게 많았을 거야.';
  else if(sgG===top&&p>=30)balance='원래 가장 센 '+sgG+' 힘이 한 번 더 세진 시기라, 장점이 과해져서 지치거나 고집이 세졌다는 말을 들었을 수 있어.';
  var rels=relsWith(c,l).slice(0,2),relLines=rels.map(function(r){return REL[r.type](r.places,stage);});
  var evid=['대운 '+nm+'('+sg+(bg&&bg!==sg?'·지지 '+bg:'')+')'];rels.forEach(function(r){r.pairs.forEach(function(x){evid.push('대운 '+x.b+' ↔ 원국 '+({year:'년지',month:'월지',day:'일지',hour:'시지'})[x.place]+' '+x.a+' '+x.type);});});
  if(p<=10||(sgG===top&&p>=30))evid.push('원국 '+sgG+' '+p+'%');
  /* 기억과 맞춰 볼 질문: 가장 강한 신호 하나로 */
  var q;var repeatTheme=!!used['T:'+sgG];used['T:'+sgG]=1;if(repeatTheme)balance='';
  if(rels.length&&rels[0].type==='충'&&stage==='kid'&&/day|hour/.test(rels[0].places[0]))q=l.fromAge+'~'+l.toAge+'세 사이에 전학·이사·가족 변화처럼 생활이 크게 바뀐 적이 있었어?';
  else if(rels.length&&rels[0].type==='충')q=l.fromAge+'~'+l.toAge+'세 사이에 '+({year:'이사나 집안 사정',month:'학교·직장·진로',day:'가까운 관계나 생활 리듬',hour:'하려던 계획'})[rels[0].places[0]]+'이 크게 바뀐 적이 있었어?';
  else if(repeatTheme)q=l.fromAge+'~'+l.toAge+'세에는 앞 10년과 비슷한 고민이 이어졌어? 더 무거워졌는지, 오히려 익숙해졌는지 떠올려 봐.';
  else q=l.fromAge+'~'+l.toAge+'세를 떠올리면, '+main.core.replace(/던$/,'던 기억')+'이 먼저 떠올라?';
  return {ko:nm,god:sg,branchGod:bg,group:sgG,from:l.fromAge,to:l.toAge,span:yearSpan(c,l),stage:stage,
    title:l.fromAge+'~'+l.toAge+'세 · '+nm+' 대운 — '+(repeatTheme?'앞 10년의 주제가 한 번 더 이어진':main.core)+' 10년',
    scenes:scenes.slice(0,2),balance:balance,relations:[relLines[0],love,relLines[1]].filter(Boolean).slice(0,2),question:q,evidence:evid};
}

function read(c){
  if(!c||!c.pillars||!c.pillars.day||!Array.isArray(c.luck)||!G())return null;
  var now=ageNow(c),pct=groupPct(c),female=String((c.input||{}).gender||'')==='여';
  var past=c.luck.filter(function(l){var to=Number(l.toAgeExact!=null?l.toAgeExact:l.toAge);return to<=now;});
  var cur=c.luck.find(function(l){var f=Number(l.fromAgeExact!=null?l.fromAgeExact:l.fromAge),t=Number(l.toAgeExact!=null?l.toAgeExact:l.toAge);return f<=now&&now<t;})||null;
  if(!past.length)return {past:[],current:cur,age:now};
  var used={};return {past:past.slice(-3).map(function(l){return readPeriod(c,l,pct,female,used);}),current:cur,age:now,pct:pct};
}

/* ---------- 화면 ---------- */
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];});}
function cardHTML(R,name){
  var last=R.past.length-1;
  var rows=R.past.map(function(x,i){
    return '<div class="gpdItem'+(i===last?' recent':'')+'"><div class="gpdHead"><b>'+esc(x.title)+'</b><span>'+esc(x.span)+'</span></div>'
      +'<ul>'+x.scenes.concat(x.relations).map(function(s){return '<li>'+esc(s)+'.</li>';}).join('')+'</ul>'
      +(x.balance?'<p class="gpdBal">'+esc(x.balance)+'</p>':'')
      +'<p class="gpdQ">기억과 맞춰 보기 · '+esc(x.question)+'</p>'
      +'<details class="gpdEv"><summary>명리 근거 보기</summary><p>'+esc(x.evidence.join(' · '))+'</p></details></div>';
  }).join('');
  var curLine=R.current?'<p class="gpdNow">그리고 지금은 '+esc(R.current.fromAge)+'~'+esc(R.current.toAge)+'세, '+esc(R.current.stem+R.current.branch)+' 대운이야. 지나온 시기에 반복된 주제가 지금 어떻게 이어지는지는 바로 아래 “지금 시기”에서 볼 수 있어.</p>':'';
  return '<section class="gpdCard" data-gpd="1"><div class="mini">지나온 시기 · 기억과 맞춰 보기</div>'
    +'<h3>'+esc(name)+'님이 지나온 10년 단위 흐름</h3>'
    +'<p class="lead">대운은 10년 동안 자주 들어오는 과제야. 사건을 맞히는 표가 아니라, 그 시기에 어떤 고민이 반복됐을지 원국과 맞대어 읽은 거야. 기억과 다르면 다른 대로 알려 줘.</p>'
    +rows+curLine
    +'<div class="gpdAct"><button type="button" data-gpd-ask="1">지나온 시기 얘기로 상담 이어가기</button></div></section>';
}
var CSS='#resultView.gR1 > .gpdCard{order:4}#resultView .gpdCard{margin:14px 0;padding:18px 16px;border-radius:18px;background:#fbf8f2;border:1px solid #ece3d3}#resultView .gpdCard .mini{font-size:12px;color:#8a7a5c;font-weight:700;margin-bottom:6px}#resultView .gpdCard h3.gpdT,#resultView .gpdCard h3{font-size:18px;margin:0 0 8px}#resultView .gpdCard p.lead{font-size:13.5px;color:#5f5a52;line-height:1.6}'
 +'#resultView .gpdItem{margin-top:12px;padding:13px 13px 10px;border-radius:14px;background:#fff;border:1px solid #efe7da}#resultView .gpdItem.recent{border-color:#d9c79f}#resultView .gpdHead{display:flex;flex-wrap:wrap;justify-content:space-between;gap:4px 10px;align-items:baseline}#resultView .gpdHead b{font-size:14.5px;line-height:1.45}#resultView .gpdHead span{font-size:12px;color:#9a8f7d}'
 +'#resultView .gpdItem ul{margin:8px 0 0;padding-left:18px}#resultView .gpdCard .gpdItem li{font-size:14px;line-height:1.65;margin:3px 0}#resultView .gpdCard p.gpdBal{font-size:13.5px;line-height:1.6;margin:8px 0 0;color:#6b5a3a}#resultView .gpdCard p.gpdQ{margin:9px 0 0;font-size:13.5px;font-weight:700;color:#2f5d46;line-height:1.55}'
 +'#resultView .gpdEv summary{font-size:12px;color:#8a7a5c;cursor:pointer;margin-top:6px}#resultView .gpdCard .gpdEv p{font-size:12px;color:#7d7466;margin:4px 0 0}#resultView .gpdCard p.gpdNow{font-size:13.5px;line-height:1.6;margin:12px 0 0}#resultView .gpdAct{margin-top:12px}#resultView .gpdAct button{width:100%;padding:11px;border-radius:12px;border:1px solid #cfe0d5;background:#eef6f0;color:#245b40;font-weight:700;font-size:14px}';
function ensureCss(){if(root.document.getElementById('gpdCss'))return;var s=root.document.createElement('style');s.id='gpdCss';s.textContent=CSS;root.document.head.appendChild(s);}
function currentChart(){try{return root.chart||(typeof chart!=='undefined'?chart:null);}catch(_e){return null;}}
function anchor(view){
  var hs=view.querySelectorAll('h3,h4');for(var i=0;i<hs.length;i++){var t=(hs[i].textContent||'').trim();if(/^7\.\s*지금 시기/.test(t)){return hs[i].closest('article,section')||hs[i];}}
  return null;
}
function matchOrder(el,ref){try{var o=root.getComputedStyle(ref).order;if(o&&o!=='0')el.style.order=o;}catch(_e){}}
function enhance(){
  if(root.GUIIN_PAST_DAEUN_OFF||!root.document)return;
  var view=root.document.getElementById('resultView');if(!view||view.querySelector('[data-gpd]'))return;
  var a=anchor(view);if(!a||!a.parentNode)return;
  var c=currentChart();var R=null;try{R=read(c);}catch(e){try{console.warn('GUIIN_PAST_DAEUN',e);}catch(_){}}
  if(!R||!R.past.length)return;
  ensureCss();
  var name=(c.input&&c.input.name)||'너';
  var holder=root.document.createElement('div');holder.innerHTML=cardHTML(R,name);
  var card=holder.firstChild;card.__gpd=R;a.parentNode.insertBefore(card,a);matchOrder(card,a);
}
function onClick(e){
  var t=e.target&&e.target.closest?e.target.closest('[data-gpd-ask]'):null;if(!t)return;
  var card=t.closest('[data-gpd]'),R=card&&card.__gpd;if(!R||!R.past.length)return;
  var x=R.past[R.past.length-1];
  var q=x.from+'~'+x.to+'세('+x.ko+' 대운) 얘기야. 그때 실제로는 이런 일이 있었어: ';
  try{if(typeof root.guiinOpenResultConsultation==='function')root.guiinOpenResultConsultation('personal',q);}catch(_e){}
}
if(root.document&&root.MutationObserver){
  var pending=false;
  var mo=new root.MutationObserver(function(){if(pending)return;pending=true;root.requestAnimationFrame(function(){pending=false;try{enhance();}catch(_e){}});});
  var start=function(){try{mo.observe(root.document.body,{childList:true,subtree:true});root.document.addEventListener('click',onClick);enhance();}catch(_e){}};
  if(root.document.body)start();else root.document.addEventListener('DOMContentLoaded',start);
}
root.GuiinPastDaeun={read:read,version:'past-daeun-v1'};
})(typeof globalThis!=='undefined'?globalThis:this);
