import * as PIXI from 'pixi.js';
import 'pixi-spine';
import { Reel } from './Reel';
import {SoundPlayer} from '../utils/SoundPlayer';
import { AssetLoader } from '../utils/AssetLoader';
import {Spine} from "pixi-spine";
import {SlotMachineConfig} from "./SlotMachineConfig";
import {FreeSpins} from "./FreeSpins/FreeSpins";
import {ServerData, ServerResult} from "./Server/ServerData";
import {SymbolType} from "../utils/SymbolsConfig";
import {WinLineResult} from "./Server/Winline";

const POSITION_OFFSET = 20;
const DEFAULT_FRAME_SPINE_WIDTH = 1242;
const DEFAULT_FRAME_SPINE_HEIGHT = 775;
const FRAME_SPINE_BORDER_WIDTH = 100;
const FRAME_SPINE_BORDER_HEIGHT = 140;

export class SlotMachine {
    public container: PIXI.Container;
    public winAnimationContainer: PIXI.Container;
    private config: SlotMachineConfig;
    private reelsContainer: PIXI.Container;
    private reels: Reel[];
    private isSpinning: boolean = false;
    private spinButton: PIXI.Sprite | null = null;
    private frameSpine: Spine | null = null;
    private winAnimation: Spine | null = null;
    private soundPlayer: SoundPlayer;
    private reelHeight: number;
    private nrOfReelsFinished: number = 0;
    private freeSpins: FreeSpins | undefined;
    private server: ServerData;
    private serverResult: ServerResult | undefined;

    constructor(config: SlotMachineConfig, screenWidth: number, screenHeight: number, soundPlayer: SoundPlayer, server: ServerData, freeSpins: FreeSpins | undefined) {
        this.config = config;
        this.reelHeight = this.config.SYMBOL_SIZE;
        this.soundPlayer = soundPlayer;
        this.container = new PIXI.Container();
        this.container.name = 'ReelsLayer';
        this.reelsContainer = new PIXI.Container();
        this.reelsContainer.name = 'Reels';
        this.winAnimationContainer = new PIXI.Container();
        this.winAnimationContainer.name = 'WinAnimationLayer';
        this.reels = [];
        this.freeSpins = freeSpins;
        if (this.freeSpins) {
            window.addEventListener('startFreeSpinsEvent', this.startFreeSpins.bind(this));
            window.addEventListener('endFreeSpinsEvent', this.endFreeSpins.bind(this));
        }
        this.server = server;

        // Center the slot machine
        this.container.x = this.winAnimationContainer.x =
            screenWidth / 2 - ((this.config.SYMBOL_SIZE * this.config.SYMBOLS_PER_REEL) / 2);
        this.container.y = this.winAnimationContainer.y =
            screenHeight / 2 - ((this.reelHeight * this.config.REEL_COUNT + this.config.REEL_SPACING * (this.config.REEL_COUNT - 1)) / 2);

        this.createBackground();

        this.createReels();

        this.createReelsMask();

        this.initSpineAnimations();

        window.addEventListener('snapGrid', this.onReelSnapGrid.bind(this));
    }

    private async onReelSnapGrid() {
        this.nrOfReelsFinished++;
        // If this is the last reel, check for wins and enable spin button
        if (this.nrOfReelsFinished === this.config.REEL_COUNT) {
            this.nrOfReelsFinished = 0;
            // Stop spin sound
            this.soundPlayer.stop('Reel spin');
            this.isSpinning = false;
            await this.checkWin();
            this.checkFreeSpins();

            if (this.spinButton && !this.server.isFreeSpins) {
                if (this.freeSpins && this.freeSpins.isFreeSpins) {
                    return;
                }
                this.spinButton.texture = AssetLoader.getTexture(this.config.SYMBOLS_TYPE, 'button_spin.png');
                this.spinButton.interactive = true;
            }
        }
    }

