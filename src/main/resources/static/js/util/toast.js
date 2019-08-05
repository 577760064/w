var toast = function(){
    var options={
        "closeButton": false,
        "debug": false,
        "positionClass": "toast-top-right",
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };
    return {
        success:function(msg){
            msg =  msg || i18n['common.operator.success'];
            toastr.options=options;
            toastr["success"](msg)
        },
        info:function(msg){
            toastr.options=options;
            toastr["info"](msg)
        },
        warning:function(msg){
            toastr.options=options;
            toastr["warning"](msg)
        },
        error:function(msg){
            msg =  msg || i18n['common.operator.error'];
            toastr.options=options;
            toastr["error"](msg)
        }
    }
}();