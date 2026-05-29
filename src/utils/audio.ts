let isMuted = true;
let audioCtx: AudioContext | null = null;

export function setMuted(muted: boolean) {
  isMuted = muted;
  if (!muted) {
    initAudioContext();
  }
}

export function getMuted(): boolean {
  return isMuted;
}

function initAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    // Create AudioContext lazily on user interaction
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

// 1. Sleek tactile button click
export function playClick() {
  if (isMuted) return;
  try {
    const ctx = initAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Modern high-tech mechanical tick/click parameters
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.04);

    gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch (e) {
    // Suppress audio issues
  }
}

// 2. Subtle hover soft blip
export function playHover() {
  if (isMuted) return;
  try {
    const ctx = initAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.type = 'sine';
    // Gentle high-pitched tiny ping
    osc.frequency.setValueAtTime(2200, ctx.currentTime);

    gainNode.gain.setValueAtTime(0.02, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02);

    osc.start();
    osc.stop(ctx.currentTime + 0.03);
  } catch (e) {
    // Suppress audio issues
  }
}

// 3. Section Navigation Sweep
export function playSectionChange() {
  if (isMuted) return;
  try {
    const ctx = initAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.15);

    gainNode.gain.setValueAtTime(0.04, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    osc.start();
    osc.stop(ctx.currentTime + 0.16);
  } catch (e) {
    // Suppress audio issues
  }
}

// 4. Success / Notification Action Chime
export function playSuccess() {
  if (isMuted) return;
  try {
    const ctx = initAudioContext();
    if (!ctx) return;
    const baseFreq = 587.33; // D5
    const notes = [2, 7, 12]; // major notes distance from D5

    notes.forEach((offset, idx) => {
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.type = 'sine';
      // Calculate frequency relative to base freq
      const freq = baseFreq * Math.pow(2, offset / 12);
      
      const startTime = ctx.currentTime + idx * 0.06;
      osc.frequency.setValueAtTime(freq, startTime);
      
      gainNode.gain.setValueAtTime(0.0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.05, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.18);

      osc.start(startTime);
      osc.stop(startTime + 0.22);
    });
  } catch (e) {
    // Suppress audio issues
  }
}
