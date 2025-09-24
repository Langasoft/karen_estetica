/**
 * MonthlyCalendar - reusable calendar component
 * - Shows month grid (Sun → Sat)
 * - Highlights today by default
 * - Navigate months and years
 * - Emits onDateChange selected date (ISO string)
 */
"use client";

import { useMemo, useState } from "react";

export interface MonthlyCalendarProps {
  initialDate?: Date;
  onDateChange?: (date: Date) => void;
  className?: string;
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function addMonths(date: Date, months: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

export default function MonthlyCalendar({ initialDate, onDateChange, className = "" }: MonthlyCalendarProps) {
  const today = new Date();
  const [current, setCurrent] = useState<Date>(startOfMonth(initialDate ?? today));
  const [selected, setSelected] = useState<Date>(initialDate ?? today);

  const weeks = useMemo(() => {
    const start = startOfMonth(current);
    const end = endOfMonth(current);

    // Determine leading days from previous month to fill first week (Sunday=0)
    const startWeekday = start.getDay();
    const daysInMonth = end.getDate();

    const grid: Date[] = [];

    // Previous month leading days
    for (let i = 0; i < startWeekday; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() - (startWeekday - i));
      grid.push(d);
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      grid.push(new Date(current.getFullYear(), current.getMonth(), d));
    }

    // Trailing days to complete weeks (42 cells = 6 weeks max)
    while (grid.length % 7 !== 0) {
      const last = grid[grid.length - 1];
      const next = new Date(last);
      next.setDate(next.getDate() + 1);
      grid.push(next);
    }

    // Chunk into weeks
    const weeks: Date[][] = [];
    for (let i = 0; i < grid.length; i += 7) {
      weeks.push(grid.slice(i, i + 7));
    }
    return weeks;
  }, [current]);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  const goPrevMonth = () => setCurrent(addMonths(current, -1));
  const goNextMonth = () => setCurrent(addMonths(current, 1));
  const goPrevYear = () => setCurrent(new Date(current.getFullYear() - 1, current.getMonth(), 1));
  const goNextYear = () => setCurrent(new Date(current.getFullYear() + 1, current.getMonth(), 1));

  const handleSelect = (date: Date) => {
    setSelected(date);
    onDateChange?.(date);
  };

  const monthFormatter = new Intl.DateTimeFormat('es-AR', { month: 'long', year: 'numeric' });
  const monthLabel = monthFormatter.format(current);

  return (
    <div className={`rounded-2xl border border-[--brand-tertiary]/20 bg-[--brand-secondary] ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[--brand-tertiary]/20">
        <div className="flex items-center gap-2">
          <button onClick={goPrevYear} className="px-2 py-1 text-sm rounded hover:bg-[--brand-primary]/50">«</button>
          <button onClick={goPrevMonth} className="px-2 py-1 text-sm rounded hover:bg-[--brand-primary]/50">‹</button>
        </div>
        <div className="text-sm font-medium capitalize text-[--foreground]">{monthLabel}</div>
        <div className="flex items-center gap-2">
          <button onClick={goNextMonth} className="px-2 py-1 text-sm rounded hover:bg-[--brand-primary]/50">›</button>
          <button onClick={goNextYear} className="px-2 py-1 text-sm rounded hover:bg-[--brand-primary]/50">»</button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 text-xs text-center text-[--foreground]/70 px-2 pt-2">
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((d) => (
          <div key={d} className="py-1">{d}</div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1 p-2">
        {weeks.flat().map((date, idx) => {
          const inCurrentMonth = date.getMonth() === current.getMonth();
          const isToday = isSameDay(date, today);
          const isSelected = isSameDay(date, selected);
          return (
            <button
              key={idx}
              onClick={() => handleSelect(date)}
              className={
                `aspect-square rounded-lg text-sm flex items-center justify-center ` +
                `${inCurrentMonth ? 'text-[--foreground]' : 'text-[--foreground]/40'} ` +
                `${isSelected ? 'bg-[--brand-quaternary] text-white' : isToday ? 'bg-[--brand-primary]/60' : 'hover:bg-[--brand-primary]/40'}`
              }
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}


