"use client";

import { useState } from "react";
import AuthForm from "../forms/auth-form";
import RegisterForm from "../forms/register-form";
import { Button } from "../ui/button";
import { AnimatePresence, motion } from "framer-motion";

export default function AuthPage() {
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  const contentVariants = {
    hidden: {
      opacity: 0,
      scale: 0,
      transition: { duration: 0.35 },
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.35 },
    },
  };

  const changeMode = () => {
    setAuthMode((prev) => (prev === "login" ? "register" : "login"));
  };

  return (
    <div className="relative h-screen w-screen flex overflow-hidden">
      {/* Panel animowany */}
      <motion.div
        className="absolute top-0 left-0 w-1/2 h-full bg-secondary flex justify-center items-center"
        animate={{
          x: authMode === "login" ? "0%" : "100%",
        }}
        transition={{
          duration: 0.6,
          ease: "easeInOut",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={authMode}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="flex flex-col gap-8 items-center text-center px-10"
          >
            <p className="text-5xl mb-8 font-semibold">Witaj w Landify</p>

            <p className="text-sm max-w-md mb-5">
              {authMode === "login"
                ? "Zaloguj się by uzyskać dostęp do panelu administracyjnego, w którym możesz zarządzać Twoimi landing page'ami."
                : "Zarejestruj się by uzyskać dostęp do panelu administracyjnego, w którym możesz zarządzać Twoimi landing page'ami."}
            </p>

            <p>
              lub,{" "}
              {authMode === "login"
                ? "nie masz jeszcze konta?"
                : "masz już konto?"}
            </p>

            <Button onClick={changeMode}>
              {authMode === "login" ? "Zarejestruj się" : "Zaloguj się"}
            </Button>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Rejestracja */}
      <div className="w-1/2 flex flex-col justify-center items-center">
        <p className="text-4xl font-semibold mb-20">Rejestracja</p>
        <RegisterForm />
      </div>

      {/* Logowanie */}
      <div className="w-1/2 flex flex-col justify-center items-center">
        <p className="text-4xl font-semibold mb-20">Logowanie</p>
        <AuthForm />
      </div>
    </div>
  );
}
