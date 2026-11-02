export const globeIntroDuration = 1000;
export const globeSessionKey = "shield-news-soft-globe-seen-v1";

// SphereGeometry's UVs and an XYZ rotation put 36°N, 138°E at the centre.
export const japanPose = { phi: Math.PI * 1.5 - 138 * Math.PI / 180, theta: 36 * Math.PI / 180, scale: 3.2 };
export type GlobePose = typeof japanPose;

export function globePose(elapsed: number) {
  const progress = Math.min(1, Math.max(0, elapsed / globeIntroDuration));
  const eased = progress * progress * (3 - 2 * progress);
  return {
    phi: japanPose.phi - 2 * (1 - eased),
    theta: japanPose.theta - 0.35 * (1 - eased),
    scale: 1.08 + (japanPose.scale - 1.08) * eased,
  };
}
