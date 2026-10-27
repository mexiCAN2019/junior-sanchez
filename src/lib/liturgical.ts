/**
 * A small, simplified Roman Rite liturgical calendar.
 *
 * It knows the seasons, the week of each season, the liturgical color, and a
 * handful of major feasts. It is not a full ordo (no ranking of memorials,
 * transferred solemnities, or national calendars), but it's right about what
 * color the vestments are on almost every day of the year.
 */

export type LitColor = "green" | "violet" | "rose" | "white" | "red";

export type SeasonKey =
  | "advent"
  | "christmas"
  | "ordinary1"
  | "lent"
  | "triduum"
  | "easter"
  | "ordinary2";

export interface Season {
  key: SeasonKey;
  name: string;
  color: LitColor;
  start: Date;
  end: Date; // inclusive
  days: number;
}

export interface LiturgicalYear {
  start: Date;
  end: Date; // inclusive
  easter: Date;
  seasons: Season[];
}

export interface LiturgicalDay {
  date: Date;
  season: Season;
  week: string;
  feast: string | null;
  color: LitColor;
}

export const COLOR_LABELS: Record<LitColor, string> = {
  green: "green",
  violet: "violet",
  rose: "rose",
  white: "white & gold",
  red: "red",
};

const DAY_MS = 86_400_000;
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const ymd = (y: number, m: number, d: number) => new Date(y, m, d);
const startOfDay = (d: Date) => ymd(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d: Date, n: number) => ymd(d.getFullYear(), d.getMonth(), d.getDate() + n);
// Rounding absorbs daylight-saving shifts.
const daysBetween = (a: Date, b: Date) => Math.round((b.getTime() - a.getTime()) / DAY_MS);
const sundayOnOrBefore = (d: Date) => addDays(d, -d.getDay());
const sameDay = (a: Date, b: Date) => daysBetween(a, b) === 0;

export function ordinal(n: number): string {
  const tens = n % 100;
  if (tens >= 11 && tens <= 13) return `${n}th`;
  return `${n}${["th", "st", "nd", "rd"][n % 10] ?? "th"}`;
}

/** Gregorian Easter (Anonymous / Meeus–Jones–Butcher algorithm). */
export function easterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return ymd(year, month - 1, day);
}

/** First Sunday of Advent: the fourth Sunday before Christmas. */
export function adventSunday(year: number): Date {
  const christmas = ymd(year, 11, 25);
  const dow = christmas.getDay();
  const fourthSunday = addDays(christmas, -(dow === 0 ? 7 : dow));
  return addDays(fourthSunday, -21);
}

/** Baptism of the Lord: the Sunday after January 6. */
function baptismOfTheLord(year: number): Date {
  const jan7 = ymd(year, 0, 7);
  return addDays(jan7, (7 - jan7.getDay()) % 7);
}

function season(key: SeasonKey, name: string, color: LitColor, start: Date, end: Date): Season {
  return { key, name, color, start, end, days: daysBetween(start, end) + 1 };
}

/** The liturgical year (Advent to Advent) that contains `date`. */
export function liturgicalYear(date: Date): LiturgicalYear {
  const day = startOfDay(date);
  const thisAdvent = adventSunday(day.getFullYear());
  // The calendar year in which this liturgical year's Easter falls.
  const y = day < thisAdvent ? day.getFullYear() : day.getFullYear() + 1;

  const advent = adventSunday(y - 1);
  const christmas = ymd(y - 1, 11, 25);
  const baptism = baptismOfTheLord(y);
  const easter = easterSunday(y);
  const ashWednesday = addDays(easter, -46);
  const pentecost = addDays(easter, 49);
  const nextAdvent = adventSunday(y);

  return {
    start: advent,
    end: addDays(nextAdvent, -1),
    easter,
    seasons: [
      season("advent", "Advent", "violet", advent, addDays(christmas, -1)),
      season("christmas", "Christmas", "white", christmas, baptism),
      season("ordinary1", "Ordinary Time", "green", addDays(baptism, 1), addDays(ashWednesday, -1)),
      season("lent", "Lent", "violet", ashWednesday, addDays(easter, -4)),
      season("triduum", "Paschal Triduum", "red", addDays(easter, -3), addDays(easter, -1)),
      season("easter", "Easter", "white", easter, pentecost),
      season("ordinary2", "Ordinary Time", "green", addDays(pentecost, 1), addDays(nextAdvent, -1)),
    ],
  };
}

type Feast = [date: Date, name: string, color: LitColor];

