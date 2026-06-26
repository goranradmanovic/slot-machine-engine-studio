import * as PIXI from 'pixi.js';
import {BlurFilter, Sprite, Texture} from 'pixi.js';
import {AssetLoader} from '../utils/AssetLoader';
import {Back, gsap} from "gsap";
import {SymbolType} from "../utils/SymbolsConfig";

const SYMBOL_TEXTURES = [
    'symbol1.png',
    'symbol2.png',
    'symbol3.png',
    'symbol4.png',
    'symbol5.png',
];

const SPIN_SPEED = 50; // Pixels per frame
const FPS = 60; // Frames per second
const REEl_STOP_THRESHOLD = 10;

export class Reel {
    public container: PIXI.Container;
    private symbols: PIXI.Sprite[];
    private symbolSize: number;
    private symbolCount: number;
    private symbolType: string;
    private speed: number = 0;
    private isSpinning: boolean = false;
    private position: number;
    private blurFilter: BlurFilter | undefined;
    public snapGridEvent: CustomEvent = new CustomEvent('snapGrid');
    private finalSymbolIds: SymbolType[] | undefined;
    private finalSymbolsAdded: boolean = false;
    private reelId: number;
    private finalSymbolPositionDistance: number = 0;

    constructor(id: number, symbolCount: number, symbolSize: number, symbolType: string) {
        this.container = new PIXI.Container();
        this.container.name = 'Reel';
        this.symbols = [];
        this.symbolSize = symbolSize;
        this.symbolCount = symbolCount;
        this.symbolType = symbolType
        this.position = 0;
        this.reelId = id;

        this.addRandomSymbols();

        this.createBlurFilter();
    }

    private addRandomSymbols(): void {
        // Create symbols for the reel, arranged horizontally
        const topSymbol: Sprite = this.createRandomSymbol(-1);
        this.addSymbol(topSymbol);

        for (let i = 0; i < this.symbolCount; i++) {
            const symbol: Sprite = this.createRandomSymbol(i);
           this.addSymbol(symbol);
        }

        const bottomSymbol: Sprite = this.createRandomSymbol(this.symbolCount);
        this.addSymbol(bottomSymbol);
    }

    private addSymbol(symbol: Sprite): void {
        this.container.addChild(symbol);
        this.symbols.push(symbol);
    }

    private createRandomSymbol(symbolIndex: number): Sprite {
        // Get a random symbol texture
        const texture: Texture = this.getRandomSymbolTexture();
        return this.createSymbol(symbolIndex, texture);
    }

    private getRandomSymbolTexture(): Texture {
        const randomTexture = SYMBOL_TEXTURES[Math.floor(Math.random() * SYMBOL_TEXTURES.length)];

        return AssetLoader.getTexture(this.symbolType, randomTexture);
    }

    private createSymbol(symbolIndex: number, texture: Texture): Sprite {
        // Create a sprite with the texture
        const symbol: Sprite = new Sprite(texture);
        symbol.anchor.set(0.5);
        symbol.scale.x = symbol.scale.y = Math.min(this.symbolSize / symbol.width, this.symbolSize / symbol.height);
        symbol.x = symbolIndex * this.symbolSize  + this.symbolSize / 2;
        symbol.y = this.symbolSize / 2;

        return symbol;
    }

    private createBlurFilter(): void {
        // Create blur filter
        this.blurFilter = new BlurFilter();
        this.blurFilter.blurX = 0;
        this.blurFilter.blurY = 0;
    }

    public update(delta: number): void {
        if (!this.isSpinning && this.speed === 0) return;

        this.moveSymbols(delta);

        if (!this.finalSymbolsAdded) {
            this.wrapSymbols();
        }
        this.updateBlurFilter();
        if (!this.isSpinning) {
            if (!this.isSpinning && !this.finalSymbolsAdded) {
                this.addFinalSymbols();
            }
            this.finalSymbolPositionDistance -= this.speed * delta / FPS * this.symbolSize;
            this.speed = this.finalSymbolPositionDistance / FPS;

             // If speed is very low, stop completely and snap to grid
             if (this.finalSymbolPositionDistance < REEl_STOP_THRESHOLD) {
                 this.speed = 0;
                 this.snapToGrid();
             }
        }
    }

