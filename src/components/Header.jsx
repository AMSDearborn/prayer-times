import { useEffect, useRef } from "react";

import {
  GREGORIAN_MONTHS,
  HIJRI_MONTHS_AR,
  HIJRI_MONTHS_EN,
} from "../constants";
import styles from "./Header.module.css";

const base = import.meta.env.BASE_URL;

export default function Header({ monthData, month }) {
  const hijriEnglishRef = useRef(null);

  useEffect(() => {
    const el = hijriEnglishRef.current;
    if (!el) return;

    const container = el.parentElement;
    let size = 48;
    el.style.fontSize = `${size}px`;

    while (container.scrollWidth > container.clientWidth && size > 24) {
      size -= 1;
      el.style.fontSize = `${size}px`;
    }
  }, [month, monthData]);

  if (!monthData || monthData.length === 0) return null;

  const hijriMonthIndex = parseInt(month) - 1;
  const hijriArabic = HIJRI_MONTHS_AR[hijriMonthIndex];
  const hijriEnglish = HIJRI_MONTHS_EN[hijriMonthIndex];
  const hijriYear = monthData[0].date.hijri.year;

  const firstGregorian = monthData[0].date.gregorian;
  const lastGregorian = monthData[monthData.length - 1].date.gregorian;

  const firstMonthName =
    GREGORIAN_MONTHS[parseInt(firstGregorian.month.number) - 1];
  const lastMonthName =
    GREGORIAN_MONTHS[parseInt(lastGregorian.month.number) - 1];
  const firstDay = parseInt(firstGregorian.day);
  const lastDay = parseInt(lastGregorian.day);
  const gregorianYear = firstGregorian.year;

  const gregRange =
    firstMonthName === lastMonthName
      ? `${firstMonthName} ${firstDay} - ${lastDay}, ${gregorianYear}`
      : `${firstMonthName} ${firstDay} - ${lastMonthName} ${lastDay}, ${gregorianYear}`;

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <img
          className={styles.logo}
          src={`${base}assets/AMS-Logo.svg`}
          alt="AMS Logo"
        />
        <div className={styles.address}>
          <p className={`${styles.addressLine} ${styles.gold}`}>
            9945 Vernor Hwy. Dearborn, MI 48120
          </p>
          <p className={styles.addressLine}>
            <span className={`${styles.labelSmall} ${styles.gold}`}>Main</span>{" "}
            (313) 849-2147 •{" "}
            <span className={`${styles.labelSmall} ${styles.gold}`}>Imam</span>{" "}
            (313) 849-4416
          </p>
          <p className={`${styles.addressLine} ${styles.addressLineLast}`}>
            services<span className={styles.gold}>@AMSDearborn.org</span>
          </p>
        </div>
        <div className={styles.socials}>
          <img
            className={styles.socialIcon}
            src={`${base}icons/facebook.svg`}
            alt="Facebook"
          />
          <img
            className={styles.socialIcon}
            src={`${base}icons/instagram.svg`}
            alt="Instagram"
          />
          <img
            className={styles.socialIcon}
            src={`${base}icons/youtube.svg`}
            alt="YouTube"
          />
        </div>
      </div>

      <div className={styles.middle}>
        <p className={styles.hijriArabic}>{hijriArabic}</p>
        <p className={styles.hijriEnglish} ref={hijriEnglishRef}>
          {hijriEnglish}
        </p>
        <p className={styles.hijriYear}>{hijriYear}</p>
        <div className={styles.divider}>
          <span className={styles.diamond}>◆</span>
          <span className={styles.dividerLine}></span>
          <span className={styles.diamond}>◆</span>
        </div>
        <p className={styles.gregRange}>{gregRange}</p>
      </div>

      <div className={styles.right}>
        <img
          className={styles.qrCode}
          src={`${base}assets/amsdearborn-linktree-qr-code.svg`}
          alt="AMS Dearborn Linktree QR Code"
        />
        <div className={styles.rightContent}>
          <div className={`${styles.fridayRow} ${styles.fridayTitle}`}>
            <span className={styles.fridayEn}>FRIDAY PRAYER</span>
            <span className={styles.fridayAr}>صلاة الجمعة</span>
          </div>
          <div className={`${styles.fridayRow} ${styles.fridayArabicKhutbah}`}>
            <div className={styles.khutbahStack}>
              <span className={styles.khutbahEn}>ARABIC KHUTBAH</span>
              <span className={styles.khutbahAr}>الخطبة العربية</span>
            </div>
            <span className={styles.khutbahTime}>12:00 PM</span>
          </div>
          <div className={styles.fridayRow}>
            <div className={styles.khutbahStack}>
              <span className={styles.khutbahEn}>ENGLISH KHUTBAH</span>
              <span className={styles.khutbahAr}>الخطبة الإنجليزية</span>
            </div>
            <span className={styles.khutbahTime}>1:00 PM</span>
          </div>
        </div>
      </div>
    </div>
  );
}
