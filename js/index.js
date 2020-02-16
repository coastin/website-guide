let tradingViewChart = null,
    qrCode = null;

$(document).ready(function() {
    showTooltip();
    countNumOfInputVal();
    // gameTimer();
    rulesAccordion();
    pageContentInit();
    faqAccordion();
    showCookies();
    closeCookies();
    setCheckbox();
    validPass();
    placeBet();
    openNotifications();
    readNotifications();
    // showTransactionLabel('down');
    // showGameBanner();
    // showTableModal();
    toggleChat();
    changeTheme();
    toggleMobileSecondaryMenu();
    toggleMobileMainMenu();
    showPopup();
    closePopup();
    toggleMobileNotifications();
    initTFACarousel();
    codeTFAGenerate();
    checkBetInputVal();
    setActiveBtn();
    onWindowResize();
    onDimmerClick();
    checkCookies();
    initStyler();
    onClickCopy();
    tab();
    scrollDown();
    toggleLangContentOnMobile();
    copyBanner();
    setBetByClick();
    initPromTimer();
    initEmoji();
    toggleTimeInfoTooltip();
    closeTimeInfoTooltip();
    replyMessage();
    textAreaFunc();
    removeReplyMessage();
    setOverflowToGameBox();

    if(getCookie('theme') !== "white") {
        initTradingWidget('#292d44', '#fff');
    } else {
        initTradingWidget('#eee', '#1E243A');
    }
});

function setOverflowToGameBox() {
    if($('.game__box__container').length) {
        $('.game__box__container .overflow__container').addClass('active');
    }
}

function removeReplyMessage() {
    $('body').on('click', '.del-reply-btn', function() {
        let height = $('.emoji-wysiwyg-editor.form-control').outerHeight(true),
            textarea = $('.emoji-wysiwyg-editor.form-control');

        $('.message__reply__content').remove();
        $('#chat-replay').removeAttr('value');
        textarea.removeClass('replied');
        $('#send_chat_message').removeClass('replied');

        setTimeout(() => {
            if(textarea.text().length) {
                $('#chat').css({
                    'min-height': `calc(100vh - ${height}px)`,
                    'max-height': `calc(100vh - ${height}px)`
                });

            } else {
                $('#chat').attr('style', '');
            }

            textarea.trigger('keyup')
        }, 1)
    })
}

function textAreaFunc() {
    $(".emoji-wysiwyg-editor.form-control").bind('keyup DOMSubtreeModified', function(e) {
        autoresizeChat();

        if(e.keyCode === 13 && !e.shiftKey) {
            $(this).trigger('blur')
            $('#send_chat_message').trigger('click');
        }
    });
}


function replyMessage() {
    $('#chat').on('click', '.message__reply-btn', function() {
        let textarea = $('.emoji-wysiwyg-editor.form-control'),
            message =  $(this).parents()[3],
            userName = $(message).find('.name').text(),
            text = $(message).find('.text').text(),
            repliedMessage = `<div title="${text}" data-user-name="${userName}" data-user-text="${text}" class="message__reply__content">@${userName}:${text}<i class="material-icons del-reply-btn">close</i></div>`;

        if(textarea.parent().find('.message__reply__content')) {
            $('.message__reply__content').remove();

            textarea.parent().prepend(repliedMessage);
        } else {
            textarea.parent().prepend(repliedMessage);
        }

        setTimeout(() => {
            textarea.trigger('keyup');
        }, 1)


        $('#form-chat').find('input[id="chat-replay"]').val(message.dataset.id);
        textarea.trigger('focus');
        textarea.addClass('replied');
        $('#send_chat_message').addClass('replied');
        scrollDown();

        if($(window).width() > 768) {
            $('#chat').css({'min-height': 'calc(100vh - 90px)', 'max-height': 'calc(100vh - 90px)'});
        }
    });
}

function closeTimeInfoTooltip() {
    $('body').on('click', '.close__time-tooltip__btn', function() {
        $('.show__time-tooltip__btn').removeClass('active');
        $('.tooltip__time--info').removeClass('active');
    })
}

function toggleTimeInfoTooltip() {
    $('body').on('click', '.show__time-tooltip__btn', function() {
        if($(this).hasClass('active')) {
            $(this).removeClass('active');
            $('.tooltip__time--info').removeClass('active');

            return;
        }

        $(this).addClass('active');
        $('.tooltip__time--info').addClass('active');
    })
}

function initEmoji() {
    if($('#chat').length) {
        window.emojiPicker = new EmojiPicker({
            emojiable_selector: '[data-emojiable=true]',
            assetsPath: baseUrl + '/emoji',
            popupButtonClasses: 'emoji-popup-btn',
            mobile: true
        });

        window.emojiPicker.discover();
    }
}


function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
  }

