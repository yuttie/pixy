$(function() {
    "use strict";

    var opt = {
        'row': 1,
        'noedit': false,
        'nomask': false,
        'permalink': false,
        'data': ""
    };

    var current_row = 0;
    var mouse_tracking;
    var touch_tracking = [];

    // http://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript
    function is_touch_device() {
        return !!('ontouchstart' in window) // works on most browsers
            || !!('onmsgesturechange' in window); // works on ie10
    }

    function toggle_panel_color(panel) {
        if ($(panel).hasClass("black") || $(panel).hasClass("white")) {
            $(panel).toggleClass("black white");
        }
        else {
            $(panel).addClass("white invisible-text");
        }
    }

    function unmagnify_row(i, duration, delay) {
        duration /= 1000;
        delay /= 1000;
        var row = $('#row' + i);
        row.css({
            'transition-duration': '0.001s, ' + duration + 's, ' + duration + 's, ' + duration + 's, ' + duration + 's',
            'transition-delay': delay + 's'
        });
        row.removeClass('magnified');
    }

    function magnify_row(i, duration, delay) {
        duration /= 1000;
        delay /= 1000;
        var row = $('#row' + i);
        row.css({
            'transition-duration': '0.001s, ' + duration + 's, ' + duration + 's, ' + duration + 's, ' + duration + 's',
            'transition-delay': delay + 's'
        });
        row.addClass('magnified');
    }

    function move_focus(i) {
        var row = $('#row' + i);

        var unmasked_top = row.position().top;
        var unmasked_bottom = unmasked_top + row.outerHeight();

        var upper_mask = $('#upper-mask');
        var lower_mask = $('#lower-mask');
        upper_mask.css('transform', 'translate3d(0px, ' + (unmasked_top - upper_mask.outerHeight()) + 'px, 0px)');
        lower_mask.css('transform', 'translate3d(0px, ' + unmasked_bottom + 'px, 0px)');
    }

    function move_cursor_button(i) {
        var row = $('#row' + i);

        var unmasked_top = row.position().top;
        var unmasked_bottom = unmasked_top + row.outerHeight();

        var scaled_top = unmasked_top - 0.3 * 40 / 2;
        var scaled_bottom = unmasked_bottom + 0.3 * 40 / 2;
        var scaled_left = -0.3 * row.outerWidth() / 2;

        var space = 10;

        var prev_button = $('#prev-button');
        var next_button = $('#next-button');
        prev_button.css('transform',
            'translate3d(' +
                (scaled_left - 1.3 * 60 / 2 - prev_button.outerWidth() / 2) + 'px, ' +
                (scaled_top - 40 / 2 - space) + 'px, ' +
                '0) ' +
            'rotate(45deg)');
        next_button.css('transform',
            'translate3d(' +
                (scaled_left - 1.3 * 60 / 2 - next_button.outerWidth() / 2) + 'px, ' +
                (scaled_bottom - 40 / 2 + space) + 'px, ' +
                '0) ' +
            'rotate(45deg)'
        );
    }

    function initialize_mask_transformations() {
        var board_height = $('#board').outerHeight();

        $('#upper-mask').css('transform', 'translate3d(0px, ' + (-board_height) + 'px, 0px)');
        $('#lower-mask').css('transform', 'translate3d(0px, ' + board_height + 'px, 0px)');
    }

    function select_row(i) {
        unmagnify_row(current_row, 400, 0);
        current_row = i;
        move_focus(current_row);
        move_cursor_button(current_row);
        magnify_row(current_row, 400, 400);
    }

    function on_panel_mousedown(e) {
        mouse_tracking = { target: this };
        toggle_panel_color(this);
    }

    function on_panel_mousemove(e) {
        if (mouse_tracking && mouse_tracking.target !== this) {
            toggle_panel_color(this);
            mouse_tracking.target = this;
        }
    }

    function on_panel_mouseup(e) {
        mouse_tracking = null;
    }

    function on_panel_touchstart(e) {
        $.each(e.originalEvent.changedTouches, function(_, t) {
            var target = document.elementFromPoint(t.clientX, t.clientY);
            if ($(target).hasClass('panel')) {
                touch_tracking[t.identifier] = { target: target };
                toggle_panel_color(target);
            }
        });
    }

    function on_panel_touchmove(e) {
        $.each(e.originalEvent.changedTouches, function(_, t) {
            var target = document.elementFromPoint(t.clientX, t.clientY);
            if ($(target).hasClass('panel')) {
                if (touch_tracking[t.identifier] && touch_tracking[t.identifier].target !== target) {
                    toggle_panel_color(target);
                    touch_tracking[t.identifier].target = target;
                }
            }
        });
    }

    function on_panel_touchend(e) {
        $.each(e.originalEvent.changedTouches, function(_, t) {
            touch_tracking[t.identifier] = null;
        });
    }

    function save_data() {
        var data = "";
        for (var i = 1; i <= 16; ++i) {
            for (var j = 1; j <= 16; ++j) {
                var panel = $('#panel' + i + '-' + j);

                if (panel.hasClass('white')) {
                    data += '0';
                }
                else if (panel.hasClass('black')) {
                    data += '1';
                }
                else {
                    data += '.';
                }
            }
        }
        var re = /([?&])data=[^&]+/;
        var loc = window.location;
        if (loc.search.match(re)) {
            loc.search = loc.search.replace(re, '$1data=' + data);
        }
        else if (loc.search.match(/[?&]$/)) {
            loc.search += 'data=' + data;
        }
        else if (loc.search.length > 0) {
            loc.search += '&data=' + data;
        }
        else {
            loc.search += '?data=' + data;
        }
    }

    // process options
    $.each(window.location.search.slice(1).split("&"), function(_, param) {
        var kv = param.split("=");

        switch (kv[0]) {
        case "row":
            opt.row = parseInt(kv[1]);
            break;
        case "noedit":
            opt.noedit = true;
            break;
        case "nomask":
            opt.nomask = true;
            break;
        case "permalink":
            opt.permalink = true;
            break;
        case "data":
            opt.data = kv[1];
            break;
        }
    });

    // create the board
    for (var i = 1; i <= 16; ++i) {
        var row = $('<div id="row' + i + '" class="row"></div>');
        for (var j = 1; j <= 16; ++j) {
            var cell = $('<div id="cell' + i + '-' + j + '" class="cell"></div>');
            var panel = $('<div id="panel' + i + '-' + j + '" class="panel">?</div>');

            var k = 16 * (i - 1) + (j - 1);
            if (opt.data[k] === '0') {
                panel.addClass("white invisible-text");
            }
            else if (opt.data[k] === '1') {
                panel.addClass("black invisible-text");
            }

            panel.appendTo(cell);
            cell.appendTo(row);
        }
        row.appendTo('#board');
        var num_str = (i < 10 ? '0' : '') + i;
        $('<style>#row' + i + ':before { content: "' + num_str + '"; }</style>').appendTo('#board');
    }

    if (opt.permalink) {
        $('#permalink-button').css('display', 'block');
    }

    if (opt.nomask) {
        $('.mask').css('display', 'none');
        $('#prev-button, #next-button').css('display', 'none');
    }
    else {
        // masks
        initialize_mask_transformations();

        // initial focus
        current_row = opt.row;
        move_focus(current_row, 400, 0);
        move_cursor_button(current_row, 400, 400);
        magnify_row(current_row, 400, 400);
    }

    // events
    if (is_touch_device()) {
        // disable the overscroll effect on touch-capable environments.
        // http://www.html5rocks.com/en/mobile/touch/
        // http://stackoverflow.com/questions/2890361/disable-scrolling-in-an-iphone-web-application
        $(document).on('touchmove', function(e) {
            e.preventDefault();
        });

        if (!opt.nomask) {
            $('#prev-button').on('touchstart', function() {
                if (current_row > 1) {
                    select_row(current_row - 1);
                }
            });
            $('#next-button').on('touchstart', function() {
                if (current_row < 16) {
                    select_row(current_row + 1);
                }
            });
        }

        if (!opt.noedit) {
            $(".panel").each(function() {
                $(this).on('touchstart', on_panel_touchstart);
                $(this).on('touchmove', on_panel_touchmove);
                $(this).on('touchend', on_panel_touchend);
            });
        }
    }
    else {
        if (!opt.nomask) {
            $('#prev-button').on('click', function() {
                if (current_row > 1) {
                    select_row(current_row - 1);
                }
            });
            $('#next-button').on('click', function() {
                if (current_row < 16) {
                    select_row(current_row + 1);
                }
            });
        }

        if (!opt.noedit) {
            $(".panel").each(function() {
                $(this).on('mousedown', on_panel_mousedown);
                $(this).on('mousemove', on_panel_mousemove);
                $(this).on('mouseup', on_panel_mouseup);
            });
        }
    }

    if (opt.permalink) {
        $('#permalink-button').on('click', function() {
            save_data();
        });
    }
});
