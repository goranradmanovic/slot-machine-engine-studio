import * as PIXI from 'pixi.js';
import { SlotMachine } from './slots/SlotMachine';
import { AssetLoader } from './utils/AssetLoader';
import { UI } from './ui/UI';
import { defaultSlotConfig, SlotMachineConfig } from "./slots/SlotMachineConfig";
import { FreeSpins } from "./slots/FreeSpins/FreeSpins";
import { ServerData } from "./slots/Server/ServerData";

import { io, Socket } from 'socket.io-client';

const APP_WIDTH = 1280;
const APP_HEIGHT = 800;
// ** ADDED CODE ** //
const TRUSTED_ORIGIN = 'http://localhost:5173'; // Frontend origin for postMessage security check
const SERVER_URL = 'http://localhost:3000'; // Backend server URL for Socket.IO connection

export class Game {
    private app: PIXI.Application;
    private slotMachine?: SlotMachine;
    private ui?: UI;
    private assetLoader: AssetLoader;
    private currentConfig: SlotMachineConfig = defaultSlotConfig; // ** ADDED CODE ** //
    private socket: Socket;

    constructor() {
        // ** ADDED CODE ** //
        const initialBg = this.currentConfig?.BACKGROUND_COLOR 
            ? `0x${this.currentConfig.BACKGROUND_COLOR}` 
            : '0x1099bb';

        this.app = new PIXI.Application({
            width: APP_WIDTH,
            height: APP_HEIGHT,
            backgroundColor: initialBg, // ** ADDED CODE ** //
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
        });
        
        (globalThis as any).__PIXI_APP__ = this.app;

        const gameContainer = document.getElementById('game-container');
        if (gameContainer) {
            gameContainer.appendChild(this.app.view as HTMLCanvasElement);
        }

        this.assetLoader = new AssetLoader();
        this.socket = io(SERVER_URL); // ** ADDED CODE ** //

        this.init = this.init.bind(this);
        this.resize = this.resize.bind(this);
        this.update = this.update.bind(this);

        window.addEventListener('resize', this.resize);
        this.resize();

        // ** ADDED CODE ** //
        this.handlePostMessage();
        this.gameResponseHandler();

        // Register the game loop ticker exactly ONCE during startup
        this.app.ticker.add(this.update);
    }

    // ** ADDED CODE ** //
    private handlePostMessage(): void {
        window.addEventListener('message', (event: MessageEvent) => {
            // Security: Reject messages from untrusted domains
            if (event.origin !== TRUSTED_ORIGIN) return; 

            if (event.data?.type === 'LOAD_CONFIG') {
                this.socket.emit('request-config', event.data.version); // v1, v2, etc.
                console.log('Data received from parent:', event.data);
            }
        });
    }

    // ** ADDED CODE ** //
    private gameResponseHandler = (): void => {
        this.socket.on('config-response', async (config: SlotMachineConfig) => {
            console.log('Config received:', config);
            try {
                await this.updateConfig(config);

                window.parent.postMessage({
                    type: 'CONFIG_APPLIED',
                    success: true
                }, '*');
            } catch (error) {
                this.sendFailureMessage((error as Error).message);
            }
        });

        this.socket.on('config-error', (error: any) => {
            console.error('Socket error received:', error);
            this.sendFailureMessage(error?.message || 'Server Configuration Error');
        });
    }

    // ** ADDED CODE ** //
    private sendFailureMessage(reason: string): void {
        window.parent.postMessage({
            type: 'CONFIG_APPLIED',
            success: false,
            reason
        }, '*');
    }

    // ** ADDED CODE ** //
    public async updateConfig(newConfig: SlotMachineConfig): Promise<void> {
        console.log('Updating game config:', newConfig);
        this.currentConfig = newConfig;

        // Clean up previous layout structures safely 
        this.app.stage.removeChildren();
        this.ui = undefined;
        this.slotMachine = undefined;

        // Update the PixiJS canvas background color on the fly
        if (this.currentConfig.BACKGROUND_COLOR) {
            this.app.renderer.background.color = `#${this.currentConfig.BACKGROUND_COLOR}`;
        }

        // Reinitialize the game graphics with the new configurations
        await this.init(); 
        console.log('Config updated internally');
    }

    public async init(): Promise<void> {
        try {
            // ** ADDED CODE ** //
            await this.assetLoader.loadAssets(this.currentConfig.SYMBOLS_TYPE);
            const soundPlayer = await this.assetLoader.loadSounds(this.currentConfig.SOUND_TYPE || 'defaults');

            // Adding background image to the game
            const bgTexture = AssetLoader.getTexture(
                this.currentConfig.SYMBOLS_TYPE,
                'background.png'
            );

            const background = new PIXI.Sprite(bgTexture);
            background.width = APP_WIDTH;
            background.height = APP_HEIGHT;
            background.position.set(0, 0);
            // Add as the first child so it stays behind everything
            this.app.stage.addChild(background);

            /*const overlay = new PIXI.Graphics();
            overlay.beginFill(0x000000, 0.8);
            overlay.drawRect(0, 0, APP_WIDTH, APP_HEIGHT);
            overlay.endFill();
            this.app.stage.addChild(overlay);*/

            const server: ServerData = new ServerData(this.currentConfig);

            let freeSpins: FreeSpins | undefined = undefined;
            if (this.currentConfig.HAS_FREE_SPINS) {
                freeSpins = new FreeSpins(this.currentConfig, APP_WIDTH, APP_HEIGHT);
            }
            
            this.slotMachine = new SlotMachine(this.currentConfig, APP_WIDTH, APP_HEIGHT, soundPlayer, server, freeSpins);
            this.app.stage.addChild(this.slotMachine.container);

            this.ui = new UI(this.app, this.slotMachine, soundPlayer, this.currentConfig);
            this.app.stage.addChild(this.ui.container);

            this.app.stage.addChild(this.slotMachine.winAnimationContainer);

            if (freeSpins) {
                this.app.stage.addChild(freeSpins.container);
            }

            console.log('Game initialized successfully');
        } catch (error) {
            console.error('Error initializing game:', error);
            throw error; // Propagate up to send failure status
        }
    }

    private update(delta: number): void {
        if (this.slotMachine) {
            this.slotMachine.update(delta);
        }
    }

    private resize(): void {
        if (!this.app || !this.app.renderer) return;

        const gameContainer = document.getElementById('game-container');
        if (!gameContainer) return;

        const gameContainerWidth = gameContainer.clientWidth;
        const gameContainerHeight = gameContainer.clientHeight;

        const scale = Math.min(gameContainerWidth / APP_WIDTH, gameContainerHeight / APP_HEIGHT);
        this.app.stage.scale.set(scale);

        this.app.renderer.resize(gameContainerWidth, gameContainerHeight);
        this.app.stage.position.set(gameContainerWidth / 2, gameContainerHeight / 2);
        this.app.stage.pivot.set(APP_WIDTH / 2, APP_HEIGHT / 2);
    }

    // Clean up connections if game instance gets dropped
    public destroy(): void {
        window.removeEventListener('resize', this.resize);
        this.app.ticker.remove(this.update);
        this.socket.disconnect();
        this.app.destroy(true, { children: true, texture: true, baseTexture: true });
    }
}