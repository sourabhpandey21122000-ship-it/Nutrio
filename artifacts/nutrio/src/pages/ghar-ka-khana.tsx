import { useState } from "react";
import {
  useListIngredients,
  useListDishes,
  useAnalyzeHomeMeal,
  Ingredient,
  Dish,
  MealIngredientItem,
  NutritionResult,
} from "@workspace/api-client-react";
import { NutriScore } from "@/components/ui/nutri-score";
import { TrafficLight } from "@/components/ui/traffic-light";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Minus, Plus, Trash2, ChefHat, Utensils, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface SelectedIngredient extends MealIngredientItem {
  name: string;
  nameHindi: string;
}

export default function GharKaKhana() {
  const [mealName, setMealName] = useState("Ghar Ka Khana");
  const [selected, setSelected] = useState<SelectedIngredient[]>([]);
  const [result, setResult] = useState<NutritionResult | null>(null);
  const [activeTab, setActiveTab] = useState<"ingredients" | "dishes">("dishes");

  const { data: ingredients, isLoading: loadingIngredients } = useListIngredients();
  const { data: dishes, isLoading: loadingDishes } = useListDishes();
  const { mutateAsync: analyzeMeal, isPending } = useAnalyzeHomeMeal();

  const addIngredient = (ing: Ingredient) => {
    setSelected((prev) => {
      const exists = prev.find((s) => s.ingredientId === ing.id);
      if (exists) {
        return prev.map((s) =>
          s.ingredientId === ing.id
            ? { ...s, grams: s.grams + (ing.defaultServingGrams ?? 50) }
            : s
        );
      }
      return [
        ...prev,
        {
          ingredientId: ing.id,
          grams: ing.defaultServingGrams ?? 50,
          name: ing.name,
          nameHindi: ing.nameHindi,
        },
      ];
    });
    setResult(null);
  };

  const loadDish = (dish: Dish) => {
    if (!ingredients) return;
    const dishIngredients: SelectedIngredient[] = dish.ingredients.map((di) => {
      const ing = ingredients.find((i) => i.id === di.ingredientId);
      return {
        ingredientId: di.ingredientId,
        grams: di.grams,
        name: ing?.name ?? di.ingredientId,
        nameHindi: ing?.nameHindi ?? "",
      };
    });
    setSelected(dishIngredients);
    setMealName(dish.name);
    setResult(null);
    toast.success(`Loaded: ${dish.name}`);
  };

  const updateGrams = (id: string, delta: number) => {
    setSelected((prev) =>
      prev
        .map((s) => (s.ingredientId === id ? { ...s, grams: Math.max(10, s.grams + delta) } : s))
    );
    setResult(null);
  };

  const removeIngredient = (id: string) => {
    setSelected((prev) => prev.filter((s) => s.ingredientId !== id));
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (selected.length === 0) {
      toast.error("Pehle kuch ingredients add karo!");
      return;
    }
    try {
      const res = await analyzeMeal({
        data: {
          mealName,
          servings: 1,
          ingredients: selected.map(({ ingredientId, grams }) => ({ ingredientId, grams })),
        },
      });
      setResult(res);
    } catch {
      toast.error("Analysis failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <header className="pt-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Utensils className="text-primary" size={22} /> Ghar Ka Khana
        </h1>
        <p className="text-muted-foreground text-sm">Apne dish ka nutrition analyze karo</p>
      </header>

      {/* Meal Name */}
      <Input
        data-testid="input-meal-name"
        value={mealName}
        onChange={(e) => setMealName(e.target.value)}
        placeholder="Meal ka naam (e.g. Dal Chawal)"
        className="h-11"
      />

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-lg">
        {(["dishes", "ingredients"] as const).map((tab) => (
          <button
            key={tab}
            data-testid={`tab-${tab}`}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === tab
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "dishes" ? "🍛 Popular Dishes" : "🧂 Ingredients"}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto -mx-4 px-4 space-y-2 pb-4">
        {activeTab === "dishes" ? (
          loadingDishes ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
            </div>
          ) : (
            (dishes ?? []).map((dish) => (
              <Card
                key={dish.id}
                data-testid={`card-dish-${dish.id}`}
                className="cursor-pointer hover:border-primary/40 transition-colors active:scale-[0.98] transition-transform"
                onClick={() => loadDish(dish)}
              >
                <CardContent className="p-3 flex items-center gap-3">
                  <span className="text-3xl">{dish.imageEmoji || "🍽️"}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{dish.name}</p>
                    <p className="text-xs text-muted-foreground">{dish.nameHindi}</p>
                    {dish.description && (
                      <p className="text-xs text-muted-foreground/70 mt-0.5 line-clamp-1">{dish.description}</p>
                    )}
                  </div>
                  <Badge variant="outline" className="text-xs flex-shrink-0">{dish.ingredients.length} items</Badge>
                </CardContent>
              </Card>
            ))
          )
        ) : loadingIngredients ? (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}
          </div>
        ) : (
          (ingredients ?? []).map((ing) => (
            <Card
              key={ing.id}
              data-testid={`card-ing-${ing.id}`}
              className="cursor-pointer hover:border-primary/40 transition-colors active:scale-[0.98] transition-transform"
              onClick={() => addIngredient(ing)}
            >
              <CardContent className="p-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{ing.name}</p>
                  <p className="text-xs text-muted-foreground">{ing.nameHindi} · {ing.category}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-primary">{ing.nutrition.calories ?? "?"}kcal</p>
                  <p className="text-xs text-muted-foreground">/{ing.defaultServingGrams ?? 100}g</p>
                </div>
                <Plus size={18} className="text-primary flex-shrink-0" />
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Selected Basket */}
      {selected.length > 0 && (
        <div className="border rounded-xl p-3 bg-muted/30 space-y-2">
          <p className="text-sm font-semibold flex items-center gap-2">
            <ChefHat size={16} className="text-primary" />
            Selected ({selected.length})
          </p>
          <div className="space-y-1.5">
            <AnimatePresence>
              {selected.map((s) => (
                <motion.div
                  key={s.ingredientId}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 bg-background rounded-lg p-2 border"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.nameHindi}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      data-testid={`btn-dec-${s.ingredientId}`}
                      onClick={() => updateGrams(s.ingredientId, -25)}
                      className="w-6 h-6 bg-muted rounded-full flex items-center justify-center hover:bg-muted/70"
                    >
                      <Minus size={10} />
                    </button>
                    <span className="text-xs font-mono w-12 text-center">{s.grams}g</span>
                    <button
                      data-testid={`btn-inc-${s.ingredientId}`}
                      onClick={() => updateGrams(s.ingredientId, 25)}
                      className="w-6 h-6 bg-muted rounded-full flex items-center justify-center hover:bg-muted/70"
                    >
                      <Plus size={10} />
                    </button>
                  </div>
                  <button
                    data-testid={`btn-remove-${s.ingredientId}`}
                    onClick={() => removeIngredient(s.ingredientId)}
                    className="p-1 text-muted-foreground hover:text-destructive rounded"
                  >
                    <Trash2 size={14} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <Button
            data-testid="button-analyze"
            onClick={handleAnalyze}
            disabled={isPending}
            className="w-full bg-primary h-12 font-semibold"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Analyzing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles size={18} /> Analyze Nutrition
              </span>
            )}
          </Button>
        </div>
      )}

      {/* Result */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 pb-4"
        >
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center justify-between">
                <span>{result.mealName}</span>
                <NutriScore score={result.nutriScore} size="md" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Calories", val: result.perServingNutrition.calories, unit: "kcal" },
                  { label: "Protein", val: result.perServingNutrition.protein, unit: "g" },
                  { label: "Carbs", val: result.perServingNutrition.carbohydrates, unit: "g" },
                  { label: "Fat", val: result.perServingNutrition.fat, unit: "g" },
                  { label: "Fiber", val: result.perServingNutrition.fiber, unit: "g" },
                  { label: "Salt", val: result.perServingNutrition.salt, unit: "g" },
                ].map(({ label, val, unit }) => (
                  <div key={label} className="text-center bg-background rounded-xl p-2 border">
                    <p className="text-sm font-bold">{val != null ? `${val}${unit}` : "-"}</p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                {Object.values(result.trafficLights).map((tl) =>
                  tl ? (
                    <TrafficLight
                      key={tl.label}
                      label={tl.label}
                      value={tl.value}
                      level={tl.level}
                      unit={tl.label === "Calories" ? " kcal" : "g"}
                    />
                  ) : null
                )}
              </div>

              {result.tips && result.tips.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-1">
                  <p className="text-xs font-semibold text-amber-800">💡 Health Tips</p>
                  {result.tips.map((tip) => (
                    <p key={tip} className="text-xs text-amber-700">{tip}</p>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
