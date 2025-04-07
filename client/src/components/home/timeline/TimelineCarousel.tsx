import { TWeatherForecast } from "@/types/weather.ts";
import CarouselWrapper from "@/components/home/timeline/CarouselWrapper.tsx";
import dayjs from "dayjs";
import "dayjs/locale/ko.js";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import { cn } from "@/lib/utils.ts";
import WeatherIcon from "@/components/common/WeatherIcon.tsx";

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
                  className="flex w-60 shrink-0 basis-1/14 flex-col items-center border-r p-2 text-center last:border-0"
                >
                  <p
                    className={cn(
                      `text-muted-foreground mb-2 text-sm break-keep`,
                      {
                        "bg-primary text-background rounded-full px-2":
                          hour === "0",
                      },
                    )}
                  >
                    {hour === "0"
                      ? Number(date) - Number(today) === 1
                        ? "내일"
                        : "모레"
                      : `${hour}시`}
                  </p>
                  {/* 아이콘 */}
                  <WeatherIcon
                    PTY={weather.PTY}
                    SKY={weather.SKY}
                    size={"sm"}
                  />

                  {/* 기온 */}
                  <div className="mb-4 text-xl font-semibold">
                    {weather.TMP}°
                  </div>

                  {/* 강수량, 습도, 풍속 */}
                  <div className="text-muted-foreground space-y-1">
                    <p
                      className={cn("font-bold", {
                        "text-blue-500": Number(weather.POP) > 0,
                      })}
                    >
                      {weather.POP}
                      <span className={"md:hidden"}>%</span>
                    </p>
                    <p className={"hidden md:block"}>{weather.REH}</p>
                    <p className={"hidden md:block"}>
                      {Number(weather.WSD).toFixed()}
                    </p>
                  </div>
                </div>
              );
            }),
          )}
      </CarouselWrapper>
    </>
  );
}
