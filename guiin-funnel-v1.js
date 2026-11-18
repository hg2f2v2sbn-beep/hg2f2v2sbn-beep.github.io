/* 귀인사주 전환 개선 v1~v6
 * - 사주·궁합 결과: 긴 무료 해석 접기, 결제 버튼 문구 통일, 중복 비교 박스 숨김
 * - 결과 화면에서 하단 고정 결제바 (미결제일 때만)
 */
(function(root){
  'use strict';
  var doc=root.document;if(!doc)return;
  var DISMISS_KEY='gf_paybar_closed';
  var KIND={
    saju:{screen:'result',view:'resultView',code:'LIFETIME_SAJU',fallback:'openPremiumPay',
      label:'잠긴 풀이 전부 열기 · 5,900원 ›',btns:'[data-gptr-buy],[data-glf-buy="saju"],.premiumLock button',
      unpaid:'[data-gptr-buy],.premiumPreview,[data-glf-buy="saju"]',
      title:'평생사주 전체 풀이',sub:'잘 맞는 일·돈 들어오는 해·연애 시기까지',price:'5,900원 열기 ›'},
    compat:{screen:'matchResult',view:'matchView',code:'PREMIUM_COMPAT',fallback:'openCompatPay',
      label:'잠긴 궁합 전부 열기 · 7,900원 ›',btns:'[data-glf-buy="compat"],.premiumLock button',
      unpaid:'.premiumPreview,[data-glf-buy="compat"]',
      title:'프리미엄 궁합 전체 풀이',sub:'연락·권태·돈·결혼·두 사람의 10년까지',price:'7,900원 열기 ›'}
  };

  function screenOn(id){var r=doc.getElementById(id);return !!(r&&r.classList.contains('active')&&r.offsetParent!==null);}
  function activeKind(){for(var k in KIND){if(screenOn(KIND[k].screen))return k;}return null;}
  function viewOf(k){return doc.getElementById(KIND[k].view);}
  function unpaid(k){var v=viewOf(k);return !!(v&&v.querySelector(KIND[k].unpaid));}

  function buy(k){
    var K=KIND[k];
    try{
      if(typeof root.guiinPaymentCenterStart==='function'){root.guiinPaymentCenterStart(K.code);return;}
      if(typeof root[K.fallback]==='function')root[K.fallback]();
    }catch(_e){}
  }

  function fold(v){
    var el=v.querySelector('.r29SajuPortrait');
    if(!el||el.getAttribute('data-gf-fold'))return;
    if(el.scrollHeight<900)return;
    el.setAttribute('data-gf-fold','1');
    el.classList.add('gfFold','gfShut');
    var b=doc.createElement('button');b.type='button';b.className='gfMore';b.textContent='이어서 더 읽기 ⌄';
    b.addEventListener('click',function(){
      var shut=el.classList.toggle('gfShut');
      b.textContent=shut?'이어서 더 읽기 ⌄':'접기 ⌃';
      if(shut)el.scrollIntoView({block:'start',behavior:'smooth'});
    });
    el.parentNode.insertBefore(b,el.nextSibling);
  }

  function unify(k){
    var v=viewOf(k);if(!v||!v.children.length)return;
    var K=KIND[k],list=v.querySelectorAll(K.btns);
    for(var i=0;i<list.length;i++){if(list[i].textContent!==K.label)list[i].textContent=K.label;}
    // '무료와 프리미엄' 비교 박스가 두 번 나오므로 아래쪽 하나는 숨김
    if(v.querySelector('.premiumCompare')){var fp=v.querySelector('.guiinFreePaid');if(fp)fp.style.display='none';}
    if(k==='saju')fold(v);
  }

  var bar=null,barKind=null;
  function ensureBar(k){
    if(!bar){
      bar=doc.createElement('div');bar.id='gfPayBar';bar.setAttribute('role','region');
      bar.innerHTML='<div class="t"><b></b><span></span></div><button type="button" class="go"></button><button type="button" class="x" aria-label="닫기">✕</button>';
      bar.querySelector('.go').addEventListener('click',function(){if(barKind)buy(barKind);});
      bar.querySelector('.x').addEventListener('click',function(){try{sessionStorage.setItem(DISMISS_KEY+'_'+barKind,'1');}catch(_e){}bar.classList.remove('on');});
      doc.body.appendChild(bar);
    }
    if(barKind!==k){
      var K=KIND[k];barKind=k;
      bar.setAttribute('aria-label',K.title+' 결제');
      bar.querySelector('.t b').textContent=K.title;
      bar.querySelector('.t span').textContent=K.sub;
      bar.querySelector('.go').textContent=K.price;
    }
    return bar;
  }
  function dismissed(k){try{return sessionStorage.getItem(DISMISS_KEY+'_'+k)==='1'||(k==='saju'&&sessionStorage.getItem(DISMISS_KEY)==='1');}catch(_e){return false;}}
  function sheetOpen(){var ids=['premiumSheet','compatSheet','guiinPaySheet'];for(var i=0;i<ids.length;i++){var s=doc.getElementById(ids[i]);if(s&&s.classList.contains('on'))return true;}return false;}

  function updateBar(){
    var k=activeKind();
    var show=!!k&&unpaid(k)&&!dismissed(k)&&(root.scrollY||0)>600&&!sheetOpen();
    if(show)ensureBar(k).classList.add('on');else if(bar)bar.classList.remove('on');
  }

  var pending=false;
  function apply(){
    pending=false;
    for(var k in KIND){try{unify(k);}catch(_e){}}
    updateBar();
  }
  function schedule(){if(pending)return;pending=true;setTimeout(apply,120);}

  function start(){
    if(root.MutationObserver){
      for(var k in KIND){
        var v=viewOf(k);if(v)new MutationObserver(schedule).observe(v,{childList:true,subtree:true});
        var r=doc.getElementById(KIND[k].screen);if(r)new MutationObserver(schedule).observe(r,{attributes:true,attributeFilter:['class']});
      }
      ['premiumSheet','compatSheet','guiinPaySheet'].forEach(function(id){var s=doc.getElementById(id);if(s)new MutationObserver(updateBar).observe(s,{attributes:true,attributeFilter:['class']});});
    }
    root.addEventListener('scroll',function(){if(!pending)updateBar();},{passive:true});
    root.addEventListener('hashchange',schedule);
    schedule();
  }
  if(doc.readyState==='loading')doc.addEventListener('DOMContentLoaded',start,{once:true});else start();
})(typeof window!=='undefined'?window:this);

