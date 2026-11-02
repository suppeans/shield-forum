"use client";

import { useEffect, useRef } from "react";
import createGlobe from "cobe";
import { globeIntroDuration, globePose, globeSessionKey, japanPose } from "@/lib/globe-animation";

export function JapanGlobe() {
  const rootRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const host = hostRef.current;
    if (!root || !host || typeof WebGLRenderingContext === "undefined") return;

    const canvas = document.createElement("canvas");
    const context = { alpha: true, stencil: false, antialias: true, depth: false };
    let globe: ReturnType<typeof createGlobe>;
    try {
      if (!canvas.getContext("webgl2", context) && !canvas.getContext("webgl", context)) return;
      host.append(canvas);
      globe = createGlobe(canvas, {
        width: host.clientWidth, height: host.clientWidth,
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 1.5),
        ...japanPose, dark: 0, diffuse: 1.2, mapSamples: 40000,
        mapBrightness: 1.25, baseColor: [0.75, 1, 0.94],
        glowColor: [0.88, 1, 0.96], markerColor: [0, 0.83, 0.64],
        markers: [], scale: 1.08, context,
      });
    } catch {
      host.replaceChildren();
      return;
    }

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let seen = false;
    try { seen = sessionStorage.getItem(globeSessionKey) === "1"; } catch { /* Storage can be disabled. */ }
    let animate = !motion.matches && !seen;
    root.dataset.state = animate ? "turning" : "settled";

    let frame = 0;
    let elapsed = 0;
    let previous = performance.now();
    let visible = true;
    let finished = false;
    const draw = (now: number) => {
      elapsed += Math.min(now - previous, 64);
      previous = now;
      globe.update(animate ? globePose(elapsed) : japanPose);
      // Give the embedded map texture time to load, including for a static visit.
      if (elapsed > 150) root.dataset.ready = "true";
      if (elapsed < (animate ? globeIntroDuration : 250)) {
        frame = requestAnimationFrame(draw);
      } else {
        finished = true;
        root.dataset.state = "settled";
        try { sessionStorage.setItem(globeSessionKey, "1"); } catch { /* Storage can be disabled. */ }
      }
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      root.dataset.paused = String(document.hidden || !visible);
      if (!finished && !document.hidden && visible) {
        previous = performance.now();
        frame = requestAnimationFrame(draw);
      }
    };
    const reduceMotion = () => {
      if (motion.matches) {
        animate = false;
        globe.update(japanPose);
        root.dataset.state = "settled";
        sync();
      }
    };
    const resize = new ResizeObserver(() => {
      globe.update({ width: host.clientWidth, height: host.clientWidth });
    });
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    const lostContext = () => { cancelAnimationFrame(frame); finished = true; delete root.dataset.ready; root.dataset.state = "fallback"; };
    resize.observe(host);
    intersection.observe(root);
    canvas.addEventListener("webglcontextlost", lostContext);
    motion.addEventListener("change", reduceMotion);
    document.addEventListener("visibilitychange", sync);
    sync();

    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      intersection.disconnect();
      motion.removeEventListener("change", reduceMotion);
      document.removeEventListener("visibilitychange", sync);
      canvas.removeEventListener("webglcontextlost", lostContext);
      globe.destroy();
      host.replaceChildren();
      delete root.dataset.ready;
      root.dataset.state = "fallback";
    };
  }, []);

  return <div className="japan-globe" ref={rootRef} aria-hidden="true" data-state="fallback">
    {/* A static Japan-facing globe also covers no-JavaScript and unavailable WebGL. */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img className="globe-fallback" src="/illustrations/globe-japan.svg" alt="" width="400" height="400" />
    <div className="globe-canvas" ref={hostRef} />
    <div className="globe-atmosphere" />
    <div className="globe-clouds"><span /><span /></div>
  </div>;
}
