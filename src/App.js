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
  { id: "Section 1", left: "57%", top: "79.5%", width: "25%", height: "1.5%" },
  { id: "Section 2", left: "57%", top: "76%", width: "25%", height: "1.5%" },
  { id: "Section 3", left: "57%", top: "72.5%", width: "25%", height: "1.5%" },
  { id: "Section 4", left: "57%", top: "69%", width: "25%", height: "1.5%" },
  { id: "Section 5", left: "57%", top: "65%", width: "25%", height: "1.5%" },
  { id: "Section 6", left: "57%", top: "61.5%", width: "25%", height: "1.5%" },
  { id: "Section 7", left: "57%", top: "58%", width: "25%", height: "1.5%" },
  { id: "Section 8", left: "57%", top: "54%", width: "25%", height: "1.5%" },
  { id: "Section 9", left: "57%", top: "50.5%", width: "25%", height: "1.5%" },
  
  // Left side beds (10-11)
  { id: "Section 10", left: "36%", top: "50%", width: "9%", height: "2%" },
  { id: "Section 11", left: "16%", top: "49%", width: "15%", height: "4%" },
  
  // Far right beds (12-18)
  { id: "Section 12", left: "88%", top: "73%", width: "9%", height: "9%" },
  { id: "Section 13", left: "88%", top: "63%", width: "9%", height: "9%" },
  { id: "Section 14", left: "88%", top: "51%", width: "9%", height: "11%" },
  { id: "Section 15", left: "80%", top: "40%", width: "13%", height: "8%" },
  { id: "Section 16", left: "80%", top: "32%", width: "13%", height: "7%" },
  { id: "Section 17", left: "21%", top: "44%", width: "22%", height: "0.001%" },
  { id: "Section 18", left: "80%", top: "26%", width: "13%", height: "5%" },
  
  // Grid beds (19-24)
  { id: "Section 19", left: "37%", top: "32%", width: "8%", height: "1%" },
  { id: "Section 20", left: "27%", top: "32%", width: "8%", height: "1%" },
  { id: "Section 21", left: "16%", top: "32%", width: "8%", height: "1%" },
  { id: "Section 22", left: "37%", top: "28%", width: "8%", height: "1%" },
  { id: "Section 23", left: "27%", top: "28%", width: "8%", height: "1%" },
  { id: "Section 24", left: "16%", top: "28%", width: "8%", height: "1%" },
  
  // Top beds (25-31)
  { id: "Section 25", left: "17%", top: "22%", width: "32%", height: "0.01%" },
  { id: "Section 26", left: "17%", top: "18%", width: "30%", height: "0.5%" },
  { id: "Section 27", left: "17%", top: "15%", width: "26%", height: "0.5%" },
  { id: "Section 28", left: "17%", top: "12%", width: "26%", height: "0.1%" },
  { id: "Section 29", left: "17%", top: "10%", width: "26%", height: "0.01%" },
  { id: "Section 30", left: "17%", top: "7%", width: "26%", height: "0.02%" },
  { id: "Section 31", left: "17.5%", top: "3%", width: "23%", height: "4%" },
  
  // Top right tall beds (32-34)
  { id: "Section 32", left: "80%", top: "1%", width: "13%", height: "4%" },
  { id: "Section 33", left: "80%", top: "6%", width: "13%", height: "4%" },
  { id: "Section 34", left: "80%", top: "10.5%", width: "13%", height: "4%" },
  
  // Letter sections (bottom)
  { id: "Section A", left: "39.5%", top: "60%", width: "5.5%", height: "8%" },
  { id: "Section B", left: "86%", top: "84%", width: "12%", height: "6%" },
  { id: "Section C", left: "86%", top: "92.5%", width: "12%", height: "6%" },
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
  const [showSidebar, setShowSidebar] = useState(false);
  
  // Zoom and pan state
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handlePlantClick = (plantName) => {
    setLoadingPlant(true);
    setPlantError(null);
    setPlantInfo(null);
    
    const plant = getPlantByName(plantName);
    
    if (plant) {
      // Find which sections contain this plant
      const sections = [];
      const plantNameLower = plant.name.toLowerCase();
      const plantWords = plantNameLower.split(/\s+/);
      
      for (const [sectionName, plants] of Object.entries(gardenData)) {
        if (plants.some(p => {
          const pLower = p.toLowerCase();
          const pWords = pLower.split(/\s+/);
          
          // Exact match
          if (pLower === plantNameLower) {
            return true;
          }
          
          // Plural match (Rose matches Roses, but not Rose of Sharon)
          if (pLower === plantNameLower + 's' || pLower === plantNameLower + 'es' ||
              plantNameLower === pLower + 's' || plantNameLower === pLower + 'es') {
            return true;
          }
          
          // Check if first 2-3 significant words match (for "Green Giants" vs "Green Giant Arborvitae")
          const significantPlantWords = plantWords.filter(w => w.length > 3);
          const significantPWords = pWords.filter(w => w.length > 3);
          if (significantPlantWords.length >= 2 && significantPWords.length >= 2) {
            const match = significantPlantWords.slice(0, 2).every((word, i) => 
              significantPWords[i] && (word === significantPWords[i] || 
                                        word === significantPWords[i] + 's' ||
                                        word + 's' === significantPWords[i])
            );
            if (match) return true;
          }
          
          return false;
        })) {
          sections.push(sectionName);
        }
      }
      setPlantInfo({ ...plant, sections });
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
    
    const results = searchLocalPlants(searchQuery);
    
    // Add section information to each result
    const resultsWithSections = results.map(plant => {
      const sections = [];
      const plantNameLower = plant.name.toLowerCase();
      const plantWords = plantNameLower.split(/\s+/);
      
      for (const [sectionName, plants] of Object.entries(gardenData)) {
        if (plants.some(p => {
          const pLower = p.toLowerCase();
          const pWords = pLower.split(/\s+/);
          
          // Exact match
          if (pLower === plantNameLower) {
            return true;
          }
          
          // Plural match (Rose matches Roses, but not Rose of Sharon)
          if (pLower === plantNameLower + 's' || pLower === plantNameLower + 'es' ||
              plantNameLower === pLower + 's' || plantNameLower === pLower + 'es') {
            return true;
          }
          
          // Check if first 2-3 significant words match (for "Green Giants" vs "Green Giant Arborvitae")
          const significantPlantWords = plantWords.filter(w => w.length > 3);
          const significantPWords = pWords.filter(w => w.length > 3);
          if (significantPlantWords.length >= 2 && significantPWords.length >= 2) {
            const match = significantPlantWords.slice(0, 2).every((word, i) => 
              significantPWords[i] && (word === significantPWords[i] || 
                                        word === significantPWords[i] + 's' ||
                                        word + 's' === significantPWords[i])
            );
            if (match) return true;
          }
          
          return false;
        })) {
          sections.push(sectionName);
        }
      }
      return { ...plant, sections };
    });
    
    setSearchResults(resultsWithSections);
    
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
    setShowSidebar(false);
  };

  // Zoom handlers
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    const newScale = Math.min(Math.max(1, scale + delta), 4);
    setScale(newScale);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY
      );
      setDragStart({ x: 0, y: 0, distance });
    } else if (e.touches.length === 1 && scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y
      });
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && dragStart.distance) {
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY
      );
      const delta = (distance - dragStart.distance) * 0.01;
      const newScale = Math.min(Math.max(1, scale + delta), 4);
      setScale(newScale);
      setDragStart({ ...dragStart, distance });
    } else if (e.touches.length === 1 && isDragging) {
      e.preventDefault();
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setDragStart({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div className="flex h-screen relative">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className="md:hidden fixed top-4 left-4 z-50 bg-sky-500 text-white p-3 rounded-lg shadow-lg"
      >
        {showSidebar ? "✕" : "☰"}
      </button>

      {/* Sidebar */}
      <aside className={`
        ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
        fixed md:relative
        w-80 h-full
        p-4 bg-white 
        border-r 
        overflow-auto
        z-40
        transition-transform duration-300
        md:block
      `}>
        <div className="mb-4">
          <h1 className="text-xl md:text-2xl font-bold mb-2">Riverside Nursery Map</h1>
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="w-full px-3 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 transition text-sm md:text-base"
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
                className="w-full px-3 py-2 border rounded mb-2 text-sm md:text-base"
              />
              <button
                type="submit"
                disabled={searching}
                className="w-full px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400 transition text-sm md:text-base"
              >
                {searching ? "Searching..." : "Search"}
              </button>
            </form>

            {searchResults.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2 text-sm md:text-base">
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
                            className="w-10 h-10 md:w-12 md:h-12 object-cover rounded flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-xs md:text-sm truncate">
                            {plant.name}
                          </p>
                          <p className="text-xs text-gray-500 italic truncate">
                            {plant.scientific_name}
                          </p>
                          {plant.sections && plant.sections.length > 0 && (
                            <p className="text-xs text-sky-600 font-medium mt-1">
                              📍 {plant.sections.join(", ")}
                            </p>
                          )}
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
                <h2 className="font-semibold text-base md:text-lg mb-2">{selected}</h2>
                <ul className="list-disc list-inside text-xs md:text-sm">
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
              <p className="text-gray-500 text-xs md:text-sm">
                Click a section on the map to see plants.
              </p>
            )}
          </>
        )}
      </aside>

      {/* Backdrop */}
      {showSidebar && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Map + Info Panel */}
      <main className="flex-1 relative bg-gray-50 p-2 md:p-4 overflow-hidden w-full">
        {/* Zoom controls */}
        <div className="absolute top-4 right-4 z-30 flex flex-col gap-2">
          <button
            onClick={() => setScale(Math.min(scale + 0.2, 4))}
            className="bg-white border-2 border-gray-300 w-10 h-10 rounded-lg shadow-lg text-xl font-bold hover:bg-gray-100"
            title="Zoom in"
          >
            +
          </button>
          <button
            onClick={() => setScale(Math.max(scale - 0.2, 1))}
            className="bg-white border-2 border-gray-300 w-10 h-10 rounded-lg shadow-lg text-xl font-bold hover:bg-gray-100"
            title="Zoom out"
          >
            −
          </button>
          {scale !== 1 && (
            <button
              onClick={resetZoom}
              className="bg-white border-2 border-gray-300 w-10 h-10 rounded-lg shadow-lg text-sm font-bold hover:bg-gray-100"
              title="Reset zoom"
            >
              ⟲
            </button>
          )}
        </div>
        
        <div 
          className="relative mx-auto max-w-4xl h-full overflow-auto"
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ 
            cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
            touchAction: 'none'
          }}
        >
          <div
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transformOrigin: 'center center',
              transition: isDragging ? 'none' : 'transform 0.1s ease-out',
              position: 'relative',
              display: 'inline-block'
            }}
          >
            <img
              src={IMAGE_SRC}
              alt="Garden layout"
              className="w-full h-auto pointer-events-none"
              draggable={false}
            />
          {hotspots.map((h) => (
            <button
              key={h.id}
              onClick={() => {
                setSelected(h.id);
                setPlantInfo(null);
                setPlantError(null);
                setShowSearch(false);
                setShowSidebar(false);
              }}
              title={h.id}
              className="touch-manipulation"
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
  minWidth: "44px",
  minHeight: "44px",
}}
            />
          ))}
          </div>
        </div>

        {/* Plant info panel */}
        {(selected || plantInfo) && (
          <div className="fixed md:absolute bottom-0 left-0 right-0 md:right-6 md:bottom-6 md:left-auto w-full md:w-96 max-h-[60vh] md:max-h-[80vh] overflow-auto p-4 bg-white md:rounded-lg shadow-lg z-20 border-t-4 md:border-t-0 border-sky-500">
            <button
              onClick={() => {
                setSelected(null);
                setPlantInfo(null);
              }}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              ✕
            </button>

            {selected && !showSearch && (
              <>
                <h3 className="font-bold text-base md:text-lg mb-2 pr-8">Section: {selected}</h3>
                <ul className="text-sm mb-4 max-h-40 overflow-auto">
                  {gardenData[selected].map((plant) => (
                    <li
                      key={plant}
                      className="border-b last:border-0 py-2 cursor-pointer hover:text-sky-600 hover:bg-sky-50 px-2 -mx-2 rounded transition"
                      onClick={() => {
                        handlePlantClick(plant);
                        setShowSidebar(false);
                      }}
                    >
                      {plant}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {loadingPlant && (
              <p className="text-xs md:text-sm text-gray-500">Loading plant details...</p>
            )}
            {plantError && <p className="text-xs md:text-sm text-red-500">{plantError}</p>}

            {plantInfo && (
              <div className="text-sm">
                <h4 className="font-bold text-base md:text-lg mb-2 pr-8">{plantInfo.name}</h4>
                {plantInfo.sections && plantInfo.sections.length > 0 && (
                  <p className="text-xs md:text-sm text-sky-600 font-medium mb-2">
                    📍 Located in: {plantInfo.sections.join(", ")}
                  </p>
                )}
                {plantInfo.image && (
                  <img
                    src={plantInfo.image}
                    alt={plantInfo.name}
                    className="w-full h-40 md:h-48 object-cover rounded mb-3"
                  />
                )}
                <p className="italic text-gray-600 mb-1 text-xs md:text-sm">
                  {plantInfo.scientific_name}
                </p>
                {plantInfo.family && (
                  <p className="text-gray-600 mb-3 text-xs md:text-sm">
                    Family: {plantInfo.family}
                  </p>
                )}
                <p className="mb-3 text-xs md:text-sm">{plantInfo.description}</p>

                <div className="space-y-2 bg-gray-50 p-3 rounded text-xs md:text-sm">
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