
import {Rect} from "../base/rect";
import {Point} from "../base/point";
import {Style} from "../base/style";
import {Widget} from "./widget";
import Events = require("../base/events");
import {TitleContent} from "./title-content";
import {WidgetFactory} from "./widget-factory";
import {WidgetRecyclableCreator} from "./widget-recyclable-creator";

/**
 * 可折叠的标题控件，点击折叠图片或双击时折叠或展开。
 * 只能用于TitleContent的titleWidget。
 *
 */
export class CollapsableTitle extends Widget {
	public onClickTrigger : Function;

	protected get collapsed() : boolean {
		var titleContent = <TitleContent>this.parent;
		return titleContent.collapsed;
	}
	
	protected set collapsed(value:boolean) {
		var titleContent = <TitleContent>this.parent;
		titleContent.collapsed = value;
	}
	
	protected trigger() {
		var titleContent = <TitleContent>this.parent;
		var collapsed = !titleContent.collapsed;

		if(this.onClickTrigger) {
			this.onClickTrigger(collapsed);
		}
	}

	protected getFgImageRect(style:Style) : Rect {
		var w = this.clientH;
		return Rect.rect.init(this.leftPadding, this.topPadding, w, w);
	}
	
	protected getTextRect(style:Style) : Rect {
		var w = this.clientH;
		return Rect.rect.init(this.leftPadding+w, this.topPadding, this.clientW-w, this.clientH);
	}

	protected getStyleType() : string {
		return this._styleType || this.collapsed ? "collapsable-title.collapsed":"collapsable-title.expanded";
	}

	public dispatchDblClick(evt:any) {
		super.dispatchDblClick(evt);
		if(!this._enable || !this._sensitive) {
			return;
		}
		this.trigger();	
	}

	public dispatchClick(evt:any) {
		super.dispatchClick(evt);

		if(!this._enable || !this._sensitive) {
			return;
		}

		var p = this.toLocalPoint(Point.point.copy(evt));
		if(p.x < this.h) {
			this.trigger();	
		}
	}

	public dispose() {
		super.dispose();
		this.onClickTrigger = null;
	}

	constructor() {
		super(CollapsableTitle.TYPE);
	}

	public static TYPE = "collapsable-title";
	private static rBin = WidgetRecyclableCreator.create(CollapsableTitle);
	public static create(options?:any) : CollapsableTitle {
		return <CollapsableTitle>CollapsableTitle.rBin.create(options);
	}
};
