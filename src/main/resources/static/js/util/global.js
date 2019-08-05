var global = function () {
	
	$(function () {
		var token = $("meta[name='_csrf']").attr("content");
		var header = $("meta[name='_csrf_header']").attr("content");
		if(token && header){
			$(document).ajaxSend(function(e, xhr, options) {
				xhr.setRequestHeader(header, token);
			});
		}
	});

    function NavToggle() {
        $(".navbar-minimalize").trigger("click")
    }

    function SmoothlyMenu() {
        $("body").hasClass("mini-navbar") ? $("body").hasClass("fixed-sidebar") ? ($("#side-menu").hide(), setTimeout(function () {
                $("#side-menu").fadeIn(500)
            },
            300)) : $("#side-menu").removeAttr("style") : ($("#side-menu").hide(), setTimeout(function () {
                $("#side-menu").fadeIn(500)
            },
            100))
    }

    var initMenu = function () {
        var configJson;
        $.ajax({
            url: '/menu/getMenu.html',
            type: 'post',
            dataType: 'json'
        }).done(function (data) {
            /*查询产品配置*/
            $.ajax({
                type : 'post',
                url : '/loadProductConfig.html',
                dataType : "json",
                async:false,
                "success" : function(resp) {
                    configJson = resp;
                    if( configJson.logout == "0" ){
                        $("#logout").html('<a href="/logout" id="logoutBtn" class="roll-nav roll-right J_tabExit"><i class="fa fa fa-sign-out"></i>登出</a>');
                    }
                }
            });
            /*查询菜单*/
            var htmlTemplate = global.remoteTemplate('/art-templates/menu.html', {
                rootMenu: data.level1,
                level2Map: data.level2,
                level3Map: data.level3,
                config:configJson
            });
            var $menu = $("#side-menu");
            $menu.html(htmlTemplate);
            var e = $("body > #wrapper").height() - 61;
            $(".sidebard-panel").css("min-height", e + "px")
            $menu.metisMenu({
                toggle: false
            });
            $(".right-sidebar-toggle").click(function () {
                $("#right-sidebar").toggleClass("sidebar-open")
            });
            $(".sidebar-container").slimScroll({
                height: "100%",
                railOpacity: .4,
                wheelStep: 10
            });
            $(".navbar-minimalize").click(function () {
                $("body").toggleClass("mini-navbar");
                SmoothlyMenu()
            });

            $('a.J_menuItem').on('click', function () {
                var menuList = [];
                var $this = $(this);
                var menu = {};
                if ($this.attr('target')) {
                    menu.name = $this.text().trim();
                    menu.parent = false;
                    menu.url = $this.attr('href');
                } else {
                    return;
                }
                var parent;
                if ($this.closest('ul').hasClass('nav-third-level')) {
                    parent = $this.closest('ul').closest('li');
                    var senc = $this.closest('ul').closest('li').children('a').text().trim();
                    var sec = {};
                    sec.name = senc;
                    sec.parent = true;
                    var root = {};
                    var rootName = parent.closest('ul').closest('li').children('a').text().trim();
                    root.name = rootName;
                    root.parent = true;
                    menuList.push(root);
                    menuList.push(sec);
                    menuList.push(menu)

                }
                if ($this.closest('ul').hasClass('nav-second-level')) {
                    parent = $this.closest('ul').closest('li');
                    var root = parent.children('a').text().trim();
                    var rootMenu = {};
                    rootMenu.name = root;
                    rootMenu.parent = true;
                    menuList.push(rootMenu);
                    menuList.push(menu);
                }
                var htmlTemplate = global.remoteTemplate('/art-templates/slider.html',{menuList: menuList});
                $('#indexTitle').html(htmlTemplate);
                $('a.subM').on('click', function () {
                    $('#subTitle').html('');
                })
            });

        })
    };


    return {
        init: function () {
            window.i18n = global.getI18n();
        },
        getI18nText: function (key) {
            var i18n = localStorage.getItem("i18n");
            return JSON.parse(i18n)[key];
        },

        getI18n: function () {
            var i18n = localStorage.getItem("i18n");
            return JSON.parse(i18n);
        },
        templateCache: {},
        remoteTemplate: function (url, data) {
            var defaultData = {i18n: global.getI18n()};
            var render = global.templateCache[url];
            if (render === undefined || render === null) {
                $.ajax({
                    url: url,
                    dataType: "html",
                    type: "get",
                    async: false
                }).done(function (html) {
                    render = template.compile(html);
                    global.templateCache[url] = render;
                });
            }
            $.extend(defaultData, data);
            return render(defaultData);
        },
        initMenu: function () {
            initMenu();
        }
    }
}();
global.init();