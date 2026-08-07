const schedule = {
  fri: [
    ["6:00 PM", "Drive Time Frequencies", "Soul / Jazz", "Detroit rush-hour decompression."],
    ["8:00 PM", "After Hours", "Jazz", "Deep cuts, new voices, lights down low."],
    ["11:00 PM", "Night Signal", "Eclectic", "Left-field selections for the late shift."],
  ],
  sat: [
    ["12:00 PM", "The Mothership", "Funk", "A Detroit-to-the-cosmos funk transmission."],
    ["3:00 PM", "Motor City Crates", "Soul", "Records with fingerprints still on them."],
    ["9:00 PM", "Saturday Frequency", "Mix", "Dancefloor pressure without a dress code."],
  ],
  sun: [
    ["10:00 AM", "Sunday Lift", "Soul", "A warm start built on spirit and harmony."],
    ["2:00 PM", "Legacy Lines", "Jazz", "Where the elders meet the next generation."],
    ["7:00 PM", "Quiet Storm Detroit", "R&B", "Slow burn selections into Sunday night."],
  ],
  mon: [
    ["7:00 AM", "Morning Signal", "Mix", "Detroit gets moving."],
    ["5:00 PM", "Drive Time Frequencies", "Soul / Jazz", "The commute sounds better over here."],
    ["9:00 PM", "Next Wave", "Future", "New music that refuses a neat category."],
  ],
};

const list = document.querySelector("#schedule-list");
const tabs = document.querySelectorAll("[data-day]");
const player = document.querySelector("#radio-player");
const audio = document.querySelector("#live-audio");
const toggle = document.querySelector("[data-player-toggle]");
const playTriggers = document.querySelectorAll("[data-play-trigger]");
const stateLabels = document.querySelectorAll("[data-state-label]");
const note = document.querySelector("[data-player-note]");
const symbol = document.querySelector("[data-play-symbol]");
const volume = document.querySelector("#volume");
const toast = document.querySelector(".toast");

function renderSchedule(day) {
  const entries = schedule[day] || [];
  list.innerHTML = entries
    .map(
      ([time, show, tag, description]) => `
        <article class="schedule-row">
          <time class="schedule-time">${time}</time>
          <div><h3>${show}</h3><p>${description}</p></div>
          <span class="schedule-tag">${tag}</span>
        </article>`,
    )
    .join("");
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((item) => item.setAttribute("aria-selected", String(item === tab)));
    renderSchedule(tab.dataset.day);
  });
});

const states = {
  idle: ["Ready", "Stream connection is ready for configuration."],
  connecting: ["Connecting", "Opening the WUPF live signal…"],
  playing: ["Live", "You are listening to WUPF."],
  paused: ["Paused", "Playback paused on this device."],
  error: ["Unavailable", "The live signal could not be reached."],
};

function setPlayerState(nextState) {
  const [label, message] = states[nextState] || states.idle;
  player.dataset.playerState = nextState;
  stateLabels.forEach((item) => { item.textContent = label; });
  note.textContent = message;
  symbol.textContent = nextState === "playing" ? "❚❚" : "▶";
  toggle.setAttribute("aria-label", nextState === "playing" ? "Pause WUPF live radio" : "Play WUPF live radio");
  document.body.classList.toggle("is-playing", nextState === "playing");
}

function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => { toast.hidden = true; }, 3200);
}

async function playLive() {
  const streamUrl = audio.dataset.streamUrl?.trim();
  if (!streamUrl) {
    setPlayerState("error");
    note.textContent = "Add the verified WUPF stream URL to enable live audio.";
    showToast("Live audio needs the verified WUPF stream URL.");
    return;
  }

  try {
    if (!audio.src) audio.src = streamUrl;
    setPlayerState("connecting");
    await audio.play();
  } catch (error) {
    setPlayerState("error");
    showToast("The live signal could not start. Try again in a moment.");
  }
}

function togglePlayback() {
  if (!audio.paused) {
    audio.pause();
    return;
  }
  playLive();
}

toggle.addEventListener("click", togglePlayback);
playTriggers.forEach((button) => button.addEventListener("click", togglePlayback));
audio.addEventListener("playing", () => setPlayerState("playing"));
audio.addEventListener("pause", () => setPlayerState(audio.currentTime > 0 ? "paused" : "idle"));
audio.addEventListener("waiting", () => setPlayerState("connecting"));
audio.addEventListener("stalled", () => setPlayerState("connecting"));
audio.addEventListener("error", () => setPlayerState("error"));
volume.addEventListener("input", () => { audio.volume = Number(volume.value); });
audio.volume = Number(volume.value);

renderSchedule("fri");
setPlayerState("idle");
