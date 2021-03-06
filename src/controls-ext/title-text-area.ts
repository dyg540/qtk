
import {Rect} from "../base/rect";
import {Edit} from "../controls/edit";
import {Widget} from "../controls/widget";
import {TitleValue} from "./title-value";
import {WidgetFactory} from "../controls/widget-factory";
import {WidgetRecyclableCreator} from "../controls/widget-recyclable-creator";

/**
 * @class TitleTextArea
 * @extends Widget
 * 带标题的多行编辑器。
 */
export class TitleTextArea extends TitleValue {
    protected _inputTips : string;

	/**
	 * @property {string} inputTips
	 * 输入提示。
	 */
	public set inputTips(value:string) {
		this._inputTips = value;
		if(this._valueWidget) {
			this._valueWidget.set({inputTips:value});
		}
	}
	public get inputTips() : string {
		return this._inputTips;
	}
	
	public relayoutChildren() : Rect {
		this.requestRedraw();
		var titleWidget = this.titleWidget;
		var valueWidget = this.valueWidget;
		var w = this.w - this.leftPadding - this.topPadding;

		if(titleWidget && valueWidget) {
			titleWidget.x = this.leftPadding;
			titleWidget.y = this.topPadding;
			titleWidget.w = w;
			titleWidget.h = 20;

			valueWidget.x = this.leftPadding;
			valueWidget.y = titleWidget.y + titleWidget.h;
			valueWidget.w = w;
		
			this.h = valueWidget.y + valueWidget.h + this.bottomPadding;
		}

		return this.getLayoutRect();
	}

	protected onCreated() {
		super.onCreated();
		this.valueWidget.h = this.h;
	}
	
	constructor(type?:string) {
		super(type || TitleTextArea.TYPE);
	}

	protected createValueWidget(options?:any) : Widget {
		var opts = options || {};
		if(this._inputTips) {
			opts.inputTips = this._inputTips;
		}

		opts.multiLineMode = true;
		return Edit.create(opts);
	}

	public static TYPE = "title-text-area";
	private static recycleBin = WidgetRecyclableCreator.create(TitleTextArea);
	public static create(options?:any) : TitleTextArea {
		return <TitleTextArea>TitleTextArea.recycleBin.create(options);
	}
};

WidgetFactory.register(TitleTextArea.TYPE, TitleTextArea.create);
