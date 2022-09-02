/**
 *  工具类
 */
	$.fn.superInputExt = function(options) {
		var defaultArr = new Array();
		var defaults = {
			maxLength : 15,
			defaultVal : defaultArr
		};
		var opt = $.extend(defaults, options);
		var temp = $(this);
		var input = temp.find("input[type=text]:first");
		var content = $("<div></div>").prependTo(temp);
		var context = [];
		/**
		 *  fulp 20150527 添加默认值属性，添加回调，删除回调等属性
		 */

		//if(opt.defaultVal!=undefined && opt.defaultVal.length>0){
		var defalutArrTemp = opt.defaultVal;
		for (key in defalutArrTemp) {
			if (defalutArrTemp[key] != "" && typeof (defalutArrTemp[key]) == "string") {
				var defaulthtml = $("<span class='awsui-supertext-items' id='" + key + "'>" + defalutArrTemp[key] + "<span class='forms-icon down close'></span></span>").appendTo(content);
				context.push(defalutArrTemp[key]);
				defaulthtml.find(".close").on("click", function() {
					$(this).parent().fadeOut(function() {
						context.splice($.inArray(input.val(), context), 1);
						$(this).remove();

						if (!opt.onClose || opt.onClose($(this)) !== false) {
							return false;
						}
					});
				});
			}
		}

		input.on("focus", function() {
			if (!temp.hasClass("active")) {
				temp.addClass("active");
			}
		});
		input.on("keyup", function(e) {
			if (e.keyCode == 13 && input.val() != "") {
				if ($(".awsui-supertext-items").length >= opt.maxLength) {
					$.simpleAlert(标签个数的最高限制为 + opt.maxLength + 个);
					input.val("");
					return;
				}
				if ($.inArray(input.val(), context) >= 0) {
					input.val("");
					return;
				}
				context.push(input.val());
				var html = $("<span class='awsui-supertext-items'>" + input.val() + "<span class='forms-icon down close'></span></span>").appendTo(content);
				html.hide();
				html.fadeIn();
				if (!opt.onAdd || opt.onAdd() !== false) {
					//return false;
				};
				input.val("");

				html.find(".close").on("click", function() {
					$(this).parent().fadeOut(function() {
						context.splice($.inArray(input.val(), context), 1);
						$(this).remove();
						if (!opt.onClose || opt.onClose($(this)) !== false) {
							return false;
						}
					});
				});
			}
		});
		var fun = {
			getData : function() {
				return context;
			}
		};
		return fun;
	};
String.prototype.endWith = function (s) {
	if (s == null || s == "" || this.length == 0 || s.length > this.length)
		return false;
	if (this.substring(this.length - s.length) == s)
		return true;
	else
		return false;
	return true;
};
String.prototype.startWith = function (s) {
	if (s == null || s == "" || this.length == 0 || s.length > this.length)
		return false;
	if (this.substr(0, s.length) == s)
		return true;
	else
		return false;
	return true;
};

	
	//关闭预览
function closePreviewFile(){
	 
}


	function getFileSuffixIcon(fileSuffix){
		fileSuffix = fileSuffix.toLowerCase();
		var icon ;
		switch (fileSuffix) {
		    case (".jpg"):
		        icon = "../commons/img/fileSuffix/jpg-32.png";
		        break;
		    case (".png"):
		    	icon = "../commons/img/fileSuffix/png-32.png";
		    	break;
		    case (".gif"):
		    	icon = "../commons/img/fileSuffix/gif-32.png";
		    	break;
		    case (".zip"):
		    	icon = "../commons/img/fileSuffix/zip-32.png";
		        break;
		    case (".xml"):
		    	icon = "../commons/img/fileSuffix/xml-32.png";
		        break;
		    case (".doc"):
		    	icon = "../commons/img/fileSuffix/doc-32.png";
		        break;
		    case (".docx"):
		    	icon = "../commons/img/fileSuffix/doc-32.png";
		        break;
		    case (".xls"):
		    	icon = "../commons/img/fileSuffix/xls-32.png";
		        break;
		    case (".htm"):
		    	icon = "../commons/img/fileSuffix/htm-32.png";
		        break;
		    case (".html"):
		    	icon = "../commons/img/fileSuffix/html-32.png";
		    	break;
		    case (".js"):
		    	icon = "../commons/img/fileSuffix/js-32.png";
		        break;
		    case (".ppt"):
		    	icon = "../commons/img/fileSuffix/ppt-32.png";
		        break;
		    case (".rar"):
		    	icon = "../commons/img/fileSuffix/rar-32.png";
		        break;
		    case (".txt"):
		    	icon = "../commons/img/fileSuffix/txt-32.png";
		        break;
		    case (".pdf"):
		    	icon = "../commons/img/fileSuffix/pdf-32.png";
		        break;
		    default:
		    	icon = "../commons/img/fileSuffix/normal-32.png";
		}	
		return icon;
	}

function initAttrTabs(){
    var fullHeight = jQuery("#file-modify-dlg-content").height();
    // ifram高度显示区域高度
    var topHeight = jQuery(".toolbar-tab-box").height();
    // 设置显示区域高度
    var cha = fullHeight - topHeight - 5;
    jQuery("#toolbar-area").css('height', cha);
    jQuery("#toolbar-area").css('width', "98%");
	//初始化tab
	var tabs = jQuery("li[name=toolbartab]");
	tabs.bind("click", function(){
		var toolbarId = jQuery(this).attr("toolbarId");
		tabs.attr("class", "tab-normal").removeAttr("active");
		jQuery(this).attr({
			"class": "tab-active",
			"active": "true"
		});
		jQuery(".toolbar-items-container").hide();
		jQuery("#" + toolbarId).show();
		jQuery("#toolbar-area").show();
	});
}

