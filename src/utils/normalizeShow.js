export function normalizeShow(item) {
  return {
    id: item.id,
    name: item.primaryTitle || item.originalTitle || "Unknown",
    image:
      item.primaryImage?.url ||
      "https://via.placeholder.com/210x295?text=No+Image",
    year: item.startYear || item.releaseDate?.releaseDate || "N/A",
    type: item.type || "movie",
    rating: item.rating?.aggregateRating || "N/A"
  };
}
