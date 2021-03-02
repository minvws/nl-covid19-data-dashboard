type HasXYCoords = { x: number; y: number };

export function calculateDistance(point1: HasXYCoords, point2: HasXYCoords) {
  const x = point2.x - point1.x;
  const y = point2.y - point1.y;
  return Math.sqrt(x * x + y * y);
}
