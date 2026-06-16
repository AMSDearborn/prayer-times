import { useCallback, useEffect, useRef, useState } from "react";

import { HIJRI_MONTHS_EN } from "../constants";

const PRAYERS = [
  { key: "Fajr", label: "Fajr", labelAr: "الفجر" },
  { key: "Sunrise", label: "Sunrise", labelAr: "الشروق" },
  { key: "Dhuhr", label: "Dhuhr", labelAr: "الظهر" },
  { key: "Asr", label: "Asr", labelAr: "العصر" },
  { key: "Maghrib", label: "Maghrib", labelAr: "المغرب" },
  { key: "Isha", label: "Isha", labelAr: "العشاء" },
];

const API_BASE = "https://api.aladhan.com/v1";
const LOCATION = { latitude: 42.304304, longitude: -83.143549 };

function formatTime12(timeString) {
  const raw = timeString.split(" ")[0];
  let [hours, minutes] = raw.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  if (hours > 12) hours -= 12;
  if (hours === 0) hours = 12;
  return `${hours}:${minutes.toString().padStart(2, "0")} ${period}`;
}

function timeToMinutesFromMidnight(timeString) {
  const raw = timeString.split(" ")[0];
  const [hours, minutes] = raw.split(":").map(Number);
  return hours * 60 + minutes;
}

function computeNextPrayer(timings) {
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  for (const prayer of PRAYERS) {
    const minutes = timeToMinutesFromMidnight(timings[prayer.key]);
    if (minutes > nowMinutes) {
      const delta = minutes - nowMinutes;
      return {
        key: prayer.key,
        label: prayer.label,
        countdown: formatDelta(delta),
      };
    }
  }

  // After Isha — next is tomorrow's Fajr
  return {
    key: "Fajr",
    label: "Fajr (tomorrow)",
    countdown: null,
  };
}

function formatDelta(minutes) {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

function formatGregorianDate(gregorian) {
  return `${gregorian.weekday.en}, ${gregorian.month.en} ${parseInt(gregorian.day)}, ${gregorian.year}`;
}

function formatHijriDate(hijri) {
  const monthIndex = parseInt(hijri.month.number) - 1;
  const en = HIJRI_MONTHS_EN[monthIndex];
  return { en: `${parseInt(hijri.day)} ${en} ${hijri.year}` };
}

function getWeekDates(today) {
  const dates = [];
  for (let i = -3; i <= 3; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d);
  }
  return dates;
}

