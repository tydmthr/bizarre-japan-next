/**
 * 多言語辞書とパス変換ヘルパ。
 * 旧サイトに倣って `/` を JA、`/en/...` を EN とする URL 構造。
 */

export type Lang = "ja" | "en";

export function getLangFromPath(pathname: string): Lang {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "ja";
}

/** "/en" or "" のプレフィックスを返す */
export function langPrefix(lang: Lang): string {
  return lang === "en" ? "/en" : "";
}

/** あるパスを反対の言語に切り替えるための href を計算 */
export function altLangHref(lang: Lang, pathname: string): string {
  if (lang === "ja") {
    // ja → en
    return pathname === "/" ? "/en" : `/en${pathname}`;
  } else {
    // en → ja
    const stripped = pathname.replace(/^\/en/, "");
    return stripped || "/";
  }
}

export const DICT = {
  ja: {
    brandSub: "BIZARRE JAPAN",
    nav: {
      home: "序",
      map: "地図",
      calendar: "祭暦",
      list: "名鑑",
      routes: "巡路",
    },
    langSwitchLabel: "EN",
    langSwitchTitle: "English",
    nophoto: "N O P H O T O",
    hero: {
      eyebrow: "日 本 全 国 ／ 異 界 案 内",
      title: ["日本は、", "まだ変だ。", "よかった。"] as const,
      lede: [
        "表通りの観光案内には載らない。",
        "しかし確かに其処にある——個人が一生をかけて作り上げたコンクリートの楽園。",
        "千年続く土俗の祭礼。語り継がれた廃墟と祠。",
      ] as const,
      ledeStrong: (s: number, f: number) =>
        `日本全国の珍スポット${s}件と奇祭${f}件を、地図と暦で巡る。`,
      ctaMap: "地図で巡る",
      ctaCalendar: "祭暦を開く",
      upcoming: {
        title: "直近の異界 — 巡るべき日々",
        subThisMonth: (month: number) => `${month}月`,
        subAhead: "次なる祭礼",
        empty: "今後の登録奇祭はありません。地図から珍スポットを巡ってみてください。",
      },
      realmsTitle: "四 つ の 異 界",
      note: [
        "※ 心霊スポット・廃墟は来訪を推奨しません。歴史と来歴の記録として収録しています。",
        "※ 祭事日程は2026年5月〜2027年4月の年間サイクルを基準。詳細は必ず公式情報で確認を。",
      ] as const,
      statLabels: {
        spots: "珍スポット",
        festivals: "奇祭・暦",
        prefectures: "府県",
      },
    },
    realms: [
      { glyph: "祓", title: "土俗・奇祭", body: "性、火、裸、奇習。\n千年の信仰の核心。" },
      { glyph: "魁", title: "B級・カオス", body: "個人が作った珍博物館、\nコンクリート像群。" },
      { glyph: "霊", title: "心霊・廃墟", body: "有名心霊、廃墟、\nいわく付きの場所。" },
      { glyph: "秘", title: "聖地・ミステリー", body: "巨石、UFO、ピラミッド、\n超古代史の影。" },
    ] as const,
    section: {
      highlights: "見どころ",
      meta: "基本情報",
      deepdive: "深掘り",
      reference: "参考リンク",
      back: "← 戻る",
    },
    index: {
      eyebrow: "I N D E X",
      title: "百景名鑑",
      lede: (s: number, f: number) =>
        `日本全国の珍スポット ${s} 件と奇祭 ${f} 件。タブ・カテゴリ・検索で絞り込める。`,
      tabSpots: (n: number) => `スポット ${n}`,
      tabFestivals: (n: number) => `奇祭 ${n}`,
      catLabels: { all: "すべて", folk: "土俗", bkyu: "B級", horror: "心霊", mystery: "聖地" } as const,
      searchPlaceholder: "名前・地域で絞る",
      countSuffix: (n: number) => `該当 ${n} 件`,
      noResults: "該当なし。条件を緩めてみてください。",
      detailLabel: "詳細",
    },
    map: {
      eyebrow: "M A P",
      title: "地図で巡る",
      legend: "凡例",
      filters: "絞り込み",
      catAll: "すべて",
    },
    calendar: {
      eyebrow: "C A L E N D A R",
      title: "奇祭暦 — 一年で日本が一番ヤバい日々",
      sub: "2026年5月 〜 2027年4月",
    },
    routes: {
      eyebrow: "R O U T E S",
      title: "巡礼コース — 半日・一日で巡る異界",
      sub: "テーマ別に厳選した巡礼ルート。地図で開けば順路が描かれる。",
      duration: "所要",
      season: "季節",
      stopsLabel: (n: number) => `${n} 箇所`,
    },
    breadcrumb: {
      home: "序",
      list: "名鑑",
      calendar: "祭暦",
      map: "地図",
      routes: "巡路",
    },
  },
  en: {
    brandSub: "STRANGE SPOTS & WILD FESTIVALS",
    nav: {
      home: "Home",
      map: "Map",
      calendar: "Calendar",
      list: "Index",
      routes: "Routes",
    },
    langSwitchLabel: "JA",
    langSwitchTitle: "日本語",
    nophoto: "N O P H O T O",
    hero: {
      eyebrow: "A C R O S S J A P A N ／ P A R A L L E L J A P A N",
      title: ["Japan is", "still weird.", "Thank god."] as const,
      lede: [
        "You won't find these in a tourist brochure.",
        "But they exist — concrete paradises built by lifelong obsessives.",
        "Folk rituals carrying a thousand years of fire and flesh.",
      ] as const,
      ledeStrong: (s: number, f: number) =>
        `${s} strange spots and ${f} wild festivals across Japan, mapped and dated.`,
      ctaMap: "Open Map",
      ctaCalendar: "Festival Calendar",
      upcoming: {
        title: "Festivals Ahead — Upcoming Rituals",
        subThisMonth: (month: number) => {
          const names = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          return names[month] ?? "";
        },
        subAhead: "Festivals Ahead",
        empty: "No upcoming festivals registered — explore the map instead.",
      },
      realmsTitle: "F O U R R E A L M S",
      note: [
        "Note: This is a cultural / historical archive. We do not recommend visiting haunted ruins or trespassing on private property.",
        "Festival dates cover May 2026 – April 2027. Always confirm with official sources before traveling.",
      ] as const,
      statLabels: {
        spots: "Strange Spots",
        festivals: "Wild Festivals",
        prefectures: "Prefectures",
      },
    },
    realms: [
      { glyph: "祓", title: "Folk & Ritual", body: "Sex, fire, flesh, archaic rites.\nThe molten core of belief." },
      { glyph: "魁", title: "B-Grade Chaos", body: "One-man museums, concrete kingdoms,\nobsessive private worlds." },
      { glyph: "霊", title: "Haunted & Ruined", body: "Famous haunted sites,\nruins, places with a name." },
      { glyph: "秘", title: "Sacred & Strange", body: "Megaliths, UFO lore,\npyramids, lost ancient histories." },
    ] as const,
    section: {
      highlights: "Highlights",
      meta: "Essentials",
      deepdive: "Deep Dive",
      reference: "References",
      back: "← Back",
    },
    index: {
      eyebrow: "I N D E X",
      title: "Index of Wonders",
      lede: (s: number, f: number) =>
        `${s} strange spots and ${f} wild festivals across Japan. Filter by tab, category, or search.`,
      tabSpots: (n: number) => `Spots — ${n}`,
      tabFestivals: (n: number) => `Festivals — ${n}`,
      catLabels: { all: "All", folk: "Folk", bkyu: "B-Grade", horror: "Haunted", mystery: "Sacred" } as const,
      searchPlaceholder: "Search (name, region)",
      countSuffix: (n: number) => `${n} matches`,
      noResults: "No matches. Try a broader filter.",
      detailLabel: "Detail",
    },
    map: {
      eyebrow: "M A P",
      title: "Open Map",
      legend: "Legend",
      filters: "Filters",
      catAll: "All",
    },
    calendar: {
      eyebrow: "C A L E N D A R",
      title: "Festival Calendar — Japan's Wildest Days",
      sub: "May 2026 – April 2027",
    },
    routes: {
      eyebrow: "R O U T E S",
      title: "Pilgrim Routes — Half-Day & Full-Day Tours",
      sub: "Hand-picked themed routes. Open in the map to see the path drawn.",
      duration: "Duration",
      season: "Season",
      stopsLabel: (n: number) => `${n} stops`,
    },
    breadcrumb: {
      home: "Home",
      list: "Index",
      calendar: "Calendar",
      map: "Map",
      routes: "Routes",
    },
  },
} as const;

export function dict(lang: Lang) {
  return DICT[lang];
}
