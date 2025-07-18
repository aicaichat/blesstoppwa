export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14'),
	() => import('./nodes/15'),
	() => import('./nodes/16'),
	() => import('./nodes/17'),
	() => import('./nodes/18'),
	() => import('./nodes/19'),
	() => import('./nodes/20'),
	() => import('./nodes/21'),
	() => import('./nodes/22'),
	() => import('./nodes/23')
];

export const server_loads = [];

export const dictionary = {
		"/": [2],
		"/animation-test": [3],
		"/avatar-demo": [4],
		"/awake": [5],
		"/breathe": [6],
		"/debug": [7],
		"/design-demo": [8],
		"/mirror-test": [10],
		"/mirror": [9],
		"/sanctify": [11],
		"/share": [12],
		"/status": [13],
		"/taichi-demo": [14],
		"/test-all": [15],
		"/test-api": [16],
		"/test-vrm-fix": [18],
		"/test-vrm": [17],
		"/virtual-wife": [19],
		"/vrm-demo": [20],
		"/vrm-info": [21],
		"/vrm-showcase": [22],
		"/vrm-test": [23]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
};

export { default as root } from '../root.svelte';