import { API_CONFIG } from "./api-routes";
import { Coordinates, ForecastData, GeoCodingData, WeatherData } from "./types";

class WeatherAPI {
  private createURL(endPoint: string, params: Record<string, string | number>) {
    const searchParams = new URLSearchParams({
      appid: API_CONFIG.API_KEY,
      ...params
    });
    return `${endPoint}?${searchParams.toString()}`;
  }

  private async fetchData<T>(url: string): Promise<T> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API fetchData threw an error - ${response.statusText}`);
    }
    return response.json();
  }

  async getWeather({ lat, lon }: Coordinates): Promise<WeatherData> {
    const url = this.createURL(`${API_CONFIG.BASE_URL}/weather`, {
      lat: lat.toString(),
      lon: lon.toString(),
      units: API_CONFIG.DEFAULT_PARAMS.units
    });
    return this.fetchData<WeatherData>(url);
  }

  async getForecast({ lat, lon }: Coordinates): Promise<ForecastData> {
    const url = this.createURL(`${API_CONFIG.BASE_URL}/forecast`, {
      lat: lat.toString(),
      lon: lon.toString(),
      units: API_CONFIG.DEFAULT_PARAMS.units
    });
    return this.fetchData<ForecastData>(url);
  }

  async reverseGeocode({ lat, lon }: Coordinates): Promise<GeoCodingData[]> {
    const url = this.createURL(`${API_CONFIG.GEO_CODING}/reverse`, {
      lat: lat.toString(),
      lon: lon.toString(),
      limit: 1
    });
    return this.fetchData<GeoCodingData[]>(url);
  }

  async searchLocations(query: string): Promise<GeoCodingData[]> {
    const url = this.createURL(`${API_CONFIG.GEO_CODING}/direct`, {
      q: query,
      limit: 5
    });
    return this.fetchData<GeoCodingData[]>(url);
  }
}

export const weatherAPI = new WeatherAPI();