    private createBackground(): void {
        try {
            // ** ADDED CODE ** //
            const frameBgColor = this.config.FRAME_SPINE_BG_COLOR ? this.config.FRAME_SPINE_BG_COLOR : '000000';
            const frameBgColorOpacity = this.config.FRAME_SPINE_BG_COLOR_OPACITY ? this.config.FRAME_SPINE_BG_COLOR_OPACITY : 0.5;
            const width = this.config.SYMBOL_SIZE * this.config.SYMBOLS_PER_REEL + POSITION_OFFSET * 2; // Width now based on symbols per reel
            const height = this.reelHeight * this.config.REEL_COUNT + this.config.REEL_SPACING * (this.config.REEL_COUNT - 1) + POSITION_OFFSET * 2 // Height based on reel count
            const background = new PIXI.Graphics();
            background.beginFill(`0x${frameBgColor}`, frameBgColorOpacity); // ** ADDED CODE ** //
            background.drawRect(
                POSITION_OFFSET * -1,
                POSITION_OFFSET * -1,
                width,
                height
            );
            background.endFill();
            this.container.addChild(background);
        } catch (error) {
            console.error('Error creating background:', error);
        }
    }

    private createReels(): void {
        this.container.addChild(this.reelsContainer);
        // Create each reel
        for (let i = 0; i < this.config.REEL_COUNT; i++) {
            const reel = new Reel(i, this.config.SYMBOLS_PER_REEL, this.config.SYMBOL_SIZE, this.config.SYMBOLS_TYPE);
            reel.container.y = i * (this.reelHeight + this.config.REEL_SPACING);
            this.reelsContainer.addChild(reel.container);
            this.reels.push(reel);

            if (i < this.config.REEL_COUNT - 1) {
                this.createReelDivider(reel);
            }
        }
    }

    private createReelDivider(reel: Reel): void {
        const dividerGraphic = new PIXI.Graphics();
        //dividerGraphic.beginFill(0xFFB1D2, 1);
        dividerGraphic.beginFill(0x000000, .5);
        dividerGraphic.drawRect(
            POSITION_OFFSET * -1,
            POSITION_OFFSET * -1,
            this.config.SYMBOL_SIZE * this.config.SYMBOLS_PER_REEL + POSITION_OFFSET * 2, // Width now based on symbols per reel
            this.config.REEL_SPACING
        );
        dividerGraphic.endFill();
        dividerGraphic.y = reel.container.y + this.reelHeight + POSITION_OFFSET;
        this.reelsContainer.addChild(dividerGraphic);
    }

    private createReelsMask(): void {
        const mask = new PIXI.Graphics();
        mask.beginFill(0xffffff);
        mask.drawRect(
            POSITION_OFFSET * -1,
            0,
            this.config.SYMBOL_SIZE * this.config.SYMBOLS_PER_REEL + POSITION_OFFSET * 2,
            (this.config.SYMBOL_SIZE + this.config.REEL_SPACING) * this.config.REEL_COUNT
        );
        mask.endFill();
        this.reelsContainer.mask = mask;
        this.reelsContainer.addChild(mask);
    }

    public update(delta: number): void {
        // Update each reel
        for (const reel of this.reels) {
            reel.update(delta);
        }
    }

    public spin(): void {
        if (this.isSpinning) return;

        this.serverResult = this.server.getServerData(this.config.BET);
        this.isSpinning = true;

        // Play spin sound
        this.soundPlayer.play('Reel spin');

        // Disable spin button
        if (this.spinButton) {
            this.spinButton.texture = AssetLoader.getTexture(this.config.SYMBOLS_TYPE, 'button_spin_disabled.png');
            this.spinButton.interactive = false;
        }

        for (let i = 0; i < this.reels.length; i++) {
            setTimeout(() => {
                this.reels[i].startSpin();
            }, i * this.config.SPIN_DELAY);
        }
        this.addReelsServerData();
        // Stop all reels after a delay
        setTimeout(() => {
            this.stopSpin();
        }, this.config.SPIN_DURATION + (this.reels.length - 1) * this.config.SPIN_DELAY);
    }

    private addReelsServerData(): void {
        const serverSymbols: SymbolType[][] | undefined = this.serverResult?.symbols;
        this.reels.forEach((reel: Reel, index) => {
            if (serverSymbols) {
                reel.addFinalSymbolIDs(serverSymbols[index]);
            }
        });
    }

    public stopSpin(): void {
        this.reels.forEach((reel: Reel, index: number) => {
            setTimeout(() => {
                reel.stopSpin();
            }, index * this.config.STOP_SPIN_DELAY);
        });
    }

