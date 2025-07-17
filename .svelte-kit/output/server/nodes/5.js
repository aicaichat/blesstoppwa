

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/mirror/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/5.912c9aa5.js","_app/immutable/chunks/scheduler.c332f3f7.js","_app/immutable/chunks/index.a647b513.js","_app/immutable/chunks/each.e59479a4.js","_app/immutable/chunks/appState.b697c72e.js","_app/immutable/chunks/singletons.8d9e543a.js"];
export const stylesheets = ["_app/immutable/assets/5.1b40539d.css"];
export const fonts = [];
