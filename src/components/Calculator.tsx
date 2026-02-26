import { useState } from "react";
import CalcButton from "./CalcButton";
import HistoryPanel from "./HistoryPanel";

interface HistoryEntry {
  expression: string;
  result: string;
}

const Calculator = () => {
  const [display, setDisplay] = useState("0");
  // calculator state for basic chained operation (used when not using eval)
  const [prev, setPrev] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [resetNext, setResetNext] = useState(false);
  const [activeOp, setActiveOp] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isScientific, setIsScientific] = useState(false); // toggle between modes

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
  const handleBackspace = () => {
    if (resetNext) { setDisplay("0"); setResetNext(false); return; }
    if (display.length <= 1) {
      setDisplay("0");
    } else {
      setDisplay(display.slice(0, -1));
    }
  };
  const handleToggleSign = () => { setDisplay(formatResult(parseFloat(display) * -1)); };
  const handlePercent = () => { setDisplay(formatResult(parseFloat(display) / 100)); };
  
  const handleConstant = (c: string) => {
    let val = 0;
    if (c === "π") val = Math.PI;
    if (c === "e") val = Math.E;
    setDisplay(formatResult(val));
    setResetNext(true);
    setActiveOp(null);
  };

  const handleUnary = (fn: string) => {
    const value = parseFloat(display);
    let result = value;
    let expr = "";
    switch (fn) {
      case "sin": result = Math.sin(value); expr = `sin(${formatResult(value)})`; break;
      case "cos": result = Math.cos(value); expr = `cos(${formatResult(value)})`; break;
      case "tan": result = Math.tan(value); expr = `tan(${formatResult(value)})`; break;
      case "log": result = Math.log10(value); expr = `log(${formatResult(value)})`; break;
      case "ln": result = Math.log(value); expr = `ln(${formatResult(value)})`; break;
      case "sqrt": result = Math.sqrt(value); expr = `√(${formatResult(value)})`; break;
      case "sqr": result = value * value; expr = `sqr(${formatResult(value)})`; break;
      case "inv": result = value !== 0 ? 1 / value : 0; expr = `1/(${formatResult(value)})`; break;
      case "fact": {
        let n = Math.floor(value);
        let f = 1;
        for (let i = 1; i <= n; i++) f *= i;
        result = f;
        expr = `${n}!`;
        break;
      }
      default: break;
    }
    const resultStr = formatResult(result);
    setHistory((h) => [{ expression: expr, result: resultStr }, ...h].slice(0, 50));
    setDisplay(resultStr);
    setResetNext(true);
    setActiveOp(null);
  };

  const calculate = (a: number, b: number, operator: string): number => {
    switch (operator) {
      case "+": return a + b; case "−": return a - b;
      case "×": return a * b; case "÷": return b !== 0 ? a / b : 0;
      case "^": return Math.pow(a, b);
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

      <div className="w-full max-w-none p-5 relative z-10 min-h-screen">
        {/* Glass card */}
        <div className="glass-surface rounded-3xl p-5 shadow-2xl bg-black/60 backdrop-blur-md">
          {/* Display */}
          <div className="relative h-28 flex flex-col items-end justify-end px-2 mb-2 overflow-hidden">
            {/* backspace placed top-right like iOS */}
            <button
              onClick={handleBackspace}
              className="absolute top-0 right-0 mt-1 mr-1 text-xl text-white opacity-50 hover:opacity-80"
              aria-label="backspace"
            >⌫</button>
            {prev !== null && op && (
              <span className="text-sm text-muted-foreground mb-1 tracking-wide">
                {formatResult(prev)} {op}
              </span>
            )}
            <span
              data-testid="display"
              className={`${fontSize} font-mono font-bold text-[#0ff] tracking-tight transition-all duration-150`}
              style={{ textShadow: "0 0 8px #0ff" }}
            >
              {display}
            </span>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-4" />

          {/* mode toggle */}
          <div className="flex justify-end mb-2">
            <button
              onClick={() => setIsScientific(!isScientific)}
              className="text-xs px-2 py-1 rounded bg-secondary/20 hover:bg-secondary/30"
            >
              {isScientific ? "Basic" : "Scientific"}
            </button>
          </div>

          {/* scientific buttons (only when active) */}
          {isScientific && (
            <div className="grid grid-cols-4 gap-[10px] mb-2">
              {/* row1: power, inverse, factorial */}
              <CalcButton variant="func" onClick={() => handleOperator("^")}>^</CalcButton>
              <CalcButton variant="func" onClick={() => handleUnary("inv")}>1/x</CalcButton>
              <CalcButton variant="func" onClick={() => handleUnary("fact")}>n!</CalcButton>
              {/* backspace handled via display button */}

              {/* row2: trig */}
              <CalcButton variant="func" onClick={() => handleUnary("sin")}>sin</CalcButton>
              <CalcButton variant="func" onClick={() => handleUnary("cos")}>cos</CalcButton>
              <CalcButton variant="func" onClick={() => handleUnary("tan")}>tan</CalcButton>
              <CalcButton variant="func" onClick={() => handleUnary("sqrt")}>√</CalcButton>

              {/* row3: logs & constants */}
              <CalcButton variant="func" onClick={() => handleUnary("log")}>log</CalcButton>
              <CalcButton variant="func" onClick={() => handleUnary("ln")}>ln</CalcButton>
              <CalcButton variant="func" onClick={() => handleConstant("π")}>π</CalcButton>
              <CalcButton variant="func" onClick={() => handleConstant("e")}>e</CalcButton>
            </div>
          )}

          <div className="grid grid-cols-4 gap-[10px]">
            {/* standard operations */}
            <CalcButton variant="func" onClick={handleClear}>
              {prev !== null || display !== "0" ? "C" : "AC"}
            </CalcButton>
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

            <CalcButton className="col-span-2" onClick={() => handleNumber("0") }>
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
