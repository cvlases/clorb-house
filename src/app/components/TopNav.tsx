import { useNavigate } from "react-router";

interface Props {
  active: "clorbhouse" | "collections";
}

/**
 * Shared top navigation bar. Identical visual treatment on every screen.
 * Only the active pill's background differs.
 */
export function TopNav({ active }: Props) {
  const navigate = useNavigate();

  const pill = (
    label: string,
    route: string,
    isActive: boolean
  ) => (
    <button
      onClick={() => navigate(route)}
      style={{
        fontFamily: "'Work Sans', sans-serif",
        fontWeight: 500,
        fontSize: 12,
        lineHeight: "16px",
        color: isActive ? "black" : "white",
        backgroundColor: isActive ? "#42aaff" : "transparent",
        border: "none",
        borderRadius: 16,
        padding: "8px 14px",
        cursor: "pointer",
        whiteSpace: "nowrap",
        outline: "none",
      }}
    >
      {label}
    </button>
  );

  return (
    <div
      style={{
        position: "absolute",
        top: 16,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "center",
        gap: 2,
        backgroundColor: "black",
        borderRadius: 22,
        padding: "4px",
        zIndex: 20,
      }}
    >
      {pill("Clorbhouse",        "/todo",  active === "clorbhouse")}
      {pill("Clorb's Collections", "/shelf", active === "collections")}
    </div>
  );
}