function formatDateParam(date) {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

export default function PrayerTimesWidget() {
  const [view, setView] = useState("today"); // "today" | "week"
  const [todayData, setTodayData] = useState(null);
  const [weekData, setWeekData] = useState(null);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);

  const fetchTodayData = useCallback(async () => {
    const today = new Date();
    const dateParam = formatDateParam(today);
    try {
      const res = await fetch(
        `${API_BASE}/timings/${dateParam}?latitude=${LOCATION.latitude}&longitude=${LOCATION.longitude}&method=2&school=0`,
      );
      const json = await res.json();
      setTodayData(json.data);
    } catch (err) {
      console.error("Failed to fetch today's prayer times:", err);
    }
  }, []);

  const fetchWeekData = useCallback(async () => {
    const today = new Date();
    const dates = getWeekDates(today);
    try {
      const results = await Promise.all(
        dates.map(async (d) => {
          const res = await fetch(
            `${API_BASE}/timings/${formatDateParam(d)}?latitude=${LOCATION.latitude}&longitude=${LOCATION.longitude}&method=2&school=0`,
          );
          const json = await res.json();
          return json.data;
        }),
      );
      setWeekData(results);
    } catch (err) {
      console.error("Failed to fetch week prayer times:", err);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchTodayData();
      setLoading(false);
    };
    init();
  }, [fetchTodayData]);

  useEffect(() => {
    if (view === "week" && !weekData) {
      fetchWeekData();
    }
  }, [view, weekData, fetchWeekData]);

  // Countdown timer
  useEffect(() => {
    if (!todayData) return;

    function tick() {
      setNextPrayer(computeNextPrayer(todayData.timings));
    }
    tick();
    intervalRef.current = setInterval(tick, 30_000);
    return () => clearInterval(intervalRef.current);
  }, [todayData]);

  if (loading || !todayData) {
    return (
      <div className="bg-cream-50 border-cream-300/70 mx-auto max-w-4xl border-y px-6 py-16">
        <p className="text-ink-500 text-center">Loading prayer times...</p>
      </div>
    );
  }

  const gregorianDate = formatGregorianDate(todayData.date.gregorian);
  const hijriDate = formatHijriDate(todayData.date.hijri);

  return (
    <section
      aria-labelledby="widget-prayer-times-heading"
      className="relative isolate overflow-hidden border-y border-[#e8dcc5]/70 bg-[#fdfbf7] print:hidden"
    >
      {/* Geometric background */}
      <div
        aria-hidden
        className="bg-geometric pointer-events-none absolute inset-0 opacity-50"
      />

      <div className="relative mx-auto max-w-4xl px-6 py-12 lg:px-10 lg:py-16">
        {/* Header area */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-8">
            <div className="flex flex-col">
              <span className="font-manrope text-[10px] font-semibold tracking-[0.22em] text-[#a88b5e] uppercase">
                Gregorian
              </span>
              <span className="font-fraunces text-2xl tracking-tight text-[#1f1b16] lg:text-[26px]">
                {gregorianDate}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-manrope text-[10px] font-semibold tracking-[0.22em] text-[#a88b5e] uppercase">
                Hijri
              </span>
              <span className="font-fraunces text-2xl tracking-tight text-[#1f1b16] lg:text-[26px]">
                {hijriDate.en}
              </span>
            </div>
          </div>

          {/* Next prayer countdown */}
          {nextPrayer && (
            <p
              role="status"
              aria-live="polite"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-[#fbf2f3] px-3 py-1 font-manrope text-[12.5px] font-medium tracking-wide text-(--color-maroon)"
            >
              <span
                aria-hidden
                className="h-1.5 w-1.5 animate-pulse rounded-full bg-(--color-maroon)"
              />
              {nextPrayer.countdown
                ? `Next: ${nextPrayer.label} in ${nextPrayer.countdown}`
                : `Next: ${nextPrayer.label}`}
            </p>
          )}
        </div>

        {/* View toggle + Print button */}
        <div className="mt-8 flex items-center gap-2">
          <button
            onClick={() => setView("today")}
            className={`rounded-full px-4 py-1.5 text-[13px] font-semibold tracking-wide transition-colors ${
              view === "today"
                ? "bg-(--color-maroon) text-white"
                : "border border-[#e8dcc5] bg-white text-[#3a342e]"
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setView("week")}
            className={`rounded-full px-4 py-1.5 text-[13px] font-semibold tracking-wide transition-colors ${
              view === "week"
                ? "bg-(--color-maroon) text-white"
                : "border border-[#e8dcc5] bg-white text-[#3a342e]"
            }`}
          >
            This Week
          </button>

          <button
            onClick={() => window.print()}
            className="ml-auto inline-flex items-center gap-2 rounded-full border border-[#e8dcc5] bg-white px-4 py-1.5 text-[13px] font-semibold tracking-wide text-[#3a342e] transition-colors hover:border-(--color-maroon) hover:bg-(--color-maroon) hover:text-white"
          >
            <PrinterIcon />
            Print Monthly
          </button>
        </div>

        {/* Prayer times */}
        {view === "today" && (
          <TodayView timings={todayData.timings} nextPrayer={nextPrayer} />
        )}
        {view === "week" && (
          <WeekView weekData={weekData} todayData={todayData} />
        )}

        {/* Khutbah info */}
        <div className="mt-6 border-t border-[#e8dcc5]/70 pt-6 text-[13px]">
          <p className="text-[#6f6862]">
            <span className="font-medium text-[#3a342e]">Friday Khutbah:</span>{" "}
            Arabic 12:00 PM · English 1:00 PM
          </p>
        </div>
      </div>
    </section>
  );
}

function TodayView({ timings, nextPrayer }) {
  return (
    <ul
      role="list"
      className="mt-6 grid grid-cols-2 overflow-hidden rounded-lg border border-[#e8dcc5]/70 bg-white/60 sm:grid-cols-3 lg:grid-cols-6"
    >
      {PRAYERS.map(({ key, label }, i) => {
        const isNext = nextPrayer?.key === key;
        return (
          <li
            key={key}
            className={[
              "flex flex-col items-start gap-1 p-5 transition-all",
              i < PRAYERS.length - 1
                ? "border-b lg:border-r lg:border-b-0"
                : "",
              i % 2 === 0 ? "border-r sm:border-r" : "",
              "border-[#e8dcc5]/70",
              isNext
                ? "relative z-10 rounded-sm ring-2 ring-(--color-maroon) ring-offset-2 ring-offset-[#fdfbf7]"
                : "",
            ].join(" ")}
          >
            <span className="font-manrope text-[10px] font-semibold tracking-[0.22em] text-[#a88b5e] uppercase">
              {label}
            </span>
            <span className="font-fraunces mt-1 whitespace-nowrap text-xl tracking-tight text-[#1f1b16] tabular-nums sm:text-2xl lg:text-[22px]">
              {formatTime12(timings[key])}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function WeekView({ weekData, todayData }) {
  if (!weekData) {
    return (
      <p className="mt-6 text-center text-sm text-[#6f6862]">
        Loading week data...
      </p>
    );
  }

  const todayStr = todayData.date.gregorian.date;

  return (
    <div className="mt-6 overflow-x-auto rounded-lg border border-[#e8dcc5]/70 bg-white/60">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-[#e8dcc5]/70 bg-[#faf7f2]">
            <th className="font-manrope px-3 py-2 text-[10px] font-semibold tracking-[0.22em] text-[#a88b5e] uppercase">
              Day
            </th>
            <th className="font-manrope px-2 py-2 text-[10px] font-semibold tracking-[0.22em] text-[#a88b5e] uppercase">
              Date
            </th>
            <th className="font-manrope px-2 py-2 text-[10px] font-semibold tracking-[0.22em] text-[#a88b5e] uppercase">
              Hijri
            </th>
            {PRAYERS.map(({ label }) => (
              <th
                key={label}
                className="font-manrope px-2 py-2 text-center text-[10px] font-semibold tracking-[0.22em] text-[#a88b5e] uppercase"
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weekData.map((day) => {
            const isToday = day.date.gregorian.date === todayStr;
            const gregDay = parseInt(day.date.gregorian.day);
            const monthShort = day.date.gregorian.month.en.substring(0, 3);

            return (
              <tr
                key={day.date.gregorian.date}
                className={[
                  "border-b border-[#e8dcc5]/70 last:border-b-0",
                  isToday ? "bg-[#fbf2f3]" : "",
                ].join(" ")}
              >
                <td className="font-manrope px-3 py-2 text-[13px] font-medium whitespace-nowrap text-[#3a342e]">
                  {day.date.gregorian.weekday.en}
                </td>
                <td className="font-manrope px-2 py-2 text-[13px] whitespace-nowrap text-[#3a342e]">
                  {monthShort} {gregDay}
                </td>
                <td className="font-manrope px-2 py-2 text-[13px] whitespace-nowrap text-[#6f6862]">
                  {parseInt(day.date.hijri.day)} {HIJRI_MONTHS_EN[parseInt(day.date.hijri.month.number) - 1]}
                </td>
                {PRAYERS.map(({ key }) => (
                  <td
                    key={key}
                    className="font-fraunces px-2 py-2 text-center text-[15px] tracking-tight text-[#1f1b16] tabular-nums"
                  >
                    {formatTime12(day.timings[key])}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function PrinterIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="6"
        y="14"
        width="12"
        height="8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
