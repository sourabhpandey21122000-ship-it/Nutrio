import { useParams, useLocation } from "wouter";
import { useGetProductByBarcode, getGetProductByBarcodeQueryKey, ProductSummary } from "@workspace/api-client-react";
import { NutriScore } from "@/components/ui/nutri-score";
import { TrafficLight } from "@/components/ui/traffic-light";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Save, ScanLine, Leaf, Info, AlertTriangle, Sparkles, FlameKindling, ArrowRight, RefreshCw } from "lucide-react";
import { useHistory } from "@/hooks/useHistory";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { motion } from "framer-motion";

// ── Gen Z Hinglish grade vibes ───────────────────────────────────────────────
const GRADE_VIBE: Record<string, { headline: string; sub: string; bg: string; text: string; border: string }> = {
  A: {
    headline: "Ekdum sahi choice! 💪",
    sub: "Clean hai bhai ✅ — yeh toh full marks wala product hai!",
    bg: "bg-green-50",
    text: "text-green-800",
    border: "border-green-200",
  },
  B: {
    headline: "Solid choice hai yaar! 👍",
    sub: "Balanced diet ka perfect buddy 🙌 — isko regularly kha sakte ho!",
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    border: "border-emerald-200",
  },
  C: {
    headline: "Not bad, par better bhi ho sakta tha 😅",
    sub: "Kabhi kabhi theek hai — but roz roz mat khao bhai!",
    bg: "bg-yellow-50",
    text: "text-yellow-800",
    border: "border-yellow-200",
  },
  D: {
    headline: "Yaar ye toh red flag hai 🚩",
    sub: "Kabhi kabhi okay, but daily avoid karo — seriously!",
    bg: "bg-orange-50",
    text: "text-orange-800",
    border: "border-orange-200",
  },
  E: {
    headline: "Isko avoid karo, seriously 😬",
    sub: "Body pe direct attack kar raha hai yeh 💀 — healthier switch karo!",
    bg: "bg-red-50",
    text: "text-red-800",
    border: "border-red-200",
  },
};

