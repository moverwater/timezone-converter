import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function DateInput({ datetime, setDatetime }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label>Date & Time:</label>
      <DatePicker
        selected={datetime}
        onChange={(date) => setDatetime(date)}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15}
        dateFormat="dd/MM/yyyy HH:mm"
        className="w-full p-2 border rounded"
      />
    </div>
  );
}
