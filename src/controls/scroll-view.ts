/// <reference path="../../typings/globals/scroller/index.d.ts"/>
/// <reference path="../../typings/globals/tween.js/index.d.ts"/>

import {Rect} from "../base/rect";
import {Point} from "../base/point";
import {Style} from "../base/style";
import {Window} from "./window";
import {Scroller} from "scroller";
import TWEEN = require("tween.js");
import Events = require("../base/events");
import {Graphics} from "../base/graphics";
import {WidgetFactory} from "./widget-factory";
import {WidgetRecyclableCreator} from "./widget-recyclable-creator";
import {Widget, WidgetState, HitTestResult} from "./widget";

/**
 * 滚动视图，同时支持PC和Mobile风格，通过dragToScroll和slideToScroll参数控制。
 */
export class ScrollView extends Widget {
	public isScrollView = true;

	/*
	 * 滚动条的透明度。Mobile风格的滚动条，滚动完成时，以动画方式隐藏。
	 */
	protected set scrollBarOpacity(value:number) {
		this._scrollBarOpacity = value;
		this.requestRedraw();
	}
	protected get scrollBarOpacity() : number {
		return this._scrollBarOpacity;
	}

	/**
	 * 启用滚动条拖动来实现滚动。
	 */
	public set dragToScroll(value:boolean) {
		this._dragToScroll = value;
	}
	public get dragToScroll() : boolean {
		return this._dragToScroll;
	}

	/**
	 * 启用手势滑动来实现滚动。
	 */
	public set slideToScroll(value:boolean) {
		this._slideToScroll = value;
	}

	public get slideToScroll() : boolean {
		return this._slideToScroll;
	}

	/**
	 * 滚动条的样式。
	 */
	public set scrollBarStyle(value:ScrollBarStyle) {
		this._scrollBarStyle = value;
	}

	public get scrollBarStyle() : ScrollBarStyle {
		return this._scrollBarStyle;
	}

	/**
	 * 垂直滚动条是否可见。
	 */
	protected isVScrollBarVisible() : boolean {
		var visibility = this.scrollBarStyle.vBarVisibility;
		switch(visibility) {
			case ScrollerBarVisibility.INVISIBLE: {
				return false;
			}
			case ScrollerBarVisibility.ALWAYS : {
				return true;
			}
			default: {
				return (this.h < this.contentH);
			}
		}
	}
	
	/**
	 * 水平滚动条是否可见。
	 */
	protected isHScrollBarVisible() : boolean {
		var visibility = this.scrollBarStyle.hBarVisibility;
		switch(visibility) {
			case ScrollerBarVisibility.INVISIBLE: {
				return false;
			}
			case ScrollerBarVisibility.ALWAYS : {
				return true;
			}
			default: {
				return (this.w < this.contentW);
			}
		}
	}

	/**
	 * 设置水平方向上的偏移，并确保其值的有些性。
	 */
	public set validOffsetX(value:number) {
		this.setProp("ox", this.toValidOffsetX(value), true);
	}
	
	/**
	 * 设置垂直方向上的偏移，并确保其值的有些性。
	 */
	public set validOffsetY(value:number) {
		this.setProp("oy", this.toValidOffsetY(value), true);
	}

	protected toValidOffsetX(value:number) : number {
		return Math.min(Math.max(0, value), Math.max(0, this._cw - this.w));
	}
	protected toValidOffsetY(value:number) : number {
		return Math.min(Math.max(0, value), Math.max(0, this._ch - this.h));
	}

	/**
	 * 水平方向上的偏移。
	 */
	public set offsetX(value:number) {
		this.setProp("ox", value, true);
	}

	public get offsetX() {
		return this._ox;
	}

	/**
	 * 垂直方向上的偏移。
	 */
	public set offsetY(value:number) {
		this.setProp("oy", value, true);
	}
	public get offsetY() {
		return this._oy;
	}

	/**
	 * 滚动视图所包含内容的宽度。
	 */
	public set contentW(value:number) {
		this.setProp("cw", value, true);
	}
	public get contentW() {
		return this._cw;
	}

	/**
	 * 滚动视图所包含内容的高度。
	 */
	public set contentH(value:number) {
		this.setProp("ch", value, true);
	}
	public get contentH() {
		return this._ch;
	}

	protected selfHitTest(x:number, y:number) : HitTestResult {
		return super.selfHitTest(x-this._ox, y-this._oy);
	}

	/*
	 * 在处理指针事件前，先加上滚动的偏移。
	 */
	protected offsetPointerEvent(evt:Events.PointerEvent) {
		evt.localX += this._ox;
		evt.localY += this._oy;
	}
	
