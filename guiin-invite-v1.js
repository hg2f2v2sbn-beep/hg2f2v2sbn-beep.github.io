/* 귀인사주 궁합 초대 링크 v1 — 내 사주를 본 사람이 링크를 보내면, 받은 사람은 자기 생년월일만 넣고 두 사람 궁합을 본다. */
(function(root){
  "use strict";
  if(root.__guiinInvite)return;root.__guiinInvite=true;
  var doc=root.document;if(!doc)return;
  var SITE="https://gwiinsaju.com/";
  function $(id){return doc.getElementById(id)}
  function esc(v){return String(v==null?"":v).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
  function track(ev,name){try{root.__guiinTrack&&root.__guiinTrack.send(ev,name||null)}catch(_){}}
  function popup(msg,title){try{if(typeof root.showGuiinPopup==="function")return root.showGuiinPopup(msg,title||"알림")}catch(_){}try{alert(msg)}catch(_){}}
  function api(path,init){if(typeof root.guiinApi==="function")return root.guiinApi(path,init);var b="https://guiin-saju-api.blue-wls.workers.dev";try{var r=root.GuiinRuntimeConfig;if(r&&r.apiBase)b=String(r.apiBase()).replace(/\/+$/,"")}catch(_){}return fetch(b+path,init)}
  function wa(name){var c=String(name||"").slice(-1).charCodeAt(0);return c>=0xAC00&&c<=0xD7A3&&(c-0xAC00)%28?"과":"와"}
  function josa(name){var c=String(name||"").slice(-1).charCodeAt(0);return c>=0xAC00&&c<=0xD7A3&&(c-0xAC00)%28?"이":"가"}

  /* ---------- 1) 초대 링크 만들기 ---------- */
  var busy=false;
  root.guiinInviteCreate=async function(){
    if(busy)return;
    var c=null;try{c=(typeof chart!=="undefined"&&chart)?chart:root.chart}catch(_){c=root.chart}
    if(!c||!c.input){popup("먼저 내 사주를 봐야 초대 링크를 만들 수 있어요.","궁합 초대");try{root.go&&root.go("home")}catch(_){}return;}
    var i=c.input,name=String(i.name||"").trim();
    if(!name||name==="사용자"){popup("초대 링크에는 내 이름이 필요해요. 이름을 넣고 사주를 다시 봐 주세요.","궁합 초대");try{root.go&&root.go("saju")}catch(_){}return;}
    busy=true;var btn=doc.querySelector(".gInvBtn");if(btn)btn.disabled=true;
    try{
      var body={name:name,year:i.year,month:i.month,day:i.day,hour:i.hourUnknown?null:i.hour,minute:i.hourUnknown?null:i.minute,gender:i.gender};
      var r=await api("/api/invite",{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify(body)});
      var d=null;try{d=await r.json()}catch(_){}
      if(!r.ok||!d||!d.ok||!d.token){popup(d&&d.error==="too_many"?"오늘은 초대 링크를 너무 많이 만들었어요. 내일 다시 해 주세요.":"초대 링크를 만들지 못했어요. 잠시 뒤 다시 해 주세요.","궁합 초대");return;}
      track("invite_create");
      var url=SITE+"?inv="+encodeURIComponent(d.token)+"&utm_source=invite&utm_medium=compat";
      var text=name+josa(name)+" 우리 궁합 보자고 초대했어 💞\n네 이름이랑 생년월일만 넣으면 바로 나와.";
      if(navigator.share){try{await navigator.share({title:"귀인사주 궁합 초대",text:text,url:url});return;}catch(e){if(e&&e.name==="AbortError")return;}}
      var copied=false;try{await navigator.clipboard.writeText(text+"\n"+url);copied=true}catch(_){}
      popup(copied?"초대 링크를 복사했어요. 카톡이나 DM에 붙여넣기 해서 보내 주세요.":"아래 링크를 복사해서 보내 주세요.\n"+url,"궁합 초대 링크");
    }catch(_){popup("초대 링크를 만들지 못했어요. 인터넷 연결을 확인해 주세요.","궁합 초대")}
    finally{busy=false;if(btn)btn.disabled=false}
  };

  /* ---------- 2) 초대 링크로 들어온 사람 ---------- */
  var token="";try{token=new URLSearchParams(root.location.search).get("inv")||""}catch(_){}
  if(!/^[A-Za-z0-9]{10,16}$/.test(token))return;
  var inviter=null;

  function setSeg(id,v){var s=$(id);if(!s)return;s.querySelectorAll("button").forEach(function(b){b.classList.toggle("on",b.dataset.v===v)})}
  function setVal(id,v){var e=$(id);if(e)e.value=(v==null?"":v)}
  function close(){var s=$("gInvSheet");if(s)s.remove();doc.body.classList.remove("gInvOpen")}
  function parseBirth(raw){
    raw=String(raw||"").trim();var y=0,m=0,d=0,parts=raw.split(/[^0-9]+/).filter(Boolean),cy=new Date().getFullYear();
    if(parts.length===3){y=+parts[0];m=+parts[1];d=+parts[2];if(y<100)y+=y>cy%100?1900:2000}
    else{var n=raw.replace(/\D/g,"");if(n.length===8){y=+n.slice(0,4);m=+n.slice(4,6);d=+n.slice(6,8)}else if(n.length===6){y=+n.slice(0,2);m=+n.slice(2,4);d=+n.slice(4,6);y+=y>cy%100?1900:2000}}
    if(!y||!m||!d)return {err:"생년월일 8자리를 넣어 주세요. 예) 19980315"};
    if(y<1900||y>cy||m<1||m>12||d<1||d>31||new Date(y,m-1,d).getDate()!==d)return {err:y+"년 "+m+"월 "+d+"일은 없는 날짜예요. 다시 확인해 주세요."};
    return {y:y,m:m,d:d};
  }
  root.guiinInviteGo=function(){
    var msg=$("gInvMsg"),say=function(t){if(msg)msg.textContent=t||""};say("");
    var nm=String(($("gInvName")||{}).value||"").trim();
    if(!nm){say("이름을 넣어 주세요.");$("gInvName")&&$("gInvName").focus();return}
    var b=parseBirth(($("gInvBirth")||{}).value);
    if(b.err){say(b.err);$("gInvBirth")&&$("gInvBirth").focus();return}
    var g=(doc.querySelector("#gInvGender button.on")||{}).dataset;g=g&&g.v||"여";
    /* 나 = 초대받은 사람, 상대 = 초대한 사람 */
    setVal("aName",nm.slice(0,12));setSeg("aGender",g);setVal("aYear",b.y);setVal("aMonth",b.m);setVal("aDay",b.d);setVal("aHour","");setVal("aMin","");
    setVal("bName",inviter.name);setSeg("bGender",inviter.gender==="남"?"남":"여");setVal("bYear",inviter.year);setVal("bMonth",inviter.month);setVal("bDay",inviter.day);
    setVal("bHour",inviter.hour==null?"":inviter.hour);setVal("bMin",inviter.hour==null?"":(inviter.minute==null?0:inviter.minute));
    close();track("invite_done");
    try{api("/api/invite/done",{method:"POST",keepalive:true,headers:{"Content-Type":"application/json"},body:JSON.stringify({t:token})}).catch(function(){})}catch(_){}
    try{root.go&&root.go("match");if(typeof root.submitMatch==="function")root.submitMatch()}catch(_){}
  };
  root.guiinInvitePick=function(el){el.parentNode.querySelectorAll("button").forEach(function(x){x.classList.toggle("on",x===el)})};

  function show(){
    if($("gInvSheet"))return;
    var n=esc(inviter.name),w=doc.createElement("div");
    w.id="gInvSheet";w.className="gInvSheet";w.setAttribute("role","dialog");w.setAttribute("aria-modal","true");
    w.innerHTML='<div class="gInvBox"><button type="button" class="gInvX" aria-label="닫기" onclick="this.closest(\'.gInvSheet\').remove();document.body.classList.remove(\'gInvOpen\')">×</button>'+
      '<div class="gInvKick">💞 궁합 초대</div><h3><b>'+n+'</b>'+josa(inviter.name)+' 궁합을 보자고 초대했어요</h3>'+
      '<p>내 이름과 생년월일만 넣으면 두 사람 궁합이 바로 나와요. 무료예요.</p>'+
      '<input id="gInvName" maxlength="12" autocomplete="off" placeholder="내 이름">'+
      '<input id="gInvBirth" inputmode="numeric" maxlength="10" autocomplete="bday" placeholder="내 생년월일 8자리  예) 19980315" onkeydown="if(event.key===\'Enter\')guiinInviteGo()">'+
      '<div class="gInvSeg" id="gInvGender"><button type="button" class="on" data-v="여" onclick="guiinInvitePick(this)">여성</button><button type="button" data-v="남" onclick="guiinInvitePick(this)">남성</button></div>'+
      '<div id="gInvMsg" class="gInvMsg" role="alert"></div>'+
      '<button type="button" class="gInvGo" onclick="guiinInviteGo()">'+n+wa(inviter.name)+' 우리 궁합 보기 ›</button>'+
      '<div class="gInvNote">양력 기준 · 태어난 시간은 몰라도 돼요</div></div>';
    doc.body.appendChild(w);doc.body.classList.add("gInvOpen");
  }
  async function load(){
    try{
      var r=await api("/api/invite?t="+encodeURIComponent(token),{method:"GET",headers:{"Accept":"application/json"}});
      var d=await r.json();
      if(!r.ok||!d||!d.ok){popup("초대 링크가 만료됐거나 잘못된 링크예요. 직접 궁합을 볼 수 있어요.","궁합 초대");return}
      inviter=d;track("invite_open");
      try{var u=new URL(root.location.href);u.searchParams.delete("inv");root.history.replaceState(root.history.state,"",u.pathname+(u.search||"")+u.hash)}catch(_){}
      show();
    }catch(_){}
  }
  if(doc.readyState==="complete")setTimeout(load,300);else root.addEventListener("load",function(){setTimeout(load,300)});
})(typeof globalThis!=="undefined"?globalThis:this);
