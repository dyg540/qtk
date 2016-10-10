
import {Rect} from "../rect";
import {TitleEdit} from "./title-edit";
import {TitleValue} from "./title-value";
import {TitleLabel} from "./title-label";
import {TitleRange} from "./title-range";
import {TitleVector} from "./title-vector";
import {Widget} from "../controls/widget";
import {TitleSlider} from "./title-slider";
import {ComboBox} from "../controls/combo-box";
import {TitleTextArea} from "./title-text-area";
import {PropsDesc, PropDesc, NumberPropDesc, TextPropDesc, ReadonlyTextPropDesc} from "./props-desc";
import {RangePropDesc, Vector2PropDesc, Vector3PropDesc, SliderPropDesc, OptionsPropDesc} from "./props-desc";
import {TitleComboBox, TitleComboBoxEditable} from "./title-combo-box";
import {TitleChoosableEdit} from "./title-choosable-edit";
import {WidgetFactory} from "../controls/widget-factory";
import {RecyclableCreator} from "../recyclable-creator";
import {LinearLayouterParam, LinearLayouter} from '../layouters/linear-layouter';

/**
 * 属性编辑页，包装了各种TitleValue。
 */
export class PropertyPage extends Widget {
	protected _itemH : number;
	protected _titleW : string;
	protected _valueW : string;

	public set itemH(value:number) {
		this._itemH = value;
	}
	public get itemH():number{
		return this._itemH;
	}
	public set titleW(value:string) {
		this._titleW = value;
	}
	public get titleW():string{
		return this._titleW;
	}
	
	public set valueW(value:string) {
		this._valueW = value;
	}
	public get valueW():string{
		return this._valueW;
	}
	
	public addLabel(title:string, value?:string) : TitleLabel {
		var itemH = this.itemH;
		var widget = TitleLabel.create({
				name:title,
				title:title,
				titleW:this.titleW,
				valueW:this.valueW,
				layoutParam : LinearLayouterParam.create({h:itemH})
			});

		widget.value = value,
		this.addChild(widget, true);

		return widget;
	}
	
	public addRange(title:string, firstValue?:number, secondValue?:number) : TitleRange{
		var itemH = this.itemH;
		var widget = TitleRange.create({
				name:title,
				title:title,
				titleW:this.titleW,
				valueW:this.valueW,
				layoutParam : LinearLayouterParam.create({h:itemH})
			});
		widget.value = {first:firstValue, second:secondValue};
		this.addChild(widget, true);

		return widget;
	}
	
	public addVector2(title:string, x?:number, y?:number) : TitleVector {
		var itemH = this.itemH;
		var widget = TitleVector.create({
				d:2,
				name:title,
				title:title,
				titleW:this.titleW,
				valueW:this.valueW,
				layoutParam : LinearLayouterParam.create({h:itemH})
			});
		widget.value = {x:x, y:y};
		this.addChild(widget, true);

		return widget;
	}
	
	public addVector3(title:string, x?:number, y?:number, z?:number) : TitleVector {
		var itemH = this.itemH;
		var widget = TitleVector.create({
				d:3,
				name:title,
				title:title,
				titleW:this.titleW,
				valueW:this.valueW,
				layoutParam : LinearLayouterParam.create({h:itemH})
			});
		widget.value = {x:x, y:y, z:z};
		this.addChild(widget, true);

		return widget;
	}
	

	public addEdit(title:string, value?:string, inputTips?:string, 
				   inputType?:string, inputFilter?:Function) : TitleEdit {
		var itemH = this.itemH;
		var valueW = inputType === "number" ? "50%" : this.valueW;

		var widget = TitleEdit.create({
				name:title,
				title:title,
				valueW:valueW,
				titleW:this.titleW,
				inputType:inputType,
				inputTips:inputTips,
				inputFilter:inputFilter,
				layoutParam : LinearLayouterParam.create({h:itemH})
			});
		
		widget.value = value,
		this.addChild(widget, true);

		return widget;
	}

	public addChoosableEdit(title:string, value?:string, inputTips?:string) : TitleChoosableEdit {
		var itemH = this.itemH;
		var widget = TitleChoosableEdit.create({
				name:title,
				title:title,
				inputTips:inputTips,
				titleW:this.titleW,
				valueW:this.valueW,
				layoutParam : LinearLayouterParam.create({h:itemH})
			});
		widget.value = value,
		this.addChild(widget, true);

		return widget;
	}
	
