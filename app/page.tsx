"use client";

import { FormEvent, useState } from "react";
import { inviteConfig } from "./config";

type Step =
  | "name"
  | "ask"
  | "decline"
  | "date"
  | "place"
  | "comments"
  | "final";

export default function Page() {
  const [step, setStep] = useState<Step>("name");
  const [name, setName] = useState("");
  const [dateValue, setDateValue] = useState("");
  const [timeValue, setTimeValue] = useState("");
  const [place, setPlace] = useState("");
  const [comments, setComments] = useState("");

  const steps: Step[] = ["name", "ask", "date", "place", "comments", "final"];
  const progressIndex = steps.indexOf(step === "decline" ? "ask" : step);

  function goNext(next: Step) {
    setStep(next);
  }

  function formattedDate() {
    if (!dateValue) return "";
    const d = new Date(`${dateValue}T${timeValue || "00:00"}`);
    return d.toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  function formattedTime() {
    if (!timeValue) return "";
    const d = new Date(`2000-01-01T${timeValue}`);
    return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  }

  return (
    <main className="stage">
      <Decorations />

      <div className="wizard">
        {step !== "decline" && (
          <div className="progress" aria-hidden="true">
            {steps.map((s, i) => (
              <span
                key={s}
                className={`dot ${i <= progressIndex ? "filled" : ""}`}
              />
            ))}
          </div>
        )}

        {/* Step 1: name */}
        {step === "name" && (
          <Panel>
            <span className="sticker">🌷</span>
            <p className="eyebrow">A little note from {inviteConfig.fromName}</p>
            <h2>Before anything else — what should I call you?</h2>
            <form
              className="form"
              onSubmit={(e: FormEvent) => {
                e.preventDefault();
                if (name.trim()) goNext("ask");
              }}
            >
              <input
                className="text-input"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                required
              />
              <button className="btn primary" type="submit">
                Continue
              </button>
            </form>
          </Panel>
        )}

        {/* Step 2: ask */}
        {step === "ask" && (
          <Panel>
            <span className="sticker">💌</span>
            <p className="eyebrow">Hi {name || "there"}</p>
            <h2>Do you want to go on a date with me?</h2>
            <p className="lede">No pressure — just asking honestly.</p>
            <div className="btn-row">
              <button className="btn primary" onClick={() => goNext("date")}>
                Yes, I&apos;d love to
              </button>
              <button className="btn ghost" onClick={() => goNext("decline")}>
                Not this time
              </button>
            </div>
          </Panel>
        )}

        {/* Decline path */}
        {step === "decline" && (
          <Panel>
            <span className="sticker">🌼</span>
            <div className="rule" />
            <p className="to">For {name || "you"}</p>
            <h2>Thank you for telling me.</h2>
            <p className="lede">{inviteConfig.declineMessage}</p>
            <p className="from">With respect, {inviteConfig.fromName}</p>
          </Panel>
        )}

        {/* Step 3: date */}
        {step === "date" && (
          <Panel>
            <span className="sticker">🌸</span>
            <p className="eyebrow">Step 2 of 4</p>
            <h2>Pick a date that works for you</h2>
            <form
              className="form"
              onSubmit={(e: FormEvent) => {
                e.preventDefault();
                if (dateValue) goNext("place");
              }}
            >
              <label className="field-label" htmlFor="date">
                Date
              </label>
              <input
                id="date"
                className="text-input"
                type="date"
                value={dateValue}
                onChange={(e) => setDateValue(e.target.value)}
                required
                autoFocus
              />
              <label className="field-label" htmlFor="time">
                Time (optional)
              </label>
              <input
                id="time"
                className="text-input"
                type="time"
                value={timeValue}
                onChange={(e) => setTimeValue(e.target.value)}
              />
              <div className="btn-row">
                <button
                  type="button"
                  className="btn ghost"
                  onClick={() => goNext("ask")}
                >
                  Back
                </button>
                <button className="btn primary" type="submit">
                  Continue
                </button>
              </div>
            </form>
          </Panel>
        )}

        {/* Step 4: place */}
        {step === "place" && (
          <Panel>
            <span className="sticker">💐</span>
            <p className="eyebrow">Step 3 of 4</p>
            <h2>Where would you like to go?</h2>
            <form
              className="form"
              onSubmit={(e: FormEvent) => {
                e.preventDefault();
                if (place.trim()) goNext("comments");
              }}
            >
              <input
                className="text-input"
                placeholder="Type a place, or pick a suggestion below"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                autoFocus
                required
              />
              <div className="chips">
                {inviteConfig.placeSuggestions.map((p) => (
                  <button
                    type="button"
                    key={p}
                    className={`chip ${place === p ? "active" : ""}`}
                    onClick={() => setPlace(p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <div className="btn-row">
                <button
                  type="button"
                  className="btn ghost"
                  onClick={() => goNext("date")}
                >
                  Back
                </button>
                <button className="btn primary" type="submit">
                  Continue
                </button>
              </div>
            </form>
          </Panel>
        )}

        {/* Step 5: comments */}
        {step === "comments" && (
          <Panel>
            <span className="sticker">🌻</span>
            <p className="eyebrow">Step 4 of 4</p>
            <h2>Anything special I should know?</h2>
            <p className="lede">
              Allergies, a mood you&apos;re in, something you&apos;ve been wanting — tell me anything.
            </p>
            <form
              className="form"
              onSubmit={(e: FormEvent) => {
                e.preventDefault();
                goNext("final");
              }}
            >
              <textarea
                className="text-area"
                placeholder="Optional — leave blank if nothing comes to mind"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={4}
                autoFocus
              />
              <div className="btn-row">
                <button
                  type="button"
                  className="btn ghost"
                  onClick={() => goNext("place")}
                >
                  Back
                </button>
                <button className="btn primary" type="submit">
                  See the plan
                </button>
              </div>
            </form>
          </Panel>
        )}

        {/* Final card */}
        {step === "final" && (
          <Panel>
            <span className="sticker">💖</span>
            <div className="rule" />
            <p className="to">For {name}</p>
            <h2>It&apos;s a date. 🌷</h2>
            <p className="lede">Here&apos;s everything, all in one place.</p>

            <div className="details">
              <div className="detail-row">
                <span className="detail-label">Date</span>
                <span className="detail-value">{formattedDate()}</span>
              </div>
              {timeValue && (
                <div className="detail-row">
                  <span className="detail-label">Time</span>
                  <span className="detail-value">{formattedTime()}</span>
                </div>
              )}
              <div className="detail-row">
                <span className="detail-label">Where</span>
                <span className="detail-value">{place}</span>
              </div>
              {comments.trim() && (
                <div className="detail-row">
                  <span className="detail-label">Note</span>
                  <span className="detail-value note-value">{comments}</span>
                </div>
              )}
            </div>

            <p className="from">With love, {inviteConfig.fromName}</p>

            <button
              type="button"
              className="btn ghost small"
              onClick={() => {
                setStep("name");
                setName("");
                setDateValue("");
                setTimeValue("");
                setPlace("");
                setComments("");
              }}
            >
              Start over
            </button>
          </Panel>
        )}
      </div>
    </main>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return <section className="panel">{children}</section>;
}

const DECOR_ITEMS = [
  { emoji: "🌸", top: "8%", left: "10%", size: "2.4rem", delay: "0s", duration: "9s" },
  { emoji: "💐", top: "14%", left: "82%", size: "2.6rem", delay: "1.2s", duration: "10s" },
  { emoji: "🌷", top: "30%", left: "4%", size: "2rem", delay: "2.1s", duration: "8s" },
  { emoji: "💖", top: "70%", left: "88%", size: "2rem", delay: "0.6s", duration: "7.5s" },
  { emoji: "🌻", top: "82%", left: "12%", size: "2.2rem", delay: "1.8s", duration: "9.5s" },
  { emoji: "🌼", top: "20%", left: "92%", size: "1.8rem", delay: "3s", duration: "8.5s" },
  { emoji: "💌", top: "88%", left: "78%", size: "2rem", delay: "0.9s", duration: "9s" },
  { emoji: "🌹", top: "50%", left: "94%", size: "2.1rem", delay: "2.6s", duration: "8s" },
  { emoji: "✨", top: "55%", left: "3%", size: "1.6rem", delay: "1.5s", duration: "7s" },
  { emoji: "💕", top: "6%", left: "45%", size: "1.7rem", delay: "2.3s", duration: "8.5s" },
];

function Decorations() {
  return (
    <div className="decor-layer" aria-hidden="true">
      {DECOR_ITEMS.map((item, i) => (
        <span
          key={i}
          className="decor-item"
          style={{
            top: item.top,
            left: item.left,
            fontSize: item.size,
            animationDelay: item.delay,
            animationDuration: item.duration,
          }}
        >
          {item.emoji}
        </span>
      ))}
    </div>
  );
}
