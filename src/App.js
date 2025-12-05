import React, { useState, useEffect } from "react";
import "./index.css";
import { searchLocalPlants, getPlantByName } from './plantDatabase.js';

const IMAGE_SRC = "/garden-layout.png";
// ❌ REMOVED LINE 6 - THIS WAS CAUSING THE ERROR:
// const [showTapHint, setShowTapHint] = useState(true);

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

const mobileHotspots = [
  // Bottom right beds (1-9)
  { id: "Section 1", left: "57%", top: "79%", width: "25%", height: "3%" },
  { id: "Section 2", left: "57%", top: "75.5%", width: "25%", height: "3%" },
  { id: "Section 3", left: "57%", top: "72%", width: "25%", height: "3%" },
  { id: "Section 4", left: "57%", top: "69%", width: "25%", height: "3%" },
  { id: "Section 5", left: "57%", top: "65%", width: "25%", height: "3%" },
  { id: "Section 6", left: "57%", top: "61%", width: "25%", height: "3%" },
  { id: "Section 7", left: "57%", top: "58%", width: "25%", height: "3%" },
  { id: "Section 8", left: "57%", top: "54%", width: "25%", height: "3%" },
  { id: "Section 9", left: "57%", top: "50%", width: "25%", height: "3%" },
  
  // Left side beds (10-11)
  { id: "Section 10", left: "36%", top: "50%", width: "9%", height: "3%" },
  { id: "Section 11", left: "16%", top: "50%", width: "15%", height: "3%" },
  
  // Far right beds (12-18)
  { id: "Section 12", left: "88%", top: "73%", width: "9%", height: "9%" },
  { id: "Section 13", left: "88%", top: "63%", width: "9%", height: "9%" },
  { id: "Section 14", left: "88%", top: "51%", width: "9%", height: "11%" },
  { id: "Section 15", left: "80%", top: "40%", width: "13%", height: "8%" },
  { id: "Section 16", left: "80%", top: "32%", width: "13%", height: "7%" },
  { id: "Section 17", left: "21%", top: "44%", width: "22%", height: "2%" },
  { id: "Section 18", left: "80%", top: "26%", width: "13%", height: "5%" },
  
  // Grid beds (19-24)
  { id: "Section 19", left: "37%", top: "32%", width: "8%", height: "3%" },
  { id: "Section 20", left: "27%", top: "32%", width: "8%", height: "3%" },
  { id: "Section 21", left: "16%", top: "32%", width: "8%", height: "3%" },
  { id: "Section 22", left: "37%", top: "28%", width: "8%", height: "3%" },
  { id: "Section 23", left: "27%", top: "28%", width: "8%", height: "3%" },
  { id: "Section 24", left: "16%", top: "28%", width: "8%", height: "3%" },
  
  // Top beds (25-31)
  { id: "Section 25", left: "17%", top: "22%", width: "32%", height: "2%" },
  { id: "Section 26", left: "17%", top: "18%", width: "30%", height: "2%" },
  { id: "Section 27", left: "17%", top: "15%", width: "26%", height: "2%" },
  { id: "Section 28", left: "17%", top: "12.5%", width: "26%", height: "2%" },
  { id: "Section 29", left: "17%", top: "10%", width: "26%", height: "2%" },
  { id: "Section 30", left: "17%", top: "7.5%", width: "26%", height: "2%" },
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

// Helper function to match plant names flexibly
function matchPlantNames(plantName, gardenPlantName) {
  const pLower = plantName.toLowerCase();
  const gLower = gardenPlantName.toLowerCase();
  const pWords = pLower.split(/\s+/);
  const gWords = gLower.split(/\s+/);
  
  if (pLower === gLower) return true;
  
  if (pLower === gLower + 's' || pLower === gLower + 'es' ||
      gLower === pLower + 's' || gLower === pLower + 'es') {
    return true;
  }
  
  if (gLower.includes(pLower) || pLower.includes(gLower)) {
    return true;
  }
  
  const pNoSpace = pLower.replace(/\s+/g, '').replace(/-/g, '');
  const gNoSpace = gLower.replace(/\s+/g, '').replace(/-/g, '');
  if (pNoSpace === gNoSpace || pNoSpace === gNoSpace + 's' || gNoSpace === pNoSpace + 's') {
    return true;
  }
  
  const plantEntry = getPlantByName(plantName);
  if (plantEntry && plantEntry.scientific_name) {
    const scientificLower = plantEntry.scientific_name.toLowerCase();
    const scientificGenus = scientificLower.split(' ')[0];
    
    if (gLower === scientificLower || scientificLower.includes(gLower) || gLower.includes(scientificLower)) {
      return true;
    }
    
    if (gLower === scientificGenus || gLower.includes(scientificGenus) || scientificGenus.includes(gLower)) {
      return true;
    }
  }
  
  const gardenPlantEntry = getPlantByName(gardenPlantName);
  if (gardenPlantEntry && gardenPlantEntry.scientific_name) {
    const scientificLower = gardenPlantEntry.scientific_name.toLowerCase();
    const scientificGenus = scientificLower.split(' ')[0];
    
    if (pLower === scientificLower || scientificLower.includes(pLower) || pLower.includes(scientificLower)) {
      return true;
    }
    
    if (pLower === scientificGenus || pLower.includes(scientificGenus) || scientificGenus.includes(pLower)) {
      return true;
    }
  }
  
  const pSignificant = pWords.filter(w => w.length > 2);
  const gSignificant = gWords.filter(w => w.length > 2);
  
  if (pSignificant.length >= 2 && gSignificant.length >= 2) {
    const matches = pSignificant.filter(pw => 
      gSignificant.some(gw => 
        gw === pw || gw === pw + 's' || pw === gw + 's' ||
        gw.includes(pw) || pw.includes(gw)
      )
    );
    
    if (matches.length >= Math.min(pSignificant.length, gSignificant.length, 2)) {
      return true;
    }
  }
  
  return false;
}

function App() {
  // ✅ ALL useState HOOKS MUST GO HERE - INSIDE THE FUNCTION
  const [selected, setSelected] = useState(null);
  const [plantInfo, setPlantInfo] = useState(null);
  const [loadingPlant, setLoadingPlant] = useState(false);
  const [plantError, setPlantError] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  
  const [filters, setFilters] = useState({
    type: "",
    cycle: "",
    watering: "",
    sunlight: "",
    deerResistance: "",
    careLevel: ""
  });
  
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  
  // ✅ ADDED THIS LINE HERE - INSIDE THE FUNCTION (this fixes the line 6 error)
  const [showTapHint, setShowTapHint] = useState(true);

  // ✅ useEffect hooks
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // ✅ FIXED: Removed showTapHint from dependency array (this fixes the warning)
  useEffect(() => {
    if (isMobile) {
      const timer = setTimeout(() => setShowTapHint(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isMobile]);

  const handlePlantClick = (plantName) => {
    setLoadingPlant(true);
    setPlantError(null);
    setPlantInfo(null);
    
    const plant = getPlantByName(plantName);
    
    if (plant) {
      const sections = [];
      
      for (const [sectionName, plants] of Object.entries(gardenData)) {
        if (plants.some(p => matchPlantNames(plant.name, p))) {
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
    if (!searchQuery.trim() && !Object.values(filters).some(f => f)) return;
    
    setSearching(true);
    setSearchResults([]);
    setPlantError(null);
    
    let results = searchLocalPlants(searchQuery);
    
    if (filters.type) {
      results = results.filter(p => p.type && p.type.toLowerCase().includes(filters.type.toLowerCase()));
    }
    if (filters.cycle) {
      results = results.filter(p => p.cycle && p.cycle.toLowerCase().includes(filters.cycle.toLowerCase()));
    }
    if (filters.watering) {
      results = results.filter(p => p.watering && p.watering.toLowerCase() === filters.watering.toLowerCase());
    }
    if (filters.sunlight) {
      results = results.filter(p => p.sunlight && p.sunlight.toLowerCase().includes(filters.sunlight.toLowerCase()));
    }
    if (filters.deerResistance) {
      results = results.filter(p => p.deer_resistance && p.deer_resistance === filters.deerResistance);
    }
    if (filters.careLevel) {
      results = results.filter(p => p.care_level && p.care_level.toLowerCase() === filters.careLevel.toLowerCase());
    }
    
    const resultsWithSections = results.map(plant => {
      const sections = [];
      
      for (const [sectionName, plants] of Object.entries(gardenData)) {
        if (plants.some(p => matchPlantNames(plant.name, p))) {
          sections.push(sectionName);
        }
      }
      return { ...plant, sections };
    });
    
    setSearchResults(resultsWithSections);
    
    if (results.length === 0) {
      setPlantError("No plants found. Try different search terms or filters.");
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

  const handleWheel = (e) => {
    if (window.innerWidth < 768) {
      e.preventDefault();
      const delta = e.deltaY * -0.001;
      const newScale = Math.min(Math.max(1, scale + delta), 4);
      setScale(newScale);
    }
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
    if (scale > 1 && window.innerWidth < 768) {
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
            <form onSubmit={handleSearch} className="mb-4 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchQuery(value);
                  
                  if (value.trim().length > 0) {
                    const results = searchLocalPlants(value);
                    setSuggestions(results.slice(0, 5));
                    setShowSuggestions(true);
                  } else {
                    setSuggestions([]);
                    setShowSuggestions(false);
                  }
                }}
                placeholder="Search for any plant..."
                className="w-full px-3 py-2 border rounded mb-2 text-sm md:text-base"
              />
              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-50 w-full bg-white border rounded shadow-lg max-h-48 overflow-auto">
                  {suggestions.map((plant) => (
                    <li
                      key={plant.id}
                      onClick={() => {
                        setSearchQuery(plant.name);
                        handleSearch({ preventDefault: () => {} });
                        setShowSuggestions(false);
                      }}
                      className="p-2 hover:bg-sky-50 cursor-pointer text-sm"
                    >
                      {plant.name}
                    </li>
                  ))}
                </ul>
              )}
              
              {/* Filter Dropdowns */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-2">
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({...filters, type: e.target.value})}
                  className="px-2 py-1 border rounded text-xs md:text-sm"
                >
                  <option value="">All Types</option>
                  <option value="Tree">Tree</option>
                  <option value="Shrub">Shrub</option>
                  <option value="Perennial">Perennial</option>
                  <option value="Annual">Annual</option>
                </select>

                <select
                  value={filters.watering}
                  onChange={(e) => setFilters({...filters, watering: e.target.value})}
                  className="px-2 py-1 border rounded text-xs md:text-sm"
                >
                  <option value="">All Watering</option>
                  <option value="Minimum">Minimum</option>
                  <option value="Average">Average</option>
                  <option value="Frequent">Frequent</option>
                </select>

                <select
                  value={filters.sunlight}
                  onChange={(e) => setFilters({...filters, sunlight: e.target.value})}
                  className="px-2 py-1 border rounded text-xs md:text-sm"
                >
                  <option value="">All Sunlight</option>
                  <option value="Full sun">Full Sun</option>
                  <option value="Part shade">Part Shade</option>
                  <option value="Full shade">Full Shade</option>
                </select>

                <select
                  value={filters.deerResistance}
                  onChange={(e) => setFilters({...filters, deerResistance: e.target.value})}
                  className="px-2 py-1 border rounded text-xs md:text-sm"
                >
                  <option value="">All Deer Resist.</option>
                  <option value="A">A - Rarely Damaged</option>
                  <option value="B">B - Seldom Damaged</option>
                  <option value="C">C - Occasionally Damaged</option>
                  <option value="D">D - Frequently Damaged</option>
                </select>

                <select
                  value={filters.careLevel}
                  onChange={(e) => setFilters({...filters, careLevel: e.target.value})}
                  className="px-2 py-1 border rounded text-xs md:text-sm"
                >
                  <option value="">All Care Levels</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>

                <button
                  type="button"
                  onClick={() => setFilters({type: "", cycle: "", watering: "", sunlight: "", deerResistance: "", careLevel: ""})}
                  className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-xs md:text-sm"
                >
                  Clear Filters
                </button>
              </div>

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
      {gardenData[selected]
        .filter((plantName) => {
          // Filter out hidden plants
          const plant = getPlantByName(plantName);
          return plant !== null;
        })
        .map((plant) => (
          <li
            key={plant}
            className="cursor-pointer hover:text-sky-600 py-1"
            onClick={() => handlePlantClick(plant)}
          >
            {plant}
          </li>
        ))}
    </ul>
    {gardenData[selected].filter((plantName) => {
      const plant = getPlantByName(plantName);
      return plant !== null;
    }).length === 0 && (
      <p className="text-xs md:text-sm text-gray-500 italic mt-2">
        No plants currently available in this section.
      </p>
    )}
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
            touchAction: scale > 1 ? 'none' : 'pan-y'
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
            
            {/* ✅ TAP HINT - ADDED HERE */}
            {isMobile && showTapHint && (
  <div 
    className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 bg-sky-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm animate-pulse"
    style={{ pointerEvents: 'auto', maxWidth: '90vw' }}
  >
    <div className="flex items-start gap-2">
  <div className="text-center">
    <div>👆 Tap sections to explore plants</div>
    <div>Use ☰ menu to search</div>
  </div>
  <button 
    onClick={(e) => {
      e.stopPropagation();
      setShowTapHint(false);
    }}
    className="text-white hover:text-gray-200 font-bold"
  >
    ✕
  </button>
</div>
  </div>
)}
            
            {/* ✅ HOTSPOTS - UPDATED STYLING */}
            {(isMobile ? mobileHotspots : hotspots).map((h) => (
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
                className={`touch-manipulation ${!isMobile ? 'hover:bg-sky-100/30 hover:border hover:border-sky-400/50' : ''}`}
                style={{
  position: "absolute",
  left: h.left,
  top: h.top,
  width: h.width,
  height: h.height,
  border: "none",
  borderRadius: 8,
  background: "transparent",
  cursor: "pointer",
  minWidth: window.innerWidth < 768 ? "0px" : "44px",
  minHeight: window.innerWidth < 768 ? "0px" : "44px",
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
      {gardenData[selected]
        .filter((plantName) => {
          // Filter out hidden plants
          const plant = getPlantByName(plantName);
          return plant !== null; // getPlantByName now checks visibility
        })
        .map((plant) => (
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
    {gardenData[selected].filter((plantName) => {
      const plant = getPlantByName(plantName);
      return plant !== null;
    }).length === 0 && (
      <p className="text-sm text-gray-500 italic">No plants currently available in this section.</p>
    )}
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
                      <sup 
                        className="text-blue-500 cursor-help ml-1" 
                        title="Deer resistance ratings from Rutgers University Cooperative Extension"
                      >
                        *
                      </sup>
                      {plantInfo.deer_resistance_note && (
                        <span className="text-gray-600 text-xs block ml-0 mt-1">
                          {plantInfo.deer_resistance_note}
                        </span>
                      )}
                    </p>
                  )}
                  {plantInfo.native_status && plantInfo.native_status !== "Varies" && (
                    <p>
                      <span className="font-semibold">🌱 Native Status:</span>{" "}
                      <span className={
                        plantInfo.native_status === "Native" ? "text-green-600 font-semibold" :
                        plantInfo.native_status === "Naturalized" ? "text-blue-600 font-semibold" :
                        "text-gray-600 font-semibold"
                      }>
                        {plantInfo.native_status}
                      </span>
                      {plantInfo.native_region && plantInfo.native_region !== "Varies" && (
                        <span className="text-gray-600 text-sm block ml-6 mt-1">
                          {plantInfo.native_region}
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
                {/* Rutgers Attribution */}
                {plantInfo.deer_resistance && plantInfo.deer_resistance !== "Varies" && (
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500 italic">
                      <sup>*</sup> Deer resistance ratings based on{" "}
                      <a 
                        href="https://extension.rutgers.edu/deer-resistant-plants" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        Rutgers University Cooperative Extension
                      </a>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

