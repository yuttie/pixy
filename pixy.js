$(function() {
    "use strict";

    var opt = {
        'row': null,
        'noedit': false,
        'nofocus': false,
        'memory': [],
        'export': false,
        'data': null
    };

    var current_row = null;
    var mouse_tracking;
    var touch_tracking = [];

    // http://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript
    function is_touch_device() {
        return !!('ontouchstart' in window) // works on most browsers
            || !!('onmsgesturechange' in window); // works on ie10
    }

    function get_data() {
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
        return data;
    }

    function set_data(data) {
        for (var i = 1; i <= 16; ++i) {
            for (var j = 1; j <= 16; ++j) {
                var panel = $('#panel' + i + '-' + j);

                var k = 16 * (i - 1) + (j - 1);
                if (data[k] === '0') {
                    panel.addClass("white invisible-text");
                    panel.removeClass("black");
                }
                else if (data[k] === '1') {
                    panel.addClass("black invisible-text");
                    panel.removeClass("white");
                }
                else {
                    panel.removeClass("white black invisible-text");
                }
            }
        }
    }

    function toggle_panel_color(panel) {
        if ($(panel).hasClass("black") || $(panel).hasClass("white")) {
            $(panel).toggleClass("black white");
        }
        else {
            $(panel).addClass("white invisible-text");
        }
        localStorage['resume_data'] = JSON.stringify({ 'row': current_row, 'data': get_data() });
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

        var focused_top = row.position().top;
        var focused_bottom = focused_top + row.outerHeight();

        var upper_mask = $('#upper-mask');
        var lower_mask = $('#lower-mask');
        upper_mask.css('transform', 'translate3d(0px, ' + (focused_top - upper_mask.outerHeight()) + 'px, 0px)');
        lower_mask.css('transform', 'translate3d(0px, ' + focused_bottom + 'px, 0px)');
    }

    function move_cursor_buttons(i) {
        var row = $('#row' + i);

        var focused_top = row.position().top;
        var focused_bottom = focused_top + row.outerHeight();

        var scaled_top = focused_top - 0.3 * row.outerHeight() / 2;
        var scaled_bottom = focused_bottom + 0.3 * row.outerHeight() / 2;
        var scaled_left = -0.3 * row.outerWidth() / 2;

        var space = 0;

        var cursor_panel = $('#cursor-panel');
        cursor_panel.css('transform',
            'translate3d(' +
                (scaled_left - 1.3 * 60 / 2 - cursor_panel.outerWidth() / 2) + 'px, ' +
                (focused_top + row.outerHeight() / 2 - cursor_panel.outerHeight() / 2 - space) + 'px, ' +
                '0)');
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
        move_cursor_buttons(current_row);
        magnify_row(current_row, 400, 0);
        localStorage['resume_data'] = JSON.stringify({ 'row': current_row, 'data': get_data() });
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

    function change_query_string(qs, kvs) {
        $.each(kvs, function(key, value) {
            var re = new RegExp('([?&])' + key + '=[^&]+');
            if (qs.match(re)) {
                // The key is already used.
                qs = qs.replace(re, '$1' + key + '=' + value);
            }
            else {
                // The key isn't used.
                if (qs.match(/[?&]$/)) {
                    qs += key + '=' + value;
                }
                else if (qs.length > 0) {
                    qs += '&' + key + '=' + value;
                }
                else {
                    qs += '?' + key + '=' + value;
                }
            }
        });
        return qs;
    }

    function export_data() {
        var loc = window.location;
        loc.search = change_query_string(loc.search, { 'data': get_data() });
    }

    function make_thumbnail(data, scale) {
        var canvas = $('<canvas/>');
        canvas[0].width = scale * 16;
        canvas[0].height = scale * 16;
        var ctx = canvas[0].getContext('2d');
        for (var i = 0; i < 16; ++i) {
            for (var j = 0; j < 16; ++j) {
                var k = 16 * i + j;
                if (data[k] === '0') {
                    ctx.fillStyle = 'white';
                }
                else if (data[k] === '1') {
                    ctx.fillStyle = 'black';
                }
                else {
                    ctx.fillStyle = 'gray';
                }
                ctx.fillRect(scale * j, scale * i, scale, scale);
            }
        }
        return canvas[0].toDataURL();
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
        case "nofocus":
            opt.nofocus = true;
            break;
        case "memory":
            opt.memory = kv[1].split(',');
            break;
        case "export":
            opt['export'] = true;
            break;
        case "data":
            opt.data = kv[1];
            break;
        }
    });

    // UI
    // data panel
    if (opt.memory.indexOf('load') !== -1) {
        $('#load-panel').css('display', 'block');
    }
    if (opt.memory.indexOf('save') !== -1) {
        $('#save-panel').css('display', 'block');
    }
    if (opt.memory.indexOf('export') !== -1) {
        $('#export-panel').css('display', 'block');
    }
    if (opt.memory.indexOf('clear-resume') !== -1) {
        delete localStorage['resume_data'];
    }
    if (opt.memory.indexOf('clear-all') !== -1) {
        localStorage.clear();
    }

    // board
    for (var i = 1; i <= 16; ++i) {
        var row = $('<div id="row' + i + '" class="row"></div>');
        for (var j = 1; j <= 16; ++j) {
            var cell = $('<div id="cell' + i + '-' + j + '" class="cell"></div>');
            var panel = $('<div id="panel' + i + '-' + j + '" class="panel">?</div>');
            panel.appendTo(cell);
            cell.appendTo(row);
            var col_num_str = (j < 10 ? '0' : '') + j;
            $('<style>#panel' + i + '-' + j + ':before { content: "' + col_num_str + '"; }</style>').appendTo('head');
        }
        row.appendTo('#board');
        var num_str = (i < 10 ? '0' : '') + i;
        $('<style>#row' + i + ':before { content: "' + num_str + '"; }</style>').appendTo('head');
    }
    if (opt.data !== null) {
        set_data(opt.data);
    }
    else if (typeof localStorage['resume_data'] !== 'undefined') {
        set_data(JSON.parse(localStorage['resume_data']).data);
    }

    // focus
    if (opt.nofocus) {
        $('.mask').css('display', 'none');
        $('#prev-button, #next-button').css('display', 'none');
    }
    else {
        // masks
        initialize_mask_transformations();

        // initial focus
        if (opt.data !== null) {
            current_row = opt.row || 1;
        }
        else if (typeof localStorage['resume_data'] !== 'undefined') {
            current_row = JSON.parse(localStorage['resume_data']).row || 1;
        }
        else {
            current_row = opt.row || 1;
        }
        move_focus(current_row);
        move_cursor_buttons(current_row);
        magnify_row(current_row, 400, 0);
    }

    // Events
    // memory management UI
    $('.load-button').each(function() {
        var n = parseInt($(this).attr("id").slice('load-button'.length));
        var scale = Math.floor($(this).width() / 16);
        $(this).css('background-image', 'url(' + make_thumbnail(localStorage[n] || '', scale) + ')');
    });
    $('.load-button').on('click', function() {
        var n = parseInt($(this).attr("id").slice('load-button'.length));
        set_data(localStorage[n] || '');
    });
    $('.save-button').each(function() {
        var n = parseInt($(this).attr("id").slice('save-button'.length));
        var scale = Math.floor($(this).width() / 16);
        $(this).css('background-image', 'url(' + make_thumbnail(localStorage[n] || '', scale) + ')');
    });
    $('.save-button').on('click', function() {
        var n = parseInt($(this).attr("id").slice('save-button'.length));
        var scale = Math.floor($(this).width() / 16);
        var data = get_data();
        localStorage[n] = data;
        var thumbnail = make_thumbnail(data, scale)
        $(this).css('background-image', 'url(' + thumbnail + ')');
        $('#load-button' + n).css('background-image', 'url(' + thumbnail + ')');
    });
    $('#export-button').on('click', function() {
        export_data();
    });

    $('#lock-button').on('click', function() {
        $('#cursor-panel').css('display', 'none');
        if (!opt.nofocus) {
            $('.row').removeClass('magnified');
        }
        $('#lock').css('display', '');

        $(this).addClass('disabled');
        $('#unlock-button').removeClass('disabled');
    });

    $('#unlock-button').on('click', function() {
        $('#cursor-panel').css('display', '');
        if (!opt.nofocus) {
            magnify_row(current_row, 400, 0);
        }
        $('#lock').css('display', 'none');

        $(this).addClass('disabled');
        $('#lock-button').removeClass('disabled');
    });

    if (is_touch_device()) {
        // disable the overscroll effect on touch-capable environments.
        // http://www.html5rocks.com/en/mobile/touch/
        // http://stackoverflow.com/questions/2890361/disable-scrolling-in-an-iphone-web-application
        $(document).on('touchmove', function(e) {
            e.preventDefault();
        });

        // data panel
        $('#pull-bar').on('touchstart', function() {
            $('#data-panel').removeClass('hidden');
        });
        $('#push-bar').on('touchstart', function() {
            $('#data-panel').addClass('hidden');
        });

        // focus
        if (!opt.nofocus) {
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

        // panels
        if (!opt.noedit) {
            $(".panel").each(function() {
                $(this).on('touchstart', on_panel_touchstart);
                $(this).on('touchmove', on_panel_touchmove);
                $(this).on('touchend', on_panel_touchend);
            });
        }
    }
    else {
        // data panel
        $('#pull-bar').on('click', function() {
            $('#data-panel').removeClass('hidden');
        });
        $('#push-bar').on('click', function() {
            $('#data-panel').addClass('hidden');
        });
        $(document).on('keydown', function(e) {
            if (e.which === 27) {
                $('#data-panel').toggleClass('hidden');
            }
        });

        // focus
        if (!opt.nofocus) {
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
            $(document).on('wheel mousewheel DOMMouseScroll', function(e) {
                var delta =   e.originalEvent.deltaY       // 'wheel' event
                          || -e.originalEvent.wheelDeltaY  // Webkit's mousewheel event
                          || -e.originalEvent.wheelDelta;  // other's mousewheel event
                if (delta > 0) {
                    if (current_row < 16) {
                        select_row(current_row + 1);
                    }
                }
                else if (delta < 0) {
                    if (current_row > 1) {
                        select_row(current_row - 1);
                    }
                }
                e.preventDefault();
            });
            $(document).on('keydown', function(e) {
                switch (e.which) {
                case 40:
                    if (current_row < 16) {
                        select_row(current_row + 1);
                    }
                    break;
                case 38:
                    if (current_row > 1) {
                        select_row(current_row - 1);
                    }
                    break;
                }
            });
        }

        // panels
        if (!opt.noedit) {
            $(".panel").each(function() {
                $(this).on('mousedown', on_panel_mousedown);
                $(this).on('mousemove', on_panel_mousemove);
                $(this).on('mouseup', on_panel_mouseup);
            });
        }
    }
});
