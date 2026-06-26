import {Container} from "pixi.js";
import {SlotMachineConfig} from "../SlotMachineConfig";
import {FreeSpinsStartPopup} from "./FreeSpinsStartPopup";
import {FreeSpinsEndPopup} from "./FreeSpinsEndPopup";

const POSITION_OFFSET = 85;

export class FreeSpins {
    public isFreeSpins: boolean = false;
    public container: Container;
    private startPopup: FreeSpinsStartPopup;
    private endPopup: FreeSpinsEndPopup;

    constructor(config: SlotMachineConfig, screenWidth: number, screenHeight: number) {
        this.container = new Container();
        this.container.name = 'FreeSpinsLayer';
        this.container.x =
            screenWidth / 2 - ((config.SYMBOL_SIZE * config.SYMBOLS_PER_REEL) / 2) - POSITION_OFFSET;
        this.container.y =
            screenHeight / 2 - ((config.SYMBOL_SIZE * config.REEL_COUNT + config.REEL_SPACING * (config.REEL_COUNT - 1)) / 2) - POSITION_OFFSET;
        this.startPopup = new FreeSpinsStartPopup(this.container, config, POSITION_OFFSET);
        this.endPopup = new FreeSpinsEndPopup(this.container, config, POSITION_OFFSET);
    }

    public start(freeSpinsAwarded: number): void {
        console.log('Start FS');
        this.startPopup.showPopup(freeSpinsAwarded);
    }

    public end(): void {
        console.log('End FS');
        this.endPopup.showPopup();
    }
}