import { useState } from "react";

import styles from "./AdsTable.module.css";
import Header from "./Header";

const base = import.meta.env.BASE_URL;
const AD_EXTENSIONS = ["png", "jpg", "jpeg"];
const TOTAL_CELLS = 21; // 3 columns x 7 rows

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
      <td className={styles.cell}>
        <div className={styles.placeholder}>
          Advertise Here
          <br />
          (313) 849-2147
        </div>
      </td>
    );
  }

  return (
    <td className={styles.cell}>
      <img
        className={styles.adImage}
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
    rows.push(<tr key={row}>{cells}</tr>);
  }

  return (
    <div className={styles.adsContainer}>
      <Header monthData={monthData} month={month} />
      <table className={styles.adsTable}>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}
