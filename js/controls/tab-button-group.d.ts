import { Rect } from "../rect";
import { Widget } from "./widget";
export declare class TabButtonGroup extends Widget {
    protected _autoExpand: boolean;
    value: number;
    autoExpand: boolean;
    relayoutChildren(): Rect;
    protected drawChildren(ctx: any): Widget;
    reset(type: string): Widget;
    constructor();
    static TYPE: string;
    private static r;
    static create(options?: any): TabButtonGroup;
}