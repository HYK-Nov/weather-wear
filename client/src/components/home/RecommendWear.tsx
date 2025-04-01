import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Link } from "react-router";
import { useWeatherStore } from "@/stores/weatherStore.ts";
import { useEffect, useState } from "react";
import tempWear from "@/assets/data/tempWear.json";

export default function RecommendWear() {
  const { weather } = useWeatherStore();
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
    if (!weather) return;

    const temp = Number(
      weather?.find((item) => item.category == "T1H")?.fcstValue,
    );
    const result = getTempWearList(temp || 0);

    setWearItems(result);
  }, [weather]);

  return (
    <div className="rounded-lg border p-5">
      <p className="pb-5 text-xl font-bold">오늘 뭐 입지?</p>

      <div className="grid grid-cols-5 gap-5">
        {weather
          ? [...Array(5)].map((_, i) => (
              <div key={i} className="relative">
                {!imageLoaded[i] && <Skeleton className="aspect-5/6 rounded" />}
                {wearItems[i] && (
                  <Link
                    to={`https://www.musinsa.com/search/goods?keyword=${wearItems?.[i].name}`}
                    target="_blank"
                  >
                    <img
                      src={wearItems[i].url}
                      className="aspect-5/6 rounded object-cover object-center"
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
              <Skeleton key={i} className="aspect-5/6 rounded" />
            ))}
      </div>
    </div>
  );
}
