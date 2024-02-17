import React from "react";
import { FiDroplet } from "react-icons/fi";
import { ImMeter } from "react-icons/im";
import { LuEye, LuSunrise, LuSunset } from "react-icons/lu";
import { MdAir } from "react-icons/md";

type Props = {};

export interface WeatherDetailProps {
  visibility: string;
  humidity: string;
  windSpeed: string;
  airPressure: string;
  sunrise: string;
  sunset: string;
}

export default function WeatherDetails(props: WeatherDetailProps) {
  const {
    visibility = "1mi",
    humidity = "10%",
    windSpeed = "1km/h",
    airPressure = "100 hPa",
    sunrise = "6:00",
    sunset = "18:00",
  } = props;

  return (
    // Not using a div because we are styling from the parent component
    <>
      <SingleWeatherDetail
        icon={<LuEye />}
        description="Visibility"
        value={visibility}
      />
      <SingleWeatherDetail
        icon={<FiDroplet />}
        description="Humidity"
        value={humidity}
      />
      <SingleWeatherDetail
        icon={<MdAir />}
        description="Wind Speed"
        value={windSpeed}
      />
      <SingleWeatherDetail
        icon={<ImMeter />}
        description="Air Pressure"
        value={airPressure}
      />
      <SingleWeatherDetail
        icon={<LuSunrise />}
        description="Sunrise"
        value={sunrise}
      />
      <SingleWeatherDetail
        icon={<LuSunset />}
        description="Sunset"
        value={sunset}
      />
    </>
  );
}

export interface SingleWeatherDetailProps {
  description: string;
  icon: React.ReactNode;
  value: string;
}

function SingleWeatherDetail(props: SingleWeatherDetailProps) {
  return (
    <div className="flex flex-col justify-between gap-2 items-center text-xs font-semibold text-black/80">
      <p className="whitespace-nowrap">{props.description}</p>
      <div className="text-3xl">{props.icon}</div>
      <p>{props.value}</p>
    </div>
  );
}
