import { w as writable } from "./index2.js";
const userSession = writable({
  duration: null,
  // 30, 60, 90
  calmScore: null,
  chatHistory: [],
  donationAmount: 36,
  breatheStartTime: null,
  fingerprintHash: null,
  nfcId: null,
  certificateData: null
});
const sanctifyState = writable({
  status: "idle",
  // idle, scanning, fetching, fetched, generating_pdf, pdf_ready, error
  nfcId: null,
  certificateData: null,
  pdfBlob: null,
  error: null
});
const awakeState = writable({
  status: "loading",
  // loading, ready, selected
  particlesLoaded: false,
  selectedDuration: null
});
const breatheState = writable({
  status: "init",
  // init, preparing, playing, completed, error
  duration: null,
  startTime: null,
  endTime: null,
  calmScore: null,
  error: null
});
const mirrorState = writable({
  status: "idle",
  // idle, listening, transcribing, streaming, speaking, error
  isListening: false,
  transcription: "",
  aiResponse: "",
  chatHistory: [],
  error: null
});
export {
  awakeState as a,
  breatheState as b,
  mirrorState as m,
  sanctifyState as s,
  userSession as u
};
