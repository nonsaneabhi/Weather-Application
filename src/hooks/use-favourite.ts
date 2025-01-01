import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalStorage } from "./use-local-storage";

interface Favourites {
    id: string;
    lat: number;
    lon: number;
    name: string;
    state?: string;
    country: string;
    addedAt: number;
}

export function useFavourites() {
    const queryClient = useQueryClient();
    const [favourites, setFavourites] = useLocalStorage<Favourites[]>("favourites", []);
    
    const favouritesQuery = useQuery({
        queryKey: ["favourites"],
        queryFn: () => favourites,
        initialData: favourites,
        staleTime: Infinity
    });

    const addFavourites = useMutation({
        mutationFn: async (favourite : Omit<Favourites, "id" | "addedAt">) => {
            const newFavourite : Favourites = {
                ...favourite,
                id: `${favourite.lat}-${favourite.lon}`,
                addedAt: Date.now()
            };

            const existingFavourites = favourites.some(item => item.id === newFavourite.id);
            if (existingFavourites) return favourites;

            const newFavourites = [newFavourite, ...favourites].slice(0, 10);

            setFavourites(newFavourites);
            return newFavourites;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["favourites"]
            });
        }
    });

    const removeFavourite = useMutation({
        mutationFn: async (favouriteId : string) => {
            const newFavourites = favourites.filter(item => item.id !== favouriteId);
            setFavourites(newFavourites);
            return newFavourites;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["favourites"]
            });
        }
    });

    return {
        isFavourite: (lat: number, lon: number) => favourites.some(item => item.lat === lat && item.lon === lon),
        favourites: favouritesQuery.data ?? [],
        addFavourites,
        removeFavourite
    };
}