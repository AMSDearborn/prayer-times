import { useCallback, useEffect, useRef, useState } from "react";

import AdsTable from "./components/AdsTable";
import styles from "./components/App.module.css";
import PrayerTable from "./components/PrayerTable";
import { HIJRI_MONTHS_EN } from "./constants";

const HIJRI_MONTHS_FILENAME = [
  "muharram",
  "safar",
  "rabi-al-awwal",
  "rabi-ath-thani",
  "jumada-al-ula",
  "jumada-al-akhirah",
  "rajab",
  "shaban",
  "ramadan",
  "shawwal",
  "dhul-qadah",
  "dhul-hijjah",
];

export default function App() {
  const [hijriYear, setHijriYear] = useState("");
  const [hijriMonth, setHijriMonth] = useState(1);
  const [monthData, setMonthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cacheRef = useRef({});

  const fetchAndRender = useCallback(async (year, month) => {
    setLoading(true);
    setError(null);
    setMonthData(null);

    try {
      let data;
      if (cacheRef.current[year]) {
        data = cacheRef.current[year];
      } else {
        const url = `https://api.aladhan.com/v1/hijriCalendar?adjustment=0&year=${year}&annual=true&iso8601=false&method=2&school=0&tune=0,0,0,0,0,0,0,0,0&latitude=42.304304&longitude=-83.143549`;
        const response = await fetch(url);
        const json = await response.json();
        data = json.data;
        cacheRef.current[year] = data;
      }

      let monthDays;
      if (Array.isArray(data)) {
        monthDays = data.filter(
          (day) => parseInt(day.date.hijri.month.number) === parseInt(month),
        );
      } else if (data[month]) {
        monthDays = data[month];
      } else {
        monthDays = Object.values(data).find(
          (arr) =>
            arr.length > 0 &&
            parseInt(arr[0].date.hijri.month.number) === parseInt(month),
        );
      }

      if (!monthDays || monthDays.length === 0) {
        setError("No data found for this month and year.");
      } else {
        setMonthData(monthDays);
        const monthNum = String(month).padStart(2, "0");
        const monthName = HIJRI_MONTHS_FILENAME[parseInt(month) - 1];
        document.title = `${year}-${monthNum}-${monthName}`;
      }
    } catch (fetchError) {
      console.error(fetchError);
      setError("Error loading data from Aladhan API.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initialize = async () => {
      const today = new Date();
      const day = String(today.getDate()).padStart(2, "0");
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const year = today.getFullYear();

      let currentHijriYear = 1447;
      let currentHijriMonth = 9;

      try {
        const response = await fetch(
          `https://api.aladhan.com/v1/gToH?date=${day}-${month}-${year}`,
        );
        const json = await response.json();
        currentHijriYear = parseInt(json.data.hijri.year);
        currentHijriMonth = parseInt(json.data.hijri.month.number);
      } catch (fetchError) {
        console.error(
          "Failed to fetch current Hijri date, using fallbacks.",
          fetchError,
        );
      }

      setHijriYear(currentHijriYear);
      setHijriMonth(currentHijriMonth);
    };

    void initialize();
  }, []);

  useEffect(() => {
    if (hijriYear) {
      fetchAndRender(hijriYear, hijriMonth);
    }
  }, [hijriYear, hijriMonth, fetchAndRender]);

  return (
    <>
      <div className={styles.controls}>
        <label htmlFor="year-select">
          <strong>Hijri Year:</strong>
        </label>
        <input
          type="number"
          id="year-select"
          min="1"
          value={hijriYear}
          onChange={(event) => setHijriYear(event.target.value)}
        />

        <label htmlFor="month-select">
          <strong>Month:</strong>
        </label>
        <select
          id="month-select"
          value={hijriMonth}
          onChange={(event) => setHijriMonth(parseInt(event.target.value))}
        >
          {HIJRI_MONTHS_EN.map((monthName, index) => (
            <option key={index + 1} value={index + 1}>
              {index + 1} - {monthName}
            </option>
          ))}
        </select>

        <button className={styles.printButton} onClick={() => window.print()}>
          Print to PDF
        </button>
      </div>

      <PrayerTable
        monthData={monthData}
        month={hijriMonth}
        loading={loading}
        error={error}
      />

      <AdsTable monthData={monthData} month={hijriMonth} />
    </>
  );
}
