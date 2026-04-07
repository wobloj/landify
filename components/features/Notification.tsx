import { Info } from "lucide-react";

export default function Notification({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="top-0 left-0 absolute h-16 w-full text-center flex items-center justify-center gap-2 bg-secondary">
      <Info size={16} />
      {children}
    </div>
  );
}
