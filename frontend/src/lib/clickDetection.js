// Get click position relative to the image (or same-size wrapper) top-left.
export function getImageRelativeClick(ev, imageEl) {
  const rect = imageEl.getBoundingClientRect()
  return {
    x: ev.clientX - rect.left,
    y: ev.clientY - rect.top,
  }
}

/**
 * Scale from displayed pixel coords to "original" image coords.
 */
export function toOriginalCoords(relX, relY, displayW, displayH, origW, origH) {
  if (displayW <= 0 || displayH <= 0) return { x: 0, y: 0 }
  return {
    x: (relX / displayW) * origW,
    y: (relY / displayH) * origH,
  }
}


export function isPointInZone(origX, origY, zone) {
  const { x, y, width, height } = zone
  return (
    origX >= x &&
    origX <= x + width &&
    origY >= y &&
    origY <= y + height
  )
}
