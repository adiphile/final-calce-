import { ReactNode } from "react";

interface CalcButtonProps {
  children: ReactNode;
  variant?: "default" | "primary" | "func";
  active?: boolean;
  className?: string;
  onClick: () => void;
}

const CalcButton = ({ children, variant = "default", active = false, className = "", onClick }: CalcButtonProps) => {
  const base = "h-[68px] w-full rounded-full text-[22px] font-medium flex items-center justify-center select-none cursor-pointer transition transform duration-150 active:scale-90 active:shadow-inner";

  // iOS-style color palette: dark gray numbers, orange operators, light gray functions
  const variantClass = {
    default: "bg-[#333333] text-white",
    primary: `bg-orange-500 text-white ${active ? "bg-orange-600" : ""}`,
    func: "bg-[#a5a5a5] text-black",
  };

  return (
    <button className={`${base} ${variantClass[variant]} ${className}`} onClick={onClick}>
      <span>{children}</span>
    </button>
  );
};

export default CalcButton;
