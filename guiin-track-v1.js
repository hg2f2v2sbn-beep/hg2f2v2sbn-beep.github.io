/* 귀인사주 방문 경로·단계 측정 v1 — 생년월일·이름 같은 개인정보는 보내지 않습니다. */
(function(root){
  "use strict";
  if(root.__guiinTrack)return;
  var doc=root.document;if(!doc)return;
  if(/demo\.html$/.test(root.location.pathname))return;
  var PROD="https://guiin-saju-api.blue-wls.workers.dev";
  function ls(){try{return root.localStorage}catch(_){return null}}
  function ss(){try{return root.sessionStorage}catch(_){return null}}
  function rid(n){var c="ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789",s="";try{var a=new Uint8Array(n);root.crypto.getRandomValues(a);for(var i=0;i<n;i++)s+=c[a[i]%c.length];}catch(_){for(var j=0;j<n;j++)s+=c[Math.floor(Math.random()*c.length)];}return s}
  var L=ls(),S=ss(),isNew=false,vid="",sid="";
  try{vid=L&&L.getItem("guiin_vid")||"";if(!/^v_[A-Za-z0-9]{10,40}$/.test(vid)){vid="v_"+rid(20);isNew=true;L&&L.setItem("guiin_vid",vid);}}catch(_){vid="v_"+rid(20);isNew=true}
  try{sid=S&&S.getItem("guiin_sid")||"";if(!sid){sid="s_"+rid(12);S&&S.setItem("guiin_sid",sid);}}catch(_){sid="s_"+rid(12)}
  var q={};try{q=Object.fromEntries(new URLSearchParams(root.location.search))}catch(_){}
  var utm={source:q.utm_source||q.src||"",medium:q.utm_medium||"",campaign:q.utm_campaign||""};
  function refHost(){try{var h=doc.referrer?new URL(doc.referrer).hostname.replace(/^www\./,""):"";return /gwiinsaju\.com$|github\.io$/.test(h)?"":h}catch(_){return ""}}
  /* 처음 들어온 경로는 기기에 한 번만 저장해서 나중의 결제와 연결한다 */
  var first="";
  try{first=L&&L.getItem("guiin_first_src")||"";if(!first){first=(utm.source?"utm:"+utm.source:(refHost()||"direct")).slice(0,80);L&&L.setItem("guiin_first_src",first);}}catch(_){}
  function base(){try{var r=root.GuiinRuntimeConfig;var v=r&&typeof r.apiBase==="function"?r.apiBase():"";return String(v||PROD).replace(/\/+$/,"")}catch(_){return PROD}}
  function send(ev,name){
    try{
      var body=JSON.stringify({ev:ev,name:name||null,vid:vid,sid:sid,path:root.location.pathname,ref:ev==="visit"?doc.referrer:"",utm:ev==="visit"?utm:null,first:first,isNew:ev==="visit"&&isNew});
      var init={method:"POST",keepalive:true,cache:"no-store",headers:{"Content-Type":"application/json","Accept":"application/json"},body:body};
      var p=typeof root.guiinApi==="function"?root.guiinApi("/api/track",init):fetch(base()+"/api/track",init);
      if(p&&p.catch)p.catch(function(){});
    }catch(_){}
  }
  var seen={};
  function once(ev,name){var k=ev+":"+(name||"");if(seen[k])return;seen[k]=1;send(ev,name)}
  root.__guiinTrack={send:send,once:once,vid:function(){return vid}};

  /* 1) 방문: 탭마다 한 번 */
  try{if(!(S&&S.getItem("guiin_visit_sent"))){S&&S.setItem("guiin_visit_sent","1");send("visit");}}catch(_){send("visit")}

  /* 2) 화면 단계: .screen 이 active 가 되면 화면 이름을 한 번씩 */
  var WATCH={saju:1,result:1,match:1,matchResult:1,ask:1,today:1,paymentInfo:1,paymentResult:1,login:1,signup:1,yearLuck:1,wallet:1};
  function scan(){try{var a=doc.querySelector(".screen.active");if(a&&WATCH[a.id])once("screen",a.id)}catch(_){}}
  function watch(){
    var list=doc.querySelectorAll(".screen");if(!list.length)return;
    scan();
    try{var mo=new MutationObserver(scan);list.forEach(function(s){mo.observe(s,{attributes:true,attributeFilter:["class"]})})}catch(_){}
    /* 결제 시트는 버튼이 실행 중에 다시 만들어지므로 시트가 열리는 순간을 본다 */
    ["premiumSheet","compatSheet","paySheet"].forEach(function(id){
      var el=doc.getElementById(id);if(!el)return;var was=el.classList.contains("on");
      try{new MutationObserver(function(){var on=el.classList.contains("on");if(on&&!was)send("pay_open",id);was=on}).observe(el,{attributes:true,attributeFilter:["class"]})}catch(_){}
    });
  }
  if(doc.readyState==="loading")doc.addEventListener("DOMContentLoaded",watch);else watch();

  /* 3) 클릭 단계: 입력 완료·결제·공유·가입 */
  function txt(el){return String(el&&(el.getAttribute("onclick")||"")+" "+(el.textContent||"")).slice(0,200)}
  doc.addEventListener("click",function(e){
    try{
      var b=e.target&&e.target.closest?e.target.closest("button,a,[onclick],[data-grc-share]"):null;if(!b)return;
      var t=txt(b),oc=b.getAttribute("onclick")||"";
      if(/submitSaju/.test(oc))send("birth_submit");
      else if(/submitMatch/.test(oc))send("compat_submit");
      else if(b.hasAttribute("data-grc-share")||/guiinShareResult|navigator\.share|공유/.test(t))send("share");
      else if(/startKakaoLogin|startNaverLogin|go\('signup'\)|go\('login'\)/.test(oc))send("signup_open");
    }catch(_){}
  },true);
})(typeof globalThis!=="undefined"?globalThis:this);
