import { ReactNode } from "react";

interface CalcButtonProps {
  children: ReactNode;
  variant?: "default" | "primary" | "func";
  active?: boolean;
  className?: string;
  onClick: () => void;
}

const CalcButton = ({ children, variant = "default", active = false, className = "", onClick }: CalcButtonProps) => {
  const base = "h-[68px] rounded-full text-[22px] font-medium flex items-center justify-center select-none cursor-pointer";

  const variantClass = {
    default: "btn-glass text-secondary-foreground",
    primary: `btn-primary-glass text-primary-foreground ${active ? "is-active" : ""}`,
    func: "btn-func-glass text-accent",
  };

  return (
    <button className={`${base} ${variantClass[variant]} ${className}`} onClick={onClick}>
      <span>{children}</span>
    </button>
  );
};

export default CalcButton;
