/* 귀인사주 풀이 다듬기 v1 (2026-10-28)
 * 사주·궁합 결과 화면이 여러 모듈의 문장을 이어 붙이면서 생기는 군더더기를 마지막에 정리한다.
 * 계산·점수·근거 데이터와 화면 구조(요소)는 건드리지 않고, 보이는 문장(텍스트)만 다룬다.
 *  1) 화면에 이미 나온 문장과 똑같은 문장이 또 나오면 뒤쪽을 지운다.
 *  2) "학파에 따라", "확정이 아니라" 같은 안내 문장은 화면마다 한 번만 남긴다.
 *  3) 누구에게나 할 수 있는 칭찬·내부 작성 메모·변명성 안내 문장은 지운다.
 *  4) (사주 화면만) 일간 대표 표현은 두 번까지만 그대로 쓰고 이후엔 "이 감지력"처럼 줄인다.
 * 모든 수정은 원문을 기억해 두었다가, 화면이 바뀔 때마다(다른 모듈이 덧붙이거나 숨겨도) 원문으로 되돌린 뒤 다시 계산한다.
 * 끄려면 window.GUIIN_READING_POLISH_OFF = true
 */
(function(){
  'use strict';
  if(window.GuiinReadingPolish)return;
  var ROOT_IDS=['resultView','matchView'];
  var SKIP_SEL='script,style,textarea,input,button,select,h1,h2,h3,h4,h5,h6,summary,nav,[data-polish-skip],[class*="Toc"],[class*="TOC"],[class*="toc"]';

  var TOOL=['방향을 세우는 힘','조율하는 감각','분위기를 여는 표현력','작은 신호를 알아채는 섬세함','중심을 잡는 책임감','빠진 곳을 채우는 실무력','결론을 내리는 결단','끝까지 확인하는 정밀함','여러 입장을 잇는 이해력','분위기를 먼저 읽는 감지력',
    '확신이 선 방향을 끝까지 지키는 힘','먼저 웃어 주는 다정함','맡은 약속을 지키려는 성실함','근거 있는 결단','넓게 들어 주는 이해력','끝내 목표를 이루는 끈기','끝까지 지키는 뚝심','끝까지 키워 내는 책임감','완성도를 끌어올리는 기준','조용히 흐름을 돌리는 집중력'];
  var HEAD=['방향을 먼저 세우는','부딪히기 전에 길을 찾아내는','자리를 먼저 데우는','한 사람을 오래 헤아리는','흔들려도 중심을 잡아 주는','빠진 칸을 채워 주는','애매한 걸 끝내 주는','마지막 한 군데까지 확인하는','여러 사정을 한꺼번에 읽는','분위기의 변화를 먼저 읽는'];

  var NOTICE=[
    /학파/,
    /(?:확정|판정|단정|보증)(?:한|하는|하지|할)?\s*(?:게|것은|건|표가|날짜가)?\s*아니/,
    /(?:사건을|결과를)\s*(?:예언|확정|정해)/,
    /실제\s*경험과\s*다른\s*부분은/,
    /명식만으로(?:는)?\s*알\s*수\s*없/,
    /투자\s*조언이\s*아니/
  ];
  var DROP=[
    /같은\s*(?:문장|설명)을\s*(?:카드마다\s*)?반복하지\s*않고/,
    /오류(?:는|가)\s*아니야/,
    /^너는\s*평범한\s*사람이\s*아니야\.?$/,
    /분포\s*%는\s*같은\s*글자에서\s*나온\s*크기라/
  ];

  var norm=function(t){return String(t||'').replace(/\s+/g,' ').trim();};
  function esc(s){return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}
  var SENT_RE=/[^.!?…]+[.!?…]+["”’)]?\s*|[^.!?…]+$/g;

  function visible(el){try{
    var d=el.closest('details:not([open])');if(d&&!el.closest('summary'))return false;
    if(typeof el.checkVisibility==='function'&&!el.checkVisibility({visibilityProperty:true}))return false;
    return el.getClientRects().length>0&&getComputedStyle(el).visibility!=='hidden';
  }catch(_){return false;}}

  /* 수정한 텍스트 노드의 원문 */
  var touched=new Map();
  function setText(node,v){if(!touched.has(node))touched.set(node,node.nodeValue);node.nodeValue=v;}
  function restore(root){touched.forEach(function(orig,node){if(!node.isConnected){touched.delete(node);return;}if(root.contains(node)){node.nodeValue=orig;touched.delete(node);}});}

  function textNodes(root){
    var out=[],w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:function(n){
      if(!n.nodeValue||!n.nodeValue.trim())return NodeFilter.FILTER_REJECT;
      var p=n.parentElement;if(!p||p.closest(SKIP_SEL)||!visible(p))return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;}});
    while(w.nextNode())out.push(w.currentNode);return out;
  }

  function sentencePass(nodes){
    var seen=new Set(),noticeSeen=new Set(),changed=0;
    nodes.forEach(function(node){
      var v=node.nodeValue,parts=v.match(SENT_RE);if(!parts||!parts.length)return;
      var kept=[],mod=false;
      parts.forEach(function(sent){
        var t=norm(sent);if(!t){kept.push(sent);return;}
        if(DROP.some(function(r){return r.test(t);})){mod=true;return;}
        var gi=-1;NOTICE.some(function(r,i){if(r.test(t)){gi=i;return true;}return false;});
        if(gi>=0&&t.length<=160){if(noticeSeen.has(gi)){mod=true;return;}noticeSeen.add(gi);}
        if(t.length>=18&&/[.!?…]["”’)]?$/.test(t)){if(seen.has(t)){mod=true;return;}seen.add(t);}
        kept.push(sent);
      });
      if(mod){setText(node,kept.join(''));changed++;}
    });
    return changed;
  }

  function phrasePass(nodes){
    var count=new Map(),changed=0;
    var rules=TOOL.map(function(p){var w=p.split(' ');return {re:new RegExp(esc(p),'g'),key:p,limit:2,rep:'이 '+w[w.length-1]};})
      .concat(HEAD.map(function(p){return {re:new RegExp(esc(p)+'(?=\\s*사람)','g'),key:p,limit:3,rep:'이런'};}));
    nodes.forEach(function(node){
      var v=node.nodeValue,nv=v;
      rules.forEach(function(r){nv=nv.replace(r.re,function(m){var c=(count.get(r.key)||0)+1;count.set(r.key,c);return c>r.limit?r.rep:m;});});
      if(nv!==v){setText(node,nv);changed++;}
    });
    return changed;
  }

  var stats={};
  function polish(root){
    if(window.GUIIN_READING_POLISH_OFF||!root)return;
    try{
      restore(root);
      var s={sentences:sentencePass(textNodes(root))};
      /* 궁합 화면은 두 사람의 표현이 섞여 있어서 줄이지 않는다 */
      s.phrases=root.id==='resultView'?phrasePass(textNodes(root)):0;
      s.at=Date.now();stats[root.id]=s;
    }catch(e){try{console.warn('GUIIN_READING_POLISH',e);}catch(_){}}
  }

  /* 화면이 잠잠해지면(0.35초 변화 없음) 정리. 계속 바뀌어도 1.5초 안에는 한 번 정리. */
  var timers={},first={};
  function schedule(root,tries){
    tries=tries||0;clearTimeout(timers[root.id]);
    var now=Date.now();if(!first[root.id])first[root.id]=now;
    var wait=tries?300:Math.max(0,Math.min(350,1500-(now-first[root.id])));
    timers[root.id]=setTimeout(function(){
      if(!visible(root)){if(tries<40)schedule(root,tries+1);return;}
      first[root.id]=0;polish(root);
    },wait);
  }
  function watch(){
    ROOT_IDS.forEach(function(id){
      var root=document.getElementById(id);if(!root||root.__guiinPolishObs)return;
      var obs=new MutationObserver(function(){schedule(root);});
      /* 다른 모듈이 문단을 숨기거나 펼쳐도 다시 계산(텍스트 수정 자체는 감시하지 않아 무한 반복 없음) */
      obs.observe(root,{childList:true,subtree:true,attributes:true,attributeFilter:['style','class','hidden','open']});
      root.__guiinPolishObs=obs;
      if(root.children.length)schedule(root);
    });
  }
  window.GuiinReadingPolish={polish:polish,stats:stats,version:'1.1-20261028'};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',watch);else watch();
})();
