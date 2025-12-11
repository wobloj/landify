"use client";

import { useState } from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { GripVertical, Edit, Trash2 } from "lucide-react";
// Zakładam, że ścieżka do akcji jest poprawna po poprzednich poprawkach
import { saveSectionOrder } from "@/app/admin/action";

export default function SortableSectionList({
  initialSections,
  setEditingSection,
}: {
  initialSections: string[];
  setEditingSection: (name: string) => void;
}) {
  const [sections, setSections] = useState(initialSections);

  const sensors = useSensors(useSensor(PointerSensor));

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sections.indexOf(active.id as string);
    const newIndex = sections.indexOf(over.id as string);

    const newOrder = arrayMove(sections, oldIndex, newIndex);

    // 1. OPTIMISTIC UI: Zmień stan lokalnie
    setSections(newOrder);
    console.log("Nowa kolejność (UI):", newOrder);

    // 2. Zapis na serwerze (SERVER ACTION)
    // ZAWSZE sprawdzaj wynik akcji serwera
    const result = await saveSectionOrder(newOrder);

    if (result.success) {
      console.log("Kolejność sekcji zapisana pomyślnie.");
    } else {
      console.error("Błąd zapisu kolejności sekcji:", result.message);
      // Jeśli zapis się nie powiedzie, możesz cofnąć zmiany (revert state)
      // setSections(sections);
      // LUB po prostu polegać na revalidacji, która przywróci stary stan po odświeżeniu
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      {/* WAŻNE: W SortableContext `items` musi być tablicą unikalnych kluczy (string, number), co jest tu spełnione */}
      <SortableContext items={sections} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2">
          {sections.map((section) => (
            <SortableRow
              key={section}
              id={section}
              label={section}
              setEditingSection={setEditingSection}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortableRow({
  id,
  label,
  setEditingSection,
}: {
  id: string;
  label: string;
  setEditingSection: (name: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  } as React.CSSProperties;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group flex items-center p-3 bg-background border rounded-md shadow-sm hover:border-primary/50 transition-colors"
    >
      <div className="flex items-center gap-3">
        <GripVertical
          {...attributes}
          {...listeners}
          // Dodanie touch action, aby ułatwić działanie na urządzeniach dotykowych
          style={{ touchAction: "none" }}
          className="w-6 h-6 text-muted-foreground outline-0 cursor-grab active:cursor-grabbing"
          onClick={(e) => e.stopPropagation()}
        />
        <div
          className="flex flex-row items-center cursor-pointer w-64"
          onClick={() => setEditingSection(label)}
        >
          <span className="font-medium text-sm w-full">
            {label.toUpperCase()}
          </span>
          <div className="flex gap-2">
            <Edit className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
        <Trash2 className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-red-300 transition-opacity cursor-pointer" />
      </div>
    </div>
  );
}
