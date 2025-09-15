const songs = [
  'songs/song1.mp3',
  'songs/song2.mp3',
  'songs/song3.mp3',
  'songs/song4.mp3',
  'songs/song5.mp3'
];

const phrases = [
  "Never give up.",
  "Believe you can.",
  "Keep moving forward.",
  "Make your own sunshine.",
  "Work hard, stay humble."
];

let audio = new Audio();
let isPlaying = false;
let currentSong = 0;

const playPauseBtn = document.getElementById('play-pause');
const nextBtn = document.getElementById('next-song');
const prevBtn = document.getElementById('prev-song');
const partyLights = document.getElementById('party-lights');
const character = document.getElementById('character');
const drums = document.querySelectorAll('.drum');

let charPos = 0;
let charDir = 1;
let charSpeed = 3;   // normal movement speed
let currentSpeed = 0;  // current speed (for smooth slowdown)
let moveInterval;

// ------------------------
// PLAY SPECIFIC SONG
// ------------------------
function playSong(index) {
  if (index < 0) index = songs.length - 1;
  if (index >= songs.length) index = 0;
  currentSong = index;

  audio.src = songs[currentSong];
  audio.play();
  isPlaying = true;

  updatePlayPauseIcon();
  resetCharacter();
  startAnimations();

  // Update character text
  const phraseIndex = currentSong % phrases.length;
  character.textContent = phrases[phraseIndex];
}

// ------------------------
// NEXT / PREVIOUS
// ------------------------
function nextSong() {
  playSong(currentSong + 1);
}

function prevSong() {
  playSong(currentSong - 1);
}

// ------------------------
// UPDATE PLAY/PAUSE ICON
// ------------------------
function updatePlayPauseIcon() {
  const img = playPauseBtn.querySelector('img');
  img.src = isPlaying ? 'icons/pause.jpg' : 'icons/play.jpg';
}

// ------------------------
// RESET CHARACTER
// ------------------------
function resetCharacter() {
  charPos = 0;
  charDir = 1;
  character.style.left = '0px';
  character.style.transform = 'scaleX(1)';
}

// ------------------------
// CHARACTER MOVEMENT (FIXED SPEED)
// ------------------------
function moveCharacter() {
  charPos += charDir * currentSpeed;
  if (charPos > 520 || charPos < 0) {
    charDir *= -1;
  }

  character.style.transform = charDir === 1 ? 'scaleX(1)' : 'scaleX(-1)';
  character.style.left = charPos + 'px';
}

// ------------------------
// START / STOP ANIMATIONS
// ------------------------
function startAnimations() {
  // smoothly accelerate to normal speed
  clearInterval(moveInterval);
  currentSpeed = 0;
  moveInterval = setInterval(() => {
    if (currentSpeed < charSpeed) currentSpeed += 0.05; // speed up smoothly
    moveCharacter();
  }, 20);

  drums.forEach(drum => drum.style.animation = 'vibrate 0.2s infinite, pulse 0.5s infinite alternate');
  partyLights.style.animationPlayState = 'running';
}

function stopAnimations() {
  // smoothly slow down to 0
  clearInterval(moveInterval);
  moveInterval = setInterval(() => {
    if (currentSpeed > 0) {
      currentSpeed -= 0.03;
      if (currentSpeed < 0) currentSpeed = 0;
      moveCharacter();
    } else {
      clearInterval(moveInterval);
    }
  }, 20);

  drums.forEach(drum => drum.style.animation = '');
  partyLights.style.animationPlayState = 'paused';
}

// ------------------------
// EVENT LISTENERS
// ------------------------
playPauseBtn.addEventListener('click', () => {
  if (!isPlaying) {
    if (!audio.src) playSong(currentSong);
    else audio.play();
    isPlaying = true;
    updatePlayPauseIcon();
    startAnimations();
  } else {
    audio.pause();
    isPlaying = false;
    updatePlayPauseIcon();
    stopAnimations();
  }
});

nextBtn.addEventListener('click', nextSong);
prevBtn.addEventListener('click', prevSong);

// When a song ends, play next song automatically
audio.addEventListener('ended', nextSong);
