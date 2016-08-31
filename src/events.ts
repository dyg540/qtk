import {InputEventDetail, KeyEventDetail, PointerEventDetail, WheelEventDetail} from "./event-detail.ts";

/**
 * 常见事件名称的定义。
 */
export const WHEEL = "qtk-wheel";
export const KEYUP = "qtk-keyup";
export const KEYDOWN = "qtk-keydown";
export const CONTEXT_MENU = "qtk-context-menu";
export const POINTER_DOWN = "qtk-pointer-down";
export const POINTER_MOVE = "qtk-pointer-move";
export const POINTER_UP   = "qtk-pointer-up";
export const POINTER_OUT  = "qtk-pointer-out";
export const POINTER_OVER = "qtk-pointer-over";
export const CLICK = "qtk-click";
export const CHANGE = "change"
export const DISPOSE = "dispose"
export const SHOW = "show"
export const HIDE = "hide"
export const MOVE = "move";
export const OPEN = "open"
export const CLOSE = "close"
export const RESIZE = "resize";
export const READY = "ready";
export const DRAW = "draw";
export const PREDRAW = "predraw";
export const POSTDRAW = "postdraw";
export const LOAD = "load";

export class Event {
	private _type : string;
	private _target : any;
	private _propagationStopped : boolean;

	public init(type:string, detail?:any) : any {
		this._type = type;
		this._target = null;
		this._propagationStopped = false;

		return this;
	}

	public get propagationStopped() {
		return this._propagationStopped;
	}

	public stopPropagation() {
		this._propagationStopped = true;
	}

	public set type(value) {
		this._type = value;
	}

	public get type() {
		return this._type;
	}
	
	public set target(value) {
		this._target = value;
	}

	public get target() {
		return this._target;
	}

	public dispose() {
	}
};

export class InputEvent extends Event {
	/**
	 * alt键是否按下。
	 */
	public altKey   : boolean;
	/**
	 * ctrl键是否按下。
	 */
	public ctrlKey  : boolean;
	/**
	 * shift键是否按下。
	 */
	public shiftKey : boolean;
	/**
	 * command键是否按下。
	 */
	public commandKey : boolean;

	public init(type:string, detail:InputEventDetail) : any {
		super.init(type);

		this.altKey = detail.altKey;
		this.ctrlKey = detail.ctrlKey;
		this.shiftKey = detail.shiftKey;
		this.commandKey = detail.commandKey;

		return this;
	}
};

export class PointerEvent extends InputEvent {
	/**
	 * 指针事件的ID。
	 */
	public id : number;
	/**
	 * 指针事件的x坐标。
	 */
	public x : number;
	/**
	 * 指针事件的y坐标。
	 */
	public y : number;
	/**
	 * 指针是否按下。
	 */
	public pointerDown : boolean;
	/**
	 * 如果指针按下，按下时的x坐标。
	 */
	public pointerDownX : number;
	/**
	 * 如果指针按下，按下时的y坐标。
	 */
	public pointerDownY : number;
	/**
	 * 如果指针按下，按下时的时间。
	 */
	public pointerDownTime : number;

	public init(type:string, detail:PointerEventDetail) : any{
		super.init(type, detail);

		this.id = detail.id;
		this.x = detail.x;
		this.y = detail.y;
		this.pointerDown = detail.pointerDown;
		this.pointerDownX = detail.pointerDownX;
		this.pointerDownY = detail.pointerDownY;
		this.pointerDownTime = detail.pointerDownTime;

		return this;
	}

	public static create(type:string, detail:PointerEventDetail) : PointerEvent {
		var e = new PointerEvent();
		
		return e.init(type, detail);
	}
}

export class WheelEvent extends InputEvent {
	/**
	 * 滚动的间隔。
	 */
	public delta : number;
	public init(type:string, detail:WheelEventDetail) : any {
		super.init(type, detail);
		this.delta = detail.delta;

		return this;
	}

	public static create(detail:WheelEventDetail) : WheelEvent {
		var e = new WheelEvent();

		return e.init(WHEEL, detail);
	}
}

export class KeyEvent extends InputEvent {
	public keyCode : number;
	
	public init(type:string, detail:KeyEventDetail) : any {
		super.init(type, detail);
		this.keyCode = detail.keyCode;

		return this;
	}

	public static create(type:string, detail:KeyEventDetail) {
		var e = new KeyEvent();

		return e.init(type, detail);
	}
}

export class DrawEvent extends Event {
	/**
	 * 当前时间。
	 */
	public time : number;
	/**
	 * 间隔时间。
	 */
	public deltaTime : number;
	/**
	 * 帧率。
	 */
	public fps : number;

	public init(type:string, detail:any) : any {
		super.init(type);

		this.fps = detail.fps;
		this.time = detail.time;
		this.deltaTime = detail.deltaTime;

		return this;
	}

	public static create(type:string) {
		var e = new DrawEvent();

		return e.init(type, {});
	}
};

export class ChangeEvent extends Event {
	/**
	 * 属性名。
	 */
	public attr : string;
	/**
	 * 属性的旧值。
	 */
	public oldValue : any;
	/**
	 * 属性的新值。
	 */
	public newValue : any;

	public init(type:string, detail:any) : any {
		super.init(type);

		this.attr = detail.attr;
		this.oldValue = detail.oldValue;
		this.newValue = detail.newValue;

		return this;
	}

	public static create(attr:string, oldValue:any, newValue:any) : ChangeEvent {
		var e = new ChangeEvent();

		return e.init(CHANGE, {attr:attr, oldValue:oldValue, newValue:newValue});
	}
};