/* v3: 생년월일 입력 전에 '풀이 예시'를 먼저 보여 주는 시트
 * 무료 결과 몇 줄 + 유료 장문 해설 예시(3장 전체 + 1장 미리보기) → 결제로 연결.
 * 예시 인물: 지연 1995.3.14 09:30 여 / 민준 1993.8.2 21:10 남.
 * 근거 수치(일주·오행·십성·대운·세운·신살)는 귀인사주 엔진의 실제 계산값. */
(function(root){
  'use strict';
  var doc=root.document;if(!doc)return;
  function it(t,b,p,g){return '<div class="it"><small>'+t+'</small><b>'+b+'</b>'+(p?'<p>'+p+'</p>':'')+(g?'<i>근거 · '+g+'</i>':'')+'</div>';}
  function ch(n,t,paras,g){return '<article class="lf"><h4><span>'+n+'</span>'+t+'</h4>'+paras.map(function(x){return '<p>'+x+'</p>';}).join('')+(g?'<i>근거 · '+g+'</i>':'')+'</article>';}
  function teaser(n,t,paras,unlock){return '<article class="lf cut"><h4><span>'+n+'</span>'+t+'</h4>'+paras.map(function(x){return '<p>'+x+'</p>';}).join('')+'<div class="cutLock">🔒 여기부터는 '+unlock+'에서 이어져요</div></article>';}
  function locks(list,total){return '<div class="lfLocks"><b>아직 '+list.length+'개 이야기가 더 있어요</b><ul>'+list.map(function(x){return '<li>🔒 '+x+'</li>';}).join('')+'</ul><small>예시는 '+total+'개 이야기 중 일부만 보여 드려요.</small></div>';}
  function sec(title,sub){return '<div class="lfHead"><small>'+sub+'</small><h3>'+title+'</h3></div>';}

  var SAJU='<div class="who">예시 인물 <b>지연</b> · 1995년 3월 14일 오전 9:30 · 여성<br>갑진 일주 · 목 45% · 토 34% · 금 4% · 지금 임오 대운</div>'
    +sec('무료로 바로 나오는 풀이','무료')
    +it('넌 이런 사람이야','봄에 태어난 갑목이라, 방향을 먼저 세우고 그걸 현실적인 성과로 바꾸는 사람이야.','','갑목 일간 · 봄(묘월) · 재성 43%')
    +it('쓴소리 한 줄','손해 안 보려다가 사람을 잃는 장면이 반복돼. 한번 정한 방향은 틀려도 안 꺾어.','','가장 큰 힘 재성 43%')
    +it('돈과 연애가 들어오는 해','돈이 제일 크게 붙는 해는 2027년, 연애운이 제일 세게 들어오는 해는 2029년.','왜 그 해인지, 몇 월에 움직여야 하는지는 평생사주에서 이어져.','앞으로 10년 세운 · 재성·관성')
    +sec('평생사주 장문 해설은 이렇게 와요','유료 · 평생사주 5,900원')
    +ch('01','한마디로',[
      '지연은 봄 숲 한가운데서 제일 먼저 하늘로 치고 올라가는 큰 나무야. 그런데 그냥 나무가 아니라, 발밑에 기름진 땅을 잔뜩 깔고 태어난 나무야.',
      '갑목 일간이 목 기운이 가장 센 묘월에 태어나서 뿌리부터 단단해(목 45%). 그리고 그 나무가 딛고 선 땅, 토가 34%나 돼. 갑목에게 토는 재성이야. 사주에서 재성은 돈, 결과, 내가 움직여서 손에 쥐는 것. 그러니까 넌 꿈만 꾸는 나무가 아니라 땅을 차지해서 열매로 바꾸는 나무야.',
      '문제는 반대쪽이 텅 비었다는 거야. 금이 4%, 관성은 3%뿐이야. 관성은 나를 다듬고 눌러 주는 힘, 그러니까 규칙·상사·평가야. 이게 얇은 사람은 남이 정해 준 틀 안에서 숨이 막혀. 지연의 인생은 "누가 시켜서"가 아니라 "내가 정해서" 굴러갈 때만 제대로 커.'
    ],'갑목 일간 · 묘월 · 목 45% · 토(재성) 34% · 관성 3%')
    +ch('07','나에게 맞는 일',[
      '재성이 제일 크고 비겁이 그걸 받치는 구조는 명리에서 대표적인 "내가 직접 뛰어서 버는" 구조야. 정해진 자리에서 같은 일을 반복하면 3년 안에 지겨워서 못 버텨.',
      '성과가 숫자로 바로 찍히는 일이 네 자리야. 영업, 세일즈, 매장·지점 운영, 부동산·분양 상담, 커머스 운영. 여기서 남보다 빠른 네 계산 속도가 그대로 돈이 돼. 역마살이 두 개라 한자리에 붙어 있는 일보다 사람 만나고 돌아다니는 일이 맞아.',
      '그리고 문창귀인·학당귀인이 있어서 말로 풀어 설명하고 가르치는 재주도 있어. 그래서 "파는 사람"에서 끝나지 말고 "파는 법을 가르치는 사람"(영업 교육, 강사, 컨설팅)으로 넘어가면 몸값이 한 번 더 뛰어.',
      '피해야 할 자리도 분명해. 위에서 평가하고 규칙으로 누르는 조직, 공무원이나 대기업 관리직 같은 곳. 관성 3%인 사람이 거기 들어가면 실력보다 "태도 문제"로 먼저 찍혀.'
    ],'재성 43% · 비겁 29% · 역마살×2 · 문창귀인 · 학당귀인')
    +ch('08','재물운',[
      '버는 힘은 상위권이야. 원국에서 재성이 제일 크니까. 그런데 모으는 힘은 완전히 다른 얘기야.',
      '비겁, 그러니까 나와 같은 기운인 동료·경쟁자·친구가 같이 크면 들어온 돈을 사람이 나눠 가져가. 동업, 친구한테 돈 빌려주기, 지인 사업에 넣는 돈. 지연한테 돈이 새는 구멍은 사치가 아니라 사람이야.',
      '시기로 보면 돈이 제일 크게 붙는 해는 2027년 정미년이야. 땅에 깔린 미토가 정재, 그러니까 꾸준히 쌓이는 돈이고, 하늘에 뜬 정화는 상관이라 말재주와 아이디어로 버는 돈이 같이 와. 영업하는 사람한테 이보다 좋은 조합은 드물어.',
      '그다음이 2029년 기유년, 또 정재가 들어오는 해야. 그러니까 순서가 중요해. 27년에 벌어서 흩지 말고, 29년까지 묶어 둬. 지금 임오 대운(27~36세)은 편인 대운이라 돈보다 공부와 전문성이 쌓이는 10년이니까, 27년에 번 돈을 몸값 올리는 데 쓰면 29년에 두 배로 돌아와.'
    ],'재성·비겁 · 2027 정미(상관·정재) · 2029 기유(정재) · 임오 대운(편인)')
    +teaser('09','연애·결혼운',[
      '연애 얘기는 좀 세게 할게. 지연은 연애에서도 계산이 먼저 돌아가. 여자 사주에서 남자는 관성인데, 관성이 3%뿐이라 "설레서 정신 못 차리는" 연애가 잘 안 돼.',
      '대신 그 빈자리가 운에서 채워지는 해가 있어. 2029년 기유년부터 2031년 신해년까지 금 기운, 그러니까 관성이 3년 연달아 들어와. 이 3년이 지연한테'
    ],'평생사주')
    +locks(['일주와 십성','쓴소리 좀 할게요','나만의 매력','나라는 사람','가족과 인연','곁에 두면 좋은 사람','지금 대운과 앞으로','나를 살리는 습관','마지막 한마디'],14);

  var COMPAT='<div class="who">예시 커플 <b>지연</b>(갑진 일주, 1995.3.14 여) · <b>민준</b>(을묘 일주, 1993.8.2 남)<br>궁합 지수 69점 · 연애·끌림 70 · 성격·대화 74 · 돈·생활 74</div>'
    +sec('무료로 바로 나오는 풀이','무료')
    +it('두 사람 궁합','♥ 69점 · 차이를 맞춰갈수록 좋아지는 관계야.','둘 다 변화와 성장을 중요하게 보는 편이라, 목표가 맞으면 같이 움직이는 속도가 빨라.','두 사람 모두 목 기운이 가장 큼')
    +sec('궁합 장문 해설은 이렇게 와요','유료 · 프리미엄 궁합 7,900원')
    +ch('01','한마디로',[
      '둘은 같은 숲에 사는 나무야. 지연은 갑목, 하늘로 곧게 뻗는 큰 나무. 민준은 을목, 그 옆을 휘감고 올라가는 덩굴. 같은 목 기운이라 처음 만났을 때 제일 크게 오는 느낌은 "얘랑은 말이 통한다"야.',
      '그런데 갑목과 을목은 명리에서 겁재 관계야. 같은 햇빛을 두고 다투는 사이. 연애 초반엔 같은 걸 좋아하는 사이였다가, 오래 갈수록 같은 걸 갖고 싶어 하는 사이가 돼. 이 커플의 숙제는 "누가 더 크게 자라냐"를 경쟁으로 만들지 않는 거야.'
    ],'지연 갑목 · 민준 을목 · 겁재 관계 · 두 사람 모두 목 최고 비중')
    +ch('04','부딪히는 부분',[
      '싸우는 모양이 정해져 있어. 지연은 방향이 정해지면 안 꺾이는 갑목이고, 민준은 부드러워 보이지만 일주가 을묘라 자기 자리(일지)까지 나무로 꽉 찬 사람이야. 겉으로 맞춰 주는 척해도 중요한 기준은 절대 안 놓아.',
      '그래서 둘은 큰소리로 싸우는 커플이 아니라 냉전이 긴 커플이야. 둘 다 "내가 맞다"를 소리 없이 끝까지 들고 가거든.',
      '특히 2026년 병오년은 오화가 지연의 월주(묘)와 민준의 일주(묘)를 동시에 파(破)로 건드려. 큰 사건보다 사소한 약속이 깨지는 일로 서운함이 쌓이는 해야. 이 해엔 서운한 게 생기면 그 주 안에 꺼내. 묵히면 둘 다 안 꺼내.'
    ],'지연 갑진 · 민준 을묘 · 2026 병오 · 오-묘 파')
    +teaser('07','돈 궁합',[
      '돈 얘기는 의외로 잘 맞아(돈·생활 74). 둘 다 목 기운이 강해서 돈을 "불리는 것"보다 "키우는 것"으로 봐.',
      '그리고 2028년 무신년에 지연한테는 편재가, 민준한테는 정재가 같이 들어와. 둘 다 돈 얘기를 꺼내기 좋은 해인데, 여기서 누가 판을 벌리고 누가'
    ],'프리미엄 궁합')
    +locks(['잘 맞는 부분','연애 궁합','결혼·생활 궁합','서로가 보는 나','앞으로의 시기','관계를 위한 한 줄'],10);

  var CTA={
    saju:{buy:'평생사주 5,900원 · 내 장문 해설 받기 ›',code:'LIFETIME_SAJU',free:'무료 풀이 먼저 볼래요',screen:'saju'},
    compat:{buy:'프리미엄 궁합 7,900원 · 우리 장문 해설 받기 ›',code:'PREMIUM_COMPAT',free:'무료 궁합 먼저 볼래요',screen:'match'}
  };
  var el=null,cur='saju';
  function build(){
    if(el)return el;
    el=doc.createElement('div');el.id='gfSample';el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');el.setAttribute('aria-label','풀이 예시');
    el.innerHTML='<div class="sh"><div class="hd"><button type="button" class="x" aria-label="닫기">✕</button><h2>이런 풀이를 받아요</h2><p>예시 인물로 미리 보여 드려요. 결제하면 내 생년월일로 똑같이 길게 풀어 드려요.</p></div>'
      +'<div class="tb"><button type="button" data-t="saju">평생사주 예시</button><button type="button" data-t="compat">궁합 예시</button></div>'
      +'<div class="bd"><div class="pn" data-p="saju">'+SAJU+'</div><div class="pn" data-p="compat" hidden>'+COMPAT+'</div></div>'
      +'<div class="ft"><button type="button" class="go"></button><button type="button" class="fr"></button><small>생년월일을 넣고 나면 결제창으로 이어져요 · 결제 전 무료 결과 먼저 확인 가능</small></div></div>';
    el.addEventListener('click',function(e){
      if(e.target===el||e.target.closest('.x')){close();return;}
      var t=e.target.closest('[data-t]');if(t){show(t.getAttribute('data-t'));return;}
      var c=CTA[cur];
      if(e.target.closest('.go')){close();try{root.guiinPaymentCenterStart(c.code);root.scrollTo(0,0);}catch(_e){try{root.go(c.screen);}catch(_x){}}return;}
      if(e.target.closest('.fr')){close();try{root.go(c.screen);root.scrollTo(0,0);}catch(_e){}}
    });
    doc.body.appendChild(el);return el;
  }
  function show(t){
    cur=CTA[t]?t:'saju';
    el.querySelectorAll('[data-t]').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-t')===cur);});
    el.querySelectorAll('[data-p]').forEach(function(p){p.hidden=p.getAttribute('data-p')!==cur;});
    el.querySelector('.go').textContent=CTA[cur].buy;
    el.querySelector('.fr').textContent=CTA[cur].free;
    el.querySelector('.bd').scrollTop=0;
  }
  function close(){if(el)el.classList.remove('on');doc.documentElement.style.overflow='';}
  root.gfOpenSample=function(t){build();show(t);el.classList.add('on');doc.documentElement.style.overflow='hidden';};
  doc.addEventListener('keydown',function(e){if(e.key==='Escape')close();});
})(typeof window!=='undefined'?window:this);

