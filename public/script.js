/* const tracks = document.querySelectorAll('.track');
const audioPlayer = document.getElementById('audio-player');

tracks.forEach(track => {
  track.addEventListener('click', () => {
    const src = track.getAttribute('data-src');
    audioPlayer.src = src;
    audioPlayer.style.display = 'block';
    audioPlayer.play();
  });
});

*/

const tracks = document.querySelectorAll(".track");
const audio = document.getElementById("audio-player");
const timeline = document.getElementById("timeline");
const playBtn = document.getElementById("playBtn");
const currentTimeEl = document.getElementById("current-time");
const totalTimeEl = document.getElementById("total-time");

const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');


// Utility to format seconds as mm:ss
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}


// Clickin a track changes the audio source
tracks.forEach(track => {
  track.addEventListener("click", () => {
    audio.src = track.dataset.src;
    audio.play();
  });
});


// Play /Pause toggle with icon switching
playBtn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    playIcon.style.display = "none";
    pauseIcon.style.display = "inline";
  } else {
    audio.pause();
    playIcon.style.display = "inline";
    pauseIcon.style.display = "none";
  }
});

// NEW — keep icons in sync with actual audio state lol
audio.addEventListener("play", () => {
  playIcon.style.display = "none";
  pauseIcon.style.display = "inline";
});

audio.addEventListener("pause", () => {
  playIcon.style.display = "inline";
  pauseIcon.style.display = "none";
});

// Update slider max when audio metadata loads
audio.addEventListener("loadedmetadata", () => {
  timeline.max = audio.duration;
  totalTimeEl.textContent = formatTime(audio.duration);
});

// Update slider as the song plays
audio.addEventListener("timeupdate", () => {
  timeline.value = audio.currentTime;
  currentTimeEl.textContent = formatTime(audio.currentTime);
});

// Jump to a specific time when user drags slider
timeline.addEventListener("input", () => {
  audio.currentTime = timeline.value;
   currentTimeEl.textContent = formatTime(timeline.value);
});



// PASSWORD FUNCTIONALITY 
const passwordOverlay = document.getElementById("password-overlay");
const passwordInput = document.getElementById("password-input");
const submitButton = document.getElementById("submit-password");
const errorMessage = document.getElementById("password-error");
const mainContent = document.getElementById("main-content");

const correctPassword = "XXXXAOS";

function checkPassword() {
  const enteredPassword = passwordInput.value;
  
  if (enteredPassword === correctPassword) {
    passwordOverlay.style.display = "none";
    mainContent.style.display = "block";
    errorMessage.textContent = "";
  } else {
    errorMessage.textContent = "Incorrect password. Please try again.";
    passwordInput.value = "";
    passwordInput.focus();
  }
}

submitButton.addEventListener("click", checkPassword);

passwordInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    checkPassword();
  }
});

// Focus on password input when page loads
window.addEventListener("load", () => {
  passwordInput.focus();
});