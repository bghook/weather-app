export function convertWindSpeed(mps: number): string {
  const conversionFactor = 2.23694;
  const speedInMph = Math.round(mps * conversionFactor);
  return `${speedInMph} mph`;
}
