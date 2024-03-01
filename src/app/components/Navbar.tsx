"use client";

import React, { useState } from "react";
import { TiWeatherPartlySunny } from "react-icons/ti";
import { IoLocationSharp } from "react-icons/io5";
import { MdMyLocation } from "react-icons/md";
import SearchBox from "./SearchBox";
import axios from "axios";
import { loadingCityAtom, placeAtom } from "../atom";
import { useAtom } from "jotai";

type Props = { location?: string };

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_KEY;

export default function Navbar({ location }: Props) {
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [place, setPlace] = useAtom(placeAtom);
  const [_, setLoadingCity] = useAtom(loadingCityAtom);

  async function handleInputChange(searchTerm: string): Promise<string[]> {
    setCity(searchTerm);
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
      searchTerm
    )}&limit=5&appid=${API_KEY}`;
    if (searchTerm.length >= 3) {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const locations = await response.json();
        // Transform the response to get an array of location names
        const allSuggestions = locations.map(
          (location: any) => `${location.name}, ${location.country}`
        );
        setSuggestions(allSuggestions);
        setError("");
        setShowSuggestions(true);
        return allSuggestions;
      } catch (error) {
        setSuggestions([]);
        setShowSuggestions(false);
        return []; // Return an empty array in case of error
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      return [];
    }
  }

  function handleSuggestionClick(value: string) {
    setCity(value);
    setShowSuggestions(false);
  }

  function handleSubmitSearch(e: React.FormEvent<HTMLFormElement>) {
    setLoadingCity(true);
    e.preventDefault();
    if (suggestions.length == 0) {
      setError("No results found");
      setLoadingCity(false);
    } else {
      setError("");
      setTimeout(() => {
        setLoadingCity(false);
        setPlace(city);
        setShowSuggestions(false);
      }, 500);
    }
  }

  function handleCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          setLoadingCity(true);
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
          );
          setTimeout(() => {
            setLoadingCity(false);
            setPlace(response.data.name);
          }, 500);
        } catch (error) {
          setLoadingCity(false);
          console.log(error);
        }
      });
    }
  }

  return (
    <>
      <nav className="shadow-sm sticky top-0 left-0 z-50 bg-white">
        <div className="h-[80px] w-full flex justify-between items-center max-w-7xl px-3 mx-auto">
          <p className="flex items-center justify-center gap-2">
            <h2 className="text-gray-500 text-3xl">Weather</h2>
            <TiWeatherPartlySunny className="text-3xl mt-1 text-blue-400" />
          </p>
          <section className="flex gap-2 items-center">
            <MdMyLocation
              title="Use current location"
              onClick={handleCurrentLocation}
              className="text-2xl text-gray-500 hover:opacity-80 cursor-pointer"
            />
            <IoLocationSharp className="text-2xl text-red-600 hover:opacity-80" />
            <p className="text-slate-900/80 text-sm"> {location} </p>
            <div className="relative hidden md:flex">
              {/* Search box */}
              <SearchBox
                value={city}
                onChange={(e) => handleInputChange(e.target.value)}
                onSubmit={handleSubmitSearch}
              />
              <SuggestionBox
                {...{
                  showSuggestions,
                  suggestions,
                  handleSuggestionClick,
                  error,
                }}
              />
            </div>
          </section>
        </div>
      </nav>
      <section className="flex max-w-7xl px-3 md:hidden">
        <div className="relative">
          {/* Search box */}
          <SearchBox
            value={city}
            onChange={(e) => handleInputChange(e.target.value)}
            onSubmit={handleSubmitSearch}
          />
          <SuggestionBox
            {...{
              showSuggestions,
              suggestions,
              handleSuggestionClick,
              error,
            }}
          />
        </div>
      </section>
    </>
  );
}

function SuggestionBox({
  showSuggestions, // toggle visibility of the suggestions
  suggestions, // array of suggestions
  handleSuggestionClick, // callback for suggestion click
  error,
}: {
  showSuggestions: boolean;
  suggestions: string[];
  handleSuggestionClick: (item: string) => void;
  error: string;
}) {
  return (
    <>
      {((showSuggestions && suggestions.length > 1) || error) && (
        <ul className="mb-4 bg-white absolute border top-[44px] left-0 border-gray-300 rounded-md min-w-[200px] flex flex-col gap-1 py-2 px-2">
          {error && suggestions.length < 1 && (
            <li className="text-red-500 p-1 ">{error}</li>
          )}
          {suggestions.map((item, i) => (
            <li
              key={i}
              onClick={() => handleSuggestionClick(item)}
              className="cursor-pointer p-1 rounded hover:bg-gray-200"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
