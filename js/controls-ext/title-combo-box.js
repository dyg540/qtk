"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var title_value_1 = require("./title-value");
var widget_factory_1 = require("../controls/widget-factory");
var widget_recyclable_creator_1 = require("../controls/widget-recyclable-creator");
var combo_box_1 = require("../controls/combo-box");
var TitleComboBoxBase = (function (_super) {
    __extends(TitleComboBoxBase, _super);
    function TitleComboBoxBase(type) {
        _super.call(this, type);
    }
    Object.defineProperty(TitleComboBoxBase.prototype, "itemH", {
        get: function () {
            var comboBox = this._valueWidget;
            return comboBox.itemH;
        },
        set: function (value) {
            var comboBox = this._valueWidget;
            comboBox.itemH = value;
        },
        enumerable: true,
        configurable: true
    });
    TitleComboBoxBase.prototype.resetOptions = function () {
        var comboBox = this._valueWidget;
        comboBox.resetOptions();
        return this;
    };
    TitleComboBoxBase.prototype.addOption = function (text, value, imageURL, color) {
        var comboBox = this._valueWidget;
        comboBox.addOption(text, value, imageURL, color);
        return this;
    };
    return TitleComboBoxBase;
}(title_value_1.TitleValue));
exports.TitleComboBoxBase = TitleComboBoxBase;
/**
 * @class TitleComboBox
 * @extends Widget
 * 带标题的下拉框。
 */
var TitleComboBox = (function (_super) {
    __extends(TitleComboBox, _super);
    function TitleComboBox(type) {
        _super.call(this, type || TitleComboBox.TYPE);
    }
    TitleComboBox.prototype.createValueWidget = function (options) {
        return combo_box_1.ComboBox.create(options);
    };
    TitleComboBox.create = function (options) {
        return TitleComboBox.recycleBin.create(options);
    };
    TitleComboBox.TYPE = "title-combo-box";
    TitleComboBox.recycleBin = widget_recyclable_creator_1.WidgetRecyclableCreator.create(TitleComboBox);
    return TitleComboBox;
}(TitleComboBoxBase));
exports.TitleComboBox = TitleComboBox;
;
widget_factory_1.WidgetFactory.register(TitleComboBox.TYPE, TitleComboBox.create);
/**
 * @class TitleComboBoxEditable
 * @extends Widget
 * 带标题的可编辑的下拉框。
 */
var TitleComboBoxEditable = (function (_super) {
    __extends(TitleComboBoxEditable, _super);
    function TitleComboBoxEditable(type) {
        _super.call(this, type || TitleComboBoxEditable.TYPE);
    }
    TitleComboBoxEditable.prototype.createValueWidget = function (options) {
        return combo_box_1.ComboBoxEditable.create(options);
    };
    TitleComboBoxEditable.create = function (options) {
        return TitleComboBoxEditable.recycleBin.create(options);
    };
    TitleComboBoxEditable.TYPE = "title-combo-box-editable";
    TitleComboBoxEditable.recycleBin = widget_recyclable_creator_1.WidgetRecyclableCreator.create(TitleComboBoxEditable);
    return TitleComboBoxEditable;
}(TitleComboBoxBase));
exports.TitleComboBoxEditable = TitleComboBoxEditable;
;
widget_factory_1.WidgetFactory.register(TitleComboBoxEditable.TYPE, TitleComboBoxEditable.create);
