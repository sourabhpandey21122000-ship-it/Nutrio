import { useState } from "react";
import {
  useListFruitsVeggies,
  useSearchFruitsVeggies,
  getSearchFruitsVeggiesQueryKey,
  FruitVeggie,
} from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, ChevronDown, ChevronUp, Leaf } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORY_LABELS: Record<string, string> = {
  fruit: "🍓 Fruits",
  vegetable: "🥦 Vegetables",
  leafy: "🥬 Leafy Greens",
  root: "🥕 Root Vegetables",
};

const CATEGORY_ORDER = ["fruit", "vegetable", "leafy", "root"];

function FruitVeggieCard({ item }: { item: FruitVeggie }) {
  const [expanded, setExpanded] = useState(false);
  const n = item.nutrition;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <button
          data-testid={`card-fv-${item.id}`}
          className="w-full flex items-center gap-3 p-3 text-left"
          onClick={() => setExpanded((v) => !v)}
        >
          <span className="text-3xl w-12 text-center flex-shrink-0">{item.imageEmoji || "🌿"}</span>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">{item.name}</p>
            <p className="text-xs text-muted-foreground">{item.nameHindi}</p>
            {item.season && (
              <p className="text-xs text-primary/70 mt-0.5">Season: {item.season}</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-1 text-right flex-shrink-0">
            <p className="text-sm font-bold text-primary">{n.calories ?? "?"}kcal</p>
            <p className="text-xs text-muted-foreground">per 100g</p>
          </div>
          {expanded ? <ChevronUp size={16} className="text-muted-foreground flex-shrink-0" /> : <ChevronDown size={16} className="text-muted-foreground flex-shrink-0" />}
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-3 pb-3 border-t space-y-3">
                {/* Nutrients */}
                <div className="grid grid-cols-3 gap-2 pt-3">
                  {[
                    { label: "Carbs", val: n.carbohydrates, unit: "g" },
                    { label: "Protein", val: n.protein, unit: "g" },
                    { label: "Fat", val: n.fat, unit: "g" },
                    { label: "Fiber", val: n.fiber, unit: "g" },
                    { label: "Sugar", val: n.sugars, unit: "g" },
                    { label: "Sodium", val: n.sodium, unit: "mg" },
                  ].map(({ label, val, unit }) => (
                    <div key={label} className="text-center bg-muted/50 rounded-lg p-2">
                      <p className="text-sm font-bold">{val ?? "-"}{val != null ? unit : ""}</p>
                      <p className="text-xs text-muted-foreground">{label}</p>
                    </div>
                  ))}
                </div>

                {item.benefits && item.benefits.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Benefits</p>
                    <div className="flex flex-wrap gap-1.5">
                      {item.benefits.map((b) => (
                        <Badge key={b} variant="secondary" className="text-xs bg-green-100 text-green-800 border-green-200">
                          {b}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {item.freshnessTips && item.freshnessTips.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Freshness Tips</p>
                    <ul className="space-y-1">
                      {item.freshnessTips.map((tip) => (
                        <li key={tip} className="text-xs text-muted-foreground flex items-start gap-1.5">
                          <span className="text-primary mt-0.5">•</span> {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

export default function FruitsVeggies() {
  const [query, setQuery] = useState("");

  const { data: allItems, isLoading: loadingAll } = useListFruitsVeggies();
  const { data: searchResults, isLoading: loadingSearch } = useSearchFruitsVeggies(
    { q: query },
    { query: { enabled: query.trim().length >= 2, queryKey: getSearchFruitsVeggiesQueryKey({ q: query }) } }
  );

  const isSearching = query.trim().length >= 2;
  const items = isSearching ? (searchResults ?? []) : (allItems ?? []);
  const isLoading = isSearching ? loadingSearch : loadingAll;

  const grouped = CATEGORY_ORDER.reduce<Record<string, FruitVeggie[]>>((acc, cat) => {
    const catItems = items.filter((item) => item.category === cat);
    if (catItems.length > 0) acc[cat] = catItems;
    return acc;
  }, {});

  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <header className="pt-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Leaf className="text-primary" size={24} /> Sabzi Mandi
        </h1>
        <p className="text-muted-foreground text-sm">Fresh fruits & vegetables ka nutrition</p>
      </header>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <Input
          data-testid="input-fv-search"
          type="search"
          placeholder="Search fruits & veggies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 h-11"
        />
      </div>

      <div className="flex-1 overflow-auto -mx-4 px-4 pb-4 space-y-4">
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i}>
                <CardContent className="p-3 flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-lg" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                  <Skeleton className="h-5 w-14" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : isSearching ? (
          items.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              <p>Koi item nahi mila for "{query}"</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">{items.length} results</p>
              {items.map((item) => <FruitVeggieCard key={item.id} item={item} />)}
            </div>
          )
        ) : (
          Object.entries(grouped).map(([cat, catItems]) => (
            <section key={cat}>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                {CATEGORY_LABELS[cat] ?? cat}
              </h2>
              <div className="space-y-2">
                {catItems.map((item) => <FruitVeggieCard key={item.id} item={item} />)}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
