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
    var g=ys.god,gw=GODWORD[g]||'';
    var out='<div class="mini">'+TARGET+' 신년운세</div><h3>'+TARGET+'년 '+esc(p?p.ko+'('+(p.hanja||'')+')':'')+'년은 너에게 '+esc(g)+'('+esc(gw)+')의 해야</h3>';
    out+='<p>'+esc(YEAR10[g]||'')+'</p>';
    if(prev&&prev.god&&pp)out+='<p>'+esc((TARGET-1)+'년('+pp.ko+')이 '+prev.god+'('+(GODWORD[prev.god]||'')+')의 해였다면, '+TARGET+'년은 '+g+'('+gw+')의 해로 주제가 '+(prev.god===g?'이어져.':'바뀌어.'))+'</p>';
    var r=p&&topRel(c,p);
    if(r)out+='<p>'+esc(TARGET+'년의 글자가 네 '+r.aLabel+'와 '+jo(r.type,'으로','로')+' 걸려서, '+AREA[r.aKey]+' 쪽에서 '+(RELTX[r.type]||''))+'</p>';
    else out+='<p>'+esc(TARGET+'년의 글자는 네 원국과 크게 부딪히거나 묶이지 않아서, 한 해의 주제를 차분하게 쓰기 좋아.')+'</p>';
    var L=curLuck(c);
    if(L&&L.next){var I=c.input||{};var startY=Math.floor(Number(I.year)+Number(L.next.fromAgeExact));if(startY===TARGET||startY===TARGET+1)out+='<p>'+esc(startY+'년쯤 대운이 '+L.cur.ko+'('+L.cur.god+')에서 '+L.next.ko+'('+L.next.god+')로 바뀌어. 10년 단위 배경이 바뀌는 때라, 큰 계획은 그 흐름까지 함께 봐.')+'</p>'}
    try{var sj=h.samjae;if(sj&&(sj.active||sj.isSamjae||sj.stage)){var st=sj.stageLabel||sj.label||sj.stage||'';out+='<p class="nyNote">'+esc(TARGET+'년은 전통적으로 말하는 삼재'+(st?'('+st+')':'')+'에 해당해. 겁낼 일이 아니라 큰 변화를 서두르지 말라는 참고로만 봐.')+'</p>'}}catch(_e){}
    if(months.length){
      var used={};var pick=function(k,uniq){var l=months.slice().sort(function(a,b){return (Number(b.scores&&b.scores[k]||0)-Number(a.scores&&a.scores[k]||0))||a.month-b.month});var m=uniq?(l.filter(function(x){return !used[x.month]})[0]||l[0]):l[0];if(m&&uniq)used[m.month]=1;return m};
      var best=[['돈','money'],['일·성과','career'],['관계','relationship']].map(function(x){var m=pick(x[1],true);return m?'<li><b>'+x[0]+'</b> '+m.month+'월('+esc(m.pillar||'')+' · '+esc(m.god||'')+')</li>':''}).join('');
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
      else{ctx.fillStyle='#b9ad95';ctx.font='600 40px sans-serif';ctx.fillText('-',x+cw/2,y0+200)}
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

  function apply(){try{newYearCard($('resultView'))}catch(_e){}try{newYearCard($('yearView'))}catch(_e){}try{pairYears()}catch(_e){}try{saveBar()}catch(_e){}}
  window.guiinB6Apply=apply;
  var t1=null;function later(){clearTimeout(t1);t1=setTimeout(apply,340)}
  document.addEventListener('click',later,{passive:true});
  function observe(id){var n=$(id);if(n)new MutationObserver(later).observe(n,{childList:true})}
  function boot(){observe('resultView');observe('matchView');observe('yearView');setTimeout(apply,600)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
