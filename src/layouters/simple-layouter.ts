import {Rect} from '../base/rect';
import {Widget} from '../controls/widget';
import {Layouter, LayouterFactory, LayouterParam, LayouterParamFactory} from './layouter';

const TYPE = "simple";

/**
 * 简单的布局器。
 */
export class SimpleLayouter extends Layouter {
	public get type() : string {
		return TYPE;
	}

	public layoutChildren(widget:Widget, children:Array<Widget>, rect:Rect) : Rect {
		var arr = widget.children;
		for(var i = 0, n = arr.length; i < n; i++) {
			this.layoutChild(arr[i], rect);
		}

		return rect;
	}

	public layoutChild(child:Widget, r:Rect) {
		var pw = r.w;
		var ph = r.h;
		var param = <SimpleLayouterParam>child.layoutParam;
		
		if(param && param.type === TYPE && child.visible) {
			var w = Layouter.evalValue(param.w, pw);
			var h = Layouter.evalValue(param.h, ph);
			if(param.minW >= 0) {
				w = Math.max(w, param.minW);
			}
			
			if(param.minH >= 0) {
				h = Math.max(h, param.minH);
			}

			if(param.maxW >= 0) {
				w = Math.min(w, param.maxW);
			}
			
			if(param.maxH >= 0) {
				h = Math.min(h, param.maxH);
			}

			var f = param.x[0];
			var x = (f === "c" || f === "m") ? (pw - w) >> 1 : Layouter.evalValue(param.x, pw);
			f = param.y[0];
			var y = (f === "c" || f === "m") ? (ph - h) >> 1 : Layouter.evalValue(param.y, ph);

			child.moveResizeTo(r.x + x, r.y + y, w, h);
			child.relayoutChildren();
		}
	}

	public createParam(options?:any) {
		return SimpleLayouterParam.createWithOptions(options);
	}

	static create() : SimpleLayouter {
		return SimpleLayouter.createWithOptions({});	
	}

	static createWithOptions(options?:any) : SimpleLayouter {
		var layouter = new SimpleLayouter();

		return layouter.setOptions(options);
	}
};

LayouterFactory.register(TYPE, SimpleLayouter.createWithOptions);

/**
 * 简单的布局器的参数。
 * 
 * 如果父控件使用SimpleLayouter布局器，则子控件需要把layoutParam设置为SimpleLayouterParam。
 * 
 * 对于x/y/w/h参数：
 * *.如果以px结尾，则直接取它的值。
 * *.如果以%结尾，则表示父控件的宽度/高度的百分比。
 * *.如果以-开头，则表示父控件的宽度/高度的减去该值。
 * 
 * x也可以为『center』，表示水平居中。
 * y也可以为『middle』，表示垂直居中。
 * 
 * 示例：
 *
 * 父控件的宽度为800，高度为600:
 *
 * param.x = "10px"  则 x = 10;
 * param.x = "10%"   则 x = 80;
 * param.x = "-10%"  则 x = 720;
 * param.x = "-10px" 则 x = 790;
 *
 */
export class SimpleLayouterParam extends LayouterParam {
	public type : string;
	public x : string;
	public y : string;
	public w : string;
	public h : string;
	public minW : number;
	public maxW : number;
	public minH : number;
	public maxH : number;

	constructor(x:string, y:string, w:string, h:string) {
		super(TYPE);

		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.minW = -1;
		this.minH = -1;
		this.maxW = -1;
		this.maxH = -1;
	}

	public static create(x:string|number, y:string|number, w:string|number, h:string|number) {
		return new SimpleLayouterParam(x.toString(), y.toString(), w.toString(), h.toString());
	}

	public static createWithOptions(opts:any) {
		var options = opts || {};
		return new SimpleLayouterParam(options.x||'0px', options.y||'center', 
									   options.w||'100%', options.h||'100%');
	}
};

LayouterParamFactory.register(TYPE, SimpleLayouterParam.createWithOptions);

