import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, ChevronDown, ChevronUp, Leaf } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FruitVeggie {
  id: number;
  name: string;
  nameHindi: string;
  category: string;
  imageEmoji: string;
  season?: string;
  benefits: string[];
  freshnessTips: string[];
  nutrition: {
    calories: number;
    carbohydrates: number;
    protein: number;
    fat: number;
    fiber: number;
    sugars: number;
    sodium: number;
  };
}

const DATA: FruitVeggie[] = [
  { id: 1, name: "Apple", nameHindi: "Seb", category: "fruit", imageEmoji: "🍎", season: "Winter", benefits: ["Heart health", "Fiber rich"], freshnessTips: ["Store in fridge", "Avoid bruising"], nutrition: { calories: 52, carbohydrates: 14, protein: 0.3, fat: 0.2, fiber: 2.4, sugars: 10, sodium: 1 } },
  { id: 2, name: "Banana", nameHindi: "Kela", category: "fruit", imageEmoji: "🍌", season: "All year", benefits: ["Energy boost", "Potassium rich"], freshnessTips: ["Store at room temp", "Avoid direct sunlight"], nutrition: { calories: 89, carbohydrates: 23, protein: 1.1, fat: 0.3, fiber: 2.6, sugars: 12, sodium: 1 } },
  { id: 3, name: "Mango", nameHindi: "Aam", category: "fruit", imageEmoji: "🥭", season: "Summer", benefits: ["Vitamin C", "Immunity boost"], freshnessTips: ["Ripen at room temp", "Refrigerate when ripe"], nutrition: { calories: 60, carbohydrates: 15, protein: 0.8, fat: 0.4, fiber: 1.6, sugars: 14, sodium: 1 } },
  { id: 4, name: "Papaya", nameHindi: "Papita", category: "fruit", imageEmoji: "🍈", season: "All year", benefits: ["Digestion", "Vitamin A"], freshnessTips: ["Store unripe at room temp"], nutrition: { calories: 43, carbohydrates: 11, protein: 0.5, fat: 0.3, fiber: 1.7, sugars: 8, sodium: 8 } },
  { id: 5, name: "Guava", nameHindi: "Amrood", category: "fruit", imageEmoji: "🍐", season: "Winter", benefits: ["Vitamin C", "Diabetes friendly"], freshnessTips: ["Eat when slightly soft"], nutrition: { calories: 68, carbohydrates: 14, protein: 2.6, fat: 1, fiber: 5.4, sugars: 9, sodium: 2 } },
  { id: 6, name: "Tomato", nameHindi: "Tamatar", category: "vegetable", imageEmoji: "🍅", season: "All year", benefits: ["Lycopene", "Heart health"], freshnessTips: ["Store at room temp", "Avoid fridge"], nutrition: { calories: 18, carbohydrates: 3.9, protein: 0.9, fat: 0.2, fiber: 1.2, sugars: 2.6, sodium: 5 } },
  { id: 7, name: "Onion", nameHindi: "Pyaaz", category: "vegetable", imageEmoji: "🧅", season: "All year", benefits: ["Antibacterial", "Heart health"], freshnessTips: ["Store in cool dry place"], nutrition: { calories: 40, carbohydrates: 9, protein: 1.1, fat: 0.1, fiber: 1.7, sugars: 4.2, sodium: 4 } },
  { id: 8, name: "Potato", nameHindi: "Aloo", category: "vegetable", imageEmoji: "🥔", season: "All year", benefits: ["Energy", "Potassium"], freshnessTips: ["Store in dark cool place"], nutrition: { calories: 77, carbohydrates: 17, protein: 2, fat: 0.1, fiber: 2.2, sugars: 0.8, sodium: 6 } },
  { id: 9, name: "Spinach", nameHindi: "Palak", category: "leafy", imageEmoji: "🥬", season: "Winter", benefits: ["Iron rich", "Bone health"], freshnessTips: ["Refrigerate in damp cloth"], nutrition: { calories: 23, carbohydrates: 3.6, protein: 2.9, fat: 0.4, fiber: 2.2, sugars: 0.4, sodium: 79 } },
  { id: 10, name: "Fenugreek", nameHindi: "Methi", category: "leafy", imageEmoji: "🌿", season: "Winter", benefits: ["Blood sugar control", "Digestion"], freshnessTips: ["Use fresh, store in fridge"], nutrition: { calories: 49, carbohydrates: 6, protein: 4.4, fat: 0.9, fiber: 2.7, sugars: 0, sodium: 67 } },
  { id: 11, name: "Carrot", nameHindi: "Gajar", category: "root", imageEmoji: "🥕", season: "Winter", benefits: ["Eye health", "Vitamin A"], freshnessTips: ["Store in fridge", "Remove tops before storing"], nutrition: { calories: 41, carbohydrates: 10, protein: 0.9, fat: 0.2, fiber: 2.8, sugars: 4.7, sodium: 69 } },
  { id: 12, name: "Radish", nameHindi: "Mooli", category: "root", imageEmoji: "🌶️", season: "Winter", benefits: ["Liver health", "Digestion"], freshnessTips: ["Store in fridge"], nutrition: { calories: 16, carbohydrates: 3.4, protein: 0.7, fat: 0.1, fiber: 1.6, sugars: 1.9, sodium: 39 } },
];

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
        <button className="w-full flex items-center gap-3 p-3 text-left" onClick={() => setExpanded((v) => !v)}>
          <span className="text-3xl w-12 text-center flex-shrink-0">{item.imageEmoji}</span>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">{item.name}</p>
            <p className="text-xs text-muted-foreground">{item.nameHindi}</p>
            {item.season && <p className="text-xs text-primary/70 mt-0.5">Season: {item.season}</p>}
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <p className="text-sm font-bold text-primary">{n.calories}kcal</p>
            <p className="text-xs text-muted-foreground">per 100g</p>
          </div>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        <AnimatePresence>
          {expanded && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
              <div className="px-3 pb-3 border-t space-y-3">
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
                      <p className="text-sm font-bold">{val}{unit}</p>
                      <p className="text-xs text-muted-foreground">{label}</p>
                    </div>
                  ))}
                </div>
                {item.benefits.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Benefits</p>
                    <div className="flex flex-wrap gap-1.5">
                      {item.benefits.map((b) => <Badge key={b} variant="secondary" className="text-xs bg-green-100 text-green-800">{b}</Badge>)}
                    </div>
                  </div>
                )}
                {item.freshnessTips.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Freshness Tips</p>
                    <ul className="space-y-1">
                      {item.freshnessTips.map((tip) => <li key={tip} className="text-xs text-muted-foreground flex items-start gap-1.5"><span className="text-primary">•</span> {tip}</li>)}
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

  const items = query.trim().length >= 2
    ? DATA.filter((i) => i.name.toLowerCase().includes(query.toLowerCase()) || i.nameHindi.toLowerCase().includes(query.toLowerCase()))
    : DATA;

  const grouped = CATEGORY_ORDER.reduce<Record<string, FruitVeggie[]>>((acc, cat) => {
    const catItems = items.filter((i) => i.category === cat);
    if (catItems.length > 0) acc[cat] = catItems;
    return acc;
  }, {});

  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <header className="pt-4">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Leaf className="text-primary" size={24} /> Sabzi Mandi</h1>
        <p className="text-muted-foreground text-sm">Fresh fruits & vegetables ka nutrition</p>
      </header>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <Input type="search" placeholder="Search fruits & veggies..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-10 h-11" />
      </div>
      <div className="flex-1 overflow-auto -mx-4 px-4 pb-4 space-y-4">
        {query.trim().length >= 2 ? (
          items.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground"><p>Koi item nahi mila "{query}" ke liye</p></div>
          ) : (
            <div className="space-y-2">{items.map((item) => <FruitVeggieCard key={item.id} item={item} />)}</div>
          )
        ) : (
          Object.entries(grouped).map(([cat, catItems]) => (
            <section key={cat}>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">{CATEGORY_LABELS[cat]}</h2>
              <div className="space-y-2">{catItems.map((item) => <FruitVeggieCard key={item.id} item={item} />)}</div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
