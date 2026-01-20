"use client";

import { useEffect, useState } from "react";
import { useChanges } from "@/context/ChangesContext";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export function AutoSaveCountdown() {
  const { hasChanges, isSaving } = useChanges();
  const [timeLeft, setTimeLeft] = useState(300); // 5 minut w sekundach

  useEffect(() => {
    if (!hasChanges || isSaving) {
      setTimeLeft(300);
      return;
    }

    // Reset countdown przy nowych zmianach
    setTimeLeft(300);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [hasChanges, isSaving]);

  if (!hasChanges || isSaving) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // Zmień kolor w zależności od pozostałego czasu
  const isUrgent = timeLeft < 60; // Ostatnia minuta
  const isWarning = timeLeft < 120 && timeLeft >= 60; // 1-2 minuty

  return (
    <div
      className={cn(
        "flex items-center gap-2 text-xs transition-colors",
        isUrgent && "text-destructive animate-pulse",
        isWarning && "text-orange-500",
        !isUrgent && !isWarning && "text-muted-foreground"
      )}
    >
      <Clock className="h-3 w-3" />
      <span>
        Auto-save za {minutes}:{seconds.toString().padStart(2, "0")}
      </span>
    </div>
  );
}
