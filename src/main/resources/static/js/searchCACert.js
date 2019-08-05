var searchCACert = function () {
    var grid;
    var $table;
    var format = "YYYY-MM-DD HH:mm:ss";

    var formatDateCol = function (data) {
        return moment(new Date(data)).format(format);
    };
    var formatCheckTypeText = function (data) {
        if (data == 0) {
            return checkTypeNone;
        } else if (data == 1) {
            return checkTypeCrl;
        } else if (data == 2) {
            return checkTypeOcsp;
        } else {
            return checkTypeNone;
        }
    };
    var formatStringCol = function (data) {
        if (data) {
            return data.replace(/[<>&"]/g,function(c){return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c];});
        } else {
            return "";
        }
    };
    var getCheckBoxValue = function () {
        var r = [];
        $("input[name='allCheckList']:checked").each(function () {
            if (this.value) {
                r.push(this.value);
            }
        });
        return r;
    };

    /**
     * 页面事件初始化
     */
    var initPageEvent = function () {
        $("#addBtn").click(function () {
            addBtnClick();
        });
        $("#editBtn").click(function () {
            editBtnClick();
        });
        $("#delBtn").click(function () {
            delBtnClick();
        });
        $("#crlBtn").click(function () {
            crlBtnClick();
        });
        /*$("#exportBtn").hover(function () {
            checkBoxChange();
        });*/
        $("#exportBtn").click(function () {
            exportBtnClick();
        });
        $("#importBtn").click(function () {
            importBtnClick();
        });
        /*$("input[name='allCheckList']").change(function () {
            checkBoxChange();
        });*/
    };
    var exportBtnClick = function () {
        var values = getCheckBoxValue();
        //var ids = values.join(',');
        if(values.length == 0){
            toast.error(select0);
            return;
        }
        $("#ids").val(values);
        $("#expForm").submit();
    };
    var addBtnClick = function () {
        var rootCertType = $("#rootCertType").val();
        window.location.href = "/cacert/" + rootCertType + "/addCACert.html";
    };
    var editBtnClick = function () {
        var values = getCheckBoxValue();
        if (values.length == 0) {
            toast.error(select0);
            return;
        }
        if (values.length > 1) {
            toast.error(selectMany);
            return;
        }
        var rootCertType = $("#rootCertType").val();
        window.location.href = "/cacert/" + rootCertType + "/addCACert.html?certId=" + values[0];
    };
    var delBtnClick = function () {
        var values = getCheckBoxValue();
        if (values.length == 0) {
            toast.error(select0);
            return;
        }
        if (values.length > 1) {
            toast.error(selectMany);
            return;
        }
        var param = {
            id: values[0]
        };
        var htmlTemplate = remoteTemplate.remoteTemplate('/templates/cacert/deleteConfirm.html', {
            confirmContent: confirmDelete,
            confirmBtnId: 'confirm',
            confirmTitle: btnConfig,
            confirmBtn: btnConfig,
            cancelBtn: btnCancle
        });
        $("#confirmDialog").html(htmlTemplate);
        $("#confirmDialog").on('shown.bs.modal', function () {
            $("#confirm").off().on('click', function () {
                block.blockUI();
                $.ajax({
                    type: 'post',
                    url: '/api/CACertService/v1/cacert/deleteCACert',
                    dataType: "json",
                    data: param,
                    "success": function (resp) {
                        if (resp.code == "0") {
                            $table.DataTable().ajax.reload();
                            toast.success();
                            $('#confirmDialog').modal('hide');
                        } else {
                            toast.error(resp.message);
                        }
                    },
                    "error": function (resp) {
                        //toast.error(conFail);
                    },
                    "complete": function (resp) {
                        block.unblockUI();
                    }
                });
            })
        });

        $("#confirmDialog").modal("show");

    };
    var crlBtnClick = function () {
        var rootCertType = $("#rootCertType").val();
        var values = getCheckBoxValue();
        if (values.length == 0) {
            toast.error(select0);
            return;
        }
        if (values.length > 1) {
            toast.error(selectMany);
            return;
        }
        var iscrl = $("input[name=allCheckList][value="+values[0]+"]").attr("data-for-crl");
        if(iscrl=="false"){
            toast.error(withoutCrl);
            return;
        }
        window.location.href = "/cacert/" + rootCertType + "/crlFileList.html?certId=" + values[0];
    };

    var importBtnClick = function () {
        var rootCertType = $("#rootCertType").val();
        window.location.href = "/cacert/" + rootCertType + "/importCACert.html";
    };
    /**
     * datatable初始化
     */
    var initDataTable = function () {
        var tableColumnSetting;
        tableColumnSetting = [
            {
                data: 'id', orderable: false,width:"5%",
                render: function (data, type, full) {
                    var content = '<label class="mt-checkbox text-center mt-checkbox-single mt-checkbox-outline">';
                    content += '    <input type="checkbox"  name="allCheckList"  value="' + data + '" data-for-crl="'+full.iscrl+'"/>';
                    content += '    <span></span>';
                    content += '</label>';
                    return content;
                },
                class: 'text-center'
            }, {
                data: 'name', orderable: false,width:"15%"
            },
            {
                data: 'subject', orderable: false,width:"20%"
            },
            {
                data: 'issuer', orderable: false,width:"20%"
            },
            {
                data: 'certNotBefore', orderable: false,width:"15%",
                render: function (data, type, full) {
                    return formatDateCol(data);
                }
            },
            {
                data: 'certNotAfter', orderable: false,width:"15%",
                render: function (data, type, full) {
                    return formatDateCol(data);
                }
            },
            {
                data: 'validatetype', orderable: false,width:"10%",
                render: function (data, type, full) {
                    return formatCheckTypeText(data);
                }
            }
        ];
        grid = new CACertTable();
        $table = $("#dataTable");
        grid.init({
            src: $table,
            onQuery: function (data) {
                //data.pageParam = JSON.stringify(getPageParam());
            },
            dataTable: {
                "ajax": {
                    "type": 'post',
                    "url": "/api/CACertService/v1/cacert/" + $("#rootCertType").val() + "/searchlist"
                },
                "columns": tableColumnSetting
            }
        });

    };

    return {
        initPageEvent: function () {
            initPageEvent();
        },
        initDataTable: function () {
            initDataTable();
        }
    }
}();