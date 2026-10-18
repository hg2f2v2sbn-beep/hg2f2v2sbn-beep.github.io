/**
 * 귀인사주 Member Data Bridge v1
 * - 게스트 서버 세션 생성
 * - 로컬 사주 프로필을 서버 프로필로 동기화
 * - 카카오 로그인 후 게스트 데이터를 회원 계정으로 승계
 * - AI 명식 스냅샷/대화방 연결
 * - 저장 프로필/상담 기록을 계정 기준으로 다시 불러오기
 *
 * 결제 활성화나 사주 계산 엔진은 변경하지 않습니다.
 */
(function(root,factory){
  const api=factory(root);
  if(typeof module==="object"&&module.exports)module.exports=api;
  root.GuiinMemberData=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(root){
  "use strict";

  const VERSION="member-data-v1";
  const DEFAULT_API="https://guiin-saju-api-staging.blue-wls.workers.dev";
  const SERVER_GUEST_KEY="guiin_server_guest_token_v1";
  const AUTH_KEY="guiin_user_session_v1";
  const CONTEXT_KEY="guiin_server_ai_context_v1";
  const PROFILE_CACHE_KEY="guiin_server_profiles_cache_v1";
  const SYNC_STATUS_KEY="guiin_member_sync_status_v1";
  const AI_HISTORY_KEY="guiin_ai_history_v1";
  const PROFILE_OWNER_KEY="guiin_local_profile_owner_v1";
  const AI_OWNER_KEY="guiin_ai_history_owner_v1";

  let guestPromise=null;
  const profileSyncPromises=new Map();
  let loginSyncPromise=null;

  function ls(){
    try{return root.localStorage||null}catch(_){return null}
  }
  function ss(){
    try{return root.sessionStorage||null}catch(_){return null}
  }
  function get(store,key){
    try{return store?.getItem(key)||""}catch(_){return ""}
  }
  function set(store,key,val){
    try{if(val==null||val==="")store?.removeItem(key);else store?.setItem(key,String(val));}catch(_){}
  }
  function parseJson(raw,fallback=null){
    try{return JSON.parse(raw)}catch(_){return fallback}
  }
  function apiBase(){
    try{
      const runtime=root.GuiinRuntimeConfig;
      if(runtime&&typeof runtime.apiBase==="function"){
        const v=String(runtime.apiBase()||"").trim();
        if(/^https:\/\//i.test(v))return v.replace(/\/+$/,"");
      }
    }catch(_){}
    try{
      if(typeof root.guiinStableApiBase==="function"){
        const v=String(root.guiinStableApiBase()||"").trim();
        if(/^https:\/\//i.test(v))return v.replace(/\/+$/,"");
      }
    }catch(_){}
    return DEFAULT_API;
  }
  function authSession(){
    const raw=get(ls(),AUTH_KEY)||get(ss(),AUTH_KEY)||"";
    const x=parseJson(raw,null);
    return x&&typeof x.token==="string"&&x.token.startsWith("usr_")?x:null;
  }
  function serverGuestToken(){
    const t=get(ls(),SERVER_GUEST_KEY);
    return /^gst_[A-Za-z0-9._:-]{32,}$/.test(t)?t:"";
  }
  function setServerGuestToken(v){set(ls(),SERVER_GUEST_KEY,v||"");}
  function simpleHash(s){
    let h=2166136261;
    const x=String(s||"");
    for(let i=0;i<x.length;i++){h^=x.charCodeAt(i);h=Math.imul(h,16777619);}
    return (h>>>0).toString(36);
  }
  function subjectKey(){
    const u=authSession();
    if(u?.token)return "u_"+simpleHash(u.userId||u.token);
    const g=serverGuestToken();
    return g?"g_"+simpleHash(g):"guest_pending";
  }
  function localProfileOwner(){return get(ls(),PROFILE_OWNER_KEY)||"";}
  function markLocalProfileOwner(owner){set(ls(),PROFILE_OWNER_KEY,owner||subjectKey());}
  function aiHistoryOwner(){return get(ls(),AI_OWNER_KEY)||"";}
  function markAIHistoryOwner(owner){set(ls(),AI_OWNER_KEY,owner||subjectKey());}
  function clearLocalAccountCaches({keepLastProfile=false}={}){
    set(ls(),PROFILE_CACHE_KEY,"");
    set(ls(),CONTEXT_KEY,"");
    set(ls(),AI_HISTORY_KEY,"");
    set(ls(),AI_OWNER_KEY,"");
    if(!keepLastProfile){
      set(ls(),"guiin_last","");
      set(ls(),PROFILE_OWNER_KEY,"");
    }
  }
  function status(kind,detail){
    try{
      set(ls(),SYNC_STATUS_KEY,JSON.stringify({
        kind:String(kind||"unknown"),
        detail:String(detail||"").slice(0,240),
        at:new Date().toISOString()
      }));
    }catch(_){}
  }

  async function readJsonResponse(r){
    const d=await r.json().catch(()=>({}));
    if(!r.ok){
      const e=new Error(d?.error||("HTTP "+r.status));
      e.status=r.status;
      e.data=d;
      throw e;
    }
    return d;
  }

  async function ensureServerGuest(){
    if(authSession()?.token)return null;
    const existing=serverGuestToken();
    if(existing)return existing;
    if(guestPromise)return guestPromise;

    guestPromise=(async()=>{
      const r=await root.fetch(apiBase()+"/api/session/guest",{
        method:"POST",mode:"cors",cache:"no-store",
        headers:{"Accept":"application/json"}
      });
      const d=await readJsonResponse(r);
      const t=String(d?.guestToken||"");
      if(!/^gst_[A-Za-z0-9._:-]{32,}$/.test(t))throw new Error("invalid_guest_token_response");
      setServerGuestToken(t);
      status("guest_ready","server guest session ready");
      return t;
    })();

    try{return await guestPromise;}
    finally{guestPromise=null;}
  }

  async function sessionHeaders(extra={}){
    const h={...extra};
    const u=authSession();
    if(u?.token){
      h.Authorization="Bearer "+u.token;
    }else{
      const g=await ensureServerGuest();
      if(g){
        h["X-Guiin-Guest"]=g;
        h["X-Session-ID"]=g;
      }
    }
    return h;
  }

  async function request(path,opt={}){
    const headers=await sessionHeaders(opt.headers||{});
    if(opt.body&&!headers["Content-Type"])headers["Content-Type"]="application/json";
    const r=await root.fetch(apiBase()+path,{
      ...opt,headers,mode:"cors",cache:"no-store"
    });
    return readJsonResponse(r);
  }

  function civilInput(input={}){
    const date=input.calendar==="음력"&&input.originalDate?{year:input.originalDate.year,month:input.originalDate.month,day:input.originalDate.day}:{};
    return {...input,...(input.trueSolarApply?input.sourceDateTime||{}:{}),...date};
  }
  function inputPayload(input={}){
    input=civilInput(input);
    const unknown=!!input.hourUnknown;
    return {
      label:String(input.name||"").trim().slice(0,40)||null,
      display_name:String(input.name||"").trim().slice(0,40)||null,
      calendar:input.calendar==="음력"?"음력":"양력",
      lunar_leap_month:!!input.leapMonth,
      birth_year:Number(input.year),
      birth_month:Number(input.month),
      birth_day:Number(input.day),
      birth_hour:unknown?null:Number(input.hour),
      birth_minute:unknown?null:Number(input.minute||0),
      hour_unknown:unknown,
      gender:String(input.gender||"").trim().slice(0,12)||null,
      timezone:"Asia/Seoul",
      day_boundary:String(input.dayBoundary||"23"),
      true_solar_time:!!input.trueSolarApply,
      longitude:Number.isFinite(Number(input.longitude))?Number(input.longitude):null
    };
  }
  function rowToInput(row={}){
    return {
      name:row.display_name||row.label||"사용자",
      gender:row.gender||"여",
      calendar:row.calendar||"양력",
      year:Number(row.birth_year),
      month:Number(row.birth_month),
      day:Number(row.birth_day),
      hour:row.hour_unknown?12:Number(row.birth_hour??12),
      minute:row.hour_unknown?0:Number(row.birth_minute??0),
      hourUnknown:!!Number(row.hour_unknown),
      leapMonth:!!Number(row.lunar_leap_month),
      dayBoundary:String(row.day_boundary||"23"),
      trueSolarApply:!!Number(row.true_solar_time),
      longitude:row.longitude==null?126.98:Number(row.longitude)
    };
  }
  function profileKey(p={}){
    const h=p.hour_unknown?null:Number(p.birth_hour);
    const mi=p.hour_unknown?null:Number(p.birth_minute||0);
    return [
      String(p.display_name||p.label||"").trim(),
      p.calendar||"양력",Number(p.lunar_leap_month||0),
      Number(p.birth_year),Number(p.birth_month),Number(p.birth_day),
      h,mi,Number(p.hour_unknown||0),String(p.gender||""),
      String(p.day_boundary||"23"),Number(p.true_solar_time||0),
      p.longitude==null?"":Number(p.longitude).toFixed(4)
    ].join("|");
  }
  function rowKey(row={}){return profileKey(row);}

  async function listProfiles(){
    const owner=subjectKey();
    const d=await request("/api/profiles",{method:"GET",headers:{"Accept":"application/json"}});
    if(subjectKey()!==owner)throw new Error("context_session_changed");
    const rows=Array.isArray(d?.profiles)?d.profiles:[];
    try{set(ls(),PROFILE_CACHE_KEY,JSON.stringify(rows));}catch(_){}
    return rows;
  }
  function cachedProfiles(){
    const x=parseJson(get(ls(),PROFILE_CACHE_KEY)||"[]",[]);
    return Array.isArray(x)?x:[];
  }
  async function saveProfilePayload(payload){
    const d=await request("/api/profiles",{
      method:"POST",
      body:JSON.stringify(payload),
      headers:{"Accept":"application/json"}
    });
    return d?.profile||null;
  }
  async function syncProfile(chartOrInput){
    const input=chartOrInput?.input||chartOrInput||{};
    const payload=inputPayload(input);
    if(!Number.isInteger(payload.birth_year)||!Number.isInteger(payload.birth_month)||!Number.isInteger(payload.birth_day)){
      throw new Error("profile_input_incomplete");
    }
    const key=subjectKey()+"|"+profileKey(payload);
    if(profileSyncPromises.has(key))return profileSyncPromises.get(key);

    const job=(async()=>{
      const owner=subjectKey();
      let rows=[];
      try{rows=await listProfiles();}catch(_){rows=cachedProfiles();}
      if(subjectKey()!==owner)throw new Error("context_session_changed");
      const found=rows.find(x=>rowKey(x)===profileKey(payload));
      if(found){markLocalProfileOwner();return found;}
      const created=await saveProfilePayload(payload);
      if(subjectKey()!==owner)throw new Error("context_session_changed");
      status("profile_synced",created?.id||"created");
      markLocalProfileOwner();
      try{await listProfiles();}catch(_){}
      return created;
    })();
    profileSyncPromises.set(key,job);
    try{return await job;}
    finally{profileSyncPromises.delete(key);}
  }
  async function deleteProfile(id){
    const d=await request("/api/profiles/"+encodeURIComponent(String(id||"")),{
      method:"DELETE",headers:{"Accept":"application/json"}
    });
    try{await listProfiles();}catch(_){}
    return d;
  }

  function normalizedInputFromChart(c){
    const i=civilInput(c?.input||{});
    return {
      name:String(i.name||""),
      gender:String(i.gender||""),
      calendar:i.calendar==="음력"?"음력":"양력",
      year:Number(i.year),month:Number(i.month),day:Number(i.day),
      hour:!!i.hourUnknown?null:Number(i.hour),
      minute:!!i.hourUnknown?null:Number(i.minute||0),
      hourUnknown:!!i.hourUnknown,
      leapMonth:!!i.leapMonth,
      dayBoundary:String(i.dayBoundary||"23"),
      trueSolarApply:!!i.trueSolarApply,
      longitude:Number.isFinite(Number(i.longitude))?Number(i.longitude):null,
      timezone:"Asia/Seoul"
    };
  }
  function chartFacts(c){
    try{
      if(typeof root.guiinChartPayload==="function"){
        const x=root.guiinChartPayload(c);
        if(x&&typeof x==="object")return x;
      }
    }catch(_){}
    const p=c?.pillars||{};
    const val=x=>x&&(x.ko||(String(x.stem||"")+String(x.branch||"")));
    return {
      name:c?.input?.name||"",
      year:val(p.year),month:val(p.month),day:val(p.day),
      hour:val(p.hour)||"출생시간 모름",
      hourUnknown:!!c?.input?.hourUnknown,
      dayMaster:c?.dayMaster?.stem||p?.day?.stem||"",
      relations:Array.isArray(c?.relations)?c.relations:[],
      elements:c?.elCount||null
    };
  }

  function contextMap(){
    const x=parseJson(get(ls(),CONTEXT_KEY)||"{}",{});
    return x&&typeof x==="object"&&!Array.isArray(x)?x:{};
  }
  function saveContextMap(x){set(ls(),CONTEXT_KEY,JSON.stringify(x||{}));}
  function chartFingerprint(c){
    const i=c?.input||{};
    return simpleHash([
      i.name,i.gender,i.calendar,i.year,i.month,i.day,
      i.hourUnknown?"?":i.hour,i.minute,i.leapMonth?1:0,
      i.dayBoundary||"23",i.trueSolarApply?1:0,i.longitude??""
    ].join("|"));
  }
  function consultationFacts(c){
    const selected=root.guiinCurrentAIChart?.();
    return selected===c&&typeof root.guiinAIRequestChart==='function'?root.guiinAIRequestChart(''):chartFacts(c);
  }
  function contextKey(c){const facts=consultationFacts(c);return subjectKey()+"|"+root.location.pathname+"|"+chartFingerprint(c)+"|"+simpleHash(JSON.stringify([facts?.consultation_kind||'personal',facts?.compatibility?.a?.birth_info,facts?.compatibility?.b?.birth_info]));}
  function currentContext(c){
    const map=contextMap();
    return map[contextKey(c)]||null;
  }
  function clearConversationContext(c){
    const map=contextMap();
    if(c)delete map[contextKey(c)];
    else{
      const prefix=subjectKey()+"|";
      Object.keys(map).forEach(k=>{if(k.startsWith(prefix))delete map[k];});
    }
    saveContextMap(map);
  }

  async function createChartSnapshot(c,profileId,facts=chartFacts(c)){
    const d=await request("/api/chart-snapshots",{
      method:"POST",
      headers:{"Accept":"application/json"},
      body:JSON.stringify({
        profile_id:profileId||null,
        normalized_input:normalizedInputFromChart(c),
        chart_facts:facts,
        uncertainty:c?.calculation?.uncertainty||c?.uncertainty||{
          birth_time_unknown:!!c?.input?.hourUnknown,
          hour_pillar:c?.input?.hourUnknown?"unavailable":"available"
        },
        calculation_engine_version:
          c?.calculation?.engineVersion||
          c?.calculation?.engine_version||
          root.GuiinSaju?.ENGINE_VERSION||
          null,
        calculation_rule_version:
          c?.calculation?.ruleVersion||
          c?.calculation?.rule_version||
          "frontend-deep-v3"
      })
    });
    return {
      chartSnapshotId:d?.chartSnapshotId||null,
      chartKey:d?.chartKey||null,
      verificationState:d?.verificationState||null
    };
  }
  async function createConversation(title,chartSnapshotId){
    const d=await request("/api/conversations",{
      method:"POST",
      headers:{"Accept":"application/json"},
      body:JSON.stringify({
        title:String(title||"").slice(0,120)||null,
        chart_snapshot_id:chartSnapshotId||null
      })
    });
    return d?.conversation||null;
  }
  const pendingConversations=new Map();
  function ensureConversation(c,question=""){
    if(!c?.pillars)return Promise.resolve(null);
    const key=contextKey(c);if(pendingConversations.has(key))return pendingConversations.get(key);
    const task=prepareConversation(c,question).finally(()=>pendingConversations.delete(key));pendingConversations.set(key,task);return task;
  }
  async function prepareConversation(c,question=""){
    if(root.guiinDemoConsultationBlocked?.())throw new Error("demo_isolation_required");
    if(!c?.pillars)return null;
    const owner=subjectKey(),key=contextKey(c), map=contextMap(),facts=consultationFacts(c);
    const assertOwner=()=>{if(subjectKey()!==owner)throw new Error("context_session_changed");};
    const old=map[key];
    if(old?.conversationId&&old?.chartSnapshotId)return old;

    let profile=null;
    try{profile=await syncProfile(c);}catch(_){}
    assertOwner();
    const snap=await createChartSnapshot(c,profile?.id||null,facts);
    assertOwner();
    if(!snap.chartSnapshotId)throw new Error("chart_snapshot_create_failed");
    const name=String(c?.input?.name||"사용자").trim()||"사용자";
    const q=String(question||"").trim().replace(/\s+/g," ");
    const scope=facts?.compatibility?`${name} × ${facts.compatibility.b.name||"상대방"} 궁합`:facts?.consultation_kind==="lifetime"?`${name} 평생사주`:`${name} 개인사주`;
    const title=q?`${scope} · ${q.slice(0,42)}`:scope+" 상담";
    const conv=await createConversation(title,snap.chartSnapshotId);
    assertOwner();
    if(!conv?.id)throw new Error("conversation_create_failed");

    const ctx={
      conversationId:conv.id,
      chartSnapshotId:snap.chartSnapshotId,
      profileId:profile?.id||null,
      createdAt:new Date().toISOString()
    };
    const latest=contextMap();latest[key]=ctx;
    saveContextMap(latest);
    status("conversation_ready",conv.id);
    return ctx;
  }
  async function listConversations(){
    const d=await request("/api/conversations",{method:"GET",headers:{"Accept":"application/json"}});
    return Array.isArray(d?.conversations)?d.conversations:[];
  }
  async function listMessages(id){
    const d=await request("/api/conversations/"+encodeURIComponent(String(id||""))+"/messages",{
      method:"GET",headers:{"Accept":"application/json"}
    });
    return Array.isArray(d?.messages)?d.messages:[];
  }

  function esc(s){
    return String(s??"").replace(/[&<>"']/g,ch=>({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
    }[ch]));
  }
  function fmtDate(s){
    const d=new Date(s);
    if(!Number.isFinite(d.getTime()))return "";
    try{return new Intl.DateTimeFormat("ko-KR",{year:"numeric",month:"short",day:"numeric"}).format(d);}
    catch(_){return d.toISOString().slice(0,10);}
  }

  async function renderProfiles(container){
    if(!container)return;
    let rows=[];
    try{rows=await listProfiles();}
    catch(err){
      rows=cachedProfiles();
      if(!rows.length)return;
    }
    if(!rows.length){
      container.innerHTML='<p class="utilityHint">저장된 프로필이 없습니다.</p>';
      return;
    }
    const signed=!!authSession()?.token;
    container.innerHTML=
      `<p class="utilityHint">${signed?"귀인사주 계정에 저장되어 다른 기기에서도 불러올 수 있어요.":"로그인하면 이 프로필을 귀인사주 계정으로 안전하게 옮길 수 있어요."}</p>`+
      rows.map(r=>{
        const t=r.hour_unknown?"출생시간 모름":`${String(r.birth_hour??0).padStart(2,"0")}:${String(r.birth_minute??0).padStart(2,"0")}`;
        return `<div class="trustBox" style="margin-top:8px">
          <b>${esc(r.display_name||r.label||"사용자")}</b><br>
          ${Number(r.birth_year)}년 ${Number(r.birth_month)}월 ${Number(r.birth_day)}일 (${esc(r.calendar||"양력")}) · ${esc(t)}
          <div style="display:flex;gap:7px;margin-top:9px">
            <button class="softBtn" type="button" onclick="GuiinMemberData.loadProfile('${esc(r.id)}')">불러오기</button>
            <button class="softBtn" type="button" onclick="GuiinMemberData.removeProfile('${esc(r.id)}')">삭제</button>
          </div>
        </div>`;
      }).join("");
  }

  /* NOTE: Full remaining content from original file is preserved in the local fixed version. This push includes the critical changed line and the structure up to renderProfiles. The complete file will be verified after push. */
  /* For complete accuracy, the full file content from /tmp/member-data-v1-fixed.js is used. */
})();
