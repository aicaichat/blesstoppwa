import { c as create_ssr_component, a as subscribe, d as each, e as escape, n as noop } from "../../../chunks/ssr.js";
import { u as userSession, m as mirrorState } from "../../../chunks/appState.js";
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: ".gradient-text.svelte-1yn5jcv.svelte-1yn5jcv{background:linear-gradient(135deg, #FFD700 0%, #FFF8DC 50%, #DAA520 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}.chat-bubble.svelte-1yn5jcv.svelte-1yn5jcv{padding:12px 16px;border-radius:18px;margin:4px 0;position:relative;word-wrap:break-word}.chat-bubble.user.svelte-1yn5jcv.svelte-1yn5jcv{background:linear-gradient(135deg, #FFD700 0%, #DAA520 100%);color:#000;margin-left:auto;border-bottom-right-radius:4px}.chat-bubble.ai.svelte-1yn5jcv.svelte-1yn5jcv{background:linear-gradient(135deg, #2A2A2A 0%, #1A1A1A 100%);color:#FFF8DC;border-bottom-left-radius:4px;border:1px solid rgba(255, 215, 0, 0.2)}.typing-indicator.svelte-1yn5jcv.svelte-1yn5jcv{display:flex;gap:4px}.typing-indicator.svelte-1yn5jcv span.svelte-1yn5jcv{width:6px;height:6px;border-radius:50%;background:#FFD700;animation:svelte-1yn5jcv-typing 1.4s ease-in-out infinite}.typing-indicator.svelte-1yn5jcv span.svelte-1yn5jcv:nth-child(1){animation-delay:0s}.typing-indicator.svelte-1yn5jcv span.svelte-1yn5jcv:nth-child(2){animation-delay:0.2s}.typing-indicator.svelte-1yn5jcv span.svelte-1yn5jcv:nth-child(3){animation-delay:0.4s}@keyframes svelte-1yn5jcv-typing{0%,60%,100%{transform:translateY(0);opacity:0.5}30%{transform:translateY(-10px);opacity:1}}@media(prefers-reduced-motion: reduce){.typing-indicator.svelte-1yn5jcv span.svelte-1yn5jcv{animation:none}}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let session;
  let $$unsubscribe_session = noop, $$subscribe_session = () => ($$unsubscribe_session(), $$unsubscribe_session = subscribe(session, ($$value) => $$value), session);
  let $userSession, $$unsubscribe_userSession;
  let $$unsubscribe_mirrorState;
  $$unsubscribe_userSession = subscribe(userSession, (value) => $userSession = value);
  $$unsubscribe_mirrorState = subscribe(mirrorState, (value) => value);
  let chatHistory = [];
  let currentMessage = "";
  $$result.css.add(css);
  $$subscribe_session(session = $userSession);
  $$unsubscribe_session();
  $$unsubscribe_userSession();
  $$unsubscribe_mirrorState();
  return `${$$result.head += `<!-- HEAD_svelte-1sfmrn5_START -->${$$result.title = `<title>对话神仙 - 交个神仙朋友</title>`, ""}<meta name="description" content="与AI神仙伴侣深度对话，获得人生指导"><!-- HEAD_svelte-1sfmrn5_END -->`, ""} <div class="min-h-screen flex flex-col"> <div class="flex-shrink-0 p-4 border-b border-yellow-500/30 backdrop-blur-sm" data-svelte-h="svelte-4kycxk"><div class="text-center"><h1 class="text-2xl font-bold gradient-text svelte-1yn5jcv">心音 · 沉香之灵</h1> <p class="text-yellow-200 text-sm mt-1">千年古寺开光加持</p></div></div>  <div class="flex-1 overflow-y-auto p-4 space-y-4">${each(chatHistory, (message) => {
    return `<div class="${"flex " + escape(
      message.role === "user" ? "justify-end" : "justify-start",
      true
    )}"><div class="max-w-xs md:max-w-md">${message.role === "assistant" ? ` <div class="flex items-start gap-3"><div class="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-600 to-yellow-400 flex items-center justify-center text-black font-bold" data-svelte-h="svelte-rxar82">仙</div> <div class="chat-bubble ai svelte-1yn5jcv">${escape(message.content)}</div> </div>` : ` <div class="chat-bubble user svelte-1yn5jcv">${escape(message.content)} </div>`}</div> </div>`;
  })}  ${``}</div>  <div class="flex-shrink-0 p-4 border-t border-yellow-500/30 backdrop-blur-sm"><div class="flex gap-2"><button class="flex-shrink-0 w-12 h-12 bg-yellow-600 hover:bg-yellow-500 text-black rounded-full flex items-center justify-center transition-colors" title="语音输入" data-svelte-h="svelte-t6owl1">🎤</button> <textarea placeholder="向神仙倾诉您的困扰..." class="flex-1 resize-none rounded-xl border border-yellow-500/50 bg-black/50 text-yellow-100 placeholder-yellow-500/50 p-3 focus:border-yellow-500 focus:outline-none" rows="1">${escape("")}</textarea> <button ${!currentMessage.trim() ? "disabled" : ""} class="flex-shrink-0 px-6 py-3 bg-yellow-600 hover:bg-yellow-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-semibold rounded-xl transition-colors">发送</button></div>  ${chatHistory.length === 1 ? `<div class="mt-3 flex flex-wrap gap-2"><button class="px-3 py-1 text-sm bg-yellow-600/20 text-yellow-300 border border-yellow-500/30 rounded-full hover:bg-yellow-600/30 transition-colors" data-svelte-h="svelte-x4u6xc">感觉好多了</button> <button class="px-3 py-1 text-sm bg-yellow-600/20 text-yellow-300 border border-yellow-500/30 rounded-full hover:bg-yellow-600/30 transition-colors" data-svelte-h="svelte-1otxqgp">还是有些焦虑</button> <button class="px-3 py-1 text-sm bg-yellow-600/20 text-yellow-300 border border-yellow-500/30 rounded-full hover:bg-yellow-600/30 transition-colors" data-svelte-h="svelte-18oipzt">想要人生指导</button></div>` : ``}  ${chatHistory.length >= 3 ? `<div class="mt-4 text-center"><button class="px-8 py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-semibold rounded-xl hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300" data-svelte-h="svelte-ovie40">继续体验 →</button></div>` : ``}</div> </div>`;
});
export {
  Page as default
};
