// src/plantApi.js
const PERENUAL_API_KEY = "sk-GW9A691600a43516213476";
const BASE_URL = "https://perenual.com/api";

export async function searchPlants(query) {
  try {
    const response = await fetch(
      `${BASE_URL}/species-list?key=${PERENUAL_API_KEY}&q=${encodeURIComponent(query)}`
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.data.map(plant => ({
      id: plant.id,
      name: plant.common_name || plant.scientific_name[0],
      scientific_name: plant.scientific_name[0],
      image: plant.default_image?.thumbnail || plant.default_image?.regular_url,
      cycle: plant.cycle,
      watering: plant.watering,
      sunlight: plant.sunlight,
    }));
  } catch (error) {
    console.error("Search error:", error);
    throw error;
  }
}

export async function fetchPlantDetails(plantNameOrId) {
  try {
    const searchResults = await searchPlants(plantNameOrId);
    
    if (!searchResults || searchResults.length === 0) {
      throw new Error("No plants found");
    }
    
    const plantId = searchResults[0].id;
    
    const response = await fetch(
      `${BASE_URL}/species/details/${plantId}?key=${PERENUAL_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const plant = await response.json();
    
    return {
      id: plant.id,
      name: plant.common_name || plant.scientific_name[0],
      scientific_name: plant.scientific_name?.[0] || "Unknown",
      family: plant.family || "Unknown",
      image: plant.default_image?.regular_url || plant.default_image?.thumbnail,
      description: plant.description || `${plant.common_name || plant.scientific_name[0]} is a ${plant.type || "plant"}.`,
      type: plant.type,
      cycle: plant.cycle,
      watering: plant.watering,
      sunlight: Array.isArray(plant.sunlight) ? plant.sunlight.join(", ") : plant.sunlight,
      maintenance: plant.maintenance,
      care_level: plant.care_level,
      growth_rate: plant.growth_rate,
      hardiness: plant.hardiness,
      flowers: plant.flowers,
      flowering_season: plant.flowering_season,
      attracts: plant.attracts?.join(", "),
    };
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}