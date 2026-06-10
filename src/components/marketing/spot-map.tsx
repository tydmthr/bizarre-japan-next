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

/**
 * カテゴリ別マーカースタイル。
 *
 * 美意識方針：朱・金・墨の3色のみ（マット低彩度）＋形状差で4分類。
 * - folk    = 朱(shu)  ／ 円    祭の灯・血・暖色
 * - mystery = 鈍金(kin) ／ 菱形  神秘・聖性
 * - bkyu    = 墨(sumi) ／ 四角  人工物・コンクリ
 * - horror  = 墨(sumi) ／ 三角  警戒・廃墟
 *
 * これにより horror=紺・bkyu=緑 という SaaS 感の逸脱を排除し、
 * 色覚多様性にも優しい設計に。
 */
type MarkerShape = "circle" | "square" | "triangle" | "diamond";
type MarkerStyle = { color: string; shape: MarkerShape };

const CAT_STYLE: Record<Category, MarkerStyle> = {
  folk: { color: "#c8332b", shape: "circle" }, // 朱 shu-500
  mystery: { color: "#a87d2c", shape: "diamond" }, // 鈍金 kin-600
  bkyu: { color: "#3a2d24", shape: "square" }, // 墨 sumi-700
  horror: { color: "#1a1411", shape: "triangle" }, // 墨 sumi-900
};

/** SVG マーカー要素（map ピン用、DOM API で生成） */
function createMarkerElement(style: MarkerStyle): HTMLElement {
  const wrap = document.createElement("div");
  wrap.style.cursor = "pointer";
  wrap.style.filter = "drop-shadow(0 1px 2px rgba(0,0,0,0.4))";
  wrap.style.width = "14px";
  wrap.style.height = "14px";
  wrap.style.display = "block";

  const svgNs = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNs, "svg");
  svg.setAttribute("viewBox", "0 0 14 14");
  svg.setAttribute("width", "14");
  svg.setAttribute("height", "14");
  svg.style.display = "block";

  const stroke = "white";
  const strokeWidth = "1.5";

  if (style.shape === "circle") {
    const c = document.createElementNS(svgNs, "circle");
    c.setAttribute("cx", "7");
    c.setAttribute("cy", "7");
    c.setAttribute("r", "5.5");
    c.setAttribute("fill", style.color);
    c.setAttribute("stroke", stroke);
    c.setAttribute("stroke-width", strokeWidth);
    svg.appendChild(c);
  } else if (style.shape === "square") {
    const r = document.createElementNS(svgNs, "rect");
    r.setAttribute("x", "1.75");
    r.setAttribute("y", "1.75");
    r.setAttribute("width", "10.5");
    r.setAttribute("height", "10.5");
    r.setAttribute("fill", style.color);
    r.setAttribute("stroke", stroke);
    r.setAttribute("stroke-width", strokeWidth);
    svg.appendChild(r);
  } else if (style.shape === "triangle") {
    const p = document.createElementNS(svgNs, "polygon");
    p.setAttribute("points", "7,1.5 12.5,12 1.5,12");
    p.setAttribute("fill", style.color);
    p.setAttribute("stroke", stroke);
    p.setAttribute("stroke-width", strokeWidth);
    p.setAttribute("stroke-linejoin", "round");
    svg.appendChild(p);
  } else {
    // diamond
    const p = document.createElementNS(svgNs, "polygon");
    p.setAttribute("points", "7,1 13,7 7,13 1,7");
    p.setAttribute("fill", style.color);
    p.setAttribute("stroke", stroke);
    p.setAttribute("stroke-width", strokeWidth);
    p.setAttribute("stroke-linejoin", "round");
    svg.appendChild(p);
  }

  wrap.appendChild(svg);
  return wrap;
}

/** 凡例用 React SVG（map と認知統一）。サイズ 12px の軽量版 */
function LegendShape({ color, shape }: MarkerStyle) {
  const stroke = "white";
  const strokeWidth = 1.2;
  return (
    <svg
      viewBox="0 0 14 14"
      width={12}
      height={12}
      className="shrink-0"
      aria-hidden
      style={{ filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.3))" }}
    >
      {shape === "circle" && (
        <circle
          cx={7}
          cy={7}
          r={5.5}
          fill={color}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      )}
      {shape === "square" && (
        <rect
          x={1.75}
          y={1.75}
          width={10.5}
          height={10.5}
          fill={color}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      )}
      {shape === "triangle" && (
        <polygon
          points="7,1.5 12.5,12 1.5,12"
          fill={color}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
      )}
      {shape === "diamond" && (
        <polygon
          points="7,1 13,7 7,13 1,7"
          fill={color}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

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
      const style =
        CAT_STYLE[cat] ?? ({ color: "#777", shape: "circle" } as MarkerStyle);
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

      const el = createMarkerElement(style);

      const popupHtml = `
        <div style="font-family: system-ui, sans-serif; padding: 4px 6px;">
          <div style="font-size: 10px; letter-spacing: 0.2em; color: ${style.color}; text-transform: uppercase;">${it.type}</div>
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
              <LegendShape
                color={CAT_STYLE[c].color}
                shape={CAT_STYLE[c].shape}
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
