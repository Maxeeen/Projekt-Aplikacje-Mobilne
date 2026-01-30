/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
export function calculateDistance(
  coord1: [number, number],
  coord2: [number, number]
): number {
  const [lon1, lat1] = coord1;
  const [lon2, lat2] = coord2;

  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Calculate points based on distance
 * Maximum 1000 points for perfect accuracy
 * Points decrease with distance
 */
export function calculatePoints(distance: number, usedHint: boolean): number {
  let points = 0;

  // Distance-based scoring
  if (distance < 50) {
    points = 1000;
  } else if (distance < 100) {
    points = 900;
  } else if (distance < 200) {
    points = 800;
  } else if (distance < 500) {
    points = 700;
  } else if (distance < 1000) {
    points = 600;
  } else if (distance < 2000) {
    points = 500;
  } else if (distance < 3000) {
    points = 400;
  } else if (distance < 5000) {
    points = 300;
  } else if (distance < 8000) {
    points = 200;
  } else if (distance < 12000) {
    points = 100;
  } else {
    points = 50;
  }

  // Apply hint penalty
  if (usedHint) {
    points = Math.floor(points * 0.5);
  }

  return points;
}
