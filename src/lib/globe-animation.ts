export const globeIntroDuration = 1500;
export const globeSessionKey = "shield-news-globe-seen-v2";

// COBE's camera angles put 36°N, 138°E (Japan) at the centre of the globe.
export const japanPose = { phi: Math.PI * 1.5 - 138 * Math.PI / 180, theta: 36 * Math.PI / 180, scale: 2.4, mapSamples: 72000 };

export function globePose(elapsed: number) {
  const progress = Math.min(1, Math.max(0, elapsed / globeIntroDuration));
  const eased = progress * progress * (3 - 2 * progress);
  return {
    phi: japanPose.phi - 2 * (1 - eased),
    theta: japanPose.theta - 0.35 * (1 - eased),
    scale: 1.08 + (japanPose.scale - 1.08) * eased,
    // Keep the wide view within COBE's sampling range; add detail as it closes in.
    mapSamples: Math.round(32000 + (japanPose.mapSamples - 32000) * eased),
  };
}
