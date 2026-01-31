"use client";

import { useEffect, useState } from "react";

const sections = ["home", "about", "how", "faq"];

export default function DotNavigation() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { threshold: 0.6 },
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-50">
      {sections.map((id) => (
        <div className="flex flex-row items-center justify-end gap-2" key={id}>
          <p
            className={`text-sm font-semibold ${
              active === id ? "block" : "hidden"
            }`}
          >
            {id.toString().toUpperCase()}
          </p>
          <button
            onClick={() =>
              document
                .getElementById(id)
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className={`w-3 h-3 rounded-full transition hover:outline-2
            ${active === id ? "bg-primary scale-125" : "bg-secondary"}
          `}
          />
        </div>
      ))}
    </nav>
  );
}
