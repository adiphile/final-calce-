import { ReactNode } from "react";

interface CalcButtonProps {
  children: ReactNode;
  variant?: "default" | "primary" | "func";
  active?: boolean;
  className?: string;
  onClick: () => void;
}

const CalcButton = ({ children, variant = "default", active = false, className = "", onClick }: CalcButtonProps) => {
  const base = "h-[70px] w-full rounded-2xl text-[26px] font-semibold flex items-center justify-center select-none cursor-pointer transition transform duration-100 active:scale-95";

  // Pure AMOLED and iOS style: blacks, whites, grays, minimal accent
  const variantClass = {
    default: "bg-[#1a1a1a] text-white",
    primary: `bg-[#262626] text-[#ffffff] ${active ? "bg-[#333333]" : ""}`,
    func: "bg-[#333333] text-gray-300",
  };

  return (
    <button className={`${base} ${variantClass[variant]} ${className}`} onClick={onClick}>
      <span>{children}</span>
    </button>
  );
};

export default CalcButton;
