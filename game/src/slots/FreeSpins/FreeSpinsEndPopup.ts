import {Container, Graphics, Text, TextStyle} from "pixi.js";
import {SlotMachineConfig} from "../SlotMachineConfig";
import * as PIXI from "pixi.js";
import {Bounce, gsap} from "gsap";

export class FreeSpinsEndPopup {
    public popUp: Container;
    public positionOffset: number;
    public config: SlotMachineConfig;
    public endFreeSpinsEvent: CustomEvent = new CustomEvent('endFreeSpinsEvent');

    constructor(parent: Container, config: SlotMachineConfig, positionOffset: number) {
        this.config = config;
        this.positionOffset = positionOffset;
        this.popUp = new Container();
        parent.addChild(this.popUp);

        this.createPopup();
    }

    private createPopup(): void {
        this.popUp.name = 'EndPopup';
        this.popUp.alpha = 0;
        this.popUp.interactive = false;
        this.popUp.cursor = 'pointer';
        this.popUp.on('pointerdown', this.onClick.bind(this));
        let background = this.createBackground();
        this.popUp.addChild(background);
        this.addPopupTexts();

        this.popUp.pivot.x = this.popUp.x + this.popUp.width / 2;
        this.popUp.pivot.y = this.popUp.y + this.popUp.height / 2;
        this.popUp.x = this.popUp.width / 2;
        this.popUp.y = this.popUp.height / 2;
    }

    private onClick(): void {
        this.popUp.interactive = false;
        gsap.to(this.popUp, {
            alpha: 0,
            duration: 0.5
        });
        window.dispatchEvent(this.endFreeSpinsEvent);
    }

    private addPopupTexts() {
        let congratulationsText: Text = this.createText('Congratulations!', this.popUp.width, 100);
        congratulationsText.y = 100;
        let winText: Text = this.createText('You Won', this.popUp.width, 80);
        winText.y = this.popUp.height / 2 - winText.height / 2;
        let continueText: Text = this.createText(`Click to continue`, this.popUp.width, 50);
        continueText.y = this.popUp.height - winText.height / 2 - 100;
        this.popUp.addChild(congratulationsText, winText, continueText);
    }

    public showPopup(): void {
        gsap.to(this.popUp,
            {
                alpha: 1,
                duration: 0.3
            }
        );
        gsap.fromTo(this.popUp.scale,
            {
                x: 0.2,
                y: 0.2,
            },
            {
                x: 1,
                y: 1,
                duration: 0.5,
                ease: Bounce.easeOut,
                onComplete: () => {
                    this.popUp.interactive = true;
                }
            }
        );
    }

    private createBackground(): Graphics {
        const width =
            this.config.SYMBOL_SIZE * this.config.SYMBOLS_PER_REEL + this.positionOffset * 2; // Width now based on symbols per reel
        const height =
            this.config.SYMBOL_SIZE * this.config.REEL_COUNT + this.config.REEL_SPACING * (this.config.REEL_COUNT - 1) + this.positionOffset * 2 // Height based on reel count
        const background = new PIXI.Graphics();
        background.beginFill(0xb873f4, 1);
        background.drawRoundedRect(
            0,
            0,
            width,
            height,
            30
        );
        background.endFill();
        return background;
    }

    private createText(text: string, parentWidth: number, fontSize: number): Text {
        const style = new TextStyle({
            fontFamily: 'Arial',
            fontSize: fontSize,
            fontWeight: 'bold',
            fill: 0x1234ba
        });
        let newText: Text = new Text(text, style);
        newText.x = parentWidth / 2 - newText.width / 2;
        return newText;
    }
}