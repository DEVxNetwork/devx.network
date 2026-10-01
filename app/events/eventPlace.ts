//
// Types
//

export type EventPlace = {
	lat: number
	lng: number
}

//
// Functions
//

// ~100m. Same building lands on one pin; a different café stays its own pin.
export function placeKey(place: EventPlace): string {
	return `${place.lat.toFixed(3)},${place.lng.toFixed(3)}`
}
