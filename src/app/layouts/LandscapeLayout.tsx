import { Outlet } from "react-router";
import { PhoneFrame } from "../components/PhoneFrame";

export default function LandscapeLayout() {
  return (
    <PhoneFrame landscape={true}>
      <Outlet />
    </PhoneFrame>
  );
}
