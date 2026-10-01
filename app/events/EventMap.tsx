"use client"
import { useEffect, useRef, useState } from "react"
import { styled } from "styled-components"
import type { Map as LeafletMap, Marker } from "leaflet"
import { gatheringTitle } from "@/app/content/community"
import type { PublicGathering } from "@/app/content/gatherings"
import { placeKey, type EventPlace } from "./eventPlace"
import "leaflet/dist/leaflet.css"

//
// Types
//

type EventMapProps = {
	gatherings: PublicGathering[]
	places: Record<string, EventPlace>
	selectedId: string | null
	onSelect: (id: string) => void
}

type Pin = {
	key: string
	place: EventPlace
	gatherings: PublicGathering[]
}

type LeafletLib = typeof import("leaflet")

//
// Constants
//

const COUNTY: [number, number] = [32.85, -117.2]

// Gray canvas: coast, roads, and place names. No shops, transit, or POIs.
const LIGHT_BASE =
	"https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
const LIGHT_LABELS =
	"https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}"
const DARK_BASE =
	"https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
const DARK_LABELS =
	"https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}"

const ATTRIBUTION =
	'© <a href="https://www.esri.com/" rel="noreferrer">Esri</a>, HERE, Garmin, <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'

//
// Components
//

export function EventMap({ gatherings, places, selectedId, onSelect }: EventMapProps) {
	const frameRef = useRef<HTMLDivElement>(null)
	const mapRef = useRef<LeafletMap | null>(null)
	const markersRef = useRef<Marker[]>([])
	const fittedRef = useRef("")
	const onSelectRef = useRef(onSelect)
	const [ready, setReady] = useState(false)
	const [failed, setFailed] = useState(false)
	onSelectRef.current = onSelect

	useEffect(() => {
		const frame = frameRef.current
		if (!frame) return
		let cancelled = false
		let map: LeafletMap | null = null
		let observer: ResizeObserver | null = null
		let scheme: MediaQueryList | null = null
		let onScheme: (() => void) | null = null

		const start = () => {
			void (async () => {
				try {
					const leaflet = await loadLeaflet()
					if (cancelled || !frameRef.current) return
					const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
					scheme = window.matchMedia("(prefers-color-scheme: dark)")

					map = leaflet.map(frameRef.current, {
						center: COUNTY,
						zoom: 9,
						minZoom: 3,
						maxZoom: 16,
						scrollWheelZoom: false,
						attributionControl: false,
						zoomControl: false,
						fadeAnimation: !reduce,
						zoomAnimation: !reduce,
						markerZoomAnimation: !reduce
					})
					leaflet.control
						.attribution({ position: "bottomleft", prefix: false })
						.addAttribution(ATTRIBUTION)
						.addTo(map)
					leaflet.control.zoom({ position: "bottomright" }).addTo(map)
					const base = leaflet.tileLayer(scheme.matches ? DARK_BASE : LIGHT_BASE, { maxZoom: 16 })
					const labels = leaflet.tileLayer(scheme.matches ? DARK_LABELS : LIGHT_LABELS, {
						maxZoom: 16,
						pane: "overlayPane"
					})
					base.addTo(map)
					labels.addTo(map)
					onScheme = () => {
						const dark = scheme?.matches ?? false
						base.setUrl(dark ? DARK_BASE : LIGHT_BASE)
						labels.setUrl(dark ? DARK_LABELS : LIGHT_LABELS)
					}
					scheme.addEventListener("change", onScheme)

					if (cancelled) {
						map.remove()
						map = null
						return
					}

					observer = new ResizeObserver(() => map?.invalidateSize())
					observer.observe(frameRef.current)
					mapRef.current = map
					map.whenReady(() => {
						if (!cancelled) setReady(true)
					})
				} catch (error) {
					console.warn(error)
					if (!cancelled) setFailed(true)
				}
			})()
		}

		let waiter: ResizeObserver | null = null
		if (frame.clientWidth === 0) {
			waiter = new ResizeObserver(() => {
				if (cancelled || frame.clientWidth === 0) return
				waiter?.disconnect()
				waiter = null
				start()
			})
			waiter.observe(frame)
		} else {
			start()
		}

		return () => {
			cancelled = true
			waiter?.disconnect()
			if (scheme && onScheme) scheme.removeEventListener("change", onScheme)
			observer?.disconnect()
			for (const marker of markersRef.current) marker.remove()
			markersRef.current = []
			map?.remove()
			mapRef.current = null
			fittedRef.current = ""
			setReady(false)
		}
	}, [])

	useEffect(() => {
		if (!ready) return
		const map = mapRef.current
		if (!map) return
		let cancelled = false

		void (async () => {
			const leaflet = await loadLeaflet()
			if (cancelled || mapRef.current !== map) return
			drawPins(leaflet, map, markersRef, fittedRef, pinsFor(gatherings, places), selectedId, (id) =>
				onSelectRef.current(id)
			)
		})()

		return () => {
			cancelled = true
		}
	}, [ready, gatherings, places, selectedId])

	return (
		<Frame>
			<Canvas ref={frameRef} />
			{failed ? <Fallback>The map didn't load. The list still has every date.</Fallback> : null}
		</Frame>
	)
}

const Frame = styled.div`
	position: relative;
	z-index: 0;
	isolation: isolate;
	width: 100%;
	height: 100%;
	min-height: 24rem;
	overflow: hidden;
	background: #e4e2df;

	@media (prefers-color-scheme: dark) {
		background: #2c2c2c;
	}

	.leaflet-container {
		width: 100%;
		height: 100%;
		background: transparent;
		font-family: "Chivo", sans-serif;
	}

	.leaflet-container img {
		max-width: none;
	}

	.leaflet-bar {
		border: 1px solid var(--border);
		border-radius: 0.7rem;
		overflow: hidden;
		box-shadow: none;
	}

	.leaflet-bar a {
		width: 2rem;
		height: 2rem;
		line-height: 2rem;
		color: var(--foreground);
		background: var(--surface-solid);
		border-bottom-color: var(--border);
	}

	.leaflet-bar a:hover,
	.leaflet-bar a:focus-visible {
		background: var(--wash);
		color: var(--foreground);
	}

	.leaflet-control-attribution {
		max-width: min(20rem, calc(100% - 0.75rem));
		margin: 0 0 0.25rem 0.35rem;
		padding: 0.15rem 0.4rem;
		white-space: normal;
		background: rgba(255, 255, 255, 0.92);
		color: #181818;
		font-size: 11px;
		line-height: 1.3;
	}

	.leaflet-control-attribution a {
		color: #5010a0;
	}

	.leaflet-control-container {
		max-width: 100%;
	}

	.leaflet-div-icon.devx-pin-wrap {
		background: transparent;
		border: none;
	}

	.devx-pin {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		padding: 0;
		border: 2px solid #ffffff;
		border-radius: 999px;
		background: #5c6570;
		box-shadow: 0 1px 3px rgba(24, 24, 24, 0.35);
		color: #ffffff;
		font-family: "Chivo", sans-serif;
		font-size: 11px;
		font-weight: 700;
		line-height: 1;
		cursor: pointer;
	}

	.devx-pin.is-selected {
		background: var(--extrusion);
		border-color: #ffffff;
		color: #ffffff;
	}

	.devx-pin:hover,
	.devx-pin:focus-visible {
		transform: scale(1.12);
	}

	.devx-tip {
		padding: 0;
		border: none;
		background: transparent;
		box-shadow: none;
		font-family: "Chivo", sans-serif;
	}

	.devx-tip .leaflet-tooltip-content {
		margin: 0;
	}

	.leaflet-tooltip.devx-tip {
		max-width: 16rem;
		padding: 0.4rem 0.55rem;
		border: 1px solid var(--border);
		border-radius: 0.6rem;
		background: var(--surface-solid);
		color: var(--foreground);
		box-shadow: none;
		font-size: 0.85rem;
		line-height: 1.35;
		white-space: normal;
	}

	@media (prefers-reduced-motion: reduce) {
		.devx-pin:hover,
		.devx-pin:focus-visible {
			transform: none;
		}
	}
`

const Canvas = styled.div`
	width: 100%;
	height: 100%;
`

const Fallback = styled.p`
	position: absolute;
	inset: 0;
	z-index: 500;
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 0;
	padding: 1.5rem;
	text-align: center;
	color: var(--muted-foreground);
	background: var(--surface-solid);
`

//
// Functions
//

async function loadLeaflet(): Promise<LeafletLib> {
	const mod = await import("leaflet")
	const withDefault = mod as LeafletLib & { default?: LeafletLib }
	return withDefault.default ?? withDefault
}

function pinsFor(gatherings: PublicGathering[], places: Record<string, EventPlace>): Pin[] {
	const groups = new Map<string, Pin>()
	for (const gathering of gatherings) {
		const place = places[gathering.id]
		if (!place) continue
		const key = placeKey(place)
		const existing = groups.get(key)
		if (existing) {
			existing.gatherings.push(gathering)
			continue
		}
		groups.set(key, { key, place, gatherings: [gathering] })
	}
	return [...groups.values()]
}

function drawPins(
	leaflet: LeafletLib,
	map: LeafletMap,
	markersRef: { current: Marker[] },
	fittedRef: { current: string },
	pins: Pin[],
	selectedId: string | null,
	onSelect: (id: string) => void
) {
	for (const marker of markersRef.current) marker.remove()
	markersRef.current = []
	map.invalidateSize()

	for (const pin of pins) {
		const selected = pin.gatherings.some((gathering) => gathering.id === selectedId)
		const count = pin.gatherings.length
		const names = pin.gatherings.map((gathering) => gatheringTitle(gathering.name)).join(", ")
		const size = selected ? 30 : count > 1 ? 26 : 18
		const icon = leaflet.divIcon({
			className: "devx-pin-wrap",
			html: `<button type="button" class="devx-pin${selected ? " is-selected" : ""}" aria-label="${escapeHtml(names)}">${count > 1 ? String(count) : ""}</button>`,
			iconSize: [size, size],
			iconAnchor: [size / 2, size / 2]
		})
		const marker = leaflet
			.marker([pin.place.lat, pin.place.lng], { icon, keyboard: true, title: names })
			.bindTooltip(pinLabel(pin.gatherings), {
				direction: "top",
				offset: [0, -10],
				opacity: 1,
				className: "devx-tip"
			})
			.addTo(map)
		marker.on("click", (event) => {
			leaflet.DomEvent.stopPropagation(event)
			onSelect(pin.gatherings[0].id)
		})
		markersRef.current.push(marker)
	}

	const signature = pins
		.map((pin) => pin.key)
		.sort()
		.join("|")
	const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
	if (signature !== fittedRef.current) {
		fittedRef.current = signature
		const padding = window.innerWidth < 700 ? 28 : 48
		if (pins.length === 1) {
			map.setView([pins[0].place.lat, pins[0].place.lng], 12, { animate: !reduce })
		} else if (pins.length > 1) {
			const bounds = leaflet.latLngBounds(pins.map((pin) => [pin.place.lat, pin.place.lng]))
			map.fitBounds(bounds, { padding: [padding, padding], maxZoom: 11, animate: !reduce })
		} else {
			map.setView(COUNTY, 9, { animate: false })
		}
		return
	}

	const selected = pins.find((pin) =>
		pin.gatherings.some((gathering) => gathering.id === selectedId)
	)
	if (!selected) return
	const latlng = leaflet.latLng(selected.place.lat, selected.place.lng)
	if (!map.getBounds().pad(-0.08).contains(latlng)) {
		map.panTo(latlng, { animate: !reduce, duration: reduce ? 0 : 0.7 })
	}
}

function pinLabel(gatherings: PublicGathering[]): string {
	const names = gatherings
		.slice(0, 3)
		.map((gathering) => escapeHtml(gatheringTitle(gathering.name)))
	const extra = gatherings.length - names.length
	const body = names.join("<br />")
	return extra > 0 ? `${body}<br />and ${extra} more` : body
}

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
}
