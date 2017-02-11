import { Style } from "../style";
import { Widget } from "./widget";
import { ImageTile } from "../image-tile";
export declare class ToolBarItem extends Widget {
    constructor(type?: string);
    protected drawImage(ctx: any, style: Style): Widget;
    protected onCreated(): void;
    protected normalIconURL: string;
    protected disableIconURL: string;
    protected normalIcon: ImageTile;
    protected disableIcon: ImageTile;
    protected static defProps: {} & {
        _x: number;
        _y: number;
        _z: number;
        _w: number;
        _h: number;
        _state: number;
        _value: number;
        _enable: boolean;
        _visible: boolean;
        _selected: boolean;
        _opacity: number;
        _scaleX: number;
        _scaleY: number;
        _pivotX: number;
        _pivotY: number;
        _rotation: number;
        _sensitive: boolean;
        _tips: any;
        _text: any;
        _name: any;
        _hitTestResult: number;
        _isWindow: boolean;
        _mode: number;
        _styleType: any;
        _lp: number;
        _tp: number;
        _rp: number;
        _bp: number;
    } & {
        normalIconURL: any;
        disableIconURL: any;
    };
    protected getDefProps(): any;
    static TYPE: string;
    private static recycleBin;
    static create(options?: any): ToolBarItem;
}
export declare class ToolBar extends Widget {
    protected onInit(): void;
    addSpacer(width: number): void;
    addItem(cmd: string, text: string, tips: string, normalIconURL: string, disableIconURL: string): void;
    static TYPE: string;
    private static recycleBin;
    static create(options?: any): ToolBar;
}
