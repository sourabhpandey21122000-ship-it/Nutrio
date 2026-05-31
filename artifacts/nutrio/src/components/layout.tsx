import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { HiHome, HiCamera, HiClipboardDocumentList, HiUser } from "react-icons/hi2";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: HiHome, label: "Home" },
    { href: "/scan", icon: HiCamera, label: "Scan" },
    { href: "/history", icon: HiClipboardDocumentList, label: "History" },
    { href: "/profile", icon: HiUser, label: "Profile" },
  ];

  return (
    <div className="min-h-[100dvh] bg-muted/30 pb-16 flex justify-center">
      <main className="w-full max-w-md bg-background shadow-xl min-h-[100dvh] relative">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border flex justify-center">
        <div className="w-full max-w-md flex justify-around items-center h-16 px-4">
          {navItems.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? "scale-110 transition-transform" : ""}`} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}