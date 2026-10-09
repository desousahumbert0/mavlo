/** Helpers for turning decoded browser audio into 16-bit samples for the MP3 encoder. */
export function floatToInt16(input: Float32Array): Int16Array {
  const out = new Int16Array(input.length);
  for (let i = 0; i < input.length; i++) {
    const s = Math.max(-1, Math.min(1, input[i]));
    out[i] = s < 0 ? Math.round(s * 32768) : Math.round(s * 32767);
  }
  return out;
}

/** MP3 holds mono or stereo here: one channel stays mono, anything else uses the first two. */
export const mp3Channels = (decodedChannels: number): 1 | 2 => (decodedChannels <= 1 ? 1 : 2);

/** Approximate size of an MP3 at a constant bitrate. */
export const estimateMp3Bytes = (seconds: number, kbps: number): number => Math.round((seconds * kbps * 1000) / 8);
