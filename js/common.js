function setCookie(){
    $('.cookies-btn').on('click', function () {
        $.ajax({
                type: "POST",
                url: '/en/site/set-cookies',
                data: {
                    status: $(this).data('status')
                }
            }
        )
            .done(function(data) {
                if(data.status === 'success'){
                }
            });
    });
}

function triggerFileInput(){
    $('#profilePhotoInput').on('change', function(event) {
        let formData = new FormData($('form')[0]);
        setTimeout(function(){
            // $('#profilePhotoInput').fileinput('upload');
            $.ajax({
                    type: 'POST',
                    url: '/en/site/profile',
                    data: formData,
                    cache: false,
                    contentType: false,
                    processData: false
                }
            ).done(function (data) {
                if (data.success) {
                    toastrSuccess('Saved');
                    preloadProfilePhoto($('#profilePhotoInput'));

                }else{
                    $.each(data.validation, function (key, value) {
                        if (value.length > 0) {
                            toastrError(value);
                        }
                    });
                }
            });
        }, 50);
    });
}

function copyUrl(url) {
    let $temp = $("<input>");
    $("body").append($temp);

    if(url !== undefined){
        $temp.val(url).select();
    }else{
        $temp.val(currentUrl).select();
    }

    document.execCommand("copy");
    $temp.remove();
    showLabel($('.copy-label'));
}

function pjaxReload(container){
    if($(container).length !== 0) {
        $.pjax.reload({type:'post', container:container}).done(function () {
            $.pjax.xhr = null;

            if(container === '#history-pjax') {
                checkTableForReload();
            }
        });
        $.pjax.xhr = null;

        return true;
    }
    return false;
}

function checkTableForReload() {
    let item = $('.tabs_row.tab-container').find('.item');

    item.each(function() {
        let tab = $(this).data('tab');

        if($(this).hasClass('active') && tab === 'my_bets') {
            $('.tab-content-container .item:nth-child(1)').removeClass('active');
            $('.tab-content-container .item:nth-child(2)').addClass('active');
        }
    })
}

function getSettings(attr){
    let arr = JSON.parse(settings);
    return arr[attr];
}

