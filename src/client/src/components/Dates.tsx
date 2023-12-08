import React, { useCallback, useEffect, useRef } from "react";
import dayjs from "dayjs";
import dayjsen from "dayjs/locale/en.js";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore.js";

import useDates from "~/hooks/useDates.js";

import Today from "@material-symbols/svg-400/sharp/today.svg";
import ChevronLeft from "@material-symbols/svg-400/sharp/chevron_left.svg";
import ChevronRight from "@material-symbols/svg-400/sharp/chevron_right.svg";
import * as classes from "./Dates.module.css";
import useDatePicker from "~/hooks/useDatePicker.js";
import useKeybindings from "~/hooks/useKeybindings.js";

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
  parentRef: React.MutableRefObject<HTMLButtonElement | null>;
}

function DateCell({
  day,
  current,
  onSelectDate,
  selected,
  disabled,
  parentRef,
}: DateCellProps): React.ReactElement<DateCellProps> {
  const isToday = dayjs().isSame(day, "day");

  return (
    <button
      ref={isToday ? parentRef : undefined}
      role="button"
      disabled={disabled || !current}
      aria-disabled={disabled || !current}
      aria-selected={selected}
      aria-current={isToday ? "date" : undefined}
      onClick={(e) => {
        e.preventDefault();
        !disabled && onSelectDate(day);
      }}
      className={`${!current ? classes.outOfMonth : ""}`}
      aria-label={day.format("DD MMM YYYY")}
    >
      <time dateTime={day.format("YYYY-MM-DD")}>{day.format("D")}</time>
    </button>
  );
}

interface DateBodyProps {
  currentDate: dayjs.Dayjs;
  selected: dayjs.Dayjs;
  includeDates?: dayjs.Dayjs[];
  todayButton: React.MutableRefObject<HTMLButtonElement | null>;
  onSelectDate: (day: dayjs.Dayjs) => void;
}

function DateBody({
  currentDate,
  selected,
  includeDates,
  todayButton,
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
              parentRef={todayButton}
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
  selected,
  onChange,
  includeDates,
}: DatePickerProps): React.ReactElement<DatePickerProps> {
  const { date, incrementMonth, decrementMonth, opened, open, close } =
    useDatePicker();
  const selectedDate = dayjs(selected);
  const monthAndYear = date.format("MMMM YYYY");

  const self = useRef<HTMLButtonElement | null>(null);
  const todayButton = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!opened) {
      self.current?.focus();
    } else {
      todayButton.current?.focus();
    }
  }, [opened]);

  const keyHandler = useKeybindings({
    ArrowLeft: () => decrementMonth(),
    h: () => decrementMonth(),
    m: () => decrementMonth(),
    ArrowRight: () => incrementMonth(),
    l: () => incrementMonth(),
    i: () => incrementMonth(),
    Escape: () => close(),
  });

  const handleButtonClick = useCallback(() => {
    opened ? close() : open();
  }, []);

  const handleChange = useCallback(
    (date: dayjs.Dayjs) => {
      onChange(date);
      close();
    },
    [onChange],
  );

  const handleBlur = useCallback((e: React.FocusEvent<HTMLButtonElement>) => {
    if (
      e.relatedTarget?.getAttribute("role") !== "button" &&
      e.target?.getAttribute("role") !== "button"
    ) {
      close();
    }
  }, []);

  return (
    <div className={classes.datePicker} onKeyUp={keyHandler()}>
      <button
        aria-label="Choose Date"
        aria-haspopup="dialog"
        aria-selected={selected !== null}
        ref={self}
        onClick={handleButtonClick}
        onBlur={handleBlur}
      >
        <Today className="small" />
        {selected !== null && (
          <time dateTime={selectedDate.format("YYYY-MM-DD")}>
            {selectedDate.format("DD/MM/YYYY")}
          </time>
        )}
      </button>
      <div role="dialog" aria-hidden={!opened} aria-modal="true">
        <div role="group">
          <button
            aria-label="Previous Month"
            role="button"
            onClick={() => decrementMonth()}
          >
            <ChevronLeft className="small" />
          </button>
          <span>{monthAndYear}</span>
          <button
            aria-label="Next Month"
            role="button"
            onClick={() => incrementMonth()}
            aria-disabled={date.isSame(dayjs(), "month")}
          >
            <ChevronRight className="small" />
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
              onSelectDate={handleChange}
              todayButton={todayButton}
            />
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Dates(): React.ReactElement | null {
  const { date: selectedDate, dates, setDate } = useDates();

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
