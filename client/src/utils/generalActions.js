/**
 * Function that plays sound effects. Used mostly for the casino games.
 * @param {string} soundFilePath - Path to the mp3 sound file.
 * @param {boolean} isSoundOn - the bool sound tracking variable passed from redux state
 * @returns {object} - the audio file 
 */
export const playSound = (soundFilePath, isSoundOn) => {
  const audio = new Audio(soundFilePath);

  if (isSoundOn) {
    audio.play();
  }
  
  return audio;
}


/**
 * Function that gradually fades out a playing audio effect.
 * @param {object} audio - Audio thats already playing.
 * @param {number} duration - In ms to set for how long the audio to play.
 * @returns {void}
 */
export const fadeOutAudio = (audio, duration) => {
  if (!audio) return;
  
  let volume = audio.volume;
  const step = volume / (duration / 100);

  const fadeOut = setInterval(() => {
    volume -= step;
    if (volume <= 0) {
      clearInterval(fadeOut);
      audio.pause();
      audio.currentTime = 0;
    } else {
      audio.volume = volume;
    }
  }, 100);
};

/**
 * Function that capitalizes strings (Makes the first letter uppercase).
 * @param {string} someString - String to be capitalized.
 * @returns {string} The capitalized string;
 */
export const capitalize = (someString) => {
  return someString.charAt(0).toUpperCase() + someString.slice(1);
}