export default function Product() {
  const { barcode } = useParams();
  const [, setLocation] = useLocation();
  const { saveToHistory } = useHistory();

  const { data: product, isLoading, error } = useGetProductByBarcode(barcode || "", {
    query: {
      enabled: !!barcode,
      queryKey: getGetProductByBarcodeQueryKey(barcode || "")
    }
  });

  const handleSave = () => {
    if (product) {
      saveToHistory(product);
      toast.success("✅ History mein save ho gaya!");
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground font-medium">Database khangaal rahe hain... 🔍</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-20 h-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-2">
          <AlertTriangle size={32} />
        </div>
        <h2 className="text-2xl font-bold">Product nahi mila! 😔</h2>
        <p className="text-muted-foreground mb-4">
          Barcode <span className="font-mono font-bold">{barcode}</span> hamare database mein nahi hai. Dusra try karo!
        </p>
        <Button onClick={() => setLocation("/scan")} className="w-full max-w-xs bg-primary">
          Dobara Scan Karo 📷
        </Button>
      </div>
    );
  }

  const grade = product.nutriScore.toUpperCase();
  const vibe = GRADE_VIBE[grade] ?? GRADE_VIBE["C"];
  const isUnhealthy = grade === "D" || grade === "E";
  const hasAlternatives = product.alternatives && product.alternatives.length > 0;

  return (
    <div className="flex flex-col bg-background overflow-auto pb-8">
      {/* Hero Header */}
      <div className="relative bg-muted/30 pt-16 pb-12 px-6 flex flex-col items-center">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 bg-background/60 backdrop-blur-md rounded-full"
          onClick={() => setLocation("/")}
        >
          <ArrowLeft />
        </Button>

        <div className="w-36 h-36 bg-card rounded-2xl shadow-sm border p-2 flex items-center justify-center mb-5 overflow-hidden">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="max-w-full max-h-full object-contain" />
          ) : (
            <span className="text-5xl">🛒</span>
          )}
        </div>

        <h1 className="text-xl font-bold text-center mb-1 leading-snug">{product.name}</h1>
        <p className="text-muted-foreground text-sm text-center">{product.brand || "Brand Unknown"}</p>

        <div className="absolute -bottom-12 shadow-xl">
          <NutriScore score={product.nutriScore} points={product.nutriScorePoints} size="xl" showPoints />
        </div>
      </div>

      <div className="px-4 pt-16 space-y-5">

        {/* ── Grade Vibe Banner ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className={`rounded-2xl p-4 border ${vibe.bg} ${vibe.border}`}
        >
          <p className={`font-bold text-base ${vibe.text}`}>{vibe.headline}</p>
          <p className={`text-sm mt-0.5 ${vibe.text} opacity-80`}>{vibe.sub}</p>
        </motion.div>

        {/* ── Badges ── */}
        <div className="flex flex-wrap gap-2 justify-center">
          {product.isVeg !== null && (
            <Badge variant="outline" className={product.isVeg
              ? "border-green-500 text-green-700 bg-green-50"
              : "border-red-500 text-red-700 bg-red-50"
            }>
              <div className={`w-2 h-2 rounded-full mr-1.5 ${product.isVeg ? "bg-green-600" : "bg-red-600"}`} />
              {product.isVeg ? "Veg 🌿" : "Non-Veg 🍗"}
            </Badge>
          )}
          {product.isVegan && (
            <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50">
              <Leaf size={11} className="mr-1" /> Vegan 🌱
            </Badge>
          )}
          {product.isSwadeshi && (
            <Badge variant="outline" className="border-orange-400 text-orange-700 bg-orange-50">
              🇮🇳 Swadeshi
            </Badge>
          )}
          {product.isUltraProcessed && (
            <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100">
              <AlertTriangle size={11} className="mr-1" /> Ultra-Processed ⚠️
            </Badge>
          )}
          {product.source === "openfoodfacts" && (
            <Badge variant="outline" className="border-blue-300 text-blue-600 bg-blue-50 text-[10px]">
              📡 Open Food Facts
            </Badge>
          )}
        </div>

        {/* ── Nutrition Traffic Lights ── */}
        <section>
          <h3 className="font-semibold mb-3 flex items-center gap-2 text-base">
            <Info size={17} className="text-primary" />
            Kya hai andar? 👀 (per 100g)
          </h3>
          <div className="space-y-2">
            <TrafficLight
              label="Sugar (Cheeni) 🍬"
              value={product.nutrition?.sugars ?? null}
              level={getTrafficLevel(product.nutrition?.sugars, "sugar")}
            />
            <TrafficLight
              label="Fat (Chiknaai) 🫙"
              value={product.nutrition?.fat ?? null}
              level={getTrafficLevel(product.nutrition?.fat, "fat")}
            />
            <TrafficLight
              label="Salt (Namak) 🧂"
              value={product.nutrition?.salt ?? null}
              level={getTrafficLevel(product.nutrition?.salt, "salt")}
            />
            <TrafficLight
              label="Calories 🔥"
              value={product.nutrition?.calories ?? null}
              level={getTrafficLevel(product.nutrition?.calories, "calories")}
              unit=" kcal"
            />
            {product.nutrition?.protein != null && (
              <TrafficLight
                label="Protein 💪"
                value={product.nutrition.protein}
                level="low"
              />
            )}
            {product.nutrition?.fiber != null && (
              <TrafficLight
                label="Fiber 🌾"
                value={product.nutrition.fiber}
                level="low"
              />
            )}
          </div>
        </section>

        {/* ── Healthier Switch Kar! ── */}
        {isUnhealthy && hasAlternatives && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className={`rounded-2xl overflow-hidden border ${grade === "E" ? "border-red-200" : "border-orange-200"}`}>
              {/* Header */}
              <div className={`px-4 py-3 flex items-center gap-2 ${grade === "E" ? "bg-red-500" : "bg-orange-500"}`}>
                <RefreshCw size={18} className="text-white" />
                <div>
                  <p className="font-bold text-white text-base">Healthier Switch Kar! 🔄</p>
                  <p className="text-white/80 text-xs">
                    {grade === "E"
                      ? "Yeh toh bilkul nahi yaar — try these instead:"
                      : "Grade D hai — in options pe switch karo:"}
                  </p>
                </div>
              </div>

              {/* Alt cards */}
              <div className="bg-white divide-y divide-gray-100">
                {(product.alternatives as ProductSummary[]).map((alt, i) => {
                  const isCurated = alt.barcode.startsWith("curated-");
                  const content = (
                    <div className="px-4 py-3 flex items-center gap-3">
                      <NutriScore score={alt.nutriScore} points={alt.nutriScorePoints} size="md" showPoints />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm">{alt.name}</p>
                        <p className="text-xs text-muted-foreground">{alt.brand || alt.category}</p>
                        {alt.reason && (
                          <p className="text-xs text-green-700 mt-0.5 leading-snug">{alt.reason}</p>
                        )}
                        {isCurated && (
                          <p className="text-[10px] text-muted-foreground mt-0.5 italic">kirana / online pe milega</p>
                        )}
                      </div>
                      {!isCurated && <ArrowRight size={15} className="text-muted-foreground flex-shrink-0" />}
                    </div>
                  );

                  return (
                    <motion.div
                      key={`${alt.barcode}-${i}`}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.08 }}
                    >
                      {isCurated ? (
                        <div>{content}</div>
                      ) : (
                        <Link href={`/product/${alt.barcode}`}>
                          <div className="cursor-pointer active:bg-green-50 transition-colors">{content}</div>
                        </Link>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.section>
        )}

        {/* ── Nutrio Ki Salah ── */}
        {product.tips && product.tips.length > 0 && (
          <section>
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-base">
              <Sparkles size={17} className="text-amber-500" />
              Nutrio Ki Salah 🧠
            </h3>
            <div className="space-y-2">
              {product.tips.map((tip, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={`p-3 rounded-xl text-sm leading-relaxed border ${
                    isUnhealthy
                      ? "bg-red-50 border-red-100 text-red-900"
                      : "bg-amber-50 border-amber-100 text-amber-900"
                  }`}
                >
                  {tip}
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ── Ayurvedic Nazar Se ── */}
        {product.ayurvedicNote && (
          <section>
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-base">
              <FlameKindling size={17} className="text-orange-500" />
              Ayurvedic Nazar Se 🌿
            </h3>
            <div className="p-4 rounded-xl bg-orange-50 border border-orange-100 text-sm text-orange-900 leading-relaxed">
              {product.ayurvedicNote}
            </div>
          </section>
        )}

        {/* ── Ingredients ── */}
        {product.ingredients && (
          <section>
            <h3 className="font-semibold mb-2 text-base">Ingredients (Kya Daala Hai? 🧪)</h3>
            <p className="text-sm text-muted-foreground leading-relaxed bg-muted/40 rounded-xl p-3">
              {product.ingredients}
            </p>
          </section>
        )}

        {/* ── Actions ── */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t">
          <Button variant="outline" onClick={handleSave} className="h-14 font-medium">
            <Save className="mr-2" size={18} /> Save Karo 📌
          </Button>
          <Button onClick={() => setLocation("/scan")} className="h-14 font-medium bg-primary">
            <ScanLine className="mr-2" size={18} /> Aur Scan Karo
          </Button>
        </div>
      </div>
    </div>
  );
}

function getTrafficLevel(value: number | undefined | null, type: string): "low" | "medium" | "high" {
  if (value == null) return "medium";
  if (type === "sugar") return value > 22.5 ? "high" : value > 5 ? "medium" : "low";
  if (type === "fat") return value > 17.5 ? "high" : value > 3 ? "medium" : "low";
  if (type === "salt") return value > 1.5 ? "high" : value > 0.3 ? "medium" : "low";
  if (type === "calories") return value > 400 ? "high" : value > 100 ? "medium" : "low";
  return "low";
}
