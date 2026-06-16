import { useEffect, useRef } from "react";

import {
  GREGORIAN_MONTHS,
  HIJRI_MONTHS_AR,
  HIJRI_MONTHS_EN,
} from "../constants";

export default function Header({ monthData, month, basePath = "/" }) {
  const hijriEnglishRef = useRef(null);

  useEffect(() => {
    const el = hijriEnglishRef.current;
    if (!el) return;

    const container = el.parentElement;
    container.style.overflow = "auto";

    let size = 48;
    el.style.fontSize = `${size}px`;

    while (container.scrollWidth > container.clientWidth && size > 24) {
      size -= 1;
      el.style.fontSize = `${size}px`;
    }

    container.style.overflow = "hidden";
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
    <div className="header-container relative flex h-[2in] w-[8.5in] overflow-hidden bg-(--color-maroon) print:shadow-none">
      {/* Left section */}
      <div className="relative z-2 box-border flex flex-1 basis-1/3 flex-col items-center justify-center gap-1 p-(--border-width) pb-0 text-white">
        <img
          className="h-[1in] w-auto brightness-0 invert"
          src={`${basePath}assets/ams-logo-full.svg`}
          alt="AMS Logo"
        />
        <div className="flex h-[0.5in] flex-col justify-center text-justify text-[12px] text-white">
          <p className="m-0 text-justify text-(--color-gold) [text-align-last:justify]">
            9945 Vernor Hwy. Dearborn, MI 48120
          </p>
          <p className="m-0 text-justify [text-align-last:justify]">
            <span className="text-[7px] text-(--color-gold) uppercase">
              Main
            </span>{" "}
            (313) 849-2147 •{" "}
            <span className="text-[7px] text-(--color-gold) uppercase">
              Imam
            </span>{" "}
            (313) 849-4416
          </p>
          <p className="m-0 w-full text-center tracking-[0.25em] [text-align-last:center]">
            services
            <span className="text-(--color-gold)">@AMSDearborn.org</span>
          </p>
        </div>
        <div className="flex flex-row items-center justify-center gap-2">
          <img
            className="h-3.5 w-3.5 fill-(--color-gold)"
            src={`${basePath}icons/facebook.svg`}
            alt="Facebook"
          />
          <img
            className="h-3.5 w-3.5 fill-(--color-gold)"
            src={`${basePath}icons/instagram.svg`}
            alt="Instagram"
          />
          <img
            className="h-3.5 w-3.5 fill-(--color-gold)"
            src={`${basePath}icons/youtube.svg`}
            alt="YouTube"
          />
        </div>
      </div>

      {/* Middle section */}
      <div className="relative z-2 box-border flex flex-1 basis-1/3 flex-col items-center justify-around overflow-x-hidden overflow-y-auto border-x border-(--color-gold) p-(--border-width) pb-0 text-white">
        <p className="font-foda mt-[-10px] text-[38px] text-(--color-gold)">
          {hijriArabic}
        </p>
        <p
          className="font-fraunces m-0 -mt-1 -mb-3 text-[48px] whitespace-nowrap text-white"
          ref={hijriEnglishRef}
        >
          {hijriEnglish}
        </p>
        <p className="font-fraunces mr-[-0.5em] text-[20px] tracking-[0.5em] text-(--color-gold)">
          {hijriYear}
        </p>
        <div className="mb[-10px] mt-[-16px] mr-[-0.5em] ml-0 flex items-center justify-center gap-1.5 text-(--color-gold)">
          <span className="text-[16px] text-(--color-gold)">◆</span>
          <span className="mt-[3px] inline-block h-px w-[6em] bg-(--color-gold)"></span>
          <span className="text-[16px] text-(--color-gold)">◆</span>
        </div>
        <p className="font-archivo m-0 text-[16px] font-light whitespace-nowrap text-white">
          {gregRange}
        </p>
      </div>

      {/* Right section */}
      <div className="relative z-2 box-border flex flex-1 basis-1/3 flex-col items-center justify-center gap-1 p-(--border-width) pb-0 text-white">
        <img
          className="h-[0.67in] w-auto"
          src={`${basePath}assets/amsdearborn-linktree-qr-code.svg`}
          alt="AMS Dearborn Linktree QR Code"
        />
        <div className="flex w-full flex-col">
          <div className="flex items-center justify-center gap-2 border-b-2 border-(--color-gold)">
            <span className="font-archivo text-[12px] font-bold tracking-wider text-white uppercase">
              FRIDAY PRAYER
            </span>
            <span className="font-foda text-[16px] text-(--color-gold)">
              صلاة الجمعة
            </span>
          </div>
          <div className="flex items-center justify-between border-b border-(--color-gold)">
            <div className="flex flex-col">
              <span className="font-archivo text-[10px] font-semibold tracking-[0.03em] text-white uppercase">
                ARABIC KHUTBAH
              </span>
              <span className="font-foda text-[13px] text-(--color-gold)">
                الخطبة العربية
              </span>
            </div>
            <span className="font-fraunces text-[14px] font-medium text-(--color-gold)">
              12:00 PM
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-archivo text-[10px] font-semibold tracking-[0.03em] text-white uppercase">
                ENGLISH KHUTBAH
              </span>
              <span className="font-foda text-[13px] text-(--color-gold)">
                الخطبة الإنجليزية
              </span>
            </div>
            <span className="font-fraunces text-[14px] font-medium text-(--color-gold)">
              1:00 PM
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
