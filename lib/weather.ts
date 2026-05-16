export interface WeatherData {
  temp: number;
  feelsLike: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  city: string;
}

export interface ForecastDay {
  date: string;
  high: number;
  low: number;
  description: string;
  icon: string;
  precipitation: number;
}

export async function getCurrentWeather(lat: number, lon: number): Promise<WeatherData | null> {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`,
      { next: { revalidate: 1800 } }
    );
    if (!response.ok) return null;
    const data = await response.json();

    return {
      temp: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed),
      city: data.name,
    };
  } catch {
    return null;
  }
}

export async function getWeatherForecast(lat: number, lon: number): Promise<ForecastDay[]> {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) return [];

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial&cnt=40`,
      { next: { revalidate: 3600 } }
    );
    if (!response.ok) return [];
    const data = await response.json();

    const dailyMap = new Map<string, ForecastDay>();
    for (const item of data.list) {
      const date = item.dt_txt.split(" ")[0];
      if (!dailyMap.has(date)) {
        dailyMap.set(date, {
          date,
          high: Math.round(item.main.temp_max),
          low: Math.round(item.main.temp_min),
          description: item.weather[0].description,
          icon: item.weather[0].icon,
          precipitation: item.pop * 100,
        });
      } else {
        const existing = dailyMap.get(date)!;
        existing.high = Math.max(existing.high, Math.round(item.main.temp_max));
        existing.low = Math.min(existing.low, Math.round(item.main.temp_min));
      }
    }

    return Array.from(dailyMap.values()).slice(0, 5);
  } catch {
    return [];
  }
}
