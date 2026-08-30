# Sanvi's Birthday Website 🎂

A 6-page surprise site: **Countdown → Wishes → Posters → Letter → Gallery → Cake**.
Pure HTML/CSS/JS, no build tools, no libraries. Just open `index.html` in a browser.

## How the "lock" works
- `script.js` has one line that controls everything:
  ```js
  const BIRTHDAY_TARGET = new Date("2026-09-01T00:01:00");
  ```
- Every page except `index.html` calls `guardPage()`, which bounces the visitor
  back to the countdown page if the target time hasn't passed yet (checked
  against the visitor's own device clock).
- Once the time passes, `index.html` unlocks itself automatically and shows
  an "Enter your surprise" button — no refresh needed.

**Testing tip:** to preview the unlocked pages before Sep 1, temporarily set
`BIRTHDAY_TARGET` to a time a minute in the past, check everything looks
right, then set it back.

## Adding your real photos
Right now the site uses placeholder images (`placehold.co`) so it works out
of the box. To use real photos:
1. Create a `photos/` folder next to these files (already created for you).
2. Drop your images in, e.g. `photos/1.jpg`, `photos/2.jpg`, `photos/us.jpg`.
3. In `letter.html`, replace the three `src="https://placehold.co/..."` lines
   inside `.letter-photos` with `src="photos/1.jpg"` etc.
4. In `gallery.html`, edit the `PHOTOS` array near the bottom — change each
   `img:` value to your own path, and rewrite each `note:` to your own
   message.
5. Optional: swap the round photo placeholder or add one to `index.html` /
   `messages.html` the same way.

## What's new: pink theme + extra cute touches
- **Theme**: recolored everything to a "ribbons & bows" palette — deep berry
  pink, hot pink, and gold, defined once at the top of `style.css` under
  `:root`. Change those hex values there to retint the whole site at once.
- **🎀 everywhere**: corner bow accents, a bow page-divider, bow cursor trail
  as she moves the mouse (or finger, on mobile), and bow-themed confetti
  colors.
- **Hug button** (Wishes page): tapping "Send Sanvi a hug 🎀" floats little
  hearts up the screen and counts how many hugs were sent — just a small
  playful extra.
- **Music widget**: see the Spotify section below.

## Personalizing the words
- `letter.html` — the full letter text is inside `.letter-paper`. Rewrite it
  freely; it's just paragraphs.
- `posters.html` — six poster cards, each with a title + one line. Swap the
  copy for inside jokes, memories, nicknames, etc.
- `messages.html` — the main birthday message paragraphs.
- Every page has `<span class="script-name">Sanvi</span>` — replace "Sanvi"
  anywhere you want to use a nickname instead.

## Adding your Spotify song
There's a small 🎀 **Music** button in the top-right corner of the Wishes,
Posters, Letter, and Gallery pages. Tap it to open a Spotify player.

To swap in your own song:
1. In Spotify, open the song → **Share → Copy link to song**. You'll get
   something like `https://open.spotify.com/track/60nZcImufyMA1MKQY3dcCH`.
2. Take the ID after `/track/` (e.g. `60nZcImufyMA1MKQY3dcCH`).
3. In `messages.html`, `posters.html`, `letter.html`, and `gallery.html`,
   find the line:
   ```html
   <iframe ... src="https://open.spotify.com/embed/track/60nZcImufyMA1MKQY3dcCH?..." ...>
   ```
   and replace `60nZcImufyMA1MKQY3dcCH` with your own track ID (do this in
   all four files so it's consistent everywhere).

**Why it doesn't play non-stop across pages:** this is a classic multi-page
site (not a single-page app), so each page load is a fresh page — audio
can't literally carry over when the browser navigates. In practice this
means she'll tap ▶️ once per page, which still reads as "the song plays
through the whole surprise." The music widget is intentionally **not** on
the Cake page — that's the cue that the song pauses there, right as the
candles come out, and the generated Happy Birthday tune takes over instead.
If you want truly seamless one-continuous-song playback across every page,
that requires converting this into a single-page app — let me know if you
want that version instead.

## The birthday song on the cake page
No audio file needed — `playBirthdayTune()` in `script.js` generates the
"Happy Birthday" melody live using the Web Audio API (oscillator notes).
If you'd rather use a real recording there too, add an mp3 to the folder
and replace the `playBirthdayTune()` call in `cake.html` with a normal
`new Audio("your-song.mp3").play()`.

## Deploying so she can open it from a link
Easiest free options:
- **GitHub Pages**: push this folder to a repo, enable Pages in settings,
  share the generated link.
- **Netlify Drop**: go to app.netlify.com/drop and drag this whole folder in
  — you get a shareable link in seconds.
- Or just zip it and send the files directly if she'll open it on the same
  device/browser.

## File map
```
index.html      – countdown / lock page (the only page open before Sep 1)
messages.html   – birthday wishes + floating balloons
posters.html    – 6 CSS-designed poster cards
letter.html     – click-to-open envelope + letter + photos
gallery.html    – click-to-flip photo cards with hidden messages
cake.html       – SVG cake, click-to-blow candles, confetti, song
style.css       – all shared styling (palette, fonts, animations)
script.js       – countdown/unlock logic, confetti, tune, flip cards
photos/         – put your real images here
```

Happy Birthday, Sanvi! 🎉
