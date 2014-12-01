/*global define*/

define(['jquery', 'underscore'], function ($, _) {
    'use strict';

    var $win = $(window),
        blocks = [],
        Block;

    $win.on('resize', function () {
        _.each(blocks, function (block) {
            block.rearrange();
        });
    });

    function createElement($el) {
        var style = $el.get(0).style;

        return {
            getHeight: function () {
                var realHeight,
                    height = $el.outerHeight();

                style.height = 'auto';
                realHeight = $el.outerHeight();
                $el.height(height);

                return realHeight;
            },

            setHeight: function (height) {
                $el.height(height);
            },

            getTop: function () {
                return $el.offset().top;
            }
        };
    }

    function getHighest(elements) {
        return _.reduce(elements, function (height, element) {
            return Math.max(element.getHeight(), height);
        }, 0);
    }

    function syncHeight(elements) {
        var height = getHighest(elements);

        _.each(elements, function (element) {
            element.setHeight(height);
        });
    }

    Block = function ($elements) {
        this.elements = _.map($elements, function (el) {
            return createElement($(el));
        });
    };
    Block.prototype = {
        rearrange: function () {
            var top = null,
                row = [];

            _.each(this.elements, function (element) {
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

    return {
        create: function ($containers, elements) {
            $containers.each(function () {
                var block = new Block($(this).find(elements));

                block.rearrange();
                blocks.push(block);
            });
        }
    };
});