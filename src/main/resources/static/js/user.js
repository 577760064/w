var user = function () {

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

    var inlayAttrDict;

    var grid;
    var $table;

    var $dictTable;

    var dictGrid;

    var initTables = function () {
        grid = new DataTable();
        $table = $("#datatable_ajax");
        grid.init({
            src: $table,
            onQuery: function (data) {
                data.templateNameQuery = $("#templateNameQuery").val().trim();
            },
            onSortColumn: onSortColumn,
            dataTable: {
                "ajax": {
                    "type": 'get',
                    "url": "/data/users.json"
                },
                "columns": [
                    {data: '', orderable: false, render: function (data, type, full) {
                        return template("checkBox", {data: data, type: type, full: full, i18n: i18n});
                    }},
                    {data: 'templateName', orderable: true},
                    {data: 'orderByName', orderable: true},
                    {
                        data: 'operate', orderable: false,
                        render: function (data, type, full) {
                            return template("actionBtn", {data: data, type: type, full: full, i18n: i18n});
                        }
                    }
                ]
            }
        });
    };

    var initListEvents = function () {
        $table.on('click', 'a.delete', function () {
            var $this = $(this);
            var $row = $table.DataTable().row($this.parents('tr')[0]);

            app.showDeleteConfirm({
                callback: function () {
                    $.ajax({
                        url: '/delete',
                        data: {
                            id: $row.data().userTemplateId
                        },
                        dataType:'json',
                        type:'post'
                    }).done(function (data) {
                        if (app.ajaxPageCallback(data)) {
                            app.hideModal();
                            grid.reloadTable();
                        }
                    })
                }
            });

        });

        $table.on('click', 'a.edit', function () {
            var $this = $(this);
            var templateId = $this.attr('attr-template-id');
            alert("该行的ID" + templateId);
            window.location.href = "/templates/user/editUser.html?templateId=" + templateId
        })
    };


    var addEvents = function () {
        $('button.save').on('click', function () {
            if($('#addTemplateForm').validate().form()) {
                app.blockUI();
                var data = {};
                data.code = '0';
                app.ajaxCallback(data, '/templates/user/userListPage.html')
            }
        });

        $('input.datepicker').datetimepicker();
    };


    var toAdd = function () {
        $("#addTemplate").on('click', function () {
            window.location.href = "/templates/user/addUser.html";
        })
    };


    return {
        init: function () {
            initTables();
            toAdd();
            initListEvents();
            window.parent.app.clearSubMenu();
        },

        addInit: function () {
            addEvents();
            window.parent.app.menuPathAdd('添加模板');
        },

        editInit: function () {
            addEvents();
            window.parent.app.menuPathAdd('修改模板');
        }
    }

}();