function socketApp(){
    var socket;
    function newUser() {
        // socket = io('116.203.233.217:4027',{
        socket = io(nodeHost,{
            query : 'type=' + socketType + '&user_id=' + userId + '&last_activity=' + lastActivity
        });

        // lastActivity = Number(lastActivity + '000');

        socket.on('socket_ready', function() {
            if($('.overflow__container').length) {
                $('.overflow__container').removeClass('active');
            }
        });

        socket.on('changeGame', function() {
            $('#up_profit').text('0');
            $('#down_profit').text('0');
            if(pjaxReload('#game-pjax')){
                setTimeout(pjaxReload, 100, '#bets-pjax');
                setNotifications();
                pjaxReload('#history-pjax');
                gameTimer(58);
            }
        });

        socket.on('showTransaction', function(data) {
            showTransaction(data.amount, data.type);
            $('.current_balance').text(data.balance);
        });

        socket.on('showNotification', function(data) {
            setNotifications();
        });

        socket.on('change_chat', function(data) {
            createMessageItem(data);
            scrollDown();
        });

        socket.on('messageLike', function(data) {
            messageLike(data);
        });

        socket.on('change_notification', function(data) {
            if($('#notification-pjax').length !== 0){
                setNotifications();
            }
        });
        socket.on('newBet', function(data){
            if (Number(data.type) === 1) {
                if ($('.bets-up').find('.bets_table').length === 0) {
                    $('.bets-up').find('.row').remove();
                    $('.bets-up').append('<div class="bets_table"></div>');
                }

                $('.bets-up').find('.bets_table').append('<div class="item">\n' +
                    '                    <div class="body-secondary white text">'+data.userName+'</div>\n' +
                    '                <div class="row align-center">\n' +
                    '                    <div class="body-secondary semi-bold green mr5 text">'+data.amount+'</div>\n' +
                    '                <i class="material-icons green">trending_up</i>\n' +
                    '                </div>\n' +
                    '                </div>');
            }

            if (Number(data.type) === 2) {
                if ($('.bets-down').find('.bets_table').length === 0) {
                    $('.bets-down').find('.row').remove();
                    $('.bets-down').append('<div class="bets_table"></div>');
                }

                $('.bets-down').find('.bets_table').append('<div class="item">\n' +
                    '                    <div class="body-secondary white text">'+data.userName+'</div>\n' +
                    '                <div class="row align-center">\n' +
                    '                    <div class="body-secondary semi-bold red mr5 text">'+data.amount+'</div>\n' +
                    '                <i class="material-icons red">trending_down</i>\n' +
                    '                </div>\n' +
                    '                </div>');
            }

            $('#amount_bet').find('#sum_1').val(data.amountUp);
            $('#amount_bet').find('#sum_2').val(data.amountDown);
            $('#up_profit').text(data.rateUp);
            $('#down_profit').text(data.rateDown);

            let allBets = $('div[data-tab-content="all_bets"]').find('div[data-modal="betting"]');

            allBets.find('.all-all-bets .row span.green').text(data.up);
            allBets.find('.all-all-bets .row span.red').text(data.down);

            if (userId === (atob(data.userId) / 156 - 12)) {
                setMyBets(data.userUp, data.userDown);
                checkUserBet(data);
            }

            let count = $('#count_' + data.type);
            let sum = $('#sum_' + data.type);
            $('.count_' + data.type).text(Number(count.val()) + 1);
            $('.sum_' + data.type).text((Number(sum.val()) + Number(data.amount)).toFixed(8));
            setProfit();
        });
        socket.on('changeBalance', function (data) {
            $('.current_balance').text(data.balance);
        });
    }

    function checkUserBet(data) {
        let table = $('.tab-content-container .item:nth-child(2) .table-bets'),
            tbody = table.find('.tbody'),
            betting = tbody.find('div[data-modal="betting"]');

            if(betting.length) {
                let all_bets = betting.find('div[data-label="All bets"]'),
                    all_up,
                    all_down,
                    my_bets = betting.find('div[data-label="My bets"]'),
                    user_up,
                    user_down;


                    if(data.up) {
                        all_up = '<div class="row align-center mr10">'
                            + '<i class="material-icons small-icon green">trending_up</i>'
                            + '<span class="green ml5"> ' + data.up + ' </span>'
                            + '</div>';
                    }

                    if(data.down) {
                        all_down = '<div class="row align-center">'
                            + '<i class="material-icons small-icon red">trending_down</i>'
                            + '<span class="red ml5"> ' + data.down + ' </span>'
                            + '</div>';
                    }

                    if(data.userUp) {
                        user_up = '<div class="row align-center mr10">'
                            + '<i class="material-icons small-icon green">trending_up</i>'
                            + '<span class="green ml5"> ' + data.userUp + ' </span>'
                            + '</div>';
                    }

                    if(data.userDown) {
                        user_down = '<div class="row align-center">'
                            + '<i class="material-icons small-icon red">trending_down</i>'
                            + '<span class="red ml5"> ' + data.userDown + ' </span>'
                            + '</div>';
                    }

                all_bets
                    .html('')
                    .append(all_up)
                    .append(all_down);

                my_bets
                    .html('')
                    .append(user_up)
                    .append(user_down);

            } else {
                
                let row_bet = $('<div data-modal="betting" data-url="/en/site/bet-info?id= ' + data.gameId + '" class="tr">\n'+
                        '<div data-label="Game ID" class="cell white">BTC #' + data.gameId + '</div>\n'+
                        '<div data-label="Base price / Last Price" class="cell white">' + data.price + '/<span class="red">0</span></div>\n'+
                        '<div data-label="All bets" class="cell white all-all-bets">\n'+
                        '<div class="row align-center mr10">\n'+
                            '<i class="material-icons small-icon green">trending_up</i>\n'+
                            '<span class="green ml5">'+ data.up + '</span>\n'+
                        '</div>\n'+
                        '<div class="row align-center">\n'+
                            '<i class="material-icons small-icon red">trending_down</i>\n'+
                            '<span class="red ml5">'+ data.down + '</span>\n'+
                        '</div>\n'+
                    '</div>\n'+
                    '<div data-label="My bets" class="cell all-my-bets">\n'+
                        '<div class="row align-center mr10">\n'+
                            '<i class="material-icons small-icon green">trending_up</i>\n'+
                            '<span class="green ml5">'+ data.userUp + '</span>\n'+
                        '</div>\n'+
                        '<div class="row align-center">\n'+
                            '<i class="material-icons small-icon red">trending_down</i>\n'+
                            '<span class="red ml5">'+ data.userDown + '</span>\n'+
                        '</div>\n'+
                    '</div>\n'+
                    '<div data-label="Payout" class="cell">\n'+
                        '<span class="green mr10"></span>\n'+
                        '<span class="red"></span>\n'+
                    '</div>\n'+
                    '<div class="cell">\n'+
                        '<div class="label red betting load">\n'+
                            '<div class="row align-center"> Betting \n'+                                                                                     
                                '<span class="row align-center ml10">\n'+
                                    '00:<span class="label-timer">00</span>\n'+
                                '</span>\n'+
                            '</div>\n'+
                        '</div>\n' +
                    '</div>\n'+
                '</div> ');

                tbody.prepend(row_bet)
            }
    }

    function setNotifications() {
        $.ajax({
                type: 'post',
                url: '/en/site/notifications-count',
            }
        ).done(function (data) {
            if (data.success) {
                setTimeout(pjaxReload, 100, '#notification-mobile-pjax');
                setTimeout(pjaxReload, 100, '#notification-pjax');

                let elems = $('.notifications_status');
                elems.each(function (k, v) {
                    if (Number(data.count) > 0) {
                        if(!$(v).hasClass('active')){
                            $(v).addClass('active');
                        }
                    }else{
                        if($(v).hasClass('active')){
                            $(v).removeClass('active');
                        }
                    }
                });

            } else if (data.validation) {
                $.each(data.validation, function (key, value) {
                    if (value.length > 0) {
                        toastrError(value);
                    }
                });
            }
        });
    }

    function submitBet(){
        $('body').on('click', '.set_bet', function () {
            let $yiiform = $('#form-bet');
            $.ajax({
                    type: $yiiform.attr('method'),
                    url: $yiiform.attr('action'),
                    data: $yiiform.serializeArray(),
                }
            ).done(function (data) {
                if (data.success) {
                    toastrSuccess('Saved');
                    socket.emit('newBet', {
                        amount:data.amount,
                        type:data.type,
                        gameId:data.gameId,
                        price:data.price,
                        userName:data.userName,
                        userId:data.userId,
                        rateUp:data.rateUp,
                        rateDown:data.rateDown,
                        amountUp:data.amountUp,
                        amountDown:data.amountDown,
                        up:data.up,
                        down:data.down,
                        userUp:data.userUp,
                        userDown:data.userDown,
                    });
                    $('.current_balance').text(data.balance);
                    $('#betform-amount').val(minBtcBet);
                    // return false;
                } else if (data.validation) {
                    $.each(data.validation, function (key, value) {
                        if(value.length > 0){
                            toastrError(value);
                        }
                    });
                }
            });
            return false;
        });
    }

    function sendMessage(){
        $('body').on('click', '#send_chat_message', function () {
            let $yiiform = $('#form-chat');
            let data = $yiiform.serializeArray();
            // return false;
            $.ajax({
                    type: $yiiform.attr('method'),
                    url: $yiiform.attr('action'),
                    data: data,
                }
            ).done(function (data) {
                if (data.success) {
                    $('#chat_input').val('');
                    toastrSuccess('Send');
                    socket.emit('change_chat', {data:data.data});
                    $('.text-counter').text(160);
                } else if (data.validation) {
                    $.each(data.validation, function (key, value) {
                        if(value.length > 0){
                            toastrError(value);
                        }
                    });
                }

                $('.emoji-wysiwyg-editor.form-control').text('');
                $('.message__reply__content').remove();
                $('#chat-replay').removeAttr('value');
                $('#send_chat_message')
                    .removeClass('replied')
                    .attr('style', '');
                $('#chat').attr('style', '')
                $('.emoji-wysiwyg-editor.form-control').removeClass('replied');
            });
            return false;
        });
    }

    function readNotification(){
        $('body').on('click', '.read_notification_btn', function () {
            $.ajax({
                    type: 'post',
                    url: '/en/site/read-notification',
                    data: {
                        id:$(this).data('id')
                    },
                }
            ).done(function (data) {
                if (data.success) {
                    socket.emit('new_notification', {user_id: userId});
                } else if (data.validation) {
                    $.each(data.validation, function (key, value) {
                        if(value.length > 0){
                            toastrError(value);
                        }
                    });
                }
            });
        });
    }

    function online(){
        socket.on('online', (data) => {
            $('div.online-row').find('.number').text(data);
        });
    }

    newUser();
    submitBet();
    sendMessage();
    readNotification();
    online();

    setInterval(() => {
        let time = new Date().getTime();
        time = String(time);
        time = time.substring(0, time.length - 3);
        if (lastActivity < Number(time) && userId !== false) {
            $.ajax({
                    type: 'post',
                    url: '/en/site/check-session'
                }
            );
        }
    }, 1000);
}

