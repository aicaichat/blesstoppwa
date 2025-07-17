

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/sanctify/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/6.a6381aef.js","_app/immutable/chunks/scheduler.c332f3f7.js","_app/immutable/chunks/index.a647b513.js","_app/immutable/chunks/globals.7f7f1b26.js","_app/immutable/chunks/appState.b697c72e.js","_app/immutable/chunks/singletons.8d9e543a.js","_app/immutable/chunks/stores.7d086311.js"];
export const stylesheets = ["_app/immutable/assets/6.9cb512b0.css"];
export const fonts = [];
