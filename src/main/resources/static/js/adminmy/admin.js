var admin = function () {
    var grid;
    var $table;
    var trHeaders;
    var dataListUrl;
    var tableColumnSetting;
    var uploader;
    var authTypeStr;
    var goToIndexAdmin = function(){
        window.location.href="adminIndex.html";
    };
    var onSortColumn = function (sortColumn, sortDirection) {
        switch (sortColumn) {
            case "templateName":
                sortColumn = "template_name";
                break;
            case "orderByName":
                sortColumn = "orderby";
                break;
        }
        return onSortColumnDefault(sortColumn, sortDirection);
    };
    var initCertTableSettings = function(){

        trHeaders = '<th id="nameTh">'+colTrueName+'</th>'+
            '<th>'+colRole+'</th>'+
            '<th>'+colMobile+'</th>'+
            '<th>'+colMail+'</th>'+
            '<th>'+certDn+'</th>'+
            '<th>'+colStatus+'</th>'+
            '<th>'+colOperate+'</th>';
        $("#adminTr").html( trHeaders );
        tableColumnSetting = [
            {data: 'trueName', orderable: false,width:"20%",
                render: function(data,type,full){
                    if( data != null && data != undefined && data != '' && data.length > 10 ){
                        return '<span title="'+data+'">'+data.substring(0,10)+' ...</span>';
                    }else{
                        return data;
                    }
                }
            },
            {data: 'role', orderable: false,width:"10%",
                render: function(data,type,full){
                    if( data != null && data != undefined && data != '' && data.length > 12 ){
                        return '<span title="'+data+'">'+data.substring(0,12)+' ...</span>';
                    }else{
                        return data;
                    }
                }
            },
            {data: 'mobile', orderable: false,width:"10%",
                render: function(data,type,full){
                    if( data != null && data != undefined && data != '' && data.length > 10 ){
                        data = data.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
                        return data;
                    }else{
                        if(data == undefined) {
                                return ""
                        }
                        return data;
                    }
                }
            },
            {data: 'mail', orderable: false,width:"15%",
                render: function(data,type,full){
                    if( data != null && data != undefined && data != '' && data.length > 12 ){
                        data = data.replace(/(.{2}).+(.{2}@.+)/, '$1****$2');
                        return '<span title="'+data+'">'+data.substring(0,12)+' ...</span>';
                    }else{
                        if(data == undefined) {
                            return ""
                        }
                        return data;
                    }
                }
            },
            {data: 'dn', orderable: false,width:"20%",
                render: function(data,type,full){
                    if( data != null && data != undefined && data != '' && data.length > 20 ){
                        return '<span title="'+data+'">'+data.substring(0,20)+' ...</span>';
                    }else{
                        return data;
                    }
                }
            },
            {data: 'status', orderable: false,width:"5%",
                render : function(data,type,full){
                    if( data == "1" ){
                        //启用
                        return adminEnable;
                    }else if ( data == "0" ){
                        //停用
                        return adminDisable;
                    }
                }
            },
            {
                data: 'operate', orderable: false,width:"150%",
                render: function (data, type, full) {
                    return template( "actionBtn", { data: data, type: type, full: full, i18n: i18n,roleStr: roleStr,operateStop:operateStop,operateReStart:operateReStart,operateDrop:operateDrop,operateModify:operateModify } );
                }
            }
        ];
    };
    var initAccountTableSettings = function(){
        trHeaders = '<th id="nameTh">'+colTrueName+'</th>'+
            '<th>'+colRole+'</th>'+
            '<th>'+colMobile+'</th>'+
            '<th>'+colMail+'</th>'+
            '<th>'+colStatus+'</th>'+
            '<th>'+colOperate+'</th>';

        $("#adminTr").html( trHeaders );
        tableColumnSetting = [
            {data: 'trueName', orderable: false,width:"20%",
                render: function(data,type,full){
                    if( data != null && data != undefined && data != '' && data.length > 12 ){
                        return '<span title="'+data+'">'+data.substring(0,12)+' ...</span>';
                    }else{
                        return data;
                    }
                }
            },
            {data: 'role', orderable: false,width:"20%",
                render: function(data,type,full){
                    if( data != null && data != undefined && data != '' && data.length > 12 ){
                        return '<span title="'+data+'">'+data.substring(0,12)+' ...</span>';
                    }else{
                        return data;
                    }
                }
            },
            {data: 'mobile', orderable: false,width:"20%",
                render: function(data,type,full){
                    if( data != null && data != undefined && data != '' && data.length > 12 ){
                        data = data.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
                        return '<span title="'+data+'">'+data.substring(0,12)+' ...</span>';
                    }else{
                        if(data == undefined) {
                            return ""
                        }
                        return data;
                    }
                }
            },
            {data: 'mail', orderable: false,width:"20%",
                render: function(data,type,full){
                    if( data != null && data != undefined && data != '' && data.length > 12 ){
                        data = data.replace(/(.{2}).+(.{2}@.+)/, '$1****$2');
                        return '<span title="'+data+'">'+data.substring(0,12)+' ...</span>';
                    }else{
                        if(data == undefined) {
                            return ""
                        }
                        return data;
                    }
                }
            },
            {data: 'status', orderable: false,width:"150%",
                render : function(data,type,full){
                    if( data == "1" ){
                        //启用
                        return adminEnable;
                    }else if ( data == "0" ){
                        //停用
                        return adminDisable;
                    }
                }
            },
            {
                data: 'operate', orderable: false,width:"150%",
                render: function (data, type, full) {
                    return template( "actionBtn", { data: data, type: type, full: full, i18n: i18n,roleStr: roleStr,operateStop:operateStop,operateReStart:operateReStart,operateDrop:operateDrop,operateModify:operateModify } );
                }
            }
        ];
    };
    var initTables = function () {
        authTypeStr = $("#loginType").val();
        if ( authTypeStr == "account" ) {
            /*口令方式登录*/
            dataListUrl = "/api/AdminRestService/v1/admin/" + roleStr + "/account/searchByRole";
            initAccountTableSettings();
        } else if ( authTypeStr == "cert" ) {
            /*证书方式登录*/
            dataListUrl = "/api/ManagerService/manager/v1/" + roleStr + "/cert/searchByRole";
            initCertTableSettings();
        }
        grid = new AdminDataTable();
        $table = $("#adminTable");
        grid.init({
            dataTableTag:"adminTable",
            src: $table,
            onQuery: function (data) {
                data.trueName = $("#trueName").val().trim();
                $("#trueName").val($("#trueName").val().trim());
                data.role = roleStr;
            },
            dataTable: {
                "ajax": {
                    "type": 'post',
                    "url": dataListUrl
                },
                "columns": tableColumnSetting
            }
        });
        grids = grid;
    };

    var initListEvents = function () {
        $table.on('click', 'p.stop', function () {
            var $this = $(this);
            adminid = $table.DataTable().row($this.parents('tr')[0]).data().adminId;
            authType = authTypeStr;
            grids = grid;
            $("#stopone").show();
            $("#stoptwo").show();
        });

        $table.on('click', 'p.start', function () {
            var $this = $(this);
            var adminId = $table.DataTable().row($this.parents('tr')[0]).data().adminId;
            block.blockUI();
            $.ajax({
                type : 'post',
                url : '/api/AdminRestService/v1/admin/' + roleStr + '/updateStatusOn',
                dataType : "json",
                data :{ "a0":adminId,"r0":roleStr },
                "success" : function(resp) {
                    if( resp.code == "0" ){
                        toast.success();
                        grid.reloadTable(false);
                        block.unblockUI();
                    }else{
                        toast.error( resp.message );
                        block.unblockUI();
                    }
                }
            });
        });
        $table.on('click', 'p.delete', function () {
            var $this = $(this);
            adminid = $table.DataTable().row($this.parents('tr')[0]).data().adminId;
            authType = authTypeStr;
            grids = grid;
            $("#admin_adds").show();
            $("#admin_add_cons").show();
        });
    };

    var bindBtnClick = function () {
            $("#addAdmin").on('click', function () {
            window.location.href = "/system/modifyAdmin.html?adminId=0";
            // doPost({'url':roleStr+'/modifyAdmin.html','adminId':'0'});
        });
    };

    /* add script start */

    var operate = "0";

    var validator;
    var validateAccount = true;
    var validatePassword = true;
    var certFileUploaded = false;
    var fileBase = "";
    var initAddData = function(){
        /*初始化角色列表*/
        $.ajax({
            type : 'post',
            url : '/api/AdminRestService/v1/admin/' + roleStr + '/searchRolesByPrefix',
            dataType : "json",
            data :{ "r0" : roleStr },
            "success" : function(resp) {
                if( resp.code == "0" ){
                    if( roleStr != "all" ){
                        /*按角色*/
                        var roleTags ="";

                        var role = resp.data;
                        roleTags += '<p class="form-control-static">' + role.roleDesc + '</p>';

                        $("#roleContainer").html( roleTags );
                    }else{
                        /*系统管理员*/

                        var roleTags ="";

                        for( var i = 0;i<resp.data.length;i++ ){
                            var role = resp.data[i];
                            roleTags += '<label class="checkbox-inline" style="padding-left:20px;"><input type="checkbox" value="'+role.roleId+'" name="roles" >'+role.roleDesc+'</label>';

                        }
                        roleTags += '<div id="roleTip"></div>';
                        $("#roleContainer").html( roleTags );

                        $("input:checkbox[name='roles']").click(function(){

                            var roleCheck = false;

                            $("input:checkbox[name='roles']").each(function() {
                                var att = $(this).prop("checked");
                                if( att ){
                                    roleCheck = true;
                                }
                            });

                            if ( !roleCheck ){

                                var roleTip = '<div class="error" style="display: inline-block; color:#cc5965;margin-left:5px;font-weight: 500;">' + roleSelect + '</div>';

                                $("#roleTip").html( roleTip );

                            }else{
                                $("#roleTip").html( "" );
                            }

                        });

                    }

                }else{
                    toast.error( resp.message );
                }
            }
        });

        if( authType == "account" ){
            /*验证方式：口令验证，开启用户名密码输入框*/
            $("#accountContainer").show();
            $("#passwordGroup").show();
            $("#certContainer").hide();
            $("#a0").blur(function(){
                var inputAccount = $("#a0").val();
                /*获取用户输入的用户名*/
                if( inputAccount == null || inputAccount == undefined || inputAccount == '')
                    return;

                /*查询用户名是否重复*/
                $.ajax({
                    type : 'post',
                    url : '/api/AdminRestService/v1/admin/searchByAccount',
                    dataType : "json",
                    data :{ "a0":inputAccount },
                    "success" : function(resp) {
                        if( resp.code == "0" ){
                            if( resp.data.repeat ){

                                swal({
                                        title: tipConfirm,
                                        text: repeatConfirmTip,
                                        type: "warning",
                                        showCancelButton: true,
                                        confirmButtonColor: "#DD6B55",
                                        confirmButtonText: tipConfirm,
                                        cancelButtonText: tipCancle,
                                        closeOnConfirm: true
                                    },
                                    function(isConfirm) {
                                        if (isConfirm) {
                                            /*确定继续任命*/
                                            operate = "1";
                                            /*重复*/
                                            var repeatAdmin = resp.data;
                                            var roleArray = resp.data.adminRoles;
                                            validateAccount = false;
                                            validatePassword = false;
                                            $("#trueName").val(repeatAdmin.trueName);
                                            $("#mobile").val(repeatAdmin.mobile);
                                            $("#mail").val(repeatAdmin.mail);
                                            /*回显角色*/
                                            $("#p0").attr("disabled","disabled");
                                            $("#p0").val("");
                                            $("#p1").attr("disabled","disabled");
                                            $("#p1").val("");
                                            $('input[type="checkbox"][name="roles"]').each(function () {
                                                $(this).prop("checked", false);
                                            });
                                            for (var i = 0; i < roleArray.length; i++) {
                                                var role = roleArray[i];
                                                $('input[type="checkbox"][name="roles"]').each(
                                                    function () {
                                                        if (role.roleId == $(this).val()) {
                                                            $(this).prop("checked", true);
                                                        }
                                                    }
                                                );
                                            }
                                        }else{
                                            /*不继续任命*/
                                            operate = "0";
                                            $("#a0").val("");
                                            $("#p0").removeAttr("disabled");
                                            $("#p1").removeAttr("disabled");
                                            validateAccount = true;
                                            validatePassword = true;
                                        }
                                    }
                                );

                            }else{
                                validateAccount = true;
                                validatePassword = true
                                operate = "0";
                                $("#p0").removeAttr("disabled");
                                $("#p1").removeAttr("disabled");
                            }

                        }else{
                            toast.error( resp.message );
                        }
                    }
                });
            });
        }else if( authType == "cert" ){
            //关闭账号密码校验
            validateAccount = false;
            validatePassword = false;
            /*验证方式：口令验证，开启开启证书上传组件*/
            $("#accountContainer").hide();
            $("#certContainer").show();
            /*初始化证书上传插件*/
            initAddUploader();
            if( isPs == "true" ){
                /*开启了密码增强*/
                $("#psBlock").show();
            }
        }

    };
    var setX509CertData = function(subject,serialNumber,issuer,notBefore,notAfter){
        //证书主题
        $("#certSubject").attr( "title",htmlEncode(subject) );
        $("#certSubject").html( htmlEncode(subject) );
        //证书序列号
        $("#certNo").attr( "title",htmlEncode(serialNumber) );
        $("#certNo").html( htmlEncode( serialNumber ) );
        //证书颁发者
        $("#certIssure").attr( "title",htmlEncode(issuer) );
        $("#certIssure").html( htmlEncode( issuer ) );
        //有效开始时间
        $("#certNotBefore").attr( "title",htmlEncode(notBefore) );
        $("#certNotBefore").html( htmlEncode( notBefore ) );
        //有效终止时间
        $("#certNotAfter").attr( "title",htmlEncode(notAfter) );
        $("#certNotAfter").html( htmlEncode( notAfter ) );
    };
    /**
     * 使用新上传控件
     */
    var fileUpload = new FileUpload();
    var initAddUploader = function(){
        var template = '  <div class="form-inline">\n' +
            '     <input id="fileNAmes"  type="text" readonly class="form-control filename" style="width: 38%;">\n' +
            '     <span id="file_box" class="selectfile fileinput-button" style="diaplay:block; width:108px !important; height:34px; line-height:34px; text-align:center">\n' +
            '        '+uploadtoolSelect+'' +
            '        <input type="file" unselectable="on"   name="certFile" id="certFile" style="diaplay:block; width:108px !important;" >\n' +
            '     </span>\n' +

            '  </div>\n';

        fileUpload.init({
            template: template,
            fileContainer: 'certFileDiv',
            uploadBtnId: 'certFile',
            url:'/api/ManagerService/manager/v1/uploadX509CertFile',
            autoUpload: true,
            multipart: true,
            addEvent: function (e, data) {
                data.submit();
            },
            validate: function (files) {
                //文件大小

                if(files[0]['size']>maxCertSize){
                    toast.error( uploadtoolFilesize );
                    return false;
                }
                var fileName = files[0]['name'].toLowerCase( );
                var reg = /\.(cer)$/i;
                if(!reg.test(fileName)){
                    toast.error(uploadtoolSuffix);
                    return false;
                }
                return true;
            },
            successEvent: function (result, textStatus, jqXHR) {
                var resp = result;
                if(resp.code != '0'){
                    /*上传失败*/
                    certFileUploaded = false;
                    toast.error( resp.message );
                    initAddUploader();
                }else{
                    certFileUploaded = true;
                    fileBase = resp.data.x509Base64;
                    /*上传成功*/
                    if( resp.data.status == "1" ){
                        $("#fileNAmes").val("");
                        var errorMes = "";
                        var roleList = resp.data.adminRoles;
                        if(roleList.length > 0){
                            for(var i = 0 ; i < roleList.length ; i ++){
                                if(roleList[i].roleId == 'ROLE_AUDIT'){
                                    errorMes += shenji+"、";
                                    continue;
                                }
                                if(roleList[i].roleId == 'ROLE_SECURITY'){
                                    errorMes += yewu+"、";
                                    continue;
                                }
                                if(resp.data.adminId.length > 20){
                                    if(roleList[i].roleId == 'ROLE_SYSTEM'){
                                        errorMes += xitong+"、";
                                        continue;
                                    }
                                }else{
                                    if(roleList[i].roleId == 'ROLE_SYSTEM'){
                                        errorMes += yewu+"、";
                                        continue;
                                    }
                                }

                            }
                        }
                        toast.error(head+"【"+errorMes.substring(0,errorMes.length-1)+"】，"+end+"。")
                        return;
                        //
                        //
                        // /*证书重复，继续任命*/
                        // var role = "";
                        // for( var i = 0;i<resp.data.adminRoles.length;i++ ){
                        //     if( i == 0 ){
                        //         role += resp.data.adminRoles[i].roleDesc;
                        //     }else{
                        //         role += "、" + resp.data.adminRoles[i].roleDesc;
                        //     }
                        // }
                        // var toRepeatConfirmCertTip = repeatConfirmCertTip;
                        // toRepeatConfirmCertTip = toRepeatConfirmCertTip.replace( /roleStr/,role );
                        //
                        // swal({
                        //         title: tipConfirm,
                        //         text: toRepeatConfirmCertTip,
                        //         type: "warning",
                        //         showCancelButton: true,
                        //         confirmButtonColor: "#DD6B55",
                        //         confirmButtonText: tipConfirm,
                        //         cancelButtonText: tipCancle,
                        //         closeOnConfirm: true
                        //     },
                        //     function(isConfirm) {
                        //         if (isConfirm) {
                        //             /*确定继续任命*/
                        //             certFileUploaded = true;
                        //             operate = "1";
                        //             /*重复*/
                        //             var repeatAdmin = resp.data;
                        //             var roleArray = resp.data.adminRoles;
                        //             validateAccount = false;
                        //             validatePassword = false;
                        //             $("#ps0").attr("disabled","disabled");
                        //             $("#ps0").val("");
                        //             $("#ps1").attr("disabled","disabled");
                        //             $("#ps1").val("");
                        //             isPs = "false";
                        //             setX509CertData( resp.data.subject,resp.data.serialNumber,resp.data.issuer,resp.data.notBefore,resp.data.notAfter );
                        //
                        //             $("#trueName").val(repeatAdmin.trueName);
                        //             $("#mobile").val(repeatAdmin.mobile);
                        //             $("#mail").val(repeatAdmin.mail);
                        //             /*回显角色*/
                        //             $('input[type="checkbox"][name="roles"]').each(function () {
                        //                 $(this).prop("checked", false);
                        //             });
                        //             for (var i = 0; i < roleArray.length; i++) {
                        //                 var role = roleArray[i];
                        //                 $('input[type="checkbox"][name="roles"]').each(
                        //                     function () {
                        //                         if (role.roleId == $(this).val()) {
                        //                             $(this).prop("checked", true);
                        //                         }
                        //                     }
                        //                 );
                        //             }
                        //         }else{
                        //             /*不继续任命*/
                        //             //打开证书校验
                        //             certFileUploaded = false;
                        //             operate = "0";
                        //         }
                        //     }
                        // );
                    }else if( resp.data.status == "0" ){
                        /*证书未重复，不继续任命*/
                        operate = "0";
                        setX509CertData( resp.data.subject,resp.data.serialNumber,resp.data.issuer,resp.data.notBefore,resp.data.notAfter );

                        // $("#trueName").val( htmlEncode( resp.data.subject ) );
                        // $("#mobile").val("");
                        // $("#mail").val("");
                        $("#ps0").removeAttr("disabled");
                        $("#ps0").val("");
                        $("#ps1").removeAttr("disabled");
                        $("#ps1").val("");
                    }
                }
            }
        });

    };
    var initAddValidator = function(){
        var e = "<i class='fa fa-times-circle'></i> ";
        /*初始化adminForm-validate*/
        var rules =
            {
                trueName: {
                    trueNameEmpty: !0,
                    maxlength:50
                },
                mobile:{
                    isMobile:true
                },
                mail:{
                    email:true
                }
            };
        /*是否校验账号密码*/
        if( authType == "account" ){
            if( validateAccount ){
                rules["a0"] = {
                    required: !0,
                    accountNotEmpty:true,
                    maxlength:50
                };
            }

            if( validatePassword ){
                rules["p0"] = {
                    required: !0,
                    p0:true
                };
                rules["p1"] = {
                    required:!0,
                    p1:true
                };
            }

        }
        /*是否校验增强密码*/
        if( isPs == "true" ){
            rules["ps0"] = {
                required: !0,
                p0:true
            };
            rules["ps1"] = {
                required:!0,
                ps1:true
            };
        }
        validator = $("#adminForm").validate({
            rules: rules
        });
    };
    var validateForm = function(){
        //TODO:校验角色

        var checkedRole = [];

        /*验证角色*/
        var roleCheck = false;
        /*验证证书文件*/
        var certCheck = true;
        $("input:checkbox[name='roles']").each(function() {
            var att = $(this).prop("checked");
            if( att ){
                checkedRole.push( $(this).val() );
                roleCheck = true;
            }
        });
        if( roleStr == "all" ) {

            /*校验 安全审计ROLE_AUDIT、安全保密ROLE_SECURITY  是否同时拥有，若同时拥有，则校验失败*/
            var roleMore = ( $.inArray("ROLE_AUDIT", checkedRole) >= 0 ) && ( $.inArray("ROLE_SECURITY", checkedRole) >= 0 );

            if (roleMore) {
                roleCheck = false;

                var roleTip = '<div class="error" style="display: inline-block; color:#cc5965;margin-left:5px;font-weight: 500;">' + roleSelMore + '</div>';

                $("#roleTip").html(roleTip);

            }

            if (!roleCheck && !roleMore) {

                var roleTip = '<div class="error" style="display: inline-block; color:#cc5965;margin-left:5px;font-weight: 500;">' + roleSelect + '</div>';

                $("#roleTip").html(roleTip);

            }
        }else{
            roleCheck = true;
        }
        /*验证证书*/
        if( authType == "cert" ){
            if( !certFileUploaded || (fileBase == null && fileBase == undefined && fileBase == '') ){
                /*未上传证书*/
                var certTip = '<div class="error" style="display: inline-block; color:#cc5965;margin-left:5px;font-weight: 500;">' + valiFile + '</div>';
                $("#certTip").html( certTip );
                certCheck = false;
            }
        }
        return validator.form() && roleCheck && certCheck;
    };
    var submitAdd = function(){
        if( !validateForm() ){
            /*表单验证失败*/
            return;
        }


        /*姓名*/
        var trueName = $("#trueName").val().trim();
        /*手机号*/
        var mobile = $("#mobile").val().trim();
        /*邮箱*/
        var mail = $("#mail").val().trim();
        /*operate 操作类型-operate*/
        var param = { "trueName":trueName,"mobile":mobile,"mail":mail,"o0":operate};

        if( roleStr == "all" ){
            /*系统管理员*/
            var roleArray = [];
            $("input:checkbox[name='roles']:checked").each(function() {
                roleArray.push( $(this).val() );
            });
            param["ri0"] = roleArray;
        }else{
            /*按角色区分*/
            param["r0"] = roleStr;
        }

        if( authType == "account" ){

            if( operate == "0" ){
                /*新增*/
                var account = $("#a0").val();
                var password = $("#p0").val();
                var confirmPassword = $("#p1").val();
                param["a0"] = account;
                param["p0"] = password;
                param["p1"] = confirmPassword;
            }else if( operate == "1" ){
                /*修改*/
                var account = $("#a0").val();
                param["a0"] = account;
            }
        }
        if( authType == "cert" ){
            param["b0"] = fileBase;
        }
        if( isPs == "true" ){
            param["ps0"] = $("#ps0").val();
            param["ps1"] = $("#ps1").val();
        }
        $.ajax({
            type : 'post',
            url : '/api/AdminRestService/v1/admin/'+roleStr+'/' + authType + '/add',
            dataType : "json",
            traditional: true,
            data :param,
            "success" : function(resp) {
                if( resp.code == "0" ){
                    toast.success(saveyes);
                    block.blockUI();
                    timeout = 'window.location.href = "/system/config_xtAdmin.html"';
                    // doPost({'url':'system/config_xtAdmin.html'})
                    var cancle = setTimeout( timeout,1000 );

                }else{
                    toast.error( resp.message );
                }
            }
        });
    };
    function initAddClickBind(){
        $("#submitBtn").on('click', function () {
            submitAdd();
        });
        $("#cancleBtn").on('click', function () {
            goToIndexAdmin();
        });

    }
    var addEvents = function () {
        initAddData();
        initAddValidator();
        initAddClickBind();
    };

    /*add scripts end*/

    /*edit script start*/
    var modifyAdmin;
    var editPwd = false;

    var initModifyData = function(){
        //默认不修改证书
        certFileUploaded = true;
        /*回显用户信息*/
        $.ajax({
            type : 'post',
            url : '/api/AdminRestService/v1/admin/' + roleStr + '/searchAdminData',
            dataType : "json",
            async : false,
            data :{"r0" : roleStr,"a0":adminId} ,
            "success" : function(response) {
                if( response.code == "0" ){
                    var adminData = response.data;
                    /*回显角色热表*/
                    if( roleStr != "all" ){
                        /*按角色*/
                        $("#roleContainer").html( adminData.loginRoleList[0].roleDesc );
                    }else{
                        /*系统管理员*/
                        var roleTags ="";
                        for( var i = 0;i<adminData.loginRoleList.length;i++ ){
                            var role = adminData.loginRoleList[i];
                            roleTags += '<label class="checkbox-inline" style="padding-left:20px;"><input type="checkbox" value="'+role.roleId+'" name="roles" >'+role.roleDesc+'</label>';
                        }
                        roleTags += '<div id="roleTip"></div>';
                        $("#roleContainer").html( roleTags );
                        initRoleCheckEvent();
                    }
                    /*系统管理员->勾选用户角色*/
                    if( roleStr == "all" ) {
                        var roleArray = adminData.adminRoleList;

                        for (var i = 0; i < roleArray.length; i++) {
                            var role = roleArray[i];
                            $('input[type="checkbox"][name="roles"]').each(
                                function () {
                                    if (role.roleId == $(this).val()) {
                                        $(this).prop("checked", true);
                                    }
                                }
                            );
                        }
                    }
                    /*回显基本信息*/
                    modifyAdmin = adminData.adminVO;

                    $("#trueName").val( modifyAdmin.trueName );/*设置姓名*/

                    $("#mobile").val( modifyAdmin.mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') );/*设置手机号*/
                    $("#mobileHide").val( modifyAdmin.mobile );

                    $("#mail").val( modifyAdmin.mail.replace(/(.{2}).+(.{2}@.+)/, '$1****$2') );/*设置邮箱*/
                    $("#mailHide").val( modifyAdmin.mail );

                }else{
                    toast.error( response.message );
                }
            }
        });

        if ( authType == "account" ) {
            $("#accountContainer").show();
            $("#certContainer").hide();
            /*验证方式：口令验证*/

            $("#acModifyPassword").show();
            //不修改密码单击
            $("#acNotModifyPwd").on('click', function () {
                editPwd = false;
                $("#passwordGroup").hide();
                //删除校验
                $("#p0").rules("remove");
                $("#p1").rules("remove");
            });
            //修改密码单击
            $("#acModifyPwd").on('click', function () {
                editPwd = true;
                $("#passwordGroup").show();
                //增加校验
                $("#p0").rules("add",{required: !0,p0:true,messages:{p0:valiPasswordStrong}});
                $("#p1").rules("add",{required: !0,p1:true,messages:{p1:valiPasswordConfirm}});
            });

            /*回显用户名，并禁止编辑用户名*/
            $("#a0").val( modifyAdmin.account );
            $("#a0").attr( "readonly","readonly" );
            operate = "1";
        }else if( authType == "cert" ){
            $("#accountContainer").hide();
            $("#certContainer").show();
            /*验证方式：证书认证*/
            /*加载证书信息并回显*/
            initModifyUploader();

            /*回显原证书内容*/
            setX509CertData( modifyAdmin.subject,modifyAdmin.serialNumber,modifyAdmin.issuer,modifyAdmin.notBefore,modifyAdmin.notAfter );

            /*查询密码增强配置*/
            if( isPs == "true" ){
                /*开启了密码增强*/
                $("#psModifyPassword").show();
                //不修改密码单击
                $("#psNotModifyPwd").on('click', function () {
                    editPwd = false;
                    $("#psBlock").hide();
                    //删除校验
                    $("#ps0").rules("remove");
                    $("#ps1").rules("remove");
                });
                //修改密码单击
                $("#psModifyPwd").on('click', function () {
                    editPwd = true;
                    $("#psBlock").show();
                    //增加校验
                    $("#ps0").rules("add",{required: !0,p0:true,messages:{ps0:valiPasswordStrong}});
                    $("#ps1").rules("add",{required: !0,ps1:true,messages:{ps1:valiPasswordConfirm}});
                });
            }
        }
    };
    var initRoleCheckEvent = function(){
        $("input:checkbox[name='roles']").click(function(){
            var roleCheck = false;

            $("input:checkbox[name='roles']").each(function() {
                var att = $(this).prop("checked");
                if( att ){
                    roleCheck = true;
                }
            });

            if ( !roleCheck ){

                var roleTip = '<div class="error" style="display: inline-block; color:#cc5965;margin-left:5px;font-weight: 500;">' + roleSelect + '</div>';

                $("#roleTip").html( roleTip );

            }else{
                $("#roleTip").html( "" );
            }
        });
    };
    var flag = false;
    var initModifyUploader = function(){
        var template = '  <div class="form-inline">\n' +
            '     <input type="text" readonly class="form-control filename" id="fileNAmesEdit" style="width: 38%;">\n' +
            '     <span id="file_box" class="selectfile fileinput-button" style="diaplay:block; width:108px !important; height:34px; line-height:34px; text-align:center">\n' +
            '        '+uploadtoolSelect+'' +
            '        <input type="file" unselectable="on" name="certFile" id="certFile" style="diaplay:block; width:108px !important;" >\n' +
            '     </span>\n' +

            '  </div>\n';

        fileUpload.init({
            template: template,
            fileContainer: 'certFileDiv',
            uploadBtnId: 'certFile',
            url:'/api/ManagerService/manager/v1/uploadX509CertFile',
            autoUpload: true,
            multipart: true,
            addEvent: function (e, data) {
                data.submit();
            },
            validate: function (files) {
                flag = true;
                //文件大小

                if(files[0]['size']>maxCertSize){
                    toast.error( uploadtoolFilesize );
                    return false;
                }
                var fileName = files[0]['name'].toLowerCase( );
                var reg = /\.(cer)$/i;
                if(!reg.test(fileName)){
                    toast.error(uploadtoolSuffix);
                    return false;
                }
                return true;
            },
            successEvent: function (result, textStatus, jqXHR) {
                var resp = result;
                if(resp.code != '0'){
                    /*上传失败*/
                    certFileUploaded = false;
                    toast.error( resp.message );
                    //重新初始化
                    initModifyUploader();
                }else{
                    /*上传成功*/
                    if( resp.data.status == "1" ){
                        $("#fileNAmesEdit").val("");
                        var errorMes = "";
                        var roleList = resp.data.adminRoles;
                        if(roleList.length > 0){
                            for(var i = 0 ; i < roleList.length ; i ++){
                                if(roleList[i].roleId == 'ROLE_AUDIT'){
                                    errorMes += shenji+"、";
                                    continue;
                                }
                                if(roleList[i].roleId == 'ROLE_SECURITY'){
                                    errorMes += yewu+"、";
                                    continue;
                                }
                                if(resp.data.adminId.length > 20){
                                    if(roleList[i].roleId == 'ROLE_SYSTEM'){
                                        errorMes += xitong+"、";
                                        continue;
                                    }
                                }else{
                                    if(roleList[i].roleId == 'ROLE_SYSTEM'){
                                        errorMes += yewu+"、";
                                        continue;
                                    }
                                }

                            }
                        }
                        toast.error(head+"【"+errorMes.substring(0,errorMes.length-1)+"】，"+end+"。")
                        return;
                        // $("#certTip").html( '<div class="error" style="display: inline-block; color:#cc5965;margin-left:5px;font-weight: 500;">' + certPepeatConfirmCertTip + '</div>' );
                    }else if( resp.data.status == "0" ){
                        certFileUploaded = true;
                        fileBase = resp.data.x509Base64;
                        if( isPs == "true" ){
                            $("#ps0").removeAttr("disabled");
                            $("#ps1").removeAttr("disabled");
                            /*validate增加口令校验*/
                            $("#ps0").rules("add",{required:!0,p0:true});
                            $("#ps1").rules("add",{required:!0,ps1:true});
                        }
                        /*证书未重复，可继续任命*/
                        setX509CertData( resp.data.subject,resp.data.serialNumber,resp.data.issuer,resp.data.notBefore,resp.data.notAfter );

                    }
                }
                $('#certtbd tr[id!="certtr"]').remove();//删除所有以前的预览节点
            }
        });
    };
    var initModifyValidator = function(){
        /*初始化adminForm-validate*/

        /*初始化adminForm-validate*/
        var rules =
            {
                trueName: {
                    trueNameEmpty: !0,
                    maxlength:50
                }
            };
        validator = $("#adminForm").validate({
            rules: rules
        });
    };
    var validateModifyForm = function(){
        //TODO:校验角色

        var checkedRole = [];

        /*验证角色*/
        var roleCheck = false;
        /*验证证书文件*/
        var certCheck = true;
        $("input:checkbox[name='roles']").each(function() {
            var att = $(this).prop("checked");
            if( att ){
                checkedRole.push( $(this).val() );
                roleCheck = true;
            }
        });
        if( roleStr == "all" ) {
            /*校验 安全审计1、安全保密2  是否同时拥有，若同时拥有，则校验失败*/
            var roleMore = ( $.inArray("ROLE_AUDIT", checkedRole) >= 0 ) && ( $.inArray("ROLE_SECURITY", checkedRole) >= 0 );

            if (roleMore) {
                roleCheck = false;

                var roleTip = '<div class="error" style="display: inline-block; color:#cc5965;margin-left:5px;font-weight: 500;">' + roleSelMore + '</div>';

                $("#roleTip").html(roleTip);

            }

            if (!roleCheck && !roleMore) {

                var roleTip = '<div class="error" style="display: inline-block; color:#cc5965;margin-left:5px;font-weight: 500;">' + roleSelect + '</div>';

                $("#roleTip").html(roleTip);

            }
        }else{
            roleCheck = true;
        }
        /*验证证书*/
        if( authType == "cert" ){
            if( !certFileUploaded && (fileBase == null || fileBase == undefined || fileBase == '') ){
                /*未上传证书*/
                var certTip = '<div class="error" style="display: inline-block; color:#cc5965;margin-left:5px;font-weight: 500;">' + valiFile + '</div>';
                $("#certTip").html( certTip );
                certCheck = false;
            }
        }
        return validator.form() && roleCheck && certCheck;

    };
    var submitRequest = function(){
        var changeMobile = false;
        var changeMail = false;
        // debugger;submitBtn
        if( $("#mobile").val() && modifyAdmin.mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') != $("#mobile").val().trim() ){
            //添加手机验证
            changeMobile = true;
            $("#mobile").rules("add",{isMobile:true});
        }else{
            $("#mobile").rules("remove");
            changeMobile = true;
        }

        if( $("#mail").val() && modifyAdmin.mail.replace(/(.{2}).+(.{2}@.+)/, '$1****$2') != $("#mail").val().trim() ){
            //添加邮箱验证
            changeMail = true;
            $("#mail").rules("add",{email:true});
        }else{
            $("#mail").rules("remove");
            changeMail = true;
        }

        if( !validateModifyForm() ){
            /*表单验证失败*/
            return;
        }


        /*姓名*/
        var trueName = $("#trueName").val();
        /*手机号*/
        var mobile = changeMobile?$("#mobile").val():$("#mobileHide").val();
        /*邮箱*/
        var mail = changeMail?$("#mail").val():$("#mailHide").val();

        if(mail == null){
            mail = "";
        }

        if(mobile == null){
            mobile = "";
        }
        /*operate 操作类型-operate*/
        var param = { "trueName":trueName,"mobile":mobile.trim(),"mail":mail.trim(),"a0":adminId,"o0":operate };

        if( roleStr == "all" ){
            /*系统管理员*/
            var roleArray = [];
            $("input:checkbox[name='roles']:checked").each(function() {
                roleArray.push( $(this).val() );
            });
            param["ri0"] = roleArray;
        }else{
            /*按角色区分*/
            param["r0"] = roleStr;
        }
        /*更换证书*/
        if( authType == "cert" && fileBase != null && fileBase != undefined && fileBase != '' ){
            param["b0"] = fileBase;
        }
        if(flag == true){
            if(fileBase == null|| fileBase == undefined || fileBase == ''){
                toast.error("请上传证书文件");
                return;
            }
        }
        /*设置增强口令*/
        if( isPs == "true" && editPwd ){
            param["ps0"] = $("#ps0").val();
            param["ps1"] = $("#ps1").val();
        }else if ( editPwd ){
            param["p0"] = $("#p0").val();
            param["p1"] = $("#p1").val();
        }
        $.ajax({
            type : 'post',
            url : '/api/AdminRestService/v1/admin/' + roleStr + '/' + authType + '/edit',
            dataType : "json",
            data :param,
            traditional: true,
            "success" : function(resp) {
                if( resp.code == "0" ){
                    toast.success(saveyes);
                    timeout ='window.location.href = "/system/config_xtAdmin.html"';
                    var cancle = setTimeout(timeout,1000);
                    // doPost({'url':'system/config_xtAdmin.html'})

                }else{
                    toast.error( resp.message );
                }
            }
        });
    };
    var initModifyClickBind = function(){
        $("#submitBtn").on('click', function () {
            submitRequest();
        });
        $("#cancleBtn").on('click', function () {
            goToIndexAdmin();
        });
    };
    var modifyEvents = function () {
        initModifyData();
        initModifyValidator();
        initModifyClickBind();
    };
    /*edit script end*/
    return {
        init: function () {
            initTables();
            bindBtnClick();
            initListEvents();
        },

        addInit: function () {
            addEvents();
        },

        modifyInit: function () {
            modifyEvents();
        }
    }
}();