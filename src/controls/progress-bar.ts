
import {Widget} from "./widget";
import {Style} from "../base/style";
import {Graphics} from "../base/graphics";
import {WidgetFactory} from "./widget-factory";
import {ImageTile, ImageDrawType} from "../base/image-tile";
import {WidgetRecyclableCreator} from "./widget-recyclable-creator";

/**
 * 进度条的类型有三种：水平，垂直和圆形。
 */
export enum ProgressBarType {
	H = 1,
	HORIZONTAL = 1,
	V = 2,
	VERTICAL = 2,
	C = 3,
	CIRCLE = 3
};

/**
 * 进度条。value表示进度，取值在0到1之间。
 */
export class ProgressBar extends Widget {
	public barType : ProgressBarType;
	public textFormater = function(value:number) {
		return Math.round((value * 100)) + "%";
	};

	constructor(type?:string) {
		super(type || ProgressBar.TYPE);
		this.barType = ProgressBarType.H;
	}
	
	public get text() {
		return this.textFormater(this._value);
	}

	public get value() {
		return this._value;
	}

	public set value(value) {
		var v = Math.min(1, Math.max(0, value));
		this.setProp("value", v, true);
	}
	
	protected drawColorForeGround(ctx:any, style:Style) : Widget {
		Graphics.drawRoundRect(ctx, style.foreGroundColor, null, 0,
				0, 0, this.w, this.h, style.roundRadius);
		return this;
	}

	protected drawImage(ctx:any, style:Style) : Widget {
		var img = style.foreGroundImage;
		var value = this.value;

		ctx.save();
		ctx.beginPath();
		switch(this.barType) {
			case ProgressBarType.V:{
				var h = this.h * value;
				var y = this.h - h;
				ctx.rect(0, y, this.w, h);
				break;
			}
			case ProgressBarType.C:{
				var cx = this.w >> 1;
				var cy = this.h >> 1;
				var angle = this.value * Math.PI * 2 - Math.PI/2;
				ctx.moveTo(cx, cy);
				ctx.lineTo(cx, 0);
				ctx.arc(cx, cy, cy, -Math.PI/2, angle, false)
				ctx.closePath();
				break;
			}
			default: {
				var w = this.w * value;
				ctx.rect(0, 0, w, this.h);
				break;
			}
		}
		ctx.clip();
		if(img) {
			img.draw(ctx, style.foreGroundImageDrawType, 0, 0, this.w, this.h); 
		}else if(style.foreGroundColor) {
			this.drawColorForeGround(ctx, style);
		}
		ctx.restore();

		return this;
	}
	
	protected static defProps = Object.assign({}, Widget.defProps, {barType:ProgressBarType.H});
	protected getDefProps() : any {
		return ProgressBar.defProps;
	}
	
	public static TYPE = "progress-bar";
	private static recycleBin = WidgetRecyclableCreator.create(ProgressBar);
	public static create(options?:any) : ProgressBar{
		return <ProgressBar>ProgressBar.recycleBin.create(options);
	}
};

WidgetFactory.register(ProgressBar.TYPE, ProgressBar.create);

