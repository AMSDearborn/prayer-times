import { useState } from "react";

import Header from "./Header";

const AD_EXTENSIONS = ["png", "jpg", "jpeg"];

function AdCell({ adNumber, basePath }) {
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
      <td className="relative m-0.5 overflow-hidden border-2 border-solid border-(--color-maroon) p-0">
        <div className="font-gill-sans-nova box-border flex h-full w-full items-center justify-center p-2 text-center text-[18px] font-bold text-(--color-maroon)">
          Advertise Here
          <br />
          (313) 849-2147
        </div>
      </td>
    );
  }

  return (
    <td className="relative m-0.5 overflow-hidden border-2 border-solid border-(--color-maroon) p-0">
      <img
        className="absolute top-0 left-0 block h-full w-full object-fill"
        src={`${basePath}ads/${adNumber}.${AD_EXTENSIONS[extIndex]}`}
        alt={`Ad ${adNumber}`}
        onError={handleError}
      />
    </td>
  );
}

export default function AdsTable({ monthData, month, basePath = "/" }) {
  const rows = [];
  let adNumber = 1;

  for (let row = 0; row < 7; row++) {
    const cells = [];
    for (let col = 0; col < 3; col++) {
      cells.push(<AdCell key={adNumber} adNumber={adNumber} basePath={basePath} />);
      adNumber++;
    }
    rows.push(
      <tr key={row} className="grid h-full grid-cols-3">
        {cells}
      </tr>,
    );
  }

  return (
    <section className="page-break-before-always mx-auto hidden h-[14in] w-[8.5in] overflow-hidden bg-white print:block">
      <Header monthData={monthData} month={month} basePath={basePath} />
      <table className="h-[12in] w-full table-fixed border-separate border-spacing-0.5 border-t-0 border-r-(length:--border-width) border-b-(length:--border-width) border-l-(length:--border-width) border-solid border-(--color-maroon)">
        <tbody className="grid h-full grid-rows-[repeat(7,1fr)]">{rows}</tbody>
      </table>
    </section>
  );
}