function chatLocale(locale){
    let data = {locale: locale};
    $.ajax({
            type: 'POST',
            url: '/en/site/chat-locale',
            data: data,
        }
    ).done(function (data) {
        if (data.success) {
            toastrSuccess('Changed');
            let span = $('div.chat-locale').find('span.lang');
            span.text(data.localeName);
            span.attr('data-locale', data.localeCode);
            $('div.chat-locale').find('div.language-tooltip').hide();
            pjaxReload('#chat-locale');
            setTimeout(() => {
                replyMessage();
                initEmoji();
                scrollDown();
                textAreaFunc();
            }, 1000);
        }
        if (data.error) {
            toastrError(data.message);
        }
    });
    return false;
}

function likeMessage(){
    $('body').on('click', '.message__set-like', function() {
        let message_id = $(this).data('like')

        if(!message_id) return;

        let data = {message_id: message_id};
        $.ajax({
                type: 'POST',
                url: '/en/site/like',
                data: data,
            }
        ).done(function (data) {
            if (data.success) {
                toastrSuccess('You liked message');
            }
            if (data.error) {
                toastrError(data.message);
            }
        });
        return false;
    })
}

function showTableModal() {
    $('body').on('click', '.table-bets .tbody .tr.pointer', function() {
        modalName = $(this).data('modal');

        $('.dimmer').addClass('active');
        $('body').addClass('scroll-hidden');
        $('.modal').addClass(modalName + ' active').find('.content')
            .load($(this).data('url'));
    });
}