//是个人文件夹的目录
function chargeIsFileNav(navType){
	var isFileNav=false;
	if(navType=="allfile" ||navType=="图片" ||navType=="文档" ||navType=="视频" ||navType=="音频" ||navType=='otherfile'){
	 isFileNav=true;
	}  
	return isFileNav;
}

function endWidthStr(sourceStr,endStr){
    var d=sourceStr.length-endStr.length;
    return (d>=0&&sourceStr.lastIndexOf(endStr)==d)
  }
/**
 *获取字符长度　 
 * @param {Object} txtValue
 */
function getStrLength(txtValue){
	if (txtValue!=null) {
		if (txtValue.indexOf('.')!=-1) {
			txtValue = txtValue.substring(1,txtValue.indexOf('.'));
			txtValue = txtValue.split(",").join("");
		}
	}
	var cArr = txtValue.match(/[^\x00-\xff]/ig);
	return txtValue.length + (cArr == null ? 0 : cArr.length);
}



function cutStr(str,len)  
{  
   var str_length = 0;  
   var str_len = 0;  
      str_cut = new String();  
      str_len = str.length;  
      for(var i = 0;i<str_len;i++)  
     {  
        a = str.charAt(i);  
        str_length++;  
        if(escape(a).length > 4)  
        {  
         //中文字符的长度经编码之后大于4  
         str_length++;  
         }  
         str_cut = str_cut.concat(a);  
         if(str_length>=len)  
         {  
         str_cut = str_cut.concat("...");  
         return str_cut;  
         }  
    }  
    //如果给定字符串小于指定长度，则返回源字符串；  
    if(str_length<len){  
     return  str;  
    }  
}



//获取文件上传的年月格式作为一层目录
function getTimeStr() {
	var date = new Date();
	var year = '';
	var month = '';
	year += date.getFullYear();
	if (date.getMonth() + 1 <= 9) {
		month = '0' + date.getMonth();
	} else {
		month = date.getMonth();
	}
	currentTimestr = year + month;
	return year + month;
}
//获取文件上传的年月格式作为一层目录 
function getTimeStr1(){
	var today = new Date();
	var nian = today.getYear();
	nian = (nian < 1900 ? (1900 + nian) : nian);
	var yue = today.getMonth() + 1;

	if (yue >= 0 && yue <= 9)
		yue = "0" + yue;
	else
		yue = yue;
	return nian +""+ yue;
}



//计算文件大小
function formatSize(size){
	if(size == '0'){
		return "-";
	}
	size = parseFloat(size);
	var units = ['B','KB','MB','GB','TB','PB','EB','ZB','YB','BB'];
	var step = 1024;
	var unitIndex = 0;
	while(true){
		if(size > 1024){
			size = parseFloat(size/step).toFixed(2);
			unitIndex++;
		}else{
			break;
		}
	}
	return size+units[unitIndex];
}


 
//初始化Tab  form css
function  easyTabInitFormTab(tabid,contentid) {
	var oLi = document.getElementById(tabid).getElementsByTagName("a");
	var oUl = $("#"+contentid).children("div");
	var oDiv = document.getElementById(tabid).getElementsByTagName("div");
	
	for(var i = 0; i < oLi.length; i++)
	{
		oLi[i].index = i;
		oLi[i].onclick = function ()
		{
			for(var n = 0; n < oLi.length; n++) 
			oLi[n].className="";
			this.className = "active";
			for(var n = 0; n < oUl.length; n++) 
			oUl[n].style.display = "none";
			oUl[this.index].style.display = "block";
			for(var n = 0; n < oDiv.length; n++) {
				if(this.className == "active"){
					oDiv[n].style.display = "none";
			        oDiv[this.index].style.display = "block";
				}
			}
			 
		};
	}
}


/**
 * util js 
 */
//初始化Tab
function  easyTabInit(tabid,contentid) {
	var oLi = document.getElementById(tabid).getElementsByTagName("li");
	//var oUl = document.getElementById(contentid).getElementsByTagName("div");
	var oUl = $("#"+contentid).children("div");
	var oDiv = document.getElementById(tabid).getElementsByTagName("div");
	
	for(var i = 0; i < oLi.length; i++)
	{
		oLi[i].index = i;
		oLi[i].onclick = function ()
		{
			for(var n = 0; n < oLi.length; n++) 
			oLi[n].className="";
			this.className = "current";
			for(var n = 0; n < oUl.length; n++) 
			oUl[n].style.display = "none";
			oUl[this.index].style.display = "block";
			for(var n = 0; n < oDiv.length; n++) {
				if(this.className == "current"){
					oDiv[n].style.display = "none";
			        oDiv[this.index].style.display = "block";
				}
			}
			 
		};
	}
}


function myBrowser(){
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isOpera = userAgent.indexOf("Opera") > -1;
    if (isOpera) {
        return "Opera"
    }; //判断是否Opera浏览器
    if (userAgent.indexOf("Firefox") > -1) {
        return "FF";
    } //判断是否Firefox浏览器
    if (userAgent.indexOf("Chrome") > -1){
  return "Chrome";
 }
    if (userAgent.indexOf("Safari") > -1) {
        return "Safari";
    } //判断是否Safari浏览器
    if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
        return "IE";
    }; //判断是否IE浏览器
}