	/*
	 * 在处理指针事件后，再减去滚动的偏移。
	 */
	protected unOffsetPointerEvent(evt:Events.PointerEvent) {
		evt.localX -= this._ox;
		evt.localY -= this._oy;
	}

	/*
	 * 把指针事件转换成touch，以便Scroller可以处理。
	 */
	protected pointerEventToTouches(evt:Events.PointerEvent) {
		var touch = this._touches[0];
		touch.id = evt.id;
		touch.pageX = evt.x;
		touch.pageY = evt.y;

		return this._touches;
	}

	/*
	 * 先处理滚动条的事件，再处理Scroller事件，最后发给子控件。
	 */
	public dispatchPointerDown(evt:Events.PointerEvent) {
		this._pointerInBar = false;
		if(this.dragToScroll) {
			this._saveOX = this._ox;
			this._saveOY = this._oy;
			var win = this.win;
			var p = Point.point.init(evt.localX-this.x, evt.localY-this.y);
			if(p.isInRect(this._vScrollBarRect)) {
				if(p.isInRect(this._vScrollDraggerRect)) {
					this._pointerInVScrollDraggerRect = true;
				}else{
					if(p.y < this._vScrollDraggerRect.y) {
						this._pointerInVScrollBarRectUp = true;
					}else {
						this._pointerInVScrollBarRectDown = true;
					}
				}
				this._pointerInBar = true;
			}

			if(p.isInRect(this._hScrollBarRect)) {
				if(p.isInRect(this._hScrollDraggerRect)) {
					this._pointerInHScrollDraggerRect = true;
				}else{
					if(p.x < this._hScrollDraggerRect.x) {
						this._pointerInHScrollBarRectLeft = true;
					}else{
						this._pointerInHScrollBarRectRight = true;
					}
				}
				this._pointerInBar = true;
			}
		}

		if(this.slideToScroll) {
			if(!this._pointerInBar) {
				this._scrollBarOpacity = 1;
				this.scroller.doTouchStart(this.pointerEventToTouches(evt), evt.timeStamp);
			}
		}

		if(!this._pointerInBar) {
			this.offsetPointerEvent(evt);
			super.dispatchPointerDown(evt);
			this.unOffsetPointerEvent(evt);
		}
	}

	public dispatchPointerMove(evt:Events.PointerEvent) {
		if(evt.pointerDown) {
			var offsetX = this.offsetX;
			var offsetY = this.offsetY;

			if(this.dragToScroll) {
				if(this._pointerInVScrollDraggerRect) {
					var dy = evt.y - evt.pointerDownY;
					offsetY = this._saveOY + (dy/this.h)*this._ch;
				}
				if(this._pointerInHScrollDraggerRect) {
					var dx = evt.x - evt.pointerDownX;
					offsetX = this._saveOX + (dx/this.w)*this._cw;
				}

			}

			if(this.slideToScroll) {
				if(!this._pointerInBar) {
					this.scroller.doTouchMove(this.pointerEventToTouches(evt), evt.timeStamp);
				}else{
					this.scroller.scrollTo(this.toValidOffsetX(offsetX), this.toValidOffsetY(offsetY));
				}
			}else{
				this.validOffsetX = offsetX;
				this.validOffsetY = offsetY;
			}
		}

		if(!this._pointerInBar) {
			this.offsetPointerEvent(evt);
			super.dispatchPointerMove(evt);
			this.unOffsetPointerEvent(evt);
		}else{
			this.dispatchEvent(this._scrollEvent.reset(Events.SCROLL, this, this.offsetX, this.offsetY));
		}

		this.requestRedraw();
	}

	public dispatchPointerUp(evt:Events.PointerEvent) {
		if(this.dragToScroll) {
			if(this._pointerInVScrollBarRectUp) {
				this.validOffsetY = this.offsetY - this.h;
			}else if(this._pointerInVScrollBarRectDown) {
				this.validOffsetY = this.offsetY + this.h;
			}else if(this._pointerInHScrollBarRectLeft) {
				this.validOffsetX = this.offsetX - this.w;
			}else if(this._pointerInHScrollBarRectRight) {
				this.validOffsetX = this.offsetX + this.w;
			}
			this._pointerInVScrollBarRectUp    = false;
			this._pointerInVScrollBarRectDown  = false;
			this._pointerInHScrollBarRectLeft  = false;
			this._pointerInHScrollBarRectRight = false;
			this._pointerInVScrollDraggerRect  = false;
			this._pointerInHScrollDraggerRect  = false;
		}

		if(this.slideToScroll) {
			if(!this._pointerInBar) {
				this.scroller.doTouchEnd(evt.timeStamp);
			}else{
				this.scroller.scrollTo(this.offsetX, this.offsetY);
				this.handleScrollDone();
			}
		}

		if(!this._pointerInBar) {
			this.offsetPointerEvent(evt);
			super.dispatchPointerUp(evt);
			this.unOffsetPointerEvent(evt);
		}else{
			this.dispatchEvent(this._scrollEvent.reset(Events.SCROLL, this, this.offsetX, this.offsetY));
		}

		this._pointerInBar = false;
	}