function showTransaction(amount, type){
    $('#transaction_amount').text(amount);
    let element = $('.current_transaction');
    let parent = element.parent();
    if(type === 'down'){
        parent.removeClass('green');
        if(!parent.hasClass('red')){
            parent.addClass('red');
        }
    }else{
        parent.removeClass('red');
        if(!parent.hasClass('green')){
            parent.addClass('green');
        }
    }
    element.text(amount);

    showTransactionLabel(type);
}
// value/(down_amount + value)*up_amount*(100 - Number(btcCommission))/100
// value/(up_amount + value)*down_amount*(100 - Number(btcCommission))/100
function setProfit(){
    let up_amount = parseToFixed($('#sum_1').val());
    let down_amount = parseToFixed($('#sum_2').val());
    let value = parseToFixed($('#betform-amount').val());
    let down_profit = 0;
    let up_profit = 0;
    if(value >= minBtcBet) {
        // let btcCommission = getSettings('btc_commision');
        // if(up_amount > 0){
            down_profit = parseToFixedRate(up_amount / (down_amount + value) * 0.95 + 1);
        // }
        // if(down_amount > 0){
            up_profit = parseToFixedRate(down_amount / (up_amount + value) * 0.95 + 1);
        // }
    }

    $("#down_profit").text(down_profit + 'X');
    $("#up_profit").text(up_profit + 'X');
}

function parseToFixedRate(amount){
    return parseFloat(Number(amount).toFixed(3));
}

function parseToFixed(amount){
    return parseFloat(Number(amount).toFixed(8));
}

