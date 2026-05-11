import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";

type BIPEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

export function InstallPrompt() {
  const [evt, setEvt] = useState<BIPEvent | null>(null);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setEvt(e as BIPEvent);
      setHidden(false);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (hidden || !evt) return null;
  return (
    <div className="glass fixed bottom-4 left-4 right-4 z-50 mx-auto flex max-w-md items-center gap-3 rounded-2xl p-3 raised">
      <span className="grid size-10 place-items-center rounded-xl gradient-warm">
        <Download className="size-4 text-primary-foreground" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">Install Catalog</p>
        <p className="text-xs text-muted-foreground">Add to your home screen for instant access.</p>
      </div>
      <Button
        size="sm"
        onClick={async () => {
          await evt.prompt();
          await evt.userChoice;
          setHidden(true);
        }}
      >
        Install
      </Button>
      <Button variant="ghost" size="icon" aria-label="Dismiss" onClick={() => setHidden(true)}>
        <X className="size-4" />
      </Button>
    </div>
  );
}
