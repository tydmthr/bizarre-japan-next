// 今宵の異界：トップの日替わりフィーチャー枠。
// 2026-07-12 棚卸し採点（珍度4.5+・KEEP）から選定し、代表写真を1枚ずつ目視検品済み。
// 写真がフックを説明しない物件（認定証・看板・遠景等）は物件が強くても外している。次回棚卸しで更新。
export type FeaturedSpot = {
  id: string;
  ja: string;
  en: string;
  prefJa: string;
  prefEn: string;
  photo: string;
};

export const FEATURED_SPOTS: FeaturedSpot[] = [
  {"id": "spot-004", "ja": "桃太郎神社", "en": "桃太郎神社", "prefJa": "愛知県", "prefEn": "愛知県", "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/%E6%A1%83%E5%A4%AA%E9%83%8E%E7%A5%9E%E7%A4%BE_-_Aichi%2C_Inuyama%2C_Momotaro_shrine_%2814625579727%29.jpg/1280px-%E6%A1%83%E5%A4%AA%E9%83%8E%E7%A5%9E%E7%A4%BE_-_Aichi%2C_Inuyama%2C_Momotaro_shrine_%2814625579727%29.jpg"},
  {"id": "spot-011", "ja": "太陽の塔（内部）", "en": "太陽の塔（内部）", "prefJa": "大阪府", "prefEn": "大阪府", "photo": "https://live.staticflickr.com/3885/14600021529_4b504daeb5_b.jpg"},
  {"id": "spot-047", "ja": "伊豆極楽苑", "en": "伊豆極楽苑", "prefJa": "静岡県", "prefEn": "静岡県", "photo": "https://bizarrejapan.com/photos/spot-047.jpg"},
  {"id": "spot-053", "ja": "目黒寄生虫館", "en": "目黒寄生虫館", "prefJa": "東京都", "prefEn": "東京都", "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Exhibits_at_Meguro_Parasitological_Museum_10.jpg/1280px-Exhibits_at_Meguro_Parasitological_Museum_10.jpg"},
  {"id": "spot-056", "ja": "大観音寺・ルーブル彫刻美術館", "en": "大観音寺・ルーブル彫刻美術館", "prefJa": "三重県", "prefEn": "三重県", "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Louvre_Sculpture_Museum%2C_Mie.jpg/1280px-Louvre_Sculpture_Museum%2C_Mie.jpg"},
  {"id": "spot-083", "ja": "仙台大観音", "en": "仙台大観音", "prefJa": "宮城県", "prefEn": "宮城県", "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/%22Sendai_Daikannon%22_%2817158759727%29.jpg/1280px-%22Sendai_Daikannon%22_%2817158759727%29.jpg"},
  {"id": "spot-085", "ja": "B宝館", "en": "B宝館", "prefJa": "埼玉県", "prefEn": "埼玉県", "photo": "https://bizarrejapan.com/photos/spot-085.jpg"},
  {"id": "spot-093", "ja": "全興寺 地獄堂", "en": "全興寺 地獄堂", "prefJa": "大阪府", "prefEn": "大阪府", "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Senko-ji_%28Osaka_Hirano-ku%29_Temple_hdsr_S5_hh07.jpg/1280px-Senko-ji_%28Osaka_Hirano-ku%29_Temple_hdsr_S5_hh07.jpg"},
  {"id": "spot-102", "ja": "成田山 久留米分院 明王寺 地獄館", "en": "成田山 久留米分院 明王寺 地獄館", "prefJa": "福岡県", "prefEn": "福岡県", "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Jibo_Kannon_statue_and_Kaiunmon_Gate_in_Kurume_Narita-san.jpg/1280px-Jibo_Kannon_statue_and_Kaiunmon_Gate_in_Kurume_Narita-san.jpg"},
  {"id": "spot-240", "ja": "万治の石仏", "en": "万治の石仏", "prefJa": "長野県", "prefEn": "長野県", "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Manji-no_sekibutsu_%28stone_buddha%29_%2C_%E4%B8%87%E6%B2%BB%E3%81%AE%E7%9F%B3%E4%BB%8F_-_panoramio_%2811%29.jpg/1280px-Manji-no_sekibutsu_%28stone_buddha%29_%2C_%E4%B8%87%E6%B2%BB%E3%81%AE%E7%9F%B3%E4%BB%8F_-_panoramio_%2811%29.jpg"},
  {"id": "spot-243", "ja": "まぼろし博覧会", "en": "まぼろし博覧会", "prefJa": "静岡県", "prefEn": "静岡県", "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/%E9%AD%94%E7%95%8C%E7%A5%9E%E7%A4%BE_%E7%A5%AD%E7%A4%BC%E3%81%AE%E5%A4%95%E3%81%B9.jpg/1280px-%E9%AD%94%E7%95%8C%E7%A5%9E%E7%A4%BE_%E7%A5%AD%E7%A4%BC%E3%81%AE%E5%A4%95%E3%81%B9.jpg"},
  {"id": "spot-245", "ja": "南蔵院（釈迦涅槃像）", "en": "南蔵院（釈迦涅槃像）", "prefJa": "福岡県", "prefEn": "福岡県", "photo": "https://bizarrejapan.com/photos/spot-245.jpg"},
  {"id": "spot-246", "ja": "日輪寺（山鹿大仏・おびんずる様）", "en": "日輪寺（山鹿大仏・おびんずる様）", "prefJa": "熊本県", "prefEn": "熊本県", "photo": "https://bizarrejapan.com/photos/spot-246.jpg"},
  {"id": "spot-252", "ja": "黒神埋没鳥居（腹五社神社）", "en": "黒神埋没鳥居（腹五社神社）", "prefJa": "鹿児島県", "prefEn": "鹿児島県", "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Kurokami_Buried_Torii.jpg/1280px-Kurokami_Buried_Torii.jpg"},
  {"id": "spot-280", "ja": "会津さざえ堂（旧正宗寺三匝堂）", "en": "会津さざえ堂（旧正宗寺三匝堂）", "prefJa": "福島県", "prefEn": "福島県", "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Sazaedou_Aidu_Japan01.jpg/1280px-Sazaedou_Aidu_Japan01.jpg"},
  {"id": "spot-289", "ja": "沢田マンション", "en": "沢田マンション", "prefJa": "高知県", "prefEn": "高知県", "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Kochi_City_Sawada_Mansion_Aug._12%2C_2016.jpg/1280px-Kochi_City_Sawada_Mansion_Aug._12%2C_2016.jpg"},
];
