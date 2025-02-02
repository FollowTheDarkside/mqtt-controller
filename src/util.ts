// Get distance
export const dist = (x1: number, y1: number, x2: number, y2: number) => {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

// Convert degrees to radians
export const degToRad = (degrees: number) => {
  return (degrees * Math.PI) / 180;
}

// Convert the coordinates to fit between 0 and 1
export const normalizePos = (x: number, y: number, canvas: HTMLCanvasElement) => {
  // let clientRect = canvas.getBoundingClientRect();
  const normalizedX = x / canvas.clientWidth;
  const normalizedY = y / canvas.clientHeight;
  // console.log("nPos:", nx, ny);
  return {x: normalizedX, y: normalizedY};
}

export const normalizeDistance = (d: number, rect: DOMRect) => {
  const maxDistance = dist(rect.left, rect.top, rect.right, rect.bottom);
  const normalizedDist = d / maxDistance;
  return normalizedDist;
}