    private checkFreeSpins() {
        if (!this.serverResult) return;

        if (this.server.isFreeSpins) {
             if (this.serverResult.freeSpinsState !== null) {
                 if (this.serverResult.freeSpinsState === 'start') {
                     this.freeSpins?.start(this.serverResult.freeSpinsAwarded);
                 } else if (this.serverResult.freeSpinsState === 'end') {
                     this.freeSpins?.end();
                 }
             } else {
                 this.spin();
            }
        }
    }

    private async checkWin(): Promise<void> {
        if (!this.serverResult) return;

        if (this.serverResult.totalWin > 0) {
            this.soundPlayer.play('win');
            console.log('Winner!');
            await this.playSymbolWinAnimation(this.serverResult.winningLines);
            // Play the win animation found in "big-boom-h" spine
            await this.playWinAnimation();
        }
    }

    private playSymbolWinAnimation(winLines: WinLineResult[]): Promise<void> {
        return new Promise((resolve) => {
            let onComplete: Function | null = null;
            this.reels.forEach((reel: Reel, index: number) => {
                winLines.forEach((winLineResult: WinLineResult) => {
                    if (winLineResult.win > 0) {
                        const reelStartIndex = index * this.config.SYMBOLS_PER_REEL;
                        const reelWinLine: number[] = winLineResult.winLine.slice(reelStartIndex, reelStartIndex + this.config.SYMBOLS_PER_REEL);
                        reel.playSymbolsWinAnimation(reelWinLine, winLineResult.symbolType, resolve);
                    }
                })
            });
        });
    }

    private playWinAnimation(): Promise<void> {
        return new Promise((resolve) => {
            if (this.winAnimation) {
                if (this.winAnimation.state.hasAnimation('start')) {
                    this.winAnimation.state.setAnimation(0, 'start', false);
                    this.winAnimation.state.addListener({
                        complete: () => {
                            if (this.winAnimation) {
                                this.winAnimation.state.clearTrack(0);
                                this.winAnimation.visible = false;
                            }
                            resolve();
                        }
                    });
                    this.winAnimation.visible = true;
                }
            } else {
                resolve();
            }
        });
    }

    public setSpinButton(button: PIXI.Sprite): void {
        this.spinButton = button;
    }

    private initSpineAnimations(): void {
        try {
            const frameSpineData = AssetLoader.getSpine('base-feature-frame.json');
            if (frameSpineData) {
                this.frameSpine = new Spine(frameSpineData.spineData);

                this.frameSpine.y = (this.reelHeight * this.config.REEL_COUNT + this.config.REEL_SPACING * (this.config.REEL_COUNT - 1)) / 2;
                this.frameSpine.x = (this.config.SYMBOL_SIZE * this.config.SYMBOLS_PER_REEL) / 2;

                // scale frame spine animation depending on reels area width
                const reelsWidth = this.config.SYMBOLS_PER_REEL * this.config.SYMBOL_SIZE + FRAME_SPINE_BORDER_WIDTH;
                const reelsHeight = this.config.REEL_COUNT * this.config.SYMBOL_SIZE + FRAME_SPINE_BORDER_HEIGHT;
                this.frameSpine.scale.x = reelsWidth / DEFAULT_FRAME_SPINE_WIDTH;
                this.frameSpine.scale.y = reelsHeight / DEFAULT_FRAME_SPINE_HEIGHT;

                if (this.frameSpine.state.hasAnimation('idle')) {
                    this.frameSpine.state.setAnimation(0, 'idle', true);
                }

                this.container.addChild(this.frameSpine);
            }

            const winSpineData = AssetLoader.getSpine('big-boom-h.json');
            if (winSpineData) {
                this.winAnimation = new Spine(winSpineData.spineData);

                this.winAnimation.x = (this.config.SYMBOL_SIZE * this.config.SYMBOLS_PER_REEL) / 2;
                this.winAnimation.y = (this.reelHeight * this.config.REEL_COUNT + this.config.REEL_SPACING * (this.config.REEL_COUNT - 1)) / 2;

                this.winAnimation.visible = false;

                this.winAnimationContainer.addChild(this.winAnimation);
            }
        } catch (error) {
            console.error('Error initializing spine animations:', error);
        }
    }

    private startFreeSpins(): void {
        this.spin();
    }

    private endFreeSpins(): void {
        if (this.spinButton) {
            this.spinButton.texture = AssetLoader.getTexture(this.config.SYMBOLS_TYPE, 'button_spin.png');
            this.spinButton.interactive = true;
        }
    }
}
