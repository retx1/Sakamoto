import React, { useEffect, useState, useRef, useMemo, useCallback} from "react";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";
import { BsSkipEnd } from "react-icons/bs";
import { IconContext } from "react-icons";
import PlayerContainer from "../Wrappers/PlayerContainer";
import Hls from "hls.js";
import plyr from "plyr";
import "plyr/dist/plyr.css";

function VideoPlayer({ sources, internalPlayer, setInternalPlayer, title }) {
  let src = sources.sources[0].file;
  if (src.includes("mp4")) {
    src = sources.sources_bk[0].file;
  }

  const [player, setPlayer] = useState(null);
  const videoRef = useRef();

  useEffect(() => {
    let flag = true;

    const defaultOptions = {
      captions: { active: true, update: true, language: "en" },
      controls: [
        "play-large",
        "rewind",
        "play",
        "fast-forward",
        "progress",
        "current-time",
        "duration",
        "mute",
        "volume",
        "settings",
        "fullscreen",
      ],
    };

    function updateQuality(newQuality) {
      if (newQuality === 0) {
        window.hls.currentLevel = -1;
        console.log("Auto quality selection");
      } else {
        window.hls.levels.forEach((level, levelIndex) => {
          if (level.height === newQuality) {
            console.log("Found quality match with " + newQuality);
            window.hls.currentLevel = levelIndex;
          }
        });
      }
    }

    function createPlayer() {

      const newPlayer = new plyr(videoRef?.current, defaultOptions);

      setPlayer(new plyr(videoRef?.current, defaultOptions));

      if (newPlayer) {

        const skipButton = document.createElement("button");
        skipButton.classList.add("skip-button");
        skipButton.innerHTML = "Skip Intro";
        skipButton.addEventListener("click", function () {
          newPlayer.forward(85);
        });

        let controls;
        newPlayer.on("ready", () => {
          controls = document.querySelector(".plyr__controls");
        });

        newPlayer.on("enterfullscreen", (event) => {
          if (controls) {
            controls.appendChild(skipButton);
          }
          window.screen.orientation.lock("landscape");
        });

        newPlayer.on("exitfullscreen", (event) => {
          if (document.querySelector(".skip-button")) {
            document.querySelector(".skip-button").remove();
          }
          window.screen.orientation.lock("portrait");
        });

        newPlayer.on("timeupdate", function (e) {
          const time = newPlayer.currentTime,
            lastTime = localStorage.getItem(title);
          if (time > lastTime) {
            localStorage.setItem(title, Math.round(newPlayer.currentTime));
          }
          if (newPlayer.ended) {
            localStorage.removeItem(title);
          }
        });

        newPlayer.on("play", function(e) {
          if (flag) {
            const lastTime = localStorage.getItem(title);
            if (lastTime !== null && lastTime > newPlayer.currentTime) {
              newPlayer.forward(parseInt(lastTime));
            }
            flag = false;
          }
        });

        newPlayer.on("seeking", (event) => {
          localStorage.setItem(title, Math.round(newPlayer.currentTime));
        });
      }
    }

    let hls;
    if (Hls.isSupported()) {

      hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(videoRef?.current);

      hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
        const availableQualities = hls.levels.map((l) => l.height);
        availableQualities.unshift(0);
        defaultOptions.quality = {
          default: 0,
          options: availableQualities,
          forced: true,
          onChange: (e) => updateQuality(e),
        };

        hls.on(Hls.Events.LEVEL_SWITCHED, function (event, data) {
          if (hls.autoLevelEnabled) {
            videoRef.current.plyr.elements.settings.popup.innerText = `Auto (${hls.levels[data.level].height}p)`;
          } else {
            videoRef.current.plyr.elements.settings.popup.innerText = `Auto`;
          }
        });
      });

      if (videoRef.current) {
        createPlayer();
      }
      window.hls = hls;

    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {

      videoRef.current.src = src;
      createPlayer();
    } else {

      const newPlayer = new plyr(src, defaultOptions);
      newPlayer.source = {
        type: "video",
        title: "Example title",
        sources: [
          {
            src: src,
            type: "video/mp4",
          },
        ],
      };
      setPlayer(newPlayer);
    }

    return () => {
      hls.stopLoad();
      hls.destroy();
    };
  }, [src, title]);

  return (
    <div
      style={{
        marginBottom: "1rem",
        fontFamily: '"Gilroy-Medium", sans-serif',
        "--plyr-color-main": "#303030",
      }}
    >
      <PlayerContainer>
        <IconContext.Provider
          value={{
            size: "1.5rem",
            color: "#FFFFFF",
            style: {
              verticalAlign: "middle",
            },
          }}
        >
          {internalPlayer && <p>Internal Player</p>}
          <div>
            <div className="tooltip">
              <button onClick={() => setInternalPlayer(!internalPlayer)}>
                <HiOutlineSwitchHorizontal />
              </button>
              <span className="tooltiptext">Change Server</span>
            </div>
            <div className="tooltip">
              <button onClick={() => player.forward(85)}>
                <BsSkipEnd />
              </button>
              <span className="tooltiptext">Skip Intro</span>
            </div>
          </div>
        </IconContext.Provider>
      </PlayerContainer>
      <video id="player" ref={videoRef} playsInline crossOrigin="anonymous"></video>
    </div>
  );
}

export default VideoPlayer;