/* v4: 생년월일을 안 넣은 사람에게 오늘의 운세가 '공통 운세'임을 알리고 입력으로 연결 */
(function(root){
  'use strict';
  var doc=root.document;if(!doc)return;
  function hasMyChart(){try{return typeof chart!=='undefined'&&!!chart;}catch(_e){return false;}}
  function sync(){
    var tabs=doc.getElementById('fortuneTabs');if(!tabs)return;
    var b=doc.getElementById('gfTodayAsk'),need=!hasMyChart();
    if(need&&!b){
      b=doc.createElement('button');b.type='button';b.id='gfTodayAsk';
      b.innerHTML='<span><b>지금은 모두 같은 운세예요</b><small>내 사주 기준으로 바꿔 줘요</small></span><em>내 운세로 보기 ›</em>';
      b.addEventListener('click',function(){try{root.go('saju');root.scrollTo(0,0);}catch(_e){}});
      tabs.parentNode.insertBefore(b,tabs.nextSibling);
    }else if(!need&&b){b.remove();}
  }
  function start(){
    sync();
    var t=doc.getElementById('today');
    if(t&&root.MutationObserver)new MutationObserver(sync).observe(t,{attributes:true,attributeFilter:['class']});
  }
  if(doc.readyState==='loading')doc.addEventListener('DOMContentLoaded',start,{once:true});else start();
})(typeof window!=='undefined'?window:this);