	public addComboBox(title:string, value?:string) : TitleComboBox {
		var itemH = this.itemH;
		var widget = TitleComboBox.create({
				name:title,
				title:title,
				titleW:this.titleW,
				valueW:this.valueW,
				layoutParam : LinearLayouterParam.create({h:itemH})
			});
		widget.value = value,
		this.addChild(widget, true);

		return widget;
	}
	
	public addComboBoxEditable(title:string, value?:string) : TitleComboBoxEditable {
		var itemH = this.itemH;
		var widget = TitleComboBoxEditable.create({
				name:title,
				title:title,
				value:value,
				titleW:this.titleW,
				valueW:this.valueW,
				layoutParam : LinearLayouterParam.create({h:itemH})
			});
		widget.value = value,
		this.addChild(widget, true);

		return widget;
	}
	
	public addSlider(title:string, value?:string) : TitleSlider{
		var itemH = this.itemH;
		var widget = TitleSlider.create({
				name:title,
				title:title,
				titleW:this.titleW,
				valueW:this.valueW,
				layoutParam : LinearLayouterParam.create({h:itemH})
			});
		widget.value = value,
		this.addChild(widget, true);

		return widget;
	}
	
	public addTextArea(title:string, value?:string, h?:number) : TitleTextArea {
		var itemH = h || (this.itemH * 4);
		var widget = TitleTextArea.create({
				name:title,
				title:title,
				titleW:this.titleW,
				valueW:this.valueW,
				layoutParam : LinearLayouterParam.create({h:itemH})
			});
		widget.value = value,
		this.addChild(widget, true);
		
		return widget;
	}

	public findByTitle(title:string) : Widget {
		return this.findChildByName(title);
	}

	protected onReset() {
		super.onReset();
		this.childrenLayouter = LinearLayouter.createV({spacing:5});
	}

	protected initWithPropDesc(item:PropDesc) {
		var titleValue:TitleValue = null;

		if(item.type === NumberPropDesc.TYPE) {
			titleValue = this.addEdit(item.name, item.value, item.desc, "number");
		}else if(item.type === TextPropDesc.TYPE) {
			titleValue = this.addEdit(item.name, item.value, item.desc, "text");
		}else if(item.type === ReadonlyTextPropDesc.TYPE) {
			titleValue = this.addLabel(item.name, item.value);
		}else if(item.type === SliderPropDesc.TYPE) {
			titleValue = this.addSlider(item.name, item.value);
		}else if(item.type === RangePropDesc.TYPE) {
			var value = item.value || {first:0, second:0};
			titleValue = this.addRange(item.name, value.first, value.second);
		}else if(item.type === Vector2PropDesc.TYPE) {
			var value = item.value || {x:0, y:0};
			titleValue = this.addVector2(item.name, value.x, value.y);
		}else if(item.type === OptionsPropDesc.TYPE) {
			var value = item.value || {x:0, y:0};
			var propDesc = <OptionsPropDesc>item;
			titleValue = this.addComboBox(item.name, value);
			if(propDesc.options) {
				var comboBox = <ComboBox>titleValue.valueWidget;
				comboBox.optionsJson = propDesc.options;
			}
		}else if(item.type === Vector3PropDesc.TYPE) {
			var value = item.value || {x:0, y:0, z:0};
			titleValue = this.addVector3(item.name, value.x, value.y, value.z);
		}

		if(titleValue && item.path) {
			var valueWidget = titleValue.valueWidget;
			var bindRule = {
				value:{
					path:item.path, 
					converter:item.converter, 
					validationRule:item.validationRule
				}
			};
			valueWidget.dataBindingRule = bindRule;
		}
	}

	public initWithPropsDesc(json:any) {
		var propsDesc = PropsDesc.create(json);
		propsDesc.forEach((item:PropDesc) => {
			this.initWithPropDesc(item);
		});
	}

	constructor() {
		super(PropertyPage.TYPE);
	}
	
	protected static defProps = Object.assign({}, Widget.defProps, {_itemH:30, _titleW:"60px", _valueW:"100%"});
	protected getDefProps() : any {
		return PropertyPage.defProps;
	}

	public static TYPE = "property-page";
	private static rBin = new RecyclableCreator<PropertyPage>(function() {return new PropertyPage()});
	public static create(options?:any) : PropertyPage {
		return <PropertyPage>PropertyPage.rBin.create().reset(PropertyPage.TYPE, options);
	}
};

WidgetFactory.register(PropertyPage.TYPE, PropertyPage.create);
