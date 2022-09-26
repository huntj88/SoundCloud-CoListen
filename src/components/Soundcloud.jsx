// import { useRef } from "react";
import "../App.css";
import load from "load-script";
// import useScript from "./../useScript";
// import { SC } from "./soundcloudapi";
// import createWidget from "./createWidget";

export const createWidget = (iframe, cb) => {
  return load("https://w.soundcloud.com/player/api.js", () => {
    cb(window.SC.Widget(iframe));
  });
};

export function Soundcloud() {
  const iframeSource =
    '<iframe class="soundcloudIFrame" width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/43315398"></iframe>';

  return (
    <div>
      <div
        className="sApp"
        dangerouslySetInnerHTML={{ __html: iframeSource }}
      ></div>

      <button
        onClick={() => {
          createWidget(document.getElementsByClassName("soundcloudIFrame")[0], (sc) => {
            sc.pause();
          });
        }}
      >
        baz
      </button>
    </div>
  );
}

export default Soundcloud;
