import { useCallback, useEffect, useRef, useState } from "react";

import {
  API_CONFIG,
  FALLBACK_HIJRI_MONTH,
  FALLBACK_HIJRI_YEAR,
  HIJRI_MONTHS_EN,
} from "../constants";

export default function useHijriCalendar() {
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
        const params = new URLSearchParams({
          adjustment: API_CONFIG.adjustment,
          year,
          annual: true,
          iso8601: false,
          method: API_CONFIG.method,
          school: API_CONFIG.school,
          tune: API_CONFIG.tune,
          latitude: API_CONFIG.latitude,
          longitude: API_CONFIG.longitude,
        });
        const url = `${API_CONFIG.baseUrl}/hijriCalendar?${params}`;
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
        const monthName =
          HIJRI_MONTHS_EN[parseInt(month) - 1].toLocaleLowerCase();
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

      let currentHijriYear = FALLBACK_HIJRI_YEAR;
      let currentHijriMonth = FALLBACK_HIJRI_MONTH;

      try {
        const response = await fetch(
          `${API_CONFIG.baseUrl}/gToH?date=${day}-${month}-${year}`,
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

  const changeYear = useCallback((delta) => {
    setHijriYear((prev) => Math.max(1, (parseInt(prev) || 1) + delta));
  }, []);

  const changeMonth = useCallback((delta) => {
    setHijriMonth((prevMonth) => {
      let newMonth = prevMonth + delta;
      if (newMonth < 1) {
        newMonth = 12;
        setHijriYear((y) => Math.max(1, (parseInt(y) || 1) - 1));
      } else if (newMonth > 12) {
        newMonth = 1;
        setHijriYear((y) => (parseInt(y) || 1) + 1);
      }
      return newMonth;
    });
  }, []);

  return {
    hijriYear,
    hijriMonth,
    monthData,
    loading,
    error,
    setHijriYear,
    setHijriMonth,
    changeYear,
    changeMonth,
  };
}
