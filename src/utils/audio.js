// Web Audio API Synthesizer for gentle audio cues

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playTapSound() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime); // A4 note
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {
    console.warn("Audio Context playback failed", e);
  }
}

export function playMatchSound() {
  try {
    const ctx = getAudioContext();
    const playTone = (freq, start, duration) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
      
      gain.gain.setValueAtTime(0, ctx.currentTime + start);
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
      
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + duration);
    };
    
    // Play C5 then E5 (pleasant rising major third)
    playTone(523.25, 0, 0.15); // C5
    playTone(659.25, 0.08, 0.25); // E5
  } catch (e) {
    console.warn("Audio Context playback failed", e);
  }
}

export function playWinSound() {
  try {
    const ctx = getAudioContext();
    const playTone = (freq, start, duration) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.05, ctx.currentTime + start + duration);
      
      gain.gain.setValueAtTime(0, ctx.currentTime + start);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + start + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
      
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + duration);
    };
    
    // Play major arpeggio
    playTone(261.63, 0, 0.2);     // C4
    playTone(329.63, 0.1, 0.2);   // E4
    playTone(392.00, 0.2, 0.2);   // G4
    playTone(523.25, 0.3, 0.45);  // C5
  } catch (e) {
    console.warn("Audio Context playback failed", e);
  }
}

// Bird chirp synthesizer: rapid high-pitched sweeps
export function playBirdSound() {
  try {
    const ctx = getAudioContext();
    const playChirp = (delay) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(1800, ctx.currentTime + delay);
      osc.frequency.exponentialRampToValueAtTime(3200, ctx.currentTime + delay + 0.12);
      
      gain.gain.setValueAtTime(0, ctx.currentTime + delay);
      gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.12);
      
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.12);
    };
    
    // Play 3 chirps in rapid succession
    playChirp(0);
    playChirp(0.18);
    playChirp(0.36);
  } catch (e) {
    console.warn("Bird sound playback failed", e);
  }
}

// Rain synthesizer: white noise filtered with a low-pass/band-pass filter
export function playRainSound() {
  try {
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * 2.5; // 2.5 seconds duration
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    // Generate white noise
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noiseNode = ctx.createBufferSource();
    noiseNode.buffer = buffer;
    
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1000, ctx.currentTime); // filter out high hiss
    
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.3); // fade in
    gain.gain.setValueAtTime(0.18, ctx.currentTime + 2.0);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5); // fade out
    
    noiseNode.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    noiseNode.start();
    noiseNode.stop(ctx.currentTime + 2.5);
  } catch (e) {
    console.warn("Rain sound playback failed", e);
  }
}

// Temple bell synthesizer: deep resonant bell with metallic partials and long decay
export function playTempleBellSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Harmonic and inharmonic frequencies that make up a bell chime
    const partials = [
      { freq: 220, amp: 0.15, decay: 2.5 }, // Fundamental (A3)
      { freq: 330, amp: 0.10, decay: 2.0 }, 
      { freq: 440, amp: 0.08, decay: 1.6 },
      { freq: 650, amp: 0.06, decay: 1.2 },
      { freq: 880, amp: 0.04, decay: 0.8 },
      { freq: 1100, amp: 0.02, decay: 0.5 }
    ];
    
    partials.forEach((p) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(p.freq, now);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(p.amp, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + p.decay);
      
      osc.start(now);
      osc.stop(now + p.decay);
    });
  } catch (e) {
    console.warn("Temple bell sound playback failed", e);
  }
}

// Vehicle horn synthesizer: detuned triangle waves playing twice
export function playVehicleSound() {
  try {
    const ctx = getAudioContext();
    const playHonk = (delay) => {
      const now = ctx.currentTime + delay;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      
      osc1.type = "triangle";
      osc1.frequency.setValueAtTime(390, now);
      
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(430, now); // slightly detuned
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.02);
      gain.gain.setValueAtTime(0.12, now + 0.22);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      
      osc1.start(now);
      osc2.start(now);
      
      osc1.stop(now + 0.25);
      osc2.stop(now + 0.25);
    };
    
    // Play "honk honk"
    playHonk(0);
    playHonk(0.28);
  } catch (e) {
    console.warn("Vehicle sound playback failed", e);
  }
}

// Gentle reminder alarm chime: ascending chords with a soft ring
export function playReminderAlertSound() {
  try {
    const ctx = getAudioContext();
    const playTone = (freq, start, duration, type = "sine", gainVal = 0.15) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
      
      gain.gain.setValueAtTime(0, ctx.currentTime + start);
      gain.gain.linearRampToValueAtTime(gainVal, ctx.currentTime + start + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
      
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + duration);
    };

    // Play a dual-tone ascending melody (chime)
    playTone(523.25, 0, 0.25, "sine", 0.12);     // C5
    playTone(659.25, 0.12, 0.25, "sine", 0.12);  // E5
    playTone(783.99, 0.24, 0.25, "sine", 0.12);  // G5
    playTone(1046.50, 0.36, 0.8, "triangle", 0.15); // C6 (long decay, softer triangle wave)
  } catch (e) {
    console.warn("Reminder sound playback failed", e);
  }
}
