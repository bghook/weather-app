export function getDayOrNightIcon(
  iconName: string,
  dateTimeString: string
): string {
  const hours = new Date(dateTimeString).getHours(); // get hours from the given date and time

  const isDay = hours >= 6 && hours < 18; // check if it is day time (6am to 6pm)

  return isDay ? iconName.replace(/.$/, "d") : iconName.replace(/.$/, "n");
}
