// window.onload=function modify(){
// 	var conheight = document.body.offsetHeight;
//     try{
//         document.getElementById("right").style.minHeight = conheight-132 +"px";
//         document.getElementById("myrame").style.height = conheight-92 +"px";
//     }
// 	catch (e) {
//
//     }
//
// }

//左侧二三级导航
$(document).ready(function() {
    $('.inactive').siblings('ul').css('display','block');
    $('#update').siblings('ul').css('display','none');
	$('.inactive').click(function(){
		if($(this).siblings('ul').css('display')=='none'){
			$(this).parent('li').siblings('li').removeClass('active');
			$(this).addClass('active');
			$(this).siblings('ul').slideDown(100).children('li');
			if($(this).parents('li').siblings('li').children('ul').css('display')=='block'){
				$(this).parents('li').siblings('li').children('ul').parent('li').children('a').removeClass('active');
				$(this).parents('li').siblings('li').children('ul').slideUp(100);

			}
		}else{
			//控制自身变成+号
			$(this).removeClass('active');
			//控制自身菜单下子菜单隐藏
			$(this).siblings('ul').slideUp(100);
			//控制自身子菜单变成+号
			$(this).siblings('ul').children('li').children('ul').parent('li').children('a').addClass('active');
			//控制自身菜单下子菜单隐藏
			$(this).siblings('ul').children('li').children('ul').slideUp(100);

			//控制同级菜单只保持一个是展开的（-号显示）
			$(this).siblings('ul').children('li').children('a').removeClass('active');
		}
	})
});

//单选
$(function() {
				$("input[type='radio']").click(function() {
					$("input[type='radio'][name='" + $(this).attr('name') + "']").parent().removeClass("checked")
					$(this).parent().addClass("checked");
				});
			});

//多选
$(function(){
				$("input[type='checkbox']").click(function() {
					if ($(this).parent().hasClass('checked')) {
						$(this).parent().removeClass("checked");
					} else{
						$(this).parent().addClass("checked");
					};
				});
			});


//tab
function openli(event, tabName) {
    var i, tab, tabli;
    tab = document.getElementsByClassName("tab");
    for (i = 0; i < tab.length; i++) {
        tab[i].style.display = "none";
    }
    tabli = document.getElementsByTagName("li");
    for (i = 0; i < tabli.length; i++) {
        tabli[i].className = tabli[i].className.replace("selected", "");
    }
    document.getElementById(tabName).style.display = "block";
    event.currentTarget.className += "selected";
}


//管理员管理弹窗

function showlayer(){
	document.getElementById("admin_add").style.display = "block";
	document.getElementById("admin_add_con").style.display = "block";
}
function closelayer(){
	document.getElementById("admin_add").style.display = "none";
	document.getElementById("admin_add_con").style.display = "none";
}

//首页提示信息弹窗
function showMessage(){
    document.getElementById("layer1").style.display = "block";
    document.getElementById("message").style.display = "block";
}
function closeMessage(){
    document.getElementById("layer1").style.display = "none";
    document.getElementById("message").style.display = "none";
}

//添加证书弹窗
function showAddCert(){
	document.getElementById("addCert_layer_bj").style.display = "block";
	document.getElementById("addCert_layer").style.display = "block";
}
function closeAddCert(){
	document.getElementById("addCert_layer_bj").style.display = "none";
	document.getElementById("addCert_layer").style.display = "none";
}

//高级查询
function showSelect(){
	document.getElementById("selectMore_con").style.display = "block";
	document.getElementById("selectMore_text").style.display = "none";
	document.getElementById("closeSelect").style.display = "block";
}
function closeSelect(){
	document.getElementById("selectMore_con").style.display = "none";
	document.getElementById("selectMore_text").style.display = "block";
	document.getElementById("closeSelect").style.display = "none";

}

//证书详情页  table 详情
function showDetails(){
	document.getElementById("details_layer").style.display = "block";
}