	public dispatchClick(evt:any) {
		if(!this._pointerInBar) {
			this.offsetPointerEvent(evt);
			super.dispatchClick(evt);
			this.unOffsetPointerEvent(evt);
		}
	}

	public dispatchDblClick(evt:any) {
		if(!this._pointerInBar) {
			this.offsetPointerEvent(evt);
			super.dispatchDblClick(evt);
			this.unOffsetPointerEvent(evt);
		}
	}

	/*
	 * 更新Scroller的参数。
	 */
	protected updateScrollerDimensions(w:number, h:number, contentW:number, contentH:number){
		if(this._slideToScroll) {
			this.scroller.setDimensions(w, h, contentW, contentH);
		}
	}

	protected get scroller() : Scroller {
		return this._scroller;
	}

	public hideScrollBar() {
		if(!this.dragToScroll) {
			var tween = new TWEEN.Tween(this);
			tween.to({scrollBarOpacity:0}, 300).start()
			tween.onComplete(function() {
				this.scrollBarOpacity = 0;
			});
			this.requestRedraw();
		}
	}

	protected handleScrolling(left:number, top:number) {
		this.offsetX = left;
		this.offsetY = top;
		this.dispatchEvent(this._scrollEvent.reset(Events.SCROLL, this, left, top));
	}

	protected handleScrollDone() {
		this.hideScrollBar();
		this.dispatchEvent(this._scrollEvent.reset(Events.SCROLL_DONE, this, this.offsetX, this.offsetY));
	}

	protected initScroller(options:any) {
		var me = this;
		options.scrollingComplete = function() {
			me.handleScrollDone();
		}

		this._scroller = new Scroller(function(left:number, top:number){
			me.handleScrolling(left, top);
		}, options);

		this.on(Events.PROP_CHANGE, (evt:Events.PropChangeEvent) => {
			var prop = evt.prop;
			var value = evt.newValue;
			if(prop === "w" || prop === "h" || prop === "cw" || prop === "ch") {
				this.updateScrollerDimensions(this.w, this.h, this.contentW, this.contentH);
			}
		});
		this.updateScrollerDimensions(this.w, this.h, this.contentW, this.contentH);
	}

	/*
	 * 绘制垂直滚动条。
	 */
	protected drawScrollBarV(ctx:any, hBarVisible:boolean){
		var w = this.w;
		var h = this.h;
		var options = this.scrollBarStyle;
		
		var barY = 0;
		var barH = h;
		var barW = options.size;
		var barX = w - barW;
		var barColor = options.backGroundColor;

		var r = options.roundRadius;	
		var draggerW = options.draggerSize;
		var draggerH = Math.max(draggerW, Math.min(h, h*h/this.contentH));
		var draggerX = barX + ((barW - draggerW) >> 1);
		var draggerY = Math.min(h-draggerH, (this.offsetY/this.contentH) * h);
		var draggerColor = options.foreGroundColor;
		if(hBarVisible) {
			draggerY = Math.min(draggerY, h - barW - draggerH);
		}
	
		var win : Window = this.win;
		if(this._pointerInVScrollDraggerRect) {
			draggerColor = options.foreGroundOverColor;
		}
		
		this._vScrollBarRect.init(barX, barY, barW, barH);
		this._vScrollDraggerRect.init(draggerX, draggerY, draggerW, draggerH);

		Graphics.drawRect(ctx, barColor, null, 0, barX, barY, barW, barH);
		Graphics.drawRoundRect(ctx, draggerColor, null, 0, draggerX, draggerY, draggerW, draggerH, r);
		var lineColor = options.lineColor;
		var lineWidth = options.lineWidth;
		Graphics.drawLine(ctx, lineColor, lineWidth, barX, barY, barX, hBarVisible ? barH-barW : barH);		
	}

