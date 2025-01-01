import { useFavourites } from "@/hooks/use-favourite";
import { WeatherData } from "@/utils/types";
import { Button } from "./ui/button";
import { Star } from "lucide-react";
import { toast } from "sonner";

interface FavouritesButtonProps {
  data: WeatherData;
}

const FavouritesButton = ({ data }: FavouritesButtonProps) => {

  const { addFavourites, removeFavourite, isFavourite } = useFavourites();
  const isCurrentFavourite = isFavourite(data.coord.lat, data.coord.lon); 

  const handleFavouriteToggle = () => {
    if (isCurrentFavourite) {
      removeFavourite.mutate(`${data.coord.lat}-${data.coord.lon}`);
      toast.error(`Removed ${data.name} from favourites`);
    } else {
        addFavourites.mutate({
            name: data.name,
            lat: data.coord.lat,
            country: data.sys.country,
            lon: data.coord.lon
        });
        toast.success(`Added ${data.name} to favourites`);
    }
  }

  return (
    <Button
    size="icon"
    onClick={handleFavouriteToggle}
    variant={isCurrentFavourite ? "default" : "outline"}
    className={isCurrentFavourite ? "bg-yellow-500 hover:bg-yellow-600" : ""}
    >
        <Star className={`h-4 w-4 ${isCurrentFavourite ? "fill-current" : ""}`} />
    </Button>
  );
};

export default FavouritesButton;
