

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/awake/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.5ce460d5.js","_app/immutable/chunks/scheduler.c332f3f7.js","_app/immutable/chunks/index.a647b513.js","_app/immutable/chunks/each.e59479a4.js","_app/immutable/chunks/appState.b697c72e.js","_app/immutable/chunks/singletons.8d9e543a.js"];
export const stylesheets = ["_app/immutable/assets/3.559a6a34.css"];
export const fonts = [];
