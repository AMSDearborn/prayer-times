import {
  ARABIC_DAY_CORRECTIONS,
  DAY_ABBREVIATIONS,
  HIJRI_MONTHS_AR,
  HIJRI_MONTHS_EN,
} from "../constants";
import Header from "./Header";
import styles from "./PrayerTable.module.css";

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
          <tr key={`dst-${index}`} className={styles.dstSplit}>
            <td colSpan="10"></td>
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

      rows.push(
        <tr key={index} className={isFriday ? styles.fridayRow : undefined}>
          <td>{formatTime(timings.Isha)}</td>
          <td>{formatTime(timings.Maghrib)}</td>
          <td>{formatTime(timings.Asr)}</td>
          <td>{formatTime(timings.Dhuhr)}</td>
          <td>{formatTime(timings.Sunrise)}</td>
          <td>{formatTime(timings.Fajr)}</td>
          <td>{dayEnglish}</td>
          <td>{dayArabic}</td>
          <td>
            {showMonth && (
              <span className={styles.gregMonth}>
                {day.date.gregorian.month.en.substring(0, 3)}{" "}
              </span>
            )}
            {gregorianDay}
          </td>
          <td>{day.date.hijri.day}</td>
        </tr>,
      );
    });
  }

  return (
    <div className={styles.tableContainer}>
      <Header monthData={monthData} month={month} />
      {loading && <p className={styles.message}>Loading calendar data...</p>}
      {error && <p className={styles.errorMessage}>{error}</p>}
      {monthData && (
        <table className={`${styles.table} ${isRamadan ? styles.ramadan : ""}`}>
          <thead>
            <tr>
              <th>
                العشاء
                <br />
                Isha
              </th>
              <th>
                المغرب
                <br />
                Maghrib
              </th>
              <th>
                العصر
                <br />
                Asr
              </th>
              <th>
                الظهر
                <br />
                Dhuhr
              </th>
              <th>
                الشروق
                <br />
                Sunrise
              </th>
              <th>
                الفجر
                <br />
                Fajr
              </th>
              <th colSpan="2">
                اليوم
                <br />
                Day
              </th>
              <th>{gregHeader}</th>
              <th>{hijriHeader}</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      )}
    </div>
  );
}
