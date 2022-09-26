import { IMediaPlayer } from "@microsoft/live-share-media";
import { SCPlay } from "./createWidget";

export class SoundcloudPlayer implements IMediaPlayer {
    
    private _position: number = 0;
    private _duration: number = 0;
    private _paused: boolean = true;

    constructor(_player: any) {
        this._player = _player;
        // inject iframe into div?

        // register event listeners for these instead of interval
        // paused
        // played
        // position
        // etc
        setInterval(() => {
            this._player?.getPosition((milli: number) => {
                // console.log("position", milli)
                this._position = milli;
            })
            this._player?.getDuration((milli: number) => {
                this._duration = milli;
            })
            this._player?.isPaused((paused: boolean) => {
                this._paused = paused;
            })
          }, 20)
    }

    private _player: any;

    public get currentSrc(): string {
        console.log("sc", "current source")
        return "";
    }
    public get currentTime(): number {
        console.log("sc", "current time")
        return this._position;
    }

    public set currentTime(value: number) {
        console.log("sc", "set current time")
        this._player.seekTo(value)
    }

    public get src(): string {
        // console.log("sc", "src")
        return ""
    }
    public get duration(): number {
        // console.log("sc", "duration")
        return this._duration;
    }
    public get ended(): boolean {
        // console.log("sc", "ended")
        return false;
    }
    public get muted(): boolean {
        // console.log("sc", "muted")
        return false;
    }
    public get paused(): boolean {
        console.log("sc", "paused")
        return this._paused;
    }
    public get playbackRate(): number {
        console.log("sc", "playback rate")
        return 1;
    }
    public get volume(): number {
        console.log("sc", "volume")
        return 100;
    }

    load(): void {
        console.log("sc", "load")
        // throw new Error("Method not implemented.");
    }

    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions | undefined): void {
        console.log("addEventListener", type)

        if (type === "playing") {
            // play event contains current position
            console.log(this._player)
            // TODO: create ts interface for sc play event
            this._player.bind(SCPlay(), (scEvent: any) => {
                console.log("play event", scEvent)
                if (isEventListenerObject(listener)) {
                    listener.handleEvent({type: "playing"} as Event)
                } else if (isEventListener(listener)) {
                    listener({type: "playing"} as Event)
                }
            })
        }
        // TODO: map other event types
    }
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions | undefined): void {
        // throw new Error("Method not implemented.");
    }

    public play(): Promise<void> {
        console.log("sc", "play")
        this._player.play()
        return Promise.resolve()
    }

    public pause(): void {
        console.log("sc", "pause")
        this._player.pause()
    }
}

function isEventListenerObject(pet: EventListener | EventListenerObject): pet is EventListenerObject {
    return (pet as EventListenerObject).handleEvent !== undefined;
    // return (<EventListenerObject>pet).handleEvent !== undefined;
}

function isEventListener(pet: EventListener | EventListenerObject): pet is EventListener {
    return isEventListenerObject(pet) === false
}