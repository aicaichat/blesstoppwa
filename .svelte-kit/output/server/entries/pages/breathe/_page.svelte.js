import { c as create_ssr_component, a as subscribe, o as onDestroy, b as add_attribute, e as escape, n as noop } from "../../../chunks/ssr.js";
import { u as userSession, b as breatheState } from "../../../chunks/appState.js";
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: ".gradient-text.svelte-14j8jsp{background:linear-gradient(135deg, #FFD700 0%, #FFF8DC 50%, #DAA520 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}.progress-ring.svelte-14j8jsp{transform:rotate(-90deg)}.progress-circle.svelte-14j8jsp{transition:stroke-dashoffset 0.3s ease}.breathing-ring.svelte-14j8jsp{position:absolute;top:50%;left:50%;border:3px solid rgba(255, 215, 0, 0.6);border-radius:50%;transition:all 0.5s ease-in-out;box-shadow:0 0 20px rgba(255, 215, 0, 0.4),\n			inset 0 0 20px rgba(255, 215, 0, 0.2)}.background-glow.svelte-14j8jsp{position:fixed;top:50%;left:50%;width:400px;height:400px;background:radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 70%);border-radius:50%;transform:translate(-50%, -50%);animation:svelte-14j8jsp-glow-pulse 4s ease-in-out infinite;z-index:-1}@keyframes svelte-14j8jsp-glow-pulse{0%,100%{transform:translate(-50%, -50%) scale(1);opacity:0.3}50%{transform:translate(-50%, -50%) scale(1.2);opacity:0.6}}@media(prefers-reduced-motion: reduce){.animate-spin.svelte-14j8jsp,.breathing-ring.svelte-14j8jsp,.background-glow.svelte-14j8jsp{animation:none}.breathing-ring.svelte-14j8jsp{transform:none !important}}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let state;
  let session;
  let $$unsubscribe_session = noop, $$subscribe_session = () => ($$unsubscribe_session(), $$unsubscribe_session = subscribe(session, ($$value) => $$value), session);
  let $$unsubscribe_state = noop, $$subscribe_state = () => ($$unsubscribe_state(), $$unsubscribe_state = subscribe(state, ($$value) => $$value), state);
  let $userSession, $$unsubscribe_userSession;
  let $breatheState, $$unsubscribe_breatheState;
  $$unsubscribe_userSession = subscribe(userSession, (value) => $userSession = value);
  $$unsubscribe_breatheState = subscribe(breatheState, (value) => $breatheState = value);
  let timeRemaining = 0;
  let progress = 0;
  let breatheRingSize = 100;
  onDestroy(() => {
  });
  $$result.css.add(css);
  $$subscribe_state(state = $breatheState);
  $$subscribe_session(session = $userSession);
  $$unsubscribe_session();
  $$unsubscribe_state();
  $$unsubscribe_userSession();
  $$unsubscribe_breatheState();
  return `${$$result.head += `<!-- HEAD_svelte-1f3y1ol_START -->${$$result.title = `<title>情绪急救中 - 交个神仙朋友</title>`, ""}<meta name="description" content="正在进行个性化情绪急救，请保持专注"><!-- HEAD_svelte-1f3y1ol_END -->`, ""} <div class="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden"> ${state.status === "preparing" ? `<div class="text-center" data-svelte-h="svelte-6c2g31"><div class="w-20 h-20 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-6 svelte-14j8jsp"></div> <h2 class="text-2xl font-semibold text-yellow-100 mb-4">正在准备您的专属体验</h2> <p class="text-yellow-200">调用古寺开光加持...</p></div>` : ``}  ${state.status === "playing" ? `<div class="text-center relative"> <div class="relative mb-8"><svg class="progress-ring svelte-14j8jsp" width="200" height="200"><circle cx="100" cy="100" r="90" stroke="rgba(255, 215, 0, 0.2)" stroke-width="4" fill="none"></circle><circle class="progress-circle svelte-14j8jsp" cx="100" cy="100" r="90" stroke="#FFD700" stroke-width="4" fill="none" stroke-dasharray="565.48"${add_attribute("stroke-dashoffset", 565.48 - progress / 100 * 565.48, 0)} transform="rotate(-90 100 100)"></circle></svg>  <div class="breathing-ring svelte-14j8jsp" style="${"width: " + escape(breatheRingSize, true) + "px; height: " + escape(breatheRingSize, true) + "px; margin-left: -" + escape(breatheRingSize / 2, true) + "px; margin-top: -" + escape(breatheRingSize / 2, true) + "px;"}"></div>  <div class="absolute inset-0 flex items-center justify-center"><div class="text-center"><div class="text-3xl font-bold text-yellow-100">${escape(Math.ceil(timeRemaining))}</div> <div class="text-sm text-yellow-300" data-svelte-h="svelte-nyvek1">秒</div></div></div></div>  ${``}  <div class="mb-8" data-svelte-h="svelte-1g1vv7x"><p class="text-lg text-yellow-200 opacity-80">跟随圆环的节奏，深深地呼吸</p></div></div>` : ``}  ${state.status === "completed" || state.status === "evaluated" ? `<div class="text-center"><div class="text-6xl mb-6" data-svelte-h="svelte-1acf0xh">🙏</div> <h2 class="text-3xl font-bold gradient-text mb-4 svelte-14j8jsp" data-svelte-h="svelte-1hwz3w4">体验完成</h2> ${state.calmScore ? `<div class="mb-6"><p class="text-xl text-yellow-100 mb-2" data-svelte-h="svelte-19e78i0">您的平静指数</p> <div class="text-4xl font-bold text-green-400">${escape(state.calmScore)}/100</div> <p class="text-sm text-yellow-300 mt-2">${escape(state.calmScore >= 80 ? "效果卓越！" : state.calmScore >= 65 ? "效果良好" : "轻微改善")}</p></div>` : ``} <p class="text-yellow-200 mb-6" data-svelte-h="svelte-xo87j">正在为您连接AI神仙伴侣...</p> <div class="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto svelte-14j8jsp"></div></div>` : ``}  ${state.status === "playing" ? `<div class="fixed bottom-6 left-0 right-0 flex justify-center gap-4 px-6">${``} <button class="px-4 py-2 bg-red-600/80 text-white rounded-lg hover:bg-red-500/80 transition-colors text-sm" data-svelte-h="svelte-fofg6c">紧急退出</button></div>` : ``}  <div class="background-glow svelte-14j8jsp"></div> </div>`;
});
export {
  Page as default
};
