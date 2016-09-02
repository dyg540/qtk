import {Widget} from "./widget";

/**
 * 子控件布局算法。
 */
export class Layouter {
	/**
	 * 布局算法的名称。
	 */
	public get type() : string {
		return "dummy";
	}
	
	/**
	 * 转换成JSON数据。
	 */
	public toJson() : any {
		return {type: this.type};
	}

	/**
	 * 从JSON数据创建。
	 */
	public fromJson(json:any) {
		return;
	}

	/**
	 * 设置参数。
	 */
	public setOptions(options:any) : any {
		return this;
	}

	/**
	 * 对子控件进行布局。
	 */
	public layoutChildren(widget:Widget, children:Array<Widget>) {
	}

}

/**
 * Layouter的工厂。
 */
export class LayouterFactory {
	private static creators = {};
	
	public static register(type:string, creator:Function) {
		LayouterFactory.creators[type] = creator;
	}

	public static create(type:string, options:any) : Layouter {
		var create = LayouterFactory.creators[type];
		if(create) {
			return <Layouter>create(options);
		}else{
			return null;
		}
	}

	public static createFromJson(json:any) {
		var layouter = <Layouter>LayouterFactory.create(json.type, null);

		layouter.fromJson(json);

		return layouter;
	}
}