function feasts(day: Date, year: LiturgicalYear): Feast[] {
  const E = year.easter;
  const y = day.getFullYear();
  return [
    [addDays(year.start, 14), "Gaudete Sunday", "rose"],
    [addDays(E, -46), "Ash Wednesday", "violet"],
    [addDays(E, -21), "Laetare Sunday", "rose"],
    [addDays(E, -7), "Palm Sunday of the Passion of the Lord", "red"],
    [addDays(E, -3), "Holy Thursday", "white"],
    [addDays(E, -2), "Good Friday of the Passion of the Lord", "red"],
    [addDays(E, -1), "Holy Saturday", "violet"],
    [E, "Easter Sunday of the Resurrection of the Lord", "white"],
    [addDays(E, 7), "Divine Mercy Sunday", "white"],
    [addDays(E, 49), "Pentecost Sunday", "red"],
    [addDays(E, 56), "The Most Holy Trinity", "white"],
    [addDays(year.end, -6), "Our Lord Jesus Christ, King of the Universe", "white"],
    [ymd(y, 0, 1), "Mary, the Holy Mother of God", "white"],
    [ymd(y, 0, 6), "The Epiphany of the Lord", "white"],
    [ymd(y, 2, 19), "Saint Joseph, Spouse of the Blessed Virgin Mary", "white"],
    [ymd(y, 2, 25), "The Annunciation of the Lord", "white"],
    [ymd(y, 5, 29), "Saints Peter and Paul, Apostles", "red"],
    [ymd(y, 7, 15), "The Assumption of the Blessed Virgin Mary", "white"],
    [ymd(y, 10, 1), "All Saints", "white"],
    [ymd(y, 10, 2), "All Souls", "violet"],
    [ymd(y, 11, 8), "The Immaculate Conception", "white"],
    [ymd(y, 11, 25), "The Nativity of the Lord", "white"],
  ];
}

function weekLabel(day: Date, s: Season, year: LiturgicalYear): string {
  const sunday = sundayOnOrBefore(day);
  const weeksSince = (from: Date) => Math.floor(daysBetween(from, sunday) / 7) + 1;
  const E = year.easter;

  switch (s.key) {
    case "advent":
      return `${ordinal(weeksSince(s.start))} Week of Advent`;
    case "christmas":
      return "Christmas Season";
    case "ordinary1":
      // The week that begins with the Baptism of the Lord is the first week.
      return `${ordinal(weeksSince(addDays(s.start, -1)))} Week in Ordinary Time`;
    case "lent": {
      const firstSunday = addDays(s.start, 4);
      if (day < firstSunday) return "Days after Ash Wednesday";
      if (sunday >= addDays(E, -7)) return "Holy Week";
      return `${ordinal(weeksSince(firstSunday))} Week of Lent`;
    }
    case "triduum":
      return "Paschal Triduum";
    case "easter":
      if (sameDay(sunday, s.end)) return "Pentecost";
      if (sameDay(sunday, E)) return "Octave of Easter";
      return `${ordinal(weeksSince(E))} Week of Easter`;
    case "ordinary2": {
      // Counted backwards: Christ the King begins the 34th week.
      const christTheKing = addDays(year.end, -6);
      return `${ordinal(34 - daysBetween(sunday, christTheKing) / 7)} Week in Ordinary Time`;
    }
  }
}

export function describeDay(date: Date): LiturgicalDay {
  const day = startOfDay(date);
  const year = liturgicalYear(day);
  const s = year.seasons.find((x) => day >= x.start && day <= x.end) ?? year.seasons[0];
  const feast = feasts(day, year).find(([d]) => sameDay(d, day));
  return {
    date: day,
    season: s,
    week: weekLabel(day, s, year),
    feast: feast?.[1] ?? null,
    color: feast?.[2] ?? s.color,
  };
}

export function weekdayName(date: Date): string {
  return WEEKDAYS[date.getDay()];
}

/** "29th Sunday in Ordinary Time", "Tuesday of the 2nd Week of Lent", "Friday · Christmas Season". */
export function dayTitle(day: LiturgicalDay): { lead: string; joiner: string; rest: string } {
  const weekday = weekdayName(day.date);
  const numbered = /^\d/.test(day.week);
  if (numbered && day.date.getDay() === 0) {
    return { lead: day.week.replace(" Week", " Sunday"), joiner: "", rest: "" };
  }
  if (numbered || day.week === "Holy Week") {
    return { lead: weekday, joiner: numbered ? " of the " : " of ", rest: day.week };
  }
  return { lead: weekday, joiner: " · ", rest: day.week };
}

/** Where `date` falls in its liturgical year, from 0 to 1. */
export function yearProgress(date: Date, year: LiturgicalYear): number {
  const total = daysBetween(year.start, year.end) + 1;
  return (daysBetween(year.start, startOfDay(date)) + 0.5) / total;
}

/** The canonical hour of the Liturgy of the Hours closest to the local time. */
export function canonicalHour(date: Date): string {
  const h = date.getHours();
  if (h < 5) return "Matins";
  if (h < 9) return "Lauds";
  if (h < 12) return "Terce";
  if (h < 15) return "Sext";
  if (h < 17) return "None";
  if (h < 20) return "Vespers";
  return "Compline";
}
