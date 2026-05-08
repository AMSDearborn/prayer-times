# Hijri Prayer Times Generator

A lightweight, single-file web application designed to generate dynamic Hijri prayer time calendars. This tool is built to match the specific layout requirements of the American Moslem Society (AMS) and is optimized for printing onto Legal-size (8.5" x 14") paper.

## Features

*   **API-Driven:** Fetches accurate, annual prayer times via the [Aladhan API](https://aladhan.com/prayer-times-api).
*   **Print-Ready:** CSS Media queries specifically tuned for Legal-size paper output, ensuring a clean, professional look when printed to PDF.
*   **Automatic DST Detection:** Intelligently detects Daylight Saving Time transitions by monitoring Dhuhr time shifts and inserts a visual split in the table.
*   **Smart Formatting:** 
    *   Dynamic column striping for readability.
    *   "Ramadan Mode": Automatically applies the signature dark-red highlight to the Fajr and Maghrib columns.
    *   Friday highlighting: Automatically highlights the entire Friday row.
*   **User-Friendly UI:** Modern dropdown controls to easily select Hijri years and months, with current dates set as defaults.

## How to Use

1.  **Clone or Download:** Clone this repository or download the `index.html` file.
2.  **Open:** Simply open `index.html` in any modern web browser.
3.  **Select:** Use the top navigation bar to choose the desired Hijri year and month.
4.  **Fetch:** Click "Fetch Calendar" to pull the data.
5.  **Print:** Click "Print to PDF." In your browser's print dialog, ensure:
    *   **Paper Size** is set to **Legal (8.5" x 14")**.
    *   **Background Graphics** is **enabled** (this is critical to see the column highlights and stripes).

## Tech Stack

*   **HTML5 & CSS3:** For responsive layout and print-specific styling.
*   **Vanilla JavaScript:** Handles API requests, date processing, and dynamic DOM manipulation without the need for heavy frameworks.