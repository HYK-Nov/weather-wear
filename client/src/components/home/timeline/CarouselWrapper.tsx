import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useWeatherCarouselStore } from "@/stores/carouselStore.ts";

export default function CarouselWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setCurIndex, setCurDateKey } = useWeatherCarouselStore();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollSnapCount, setScrollSnapCount] = useState(0);

  const itemsPerSlide = 10;

  // ✅ 날짜와 인덱스 동시 업데이트
  const updateState = () => {
    if (!emblaApi) return;

    const index = emblaApi.selectedScrollSnap();
    setCurrentIndex(index);
    setCurIndex(index); // 전역 상태도 갱신

    const selectedSlide = emblaApi.slideNodes()[index];
    const dateKey = selectedSlide?.getAttribute("data-date") ?? "";
    setCurDateKey(dateKey);

    setScrollSnapCount(emblaApi.scrollSnapList().length);
  };

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", updateState);
    updateState(); // 초기값 세팅

    return () => {
      emblaApi?.off("select", updateState);
    };
  }, [emblaApi]);

  const scrollNext = () => {
    if (emblaApi) {
      const newIndex = Math.min(
        currentIndex + itemsPerSlide,
        emblaApi.scrollSnapList().length - 1,
      );
      emblaApi.scrollTo(newIndex);
    }
  };

  const scrollPrev = () => {
    if (emblaApi) {
      const newIndex = Math.max(currentIndex - itemsPerSlide, 0);
      emblaApi.scrollTo(newIndex);
    }
  };

  return (
    <div className="relative w-full">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">{children}</div>
      </div>

      {/* Prev */}
      {currentIndex > 0 && (
        <button
          onClick={scrollPrev}
          className="bg-background/70 absolute top-1/2 left-0 -translate-y-1/2 rounded-full border p-1 text-neutral-500"
        >
          <ChevronLeft />
        </button>
      )}

      {/* Next */}
      {currentIndex < scrollSnapCount - 1 && (
        <button
          onClick={scrollNext}
          className="bg-background/70 absolute top-1/2 right-0 -translate-y-1/2 rounded-full border p-1 text-neutral-500"
        >
          <ChevronRight />
        </button>
      )}
    </div>
  );
}
