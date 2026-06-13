import { import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "wouter";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { DecodeHintType, BarcodeFormat } from "@zxing/library";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { NutriScore } from "@/components/ui/nutri-score";
import { ArrowLeft, Flashlight, ScanLine, Search, X, Keyboard } from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";

interface ProductSummary {
  barcode: string;
  name: string;
  brand?: string;
  category?: string;
  nutriScore: string;
  nutriScorePoints?: number;
  isVeg?: boolean | null;
}

function useSearchProducts(query: string) {
  const [data, setData] = React.useState<ProductSummary[] | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (query.length < 2) { setData(null); return; }
    setIsLoading(true);
    fetch("/products.json")
      .then(r => r.json())
      .then((products: ProductSummary[]) => {
        const q = query.toLowerCase();
        const results = products.filter(p =>
          p.name.toLowerCase().includes(q) ||
          (p.brand && p.brand.toLowerCase().includes(q)) ||
          (p.category && p.category.toLowerCase().includes(q))
        ).slice(0, 8);
        setData(results);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [query]);

  return { data, isLoading };
}

type ScanState = "scanning" | "found" | "error";

export default function Scan() {
  const [, setLocation] = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [torchOn, setTorchOn] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);
  const [scanState, setScanState] = useState<ScanState>("scanning");
  const [manualInput, setManualInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showManual, setShowManual] = useState(false);
  const [mode, setMode] = useState<"barcode" | "name">("barcode");
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const lastScanRef = useRef<string>("");
  const lastScanTimeRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);
  const initialPinchDist = useRef<number | null>(null);
  const initialZoom = useRef<number>(1);
  const currentZoom = useRef<number>(1);

  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const { data: searchResults, isLoading: searching } = useSearchProducts(debouncedSearch);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (readerRef.current) {
      try { BrowserMultiFormatReader.releaseAllStreams(); } catch {}
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.UPC_A,
      BarcodeFormat.UPC_E,
      BarcodeFormat.CODE_128,
      BarcodeFormat.CODE_39,
      BarcodeFormat.QR_CODE,
    ]);
    hints.set(DecodeHintType.TRY_HARDER, true);

    const reader = new BrowserMultiFormatReader(hints, {
      delayBetweenScanAttempts: 300,
      delayBetweenScanSuccess: 1000,
    });
    readerRef.current = reader;

    async function startCamera() {
      try {
        if (!videoRef.current) return;

        const constraints: MediaStreamConstraints = {
          video: {
            facingMode: "environment",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (!mounted) { stream.getTracks().forEach((t) => t.stop()); return; }

        streamRef.current = stream;
        videoRef.current.srcObject = stream;
        await videoRef.current.play();

        const track = stream.getVideoTracks()[0];
        const caps = track?.getCapabilities() as MediaTrackCapabilities & { torch?: boolean };
        if (caps?.torch) setTorchSupported(true);

        setupPinchZoom(track);

        reader.decodeFromStream(stream, videoRef.current, (result, err) => {
          if (!mounted) return;
          if (result) {
            const barcode = result.getText();
            const now = Date.now();
            if (barcode === lastScanRef.current && now - lastScanTimeRef.current < 3000) return;

            lastScanRef.current = barcode;
            lastScanTimeRef.current = now;
            setScanState("found");

            try {
              const ctx = new AudioContext();
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.frequency.value = 880;
              gain.gain.setValueAtTime(0.3, ctx.currentTime);
              gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
              osc.start(ctx.currentTime);
              osc.stop(ctx.currentTime + 0.15);
            } catch {}

            setTimeout(() => {
              if (mounted) {
                stopCamera();
                setLocation(`/product/${barcode}`);
              }
            }, 300);
          }
        });
      } catch (err: unknown) {
        if (!mounted) return;
        const msg = err instanceof Error ? err.message : "Camera error";
        if (msg.includes("Permission") || msg.includes("denied")) {
          setScanState("error");
          toast.error("Camera permission denied. Use manual search.");
        } else {
          setScanState("error");
          toast.error("Camera not available.");
        }
        setShowManual(true);
      }
    }

    if (mode === "barcode") startCamera();

    return () => {
      mounted = false;
      stopCamera();
    };
  }, [setLocation, stopCamera, mode]);

  function setupPinchZoom(track: MediaStreamTrack | undefined) {
    if (!track || !videoRef.current) return;
    const el = videoRef.current;

    el.addEventListener("touchstart", (e) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        initialPinchDist.current = Math.sqrt(dx * dx + dy * dy);
        initialZoom.current = currentZoom.current;
      }
    }, { passive: true });

    el.addEventListener("touchmove", async (e) => {
      if (e.touches.length === 2 && initialPinchDist.current) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const scale = dist / initialPinchDist.current;
        const caps = track.getCapabilities() as MediaTrackCapabilities & { zoom?: { min: number; max: number; step: number } };
        if (caps.zoom) {
          const newZoom = Math.min(caps.zoom.max, Math.max(caps.zoom.min, initialZoom.current * scale));
          currentZoom.current = newZoom;
          try { await track.applyConstraints({ advanced: [{ zoom: newZoom } as MediaTrackConstraintSet] }); } catch {}
        }
      }
    }, { passive: true });
  }

  const toggleTorch = async () => {
    try {
      const track = streamRef.current?.getVideoTracks()[0];
      if (!track) return;
      const newVal = !torchOn;
      await track.applyConstraints({ advanced: [{ torch: newVal } as MediaTrackConstraintSet] });
      setTorchOn(newVal);
    } catch {
      toast.error("Torch supported nahi hai is device par");
    }
  };

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = manualInput.trim();
    if (!v) return;
    if (/^\d{8,13}$/.test(v)) {
      stopCamera();
      setLocation(`/product/${v}`);
    } else {
      toast.error("Valid barcode enter karo (8-13 digits)");
    }
  };

  return (
    <div className="flex flex-col h-full bg-black text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 z-20 p-3 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <Button
          variant="ghost" size="icon"
          className="text-white hover:bg-white/20 rounded-full"
          onClick={() => { stopCamera(); setLocation("/"); }}
        >
          <ArrowLeft />
        </Button>

        <div className="flex items-center gap-2">
          <div className="flex bg-black/40 backdrop-blur-sm rounded-full p-1 text-xs gap-1">
            <button
              onClick={() => setMode("barcode")}
              className={`px-3 py-1 rounded-full transition-all ${mode === "barcode" ? "bg-primary text-white" : "text-white/70"}`}
            >
              📷 Scan
            </button>
            <button
              onClick={() => setMode("name")}
              className={`px-3 py-1 rounded-full transition-all ${mode === "name" ? "bg-primary text-white" : "text-white/70"}`}
            >
              🔍 Search
            </button>
          </div>

          {torchSupported && mode === "barcode" && (
            <Button
              variant="ghost" size="icon"
              className={`text-white hover:bg-white/20 rounded-full ${torchOn ? "text-yellow-400" : ""}`}
              onClick={toggleTorch}
            >
              <Flashlight size={20} />
            </Button>
          )}
        </div>
      </div>

      {mode === "barcode" ? (
        <>
          <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-zinc-950">
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              playsInline muted autoPlay
            />
            <div className="absolute inset-0 z-10 pointer-events-none">
              <div className="absolute inset-0 bg-black/45" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-52 bg-transparent"
                style={{ boxShadow: "0 0 0 2000px rgba(0,0,0,0.45)" }} />
            </div>

            <div className={`relative z-20 w-72 h-52 transition-all duration-300 ${scanState === "found" ? "scale-105" : ""}`}>
              <div className={`absolute top-0 left-0 w-6 h-6 transition-colors ${scanState === "found" ? "border-green-400" : "border-primary"}`} style={{ borderTopWidth: 3, borderLeftWidth: 3 }} />
              <div className={`absolute top-0 right-0 w-6 h-6 transition-colors ${scanState === "found" ? "border-green-400" : "border-primary"}`} style={{ borderTopWidth: 3, borderRightWidth: 3 }} />
              <div className={`absolute bottom-0 left-0 w-6 h-6 transition-colors ${scanState === "found" ? "border-green-400" : "border-primary"}`} style={{ borderBottomWidth: 3, borderLeftWidth: 3 }} />
              <div className={`absolute bottom-0 right-0 w-6 h-6 transition-colors ${scanState === "found" ? "border-green-400" : "border-primary"}`} style={{ borderBottomWidth: 3, borderRightWidth: 3 }} />

              {scanState === "scanning" && (
                <div className="absolute inset-0 overflow-hidden">
                  <div className="w-full h-0.5 bg-primary/90 shadow-[0_0_8px_2px_rgba(34,197,94,0.5)] animate-scan" />
                </div>
              )}
              {scanState === "found" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-green-500/90 rounded-full p-3 animate-bounce">
                    <ScanLine size={28} className="text-white" />
                  </div>
                </div>
              )}
            </div>

            <p className="absolute bottom-4 left-0 right-0 text-center z-20 text-white/50 text-xs">
              📍 Pinch to zoom • Auto-scans continuously
            </p>
          </div>

          <div className="bg-zinc-950 px-5 pt-5 pb-6 rounded-t-3xl z-10 -mt-5 relative space-y-4">
            <div className="w-12 h-1 bg-zinc-700 rounded-full mx-auto" />
            <div className="text-center space-y-1">
              <p className="text-white font-semibold text-sm">
                {scanState === "found" ? "✅ Barcode Mila! Redirect ho raha hai..." :
                 scanState === "error" ? "⚠️ Camera nahi mili — manual try karo" :
                 "📦 Product ka barcode frame mein rakh do"}
              </p>
              <p className="text-zinc-500 text-xs">EAN-13 • UPC • QR supported</p>
            </div>

            <div>
              <button
                onClick={() => setShowManual((v) => !v)}
                className="flex items-center gap-2 text-zinc-400 text-xs mb-3"
              >
                <Keyboard size={13} />
                Barcode manually type karo
              </button>
              {showManual && (
                <form onSubmit={handleBarcodeSubmit} className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="8901234567890 (EAN-13)"
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-600 h-12 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <Button type="submit" className="h-12 px-4 bg-primary">
                    <ScanLine size={18} />
                  </Button>
                </form>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 bg-zinc-950 pt-20 px-4 overflow-auto">
          <div className="space-y-4">
            <div>
              <h2 className="text-white text-lg font-bold mb-1">Product Search 🔍</h2>
              <p className="text-zinc-400 text-xs mb-3">Product ka naam ya brand type karo</p>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <Input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Maggi, Amul, Dahi..."
                  className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 h-12 pl-9 pr-10"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {searching && (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-zinc-900 rounded-xl animate-pulse" />
                ))}
              </div>
            )}

            {!searching && searchResults && searchResults.length === 0 && debouncedSearch.length >= 2 && (
              <div className="text-center py-8 text-zinc-500">
                <p className="text-2xl mb-2">😕</p>
                <p className="text-sm">"{debouncedSearch}" nahi mila</p>
                <p className="text-xs mt-1">Barcode scan karo ya dusra naam try karo</p>
              </div>
            )}

            {searchResults && searchResults.length > 0 && (
              <div className="space-y-2">
                <p className="text-zinc-400 text-xs">{searchResults.length} results mile</p>
                {searchResults.map((product) => (
                  <Link key={product.barcode} href={`/product/${product.barcode}`} onClick={stopCamera}>
                    <Card className="bg-zinc-900 border-zinc-700 hover:border-primary/50 cursor-pointer active:scale-[0.98] transition-all mb-2">
                      <CardContent className="p-3 flex items-center gap-3">
                        <NutriScore score={product.nutriScore} points={product.nutriScorePoints} size="md" showPoints />
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium text-sm truncate">{product.name}</p>
                          <p className="text-zinc-400 text-xs truncate">{product.brand || product.category || "—"}</p>
                        </div>
                        {product.isVeg !== undefined && product.isVeg !== null && (
                          <div className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center ${product.isVeg ? "border-green-500" : "border-red-500"}`}>
                            <div className={`w-2 h-2 rounded-full ${product.isVeg ? "bg-green-500" : "bg-red-500"}`} />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}

            {debouncedSearch.length < 2 && (
              <div className="text-center py-12 text-zinc-600">
                <Search size={40} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">Naam type karna shuru karo...</p>
                <p className="text-xs mt-1">Minimum 2 characters chahiye</p>
              </div>
            )}
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0% { transform: translateY(-100px); }
          50% { transform: translateY(100px); }
          100% { transform: translateY(-100px); }
        }
        .animate-scan { animation: scan 2.5s ease-in-out infinite; }
      `}} />
    </div>
  );
}, useRef, useState, useCallback } from "react";
import { useLocation } from "wouter";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { DecodeHintType, BarcodeFormat } from "@zxing/library";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { NutriScore } from "@/components/ui/nutri-score";
import { ArrowLeft, Flashlight, ScanLine, Search, X, Keyboard } from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";

interface ProductSummary {
  barcode: string;
  name: string;
  brand?: string;
  category?: string;
  nutriScore: string;
  nutriScorePoints?: number;
  isVeg?: boolean | null;
}

function useSearchProducts(query: string) {
  const [data, setData] = React.useState<ProductSummary[] | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (query.length < 2) { setData(null); return; }
    setIsLoading(true);
    fetch("/products.json")
      .then(r => r.json())
      .then((products: ProductSummary[]) => {
        const q = query.toLowerCase();
        const results = products.filter(p =>
          p.name.toLowerCase().includes(q) ||
          (p.brand && p.brand.toLowerCase().includes(q)) ||
          (p.category && p.category.toLowerCase().includes(q))
        ).slice(0, 8);
        setData(results);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [query]);

  return { data, isLoading };
}

type ScanState = "scanning" | "found" | "error";

export default function Scan() {
  const [, setLocation] = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [torchOn, setTorchOn] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);
  const [scanState, setScanState] = useState<ScanState>("scanning");
  const [manualInput, setManualInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showManual, setShowManual] = useState(false);
  const [mode, setMode] = useState<"barcode" | "name">("barcode");
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const lastScanRef = useRef<string>("");
  const lastScanTimeRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);
  const initialPinchDist = useRef<number | null>(null);
  const initialZoom = useRef<number>(1);
  const currentZoom = useRef<number>(1);

  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const { data: searchResults, isLoading: searching } = useSearchProducts(debouncedSearch);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (readerRef.current) {
      try { BrowserMultiFormatReader.releaseAllStreams(); } catch {}
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.UPC_A,
      BarcodeFormat.UPC_E,
      BarcodeFormat.CODE_128,
      BarcodeFormat.CODE_39,
      BarcodeFormat.QR_CODE,
    ]);
    hints.set(DecodeHintType.TRY_HARDER, true);

    const reader = new BrowserMultiFormatReader(hints, {
      delayBetweenScanAttempts: 300,
      delayBetweenScanSuccess: 1000,
    });
    readerRef.current = reader;

    async function startCamera() {
      try {
        if (!videoRef.current) return;

        const constraints: MediaStreamConstraints = {
          video: {
            facingMode: "environment",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (!mounted) { stream.getTracks().forEach((t) => t.stop()); return; }

        streamRef.current = stream;
        videoRef.current.srcObject = stream;
        await videoRef.current.play();

        const track = stream.getVideoTracks()[0];
        const caps = track?.getCapabilities() as MediaTrackCapabilities & { torch?: boolean };
        if (caps?.torch) setTorchSupported(true);

        setupPinchZoom(track);

        reader.decodeFromStream(stream, videoRef.current, (result, err) => {
          if (!mounted) return;
          if (result) {
            const barcode = result.getText();
            const now = Date.now();
            if (barcode === lastScanRef.current && now - lastScanTimeRef.current < 3000) return;

            lastScanRef.current = barcode;
            lastScanTimeRef.current = now;
            setScanState("found");

            try {
              const ctx = new AudioContext();
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.frequency.value = 880;
              gain.gain.setValueAtTime(0.3, ctx.currentTime);
              gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
              osc.start(ctx.currentTime);
              osc.stop(ctx.currentTime + 0.15);
            } catch {}

            setTimeout(() => {
              if (mounted) {
                stopCamera();
                setLocation(`/product/${barcode}`);
              }
            }, 300);
          }
        });
      } catch (err: unknown) {
        if (!mounted) return;
        const msg = err instanceof Error ? err.message : "Camera error";
        if (msg.includes("Permission") || msg.includes("denied")) {
          setScanState("error");
          toast.error("Camera permission denied. Use manual search.");
        } else {
          setScanState("error");
          toast.error("Camera not available.");
        }
        setShowManual(true);
      }
    }

    if (mode === "barcode") startCamera();

    return () => {
      mounted = false;
      stopCamera();
    };
  }, [setLocation, stopCamera, mode]);

  function setupPinchZoom(track: MediaStreamTrack | undefined) {
    if (!track || !videoRef.current) return;
    const el = videoRef.current;

    el.addEventListener("touchstart", (e) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        initialPinchDist.current = Math.sqrt(dx * dx + dy * dy);
        initialZoom.current = currentZoom.current;
      }
    }, { passive: true });

    el.addEventListener("touchmove", async (e) => {
      if (e.touches.length === 2 && initialPinchDist.current) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const scale = dist / initialPinchDist.current;
        const caps = track.getCapabilities() as MediaTrackCapabilities & { zoom?: { min: number; max: number; step: number } };
        if (caps.zoom) {
          const newZoom = Math.min(caps.zoom.max, Math.max(caps.zoom.min, initialZoom.current * scale));
          currentZoom.current = newZoom;
          try { await track.applyConstraints({ advanced: [{ zoom: newZoom } as MediaTrackConstraintSet] }); } catch {}
        }
      }
    }, { passive: true });
  }

  const toggleTorch = async () => {
    try {
      const track = streamRef.current?.getVideoTracks()[0];
      if (!track) return;
      const newVal = !torchOn;
      await track.applyConstraints({ advanced: [{ torch: newVal } as MediaTrackConstraintSet] });
      setTorchOn(newVal);
    } catch {
      toast.error("Torch supported nahi hai is device par");
    }
  };

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = manualInput.trim();
    if (!v) return;
    if (/^\d{8,13}$/.test(v)) {
      stopCamera();
      setLocation(`/product/${v}`);
    } else {
      toast.error("Valid barcode enter karo (8-13 digits)");
    }
  };

  return (
    <div className="flex flex-col h-full bg-black text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 z-20 p-3 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <Button
          variant="ghost" size="icon"
          className="text-white hover:bg-white/20 rounded-full"
          onClick={() => { stopCamera(); setLocation("/"); }}
        >
          <ArrowLeft />
        </Button>

        <div className="flex items-center gap-2">
          <div className="flex bg-black/40 backdrop-blur-sm rounded-full p-1 text-xs gap-1">
            <button
              onClick={() => setMode("barcode")}
              className={`px-3 py-1 rounded-full transition-all ${mode === "barcode" ? "bg-primary text-white" : "text-white/70"}`}
            >
              📷 Scan
            </button>
            <button
              onClick={() => setMode("name")}
              className={`px-3 py-1 rounded-full transition-all ${mode === "name" ? "bg-primary text-white" : "text-white/70"}`}
            >
              🔍 Search
            </button>
          </div>

          {torchSupported && mode === "barcode" && (
            <Button
              variant="ghost" size="icon"
              className={`text-white hover:bg-white/20 rounded-full ${torchOn ? "text-yellow-400" : ""}`}
              onClick={toggleTorch}
            >
              <Flashlight size={20} />
            </Button>
          )}
        </div>
      </div>

      {mode === "barcode" ? (
        <>
          <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-zinc-950">
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              playsInline muted autoPlay
            />
            <div className="absolute inset-0 z-10 pointer-events-none">
              <div className="absolute inset-0 bg-black/45" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-52 bg-transparent"
                style={{ boxShadow: "0 0 0 2000px rgba(0,0,0,0.45)" }} />
            </div>

            <div className={`relative z-20 w-72 h-52 transition-all duration-300 ${scanState === "found" ? "scale-105" : ""}`}>
              <div className={`absolute top-0 left-0 w-6 h-6 transition-colors ${scanState === "found" ? "border-green-400" : "border-primary"}`} style={{ borderTopWidth: 3, borderLeftWidth: 3 }} />
              <div className={`absolute top-0 right-0 w-6 h-6 transition-colors ${scanState === "found" ? "border-green-400" : "border-primary"}`} style={{ borderTopWidth: 3, borderRightWidth: 3 }} />
              <div className={`absolute bottom-0 left-0 w-6 h-6 transition-colors ${scanState === "found" ? "border-green-400" : "border-primary"}`} style={{ borderBottomWidth: 3, borderLeftWidth: 3 }} />
              <div className={`absolute bottom-0 right-0 w-6 h-6 transition-colors ${scanState === "found" ? "border-green-400" : "border-primary"}`} style={{ borderBottomWidth: 3, borderRightWidth: 3 }} />

              {scanState === "scanning" && (
                <div className="absolute inset-0 overflow-hidden">
                  <div className="w-full h-0.5 bg-primary/90 shadow-[0_0_8px_2px_rgba(34,197,94,0.5)] animate-scan" />
                </div>
              )}
              {scanState === "found" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-green-500/90 rounded-full p-3 animate-bounce">
                    <ScanLine size={28} className="text-white" />
                  </div>
                </div>
              )}
            </div>

            <p className="absolute bottom-4 left-0 right-0 text-center z-20 text-white/50 text-xs">
              📍 Pinch to zoom • Auto-scans continuously
            </p>
          </div>

          <div className="bg-zinc-950 px-5 pt-5 pb-6 rounded-t-3xl z-10 -mt-5 relative space-y-4">
            <div className="w-12 h-1 bg-zinc-700 rounded-full mx-auto" />
            <div className="text-center space-y-1">
              <p className="text-white font-semibold text-sm">
                {scanState === "found" ? "✅ Barcode Mila! Redirect ho raha hai..." :
                 scanState === "error" ? "⚠️ Camera nahi mili — manual try karo" :
                 "📦 Product ka barcode frame mein rakh do"}
              </p>
              <p className="text-zinc-500 text-xs">EAN-13 • UPC • QR supported</p>
            </div>

            <div>
              <button
                onClick={() => setShowManual((v) => !v)}
                className="flex items-center gap-2 text-zinc-400 text-xs mb-3"
              >
                <Keyboard size={13} />
                Barcode manually type karo
              </button>
              {showManual && (
                <form onSubmit={handleBarcodeSubmit} className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="8901234567890 (EAN-13)"
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-600 h-12 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <Button type="submit" className="h-12 px-4 bg-primary">
                    <ScanLine size={18} />
                  </Button>
                </form>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 bg-zinc-950 pt-20 px-4 overflow-auto">
          <div className="space-y-4">
            <div>
              <h2 className="text-white text-lg font-bold mb-1">Product Search 🔍</h2>
              <p className="text-zinc-400 text-xs mb-3">Product ka naam ya brand type karo</p>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <Input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Maggi, Amul, Dahi..."
                  className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 h-12 pl-9 pr-10"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {searching && (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-zinc-900 rounded-xl animate-pulse" />
                ))}
              </div>
            )}

            {!searching && searchResults && searchResults.length === 0 && debouncedSearch.length >= 2 && (
              <div className="text-center py-8 text-zinc-500">
                <p className="text-2xl mb-2">😕</p>
                <p className="text-sm">"{debouncedSearch}" nahi mila</p>
                <p className="text-xs mt-1">Barcode scan karo ya dusra naam try karo</p>
              </div>
            )}

            {searchResults && searchResults.length > 0 && (
              <div className="space-y-2">
                <p className="text-zinc-400 text-xs">{searchResults.length} results mile</p>
                {searchResults.map((product) => (
                  <Link key={product.barcode} href={`/product/${product.barcode}`} onClick={stopCamera}>
                    <Card className="bg-zinc-900 border-zinc-700 hover:border-primary/50 cursor-pointer active:scale-[0.98] transition-all mb-2">
                      <CardContent className="p-3 flex items-center gap-3">
                        <NutriScore score={product.nutriScore} points={product.nutriScorePoints} size="md" showPoints />
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium text-sm truncate">{product.name}</p>
                          <p className="text-zinc-400 text-xs truncate">{product.brand || product.category || "—"}</p>
                        </div>
                        {product.isVeg !== undefined && product.isVeg !== null && (
                          <div className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center ${product.isVeg ? "border-green-500" : "border-red-500"}`}>
                            <div className={`w-2 h-2 rounded-full ${product.isVeg ? "bg-green-500" : "bg-red-500"}`} />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}

            {debouncedSearch.length < 2 && (
              <div className="text-center py-12 text-zinc-600">
                <Search size={40} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">Naam type karna shuru karo...</p>
                <p className="text-xs mt-1">Minimum 2 characters chahiye</p>
              </div>
            )}
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0% { transform: translateY(-100px); }
          50% { transform: translateY(100px); }
          100% { transform: translateY(-100px); }
        }
        .animate-scan { animation: scan 2.5s ease-in-out infinite; }
      `}} />
    </div>
  );
}
