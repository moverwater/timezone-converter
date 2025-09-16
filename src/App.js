import React, { useState, useEffect } from "react";
import { DateTime } from "luxon";
import tzlookup from "tz-lookup";
import LocationInput from "./LocationInput";
import DateInput from "./DateInput";

export default function App() {
  const [datetime, setDatetime] = useState(new Date());
  const [sourceLoc, setSourceLoc] = useState(null);
  const [targetLocs, setTargetLocs] = useState([]);
  const [results, setResults] = useState([]);

  // Add a target immediately when selected
  const addTarget = (loc) => {
    if (loc && !targetLocs.find((t) => t.name === loc.name)) {
      setTargetLocs((prev) => [...prev, loc]);
    }
  };

  // Remove a target
  const removeTarget = (name) => {
    setTargetLocs((prev) => prev.filter((t) => t.name !== name));
  };

  // Recalculate results whenever source, datetime, or targets change
  useEffect(() => {
  if (!sourceLoc || targetLocs.length === 0) {
    setResults([]);
    return;
  }

  const sourceZone = tzlookup(sourceLoc.lat, sourceLoc.lon);

  const dtSource = DateTime.fromObject(
    {
      year: datetime.getFullYear(),
      month: datetime.getMonth() + 1,
      day: datetime.getDate(),
      hour: datetime.getHours(),
      minute: datetime.getMinutes(),
    },
    { zone: sourceZone }
  );

  const table = targetLocs.map((t) => {
    const tZone = tzlookup(t.lat, t.lon);
    const dtTarget = dtSource.setZone(tZone);

    const diffHours = (dtTarget.offset - dtSource.offset) / 60;

    let diffText = null;
    if (diffHours > 0) {
      diffText = (
        <span>
          {t.name} is <strong>{diffHours}</strong> hour{diffHours !== 1 ? "s" : ""} ahead of {sourceLoc.name}
        </span>
      );
    } else if (diffHours < 0) {
      diffText = (
        <span>
          {t.name} is <strong>{Math.abs(diffHours)}</strong> hour{diffHours !== -1 ? "s" : ""} behind {sourceLoc.name}
        </span>
      );
    } else {
      diffText = (
        <span>
          {t.name} is <strong>the same time</strong> as {sourceLoc.name}
        </span>
      );
    }

    return {
      location: t.name,
      localTime: dtTarget.toFormat("dd/MM/yyyy HH:mm"),
      difference: diffText,
    };
  });

  setResults(table);
}, [sourceLoc, datetime, targetLocs]);

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <h2>🌍 Timezone Converter</h2>

      <DateInput datetime={datetime} setDatetime={setDatetime} />

      <LocationInput label="Source Location:" onSelect={setSourceLoc} />

      {/* Target input automatically adds on selection */}
      <div style={{ marginTop: "1rem" }}>
        <LocationInput label="Select Target:" onSelect={addTarget} />
      </div>

      {/* List of targets with remove buttons aligned right */}
      {targetLocs.length > 0 && (
        <ul style={{ marginTop: "1rem", paddingLeft: 0, listStyle: "none" }}>
          {targetLocs.map((t) => (
            <li
              key={t.name}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.5rem",
                padding: "0.25rem 0.5rem",
                background: "#f3f4f6",
                borderRadius: "4px",
              }}
            >
              <span>{t.name}</span>
              <button
                onClick={() => removeTarget(t.name)}
                style={{
                  padding: "0.25rem 0.5rem",
                  background: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Results table */}
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
