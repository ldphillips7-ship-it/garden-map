import React, { useState } from "react";
import "./index.css";
import { searchLocalPlants, getPlantByName } from "./plantDatabase.js";

const IMAGE_SRC = "/garden-layout.png";

const gardenData = {
  "Section 1": ["Azaleas"],
  "Section 2": ["Hydrangea", "Rose of Sharon"],
  "Section 3": ["Roses", "Gold mop", "Weigela", "Caryopteris", "St. John's Wort", "Aronia", "Sageleaf Willow", "Bush honeysuckle", "Itea", "Ninebark", "Calycanthus", "Camellia", "Leatherleaf Mahonia", "Vitex agnis castus", "Butterfly Bush"],
  "Section 4": ["Nishiki willow", "Osmanthus", "Abelia", "Winterberry", "Fothergilla", "American witch-hazel", "Burning bush", "Leucothoe", "Deutzia", "Yucca", "Andromeda", "Lilac", "Clethra", "Diervilla", "Spicebush", "Itea"],
  "Section 5": ["Hydrangea"],
  "Section 6": ["Alberta spruce", "Blue point juniper", "Columnar juniper", "Spartan juniper", "Container green giants", "Dwarf Japanese white pine", "Oriental spruce", "Golden spruce", "Nest spruce", "Whipcord western red cedar", "Globe Thuja Rhein gold", "Deodar cedar", "Small plum yew", "Cryptomeria globe", "Dwarf mugo pine", "Dwarf Norway spruce", "Franky boy oriental arborvitae", "Soft touch holly", "Ilex Crenshaw helleri", "Shamrock holly", "Sky pencil holly"],
  "Section 7": ["Globe blue spruce", "Globosa", "Steeds holly", "Weeping Japanese maple", "Twombly maple", "Dwarf redbud", "Bloodgood maple", "Lace leaf maple"],
  "Section 8": ["Standing ovation blue stem", "Mexican feather grass", "Karl forester grass", "Miscanthus morning light", "Panicum virgatum", "Maiden grass", "Daylilly", "Carex"],
  "Section 9": ["Hameln grass", "Carex", "Lirope", "Maiden grass", "Vinca bowles"],
  "Section 10": ["Spirea", "Barberry"],
  "Section 11": ["Barberry", "Boxwood"],
  "Section 12": ["Japanese Lace Leaf Maples"],
  "Section 13": ["Asstd. Specimens"],
  "Section 14": ["Flowering Trees (container)"],
  "Section 15": ["Boxwood"],
  "Section 16": ["Viburnum", "Boxwood"],
  "Section 17": ["Container Green Giants"],
  "Section 18": ["Flowering Trees"],
  "Section 19": ["Holly"],
  "Section 20": ["Beech", "Asstd. Flowering Trees"],
  "Section 21": ["Japanese Maples"],
  "Section 22": ["Dogwoods"],
  "Section 23": ["Magnolias", "Dogwood"],
  "Section 24": ["Red buds", "Asstd. Flowering trees"],
  "Section 25": ["Schip Laurels", "Otto Luyken"],
  "Section 26": ["Viburnum B&B"],
  "Section 27": ["Birch", "Shade maples"],
  "Section 28": ["Cherries", "Pears"],
  "Section 29": ["Norway spruce"],
  "Section 30": ["Norway spruce", "Green Giants"],
  "Section 31": ["Norway spruce", "Green Giants"],
  "Section 32": ["Green Giants"],
  "Section 33": ["Green Giants"],
  "Section 34": ["Green Giants"],
  "Section A": ["Roses", "Ground cover juniper"],
  "Section B": ["Hosta", "Asstd. Shade Perennials", "Manhattan Euonymus", "Annabelle Hydrangea", "Oakleaf Hydrangea"],
  "Section C": [],
};

