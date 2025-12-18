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
    setSections(newOrder);

    const result = await saveSectionOrder(newOrder);
    if (!result?.success) {
      console.error(result?.message);
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={sections} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col">
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

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="
        group
        grid grid-cols-[auto_1fr_auto]
        items-stretch
        mb-2 h-12 last:mb-0
        bg-background border-2 border-accent rounded-md
        hover:border-primary/50
        transition-colors
      "
    >
      <div
        {...attributes}
        {...listeners}
        style={{ touchAction: "none" }}
        onClick={(e) => e.stopPropagation()}
        className="
          flex items-center justify-center
          px-3
          cursor-grab active:cursor-grabbing
        "
      >
        <GripVertical className="w-5 h-5 text-muted-foreground" />
      </div>

      <div
        onClick={() => setEditingSection(label)}
        className="
          flex items-center justify-between
          px-3
          cursor-pointer select-none
        "
      >
        <span className="font-medium text-sm">{label.toUpperCase()}</span>

        <Edit
          className="
          w-4 h-4 text-muted-foreground
          opacity-0 group-hover:opacity-100
          transition-opacity
        "
        />
      </div>

      <div className="flex items-center justify-center px-3">
        <Trash2
          className="
            w-4 h-4 text-muted-foreground
            opacity-0 group-hover:opacity-100
            hover:text-red-300
            transition-opacity cursor-pointer
          "
        />
      </div>
    </div>
  );
}
