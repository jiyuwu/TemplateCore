/**
 * Ruler用来生成标尺
 * 依赖的文件包含 jquery，jquery.event.drag和jquery.event.drop
 */
var Ruler = (function () {

    var Utils = {

        isDefinedAndNotNull: function (arg) {
            return arg !== undefined && arg !== null
        },

        isDefined: function (arg) {
            return arg !== undefined;
        }
    };

    var TipPanel = (function ($) {

        function TipPanel() {
            this.positionPadding = {
                left: 20,
                top: 5
            }
        }

        TipPanel.prototype.render = function (container) {
            this._topElement = $("<div class='ui_tip_panel'></div>").appendTo(container);
        };

        TipPanel.prototype.setHtml = function (html) {
            var element = this._topElement;
            if (element) {
                element.html(html);
            }
        };

        /**
         * 更新位置信息
         * @param position {Object}
         *   @param left {number} [position.left]
         *   @param top {number} [position.top]
         */
        TipPanel.prototype.updatePosition = function (position) {
            if (Utils.isDefinedAndNotNull(position.left)) {
                this._applyLeft(position.left + this.positionPadding.left);
            }
            if (Utils.isDefinedAndNotNull(position.top)) {
                this._applyTop(position.top + this.positionPadding.top);
            }
        };

        TipPanel.prototype._applyLeft = function (left) {
            if (this._topElement) {
                if (Utils.isDefined(left)) {
                    this._topElement.css("left", left);
                }
            }
        };

        TipPanel.prototype._applyTop = function (top) {
            if (this._topElement) {
                if (Utils.isDefined(top)) {
                    this._topElement.css("top", top);
                }
            }
        };

        TipPanel.prototype.destroy = function () {
            var element = this._topElement;
            if (element) {
                element.remove();
            }
        };

        return TipPanel;

    })(jQuery);

    var Ruler = (function ($) {

        function Ruler() {
            this.rulerPadding = 18;
            this.scrollWidth = 50;
        }

        Ruler.prototype.wrap = function (elementId) {
            var wrappedElement = this._wrappedElement = $("#" + elementId);
            wrappedElement.addClass("ruler_panel");

            var topElement = this._topElement = wrappedElement.parent();
            topElement.addClass("ui_ruler");

            this._wrapRulerPanel(topElement, wrappedElement);
            this._renderCorner(topElement);
            this._renderHRuler(topElement, wrappedElement);
            this._renderVRuler(topElement, wrappedElement);
            this._initEvent();

        };

        Ruler.prototype._wrapRulerPanel = function(topElement, wrappedElement){
            wrappedElement.wrap("<div class='ruler_panel_container'></div>");
            var panelContainer = wrappedElement.parent();

            panelContainer.width(topElement.width() - this.rulerPadding);
            panelContainer.height(topElement.height() - this.rulerPadding);
        };

        Ruler.prototype._renderCorner = function(topElement){
            topElement.prepend("<div class='ruler_corner'></div>");
        };

        Ruler.prototype._renderHRuler = function (topElement, wrappedElement) {

            // ruler_line_area是一个标识性样式，在拖放线条时使用。
            topElement.prepend("<div class='ruler_h_container ruler_line_area'><div class='ruler_h'></div></div>");

            var hRuler = $(".ruler_h", topElement);
            hRuler.width(wrappedElement.width() + this.scrollWidth);

            var hRulerContainer = hRuler.parent();
            hRulerContainer.width(topElement.width());

            //创建水平标尺数值
            for (var i = 0; i < hRuler.width(); i += 1) {
                if (i % 50 === 0) {
                    $('<span class="ruler_h_number">' + i + '</span>').css("left", i + 2).appendTo(hRuler);
                }
            }

            var thisRuler = this;

            hRulerContainer.drag("start", function (ev, dd) {

                dd.tipPanel = thisRuler._createTipPanel();

                /* ruler_drag_hline是标识性样式 */
                return $('<div class="ruler_drag_hline" />')
                    .appendTo(wrappedElement).width(wrappedElement.width());
            })
                .drag(function (ev, dd) {
                    $(dd.proxy).offset({
                        top: ev.pageY,
                        left: 0
                    });

                    dd.tipPanel.setHtml("y:" + parseInt(ev.pageY - wrappedElement.offset().top + 1));
                    dd.tipPanel.updatePosition({
                        left: ev.pageX,
                        top: ev.pageY
                    });
                })
                .drag("end", function (ev, dd) {
                    $(dd.proxy).remove();
                    dd.tipPanel.destroy();
                });

        };

        Ruler.prototype._renderVRuler = function (topElement, wrappedElement) {

            // ruler_line_area是一个标识性样式，在拖放线条时使用。
            topElement.prepend("<div class='ruler_v_container ruler_line_area'><div class='ruler_v'></div></div>");

            //创建垂直标尺数值
            var vRuler = $(".ruler_v", topElement);
            vRuler.height(wrappedElement.height() + this.scrollWidth);

            var vRulerContainer = vRuler.parent();
            vRulerContainer.height(topElement.height());

            for (var i = 0; i < vRuler.height(); i += 1) {
                if (i % 50 === 0) {
                    $('<span class="ruler_v_number">' + i + '</span>').css("top", i + 2).appendTo(vRuler);
                }
            }

            var thisRuler = this;
            vRulerContainer.drag("start", function (ev, dd) {
                dd.tipPanel = thisRuler._createTipPanel();

                /* ruler_drag_vline是标识性样式 */
                return $('<div class="ruler_drag_vline" />')
                    .appendTo(wrappedElement).height(wrappedElement.height());
            })
                .drag(function (ev, dd) {

                    dd.tipPanel.setHtml("x:" + parseInt(ev.pageX - wrappedElement.offset().left + 1));
                    dd.tipPanel.updatePosition({
                        left: ev.pageX,
                        top: ev.pageY
                    });

                    $(dd.proxy).offset({
                        left: ev.pageX,
                        top: 0
                    });
                })
                .drag("end", function (ev, dd) {
                    $(dd.proxy).remove();
                    dd.tipPanel.destroy();
                });
        };

        Ruler.prototype._createTipPanel = function () {
            var tipPanel = new TipPanel();
            tipPanel.render($('body'));
            return tipPanel;
        };

        Ruler.prototype._initEvent = function(){
            var topElement = this._topElement;

            var vRuler = $(".ruler_v", topElement);
            var hRuler = $(".ruler_h", topElement);

            var panelContainer = $(".ruler_panel_container", topElement);
            panelContainer.scroll(function () {
                vRuler.css("top", 0 - panelContainer.scrollTop());
                hRuler.css("left", 0 - panelContainer.scrollLeft());
            });

            var thisRuler = this;

            var wrappedElement = this._wrappedElement;
            wrappedElement.drop("init",function (ev, dd) {
                var dragElement = $(dd.drag);
                return dragElement.hasClass("ruler_line_area");
            }).drop(function (ev, dd) {
                    var dragElement = $(dd.drag);
                    var proxyElement = $(dd.proxy);
                    if (dragElement.hasClass("ruler_line_area")) {
                        if (proxyElement.hasClass("ruler_drag_hline")) {
                            thisRuler._createHRulerLine({
                                left: ev.pageX,
                                top: ev.pageY
                            });
                        } else if (proxyElement.hasClass("ruler_drag_vline")) {
                            thisRuler._createVRulerLine({
                                left: ev.pageX,
                                top: ev.pageY
                            });
                        }
                    }
                });

        };

       /**
         * 在标尺可见区域大小变化后，更新其他构件的大小。
         */
        Ruler.prototype.layout = function () {

            var wrappedElement = this._wrappedElement;
            var topElement = this._topElement;

            // 更新容器面板大小
            var panelContainer = $(".ruler_panel_container", topElement);
            panelContainer.width(topElement.width() - this.rulerPadding);
            panelContainer.height(topElement.height() - this.rulerPadding);

            // 更新水平标尺大小
            var hRuler = $(".ruler_h", topElement);
            var hRulerContainer = hRuler.parent();
            hRuler.width(wrappedElement.width() + this.scrollWidth);
            hRulerContainer.width(topElement.width());

            // 更新垂直标尺大小
            var vRuler = $(".ruler_v", topElement);
            var vRulerContainer = vRuler.parent();
            vRuler.height(wrappedElement.height() + this.scrollWidth);
            vRulerContainer.height(topElement.height());

        };

        Ruler.prototype._createHRulerLine = function (offset) {
            var thisRuler = this;

            var lineContainer = this._wrappedElement;
            $("<div class='ruler_drag_hline'></div>").appendTo(lineContainer).offset({
                top: offset.top
            }).width(lineContainer.width()).drag("start",function (ev, dd) {
                    dd.tipPanel = thisRuler._createTipPanel();
                }).drag(function (ev, dd) {
                    $(dd.drag).offset({
                        top: ev.pageY
                    });

                    dd.tipPanel.setHtml("y:" + parseInt(ev.pageY - lineContainer.offset().top + 1));
                    dd.tipPanel.updatePosition({
                        left: ev.pageX,
                        top: ev.pageY
                    });

                }).drag("end", function (ev, dd) {
                    if (ev.pageY < lineContainer.offset().top) {
                        $(dd.drag).remove();
                    }

                    dd.tipPanel.destroy();
                });
        };

        Ruler.prototype._createVRulerLine = function (offset) {
            var thisRuler = this;
            var lineContainer = this._wrappedElement;
            $("<div class='ruler_drag_vline'></div>").appendTo(lineContainer).offset({
                left: offset.left
            }).height(lineContainer.height()).drag("start",function (ev, dd) {
                    dd.tipPanel = thisRuler._createTipPanel();
                }).drag(function (ev, dd) {
                    $(dd.drag).offset({
                        left: ev.pageX
                    });

                    dd.tipPanel.setHtml("x:" + parseInt(ev.pageX - lineContainer.offset().left + 1));
                    dd.tipPanel.updatePosition({
                        left: ev.pageX,
                        top: ev.pageY
                    });
                }).drag("end", function (ev, dd) {
                    if (ev.pageX < lineContainer.offset().left) {
                        $(dd.drag).remove();
                    }

                    dd.tipPanel.destroy();
                });
        };

        return Ruler;
    })(jQuery);

    return Ruler;

})();
