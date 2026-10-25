/* GUIIN_B6_FEATURES_V1 — 화면 추가 기능 (계산 엔진·점수·결제 변경 없음, 기존 계산 함수 결과만 사용)
   1) 2027 신년운세 카드 (인생 흐름 탭·대운세운 화면)
   3) 궁합: 두 사람의 올해·내년 세운이 맞물리는 방식
   4) 결과 이미지 저장 카드 (사주·궁합) */
(function(){
  if(window.__GUIIN_B6_FEATURES_V1__)return;window.__GUIIN_B6_FEATURES_V1__=true;
  function $(id){return document.getElementById(id)}
  function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function chartNow(){try{return typeof chart!=='undefined'?chart:null}catch(_e){return null}}
  function tabNow(){try{return typeof currentTab!=='undefined'?currentTab:''}catch(_e){return ''}}
  function fin(ch){var c=String(ch).charCodeAt(0);return c>=0xAC00&&c<=0xD7A3&&((c-0xAC00)%28)!==0}
  function jo(w,a,b){w=String(w||'');return w+(fin(w.slice(-1))?a:b)}
  function age(c){var I=c&&c.input||{};var bd=new Date(I.year,(I.month||1)-1,I.day||1);return (Date.now()-bd.getTime())/(365.2425*86400000)}
  var GODWORD={비견:'내 기준',겁재:'경쟁·관계',식신:'꾸준한 생산',상관:'표현·변화',편재:'기회·활동',정재:'실속·관리',편관:'압박·책임',정관:'약속·평가',편인:'생각·탐구',정인:'배움·도움'};
  var YEAR10={
    비견:'내 기준과 독립심이 커지는 해야. 내 방식으로 해 보고 싶은 일이 많아지고, 동료나 경쟁자도 함께 늘어.',
    겁재:'사람과 돈이 함께 움직이는 해야. 함께하는 일이 늘지만 내 몫과 남의 몫을 분명히 해야 새지 않아.',
    식신:'꾸준히 만들고 쌓는 해야. 하던 일이 안정되고, 해 온 것이 결과물로 남기 좋아.',
    상관:'바꾸고 표현하고 싶은 해야. 새로운 시도와 변화가 많지만, 말과 약속이 앞서지 않게 챙겨.',
    편재:'기회와 활동이 커지는 해야. 넓게 움직일수록 기회도 오지만 돈과 시간의 한도를 먼저 정해.',
    정재:'실속을 쌓는 해야. 계획한 만큼 차근차근 모이고, 생활 기반을 다지기 좋아.',
    편관:'책임과 압박이 커지는 해야. 버티며 해결한 경험이 실력이 되지만, 몸과 일정의 여유를 꼭 남겨.',
    정관:'평가와 신뢰가 쌓이는 해야. 약속과 원칙을 지킬수록 자리와 인정이 따라와.',
    편인:'생각을 정리하고 깊이 파고드는 해야. 혼자 공부하고 준비하기 좋지만 생각만 길어지지 않게 해.',
    정인:'배우고 도움받는 해야. 자격·문서·도움을 주는 사람이 힘이 되고 마음이 안정되기 쉬워.'};
  var YEAR10_TEEN={
    비견:'내 생각대로 해 보고 싶은 해야. 스스로 정한 방식이 힘이 되지만, 친구와 비교하는 마음은 조금 내려놔.',
    겁재:'친구와 함께하는 일이 늘어나는 해야. 같이 하는 건 즐겁게, 돈과 물건을 빌려주고 받는 건 분명하게 해.',
    식신:'꾸준히 하면 실력이 쌓이는 해야. 좋아하는 걸 매일 조금씩 이어 가면 결과로 남기 좋아.',
    상관:'표현하고 바꾸고 싶은 해야. 새로운 시도는 좋지만, 말이 앞서 다툼이 생기지 않게 말투를 챙겨.',
    편재:'관심사와 활동이 넓어지는 해야. 여러 가지를 해 보되 시간과 용돈의 한도를 먼저 정해.',
    정재:'차근차근 쌓는 해야. 계획한 만큼 해내기 좋고, 공부 습관과 생활 리듬을 다지기 좋아.',
    편관:'해야 할 일과 압박이 늘어나는 해야. 버티며 해낸 경험이 실력이 되지만, 잠과 쉬는 시간을 꼭 지켜.',
    정관:'규칙과 평가 속에서 인정받기 쉬운 해야. 약속과 원칙을 지킬수록 믿음이 쌓여.',
    편인:'혼자 깊이 생각하고 파고드는 해야. 관심 분야를 공부하기 좋지만 생각만 길어지지 않게 해.',
    정인:'배우고 도움받는 해야. 공부와 선생님·가족의 도움이 힘이 되고 마음이 안정되기 쉬워.'};
  var AREA={year:'바깥 관계·집안 어른',month:'일·사회생활',day:'가까운 사람과 내 컨디션'};
  var RELTX={충:'변화와 부딪힘이 크게 느껴질 수 있어. 큰 결정은 서두르지 말고 지킬 것과 바꿀 것을 나눠.',형:'같은 문제가 모양을 바꿔 되풀이되기 쉬워. 이미 정한 것과 다시 볼 것을 구분해.',해:'말하지 않은 서운함이 쌓이기 쉬워. 짐작하지 말고 직접 확인해.',파:'계획이 중간에 바뀌기 쉬워. 일정과 약속에 여유를 둬.',육합:'도움과 연결이 붙기 쉬워. 함께할 일을 시작하기 좋아.',천간합:'마음이 맞는 사람과 묶이기 쉬워. 대화로 풀기 좋은 해야.',삼합:'흐름이 한 방향으로 모이기 쉬워. 미뤄 둔 일을 밀고 가기 좋아.',방합:'흐름이 한 방향으로 모이기 쉬워.'};
  var PRI={충:5,형:4,해:3,파:3,육합:2,천간합:2,삼합:2,방합:1};
  function yearPillar(c,y){try{var f=GuiinFortuneV2.flow(c,new Date(Date.UTC(y,6,1,3)));return f&&f.pillars&&f.pillars.year}catch(_e){return null}}
  function topRel(c,p){try{var r=(GuiinSaju.relationsWithTransit(c.pillars,p)||[]).filter(function(x){return PRI[x.type]&&AREA[x.aKey]});return r.sort(function(a,b){return PRI[b.type]-PRI[a.type]})[0]||null}catch(_e){return null}}
  function curLuck(c){var L=Array.isArray(c.luck)?c.luck:[],a=age(c);for(var i=0;i<L.length;i++){if(a>=+L[i].fromAgeExact&&a<+L[i].toAgeExact)return {cur:L[i],next:L[i+1]}}return null}

  /* ---------- 1) 2027 신년운세 ---------- */
  var TARGET=2027;
  function newYearHTML(c){
    var F=window.GuiinFortuneV2;if(!F||!F.yearSignal||!F.timingHighlights)return '';
    var ys=F.yearSignal(c,TARGET),prev=F.yearSignal(c,TARGET-1);if(!ys||!ys.god)return '';
    var p=yearPillar(c,TARGET),pp=yearPillar(c,TARGET-1);
    var h=F.timingHighlights(c,TARGET),months=(h&&h.months)||[];
    var g=ys.god,gw=GODWORD[g]||'',teen=age(c)<19;
    var AR=teen?{year:AREA.year,month:'학교·바깥 생활',day:AREA.day}:AREA;
    var out='<div class="mini">'+TARGET+' 신년운세</div><h3>'+TARGET+'년 '+esc(p?p.ko+'('+(p.hanja||'')+')':'')+'년은 너에게 '+esc(g)+'('+esc(gw)+')의 해야</h3>';
    out+='<p>'+esc((teen&&YEAR10_TEEN[g])||YEAR10[g]||'')+'</p>';
    if(prev&&prev.god&&pp)out+='<p>'+esc((TARGET-1)+'년('+pp.ko+')이 '+prev.god+'('+(GODWORD[prev.god]||'')+')의 해였다면, '+TARGET+'년은 '+g+'('+gw+')의 해로 주제가 '+(prev.god===g?'이어져.':'바뀌어.'))+'</p>';
    var r=p&&topRel(c,p);
    if(r)out+='<p>'+esc(TARGET+'년의 글자가 네 '+r.aLabel+'와 '+jo(r.type,'으로','로')+' 걸려서, '+AR[r.aKey]+' 쪽에서 '+(RELTX[r.type]||''))+'</p>';
    else out+='<p>'+esc(TARGET+'년의 글자는 네 원국과 크게 부딪히거나 묶이지 않아서, 한 해의 주제를 차분하게 쓰기 좋아.')+'</p>';
    var L=curLuck(c);
    if(L&&L.next){var I=c.input||{};var startY=Math.floor(Number(I.year)+Number(L.next.fromAgeExact));if(startY===TARGET||startY===TARGET+1)out+='<p>'+esc(startY+'년쯤 대운이 '+L.cur.ko+'('+L.cur.god+')에서 '+L.next.ko+'('+L.next.god+')로 바뀌어. 10년 단위 배경이 바뀌는 때라, 큰 계획은 그 흐름까지 함께 봐.')+'</p>'}
    try{var sj=h.samjae;if(sj&&(sj.active||sj.isSamjae||sj.stage)){var st=sj.stageLabel||sj.label||sj.stage||'';out+='<p class="nyNote">'+esc(TARGET+'년은 전통적으로 말하는 삼재'+(st?'('+st+')':'')+'에 해당해. 겁낼 일이 아니라 큰 변화를 서두르지 말라는 참고로만 봐.')+'</p>'}}catch(_e){}
    if(months.length){
      var used={};var pick=function(k,uniq){var l=months.slice().sort(function(a,b){return (Number(b.scores&&b.scores[k]||0)-Number(a.scores&&a.scores[k]||0))||a.month-b.month});var m=uniq?(l.filter(function(x){return !used[x.month]})[0]||l[0]):l[0];if(m&&uniq)used[m.month]=1;return m};
      var best=[[teen?'용돈':'돈','money'],[teen?'공부·성과':'일·성과','career'],['관계','relationship']].map(function(x){var m=pick(x[1],true);return m?'<li><b>'+x[0]+'</b> '+m.month+'월('+esc(m.pillar||'')+' · '+esc(m.god||'')+')</li>':''}).join('');
      var cm=pick('caution');
      out+='<div class="nyGrid"><div><div class="nyLab">힘을 쓰기 좋은 달</div><ul>'+best+'</ul></div><div><div class="nyLab warn">한 번 더 확인할 달</div><ul>'+(cm?'<li><b>주의</b> '+cm.month+'월('+esc(cm.pillar||'')+' · '+esc(cm.god||'')+')</li>':'')+'</ul></div></div>';
      out+='<details class="nyMonths"><summary>'+TARGET+'년 1~12월 흐름 펼쳐 보기</summary><ul>'+months.slice().sort(function(a,b){return a.month-b.month}).map(function(m){var rel=(m.relations||[]).map(function(x){return typeof x==='string'?x:x&&x.type}).filter(Boolean);return '<li><b>'+m.month+'월 '+esc(m.pillar||'')+'</b>'+esc(m.god||'')+(GODWORD[m.god]?' · '+esc(GODWORD[m.god]):'')+(rel.length?' <span class="nyRel">'+esc(rel.join('·'))+'</span>':'')+'</li>'}).join('')+'</ul><p class="nyNote">월 기준은 절기(입춘·경칩…)로 바뀌어서 달력의 1일과 며칠 차이가 있어.</p></details>';
    }
    out+='<p class="nyNote">세운은 그해에 자주 들어올 과제를 보여 주는 신호야. 일이 정해져 있다는 뜻은 아니야.</p>';
    return out;
  }
  function newYearCard(root){
    if(!root)return;var c=chartNow();if(!c)return;
    if(root.id==='resultView'&&tabNow()!=='flow'){var o0=root.querySelector(':scope > .guiinNewYear');if(o0)o0.remove();return}
    if(root.id==='yearView'&&!root.querySelector('.expertSection'))return;
    var key=TARGET+'|'+[c.input&&c.input.year,c.input&&c.input.month,c.input&&c.input.day,c.input&&c.input.hour,c.input&&c.input.gender].join('-');
    var old=root.querySelector(':scope > .guiinNewYear');if(old&&old.getAttribute('data-k')===key)return;if(old)old.remove();
    var html='';try{html=newYearHTML(c)}catch(_e){html=''}if(!html)return;
    var d=document.createElement('section');d.className='guiinNewYear';d.setAttribute('data-k',key);d.innerHTML=html;
    var anchor=root.querySelector(':scope > .guiinDaeunHead')||root.querySelector(':scope > .easyIntro')||root.querySelector(':scope > .guiinVisualHero');
    if(anchor&&anchor.parentNode===root)root.insertBefore(d,anchor.nextSibling);else root.insertBefore(d,root.firstChild);
  }

  /* ---------- 3) 궁합: 두 사람의 세운 맞물림 ---------- */
  function given(n){n=String(n||'').trim();if(/^[가-힣]{3}$/.test(n))return n.slice(1);if(/^[가-힣]{4}$/.test(n)&&/^(남궁|황보|제갈|선우|독고|사공|서문|동방)/.test(n))return n.slice(2);return n||'상대'}
  var PAIR={
    same:'둘 다 같은 주제의 해라서 서로의 고민을 잘 알아. 대신 같은 곳에서 같이 지칠 수 있으니 번갈아 쉬는 날을 정해.',
    busyrest:'{a}은 바쁘고 책임이 커지는 해이고 {b}은 쉬어 가며 정리하고 싶은 해야. 한쪽이 바쁘다고 마음이 식은 게 아니라는 걸 미리 말해 둬.',
    moneyone:'{a} 쪽에 돈과 기회가 움직이는 해라서, 함께 쓰는 돈의 기준을 그해 초에 다시 정해 두면 좋아.',
    change:'{a}은 바꾸고 표현하고 싶은 해라서 새 계획을 자주 꺼낼 수 있어. {b}은 다 받아 주기보다 하나씩 골라 같이 해 봐.',
    learn:'{a}은 배우고 정리하는 해라서 혼자 있는 시간이 늘 수 있어. 거리를 두는 게 아니라 준비하는 시간으로 봐 줘.',
    diff:'두 사람이 신경 쓰는 주제가 다른 해야. 상대가 지금 무엇에 쓰이고 있는지 한 번 묻고 시작하면 덜 엇갈려.'};
  var BUSY={편관:1,정관:1,겁재:1},REST={편인:1,정인:1,식신:1},MONEY={편재:1,정재:1},CHG={상관:1,편재:1},LEARN={편인:1,정인:1};
  function pairLine(a,b,ga,gb){
    function T(s,x,y){return s.replace(/\{a\}은/g,jo(x,'은','는')).replace(/\{b\}은/g,jo(y,'은','는')).replace(/\{a\}/g,x).replace(/\{b\}/g,y)}
    if(ga===gb)return PAIR.same;
    if(BUSY[ga]&&BUSY[gb])return '둘 다 바쁘고 책임이 커지는 해라서 서로 챙길 여유가 줄 수 있어. 짧아도 꾸준히 연락하는 규칙을 정해 둬.';
    if(BUSY[ga]&&REST[gb])return T(PAIR.busyrest,a,b);if(BUSY[gb]&&REST[ga])return T(PAIR.busyrest,b,a);
    if(MONEY[ga]&&!MONEY[gb])return T(PAIR.moneyone,a,b);if(MONEY[gb]&&!MONEY[ga])return T(PAIR.moneyone,b,a);
    if(CHG[ga]&&!CHG[gb])return T(PAIR.change,a,b);if(CHG[gb]&&!CHG[ga])return T(PAIR.change,b,a);
    if(LEARN[ga])return T(PAIR.learn,a,b);if(LEARN[gb])return T(PAIR.learn,b,a);
    return PAIR.diff;
  }
  function pairYears(){
    var root=$('matchView');if(!root)return;var t='summary';try{t=typeof matchTab!=='undefined'?matchTab:'summary'}catch(_e){}
    var m=null;try{m=typeof matchMeta!=='undefined'?matchMeta:null}catch(_e){}
    var old=root.querySelector('.guiinPairYears');
    if(!m||!m.a||!m.b||!root.querySelector('.matchHero')||(t!=='summary'&&t!=='marriage')){if(old)old.remove();return}
    var key=[m.a.input&&m.a.input.name,m.b.input&&m.b.input.name,m.score,t].join('|');if(old&&old.getAttribute('data-k')===key)return;if(old)old.remove();
    var F=window.GuiinFortuneV2;if(!F||!F.yearSignal)return;
    var an=given(m.a.input&&m.a.input.name),bn=given(m.b.input&&m.b.input.name);
    var y0=new Date(Date.now()+9*3600000).getUTCFullYear(),rows='';
    [y0,y0+1].forEach(function(y){
      var sa=F.yearSignal(m.a,y),sb=F.yearSignal(m.b,y);if(!sa||!sb)return;var p=yearPillar(m.a,y);
      var ra=p&&topRel(m.a,p),rb=p&&topRel(m.b,p);
      var rel=[];if(ra)rel.push(an+' '+ra.aLabel+' '+ra.type);if(rb)rel.push(bn+' '+rb.aLabel+' '+rb.type);
      rows+='<div class="pyRow"><div class="pyHead">'+y+'년'+(p?' '+esc(p.ko):'')+'</div><p><b>'+esc(an)+'</b> '+esc(sa.god)+'('+esc(GODWORD[sa.god]||'')+') · <b>'+esc(bn)+'</b> '+esc(sb.god)+'('+esc(GODWORD[sb.god]||'')+')</p><p>'+esc(pairLine(an,bn,sa.god,sb.god))+'</p>'+(rel.length?'<p class="pyRel">원국과 걸리는 곳: '+esc(rel.join(' · '))+'</p>':'')+'</div>';
    });
    if(!rows)return;
    var d=document.createElement('section');d.className='guiinPairYears card';d.setAttribute('data-k',key);
    d.innerHTML='<div class="mini">두 사람의 올해·내년 흐름</div><h3>같은 해라도 두 사람에게 들어오는 운이 달라</h3>'+rows+'<p class="pyNote">세운은 그해 자주 들어올 주제를 보여 주는 참고값이야. 관계의 결론을 정하는 숫자는 아니야.</p>';
    var anchor=root.querySelector(':scope > .gdv')||root.querySelector(':scope > .matchHero');
    if(anchor&&anchor.parentNode===root)root.insertBefore(d,anchor.nextSibling);else root.appendChild(d);
  }

  /* ---------- 4) 결과 이미지 저장 ---------- */
  var EL_COLOR={목:'#3f8f5a',화:'#d4553a',토:'#b8862b',금:'#8a8f98',수:'#2f6fa8'};
  function wrapText(ctx,text,x,y,maxW,lh,maxLines){var words=String(text).split(''),line='',lines=[];for(var i=0;i<words.length;i++){var t=line+words[i];if(ctx.measureText(t).width>maxW&&line){lines.push(line);line=words[i]}else line=t}if(line)lines.push(line);lines=lines.slice(0,maxLines);lines.forEach(function(l,i){ctx.fillText(l,x,y+i*lh)});return y+lines.length*lh}
  function cardBase(ctx,W,H,title){
    var g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#fffaf0');g.addColorStop(1,'#f3ead6');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#d9c393';ctx.lineWidth=6;ctx.strokeRect(24,24,W-48,H-48);
    ctx.fillStyle='#7a5a1e';ctx.font='700 34px "Apple SD Gothic Neo","Noto Sans KR",sans-serif';ctx.fillText('☘ 귀인사주',64,100);
    ctx.fillStyle='#2d200c';ctx.font='800 54px "Apple SD Gothic Neo","Noto Sans KR",sans-serif';ctx.fillText(title,64,190);
  }
  function footer(ctx,W,H){ctx.fillStyle='#8a7d66';ctx.font='500 26px "Apple SD Gothic Neo","Noto Sans KR",sans-serif';ctx.fillText('gwiinsaju.com · 사주는 참고용 해석이야',64,H-64)}
  function sajuImage(c){
    var W=1080,H=1350,cv=document.createElement('canvas');cv.width=W;cv.height=H;var ctx=cv.getContext('2d');
    var name=given(c.input&&c.input.name)||'나';cardBase(ctx,W,H,name+'의 사주');
    var P=c.pillars||{},keys=['hour','day','month','year'],lab={hour:'시주',day:'일주',month:'월주',year:'년주'};
    var x0=64,cw=(W-128)/4,y0=250;
    keys.forEach(function(k,i){var p=P[k];var x=x0+i*cw;ctx.fillStyle=k==='day'?'#fff3cf':'#ffffff';ctx.fillRect(x+8,y0,cw-16,300);ctx.strokeStyle='#e5d6b0';ctx.lineWidth=2;ctx.strokeRect(x+8,y0,cw-16,300);
      ctx.fillStyle='#6b5a3a';ctx.font='600 28px "Apple SD Gothic Neo","Noto Sans KR",sans-serif';ctx.textAlign='center';ctx.fillText(lab[k],x+cw/2,y0+44);
      if(p){ctx.font='800 92px "Noto Serif KR","Apple SD Gothic Neo",serif';ctx.fillStyle=EL_COLOR[p.stemEl]||'#2d200c';ctx.fillText(p.stemH||p.stem||'',x+cw/2,y0+150);ctx.fillStyle=EL_COLOR[p.branchEl]||'#2d200c';ctx.fillText(p.branchH||p.branch||'',x+cw/2,y0+260)}
      else{ctx.fillStyle='#8a7d66';ctx.font='700 34px "Apple SD Gothic Neo","Noto Sans KR",sans-serif';ctx.fillText('시간',x+cw/2,y0+175);ctx.fillText('모름',x+cw/2,y0+220)}
      ctx.textAlign='left'});
    var y=620;ctx.fillStyle='#2d200c';ctx.font='700 34px "Apple SD Gothic Neo","Noto Sans KR",sans-serif';
    var dm=c.dayMaster||{};ctx.fillText('일간 '+(dm.hanja||'')+' '+(dm.stem||'')+(dm.el||''),64,y);y+=60;
    var L=curLuck(c);if(L&&L.cur){ctx.fillText('지금 대운 '+L.cur.ko+' · '+L.cur.god+' · '+L.cur.fromAge+'~'+L.cur.toAge+'세',64,y);y+=60}
    try{var F=window.GuiinFortuneV2,ys=F&&F.yearSignal(c,TARGET);if(ys&&ys.god){ctx.fillText(TARGET+'년 '+ys.god+'('+(GODWORD[ys.god]||'')+')의 해',64,y);y+=70}}catch(_e){}
    var line='';try{var cands=[].slice.call(document.querySelectorAll('#resultView .gdv .gdvSec p, #resultView .expertSection p'));for(var i=0;i<cands.length;i++){var tx=cands[i].textContent.trim();if(tx.length>=30&&!/^(신살|근거|이건|출생|해석)/.test(tx)){line=(tx.match(/[^.!?]+[.!?]/g)||[tx]).slice(0,2).join(' ');break}}}catch(_e){}
    if(line){ctx.fillStyle='#3a3226';ctx.font='500 32px "Apple SD Gothic Neo","Noto Sans KR",sans-serif';wrapText(ctx,line,64,y+10,W-128,48,6)}
    footer(ctx,W,H);return cv;
  }
  function matchImage(m){
    var W=1080,H=1350,cv=document.createElement('canvas');cv.width=W;cv.height=H;var ctx=cv.getContext('2d');
    var an=given(m.a.input&&m.a.input.name),bn=given(m.b.input&&m.b.input.name);cardBase(ctx,W,H,an+' ♥ '+bn+' 궁합');
    ctx.fillStyle='#c0392b';ctx.font='900 160px "Apple SD Gothic Neo","Noto Sans KR",sans-serif';ctx.fillText(String(m.score||'-')+'점',64,400);
    var y=500;ctx.fillStyle='#2d200c';ctx.font='700 34px "Apple SD Gothic Neo","Noto Sans KR",sans-serif';
    var ms=null;try{ms=typeof guiinCompatMetricsV56==='function'?guiinCompatMetricsV56(m.a,m.b):null}catch(_e){}
    if(ms){[['연애·끌림',ms.love],['성격·대화',ms.personality],['돈·생활',ms.money],['장기조율',ms.future]].forEach(function(r){if(r[1]==null)return;ctx.fillText(r[0],64,y);ctx.fillStyle='#e9dcc0';ctx.fillRect(300,y-28,600,30);ctx.fillStyle='#d9a53a';ctx.fillRect(300,y-28,Math.max(0,Math.min(600,6*Number(r[1]))),30);ctx.fillStyle='#2d200c';ctx.fillText(String(r[1]),920,y);y+=70})}
    var line='';try{var el=document.querySelector('#matchView .gdvSec p b, #matchView .matchHero p');line=el?el.textContent.trim():''}catch(_e){}
    if(line){ctx.fillStyle='#3a3226';ctx.font='500 32px "Apple SD Gothic Neo","Noto Sans KR",sans-serif';wrapText(ctx,line,64,y+20,W-128,48,6)}
    footer(ctx,W,H);return cv;
  }
  function saveCanvas(cv,name){
    cv.toBlob(function(blob){if(!blob)return;var file=null;try{file=new File([blob],name,{type:'image/png'})}catch(_e){}
      if(file&&navigator.canShare&&navigator.canShare({files:[file]})){navigator.share({files:[file],title:'귀인사주'}).catch(function(){});return}
      var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},1500)},'image/png');
  }
  window.guiinSaveResultImage=function(kind){try{if(kind==='match'){var m=typeof matchMeta!=='undefined'?matchMeta:null;if(m&&m.a&&m.b)saveCanvas(matchImage(m),'guiin-match.png')}else{var c=chartNow();if(c)saveCanvas(sajuImage(c),'guiin-saju.png')}}catch(_e){}};
  function saveBar(){
    var v=$('resultView'),c=chartNow();
    if(v&&c&&tabNow()==='summary'&&!v.querySelector(':scope > .guiinSaveImg')){var b=document.createElement('div');b.className='guiinSaveImg';b.innerHTML='<span>내 사주 한 장으로 저장하기</span><button type="button">이미지 저장</button>';b.querySelector('button').addEventListener('click',function(){guiinSaveResultImage('saju')});var t=v.querySelector(':scope > .tailQuestions');if(t)v.insertBefore(b,t);else v.appendChild(b)}
    else if(v&&tabNow()!=='summary'){var o=v.querySelector(':scope > .guiinSaveImg');if(o)o.remove()}
    var mv=$('matchView'),mt='summary';try{mt=typeof matchTab!=='undefined'?matchTab:'summary'}catch(_e){}
    if(mv&&mv.querySelector('.matchHero')&&mt==='summary'&&!mv.querySelector(':scope > .guiinSaveImg')){var b2=document.createElement('div');b2.className='guiinSaveImg';b2.innerHTML='<span>우리 궁합 한 장으로 저장하기</span><button type="button">이미지 저장</button>';b2.querySelector('button').addEventListener('click',function(){guiinSaveResultImage('match')});var t2=mv.querySelector(':scope > .tailQuestions');if(t2)mv.insertBefore(b2,t2);else mv.appendChild(b2)}
    else if(mv&&mt!=='summary'){var o2=mv.querySelector(':scope > .guiinSaveImg');if(o2)o2.remove()}
  }

  var css=document.createElement('style');css.id='GUIIN_B6_FEATURES_CSS';
  css.textContent='.guiinNewYear{margin:12px 0;padding:16px;border-radius:18px;background:linear-gradient(180deg,#fff7ec,#fff);border:1px solid #f0d7b0}'
  +'.guiinNewYear .mini,.guiinPairYears .mini{font-size:12px;font-weight:800;color:#a3541c;margin-bottom:6px}.guiinNewYear h3,.guiinPairYears h3{margin:0 0 8px;font-size:18px;line-height:1.45;color:#2d200c}'
  +'.guiinNewYear p,.guiinPairYears p{margin:0 0 8px;font-size:15px;line-height:1.7;color:#3a3226;word-break:keep-all}.nyNote,.pyNote{font-size:12.5px!important;color:#8a7d66!important}'
  +'.nyGrid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:8px 0}.nyGrid>div{background:#fff;border:1px solid #f0e3c4;border-radius:12px;padding:10px}.nyGrid ul{list-style:none;margin:0;padding:0}.nyGrid li{font-size:13.5px;line-height:1.7}.nyLab{font-size:12px;font-weight:800;color:#1f6a35;margin-bottom:4px}.nyLab.warn{color:#9a3b1f}'
  +'.nyMonths summary{cursor:pointer;font-weight:800;color:#1f5a43;font-size:14px;min-height:40px;display:flex;align-items:center}.nyMonths ul{list-style:none;margin:6px 0;padding:0}.nyMonths li{padding:7px 0;border-bottom:1px solid #f3e8d2;font-size:14px;line-height:1.6}.nyMonths li b{display:inline-block;min-width:92px}.nyRel{font-size:12px;color:#9a3b1f;margin-left:4px}'
  +'.guiinPairYears{margin:12px 0;padding:16px}.pyRow{padding:10px 0;border-top:1px solid #f0e8d4}.pyHead{font-weight:800;color:#6b4a14;margin-bottom:4px}.pyRel{font-size:12.5px!important;color:#9a3b1f!important}'
  +'.guiinSaveImg{display:flex;align-items:center;gap:10px;margin:12px 0;padding:12px 14px;border-radius:14px;background:#fffaf0;border:1px dashed #e3c27a;font-size:14px;color:#5a4a2a}.guiinSaveImg span{flex:1}.guiinSaveImg button{min-height:40px;padding:0 14px;border-radius:999px;border:0;background:#e9b949;color:#3b2a10;font-weight:800;font-size:14px}'
  +'@media(max-width:360px){.nyGrid{grid-template-columns:1fr}}'
  +'.guiinResultCompact .guiinNewYear > p:nth-of-type(n+2),.guiinResultCompact .guiinNewYear .nyMonths,.guiinResultCompact .guiinDaeunHead details,.guiinResultCompact .guiinDaeunHead > p:nth-of-type(n+2),.guiinResultCompact .guiinPairYears .pyRel,.guiinResultCompact .guiinPairYears .pyNote{display:none!important}';
  (document.head||document.documentElement).appendChild(css);

  /* B8: 읽기 쉬움(대비)·입력 라벨·빈 버튼·반복 질문칩 정리 — 홈/하단바는 건드리지 않음 */
  var S='#result,#matchResult,#saju,#match,#today,#year';
  function sc(sel){return S.split(',').map(function(r){return sel.split(',').map(function(x){return r+' '+x.trim()}).join(',')}).join(',')}
  var a11y=document.createElement('style');a11y.id='GUIIN_B8_A11Y_CSS';
  a11y.textContent=sc('.manseCell small,.manseLabel,.manseStarNote,.manseFact span,.dayMasterBadge small,.manseSectionHead small,.manseProfileTop p,.manseYinYangHead span,.manseYinYangNote,.manseElTop span,.pairBirth,.pairFacts span,.premiumItem span,.evidenceLine,.evidenceLine b,.guiinFreePaidCol span,.guiinRepeatNote span,.e24AxisTop span,.paidDisclaimer,.help,.mobileHint,.mobileHint b')+'{color:#66615a!important}'
  +sc('.wongukCell em,.wongukCell span')+'{color:#5f645e!important}'
  +sc('.eyebrow,.manseEyebrow,.manseSectionHead span,.pairManseHead span,.easyPoint.support b,.manseYinYangCell b')+'{color:#7f5c0c!important}'
  +sc('.easyPoint.watch b')+'{color:#97481f!important}'
  +'#result #resultView .guiinVisualHero .eyebrow{color:#7f5c0c!important}.nyNote,.pyNote{color:#66615a!important}'
  +'#result #resultTabs button.on{background:#cf3d63!important;border-color:#cf3d63!important}'
  +'#matchResult #matchTabs button.on{background:#8650c8!important;border-color:#8650c8!important}'
  +'#today #fortuneTabs button.on{color:#3a2700!important}'
  +'#today .todayHero h3{color:#c25e12!important}'
  +'.guiinAskDup{display:none!important}';
  (document.head||document.documentElement).appendChild(a11y);

  var LABELS={name:'이름',year:'출생 연도',month:'출생 월',day:'출생 일',hour:'출생 시',minute:'출생 분'};
  var PART={Name:'이름',Year:'출생 연도',Month:'출생 월',Day:'출생 일',Hour:'출생 시',Min:'출생 분'};
  function labels(){
    Object.keys(LABELS).forEach(function(id){var e=$(id);if(e&&!e.getAttribute('aria-label'))e.setAttribute('aria-label',LABELS[id])});
    [['a','나'],['b','상대']].forEach(function(p){Object.keys(PART).forEach(function(k){var e=$(p[0]+k);if(e&&!e.getAttribute('aria-label'))e.setAttribute('aria-label',p[1]+' '+PART[k])})});
    ['saju','match'].forEach(function(id){var sec=$(id);if(!sec)return;sec.querySelectorAll('label:not([for])').forEach(function(l){var n=l.nextElementSibling;if(n&&n.tagName==='INPUT'&&n.id)l.setAttribute('for',n.id)})});
  }
  function heart(){
    var b=document.querySelector('#matchResult .topbar button.ghost:last-of-type');
    if(!b||b.dataset.b8||b.getAttribute('onclick')||b.dataset.guiinNav)return;b.dataset.b8='1';
    b.setAttribute('aria-label','궁합 결과 이미지 저장');b.title='궁합 결과 이미지 저장';
    b.addEventListener('click',function(){try{window.guiinSaveResultImage&&window.guiinSaveResultImage('match')}catch(_e){}});
  }
  function askDedupe(){
    ['resultView','matchView'].forEach(function(id){var v=$(id);if(!v)return;var scopes=[],seen=[];
      v.querySelectorAll('.guiinContextAsk').forEach(function(d){var k=[].map.call(d.querySelectorAll('[data-v625-q]'),function(b){return b.getAttribute('data-v625-q')}).join('|');
        var sc=d.closest('details')||v,i=scopes.indexOf(sc);if(i<0){i=scopes.push(sc)-1;seen[i]={}}
        if(seen[i][k])d.classList.add('guiinAskDup');else{seen[i][k]=1;d.classList.remove('guiinAskDup')}})});
  }

  function apply(){try{newYearCard($('resultView'))}catch(_e){}try{newYearCard($('yearView'))}catch(_e){}try{pairYears()}catch(_e){}try{saveBar()}catch(_e){}try{labels()}catch(_e){}try{heart()}catch(_e){}try{askDedupe()}catch(_e){}}
  window.guiinB6Apply=apply;
  var t1=null,t2=null;function later(){clearTimeout(t1);t1=setTimeout(apply,340);clearTimeout(t2);t2=setTimeout(function(){try{askDedupe()}catch(_e){}},1400)}
  document.addEventListener('click',later,{passive:true});
  function observe(id){var n=$(id);if(n)new MutationObserver(later).observe(n,{childList:true})}
  function boot(){observe('resultView');observe('matchView');observe('yearView');setTimeout(apply,600)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();

/* GUIIN_B9_PAY_UI_V1 — 결제 화면 보기 편하게 (표시만 바꿈)
   - 가격·상품·결제 함수(openPaySheet/openPremiumPay/openCompatPay)·토스 호출·동의 필수 조건은 그대로.
   - 질문 패키지 카드 정리 + 1회당 가격 표시, 결제창 요약·동의 영역 확대·안내 문구·결제 버튼 하단 고정. */
(function(){
  if(window.__GUIIN_B9_PAY_UI_V1__)return;window.__GUIIN_B9_PAY_UI_V1__=true;
  function $(id){return document.getElementById(id)}
  function won(n){return Math.round(n).toLocaleString('ko-KR')}
  var css=document.createElement('style');css.id='GUIIN_B9_PAY_UI_CSS';
  css.textContent=
  /* 질문 패키지 화면 */
   '#wallet .cloverStore .pageIllustration{height:96px!important;min-height:96px!important;max-height:96px!important}#wallet .cloverStore .pageIllustration img{width:100%!important;height:96px!important;object-fit:cover!important;object-position:center 40%!important}'
  +'#wallet .storeIntro{padding:14px 16px!important}#wallet .storeIntro h2{font-size:18px!important;margin:0 0 4px!important}#wallet .storeIntro p{font-size:13px!important;line-height:1.6!important}'
  +'#wallet .storeWish{padding:10px 14px!important}#wallet .storeWish b{font-size:13px!important}#wallet .storeWish span{font-size:12px!important;color:#66615a!important}'
  +'#wallet .luckyPack{display:grid!important;grid-template-columns:64px 1fr!important;grid-template-areas:"c b" "p p"!important;gap:6px 12px!important;padding:16px!important;align-items:start!important;content-visibility:visible!important}'
  +'#wallet .luckyPack .packClover{grid-area:c;align-self:center;font-size:17px!important;font-weight:900;color:#0b6b4f;background:#eef7f0;border-radius:16px;padding:12px 4px;line-height:1.25;word-break:keep-all}'
  +'#wallet .luckyPack .packBody{grid-area:b;min-width:0}#wallet .luckyPack .packBody h3{font-size:16px!important;line-height:1.4!important;margin:0 0 3px!important;word-break:keep-all}'
  +'#wallet .luckyPack .packBody b{display:block;font-size:13px!important;color:#b06f0a!important}#wallet .luckyPack .packBody p{font-size:12.5px!important;line-height:1.6!important;color:#66615a!important;margin:4px 0 0!important}'
  +'#wallet .luckyPack .packBuy{grid-area:p;display:flex!important;align-items:center;gap:10px;text-align:left!important;border-top:1px dashed #eadfca;padding-top:12px;margin-top:4px}'
  +'#wallet .luckyPack .packBuy strong{font-size:20px!important;color:#b56f05!important;white-space:nowrap}#wallet .luckyPack .packBuy small{display:none!important}'
  +'#wallet .luckyPack .packBuy .b9Per{font-size:12.5px;font-weight:800;color:#0b6b4f;background:#eef7f0;border-radius:999px;padding:4px 9px;white-space:nowrap}'
  +'#wallet .luckyPack .packBuy button{margin-left:auto!important;width:auto!important;min-width:104px;min-height:44px;padding:0 16px!important;font-size:15px!important;border-radius:14px!important}'
  +'#wallet .luckyPack.best:before{font-size:11px!important}'
  /* 결제창 공통 */
  +'#paySheet .payPanel,#premiumSheet .premiumPanel,#compatSheet .premiumPanel{max-height:90vh!important;padding-bottom:calc(18px + env(safe-area-inset-bottom))!important}'
  +'#paySheet h3{font-size:19px!important}#paySheet .payPrice{font-size:30px!important}'
  +'#paySheet .payList{font-size:13.5px!important;line-height:1.75!important;color:#4a4236!important}'
  +'.b9Sum{display:flex;flex-wrap:wrap;gap:6px;margin:4px 0 10px}.b9Sum span{font-size:13px;font-weight:800;color:#0b6b4f;background:#eef7f0;border-radius:999px;padding:5px 10px}'
  +'#paySheet .payConsent,#premiumSheet .payConsent,#compatSheet .payConsent{font-size:13px!important;line-height:1.6!important;color:#3a3226!important;padding:13px 14px!important;border:1.5px solid #e6d7b8!important;background:#fffaf0!important;cursor:pointer;min-height:48px;align-items:center!important}'
  +'#paySheet .payConsent input,#premiumSheet .payConsent input,#compatSheet .payConsent input{width:24px!important;height:24px!important;min-height:24px!important;accent-color:#0b6b4f;margin:0!important}'
  +'.payConsent.b9On{border-color:#0b6b4f!important;background:#f1f8f3!important}'
  +'.b9Hint{font-size:12.5px;font-weight:700;color:#9a5a12;text-align:center;margin:8px 0 0}'
  +'#walletPayBtn,#premiumPayBtn,#compatPayBtn{min-height:52px;font-size:16px!important}'
  +'#paySheet .secondary,#premiumSheet .secondary,#compatSheet .secondary{min-height:46px;font-size:15px!important}'
  +'#premiumSheet .price,#compatSheet .price{margin:6px 0 8px!important}';
  (document.head||document.documentElement).appendChild(css);

  function perChips(){
    var w=$('wallet');if(!w)return;
    [].forEach.call(w.querySelectorAll('.luckyPack .packBuy button[onclick^="openPaySheet("]'),function(b){
      var m=/openPaySheet\((\d+),\s*(\d+)\)/.exec(b.getAttribute('onclick')||'');if(!m)return;
      var buy=b.parentNode;if(buy.querySelector('.b9Per'))return;
      var s=document.createElement('span');s.className='b9Per';s.textContent='1회당 약 '+won(+m[2]/+m[1])+'원';
      buy.insertBefore(s,b);
    });
  }
  /* 결제창 요약: 화면에 이미 표시된 상품 버튼 값(횟수·가격)으로만 계산 */
  function sheetSum(){
    var pr=$('payPrice'),pk=$('payPackText');if(!pr||!pk)return;
    var n=+((/(\d+)\s*회/.exec(pk.textContent||'')||[])[1]||0),p=+((pr.textContent||'').replace(/[^\d]/g,'')||0);
    var old=$('b9PaySum');var key=n+'/'+p;if(old&&old.getAttribute('data-k')===key)return;if(old)old.remove();if(!(n>0&&p>0))return;var last={n:n,p:p};
    var d=document.createElement('div');d.id='b9PaySum';d.className='b9Sum';d.setAttribute('data-k',key);
    d.innerHTML='<span>총 '+last.n+'회</span><span>1회당 약 '+won(last.p/last.n)+'원</span><span>30일 사용</span>';
    pr.insertAdjacentElement('afterend',d);
  }
  function consentUI(){
    [['walletPayConsent','walletPayBtn'],['premiumPayConsent','premiumPayBtn'],['compatPayConsent','compatPayBtn']].forEach(function(x){
      var c=$(x[0]),b=$(x[1]);if(!c||!b)return;var lab=c.closest('label');if(lab)lab.classList.toggle('b9On',!!c.checked);
      var h=b.parentNode.querySelector('.b9Hint[data-for="'+x[1]+'"]');
      if(!c.checked){if(!h){h=document.createElement('p');h.className='b9Hint';h.setAttribute('data-for',x[1]);b.insertAdjacentElement('beforebegin',h)}h.textContent='위 내용에 동의 체크를 하면 결제 버튼이 켜져.'}
      else if(h)h.remove();
    });
  }
  document.addEventListener('change',function(e){if(e.target&&/PayConsent$/.test(e.target.id||''))consentUI()},true);
  document.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('[onclick*="Pay"],[onclick*="openPaySheet"]'))setTimeout(consentUI,80)},true);
  function boot(){perChips();consentUI();var w=$('wallet');if(w)new MutationObserver(perChips).observe(w,{childList:true,subtree:true});var pr=$('payPrice');if(pr){new MutationObserver(sheetSum).observe(pr,{childList:true,characterData:true,subtree:true});sheetSum()}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();

/* GUIIN_B9_NOCLIP_V1 — 폰 화면에서 글자가 '…'로 잘리거나 화면 밖으로 나가는 곳 정리 (표시만) */
(function(){
  if(window.__GUIIN_B9_NOCLIP_V1__)return;window.__GUIIN_B9_NOCLIP_V1__=true;
  var css=document.createElement('style');css.id='GUIIN_B9_NOCLIP_CSS';
  css.textContent=
  /* AI 상담 상단: 상담 기준·주제·남은 횟수가 '…'로 잘리던 것 → 줄바꿈 허용 */
   '#ask #askContextCard{flex-wrap:wrap!important;row-gap:4px!important;height:auto!important}'
  +'html body #ask #askContextCard #askContextTitle,html body #ask #aiTopicBar b,#ask #askContextCard b{white-space:normal!important;overflow:visible!important;text-overflow:clip!important;word-break:keep-all!important;line-height:1.35!important}'
  +'#ask .aiTopicBar{flex-wrap:wrap!important;row-gap:4px!important}#ask .aiTopicBar>div b{white-space:normal!important;overflow:visible!important;text-overflow:clip!important}'
  +'#ask .walletRemainLabel{white-space:normal!important;overflow:visible!important}'
  +'#ask .guiinChatHeaderCopy{min-width:0}html body #ask .guiinChatHeaderCopy small{font-size:10px!important;letter-spacing:-.2px}'
  /* 궁합 결과의 두 사람 만세력: 옆으로 밀어야 보이던 표 → 화면 폭에 맞춤 */
  +'#matchView .manseTableWrap{overflow-x:hidden!important}#matchView .manseTable{min-width:0!important;width:100%!important}'
  +'#matchView .manseRow{grid-template-columns:40px repeat(4,minmax(0,1fr))!important}'
  +'#matchView .manseCell{min-width:0!important;overflow-wrap:anywhere;word-break:keep-all}#matchView .manseCell small,#matchView .pillarStarName{white-space:normal!important}'
  /* 좁은 폰(360px 이하): 탭·버튼이 화면 밖으로 나가던 것 */
  +'@media(max-width:360px){'
   +'#today #fortuneTabs{gap:6px!important}#today #fortuneTabs button{flex:1 1 0!important;min-width:0!important;padding:11px 4px!important;font-size:14px!important}'
   +'#matchTabs button,#resultTabs button{padding-left:8px!important;padding-right:8px!important}'
   +'#wallet .luckyPack .packBuy{flex-wrap:wrap!important}#wallet .luckyPack .packBuy button{flex:1 1 100%!important;margin-left:0!important}'
   +'#wallet .topbar .brandline{font-size:18px!important;white-space:nowrap}#wallet .topbar small{font-size:11px!important}'
  +'}';
  (document.head||document.documentElement).appendChild(css);
})();

/* GUIIN_READING_V1 — 종합 해석 레이어 + 풀이 화면 가독성 (후보, 데모 전용)
   - 계산 엔진·만세력·오행·십성·신살 판정·점수·로그인·결제·AI 상담은 읽기만 하고 바꾸지 않는다.
   - 기존 해석 문단은 지우지 않는다. 위에 '핵심 한 줄·사주 근거'를 얹고, 중복 블록은 접어 둔다.
   - 기본은 demo.html 에서만 켜진다. 운영 스위치: window.GUIIN_INTERP_STAGE3_ON=true(켜기)/false(끄기, demo 포함)를 이 파일보다 먼저 선언. 지정 없으면 demo.html 에서만 켜짐. */
(function(){
'use strict';
var VER='reading-v1-20261025';
var ON=false;
try{var F=window.GUIIN_INTERP_STAGE3_ON;ON=F===true?true:F===false?false:(/demo\.html$/i.test(location.pathname)||window.GUIIN_READING_V1_ON===true)}catch(_e){}

/* ================= 1. 종합 해석 레이어 (Synthesis) ================= */
var GR=['비겁','식상','재성','관성','인성'];
var G2={비견:'비겁',겁재:'비겁',식신:'식상',상관:'식상',정재:'재성',편재:'재성',정관:'관성',편관:'관성',정인:'인성',편인:'인성'};
function tierOf(s){return s<=42?'약':s>=62?'강':'중'}
function J(w,a,b){w=String(w||'');var ch=w.charCodeAt(w.length-1);var bat=ch>=0xAC00&&ch<=0xD7A3&&(ch-0xAC00)%28!==0;return w+(bat?b:a)}
var POWER={
 비겁:'내 기준과 내 몫을 지키는 힘',식상:'생각을 말과 결과물로 꺼내는 힘',재성:'현실 조건을 따져 결과로 옮기는 힘',관성:'역할·약속·평가를 지키는 힘',인성:'배우고 정리해서 바탕을 만드는 힘'};
var TIERW={강:'스스로 밀고 나갈 때 가장 잘 나와',중:'상황에 따라 세기를 조절해서 써',약:'혼자 밀어붙일 때보다 곁의 뒷받침과 확신이 있을 때 제대로 나와'};
/* 겉(월간 십성·월령) */
var FACE={비겁:'자기 판단으로 움직이는 독립적인 사람',식상:'말과 아이디어가 눈에 띄는 사람',재성:'현실 감각 있고 일을 굴러가게 하는 사람',관성:'책임감 있고 단정한 사람',인성:'차분하게 생각하고 이해가 깊은 사람'};
var ROLE={비겁:'의리 있고 대등한 동료',식상:'분위기를 살리고 먼저 말을 거는 사람',재성:'일이 되게 만드는 현실적인 해결사',관성:'믿고 맡길 수 있는 사람',인성:'이야기를 끝까지 들어 주는 사람'};
/* 속(일지 본기 = 가까운 자리의 욕구) */
var NEED={비겁:'내 방식과 속도를 존중받는 것',식상:'마음을 자유롭게 표현해도 받아들여지는 것',재성:'함께하는 생활이 현실적으로 안정되는 것',관성:'약속이 지켜지고 관계가 분명한 것',인성:'말하지 않아도 이해받고 쉴 수 있는 것'};
/* 압박 상황 [중심 힘][강약] */
var PRESS={
 비겁:{강:'혼자 결론을 내고 밀어붙여서 주변이 통보받았다고 느끼기 쉬워',중:'내 방식을 지키려고 고집이 세지는데, 설명하면 금방 풀려',약:'겉으로는 버티는데 속으로는 비교와 경쟁에 쉽게 지쳐'},
 식상:{강:'말이 빨라지고 날이 서서, 맞는 말로 상대를 몰아붙이기 쉬워',중:'하고 싶은 말을 하되 표현을 고르느라 에너지를 많이 써',약:'아이디어와 말은 많은데 체력이 먼저 바닥나서 마무리가 흐려져'},
 재성:{강:'일을 계산대로 몰고 가서, 사람 마음보다 결과를 먼저 챙기기 쉬워',중:'조건을 따지며 정리하는 쪽으로 풀어 가',약:'해야 할 일과 챙길 사람을 다 떠안다가 한 번에 지쳐 버려'},
 관성:{강:'기준을 엄격하게 들이대서 나와 남을 같이 조이기 쉬워',중:'원칙을 붙잡고 버티면서 순서대로 정리해',약:'평가와 기대를 너무 의식해서, 맞추느라 내 한계를 넘기기 쉬워'},
 인성:{강:'생각과 준비만 길어지고 실행 타이밍을 놓치기 쉬워',중:'한 발 물러서서 상황을 이해한 뒤에 움직여',약:'혼자 생각에 잠겨 도움을 청할 타이밍을 놓쳐'}};
/* 장점의 과사용 → 피로 */
var OVER={비겁:'내 기준이 강점이지만 너무 쓰면 혼자 다 짊어지는 고집이 돼',식상:'표현력이 강점이지만 너무 쓰면 말이 앞서고 몸이 먼저 지쳐',재성:'현실 감각이 강점이지만 너무 쓰면 모든 걸 손익으로 재다가 마음이 메말라',관성:'책임감이 강점이지만 너무 쓰면 쉬어도 쉰 것 같지 않은 긴장이 돼',인성:'깊이 생각하는 게 강점이지만 너무 쓰면 걱정이 많아지고 실행이 늦어져'};
var LOWNEED={비겁:'내 편이 되어 줄 동료와 자기 확신',식상:'생각을 밖으로 꺼내는 표현 연습',재성:'돈과 시간을 숫자로 관리하는 습관',관성:'스스로 정한 규칙과 마감',인성:'배우고 쉬면서 정리하는 시간'};
var LOVE={비겁:'친구처럼 대등한 연애가 편하고, 간섭받으면 거리를 둬',식상:'표현하고 챙겨 주는 연애인데, 반응이 없으면 금방 서운해져',재성:'생활을 같이 꾸리는 현실적인 연애가 편하고, 책임감 있는 상대에게 끌려',관성:'약속과 신뢰가 중요한 연애라, 한번 실망하면 회복이 느려',인성:'이해받고 기대고 싶은 연애라, 마음을 알아주는 사람에게 깊이 빠져'};
var THINK={비겁:'내 확신이 설 때까지 스스로 따져 보고 결정해',식상:'말하거나 써 보면서 생각을 정리하고, 직감이 먼저 와',재성:'비용·시간·결과를 계산해서 되는 쪽을 골라',관성:'기준과 규칙, 남의 평가에 비춰 맞는지를 먼저 봐',인성:'충분히 이해하고 자료를 모은 뒤에야 판단해'};
var STEMIMG={갑:'곧게 뻗는 큰 나무',을:'덩굴처럼 유연한 풀',병:'세상을 비추는 태양',정:'한 곳을 밝히는 촛불',무:'넓고 단단한 산',기:'곡식을 키우는 밭',경:'단단한 바위와 쇠',신:'잘 다듬은 보석',임:'큰 강과 바다',계:'스며드는 비와 이슬'};
var STEMWORK={갑:'방향을 정하고 앞에 서는 방식',을:'사람 사이를 잇고 조율하는 방식',병:'드러내고 알리는 방식',정:'세심하게 다듬는 방식',무:'버티고 지키는 방식',기:'키우고 관리하는 방식',경:'결단하고 정리하는 방식',신:'정밀하게 완성하는 방식',임:'넓게 판을 읽는 방식',계:'조용히 스며들어 바꾸는 방식'};
function bat(w){w=String(w||'');var ch=w.charCodeAt(w.length-1);return ch>=0xAC00&&ch<=0xD7A3&&(ch-0xAC00)%28!==0}
var THINK2={비겁:'스스로 확신을 확인하기도 해',식상:'말하면서 정리하기도 해',재성:'손익을 따져 보기도 해',관성:'기준에 맞는지 점검하기도 해',인성:'자료를 더 찾아보기도 해'};
var SEASONACT={봄:'시작이 빠르고 일단 움직이면서 길을 찾아',여름:'한번 움직이면 넓게 퍼지고 사람을 끌어들여',가을:'정리하고 결론을 내는 쪽으로 움직여',겨울:'안으로 모아 두었다가 확실할 때 움직여',환절:'흐름을 보며 속도를 조절하다가 움직여'};
var MARRY={비겁:'대등한 동반자 관계가 편하고, 생활의 결정권을 나누는 게 중요해',식상:'함께 즐기고 표현하는 가정이 맞고, 반응 없는 생활이 길어지면 지쳐',재성:'생활 기반과 경제 계획을 같이 세우는 결혼이 안정적이야',관성:'역할과 약속이 분명한 결혼이 편하고, 책임을 나누는 방식이 관건이야',인성:'서로 기댈 수 있는 정서적 안전함이 결혼의 핵심이야'};
var LOWEL={목:'새로 시작하고 몸을 펴는 시간',화:'햇볕을 쬐고 사람을 만나는 시간',토:'정해진 시간에 먹고 쉬는 습관',금:'정리하고 마무리하는 시간',수:'충분히 자고 조용히 쉬는 시간'};
var ELBODY={목:'몸이 굳고 긴장이 쌓이기 쉬우니 풀어 주는 스트레칭·걷기 같은 리듬',화:'열이 오르고 잠이 얕아지기 쉬우니 식히는 휴식과 일정한 잠 시간',토:'생활이 무거워지기 쉬우니 끼니와 움직임을 규칙적으로 두는 리듬',금:'건조하고 긴장되기 쉬우니 물 마시기·환기 같은 숨 돌리는 리듬',수:'몸이 차고 가라앉기 쉬우니 따뜻하게 움직여 기운을 올리는 리듬'};
function godOf(a,b){try{return window.GuiinSaju.tenGod(a,b)}catch(_e){return ''}}
var WORK={비겁:'결정권과 내 몫이 분명한 자리',식상:'말·글·기획·결과물로 보여 주는 자리',재성:'숫자와 성과가 바로 보이는 현장·영업·운영',관성:'역할과 절차가 분명한 조직·전문직',인성:'배우고 연구하고 가르치는 자리'};
var STAR_FIT={문창귀인:['식상','인성'],학당귀인:['인성','식상'],천을귀인:GR,태극귀인:['인성','관성'],천덕귀인:GR,월덕귀인:GR,역마살:['재성','식상'],지살:['재성','식상'],도화살:['식상','재성'],화개살:['인성','비겁'],장성살:['비겁','관성'],반안살:['관성','재성'],천의성:['인성','식상'],암록:['재성'],금여:['재성','관성'],괴강살:['비겁','관성'],양인살:['비겁']};
var AREA={marriage:'결혼·생활',health:'건강 리듬',self:'성격',inside:'속마음',people:'관계',love:'연애',work:'직업',money:'재물',timing:'대운',stars:'신살·귀인',core:'실천'};
var ICON={marriage:'🏡',health:'🌿',self:'🌱',inside:'💭',people:'🤝',love:'💗',work:'💼',money:'💰',timing:'🧭',stars:'⭐',core:'✅'};
var SAFE=/(관계는 (생각보다 )?흔들리지 않|말은 쉽게 흔들리지 않)/;
var STRONG=/(밀어붙(?!이는 힘보다)|추진력|흔들리지 않(?!는 척|는다는)|굽히지 않|끝까지 밀(?!어붙이는 힘보다))/;
var WEAK=/(받쳐 주는 힘이 얇|쉽게 지치|기운이 약|기댈 곳이(?! 있다는))/;

function analyzeP(c){try{return window.GUIIN_INTERPRETATION_V4.engine.analyze(c)}catch(_e){return null}}
function model(c){
  if(!c||!c.pillars)return null;var P=analyzeP(c);if(!P)return null;
  var E2=c.engine2||{},S=E2.structure||{};
  var score=P.score,tier=tierOf(score);
  var top=P.top,second=P.second,low=P.low,pct=P.pct;
  var monthMain=G2[P.mainGod]||P.mgG;           /* 월령(월지 본기) — 1순위 */
  var face=G2[P.mg]||monthMain;                 /* 월간 — 겉 */
  var dayG=G2[P.dayGod]||'비겁';                /* 일지 — 속·가까운 자리 */
  var lowG=pct[low]<=8?low:null;
  var dayRel=(P.tension||[]).filter(function(r){return r.a==='day'||r.b==='day'})[0]||null;
  var stars=(P.stars||[]).filter(function(s){var f=STAR_FIT[s.name];return f&&(f.indexOf(top)>=0||f.indexOf(monthMain)>=0)}).slice(0,2);
  var luck=P.transit&&P.transit.luck,luckG=luck?G2[luck.god]:null;
  var m={clim:(E2.climate&&E2.climate.label)||'',c:c,P:P,name:P.name,stem:P.stem,el:P.el,score:score,tier:tier,top:top,second:second,low:low,lowG:lowG,pct:pct,monthMain:monthMain,face:face,dayG:dayG,dayRel:dayRel,stars:stars,luck:luck,luckG:luckG,season:P.season,pattern:(S.pattern&&S.pattern.candidate)||'',monthBranch:c.pillars.month.branch,dayBranch:c.pillars.day.branch};
  var vp=(S.vector&&S.vector.pct)||{};m.elPct=vp;
  m.ev=evidence(m);m.key=keys(m);m.layers=layers(m);m.persona=persona(m);m.conflicts=conflicts(m);
  m.key.marriage=MARRY[m.dayG]+'.'+(m.dayRel?' 일지(배우자 자리)에 '+J(m.dayRel.label.split(' ').pop(),'가','이')+' 있어서 생활 리듬이 부딪히는 지점을 미리 정해 두면 좋아.':'');
  var hi=Object.keys(vp).filter(function(e){return vp[e]>=35}),lo=Object.keys(vp).filter(function(e){return vp[e]<=8});
  var hs=[];if(hi.length)hs.push(hi.join('·')+' 기운이 '+Math.round(vp[hi[0]])+'%로 많은 편이라 '+ELBODY[hi[0]]+'이 잘 맞아');if(lo.length)hs.push(lo.join('·')+' 기운이 '+Math.round(vp[lo[0]])+'%로 적은 편이라 '+LOWEL[lo[0]]+'을 일부러 챙기면 좋아');
  m.key.health=(hs.length?hs.join('. ')+'.':'오행이 한쪽으로 크게 쏠리지 않아 생활 리듬만 꾸준하면 돼.')+' (전통 명리에서 말하는 생활 리듬 참고일 뿐, 특정 장기나 질병을 뜻하지 않아. 몸이 불편하면 진료가 먼저야.)';
  return m;
}
function tierText(m){return m.tier==='약'?'신약 쪽('+m.score+'점)':m.tier==='강'?'신강 쪽('+m.score+'점)':'중간('+m.score+'점)'}
function evidence(m){
  var P=m.P,pd=m.c.pillars.day,pm=m.c.pillars.month;
  return {
    ML:'월령 '+m.monthBranch+'월('+(m.season==='환절'?'환절기':m.season)+') · 월지 본기 '+P.mainGod,
    MG:'월간 '+pm.stem+' · '+P.mg,
    DB:'일지 '+pd.branch+' · 본기 '+P.dayGod+(P.stage?' · 12운성 '+P.stage:''),
    STR:'강약 '+tierText(m)+(m.pattern?' · '+m.pattern:''),
    TOP:'중심 '+m.top+' '+m.pct[m.top]+'%'+(m.lowG?' · 부족 '+m.lowG+' '+m.pct[m.lowG]+'%':''),
    REL:m.dayRel?'일지 관계 '+m.dayRel.label:'',
    LUCK:m.luck?'현재 대운 '+m.luck.ko+'('+m.luck.god+') '+m.luck.from+'~'+m.luck.to+'세':'',
    STAR:m.stars.length?'보조 신살 '+m.stars.map(function(s){return s.name}).join('·'):''
  };
}
function layers(m){
  return [
   {k:'겉으로 보이는 모습',t:J(FACE[m.face],'로','으로')+' 보여.',ev:[m.ev.MG,m.ev.ML]},
   {k:'속에서 원하는 것',t:NEED[m.dayG]+'이 채워져야 마음이 놓여.',ev:[m.ev.DB]},
   {k:'압박을 받을 때',t:PRESS[m.top][m.tier]+'.',ev:[m.ev.TOP,m.ev.STR]},
   {k:'장점을 너무 쓰면',t:OVER[m.top]+'.'+(m.lowG?' 그래서 '+LOWNEED[m.lowG]+'을 따로 챙겨야 균형이 맞아.':''),ev:[m.ev.TOP]}
  ];
}
function persona(m){
  var emo=(m.pct['식상']>=20?'감정이 말과 표정으로 바로 나오는 편이야':m.pct['식상']<=8?'감정을 속에 담아 두다가 한참 뒤에 꺼내는 편이야':'감정을 골라서 꺼내는 편이야')+(m.P.yin==='음'?'. 직접 말하기보다 행동이나 분위기로 돌려서 보여 줘':'. 돌려 말하기보다 직접 말하는 쪽이야');
  var rel=J(ROLE[m.top],'로','으로')+' 기억되기 쉬워'+(m.pct['비겁']>=25?'. 비겁이 '+m.pct['비겁']+'%로 커서 친한 사이에도 묘한 경쟁심이 생길 수 있어':m.pct['비겁']<=6?'. 비겁이 '+m.pct['비겁']+'%로 적어서 힘든 일을 혼자 감당하는 습관이 있어':'');
  var tired=m.dayRel?'가까운 사이에서 같은 문제로 반복해서 부딪힐 때 ('+m.dayRel.label+')':m.lowG?m.lowG+'('+m.pct[m.lowG]+'%)이 필요한 상황, 즉 '+LOWNEED[m.lowG]+'이 요구될 때':'장점을 쉬지 않고 계속 써야 할 때';
  return [
   ['겉으로 드러나는 모습',J(FACE[m.face],'로','으로')+' 보여',[m.ev.MG]],
   ['실제 내면의 욕구',NEED[m.dayG]+'을 원해',[m.ev.DB]],
   ['생각하고 판단하는 방식',THINK[m.top]+(m.second&&m.second!==m.top?'. 보조로 '+THINK2[m.second]:''),[m.ev.TOP]],
   ['행동으로 옮기는 방식',(SEASONACT[m.season]||SEASONACT['환절'])+'. 강약이 '+tierText(m)+'이라 '+(m.tier==='강'?'속도가 붙으면 멈추기가 어려워':m.tier==='약'?'확신과 지지가 있어야 첫발이 가벼워':'상황 따라 속도를 바꿔'),[m.ev.ML,m.ev.STR]],
   ['감정을 표현하는 방식',emo,['식상 '+m.pct['식상']+'% · 일간 '+m.stem+'('+m.P.yin+')']],
   ['인간관계의 특징',rel,[m.ev.TOP]],
   ['스트레스 상황의 반응',PRESS[m.top][m.tier],[m.ev.TOP,m.ev.STR]],
   ['타고난 장점',POWER[m.top]+'이 가장 크게 작동해',[m.ev.TOP]],
   ['장점을 지나치게 쓸 때',OVER[m.top],[m.ev.TOP]],
   ['피로가 쌓이는 상황',tired,[m.ev.REL||m.ev.TOP]],
   ['균형을 잡는 방법',(m.lowG?LOWNEED[m.lowG]+'을 일부러 챙기기':m.rest||'규칙적인 휴식')+'. 큰 결심보다 일주일에 한 번 정해진 시간으로 시작해',[m.ev.TOP,m.ev.CLM||'']]
  ].map(function(r){return {k:r[0],t:r[1].replace(/\.?$/,'.'),ev:r[2].filter(Boolean)}});
}
function conflicts(m){var out=[],yang=m.P.yin==='양';
  if(yang&&m.tier==='약')out.push('양간 '+m.stem+'의 앞으로 나서는 기질과 신약('+m.score+'점)이 함께 있어. 지지받는 자리에서는 앞장서고, 혼자 떠안는 자리에서는 생각보다 빨리 지쳐.');
  if(!yang&&m.tier==='강')out.push('음간 '+m.stem+'의 섬세함과 신강('+m.score+'점)이 함께 있어. 평소엔 부드럽지만 기준을 건드리면 생각보다 단호해져.');
  if(m.face!==m.dayG)out.push('월간('+m.P.mg+')이 보여 주는 겉모습과 일지('+m.P.dayGod+')가 바라는 속마음이 달라. 처음 만난 사람과 오래 본 사람이 너를 다르게 말할 수 있어.');
  if(m.top!==m.monthMain)out.push('월령은 '+m.monthMain+' 쪽인데 원국 전체로는 '+m.top+'이 가장 커. 환경이 요구하는 역할('+m.monthMain+')을 할 때와 스스로 고른 일('+m.top+')을 할 때 힘의 질이 달라.');
  return out;}
function keys(m){
  var k={};
  k.self=J(m.name,'는','은')+' '+m.stem+m.el+'('+STEMIMG[m.stem]+') 일간이고, 원국의 중심은 '+POWER[m.top]+'이야. 강약이 '+tierText(m)+'이라서 이 힘은 '+TIERW[m.tier]+'.';
  var cl=String(m.clim||''),rest=/한기/.test(cl)?'몸을 데우는 햇빛·걷기 같은 시간':/열기|더운|난기/.test(cl)?'열을 식히는 조용한 휴식':/건조/.test(cl)?'긴장을 풀어 주는 느슨한 시간':/습/.test(cl)?'몸을 움직여 가라앉은 기분을 털어 내는 시간':'규칙적인 휴식';
  k.inside='압박을 받으면 '+PRESS[m.top][m.tier]+'. '+(m.lowG?m.lowG+'이 '+m.pct[m.lowG]+'%로 얇아서 '+LOWNEED[m.lowG]+'이 없을 때 더 빨리 지쳐.':'조후가 '+(cl.split(' · ')[0]||'고른 편')+'이라 '+rest+'이 회복에 잘 맞아.');
  m.rest=rest;
  k.people='사람들 사이에서는 '+J(ROLE[m.top],'로','으로')+' 기억되기 쉬워. 친해질수록 '+NEED[m.dayG]+'을 바라는 모습이 드러나.';
  k.selfSec=m.stem+m.el+'('+STEMIMG[m.stem]+')의 결을 가진 사람으로, 겉으로는 '+J(FACE[m.face],'로','으로')+' 보이고, 속으로는 '+NEED[m.dayG]+'을 바라는 사람이야.';
  k.love=LOVE[m.dayG]+'. '+(m.P.yin==='양'?'마음은 말과 행동으로 바로 보여 주는 편이야.':'마음은 직접 말하기보다 챙김과 분위기로 보여 주는 편이야.')+(m.dayRel?' 일지에 '+J(m.dayRel.label.split(' ').pop(),'가','이')+' 있어 가까운 사이에서 같은 지점이 되풀이되기 쉬워.':'');
  var w=WORK[m.monthMain];k.work='월령 기준으로는 '+J(w,'가','이')+' 맞고, 일하는 결은 '+m.stem+m.el+'의 '+STEMWORK[m.stem]+'이야.'+(m.top!==m.monthMain?' 중심 힘('+m.top+')까지 보면 '+WORK[m.top]+'도 잘 맞아.':' 중심 힘도 같은 방향이라 길이 선명한 편이야.');
  var fp=m.pct['재성'];
  k.money=fp>=25?(m.tier==='약'?'재성 '+fp+'%로 돈 기회는 많은데 신약이라 감당할 체력과 범위를 정하는 게 관건이야.':'재성 '+fp+'%로 돈 흐름에 밝고, 기회를 크게 굴리는 쪽이야.'):fp<=8?'재성 '+fp+'%로 돈 감각을 타고나기보다, 실력·자격('+m.top+')이 돈으로 바뀌는 구조야.':'재성 '+fp+'%로 무리하지 않고, '+POWER[m.top].replace(' 힘','')+' 결과가 돈으로 이어지는 편이야.';
  if(m.luck){var lg=m.luckG,rel=lg===m.top?'원래 강한 '+m.top+'에 같은 힘이 더해져서, 잘하던 방식이 힘을 받지만 쏠림은 조심해야 해':lg===m.lowG?'부족했던 '+lg+'이 채워지는 시기라, 그동안 어렵던 부분이 풀리기 쉬워':(m.tier==='약'&&(lg==='관성'||lg==='재성'))?'신약한 구조에 '+lg+'이 들어와 해야 할 일과 압박이 커지는 시기야. 범위를 줄이는 게 먼저야':(m.tier==='약'&&(lg==='인성'||lg==='비겁'))?'신약한 구조를 '+lg+'이 받쳐 줘서 힘이 붙는 시기야':(m.tier==='강'&&(lg==='비겁'||lg==='인성'))?'이미 강한 구조에 '+lg+'이 더해져 고집과 과신을 조심할 시기야':'원래 중심('+m.top+')과 다른 '+lg+'의 과제가 들어오는 시기야';
    k.timing='지금 대운 '+m.luck.ko+'('+m.luck.god+'): '+rel+'.';}
  else k.timing='대운 시작 전이라 원국의 바탕을 다지는 시기야.';
  k.stars=m.stars.length?m.stars.map(function(s){return s.name}).join('·')+'은 원국의 '+m.top+' 흐름을 거드는 보조 신호야. 원국보다 앞세우지 않고 덤으로 읽어.':'원국 흐름과 직접 맞물리는 신살은 적어. 신살보다 원국 구조를 먼저 보면 돼.';
  k.core='이번 주 한 가지: '+(m.lowG?LOWNEED[m.lowG]+'을 일정에 한 칸 넣어 봐.':(m.dayRel?'가까운 사람과 같은 지점에서 부딪히면 그 자리에서 결론 내지 말고 하루 뒤에 다시 말해 봐.':m.rest+'을 일정에 먼저 넣고, 남는 시간에 일을 배치해 봐.'));
  return k;
}
function evFor(m,id){var e=m.ev;var map={self:[e.ML,e.STR,e.TOP],inside:[e.TOP,e.STR],people:[e.MG,e.DB],love:[e.DB,e.REL],work:[e.ML,e.TOP],money:[e.TOP,e.STR],timing:[e.LUCK,e.STR],stars:[e.STAR,e.ML],core:[e.TOP]};return (map[id]||[]).filter(Boolean)}
/* 강약과 어긋나는 문장이 있는 단락에 보정 한 줄 (원문 유지) */
function reconcile(m,text){text=String(text||'').replace(/[^.!?]*(관계는 (생각보다 )?흔들리지 않|말은 쉽게 흔들리지 않)[^.!?]*[.!?]/g,'');
  if(m.tier==='약'&&STRONG.test(text))return '다만 강약이 '+tierText(m)+'이라, 위의 힘은 혼자 밀어붙일 때보다 곁의 지지와 확신이 생긴 뒤에 제대로 나와.';
  if(m.tier==='강'&&WEAK.test(text))return '다만 강약이 '+tierText(m)+'이라, 기운이 모자라서라기보다 힘을 한쪽에 몰아 쓰다 지치는 쪽에 가까워.';
  return '';
}
function audit(m,text){var out=[];String(text||'').replace(/([.!?])\s+/g,'$1\u0001').split('\u0001').forEach(function(s){if(SAFE.test(s))return;if(m.tier==='약'&&STRONG.test(s))out.push({type:'강약-강함표현',s:s});if(m.tier==='강'&&WEAK.test(s))out.push({type:'강약-약함표현',s:s});if(m.pct['재성']<=8&&/돈 감각(을|이) 타고/.test(s))out.push({type:'재성부족-돈감각',s:s})});return out}

/* 궁합: 기존 12개 섹션을 4묶음으로 */
var PAIR_GROUP=[
 {k:'strength',t:'관계의 장점',ic:'💞',ids:['pair-core','pair-attraction','pair-weight']},
 {k:'friction',t:'갈등이 생기는 지점',ic:'⚡',ids:['pair-conflict','pair-cooling','pair-pull']},
 {k:'talk',t:'소통과 생활 방식',ic:'💬',ids:['pair-rules','pair-space','pair-money']},
 {k:'long',t:'장기적인 관계 흐름',ic:'🧭',ids:['pair-structure','pair-conditions','pair-final']}];
function pairModel(a,b){var A=model(a),B=model(b);if(!A||!B)return null;
  var lines={
   strength:A.name+'의 '+POWER[A.top]+'과 '+B.name+'의 '+POWER[B.top]+(A.top===B.top?'이 같은 결이라 말이 덜 필요한 편안함이 있어.':'이 서로 달라서 빈 곳을 채워 줄 수 있어.'),
   friction:'부딪힘은 두 사람의 장점이 과하게 쓰일 때 생겨. '+J(A.name,'는','은')+' '+OVER[A.top].split('너무 쓰면 ')[1].replace(/\.$/,'')+', '+J(B.name,'는','은')+' '+OVER[B.top].split('너무 쓰면 ')[1]+'.'+(A.tier!=='중'||B.tier!=='중'?' 압박이 오면 '+(A.tier!=='중'?J(A.name,'는','은')+' '+PRESS[A.top][A.tier]:J(B.name,'는','은')+' '+PRESS[B.top][B.tier])+'.':''),
   talk:J(A.name,'는','은')+' '+NEED[A.dayG]+', '+J(B.name,'는','은')+' '+NEED[B.dayG]+'을 바라. 이걸 서로 말로 알려 주는 게 소통의 시작이야.',
   long:(A.tier===B.tier?'두 사람 강약이 비슷해서 주도권 다툼보다 속도 맞추기가 과제야.':(A.score>B.score?A.name:B.name)+' 쪽 기운이 더 강해서, 결정이 한쪽으로 쏠리지 않게 역할을 나누는 게 오래 가는 조건이야.')};
  var GM={비견:'친구처럼 대등한 사람',겁재:'대등하면서 은근히 경쟁하게 되는 사람',식신:'편하게 돌봐 주고 싶은 사람',상관:'자꾸 말하고 표현하게 만드는 사람',정재:'현실적으로 아끼고 챙기고 싶은 사람',편재:'신경 쓰이고 움직이게 만드는 사람',정관:'나를 단정하게 잡아 주는 사람',편관:'긴장되지만 강하게 끌리는 사람',정인:'기대고 배울 수 있는 사람',편인:'다른 시각을 열어 주는 사람'};
  var ca=a.pillars.day,cb=b.pillars.day,gAB=godOf(ca.stemIndex,cb.stemIndex),gBA=godOf(cb.stemIndex,ca.stemIndex);
  var dr=[];try{dr=(window.GuiinSaju.chartRelations([ca,cb])||[]).map(function(r){return r.type})}catch(_e){}
  lines.strength+=' 일간끼리 보면 '+J(B.name,'는','은')+' '+A.name+'에게 '+(GM[gAB]||gAB)+'('+gAB+(bat(gAB)?')이고, ':')고, ')+J(A.name,'는','은')+' '+B.name+'에게 '+(GM[gBA]||gBA)+'('+gBA+(bat(gBA)?')이야.':')야.');
  lines.long+=(dr.length?' 두 사람 일주 사이에는 '+J(dr.join('·'),'가','이')+' 있어. '+(dr.some(function(t){return /합/.test(t)})?'합이 있다고 늘 좋은 건 아니고, 서로 맞추다 불편한 말을 미루기 쉬운 점도 같이 봐야 해.':'')+(dr.some(function(t){return /충|형|파|해/.test(t)})?'충·형이 있다고 나쁜 궁합이 아니라, 생활 리듬이 부딪히는 지점이 분명하다는 뜻이라 미리 규칙을 정하면 돼.':''):' 두 사람 일주 사이에 직접적인 합·충은 없어서, 관계의 온도는 생활 습관과 대화 방식이 정해.');
  var ev={strength:[A.ev.TOP,B.ev.TOP,'일간 관계 '+gAB+'/'+gBA],friction:[A.ev.STR,B.ev.STR],talk:[A.ev.DB,B.ev.DB],long:[A.ev.STR,B.ev.STR,dr.length?'일주 관계 '+dr.join('·'):'일주 직접 관계 없음']};
  return {A:A,B:B,lines:lines,ev:ev,dayGods:[gAB,gBA],dayRels:dr};}

window.GUIIN_READING_V1={version:VER,on:ON,model:model,audit:audit,reconcile:reconcile,pairModel:pairModel,keysFor:function(c){var m=model(c);return m&&m.key}};
if(!ON)return;

/* ================= 2. 풀이 화면 가독성 (표시만) ================= */
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(x){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[x]})}
var CSS='#resultView .expertSection p,#resultView .guiinIntegratedStars p{font-size:16px!important;line-height:1.75!important;word-break:keep-all}#resultView .heroCopy,#resultView .gsaHead{font-size:13.5px!important;line-height:1.6!important}#resultView.gR1{display:flex;flex-direction:column}'+
'#resultView.gR1>*{order:20}#resultView.gR1>.guiinReadingTools{order:0}#resultView.gR1>.manseSnapshot{order:2}#resultView.gR1>.gR1Glance{order:1}#resultView.gR1>.guiinReadingTOC{order:7}#resultView.gR1>.expertSection{order:4}#resultView.gR1>.gR1Extra{order:4}#resultView.gR1>.gR1More{order:6}#resultView.gR1>.r28People,#resultView.gR1>.r23Evidence,#resultView.gR1>.guiinVisualHero,#resultView.gR1>.gdv,#resultView.gR1>.easyIntro{order:7}#resultView.gR1>.r21ActionBoard{order:5}'+
'.gR1Glance{background:#fff;border:1px solid #e6dfcf;border-radius:20px;padding:20px 18px;margin:10px 0 14px;box-shadow:0 2px 10px rgba(40,50,30,.05)}'+
'.gR1Glance .gR1Eyebrow{font-size:13px;font-weight:800;color:#0b6b4f;letter-spacing:.02em;margin:0 0 6px}'+
'.gR1Glance h2{font-size:21px;line-height:1.45;margin:0 0 12px;color:#1f2a22;word-break:keep-all}'+
'.gR1Lay{display:grid;gap:8px;margin:0 0 14px}.gR1Lay div{background:#f7f5ef;border-radius:12px;padding:10px 12px}.gR1Lay b{display:block;font-size:13px;color:#6b6352;margin-bottom:2px}.gR1Lay span{font-size:15.5px;line-height:1.6;color:#263028;word-break:keep-all}'+
'.gR1Map{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin:0;padding:0;list-style:none}.gR1Map a{display:flex;gap:4px;align-items:center;justify-content:center;min-height:44px;text-decoration:none;color:#263028;padding:6px 4px;border-radius:12px;border:1px solid #eee7d8;background:#fffdf8}.gR1Map a i{font-style:normal;font-size:15px}.gR1Map a b{font-size:13.5px;color:#2f3a31;white-space:nowrap}'+
'#resultView.gR1Sec .expertSection{border-left:4px solid var(--gA,#0b6b4f);background:#fff!important;border-radius:16px;padding:18px 16px 16px!important;margin:0 0 16px!important;scroll-margin-top:150px}'+
'#resultView.gR1Sec .expertSection>h3{font-size:19px!important;line-height:1.45!important;margin:8px 0 10px!important;word-break:keep-all}'+
'.gR1Badge{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:800;color:var(--gA,#0b6b4f);background:var(--gB,#eef6f1);border-radius:999px;padding:4px 10px}'+
'.gR1Key{background:var(--gB,#eef6f1);border-radius:12px;padding:12px 14px;margin:0 0 10px;font-size:16px;line-height:1.65;font-weight:700;color:#1f2a22;word-break:keep-all}.gR1Key small{display:block;font-size:12.5px;font-weight:800;color:var(--gA);margin-bottom:2px}'+
'.gR1Ev{margin:0 0 12px}.gR1Ev summary{font-size:13.5px;color:#5d6658;cursor:pointer;list-style:none;padding:4px 0}.gR1Ev summary::before{content:"📌 "}.gR1Ev ul{margin:6px 0 0;padding:0;list-style:none;display:flex;flex-wrap:wrap;gap:6px}.gR1Ev li{font-size:13px;background:#f4f2ec;border-radius:8px;padding:4px 8px;color:#444}'+
'.gR1Per ol{margin:8px 0 0;padding-left:20px}.gR1Per ol li,.gR1Cf li{font-size:15px;line-height:1.65;margin:0 0 8px;word-break:keep-all;background:none!important;padding:0!important}.gR1Per ol li b{display:block;font-size:13.5px;color:#0b6b4f}.gR1Per ol li small{display:block;font-size:12.5px;color:#8a8270}.gR1Cf{display:block!important}.gR1Cf li{list-style:disc;margin-left:18px}'+
'.gR1Lbl{font-size:12.5px;font-weight:800;color:#8a8270;margin:4px 0 6px}'+
'#resultView.gR1Sec .expertSection p{font-size:16px!important;line-height:1.8!important;margin:0 0 12px!important;color:#2a312b;word-break:keep-all}'+
'#resultView.gR1Sec .expertSection p strong{font-weight:700}'+
'.gR1Note{font-size:15px!important;background:#fff8e6;border-radius:10px;padding:10px 12px}'+
'.gR1More{background:#f7f5ef;border-radius:16px;padding:14px 16px;margin:6px 0 12px}.gR1More button{width:100%;min-height:48px;border:1px solid #d8cfba;background:#fff;border-radius:12px;font-size:15px;font-weight:800;color:#3c4a3f}'+
'#resultView.gR1:not(.gR1Open)>.r28People,#resultView.gR1:not(.gR1Open)>.r23Evidence,#resultView.gR1:not(.gR1Open)>.guiinVisualHero,#resultView.gR1:not(.gR1Open)>.gdv,#resultView.gR1:not(.gR1Open)>.easyIntro,#resultView.gR1:not(.gR1Open)>.guiinReadingTOC{display:none!important}'+
'#gR1Now{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(92px + env(safe-area-inset-bottom,0px));z-index:60;max-width:calc(100% - 24px);display:none;align-items:center;gap:8px;background:rgba(255,255,255,.96);border:1px solid #e3dccb;border-radius:999px;padding:6px 14px;font-size:14px;font-weight:800;color:#24302a;box-shadow:0 4px 14px rgba(0,0,0,.08);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#gR1Now.on{display:flex}#gR1Now em{font-style:normal;color:#8a8270;font-weight:700}'+
'@media(min-width:768px){.gR1Map{grid-template-columns:repeat(5,minmax(0,1fr))}.gR1Lay{grid-template-columns:1fr 1fr}#resultView.gR1Sec .expertSection{padding:22px 24px!important}}'+
/* 궁합 */
'.gR1PG{margin:22px 0 10px;padding:14px 16px;border-radius:16px;background:var(--gB);border-left:4px solid var(--gA)}.gR1PG .gR1Badge{background:#fff;font-size:15px}.gR1PG p{margin:0;font-size:16px;line-height:1.7;color:#2a312b;word-break:keep-all}.gR1PG .gR1Ev{margin:8px 0 0}'+
'.gR1Pair [data-gr1-pair]{border-left:4px solid var(--gA)!important;background:#fff!important;border-radius:16px;scroll-margin-top:64px}.gR1Pair [data-gr1-pair] p{font-size:16px!important;line-height:1.8!important;word-break:keep-all}.gR1Pair [data-gr1-pair] h3{font-size:18px!important;line-height:1.45!important}'+
'.gR1PG,.gR1Pair [data-gr1-pair]{scroll-margin-top:150px}.gR1PGKey{margin:8px 0 0!important;font-weight:700}.gR1PGKey b{color:var(--gA);font-size:13px;margin-right:4px}.gR1Map4{grid-template-columns:repeat(2,minmax(0,1fr))!important}.gR1PNav{background:#fff;border:1px solid #e6dfcf;border-radius:16px;padding:12px 14px;margin:12px 0}'+
'#matchView.gR1Pair:not(.gR1POpen) .r28People,#matchView.gR1Pair:not(.gR1POpen) [data-integrated-person],#matchView.gR1Pair:not(.gR1POpen) .r28PairMix,#matchView.gR1Pair:not(.gR1POpen) .r23CompatCa,#matchView.gR1Pair:not(.gR1POpen) .r26DeepCard{display:none!important}';
var COL={marriage:['#b5541c','#fbefe6'],health:['#2f7d6b','#e9f6f2'],self:['#0b6b4f','#eaf5ef'],inside:['#6a5acd','#f0eefb'],people:['#2c7a9a','#e9f4f8'],love:['#c2456b','#fcedf2'],work:['#8a5a12','#f8f1e4'],money:['#a07800','#fbf5dc'],timing:['#3b5bb5','#ecf0fb'],stars:['#7a4fb0','#f3edfa'],core:['#2f7d32','#edf7ed'],strength:['#c2456b','#fcedf2'],friction:['#b5541c','#fbefe6'],talk:['#2c7a9a','#e9f4f8'],long:['#3b5bb5','#ecf0fb']};
function css(){if(document.getElementById('gR1Css'))return;var s=document.createElement('style');s.id='gR1Css';s.textContent=CSS;document.head.appendChild(s)}
function getChart(){try{return typeof chart!=='undefined'?chart:null}catch(_e){return null}}
function splitLong(p){ /* 220자 넘는 단락은 문장 단위로 2~3문장씩 나눔 (내용 동일) */
  if(p.dataset.gR1Split||p.querySelector('*:not(strong):not(b):not(em)')||p.textContent.length<240)return;
  var parts=p.innerHTML.replace(/([.!?])\s+(?=[^<]*(?:<|$))/g,'$1\u0001').split('\u0001');if(parts.length<4)return;
  var out=[],buf=[];parts.forEach(function(x){buf.push(x);if(buf.join(' ').replace(/<[^>]+>/g,'').length>150){out.push(buf.join(' '));buf=[]}});if(buf.length)out.push(buf.join(' '));
  if(out.length<2)return;p.dataset.gR1Split='1';p.innerHTML=out[0];var ref=p;for(var i=1;i<out.length;i++){var n=document.createElement('p');n.dataset.gR1Split='1';n.innerHTML=out[i];ref.after(n);ref=n}
}
function enhanceResult(){
  var v=document.getElementById('resultView');if(!v)return;var secs=v.querySelectorAll(':scope>.expertSection[data-human-section]');if(!secs.length){if(v.classList.contains('gR1Sec')||v.classList.contains('gR1')){v.classList.remove('gR1','gR1Sec','gR1Open');delete v.dataset.gR1Key;var nb=document.getElementById('gR1Now');if(nb)nb.classList.remove('on')}return;}
  var c=getChart(),m=model(c);if(!m)return;
  var tab='summary';try{tab=typeof currentTab!=='undefined'?currentTab:'summary'}catch(_e){}
  var sig=m.c.pillars.day.ko+m.score+'|'+tab;if(v.dataset.gR1Key===sig&&v.querySelector('.gR1Key'))return;
  v.dataset.gR1Key=sig;css();v.classList.add('gR1Sec');v.classList.toggle('gR1',tab==='summary');
  secs=[].filter.call(secs,function(s){return AREA[s.dataset.humanSection]});if(!secs.length)return;
  /* 한눈에 보기 */
  var old=v.querySelector('.gR1Glance');if(old)old.remove();
  if(tab==='summary'){
  var g=document.createElement('section');g.className='gR1Glance';g.setAttribute('aria-label','한눈에 보기');
  g.innerHTML='<p class="gR1Eyebrow">한눈에 보기 · 원국 근거 순서: 월령 → 원국 → 신살</p><h2>'+esc(m.key.self)+'</h2>'+
   '<div class="gR1Lay">'+m.layers.map(function(l){return '<div><b>'+esc(l.k)+'</b><span>'+esc(l.t)+'</span></div>'}).join('')+'</div>'+
   '<details class="gR1Ev gR1Per"><summary>성격을 11가지로 나눠 보기 (근거 포함)</summary><ol>'+m.persona.map(function(x){return '<li><b>'+esc(x.k)+'</b> '+esc(x.t)+'<small>'+esc(x.ev.join(' · '))+'</small></li>'}).join('')+'</ol></details>'+(m.conflicts.length?'<details class="gR1Ev gR1Per"><summary>서로 다른 신호 '+m.conflicts.length+'개 — 어떤 조건에서 어떻게 나오는지</summary><ul class="gR1Cf">'+m.conflicts.map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ul></details>':'')+'<p class="gR1Lbl">풀이 목차 — 누르면 바로 가</p><ul class="gR1Map">'+[].map.call(secs,function(s,i){var id=s.dataset.humanSection;return '<li><a href="#'+s.id+'" data-gr1-go="'+s.id+'"><i>'+(ICON[id]||'•')+'</i><b>'+(i+1)+'. '+(AREA[id]||'')+'</b></a></li>'}).join('')+'</ul>';
  v.insertBefore(g,v.firstChild);
  g.addEventListener('click',function(e){var a=e.target.closest('[data-gr1-go]');if(!a)return;e.preventDefault();var t=document.getElementById(a.dataset.gr1Go);if(t)t.scrollIntoView({behavior:'smooth',block:'start'})});
  }
  /* 섹션별: 배지 · 핵심 · 근거 · 설명 */
  [].forEach.call(secs,function(s){var id=s.dataset.humanSection,col=COL[id]||COL.self;s.style.setProperty('--gA',col[0]);s.style.setProperty('--gB',col[1]);
    if(s.querySelector('.gR1Key'))return;var h=s.querySelector('h3');if(!h)return;
    var badge=document.createElement('span');badge.className='gR1Badge';badge.textContent=(ICON[id]||'')+' '+(AREA[id]||'풀이');h.before(badge);
    var key=document.createElement('div');key.className='gR1Key';key.innerHTML='<small>핵심</small>'+esc((id==='self'?m.key.selfSec:m.key[id])||'');h.after(key);
    var evs=evFor(m,id);if(evs.length){var d=document.createElement('details');d.className='gR1Ev';d.innerHTML='<summary>이렇게 읽은 사주 근거 '+evs.length+'개</summary><ul>'+evs.map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ul>';key.after(d);var lb=document.createElement('p');lb.className='gR1Lbl';lb.textContent='자세한 설명';d.after(lb)}
    var txt=s.innerText,fix=reconcile(m,txt);if(fix&&!s.querySelector('.gR1Note')){var n=document.createElement('p');n.className='gR1Note';n.textContent=fix;var ps=s.querySelectorAll('p:not(.gR1Lbl)');(ps[1]||ps[0]||key).after(n)}
    [].forEach.call(s.querySelectorAll('p:not(.gR1Lbl):not(.gR1Note)'),splitLong);
  });
  if(tab==='summary'){var money=v.querySelector(':scope>.expertSection[data-human-section=money]');if(money&&!v.querySelector('.gR1Extra')){['marriage','health'].forEach(function(id){var col=COL[id];var c2=document.createElement('article');c2.className='expertSection gR1Extra';c2.dataset.gr1Area=id;c2.id='gR1-'+id;c2.style.setProperty('--gA',col[0]);c2.style.setProperty('--gB',col[1]);var evs=id==='marriage'?[m.ev.DB,m.ev.REL]:['오행 '+['목','화','토','금','수'].map(function(e){return e+' '+Math.round(m.elPct[e]||0)+'%'}).join(' · ')];c2.innerHTML='<span class="gR1Badge">'+ICON[id]+' '+AREA[id]+'</span><h3>'+(id==='marriage'?'오래 함께 살 때 드러나는 모습':'몸과 마음의 리듬 관리')+'</h3><div class="gR1Key"><small>핵심</small>'+esc(m.key[id])+'</div><details class="gR1Ev"><summary>이렇게 읽은 사주 근거</summary><ul>'+evs.filter(Boolean).map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ul></details>';money.after(c2);money=c2})}}
  /* 중복 블록은 지우지 않고 접기 */
  if(tab==='summary'&&!v.querySelector('.gR1More')){var more=document.createElement('div');more.className='gR1More';more.innerHTML='<button type="button" aria-expanded="false">같은 풀이를 다른 방식으로 다시 보기 (요약·있는 그대로·근거) 펼치기</button>';v.appendChild(more);
    more.querySelector('button').addEventListener('click',function(){var o=v.classList.toggle('gR1Open');this.setAttribute('aria-expanded',o?'true':'false');this.textContent=o?'다시 접기':'같은 풀이를 다른 방식으로 다시 보기 (요약·있는 그대로·근거) 펼치기'})}
  nowBar(secs);
}
var io=null;
function nowBar(secs){
  var b=document.getElementById('gR1Now');if(!b){b=document.createElement('div');b.id='gR1Now';b.setAttribute('aria-live','polite');document.body.appendChild(b)}
  if(io)io.disconnect();if(!('IntersectionObserver' in window))return;var total=secs.length;
  io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var s=e.target,id=s.dataset.humanSection,i=[].indexOf.call(secs,s)+1;b.innerHTML=(ICON[id]||'')+' 지금 읽는 중: '+(AREA[id]||'')+' <em>'+i+'/'+total+'</em>';b.style.color=(COL[id]||COL.self)[0]})},{rootMargin:'-45% 0px -50% 0px'});
  [].forEach.call(secs,function(s){io.observe(s)});
  var res=document.getElementById('result');
  function vis(){var on=res&&res.classList.contains('active')&&secs[0].isConnected&&secs[0].getBoundingClientRect().top<120&&secs[secs.length-1].getBoundingClientRect().bottom>120;b.classList.toggle('on',!!on)}
  if(!window.__gR1Scroll){window.__gR1Scroll=1;window.addEventListener('scroll',function(){var s=document.querySelectorAll('#resultView>.expertSection[data-human-section]');if(!s.length){b.classList.remove('on');return}var res2=document.getElementById('result');b.classList.toggle('on',!!(res2&&res2.classList.contains('active')&&s[0].getBoundingClientRect().top<120&&s[s.length-1].getBoundingClientRect().bottom>120))},{passive:true})}
  vis();
}
function enhanceMatch(){
  var mv=document.getElementById('matchView');if(!mv)return;
  var byId={};[].forEach.call(mv.querySelectorAll('[data-human-section^="pair-"]'),function(el){var k=el.dataset.humanSection;if(!byId[k])byId[k]=el});
  if(!byId['pair-core']||mv.querySelector('.gR1PG'))return;
  var meta=null;try{meta=typeof matchMeta!=='undefined'?matchMeta:null}catch(_e){}
  var pm=meta&&meta.a&&meta.b?pairModel(meta.a,meta.b):null;css();mv.classList.add('gR1Pair');
  var anchor=byId['pair-core'],parent=anchor.parentNode,ref=null;
  PAIR_GROUP.forEach(function(gp){var els=gp.ids.map(function(id){return byId[id]}).filter(function(el){return el&&el.parentNode===parent});if(!els.length)return;
    var col=COL[gp.k];var h=document.createElement('div');h.className='gR1PG';h.id='gR1PG-'+gp.k;h.style.setProperty('--gA',col[0]);h.style.setProperty('--gB',col[1]);
    h.innerHTML='<span class="gR1Badge">'+gp.ic+' '+gp.t+'</span>'+(pm?'<p class="gR1PGKey"><b>핵심</b> '+esc(pm.lines[gp.k])+'</p><details class="gR1Ev"><summary>이렇게 읽은 사주 근거</summary><ul>'+pm.ev[gp.k].filter(Boolean).map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ul></details>':'');
    if(ref)ref.after(h);else parent.insertBefore(h,anchor);ref=h;
    els.forEach(function(el){el.setAttribute('data-gr1-pair',gp.k);el.style.setProperty('--gA',col[0]);el.style.setProperty('--gB',col[1]);ref.after(el);ref=el});
  });
  /* 궁합 목차 */
  var core=mv.querySelector('#gR1PG-strength'),hero=mv.querySelector('.matchHero');if(core&&!mv.querySelector('.gR1PNav')){var nav=document.createElement('nav');nav.className='gR1PNav';nav.setAttribute('aria-label','궁합 풀이 목차');nav.innerHTML='<p class="gR1Lbl">궁합 풀이 목차 — 누르면 바로 가</p><ul class="gR1Map gR1Map4">'+PAIR_GROUP.map(function(gp){return '<li><a href="#gR1PG-'+gp.k+'" data-gr1-go="gR1PG-'+gp.k+'"><i>'+gp.ic+'</i><b>'+gp.t.replace('관계의 ','').replace('이 생기는 지점','').replace('적인 관계 흐름',' 흐름')+'</b></a></li>'}).join('')+'</ul>';if(hero)hero.after(nav);else core.before(nav);
    nav.addEventListener('click',function(e){var a=e.target.closest('[data-gr1-go]');if(!a)return;e.preventDefault();var t=document.getElementById(a.dataset.gr1Go);if(t)t.scrollIntoView({behavior:'smooth',block:'start'})})}
  /* 같은 주제를 다시 풀어 쓴 카드들은 지우지 않고 '주제별 더 깊이 보기'로 접기 */
  var extra=mv.querySelectorAll('.r28People,[data-integrated-person],.r28PairMix,.r23CompatCa,.r26DeepCard');
  if(extra.length&&extra[0].closest('details')){mv.classList.add('gR1POpen')}
  else if(extra.length&&!mv.querySelector('.gR1PMore')){var mb=document.createElement('div');mb.className='gR1More gR1PMore';mb.innerHTML='<button type="button" aria-expanded="false">주제별로 더 깊이 보기 ('+extra.length+'개) 펼치기</button>';extra[0].parentNode.insertBefore(mb,extra[0]);
    mb.querySelector('button').addEventListener('click',function(){var o=mv.classList.toggle('gR1POpen');this.setAttribute('aria-expanded',o?'true':'false');this.textContent=o?'다시 접기':'주제별로 더 깊이 보기 ('+extra.length+'개) 펼치기'})}
}
function run(){if(!ON)return;try{enhanceResult()}catch(e){try{console.warn('[gR1]',e)}catch(_){}}try{enhanceMatch()}catch(e){try{console.warn('[gR1m]',e)}catch(_){}}}
var t=null;function sched(){clearTimeout(t);t=setTimeout(run,250)}
function boot(){try{css()}catch(_e){}run();try{var mo=new MutationObserver(function(ms){for(var i=0;i<ms.length;i++){var x=ms[i].target;if(x&&(x.id==='resultView'||x.id==='matchView'||(x.closest&&x.closest('#resultView,#matchView')))){sched();return}}});mo.observe(document.body,{childList:true,subtree:true})}catch(_e){}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