function createWithdraw(){
    let w_form = $('#form-withdraw');
    let p_form = $('#form-password_validate');
    let save = false;
    $('.withdraw_create').on('click', function () {
        // show = true;
        // w_form.yiiActiveForm('validate', true);
        $.ajax({
                type: w_form.attr('method'),
                url: w_form.attr('action'),
                data: w_form.serializeArray(),
            }
        ).done(function (data) {
            if (data.success) {
                showPopup('withdrawal');
            } else if (data.validation) {
                $.each(data.validation, function (key, value) {
                    if(value.length > 0){
                        toastrError(value);
                    }
                });
            }
        });
    });
    w_form.on('beforeSubmit', function(e) {
        if(!save){
            e.preventDefault();
            return  false;
        }

    });

    $('.check_password').on('click', function () {
        $.ajax({
                type: p_form.attr('method'),
                url: p_form.attr('action'),
                data: p_form.serializeArray(),
            }
        ).done(function (data) {
            if (data.success) {
                save = true;
                w_form.yiiActiveForm('validate', true);
            } else if (data.validation) {
                $.each(data.validation, function (key, value) {
                    if(value.length > 0){
                        toastrError(value);
                    }
                });
            }
        });
    });
}

function deleteAccount(){
    $('.delete_account').on('click', function () {
        let p_form = $('#validate-form');
        $.ajax({
                type: p_form.attr('method'),
                url: p_form.attr('action'),
                data: p_form.serializeArray(),
            }
        ).done(function (data) {
            if (data.success) {
                window.location.href = '/en/site/delete-account';
            } else if (data.validation) {
                $.each(data.validation, function (key, value) {
                    if(value.length > 0){
                        toastrError(value);
                    }
                });
            }
        });
    });
}

function twoFactor(){
    $('body').on('click', '.two_factor_auth', function () {
        let t_form = $('#tfa-form');
        $.ajax({
                type: t_form.attr('method'),
                url: t_form.attr('action'),
                data: t_form.serializeArray(),
            }
        ).done(function (data) {
            if (data.success) {
                toastrSuccess(data.message);
                $('.close-popup-btn').trigger('click');
                // $('.next-step').trigger('click');
                setTimeout(pjaxReload, 100, '#tfa-pjax');
                setTimeout(pjaxReload, 400, '#tfa-pjax-modal');
                setTimeout(initTFACarousel, 1000);
            } else if (data.validation) {
                toastrError(data.validation);
            }
        });
    });
}

function setPureWithdraw(){
    $('#withdraw_amount').on('change', function () {
        let amount = $(this).val();
        let c = getSettings('withdraw_commission');
        let get = parseToFixed(amount - c);
        $('#withdraw_pure_amount').text(get);
    });
}

function saveProfile() {
    $('body').on('click', '#save_profile_button', function () {
        let $yiiform = $('#form-profile');
        let data = $yiiform.serializeArray();
        $.ajax({
                type: $yiiform.attr('method'),
                url: $yiiform.attr('action'),
                data: data,
            }
        ).done(function (data) {
            if (data.success) {
                toastrSuccess('Saved');
                $('#pass_input').val('');
                $('#profileform-confirm_password').val('');
                $('#profileform-password').val('');
                $('div.valid-pass-row').hide();
                $yiiform.removeClass('has-error');
                $yiiform.find('p.help-block.help-block-error').remove();
            }else{
                $.each(data.validation, function (key, value) {
                    if (value.length > 0) {
                        toastrError(value);
                    }
                });
            }
        });
        return false;
    });
}

function bonusToday(day) {
    $.ajax({
            type: 'POST',
            url: '/en/site/promotional',
            data: {day: day},
        }
    ).done(function (data) {
        if (data.success) {
            toastrSuccess('Bonuses accrued');
            pjaxReload('#daily-streak-pjax');
        }
        if (data.error) {
            toastrError(data.message);
        }
    });
    return false;
}

function setMyBets(userUp, userDown) {
    let allBets = $('div[data-tab-content="all_bets"]').find('div[data-modal="betting"]');
    allBets.find('.all-my-bets .row span.green').text(userUp);
    allBets.find('.all-my-bets .row span.red').text(userDown);
}



window.onload = function(){
    setCookie();
    triggerFileInput();
    socketApp();
    showTableModal();
    createWithdraw();
    setPureWithdraw();
    deleteAccount();
    twoFactor();
    saveProfile();
    $('body').on('click', '.bet_type', function () {
        $('#bet_type_input').val($(this).data('type'));
    });
    $('body').on('keyup', $('#betform-amount'), function () {
        setProfit();
    });
    setProfit();
    likeMessage();
};