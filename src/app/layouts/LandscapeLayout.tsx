import { Outlet } from "react-router";
import { PhoneFrame } from "../components/PhoneFrame";

export default function LandscapeLayout() {
  // On a real phone in landscape the viewport height is ≤ ~500px.
  // Skip the fixed PhoneFrame and go full-viewport so the background fills edge-to-edge.
  const isMobileLandscape =
    typeof window !== "undefined" && window.innerHeight <= 500;

  if (isMobileLandscape) {
    return (
      <div style={{ width: "100vw", height: "100dvh", position: "relative", overflow: "hidden" }}>
        <Outlet />
      </div>
    );
  }

  return (
    <PhoneFrame landscape={true}>
      <Outlet />
    </PhoneFrame>
  );
}
