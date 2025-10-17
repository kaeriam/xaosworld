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


// MOBILE NAVIGATION MENU
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const dropdowns = document.querySelectorAll(".dropdown");

// Toggle mobile menu
if (hamburger) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });
}

// Handle dropdown clicks on mobile
dropdowns.forEach(dropdown => {
  const dropbtn = dropdown.querySelector(".dropbtn");
  if (dropbtn) {
    dropbtn.addEventListener("click", (e) => {
      // On mobile, toggle dropdown instead of navigating
      if (window.innerWidth <= 768) {
        e.preventDefault();
        dropdown.classList.toggle("active");
      }
    });
  }
});

// Close menu when clicking on a nav link
document.querySelectorAll(".nav-menu a").forEach(link => {
  link.addEventListener("click", () => {
    // Don't close if it's a dropdown button
    if (!link.classList.contains("dropbtn")) {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    }
  });
});