$(document).on('click', function(e) {
    if(!$(e.target).closest('.tooltip-btn').length && !$(e.target).closest('.tooltip').length) {
        $('.tooltip-btn').removeClass('active');
        $('.tooltip').slideUp(200);
    }

    if(!$(e.target).closest('.notifications-btn').length && !$(e.target).closest('.notifications').length) {
        $('.notifications').removeClass('active');
        $('.notifications').slideUp(200);
    }

    if(!$(e.target).closest('.show__time-tooltip__btn').length && !$(e.target).closest('.tooltip__time--info').length) {
        $('.show__time-tooltip__btn').removeClass('active');
        $('.tooltip__time--info').removeClass('active');
    }

});

function addSpaceMessageContent() {
    if($('#chat').length) {
        let message = $('#chat .message');

        message.each(function() {
            let content = $(this).find('.content .text')
                contentText = content.text(),
                // br = document.write('<br/>');
    
        contentText = contentText.replace(/(\r\n|\n|\r)/gm, '<br/>');
    
            content.text(contentText)
        });
    }
}

function initPromTimer() {
    if($('#promTimer').length !== 0 || $('.promTimer').length !== 0) {
        let fullTime = 86400,
            date = new Date(),
            hours = date.getHours(),
            minutes = date.getMinutes(),
            seconds = date.getSeconds(),
            clientTime = (hours * 60 * 60) + (minutes * 60) + seconds,
            restTime = fullTime - clientTime,
            initPromTimer = null;       

        initPromTimer = setInterval(function() {

            if (restTime > 0) {
                restTime-- ;
                let dateInTimer = new Date();
                    hoursInTimer = dateInTimer.getHours(),
                    minutesInTimer = dateInTimer.getMinutes(),
                    secondsInTimer = dateInTimer.getSeconds(),
                    restHours = fullTime / 60 / 60 - hoursInTimer - 1,
                    restMinutes = 60 - minutesInTimer - 1,
                    restSeconds = 60 - secondsInTimer - 1;

                   let hh =  String(restHours).length > 1 ? restHours : '0' + restHours,
                       dd = String(restMinutes).length > 1 ? restMinutes : '0' + restMinutes,
                       ss = String(restSeconds).length > 1 ? restSeconds : '0' + restSeconds;

                    $('#promTimer').text(hh + ":" + dd + ":" + ss);
                    $('.promTimer').text(hh + ":" + dd + ":" + ss);

            } else {
                clearInterval(initPromTimer);
            }
        }, 1000);
    }      
}

function setBetByClick() {
    $('body').on('click','.action-input .amount_up, .action-input .amount_down', function() {
        let input = $('#betform-amount'),
            inputVal = input.val();

        if($(this).hasClass('amount_up')) {
            let num = Number(inputVal) + 0.0001;
            input.val(num.toFixed(4));
        } else {
            if(input.val() <= minBtcBet) return false;
            let num = Number(inputVal) - 0.0001;
            input.val(num.toFixed(4));
        }
        input.trigger('keyup');
        setProfit();
    })
}

function autoresizeChat(e) {
    let input = $('.emoji-wysiwyg-editor.form-control'),
        button = $('#send_chat_message'),
        chat = $('#chat'),
        height = input.outerHeight( true );


        if(height >= 150 || height < 60) return;

        button.css('height', height + 'px');
        chat.css({'min-height': `calc(100vh - ${height}px)`, 'max-height': `calc(100vh - ${height}px)`});
}

function genareteQrCode() {
    qrCode = new QRCode($('#generatedQrCode')[0], {
        text: $('#generatedQrCode').data('code'),
        width: 220,
        height: 200,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });
}

function copyBanner() {
    $('.copy-banner-btn').on('click', function() {
        $('<input>', {
            type: "text",
            class: "banner_input"
        }).appendTo('body');

        let link = $(this).data('link'),
            img = $(this).data('img'),
            js = $(this).data('js');

        $('input.banner_input').val('<div class="betller-banner"><script type="text/javascript" src="' + js +'"></script><div data-img="' + img +'" data-link = "' + link +'" id="betller-banner__container"></div></div>');

        $('input.banner_input').select();
        document.execCommand("copy");

        $('input.banner_input').remove();
        showLabel($('.copy-label'));
    })
}

function toggleLangContentOnMobile() {
    $('.link.language .trigger').on('click', function() {
        let langMenu = $(this).next('ul'),
            parent = $(this).parent();

        if(parent.hasClass('active')) {
            parent.removeClass('active');
            langMenu.slideUp(200);

            return false;
        }

        parent.addClass('active');
        langMenu.slideDown(200);

    })
}

function scrollDown() {

    let chat = document.getElementById('chat');

    if(chat !== null) {
        chat.scrollTop = chat.scrollHeight;
    }

}

function messageLike({message_id, user_id}) {
    let message = $('#chat').find('*[data-id="'+message_id+'"]');
    let count = Number(message.find('div.like__counter').text()) + 1;

    message.find('div.like__counter').text(count);

    if (count === 1) {
        message.find('div.message__set-like').addClass('liked');
    }
}

