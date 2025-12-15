/**
 * Function that plays sound effects. Used mostly for the casino games.
 * @param {string} soundFilePath - Path to the mp3 sound file.
 * @param {boolean} isSoundOn - the bool sound tracking variable passed from redux state
 * @returns {void}
 */
export const playSound = (soundFilePath, isSoundOn) => {
    if (isSoundOn) {
      const audio = new Audio(soundFilePath);
      audio.play();
    }
}