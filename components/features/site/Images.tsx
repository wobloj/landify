"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SectionConfig, SiteConfig } from "@/lib/types/types";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageIcon } from "lucide-react";

type ImagesProps = {
  section: SectionConfig;
  configSite: SiteConfig;
};

export default function Images({ section, configSite }: ImagesProps) {
  const images = section?.data_json?.images || [];

  // Sortuj obrazy według order
  const sortedImages = [...images].sort((a, b) => a.order - b.order);

  return (
    <section key="images" className="text-center">
      <div className="max-w-4xl mx-auto p-4">
        <h2
          className="text-3xl font-extrabold tracking-tight sm:text-4xl"
          style={{ color: configSite.text_color_primary }}
        >
          {section?.title}
        </h2>
        <p className="mt-2" style={{ color: configSite.text_color_secondary }}>
          {section?.data_json.desc}
        </p>

        <div className="flex flex-col justify-center mt-8">
          {sortedImages.length === 0 ? (
            // Placeholder gdy brak obrazów
            <div className="relative aspect-video w-full rounded-md border-2 border-dashed border-muted-foreground/25 bg-muted/30 overflow-hidden">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8">
                <div className="relative">
                  <ImageIcon
                    className="w-16 h-16 text-muted"
                    strokeWidth={1.5}
                  />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-sm font-medium text-muted">
                    Brak obrazów w galerii
                  </p>
                  <p className="text-xs text-muted/60 max-w-sm">
                    Dodaj obrazy w panelu edycji, aby wypełnić tę sekcję
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Carousel z obrazami
            <Carousel
              opts={{
                align: "center",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {sortedImages.map((image, index) => (
                  <CarouselItem key={image.id} className="basis-full">
                    <div className="p-1">
                      <div className="relative aspect-video w-full">
                        <Image
                          src={image.url}
                          alt={`${section.title} - obraz ${index + 1}`}
                          fill
                          className="rounded-md select-none object-cover"
                          priority={index === 0}
                        />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {sortedImages.length > 1 && (
                <>
                  <CarouselPrevious />
                  <CarouselNext />
                </>
              )}
            </Carousel>
          )}
        </div>
      </div>
    </section>
  );
}
