import { writable } from 'svelte/store';

// Global app state
export const appState = writable({
	isOnline: true,
	hasWebGPU: false,
	hasNFC: false,
	userId: null,
	sessionData: {},
	performance: {
		ttfb: 0,
		fcp: 0,
		lcp: 0
	}
});

// User session store
export const userSession = writable({
	duration: null, // 30, 60, 90
	calmScore: null,
	chatHistory: [],
	donationAmount: 36,
	breatheStartTime: null,
	fingerprintHash: null,
	nfcId: null,
	certificateData: null
});

// Analytics store
export const analytics = writable({
	events: [],
	sessionStart: Date.now()
});

// Simple page states (replacing XState)
export const sanctifyState = writable({
	status: 'idle', // idle, scanning, fetching, fetched, generating_pdf, pdf_ready, error
	nfcId: null,
	certificateData: null,
	pdfBlob: null,
	error: null
});

export const awakeState = writable({
	status: 'loading', // loading, ready, selected
	particlesLoaded: false,
	selectedDuration: null
});

export const breatheState = writable({
	status: 'init', // init, preparing, playing, completed, error
	duration: null,
	startTime: null,
	endTime: null,
	calmScore: null,
	error: null
});

export const mirrorState = writable({
	status: 'idle', // idle, listening, transcribing, streaming, speaking, error
	isListening: false,
	transcription: '',
	aiResponse: '',
	chatHistory: [],
	error: null
});

// Utility functions
export function trackEvent(event, properties = {}) {
	analytics.update(state => ({
		...state,
		events: [...state.events, {
			name: event,
			properties,
			timestamp: Date.now()
		}]
	}));
	
	console.log('Analytics:', event, properties);
}

export function updatePerformance(metric, value) {
	appState.update(state => ({
		...state,
		performance: {
			...state.performance,
			[metric]: value
		}
	}));
}

export function checkCapabilities() {
	const capabilities = {
		hasWebGPU: 'gpu' in navigator,
		hasNFC: 'nfc' in navigator,
		hasWebGL: (() => {
			try {
				const canvas = document.createElement('canvas');
				return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
			} catch (e) {
				return false;
			}
		})(),
		hasWebAudio: 'AudioContext' in window || 'webkitAudioContext' in window,
		hasGamepad: 'getGamepads' in navigator,
		isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
	};

	appState.update(state => ({
		...state,
		...capabilities
	}));

	return capabilities;
} 