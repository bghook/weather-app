/** @format */
"use client";

import Image from "next/image";
import Navbar from "./components/Navbar";
import { useQuery } from "react-query";
import axios from "axios";
import { format, parseISO } from "date-fns";
import Container from "./components/Container";
import { convertKelvinToFahrenheit } from "@/utils/convertKelvinToFahrenheit";

// type WeatherForecastResponse = {
//   cod: string;
//   message: number;
//   cnt: number;
//   list: Array<{
//     dt: number;
//     main: {
//       temp: number;
//       feels_like: number;
//       temp_min: number;
//       temp_max: number;
//       pressure: number;
//       sea_level: number;
//       grnd_level: number;
//       humidity: number;
//       temp_kf: number;
//     };
//     weather: Array<{
//       id: number;
//       main: string;
//       description: string;
//       icon: string;
//     }>;
//     clouds: {
//       all: number;
//     };
//     wind: {
//       speed: number;
//       deg: number;
//       gust: number;
//     };
//     visibility: number;
//     pop: number;
//     sys: {
//       pod: string;
//     };
//     dt_txt: string;
//   }>;
//   city: {
//     id: number;
//     name: string;
//     coord: {
//       lat: number;
//       lon: number;
//     };
//     country: string;
//     population: number;
//     timezone: number;
//     sunrise: number;
//     sunset: number;
//   };
// };

interface WeatherData {
  cod: string;
  message: number;
  cnt: number;
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      sea_level: number;
      grnd_level: number;
      humidity: number;
      temp_kf: number;
    };
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    clouds: {
      all: number;
    };
    wind: {
      speed: number;
      deg: number;
      gust: number;
    };
    visibility: number;
    pop: number;
    sys: {
      pod: string;
    };
    dt_txt: string;
  }>;
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export default function Home() {
  const { isLoading, error, data } = useQuery<WeatherData>(
    "repoData",
    async () => {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=london&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`
      );
      return data;
    }
    // fetch(
    //   "https://api.openweathermap.org/data/2.5/forecast?q=london&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56"
    // ).then((res) => res.json())
  );

  const firstData = data?.list[0];

  console.log("data", data);

  if (isLoading)
    return (
      <div className="flex items-center min-h-screen justify-center">
        <p className="animate-bounce">Loading...</p>
      </div>
    );

  //if (error) return "An error has occurred: " + error.message;

  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
      <Navbar />
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
        {/* Today data */}
        <section className="space-y-4">
          <div className="space-y-2">
            <h2 className="flex gap-1 text-2xl items-end">
              <p>{format(parseISO(firstData?.dt_txt ?? ""), "EEEE")} </p>
              <p className="text-lg">
                ({format(parseISO(firstData?.dt_txt ?? ""), "MM.dd.yyyy")})
              </p>
            </h2>
            <Container className="gap-10 px-6 items-center">
              {/* Temperature */}
              <div className="flex flex-col px-4">
                <span className="text-5xl">
                  {convertKelvinToFahrenheit(firstData?.main.temp ?? 0)}°
                </span>
                <p className="text-xs space-x-1 whitespace-nowrap">
                  <span>Feels like</span>
                  <span>
                    {convertKelvinToFahrenheit(firstData?.main.feels_like ?? 0)}
                    °
                  </span>
                </p>
                <p className="text-xs space-x-2">
                  <span>
                    {convertKelvinToFahrenheit(firstData?.main.temp_min ?? 0)}°↓
                  </span>
                  <span>
                    {convertKelvinToFahrenheit(firstData?.main.temp_max ?? 0)}°↑
                  </span>
                </p>
              </div>
              {/* Time and Weather icons */}
              <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
                {data?.list.map(
                  (
                    d,
                    i // d is the data, i is the index
                  ) => (
                    <div
                      key={i}
                      className="flex flex-col justify-between gap-2 items-center text-xs font-semibold"
                    >
                      <p>{format(parseISO(d.dt_txt), "h:mm a")}</p>
                    </div>
                  )
                )}
              </div>
            </Container>
          </div>
        </section>
        {/* 7 day forecast data*/}
        <section></section>
      </main>
    </div>
  );
}