const hotspots = [
  // Bottom right beds (1-9)
  { id: "Section 1", left: "57%", top: "81%", width: "14%", height: "3%" },
  { id: "Section 2", left: "57%", top: "77%", width: "14%", height: "3%" },
  { id: "Section 3", left: "57%", top: "73%", width: "14%", height: "3%" },
  { id: "Section 4", left: "57%", top: "69%", width: "14%", height: "3%" },
  { id: "Section 5", left: "57%", top: "65%", width: "14%", height: "3%" },
  { id: "Section 6", left: "57%", top: "61%", width: "14%", height: "3%" },
  { id: "Section 7", left: "57%", top: "57%", width: "14%", height: "3%" },
  { id: "Section 8", left: "57%", top: "53%", width: "14%", height: "3%" },
  { id: "Section 9", left: "57%", top: "49%", width: "14%", height: "3%" },
  
  // Left side beds (10-11)
  { id: "Section 10", left: "37%", top: "51%", width: "9%", height: "4%" },
  { id: "Section 11", left: "16%", top: "51%", width: "15%", height: "4%" },
  
  // Far right beds (12-18)
  { id: "Section 12", left: "88%", top: "74%", width: "9%", height: "6%" },
  { id: "Section 13", left: "88%", top: "64%", width: "9%", height: "8%" },
  { id: "Section 14", left: "88%", top: "52%", width: "9%", height: "10%" },
  { id: "Section 15", left: "78%", top: "40%", width: "14%", height: "9%" },
  { id: "Section 16", left: "78%", top: "32%", width: "14%", height: "7%" },
  { id: "Section 17", left: "21%", top: "44%", width: "19%", height: "3%" },
  { id: "Section 18", left: "78%", top: "26%", width: "14%", height: "5%" },
  
  // Grid beds (19-24)
  { id: "Section 19", left: "37%", top: "33%", width: "8%", height: "5%" },
  { id: "Section 20", left: "27%", top: "33%", width: "8%", height: "5%" },
  { id: "Section 21", left: "17%", top: "33%", width: "8%", height: "5%" },
  { id: "Section 22", left: "37%", top: "27%", width: "8%", height: "5%" },
  { id: "Section 23", left: "27%", top: "27%", width: "8%", height: "5%" },
  { id: "Section 24", left: "17%", top: "27%", width: "8%", height: "5%" },
  
  // Top beds (25-31)
  { id: "Section 25", left: "17%", top: "21%", width: "19%", height: "3%" },
  { id: "Section 26", left: "17%", top: "17%", width: "21%", height: "3%" },
  { id: "Section 27", left: "17%", top: "13%", width: "16%", height: "3%" },
  { id: "Section 28", left: "17%", top: "9%", width: "16%", height: "3%" },
  { id: "Section 29", left: "17%", top: "5%", width: "16%", height: "3%" },
  { id: "Section 30", left: "17%", top: "1%", width: "16%", height: "3%" },
  { id: "Section 31", left: "17.5%", top: "-3%", width: "23%", height: "3%" },
  
  // Top right tall beds (32-34)
  { id: "Section 32", left: "78%", top: "0%", width: "14%", height: "4%" },
  { id: "Section 33", left: "78%", top: "5%", width: "14%", height: "4%" },
  { id: "Section 34", left: "78%", top: "10%", width: "14%", height: "4%" },
  
  // Letter sections (bottom)
  { id: "Section A", left: "40%", top: "62%", width: "5%", height: "8%" },
  { id: "Section B", left: "88%", top: "84%", width: "8%", height: "5%" },
  { id: "Section C", left: "88%", top: "93%", width: "9%", height: "5%" },
];

