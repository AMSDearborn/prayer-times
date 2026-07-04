import { FiChevronLeft, FiChevronRight, FiPrinter } from "react-icons/fi";

import { HIJRI_MONTHS_EN } from "../constants";

export default function Controls({
  hijriYear,
  hijriMonth,
  onYearChange,
  onMonthChange,
  onChangeYear,
  onChangeMonth,
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 bg-(--color-maroon) px-4 py-3 shadow-[0_2px_10px_rgba(0,0,0,0.2)] print:hidden">
      <div className="flex items-center gap-1 rounded-full bg-white/5 p-1 ring-1 ring-(--color-gold)/40 ring-inset">
        <span className="font-archivo pr-1 pl-3 text-[11px] font-semibold tracking-[0.15em] text-(--color-gold) uppercase">
          Year
        </span>
        <NavButton onClick={() => onChangeYear(-1)} label="Previous year">
          <FiChevronLeft size={18} />
        </NavButton>
        <input
          type="number"
          id="year-select"
          min="1"
          value={hijriYear}
          onChange={(event) => onYearChange(event.target.value)}
          className="font-archivo w-18 rounded-full border-none bg-white px-3 py-1.5 text-center text-sm font-semibold text-(--color-maroon) outline-none focus:ring-2 focus:ring-(--color-gold)"
        />
        <NavButton onClick={() => onChangeYear(1)} label="Next year">
          <FiChevronRight size={18} />
        </NavButton>
      </div>

      <div className="flex items-center gap-1 rounded-full bg-white/5 p-1 ring-1 ring-(--color-gold)/40 ring-inset">
        <span className="font-archivo pr-1 pl-3 text-[11px] font-semibold tracking-[0.15em] text-(--color-gold) uppercase">
          Month
        </span>
        <NavButton onClick={() => onChangeMonth(-1)} label="Previous month">
          <FiChevronLeft size={18} />
        </NavButton>
        <select
          id="month-select"
          value={hijriMonth}
          onChange={(event) => onMonthChange(parseInt(event.target.value))}
          className="font-archivo cursor-pointer rounded-full border-none bg-white px-3 py-1.5 text-center text-sm font-semibold text-(--color-maroon) outline-none focus:ring-2 focus:ring-(--color-gold)"
        >
          {HIJRI_MONTHS_EN.map((monthName, index) => (
            <option key={index + 1} value={index + 1}>
              {index + 1} - {monthName}
            </option>
          ))}
        </select>
        <NavButton onClick={() => onChangeMonth(1)} label="Next month">
          <FiChevronRight size={18} />
        </NavButton>
      </div>

      <button
        type="button"
        onClick={() => window.print()}
        className="font-archivo flex cursor-pointer items-center gap-2 rounded-full border-none bg-(--color-gold) px-5 py-2 text-sm font-semibold text-(--color-maroon) transition-colors hover:bg-white"
      >
        <FiPrinter size={16} />
        Print to PDF
      </button>
    </div>
  );
}

function NavButton({ onClick, label, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-none bg-transparent text-(--color-gold) transition-colors hover:bg-(--color-gold) hover:text-(--color-maroon)"
    >
      {children}
    </button>
  );
}
