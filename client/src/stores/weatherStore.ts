import { create } from "zustand";
import { TNowWeather } from "@/types/weather.ts";

type WeatherStore = {
  nowWeather: TNowWeather[] | null;
  setNowWeather: (data: TNowWeather[]) => void;
  aprTemp: number;
  setAprTemp: (temp: number) => void;
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

export const useLocationStore = create<LocationStore>((set) => ({
  code: "",
  region: [],
  setCode: (code: string) => set(() => ({ code })),
  setRegion: (region: string[]) => set(() => ({ region: region })),
}));