function App() {
  const [selected, setSelected] = useState(null);
  const [plantInfo, setPlantInfo] = useState(null);
  const [loadingPlant, setLoadingPlant] = useState(false);
  const [plantError, setPlantError] = useState(null);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const handlePlantClick = (plantName) => {
    setLoadingPlant(true);
    setPlantError(null);
    setPlantInfo(null);
    
    // Search local database
    const plant = getPlantByName(plantName);
    
    if (plant) {
      setPlantInfo(plant);
    } else {
      setPlantError("No information found for this plant.");
    }
    
    setLoadingPlant(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setSearching(true);
    setSearchResults([]);
    setPlantError(null);
    
    // Search local database
    const results = searchLocalPlants(searchQuery);
    setSearchResults(results);
    
    if (results.length === 0) {
      setPlantError("No plants found. Try a different search term.");
    }
    
    setSearching(false);
  };

  const handleSearchResultClick = (plant) => {
    setPlantInfo(plant);
    setShowSearch(false);
    setSearchResults([]);
    setSearchQuery("");
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-80 p-4 bg-white border-r overflow-auto">
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-2">Garden Map</h1>
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="w-full px-3 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 transition"
          >
            {showSearch ? "View Garden Map" : "🔍 Search Plant Database"}
          </button>
        </div>

        {showSearch ? (
          <div>
            <form onSubmit={handleSearch} className="mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for any plant..."
                className="w-full px-3 py-2 border rounded mb-2"
              />
              <button
                type="submit"
                disabled={searching}
                className="w-full px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400 transition"
              >
                {searching ? "Searching..." : "Search"}
              </button>
            </form>

            {searchResults.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">
                  Found {searchResults.length} plants
                </h3>
                <ul className="space-y-2">
                  {searchResults.map((plant) => (
                    <li
                      key={plant.id}
                      onClick={() => handleSearchResultClick(plant)}
                      className="p-2 border rounded cursor-pointer hover:bg-sky-50 transition"
                    >
                      <div className="flex items-start gap-2">
                        {plant.image && (
                          <img
                            src={plant.image}
                            alt={plant.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {plant.name}
                          </p>
                          <p className="text-xs text-gray-500 italic truncate">
                            {plant.scientific_name}
                          </p>
                          {plant.watering && (
                            <p className="text-xs text-gray-600">
                              💧 {plant.watering}
                            </p>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <>
            {selected ? (
              <>
                <h2 className="font-semibold text-lg mb-2">{selected}</h2>
                <ul className="list-disc list-inside text-sm">
                  {gardenData[selected].map((plant) => (
                    <li
                      key={plant}
                      className="cursor-pointer hover:text-sky-600 py-1"
                      onClick={() => handlePlantClick(plant)}
                    >
                      {plant}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="text-gray-500 text-sm">
                Click a section on the map to see plants.
              </p>
            )}
          </>
        )}
      </aside>

      {/* Map + Info Panel */}
      <main className="flex-1 relative bg-gray-50 p-4 overflow-auto">
        <div className="relative mx-auto" style={{ maxWidth: 900 }}>
          <img
            src={IMAGE_SRC}
            alt="Garden layout"
            style={{ width: "100%", display: "block" }}
          />
          {hotspots.map((h) => (
            <button
              key={h.id}
              onClick={() => {
                setSelected(h.id);
                setPlantInfo(null);
                setPlantError(null);
                setShowSearch(false);
              }}
              title={h.id}
              style={{
                position: "absolute",
                left: h.left,
                top: h.top,
                width: h.width,
                height: h.height,
                border:
                  selected === h.id
                    ? "3px solid #22d3ee"
                    : "1px solid rgba(0,0,0,0.1)",
                borderRadius: 8,
                background:
                  selected === h.id
                    ? "rgba(6,182,212,0.15)"
                    : "rgba(255,255,255,0.001)",
              }}
            />
          ))}
        </div>

        {/* Plant info panel */}
        {(selected || plantInfo) && (
          <div className="absolute right-6 bottom-6 w-80 max-h-[80vh] overflow-auto p-4 bg-white rounded shadow-lg">
            {selected && !showSearch && (
              <>
                <h3 className="font-bold text-lg mb-2">Section: {selected}</h3>
                <ul className="text-sm mb-4">
                  {gardenData[selected].map((plant) => (
                    <li
                      key={plant}
                      className="border-b last:border-0 py-2 cursor-pointer hover:text-sky-600 hover:bg-sky-50 px-2 -mx-2 rounded transition"
                      onClick={() => handlePlantClick(plant)}
                    >
                      {plant}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {loadingPlant && (
              <p className="text-sm text-gray-500">Loading plant details...</p>
            )}
            {plantError && <p className="text-sm text-red-500">{plantError}</p>}

            {plantInfo && (
              <div className="text-sm">
                <h4 className="font-bold text-lg mb-2">{plantInfo.name}</h4>
                {plantInfo.image && (
                  <img
                    src={plantInfo.image}
                    alt={plantInfo.name}
                    className="w-full h-48 object-cover rounded mb-3"
                  />
                )}
                <p className="italic text-gray-600 mb-1">
                  {plantInfo.scientific_name}
                </p>
                {plantInfo.family && (
                  <p className="text-gray-600 mb-3">
                    Family: {plantInfo.family}
                  </p>
                )}
                <p className="mb-3">{plantInfo.description}</p>

                <div className="space-y-2 bg-gray-50 p-3 rounded">
                  {plantInfo.type && (
                    <p>
                      <span className="font-semibold">Type:</span>{" "}
                      {plantInfo.type}
                    </p>
                  )}
                  {plantInfo.cycle && (
                    <p>
                      <span className="font-semibold">Cycle:</span>{" "}
                      {plantInfo.cycle}
                    </p>
                  )}
                  {plantInfo.sunlight && (
                    <p>
                      <span className="font-semibold">☀️ Sunlight:</span>{" "}
                      {plantInfo.sunlight}
                    </p>
                  )}
                  {plantInfo.watering && (
                    <p>
                      <span className="font-semibold">💧 Watering:</span>{" "}
                      {plantInfo.watering}
                    </p>
                  )}
                  {plantInfo.deer_resistance && (
                    <p>
                      <span className="font-semibold">🦌 Deer Resistance:</span>{" "}
                      <span className={
                        plantInfo.deer_resistance === "A" ? "text-green-600 font-semibold" :
                        plantInfo.deer_resistance === "B" ? "text-blue-600 font-semibold" :
                        plantInfo.deer_resistance === "C" ? "text-orange-600 font-semibold" :
                        "text-red-600 font-semibold"
                      }>
                        {plantInfo.deer_resistance}
                      </span>
                      {plantInfo.deer_resistance_note && (
                        <span className="text-gray-600 text-xs block ml-0 mt-1">
                          {plantInfo.deer_resistance_note}
                        </span>
                      )}
                    </p>
                  )}
                  {plantInfo.care_level && (
                    <p>
                      <span className="font-semibold">Care Level:</span>{" "}
                      {plantInfo.care_level}
                    </p>
                  )}
                  {plantInfo.growth_rate && (
                    <p>
                      <span className="font-semibold">Growth Rate:</span>{" "}
                      {plantInfo.growth_rate}
                    </p>
                  )}
                  {plantInfo.flowering_season && (
                    <p>
                      <span className="font-semibold">🌸 Flowers:</span>{" "}
                      {plantInfo.flowering_season}
                    </p>
                  )}
                  {plantInfo.attracts && (
                    <p>
                      <span className="font-semibold">🦋 Attracts:</span>{" "}
                      {plantInfo.attracts}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;