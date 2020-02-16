var ajaxProperties = {};

var infoComponent = {

    run: function(type, message, title) {
        showToastrMessage(message, type, title);
    },
};
/**
 *
 * @param msg
 * @param kind success, error, info, warning
 * @param title
 */
function showToastrMessage(msg, kind, title)
{
    toastr.options = {
        "closeButton": false,
        "debug": false,
        "positionClass": "toast-top-right",
        "onclick": null,
        "showDuration": "2000",
        "hideDuration": "2000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };

    var $toast = toastr[kind](msg, title); // Wire up an event handler to a button in the toast, if it exists
}

function toastrSuccess(message, title)
{
    showToastrMessage(message, 'success', title);
}

function toastrError(message, title)
{
    showToastrMessage(message, 'error', title);
}

function toastrInfo(message, title)
{
    showToastrMessage(message, 'info', title);
}

function toastrWarning(message, title)
{
    showToastrMessage(message, 'warning', title);
}