    private moveSymbols(delta: number): void {
        for (let j = 0; j < this.symbols.length; j++) {
            const symbol = this.symbols[j];
            symbol.x += this.speed * delta / FPS * this.symbolSize;
        }
    }

    private updateBlurFilter(): void {
        // Update blur based on speed
        if (this.blurFilter) {
            this.blurFilter.blurY = this.speed / 5;
        }
    }

    private wrapSymbols(): void {
        for (let i = 0; i < this.symbolCount + 2; i++) {
            // Wrap around if symbol goes off screen
            if (this.symbols[i].x > this.symbolSize * this.symbolCount + 1) {
                this.symbols[i].x -= this.symbolSize * this.symbols.length;
                if (!this.isSpinning || (this.finalSymbolIds && this.finalSymbolIds.length > 0)) {
                    // Randomize symbol if it's out of view
                    this.symbols[i].texture = this.getRandomSymbolTexture();
                }
            }
        }
    }

    private addFinalSymbols(): void {
        if (!this.finalSymbolIds || this.finalSymbolIds?.length === 0) {
           return;
        }
        for (let i = this.finalSymbolIds.length - 1; i >= 0; i--) {
            const texture: Texture = AssetLoader.getTexture(this.symbolType, `symbol${this.finalSymbolIds[i]}.png`);
            const symbol: Sprite =  this.createSymbol(i, texture);
            symbol.name = this.finalSymbolIds[i];
            symbol.x = Math.min(...this.symbols.map(symbol => symbol.x)) - this.symbolSize;
            this.finalSymbolPositionDistance = i * this.symbolSize - symbol.x + this.symbolSize;
            this.container.addChild(symbol);
            this.symbols.unshift(symbol);
        }
        this.finalSymbolsAdded = true;
    }

    private snapToGrid(): void {
        // Snap symbols to horizontal grid positions
        this.position = Math.round(this.position);
        // Animate the symbols to their final position
        this.symbols.forEach((symbol: Sprite, i: number) => {
            const symbolPosition = Math.round((symbol.x - this.symbolSize / 2) / this.symbolSize);
            gsap.to(symbol, {
                x: symbolPosition * this.symbolSize + this.symbolSize / 2,
                duration: 0.5,
                ease: Back.easeOut
            });
        });
        // Once we've snapped to grid, we're done with this spin's server symbols
        this.finalSymbolIds = undefined;
        this.finalSymbolsAdded = false;
        this.symbols.splice(this.symbolCount)
        this.addSymbol(this.createRandomSymbol(this.symbolCount))
        this.addSymbol(this.createRandomSymbol(this.symbolCount + 1))

        window.dispatchEvent(this.snapGridEvent);
    }

    public startSpin(): void {
        this.isSpinning = true;
        this.speed = SPIN_SPEED;
        if (this.blurFilter) {
            this.container.filters = [this.blurFilter]; // Add filter only during spin
        }
    }

    public stopSpin(): void {
          this.isSpinning = false;
        // The reel will gradually slow down in the update method
        this.container.filters = []; // Remove filter when stopped
    }

    public addFinalSymbolIDs(symbolIds: SymbolType[] | undefined): void {
        this.finalSymbolIds = symbolIds;
        console.log(this.finalSymbolIds);
    }

    public playSymbolsWinAnimation(winIds: number[], symbolType: SymbolType, onCompleteAnimation: Function | null): void {
        const sortedSymbols: Sprite[] = this.symbols.sort((a, b) => a.x - b.x);
        let onCompleteCallback: any = null;
        winIds.forEach((symbolId: number, index: number) => {
            if (Number(symbolId) === 1 && sortedSymbols[index].name === symbolType) {
                const isFinalWinSymbol = winIds.slice(index + 1).indexOf(1) === -1;
                if (isFinalWinSymbol) {
                    onCompleteCallback = onCompleteAnimation;
                }
                gsap.to(sortedSymbols[index].scale, {
                    x: 1.25,
                    y: 1.25,
                    duration: 0.5,
                    repeat: 1,
                    yoyo: true,
                    onComplete: onCompleteCallback
                });
            }
        });
    }
}
