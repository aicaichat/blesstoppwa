

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.3efe1778.js","_app/immutable/chunks/scheduler.c332f3f7.js","_app/immutable/chunks/index.a647b513.js","_app/immutable/chunks/stores.7d086311.js","_app/immutable/chunks/singletons.8d9e543a.js"];
export const stylesheets = [];
export const fonts = [];
