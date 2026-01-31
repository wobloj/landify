"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import Plans from "./Plans";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import { updateDisplayName } from "@/app/start/actions";

export default function FirstRegister() {
  const [step, setStep] = useState<1 | 2>(1);
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const handleNext = async () => {
    if (!displayName.trim()) {
      alert("Wprowadź swoją nazwę");
      return;
    }

    setSaving(true);
    try {
      await updateDisplayName(displayName);
      setStep(2);
    } catch (error) {
      console.error("Error updating display name:", error);
      alert("Wystąpił błąd podczas zapisywania nazwy");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative overflow-hidden h-full w-full">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step-1"
            initial={{ x: "-100%" }}
            animate={{ x: "0" }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="absolute inset-0 flex flex-col gap-10 justify-center items-center px-10"
          >
            <p className="text-4xl font-semibold text-center max-w-3xl">
              Hej! Zanim zaczniemy, wprowadź swoją nazwę, a następnie wybierz
              plan który Cię interesuje.
            </p>
            <div className="w-full max-w-md">
              <Input
                type="text"
                placeholder="Twoja nazwa"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                disabled={saving}
                className="text-center text-lg py-6"
              />
            </div>
            <Button
              className="w-36 cursor-pointer"
              onClick={handleNext}
              disabled={saving || !displayName.trim()}
            >
              {saving ? (
                "Zapisywanie..."
              ) : (
                <>
                  Dalej
                  <ArrowRight />
                </>
              )}
            </Button>
          </motion.div>
        )}
        {step === 2 && (
          <motion.div
            key="step-2"
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center overflow-y-auto py-10"
          >
            <Plans />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
