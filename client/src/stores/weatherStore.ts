import { create } from "zustand";
import { TNowWeather, TWeekTemp } from "@/types/weather.ts";

type WeatherStore = {
  nowWeather: TNowWeather[] | null;
  setNowWeather: (data: TNowWeather[]) => void;
  aprTemp: number;
  setAprTemp: (temp: number) => void;
};

type WeeklyWeatherStore = {
  weeklyWeather: TWeekTemp | null;
  setWeeklyWeather: (weeklyWeather: TWeekTemp) => void;
};

type LocationStore = {
  code: string;
  region: string[];
  setCode: (code: string) => void;
  setRegion: (region: string[]) => void;
};

export const useWeatherStore = create<WeatherStore>((set) => ({
  nowWeather: null,
  setNowWeather: (data: TNowWeather[]) => set(() => ({ nowWeather: data })),
  aprTemp: 0,
  setAprTemp: (temp: number) => set(() => ({ aprTemp: temp })),
}));

export const useWeeklyWeatherStore = create<WeeklyWeatherStore>((set) => ({
  weeklyWeather: null,
  setWeeklyWeather: (data: TWeekTemp) => set(() => ({ weeklyWeather: data })),
}));

export const useLocationStore = create<LocationStore>((set) => ({
  code: "",
  region: [],
  setCode: (code: string) => set(() => ({ code })),
  setRegion: (region: string[]) => set(() => ({ region: region })),
}));
