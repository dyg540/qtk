
import {Rect} from "../base/rect";
import {Style} from "../base/style";
import {Widget} from "./widget";
import {Button} from "./button";
import {TabPage} from "./tab-page";
import Events = require("../base/events");
import {Graphics} from "../base/graphics";
import {Orientation} from "../base/consts";
import {RadioButton} from "./radio-button";
import {WidgetFactory} from "./widget-factory";
import {ImageDrawType, ImageTile} from "../base/image-tile";
import {WidgetRecyclableCreator} from "./widget-recyclable-creator";

/**
 * @class TabButton 
 * @extends Widget
 * 标签控件上的标签按钮，一般不需要直接使用它。它其实是单项按钮，只有一个按钮处于active状态下，用来指示当前页面。
 */ 
export class TabButton extends RadioButton {
	protected _normalIcon : ImageTile;
	protected _currentIcon : ImageTile;
	protected _normalIconURL : string;
	protected _currentIconURL : string;
	protected _tabPage : TabPage;
	protected _closeButton : Widget;
	
	protected _orn : Orientation;
	protected _cbAtLeft : boolean;

	/**
	 * @property {Widget}  closeButton
	 * 关闭按钮（仅当closable为true时才有效）。
	 */
	public get closeButton() : Widget {
		return this._closeButton;
	}

	/**
	 * @property {boolean}  closeButtonAtLeft
	 * true表示关闭按钮在左边，false表示关闭按钮在右边。
	 */
	public set closeButtonAtLeft(value:boolean) {
		this._cbAtLeft = value;
		this.relayoutChildren();
	}
	public get closeButtonAtLeft() : boolean {
		return this._cbAtLeft;
	}
	
	/**
	 * @property {Orientation}  Orientation
	 * 按钮上的文字和图标排列的方向。Orientation.H表示水平方向上排列，Orientation.V表示垂直方向上排列。
	 */
	public set orientation(value:Orientation) {
		this._orn = value;
	}
	
	public get orientation() : Orientation{
		return this._orn;
	}
	
	/**
	 * @property {boolean}  closable
	 * 表示当前标签是否可关闭，如果可关闭，则会显示一个小的关闭按钮。
	 */
	public set closable(value:boolean) {
		if(value && this._closeButton || !value && !this._closeButton) {
			return;
		}

		if(this._closeButton) {
			this.removeChild(this._closeButton);
			this._closeButton = null;
		}else{
			var closeButton = Button.create();
			closeButton.set({styleType:"tab-button.close"});
			this.addChild(closeButton);

			this._closeButton = closeButton;
		}
	}
	public get closable() : boolean {
		return !!this._closeButton;
	}

	/**
	 * @property {TabPage} tabPage
	 * 与当前按钮关联的TabPage。
	 */
	public set tabPage(value:TabPage) {
		this._tabPage = value;
	}
	public get tabPage() : TabPage {
		return this._tabPage;
	}

	/**
	 * @method setIcons
	 * 设置图标。
	 * @param {string} normalIconURL 正常情况下的图标URL。
	 * @param {string} currentIconURL 处于active时的图标URL。
	 * return {TabButton} 控件本身。
	 */
	public setIcons(normalIconURL:string, currentIconURL:string) : TabButton {
		if(normalIconURL) {
			this._normalIcon = ImageTile.create(normalIconURL, evt => {
				this.requestRedraw();
			});
		}else{
			this._normalIcon = null;
		}
		this._normalIconURL = normalIconURL ? normalIconURL : null;

		if(currentIconURL) {
			this._currentIcon = ImageTile.create(currentIconURL, evt => {
				this.requestRedraw();
			});
		}else{
			this._currentIcon = null;
		}
		this._currentIconURL = currentIconURL ? currentIconURL : null;

		return this;
	}

	public relayoutChildren() : Rect {
		if(this._closeButton) {
			var h = this.h >> 1;
			var w = h;
			var x = (this.h - h) >> 1;
			var y = x;

			if(!this.closeButtonAtLeft) {
				x = this.w - x - w;
			}
			
			this._closeButton.moveResizeTo(x, y, w, h);
		}

		return Rect.rect.init(0, 0, this.w, this.h);
	}

	public get desireWidth() : number {
		var w = this.leftPadding + this.rightPadding;
		var text = this.text;
		var style = this.getStyle();

		if(this._currentIcon || this._normalIcon) {
			w += this.h;
		}
		
		if(this._closeButton) {
			w += this.h;
		}

		if(text && style) {
			var font = style.font;
			w += Graphics.measureText(text, font) + style.fontSize;
		}
		
		return w;
	}

	protected getStyleType() : string {
		var appendix = this.value ? "current" : "normal";
		
		return (this._styleType || this.type) +"."+appendix;
	}

	protected drawImage(ctx:any, style:Style) : Widget {
		var text = this.getLocaleText();
		var icon = this.value ? this._currentIcon : this._normalIcon;

		var w = 0;
		var h = 0;
		if(icon) {
			var x = this.leftPadding;
			var y = this.topPadding;

			if(this._orn === Orientation.V) {
				w = this.w - this.leftPadding - this.rightPadding;
				h = this.h - this.bottomPadding - this.topPadding;
				if(text) {
					h -= style.fontSize;
				}
				icon.draw(ctx, ImageDrawType.ICON, x, y, w, h);
				if(text) {
					y = this.h - this.bottomPadding - style.fontSize;
					Graphics.drawTextSL(ctx, text, style, Rect.rect.init(0, y, w, style.fontSize));
				}
			}else{
				h = this.h - this.topPadding - this.bottomPadding;
				w = h;
				icon.draw(ctx, ImageDrawType.ICON, x, y, w, h);
				if(text) {
					x += w + this.leftPadding;
					w = this.w - x - this.rightPadding;
					if(this._closeButton) {
						w -= this.h;
					}
					Graphics.drawTextSL(ctx, text, style, Rect.rect.init(x, y, w, h));
				}
			}
		}else{
			w = this.w;
			if(this._closeButton) {
				w -= this.h;
			}
			Graphics.drawTextSL(ctx, text, style, Rect.rect.init(0, 0, w, this.h));
		}

		return this;
	}

	protected drawText(ctx:any, style:Style) : Widget {
		return this;
	}

	constructor() {
		super(TabButton.TYPE);
	}
	
	protected onReset() {
		this._tabPage = null;
		this._closeButton = null;
		this._normalIcon = null;
		this._currentIcon = null;
	}

	public dispose() {
		super.dispose();
		this._tabPage = null;
		this._closeButton = null;
		this._normalIcon = null;
		this._currentIcon = null;
	}
	
	protected static defProps = Object.assign({}, Widget.defProps, {_lp:2, _tp:2, _rp:2, _bp:2,
		_normalIconURL:null, _currentIconURL:null,closable:false, _cbAtLeft:false, _orn:Orientation.H});
	protected getDefProps() : any {
		return TabButton.defProps;
	}

	public static TYPE = "tab-button";
	private static re = WidgetRecyclableCreator.create(TabButton);
	public static create(options?:any) : TabButton {
		return <TabButton>TabButton.re.create(options);
	}
};

WidgetFactory.register(TabButton.TYPE, TabButton.create);

