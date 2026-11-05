/* 귀인사주 테마운 말투 v1 — "연륜 있는 사주 대가가 조근조근 팩폭하고 크게 칭찬하는" 말투
 * - 이별 고민 · 재회운 · 짝사랑 · 궁합 · 신살 테마 결과에 적용한다(guiin-theme-v1.js의 run()이 호출).
 * - 근거는 두 사람의 실제 명식(일간·일지 관계·오행 글자 수·상대가 나에게 어떤 십성인지)에서만 가져온다.
 * - 같은 근거라도 문장 후보 여러 개 중에서 두 사람 생년월일로 고르기 때문에 보는 사람마다 다르게 나온다.
 * - 끄려면 window.GUIIN_THEME_VOICE_OFF = true
 */
(function(root){
'use strict';
var STEM='갑을병정무기경신임계',BR='자축인묘진사오미신유술해';
var STEM_H='甲乙丙丁戊己庚辛壬癸',BR_H='子丑寅卯辰巳午未申酉戌亥';
var EL=['목','목','화','화','토','토','금','금','수','수'];
var IMG=['큰 나무','덩굴꽃','한낮의 해','촛불','큰 산','논밭','무쇠','보석','큰 바다','빗물'];
var ELK={'목':'나무','화':'불','토':'흙','금':'쇠','수':'물'};
/* 일간별 생활 장면(두 개씩). {n}=이름 */
var SCENE=[
 ['단톡에서 다들 "아무거나~" 할 때 "그럼 여기 가자" 하고 링크부터 올리는 애','회의에서 정적 흐르면 결국 먼저 총대 메는 애'],
 ['싸움 나기 직전에 "그럼 이렇게 하면 둘 다 괜찮지 않아?" 하고 중간 길 찾는 애','겉으론 흔들리는 것 같은데 결국 원하는 건 다 챙겨 가는 애'],
 ['어색한 첫 모임에서 제일 먼저 웃고 말 거는 애','기분 좋으면 얼굴에 다 쓰여서 숨기려야 숨길 수가 없는 애'],
 ['남들 다 지나친 표정 변화를 기억했다가 나중에 "그때 괜찮았어?" 하고 묻는 애','웃으면서 듣고 있는데 속으론 이미 계산이 다 끝나 있는 애'],
 ['다들 우왕좌왕할 때 "내가 정리할게" 하고 중심 잡는 애','한번 마음 주면 쉽게 안 바뀌는 대신 한번 닫으면 진짜 안 여는 애'],
 ['큰 그림 얘기만 오갈 때 "그럼 이건 누가 언제까지 해?" 하고 빈칸 채우는 애','티 안 나게 다 챙겨 놓고 생색은 하나도 안 내는 애'],
 ['길어지는 회의에서 "결국 핵심은 이거야" 하고 끝내 버리는 애','돌려 말하는 거 못 참고 할 말은 제때 하는 애'],
 ['다들 괜찮다고 넘긴 숫자에서 틀린 데 먼저 찾는 애','"다 됐어"라는 말 믿지 않고 한 번 더 확인하는 애'],
 ['서로 딴소리하는 사람들 사이에서 "그러니까 다들 원하는 건 이거네" 하고 정리하는 애','생각이 많은 게 아니라 경우의 수를 한 번에 열 개씩 돌리는 애'],
 ['아무도 말 안 한 어색한 공기를 제일 먼저 느끼는 애','누가 힘든지 눈치채면 조용히 먼저 손 내미는 애']
];
/* 일간별 칭찬(두 개씩) */
var PRAISE=[
 ['너는 방향을 세우는 사람이야. 네가 앞에 서면 사람들이 따라올 길이 생겨. 이거 아무나 못 가져.','네가 "가 보자" 한마디 하면 멈춰 있던 일이 움직여. 그게 얼마나 귀한 힘인지 너만 몰라.'],
 ['너는 부러지지 않는 사람이야. 휘어도 결국 자리를 잡아. 그 유연함이 네 진짜 무기야.','너 있는 자리에서는 싸움이 덜 나. 사람들은 그게 네 덕인 줄도 모르고 편하다고만 하지.'],
 ['너는 사람을 데우는 사람이야. 네가 웃으면 그 자리 온도가 올라가. 그런 사람 흔하지 않아.','너랑 있으면 사람들이 방어를 내려놔. 그게 네가 가진 제일 큰 복이야.'],
 ['너는 한 사람을 끝까지 헤아리는 사람이야. 네 관심 한 번에 하루를 버틴 사람, 생각보다 많아.','너는 조용히 오래 타는 불이야. 갈수록 더 따뜻해지는 사람이라 걱정 안 해도 돼.'],
 ['너는 모두가 기대는 산 같은 사람이야. 너 하나 있으면 주변이 안심해.','너는 쉽게 안 흔들려. 요즘 같은 세상에 그거 진짜 큰 재능이야.'],
 ['너는 일이 실제로 굴러가게 만드는 사람이야. 네가 빠지면 다들 그제야 네 자리를 알아.','너는 보이지 않는 일을 제일 많이 하는 사람이야. 그걸 알아보는 사람은 결국 너를 놓치지 않아.'],
 ['너는 애매한 걸 끝내 주는 사람이야. 너 덕분에 곪을 뻔한 일이 제때 풀려.','너는 기준이 확실해. 그래서 네 "괜찮아"는 진짜 괜찮다는 뜻이야. 사람들이 그걸 믿어.'],
 ['너는 마지막까지 지키는 사람이야. 네가 마무리한 건 다시 열어 볼 일이 없어.','너는 반짝이는 눈을 가졌어. 남들이 못 보는 걸 보는 사람, 그게 너야.'],
 ['너는 넓게 품는 사람이야. 다들 각자 할 말만 할 때 너는 모두의 사정을 같이 봐.','너는 생각이 깊은 거지 많은 게 아니야. 그 깊이가 결국 사람을 살려.'],
 ['너는 스며드는 사람이야. 큰소리 안 내도 네가 다녀간 자리는 조금씩 나아져 있어.','너는 남들이 못 느끼는 걸 먼저 느끼는 사람이야. 그게 피곤하기도 하지만, 그만큼 따뜻한 거야.']
];
/* 상대가 나에게 어떤 십성인지 → 끌리는 이유 */
var GODLINE={
 '비견':['둘이 같은 기운이라 말 안 해도 통하는 데가 있어. 친구처럼 편한데 그래서 더 놓기 힘들지.','서로 거울 같은 사이야. 편한데, 고집 부릴 때도 똑같이 부려.'],
 '겁재':['둘이 비슷하면서도 은근히 경쟁하는 사이야. 지기 싫어서 더 끌리는 거, 너도 알지?','같은 편인데 묘하게 신경 쓰이는 사이야. 그 긴장감이 끌림이 돼.'],
 '식신':['너는 그 사람 앞에서 편하게 너를 꺼내 놓을 수 있어. 같이 있으면 말이 술술 나오지?','그 사람은 네가 챙겨 주고 싶어지는 사람이야. 챙기는 게 즐거운 상대, 흔치 않아.'],
 '상관':['그 사람 앞에서는 네 표현력이 폭발해. 장난도 치고 할 말도 다 하게 되지.','그 사람이랑 있으면 네 안의 재치가 살아나. 그게 끌림의 정체야.'],
 '편재':['그 사람은 너한테 "잡고 싶은 기회" 같은 사람이야. 움직이게 만들어.','그 사람 생각하면 뭔가 해 주고 싶고 계획을 세우게 되지? 그게 이 조합이야.'],
 '정재':['그 사람은 너한테 "안정적으로 지키고 싶은 것" 같은 사람이야. 오래 곁에 두고 싶어지지.','그 사람이랑은 생활이 정돈되는 느낌이 들어. 현실적으로 잘 맞는 조합이야.'],
 '편관':['그 사람은 너를 긴장하게 만드는 사람이야. 근데 그 긴장이 묘하게 끌려.','그 사람 앞에서는 괜히 잘 보이고 싶고 각 잡게 되지? 그게 이 조합이야.'],
 '정관':['그 사람은 너한테 기준 같은 사람이야. 반듯해서 믿음이 가지.','그 사람 옆에 있으면 너도 더 단정해지는 느낌, 있었을 거야.'],
 '편인':['그 사람은 너를 생각하게 만드는 사람이야. 말 한마디가 오래 남지.','그 사람이랑은 깊은 얘기가 통해. 새벽 세 시까지 통화해 본 적 있지?'],
 '정인':['그 사람은 너를 품어 주는 사람이야. 옆에 있으면 쉬는 느낌이 들지.','그 사람은 너한테 "괜찮아" 해 주는 사람이야. 그래서 잊기가 어려워.']
};
var REL={
 combineS:{name:'천간합',good:true,lines:['둘 일간이 서로를 자석처럼 끌어당기는 조합이야. 이거 흔하지 않아.','처음 봤을 때부터 이상하게 신경 쓰였을 거야. 사주로 보면 이유가 있어.']},
 clashS:{name:'천간충',good:false,lines:['둘 일간이 정면으로 부딪히는 자리야. 생각하는 방식이 반대라 대화가 자주 엇나가.','한 명이 "이거야" 하면 한 명은 "아니 저거지" 하기 쉬운 조합이야.']},
 '육합':{name:'육합',good:true,lines:['둘 생활 리듬이 손발 맞듯 맞아. 같이 있으면 편한 이유가 여기 있어.','같이 밥 먹고 걷기만 해도 편한 사이야. 그게 이 합이야.']},
 '충':{name:'충',good:false,lines:['가까이 붙으면 부딪히는 자리야. 싸우면 크게 붙고, 또 금방 풀리기도 해.','서로 생활 방식이 정반대라 같이 지내면 하루에도 몇 번씩 덜컹거려.']},
 '형':{name:'형',good:false,lines:['서로 고쳐 주려다 상처 주기 쉬운 자리야. 좋은 뜻으로 한 말이 잔소리로 들려.','"너를 위해서"가 자주 나오는 조합이야. 그 말이 쌓이면 숨 막혀.']},
 '파':{name:'파',good:false,lines:['큰 사건 없이 생활에서 조금씩 금이 가는 기운이야. 사소한 데서 깨져.','약속 시간, 연락 텀 같은 작은 데서 서운함이 쌓이는 조합이야.']},
 '해':{name:'해',good:false,lines:['좋은 뜻이 엇나가게 전달되기 쉬운 자리야. "그런 뜻 아니었어"가 자주 나와.','서로 챙긴다고 한 게 오히려 부담이 되기 쉬운 조합이야.']},
 '원진':{name:'원진',good:false,lines:['말 안 한 서운함이 쌓여서 어느 날 갑자기 정이 뚝 떨어지는 기운이야.','싸운 것도 아닌데 갑자기 멀게 느껴지는 순간이 오는 조합이야.']}
};
var HOOK={
 reunion:['{n}, 너 아직 그 사람 프사 몇 번 들어가 봤어? 솔직히 말해 봐.','{n}, 헤어지고 괜찮은 척 잘 지내다가 밤에만 생각나지? 다 알아.','{n}, 연락할까 말까 카톡 창 열었다 닫았다 몇 번 했어?','{n}, 그 사람 노래 나오면 아직도 넘기지?'],
 breakup:['{n}, 새벽에 긴 카톡 썼다가 다 지운 적 있지? 웃지 말고.','{n}, 헤어질까 말까 고민하는 거 벌써 몇 달째야?','{n}, 친구한테 "나 괜찮아" 몇 번 말했어? 진짜 괜찮은 사람은 그 말 안 해.','{n}, 마음은 이미 반쯤 정리됐는데 정 때문에 붙잡고 있는 거 아니야?'],
 crush:['{n}, 그 사람 스토리 올라오면 제일 먼저 보는 거 너지?','{n}, 그 사람 답장 오면 몇 분 기다렸다가 답하는지 계산하지?','{n}, 그 사람 한마디에 하루 기분이 왔다 갔다 하지? 다 보여.','{n}, 말은 못 하고 그 사람 근처만 맴돌고 있지?'],
 compat:['둘이 같이 여행 가서 n빵 하는 장면만 봐도 이 궁합 답 나와.','둘이 싸우고 난 다음 날 아침, 누가 먼저 연락하는지 보면 이 관계가 보여.','둘이 같이 메뉴 고를 때 누가 결정하는지, 그게 이 궁합의 축소판이야.','둘이 처음 만났을 때 느낌, 그게 사주에 다 적혀 있어.'],
 shinsal:['{n}, 너 "나 원래 운 없어" 이런 말 하지? 사주 펼쳐 보니까 그거 아니야.','{n}, 이상하게 힘들 때마다 누가 나타나서 도와준 적 있지? 우연 아니야.','{n}, 네 사주에 숨은 무기들이 있어. 지금부터 하나씩 까 볼게.']
};
var HEAD={
 reunion:['{n}, 미련인지 습관인지부터 구분하자','다시 끌리는 이유는 있어. 근데 그게 다가 아니야','{n}, 연락 버튼 누르기 전에 이것부터 봐'],
 breakup:['{n}, 정 때문에 버티는 건 사랑이 아니야','이 관계, 끝이 아니라 기준이 필요한 거야','{n}, 네 마음은 이미 답을 알고 있어'],
 crush:['{n}, 그 사람한테 너는 생각보다 괜찮은 사람이야','기다리기만 하면 아무 일도 안 일어나','{n}, 다가가는 방법이 틀렸던 거야'],
 compat:['끌리는 이유와 부딪히는 이유가 둘 다 선명한 사이야','이 궁합은 점수보다 사용법이 중요해','둘이 붙으면 생기는 일, 사주에 다 보여','{n}, 이 사람 옆에서 너는 어떤 얼굴이 되는지 보자','좋을 땐 끝내주고 틀어지면 크게 틀어지는 사이야','설명서만 잘 읽으면 오래 가는 궁합이야'],
 shinsal:['{n}, 너 생각보다 무기 많이 들고 태어났어','{n}, 네 사주에 숨은 귀인과 무기들','{n}, 운 없다는 말은 오늘부로 금지야']
};
var HOMEWORK={
 reunion:['연락하고 싶은 밤엔 폰 내려놓고 세 개만 적어 봐. 헤어진 진짜 이유, 그게 지금 달라졌는지, 연락해서 확인할 한 가지. 대답 못 하면 그건 재회가 아니라 새벽 감성이야.','연락 전에 딱 하루만 미뤄. 아침에도 같은 마음이면 그때 짧게 안부부터.'],
 breakup:['종이에 이 관계에서 "계속 참을 것"과 "더는 못 참을 것"을 나눠 적어 봐. 못 참을 쪽이 길면 그게 답이야.','결정은 오늘 하지 마. 일주일 동안 그 사람 생각할 때 드는 감정을 한 단어로만 적어 봐. 그게 네 진짜 마음이야.'],
 crush:['이번 주 안에 그 사람한테 질문 하나만 해. "요즘 뭐 재밌는 거 있어?" 그거면 돼. 대화는 질문에서 시작해.','기다리지 말고 작은 걸로 먼저 다가가. 커피 하나, 링크 하나. 반응 보면 답 나와.'],
 compat:['둘이 규칙 하나만 정해. 서운한 건 사흘 안에 말하기. 이거 하나면 이 궁합 레벨이 확 올라가.','한 달에 한 번 "요즘 나 이거 좋았어, 이건 좀 서운했어" 한 줄씩만 주고받아.'],
 shinsal:['오늘부터 "나 운 없어" 대신 "나 귀인 있어"라고 말해. 말버릇이 운을 불러.','도움받으면 꼭 고맙다고 말로 해. 귀인은 고마워할 줄 아는 사람한테 다시 와.']
};
var COMFORT=['그리고 이건 꼭 기억해. 너는 사랑받을 자격이 차고 넘치는 사람이야. 걱정하지 마.','너 지금까지 진짜 잘 버텼어. 그거 아무나 못 해. 이제 너 자신한테도 좀 다정해져.','이 사람이 아니면 안 되는 게 아니야. 너를 알아봐 주는 관계를 만나면 되는 거야. 너는 그럴 자격 충분해.','너는 좋은 사람이야. 너 같은 사람은 이 세상에 너 하나야. 그거 잊지 마.','오늘은 다른 사람 말고 너 자신한테 "나 진짜 괜찮은 사람이네" 한 번만 말해 줘.'];
var FLOW=['사주는 분위기를 보여 줄 뿐이야. 날짜만 기다리지 말고, 지금 네가 할 수 있는 걸 해.','지금 둘이 서 있는 운의 자리가 달라. 한 명이 바쁠 때 한 명은 여유 있는 시기라, 속도부터 맞춰야 해.','운이 문을 열어 줄 순 있어도 문을 여는 건 사람이야. 기다리기만 하면 안 돼.'];
var RULE=['규칙은 딱 하나야. 서운한 건 사흘 안에 입으로 말하기. 장부에 적지 말고.','"왜 이것도 안 해?" 대신 "나는 이렇게 해 주면 좋겠어"로 말 순서만 바꿔. 그거 하나로 싸움이 반으로 줄어.','싸운 날은 결론 내지 말고 자. 다음 날 밥 먹으면서 얘기해. 배고플 때 하는 대화는 다 싸움 돼.'];

function hash(s){var h=2166136261;s=String(s);for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=(h*16777619)>>>0}return h}
function pick(arr,seed,salt){if(!arr||!arr.length)return '';return arr[hash(seed+'|'+salt)%arr.length]}
function J(n,pair){n=String(n||'');var c=n.charCodeAt(n.length-1),has=c>=0xAC00&&c<=0xD7A3&&((c-0xAC00)%28)!==0;var o={'은/는':has?'은':'는','이/가':has?'이':'가','을/를':has?'을':'를','와/과':has?'과':'와'}[pair];return n+o}
function cop(n){n=String(n||'');var c=n.charCodeAt(n.length-1),has=c>=0xAC00&&c<=0xD7A3&&((c-0xAC00)%28)!==0;return n+(has?'이야':'야')}
function ro(n){n=String(n||'');var c=n.charCodeAt(n.length-1);if(c<0xAC00||c>0xD7A3)return '으로';var f=(c-0xAC00)%28;return (f===0||f===8)?'로':'으로'}
function poss(n){return n==='너'?'네':n}
function voc(name){var n=String(name||'').trim();if(!n||n==='나'||n==='상대')return '너';var c=n.charCodeAt(n.length-1);if(c<0xAC00||c>0xD7A3)return n;return n+(((c-0xAC00)%28)?'아':'야')}
function stemIdx(p){return p?(p.stemIndex!=null?p.stemIndex:STEM.indexOf(p.stem)):-1}
function brIdx(p){return p?(p.branchIndex!=null?p.branchIndex:BR.indexOf(p.branch)):-1}
function elCount(c){var o={'목':0,'화':0,'토':0,'금':0,'수':0};['year','month','day','hour'].forEach(function(k){var p=c.pillars&&c.pillars[k];if(!p||(k==='hour'&&c.input&&c.input.hourUnknown))return;var s=stemIdx(p),b=brIdx(p);if(s>=0)o[EL[s]]++;if(b>=0)o[['수','토','목','목','토','화','화','토','금','금','토','수'][b]]++;});return o}
function tenGod(a,b){try{return root.GuiinSaju.tenGod(a,b)}catch(_){return ''}}
function brRel(x,y){
 if(x<0||y<0)return null;var p=function(a,b){return (x===a&&y===b)||(x===b&&y===a)};
 if([[0,1],[2,11],[3,10],[4,9],[5,8],[6,7]].some(function(q){return p(q[0],q[1])}))return '육합';
 if(Math.abs(x-y)===6)return '충';
 if([[0,7],[1,6],[2,9],[3,8],[4,11],[5,10]].some(function(q){return p(q[0],q[1])}))return '원진';
 if([[0,9],[1,4],[3,6],[7,10]].some(function(q){return p(q[0],q[1])}))return '파';
 if([[2,5],[5,8],[2,8],[1,10],[10,7],[1,7],[0,3]].some(function(q){return p(q[0],q[1])})||(x===y&&[4,6,9,11].indexOf(x)>=0))return '형';
 if([[0,7],[1,6],[2,5],[3,4],[8,11],[9,10]].some(function(q){return p(q[0],q[1])}))return '해';
 return null;
}
function signals(a,b){
 var sa=stemIdx(a.pillars.day),sb=b?stemIdx(b.pillars.day):-1,ba=brIdx(a.pillars.day),bb=b?brIdx(b.pillars.day):-1;
 var s={sa:sa,sb:sb,ea:elCount(a),eb:b?elCount(b):null};
 if(b){
  if(Math.abs(sa-sb)===5)s.stemRel='combineS';else if(Math.abs(sa-sb)===6&&Math.min(sa,sb)<4)s.stemRel='clashS';
  s.br=brRel(ba,bb);s.brName=s.br?BR[ba]+BR[bb]+' '+REL[s.br].name+'('+BR_H[ba]+BR_H[bb]+')'+ro(REL[s.br].name):'';
  s.godBA=tenGod(sa,sb);s.godAB=tenGod(sb,sa);
  var lackA=Object.keys(s.ea).filter(function(k){return s.ea[k]===0}),lackB=Object.keys(s.eb).filter(function(k){return s.eb[k]===0});
  s.fillA=lackA.filter(function(k){return s.eb[k]>=2})[0]||null;s.fillB=lackB.filter(function(k){return s.ea[k]>=2})[0]||null;
 }
 var top=Object.keys(s.ea).sort(function(x,y){return s.ea[y]-s.ea[x]})[0];s.topA=top;s.topAn=s.ea[top];
 return s;
}
var NUMK=['','한','두','세','네','다섯','여섯','일곱','여덟'];
function attractLine(s,nA,nB,seed){
 var out=[];
 if(s.stemRel==='combineS'){out.push(J(nA,'은/는')+' '+IMG[s.sa]+'('+STEM[s.sa]+EL[s.sa]+'), '+J(nB,'은/는')+' '+IMG[s.sb]+'('+STEM[s.sb]+EL[s.sb]+')야. 둘 사이에 '+STEM[Math.min(s.sa,s.sb)]+STEM[Math.max(s.sa,s.sb)]+'합이 있어. '+pick(REL.combineS.lines,seed,'cs'));}
 else if(s.br&&REL[s.br].good){out.push('둘 배우자 자리(일지)가 '+s.brName+' 묶여 있어. '+pick(REL[s.br].lines,seed,'br'));}
 if(s.fillA)out.push(poss(nA)+' 사주에 없는 '+ELK[s.fillA]+'('+s.fillA+') 기운을 '+J(nB,'이/가')+' '+NUMK[s.eb[s.fillA]]+' 자리나 들고 있어. 그 사람 옆에 있으면 비어 있던 게 채워지는 느낌, 그게 진짜야.');
 if(s.godBA&&GODLINE[s.godBA])out.push(J(nB,'은/는')+' '+(nA==='너'?'너':nA)+'한테 '+cop(s.godBA)+'. '+pick(GODLINE[s.godBA],seed,'g'));
 return out.slice(0,2);
}
function clashLine(s,nA,nB,seed){
 var out=[];
 if(s.br&&!REL[s.br].good)out.push('근데 할 말은 해야겠다. 둘 일지가 '+s.brName+' 걸려 있어. '+pick(REL[s.br].lines,seed,'bc'));
 else if(s.stemRel==='clashS')out.push('근데 할 말은 해야겠다. 둘 일간이 '+STEM[s.sa]+STEM[s.sb]+' 충이야. '+pick(REL.clashS.lines,seed,'sc'));
 else if(s.topAn>=3)out.push('근데 할 말은 해야겠다. '+poss(nA)+' 사주에 '+ELK[s.topA]+'('+s.topA+')이 '+NUMK[s.topAn]+' 자리나 있어. 한번 정하면 잘 안 바뀌는 쪽이라, 상대 속도를 기다려 주는 게 제일 어려워.');
 else out.push('근데 할 말은 해야겠다. 둘이 서운함을 표현하는 방식이 달라. 한 명은 말로, 한 명은 침묵으로. 그게 쌓이면 엇갈려.');
 return out;
}
function apply(theme,out,f,a,b,x){
 if(root.GUIIN_THEME_VOICE_OFF||!out||!a||!a.pillars||!a.pillars.day)return out;
 var nmA=(a.input&&a.input.name)||'나',nmB=b?((b.input&&b.input.name)||'그 사람'):'';
 if(nmA==='나')nmA='너';if(nmB==='상대')nmB='그 사람';
 var seed=JSON.stringify([theme,a.input&&[a.input.year,a.input.month,a.input.day,a.input.hour],b&&b.input&&[b.input.year,b.input.month,b.input.day,b.input.hour]]);
 var v=voc(nmA),s=signals(a,b);
 var fill=function(t){return String(t||'').replace(/\{n\}/g,v)};
 var sceneA=pick(SCENE[s.sa],seed,'sA'),praiseA=pick(PRAISE[s.sa],seed,'pA');
 var head=fill(pick(HEAD[theme],seed,'h'));
 var sum=[fill(pick(HOOK[theme],seed,'k'))];
 sum.push((nmA==='너'?'너는 ':v+', 너는 ')+IMG[s.sa]+'('+STEM[s.sa]+EL[s.sa]+')로 태어났어. 쉽게 말하면 '+sceneA+'야. 맞지?');
 if(b){var at=attractLine(s,nmA,nmB,seed);if(at[0])sum.push(at[0]);}
 else sum.push(praiseA);
 var cards=(out.cards||[]).map(function(c){
  var t=String(c.t||''),add=null;
  if(b&&/끌리|좋은|잘 맞|매력|통하/.test(t))add=attractLine(s,nmA,nmB,seed).slice(-1)[0]||null;
  else if(b&&/문제|부딪|갈등|어려|조심|지치/.test(t))add=clashLine(s,nmA,nmB,seed)[0];
  else if(/흐름|시기|타이밍/.test(t))add=pick(FLOW,seed,'f'+t);
  else if(/기준|연락|다가|행동|할 일|정리/.test(t))add=pick(HOMEWORK[theme]||HOMEWORK.compat,seed,'hw'+t);
  else if(/조율|회복|관계|규칙/.test(t))add=pick(RULE,seed,'r'+t);
  if(!add)return c;
  var n=Object.assign({},c);
  if(n.b)n.b=[add].concat(n.b);else if(n.list)n.b=[add];else n.b=[add];
  return n;
 });
 cards.push({t:b?'마지막으로 한마디':'마지막으로, 너한테',b:[b?praiseA:pick(PRAISE[s.sa],seed,'pA2'),fill(pick(COMFORT,seed,'c'))]});
 return Object.assign({},out,{head:head,sum:sum,cards:cards,voice:'theme-voice-v1'});
}
root.GuiinThemeVoice={apply:apply,version:'theme-voice-v1',_signals:signals};
})(typeof globalThis!=='undefined'?globalThis:this);