function createMessageItem({username, image, message, time, isAdmin, messageId, replay, locale}) {
    if (locale !== $('div.chat-locale span.lang').attr('data-locale')) {
        return false;
    }
    let class_name = 'name',
        isReply = '';

    if(replay) {
        const { image, message, username } = replay;

        isReply = '<div class="reply"><div class="reply-user">' + username +'</div><div class="reply-text">' + message +'</div></div>'
    }

    if(isAdmin){
        class_name += ' red';
    }

    message = message.replace(/(\r\n|\n|\r)/gm, "<br />");

    let messageContent = '<div class="message" data-id="'+messageId+'">' +
        '<div class="content"><div class="row space-between"><div class="row align-center">' +
        '<div class="img__container"><img src="' +image + '" alt="user ' + username + '"></div>' +
        '<div class="' + class_name + '">'+ username +'</div></div><div class="row align-center">' +
        '<div class="message__reply-btn"><i class="material-icons">reply</i></div>' +
        '<div class="message__set-like" data-like="'+messageId+'"><i class="material-icons size_l">thumb_up_alt</i>' +
        '<div class="like__counter"></div></div></div></div>' + isReply +'<div class="text">'+ message +'</div></div></div>';
    $('#chat').append(messageContent);
}

function preloadProfilePhoto(item) {
    let file = item[0].files[0],
        img = $('.profile-img__container img'),
        reader = new FileReader();

    img[0].file = file;

    reader.onload = (function(aImg) {
        return function(e) {
            aImg.attr('src', e.target.result);
        };
    })(img);
    reader.readAsDataURL(file);
}


function onClickCopy() {
    $('.input-copy, .copy-val-btn').on('click', copyToClipboard);
}

function initStyler() {
    if(
        $('select.select-curr').length !== 0 ||
        $('input.theme-change-btn').length !== 0 ||
        $('select.select_dropdown').length !== 0
        ) {
        $('select.select-curr, input.theme-change-btn, select.select_dropdown').styler();
    }
}

function checkCookies() {
    let darkTheme = document.cookie.search('default');

    if(darkTheme === -1) {
        if(document.cookie.search('white') !== -1){
            $('body').addClass('white-theme');
        }else{
            // document.cookie = "theme=default";
        }
    }
}

function onDimmerClick() {
    $('body').on('click', '.dimmer', function() {
        $('.dimmer').removeClass('active');
        $('body').removeClass('scroll-hidden');
        $('.modal').removeClass().addClass('modal');
        $('.popup').removeClass('active');

        if($('#generatedQrCode').length) {
            $('#generatedQrCode').children().remove();
            qrCode.clear();
        }
    })
}

function onWindowResize() {
    $(window).resize(function() {
        if($(window).width() <= 1200) {
            $('.toggle-chat-btn').addClass('main-content');
            $('.main__container').prepend($('.toggle-chat-btn'));
        } else if($(window).width() > 1200 && $(window).width() < 1366) {
            $('.toggle-chat-btn').removeClass('main-content');
            $('.chat__container .action-chat').prepend($('.toggle-chat-btn'));
        }

        if($(window).width() > 768) {
            let menu = $('header').find('[class*="mobile-main-menu"]');

            menu.hide();
            $('header').removeClass('active')
        }
    });
}

function setActiveBtn() {
    $('body').on('click', '.button.bet_type', function() {
        $('.button.bet_type').removeClass('active');

        $(this).addClass('active');

        if($(this).hasClass('trading_down')) {
            $('.timer-row-colored')
                .removeClass('green')
                .addClass('red');
        } else {
            $('.timer-row-colored')
                .removeClass('red')
                .addClass('green');
        }
    })
}

function setCaretPosition(ctrl, pos) {
    // Modern browsers
    if (ctrl.setSelectionRange) {
      ctrl.focus();
      ctrl.setSelectionRange(pos, pos);
    
    // IE8 and below
    } else if (ctrl.createTextRange) {
      var range = ctrl.createTextRange();
      range.collapse(true);
      range.moveEnd('character', pos);
      range.moveStart('character', pos);
      range.select();
    }
  }

