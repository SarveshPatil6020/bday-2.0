/* ============================================================
   SANVI'S BIRTHDAY SITE — shared logic
   ============================================================ */

// ---- 1. THE BIG DATE ----------------------------------------------------
// Change the date below if you need to. Format: YYYY-MM-DDTHH:MM:SS
// This is read in the VISITOR'S local time.
const BIRTHDAY_TARGET = new Date("2026-09-01T00:01:00");

function isUnlocked() {
  return new Date() >= BIRTHDAY_TARGET;
}

// Redirect away from any "surprise" page if the big moment hasn't arrived.
// Call this at the top of every page except index.html.
function guardPage() {
  if (!isUnlocked()) {
    window.location.href = "index.html";
  }
}

// ---- 2. AMBIENT FIREFLIES (decorative, runs on every page) --------------
function spawnAmbientFireflies(container, count = 18) {
  if (!container) return;
  for (let i = 0; i < count; i++) {
    const f = document.createElement("span");
    const left = Math.random() * 100;
    const bottom = Math.random() * 100;
    const delay = Math.random() * 12;
    const duration = 9 + Math.random() * 8;
    f.style.left = left + "vw";
    f.style.bottom = bottom + "vh";
    f.style.animationDelay = `${delay}s, ${delay}s`;
    f.style.animationDuration = `${duration}s, ${2.5 + Math.random() * 2}s`;
    container.appendChild(f);
  }
}

// ---- 3. CONFETTI BURST (canvas based, no libraries needed) --------------
function burstConfetti(canvas, durationMs = 3000) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ["#f3c877", "#eab0c6", "#cdb6e8", "#fbf3e6", "#ff9ec4"];
  const pieces = Array.from({ length: 140 }, () => ({
    x: Math.random() * canvas.width,
    y: -20 - Math.random() * canvas.height * 0.4,
    r: 4 + Math.random() * 6,
    color: colors[Math.floor(Math.random() * colors.length)],
    speedY: 2 + Math.random() * 3,
    speedX: -1.5 + Math.random() * 3,
    rot: Math.random() * 360,
    rotSpeed: -6 + Math.random() * 12,
  }));

  let start = null;
  function frame(ts) {
    if (!start) start = ts;
    const elapsed = ts - start;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach((p) => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.rot += p.rotSpeed;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.6);
      ctx.restore();
    });
    if (elapsed < durationMs) {
      requestAnimationFrame(frame);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  requestAnimationFrame(frame);
}

// ---- 4. HAPPY BIRTHDAY TUNE (generated live, no mp3 needed) -------------
// Simple oscillator-based melody so the site works with zero audio files.
function playBirthdayTune() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;
  const ctx = new AudioCtx();

  // Note frequencies (Hz)
  const N = {
    C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23,
    G4: 392.0, A4: 440.0, B4: 493.88, C5: 523.25, D5: 587.33,
  };

  // "Happy Birthday" melody, [note, beat-length]
  const melody = [
    [N.C4, 0.5], [N.C4, 0.5], [N.D4, 1], [N.C4, 1], [N.F4, 1], [N.E4, 2],
    [N.C4, 0.5], [N.C4, 0.5], [N.D4, 1], [N.C4, 1], [N.G4, 1], [N.F4, 2],
    [N.C4, 0.5], [N.C4, 0.5], [N.C5, 1], [N.A4, 1], [N.F4, 1], [N.E4, 1], [N.D4, 2],
    [N.B4, 0.5], [N.B4, 0.5], [N.A4, 1], [N.F4, 1], [N.G4, 1], [N.F4, 2],
  ];

  const beat = 0.34; // seconds per beat unit
  let t = ctx.currentTime + 0.05;

  melody.forEach(([freq, len]) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.22, t + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, t + len * beat);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + len * beat + 0.05);
    t += len * beat;
  });

  return t - ctx.currentTime; // total duration in seconds
}

// ---- 4b. SPOTIFY SONG THAT FOLLOWS YOU FROM PAGE TO PAGE -----------------
// Plays on messages/posters/letter/gallery, then stops once you reach the
// cake page (which has its own generated Happy Birthday tune instead).
//
// >>> REPLACE THIS with your song's link <<<
// Open the song in Spotify, click Share -> Copy Link, then turn it into a
// URI like this: https://open.spotify.com/track/7J1uxwnxfQLu4APicE5Rnj
//                                                  ^^^^^^^^^^^^^^^^^^^^ this part
// becomes:        spotify:track:7J1uxwnxfQLu4APicE5Rnj
const SPOTIFY_TRACK_URI = "spotify:track:7J1uxwnxfQLu4APicE5Rnj"; // placeholder demo track

