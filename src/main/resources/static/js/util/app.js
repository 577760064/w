var app = function () {

    var $dialog;

    var assetsPath = '../';

    var globalImgPath = 'img/';

    var confirmDefaultOptions = {
        callback: function () {

        }
        //confirmContent: plugin.confirmContent,
        //confirmTitle: plugin.confirmTitle,
        //confirmBtn: plugin.confirmConfirmBtn,
        //cancelBtn: plugin.confirmCancelBtn
    };

    var initValidation = function () {
        $.validator.setDefaults({
            errorElement: 'span',
            errorClass: 'help-block help-block-error',
            focusInvalid: true,
            ignore: "",
            highlight: function (element) {
                $(element).closest('.form-group').addClass('has-error');
            },
            unhighlight: function (element) {
                $(element).closest('.form-group').removeClass('has-error');
            },
            success: function (label) {
                label.closest('.form-group').removeClass('has-error');
            },
            invalidHandler: function (event, validator) {

            }
        });
    };

    var ajaxInit = function () {
        $.ajaxSetup({
            cache: false,
            error: doError,
            dataType: "json"
        });
    };

    function doError(data) {
        app.unblockUI();
        if (data.status === 404) {
            // toast.error(plugin.ajaxError);
            return
        }
        if (data.status === 500) {
            // toast.error(plugin.ajaxError);
            return
        }
        if (data.statusText.indexOf("Failure") !== -1) {
            // toast.error(plugin.ajaxError);
            return
        }
        if (data.statusText === "timeout") {
            // toast.error(plugin.ajaxError);
        } else {
            toast.error(data.responseText);
        }
    }

    return {
        init: function () {
            initValidation();
            ajaxInit();

        },
        showDeleteConfirm: function (config) {
            $.extend(confirmDefaultOptions, config);
            $dialog = $("#modalDialog");
            var htmlTemplate = global.remoteTemplate('/template/common/deleteConfirm.html', {
                confirmContent: confirmDefaultOptions.confirmContent,
                confirmBtnId: 'confirm',
                confirmTitle: confirmDefaultOptions.confirmTitle,
                confirmBtn: confirmDefaultOptions.confirmBtn,
                cancelBtn: confirmDefaultOptions.cancelBtn
            });
            $dialog.html(htmlTemplate);
            $dialog.on('shown.bs.modal', function () {
                $("#confirm").off().on('click', function () {
                    confirmDefaultOptions.callback();
                })
            });
            $dialog.modal('show');

        },
        hideModal: function () {
            if ($dialog) {
                $dialog.modal('hide');
            }
        },
        showDialog: function (config) {
            var defaultConfig = {
                url: '',
                data: {},
                dialogId: 'modalDialog',
                callback: function () {

                }
            };
            $.extend(defaultConfig, config);
            $dialog = $("#" + defaultConfig.dialogId);
            var htmlTemplate = global.remoteTemplate(defaultConfig.url, {data: defaultConfig.data});
            $dialog.html(htmlTemplate);
            $dialog.on('shown.bs.modal', function () {
                defaultConfig.callback();
            });
            $dialog.modal('show');

        },
        alert: function (options) {

            options = $.extend(true, {
                container: "", // alerts parent container(by default placed after the page breadcrumbs)
                place: "append", // "append" or "prepend" in container
                type: 'success', // alert's type
                message: "", // alert's message
                close: true, // make alert closable
                reset: true, // close all previouse alerts first
                focus: true, // auto scroll to the alert after shown
                closeInSeconds: 0, // auto close after defined seconds
                icon: "" // put icon before the message
            }, options);

            var id = app.getUniqueID("App_alert");

            var html = '<div id="' + id + '" class="custom-alerts alert alert-' + options.type + ' fade in">' + (options.close ? '<button type="button" class="close" data-dismiss="alert" aria-hidden="true"></button>' : '') + (options.icon !== "" ? '<i class="fa-lg fa fa-' + options.icon + '"></i>  ' : '') + options.message + '</div>';

            if (options.reset) {
                $('.custom-alerts').remove();
            }

            if (!options.container) {
                if ($('.page-fixed-main-content').size() === 1) {
                    $('.page-fixed-main-content').prepend(html);
                } else if (($('body').hasClass("page-container-bg-solid") || $('body').hasClass("page-content-white")) && $('.page-head').size() === 0) {
                    $('.page-title').after(html);
                } else {
                    if ($('.page-bar').size() > 0) {
                        $('.page-bar').after(html);
                    } else {
                        $('.page-breadcrumb, .breadcrumbs').after(html);
                    }
                }
            } else {
                if (options.place === "append") {
                    $(options.container).append(html);
                } else {
                    $(options.container).prepend(html);
                }
            }

            if (options.focus) {
                app.scrollTo($('#' + id));
            }

            if (options.closeInSeconds > 0) {
                setTimeout(function () {
                    $('#' + id).remove();
                }, options.closeInSeconds * 1000);
            }

            return id;
        },
        blockUI: function (options) {
            options = $.extend(true, {}, options);
            var html = '';
            if (options.animate) {
                html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '">' + '<div class="block-spinner-bar"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>' + '</div>';
            } else if (options.iconOnly) {
                html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><img src="' + this.getGlobalImgPath() + 'loading-spinner-grey.gif" align=""></div>';
            } else if (options.textOnly) {
                html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><span>&nbsp;&nbsp;' + (options.message ? options.message : plugin.commonLoading) + '</span></div>';
            } else {
                html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><img src="' + this.getGlobalImgPath() + 'loading-spinner-grey.gif" align=""><span>&nbsp;&nbsp;' + (options.message ? options.message : plugin.commonLoading) + '</span></div>';
            }

            if (options.target) { // element blocking
                var el = $(options.target);
                if (el.height() <= ($(window).height())) {
                    options.cenrerY = true;
                }
                el.block({
                    message: html,
                    baseZ: options.zIndex ? options.zIndex : 1000,
                    centerY: options.cenrerY !== undefined ? options.cenrerY : false,
                    css: {
                        top: '10%',
                        border: '0',
                        padding: '0',
                        backgroundColor: 'none'
                    },
                    overlayCSS: {
                        backgroundColor: options.overlayColor ? options.overlayColor : '#555',
                        opacity: options.boxed ? 0.05 : 0.1,
                        cursor: 'wait'
                    }
                });
            } else { // page blocking
                $.blockUI({
                    message: html,
                    baseZ: options.zIndex ? options.zIndex : 1000,
                    css: {
                        border: '0',
                        padding: '0',
                        backgroundColor: 'none'
                    },
                    overlayCSS: {
                        backgroundColor: options.overlayColor ? options.overlayColor : '#555',
                        opacity: options.boxed ? 0.05 : 0.1,
                        cursor: 'wait'
                    }
                });
            }
        },

        unblockUI: function (target) {
            if (target) {
                $(target).unblock({
                    onUnblock: function () {
                        $(target).css('position', '');
                        $(target).css('zoom', '');
                    }
                });
            } else {
                $.unblockUI();
            }
        },

        scrollTo: function (el, offeset) {
            var pos = (el && el.size() > 0) ? el.offset().top : 0;

            if (el) {
                if ($('body').hasClass('page-header-fixed')) {
                    pos = pos - $('.page-header').height();
                } else if ($('body').hasClass('page-header-top-fixed')) {
                    pos = pos - $('.page-header-top').height();
                } else if ($('body').hasClass('page-header-menu-fixed')) {
                    pos = pos - $('.page-header-menu').height();
                }
                pos = pos + (offeset ? offeset : -1 * el.height());
            }

            $('html,body').animate({
                scrollTop: pos
            }, 'slow');
        },
        getUniqueID: function (prefix) {
            return 'prefix_' + Math.floor(Math.random() * (new Date()).getTime());
        },
        ajaxCallback: function (data, returnUrl) {
            if (data.code === '0') {
                toast.success();
                if (returnUrl) {
                    setTimeout(function () {
                        window.location.href = returnUrl;
                    },1000);

                }
            } else {
                app.unblockUI();
                toast.error(data.message);
            }

        },
        ajaxPageCallback: function (data) {
            if (data.code === '0') {
                toast.success();
                return true;
            } else {
                toast.error(data.message);
                return false;
            }
        },
        ajaxLoadCallback: function (data) {
            if (data.code === '0') {
                return true;
            } else {
                toast.error(data.message);
                return false;
            }
        },
        getGlobalImgPath: function() {
            return assetsPath + globalImgPath;
        },
        menuPathAdd: function (menuName) {
            $('#subTitle').html('&nbsp;&gt;&gt;&nbsp;' + menuName);
        },
        clearSubMenu: function () {
            $('#subTitle').html('');
        }
    }

}();
app.init();

function onSortColumnDefault(sortColumn, sortDirection) {
    return {
        sortColumn: sortColumn,
        sortDirection: sortDirection
    }
}

Array.prototype.indexOf = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] === val) return i;
    }
    return -1;
};

Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

String.prototype.startsWith = function(searchString, position){
    return this.substr(position || 0, searchString.length) === searchString;
};
