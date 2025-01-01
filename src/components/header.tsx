import { useTheme } from "@/context/theme-provider";
import { Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import SearchCities from "./search-cities";

const Header = () => {
    
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur py-2 supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to={"/"}>
          <img src="/logo.png" alt="Weather App" className="h-20" />
        </Link>

        <div className="flex gap-4">
            <SearchCities />

          <div
            className={`flex items-center cursor-pointer transition-transform duration-500 ${
              theme === "dark" ? "rotate-180" : "rotate-0"
            }`}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-6 w-6 text-yellow-500 rotate-0 transition-all" />
            ) : (
              <Moon className="h-6 w-6 text-blue-500 rotate-0 transition-all" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
