import { useState } from "react";

import Header from "./Header";

const base = import.meta.env.BASE_URL;
const AD_EXTENSIONS = ["png", "jpg", "jpeg"];

function AdCell({ adNumber }) {
  const [extIndex, setExtIndex] = useState(0);
  const [failed, setFailed] = useState(false);

  const handleError = () => {
    if (extIndex < AD_EXTENSIONS.length - 1) {
      setExtIndex(extIndex + 1);
    } else {
      setFailed(true);
    }
  };

  if (failed) {
    return (
      <td className="relative m-0.5 border-2 border-solid border-(--color-maroon) overflow-hidden p-0">
        <div className="flex h-full w-full items-center justify-center box-border p-2 text-center text-[18px] font-bold font-gill-sans-nova text-(--color-maroon)">
          Advertise Here
          <br />
          (313) 849-2147
        </div>
      </td>
    );
  }

  return (
    <td className="relative m-0.5 border-2 border-solid border-(--color-maroon) overflow-hidden p-0">
      <img
        className="absolute top-0 left-0 block h-full w-full object-fill"
        src={`${base}ads/${adNumber}.${AD_EXTENSIONS[extIndex]}`}
        alt={`Ad ${adNumber}`}
        onError={handleError}
      />
    </td>
  );
}

export default function AdsTable({ monthData, month }) {
  const rows = [];
  let adNumber = 1;

  for (let row = 0; row < 7; row++) {
    const cells = [];
    for (let col = 0; col < 3; col++) {
      cells.push(<AdCell key={adNumber} adNumber={adNumber} />);
      adNumber++;
    }
    rows.push(<tr key={row} className="grid grid-cols-3 h-full">{cells}</tr>);
  }

  return (
    <div className="page-break-before-always mx-auto hidden w-[8.5in] h-[14in] overflow-hidden bg-white print:block">
      <Header monthData={monthData} month={month} />
      <table className="w-full h-[12in] table-fixed border-separate border-spacing-0.5 border-t-0 border-r-(length:--border-width) border-b-(length:--border-width) border-l-(length:--border-width) border-solid border-(--color-maroon)">
        <tbody className="grid grid-rows-[repeat(7,1fr)] h-full">{rows}</tbody>
      </table>
    </div>
  );
}