const SPOTIFY_POS_KEY = "bday_song_position";
const SPOTIFY_PLAYING_KEY = "bday_song_playing";
const SPOTIFY_STARTED_KEY = "bday_song_started"; // has the visitor pressed play at least once?

function initSpotifyWidget(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const script = document.createElement("script");
  script.src = "https://open.spotify.com/embed/iframe-api/v1";
  script.async = true;
  document.body.appendChild(script);

  window.onSpotifyIframeApiReady = (IFrameAPI) => {
    const savedPosition = parseFloat(localStorage.getItem(SPOTIFY_POS_KEY) || "0");
    const wasPlaying = localStorage.getItem(SPOTIFY_PLAYING_KEY) === "true";

    const options = { uri: SPOTIFY_TRACK_URI, width: "100%", height: "80" };

    const callback = (EmbedController) => {
      window.spotifyController = EmbedController;

      EmbedController.addListener("ready", () => {
        if (savedPosition > 1) {
          EmbedController.seek(savedPosition);
        }
        // Try to resume automatically. Browsers may block this without a
        // fresh click, in which case the visible embed's own play button
        // still works as a fallback.
        if (wasPlaying) {
          EmbedController.play();
        }
      });

      EmbedController.addListener("playback_update", (e) => {
        if (!e || !e.data) return;
        localStorage.setItem(SPOTIFY_POS_KEY, e.data.position || 0);
        localStorage.setItem(SPOTIFY_PLAYING_KEY, e.data.isPaused ? "false" : "true");
        if (!e.data.isPaused) localStorage.setItem(SPOTIFY_STARTED_KEY, "true");
      });
    };

    IFrameAPI.createController(container, options, callback);
  };
}

// Called on cake.html to make sure the Spotify song stays stopped there.
function stopSpotifySong() {
  localStorage.setItem(SPOTIFY_PLAYING_KEY, "false");
}

// ---- 5. FLIP CARDS (gallery page) ---------------------------------------
function initFlipCards() {
  document.querySelectorAll(".flip-card").forEach((card) => {
    card.addEventListener("click", () => card.classList.toggle("flipped"));
  });
}

// ---- 6. NAV ACTIVE STATE --------------------------------------------------
function markActiveNav() {
  const current = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".site-nav a").forEach((a) => {
    if (a.getAttribute("href") === current) a.classList.add("active");
  });
}

// ---- 7. MUSIC WIDGET (Spotify embed toggle) ------------------------------
function initMusicWidget() {
  const btn = document.getElementById("musicToggle");
  const panel = document.getElementById("musicPanel");
  if (!btn || !panel) return;
  btn.addEventListener("click", () => panel.classList.toggle("open"));
}

// ---- 8. CURSOR BOW / SPARKLE TRAIL (cute ambient touch) ------------------
function initCursorBows() {
  const emojis = ["🎀", "✨", "💗"];
  let last = 0;
  window.addEventListener("mousemove", (e) => {
    const now = Date.now();
    if (now - last < 110) return; // throttle
    last = now;
    const span = document.createElement("span");
    span.className = "cursor-bow";
    span.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    span.style.left = e.clientX + "px";
    span.style.top = e.clientY + "px";
    document.body.appendChild(span);
    setTimeout(() => span.remove(), 1000);
  });
  // light touch support
  window.addEventListener("touchmove", (e) => {
    const t = e.touches[0];
    if (!t) return;
    const now = Date.now();
    if (now - last < 150) return;
    last = now;
    const span = document.createElement("span");
    span.className = "cursor-bow";
    span.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    span.style.left = t.clientX + "px";
    span.style.top = t.clientY + "px";
    document.body.appendChild(span);
    setTimeout(() => span.remove(), 1000);
  }, { passive: true });
}

// ---- 9. HUG / HEART BUTTON (messages page) -------------------------------
function initHugButton() {
  const btn = document.getElementById("hugBtn");
  const countEl = document.getElementById("hugCount");
  const layer = document.getElementById("hugLayer");
  if (!btn || !layer) return;
  let count = 0;
  btn.addEventListener("click", () => {
    count++;
    if (countEl) countEl.textContent = `I love You ${count}x 💗`;
    const heart = document.createElement("span");
    heart.className = "floating-heart";
    heart.textContent = ["💗", "🎀", "💕", "✨"][Math.floor(Math.random() * 4)];
    heart.style.left = 40 + Math.random() * 20 + "%";
    heart.style.setProperty("--drift", (-30 + Math.random() * 60) + "px");
    layer.appendChild(heart);
    setTimeout(() => heart.remove(), 2500);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  spawnAmbientFireflies(document.querySelector(".ambient-fireflies"));
  markActiveNav();
  initMusicWidget();
  initCursorBows();
  initHugButton();
});
