import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Utensils, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Ingredient {
  id: string;
  name: string;
  amount: string;
}

interface NutritionResult {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  grade: string;
  gradeColor: string;
  summary: string;
}

function analyzeNutrition(ingredients: Ingredient[]): NutritionResult {
  const knownFoods: Record<string, { cal: number; protein: number; carbs: number; fat: number; fiber: number }> = {
    "rice": { cal: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4 },
    "chawal": { cal: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4 },
    "dal": { cal: 116, protein: 9, carbs: 20, fat: 0.4, fiber: 8 },
    "roti": { cal: 71, protein: 2.6, carbs: 15, fat: 0.4, fiber: 2.2 },
    "sabzi": { cal: 50, protein: 2, carbs: 10, fat: 0.5, fiber: 3 },
    "paneer": { cal: 265, protein: 18, carbs: 3, fat: 21, fiber: 0 },
    "ghee": { cal: 900, protein: 0, carbs: 0, fat: 100, fiber: 0 },
    "oil": { cal: 900, protein: 0, carbs: 0, fat: 100, fiber: 0 },
    "tel": { cal: 900, protein: 0, carbs: 0, fat: 100, fiber: 0 },
    "chicken": { cal: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0 },
    "egg": { cal: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0 },
    "anda": { cal: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0 },
    "milk": { cal: 61, protein: 3.2, carbs: 4.8, fat: 3.3, fiber: 0 },
    "doodh": { cal: 61, protein: 3.2, carbs: 4.8, fat: 3.3, fiber: 0 },
    "aloo": { cal: 77, protein: 2, carbs: 17, fat: 0.1, fiber: 2.2 },
    "potato": { cal: 77, protein: 2, carbs: 17, fat: 0.1, fiber: 2.2 },
    "tomato": { cal: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2 },
    "tamatar": { cal: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2 },
    "onion": { cal: 40, protein: 1.1, carbs: 9.3, fat: 0.1, fiber: 1.7 },
    "pyaz": { cal: 40, protein: 1.1, carbs: 9.3, fat: 0.1, fiber: 1.7 },
  };

  let totalCal = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0, totalFiber = 0;
  let matched = 0;

  ingredients.forEach(ing => {
    const key = ing.name.toLowerCase().trim();
    const grams = parseFloat(ing.amount) || 100;
    const food = knownFoods[key];
    if (food) {
      matched++;
      const factor = grams / 100;
      totalCal += food.cal * factor;
      totalProtein += food.protein * factor;
      totalCarbs += food.carbs * factor;
      totalFat += food.fat * factor;
      totalFiber += food.fiber * factor;
    } else {
      totalCal += (grams * 1.5);
      totalCarbs += (grams * 0.15);
    }
  });

  let grade = "A", gradeColor = "bg-green-500";
  const fatRatio = totalCal > 0 ? (totalFat * 9) / totalCal : 0;
  if (totalCal > 800 || fatRatio > 0.4) { grade = "C"; gradeColor = "bg-yellow-500"; }
  if (totalCal > 1200 || fatRatio > 0.55) { grade = "D"; gradeColor = "bg-orange-500"; }
  if (totalProtein > 20 && totalFiber > 5) { grade = grade === "C" ? "B" : grade; }

  return {
    calories: Math.round(totalCal),
    protein: Math.round(totalProtein * 10) / 10,
    carbs: Math.round(totalCarbs * 10) / 10,
    fat: Math.round(totalFat * 10) / 10,
    fiber: Math.round(totalFiber * 10) / 10,
    grade,
    gradeColor,
    summary: matched === 0
      ? "Ingredients pehchaan nahi paye — approximate values hain"
      : `${matched}/${ingredients.length} ingredients analyze kiye gaye`,
  };
}

export default function GharKaKhana() {
  const [, setLocation] = useLocation();
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: "1", name: "", amount: "100" }
  ]);
  const [result, setResult] = useState<NutritionResult | null>(null);
  const [mealName, setMealName] = useState("");

  const addIngredient = () => {
    setIngredients(prev => [...prev, { id: Date.now().toString(), name: "", amount: "100" }]);
  };

  const removeIngredient = (id: string) => {
    if (ingredients.length === 1) return;
    setIngredients(prev => prev.filter(i => i.id !== id));
  };

  const updateIngredient = (id: string, field: "name" | "amount", value: string) => {
    setIngredients(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const handleAnalyze = () => {
    const filled = ingredients.filter(i => i.name.trim());
    if (filled.length === 0) {
      toast.error("Kam se kam ek ingredient toh daalo bhai!");
      return;
    }
    const res = analyzeNutrition(filled);
    setResult(res);
  };

  return (
    <div className="flex flex-col min-h-full bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => setLocation("/")}>
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-base font-bold flex items-center gap-2">
            <Utensils size={18} className="text-primary" /> Ghar Ka Khana 🍲
          </h1>
          <p className="text-xs text-muted-foreground">Apne khane ki nutrition check karo</p>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-4 pb-8">
        {/* Meal Name */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">Khane ka naam (optional)</label>
          <Input
            placeholder="e.g. Dal Chawal, Aloo Paratha..."
            value={mealName}
            onChange={e => setMealName(e.target.value)}
          />
        </div>

        {/* Ingredients */}
        <div>
          <label className="text-sm font-medium mb-2 block">Ingredients 🥘</label>
          <div className="space-y-2">
            {ingredients.map((ing, idx) => (
              <div key={ing.id} className="flex gap-2 items-center">
                <Input
                  placeholder={`Ingredient ${idx + 1} (e.g. Dal, Chawal)`}
                  value={ing.name}
                  onChange={e => updateIngredient(ing.id, "name", e.target.value)}
                  className="flex-1"
                />
                <Input
                  type="number"
                  placeholder="grams"
                  value={ing.amount}
                  onChange={e => updateIngredient(ing.id, "amount", e.target.value)}
                  className="w-20 text-center"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeIngredient(ing.id)}
                  className="text-muted-foreground hover:text-destructive flex-shrink-0"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
          </div>

          <Button variant="outline" size="sm" className="mt-2 w-full" onClick={addIngredient}>
            <Plus size={15} className="mr-1" /> Aur ingredient add karo
          </Button>
        </div>

        {/* Analyze Button */}
        <Button className="w-full h-12 text-base font-bold" onClick={handleAnalyze}>
          🔍 Nutrition Analyze Karo
        </Button>

        {/* Result */}
        {result && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-base">{mealName || "Aapka Khana"} 🍽️</h2>
                <div className={`${result.gradeColor} text-white font-black text-lg w-10 h-10 rounded-lg flex items-center justify-center`}>
                  {result.grade}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Calories", value: `${result.calories} kcal`, color: "text-orange-500" },
                  { label: "Protein", value: `${result.protein}g`, color: "text-blue-500" },
                  { label: "Carbs", value: `${result.carbs}g`, color: "text-yellow-500" },
                  { label: "Fat", value: `${result.fat}g`, color: "text-red-500" },
                  { label: "Fiber", value: `${result.fiber}g`, color: "text-green-500" },
                ].map(item => (
                  <div key={item.label} className="bg-background rounded-lg p-2.5 text-center">
                    <p className={`text-base font-bold ${item.color}`}>{item.value}</p>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                  </div>
                ))}
              </div>

              <p className="text-xs text-muted-foreground text-center">{result.summary}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
