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
var edit_1 = require("../controls/edit");
var button_1 = require("../controls/button");
var widget_1 = require("../controls/widget");
var Events = require("../events");
var widget_factory_1 = require("../controls/widget-factory");
var widget_recyclable_creator_1 = require("../controls/widget-recyclable-creator");
/**
 * @class ChoosableEdit
 * @extends Widget
 * 编辑器+选择按钮。
 */
var ChoosableEdit = (function (_super) {
    __extends(ChoosableEdit, _super);
    function ChoosableEdit() {
        return _super.call(this, ChoosableEdit.TYPE) || this;
    }
    Object.defineProperty(ChoosableEdit.prototype, "inputTips", {
        get: function () {
            return this._inputTips;
        },
        set: function (value) {
            this._inputTips = value;
            if (this._edit) {
                this._edit.set({ inputTips: value });
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChoosableEdit.prototype, "value", {
        get: function () {
            return this._edit ? this._edit.text : this._value;
        },
        set: function (value) {
            this._value = value;
            if (this._edit) {
                var oldValue = this._edit.text;
                if (oldValue !== value) {
                    this._edit.text = value;
                    this._edit.notifyChangeEx(Events.CHANGE, value, oldValue);
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChoosableEdit.prototype, "dataBindingRule", {
        get: function () {
            return this._edit.dataBindingRule;
        },
        set: function (dataBindingRule) {
            this._edit.dataBindingRule = dataBindingRule;
        },
        enumerable: true,
        configurable: true
    });
    ChoosableEdit.prototype.relayoutChildren = function () {
        this.requestRedraw();
        if (this._edit && this._button) {
            var x = this.leftPadding;
            var y = this.topPadding;
            var h = this.clientH;
            var w = this.clientW - this.h - 6;
            this._edit.moveResizeTo(x, y, w, h, 0);
            w = this.h;
            x = this.w - w - 4;
            this._button.moveResizeTo(x, y, w, h, 0);
        }
        return this.getLayoutRect();
    };
    ChoosableEdit.prototype.dispose = function () {
        this._edit = null;
        this._button = null;
        _super.prototype.dispose.call(this);
    };
    ChoosableEdit.prototype.onReset = function () {
        var _this = this;
        _super.prototype.onReset.call(this);
        this.padding = 0;
        this.onChoose = null;
        this._edit = edit_1.Edit.create();
        this.addChild(this._edit);
        this._edit.on(Events.CHANGE, function (evt) {
            _this.dispatchEvent(evt);
        });
        this._button = button_1.Button.create({ text: "..." });
        this.addChild(this._button);
        this._button.on(Events.CLICK, function (evt) {
            if (_this.onChoose) {
                _this.onChoose();
            }
        });
    };
    ChoosableEdit.create = function (options) {
        return ChoosableEdit.rBin.create(options);
    };
    return ChoosableEdit;
}(widget_1.Widget));
ChoosableEdit.TYPE = "choosable.edit";
ChoosableEdit.rBin = widget_recyclable_creator_1.WidgetRecyclableCreator.create(ChoosableEdit);
exports.ChoosableEdit = ChoosableEdit;
;
widget_factory_1.WidgetFactory.register(ChoosableEdit.TYPE, ChoosableEdit.create);
