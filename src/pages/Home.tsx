import "../styles/App.css";
import WeatherInfo from "@/components/home/WeatherInfo.tsx";
import AirInfo from "@/components/home/AirInfo.tsx";
import WeeklyWeather from "@/components/home/WeeklyWeather.tsx";
import TodayWeather from "@/components/home/TodayWeather.tsx";
import RecommendWear from "@/components/home/RecommendWear.tsx";
import CurLocation from "@/components/home/CurLocation.tsx";

function Home() {
  return (
    <div className="grid grid-cols-8 gap-6">
      <div className="col-span-6 flex flex-col gap-y-6">
        <CurLocation />
        <div className={"grid aspect-4/1 grid-cols-2 gap-6"}>
          <WeatherInfo />
          <AirInfo />
        </div>
        <TodayWeather />
        <RecommendWear />
      </div>
      <WeeklyWeather />
    </div>
  );
}

export default Home;
