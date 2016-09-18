import {Rect} from "../rect";
import {Style} from "../style";
import {Widget, WidgetState} from "./widget";
import {Graphics, TextLine} from "../graphics";
import {WidgetFactory} from "./widget-factory";
import {RecyclableCreator} from "../recyclable-creator";

export class Label extends Widget {
	protected _multiLines : boolean;
	protected _textLines : Array<TextLine>;

	public get multiLines() : boolean {
		return this._multiLines;
	}

	public set multiLines(value:boolean) {
		this.setProp("multiLines", value, true);
	}

	public get value() {
		return this.text;
	}
	public set value(value) {
		this.text = value;
	}
	
	public setStyle(state:WidgetState, style:Style):Widget{
		super.setStyle(state, style);
		this.relayoutText();

		return this;
	}

	protected drawTextSL(ctx:any, style:Style) : Widget {
		var text = this._textLines[0].text;

		if(text && style.textColor) {
			var x = this.leftPadding;
			var y = this.topPadding;
			var w = this.w - x - this.rightPadding;
			var h = this.h - y - this.bottomPadding;
			Graphics.drawTextSL(ctx, text, style, Rect.rect.init(x, y, w, h));
		}

		return this;
	}

	protected drawTextML(ctx:any, style:Style) : Widget {
		if(style.textColor) {
			var x = this.leftPadding;
			var y = this.topPadding;
			var w = this.w - x - this.rightPadding;
			var h = this.h - y - this.bottomPadding;
			Graphics.drawTextML(ctx, this._textLines, style, Rect.rect.init(x, y, w, h));
		}

		return this;
	}

	protected drawText(ctx:any, style:Style) : Widget {
		if(this._textLines && this._textLines.length) {
			if(this._multiLines) {
				this.drawTextML(ctx, style);
			}else{
				this.drawTextSL(ctx, style);
			}
		}

		return this;
	}

	public relayoutText() : Widget {
		if(this._inited) {
			var style = this.getStyle();
			var text = this.getLocaleText();
			this._textLines = Graphics.layoutText(text, this.w, style.font);
		}

		return this;
	};

	protected setProp(prop:string, newValue:any, notify:boolean) : Widget {
		super.setProp(prop, newValue, notify);
		if(prop === "w" || prop === "h" || prop === "value" || prop === "text") {
			this.relayoutText();
		}

		return this;
	}

	constructor(type?:string) {
		super(type || Label.TYPE);
	}

	public dispose() {
		super.dispose();
		Label.recycleBin.recycle(this);
	}

	protected onInit() {
		super.onInit();
		this.relayoutText();
	}

	public reset(type:string) : Widget {
		super.reset(type);
		this.padding = 5;

		return this;
	}

	public static TYPE = "label";
	private static recycleBin = new RecyclableCreator<Label>(function() {return new Label()});
	public static create(options?:any) : Label {
		return <Label>Label.recycleBin.create().reset(Label.TYPE).set(options);
	}
};

WidgetFactory.register(Label.TYPE, Label.create);

