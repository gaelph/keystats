import { useState, useCallback } from "react";
import dayjs from "dayjs";
import dayjsen from "dayjs/locale/en.js";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore.js";
dayjs.extend(isSameOrBefore);
dayjs.locale("en-europe", { ...dayjsen, weekStart: 1 });

function boundsOfMonth(date) {
  return [dayjs(date).startOf("month"), dayjs(date).endOf("month")];
}

function monday(date) {
  return dayjs(date).startOf("week");
}

function sunday(date) {
  return dayjs(date).endOf("week");
}

function getDaysInMonth(date) {
  const [firstDay, lastDay] = boundsOfMonth(date);
  const firstDate = monday(firstDay);
  const lastDate = sunday(lastDay);
  const days = [];

  let current = dayjs(firstDate);
  while (current <= lastDate) {
    if (current.isBefore(firstDay) || current.isAfter(lastDay)) {
      days.push({ day: dayjs(current), current: false });
    } else {
      days.push({ day: dayjs(current), current: true });
    }

    current = current.add(1, "day");
  }

  return days;
}

function DateHeader() {
  return (
    <tr>
      <th>M</th>
      <th>T</th>
      <th>W</th>
      <th>T</th>
      <th>F</th>
      <th>S</th>
      <th>S</th>
    </tr>
  );
}

function DateCell({ day, current, onSelectDate, selected, disabled }) {
  return (
    <button
      disabled={disabled}
      onClick={() => current && !disabled && onSelectDate(day)}
      className={`date-picker-day ${selected ? "selected" : ""} ${
        !current ? "out-of-month" : ""
      } ${disabled ? "disabled" : ""}`}
    >
      {day.format("D")}
    </button>
  );
}

function DateBody({ currentDate, selected, includeDates, onSelectDate }) {
  let datesInMonth = getDaysInMonth(currentDate);
  const allowed = includeDates.map((date) => dayjs(date));

  let rows = [];
  while (datesInMonth.length > 0) {
    const week = datesInMonth.splice(0, 7);

    rows.push(
      <tr>
        {week.map(({ day, current }) => (
          <td key={day.format()}>
            <DateCell
              day={day}
              current={current}
              onSelectDate={onSelectDate}
              selected={day.isSame(selected, "date")}
              disabled={!allowed.find((a) => day.isSame(a, "date"))}
            />
          </td>
        ))}
      </tr>,
    );
  }

  return rows;
}

function DatePicker({ className, selected, onChange, includeDates }) {
  // we set the initial date to the middle of the cusrent month
  // to avoid skipping february
  const [date, setDate] = useState(dayjs().startOf("month").add(15, "day"));
  const selectedDate = dayjs(selected);
  const monthAndYear = date.format("MMMM YYYY");

  const changeMonth = useCallback(
    (candidate) => {
      if (candidate.isSameOrBefore(dayjs(), "month")) {
        setDate(candidate);
      }
    },
    [setDate],
  );

  return (
    <button className={"date-picker " + className}>
      <div
        type="button"
        className="date-picker-button"
        tabIndex="0"
        onClick={() => {}}
      >
        <span className="material-symbols-sharp">today</span>
        {selected !== null && (
          <span className="date-picker-button-date">
            {selectedDate.format("DD/MM/YYYY")}
          </span>
        )}
        <div className="date-picker-pane">
          <div className="date-picker-header">
            <button
              type="button"
              onClick={() => changeMonth(date.subtract(1, "month"))}
            >
              &lt;
            </button>
            <span>{monthAndYear}</span>
            <button
              type="button"
              onClick={() => changeMonth(date.add(1, "month"))}
              disabled={date.isSame(dayjs(), "month")}
            >
              &gt;
            </button>
          </div>
          <table>
            <thead>
              <DateHeader />
            </thead>
            <tbody>
              <DateBody
                currentDate={date}
                includeDates={includeDates}
                selected={selectedDate}
                onSelectDate={onChange}
              />
            </tbody>
          </table>
        </div>{" "}
      </div>
    </button>
  );
}

export default function Dates({ dates, selectedDate, onChange }) {
  const handleDateClick = useCallback(
    (date) => {
      onChange && onChange(date);
    },
    [onChange],
  );

  return (
    <div className="dates">
      <DatePicker
        className={selectedDate ? "active" : ""}
        selected={selectedDate}
        onChange={(date) => handleDateClick(date)}
        includeDates={dates}
      />
      <button
        className={!selectedDate ? "active" : ""}
        onClick={() => handleDateClick(null)}
      >
        All Time
      </button>
    </div>
  );
}
