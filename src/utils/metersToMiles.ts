export function metersToMiles(meters: number): string {
  const metersInAMile = 1609.34;
  const visibilityInMiles = Math.round(meters / metersInAMile);
  return `${visibilityInMiles}mi`;
}
