import { TWeatherForecast } from "@/types/weather.ts";
import CarouselWrapper from "@/components/home/timeline/CarouselWrapper.tsx";
import dayjs from "dayjs";
import "dayjs/locale/ko.js";
import LocalizedFormat from "dayjs/plugin/localizedFormat";

dayjs.locale("ko");
dayjs.extend(LocalizedFormat);

export default function TimelineCarousel({ data }: { data: TWeatherForecast }) {
  const today = dayjs().format("YYYYMMDD");

  return (
    <>
      <CarouselWrapper>
        {data &&
          Object.entries(data).flatMap(([date, hours]) =>
            Object.entries(hours).map(([hour, weather]) => {
              if (!(weather.POP && weather.REH && weather.WSD)) return null;

              return (
                <div
                  key={`${date}-${hour}`}
                  data-date={date}
                  className="flex w-60 shrink-0 basis-1/14 flex-col items-center border-r p-4 text-center"
                >
                  <p
                    className={`mb-2 text-sm ${hour === "0" ? "bg-primary rounded-full px-2 text-white" : "text-muted-foreground"} `}
                  >
                    {hour === "0"
                      ? Number(date) - Number(today) === 1
                        ? "내일"
                        : "모레"
                      : `${hour}시`}
                  </p>

                  {/* 기온 */}
                  <div className="mb-2 text-lg font-semibold">
                    {weather.TMP}°
                  </div>

                  {/* 강수량, 습도, 풍속 */}
                  <div className="text-muted-foreground space-y-1 text-sm">
                    <p>{weather.POP}%</p>
                    <p>{weather.REH}%</p>
                    <p>{weather.WSD}m/s</p>
                  </div>
                </div>
              );
            }),
          )}
      </CarouselWrapper>
    </>
  );
}
