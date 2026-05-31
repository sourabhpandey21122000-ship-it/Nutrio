import { useParams, useLocation } from "wouter";
import { useGetProductByBarcode, getGetProductByBarcodeQueryKey } from "@workspace/api-client-react";
import { NutriScore } from "@/components/ui/nutri-score";
import { TrafficLight } from "@/components/ui/traffic-light";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, ScanLine, Leaf, Info, AlertTriangle } from "lucide-react";
import { useHistory } from "@/hooks/useHistory";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

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
      toast.success("Saved to history!");
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-muted-foreground font-medium">Scanning database...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-20 h-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-2">
          <AlertTriangle size={32} />
        </div>
        <h2 className="text-2xl font-bold">Product Not Found</h2>
        <p className="text-muted-foreground mb-4">
          Hum is barcode {barcode} ko pehchan nahi paye. Try another one!
        </p>
        <Button onClick={() => setLocation("/scan")} className="w-full max-w-xs">
          Scan Another
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background overflow-auto pb-6">
      {/* Header & Image */}
      <div className="relative bg-muted/30 pt-16 pb-8 px-6 flex flex-col items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-4 left-4 bg-background/50 backdrop-blur-md rounded-full"
          onClick={() => setLocation("/")}
        >
          <ArrowLeft />
        </Button>
        
        <div className="w-40 h-40 bg-card rounded-2xl shadow-sm border p-2 flex items-center justify-center mb-6 overflow-hidden">
          {product.imageUrl ? (
             <img src={product.imageUrl} alt={product.name} className="max-w-full max-h-full object-contain" />
          ) : (
             <span className="text-muted-foreground">No Image</span>
          )}
        </div>

        <h1 className="text-2xl font-bold text-center mb-1">{product.name}</h1>
        <p className="text-muted-foreground text-center mb-4">{product.brand || "Unknown Brand"}</p>

        {/* Big Nutri-Score */}
        <div className="absolute -bottom-10 shadow-xl rounded-full">
          <NutriScore score={product.nutriScore} points={product.nutriScorePoints} size="xl" showPoints />
        </div>
      </div>

      <div className="px-4 pt-12 space-y-6">
        {/* Badges */}
        <div className="flex flex-wrap gap-2 justify-center">
          {product.isVeg !== null && (
            <Badge variant="outline" className={`border-${product.isVeg ? 'green' : 'red'}-500 text-${product.isVeg ? 'green' : 'red'}-600 bg-${product.isVeg ? 'green' : 'red'}-50`}>
              <div className={`w-2 h-2 rounded-full bg-${product.isVeg ? 'green' : 'red'}-600 mr-1.5`} />
              {product.isVeg ? "Veg" : "Non-Veg"}
            </Badge>
          )}
          {product.isVegan && (
            <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50">
              <Leaf size={12} className="mr-1" /> Vegan
            </Badge>
          )}
          {product.isSwadeshi && (
             <Badge variant="outline" className="border-orange-400 text-orange-700 bg-orange-50">
               🇮🇳 Swadeshi
             </Badge>
          )}
          {product.isUltraProcessed && (
             <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-200">
               <AlertTriangle size={12} className="mr-1" /> Ultra-Processed
             </Badge>
          )}
        </div>

        {/* Traffic Lights */}
        <section>
          <h3 className="font-semibold mb-3 flex items-center text-lg">
            <Info size={18} className="mr-2 text-primary" /> 
            Nutrition Highlights (100g)
          </h3>
          <div className="grid grid-cols-1 gap-2">
            <TrafficLight 
              label="Sugars" 
              value={product.nutrition?.sugars ?? null} 
              level={getTrafficLevel(product.nutrition?.sugars, 'sugar')} 
            />
            <TrafficLight 
              label="Fat" 
              value={product.nutrition?.fat ?? null} 
              level={getTrafficLevel(product.nutrition?.fat, 'fat')} 
            />
            <TrafficLight 
              label="Salt" 
              value={product.nutrition?.salt ?? null} 
              level={getTrafficLevel(product.nutrition?.salt, 'salt')} 
            />
            <TrafficLight 
              label="Calories" 
              value={product.nutrition?.calories ?? null} 
              level="medium" 
              unit="kcal"
            />
          </div>
        </section>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t">
          <Button variant="outline" onClick={handleSave} className="h-14 font-medium">
            <Save className="mr-2" size={20} /> Save to History
          </Button>
          <Button onClick={() => setLocation("/scan")} className="h-14 font-medium bg-primary">
            <ScanLine className="mr-2" size={20} /> Scan Another
          </Button>
        </div>
      </div>
    </div>
  );
}

// Simple helper to mimic thresholds
function getTrafficLevel(value: number | undefined | null, type: string) {
  if (value === undefined || value === null) return "medium";
  if (type === 'sugar') return value > 15 ? 'high' : value > 5 ? 'medium' : 'low';
  if (type === 'fat') return value > 20 ? 'high' : value > 3 ? 'medium' : 'low';
  if (type === 'salt') return value > 1.5 ? 'high' : value > 0.3 ? 'medium' : 'low';
  return 'medium';
}