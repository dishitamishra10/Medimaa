"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const FREQUENCY_OPTIONS = [
  { label: "Once a day", times: ["8:00 AM"] },
  { label: "Twice a day", times: ["8:00 AM", "8:00 PM"] },
  { label: "Three times a day", times: ["8:00 AM", "2:00 PM", "8:00 PM"] },
  { label: "Four times a day", times: ["8:00 AM", "12:00 PM", "4:00 PM", "8:00 PM"] },
  { label: "Every other day", times: ["8:00 AM"] },
  { label: "Weekly", times: ["8:00 AM"] },
  { label: "As needed", times: [] },
];

const inputClass = `
  w-full rounded-lg border border-gray-200 dark:border-gray-700
  bg-gray-50 dark:bg-gray-800
  px-3 py-2.5 text-sm
  text-gray-900 dark:text-gray-100
  placeholder-gray-400 dark:placeholder-gray-600
  focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
  focus:border-transparent transition
`.trim();

const labelClass = "block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1";

export default function AddMedicationForm({ onSave, onCancel }) {
  const { user, isLoggedIn } = useAuth();

  const [patientName, setPatientName] = useState("");
  const [medicineName, setMedicineName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("Twice a day");
  const [duration, setDuration] = useState("15");
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  });
  const [endDate, setEndDate] = useState("");
  const [doseTimes, setDoseTimes] = useState("8:00 AM, 8:00 PM");
  const [doseTimesInMinutes, setDoseTimesInMinutes] = useState([]);
  const [notes, setNotes] = useState("");
  const [reminder, setReminder] = useState(true);

  const convertTimeToMinutes = (timeArray) => {
    return timeArray.map(timeStr => {
      const cleanTime = timeStr.replace(/\s+/g, " ").toUpperCase().trim();
      const [time, period] = cleanTime.split(" ");
      let [hours, minutes] = time.split(":").map(Number);

      if (period === "PM" && hours !== 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;

      return hours * 60 + minutes;
    });
  }

  useEffect(() => {
    const timeArray = doseTimes.split(",").map((t) => t.trim());
    const minutesArray = convertTimeToMinutes(timeArray);
    setDoseTimesInMinutes(minutesArray);
  }, [doseTimes])

  const calculateEndDate = (startDate, duration) => {
    const start = new Date(startDate);

    const end = new Date(start);
    end.setDate(start.getDate() + Number(duration) - 1);

    return end.toISOString().split("T")[0];
  };


  useEffect(() => {
    const calculatedEndDate = calculateEndDate(startDate, duration);
    setEndDate(calculatedEndDate);
  }, [startDate, duration])


  useEffect(() => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    setStartDate(`${year}-${month}-${day}`);
  }, []);


  const handleFrequencyChange = (e) => {
    const selected = e.target.value;
    setFrequency(selected);
    const match = FREQUENCY_OPTIONS.find((option) => option.label === selected);
    if (match) setDoseTimes(match.times.join(", "));
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    const timeArray = doseTimes.split(",").map((t) => t.trim());

    onSave?.({
      patientName,
      medicineName,
      dosage,
      frequency,
      duration: Number(duration),
      startDate,
      endDate,
      doseTimes: timeArray,
      doseTimesInMinutes,
      reminder,
      notes,
    });
  };


  useEffect(() => {
    if (isLoggedIn && user?.displayName) {
      setPatientName(user.displayName);
    }
  }, [user, isLoggedIn])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg dark:shadow-gray-900/50 w-full max-w-xl p-6">

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold">
            Add new medication

            {patientName && (
              <span className="text-gray-400 dark:text-gray-500 font-normal">
                {" "}— {patientName}
              </span>
            )}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Patient Name */}
          <div>
            <label className={labelClass}>Patient name</label>

            <input
              type="text"
              value={patientName}
              name="patientName"
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="e.g. Akash Sharma"
              required
              className={inputClass}
            />
          </div>

          {/* Medicine + Dosage */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Medicine name</label>

              <input
                type="text"
                value={medicineName}
                name="medicineName"
                onChange={(e) => setMedicineName(e.target.value)}
                placeholder="e.g. Metformin 500mg"
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Dosage</label>

              <input
                type="text"
                value={dosage}
                name="dosage"
                onChange={(e) => setDosage(e.target.value)}
                placeholder="e.g. 1 tablet"
                required
                className={inputClass}
              />
            </div>
          </div>

          {/* Frequency + Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Frequency</label>

              <select
                value={frequency}
                name="frequency"
                onChange={handleFrequencyChange}
                className={`${inputClass} appearance-none cursor-pointer`}
              >
                {FREQUENCY_OPTIONS.map((option) => (
                  <option key={option.label} value={option.label}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Duration (days)</label>

              <input
                type="number"
                value={duration}
                name="duration"
                onChange={(e) => setDuration(e.target.value)}
                min="1"
                required
                className={inputClass}
              />
            </div>
          </div>

          {/* Start date + Dose times */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Start date</label>

              <input
                type="date"
                value={startDate}
                name="startDate"
                required
                onChange={(e) => setStartDate(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Dose times</label>

              <input
                type="text"
                value={doseTimes}
                name="doseTimes"
                onChange={(e) => setDoseTimes(e.target.value)}
                placeholder="e.g. 8:00 AM, 8:00 PM"
                required
                className={inputClass}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className={labelClass}>Notes</label>

            <textarea
              value={notes}
              name="notes"
              onChange={(e) => setNotes(e.target.value)}
              placeholder="After meals, with water"
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Reminder */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="reminder"
              checked={reminder}
              onChange={(e) => setReminder(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />

            <label
              htmlFor="reminder"
              className="text-sm font-medium text-gray-600 dark:text-gray-400"
            >
              Enable medicine reminders
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              className="flex-1 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-semibold rounded-xl py-3 text-sm transition hover:cursor-pointer"
            >
              Save medication
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="px-6 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium text-sm transition hover:cursor-pointer"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}