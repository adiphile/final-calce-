import { ReactNode } from "react";

interface CalcButtonProps {
  children: ReactNode;
  variant?: "default" | "primary" | "func";
  active?: boolean;
  className?: string;
  onClick: () => void;
}

const CalcButton = ({ children, variant = "default", active = false, className = "", onClick }: CalcButtonProps) => {
  const base = "h-[80px] w-full rounded-full text-[24px] font-bold flex items-center justify-center select-none cursor-pointer transition transform duration-150 active:scale-90 active:shadow-inner";

  // dark/amoled theme: numbers dark grey background with neon cyan text,
  // operators neon magenta, functions subdued grey
  const variantClass = {
    default: "bg-[#111111] text-[#0ff]",
    primary: `bg-[#1a1a1a] text-[#ff0099] ${active ? "bg-[#333333]" : ""}`,
    func: "bg-[#222222] text-[#888888]",
  };

  return (
    <button className={`${base} ${variantClass[variant]} ${className}`} onClick={onClick}>
      <span>{children}</span>
    </button>
  );
};

export default CalcButton;
