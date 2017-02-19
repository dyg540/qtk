import Events = require("../events");
import { Widget } from "../controls/widget";
/**
 * @class TitleValue
 * @extends Widget
 * 带标题控件的基类。
 */
export declare abstract class TitleValue extends Widget {
    protected _title: string;
    protected _titleW: string;
    protected _valueW: string;
    protected _titleWidget: Widget;
    protected _valueWidget: Widget;
    constructor(type?: string);
    /**
     * @property {string} title
     * 标题。
     */
    title: string;
    /**
     * @property {string} titleW
     * 标题控件的宽度。
     */
    titleW: string;
    /**
     * @prproperty {string} valueW
     * 值控件的宽度。
     */
    valueW: string;
    /**
     * @property {Widget} titleWidget
     * 标题控件。
     */
    readonly titleWidget: Widget;
    /**
     * @property {Widget} valueWidget
     * 值控件。
     */
    readonly valueWidget: Widget;
    value: any;
    /**
     * @method createValueWidget
     * 创建值控件，子类需要重载此函数。
     */
    protected createValueWidget(options?: any): Widget;
    onInit(): void;
    onReset(): void;
    protected forwardChangeEvent(evt: Events.ChangeEvent): void;
    protected onCreated(): void;
    protected onToJson(json: any): void;
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
        _lp: number;
        _tp: number;
        _rp: number;
        _bp: number;
        _title: any;
        _titleW: number;
        _valueW: number;
    };
    protected getDefProps(): any;
    dispose(): void;
}
