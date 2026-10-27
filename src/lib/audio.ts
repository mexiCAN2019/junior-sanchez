/**
 * Tiny Web Audio synth for the round timer: a boxing bell and a wooden clapper.
 * Nothing is loaded from the network.
 */

let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

/** Ring the bell `times` times. Inharmonic partials make it sound like metal. */
export function ringBell(times = 1) {
  const ac = audio();
  if (!ac) return;
  const partials = [1, 2.76, 5.4, 8.93];
  for (let i = 0; i < times; i++) {
    const t = ac.currentTime + i * 0.32;
    partials.forEach((ratio, j) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = "sine";
      osc.frequency.value = 540 * ratio;
      const peak = 0.22 / (j + 1);
      const decay = 1.8 / (1 + j * 0.7);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(peak, t + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + decay);
      osc.connect(gain).connect(ac.destination);
      osc.start(t);
      osc.stop(t + decay + 0.05);
    });
  }
}

/** Two quick clacks — the ten-second warning. */
export function clack() {
  const ac = audio();
  if (!ac) return;
  const length = Math.floor(ac.sampleRate * 0.04);
  const buffer = ac.createBuffer(1, length, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 3;

  [0, 0.14].forEach((offset) => {
    const src = ac.createBufferSource();
    const filter = ac.createBiquadFilter();
    const gain = ac.createGain();
    src.buffer = buffer;
    filter.type = "bandpass";
    filter.frequency.value = 2200;
    gain.gain.value = 0.9;
    src.connect(filter).connect(gain).connect(ac.destination);
    src.start(ac.currentTime + offset);
  });
}
