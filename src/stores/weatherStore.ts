import { create } from "zustand";
import { TWeather } from "@/types/weather.ts";

type WeatherStore = {
  weather: TWeather[] | null;
  setWeather: (data: TWeather[]) => void;
};

type LocationStore = {
  code: string;
  setCode: (code: string) => void;
};

export const useWeatherStore = create<WeatherStore>((set) => ({
  weather: null,
  setWeather: (data: TWeather[]) => set(() => ({ weather: data })),
}));

export const useLocationStore = create<LocationStore>((set) => ({
  code: "",
  setCode: (code: string) => set(() => ({ code })),
}));
