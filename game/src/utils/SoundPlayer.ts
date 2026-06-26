//Implement sound player using the "howler" package
import {Howl} from 'howler';

export class SoundPlayer {
    private sounds: SoundObject;
    constructor() {
        this.sounds = {};
    }

    public add(alias: string, url: string): void {
        this.sounds[alias] = new Howl({
            src: [url],
            autoplay: false,
            loop: false,
            volume: 0.5,
            onend: function (): void {
                console.log('Finished!');
            }
        });
        console.log(`Sound added: ${alias} from ${url}`);
    }

    public play(alias: string): void {
        this.sounds[alias].play();
        console.log(`Playing sound: ${alias}`);
    }

    public stop(alias: string): void {
        this.sounds[alias].stop();
        console.log(`Stopping sound: ${alias}`);
    }
}

interface SoundObject {
    [key: string]: Howl;
}