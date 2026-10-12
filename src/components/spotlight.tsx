import { useId } from "react";

// Aceternity UI Spotlight, adapted to the existing CSS stack.
export function Spotlight() {
  const id = useId();
  return <svg className="spotlight" aria-hidden="true" focusable="false" viewBox="0 0 3787 2842" fill="none">
    <g filter={`url(#${id})`}><ellipse cx="1924.71" cy="273.501" rx="1924.71" ry="273.501" transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)" fill="#00d4a4" fillOpacity="0.21" /></g>
    <defs><filter id={id} x="0.860352" y="0.838989" width="3785.16" height="2840.26" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
      <feGaussianBlur stdDeviation="151" />
    </filter></defs>
  </svg>;
}
