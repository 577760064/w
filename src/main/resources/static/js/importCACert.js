var importCACert = function () {

    var localCACertUpload = new FileUpload();
    var xmlData = null;

    var initPageEvent = function () {
        $("#saveBtn").click(function () {
            saveBtnClick();
        });
        $("#backBtn").click(function () {
            backBtnClick();
        });
    };
    var saveBtnClick = function () {
       if(xmlData!=null){
           xmlData.submit();
       }else{
           toast.error(uploadtoolSelectone);
       }
    };
    var backBtnClick = function () {
        var rootCertType = $("#rootCertType").val();
        window.location.href = "/cacert/" + rootCertType + "/searchCACert.html";
    };



    var initPageTool = function () {
        xmlData = null;
        var template = '  <div class="form-inline">\n' +
            '     <input type="text" readonly class="form-control filename" id="localFileName" style="width: 70%;">\n' +
            '     <span class="btn btn-success fileinput-button" style="margin-top: -1px;">\n' +
            '        <span>'+uploadtoolSelect+'</span>\n' +
            '        <input type="file" name="localCAXML" id="localCAXML">\n' +
            '     </span>\n' +
            '  </div>\n';
        localCACertUpload.init({
            template: template,
            fileContainer: 'uploadTool',
            uploadBtnId: 'localCAXML',
            url:'/api/CACertService/v1/cacert/importCACert',
            autoUpload: true,
            multipart: true,
            validate: function (files) {
                //文件大小
                if(files[0]['size']>maxFileSize){
                    toast.error( importFileSize );
                    return false;
                }
                var fileName = files[0]['name'].toLowerCase( );
                var reg = /\.(xml)$/i;
                if(!reg.test(fileName)){
                    toast.error(importSuffix);
                    return false;
                }
                return true;
            },
            addEvent: function (e, data) {
                xmlData=data;
            },
            successEvent: function (result, textStatus, jqXHR) {

                if (result.code === "0") {
                    toast.success(saveSuccess);
                    var timeout = 'window.location.href="searchCACert.html"';
                    var cancle = setTimeout(timeout, 1000);
                } else {
                    toast.error(result.message);
                    initPageTool();
                }

            }
        });
    };
    return {
        initPageEvent: function () {
            initPageEvent();
        },
        initPageTool: function () {
            initPageTool();
        }
    }
}();