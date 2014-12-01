/*global jQuery, window*/

(function (win, $) {
    'use strict';

    var $win = $(window),
        containers = [],
        createContainer,
        createElement,
        getHighest,
        syncHeight;

    $win.on('resize load', function () {
        $.each(containers, function (i, container) {
            container.rearrange();
        });
    });

    /**
     * @param {jQuery} $el
     * @returns {{getHeight: Function, setHeight: Function, getTop: Function}}
     */
    createElement = function ($el) {
        var style = $el.get(0).style;

        return {
            getHeight: function () {
                var height = style.height,
                    realHeight;

                style.height = 'auto';
                realHeight = $el.outerHeight();
                style.height = height;

                return realHeight;
            },

            setHeight: function (height) {
                $el.height(height);
            },

            getTop: function () {
                return $el.offset().top;
            }
        };
    };

    /**
     * @param {Array} elements
     * @returns {Number}
     */
    getHighest = function (elements) {
        var highest = 0;

        $.each(elements, function (i, element) {
            highest = Math.max(element.getHeight(), highest);
        });

        return highest;
    };

    /**
     * @param {Array} elements
     */
    syncHeight = function (elements) {
        var height = getHighest(elements);

        $.each(elements, function (i, element) {
            element.setHeight(height);
        });
    };

    /**
     * @param {jQuery} $elements
     * @returns {{rearrange: Function}}
     */
    createContainer = function ($elements) {
        var elements = $.map($elements, function (el) {
                return createElement($(el));
            }),
            container;

        container = {
            rearrange: function () {
                var top = null,
                    row = [];

                $.each(elements, function (i, element) {
                    if (element.getTop() !== top) {
                        syncHeight(row);

                        top = element.getTop();
                        row = [];
                    }

                    row.push(element);
                });

                syncHeight(row);
            }
        };

        container.rearrange();

        return container;
    };

    /**
     * @param {string} elements
     * @returns {jQuery}
     */
    $.fn.syncHeight = function (elements) {
        return this.each(function () {
            containers.push(createContainer($(elements)));
        });
    };
}(window, jQuery));