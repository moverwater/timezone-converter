import React, { useState } from "react";
import { DateTime } from "luxon";
import tzlookup from "tz-lookup";
import LocationInput from "./LocationInput";
import DateInput from "./DateInput";

export default function App() {
  const [datetime, setDatetime] = useState(new Date());
  const [sourceLoc, setSourceLoc] = useState(null);
  const [targetLocs, setTargetLocs] = useState([]);
  const [results, setResults] = useState([]);

  // Add a target location to the list
  const addTarget = (loc) => {
    setTargetLocs((prev) => [...prev, loc]);
  };

const convertTimes = () => {
  if (!sourceLoc || targetLocs.length === 0) return;

  const sourceZone = tzlookup(sourceLoc.lat, sourceLoc.lon);
  const dtSource = DateTime.fromJSDate(datetime, { zone: sourceZone });

  const table = targetLocs.map((t) => {
    const tZone = tzlookup(t.lat, t.lon);
    const dtTarget = dtSource.setZone(tZone);

    const diffHours = (dtTarget.offset - dtSource.offset) / 60;
    let diffText = null;

    if (diffHours > 0) {
      diffText = (
        <span>
          {t.name} is <strong>{diffHours} hour{diffHours !== 1 ? "s" : ""} ahead</strong> of {sourceLoc.name}
        </span>
      );
    } else if (diffHours < 0) {
      diffText = (
        <span>
          {t.name} is <strong>{Math.abs(diffHours)} hour{diffHours !== -1 ? "s" : ""} behind</strong> {sourceLoc.name}
        </span>
      );
    } else {
      diffText = (
        <span>
          {t.name} is <strong>the same time</strong> as {sourceLoc.name}
        </span>
      );
    }

    // ✅ Return the object for this row
    return {
      location: t.name,
      localTime: dtTarget.toFormat("dd/MM/yyyy HH:mm"),
      difference: diffText,
    };
  });

  setResults(table);
};

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <h2>🌍 Timezone Converter</h2>

      <DateInput datetime={datetime} setDatetime={setDatetime} />

      <LocationInput label="Source Location:" onSelect={setSourceLoc} />

      <LocationInput
        label="Add Target Location:"
        onSelect={addTarget}
      />

      <button
        onClick={convertTimes}
        style={{
          width: "100%",
          padding: "0.75rem",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          marginTop: "1rem",
        }}
      >
        Convert Times
      </button>

      {results.length > 0 && (
        <table style={{ width: "100%", marginTop: "1rem", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: "6px" }}>Location</th>
              <th style={{ border: "1px solid #ccc", padding: "6px" }}>Local Time</th>
              <th style={{ border: "1px solid #ccc", padding: "6px" }}>Difference</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, idx) => (
              <tr key={idx}>
                <td style={{ border: "1px solid #ccc", padding: "6px" }}>{r.location}</td>
                <td style={{ border: "1px solid #ccc", padding: "6px" }}>{r.localTime}</td>
                <td style={{ border: "1px solid #ccc", padding: "6px" }}>{r.difference}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
