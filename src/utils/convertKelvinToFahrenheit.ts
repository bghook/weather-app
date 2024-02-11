export function convertKelvinToFahrenheit(kelvin: number): number {
  const fahrenheit = (kelvin - 273.15) * (9 / 5) + 32;
  return Math.floor(fahrenheit);
}
