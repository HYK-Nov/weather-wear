import { useLocationStore } from "@/stores/weatherStore.ts";
import { useEffect, useState } from "react";
import { TWeekTemp } from "@/types/weather.ts";
import WeeklyItem from "@/components/home/WeeklyItem.tsx";
import { getMidCode, getNxNy, getRainCode } from "@/features/apiCode.ts";
import { Skeleton } from "@/components/ui/skeleton.tsx";

export default function WeeklyWeather() {
  const { region } = useLocationStore();
  const { code } = useLocationStore();
  const [weekTemp, setWeekTemp] = useState<TWeekTemp>();

  useEffect(() => {
    (async () => {
      const midCode = await getMidCode(region);
      const nxny = await getNxNy(code);
      const rainCode = await getRainCode(region);

      if (!midCode || !nxny || !rainCode) return;

      const weekData = async () => {
        try {
          return await fetch(
            `${import.meta.env.VITE_SERVER_API}/api/weather/week?regId1=${midCode}&regId2=${rainCode}&nx=${nxny["격자 X"]}&ny=${nxny["격자 Y"]}`,
          ).then((res) => res.json());
        } catch (error) {
          console.error(error);
        }
      };

      if (midCode) {
        weekData().then((data) => {
          setWeekTemp(data);
        });
      }
    })();
  }, [region]);

  return (
    <>
      {weekTemp ? (
        <div className={"col-span-2 rounded-lg border p-5"}>
          <p className={"mb-2 text-2xl font-bold"}>주간예보</p>
          <div className={"flex h-full flex-col px-2"}>
            {Object.entries(weekTemp).map(([key, value]) => (
              <WeeklyItem key={key} later={key} data={value} />
            ))}
          </div>
        </div>
      ) : (
        <Skeleton className="col-span-2 rounded-lg p-5" />
      )}
    </>
  );
}