function checkBetInputVal() {
    $('body').on('keydown keyup input', '.bet-input, #withdraw_amount', function(event) {
        let value = $(this).val(),
            valLen = value.length,
            pointPosition = value.indexOf('.'),
            leftSideInput = pointPosition !== -1 ? pointPosition : valLen,
            rightSideInput = pointPosition !== -1 ? valLen - pointPosition : 0,
            key = event.keyCode || event.which || event.code;

        if (value.match(/[a-zа-я]/i)) {
            $(this).val(value.replace(/[a-zа-я]/i, ''));
        }

        if(value.match(/[,]/g)) {
            $(this).val(value.replace(/[,]/g, '.'));
        }
        
        if(value.match(/\./g)) {
            if(value.match(/\./g).length > 0 && (key === 190 || key === 188)) {
                return false;
            }
        }

        if(key === undefined){
            return false;
        }

        if(key === 37 || key === 39){
            // do nothing;
        }else {
            if(key !== 8){
                console.log(value[0]);
                if(value[0] === '0'){
                    if(pointPosition === -1){
                        let val = value.substr(1);
                        $(this).val("0." + val);
                    }else{
                        setCaretPosition(this, valLen);
                    }
                }
            }
            
            if(leftSideInput === 8) {
                if(pointPosition !== -1) {
                    if(key !== 8){
                        if(rightSideInput > 1){
                            setCaretPosition(this, valLen);
                        }else{
                            setCaretPosition(this, 10)
                        }
                    }
                } else {
                    if(key !== 8){
                        $(this).val(value += ".");
                    }
                    
                }
            }
        }

        if(valLen > 18 || rightSideInput > 5) {
            $(this).val(value.slice(0, -1) + '')
        }

    })

    $('.bet-input').on('blur', function() {
        let val = Number($(this).val());

        if(val < minBtcBet ) {
            $(this).val(minBtcBet);
        }
    })
}

function showTooltip() {
    $('.tooltip-btn').on('click', function(event) {
        let tooltip = $(this).next('.tooltip');

        if($(this).hasClass('active')) {
            $(this).removeClass('active');
            tooltip.slideUp(200);

            return false;
        }

        $('.tooltip').slideUp(200);
        $('.tooltip-btn').removeClass('active');
        $(this).addClass('active');
        tooltip.slideDown(200);
    })
}

function countNumOfInputVal() {
    $('#chat_input').on('cange input keydown', function() {
        let length = $(this).val().length,
            maxNum = 160,
            rate = maxNum - length,
            value = $(this).val(),
            maxRate = length - maxNum;

        if(length > maxNum) {
            $('.text-counter').text('0');
            $(this).val(value.substring(0, value.length - maxRate))
        }

        if(rate >= 0) {
            $('.text-counter').text(rate)
        }
    })
}

let initGameTimer = null;

function gameTimer(param) {
    let seconds = 60,
        minutes = seconds / 60,
        secondsinMinutes = 60,
        row_width = 0,
        restSec = null;

    if(param) {
        clearInterval(initGameTimer);
        restSec = seconds - param;
        row_width = restSec * 1.66;
        seconds = param;

        $('.timer-row-colored').css({
            'width': row_width + "%"
        })

        if(seconds % 60 === 0) {
            minutes = seconds / 60;
            secondsinMinutes = 60;
        } else {
            let timeStr = (seconds / 60).toString();
            minutes = Number(timeStr.substr(0, timeStr.indexOf('.'))) + 1;
            secondsinMinutes = seconds % 60;
        }
    }

    secondsinMinutes--
    $('#game_timer').find('.seconds').text(secondsinMinutes);
    minutes--;
    $('#game_timer').find('.minutes').text('00');

    initGameTimer = setInterval(function() {

        if (seconds > 0) {
            seconds-- ;
            secondsinMinutes--;
            let width_count = row_width += 1.66;

            $('.timer-row-colored').css({
                'width': width_count + "%"
            });

            if(secondsinMinutes < 0) {
                secondsinMinutes = 59;
                minutes--;
                $('#game_timer').find('.minutes').text('00')
            }

            if(seconds.toString().length !== 1) {
                $('#game_timer').find('.seconds').text(seconds);
                $('.label-timer').text(seconds);
            } else {
                $('#game_timer').find('.seconds').text('0' + seconds);
                $('.label-timer').text('0' + seconds);
            }



        } else {
            clearInterval(initGameTimer);
            $('#game_timer').find('.minutes').text('00');
            $('#game_timer').find('.seconds').text('00');
            $('.label-timer').text('00');
            $('.timer-row-colored').css('width', '100%');
        }
    }, 1000);
}

function rulesAccordion() {
    if($('.accordion-item').length !== 0) {
        $('.accordion-item').each(function() {
            let content = $(this).find('.content'),
                icon = $(this).find('.accordion-header i');

            if($(this).hasClass('active')) {
                content.slideDown();
                icon.text('expand_less');
            }
        });


        $(".accordion-item").on("click", function() {
            if ($(this).hasClass("active")) {
                $(this).removeClass("active");
                $(this)
                    .find(".content")
                    .slideUp(200);
                $(this)
                    .find("i")
                    .text('expand_more')
            } else {
                $(".accordion-item > .accordion-header i")
                    .text('expand_more')
                $(this)
                    .find("i")
                    .text('expand_less')
                $(".accordion-item").removeClass("active");
                $(this).addClass("active");
                $(".accordion-item .content").slideUp(200);
                $(this)
                    .find(".content")
                    .slideDown(200);
            }
        });
    }
}

