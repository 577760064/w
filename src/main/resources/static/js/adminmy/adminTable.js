var AdminDataTable = function () {

    var tableOptions;
    var dataTable;
    var table;
    var tableContainer;
    var tableWrapper;
    var tableInitialized = false;
    var the;
    var dataTableTag;
    var language ;
    if(l == 'zh_CN'){
         language = {
            loadingMessage: '加载中...',
            previous: "上一页",
            next: "下一页",
            last: "尾页",
            first: "首页",
            page: "第",
            pageOf: "页，共",
            metronicGroupActions: "共 _TOTAL_ 条记录被选中",
            metronicAjaxRequestGeneralError: "请求失败，请检查您的网络连接",
            lengthMenu: "页<span class='seperator'>|</span>每页 _MENU_ 条",
            info: "<span class='seperator'>|</span>共 _TOTAL_ 条",
            infoEmpty: "未查询到记录",
            emptyTable: "表格中无可用数据",
            zeroRecords: "未找到匹配记录"
        };
    }else{
        language = {
            loadingMessage: 'Loading...',
            previous: "Prev",
            next: "Next",
            last: "Last",
            first: "First",
            page: "Page",
            pageOf: "of",
            metronicGroupActions: "_TOTAL_ records selected:  ",
            metronicAjaxRequestGeneralError: "Could not complete request. Please check your internet connection",
            lengthMenu: "<span class='seperator'>|</span>View _MENU_ records",
            info: "<span class='seperator'>|</span>Found total _TOTAL_ records",
            infoEmpty: "No records found to show",
            emptyTable: "No data available in table",
            zeroRecords: "No matching records found"
        };
    }
    var countSelectedRecords = function () {
        var selected = $('tbody > tr > td:nth-child(1) input[type="checkbox"]:checked', table).size();
        var tableSize = $('tbody > tr > td:nth-child(1) input[type="checkbox"]', table).size();
        var text = tableOptions.dataTable.language.metronicGroupActions;
        if (tableSize !== 0) {
            if (tableSize === selected) {
                $('.group-checkable', table).prop('checked', true);
            } else {
                $('.group-checkable', table).prop('checked', false);
            }
        }

        if (selected > 0) {
            $('.table-group-actions > span', tableWrapper).text(text.replace("_TOTAL_", selected));
        } else {
            $('.table-group-actions > span', tableWrapper).text("");
        }
    };

    var reloadTable = function (pageFlag) {
        dataTable.draw(pageFlag)
    };

    return {

        init: function (options) {
            if (!$().dataTable) {
                return;
            }
            the = this;
            dataTableTag = options.dataTableTag;
            options = $.extend(true, {
                src: "",
                loadingMessage: loadin,
                onQuery: function (data) {
                },
                onSuccess: function (grid, res) {
                    if(res != null && res.data != null){
                        if(res.data.length > 0){
                            if(res.data[0] != null){
                                $("#datanow").html(res.data[0].pageNum);
                            }else{
                                $("#datanow").html(1);
                            }
                        }else{
                            $("#datanow").html(1);
                        }
                    }else{
                        $("#datanow").html(1);
                    }

                },
                onError: function (grid) {

                },
                onDataLoad: function (grid) {
                },
                onSortColumn : function(sortColumn, sortDirection) {
                    return onSortColumnDefault(sortColumn, sortDirection);
                },
                dataTable: {
                    "dom": "<'row'<'col-md-4 col-sm-12'<'table-group-actions pull-right'>>r><'table-responsive't><'row'<'col-md-12 col-sm-12'pli><'col-md-4 col-sm-12'>>", // datatable layout
                    "lengthMenu": [ 10, 20, 50 ],
                    search:true,
                    loadingMessage: language.loadingMessage,
                    "pageLength": 10,
                    // bFilter: false,    //去掉搜索框方法三：这种方法可以
                    // bLengthChange: false,// default records per page
                    "language": { // language settings
                        "metronicGroupActions": language.metronicGroupActions,
                        "metronicAjaxRequestGeneralError": language.metronicAjaxRequestGeneralError,

                        "lengthMenu":  language.lengthMenu,
                        "info": language.info,
                        "infoEmpty": language.info,
                        "emptyTable": nodate,
                        "zeroRecords": language.zeroRecords,
                        "paginate": {
                            "previous": language.previous,
                            "next": language.next,
                            "last": language.last,
                            "first": language.first,
                            "page": language.page,
                            "pageOf": language.pageOf
                        }
                    },
                    "orderCellsTop": true,
                    "pagingType": "full",
                    "autoWidth": false,
                    "processing": false,
                    "serverSide": true,
                    "ajax": {
                        "url": "",
                        "type": "POST", // todo should be post
                        "timeout": 20000,
                        "data": function (data) {
                            if (data.order[0]) {
                                var sortTemp = options.onSortColumn(data.columns[data.order[0].column].data, data.order[0].dir);
                                data.sortField = sortTemp.sortColumn;
                                data.sortOrder = sortTemp.sortDirection;
                            }else{
                                data.sortField = "";
                                data.sortOrder = "";
                            }
                            if (options.onQuery) {
                                options.onQuery(data);
                            }

                            data.pageNo = parseInt(data.start / data.length, 10) + 1;
                            data.pageSize = data.length;
                            delete data.columns;
                            delete data.order;
                            delete data.search;
                            delete data.length;
                            delete data.start;
                        },
                        "dataSrc": function (res) {
                            if ($('.group-checkable', table).size() === 1) {
                                $('.group-checkable', table).attr("checked", false);
                            }

                            if (res.code !== '0') {
                                res.data = [];
                                res.recordsTotal = 0;
                                res.recordsFiltered = 0;
                                app.alert({
                                    type: 'danger',
                                    icon: 'warning',
                                    message: res.message,
                                    container: tableWrapper,
                                    place: 'prepend'
                                });
                            } else {
                                res.recordsTotal = res.data.pageable.totalResult;
                                res.recordsFiltered = res.data.pageable.totalResult;
                                res.data = res.data.dataList;
                            }

                            if (tableOptions.onSuccess) {
                                tableOptions.onSuccess(the, res);
                            }

                            return res.data;
                        },
                        "error": function () {
                            if (tableOptions.onError) {
                                tableOptions.onError(the);
                            }
                            app.alert({
                                type: 'danger',
                                icon: 'warning',
                                message: tableOptions.dataTable.language.metronicAjaxRequestGeneralError,
                                container: tableWrapper,
                                place: 'prepend'
                            });

                        }
                    },

                    "drawCallback": function (oSettings) {
                        if (tableInitialized === false) {
                            tableInitialized = true;
                            table.show();
                        }
                        countSelectedRecords();

                        // callback for ajax data load
                        if (tableOptions.onDataLoad) {
                            tableOptions.onDataLoad(the);
                        }
                        //排序
                        $("#" + dataTableTag + " th:first").removeClass("sorting_asc");
                        $("#" + dataTableTag + " th").removeClass("sorting");
                    }
                }
            }, options);

            tableOptions = options;

            table = $(options.src);
            tableContainer = table.parents(".table-container");

            var tmp = $.fn.dataTableExt.oStdClasses;

            $.fn.dataTableExt.oStdClasses.sWrapper = $.fn.dataTableExt.oStdClasses.sWrapper + " dataTables_extended_wrapper";
            $.fn.dataTableExt.oStdClasses.sFilterInput = "form-control input-small input-sm input-inline";
            $.fn.dataTableExt.oStdClasses.sLengthSelect = "form-control input-xsmall input-sm input-inline";

            dataTable = table.DataTable(options.dataTable);

            // revert back to default
            $.fn.dataTableExt.oStdClasses.sWrapper = tmp.sWrapper;
            $.fn.dataTableExt.oStdClasses.sFilterInput = tmp.sFilterInput;
            $.fn.dataTableExt.oStdClasses.sLengthSelect = tmp.sLengthSelect;

            tableWrapper = table.parents('.dataTables_wrapper');

            if ($('.table-actions-wrapper', tableContainer).size() === 1) {
                $('.table-group-actions', tableWrapper).html($('.table-actions-wrapper', tableContainer).html()); // place the panel inside the wrapper
                $('.table-actions-wrapper', tableContainer).remove(); // remove the template container
            }
            $('.group-checkable', table).change(function () {
                var set = table.find('tbody > tr > td:nth-child(1) input[type="checkbox"]');
                var checked = $(this).prop("checked");
                $(set).each(function () {
                    $(this).prop("checked", checked);
                });
                countSelectedRecords();
            });

            table.on('change', 'tbody > tr > td:nth-child(1) input[type="checkbox"]', function () {
                countSelectedRecords();
            });

            $("body").on('click', '#search', function (e) {
                e.preventDefault();
                dataTable.ajax.reload();
            }).on('click', '.advanced-filter-btn', function (e) {
                e.preventDefault();
                var $icon = $(this).find("i");
                if ($icon.hasClass("fa-chevron-down")) {
                    $icon.removeClass("fa-chevron-down").addClass("fa-chevron-up");
                    $(this).parents("tr").next().show();
                } else {
                    $icon.removeClass("fa-chevron-up").addClass("fa-chevron-down");
                    $(this).parents("tr").next().hide();
                }
            });

            $('.filter-cancel').on('click', function (e) {
                e.preventDefault();
                $('.query-form').find('input,select,textarea').each(function () {
                    $(this).val("");
                });
                $('input.form-filter[type="checkbox"]', table).each(function () {
                    $(this).attr("checked", false);
                });
                dataTable.ajax.reload();
            });

            /**
             table.on('click', '.filter-cancel', function (e) {
                e.preventDefault();
                $('textarea.form-filter, select.form-filter, input.form-filter', table).each(function () {
                    $(this).val("");
                });
                $('input.form-filter[type="checkbox"]', table).each(function () {
                    $(this).attr("checked", false);
                });
                dataTable.ajax.reload();
            });
             */

            var tableId = tableOptions.src.attr("id");
            //显示列选择按钮事件
            $('#' + tableId + 'ToggleColumn').find('input[type="checkbox"]').on("change", function () {
                var iCol = parseInt($(this).attr("data-column"));
                dataTable.column(iCol).visible(!dataTable.column(iCol).visible());
            });

            $("#reloadTable").on("click", function () {
                reloadTable(false);
            })
        },

        getDataTable: function () {
            return dataTable;
        },

        getTableWrapper: function () {
            return tableWrapper;
        },

        gettableContainer: function () {
            return tableContainer;
        },

        getTable: function () {
            return table;
        },

        reloadTable: reloadTable
    };

};

function onSortColumnDefault(sortColumn, sortDirection) {
    return {
        sortColumn: sortColumn,
        sortDirection: sortDirection
    }
}
