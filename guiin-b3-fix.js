/* GUIIN_B3_FIX_V1 — 사주·궁합 해석 화면 보완 (화면 표시만, 계산·점수·신살 판정 변경 없음, 원문 삭제 없음)
   5) 성격·직업 탭: '전체 풀이'에서 이미 본 같은 단락은 접고 펼치기 제공
   6) 인생 흐름(대운) 탭: 지금 대운·나이·다음 대운을 맨 위에 표시, 전체 대운은 펼쳐 보기
      + 같은 조언 반복 표시를 카드당 한 줄로 묶고 펼치기 제공
   7) 행동판: 연말에 남은 달이 적으면 '앞으로 6개월'(다음 해 초 포함) 월운으로 비교 — 월운 계산 자체는 그대로
   9) 만세력 표 신살 칸: 귀인·길신 먼저, 나머지는 '+N개 더 보기'로 펼치기 */
(function(){
  if(window.__GUIIN_B3_FIX_V1__)return;window.__GUIIN_B3_FIX_V1__=true;
  function $(id){return document.getElementById(id)}
  function norm(t){return String(t||'').replace(/\s+/g,' ').trim()}
  function tabNow(){try{return typeof currentTab!=='undefined'?currentTab:''}catch(_e){return ''}}
  function chartNow(){try{return typeof chart!=='undefined'?chart:null}catch(_e){return null}}

  var css=document.createElement('style');css.id='GUIIN_B3_FIX_CSS';
  css.textContent=
   '#resultView:not(.guiinSeenOpen) .guiinSajuSeen{display:none!important}'
  +'.guiinSajuSeenBar{display:flex;align-items:center;gap:10px;margin:10px 0;padding:10px 12px;border-radius:14px;background:#f4faf2;border:1px solid #dce9df;font-size:13px;line-height:1.5;color:#4d5a52}'
  +'.guiinSajuSeenBar span{flex:1}.guiinSajuSeenBar button,.guiinRepeatToggle,.guiinStarMoreBtn{min-height:36px;padding:0 12px;border-radius:999px;border:1px solid #b9d5c3;background:#fff;color:#1f5a43;font-weight:800;font-size:13px;cursor:pointer}'
  +'.guiinRepeatOpen .guiinRepeatHidden{display:block!important;opacity:.85}.guiinRepeatOpen li.guiinRepeatHidden{display:list-item!important}'
  +'.guiinRepeatNoteDup{display:none!important}.guiinRepeatNote.guiinRepeatMerged{display:flex;align-items:center;gap:8px;flex-wrap:wrap}'
  +'.guiinRepeatToggle{min-height:30px;padding:0 10px;font-size:12px}'
  +'.guiinDaeunHead{margin:12px 0;padding:16px;border-radius:18px;background:#fffaf0;border:1px solid #ecdcb4}'
  +'.guiinDaeunHead .mini{font-size:12px;font-weight:800;color:#9a6a12;margin-bottom:6px}'
  +'.guiinDaeunHead h3{margin:0 0 6px;font-size:18px;line-height:1.45;color:#2d200c}'
  +'.guiinDaeunHead p{margin:0 0 8px;font-size:15px;line-height:1.7;color:#3a3226;word-break:keep-all}'
  +'.guiinDaeunHead .next{padding:10px 12px;border-radius:12px;background:rgba(255,255,255,.75);border:1px solid #f0e3c4;font-size:14px;line-height:1.65}'
  +'.guiinDaeunHead details{margin-top:10px}.guiinDaeunHead summary{cursor:pointer;font-weight:800;color:#1f5a43;font-size:14px;min-height:36px;display:flex;align-items:center}'
  +'.guiinDaeunList{list-style:none;margin:8px 0 0;padding:0}.guiinDaeunList li{padding:9px 10px;border-bottom:1px solid #f0e6cf;font-size:14px;line-height:1.6;color:#3a3226}'
  +'.guiinDaeunList li.now{background:#fff3cf;border-radius:10px;font-weight:700}.guiinDaeunList b{display:inline-block;min-width:118px;color:#2d200c}'
  +'.guiinStarMoreHide .guiinStarMore{display:none!important}.guiinStarMoreRow{margin:8px 0 2px;text-align:center}'
  +'#resultView .guiinTrust23,#resultView .guiinTrust23 *,#resultView .guiinEngine24 .mini,#resultView .guiinEngine24 .e24Cell b,#resultView .guiinEngine24 .e24Badge,#resultView .guiinEngine24 .e24Foot,#resultView .guiinEngine24 summary{font-size:12px!important}'
  +'.guiinDayLine{margin-top:10px;padding:14px 16px;border-radius:16px;background:#fbfaf3;border:1px solid #e7e0c8}.guiinDayLine .mini{font-size:12px;font-weight:800;color:#8b713d;margin-bottom:6px}.guiinDayLine p{margin:0 0 6px;font-size:14.5px;line-height:1.7;color:#3a3226;word-break:keep-all}'
  +'.guiinPeriodDays{margin-top:10px;padding:14px 16px;border-radius:16px;background:#fbfaf3;border:1px solid #e7e0c8}.guiinPeriodDays .mini{font-size:12px;font-weight:800;color:#8b713d;margin-bottom:6px}.guiinPeriodDays p{margin:0 0 6px;font-size:14px;line-height:1.7;color:#3a3226;word-break:keep-all}.guiinPeriodDays .pdNote{font-size:12.5px;color:#8a7d66}.pdList{list-style:none;margin:0;padding:0}.pdList li{padding:7px 0;border-bottom:1px solid #f0e8d4;font-size:14px;line-height:1.6;color:#3a3226}.pdList li b{display:inline-block;min-width:112px}.pdTag{display:inline-block;font-size:12px;font-weight:800;border-radius:8px;padding:1px 7px;margin-right:4px}.pdTag.w{background:#fde8e1;color:#9a3b1f}.pdTag.g{background:#e3f2e6;color:#1f6a35}.pdTag.n{background:#eef0ec;color:#5b625c}'
  +'.guiinGenderNote{display:flex;align-items:center;gap:10px;margin:10px 0;padding:10px 12px;border-radius:14px;background:#fff6e6;border:1px solid #f0d9a8;font-size:13px;line-height:1.5;color:#5a4a2a}.guiinGenderNote span{flex:1}.guiinGenderNote button{min-height:36px;padding:0 12px;border-radius:999px;border:1px solid #e3c27a;background:#fff;color:#7a5410;font-weight:800;font-size:13px}';
  (document.head||document.documentElement).appendChild(css);

  /* ---------- 5) 성격·직업 탭: 전체 풀이에서 본 단락 접기 ---------- */
  var SEEN={};
  function blockKey(el){
    var h=el.querySelector('h2,h3');return h?norm(h.textContent).slice(0,80):'';
  }
  function sajuSeen(){
    var v=$('resultView');if(!v)return;
    var sig=v.dataset.chartSignature||'';var t=tabNow();
    var cards=[].slice.call(v.querySelectorAll(':scope > .expertSection'));
    var secs=[].slice.call(v.querySelectorAll(':scope > .gdv .gdvSec'));
    if(t==='summary'){
      var s=SEEN[sig]||(SEEN[sig]={});
      cards.forEach(function(c){var k=blockKey(c);if(k)s['c:'+k]=1});
      secs.forEach(function(c){var k=blockKey(c);if(k)s['g:'+k]=1});
      clearSeen(v);return;
    }
    if(t!=='personality'&&t!=='fields'){clearSeen(v);return}
    var s2=SEEN[sig];if(!s2){clearSeen(v);return}
    var n=0;
    var core=t==='personality'?/^[123]\./:/^[4-7]\./;
    cards.forEach(function(c){var k=blockKey(c);var hit=k&&s2['c:'+k]&&!core.test(k);c.classList.toggle('guiinSajuSeen',!!hit);if(hit)n++});
    var g=v.querySelector(':scope > .gdv');
    if(g){var all=secs.length&&secs.every(function(c){var k=blockKey(c);return k&&s2['g:'+k]});g.classList.toggle('guiinSajuSeen',!!all);if(all)n++}
    var bar=v.querySelector(':scope > .guiinSajuSeenBar');
    if(!n){if(bar)bar.remove();v.classList.remove('guiinSeenOpen');return}
    if(!bar){
      bar=document.createElement('div');bar.className='guiinSajuSeenBar';bar.innerHTML='<span></span><button type="button">펼치기</button>';
      bar.querySelector('button').addEventListener('click',function(){v.classList.toggle('guiinSeenOpen');sync(bar,v)});
      var hero=v.querySelector(':scope > .guiinVisualHero');
      if(hero&&hero.parentNode===v)v.insertBefore(bar,hero.nextSibling);else v.insertBefore(bar,v.firstChild);
    }
    var left=cards.filter(function(c){return !c.classList.contains('guiinSajuSeen')}).length;
    bar.querySelector('span').textContent='‘전체 풀이’와 겹치는 단락 '+n+'개는 접어 두고, 이 탭의 핵심 내용은 펼쳐 뒀어.';
    sync(bar,v);
  }
  function sync(bar,v){var b=bar.querySelector('button');if(b)b.textContent=v.classList.contains('guiinSeenOpen')?'접기':'펼치기'}
  function clearSeen(v){
    [].forEach.call(v.querySelectorAll('.guiinSajuSeen'),function(e){e.classList.remove('guiinSajuSeen')});
    var bar=v.querySelector(':scope > .guiinSajuSeenBar');if(bar)bar.remove();v.classList.remove('guiinSeenOpen');
  }
  /* 목차에서 접힌 단락을 누르면 자동으로 펼침 */
  document.addEventListener('click',function(e){
    var a=e.target&&e.target.closest&&e.target.closest('.guiinReadingTOC a[href^="#"]');if(!a)return;
    var id=a.getAttribute('href').slice(1);var t=id&&document.getElementById(id);
    var v=$('resultView');if(t&&v&&t.closest('.guiinSajuSeen')&&!v.classList.contains('guiinSeenOpen')){v.classList.add('guiinSeenOpen');var bar=v.querySelector(':scope > .guiinSajuSeenBar');if(bar)sync(bar,v)}
  },true);

  /* ---------- 6) 대운 탭 머리 카드 ---------- */
  var GOD10={
    '비견':'내 기준과 독립심이 커지는 10년이야. 동료·경쟁 관계가 늘고, 스스로 정한 방식으로 일하고 싶어져.',
    '겁재':'사람과 돈이 함께 움직이는 10년이야. 동업·보증·큰 거래는 문서로 남기고 경계를 분명히 해.',
    '식신':'재능을 꾸준히 결과물로 쌓는 10년이야. 생활이 안정되고, 만든 것이 평판이 되기 쉬워.',
    '상관':'바꾸고 표현하고 싶은 마음이 커지는 10년이야. 이직·전환 같은 변화가 잦을 수 있어서 말과 계약을 더 챙겨.',
    '편재':'기회와 돈의 흐름이 커지는 10년이야. 넓힐수록 손실 한도도 같이 정해 두면 좋아.',
    '정재':'꾸준한 수입과 생활 기반을 다지는 10년이야. 저축과 자산의 바탕을 만들기 좋아.',
    '편관':'책임과 압박이 커지는 10년이야. 버티며 해결한 경험이 그대로 실력이 돼. 몸과 일정의 여유를 꼭 남겨.',
    '정관':'평가·직책·신뢰가 쌓이는 10년이야. 약속과 원칙을 지킬수록 인정받아.',
    '편인':'깊이 파고들고 혼자 정리할 시간이 늘어나는 10년이야. 전문성이 생기지만 생각만 길어지지 않게 해.',
    '정인':'배우고 도움을 받는 10년이야. 자격·문서·후원이 힘이 되고 마음이 안정되기 쉬워.'
  };
  function age(c){var I=c&&c.input||{};var bd=new Date(I.year,(I.month||1)-1,I.day||1,I.hour||0,I.minute||0);return (Date.now()-bd.getTime())/(365.2425*86400000)}
  function yr(c,a){var I=c&&c.input||{};return Math.floor(Number(I.year)+Number(a))}
  function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function daeunHead(v){
    if(!v)return;if(v.id==='resultView'&&tabNow()!=='flow')return;if(v.id==='yearView'&&!v.querySelector('.expertSection'))return;
    var c=chartNow();var L=c&&Array.isArray(c.luck)?c.luck:[];if(!L.length)return;
    var key=(v.dataset.chartSignature||(c.input?[c.input.year,c.input.month,c.input.day,c.input.hour,c.input.gender].join('-'):''))+'|'+L.length;
    var old=v.querySelector(':scope > .guiinDaeunHead');if(old&&old.getAttribute('data-k')===key)return;if(old)old.remove();
    var a=age(c),i=-1;for(var k=0;k<L.length;k++){if(a>=+L[k].fromAgeExact&&a<+L[k].toAgeExact){i=k;break}}
    if(i<0&&a<+L[0].fromAgeExact)i=-2;
    var cur=i>=0?L[i]:null,nx=i>=0?L[i+1]:(i===-2?L[0]:null);
    var html='<div class="mini">내 대운 한눈에</div>';
    if(cur){
      html+='<h3>지금은 '+esc(cur.ko)+'('+esc(cur.hanja||'')+') 대운 · '+esc(cur.god)+' · '+cur.fromAge+'~'+cur.toAge+'세</h3>';
      html+='<p>'+esc(GOD10[cur.god]||'')+' 대운은 10년 단위의 큰 배경이라, 아래 해마다·달마다 흐름은 이 배경 위에서 읽어.</p>';
    }else if(i===-2){
      html+='<h3>첫 대운은 '+L[0].fromAge+'세부터 시작해</h3><p>그 전까지는 타고난 원국과 해마다 바뀌는 세운을 중심으로 읽어.</p>';
    }
    if(nx)html+='<div class="next"><b>다음 대운</b> '+esc(nx.ko)+'('+esc(nx.hanja||'')+') · '+esc(nx.god)+' · '+nx.fromAge+'세부터 ('+yr(c,nx.fromAgeExact)+'년쯤)<br>'+esc(GOD10[nx.god]||'')+'</div>';
    html+='<details><summary>전체 대운 흐름 펼쳐 보기</summary><ul class="guiinDaeunList">'+L.map(function(x,k){return '<li'+(k===i?' class="now"':'')+'><b>'+x.fromAge+'~'+x.toAge+'세 · '+esc(x.ko)+'</b>'+esc(x.god)+(k===i?' · 지금':'')+'<br><span>'+esc(GOD10[x.god]||'')+'</span></li>'}).join('')+'</ul></details>';
    if(c.input&&c.input.hourUnknown){var uu=c.calculation&&c.calculation.uncertainty||{},cm=uu.candidates&&uu.candidates.month,rr=uu.startAgeExactRange,msg='';
      if(cm&&cm.length>1)msg='태어난 날이 절기가 바뀌는 날이라, 출생시각에 따라 대운의 순서와 시작 나이가 달라질 수 있어.';
      else if(rr&&rr.length===2&&Math.abs(rr[1]-rr[0])>=0.5)msg='출생시간을 몰라서 대운이 바뀌는 나이는 최대 '+Math.ceil(Math.abs(rr[1]-rr[0]))+'년 정도 차이 날 수 있어.';
      if(msg)html+='<p style="font-size:12.5px;color:#8a7d66;margin:8px 0 0">'+msg+'</p>';}
    var d=document.createElement('section');d.className='guiinDaeunHead';d.setAttribute('data-k',key);d.innerHTML=html;
    var intro=v.querySelector(':scope > .easyIntro');var hero=v.querySelector(':scope > .guiinVisualHero');var anchor=intro||hero;
    if(anchor&&anchor.parentNode===v)v.insertBefore(d,anchor.nextSibling);else v.insertBefore(d,v.firstChild);
  }

  /* ---------- 6b) 같은 조언 반복 표시를 카드당 한 줄로 + 펼치기 ---------- */
  function mergeRepeatNotes(){
    ['resultView','yearView','matchView'].forEach(function(id){
      var root=$(id);if(!root)return;
      var groups=new Map();
      [].forEach.call(root.querySelectorAll('.guiinRepeatNote'),function(n){
        var card=n.closest('.expertSection,.easyLongCard,.gdvSec,.card,section')||n.parentNode;
        if(!groups.has(card))groups.set(card,[]);groups.get(card).push(n);
      });
      groups.forEach(function(list,card){
        var first=list[0];
        list.slice(1).forEach(function(n){n.classList.add('guiinRepeatNoteDup')});
        var cnt=card.querySelectorAll('.guiinRepeatHidden').length||list.length;
        var open=card.classList.contains('guiinRepeatOpen');
        var want=(open?'같은 조언 '+cnt+'문장을 펼쳐 뒀어.':'앞에서 본 것과 같은 조언 '+cnt+'문장은 접어 뒀어.');
        if(first.getAttribute('data-b3')===want)return;
        first.setAttribute('data-b3',want);first.classList.add('guiinRepeatMerged');
        first.textContent='';var sp=document.createElement('span');sp.textContent=want;first.appendChild(sp);
        var b=document.createElement('button');b.type='button';b.className='guiinRepeatToggle';b.textContent=open?'접기':'펼치기';
        b.addEventListener('click',function(ev){ev.stopPropagation();card.classList.toggle('guiinRepeatOpen');first.removeAttribute('data-b3');mergeRepeatNotes()});
        first.appendChild(b);
        /* 접힌 문장 바로 뒤에 놓이도록: 카드 안 마지막 숨김 문장 뒤로 이동 */
        var hid=card.querySelectorAll('.guiinRepeatHidden');var last=hid[hid.length-1];
        if(last&&last.nextSibling!==first&&last.parentNode)last.parentNode.insertBefore(first,last.nextSibling);
      });
    });
  }

  /* ---------- 9) 만세력 표 신살 칸 정리 ---------- */
  var GOOD=/귀인|천의성|문창|학당|월덕|천덕|금여|암록|태극|복성|천주|관귀/;
  function starRow(){
    [].forEach.call(document.querySelectorAll('.manseTable'),function(tb){
      var row=[].slice.call(tb.querySelectorAll('.manseRow')).filter(function(r){var l=r.querySelector('.manseLabel');return l&&norm(l.textContent)==='신살'})[0];
      if(!row||row.getAttribute('data-b3'))return;
      var hidden=0;
      [].forEach.call(row.querySelectorAll('.manseCell'),function(cell){
        var list=cell.querySelectorAll('.pillarStarName');var chips=[].slice.call(list.length?list:cell.children).filter(function(x){return norm(x.textContent)});
        if(chips.length<=3)return;
        var shown=0;
        chips.forEach(function(ch){var good=GOOD.test(ch.textContent);if(good||shown<2){if(!good)shown++;return}ch.classList.add('guiinStarMore');hidden++});
      });
      row.setAttribute('data-b3','1');
      if(!hidden)return;
      tb.classList.add('guiinStarMoreHide');
      var wrap=tb.closest('.manseTableWrap')||tb;
      var box=document.createElement('div');box.className='guiinStarMoreRow';
      var b=document.createElement('button');b.type='button';b.className='guiinStarMoreBtn';
      var label=function(){b.textContent=tb.classList.contains('guiinStarMoreHide')?'신살 '+hidden+'개 더 보기':'신살 접기'};label();
      b.addEventListener('click',function(){tb.classList.toggle('guiinStarMoreHide');label()});
      box.appendChild(b);wrap.parentNode.insertBefore(box,wrap.nextSibling);
    });
  }

  /* ---------- 7) 앞으로 6개월 월운 비교용 (계산 함수 그대로 사용) ---------- */
  window.guiinSixMonthTiming=function(c){
    try{
      var F=window.GuiinFortuneV2;if(!c||!F||typeof F.timingHighlights!=='function')return null;
      var now=new Date(),y=now.getFullYear(),m=now.getMonth()+1;
      var h1=F.timingHighlights(c,y),rows=(h1&&h1.months||[]).filter(function(x){return Number(x.month)>=m}).map(function(x){return Object.assign({},x,{year:y})});
      if(rows.length>=6)return null;
      var need=6-rows.length,h2=F.timingHighlights(c,y+1);
      rows=rows.concat((h2&&h2.months||[]).filter(function(x){return Number(x.month)<=need}).map(function(x){return Object.assign({},x,{year:y+1})}));
      if(!rows.length)return null;
      var ord=function(x){return Number(x.year)*12+Number(x.month)};
      var used={},out={};
      var areas=['money','career','relationship','caution','speech','support','noble'];
      areas.forEach(function(k){
        var list=rows.slice().sort(function(a,b){return (Number(b.scores&&b.scores[k]||0)-Number(a.scores&&a.scores[k]||0))||ord(a)-ord(b)});
        if(list.length){var top=Number(list[0].scores&&list[0].scores[k]||0);var tie=list.filter(function(x){return Number(x.scores&&x.scores[k]||0)===top});var fresh=tie.filter(function(x){return !used[ord(x)]})[0];
          if(fresh&&fresh!==list[0]){list.splice(list.indexOf(fresh),1);list.unshift(fresh)}
          if(['money','career','relationship','caution'].indexOf(k)>=0)used[ord(list[0])]=1}
        out[k]=list.slice(0,3);
      });
      out.noble=rows.filter(function(x){return x.noble});
      return out;
    }catch(_e){return null}
  };


  /* ---------- 2) 궁합 탭: 내용이 전부 접힌 제목도 함께 접기 ---------- */
  function orphanFold(){
    var root=$('matchView');if(!root)return;
    var t='summary';try{t=typeof matchTab!=='undefined'?matchTab:'summary'}catch(_e){}
    [].forEach.call(root.querySelectorAll('.guiinOrphanFold'),function(e){e.classList.remove('guiinOrphanFold','guiinSeenFold')});
    if(t==='summary')return;
    var boxes=root.querySelectorAll('.gdvSec,.easyLongCard,.compatLong,.expertSection,.r24Section,.r23Section,.deepCard');
    [].forEach.call(boxes,function(box){
      var items=[].filter.call(box.querySelectorAll('p,li'),function(e){return norm(e.textContent).length>=50&&!e.closest('details:not([open])')});
      if(!items.length)return;
      if(items.every(function(e){return e.classList.contains('guiinSeenFold')})){box.classList.add('guiinOrphanFold','guiinSeenFold')}
    });
    /* 목록이 전부 접힌 경우 바로 위 짧은 소제목도 접기 */
    [].forEach.call(root.querySelectorAll('ol,ul'),function(l){
      var li=l.querySelectorAll(':scope > li');if(!li.length)return;
      if([].every.call(li,function(x){return x.classList.contains('guiinSeenFold')})){var p=l.previousElementSibling;if(p&&p.tagName==='P'&&norm(p.textContent).length<50)p.classList.add('guiinOrphanFold','guiinSeenFold')}
    });
  }

  /* ---------- 7) 궁합 화면 호칭 통일(성 뺀 이름) ---------- */
  function givenName(n){n=String(n||'').trim();if(/^[가-힣]{3}$/.test(n))return n.slice(1);if(/^[가-힣]{4}$/.test(n)&&/^(남궁|황보|제갈|선우|독고|사공|서문|동방|어금|망절|소봉)/.test(n))return n.slice(2);return n}
  function unifyNames(){
    var root=$('matchView');if(!root)return;var m=null;try{m=typeof matchMeta!=='undefined'?matchMeta:null}catch(_e){}
    if(!m||!m.a||!m.b)return;
    var pairs=[m.a.input&&m.a.input.name,m.b.input&&m.b.input.name].map(function(n){n=String(n||'').trim();return [n,givenName(n)]}).filter(function(x){return x[0]&&x[0]!==x[1]});
    textNodes(root,function(tn){
      var pe=tn.parentElement;if(!pe||pe.closest('input,textarea,.infoCard'))return;
      var v=tn.nodeValue,o=v;
      pairs.forEach(function(p){if(norm(v)===p[0])return;v=v.split(p[0]).join(p[1])});
      if(pe.closest('.r28PartnerPortrait')){v=v.replace(/너의 작동 방식/g,'이 사람의 작동 방식').replace(/네 구조/g,'이 사람의 구조')}
      if(v!==o)tn.nodeValue=v;
    });
  }

  /* ---------- 1) 문장 이어 붙이기에서 생긴 문법 오류 정리 ---------- */
  function fin(ch){var c=ch.charCodeAt(0);return c>=0xAC00&&c<=0xD7A3&&((c-0xAC00)%28)!==0}
  var FIXES=[
    [/([가-힣])를(?=[\s,.])/g,function(m,a){return fin(a)?a+'을':m}],
    [/([가-힣])이야(?![가-힣])/g,function(m,a){return (!fin(a)&&a!=='이')?a+'야':m}],
    [/([가-힣])이 필요해/g,function(m,a){return fin(a)?m:a+'가 필요해'}],
    [/([.!?])\s*쪽이야\./g,'$1'],
    [/지치면 (?=[^.]{2,30}?(?:지면|치면|오면|쌓이면|생기면) )/g,'지치거나 '],
    [/압박이 커지면 (?=[^.]{2,30}?(?:지면|치면|오면|쌓이면|생기면) )/g,'압박이 커지거나 '],
    [/서운함이 생기면 갈등 때는 답답함이나 긴장이 빠르게 올라오는 상황에서는/g,'서운함이 쌓여 답답함이나 긴장이 빠르게 올라오면'],
    [/갈등 때는 답답함이나 긴장이 빠르게 올라오는 상황에서는/g,'갈등 중에 답답함이나 긴장이 빠르게 올라오면'],
    [/전 연인·새로운 이성과의 경계/g,'전 연인·새로 만나는 사람과의 경계']
  ];
  function textNodes(root,fn){var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null),n,list=[];while((n=w.nextNode()))list.push(n);list.forEach(fn)}
  function grammar(){
    ['resultView','matchView','yearView','todayView'].forEach(function(id){
      var root=$(id);if(!root)return;
      textNodes(root,function(tn){
        var pe=tn.parentElement;if(!pe||pe.closest('script,style,input,textarea'))return;
        var v=tn.nodeValue,o=v;if(!v||v.length<3)return;
        FIXES.forEach(function(f){v=v.replace(f[0],f[1])});
        if(/^이야(?![가-힣])/.test(v)){var ps=tn.previousSibling,pt=ps?String(ps.textContent||''):'';var lc=pt.slice(-1);if(lc&&/[가-힣]/.test(lc)&&!fin(lc)&&lc!=='이')v='야'+v.slice(2)}
        if(v!==o)tn.nodeValue=v;
      });
    });
  }

  /* ---------- 8) 궁합: 성별을 직접 고르지 않았으면 결과 위에 확인 안내 ---------- */
  var touched={a:false,b:false};
  document.addEventListener('click',function(e){var b=e.target&&e.target.closest&&e.target.closest('#aGender button,#bGender button');if(!b)return;touched[b.closest('#aGender')?'a':'b']=true},true);
  var lastMatchUntouched=false;
  (function wrapSubmit(){var f=window.submitMatch;if(typeof f!=='function'||f.__b3)return;var w=function(){lastMatchUntouched=!(touched.a&&touched.b);return f.apply(this,arguments)};w.__b3=true;window.submitMatch=w;try{submitMatch=w}catch(_e){}})();
  function genderNote(){
    var root=$('matchView');if(!root)return;var old=root.querySelector(':scope > .guiinGenderNote');
    if(!lastMatchUntouched||!root.querySelector('.matchHero')){if(old)old.remove();return}
    if(old)return;
    function g(id){var on=document.querySelector('#'+id+' button.on');return on?on.textContent:'-'}
    var d=document.createElement('div');d.className='guiinGenderNote';
    d.innerHTML='<span>성별을 한 번 확인해 줘 · 나 <b></b> / 상대 <b></b>. 성별에 따라 대운 방향이 달라져서 결과가 바뀔 수 있어.</span><button type="button">다시 입력</button>';
    var bs=d.querySelectorAll('b');bs[0].textContent=g('aGender');bs[1].textContent=g('bGender');
    d.querySelector('button').addEventListener('click',function(){try{go('match')}catch(_e){}});
    root.insertBefore(d,root.firstChild);
  }

  /* ---------- 5) 오늘·주간·월간 운세 ---------- */
  var GODWORD={비견:'내 기준',겁재:'경쟁·관계',식신:'꾸준한 생산',상관:'표현·변화',편재:'기회·활동',정재:'실속·관리',편관:'압박·책임',정관:'약속·평가',편인:'생각·탐구',정인:'배움·도움'};
  var HEAD={비견:'오늘은 내 기준대로 차분히 가 보자.',겁재:'오늘은 사람과 돈 사이 경계를 지키는 날이야.',식신:'오늘은 하던 걸 꾸준히 이어 가기 좋은 날이야.',상관:'오늘은 말 한마디를 부드럽게 고르는 날이야.',편재:'오늘은 새 기회가 보여도 한도부터 정하자.',정재:'오늘은 계획한 만큼 챙기기 좋은 날이야.',편관:'오늘은 서두르지 말고 순서대로 가 보자.',정관:'오늘은 약속을 지키는 만큼 인정받는 날이야.',편인:'오늘은 생각을 정리할 시간을 먼저 챙기자.',정인:'오늘은 배우고 도움받기 좋은 날이야.'};
  window.guiinTodayHeadline=function(){try{var c=chartNow();if(!c||!window.GuiinFortuneV2)return '';var k=new Date(Date.now()+9*3600000),d=new Date(Date.UTC(k.getUTCFullYear(),k.getUTCMonth(),k.getUTCDate(),3));var f=GuiinFortuneV2.flow(c,d);return HEAD[f&&f.gods&&f.gods.day]||''}catch(_e){return ''}};
  function splitS(t){return String(t||'').match(/[^.!?]+[.!?]?/g)||[]}

  var TEEN_STUDY={비견:'내 방식대로 공부 계획을 세우고 끝까지 해 보기 좋은 흐름이야.',겁재:'친구들과 비교하기 쉬운 흐름이라, 남의 속도보다 내 목표에 집중하는 게 좋아.',식신:'꾸준히 연습한 만큼 실력이 쌓이기 좋은 흐름이야.',상관:'아이디어와 표현이 잘 나오는 흐름이라 발표나 글쓰기에 힘을 써 봐. 말이 세게 나가지 않게만 조심해.',편재:'새로운 활동에 관심이 커지는 흐름이라, 하고 싶은 걸 하나만 골라 집중해.',정재:'계획한 만큼 차근차근 해내기 좋은 흐름이야.',편관:'과제와 시험 부담이 커질 수 있는 흐름이라, 해야 할 일을 순서대로 나눠서 해.',정관:'규칙과 약속을 지킬수록 인정받기 좋은 흐름이야.',편인:'한 가지를 깊게 파고들기 좋은 흐름이야. 생각만 하지 말고 노트로 정리해 봐.',정인:'배우고 도움받기 좋은 흐름이야. 모르는 건 선생님이나 선배에게 물어봐.'};
  var TEEN_MONEY={비견:'용돈을 내 기준대로 나눠 쓰기 좋은 흐름이야.',겁재:'친구 따라 쓰는 돈이 늘기 쉬운 흐름이라, 쓸 한도를 먼저 정해.',식신:'먹고 즐기는 데 쓰는 돈이 늘기 쉬워. 꼭 사고 싶은 것부터 정해.',상관:'갖고 싶은 게 갑자기 생기기 쉬운 흐름이라, 바로 사지 말고 하루 생각해 봐.',편재:'용돈이 들어오고 나가는 일이 함께 많아지는 흐름이야. 쓸 돈과 모을 돈을 나눠.',정재:'계획대로 모으기 좋은 흐름이야. 이번에 모을 금액을 정해 봐.',편관:'갑자기 필요한 돈이 생길 수 있는 흐름이라, 조금은 남겨 둬.',정관:'정해 둔 용돈 규칙을 지키기 좋은 흐름이야.',편인:'공부나 취미에 쓰는 돈이 늘 수 있어. 정말 필요한지 한 번 더 생각해.',정인:'배우는 데 쓰는 돈은 아깝지 않은 흐름이야. 대신 가족과 먼저 상의해.'};
  var TEEN_WORDS=[['생활과 재정을','생활 리듬과 용돈을'],['여유 자금','용돈'],['책임성 지출','꼭 필요한 지출'],['현금흐름과 실제 조건','쓸 돈과 모을 돈'],['큰돈은','큰돈이 드는 물건은'],['업무','공부·과제'],['직장','학교'],['계약','약속']];
  function teenGod(period){try{var c=chartNow();var k=new Date(Date.now()+9*3600000);if(period==='month'){var m=GuiinFortuneV2.monthSignal(c,k.getUTCFullYear(),k.getUTCMonth()+1);return m&&m.god}var d=new Date(Date.UTC(k.getUTCFullYear(),k.getUTCMonth(),k.getUTCDate(),3));if(period==='week'){var cnt={};for(var i=0;i<7;i++){var g=GuiinFortuneV2.flow(c,new Date(d.getTime()+i*86400000)).gods.day;cnt[g]=(cnt[g]||0)+1}return Object.keys(cnt).sort(function(a,b){return cnt[b]-cnt[a]})[0]}return GuiinFortuneV2.flow(c,d).gods.day}catch(_e){return ''}}
  (function wrapRows(){
    var f=window.fortuneRows;if(typeof f!=='function'||f.__b3)return;
    var w=function(){
      var rows=f.apply(this,arguments);if(!Array.isArray(rows))return rows;
      var arguments_period=arguments[0]||'today';var cc=chartNow(),teen=false;try{teen=!!cc&&age(cc)<20}catch(_e){}
      try{
        var seen={};
        rows=rows.map(function(r,i){
          if(!Array.isArray(r))return r;var txt=String(r[1]||'');
          var parts=splitS(txt),keep=[];
          parts.forEach(function(p){var k=norm(p);if(k.length>=18&&seen[k]&&i>0)return;seen[k]=1;keep.push(p.trim())});
          if(keep.length)txt=keep.join(' ');
          var used=false;
          txt=txt.replace(/(비견|겁재|식신|상관|편재|정재|편관|정관|편인|정인) 주제/g,function(m,g){if(used)return m;used=true;return g+'('+GODWORD[g]+') 주제'});
          txt=txt.replace(/(연결 신호가 잡히는 날 \d+일)(이 있어)/,'$1$2(하루에 두 신호가 함께 잡히는 날도 있어서 합이 날짜 수보다 많을 수 있어)');
          var title=r[0];
          if(teen){
            if(title==='애정운')title='관계운';
            if(title==='재물운'){title='용돈운';var tm=teenGod(arguments_period);if(tm&&TEEN_MONEY[tm])txt=TEEN_MONEY[tm]+' '+txt.replace(/^[^.]*\./,'').trim();}
            if(title==='직장운'){title='학업·진로운';var tg=teenGod(arguments_period);if(tg&&TEEN_STUDY[tg])txt=TEEN_STUDY[tg]+' '+txt.replace(/^[^.]*\./,'').trim();}
            TEEN_WORDS.forEach(function(p){txt=txt.split(p[0]).join(p[1])});
          }
          return [title,txt].concat(r.slice(2));
        });
      }catch(_e){}
      return rows;
    };
    w.__b3=true;window.fortuneRows=w;try{fortuneRows=w}catch(_e){}
  })();


  /* ---------- 출생시간 미상 안내를 실제로 달라지는 기둥 기준으로 ---------- */
  window.guiinUncertaintyText=function(c){
    try{
      var u=c&&c.calculation&&c.calculation.uncertainty;if(!u||!u.candidates)return '';
      var P=c.pillars||{},L={year:'연주',month:'월주',day:'일주'},out=['시주는 출생시간이 있어야 계산할 수 있어서 빼고 봤어.'];
      var cd=u.candidates;
      if(cd.day&&cd.day.length>1){var cur=P.day&&P.day.ko||cd.day[0];var alt=cd.day.filter(function(x){return x!==cur});var al=alt.join('·'),lc=al.charCodeAt(al.length-1),jo=(lc>=0xAC00&&lc<=0xD7A3&&(lc-0xAC00)%28!==0&&(lc-0xAC00)%28!==8)?'으로':'로';out.push('밤 11시~자정 사이에 태어났다면 일주가 '+al+jo+' 바뀌고, 그 밖의 시간이면 지금 결과('+cur+') 그대로야.')}
      var ym=['year','month'].filter(function(k){return cd[k]&&cd[k].length>1});
      if(ym.length)out.push('태어난 날이 절기가 바뀌는 날이라 '+ym.map(function(k){return L[k]+'가 '+cd[k].join(' 또는 ')}).join(', ')+' 중 하나가 될 수 있어. 태어난 시각을 알면 정확히 정할 수 있어.');
      else out.push('연주·월주는 태어난 시각과 상관없이 그대로야.');
      var r=u.startAgeExactRange;if(cd.month&&cd.month.length>1)out.push('월주가 달라지면 대운의 순서와 시작 나이도 함께 달라져.');else if(r&&r.length===2&&Math.abs(r[1]-r[0])>=0.5)out.push('대운이 시작되는 나이는 최대 '+Math.ceil(Math.abs(r[1]-r[0]))+'년 정도 차이 날 수 있어.');
      return out.join(' ');
    }catch(_e){return ''}
  };

  /* ---------- 궁합 연애·결혼 탭: 그 탭의 핵심 단락은 접지 않고 보여 주기 ---------- */
  var TAB_KEEP={love:['pair-attraction','pair-conflict','pair-cooling','pair-pull'],marriage:['pair-money','pair-space','pair-structure','pair-conditions']};
  var GDV_KEEP={love:['싸우면 이렇게 돼'],marriage:['결혼하면 이렇게 돼']};
  function keepTabCore(){
    var root=$('matchView');if(!root)return;var t='summary';try{t=typeof matchTab!=='undefined'?matchTab:'summary'}catch(_e){}
    var keep=TAB_KEEP[t];if(!keep)return;
    var boxes=[].filter.call(root.querySelectorAll('[id]'),function(e){return keep.some(function(k){return e.id.slice(-k.length)===k})});
    [].forEach.call(root.querySelectorAll('.gdvSec'),function(s){var h=s.querySelector('h3');if(h&&GDV_KEEP[t].indexOf(norm(h.textContent))>=0)boxes.push(s)});
    boxes.forEach(function(b){b.classList.remove('guiinSeenFold','guiinOrphanFold');[].forEach.call(b.querySelectorAll('.guiinSeenFold'),function(e){e.classList.remove('guiinSeenFold','guiinOrphanFold')});var g=b.closest('.gdv');if(g)g.classList.remove('guiinSeenFold','guiinOrphanFold')});
    var bar=root.querySelector(':scope > .guiinSeenBar');
    if(bar){var n=[].filter.call(root.querySelectorAll('p.guiinSeenFold,li.guiinSeenFold'),function(e){return norm(e.textContent).length>=50}).length;var sp=bar.querySelector('span');var msg=n?'요약 탭에서 이미 본 문장 '+n+'개는 접어 뒀어. 이 탭의 핵심 내용은 펼쳐 둘게.':'이 탭의 핵심 내용은 요약 탭과 겹쳐도 그대로 보여 줄게.';if(sp&&sp.textContent!==msg)sp.textContent=msg}
  }

  /* ---------- 나이대에 맞게 단어 바꾸기 (사주 결과·운의 흐름 화면) ---------- */
  var AGE_REP={senior:[['연애에서도','가까운 관계에서도'],['연애에서','가까운 관계에서'],['연애할 때','가까운 사람과 지낼 때'],['이직·독립·창작의 기회','새 역할·독립·창작의 기회'],['이직·이사','역할 변화·이사']],
               young:[['이직·독립·창작의 기회','진로 변경·독립·창작의 기회'],['이직·이사','진로 변화·이사']]};AGE_REP.senior.push(['연애 상황으로','가까운 관계 상황으로']);
  var AGE_TEEN=[['연애에서도','가까운 관계에서도'],['연애에서','가까운 관계에서'],['연애할 때','친구와 가까워질 때'],['데이트 계획','함께할 계획'],
    ['투자·동업·큰 결제는 하루 뒤에 결정해.','큰돈이 드는 물건은 하루 뒤에 결정해.'],
    ['돈이 들어오는 날, 자동이체로 먼저 빼 둬. 남는 돈이 아니라 먼저 빠지는 돈이 네 몫이야.','용돈이 들어오는 날, 모을 돈부터 따로 빼 둬. 남는 돈이 아니라 먼저 빼 둔 돈이 네 몫이야.'],
    ['이직·전환 같은 변화가 잦을 수 있어서 말과 계약을 더 챙겨','진로·환경 변화가 잦을 수 있어서 말과 약속을 더 챙겨'],
    ['메시지·계약 문구를','메시지와 약속을'],['평가·계약·역할 변화','평가·약속·역할 변화'],['계약·정산 숫자를','약속과 금액을'],['계약·급여·정산 조건을 문서로 확인해.','약속한 조건을 메모로 남겨 둬.'],['연애 상황으로','친구·가족 관계 상황으로'],['연애에서 내가 반복하는 패턴을 봐줘','친구 관계에서 내가 반복하는 패턴을 봐줘'],['지금 직업운에서 먼저 바꿀 건 뭐야?','지금 진로에서 먼저 바꿀 건 뭐야?'],['오늘 연애운에서 내가 먼저 할 행동은?','오늘 친구 관계에서 내가 먼저 할 행동은?']];
  function ageText(){
    var c=chartNow();if(!c)return;var a=age(c),st=a<25?'young':a>=60?'senior':'';if(!st)return;var reps=AGE_REP[st];if(a<20)reps=AGE_TEEN.concat(reps);
    ['resultView','yearView','todayView'].forEach(function(id){var root=$(id);if(!root)return;
      textNodes(root,function(tn){var pe=tn.parentElement;if(!pe||pe.closest('script,style,input,textarea'))return;var v=tn.nodeValue,o=v;if(!v)return;reps.forEach(function(r){v=v.split(r[0]).join(r[1])});if(v!==o)tn.nodeValue=v});
      [].forEach.call(root.querySelectorAll('[data-q]'),function(e){var q=e.getAttribute('data-q')||'',o=q;reps.forEach(function(r){q=q.split(r[0]).join(r[1])});if(q!==o)e.setAttribute('data-q',q)})});
  }

  /* ---------- 오늘의 일진이 내 원국과 만나는 방식 (날마다 달라지는 한 줄) ---------- */
  var AREA={year:'바깥 관계·집안 어른',month:'일·사회생활',day:'가까운 사람과 내 컨디션',hour:'아랫사람·개인 계획'};
  var REL={충:['부딪히는 관계','{a} 쪽에서 계획이 흔들리거나 말이 엇갈리기 쉬워. 큰 결정은 하루 미뤄도 괜찮아.',5],
           형:['같은 문제가 되풀이되기 쉬운 관계','{a} 쪽 일은 한 번 더 확인해.',4],
           해:['서운함이 쌓이기 쉬운 관계','{a} 쪽에서는 짐작하지 말고 직접 물어봐.',3],
           파:['계획이 깨지기 쉬운 관계','{a} 쪽 약속과 일정은 여유를 둬.',3],
           육합:['서로 묶이는 관계','{a} 쪽에 부탁하거나 함께하는 일을 시작하기 좋아.',2],
           천간합:['마음이 맞물리는 관계','{a} 쪽과 대화로 풀거나 약속을 잡기 좋아.',2],
           삼합:['한 방향으로 모이는 관계','{a} 쪽에서 미뤄 둔 일을 진행하기 좋아.',2],
           방합:['한 방향으로 모이는 관계','{a} 쪽에서 미뤄 둔 일을 진행하기 좋아.',1]};
  function todayLine(){
    var v=$('todayView');if(!v)return;var c=chartNow();var hero=v.querySelector('.todayHero');
    var old=v.querySelector('.guiinDayLine');
    var tabs=document.querySelectorAll('#fortuneTabs button');var isToday=!tabs.length||tabs[0].classList.contains('on');
    if(!c||!hero||!isToday||!window.GuiinFortuneV2||!window.GuiinSaju||typeof GuiinSaju.relationsWithTransit!=='function'){if(old&&!isToday)old.remove();return}
    var k=new Date(Date.now()+9*3600000),d=new Date(Date.UTC(k.getUTCFullYear(),k.getUTCMonth(),k.getUTCDate(),3));
    var key=d.toISOString().slice(0,10)+'|'+[c.input&&c.input.year,c.input&&c.input.month,c.input&&c.input.day,c.input&&c.input.hour].join('-');
    if(old&&old.getAttribute('data-k')===key)return;if(old)old.remove();
    var f=GuiinFortuneV2.flow(c,d);if(!f||!f.pillars||!f.pillars.day)return;
    var rel=[];try{rel=GuiinSaju.relationsWithTransit(c.pillars,f.pillars.day)||[]}catch(_e){}
    var seen={},picked=rel.filter(function(r){return REL[r.type]&&AREA[r.aKey]}).sort(function(a,b){return REL[b.type][2]-REL[a.type][2]}).filter(function(r){var s=r.aKey+r.type;if(seen[s]||seen[r.aKey])return false;seen[s]=seen[r.aKey]=1;return true}).slice(0,2);
    var g=f.gods&&f.gods.day,gw=GODWORD[g]?g+'('+GODWORD[g]+')':g;
    var lines=['오늘 일진은 <b>'+esc(f.pillars.day.ko)+'('+esc(f.pillars.day.hanja||'')+')일</b>이야. 너에게는 '+esc(gw||'')+' 기운으로 들어와.'];
    if(picked.length)picked.forEach(function(r){lines.push('네 '+esc(r.aLabel)+'의 '+esc(r.a)+(fin(r.a)?'과':'와')+' 오늘의 '+esc(r.b)+(fin(r.b)?'이':'가')+' '+esc(r.type)+(fin(r.type.slice(-1))?'이야. ':'야. ')+esc(REL[r.type][0])+'라서 '+esc(REL[r.type][1].replace('{a}',AREA[r.aKey])))});
    else lines.push('원국과 크게 부딪히거나 묶이는 글자가 없어서, 평소 리듬대로 가기 좋은 날이야.');
    var box=document.createElement('section');box.className='guiinDayLine card';box.setAttribute('data-k',key);
    box.innerHTML='<div class="mini">오늘 내 사주와 만나는 방식</div>'+lines.map(function(x){return '<p>'+x+'</p>'}).join('');
    hero.parentNode.insertBefore(box,hero.nextSibling);
  }

  /* ---------- 주간·월간: 내 원국과 부딪히거나 맞물리는 날짜 ---------- */
  var SHORT={충:'부딪힘',형:'반복 주의',해:'서운함 주의',파:'계획 변경',육합:'연결',천간합:'마음 맞음',삼합:'흐름 모임',방합:'흐름 모임'};
  var TONE={충:'w',형:'w',해:'w',파:'w',육합:'g',천간합:'g',삼합:'g',방합:'g'};
  function dayRels(c,d){var f=GuiinFortuneV2.flow(c,d);if(!f||!f.pillars||!f.pillars.day)return null;var r=[];try{r=GuiinSaju.relationsWithTransit(c.pillars,f.pillars.day)||[]}catch(_e){}
    r=r.filter(function(x){return SHORT[x.type]&&AREA[x.aKey]});return {p:f.pillars.day,r:r}}
  function periodLine(){
    var v=$('todayView');if(!v)return;var c=chartNow();var tabs=document.querySelectorAll('#fortuneTabs button');
    var idx=-1;[].forEach.call(tabs,function(b,i){if(b.classList.contains('on'))idx=i});
    var old=v.querySelector('.guiinPeriodDays');
    if(!c||(idx!==1&&idx!==2)||!window.GuiinFortuneV2||!window.GuiinSaju||typeof GuiinSaju.relationsWithTransit!=='function'){if(old)old.remove();return}
    var k=new Date(Date.now()+9*3600000),y=k.getUTCFullYear(),m=k.getUTCMonth(),dd=k.getUTCDate();
    var key=idx+'|'+y+'-'+m+'-'+dd+'|'+[c.input&&c.input.year,c.input&&c.input.month,c.input&&c.input.day,c.input&&c.input.hour].join('-');
    if(old&&old.getAttribute('data-k')===key)return;if(old)old.remove();
    var days=[];
    if(idx===1){for(var i=0;i<7;i++)days.push(new Date(Date.UTC(y,m,dd+i,3)))}
    else{var last=new Date(Date.UTC(y,m+1,0)).getUTCDate();for(var j=1;j<=last;j++)days.push(new Date(Date.UTC(y,m,j,3)))}
    var W=['일','월','화','수','목','금','토'];
    function lab(d){return (d.getUTCMonth()+1)+'/'+d.getUTCDate()+'('+W[d.getUTCDay()]+')'}
    var html='<div class="mini">'+(idx===1?'이번 주':'이번 달')+' 내 사주와 만나는 날</div>';
    if(idx===1){
      html+='<ul class="pdList">'+days.map(function(d){var x=dayRels(c,d);if(!x)return '';var r=x.r.slice().sort(function(a,b){return (TONE[a.type]==='w'?0:1)-(TONE[b.type]==='w'?0:1)})[0];
        var tag=r?'<span class="pdTag '+TONE[r.type]+'">'+SHORT[r.type]+'</span> '+esc(AREA[r.aKey])+' 쪽':'<span class="pdTag n">평온</span> 평소 리듬대로';
        return '<li><b>'+lab(d)+' '+esc(x.p.ko)+'</b>'+tag+'</li>'}).join('')+'</ul>';
    }else{
      var warn=[],good=[];
      days.forEach(function(d){if(d.getUTCDate()<dd)return;var x=dayRels(c,d);if(!x)return;var w=x.r.filter(function(r){return r.type==='충'})[0],g=x.r.filter(function(r){return TONE[r.type]==='g'})[0];
        if(w)warn.push(lab(d)+' '+AREA[w.aKey]);else if(g)good.push(lab(d)+' '+AREA[g.aKey])});
      html+='<p><b>부딪히기 쉬운 날</b> '+(warn.length?esc(warn.slice(0,6).join(' · ')):'남은 날 중에는 크게 부딪히는 날이 없어.')+'</p>';
      html+='<p><b>도움·연결이 붙기 쉬운 날</b> '+(good.length?esc(good.slice(0,6).join(' · ')):'남은 날 중에는 특별히 맞물리는 날이 적어.')+'</p>';
      html+='<p class="pdNote">오늘부터 이번 달 말까지 일진이 내 원국과 만나는 방식을 계산했어. 큰 약속은 부딪히기 쉬운 날을 피해서 잡아 봐.</p>';
    }
    var box=document.createElement('section');box.className='guiinPeriodDays card';box.setAttribute('data-k',key);box.innerHTML=html;
    var anchor=v.querySelector('.fortuneList');if(anchor&&anchor.parentNode)anchor.parentNode.insertBefore(box,anchor);else v.appendChild(box);
  }
  function apply(){try{sajuSeen()}catch(_e){}try{daeunHead($('resultView'))}catch(_e){}try{daeunHead($('yearView'))}catch(_e){}try{mergeRepeatNotes()}catch(_e){}try{starRow()}catch(_e){}try{orphanFold()}catch(_e){}try{unifyNames()}catch(_e){}try{grammar()}catch(_e){}try{genderNote()}catch(_e){}try{keepTabCore()}catch(_e){}try{ageText()}catch(_e){}try{todayLine()}catch(_e){}try{periodLine()}catch(_e){}}
  window.guiinB3Apply=apply;
  var t1=null;function later(){clearTimeout(t1);t1=setTimeout(apply,320)}
  document.addEventListener('click',later,{passive:true});
  function observe(id){var n=$(id);if(n)new MutationObserver(later).observe(n,{childList:true})}
  function boot(){observe('resultView');observe('matchView');observe('yearView');observe('todayView');setTimeout(apply,500)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
