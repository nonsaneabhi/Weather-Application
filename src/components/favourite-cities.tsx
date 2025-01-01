import { useFavourites } from "@/hooks/use-favourite";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { useWeatherQuery } from "@/hooks/use-weather";
import { Button } from "./ui/button";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";

interface FavouriteCitiesProps {
  id: string;
  lat: number;
  lon: number;
  name: string;
  onRemoveHandler: (id: string) => void;
}

const FavouriteCities = () => {
    
  const { favourites: favouriteCities, removeFavourite } = useFavourites();

  if (!favouriteCities.length) {
    return null;
  }

  function FavouriteCitiesArea({ id, name, lat, lon, onRemoveHandler }: FavouriteCitiesProps) {

    const navigate = useNavigate();
    const { data: weather, isLoading } = useWeatherQuery({ lat, lon });

    return (
      <div
        role="button"
        tabIndex={0}
        onClick={() => navigate(`/city/${name}?lat=${lat}&lon=${lon}`)}
        className="relative flex min-w-[250px] cursor-pointer items-center gap-3 rounded-lg border bg-card p-4 pr-8 shadow-sm transition-all hover:shadow-md"
      >
        <Button
          onClick={(event) => {
            event.stopPropagation();
            onRemoveHandler(id);
            toast.error(`${name} removed from favourites`);
          }}
          className="absolute right-1 top-1 h-6 w-6 rounded-full p-0 hover:text-destructive-foreground group-hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </Button>
        {isLoading ? (
          <div className="h-8 flex items-center justify-center">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        ) : weather ? (
          <>
            <div className="flex items-center gap-2">
              <img
                alt={weather.weather?.[0]?.description}
                className="h-full w-8"
                src={`https://openweathermap.org/img/wn/${weather.weather?.[0]?.icon}.png`}
              />
              <div>
                <p className="font-medium">{name}</p>
                <p className="text-xs text-muted-foreground">{weather.sys.country}</p>
              </div>
            </div>
            <div className="ml-auto text-right">
              <p className="text-xl font-bold">{Math.round(weather.main.temp)}°</p>
              <p className="text-xs capitalize text-muted-foreground">{weather.weather?.[0]?.description}</p>
            </div>
          </>
        ) : null}
      </div>
    );
  }

  return (
    <>
      <h1 className="text-xl font-bold tracking-tight">Favourites</h1>
      <ScrollArea className="w-full pb-4">
        <div className="flex gap-4">
          {favouriteCities.map((city) => {
            return (
              <FavouriteCitiesArea
                key={city.id}
                {...city}
                onRemoveHandler={() => removeFavourite.mutate(city.id)}
              />
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" className="mt-2" />
      </ScrollArea>
    </>
  );
};

export default FavouriteCities;
