import {Rect} from '../rect';
import {Align, Orientation} from '../consts';
import {Direction} from '../consts';
import {stableSort} from "../utils";
import {Widget} from '../controls/widget';
import {Layouter, LayouterFactory} from './layouter';

const TYPE_H = "linear-h";
const TYPE_V = "linear-v";

/**
 * 线性布局器。可以设置为水平和垂直两个方向。
 */
export class LinearLayouter extends Layouter {
	/**
	 * 控件之间的间距。
	 */
	public spacing : number;

	/**
	 * 布局的方向。
	 */
	public orientation : Orientation;

	public get type() : string {
		return this.orientation === Orientation.V ? TYPE_V : TYPE_H;
	}
	
	/**
	 * 设置参数。
	 */
	public setOptions(options:any) : any {
		this.spacing = options.spacing || 0;
		this.orientation = options.orientation || Orientation.V;

		return this;
	}

	public layoutChildren(widget:Widget, children:Array<Widget>, rect:Rect) : Rect {
		var r = rect.clone();
		var defParam = this.type === TYPE_H ? LinearLayouterParam.defParamH : LinearLayouterParam.defParamV;

		var arr = children.filter(function(child) {
			var param =  child.layoutParam || defParam;

			return param.position > 0;
		});
		stableSort(arr, function(a, b) {
			var ap =  a.layoutParam || defParam;
			var bp =  b.layoutParam || defParam;
			return ap.position - bp.position;
		});
		arr.forEach(child => {
			if(r.w > 0 &&  r.h > 0) {
				this.layoutChild(child, r);
			}
		});
		
		arr = children.filter(function(child) {
			var param =  child.layoutParam || defParam;

			return !param.position;
		});
		arr.forEach(child => {
			if(r.w > 0 &&  r.h > 0) {
				this.layoutChild(child, r);
			}
		});

		arr = children.filter(function(child) {
			var param =  child.layoutParam || defParam;

			return param.position < 0;
		});
		stableSort(arr, function(a, b) {
			var ap =  a.layoutParam || defParam;
			var bp =  b.layoutParam || defParam;
			return bp.position - ap.position;
		});
		arr.forEach(child => {
			if(r.w > 0 &&  r.h > 0) {
				this.layoutChild(child, r);
			}
		});

		r.dispose();

		return rect;
	}

	public layoutChild(child:Widget, r:Rect) {
		var x = 0;
		var y = 0;
		var w = 0;
		var h = 0;
		var defParam = this.type === TYPE_H ? LinearLayouterParam.defParamH : LinearLayouterParam.defParamV;
		var param = <LinearLayouterParam>child.layoutParam || defParam;

		var position = param.position;
		if(param && param.type.indexOf("linear") >= 0 && child.visible) {
			var spacing = param.spacing || this.spacing;
			h = Math.min(r.h, param.h ? Layouter.evalValue(param.h, r.h) : child.h);
			w = Math.min(r.w, param.w ? Layouter.evalValue(param.w, r.w) : child.w);
	
			if(this.orientation === Orientation.V) {
				switch(param.align) {
					case Align.LEFT: {
						x = r.x;
						break;
					}
					case Align.RIGHT: {
						x = r.x + r.w - w;
						break;
					}
					default: {
						x = r.x + ((r.w - w) >> 1);
						break;
					}
				}
				
				var spacingH = spacing + h;
				if(position >= 0) {
					y = r.y + spacing;
					r.y += spacingH;
				}else{
					y = r.y + r.h - spacingH;
				}
				r.h -= spacingH;
			}else{
				switch(param.align) {
					case Align.TOP: {
						y = r.y;
						break;
					}
					case Align.BOTTOM: {
						y = r.y + r.h - h;
						break;
					}
					default: {
						y = r.y + ((r.h - h) >> 1);
						break;
					}
				}
				var spacingW = spacing + w;
				if(position >= 0) {
					x = r.x + spacing;
					r.x += spacingW;
				}else{
					x = r.x + r.w - spacingW;
				}
				r.w -= spacingW;
			}

			child.moveResizeTo(x, y, w, h);
			child.relayoutChildren();
		}
	}

	public createParam(options?:any) {
		return LinearLayouterParam.createWithType(this.type, options);
	}

	public static createV(options:any) : LinearLayouter {
		var layouter = new LinearLayouter();
		layouter.setOptions(options);
		layouter.orientation = Orientation.V;

		return layouter;
	}

	public static createH(options?:any) : LinearLayouter {
		var layouter = new LinearLayouter();
		layouter.setOptions(options || {});
		layouter.orientation = Orientation.H;

		return layouter;
	}
};

LayouterFactory.register(TYPE_H, LinearLayouter.createH);
LayouterFactory.register(TYPE_V, LinearLayouter.createV);

/**
 * Linear布局器的参数。
 * 
 * 如果父控件使用LinearLayouter布局器，则子控件需要把layoutParam设置为LinearLayouterParam。
 * 
 * 对于w参数：
 * *.如果以px结尾，则直接取它的值。
 * *.如果以%结尾，则表示剩余空间的宽度/高度的百分比。
 *
 */
export class LinearLayouterParam {
	public type : string;
	/**
	 * 控件的宽度。
	 */
	public w : string;
	/**
	 * 控件的高度。
	 */
	public h : string;
	/**
	 * 控件的对齐方式。
	 * 对于水平布局的情况，对齐方式决定控件的上下位置。
	 * 对于垂直布局的情况，对齐方式决定控件的左右位置。
	 */
	public align : Align;
	/**
	 * 与前一个控件之间的间距。
	 */
	public spacing : number;
	
	/**
	 * 控件的位置。
	 * 对于水平布局的情况，position>0，从左边开始排列，position<0，从右边开始排列。
	 * 对于垂直布局的情况，position>0，从顶部开始排列，position<0，从底部开始排列。
	 */
	public position : number;

	constructor(type:string, w:string, h:string, spacing:number, align:Align, position:number) {
		this.type = type || TYPE_V;
		this.w = w;
		this.h = h;
		this.align = align;
		this.spacing = spacing;
		this.position = position;
	}

	public static defParamV = LinearLayouterParam.createWithType(TYPE_V, null);
	public static defParamH = LinearLayouterParam.createWithType(TYPE_H, null);
	public static createWithType(type:string, opts:any) : LinearLayouterParam {
		var options = opts || {};
		return new LinearLayouterParam(type, options.w || options.width, options.h || options.height, 
						 options.spacing||0, options.align||Align.C, options.position || 1);
	}

	public static create(opts:any) : LinearLayouterParam {
		return this.createWithType(TYPE_H, opts);
	}
};

