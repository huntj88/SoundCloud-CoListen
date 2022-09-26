/**
 * Module dependencies
 */

import load from "load-script";

/**
 * Create a new widget by requesting and using the SoundCloud Widget API.
 *
 * @param {String} id - reference to iframe element for widget
 * @param {Function} cb
 */

// const createWidget = (cb) => {
//   return load("https://w.soundcloud.com/player/api.js", () => {
//     cb(
//       window.SC.Widget(document.getElementsByClassName("soundcloudIFrame")[0])
//     );
//   });
// };

export const createWidget = (iframe, cb) => {
  return load("https://w.soundcloud.com/player/api.js", () => {
    cb(window.SC.Widget(iframe));
  });
};

export const SCPlay = () => window.SC.Widget.Events.PLAY;
