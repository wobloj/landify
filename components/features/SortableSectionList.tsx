"use client";

import { useEffect, useState } from "react";
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
import { saveSectionOrder, deleteSection } from "@/app/admin/action";
import { useSectionSelection } from "@/context/SectionSelectionContext";

type SectionItem = {
  section_type: string;
  sort_order?: number;
  is_deleted?: boolean;
};

interface SortableSectionListProps {
  initialSections: SectionItem[];
  setEditingSection: (name: string) => void;
}

export default function SortableSectionList({
  initialSections,
  setEditingSection,
}: SortableSectionListProps) {
  // ⬇️ filtrujemy tylko widoczne sekcje
  const [sections, setSections] = useState<SectionItem[]>([]);
  const { setSelectedSection } = useSectionSelection();

  const handleSectionClick = (sectionType: string) => {
    // WAŻNE: Używamy shouldScroll=true aby przewinąć do sekcji
    setSelectedSection(sectionType as any, true); // true = scroll to section
  };

  useEffect(() => {
    setSections(initialSections.filter((s) => !s.is_deleted));
  }, [initialSections]);

  const sensors = useSensors(useSensor(PointerSensor));

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sections.findIndex((s) => s.section_type === active.id);
    const newIndex = sections.findIndex((s) => s.section_type === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const newOrder = arrayMove(sections, oldIndex, newIndex);
    setSections(newOrder);

    // backend nadal operuje na section_type
    const order = newOrder.map((s) => s.section_type);
    const result = await saveSectionOrder(order);

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
      <SortableContext
        items={sections.map((s) => s.section_type)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col">
          {sections.map((section) => (
            <SortableRow
              key={section.section_type}
              id={section.section_type}
              label={section.section_type}
              onEdit={() => {
                setEditingSection(section.section_type);
                handleSectionClick(section.section_type);
              }}
              onHide={async () => {
                await deleteSection(section.section_type);

                // 🔁 natychmiastowa synchronizacja UI
                setSections((prev) =>
                  prev.filter((s) => s.section_type !== section.section_type)
                );
              }}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

/* ───────────────────────────── */

function SortableRow({
  id,
  label,
  onEdit,
  onHide,
}: {
  id: string;
  label: string;
  onEdit: () => void;
  onHide: () => void;
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
      {/* Drag */}
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

      {/* Edit */}
      <div
        onClick={onEdit}
        className="
          flex items-center justify-between
          px-3
          cursor-pointer select-none
        "
      >
        <span className="font-semibold text-sm">{label.toUpperCase()}</span>

        <Edit
          className="
            w-4 h-4 text-muted-foreground
            opacity-0 group-hover:opacity-100
            transition-opacity
          "
        />
      </div>

      {/* Hide (soft delete) */}
      <div className="flex items-center justify-center px-3">
        <Trash2
          onClick={onHide}
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