	/*
	 * 绘制水平滚动条。
	 */
	protected drawScrollBarH(ctx:any, vBarVisible){
		var w = this.w;
		var h = this.h;
		var options = this.scrollBarStyle;
		var barX = 0;
		var barW = w;
		var barH = options.size;
		var barY = h - barH;
		var barColor = options.backGroundColor;

		var r = options.roundRadius;	
		var draggerH = options.draggerSize;
		var draggerW = Math.max(draggerH, Math.min(w, w*w/this.contentW));
		var draggerY = barY + ((barH - draggerH) >> 1);
		var draggerX = Math.min(w-draggerW, (this.offsetX/this.contentW) * w);
		var draggerColor = options.foreGroundColor;

		if(vBarVisible) {
			draggerX = Math.min(draggerX, w - barH - draggerW);
		}

		var win : Window = this.win;
		if(this._pointerInHScrollDraggerRect) {
			draggerColor = options.foreGroundOverColor;
		}

		this._hScrollBarRect.init(barX, barY, barW, barH);
		this._hScrollDraggerRect.init(draggerX, draggerY, draggerW, draggerH);

		Graphics.drawRect(ctx, barColor, null, 0, barX, barY, barW, barH);
		Graphics.drawRoundRect(ctx, draggerColor, null, 0, draggerX, draggerY, draggerW, draggerH, r);

		var lineColor = options.lineColor;
		var lineWidth = options.lineWidth;
		Graphics.drawLine(ctx, lineColor, lineWidth, barX, barY, vBarVisible ? barW-barH : barW, barY);		
	}

	/*
	 * 绘制滚动条。
	 */
	protected drawScrollBar(ctx:any){
		var hBarVisible = this.isHScrollBarVisible();
		var vBarVisible = this.isVScrollBarVisible();

		if(this._scrollBarOpacity > 0) {
			var opacity = ctx.globalAlpha;
			ctx.globalAlpha = this._scrollBarOpacity;
			if(vBarVisible) {
				this.drawScrollBarV(ctx, hBarVisible);
			}

			if(hBarVisible) {
				this.drawScrollBarH(ctx, vBarVisible);
			}
			ctx.globalAlpha = opacity;
		}
	}

	/*
	 * 绘制子控件。
	 */
	protected doDrawChildren(ctx:any) {
		super.drawChildren(ctx);
	}

	protected beforeDrawChildren(ctx:any) {
	}

	protected afterDrawChildren(ctx:any) {
	}

	protected drawChildren(ctx:any) : Widget {
		var ox = this._ox;
		var oy = this._oy;
		var x = this.leftPadding;
		var y = this.topPadding;
		var w = this.w - x - this.rightPadding;
		var h = this.h - y - this.bottomPadding;
		
		ctx.save();
		ctx.beginPath();
		ctx.rect(x, y, w, h);
		ctx.clip();
	
		this.beforeDrawChildren(ctx);
		ctx.translate(-ox, -oy);
		this.doDrawChildren(ctx);
		ctx.restore();
		this.afterDrawChildren(ctx);

		this.drawScrollBar(ctx);

		return this;
	}

	/**
	 * 滚动到指定的位置。
	 */
	public scrollTo(offsetX:number, offsetY:number, duration:number) : TWEEN.Tween {
		if(duration > 0) {
			var tween = new TWEEN.Tween(this);
			tween.to({ offsetX : offsetX, offsetY : offsetY}, duration).start();

			return tween;
		}else{
			this.offsetX = offsetX;
			this.offsetY = offsetY; 
			return null;
		}
	}

	public onWheel(evt:Events.WheelEvent) {
		this.validOffsetY = this.offsetY - evt.delta/10;
		
		if(this.slideToScroll) {
			this.scroller.scrollTo(this.offsetX, this.offsetY);
			this.handleScrollDone();
		}else{
			this.dispatchEvent(this._scrollEvent.reset(Events.SCROLL, this, this.offsetX, this.offsetY));
		}
	}

	public get scrollerOptions() : ScrollerOptions {
		return this._scrollerOptions;
	}

	protected getLayoutWidth() : number {
		return this.w - this.leftPadding - this.rightPadding;
	}

	protected getLayoutHeight() : number {
		return this.h - this.topPadding - this.bottomPadding;
	}

	protected getViewWidth() : number {
		var w = this.clientW;
		if(this.dragToScroll && this.isVScrollBarVisible()) {
			w -= this._scrollBarStyle.size;
		}
		return w;
	}
	
	protected getViewHeight() : number {
		var h = this.clientH;
		if(this.dragToScroll && this.isHScrollBarVisible()) {
			h -= this._scrollBarStyle.size;
		}

		return h;
	}