function pageContentInit() {
    if($('.chat__container').is(':hidden') || $('.chat__container').length === 0) {
        if($(window).width() > 1200) {
            $('footer').addClass('full-with-pad');
        } else if($(window).width() <= 768) {
            $('footer').addClass('full-without-pad');
        }

        $('.header-main').addClass('full');
        $('.header-chat').addClass('hidden');
        $('.main__container').addClass('full');
        $('.news-row .news-item').addClass('small')
    } else {
        $('.container-m').addClass('big');
    }

    if($(window).width() <= 1200) {
        $('.toggle-chat-btn').addClass('main-content');
        $('.main__container').prepend($('.toggle-chat-btn'));
    } else if($(window).width() > 1200 && $(window).width() < 1366) {
        $('.toggle-chat-btn').removeClass('main-content');
        $('.chat__container .action-chat').prepend($('.toggle-chat-btn'));
    }
}


function faqAccordion() {
    $(".accordion").on("click", function() {
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
            $(this)
                .find(".content")
                .slideUp(200);
            $(this)
                .find("i")
                .text('add_circle_outline')
                .removeClass('white')
        } else {
            $(".accordion > .header i")
                .text('add_circle_outline')
                .removeClass('white')
            $(this)
                .find("i")
                .text('cancel')
                .addClass('white')
            $(".item").removeClass("active");
            $(this).addClass("active");
            $(".content").slideUp(200);
            $(this)
                .find(".content")
                .slideDown(200);
        }
    });
}

function showCookies() {
    if($('.cookies').length !== 0) {
        setTimeout(function() {
            $('.cookies').addClass('active');
        }, 1000)
    }
}

function closeCookies() {
    let btn = [$('.cookies-accept-btn'), $('.cookies-close-btn')];

    $.each(btn, function() {
        $(this).on('click', function() {
            $('.cookies').removeClass('active');
        })
    })
}

function setCheckbox() {
    let btn = [$('.checkbox-i'), $('.checkbox-label')];

    $.each(btn, function() {
        $(this).on('click', function() {
            let checkbox = $(this).siblings('input'),
                icon = $(this).hasClass('checkbox-i') ? $(this) : $(this).siblings(('.checkbox-i'));

            if(checkbox.length === 0){
                checkbox = $(this).siblings('.form-group').find('input[type=checkbox]');
            }

            if(checkbox.is(':checked')) {
                checkbox.prop('checked', false);
                icon.text('check_box_outline_blank').removeClass('green');

                return false;
            }

            checkbox.prop('checked', true);
            icon.text('check_box').addClass('green');
        })
    })
}

function validPass() {
    const animateRow = (width, color) => {
        $('.valid-pass-row .line').animate({
            width : width,
            backgroundColor : color
        }, 200);
    }

    $('#pass_input').on('change input', function() {
        let length = $(this).val().length;

        if(length >= 4 && length < 8) {
            $('.valid-pass-row').show();
            animateRow('33.3%', '#FF2D4D');
        } else if(length >= 8 && length < 16) {
            animateRow('66.6%', '#FED248');
        } else if(length >= 16) {
            animateRow('100%', '#00C58C');
        } else if(length < 4) {
            animateRow('0', 'transparent');
            $('.valid-pass-row').hide();

        }
    })
}

function tab() {
    $('body').on('click', '.tab-container .item', function() {
        let tab = $(this).data('tab');

        $('.tab-container .item').removeClass('active');
        $(this).addClass('active');

        $('.tab-content-container .item').each(function() {
            let tabContent = $(this).data('tab-content');

            if(tabContent === tab) {
                $('.tab-content-container .item').removeClass('active');
                $(this).addClass('active');
            }
        })
    })
}

function placeBet() {
    $('#placeBetBtn').on('click', function() {
        $('.game__container').find('.overflow').show();
        $('.modal-bets').show();

        setTimeout(function() {
            $('.game__container').find('.overflow').hide();
            $('.modal-bets').hide();
        }, 3000)
    })
}

function openNotifications() {
    $('body').on('click', '.notifications-btn', function(event) {

        if( $(".notifications").hasClass('active')) {
            $(".notifications").removeClass('active').slideUp(200);

            return false;
        }

        $(".notifications").addClass('active').show({
            start: function () {
                $(this).css({
                    display: "flex"
                })
            }
        }, 200);
    })
}

function toggleMobileNotifications() {
    $('.notifications-mobile-btn').on('click', function() {
        if($('header').hasClass('active')) {
            let menu = $('header').find('[class*="mobile-main-menu"]');
            $('header').removeClass('active');
            menu.slideUp(200);
        }

        if( $(".notifications--mobile").hasClass('active')) {
            $('body').removeClass('scroll-hidden');
            $(".notifications--mobile").removeClass('active').slideUp(200);

            return false;
        }

        $('body').addClass('scroll-hidden');
        $(".notifications--mobile").addClass('active').slideDown(200);
    })
}

