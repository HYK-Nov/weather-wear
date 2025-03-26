import dayjs from "dayjs";
import "dayjs/locale/ko.js";
import LocalizedFormat from "dayjs/plugin/localizedFormat";

dayjs.locale("ko");
dayjs.extend(LocalizedFormat);

export const getWeatherData = async (nx: number, ny: number) => {
  const now = dayjs();
  const basetime = now
    .subtract(now.minute() > 30 ? 0 : 1, "hours")
    .format("HH30");

  const url = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst?numOfRows=60&base_time=${basetime}&nx=${nx}&ny=${ny}&serviceKey=${import.meta.env.VITE_SERVICE_KEY}&pageNo=1&dataType=JSON&base_date=${now.format("YYYYMMDD")}`;

  return (await (await fetch(url)).json()).response.body.items.item;
};
