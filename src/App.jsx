import { useEffect } from "react";

import AdsTable from "./components/AdsTable";
import Controls from "./components/Controls";
import PrayerTable from "./components/PrayerTable";
import useHijriCalendar from "./hooks/useHijriCalendar";

export default function App() {
  const {
    hijriYear,
    hijriMonth,
    monthData,
    loading,
    error,
    setHijriYear,
    setHijriMonth,
    changeYear,
    changeMonth,
  } = useHijriCalendar();

  useEffect(() => {
    if (
      !loading &&
      monthData &&
      new URLSearchParams(window.location.search).has("print")
    ) {
      const timer = setTimeout(() => window.print(), 500);
      return () => clearTimeout(timer);
    }
  }, [loading, monthData]);

  return (
    <>
      <Controls
        hijriYear={hijriYear}
        hijriMonth={hijriMonth}
        onYearChange={setHijriYear}
        onMonthChange={setHijriMonth}
        onChangeYear={changeYear}
        onChangeMonth={changeMonth}
      />

      <div className="flex justify-center p-2 print:p-0">
        <PrayerTable
          monthData={monthData}
          month={hijriMonth}
          loading={loading}
          error={error}
          basePath={import.meta.env.BASE_URL}
        />
      </div>

      <AdsTable
        monthData={monthData}
        month={hijriMonth}
        basePath={import.meta.env.BASE_URL}
      />
    </>
  );
}
