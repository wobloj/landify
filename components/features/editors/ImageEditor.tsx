"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useChanges } from "@/context/ChangesContext";
import { ImagesSectionType } from "@/lib/types/types";
import { Label } from "@radix-ui/react-label";
import { ChevronLeft, Loader2, X, GripVertical } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FileInput } from "../DragAndDropFiles";

const MAX_FILES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

type ImageItem = {
  id: string;
  url: string;
  order: number;
};

function SortableImageItem({
  image,
  onRemove,
}: {
  image: ImageItem;
  onRemove: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group bg-background border rounded-md overflow-hidden"
    >
      <div className="aspect-video relative">
        <Image
          src={image.url}
          alt="Uploaded image"
          fill
          className="object-cover"
        />
      </div>

      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        <button
          {...attributes}
          {...listeners}
          className="p-2 bg-white/20 hover:bg-white/30 rounded cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-5 h-5 text-white" />
        </button>

        <button
          onClick={() => onRemove(image.id)}
          className="p-2 bg-red-500/80 hover:bg-red-600 rounded cursor-pointer"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
}

export function ImagesEditor({
  imageData,
  onClick,
}: {
  imageData: ImagesSectionType;
  onClick: () => void;
}) {
  const { updateSection } = useChanges();
  const [images, setImages] = useState<ImageItem[]>(
    imageData.data_json.images || [],
  );
  const [uploading, setUploading] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(0); // ✅ Klucz do resetowania FileInput
  const supabase = createClient();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Załaduj obrazy z bazy tylko przy montowaniu komponentu
  useEffect(() => {
    if (imageData.data_json.images && imageData.data_json.images.length > 0) {
      setImages(imageData.data_json.images);
    }
  }, []); // ✅ Pusta tablica - tylko przy montowaniu

  // Aktualizuj context gdy zmienia się kolejność obrazów (ale nie przy pierwszym renderze)
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    updateSection("images", {
      data_json: {
        ...imageData.data_json,
        images: images,
      },
    });
  }, [images]); // ✅ Reaguje na zmiany images, ale pomija pierwszy render

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setImages((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newOrder = arrayMove(items, oldIndex, newIndex);

        // Aktualizuj order w każdym elemencie
        return newOrder.map((item, index) => ({
          ...item,
          order: index,
        }));
      });
    }
  };

  // ✅ NAPRAWIONA FUNKCJA - resetuje FileInput po uploadzle
  const handleFilesChange = async (files: File[]) => {
    if (files.length === 0) return;

    console.log(
      "📥 Otrzymane pliki:",
      files.length,
      files.map((f) => f.name),
    );

    setUploading(true);

    try {
      const uploadedImages: ImageItem[] = [];

      for (const file of files) {
        console.log("⬆️ Uploading:", file.name);

        // Generuj unikalną nazwę pliku
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `images/${fileName}`;

        // Upload do Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from("images")
          .upload(filePath, file);

        if (uploadError) {
          console.error("❌ Upload error:", uploadError);
          continue;
        }

        // Pobierz publiczny URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("images").getPublicUrl(filePath);

        uploadedImages.push({
          id: fileName,
          url: publicUrl,
          order: 0,
        });

        console.log("✅ Uploaded:", fileName);
      }

      console.log("📊 Uploaded images array:", uploadedImages.length);

      if (uploadedImages.length > 0) {
        // ✅ Funkcyjna forma setState
        setImages((currentImages) => {
          console.log("🔄 Current images:", currentImages.length);
          const newImages = uploadedImages.map((img, idx) => ({
            ...img,
            order: currentImages.length + idx,
          }));
          console.log(
            "➕ Adding:",
            newImages.length,
            "Total will be:",
            currentImages.length + newImages.length,
          );
          return [...currentImages, ...newImages];
        });

        // ✅ KLUCZOWE: Resetuj FileInput poprzez zmianę key
        setFileInputKey((prev) => prev + 1);
      }
    } catch (err: unknown) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  // ✅ NAPRAWIONA FUNKCJA - używa funkcyjnej formy setState
  const handleRemoveImage = async (imageId: string) => {
    try {
      // Usuń z Supabase Storage
      const { error } = await supabase.storage
        .from("images")
        .remove([`images/${imageId}`]);

      if (error) {
        console.error("Error removing from storage:", error);
      }

      // ✅ Funkcyjna forma setState
      setImages((currentImages) =>
        currentImages
          .filter((img) => img.id !== imageId)
          .map((img, index) => ({ ...img, order: index })),
      );
    } catch (err) {
      console.error("Error removing image:", err);
    }
  };

  return (
    <div className="animate-in slide-in-from-right-8 flex flex-col gap-4">
      <Button
        className="mb-6 font-semibold text-sm self-start"
        variant="ghost"
        onClick={onClick}
      >
        <ChevronLeft className="w-4 h-4" />
        Edycja: Images
      </Button>

      <div className="space-y-4 p-4 bg-background rounded-md">
        <Label>Tytuł</Label>
        <Input
          defaultValue={imageData.title}
          onChange={(e) => updateSection("images", { title: e.target.value })}
        />

        <Label>Opis</Label>
        <Textarea
          defaultValue={imageData.data_json.desc}
          onChange={(e) =>
            updateSection("images", {
              data_json: {
                ...imageData.data_json,
                desc: e.target.value,
              },
            })
          }
        />
      </div>

      <div className="space-y-4 p-4 bg-background rounded-md">
        <div className="grid w-full items-center gap-3">
          <Label htmlFor="picture">
            Obrazy ({images.length}/{MAX_FILES})
          </Label>

          {uploading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              Przesyłanie obrazów...
            </div>
          )}

          <FileInput
            key={fileInputKey} // ✅ Wymusza re-render i reset wewnętrznego state
            accept="image/jpeg,image/jpg,.jpg,.jpeg"
            maxFiles={MAX_FILES - images.length}
            maxSize={MAX_FILE_SIZE}
            disabled={uploading || images.length >= MAX_FILES}
            onChange={handleFilesChange}
            showPreview={false}
            variant="compact"
          />
        </div>

        {images.length > 0 && (
          <div className="mt-4">
            <Label className="mb-2 block">
              Przeciągnij aby zmienić kolejność
            </Label>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={images.map((img) => img.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="grid grid-cols-2 gap-2">
                  {images.map((image) => (
                    <SortableImageItem
                      key={image.id}
                      image={image}
                      onRemove={handleRemoveImage}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )}
      </div>
    </div>
  );
}
