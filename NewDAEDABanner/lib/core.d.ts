declare module mygame {

    export class Core {
        static VERSION: number;
        static game: Phaser.Game;
        static defaultWidth: number;
        static defaultHeight: number;
        static bgModeScale: number;
        static globalEvents: OEventDispatcher;
        static centerX: number;
        static centerY: number;
        static width: number;
        static height: number;
		static init(width: number, height: number, bannerMode?: number): void;
        static begin(game: Phaser.Game, disabledMouse?: boolean): void;
        static gotoFunction(name: string): void;
		static showDebugHeader(): void;

        static isDesktop: boolean;
        static isLandscape: boolean;
        static isDefaultLandscape: boolean;
    }

    export class OSprite extends Phaser.Sprite {

        currentScale: {x: number, y: number};

        constructor (x: number, y: number, key?: string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture, frame?: string|number);
        add(child: PIXI.DisplayObject);
        otherXY(x: number, y: number): OSprite;
        myLeftOffset(value?: number): OSprite;
        otherLeftOffset(value?: number): OSprite;
        myRightOffset(value?: number): OSprite;
        otherRightOffset(value?: number): OSprite;
        myTopOffset(value?: number): OSprite;
        otherTopOffset(value?: number): OSprite;
        myBottomOffset(value?: number): OSprite;
        otherBottomOffset(value?: number): OSprite;
        end(): OSprite;
        myScale(valueX: number, valueY?: number): OSprite;
        otherScale(valueX: number, valueY?: number): OSprite;
        myVisible(value: boolean): OSprite;
        otherVisible(value: boolean): OSprite;
        enabledBgMode(): OSprite;
        enabledMask(offsetX?: number, offsetY?: number, width?: number, height?: number, testMode?: boolean): OSprite;
        
    }

    export class OEventDispatcher {
        on(msg: string, cb: Function, useCapture?: boolean): void;
        off(msg: string, cb?: Function): void;
        dispatch(msg: string, userData?: any): void;
    }

    export class OState extends Phaser.State {
        constructor(changeOrientation: boolean);
        onPortret(): void;
        onLandscape(): void;
    }

    export class OButton extends Phaser.Button {
        soundOver: string;
        soundDown: string;
        enabled: boolean;

        constructor(key: string, frame: string[], cb: Function);
        setCBContext(cntx: any): void;
        setAnimationScale(delta: number, defaultScale: number): void;
        deleteFromParent(): void;
    }

    export class OButtonCheck extends Phaser.Button {
        soundOver: string;
        soundDown: string;
        enabled: boolean;
        check: boolean;

        constructor(key: string, frame: string[], cb: Function);
        setCBContext(cntx: any): void;
        setAnimationScale(delta: number, defaultScale: number): void;
        deleteFromParent(): void;
        setCheck(value: boolean): void;
    }

}