/* v5: 이용 내역이 비어 있으면 막다른 화면 대신 무료 사주로 연결 */
(function(root){
  'use strict';
  var doc=root.document;if(!doc)return;
  function sync(){
    var v=doc.getElementById('usageHistoryView');if(!v)return;
    var empty=/아직 이용 내역이 없습니다/.test(v.textContent||'');
    var b=doc.getElementById('gfHistoryGo');
    if(empty&&!b){
      b=doc.createElement('button');b.type='button';b.id='gfHistoryGo';b.className='gfEmptyGo';b.textContent='무료로 내 사주 보기 ›';
      b.addEventListener('click',function(){try{root.go('saju');root.scrollTo(0,0);}catch(_e){}});
      v.parentNode.appendChild(b);
    }else if(!empty&&b){b.remove();}
  }
  function start(){
    sync();
    var v=doc.getElementById('usageHistoryView');
    if(v&&root.MutationObserver)new MutationObserver(sync).observe(v,{childList:true,subtree:true,characterData:true});
  }
  if(doc.readyState==='loading')doc.addEventListener('DOMContentLoaded',start,{once:true});else start();
})(typeof window!=='undefined'?window:this);

/* v7: 서머타임·옛 표준시 보정이 들어간 사주는 결과 맨 위에 한 줄로 알림 */
(function(root){
  'use strict';
  var doc=root.document;if(!doc)return;
  function note(){
    var v=doc.getElementById('resultView');if(!v||!v.firstElementChild)return;
    var c=null;try{c=typeof chart!=='undefined'?chart:null;}catch(_e){}
    var cc=c&&c.input&&c.input.clockCorrection;
    var el=doc.getElementById('gfClockNote');
    if(!cc){if(el)el.remove();return;}
    var mins=Math.abs(cc.shiftMinutes),dir=cc.shiftMinutes<0?'빼서':'더해서';
    var t=cc.corrected,hm=String(t.hour).padStart(2,'0')+':'+String(t.minute).padStart(2,'0');
    var txt='🕰 태어난 때가 '+cc.label+' 기간이라, 시계 시간에서 '+(mins===60?'1시간':mins+'분')+'을 '+dir+' 실제 시각 '+hm+' 기준으로 계산했어요.';
    if(el&&el.parentNode===v&&el.textContent===txt)return;
    if(!el){el=doc.createElement('div');el.id='gfClockNote';}
    el.textContent=txt;
    if(el.parentNode!==v||v.firstElementChild!==el)v.insertBefore(el,v.firstElementChild);
  }
  var p=false;function sched(){if(p)return;p=true;setTimeout(function(){p=false;note();},150);}
  function start(){var v=doc.getElementById('resultView');if(v&&root.MutationObserver)new MutationObserver(sched).observe(v,{childList:true});sched();}
  if(doc.readyState==='loading')doc.addEventListener('DOMContentLoaded',start,{once:true});else start();
})(typeof window!=='undefined'?window:this);
