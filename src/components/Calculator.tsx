import { useState } from "react";
import CalcButton from "./CalcButton";

const Calculator = () => {
  const [display, setDisplay] = useState("0");
  const [prev, setPrev] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [resetNext, setResetNext] = useState(false);
  const [activeOp, setActiveOp] = useState<string | null>(null);

  const handleNumber = (n: string) => {
    if (resetNext) {
      setDisplay(n);
      setResetNext(false);
    } else {
      setDisplay(display === "0" ? n : display + n);
    }
    setActiveOp(null);
  };

  const handleDecimal = () => {
    if (resetNext) {
      setDisplay("0.");
      setResetNext(false);
      return;
    }
    if (!display.includes(".")) setDisplay(display + ".");
  };

  const handleOperator = (nextOp: string) => {
    const current = parseFloat(display);
    if (prev !== null && op && !resetNext) {
      const result = calculate(prev, current, op);
      setDisplay(formatResult(result));
      setPrev(result);
    } else {
      setPrev(current);
    }
    setOp(nextOp);
    setResetNext(true);
    setActiveOp(nextOp);
  };

  const handleEquals = () => {
    if (prev === null || !op) return;
    const current = parseFloat(display);
    const result = calculate(prev, current, op);
    setDisplay(formatResult(result));
    setPrev(null);
    setOp(null);
    setResetNext(true);
    setActiveOp(null);
  };

  const handleClear = () => {
    setDisplay("0");
    setPrev(null);
    setOp(null);
    setResetNext(false);
    setActiveOp(null);
  };

  const handleToggleSign = () => {
    setDisplay(formatResult(parseFloat(display) * -1));
  };

  const handlePercent = () => {
    setDisplay(formatResult(parseFloat(display) / 100));
  };

  const calculate = (a: number, b: number, operator: string): number => {
    switch (operator) {
      case "+": return a + b;
      case "−": return a - b;
      case "×": return a * b;
      case "÷": return b !== 0 ? a / b : 0;
      default: return b;
    }
  };

  const formatResult = (n: number): string => {
    if (Number.isInteger(n) && Math.abs(n) < 1e15) return n.toString();
    const s = parseFloat(n.toPrecision(10)).toString();
    return s.length > 12 ? n.toExponential(5) : s;
  };

  const fontSize = display.length > 8 ? (display.length > 11 ? "text-4xl" : "text-5xl") : "text-7xl";

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-[360px] p-4">
        {/* Display */}
        <div className="h-32 flex items-end justify-end px-2 mb-4 overflow-hidden">
          <span className={`${fontSize} font-extralight text-foreground tracking-tight transition-all duration-150`}>
            {display}
          </span>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-4 gap-3">
          <CalcButton variant="accent" onClick={handleClear}>
            {prev !== null || display !== "0" ? "C" : "AC"}
          </CalcButton>
          <CalcButton variant="accent" onClick={handleToggleSign}>+/−</CalcButton>
          <CalcButton variant="accent" onClick={handlePercent}>%</CalcButton>
          <CalcButton variant="primary" active={activeOp === "÷"} onClick={() => handleOperator("÷")}>÷</CalcButton>

          <CalcButton onClick={() => handleNumber("7")}>7</CalcButton>
          <CalcButton onClick={() => handleNumber("8")}>8</CalcButton>
          <CalcButton onClick={() => handleNumber("9")}>9</CalcButton>
          <CalcButton variant="primary" active={activeOp === "×"} onClick={() => handleOperator("×")}>×</CalcButton>

          <CalcButton onClick={() => handleNumber("4")}>4</CalcButton>
          <CalcButton onClick={() => handleNumber("5")}>5</CalcButton>
          <CalcButton onClick={() => handleNumber("6")}>6</CalcButton>
          <CalcButton variant="primary" active={activeOp === "−"} onClick={() => handleOperator("−")}>−</CalcButton>

          <CalcButton onClick={() => handleNumber("1")}>1</CalcButton>
          <CalcButton onClick={() => handleNumber("2")}>2</CalcButton>
          <CalcButton onClick={() => handleNumber("3")}>3</CalcButton>
          <CalcButton variant="primary" active={activeOp === "+"} onClick={() => handleOperator("+")}>+</CalcButton>

          <CalcButton className="col-span-2" onClick={() => handleNumber("0")}>
            <span className="pl-5">0</span>
          </CalcButton>
          <CalcButton onClick={handleDecimal}>.</CalcButton>
          <CalcButton variant="primary" onClick={handleEquals}>=</CalcButton>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
