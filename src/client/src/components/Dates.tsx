import React, { useState, useCallback, useRef, useEffect } from "react";
import dayjs from "dayjs";
import dayjsen from "dayjs/locale/en.js";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore.js";
import { useDatesActions, useDatesContext } from "~/state/date.js";

import * as classes from "./Dates.module.css";

dayjs.extend(isSameOrBefore);
dayjs.locale("en-europe", { ...dayjsen, weekStart: 1 });

function boundsOfMonth(date: string | Date | dayjs.Dayjs): dayjs.Dayjs[] {
  return [dayjs(date).startOf("month"), dayjs(date).endOf("month")];
}

function monday(date: string | Date | dayjs.Dayjs): dayjs.Dayjs {
  return dayjs(date).startOf("week");
}

function sunday(date: string | Date | dayjs.Dayjs): dayjs.Dayjs {
  return dayjs(date).endOf("week");
}

function getDaysInMonth(
  date: string | Date | dayjs.Dayjs,
): { day: dayjs.Dayjs; current: boolean }[] {
  const [firstDay, lastDay] = boundsOfMonth(date);
  const firstDate = monday(firstDay);
  const lastDate = sunday(lastDay);
  const days: { day: dayjs.Dayjs; current: boolean }[] = [];

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

function DateHeader(): React.ReactElement {
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

interface DateCellProps {
  day: dayjs.Dayjs;
  current: boolean;
  onSelectDate: (day: dayjs.Dayjs) => void;
  selected: boolean;
  disabled: boolean;
}

function DateCell({
  day,
  current,
  onSelectDate,
  selected,
  disabled,
}: DateCellProps): React.ReactElement<DateCellProps> {
  return (
    <button
      disabled={disabled || !current}
      aria-disabled={disabled || !current}
      onClick={(e) => {
        e.preventDefault();
        current && !disabled && onSelectDate(day);
      }}
      className={`date-picker-day ${selected ? classes.selected : ""} ${
        !current ? classes.outOfMonth : ""
      } ${disabled ? classes.disabled : ""}`}
    >
      {day.format("D")}
    </button>
  );
}

interface DateBodyProps {
  currentDate: dayjs.Dayjs;
  selected: dayjs.Dayjs;
  includeDates?: dayjs.Dayjs[];
  onSelectDate: (day: dayjs.Dayjs) => void;
}

function DateBody({
  currentDate,
  selected,
  includeDates,
  onSelectDate,
}: DateBodyProps): React.ReactElement<DateBodyProps> {
  const datesInMonth = getDaysInMonth(currentDate);
  const allowed = (includeDates || []).map((date) => dayjs(date));

  const rows: React.ReactElement[] = [];
  let wn = 0;
  while (datesInMonth.length > 0) {
    const week = datesInMonth.splice(0, 7);
    wn++;

    rows.push(
      <tr key={`dates-w-${wn}`}>
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

  return <>{rows}</>;
}

interface DatePickerProps {
  className?: string;
  selected?: dayjs.Dayjs | null;
  onChange: (date: dayjs.Dayjs) => void;
  includeDates?: dayjs.Dayjs[];
}

function DatePicker({
  className,
  selected,
  onChange,
  includeDates,
}: DatePickerProps): React.ReactElement<DatePickerProps> {
  // we set the initial date to the middle of the cusrent month
  // to avoid skipping february
  const [date, setDate] = useState(dayjs().startOf("month").add(15, "day"));
  const [visible, setVisible] = useState(false);
  const selectedDate = dayjs(selected);
  const monthAndYear = date.format("MMMM YYYY");

  const changeMonth = useCallback(
    (candidate: dayjs.Dayjs) => {
      if (candidate.isSameOrBefore(dayjs(), "month")) {
        setDate(candidate);
      }
    },
    [setDate],
  );

  const handleChange = useCallback(
    (date: dayjs.Dayjs) => {
      onChange(date);
      setVisible(false);
    },
    [onChange],
  );

  const self = useRef<HTMLButtonElement | null>(null);

  const onKeyUp = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      switch (e.key) {
        case "ArrowLeft":
        case "h":
        case "m":
          changeMonth(date.subtract(1, "month"));
          break;
        case "ArrowRight":
        case "l":
        case "i":
          changeMonth(date.add(1, "month"));
          break;
        case "Escape":
          setVisible(false);
          document.body.focus();
          break;
      }
    },
    [date],
  );

  console.log(document.activeElement);

  return (
    <button
      ref={self}
      className={classes.datePicker + " " + className}
      onClick={(e: React.MouseEvent<HTMLElement>) => {
        if (!e.defaultPrevented) {
          setVisible(true);
          self.current?.focus();
        }
      }}
      onKeyUp={onKeyUp}
      onBlur={() => {
        setVisible(false);
      }}
    >
      <div className={classes.datePickerButton}>
        <span className="material-symbols-sharp">today</span>
        {selected !== null && (
          <span className={classes.datePickerButtonDate}>
            {selectedDate.format("DD/MM/YYYY")}
          </span>
        )}
        <div className={classes.datePickerPane} aria-hidden={!visible}>
          <div className={classes.datePickerHeader}>
            <span
              className="material-symbols-sharp"
              tabIndex={0}
              role="button"
              onClick={() => changeMonth(date.subtract(1, "month"))}
            >
              chevron_left
            </span>
            <span>{monthAndYear}</span>
            <span
              className="material-symbols-sharp"
              tabIndex={0}
              role="button"
              onClick={() => changeMonth(date.add(1, "month"))}
              aria-disabled={date.isSame(dayjs(), "month")}
            >
              chevron_right
            </span>
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
                onSelectDate={handleChange}
              />
            </tbody>
          </table>
        </div>
      </div>
    </button>
  );
}

export default function Dates(): React.ReactElement | null {
  const { dates, date: selectedDate } = useDatesContext();
  const { setDate } = useDatesActions();

  if (!dates) return null;

  return (
    <div className={classes.dates} role="group">
      <DatePicker
        className={selectedDate ? "active" : ""}
        selected={selectedDate}
        onChange={(date) => {
          setDate(date);
          document.body.focus();
        }}
        includeDates={dates}
      />
      <button
        className={!selectedDate ? "active" : ""}
        onClick={() => setDate(null)}
      >
        All Time
      </button>
    </div>
  );
}
