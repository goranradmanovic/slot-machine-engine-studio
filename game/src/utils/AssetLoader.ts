import * as PIXI from 'pixi.js';
import { SoundPlayer } from './SoundPlayer';

// Asset paths
const IMAGES_PATH = 'assets/images/';
const SPINES_PATH = 'assets/spines/';
const SOUNDS_PATH = 'assets/sounds/';

// Asset lists
const IMAGES: string[] = [
    'symbol1.png',
    'symbol2.png',
    'symbol3.png',
    'symbol4.png',
    'symbol5.png',
    'background.png',
    'button_spin.png',
    'button_spin_disabled.png',
];

const SPINES: string[] = [
    'big-boom-h.json',
    'base-feature-frame.json',
];

const SOUNDS: string[] = [
    'Reel spin.webm',
    'win.webm',
    'Spin button.webm',
];

const textureCache: Record<string, PIXI.Texture> = {};
const spineCache: Record<string, any> = {};

export class AssetLoader {
    private soundPlayer: SoundPlayer;

    // Static so all AssetLoader instances share state
    private static spinesRegistered = false;
    private static loadedThemes = new Set<string>();

    constructor() {
        this.soundPlayer = new SoundPlayer();

        PIXI.Assets.init({
            basePath: '',
        });
    }

    // ** ADDED CODE ** //
    public async loadAssets(symbolType: string = 'defaults'): Promise<void> {
        try {
            // Register spines once
            if (!AssetLoader.spinesRegistered) {
                PIXI.Assets.addBundle(
                    'spines',
                    SPINES.map((spine) => ({
                        name: spine,
                        srcs: `${SPINES_PATH}${spine}`,
                    }))
                );

                AssetLoader.spinesRegistered = true;
            }

            // Register theme once
            const bundleName = `images-${symbolType}`;

            if (!AssetLoader.loadedThemes.has(symbolType)) {
                PIXI.Assets.addBundle(
                    bundleName,
                    IMAGES.map((image) => ({
                        // unique key per theme
                        name: `${symbolType}-${image}`,
                        srcs: `${IMAGES_PATH}${symbolType}/${image}`, // src/assets/iamegs/fruits/symbol1.png
                    }))
                );

                AssetLoader.loadedThemes.add(symbolType);
            }

            // Load image bundle
            const imageAssets = await PIXI.Assets.loadBundle(bundleName);

            Object.entries(imageAssets).forEach(([key, texture]) => {
                textureCache[key] = texture as PIXI.Texture;
            });

            console.log(`Theme "${symbolType}" loaded successfully`);

            // Load spines once
            if (Object.keys(spineCache).length === 0) {
                const spineAssets = await PIXI.Assets.loadBundle('spines');

                Object.entries(spineAssets).forEach(([key, spine]) => {
                    spineCache[key] = spine;
                });

                console.log('Spines loaded successfully');
            }

            console.log('Assets loaded successfully');
        } catch (error) {
            console.error('Error loading assets:', error);
            throw error;
        }
    }

    // ** ADDED CODE ** //
    public async loadSounds(soundType: string = 'defaults'): Promise<SoundPlayer> {
        /*try {
            SOUNDS.forEach((soundFile) => {
                this.soundPlayer.add(
                    soundFile.split('.')[0],
                    `${SOUNDS_PATH}${soundFile}`
                );
            });

            return this.soundPlayer;
        } catch (error) {
            console.error('Error loading sounds:', error);
            throw error;
        }*/

        // ** ADDED CODE ** //
        try {
            SOUNDS.forEach(soundFile => {
                const soundKey = soundFile.split('.')[0]; // Result: 'win', 'reel_spin', etc.
                
                // Build path dynamically: assets/sounds/cyberpunk/win.webm
                const fullAudioPath = `${SOUNDS_PATH}${soundType}/${soundFile}`;
                
                this.soundPlayer.add(soundKey, fullAudioPath);
            });
            
            console.log(`Sound Pack loaded successfully: ${soundType}`);
        } catch (error) {
            console.error('Error loading sounds:', error);
            throw error;
        }

        return this.soundPlayer;
    }

    public static getTexture(
        symbolType: string,
        name: string
    ): PIXI.Texture {
        const cacheKey = `${symbolType}-${name}`;

        const texture = textureCache[cacheKey];

        if (!texture) {
            throw new Error(
                `Texture "${cacheKey}" not found.`
            );
        }

        return texture;
    }

    public static getSpine<T = any>(name: string): T {
        const spine = spineCache[name];

        if (!spine) {
            throw new Error(`Spine "${name}" not found.`);
        }

        return spine as T;
    }

    public static hasTheme(symbolType: string): boolean {
        return AssetLoader.loadedThemes.has(symbolType);
    }

    public static clearTextureCache(): void {
        Object.keys(textureCache).forEach((key) => {
            delete textureCache[key];
        });

        AssetLoader.loadedThemes.clear();
    }
}






















/*import * as PIXI from 'pixi.js';
import {SoundPlayer} from "./SoundPlayer";

// Asset paths
const IMAGES_PATH = 'assets/images/';
const SPINES_PATH = 'assets/spines/';
const SOUNDS_PATH = 'assets/sounds/';

// Asset lists
const IMAGES = [
    'symbol1.png',
    'symbol2.png',
    'symbol3.png',
    'symbol4.png',
    'symbol5.png',
    'background.png',
    'button_spin.png',
    'button_spin_disabled.png',
];

const SPINES = [
    'big-boom-h.json',
    'base-feature-frame.json'
];


const SOUNDS = [
    'Reel spin.webm',
    'win.webm',
    'Spin button.webm',
];

const textureCache: Record<string, PIXI.Texture> = {};
const spineCache: Record<string, any> = {};

export class AssetLoader {
    private soundPlayer: SoundPlayer;

    constructor() {
        this.soundPlayer = new SoundPlayer();
        PIXI.Assets.init({ basePath: '' });
    }

    public async loadAssets(symbolType: string = 'defaults'): Promise<void> {
        try {
            PIXI.Assets.addBundle('images', IMAGES.map(image => ({
                name: image,
                srcs: IMAGES_PATH + symbolType + '/' + image
            })));

            PIXI.Assets.addBundle('spines', SPINES.map(spine => ({
                name: spine,
                srcs: SPINES_PATH + spine
            })));

            const imageAssets = await PIXI.Assets.loadBundle('images');
            console.log('Images loaded successfully');

            for (const [key, texture] of Object.entries(imageAssets)) {
                textureCache[key] = texture as PIXI.Texture;
            }

            try {
                const spineAssets = await PIXI.Assets.loadBundle('spines');
                console.log('Spine animations loaded successfully');

                for (const [key, spine] of Object.entries(spineAssets)) {
                    spineCache[key] = spine;
                }
            } catch (error) {
                console.error('Error loading spine animations:', error);
            }

            console.log('Assets loaded successfully');
        } catch (error) {
            console.error('Error loading assets:', error);
            throw error;
        }
    }

    async loadSounds(): Promise<SoundPlayer> {
        try {
            SOUNDS.forEach(soundFile => {
                this.soundPlayer.add(soundFile.split('.')[0], SOUNDS_PATH + soundFile);
            });
        } catch (error) {
            console.error('Error loading sounds:', error);
            throw error;
        }

        return this.soundPlayer;
    }

    public static getTexture(name: string): PIXI.Texture {
        return textureCache[name];
    }

    public static getSpine(name: string): any {
        return spineCache[name];
    }
}

*/