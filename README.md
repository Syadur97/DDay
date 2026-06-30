# You're Invited — A Surprise Date Reveal

A one-page Next.js + TypeScript site that turns "let's pick a date" into a small
moment: she taps a wax seal, the envelope opens, and a card slides out revealing
the date, time, and location of your next date — plus a live countdown and a
one-tap "I'll be there" confirmation.

## Customize it (the only file you need to touch)

Open `app/config.ts` and fill in your real details:

```ts
export const dateInvite = {
  toName: "Tania",
  fromName: "Saidur",
  isoDateTime: "2026-07-14T19:30:00", // local date & time
  location: "Sajna Rooftop, Gulshan 2, Dhaka",
  locationMapUrl: "https://maps.google.com/?q=...",
  dressCode: "Something you feel beautiful in",
  note: "Bring nothing but yourself — I've got the rest covered.",
};
```

Everything on the page — the headline, the card, the countdown, the map link —
is generated from these six fields.

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Deploy it (so you can just send her a link)

The fastest path is [Vercel](https://vercel.com):

```bash
npx vercel
```

Or push the folder to a GitHub repo and import it on vercel.com — it's a
zero-config Next.js app, so no extra setup is needed.

## How the interaction works

- `app/page.tsx` holds a single `opened` state. Clicking or pressing
  Enter/Space on the envelope flips the flap open (CSS 3D transform) and the
  card slides up out of the envelope.
- Once opened, the invitation card animates in with the date/time/location and
  a live countdown (updates every second via `setInterval`).
- Tapping "Yes, I'll be there" stores the RSVP in `localStorage`, so if she
  reopens the link later it remembers she already said yes.
- Respects `prefers-reduced-motion` — animations are skipped for users who
  have that setting on.

## Stack

- Next.js 14 (App Router) + React 18 + TypeScript
- No UI libraries — hand-built CSS using custom properties for the palette
  (ink navy / cream / dusty rose / antique gold) and Google fonts
  (Playfair Display, Cormorant Garamond, Inter)
- No backend, no database — everything is client-side, so it's free to host
