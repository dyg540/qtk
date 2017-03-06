"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var window_1 = require("./window");
var window_manager_1 = require("./window-manager");
var widget_factory_1 = require("./widget-factory");
var widget_recyclable_creator_1 = require("./widget-recyclable-creator");
/**
 * 桌面应用程序的窗口管理器。
 */
var WindowManagerDesktop = (function (_super) {
    __extends(WindowManagerDesktop, _super);
    function WindowManagerDesktop() {
        return _super.call(this, WindowManagerDesktop.TYPE) || this;
    }
    WindowManagerDesktop.prototype.createCanvas = function () {
        return this;
    };
    WindowManagerDesktop.prototype.onWindowCreated = function (evt) {
        var win = evt.widget;
        win.hasOwnCanvas = true;
        if (win.windowType === window_1.WindowType.NORMAL && !win.w && !win.h) {
            win.moveResizeTo(0, 0, this.w, this.h);
        }
    };
    WindowManagerDesktop.create = function (options) {
        return WindowManagerDesktop.recycleBin.create(options);
    };
    return WindowManagerDesktop;
}(window_manager_1.WindowManager));
WindowManagerDesktop.TYPE = "window-manager-desktop";
WindowManagerDesktop.recycleBin = widget_recyclable_creator_1.WidgetRecyclableCreator.create(WindowManagerDesktop);
exports.WindowManagerDesktop = WindowManagerDesktop;
;
widget_factory_1.WidgetFactory.register(WindowManagerDesktop.TYPE, WindowManagerDesktop.create);
