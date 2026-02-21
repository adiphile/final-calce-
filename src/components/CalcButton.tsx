import { ReactNode } from "react";

interface CalcButtonProps {
  children: ReactNode;
  variant?: "default" | "primary" | "accent";
  active?: boolean;
  className?: string;
  onClick: () => void;
}

const CalcButton = ({ children, variant = "default", active = false, className = "", onClick }: CalcButtonProps) => {
  const base = "h-[72px] rounded-full text-2xl font-medium flex items-center justify-center select-none cursor-pointer transition-all duration-100 active:brightness-125 active:scale-95";

  const variants = {
    default: "bg-secondary text-secondary-foreground",
    primary: active
      ? "bg-foreground text-primary"
      : "bg-primary text-primary-foreground",
    accent: "bg-accent text-accent-foreground",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default CalcButton;
