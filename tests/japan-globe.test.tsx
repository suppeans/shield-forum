import { act, cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import createGlobe from "cobe";
import { JapanGlobe } from "@/components/japan-globe";
import { globeIntroDuration, globePose, globeSessionKey, japanPose } from "@/lib/globe-animation";

vi.mock("cobe", () => ({ default: vi.fn() }));
const update = vi.fn();
const destroy = vi.fn();
let reduce = false;
let now = 0;
let nextFrame: FrameRequestCallback | undefined;

beforeEach(() => {
  vi.clearAllMocks();
  sessionStorage.clear();
  reduce = false;
  now = 0;
  nextFrame = undefined;
  vi.spyOn(performance, "now").mockImplementation(() => now);
  vi.stubGlobal("WebGLRenderingContext", class {});
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({} as WebGLRenderingContext);
  vi.mocked(createGlobe).mockReturnValue({ update, destroy });
  vi.stubGlobal("matchMedia", () => ({ matches: reduce, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
  vi.stubGlobal("ResizeObserver", class { observe() {} disconnect() {} });
  vi.stubGlobal("IntersectionObserver", class { observe() {} disconnect() {} });
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => { nextFrame = callback; return 1; });
  vi.stubGlobal("cancelAnimationFrame", () => { nextFrame = undefined; });
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

function advance(milliseconds: number) {
  act(() => {
    for (let elapsed = 0; elapsed < milliseconds && nextFrame; elapsed += 16) {
      now += 16;
      const callback = nextFrame;
      nextFrame = undefined;
      callback(now);
    }
  });
}

it("centres Japan geographically, eases toward it and clamps at three seconds", () => {
  const longitude = 138 * Math.PI / 180;
  const latitude = 36 * Math.PI / 180;
  const x = Math.cos(latitude) * Math.cos(longitude);
  const y = Math.sin(latitude);
  const z = -Math.cos(latitude) * Math.sin(longitude);
  const { phi, theta } = japanPose;
  expect(Math.cos(phi) * x + Math.sin(phi) * z).toBeCloseTo(0);
  expect(Math.sin(phi) * Math.sin(theta) * x + Math.cos(theta) * y - Math.cos(phi) * Math.sin(theta) * z).toBeCloseTo(0);
  expect(-Math.sin(phi) * Math.cos(theta) * x + Math.sin(theta) * y + Math.cos(phi) * Math.cos(theta) * z).toBeCloseTo(1);
  expect(globePose(1500).phi).toBeGreaterThan(globePose(0).phi);
  expect(globePose(-1)).toEqual(globePose(0));
  expect(globePose(globeIntroDuration)).toEqual(japanPose);
  expect(globePose(9000)).toEqual(japanPose);
});

it("turns once per session, stops rendering after settling, and releases its renderer", () => {
  const first = render(<JapanGlobe />);
  expect(first.container.firstChild).toHaveAttribute("data-state", "turning");
  advance(3100);
  expect(first.container.firstChild).toHaveAttribute("data-state", "settled");
  expect(update).toHaveBeenLastCalledWith(japanPose);
  expect(nextFrame).toBeUndefined();
  expect(sessionStorage.getItem(globeSessionKey)).toBe("1");
  first.unmount();
  expect(destroy).toHaveBeenCalledOnce();
  const second = render(<JapanGlobe />);
  expect(second.container.firstChild).toHaveAttribute("data-state", "settled");
  advance(300);
  expect(update).toHaveBeenLastCalledWith(japanPose);
  expect(nextFrame).toBeUndefined();
});

it("shows Japan immediately with reduced motion, and falls back without WebGL", () => {
  reduce = true;
  const reduced = render(<JapanGlobe />);
  advance(300);
  expect(reduced.container.firstChild).toHaveAttribute("aria-hidden", "true");
  expect(reduced.container.firstChild).toHaveAttribute("data-state", "settled");
  expect(update.mock.calls.every(([pose]) => pose.phi === japanPose.phi)).toBe(true);
  reduced.unmount();
  vi.mocked(createGlobe).mockClear();
  vi.stubGlobal("WebGLRenderingContext", undefined);
  const fallback = render(<JapanGlobe />);
  expect(fallback.container.firstChild).toHaveAttribute("data-state", "fallback");
  expect(fallback.container.querySelector("img")).toHaveAttribute("src", "/illustrations/globe-japan.svg");
  expect(createGlobe).not.toHaveBeenCalled();
});

it("pauses in a hidden tab and keeps a static fallback if the graphics context is lost", () => {
  const view = render(<JapanGlobe />);
  advance(500);
  const calls = update.mock.calls.length;
  vi.spyOn(document, "hidden", "get").mockReturnValue(true);
  act(() => { document.dispatchEvent(new Event("visibilitychange")); });
  expect(nextFrame).toBeUndefined();
  advance(4000);
  expect(update).toHaveBeenCalledTimes(calls);
  vi.spyOn(document, "hidden", "get").mockReturnValue(false);
  act(() => { document.dispatchEvent(new Event("visibilitychange")); });
  advance(3000);
  expect(view.container.firstChild).toHaveAttribute("data-state", "settled");
  act(() => { view.container.querySelector("canvas")!.dispatchEvent(new Event("webglcontextlost")); });
  expect(view.container.firstChild).toHaveAttribute("data-state", "fallback");
  expect(view.container.firstChild).not.toHaveAttribute("data-ready");
});
