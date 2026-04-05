import { ReactNode } from "react";

interface MobileContainerProps {
  children: ReactNode;
}

export function MobileContainer({ children }: MobileContainerProps) {
  return (
    <div className="relative w-full h-full bg-white overflow-hidden">
      {children}
    </div>
  );
}
