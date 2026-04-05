import { ReactNode } from "react";

interface Props {
  landscape?: boolean;
  children: ReactNode;
}

/**
 * On desktop: renders a fixed-size phone frame centered on the purple backdrop.
 * On mobile (viewport width < 768px): fills the full viewport — no frame chrome.
 */
export function PhoneFrame({ landscape = false, children }: Props) {
  const isMobile =
    typeof window !== "undefined" && window.innerWidth < 768;

  if (isMobile) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100dvh",
          position: "relative",
          overflow: "hidden",
          backgroundColor: "white",
        }}
      >
        {children}
      </div>
    );
  }

  const W = landscape ? 844 : 390;
  const H = landscape ? 390 : 844;

  return (
    <div
      style={{
        width: W,
        height: H,
        flexShrink: 0,
        position: "relative",
        overflow: "hidden",
        borderRadius: landscape ? 20 : 44,
        boxShadow: "0 28px 72px rgba(0,0,0,0.45)",
        backgroundColor: "white",
      }}
    >
      {children}
    </div>
  );
}
