interface HistoryEntry {
  expression: string;
  result: string;
}

interface HistoryPanelProps {
  history: HistoryEntry[];
  open: boolean;
  onClose: () => void;
  onSelect: (entry: HistoryEntry) => void;
  onClear: () => void;
}

const HistoryPanel = ({ history, open, onClose, onSelect, onClear }: HistoryPanelProps) => {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-secondary rounded-t-3xl transition-transform duration-300 ease-out max-h-[70vh] flex flex-col ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3">
          <h2 className="text-lg font-semibold text-foreground">History</h2>
          {history.length > 0 && (
            <button
              onClick={onClear}
              className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
            >
              Clear All
            </button>
          )}
        </div>

        {/* List */}
        <div className="overflow-y-auto flex-1 px-6 pb-8">
          {history.length === 0 ? (
            <p className="text-center text-muted-foreground py-12 text-sm">
              No calculations yet
            </p>
          ) : (
            <div className="space-y-1">
              {history.map((entry, i) => (
                <button
                  key={i}
                  onClick={() => onSelect(entry)}
                  className="w-full text-right py-3 px-3 rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <p className="text-sm text-muted-foreground">{entry.expression}</p>
                  <p className="text-xl font-light text-foreground">= {entry.result}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HistoryPanel;
