import {
  ARABIC_DAY_CORRECTIONS,
  DAY_ABBREVIATIONS,
  HIJRI_MONTHS_AR,
  HIJRI_MONTHS_EN,
} from "../constants";
import Header from "./Header";

export default function PrayerTable({
  monthData,
  month,
  loading,
  error,
  basePath = "/",
}) {
  const isRamadan = parseInt(month) === 9;

  let previousDhuhrMinutes = null;
  const rows = [];
  let gregHeader = null;
  let hijriHeader = null;

  if (monthData) {
    const firstGregorian = monthData[0].date.gregorian;
    const lastGregorian = monthData[monthData.length - 1].date.gregorian;

    const hijriMonthIndex = parseInt(monthData[0].date.hijri.month.number) - 1;
    const hijriEnglish = HIJRI_MONTHS_EN[hijriMonthIndex];
    const hijriArabic = HIJRI_MONTHS_AR[hijriMonthIndex];

    gregHeader = (
      <>
        {firstGregorian.month.en.substring(0, 3)} {firstGregorian.day} -
        <br />
        {lastGregorian.month.en.substring(0, 3)} {lastGregorian.day}
      </>
    );

    hijriHeader = (
      <>
        <span>{hijriArabic}</span>
        <br />
        <span>{hijriEnglish}</span>
      </>
    );

    monthData.forEach((day, index) => {
      const timings = day.timings;
      const dhuhrRaw = timings.Dhuhr.split(" ")[0];
      const dhuhrMinutes = timeToMinutes(dhuhrRaw);

      if (
        previousDhuhrMinutes !== null &&
        Math.abs(dhuhrMinutes - previousDhuhrMinutes) >= 45
      ) {
        rows.push(
          <tr key={`dst-${index}`}>
            <td
              colSpan="10"
              className="h-[6px] border-x-0 border-y-2 border-dashed border-(--color-gold) p-0"
            ></td>
          </tr>,
        );
      }
      previousDhuhrMinutes = dhuhrMinutes;

      const isFriday = day.date.gregorian.weekday.en === "Friday";

      const dayEnglish =
        DAY_ABBREVIATIONS[day.date.gregorian.weekday.en] ||
        day.date.gregorian.weekday.en.substring(0, 3).toUpperCase();

      const dayArabic =
        ARABIC_DAY_CORRECTIONS[day.date.hijri.weekday.ar] ||
        day.date.hijri.weekday.ar;

      const gregorianDay = day.date.gregorian.day;
      const showMonth = index === 0 || gregorianDay === "01";

      const cellState = { isFriday, isRamadan };

      rows.push(
        <tr key={index}>
          {PRAYER_COLUMNS.map((column, columnIndex) => (
            <td
              key={column.key}
              className={prayerCellClass(column, cellState, columnIndex === 0)}
            >
              {formatTime(timings[column.key])}
            </td>
          ))}
          <td
            className={`font-gill-sans-nova border border-r-0 border-(--color-border) px-1 py-0 text-[20px] font-bold ${isFriday ? FRIDAY_CELL : "bg-white"}`}
          >
            {dayEnglish}
          </td>
          <td
            className={`border border-l-0 border-(--color-border) px-1 py-0 text-[20px] font-bold ${isFriday ? FRIDAY_CELL : "bg-white"}`}
          >
            {dayArabic}
          </td>
          <td
            className={`border border-(--color-border) bg-(--color-even-bg) px-1 py-0 text-[20px] ${isFriday ? FRIDAY_CELL : "bg-white"}`}
          >
            {showMonth && (
              <span className="text-[0.75em]">
                {day.date.gregorian.month.en.substring(0, 3)}{" "}
              </span>
            )}
            {gregorianDay}
          </td>
          <td
            className={`border border-r-0 border-(--color-border) px-1 py-0 text-[20px] ${isFriday ? FRIDAY_CELL : "bg-white"}`}
          >
            {day.date.hijri.day}
          </td>
        </tr>,
      );
    });
  }

  return (
    <section className="mx-auto h-[14in] w-[8.5in] bg-white shadow-[0_1px_1px_rgba(0,0,0,0.04),0_10px_20px_rgba(0,0,0,0.12),0_28px_50px_rgba(0,0,0,0.18)] ring-1 ring-black/5 print:mx-0 print:shadow-none print:ring-0">
      <Header monthData={monthData} month={month} basePath={basePath} />
      {loading && (
        <p className="p-[50px] text-center text-[18px]">
          Loading calendar data...
        </p>
      )}
      {error && (
        <p className="p-[50px] text-center text-[18px] text-red-500">{error}</p>
      )}
      {monthData && (
        <table className="h-[12in] w-full table-fixed border-collapse border-t-0 border-r-(length:--border-width) border-b-(length:--border-width) border-l-(length:--border-width) border-solid border-(--color-maroon) text-center">
          <thead className="text-[16px] font-semibold">
            <tr>
              <th className="font-gill-sans-nova bg-(--color-maroon) px-1 py-0.5 leading-[1.1] font-semibold text-white">
                العشاء
                <br />
                Isha
              </th>
              <th className="font-gill-sans-nova bg-(--color-maroon) px-1 py-0.5 leading-[1.1] font-semibold text-white">
                المغرب
                <br />
                Maghrib
              </th>
              <th className="font-gill-sans-nova bg-(--color-maroon) px-1 py-0.5 leading-[1.1] font-semibold text-white">
                العصر
                <br />
                Asr
              </th>
              <th className="font-gill-sans-nova bg-(--color-maroon) px-1 py-0.5 leading-[1.1] font-semibold text-white">
                الظهر
                <br />
                Dhuhr
              </th>
              <th className="font-gill-sans-nova bg-(--color-maroon) px-1 py-0.5 leading-[1.1] font-semibold text-white">
                الشروق
                <br />
                Sunrise
              </th>
              <th className="font-gill-sans-nova bg-(--color-maroon) px-1 py-0.5 leading-[1.1] font-semibold text-white">
                الفجر
                <br />
                Fajr
              </th>
              <th
                colSpan="2"
                className="font-gill-sans-nova bg-(--color-maroon) px-1 py-0.5 leading-[1.1] font-semibold text-white"
              >
                اليوم
                <br />
                Day
              </th>
              <th className="bg-(--color-maroon) px-1 py-0.5 leading-[1.1] font-semibold text-white">
                {gregHeader}
              </th>
              <th className="font-gill-sans-nova w-[111px] bg-(--color-maroon) px-1 py-0.5 leading-[1.1] font-semibold text-white">
                {hijriHeader}
              </th>
            </tr>
          </thead>
          <tbody className="[&_tr:first-child_td]:border-t-0">{rows}</tbody>
        </table>
      )}
    </section>
  );
}

