import { Outlet } from "react-router";
import { PhoneFrame } from "../components/PhoneFrame";

export default function PortraitLayout() {
  return (
    <PhoneFrame landscape={false}>
      <Outlet />
    </PhoneFrame>
  );
}
