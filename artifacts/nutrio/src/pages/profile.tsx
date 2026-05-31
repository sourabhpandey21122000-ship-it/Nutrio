import { useHistory } from "@/hooks/useHistory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/components/theme-provider";
import { toast } from "sonner";
import { User, LogIn, Moon, Sun, BarChart2, Leaf, Award } from "lucide-react";
import { NutriScore } from "@/components/ui/nutri-score";

export default function Profile() {
  const { history } = useHistory();
  const { theme, setTheme } = useTheme();

  const isDark = theme === "dark";

  const totalScans = history.length;
  const gradeCount = history.reduce<Record<string, number>>((acc, item) => {
    const g = item.nutriScore.toUpperCase();
    acc[g] = (acc[g] || 0) + 1;
    return acc;
  }, {});

  const topGrade = Object.entries(gradeCount).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
  const healthyCount = (gradeCount["A"] || 0) + (gradeCount["B"] || 0);
  const healthyPct = totalScans > 0 ? Math.round((healthyCount / totalScans) * 100) : 0;

  return (
    <div className="flex flex-col p-4 gap-5 pt-6 pb-8">
      <header>
        <h1 className="text-2xl font-bold">Profile</h1>
      </header>

      {/* User Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-5 flex items-center gap-4">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
            <User size={28} className="text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-lg">Guest User</p>
            <p className="text-sm text-muted-foreground">Login karke history sync karo</p>
          </div>
        </CardContent>
      </Card>

      {/* Firebase Login (placeholder) */}
      <Card>
        <CardContent className="p-4">
          <Button
            data-testid="button-google-login"
            variant="outline"
            className="w-full h-12 gap-3 border-muted"
            onClick={() => toast.info("Coming soon! Firebase config add karo pehle.")}
          >
            <LogIn size={18} className="text-primary" />
            <span className="font-medium">Google se login karo</span>
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Login karoge toh data safe rahega
          </p>
        </CardContent>
      </Card>

      {/* Stats */}
      {totalScans > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart2 size={18} className="text-primary" /> Your Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-muted/50 rounded-xl">
                <p className="text-2xl font-bold text-primary">{totalScans}</p>
                <p className="text-xs text-muted-foreground mt-1">Total Scans</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-xl">
                <p className="text-2xl font-bold text-green-600">{healthyPct}%</p>
                <p className="text-xs text-muted-foreground mt-1">Healthy</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-xl flex flex-col items-center justify-center">
                {topGrade ? <NutriScore score={topGrade} size="sm" /> : <p className="text-2xl font-bold">-</p>}
                <p className="text-xs text-muted-foreground mt-1">Top Grade</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Grade Breakdown</p>
              {["A", "B", "C", "D", "E"].map((grade) => {
                const count = gradeCount[grade] || 0;
                const pct = totalScans > 0 ? (count / totalScans) * 100 : 0;
                const colors: Record<string, string> = { A: "#1a9c3e", B: "#7dc243", C: "#f5c400", D: "#f39200", E: "#e63946" };
                return (
                  <div key={grade} className="flex items-center gap-3">
                    <NutriScore score={grade} size="sm" />
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, backgroundColor: colors[grade] }}
                      />
                    </div>
                    <span className="text-sm font-medium w-6 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Settings</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="dark-mode" className="flex items-center gap-2 cursor-pointer">
              {isDark ? <Moon size={18} /> : <Sun size={18} />}
              <span>Dark Mode</span>
            </Label>
            <Switch
              id="dark-mode"
              data-testid="switch-dark-mode"
              checked={isDark}
              onCheckedChange={(val) => setTheme(val ? "dark" : "light")}
            />
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardContent className="p-4 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-primary">
            <Leaf size={20} />
            <span className="font-bold text-lg">Nutrio</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Apna food scan karo, health jaano
          </p>
          <p className="text-xs text-muted-foreground/60">
            Powered by Open Food Facts + local Indian products database
          </p>
          <p className="text-xs text-muted-foreground/40">v1.0.0</p>
        </CardContent>
      </Card>
    </div>
  );
}
