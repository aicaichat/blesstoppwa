import { c as create_ssr_component, a as subscribe, e as escape, b as add_attribute } from "../../chunks/ssr.js";
import { p as page } from "../../chunks/stores.js";
const app = "";
const _layout_svelte_svelte_type_style_lang = "";
const css = {
  code: "body{overflow-x:hidden}main.svelte-7gs8bm{font-family:var(--font-serif);background:radial-gradient(ellipse at center, #1a1a1a 0%, #0f0f0f 100%)}",
  map: null
};
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$result.css.add(css);
  $$unsubscribe_page();
  return `${$$result.head += `<!-- HEAD_svelte-1rv7l9o_START -->${$$result.title = `<title>${escape($page.data?.title || "交个神仙朋友")}</title>`, ""}<meta name="description"${add_attribute("content", $page.data?.description || "千年古寺开光的沉香手串 × AI-Native 神仙伴侣", 0)}><!-- HEAD_svelte-1rv7l9o_END -->`, ""}  <main class="min-h-screen relative overflow-hidden svelte-7gs8bm"> <div class="relative z-10">${slots.default ? slots.default({}) : ``}</div> </main>`;
});
export {
  Layout as default
};
