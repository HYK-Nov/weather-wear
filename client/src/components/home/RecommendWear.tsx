import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Link } from "react-router";
import { useWeatherStore } from "@/stores/weatherStore.ts";
import { useEffect, useState } from "react";
import tempWear from "@/assets/data/tempWear.json";

export default function RecommendWear() {
  const { aprTemp } = useWeatherStore();
  const [wearItems, setWearItems] = useState<{ name: string; url: string }[]>(
    [],
  );
  const [imageLoaded, setImageLoaded] = useState(Array(5).fill(false));

  const getTempWearList = (temp: number) => {
    const ranges = [
      { min: 28, max: Infinity, category: tempWear["0"] },
      { min: 23, max: 28, category: tempWear["1"] },
      { min: 20, max: 23, category: tempWear["2"] },
      { min: 17, max: 20, category: tempWear["3"] },
      { min: 12, max: 17, category: tempWear["4"] },
      { min: 9, max: 12, category: tempWear["5"] },
      { min: 5, max: 9, category: tempWear["6"] },
      { min: -Infinity, max: 5, category: tempWear["7"] },
    ];

    for (const range of ranges) {
      if (temp >= range.min && temp < range.max) {
        return range.category;
      }
    }
    return [];
  };

  useEffect(() => {
    if (!aprTemp) return;

    const result = getTempWearList(aprTemp || 0);

    setWearItems(result);
  }, [aprTemp]);

  return (
    <div className="rounded-lg border p-5">
      <p className="pb-5 text-2xl font-bold">지금 당장 나갈거라면</p>

      <div className="flex gap-5 overflow-x-auto">
        {wearItems
          ? [...Array(5)].map((_, i) => (
              <div key={i} className="relative min-w-[140px] shrink-0">
                {!imageLoaded[i] && <Skeleton className="aspect-5/6 rounded" />}
                {wearItems[i] && (
                  <Link
                    to={`https://www.musinsa.com/search/goods?keyword=${wearItems?.[i].name}`}
                    target="_blank"
                  >
                    <img
                      src={wearItems[i].url}
                      className="aspect-5/6 w-48 rounded object-cover object-center"
                      onLoad={() =>
                        setImageLoaded((prev) => {
                          const updated = [...prev];
                          updated[i] = true;
                          return updated;
                        })
                      }
                    />
                  </Link>
                )}
              </div>
            ))
          : [...Array(5)].map((_, i) => (
              <Skeleton
                key={i}
                className="aspect-5/6 min-w-[140px] shrink-0 rounded"
              />
            ))}
      </div>
    </div>
  );
}
