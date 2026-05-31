import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Flashlight, ScanLine } from "lucide-react";
import { toast } from "sonner";

export default function Scan() {
  const [, setLocation] = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [torchOn, setTorchOn] = useState(false);
  const [manualBarcode, setManualBarcode] = useState("");
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    let mounted = true;
    const reader = new BrowserMultiFormatReader();
    readerRef.current = reader;

    async function startCamera() {
      try {
        if (!videoRef.current) return;
        
        await reader.decodeFromVideoDevice(
          undefined, 
          videoRef.current,
          (result, err) => {
            if (result && mounted) {
              // Beep sound would be nice here
              toast.success("Barcode found!");
              setLocation(`/product/${result.getText()}`);
            }
          }
        );
      } catch (err) {
        if (mounted) {
          toast.error("Camera permission denied or not available");
        }
      }
    }

    startCamera();

    return () => {
      mounted = false;
      const stream = videoRef.current?.srcObject as MediaStream;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [setLocation]);

  const toggleTorch = async () => {
    try {
      const stream = videoRef.current?.srcObject as MediaStream;
      const track = stream?.getVideoTracks()[0];
      if (track && (track.getCapabilities() as any).torch) {
        await track.applyConstraints({
          advanced: [{ torch: !torchOn } as any]
        });
        setTorchOn(!torchOn);
      } else {
        toast.error("Flashlight not supported on this device");
      }
    } catch (e) {
      toast.error("Failed to toggle flashlight");
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualBarcode.trim()) {
      setLocation(`/product/${manualBarcode.trim()}`);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black text-white relative">
      <div className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent">
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={() => setLocation("/")}>
          <ArrowLeft />
        </Button>
        <Button variant="ghost" size="icon" className={`text-white hover:bg-white/20 ${torchOn ? 'text-primary' : ''}`} onClick={toggleTorch}>
          <Flashlight />
        </Button>
      </div>

      <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-zinc-900">
        <video 
          ref={videoRef} 
          className="absolute inset-0 w-full h-full object-cover"
          playsInline 
          muted
        />
        
        {/* Scanner overlay frame */}
        <div className="relative z-10 w-64 h-48 border-2 border-primary/50 rounded-lg">
          <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-primary rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-primary rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-primary rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-primary rounded-br-lg" />
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-0.5 bg-primary/80 animate-scan" />
          </div>
        </div>
      </div>

      <div className="bg-zinc-950 p-6 rounded-t-2xl z-10 -mt-4 relative">
        <p className="text-center text-zinc-400 text-sm mb-4">
          Point camera at a barcode to scan automatically
        </p>
        
        <form onSubmit={handleManualSubmit} className="flex gap-2">
          <Input 
            type="text" 
            placeholder="Or enter barcode manually" 
            value={manualBarcode}
            onChange={(e) => setManualBarcode(e.target.value)}
            className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 h-12"
          />
          <Button type="submit" size="icon" className="h-12 w-12 bg-primary hover:bg-primary/90 text-primary-foreground">
            <ScanLine />
          </Button>
        </form>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { transform: translateY(-90px); }
          50% { transform: translateY(90px); }
          100% { transform: translateY(-90px); }
        }
        .animate-scan { animation: scan 3s ease-in-out infinite; }
      `}} />
    </div>
  );
}