
export function calculateDistance(
  coord1: [number, number],
  coord2: [number, number]
): number {
  const [lon1, lat1] = coord1;
  const [lon2, lat2] = coord2;

  const R = 6371; 
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


export function calculatePoints(distance: number, usedHint: boolean): number {
  const MAX_POINTS = 5000;
  const SCALE_FACTOR = 4000; 

  let points = 0;

  if (distance < 50) {
    points = MAX_POINTS;
  } else {
    points = Math.round(MAX_POINTS * Math.exp(-distance / SCALE_FACTOR));
  }

  if (points < 0) points = 0;

  if (usedHint) {
    points = Math.floor(points * 0.3);
  }

  return points;
}