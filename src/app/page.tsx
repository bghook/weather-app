"use client";

import Navbar from "./components/Navbar";
import { useQuery } from "react-query";
import axios from "axios";
import { format, fromUnixTime, parseISO } from "date-fns";
import Container from "./components/Container";
import { convertKelvinToFahrenheit } from "@/utils/convertKelvinToFahrenheit";
import { metersToMiles } from "@/utils/metersToMiles";
import WeatherIcon from "./components/WeatherIcon";
import { getDayOrNightIcon } from "@/utils/getDayOrNightIcon";
import WeatherDetails from "./components/WeatherDetails";
import { convertWindSpeed } from "@/utils/convertWindSpeed";
import ForecastWeatherDetail from "./components/ForecastWeatherDetail";
import { loadingCityAtom, placeAtom } from "./atom";
import { useAtom } from "jotai";
import { useEffect } from "react";

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
  const [place, setPlace] = useAtom(placeAtom);
  const [loadingCity] = useAtom(loadingCityAtom);

  console.log("place", place);

  const { isLoading, error, data, refetch } = useQuery<WeatherData>(
    "repoData",
    async () => {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`
      );
      return data;
    }
  );

  useEffect(() => {
    refetch();
  }, [place, refetch]);

  const firstData = data?.list[0];

  console.log("data", data);

  // Create an array of unique dates
  const uniqueDates = [
    ...new Set(
      data?.list.map(
        (entry) => new Date(entry.dt * 1000).toISOString().split("T")[0]
      )
    ),
  ];

  // Filter data to get the first entry for each date after 6am
  const firstDataForEachDate = uniqueDates.map((date) => {
    return data?.list.find((entry) => {
      const entryDate = new Date(entry.dt * 1000).toISOString().split("T")[0];
      const entryTime = new Date(entry.dt * 1000).getHours();
      return entryDate === date && entryTime >= 6;
    });
  });

  if (isLoading)
    return (
      <div className="flex items-center min-h-screen justify-center">
        <p className="animate-bounce">Loading...</p>
      </div>
    );

  const SkeletonLoader = () => {
    return (
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4 animate-pulse">
        {/* Today data skeleton */}
        <section className="space-y-4">
          <div className="space-y-2">
            <h2 className="flex gap-1 text-2xl items-end">
              <div className="h-6 bg-gray-300 w-24 rounded-md"></div>{" "}
              {/* Date placeholder */}
              <div className="h-4 bg-gray-300 w-20 rounded-md"></div>{" "}
              {/* Subdate placeholder */}
            </h2>
            <div className="flex flex-col px-4">
              <span className="h-12 bg-gray-300 w-full rounded-md"></span>{" "}
              {/* Temperature placeholder */}
              <div className="flex justify-between mt-2">
                <span className="h-4 bg-gray-300 w-20 rounded-md"></span>{" "}
                {/* Feels like placeholder */}
                <span className="h-4 bg-gray-300 w-20 rounded-md"></span>{" "}
                {/* Temp range placeholder */}
              </div>
            </div>
            {/* Time and Weather icons skeleton */}
            <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col justify-between gap-2 items-center text-xs font-semibold"
                >
                  <div className="h-4 bg-gray-300 w-16 rounded-md"></div>{" "}
                  {/* Time placeholder */}
                  <div className="h-10 bg-gray-300 w-10 rounded-full"></div>{" "}
                  {/* Weather icon placeholder */}
                  <div className="h-4 bg-gray-300 w-10 rounded-md"></div>{" "}
                  {/* Temp placeholder */}
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-4">
            {/* Left container - weather description skeleton */}
            <div className="w-fit justify-center flex-col px-4 items-center">
              <div className="h-6 bg-gray-300 w-24 rounded-md mb-2"></div>{" "}
              {/* Description placeholder */}
              <div className="h-10 bg-gray-300 w-10 rounded-full"></div>{" "}
              {/* Weather icon placeholder */}
            </div>
            {/* Right container - weather details skeleton */}
            <div className="bg-blue-400/20 px-6 gap-4 justify-between overflow-x-auto w-full">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-300 w-20 rounded-md"></div> // Weather details placeholder
              ))}
            </div>
          </div>
        </section>

        {/* 7 day forecast data skeleton */}
        <section className="flex w-full flex-col gap-4">
          <div className="h-6 bg-gray-300 w-36 rounded-md mb-4"></div>{" "}
          {/* Forecast header placeholder */}
          {[...Array(7)].map((_, i) => (
            <div key={i} className="flex justify-between items-center gap-4">
              <div className="h-4 bg-gray-300 w-20 rounded-md"></div>{" "}
              {/* Day placeholder */}
              <div className="h-10 bg-gray-300 w-10 rounded-full"></div>{" "}
              {/* Weather icon placeholder */}
              <div className="h-4 bg-gray-300 w-24 rounded-md"></div>{" "}
              {/* Temp details placeholder */}
            </div>
          ))}
        </section>
      </main>
    );
  };

  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
      <Navbar location={place} />
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
        {/* Today data */}
        {loadingCity ? (
          <SkeletonLoader />
        ) : (
          <>
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
                        {convertKelvinToFahrenheit(
                          firstData?.main.feels_like ?? 0
                        )}
                        °
                      </span>
                    </p>
                    <p className="text-xs space-x-2">
                      <span>
                        {convertKelvinToFahrenheit(
                          firstData?.main.temp_min ?? 0
                        )}
                        °↓
                      </span>
                      <span>
                        {convertKelvinToFahrenheit(
                          firstData?.main.temp_max ?? 0
                        )}
                        °↑
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
                          <p className="whitespace-nowrap">
                            {format(parseISO(d.dt_txt), "h:mm a")}
                          </p>
                          <WeatherIcon
                            iconName={getDayOrNightIcon(
                              d.weather[0].icon,
                              d.dt_txt
                            )}
                          />
                          <p>{convertKelvinToFahrenheit(d?.main.temp ?? 0)}°</p>
                        </div>
                      )
                    )}
                  </div>
                </Container>
              </div>
              <div className="flex gap-4">
                {/* Left container - weather description */}
                <Container className="w-fit justify-center flex-col px-4 items-center">
                  <p className="capitalize text-center">
                    {firstData?.weather[0].description}
                  </p>
                  <WeatherIcon
                    iconName={getDayOrNightIcon(
                      firstData?.weather[0].icon ?? "",
                      firstData?.dt_txt ?? ""
                    )}
                  />
                </Container>
                {/* Right container - weather details */}
                <Container className="bg-blue-400/20 px-6 gap-4 justify-between overflow-x-auto">
                  <WeatherDetails
                    visibility={metersToMiles(firstData?.visibility ?? 1)}
                    humidity={`${firstData?.main.humidity}%`}
                    windSpeed={`${convertWindSpeed(
                      firstData?.wind.speed ?? 0
                    )}`}
                    airPressure={`${firstData?.main.pressure} hPa`}
                    sunrise={format(
                      fromUnixTime(data?.city.sunrise ?? 0),
                      "h:mm a"
                    )}
                    sunset={format(
                      fromUnixTime(data?.city.sunset ?? 0),
                      "h:mm a"
                    )}
                  />
                </Container>
              </div>
            </section>

            {/* 7 day forecast data*/}
            <section className="flex w-full flex-col gap-4">
              <p className="text-2xl">7-Day Forecast</p>
              {firstDataForEachDate.map((d, i) => (
                <ForecastWeatherDetail
                  key={i}
                  description={d?.weather[0].description ?? ""}
                  weatherIcon={d?.weather[0].icon ?? ""}
                  date={format(parseISO(d?.dt_txt ?? ""), "MM.dd")}
                  day={format(parseISO(d?.dt_txt ?? ""), "EEEE")}
                  feels_like={d?.main.feels_like ?? 0}
                  temp={d?.main.temp ?? 0}
                  temp_high={d?.main.temp_max ?? 0}
                  temp_low={d?.main.temp_min ?? 0}
                  airPressure={`${d?.main.pressure} hPa `}
                  humidity={`${d?.main.humidity}% `}
                  sunrise={format(
                    fromUnixTime(data?.city.sunrise ?? 0),
                    "h:mm a"
                  )}
                  sunset={format(
                    fromUnixTime(data?.city.sunset ?? 0),
                    "h:mm a"
                  )}
                  visibility={`${metersToMiles(d?.visibility ?? 1)} `}
                  windSpeed={`${convertWindSpeed(d?.wind.speed ?? 0)} `}
                />
              ))}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
