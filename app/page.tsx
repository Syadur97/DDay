"use client";

import { useEffect, useMemo, useState } from "react";
import { dateInvite } from "./config";

function useCountdown(target: string) {
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, new Date(target).getTime() - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds, isPast: diff === 0 };
}

export default function Page() {
  const [opened, setOpened] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const { days, hours, minutes, seconds, isPast } = useCountdown(
    dateInvite.isoDateTime
  );

  useEffect(() => {
    try {
      if (localStorage.getItem("date-invite-rsvp") === "yes") {
        setConfirmed(true);
        setOpened(true);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const formatted = useMemo(() => {
    const d = new Date(dateInvite.isoDateTime);
    return {
      weekday: d.toLocaleDateString(undefined, { weekday: "long" }),
      date: d.toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      time: d.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
      }),
    };
  }, []);

  function handleConfirm() {
    setConfirmed(true);
    try {
      localStorage.setItem("date-invite-rsvp", "yes");
    } catch {
      // ignore storage errors
    }
  }

  return (
    <main className="stage">
      <div className="stars" aria-hidden="true" />

      {!opened && (
        <div className="preamble">
          <p className="eyebrow">A small secret</p>
          <h1>For you, {dateInvite.toName}</h1>
          <p>Tap the seal to open it.</p>
        </div>
      )}

      <div className="envelope-wrap">
        <div
          className={`envelope ${opened ? "opened" : ""}`}
          role="button"
          tabIndex={0}
          aria-label={opened ? "Invitation opened" : "Open invitation"}
          aria-pressed={opened}
          onClick={() => setOpened(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setOpened(true);
          }}
        >
          <div className="env-back" />
          <div className="card" />
          <div className="env-flap" />
          <div className="seal">{dateInvite.fromName.charAt(0)}</div>
          <div className="env-hint">Open me</div>
        </div>
      </div>

      {opened && (
        <>
          <section className="invitation">
            <div className="rule" />
            <p className="to">For {dateInvite.toName}</p>
            <h2>Will you save this date with me?</h2>
            <p className="lede">No occasion. Just you, me, and a little time.</p>

            <div className="details">
              <div className="detail-row">
                <span className="detail-label">Date</span>
                <span className="detail-value">
                  {formatted.weekday}, {formatted.date}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Time</span>
                <span className="detail-value">{formatted.time}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Where</span>
                <span className="detail-value">
                  <a
                    href={dateInvite.locationMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {dateInvite.location}
                  </a>
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Wear</span>
                <span className="detail-value">{dateInvite.dressCode}</span>
              </div>
            </div>

            <p className="note">{dateInvite.note}</p>

            <div className="rsvp">
              {confirmed ? (
                <p className="rsvp-confirmed">
                  She said yes — see you there, {dateInvite.toName}.
                </p>
              ) : (
                <button className="rsvp-btn" onClick={handleConfirm}>
                  Yes, I&apos;ll be there
                </button>
              )}
            </div>

            <p className="from">With love, {dateInvite.fromName}</p>
          </section>

          {!isPast && (
            <div className="countdown" aria-label="Countdown to the date">
              <div className="unit">
                <div className="num">{days}</div>
                <div className="lbl">Days</div>
              </div>
              <div className="unit">
                <div className="num">{hours}</div>
                <div className="lbl">Hrs</div>
              </div>
              <div className="unit">
                <div className="num">{minutes}</div>
                <div className="lbl">Min</div>
              </div>
              <div className="unit">
                <div className="num">{seconds}</div>
                <div className="lbl">Sec</div>
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
}
