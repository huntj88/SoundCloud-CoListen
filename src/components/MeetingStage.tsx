import { useEffect, useRef, useState } from "react";
import { ITeamsFluidClientOptions, TeamsFluidClient } from "@microsoft/live-share";
import { AzureConnectionConfig, ITelemetryBaseEvent, ITelemetryBaseLogger } from "@fluidframework/azure-client";
import { InsecureTokenProvider } from "@fluidframework/test-client-utils";
import { inTeams } from "../inTeams";
import { EphemeralMediaSession, MediaPlayerSynchronizer } from "@microsoft/live-share-media";
import { SoundcloudPlayer } from "./SoundcloudPlayer";
import { createWidget } from "./integrationUtils";

function MeetingStage() {
  // MediaSynchronizer ref
  const synchronizer = useRef<MediaPlayerSynchronizer>();
  // Join error
  const [error, setError] = useState();

  // Initial setup when context is returned
  useEffect(() => {
    (async function () {
      try {
        // Set the initial video src for the player element
        // videoElement.current.src = initialMediaItem.current.src;
        let connection: AzureConnectionConfig | undefined;
        if (!inTeams()) {
          // Configure for local testing (optional).
          connection = {
            type: "local",
            tokenProvider: new InsecureTokenProvider("", {
              id: "123",
            }),
            endpoint: "http://localhost:7070"
          };
        }

        const clientProps: ITeamsFluidClientOptions = {
          connection,
          logger: new ConsoleLogger()
        };

        // Enable debugger
        window.localStorage.debug = "fluid:*";

        // Define Fluid document schema and create container
        const client = new TeamsFluidClient(clientProps);
        const schema = {
          initialObjects: { mediaSession: EphemeralMediaSession },
        };
        const { container } = await client.joinContainer(schema);
        const { mediaSession } = container.initialObjects;
        const typedMediaSession = (mediaSession as EphemeralMediaSession | undefined)

        createWidget(document.getElementsByClassName("soundcloudIFrame")[0], async (scControls: any) => {
          synchronizer.current = typedMediaSession?.synchronize(new SoundcloudPlayer(scControls));
          // synchronizer.current?.addEventListener(
          //   MediaPlayerSynchronizerEvents.groupaction,
          //   (evt) => {
          //     if (
          //       evt.details.action === "play" &&
          //       evt.error?.name === "NotAllowedError"
          //     ) {
          //       // The user has not interacted with the document so the browser blocked the play action
          //       // mute the player and try again
          //       synchronizer.current!.player.muted = true;
          //       synchronizer.current!.player.play();
          //     } else if (evt.error) {
          //       console.error(evt.error);
          //     }
          //   }
          // );
          await typedMediaSession?.initialize();
        });

      } catch (err) {
        setError(error);
      }
    })();
  }, [error]);

  const iframeSource =
    '<iframe class="soundcloudIFrame" width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/43315398"></iframe>';

  return (
    <div className="App">
      {/* <Soundcloud /> */}
      <div
        className="sApp"
        dangerouslySetInnerHTML={{ __html: iframeSource }}
      ></div>

      <button
        onClick={() => {
          synchronizer.current?.play()
        }}
      >
        play
      </button>

      <button
        onClick={() => {
          synchronizer.current?.pause()
        }}
      >
        pause
      </button>
    </div>
  );
}

class ConsoleLogger implements ITelemetryBaseLogger {
  send(event: ITelemetryBaseEvent) {
    console.log("fluid telemetry event:".concat(JSON.stringify(event)));
  }
}

export default MeetingStage;
