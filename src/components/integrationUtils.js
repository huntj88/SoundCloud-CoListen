/**
 * Module dependencies
 */

import load from "load-script";

/**
 * Create a new widget by requesting and using the SoundCloud Widget API.
 * https://developers.soundcloud.com/docs/api/html5-widget
 *
 * @param {String} id - reference to iframe element for widget
 * @param {Function} cb
 */

export const createWidget = (iframe, cb) => {
  return load("https://w.soundcloud.com/player/api.js", () => {
    cb(window.SC.Widget(iframe));
  });
};

export const SCPlay = () => window.SC.Widget.Events.PLAY;
