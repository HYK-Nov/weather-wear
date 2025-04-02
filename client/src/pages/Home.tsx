import "../styles/App.css";
import TodayWeather from "@/components/home/TodayWeather.tsx";
import AirInfo from "@/components/home/AirInfo.tsx";
import WeeklyWeather from "@/components/home/WeeklyWeather.tsx";
import WeatherTimeline from "@/components/home/WeatherTimeline.tsx";
import RecommendWear from "@/components/home/RecommendWear.tsx";
import CurLocation from "@/components/home/CurLocation.tsx";

function Home() {
  return (
    <div className="grid grid-cols-8 gap-6">
      <div className="col-span-6 flex flex-col gap-y-6">
        <CurLocation />
        <div
          className={
            "grid grid-cols-2 justify-items-center rounded-lg border bg-gradient-to-b p-5"
          }
        >
          <TodayWeather />
          <AirInfo />
        </div>
        <WeatherTimeline />
        <RecommendWear />
      </div>
      <WeeklyWeather />
    </div>
  );
}

export default Home;
