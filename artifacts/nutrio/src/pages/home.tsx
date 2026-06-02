import { Link } from "wouter";
import { useHistory } from "@/hooks/useHistory";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NutriScore } from "@/components/ui/nutri-score";
import { Flame, Camera, Search, Leaf, Utensils, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { history } = useHistory();
  const recentScans = history.slice(0, 3);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) return "Raat ko kya khaa rahe ho yaar? 🌙";
    if (hour < 12) return "Breakfast healthy hai toh din sahi hoga! 🌅";
    if (hour < 16) return "Lunch kya khaoge? Check karo pehle! 🍛";
    if (hour < 20) return "Snack time — par healthy wala! 😄";
    return "Dinner time! Ghar ka khana best rehta hai bhai 🥗";
  };

  const streakCount = Math.min(history.length, 7);

  return (
    <div className="flex flex-col min-h-full p-4 gap-5 animate-in fade-in zoom-in-95 duration-300">
      <header className="pt-4">
        <h1 className="text-2xl font-bold text-foreground">Nutrio 🌿</h1>
        <p className="text-muted-foreground text-sm mt-0.5">{getGreeting()}</p>
      </header>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-primary/10 border-none shadow-none">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-full text-primary">
              <Camera size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{history.length}</p>
              <p className="text-xs font-medium text-primary/80">
                {history.length === 0 ? "Koi scan nahi" : history.length === 1 ? "Product checked ✅" : "Products checked ✅"}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-orange-500/10 border-none shadow-none">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-orange-500/20 rounded-full text-orange-600">
              <Flame size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">{streakCount}</p>
              <p className="text-xs font-medium text-orange-600/80">Day Streak 🔥</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hero CTA */}
      <section>
        <h2 className="text-base font-semibold mb-3 text-foreground/80">Kya kar sakte ho? ⚡</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/scan" className="col-span-2">
            <Button size="lg" className="w-full text-base h-14 bg-primary hover:bg-primary/90 font-bold">
              <Camera className="mr-2" /> Barcode Scan Karo
            </Button>
          </Link>
          <Link href="/scan">
            <Button variant="outline" className="w-full h-12 text-sm">
              <Search className="mr-2" size={16} /> Product Dhundo
            </Button>
          </Link>
          <Link href="/fruits-veggies">
            <Button variant="outline" className="w-full h-12 text-sm">
              <Leaf className="mr-2 text-green-600" size={16} /> Sabzi Mandi 🥦
            </Button>
          </Link>
          <Link href="/ghar-ka-khana" className="col-span-2">
            <Button variant="outline" className="w-full h-14 border-primary/20 bg-primary/5 hover:bg-primary/10 text-sm font-medium">
              <Utensils className="mr-2 text-primary" size={16} /> Ghar Ka Khana Analyze Karo 🍲
            </Button>
          </Link>
        </div>
      </section>

      {/* Recent Scans */}
      <section className="flex-1 pb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold">Abhi Dekhe 👀</h2>
          {history.length > 0 && (
            <Link href="/history" className="text-sm text-primary font-medium">Sab dekho →</Link>
          )}
        </div>

        <div className="space-y-2.5">
          {recentScans.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="p-6 text-center text-muted-foreground">
                <Zap size={28} className="mx-auto mb-2 opacity-40" />
                <p className="font-medium">Koi scan nahi kiya abhi tak!</p>
                <p className="text-sm mt-1 opacity-70">Barcode scan karo — 2 seconds mein result!</p>
              </CardContent>
            </Card>
          ) : (
            recentScans.map((scan, i) => (
              <motion.div
                key={scan.barcode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={`/product/${scan.barcode}`}>
                  <Card className="hover-elevate cursor-pointer active:scale-[0.98] transition-all">
                    <CardContent className="p-3 flex items-center gap-3">
                      <div className="w-12 h-12 bg-muted rounded-md flex-shrink-0 overflow-hidden">
                        {scan.imageUrl ? (
                          <img src={scan.imageUrl} alt={scan.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">🛒</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate text-sm">{scan.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{scan.brand || "Unknown Brand"}</p>
                      </div>
                      <NutriScore score={scan.nutriScore} size="sm" />
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
