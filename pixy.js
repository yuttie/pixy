$(function() {
    "use strict";

    var preset_data = {
        'bird':     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,1,1,0,0,1,1,0,1,0,1,0,0,0,0,1,1,0,1,0,1,1,1,0,0,0,1,0,0,1,1,0,0,0,1,0,0,0,1,1,1,1,1,1,1,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,1,1,0,0,0,1,0,0,1,0,0,0,0,1,1,0,0,1,0,0,0,1,0,0,0,1,1,1,1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,1,1,1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,1,0,0,0,0,0],
        'boy':      [0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,0,0,0,0,1,0,0,0,1,1,1,1,1,1,0,0,1,1,1,1,0,0,0,0,0,0,1,1,1,1,0,0,0,1,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,1,0,0,1,0,0,0,1,0,0,1,1,0,0,0,1,0,0,0,1,0,1,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,1,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,1,1,1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1,0,1,1,1,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
        'cherry':   [0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,1,1,0,0,0,0,0,1,0,0,0,1,1,1,1,1,0,0,1,0,0,0,0,0,1,1,0,0,0,1,1,1,0,0,1,0,0,0,0,0,0,0,1,1,1,0,1,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,1,1,0,0,1,0,0,0,0,0,0,0,1,0,0,0,1,0,1,1,1,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,0,0,0,0,1,0,0,1,1,0,0,0,1,0,1,0,1,0,0,1,0,1,1,0,0,1,0,1,0,0,1,1,0,1,0,1,0,0,1,1,0,1,0,1,0,1,1,0,0,1,0,1,0,0,0,0,0,1,0,1,0,0,0,0,0,1,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1,1,1,0,0,0,0,0,1,1,1,0,0,0],
        'dog':      [0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,1,1,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,0,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,0,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,0,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,1,0,0,1,0,1,1,1,0,1,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,1,0,1,0,0,0,1,0,0,0,0,1,0,0,0,1,0,1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0],
        'fish':     [0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1,0,0,0,0,0,0,0,0,1,1,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,1,0,1,0,0,1,0,0,0,0,0,0,0,1,0,0,1,0,1,0,1,0,0,1,1,0,0,0,1,0,0,0,1,0,1,0,1,0,1,0,1,0,0,1,0,0,0,0,1,0,1,0,1,1,0,0,1,0,1,0,0,1,0,0,1,0,1,0,1,0,0,0,1,0,1,0,0,1,0,0,1,0,1,0,1,0,0,0,1,0,0,1,0,0,0,0,1,0,1,0,1,1,0,0,1,0,0,0,1,0,0,0,1,0,1,0,1,0,1,0,1,0,0,0,0,1,0,0,1,0,1,0,1,0,0,1,1,0,0,0,0,0,1,0,1,0,1,0,0,1,0,0,0,0,0,0,0,0,0,1,1,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0],
        'onepiece': [0,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,1,1,1,1,0,0,0,0,0,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,0,0,1,0,0,1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,1,0,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1,0,1,0,1,0,1,0,1,0,1,0,1,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,0,0,1,1,0,0,1,1,0,0,1,1,0,0,0],
        'rabbit':   [0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1,0,0,1,0,0,0,1,0,0,1,0,0,0,0,0,0,1,0,0,1,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,1,1,1,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,1,1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0]
    };

    var opt = {
        'title': null,
        'icon': null,
        'row': null,
        'noedit': false,
        'nofocus': false,
        'nomag': false,
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
        var data = [];
        for (var i = 1; i <= 16; ++i) {
            for (var j = 1; j <= 16; ++j) {
                var panel = $('#panel' + i + '-' + j);
                if (typeof panel.attr("data-color-code") !== 'undefined') {
                    data.push(parseInt(panel.attr("data-color-code")));
                }
                else {
                    data.push(null);
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
                if (data[k] !== null) {
                    panel.attr("data-color-code", data[k]);
                }
                else {
                    panel.removeAttr("data-color-code");
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

    function change_panel_color(panel, color_code) {
        $(panel).attr("data-color-code", color_code);
        save_state();
    }

    function unselect_row(i) {
        $('#row' + i).removeClass('selected');
    }

    function select_row(i) {
        $('#row' + i).addClass('selected');
    }

    function unmagnify_row(i) {
        $('#row' + i).removeClass('magnified');
    }

    function magnify_row(i) {
        $('#row' + i).addClass('magnified');
    }

    function move_masks(i) {
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
        var focused_left = 0;

        var space = 0;
        var cursor_panel = $('#cursor-panel');
        if (opt.nomag) {
            cursor_panel.css('transform',
                'translate3d(' +
                    (focused_left - 80 - cursor_panel.outerWidth()) + 'px, ' +
                    (focused_top + row.outerHeight() / 2 - cursor_panel.outerHeight() / 2 - space) + 'px, ' +
                    '0)');
        }
        else {
            var scaled_top    = focused_top    - 0.3 * row.outerHeight() / 2;
            var scaled_bottom = focused_bottom + 0.3 * row.outerHeight() / 2;
            var scaled_left   = focused_left   - 0.3 * row.outerWidth()  / 2;

            cursor_panel.css('transform',
                'translate3d(' +
                    (scaled_left - 1.3 * 80 / 2 - cursor_panel.outerWidth() / 2) + 'px, ' +
                    (focused_top + row.outerHeight() / 2 - cursor_panel.outerHeight() / 2 - space) + 'px, ' +
                    '0)');
        }

        if (i === 1) {
            $('#prev-button').addClass('disabled');
        }
        else {
            $('#prev-button').removeClass('disabled');
        }
        if (i === 16) {
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

    function unfocus_row(i) {
        unselect_row(i);
        if (!opt.nomag) {
            unmagnify_row(i);
        }
    }

    function focus_row(i) {
        move_masks(i);
        move_cursor_buttons(i);
        select_row(i);
        if (!opt.nomag) {
            magnify_row(i);
        }
    }

    function move_focus(i) {
        unfocus_row(current_row);
        current_row = i;
        focus_row(current_row);
        save_state();
    }

    function on_panel_mousedown(e) {
        mouse_tracking = {
            target: this,
            initial_panel_color: $(this).hasClass("white") ? "white" : "black"
        };
        change_panel_color(this, $("#palette .color.selected").data("code"));
    }

    function on_panel_mousemove(e) {
        if (mouse_tracking && mouse_tracking.target !== this) {
            change_panel_color(this, $("#palette .color.selected").data("code"));
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
                touch_tracking[t.identifier] = {
                    target: target,
                    initial_panel_color: $(target).hasClass("white") ? "white" : "black"
                };
                change_panel_color(target, $("#palette .color.selected").data("code"));
            }
        });
    }

    function on_panel_touchmove(e) {
        $.each(e.originalEvent.changedTouches, function(_, t) {
            var target = document.elementFromPoint(t.clientX, t.clientY);
            if ($(target).hasClass('panel')) {
                if (touch_tracking[t.identifier] && touch_tracking[t.identifier].target !== target) {
                    change_panel_color(target, $("#palette .color.selected").data("code"));
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
                if (data[k] !== null) {
                    ctx.fillStyle = code_to_color[data[k]];
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
            unfocus_row(current_row);
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
            focus_row(current_row);
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
        case "icon":
            opt.icon = decodeURIComponent(kv[1]);
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
        case "nomag":
            opt.nomag = true;
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
    // palette
    var code_to_color = [];
    $("#palette .color").each(function(i) {
        var color = $(this).data("color");
        $(this).css("background-color", color);
        code_to_color[i] = color;
        $(this).attr("data-code", i);
        $("<style>.panel[data-color-code=\"" + i + "\"] { background-color: " + color + "; }</style>").appendTo("html > head");
    });
    $("#palette .color").on(is_touch_device() ? "touchstart" : "mousedown", function() {
        $("#palette .color").removeClass("selected");
        $(this).addClass("selected");
    });
    $("#palette .color").first().addClass("selected");

    // title
    if (opt.title) {
        $('head > title').text(opt.title);
    }
    // icon
    if (opt.icon) {
        $('<link rel="apple-touch-icon" href="' + opt.icon + '">').appendTo('head');
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
        localStorage[i + 1] = JSON.stringify(data);
        var thumbnail = make_thumbnail(data, scale)
        $('#load-button' + (i + 1)).css('background-image', 'url(' + thumbnail + ')');
        $('#save-button' + (i + 1)).css('background-image', 'url(' + thumbnail + ')');
    }

    // board
    for (var i = 1; i <= 16; ++i) {
        var row_holder = $('<div class="row-holder"></div>');
        var row = $('<div id="row' + i + '" class="row"></div>');
        for (var j = 1; j <= 16; ++j) {
            var cell = $('<div id="cell' + i + '-' + j + '" class="cell"></div>');
            var panel = $('<div id="panel' + i + '-' + j + '" class="panel">?</div>');
            panel.appendTo(cell);
            cell.appendTo(row);
            var col_num_str = (j < 10 ? '0' : '') + j;
            $('<style>#panel' + i + '-' + j + ':before { content: "' + col_num_str + '"; }</style>').appendTo('head');
        }
        row.appendTo(row_holder);
        row_holder.appendTo('#board');
        var num_str = (i < 10 ? '0' : '') + i;
        $('<style>#row' + i + ':before { content: "' + num_str + '"; }</style>').appendTo('head');
    }
    if (opt.data !== null) {
        set_data(JSON.parse(opt.data));
        save_state();
    }
    else if (typeof localStorage['resume_data'] !== 'undefined') {
        set_data(JSON.parse(localStorage['resume_data']).data);
    }

    if (!opt.nomag) {
        $('.row').addClass('animated');
    }

    // focus
    if (opt.nofocus) {
        $('.mask').addClass('disabled');
        $('#cursor-panel').addClass('disabled');
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
        focus_row(current_row);
    }

    // lock
    if (typeof localStorage['resume_data'] !== 'undefined') {
        if (JSON.parse(localStorage['resume_data']).locked) {
            lock();
        }
    }

    // Events
    // memory management UI
    function load_data(n) {
        if (typeof localStorage[n] !== 'undefined') {
            return JSON.parse(localStorage[n]);
        }
        else {
            var data = [];
            for (var i = 0; i < 16 * 16; ++i) {
                data[i] = null;
            }
            return data;
        }
    }
    $('.load-button').each(function() {
        var n = parseInt($(this).attr("id").slice('load-button'.length));
        var scale = Math.floor($(this).width() / 16);
        $(this).css('background-image', 'url(' + make_thumbnail(load_data(n), scale) + ')');
    });
    $('.load-button').on('click', function() {
        var n = parseInt($(this).attr("id").slice('load-button'.length));
        set_data(load_data(n));
        save_state();
    });
    $('.save-button').each(function() {
        var n = parseInt($(this).attr("id").slice('save-button'.length));
        var scale = Math.floor($(this).width() / 16);
        $(this).css('background-image', 'url(' + make_thumbnail(load_data(n), scale) + ')');
    });
    $('.save-button').on('click', function() {
        var n = parseInt($(this).attr("id").slice('save-button'.length));
        var scale = Math.floor($(this).width() / 16);
        var data = get_data();
        localStorage[n] = JSON.stringify(data);
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
                    move_focus(current_row - 1);
                }
            });
            $('#next-button').on('touchstart', function() {
                if (current_row < 16) {
                    move_focus(current_row + 1);
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
                    move_focus(current_row - 1);
                }
            });
            $('#next-button').on('click', function() {
                if (current_row < 16) {
                    move_focus(current_row + 1);
                }
            });
            $(document).on('wheel mousewheel DOMMouseScroll', function(e) {
                var delta =   e.originalEvent.deltaY       // 'wheel' event
                          || -e.originalEvent.wheelDeltaY  // Webkit's mousewheel event
                          || -e.originalEvent.wheelDelta;  // other's mousewheel event
                if (delta > 0) {
                    if (current_row < 16) {
                        move_focus(current_row + 1);
                    }
                }
                else if (delta < 0) {
                    if (current_row > 1) {
                        move_focus(current_row - 1);
                    }
                }
                e.preventDefault();
            });
            $(document).on('keydown', function(e) {
                switch (e.which) {
                case 40:
                    if (current_row < 16) {
                        move_focus(current_row + 1);
                    }
                    break;
                case 38:
                    if (current_row > 1) {
                        move_focus(current_row - 1);
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