function formatTime(timeString) {
  let [hours, minutes] = timeString.split(" ")[0].split(":").map(Number);
  if (hours > 12) hours -= 12;
  if (hours === 0) hours = 12;
  return `${hours}:${minutes.toString().padStart(2, "0")}`;
}

function timeToMinutes(timeString) {
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
}

function prayerCellClass(column, { isFriday, isRamadan }, isFirst) {
  const leftBorder = isFirst ? "border-l-0" : "";

  if (isFriday) return `border ${leftBorder} ${FRIDAY_CELL}`;
  if (column.ramadan && isRamadan)
    return `border ${leftBorder} ${RAMADAN_CELL}`;

  const background = column.even ? "bg-(--color-even-bg)" : "bg-white";
  return `border ${leftBorder} border-(--color-border) px-1 py-0 text-[20px] ${background}`;
}

// Prayer columns in display order: key matches the API's `timings` object,
// `even` alternates the zebra-stripe background, `ramadan` marks columns
// that get the Ramadan highlight (Maghrib and Fajr).
const PRAYER_COLUMNS = [
  { key: "Isha", even: false, ramadan: false },
  { key: "Maghrib", even: true, ramadan: true },
  { key: "Asr", even: false, ramadan: false },
  { key: "Dhuhr", even: true, ramadan: false },
  { key: "Sunrise", even: false, ramadan: false },
  { key: "Fajr", even: true, ramadan: true },
];

const FRIDAY_CELL =
  "border-none bg-[rgba(101,10,19,0.9)] px-1 py-0 text-[20px] text-white font-bold";
const RAMADAN_CELL =
  "border-(--color-border) px-1 py-0 text-[20px] bg-[rgba(207,171,116,0.7)] text-[rgba(101,10,19,0.9)] font-bold";
