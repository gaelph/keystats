export function toDbDate(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export function fromDbDate(input: string): Date {
  const date = new Date();
  const [year, month, day] = input.split("-");
  date.setFullYear(parseInt(year));
  date.setMonth(parseInt(month) - 1);
  date.setDate(parseInt(day));

  return date;
}

export function todayAsDbDate(): string {
  return toDbDate(new Date());
}
