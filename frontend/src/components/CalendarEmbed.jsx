import React from "react";

const CALENDLY_URL = "https://calendly.com/your-coach-link"; // Replace as needed

export default function CalendarEmbed() {
  return (
    <div className="w-full max-w-xl mx-auto" role="region" aria-label="Booking calendar">
      <iframe
        src={CALENDLY_URL}
        width="100%"
        height="600"
        frameBorder="0"
        title="Book Study Session"
        className="border rounded shadow"
        aria-label="Study session booking calendar"
      />
    </div>
  );
}