function readNotifications() {
    let btn = [$('.make-all-read-btn'), $('.close-notification-btn')];

    $.each(btn, function() {
        $(this).on('click', function() {
            if($(this).hasClass('make-all-read-btn')) {
                $(".notifications .item").slideUp(200);

                setTimeout(function() {
                    $('.notifications-btn').trigger('click');
                }, 250)

            } else {
                $(this).parent().slideUp(200);
            }
        })

    })
}

function showTransactionLabel(label) {
    $('.transaction-label').addClass(label + ' active');

    setTimeout(() => {
        $('.transaction-label').removeClass(label + ' active');
    }, 3000);
}

function showGameBanner() {
    $('.game-banner').addClass('active');

    setTimeout(() => {
        $('.game-banner').removeClass('active');
    }, 3000);
}

// function showTableModal() {
//     $('.table-bets .tbody .tr.pointer').on('click', function() {
//         modalName = $(this).data('modal');
//
//         $('.dimmer').addClass('active');
//         $('body').addClass('scroll-hidden');
//         $('.modal').addClass(modalName + ' active');
//     })
// }

function toggleChat() {
    $('.toggle-chat-btn').on('click', function() {

        if($(window).width() <= 1200) {
            if(!$('.chat__container').hasClass('active')) {
                scrollDown();
                $(this).removeClass('main-content');
                $('.chat__container .action-chat').prepend($(this));
                $('.chat__container').addClass('active');
                $('.container-m').addClass('big');
                $('.news-row .news-item').removeClass('small');
                $('footer').removeClass('full-with-pad');
                $('.header-main').removeClass('full');
                $('.main__container').removeClass('full');
                $('.header-chat').addClass('active');

                if($(window).width() <= 768) {
                    $('body').addClass('scroll-hidden')
                }
            } else {
                $(this).addClass('main-content');
                $('.main__container').prepend($(this));
                $('.chat__container').removeClass('active');
                $('.header-chat').removeClass('hidden');
                $('.container-m').removeClass('big');
                $('.news-row .news-item').addClass('small');
                $('.header-main').addClass('full');
                $('.main__container').addClass('full');
                $('.header-chat').removeClass('active');

                if($(window).width() <= 768) {
                    $('body').removeClass('scroll-hidden')
                }
            }

            return false;
        }

        if($('.chat__container').hasClass('hidden')) {
            scrollDown();
            $(this).removeClass('main-content');
            $('.chat__container .action-chat').prepend($(this));
            $('.chat__container').removeClass('hidden');
            $('.container-m').addClass('big');
            $('.news-row .news-item').removeClass('small');

            if($(window).width() > 1200) {
                $('.header-chat').removeClass('hidden');
            }

            if($(window).width() <= 768) {
                $('body').addClass('scroll-hidden');
            }

            $('footer').removeClass('full-with-pad');
            $('.header-main').removeClass('full');
            $('.main__container').removeClass('full');

            return false;
        }

        $(this).addClass('main-content');
        $('.main__container').prepend($(this));
        $('.chat__container').addClass('hidden');
        $('.header-chat').addClass('hidden');
        $('.container-m').removeClass('big');
        $('.news-row .news-item').addClass('small');

        if($(window).width() > 1200) {
            $('footer').addClass('full-with-pad');
        }

        $('body').removeClass('scroll-hidden');
        $('.header-main').addClass('full');
        $('.main__container').addClass('full');

    })
}


function changeTheme() {
    let theme = 'default';
    $('.theme-change-btn').on('click', function() {
        if($('body').hasClass('white-theme')) {

            $('body').removeClass('white-theme');
            theme = 'default';
            getThemeByParam('Dark');
        }else{
            theme = 'white';
            $('body').addClass('white-theme');
            getThemeByParam('Light');
        }
        document.cookie = "theme=" + theme + ';path=/';
    })
}

function toggleMobileMainMenu() {
    $('.mobile-menu-btn').on('click', function() {
        let menu = $('header').find('[class*="mobile-main-menu"]');

        if($('.notifications--mobile').hasClass('active')) {
            $('.notifications--mobile').removeClass('active').slideUp(200);
        }

        if($('header').hasClass('active')) {
            $('body').removeClass('scroll-hidden');
            $('header').removeClass('active');
            menu.slideUp(200);

            return false;
        }

        $('body').addClass('scroll-hidden');
        $('header').addClass('active');
        menu.slideDown(200);
    })
}

function toggleMobileSecondaryMenu() {
    $('.dropdown-secondary-menu .menu').on('click', function() {
        let list = $(this).siblings('.menu-list');

        if($(this).hasClass('active')) {
            $(this).removeClass('active');
            list.slideUp(200);

            return false;
        }

        $(this).addClass('active');
        list.slideDown(200);
    })
}


