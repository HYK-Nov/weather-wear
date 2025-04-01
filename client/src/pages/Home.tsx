import "../styles/App.css";
import TodayWeather from "@/components/home/TodayWeather.tsx";
import AirInfo from "@/components/home/AirInfo.tsx";
import WeeklyWeather from "@/components/home/WeeklyWeather.tsx";
import HourWeather from "@/components/home/HourWeather.tsx";
import RecommendWear from "@/components/home/RecommendWear.tsx";
import CurLocation from "@/components/home/CurLocation.tsx";

function Home() {
  return (
    <div className="grid grid-cols-8 gap-6">
      <div className="col-span-6 flex flex-col gap-y-6">
        <CurLocation />
        <div className={"grid aspect-4/1 grid-cols-2 gap-6"}>
          <TodayWeather />
          <AirInfo />
        </div>
        <HourWeather />
        <RecommendWear />
      </div>
      <WeeklyWeather />
    </div>
  );
}

export default Home;
