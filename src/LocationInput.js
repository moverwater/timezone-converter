import React, { useState } from "react";

export default function LocationInput({ label, onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const search = async (q) => {
    setQuery(q);
    if (q.length < 2) {
      setResults([]);
      return;
    }

    const resp = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${q}&limit=5`
    );
    const data = await resp.json();
    setResults(data);
  };

  return (
    <div style={{ marginBottom: "1rem" }}>
      <label>{label}</label>
      <input
        value={query}
        onChange={(e) => search(e.target.value)}
        style={{ width: "100%", padding: "0.5rem" }}
      />
      {results.length > 0 && (
        <ul style={{ border: "1px solid #ccc", marginTop: "4px" }}>
          {results.map((place) => (
            <li
              key={place.place_id}
              onClick={() => {
                setQuery(place.display_name);
                setResults([]);
                onSelect({
                  name: place.display_name,
                  lat: parseFloat(place.lat),
                  lon: parseFloat(place.lon),
                });
              }}
              style={{ cursor: "pointer", padding: "4px" }}
            >
              {place.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
