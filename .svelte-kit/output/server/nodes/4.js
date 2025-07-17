

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/breathe/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/4.46419ed6.js","_app/immutable/chunks/scheduler.c332f3f7.js","_app/immutable/chunks/index.a647b513.js","_app/immutable/chunks/appState.b697c72e.js","_app/immutable/chunks/singletons.8d9e543a.js"];
export const stylesheets = ["_app/immutable/assets/4.f5dcd867.css"];
export const fonts = [];
