import { format } from "date-fns";
import { ForecastData } from "@/utils/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ArrowDown, ArrowUp, Droplets, Wind } from "lucide-react";

interface WeatherForecastProps {
    data: ForecastData;
}

interface DailyForecast {
    date: number;
    wind: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
    weather: {
        id: number;
        main: string;
        description: string;
        icon: string;
    };
}

const WeatherForecast = ({ data } : WeatherForecastProps) => {

    const dailyForecasts = data.list.reduce((acc, item) => {
        const date = format(new Date(item.dt * 1000), "yyyy-MM-dd");
        if (!acc[date]) {
            acc[date] = {
                date: item.dt,
                wind: item.wind.speed,
                weather: item.weather[0],
                temp_min: item.main.temp_min,
                temp_max: item.main.temp_max,
                humidity: item.main.humidity
            };
        } else {
            acc[date].temp_min = Math.min(acc[date].temp_min, item.main.temp_min);
            acc[date].temp_max = Math.max(acc[date].temp_max, item.main.temp_max);
        }
        return acc;
    }, {} as Record<string, DailyForecast>);

    const nextDays = Object.values(dailyForecasts).slice(0, 6);

    const tempFormat = (temp: number) => `${Math.round(temp)}°`;

  return (
    <Card>
        <CardHeader>
            <CardTitle>5-day Forecast</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="grid gap-4">
                {nextDays.map((day) => {
                    return (
                        <div key={day.date} className="grid grid-cols-3 items-center gap-4 rounded-lg p-4">
                            <div>
                                <p className="font-medium">{format(new Date(day.date * 1000), "EEE, MMM d")}</p>
                                <p className="text-sm text-muted-foreground capitalize">{day.weather?.description}</p>
                            </div>

                            <div className="flex justify-center gap-4">
                                <span className="flex items-center gap-1 text-blue-500">
                                <ArrowDown className="h-3 w-3" />
                                {tempFormat(day.temp_min)}
                                </span>
                                <span className="flex items-center gap-1 text-red-500">
                                    <ArrowUp className="h-3 w-3" />
                                    {tempFormat(day.temp_max)}
                                </span>
                            </div>

                            <div className="flex justify-end gap-4">
                                <span className="flex items-center gap-1 text-blue-500">
                                <Droplets className="h-3 w-3" />
                                {day.humidity}%
                                </span>
                                <span className="flex items-center gap-1 text-red-500">
                                    <Wind className="h-3 w-3" />
                                    {day.wind}m/s
                                </span>
                            </div>
                    </div>
                    );
                })}
            </div>
        </CardContent>
    </Card>
  )
}

export default WeatherForecast