function copyToClipboard(element) {
    if($(this).hasClass('copy-val-btn')) {
        let val = $('input.wallet-code').val($('input.wallet-code').val());

        val.select();
        document.execCommand("copy");

        showLabel($('.copy-label'));

        return false;
    }

    let $temp = $(this).find('input'),
        val = $temp.val($temp.val());

    val.select();
    document.execCommand("copy");

    showLabel($('.copy-label'));
}

function showLabel(name) {
    name.addClass('active');


    setTimeout(function() {
        name.removeClass('active');
    }, 3000)
}

function showPopup(name) {
    if(typeof name !== 'undefined') {
        $('.dimmer').addClass('active');
        $('body').addClass('scroll-hidden');
        $('.popup.' + name).addClass('active');

        return false;
    }

    $('body').on('click', '.show-popup-btn', function() {
        let popupName = $(this).data('popup');

        if(popupName === 'qrcode') genareteQrCode();

        $('.dimmer').addClass('active');
        $('body').addClass('scroll-hidden');
        $('.popup.' + popupName).addClass('active');
    })
}

function closePopup() {
    $('body').on('click', '.close-popup-btn', function() {
        $('.dimmer').removeClass('active');
        $('body').removeClass('scroll-hidden');
        $('.popup').removeClass('active');

        if($('#generatedQrCode').length) {
            $('#generatedQrCode').children().remove();
            qrCode.clear();
        }
    })
}

function getThemeByParam(param) {
    if($('.tradingViewChartContainer').length !== 0) {
        if(param === 'Light') {
            initTradingWidget('#eee', '#1E243A');
        } else {
            initTradingWidget('#292d44', '#fff');
        }
        tradingViewChart.reload()
    }
}

function initTradingWidget(background, textColor) {
    setTimeout(function() {
        if($('.tradingViewChartContainer').length !== 0) {
            tradingViewChart = new TradingView.widget(
                {
                    "width": '100%',
                    "height": '100%',
                    "symbol": "BINANCE:BTCUSDT",
                    "interval": "1",
                    "timezone": "Asia/Jerusalem",
                    "style": "1",
                    "locale": "en",
                    "enable_publishing": false,
                    "withdateranges": false,
                    "toolbar_bg": 'rgb(37, 42, 66)',
                    "hide_side_toolbar": true,
                    "hide_top_toolbar": true,
                    "hide_legend": false,
                    "show_popup_button": false,
                    disabled_features: ["use_localstorage_for_settings"],
                    "container_id": "tradingview_d4f7f",
                    "overrides": {
                        "mainSeriesProperties.style": 0,
                        "symbolWatermarkProperties.color" : "#944",
                        "volumePaneSize": "tiny",
                        "symbolWatermarkProperties.color": "rgba(0, 0, 0, 0)",
                        "scalesProperties.backgroundColor" : "rgb(0,162,163)",
                        "scalesProperties.textColor": textColor,
                        "paneProperties.vertGridProperties.color": "#363c4e",
                        "paneProperties.crossHairProperties.transparency": 100,
                        "paneProperties.horzGridProperties.color": "#363c4e",
                        "paneProperties.background": background,
                        "mainSeriesProperties.barStyle.downColor": "rgb(255,45,77)",
                        "mainSeriesProperties.barStyle.upColor": "rgb(54,181,112)",
                        "mainSeriesProperties.candleStyle.borderColor": "rgb(54,181,112)",
                        "mainSeriesProperties.candleStyle.borderDownColor": "rgb(255,45,77)",
                        "mainSeriesProperties.candleStyle.borderUpColor": "rgb(54,181,112)",
                        "mainSeriesProperties.candleStyle.downColor": "rgb(255,45,77)",
                        "mainSeriesProperties.candleStyle.upColor": "rgb(54,181,112)",
                        "mainSeriesProperties.candleStyle.wickDownColor": "rgb(255,45,77)",
                        "mainSeriesProperties.candleStyle.wickUpColor": "rgb(54,181,112)",
                        "mainSeriesProperties.haStyle.borderDownColor": "rgb(255,45,77)",
                        "mainSeriesProperties.haStyle.borderUpColor": "rgb(54,181,112)",
                        "mainSeriesProperties.haStyle.downColor": "rgb(255,45,77)",
                        "mainSeriesProperties.haStyle.upColor": "rgb(54,181,112)",
                        "mainSeriesProperties.haStyle.wickDownColor": "rgb(255,45,77)",
                        "mainSeriesProperties.haStyle.wickUpColor": "rgb(54,181,112)",
                        "mainSeriesProperties.hollowCandleStyle.borderDownColor": "rgb(255,45,77)",
                        "mainSeriesProperties.hollowCandleStyle.borderUpColor": "rgb(54,181,112)",
                        "mainSeriesProperties.hollowCandleStyle.downColor": "rgb(255,45,77)",
                        "mainSeriesProperties.hollowCandleStyle.upColor": "rgb(54,181,112)",
                        "mainSeriesProperties.hollowCandleStyle.wickDownColor": "rgb(255,45,77)",
                        "mainSeriesProperties.hollowCandleStyle.wickUpColor": "rgb(54,181,112)",
                        "mainSeriesProperties.pbStyle.borderDownColor": "rgb(255,45,77)",
                        "mainSeriesProperties.pbStyle.borderUpColor": "rgb(54,181,112)",
                        "mainSeriesProperties.pbStyle.borderUpColorProjection": "rgb(54,181,112)",
                        "mainSeriesProperties.pbStyle.borderDownColorProjection": "rgb(255,45,77)",
                        "mainSeriesProperties.pbStyle.downColor": "rgb(255,45,77)",
                        "mainSeriesProperties.pbStyle.upColor": "rgb(54,181,112)",
                        "mainSeriesProperties.pbStyle.downColorProjection": "rgb(255,45,77)",
                        "mainSeriesProperties.pbStyle.upColorProjection": "rgb(54,181,112)",
                        "mainSeriesProperties.pnfStyle.borderDownColor": "rgb(255,45,77)",
                        "mainSeriesProperties.pnfStyle.borderUpColor": "rgb(54,181,112)",
                        "mainSeriesProperties.pnfStyle.borderUpColorProjection": "rgb(54,181,112)",
                        "mainSeriesProperties.pnfStyle.borderDownColorProjection": "rgb(255,45,77)",
                        "mainSeriesProperties.pnfStyle.downColor": "rgb(255,45,77)",
                        "mainSeriesProperties.pnfStyle.upColor": "rgb(54,181,112)",
                        "mainSeriesProperties.pnfStyle.downColorProjection": "rgb(255,45,77)",
                        "mainSeriesProperties.pnfStyle.upColorProjection": "rgb(54,181,112)",
                    },
                    "loading_screen": {
                        "backgroundColor": "#292d44",
                    },
                }
            );

            return tradingViewChart;
        }
    }, 0)
}

