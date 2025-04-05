export const formatCurrentDay = (currentDate: Date, locale: string) =>
  currentDate.toLocaleString(locale, {
    weekday: "long",
  });

export const formatCurrentTime = (currentDate: Date, locale: string) =>
  currentDate.toLocaleString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    day: "numeric",
    month: "long",
  });

export const formatCurrentDate = (currentDate: Date, locale: string) =>
  currentDate.toLocaleString(locale, {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
