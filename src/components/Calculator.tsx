import { useState } from "react";
import CalcButton from "./CalcButton";
import HistoryPanel from "./HistoryPanel";

interface HistoryEntry {
  expression: string;
  result: string;
}

const Calculator = () => {
  const [display, setDisplay] = useState("0");
  const [prev, setPrev] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [resetNext, setResetNext] = useState(false);
  const [activeOp, setActiveOp] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleNumber = (n: string) => {
    if (resetNext) { setDisplay(n); setResetNext(false); }
    else { setDisplay(display === "0" ? n : display + n); }
    setActiveOp(null);
  };

  const handleDecimal = () => {
    if (resetNext) { setDisplay("0."); setResetNext(false); return; }
    if (!display.includes(".")) setDisplay(display + ".");
  };

  const handleOperator = (nextOp: string) => {
    const current = parseFloat(display);
    if (prev !== null && op && !resetNext) {
      const result = calculate(prev, current, op);
      setDisplay(formatResult(result));
      setPrev(result);
    } else { setPrev(current); }
    setOp(nextOp); setResetNext(true); setActiveOp(nextOp);
  };

  const handleEquals = () => {
    if (prev === null || !op) return;
    const current = parseFloat(display);
    const result = calculate(prev, current, op);
    const resultStr = formatResult(result);
    setHistory((h) => [{ expression: `${formatResult(prev)} ${op} ${formatResult(current)}`, result: resultStr }, ...h].slice(0, 50));
    setDisplay(resultStr); setPrev(null); setOp(null); setResetNext(true); setActiveOp(null);
  };

  const handleClear = () => { setDisplay("0"); setPrev(null); setOp(null); setResetNext(false); setActiveOp(null); };
  const handleToggleSign = () => { setDisplay(formatResult(parseFloat(display) * -1)); };
  const handlePercent = () => { setDisplay(formatResult(parseFloat(display) / 100)); };

  const calculate = (a: number, b: number, operator: string): number => {
    switch (operator) {
      case "+": return a + b; case "−": return a - b;
      case "×": return a * b; case "÷": return b !== 0 ? a / b : 0;
      default: return b;
    }
  };

  const formatResult = (n: number): string => {
    if (Number.isInteger(n) && Math.abs(n) < 1e15) return n.toString();
    const s = parseFloat(n.toPrecision(10)).toString();
    return s.length > 12 ? n.toExponential(5) : s;
  };

  const handleHistorySelect = (entry: HistoryEntry) => {
    setDisplay(entry.result); setPrev(null); setOp(null); setResetNext(true); setActiveOp(null); setShowHistory(false);
  };

  const fontSize = display.length > 8 ? (display.length > 11 ? "text-4xl" : "text-5xl") : "text-6xl";

  return (
    <div className="flex items-center justify-center min-h-screen bg-background mesh-bg relative overflow-hidden">
      {/* Decorative orbs */}
      <div className="absolute top-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[350px] h-[350px] rounded-full bg-accent/5 blur-3xl" />

      <div className="w-full max-w-[380px] p-5 relative z-10">
        {/* Glass card */}
        <div className="glass-surface rounded-3xl p-5 shadow-2xl">
          {/* Display */}
          <div className="h-28 flex flex-col items-end justify-end px-2 mb-2 overflow-hidden">
            {prev !== null && op && (
              <span className="text-sm text-muted-foreground mb-1 tracking-wide">
                {formatResult(prev)} {op}
              </span>
            )}
            <span
              className={`${fontSize} font-extralight text-foreground tracking-tight transition-all duration-150`}
              style={{ textShadow: "0 0 30px hsl(16 80% 60% / 0.15)" }}
            >
              {display}
            </span>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-4" />

          {/* Buttons */}
          <div className="grid grid-cols-4 gap-[10px]">
            <CalcButton variant="func" onClick={handleClear}>
              {prev !== null || display !== "0" ? "C" : "AC"}
            </CalcButton>
            <CalcButton variant="func" onClick={handleToggleSign}>±</CalcButton>
            <CalcButton variant="func" onClick={handlePercent}>%</CalcButton>
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
              <span className="pl-4">0</span>
            </CalcButton>
            <CalcButton onClick={handleDecimal}>.</CalcButton>
            <CalcButton variant="primary" onClick={handleEquals}>=</CalcButton>
          </div>
        </div>

        {/* History toggle */}
        <button
          onClick={() => setShowHistory(true)}
          className="w-full mt-4 py-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 8v4l3 3" /><circle cx="12" cy="12" r="10" />
          </svg>
          History
        </button>
      </div>

      <HistoryPanel
        history={history}
        open={showHistory}
        onClose={() => setShowHistory(false)}
        onSelect={handleHistorySelect}
        onClear={() => setHistory([])}
      />
    </div>
  );
};

export default Calculator;
