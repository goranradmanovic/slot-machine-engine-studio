import * as PIXI from 'pixi.js';
import { SlotMachine } from '../slots/SlotMachine';
import { AssetLoader } from '../utils/AssetLoader';
import {SoundPlayer} from '../utils/SoundPlayer';
import {SlotMachineConfig} from "../slots/SlotMachineConfig";

const POSITION_OFFSET_Y: number= 50;
const SPIN_BUTTON_DEFAULT_SCALE: number= 0.8;
const SPIN_BUTTON_ZOOMED_SCALE: number= 0.9;
const TRUSTED_ORIGIN = 'http://localhost:5173'; // Frontend origin for postMessage security check

export class UI {
    public container: PIXI.Container;
    private app: PIXI.Application;
    private slotMachine: SlotMachine;
    private soundPlayer: SoundPlayer;
    private spinButton!: PIXI.Sprite;
    private config: SlotMachineConfig;

    constructor(app: PIXI.Application, slotMachine: SlotMachine, soundPlayer: SoundPlayer, config: SlotMachineConfig) {
        this.app = app;
        this.slotMachine = slotMachine;
        this.soundPlayer = soundPlayer;
        this.config = config;
        this.container = new PIXI.Container();
        this.container.name = 'UILayer';

        this.createSpinButton();
        this.handlePostMessage()
    }

    // ** ADDED CODE ** //
    private handlePostMessage(): void {
        window.addEventListener('message', (event: MessageEvent) => {
            // Security: Reject messages from untrusted domains
            if (event.origin !== TRUSTED_ORIGIN) return; 

            if (event.data?.type === 'START_GAME') {
                this.onSpinButtonClick()
                console.log('Game started from parent:', event.data);
            }
        });
    }

    private createSpinButton(): void {
        try {
            this.spinButton = new PIXI.Sprite(AssetLoader.getTexture(this.config.SYMBOLS_TYPE, 'button_spin.png'));

            this.spinButton.anchor.set(0.5);
            this.spinButton.x = this.app.screen.width / 2;
            this.spinButton.y = this.app.screen.height - POSITION_OFFSET_Y;
            this.spinButton.scale.set(SPIN_BUTTON_DEFAULT_SCALE);

            this.spinButton.interactive = true;
            this.spinButton.cursor = 'pointer';

            this.spinButton.on('pointerdown', this.onSpinButtonClick.bind(this));
            this.spinButton.on('pointerover', this.onButtonOver.bind(this));
            this.spinButton.on('pointerout', this.onButtonOut.bind(this));

            this.container.addChild(this.spinButton);

            this.slotMachine.setSpinButton(this.spinButton);
        } catch (error) {
            console.error('Error creating spin button:', error);
        }
    }

    private onSpinButtonClick(): void {
        this.soundPlayer.play('Spin button');

        this.slotMachine.spin();
    }

    private onButtonOver(event: PIXI.FederatedPointerEvent): void {
        (event.currentTarget as PIXI.Sprite).scale.set(SPIN_BUTTON_ZOOMED_SCALE);
    }

    private onButtonOut(event: PIXI.FederatedPointerEvent): void {
        (event.currentTarget as PIXI.Sprite).scale.set(SPIN_BUTTON_DEFAULT_SCALE);
    }
}
