import React from "react";
import Container from "./Container";
import WeatherIcon from "./WeatherIcon";
import WeatherDetails, { WeatherDetailProps } from "./WeatherDetails";
import { convertKelvinToFahrenheit } from "@/utils/convertKelvinToFahrenheit";

export interface ForecastWeatherDetailProps extends WeatherDetailProps {
  weatherIcon: string;
  date: string;
  day: string;
  temp: number;
  feels_like: number;
  temp_low: number;
  temp_high: number;
  description: string;
}

export default function ForecastWeatherDetail(
  props: ForecastWeatherDetailProps
) {
  const {
    weatherIcon = "02d",
    date = "01-01",
    day = "Friday",
    temp,
    feels_like,
    temp_low,
    temp_high,
    description,
  } = props;
  return (
    <Container className="gap-4">
      <section className="flex gap-4 items-center px-4">
        {/* Small left box 1 */}
        <div className="flex flex-col gap-1 items-center">
          <WeatherIcon iconName={weatherIcon} />
          <p>{date}</p>
          <p className="text-sm">{day}</p>
          <p>{date}</p>
        </div>
        {/* Small left box 2 */}
        <div className="flex flex-col px-4">
          <span className="text-5xl">
            {convertKelvinToFahrenheit(temp ?? 0)}°
          </span>
          <p className="text-xs space-x-1 whitespace-nowrap">
            <span>Feels Like</span>
            <span>{convertKelvinToFahrenheit(feels_like ?? 0)}°</span>
          </p>
          <p className="capitalize">{description}</p>
        </div>
      </section>
      {/* Right section */}
      <section className="overflow-x-auto flex justify-between gap-4 px-4 w-full pr-10">
        <WeatherDetails {...props} />
      </section>
    </Container>
  );
}
