/**
 * Function that plays sound effects. Used mostly for the casino games.
 * @param {string} soundFilePath - Path to the mp3 sound file.
 * @returns {void}
 */
export const playSound = (soundFilePath) => {
    if (soundOn) {
      const audio = new Audio(soundFilePath);
      audio.play();
    }
}