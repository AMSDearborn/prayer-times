export const HIJRI_MONTHS_AR = [
  "مـحرم",
  "صفر",
  "ربيع الأول",
  "ربيع الثاني",
  "جمادى الأولى",
  "جمادى الآخرة",
  "رجب",
  "شعبان",
  "رمضان",
  "شوال",
  "ذو القعدة",
  "ذو الحجة",
];

export const HIJRI_MONTHS_EN = [
  "Muharram",
  "Safar",
  "Rabi' Al-awwal",
  "Rabi' Ath-thani",
  "Jumada Al-ula",
  "Jumada Al-akhirah",
  "Rajab",
  "Sha'ban",
  "Ramadan",
  "Shawwal",
  "Dhul-qa'dah",
  "Dhul-hijjah",
];

export const GREGORIAN_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const DAY_ABBREVIATIONS = {
  Sunday: "SUN",
  Monday: "MON",
  Tuesday: "TUES",
  Wednesday: "WED",
  Thursday: "THU",
  Friday: "FRI",
  Saturday: "SAT",
};

export const ARABIC_DAY_CORRECTIONS = {
  الاحد: "الأحد",
  الاثنين: "الإثنين",
  الاربعاء: "الأربعاء",
};

// Aladhan API configuration
export const API_CONFIG = {
  baseUrl: "https://api.aladhan.com/v1",
  latitude: 42.304304,
  longitude: -83.143549,
  method: 2,
  school: 0,
  adjustment: 0,
  tune: "0,0,0,0,0,0,0,0,0",
};

// Fallback used if the initial Hijri date lookup fails.
export const FALLBACK_HIJRI_YEAR = 1448;
export const FALLBACK_HIJRI_MONTH = 2;
