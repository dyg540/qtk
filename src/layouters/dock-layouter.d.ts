import { Rect } from '../rect';
import { Direction } from '../consts';
import { Widget } from '../controls/widget';
import { Layouter } from './layouter';
/**
 * Dock布局器。
 */
export declare class DockLayouter extends Layouter {
    readonly type: string;
    layoutChildren(widget: Widget, children: Array<Widget>, rect: Rect): Rect;
    layoutChild(child: Widget, r: Rect): void;
    createParam(options?: any): DockLayouterParam;
    static create(options?: any): DockLayouter;
}
/**
 * Dock布局器的参数。
 *
 * 如果父控件使用DockLayouter布局器，则子控件需要把layoutParam设置为DockLayouterParam。
 *
 * 对于size参数：
 * *.如果以px结尾，则直接取它的值。
 * *.如果以%结尾，则表示剩余空间的宽度/高度的百分比。
 *
 */
export declare class DockLayouterParam {
    type: string;
    size: string;
    position: Direction;
    constructor(position: Direction, size: string);
    static create(opts: any): DockLayouterParam;
}
