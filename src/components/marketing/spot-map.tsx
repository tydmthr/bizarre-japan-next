"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { StyleSpecification, Map as MlMap, Marker as MlMarker } from "maplibre-gl";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Spot, Festival, Category } from "@/lib/data";

const MAP_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "© OpenStreetMap contributors",
    },
  },
  layers: [
    {
      id: "osm",
      type: "raster",
      source: "osm",
      paint: {
        "raster-saturation": -0.35,
        "raster-brightness-max": 0.96,
      },
    },
  ],
};

const CAT_COLOR: Record<Category, string> = {
  folk: "#c8332b",
  mystery: "#a87d2c",
  horror: "#2a4d6e",
  bkyu: "#4a6840",
};

type Item =
  | { type: "spot"; data: Spot }
  | { type: "festival"; data: Festival };

type Filters = {
  spots: boolean;
  festivals: boolean;
  folk: boolean;
  bkyu: boolean;
  horror: boolean;
  mystery: boolean;
};

const DEFAULT_FILTERS: Filters = {
  spots: true,
  festivals: true,
  folk: true,
  bkyu: true,
  horror: true,
  mystery: true,
};

export function SpotMap({
  spots,
  festivals,
  lang = "ja",
}: {
  spots: Spot[];
  festivals: Festival[];
  lang?: "ja" | "en";
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MlMap | null>(null);
  const markersRef = useRef<MlMarker[]>([]);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const prefix = lang === "en" ? "/en" : "";

  // map init (once)
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: [137.5, 36.5],
      zoom: 4.8,
      attributionControl: { compact: true },
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const visibleItems: Item[] = useMemo(() => {
    const result: Item[] = [];
    if (filters.spots) {
      for (const s of spots) {
        if (!filters[s.category as Category]) continue;
        result.push({ type: "spot", data: s });
      }
    }
    if (filters.festivals) {
      for (const f of festivals) {
        if (!filters[f.category as Category]) continue;
        result.push({ type: "festival", data: f });
      }
    }
    return result;
  }, [spots, festivals, filters]);

  // re-render markers when filters change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // clear existing
    for (const m of markersRef.current) m.remove();
    markersRef.current = [];

    for (const it of visibleItems) {
      const d = it.data;
      const cat = d.category as Category;
      const color = CAT_COLOR[cat] ?? "#777";
      const href =
        it.type === "spot"
          ? `${prefix}/spots/${d.id}`
          : `${prefix}/festivals/${d.id}`;
      const label =
        lang === "en" && it.type === "spot"
          ? (d as Spot).name_en ?? d.name
          : d.name;
      const subtitle =
        it.type === "spot"
          ? `${(d as Spot).prefecture} ${(d as Spot).city}`
          : `${(d as Festival).prefecture} ／ ${(d as Festival).date_2026}`;

      const el = document.createElement("div");
      el.style.width = "12px";
      el.style.height = "12px";
      el.style.borderRadius = "50%";
      el.style.background = color;
      el.style.border = "2px solid white";
      el.style.boxShadow = "0 1px 3px rgba(0,0,0,0.4)";
      el.style.cursor = "pointer";

      const popupHtml = `
        <div style="font-family: system-ui, sans-serif; padding: 4px 6px;">
          <div style="font-size: 10px; letter-spacing: 0.2em; color: ${color}; text-transform: uppercase;">${it.type}</div>
          <a href="${href}" style="display:block; font-weight:700; color: #1a1411; font-size:13px; margin-top:2px;">${label}</a>
          <div style="font-size: 11px; color: #6a5d54; margin-top: 2px;">${subtitle}</div>
        </div>
      `;

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([d.lng, d.lat])
        .setPopup(new maplibregl.Popup({ closeButton: true, offset: 8 }).setHTML(popupHtml))
        .addTo(map);
      markersRef.current.push(marker);
    }
  }, [visibleItems, lang, prefix]);

  const labels =
    lang === "en"
      ? {
          spots: "Spots",
          festivals: "Festivals",
          folk: "Folk",
          bkyu: "B-Grade",
          horror: "Haunted",
          mystery: "Sacred",
          showing: (n: number) => `${n} items shown`,
        }
      : {
          spots: "珍スポット",
          festivals: "奇祭",
          folk: "土俗",
          bkyu: "B級",
          horror: "心霊",
          mystery: "聖地",
          showing: (n: number) => `表示中 ${n} 件`,
        };

  const toggle = (k: keyof Filters) =>
    setFilters((f) => ({ ...f, [k]: !f[k] }));

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] flex">
      <aside className="w-72 hidden md:flex flex-col bg-bg border-r border-border overflow-y-auto p-5 gap-6">
        <div>
          <p className="eyebrow mb-3">L A Y E R</p>
          <label className="flex items-center gap-2 text-sm py-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.spots}
              onChange={() => toggle("spots")}
              className="accent-accent"
            />
            <span>{labels.spots}</span>
          </label>
          <label className="flex items-center gap-2 text-sm py-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.festivals}
              onChange={() => toggle("festivals")}
              className="accent-accent"
            />
            <span>{labels.festivals}</span>
          </label>
        </div>

        <div>
          <p className="eyebrow mb-3">C A T E G O R Y</p>
          {(["folk", "bkyu", "horror", "mystery"] as const).map((c) => (
            <label
              key={c}
              className="flex items-center gap-2 text-sm py-1.5 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={filters[c]}
                onChange={() => toggle(c)}
                className="accent-accent"
              />
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ background: CAT_COLOR[c] }}
              />
              <span>{labels[c]}</span>
            </label>
          ))}
        </div>

        <p className="text-xs text-ink-mute tracking-wider mt-auto">
          {labels.showing(visibleItems.length)}
        </p>
      </aside>

      <div ref={containerRef} className="flex-1 h-full" />
    </div>
  );
}
