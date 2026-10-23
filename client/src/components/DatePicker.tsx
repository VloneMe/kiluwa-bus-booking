"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar"; // Adjust the import path accordingly

interface CalendarDemoProps {
  onDateChange: (date: Date | undefined) => void;
}

export function CalendarDemo({ onDateChange }: CalendarDemoProps) {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const handleDateChange = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      // Set the time to 00:00:00 to exclude the time part
      const dateOnly = new Date(selectedDate);
      dateOnly.setHours(0, 0, 0, 0);
      setDate(dateOnly);
      onDateChange(dateOnly);
    } else {
      setDate(undefined);
      onDateChange(undefined);
    }
  };

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={handleDateChange}
      className="rounded-md border"
    />
  );
}
