import {
  ARABIC_DAY_CORRECTIONS,
  DAY_ABBREVIATIONS,
  HIJRI_MONTHS_AR,
  HIJRI_MONTHS_EN,
} from "../constants";
import Header from "./Header";

function timeToMinutes(timeString) {
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
}

function formatTime(timeString) {
  let [hours, minutes] = timeString.split(" ")[0].split(":").map(Number);
  if (hours > 12) hours -= 12;
  if (hours === 0) hours = 12;
  return `${hours}:${minutes.toString().padStart(2, "0")}`;
}

export default function PrayerTable({ monthData, month, loading, error }) {
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

      const fridayTd =
        "border-none bg-[rgba(101,10,19,0.9)] text-white font-bold";
      const ramadanTd =
        "bg-[rgba(207,171,116,0.7)] text-[rgba(101,10,19,0.9)] font-bold";

      rows.push(
        <tr key={index}>
          <td
            className={`border border-l-0 border-(--color-border) px-1 py-0 font-[Calibri,sans-serif] text-[20px] ${isFriday ? fridayTd : "bg-white"}`}
          >
            {formatTime(timings.Isha)}
          </td>
          <td
            className={`border border-(--color-border) bg-(--color-even-bg) px-1 py-0 font-[Calibri,sans-serif] text-[20px] ${isFriday ? fridayTd : isRamadan ? ramadanTd : "bg-white"}`}
          >
            {formatTime(timings.Maghrib)}
          </td>
          <td
            className={`border border-(--color-border) px-1 py-0 font-[Calibri,sans-serif] text-[20px] ${isFriday ? fridayTd : "bg-white"}`}
          >
            {formatTime(timings.Asr)}
          </td>
          <td
            className={`border border-(--color-border) bg-(--color-even-bg) px-1 py-0 font-[Calibri,sans-serif] text-[20px] ${isFriday ? fridayTd : "bg-white"}`}
          >
            {formatTime(timings.Dhuhr)}
          </td>
          <td
            className={`border border-(--color-border) px-1 py-0 font-[Calibri,sans-serif] text-[20px] ${isFriday ? fridayTd : "bg-white"}`}
          >
            {formatTime(timings.Sunrise)}
          </td>
          <td
            className={`border border-(--color-border) bg-(--color-even-bg) px-1 py-0 font-[Calibri,sans-serif] text-[20px] ${isFriday ? fridayTd : isRamadan ? ramadanTd : "bg-white"}`}
          >
            {formatTime(timings.Fajr)}
          </td>
          <td
            className={`font-gill-sans-nova border border-r-0 border-(--color-border) px-1 py-0 text-[20px] font-bold ${isFriday ? fridayTd : "bg-white"}`}
          >
            {dayEnglish}
          </td>
          <td
            className={`border border-l-0 border-(--color-border) px-1 py-0 font-[Calibri,sans-serif] text-[20px] font-bold ${isFriday ? fridayTd : "bg-white"}`}
          >
            {dayArabic}
          </td>
          <td
            className={`border border-(--color-border) bg-(--color-even-bg) px-1 py-0 font-[Calibri,sans-serif] text-[20px] ${isFriday ? fridayTd : "bg-white"}`}
          >
            {showMonth && (
              <span className="text-[0.75em]">
                {day.date.gregorian.month.en.substring(0, 3)}{" "}
              </span>
            )}
            {gregorianDay}
          </td>
          <td
            className={`border border-r-0 border-(--color-border) px-1 py-0 font-[Calibri,sans-serif] text-[20px] ${isFriday ? fridayTd : "bg-white"}`}
          >
            {day.date.hijri.day}
          </td>
        </tr>,
      );
    });
  }

  return (
    <div className="mx-auto h-[12in] w-[8.5in] shadow-[0_4px_6px_rgba(0,0,0,0.1)] print:shadow-none">
      <Header monthData={monthData} month={month} />
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
          <thead className="text-[16px]">
            <tr>
              <th className="font-gill-sans-nova bg-(--color-maroon) px-1 py-0.5 leading-[1.1] font-normal text-white">
                العشاء
                <br />
                Isha
              </th>
              <th className="font-gill-sans-nova bg-(--color-maroon) px-1 py-0.5 leading-[1.1] font-normal text-white">
                المغرب
                <br />
                Maghrib
              </th>
              <th className="font-gill-sans-nova bg-(--color-maroon) px-1 py-0.5 leading-[1.1] font-normal text-white">
                العصر
                <br />
                Asr
              </th>
              <th className="font-gill-sans-nova bg-(--color-maroon) px-1 py-0.5 leading-[1.1] font-normal text-white">
                الظهر
                <br />
                Dhuhr
              </th>
              <th className="font-gill-sans-nova bg-(--color-maroon) px-1 py-0.5 leading-[1.1] font-normal text-white">
                الشروق
                <br />
                Sunrise
              </th>
              <th className="font-gill-sans-nova bg-(--color-maroon) px-1 py-0.5 leading-[1.1] font-normal text-white">
                الفجر
                <br />
                Fajr
              </th>
              <th
                colSpan="2"
                className="font-gill-sans-nova bg-(--color-maroon) px-1 py-0.5 leading-[1.1] font-normal text-white"
              >
                اليوم
                <br />
                Day
              </th>
              <th className="bg-(--color-maroon) px-1 py-0.5 font-[Calibri,sans-serif] leading-[1.1] font-normal text-white">
                {gregHeader}
              </th>
              <th className="width-[111px] font-gill-sans-nova bg-(--color-maroon) px-1 py-0.5 leading-[1.1] font-normal text-white">
                {hijriHeader}
              </th>
            </tr>
          </thead>
          <tbody className="[&_tr:first-child_td]:border-t-0">{rows}</tbody>
        </table>
      )}
    </div>
  );
}
