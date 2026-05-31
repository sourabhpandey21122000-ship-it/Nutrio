import { useState } from "react";
import { Link } from "wouter";
import { useHistory } from "@/hooks/useHistory";
import { NutriScore } from "@/components/ui/nutri-score";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, ScanLine } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

const GRADE_FILTERS = ["All", "A", "B", "C", "D", "E"] as const;

export default function History() {
  const { history, removeFromHistory } = useHistory();
  const [filter, setFilter] = useState<typeof GRADE_FILTERS[number]>("All");

  const filtered = filter === "All"
    ? history
    : history.filter((item) => item.nutriScore.toUpperCase() === filter);

  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <header className="pt-4">
        <h1 className="text-2xl font-bold">Scan History</h1>
        <p className="text-muted-foreground text-sm">{history.length} products scanned</p>
      </header>

      {/* Grade Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {GRADE_FILTERS.map((grade) => (
          <button
            key={grade}
            data-testid={`filter-grade-${grade}`}
            onClick={() => setFilter(grade)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
              filter === grade
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-border hover:border-primary/50"
            }`}
          >
            {grade === "All" ? "All" : `Grade ${grade}`}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto -mx-4 px-4 pb-4">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
              <ScanLine size={32} className="text-muted-foreground" />
            </div>
            <p className="text-lg font-semibold">Abhi tak koi scan nahi kiya!</p>
            <p className="text-muted-foreground text-sm mt-1">Chaliye shuru karte hain</p>
            <Link href="/scan">
              <Button className="mt-6 bg-primary">Start Scanning</Button>
            </Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-muted-foreground">No Grade {filter} products found</p>
          </div>
        ) : (
          <AnimatePresence>
            <div className="space-y-2">
              {filtered.map((item) => (
                <motion.div
                  key={item.barcode + item.scannedAt}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  layout
                >
                  <Card data-testid={`card-history-${item.barcode}`}>
                    <CardContent className="p-3 flex items-center gap-3">
                      <Link href={`/product/${item.barcode}`} className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-11 h-11 bg-muted rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-lg">🛒</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{item.brand || "Unknown"}</p>
                          <p className="text-xs text-muted-foreground/60">
                            {formatDistanceToNow(new Date(item.scannedAt), { addSuffix: true })}
                          </p>
                        </div>
                      </Link>
                      <NutriScore score={item.nutriScore} size="sm" />
                      <button
                        data-testid={`button-delete-${item.barcode}`}
                        onClick={() => removeFromHistory(item.barcode)}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10"
                      >
                        <Trash2 size={16} />
                      </button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
