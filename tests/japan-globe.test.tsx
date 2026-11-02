import { act, cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { Euler, Vector3 } from "three";
import { createSoftGlobe } from "@/lib/soft-globe-renderer";
import { JapanGlobe } from "@/components/japan-globe";
import { globeIntroDuration, globePose, globeSessionKey, japanPose } from "@/lib/globe-animation";

vi.mock("@/lib/soft-globe-renderer", () => ({ createSoftGlobe: vi.fn() }));
const update = vi.fn();
const draw = vi.fn();
const resize = vi.fn();
const destroy = vi.fn();
let reduce = false;
let now = 0;
let nextFrame: FrameRequestCallback | undefined;

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
  vi.clearAllMocks();
  sessionStorage.clear();
  reduce = false;
  now = 0;
  nextFrame = undefined;
  vi.spyOn(performance, "now").mockImplementation(() => now);
  vi.stubGlobal("WebGL2RenderingContext", class {});
  vi.mocked(createSoftGlobe).mockReturnValue({ ready: Promise.resolve(), update, render: draw, resize, destroy });
  vi.stubGlobal("matchMedia", () => ({ matches: reduce, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
  vi.stubGlobal("ResizeObserver", class { observe() {} disconnect() {} });
  vi.stubGlobal("IntersectionObserver", class { observe() {} disconnect() {} });
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => { nextFrame = callback; return 1; });
  vi.stubGlobal("cancelAnimationFrame", () => { nextFrame = undefined; });
});
afterEach(() => { cleanup(); vi.useRealTimers(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

async function mount() {
  const view = render(<JapanGlobe />);
  await act(async () => { await import("@/lib/soft-globe-renderer"); });
  return view;
}
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

it("centres Japan with the renderer's actual rotation and completes the zoom in one second", () => {
  const longitude = 138 * Math.PI / 180;
  const latitude = 36 * Math.PI / 180;
  const position = new Vector3(Math.cos(latitude) * Math.cos(longitude), Math.sin(latitude), -Math.cos(latitude) * Math.sin(longitude));
  position.applyEuler(new Euler(japanPose.theta, japanPose.phi, 0, "XYZ"));
  expect(position.x).toBeCloseTo(0);
  expect(position.y).toBeCloseTo(0);
  expect(position.z).toBeCloseTo(1);
  expect(globeIntroDuration).toBe(1000);
  expect(globePose(500).phi).toBeGreaterThan(globePose(0).phi);
  expect(globePose(0).scale).toBe(1.08);
  expect(globePose(500).scale).toBeGreaterThan(globePose(0).scale);
  expect(globePose(500).scale).toBeLessThan(japanPose.scale);
  expect(globePose(-1)).toEqual(globePose(0));
  expect(globePose(1000)).toEqual(japanPose);
  expect(globePose(9000)).toEqual(japanPose);
});

it("turns once per session, then renders only clouds while the land stays fixed", async () => {
  const first = await mount();
  expect(first.container.firstChild).toHaveAttribute("data-state", "turning");
  advance(900);
  expect(first.container.firstChild).toHaveAttribute("data-state", "turning");
  advance(200);
  expect(first.container.firstChild).toHaveAttribute("data-state", "settled");
  expect(update).toHaveBeenLastCalledWith(japanPose);
  const updates = update.mock.calls.length;
  const draws = draw.mock.calls.length;
  act(() => { vi.advanceTimersByTime(80); });
  advance(16);
  expect(update).toHaveBeenCalledTimes(updates);
  expect(draw.mock.calls.length).toBeGreaterThan(draws);
  expect(sessionStorage.getItem(globeSessionKey)).toBe("1");
  first.unmount();
  expect(destroy).toHaveBeenCalledOnce();
  act(() => { vi.advanceTimersByTime(100); });
  expect(nextFrame).toBeUndefined();
  expect(nextFrame).toBeUndefined();
  const second = await mount();
  expect(second.container.firstChild).toHaveAttribute("data-state", "settled");
  expect(vi.mocked(createSoftGlobe).mock.calls.at(-1)![2]).toEqual(japanPose);
});

it("renders once with reduced motion and falls back without WebGL2", async () => {
  reduce = true;
  const reduced = await mount();
  advance(1000);
  expect(reduced.container.firstChild).toHaveAttribute("aria-hidden", "true");
  expect(reduced.container.firstChild).toHaveAttribute("data-state", "settled");
  expect(vi.mocked(createSoftGlobe).mock.calls.at(-1)![2]).toEqual(japanPose);
  expect(draw.mock.calls.every(([time]) => time === 0)).toBe(true);
  expect(nextFrame).toBeUndefined();
  act(() => { vi.advanceTimersByTime(100); });
  expect(nextFrame).toBeUndefined();
  reduced.unmount();
  vi.mocked(createSoftGlobe).mockClear();
  vi.stubGlobal("WebGL2RenderingContext", undefined);
  const fallback = await mount();
  expect(fallback.container.firstChild).toHaveAttribute("data-state", "fallback");
  expect(fallback.container.querySelector("img")).toHaveAttribute("src", "/illustrations/globe-japan-soft.png?v=2");
  expect(createSoftGlobe).not.toHaveBeenCalled();
});

it("finishes on time even when a graphics frame is delayed", async () => {
  const view = await mount();
  act(() => {
    now = globeIntroDuration + 1;
    const callback = nextFrame!;
    nextFrame = undefined;
    callback(now);
  });
  expect(view.container.firstChild).toHaveAttribute("data-state", "settled");
  expect(update).toHaveBeenLastCalledWith(japanPose);
});

it("pauses in a hidden tab and restores the fallback if the context is lost", async () => {
  const view = await mount();
  advance(500);
  const calls = draw.mock.calls.length;
  vi.spyOn(document, "hidden", "get").mockReturnValue(true);
  act(() => { document.dispatchEvent(new Event("visibilitychange")); });
  expect(nextFrame).toBeUndefined();
  act(() => { vi.advanceTimersByTime(100); });
  expect(nextFrame).toBeUndefined();
  advance(4000);
  expect(draw).toHaveBeenCalledTimes(calls);
  vi.spyOn(document, "hidden", "get").mockReturnValue(false);
  act(() => { document.dispatchEvent(new Event("visibilitychange")); });
  advance(1000);
  expect(view.container.firstChild).toHaveAttribute("data-state", "settled");
  act(() => { view.container.querySelector("canvas")!.dispatchEvent(new Event("webglcontextlost")); });
  expect(view.container.firstChild).toHaveAttribute("data-state", "fallback");
  expect(view.container.firstChild).not.toHaveAttribute("data-ready");
  act(() => { vi.advanceTimersByTime(100); });
  expect(nextFrame).toBeUndefined();
});

it("releases resources if unmounted before the textures finish loading", async () => {
  let finishLoading!: () => void;
  const ready = new Promise<void>(resolve => { finishLoading = resolve; });
  vi.mocked(createSoftGlobe).mockReturnValue({ ready, update, render: draw, resize, destroy });
  const view = await mount();
  view.unmount();
  await act(async () => { finishLoading(); });
  expect(destroy).toHaveBeenCalledOnce();
  expect(draw).not.toHaveBeenCalled();
  act(() => { vi.advanceTimersByTime(100); });
  expect(nextFrame).toBeUndefined();
});

it("keeps the fallback if a texture cannot load", async () => {
  vi.mocked(createSoftGlobe).mockReturnValue({ ready: Promise.reject(new Error("texture failed")), update, render: draw, resize, destroy });
  const view = await mount();
  expect(view.container.firstChild).toHaveAttribute("data-state", "fallback");
  expect(view.container.firstChild).not.toHaveAttribute("data-ready");
  expect(draw).not.toHaveBeenCalled();
  expect(destroy).toHaveBeenCalledOnce();
});