function initTFACarousel() {
    if($('.tfa-carousel').length !== 0) {
        $('.tfa-carousel').slick({
            dots: true,
            infinite: false,
            speed: 300,
            slidesToShow: 1,
            adaptiveHeight: true,
            responsive: false,
            prevArrow: '<button type="button" class="prev-step button">Previous Step</button>',
            nextArrow: '<button type="button" id="nextStep" class="next-step button">Next Step</button>',
            appendArrows: '.button-row',
            appendDots: '.dots-row',
            swipe: false
        });

        $('.tfa-carousel').on('init reInit afterChange', function(event, slick, currentSlide, nextSlide){
            let i = (currentSlide ? currentSlide : 0) + 1;
            
            if(i === 3) {
                $('.next-step.button.slick-arrow').hide();
                $('.two_factor_auth').show();
                $('.button-row').append($('.two_factor_auth'));
                $('input#twofactorauthorizationform-code_1').focus();
            } else {
                $('.next-step.button.slick-arrow').show();
                $('.two_factor_auth').hide();
            }
        });
    }
}

function codeTFAGenerate() {
    let ctrlDown = false,
        cmdKey = 91,
        ctrlKey = 17;

    $(document).keydown(function(e) {
        if (e.keyCode == ctrlKey || e.keyCode == cmdKey) ctrlDown = true;
    }).keyup(function(e) {
        if (e.keyCode == ctrlKey || e.keyCode == cmdKey) ctrlDown = false;
    });

    $('body').on('change input keydown', '#codeGenerateRow input', function(e) {
        let val = $(this).val(),
            valLen = $(this).val().length,
            nextInput = $(this).parents(1).next('.form-group').find('input'),
            prevInput = $(this).parents(1).prev('.form-group').find('input');
 
        if(ctrlDown && e.keyCode === 86) {
            navigator.permissions.query({
                name: 'clipboard-read'
              }).then(permissionStatus => {
                if(permissionStatus.state === 'granted') {
                    navigator.clipboard.readText()
                        .then(text => {
                            text.split('').map((item, index) => {
                                $('#codeGenerateRow .form-group').find('input')[index].value = item;
                                $('#codeGenerateRow .field-twofactorauthorizationform-code_7 input').focus();
                            })
                        })
                        .catch(err => {
                            console.error('Failed to read clipboard contents: ', err);
                        });
                } else {
                    console.error('Using of clipboard is denied')
                }
                // permissionStatus.onchange = () => {
                //   console.log(permissionStatus.state);
                // };
              });
        }

        if(e.keyCode === 39) {
            nextInput.focus();
        }

        if(e.keyCode === 37) {
            prevInput.focus();
        }

        if(e.keyCode === 8 && valLen === 0) {
            prevInput.focus();
        }

        if(valLen === 1 && e.keyCode !== 8) {
            nextInput.focus();
        }

        if(valLen > 1) {
            $(this).val(val.substring(valLen - 1));
        }
    })
}
