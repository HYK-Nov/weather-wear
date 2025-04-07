import { useEffect, useState } from "react";
import { getNxNy } from "@/features/apiCode.ts";
import { useLocationStore } from "@/stores/weatherStore.ts";
import { TWeatherForecast } from "@/types/weather.ts";
import TimelineCarousel from "@/components/home/timeline/TimelineCarousel.tsx";
import { useWeatherCarouselStore } from "@/stores/carouselStore.ts";
import dayjs from "dayjs";
import "dayjs/locale/ko.js";
import LocalizedFormat from "dayjs/plugin/localizedFormat";

dayjs.locale("ko");
dayjs.extend(LocalizedFormat);

export default function Timeline() {
  const { code } = useLocationStore();
  const { curDateKey } = useWeatherCarouselStore();
  const [timelineData, setTimelineData] = useState<TWeatherForecast>();
  const [dateLabel, setDateLabel] = useState("오늘");

  const today = dayjs().format("YYYYMMDD");
  const tomorrow = dayjs().add(1, "day").format("YYYYMMDD");
  const dayAfterTomorrow = dayjs().add(2, "day").format("YYYYMMDD");

  useEffect(() => {
    (async () => {
      try {
        const res = await getNxNy(code);
        if (!res) return;

        const data = await fetch(
          `/weather/timeline?nx=${res["격자 X"]}&ny=${res["격자 Y"]}`,
        ).then((res) => res.json());

        if (data) {
          setTimelineData(data);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, [code]);

  useEffect(() => {
    if (curDateKey === today) setDateLabel("오늘");
    else if (curDateKey === tomorrow) setDateLabel("내일");
    else if (curDateKey === dayAfterTomorrow) setDateLabel("모레");
  }, [curDateKey]);

  return (
    <div className={"w-full rounded-lg border p-5"}>
      {/*<p className={"text-2xl font-bold"}>시간별 날씨</p>*/}
      <div className="flex gap-3">
        <div
          className={"hidden shrink-0 flex-col justify-between py-3 md:flex"}
        >
          <p className={"bg-primary text-background w-fit rounded-full px-2"}>
            {dateLabel}
          </p>
          <div>
            <p>
              🌧️ 강수확률<span className={"text-xs"}>%</span>
            </p>
            <p>
              💧 습도<span className={"text-xs"}>%</span>
            </p>
            <p>
              🌬️ 바람<span className={"text-xs"}>m/s</span>
            </p>
          </div>
        </div>
        <div className={"w-full overflow-x-hidden px-2"}>
          {timelineData && <TimelineCarousel data={timelineData} />}
        </div>
      </div>
      <div>
        <p className={"text-sm"}>
          제공: 기상청 {dayjs().format("YYYY.MM.DD HH:mm")} 업데이트
        </p>
      </div>
    </div>
  );
}