	protected getLayoutRect() : Rect {
		var w = this.getLayoutWidth();
		var h = this.getLayoutHeight();
		
		if(this.dragToScroll) {
			if(this.isVScrollBarVisible()) {
				w -= this._scrollBarStyle.size;
			}
			if(this.isHScrollBarVisible()) {
				h -= this._scrollBarStyle.size;
			}
		}

		return this.layoutRect.init(this.leftPadding, this.topPadding, w, h);
	}

	protected onInit() {
		super.onInit();
		this.initScroller(this._scrollerOptions);
		this._scrollBarOpacity = this.dragToScroll ? 1 : 0;
	}

	protected onReset() {
		super.onReset();
		this._ox = 0;
		this._oy = 0;
		this._cw = 0;
		this._ch = 0;
		this._scrollerOptions = {
				scrollingX:true, 
				scrollingY:true,
				decelerationRate:0.95, 
				penetrationAcceleration:0.08
		};
	
		this._scroller = null;
		this._scrollBarStyle = new ScrollBarStyle();
		this._touches = [{pageX:0, pageY:0, id:0}];
		this._hScrollBarRect = Rect.create(0, 0, 0, 0);
		this._vScrollBarRect = Rect.create(0, 0, 0, 0);
		this._hScrollDraggerRect = Rect.create(0, 0, 0, 0);
		this._vScrollDraggerRect = Rect.create(0, 0, 0, 0);
		
		this.on(Events.WHEEL, evt => {
			this.onWheel(evt);
		});
	
		this._scrollEvent = Events.ScrollEvent.create();
	}

	protected _ox : number;
	protected _oy : number;
	protected _cw : number;
	protected _ch : number;
	protected _touches : any;
	protected _saveOX : number;
	protected _saveOY : number;
	protected _scroller : Scroller;
	protected _vScrollBarRect : Rect;
	protected _hScrollBarRect : Rect;
	protected _vScrollDraggerRect : Rect;
	protected _hScrollDraggerRect : Rect;
	
	protected _dragToScroll : boolean;
	protected _slideToScroll : boolean;
	protected _scrollBarOpacity : number;
	protected _scrollerOptions : any;
	protected _scrollBarStyle : ScrollBarStyle;
	
	protected _pointerInBar : boolean;
	protected _pointerInVScrollBarRectUp : boolean;
	protected _pointerInVScrollBarRectDown : boolean;
	protected _pointerInHScrollBarRectLeft : boolean;
	protected _pointerInHScrollBarRectRight : boolean;
	protected _pointerInVScrollDraggerRect : boolean;
	protected _pointerInHScrollDraggerRect : boolean;

	protected _scrollEvent : Events.ScrollEvent;

	constructor(type?:string) {
		super(type ? type : ScrollView.TYPE);
	}
	
	protected static defProps = Object.assign({}, Widget.defProps, {_lp:2, _tp:2, _rp:2, _bp:2});
	protected getDefProps() : any {
		return ScrollView.defProps;
	}

	public static TYPE = "scroll-view";
	private static recycleBin = WidgetRecyclableCreator.create(ScrollView);
	public static create(options?:any) : ScrollView{
		return <ScrollView>ScrollView.recycleBin.create(options);
	}
};

export enum ScrollerBarVisibility {
	INVISIBLE,
	AUTO,
	ALWAYS
};

export interface ScrollerOptions {
    scrollingX?: boolean;
    scrollingY?: boolean;
    animating?: boolean;
    animationDuration?: number;
    bouncing?: boolean;
    locking?: boolean;
    paging?: boolean;
    snapping?: boolean;
    zooming?: boolean;
    minZoom?: number;
    maxZoom?: number;
    speedMultiplier?: number;
}

export class ScrollBarStyle {
	public size : number;
	public roundRadius : number;
	public draggerSize : number;
	public backGroundColor : string;
	public foreGroundColor : string;
	public foreGroundOverColor : string;
	public lineColor : string;
	public lineWidth : number;
	public hBarVisibility : ScrollerBarVisibility;
	public vBarVisibility : ScrollerBarVisibility;
	
	constructor() {
		this.size = 12;
		this.draggerSize = 8;
		this.roundRadius = 4;
		this.lineColor = "#E7E7E7";
		this.lineColor = "#E0E0E0";
		this.lineWidth = 0.5;
		this.backGroundColor = "#FAFAFA";
		this.foreGroundColor = "#c1c1c1";
		this.foreGroundOverColor = "#818181";
		this.hBarVisibility = ScrollerBarVisibility.AUTO; 
		this.vBarVisibility = ScrollerBarVisibility.AUTO; 
	}
};

WidgetFactory.register(ScrollView.TYPE, ScrollView.create);

