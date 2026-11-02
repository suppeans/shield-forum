"use client";

import { useEffect, useRef } from "react";
import { globeIntroDuration, globePose, globeSessionKey, japanPose } from "@/lib/globe-animation";
import type { SoftGlobe } from "@/lib/soft-globe-renderer";

export function JapanGlobe() {
  const rootRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const host = hostRef.current;
    if (!root || !host || typeof WebGL2RenderingContext === "undefined") return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let seen = false;
    try { seen = sessionStorage.getItem(globeSessionKey) === "1"; } catch { /* Storage can be disabled. */ }
    let finished = motion.matches || seen;
    let ready = false;
    let cancelled = false;
    let visible = true;
    let frame = 0;
    let timer = 0;
    let elapsed = 0;
    let cloudTime = 0;
    let previous = 0;
    let globe: SoftGlobe | undefined;
    const canvas = document.createElement("canvas");
    host.append(canvas);
    const stop = () => { cancelAnimationFrame(frame); window.clearTimeout(timer); };
    const fallback = () => {
      ready = false;
      stop();
      delete root.dataset.ready;
      root.dataset.state = "fallback";
      globe?.destroy();
    };
    const settle = () => {
      finished = true;
      root.dataset.state = "settled";
      try { sessionStorage.setItem(globeSessionKey, "1"); } catch { /* Storage can be disabled. */ }
    };
    const draw = (now: number) => {
      if (!globe || !ready) return;
      const delta = now - previous;
      previous = now;
      cloudTime += delta;
      if (!finished) {
        elapsed += delta;
        globe.update(globePose(elapsed));
        if (elapsed >= globeIntroDuration) settle();
      }
      globe.render(motion.matches ? 0 : cloudTime);
      if (!finished) frame = requestAnimationFrame(draw);
      else if (!motion.matches) timer = window.setTimeout(() => { frame = requestAnimationFrame(draw); }, 80);
    };
    const sync = () => {
      stop();
      const paused = document.hidden || !visible;
      root.dataset.paused = String(paused);
      if (ready && !paused) {
        previous = performance.now();
        frame = requestAnimationFrame(draw);
      }
    };
    const reduceMotion = () => {
      if (motion.matches) { settle(); globe?.update(japanPose); }
      sync();
    };
    const resize = new ResizeObserver(() => {
      globe?.resize(host.clientWidth);
      if (ready) globe?.render(motion.matches ? 0 : cloudTime);
    });
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    resize.observe(host);
    intersection.observe(root);
    canvas.addEventListener("webglcontextlost", fallback);
    motion.addEventListener("change", reduceMotion);
    document.addEventListener("visibilitychange", sync);

    import("@/lib/soft-globe-renderer").then(({ createSoftGlobe }) => {
      if (cancelled) return;
      globe = createSoftGlobe(canvas, host.clientWidth, finished ? japanPose : globePose(0));
      return globe.ready.then(() => {
        if (cancelled) return;
        ready = true;
        globe!.render(0);
        root.dataset.ready = "true";
        root.dataset.state = finished ? "settled" : "turning";
        if (finished) settle();
        sync();
      });
    }).catch(() => { if (!cancelled) fallback(); });

    return () => {
      cancelled = true;
      ready = false;
      stop();
      resize.disconnect();
      intersection.disconnect();
      motion.removeEventListener("change", reduceMotion);
      document.removeEventListener("visibilitychange", sync);
      canvas.removeEventListener("webglcontextlost", fallback);
      globe?.destroy();
      host.replaceChildren();
      delete root.dataset.ready;
      root.dataset.state = "fallback";
    };
  }, []);

  return <div className="japan-globe" ref={rootRef} aria-hidden="true" data-state="fallback">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img className="globe-fallback" src="/illustrations/globe-japan-soft.png?v=3" alt="" width="720" height="720" />
    <div className="globe-canvas" ref={hostRef} />
    <div className="globe-atmosphere" />
  </div>;
}
