import { ReactNode } from "react";

interface Props {
  landscape?: boolean;
  children: ReactNode;
}

/**
 * The phone frame wrapper. Portrait = 390×844, Landscape = 844×390.
 * Always centered on the page. Escapes the purple backdrop.
 */
export function PhoneFrame({ landscape = false, children }: Props) {
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
