$(function() {
    "use strict";

    var preset_data = {
        'bird':     '0000000000000000000111000000000000100010000001100110101000011010111000100110001000111111100001000001000000001110001001000011001000100011110001000001000000011000000011111110000000000010010000000000001001000000000011101100000000000110011000000000101010100000',
        'boy':      '0000000011110000000011111111110000011111111111101111111111111110010000100011111100111100000011110001000000000111000100100010011000100010101000100010000000000010000100100010010000010001110001000000100000001000000001100011000000000101110100000000100000001000',
        'cherry':   '0000011111000000000010000010110000010001111100100000110001110010000000111010010000000001001100100000001000101110000001000010000000001000001000000011110000111000010011000101010010110010100110101001101010110010100000101000001001000100010001000011100000111000',
        'dog':      '0001100000110000001111000111100001111111111111001111110001111110111111000111111011111000001111101111000000011110011000000000110001001000001001000100101110100100010000010000010001000001000001000100010101000100001000101000100000010000000100000000111111100000',
        'fish':     '0000000000111100000000001100010000000011010010000000010101001000000010010101001100010001010101010010000101011001010010010101000101001001010100010010000101011001000100010101010100001001010100110000010101001000000000110100100000000000110001000000000000111100',
        'onepiece': '0001100000001100001111000001111000111111111111100001110010011100000011000001100000000110001100000000011101110000000001111111000000001000000010000001010101010100001010101010101001010101010101010110101010101011010101010101010100100110011001100001100110011000',
        'rabbit':   '0011000000011000010010000010010001001000001001000100010001000100001001000100100000010010100100000000101110100000000100000001000000100000000010000010010001001000001000010000100000100000000010000010001110001000000100000001000000001000001000000000011111000000'
    };

    var opt = {
        'title': null,
        'row': null,
        'noedit': false,
        'nofocus': false,
        'load': false,
        'save': false,
        'export': false,
        'lock': false,
        'clear': false,
        'preset': [],
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

    function log(msg) {
        var li = $('<li/>');
        li.text(msg);
        li.appendTo('#log-panel');
        setTimeout(function() {
            li.addClass('hidden');
            li.on('webkitTransitionEnd oTransitionEnd transitionend', function() {
                $(this).addClass('disabled');
            });
        }, 0);
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

    function save_state() {
        localStorage['resume_data'] = JSON.stringify({
            'row': current_row,
            'locked': !$('#lock').hasClass('disabled'),
            'data': get_data()
        });
    }

    function toggle_panel_color(panel) {
        if ($(panel).hasClass("black") || $(panel).hasClass("white")) {
            $(panel).toggleClass("black white");
        }
        else {
            $(panel).addClass("white invisible-text");
        }
        save_state();
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
        if (current_row === 1) {
            $('#prev-button').addClass('disabled');
        }
        else {
            $('#prev-button').removeClass('disabled');
        }
        if (current_row === 16) {
            $('#next-button').addClass('disabled');
        }
        else {
            $('#next-button').removeClass('disabled');
        }
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
        save_state();
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

    function lock() {
        $('#cursor-panel').addClass('disabled');
        if (!opt.nofocus) {
            $('.row').removeClass('magnified');
        }
        $('#lock').removeClass('disabled');

        if (opt.lock) {
            $('#lock-button').addClass('disabled');
            $('#unlock-button').removeClass('disabled');
        }

        save_state();
    }

    function unlock() {
        $('#cursor-panel').removeClass('disabled');
        if (!opt.nofocus) {
            magnify_row(current_row, 400, 0);
        }
        $('#lock').addClass('disabled');

        if (opt.lock) {
            $('#unlock-button').addClass('disabled');
            $('#lock-button').removeClass('disabled');
        }

        save_state();
    }

    // process options
    $.each(window.location.search.slice(1).split("&"), function(_, param) {
        var kv = param.split("=");

        switch (kv[0]) {
        case "title":
            opt.title = decodeURIComponent(kv[1]);
            break;
        case "row":
            opt.row = parseInt(kv[1]);
            break;
        case "noedit":
            opt.noedit = true;
            break;
        case "nofocus":
            opt.nofocus = true;
            break;
        case "load":
            opt.load = true;
            break;
        case "save":
            opt.save = true;
            break;
        case "export":
            opt['export'] = true;
            break;
        case "lock":
            opt.lock = true;
            break;
        case "clear":
            opt.clear = kv[1];
            break;
        case "preset":
            opt.preset = (!kv[1] || kv[1] === 'all')
                      ? ['bird', 'boy', 'cherry', 'dog', 'fish', 'onepiece', 'rabbit']
                      : kv[1].split(',');
            break;
        case "data":
            opt.data = kv[1];
            break;
        case '':
            break;
        default:
            log('未知のオプションです: "' + kv[0] + '=' + kv[1] + '"');
        }
    });

    // UI
    // title
    if (opt.title) {
        $('head > title').text(opt.title);
    }
    // data panel
    if (opt.load) {
        $('#load-panel').removeClass('disabled');
    }
    if (opt.save) {
        $('#save-panel').removeClass('disabled');
    }
    if (opt['export']) {
        $('#tool-panel').removeClass('disabled');
        $('#export-button').removeClass('disabled');
    }
    if (opt.lock) {
        $('#tool-panel').removeClass('disabled');
        $('#lock-button').removeClass('disabled');
    }
    if (opt.clear === 'resume') {
        delete localStorage['resume_data'];
        log('再開用のメモリーを消去しました。');
    }
    if (opt.clear === 'all') {
        localStorage.clear();
        log('全てのメモリーを消去しました。');
    }
    for (var i = 0; i < opt.preset.length; ++i) {
        var scale = Math.floor($('#load-button').width() / 16);
        var data = preset_data[opt.preset[i]];
        localStorage[i + 1] = data;
        var thumbnail = make_thumbnail(data, scale)
        $('#load-button' + (i + 1)).css('background-image', 'url(' + thumbnail + ')');
        $('#save-button' + (i + 1)).css('background-image', 'url(' + thumbnail + ')');
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
        save_state();
    }
    else if (typeof localStorage['resume_data'] !== 'undefined') {
        set_data(JSON.parse(localStorage['resume_data']).data);
    }

    // focus
    if (opt.nofocus) {
        $('.mask').addClass('disabled');
        $('#prev-button, #next-button').addClass('disabled');
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

    // lock
    if (typeof localStorage['resume_data'] !== 'undefined') {
        if (JSON.parse(localStorage['resume_data']).locked) {
            lock();
        }
        else {
            unlock();
        }
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
        save_state();
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
    $('#lock-button').on('click', lock);
    $('#unlock-button').on('click', unlock);

    if (is_touch_device()) {
        // disable the overscroll effect on touch-capable environments.
        // http://www.html5rocks.com/en/mobile/touch/
        // http://stackoverflow.com/questions/2890361/disable-scrolling-in-an-iphone-web-application
        $(document).on('touchmove', function(e) {
            e.preventDefault();
        });

        // log-panel
        $('#log-panel').on('touchstart', function() {
            $(this).toggleClass('top-most');
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
        // log-panel
        $('#log-panel').on('click', function() {
            $(this).toggleClass('top-most');
        });

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
