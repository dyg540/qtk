import Events = require("../events");
import { HtmlElement } from "./html-element";
export declare class HtmlEdit extends HtmlElement {
    protected _visible: boolean;
    protected changeEvent: Events.ChangeEvent;
    protected keyEvent: Events.KeyEvent;
    inputType: string;
    text: string;
    show(): HtmlElement;
    hide(): HtmlElement;
    create(tag: string): HtmlEdit;
    protected static _input: HtmlEdit;
    static readonly input: HtmlEdit;
    protected static _textArea: HtmlEdit;
    static readonly textArea: HtmlEdit;
}
