$(function() {
    "use strict";

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

    function move_focus(i, duration, delay) {
        duration /= 1000;
        delay /= 1000;

        var row = $('#row' + i);

        var unmasked_top = row.position().top;
        var unmasked_bottom = unmasked_top + row.outerHeight();

        var transition_props = {
            'transition-duration': duration + 's, ' + duration + 's, ' + duration + 's, ' + duration + 's',
            'transition-delay': delay + 's'
        }
        var upper_mask = $('#upper-mask');
        var lower_mask = $('#lower-mask');
        upper_mask.css(transition_props);
        lower_mask.css(transition_props);
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
        prev_button.css({
            'left': (scaled_left - 1.3 * 60 / 2 - prev_button.outerWidth() / 2) + 'px',
            'top': (scaled_top - 40 / 2 - space) + 'px',
            'visibility': i === 1 ? 'hidden' : 'visible'
        })
        next_button.css({
            'left': (scaled_left - 1.3 * 60 / 2 - next_button.outerWidth() / 2) + 'px',
            'top': (scaled_bottom - 40 / 2 + space) + 'px',
            'visibility': i === 16 ? 'hidden' : 'visible'
        })
    }

    function initialize_mask_transformations() {
        var board_height = $('#board').outerHeight();

        $('#upper-mask').css('transform', 'translate3d(0px, ' + (-board_height) + 'px, 0px)');
        $('#lower-mask').css('transform', 'translate3d(0px, ' + board_height + 'px, 0px)');
    }

    function select_row(i) {
        unmagnify_row(current_row, 400, 0);
        current_row = i;
        move_focus(current_row, 400, 400);
        move_cursor_button(current_row);
        magnify_row(current_row, 400, 800);
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

    // create the board
    for (var i = 1; i <= 16; ++i) {
        var html = '<div id="row' + i + '" class="row">';
        for (var j = 1; j <= 16; ++j) {
            html += '<div id="cell' + i + '-' + j + '" class="cell"><div id="panel' + i + '-' + j + '" class="panel">?</div></div>';
        }
        html += '</div>'
        $(html).appendTo('#board');
        $('<style>#row' + i + ':before { content: "' + i + '"; }</style>').appendTo('#board');
    }

    // masks
    initialize_mask_transformations();

    // initial focus
    current_row = 1;
    move_focus(current_row, 400, 0);
    move_cursor_button(current_row, 400, 400);
    magnify_row(current_row, 400, 400);

    // events
    if (is_touch_device()) {
        // disable the overscroll effect on touch-capable environments.
        // http://www.html5rocks.com/en/mobile/touch/
        // http://stackoverflow.com/questions/2890361/disable-scrolling-in-an-iphone-web-application
        $(document).on('touchmove', function(e) {
            e.preventDefault();
        });

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

        $(".panel").each(function() {
            $(this).on('touchstart', on_panel_touchstart);
            $(this).on('touchmove', on_panel_touchmove);
            $(this).on('touchend', on_panel_touchend);
        });
    }
    else {
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

        $(".panel").each(function() {
            $(this).on('mousedown', on_panel_mousedown);
            $(this).on('mousemove', on_panel_mousemove);
            $(this).on('mouseup', on_panel_mouseup);
        });
    }
});
