import {
  TbCloudFilled,
  TbCloudRain,
  TbCloudSnow,
  TbQuestionMark,
  TbSunFilled,
  TbMoonFilled,
} from "react-icons/tb";
import { cn } from "@/lib/utils.ts";
import dayjs from "dayjs";
import "dayjs/locale/ko.js";
import LocalizedFormat from "dayjs/plugin/localizedFormat";

dayjs.locale("ko");
dayjs.extend(LocalizedFormat);

type WeatherIconProps =
  | { state: string; size?: "xs" | "sm" | "md" | "lg"; isNightTime?: boolean } // 단일 상태 문자열
  | {
      SKY: string;
      PTY: string;
      size?: "xs" | "sm" | "md" | "lg";
      isNightTime?: boolean;
    }; // SKY + PTY 분리형

export default function WeatherIcon({
  size = "md",
  className,
  ...props
}: WeatherIconProps & React.ComponentPropsWithoutRef<"div">) {
  const iconRecord: Record<string, { icon: React.ElementType; style: string }> =
    {
      맑음: { icon: TbSunFilled, style: "text-amber-400" },
      야간: { icon: TbMoonFilled, style: "text-indigo-400" },
      구름많음: { icon: TbCloudFilled, style: "text-slate-200" },
      흐림: { icon: TbCloudFilled, style: "text-slate-400" },
      흐리고비: { icon: TbCloudRain, style: "text-blue-400" },
      비: { icon: TbCloudRain, style: "text-blue-400" },
      "비/눈": { icon: TbCloudRain, style: "text-indigo-300" },
      눈: { icon: TbCloudSnow, style: "text-sky-200" },
      빗방울: { icon: TbCloudRain, style: "text-blue-300" },
      빗방울눈날림: { icon: TbCloudRain, style: "text-indigo-200" },
      눈날림: { icon: TbCloudSnow, style: "text-sky-100" },
      알수없음: { icon: TbQuestionMark, style: "text-muted-foreground" },
    };

  const normalizeSKY = (value: string): string => {
    const map: Record<string, string> = {
      맑음: "1",
      구름많음: "3",
      흐림: "4",
      없음: "0",
    };
    return map[value] || value;
  };

  const normalizePTY = (value: string): string => {
    const map: Record<string, string> = {
      없음: "0",
      비: "1",
      "비/눈": "2",
      눈: "3",
      소나기: "4",
      빗방울: "5",
      빗방울눈날림: "6",
      눈날림: "7",
    };
    return map[value] || value;
  };

  const getStateFromSKYPTY = (SKY: string, PTY: string) => {
    const sky = normalizeSKY(SKY);
    const pty = normalizePTY(PTY);

    switch (pty) {
      case "1":
      case "4":
      case "5":
        return "비";
      case "2":
      case "6":
        return "비/눈";
      case "3":
      case "7":
        return "눈";
      case "0":
      default:
        switch (sky) {
          case "1":
            return "맑음";
          case "3":
            return "구름많음";
          case "4":
            return "흐림";
          default:
            return "알수없음";
        }
    }
  };

  // 1. 단일 state 문자열일 경우
  let state = "알수없음";
  if ("state" in props) {
    state = props.state.replace(" ", "");
  } else {
    // 2. SKY + PTY 조합일 경우
    state = getStateFromSKYPTY(props.SKY, props.PTY);
  }

  // 조건: 밤 시간 + 상태가 맑음일 때만 야간 처리
  const displayState = props.isNightTime && state === "맑음" ? "야간" : state;

  const { icon: IconComponent, style } =
    iconRecord[displayState] || iconRecord["알수없음"];
  return <IconComponent className={cn(style, className)} />;
}
