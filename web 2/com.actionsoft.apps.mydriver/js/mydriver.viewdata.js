var nowObj;
$(document).ready(function(){
	 $.fn.popbox = function (options) {
        var obj = $(this);
        //关闭
        if (typeof options == "string" && options == "close") {
            $(".awsui-popbox").hide();
            $(".awsui-popbox-arrow").remove();
            $(".awsui-popbox-arrow-inner").remove();
            $(document).off("click.popbox");
            if ($(obj).data("popbox") != null) {
                $(obj).data("popbox", 'close');
            }
            return;
        }
        //参数
        var opt = {
            width: "200",
            height: "200",
            target: null,
            distanceTop: 5,
            distanceLeft: 10,
            hideArrow: false,
            callBack: null
        };
        opt = $.extend(opt, options);
        //by wangshibao 追加注册事件，点击target时不重新触发click（显示popbox）
        if ($(opt.target).data("popbox") === 'true') {
            $(opt.target).data("popbox", 'false');
            return false;
        }
        //增加样式
        if (!obj.hasClass("awsui-pop")) {
            obj.addClass("awsui-pop");
        }
        var arrow = $("<div class='awsui-popbox-arrow top'></div>").appendTo("body");
        //初始化白色边框箭头
        var arrow_inner = $("<div class='awsui-popbox-arrow-inner top'></div>").appendTo("body");
        //默认与target的高度
        var target = $(opt.target), offsetLeft = target.offset().left, offsetTop = target.offset().top, arrowTop = 0, arrowInnerToop = 0;
        //if ((offsetTop + Number(opt.height)) > $(document).height() && $(document).height()-offsetTop<offsetTop) {// 去掉$(window).height() 改为$(document).height() 因为在iframe很高时$(window).height()只能返回浏览器可见的高度导致计算时出现问题
        //if ($(document).height() - offsetTop < Number(opt.height) && offsetTop > Number(opt.height)) {	//减去target本身的高度和arrow的高度
        if ($(document).height() - offsetTop - target.height() - 40 < Number(opt.height) && offsetTop > Number(opt.height)) {
            arrowTop = offsetTop - arrow.outerHeight() / 2 - opt.distanceTop;
            arrowInnerToop = arrowTop - 1;
            if (opt.hideArrow) {
                offsetTop = offsetTop - 2 - Number(opt.height);
            } else {
                offsetTop = offsetTop - arrow.outerHeight() / 2 - opt.distanceTop - Number(opt.height) - 1;
            }
            //bottom样式
            arrow.removeClass("top").addClass("bottom");
            arrow_inner.removeClass("top").addClass("bottom");
        } else {
            if ($(document).height() - offsetTop < Number(opt.height)) {
                var newHeight = $(document).height() + (Number(opt.height) - ($(document).height() - offsetTop)) + target.outerHeight() + 50;
            }
            arrowTop = offsetTop + target.outerHeight() - arrow.outerHeight() / 2 + opt.distanceTop;
            arrowInnerToop = arrowTop + 1;
            if (opt.hideArrow) {
                offsetTop = offsetTop + target.outerHeight() + 1;
            } else {
                offsetTop = offsetTop + target.outerHeight() + arrow.outerHeight() / 2 + opt.distanceTop;
            }
        }
        //自动判断左边停靠位置
        if ((offsetLeft + Number(opt.width)) > $(window).width()) {
            if (offsetLeft + target.outerWidth() > opt.width) {
                offsetLeft = offsetLeft - opt.width + target.outerWidth();
            } else {
                offsetLeft = ($(window).width() - opt.width) / 2;
            }
        }
        //初始化位置
        initPosition();
        //事件注册
        $(document).off("mousedown.popbox").on("mousedown.popbox", ".awsui-popbox", function (e) {
            e.stopPropagation();
        });

        function innerClose() {
            $(".awsui-popbox").hide();
            $(".awsui-popbox-arrow").remove();
            $(".awsui-popbox-arrow-inner").remove();
            $(document).off("click.popbox");
            return;
        }

        $(document).off("mousedown.popbox_").on("mousedown.popbox_", function (e) {
            //点击comfirm窗口中的按钮时不关闭
            if ($(e.target).parent().parent().parent().hasClass("confirm-window")) {
                return;
            }
            //点击comfirm窗口中的内容时不关闭
            if ($(e.target).parent().parent().hasClass("confirm-window")) {
                return;
            }
            //点击comfirm窗口中的内容时不关闭
            if ($(e.target).parent().hasClass("confirm-window")) {
                return;
            }
            //点击comfirm窗口时不关闭
            if ($(e.target).hasClass("confirm-window")) {
                return;
            }
            //点击comfirm窗口的遮罩时不关闭
            if ($(e.target).hasClass("window-mask")) {
                return;
            }
            if ($(e.target).attr("id") == "id-awsui-win-frm-2013address_dialog") {
                return;
            }
            if ($(e.target).parent().attr("id") == "id-awsui-win-frm-2013address_dialog") {
                return;
            }
            if ($(e.target).parent().parent().attr("id") == "id-awsui-win-frm-2013address_dialog") {
                return;
            }
            if ($(e.target).parent().parent().parent().attr("id") == "id-awsui-win-frm-2013address_dialog") {
                return;
            }
            //obj.popbox("close");
            innerClose(obj);
        });
        //by wangshibao 追加注册事件，点击target时不重新触发click（显示popbox）
        $(document).off("mousedown.popbox__").on("mousedown.popbox__", function (e) {
            if ($(e.target).get(0) === $(opt.target).get(0)) {
                if ($(opt.target).data("popbox") != "close") {
                    $(opt.target).data("popbox", "true");
                } else {
                    $(opt.target).data("popbox", "false");
                }
            }
            $(document).off("mousedown.popbox__");
        });

        //初始化箭头
        function initPosition() {
            //重新定位box
            obj.css({
                width: opt.width,
                height: opt.height,
                left: offsetLeft,
                top: offsetTop
            }).fadeIn("fast", function callb() {
                if (opt.callBack) {
                    opt.callBack();
                }
            });
            if (opt.hideArrow) {
                arrow.css("display", "none");
                arrow_inner.css("display", "none");
            } else {
                arrow.css({
                    left: target.offset().left + target.outerWidth() / 2 - opt.distanceLeft,
                    top: arrowTop
                }).fadeIn("fast");
                arrow_inner.css({
                    left: target.offset().left + target.outerWidth() / 2 - opt.distanceLeft,
                    top: arrowInnerToop
                });
            }
        }
    };
	renderFileIcon();
});
function renderMyDriverData(objectElement,datalist){
	nowObj=objectElement;
	var message = eval(datalist);
	if (message != false) { 
		 $(objectElement).empty();
         $(objectElement).append("<ul class='message-list-header'></ul><div class='message-list'></div><div id='Pagination'></div>");
	     var  headerstr="<li class='w50'>文件(夹)名</li><li  class='w20'>大小</li><li  class='w30'>修改时间</li>";
	     $(".message-list-header").append(headerstr);
	     
	     $(".message-list").empty();
		  var tablestr="";
		  if(datalist.length!=0){
			for(var i = 0;i< datalist.length;i++){
				var messageinfo = datalist[i];
				var fileName=messageinfo["filename"];
				var msgid = messageinfo['id'];
				var msgidstr="'"+msgid+"'";
				var updateTime = messageinfo['updatetime'];
				var fileSize= messageinfo['filesize'];
				var fileType=messageinfo['format'];
				var fileTypeFlag=messageinfo['filetype'];//分类标识 1文件 2文件夹
				var isEnt=messageinfo['isEnt'];
				var canpreviewflag=messageinfo['canPreviewFlag'];
				var candownloadflag=messageinfo['canDownloadFlag'];
				
				var entIconStr="";
			    if(isEnt=="1" && fileType=="f" ){
				   entIconStr="file-type-enticon";
			    }
			    if(isEnt=="0" && fileType=="f" ){
				  entIconStr="file-type-selficon";
			    }
				 
				tablestr += '<ul  class="message-list-row">';
				tablestr += '<li  class="w50 leftalign" onclick="openDir(\''+msgid+'\',\''+isEnt+'\',\''+fileTypeFlag+'\',\''+fileName+'\',\''+fileType+'\',\''+canpreviewflag+'\',\''+candownloadflag+'\',\''+fileSize+'\');" style="cursor:pointer;">';
				tablestr += '<img class="file_icon file-type-'+fileType+'  '+entIconStr+'" border="0" width="24" height="24"  />';
//				tablestr += '<span class="file_icon file-type-'+fileType+' '+entIconStr+' "   ></span>';
				tablestr += fileName;
				tablestr += '</li>';
				tablestr += '<li  class="w20">'+formatSize(fileSize)+'</li>';			
				tablestr += '<li  class="w30">'+updateTime+'</li>';			
				tablestr += '</ul>';		
			}
		}else{
			 tablestr += '<div class="apps-no-record">暂无数据</div>';
		}
		$(".message-list").append(tablestr);
		renderFileIcon();
	
	}    
        
}

function renderFileIcon(){
	$(".message-list-row img").each(function(i,ele){
		try{
			var imgUrl=$(ele).css("background-image");
			var imgUrl=imgUrl.replace(/"/g,"");   
			var imgUrl=imgUrl.replace("'","");   
			var imgUrl=imgUrl.split("(")[1];
			var arr=imgUrl.split(")")[0];
			$(ele).attr("src",arr);
			var arrClass=$(ele).attr("class").split(" ");
			for (var int = 0; int < arrClass.length; int++) {
				if(arrClass[int].indexOf("file-type-")>-1 &&  arrClass[int]!="file-type-f" && arrClass[int]!="file-type-enticon" &&  arrClass[int]!="file-type-selficon"){
					$("."+arrClass[int]).css("background",null);
				}
			}
		}catch(e){}
	});
	
}

function openDir(dirId,isEnt,fileTypeFlag,fileName,fileType,canPreviewFlag,canDownloadFlag,fileSize){
	if(fileTypeFlag!=undefined && fileTypeFlag=="2"){
		var current_nav='allfile';
		if(isEnt!=undefined && isEnt=="1"){
			current_nav="entallfile";	
		}
		loadFileData(current_nav,dirId,"","", "","","");//请求数据
	}else if(fileTypeFlag!=undefined && fileTypeFlag=="1"){
		fileSize=formatSize(fileSize);
		showFullScreenPanel(dirId,fileName,fileType,canPreviewFlag,canDownloadFlag,fileSize);
	}
}

function previewMyFile(fileId,fileType,canPreviewFlag,canDownloadFlag,fileName,filesize) {
	
	//文件不允许预览
	if(canPreviewFlag!=undefined && canPreviewFlag=='0'){
		$(previewContainerForMyDriver).find("#previewpanel").empty();
			//判断文件类型，只有部分类型文件支持预览
			 //var canPreviewType="txt,doc,docx,xls,xlsx,ppt,pptx,bmp,jpg,jpeg,tiff,gif,pcx,tga,exif,fpx,svg,psd,cdr,pcd,dxf,ufo,eps,ai,raw,png,pdf";
		 var useUrlPreviewType="bmp,jpg,jpeg,tif,tiff,gif,png,ico";
		 if(useUrlPreviewType.indexOf(fileType)!=-1  ){
			   var url = './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_preview_file_url';
			   var params={ fileId:fileId  };
         	   $.simpleAlert("正在加载文件，请稍侯。。。", "loading");
         	   awsui.ajax.post(url, params, function(responseObject) {
        			if (responseObject['result'] == 'ok') {
        				$.simpleAlert("close");
        				var url = responseObject["data"]['url'];
        				$(previewContainerForMyDriver).find("#previewpanel").empty();
        				$(previewContainerForMyDriver).find("#previewpanel").append("<iframe frameBorder='0' class='previewfrm' id='previewfrm'></iframe>");
        				if(responseObject.data.isImg === true){
        					$(previewContainerForMyDriver).find("#previewfrm").attr("src", './w?sid='+sid+'&cmd=com.actionsoft.apps.mydriver_preview_file_url_img&fileId='+fileId);
        				}else{
        					$(previewContainerForMyDriver).find("#previewfrm").attr("src", responseObject.data.url);
        				}
        				$(previewContainerForMyDriver).find("#fslistbtn").hide();
        				$(previewContainerForMyDriver).find("#fsrefreshbtn").hide();
        			} else {
        				$.simpleAlert(responseObject['msg'], responseObject['result']);
        			}
		      }, 'json');
         	   return false;
        	
         }else{
			 if(canPreviewType.indexOf(fileType)!=-1){
//				 $.simpleAlert("文件正在加载，请稍侯。。。", "loading");
				    var params={
				    	fileId:fileId
				    };
					var url = './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_preview_office_file';
					awsui.ajax.post(url, params, function(responseObject) {
						if(responseObject['result'] == 'ok'){
							// $.simpleAlert("close");
				            var url = responseObject["data"]['url'];
				            //window.open(url);
				            $(previewContainerForMyDriver).find("#previewpanel").empty();
				            if(fileType=="md"){
				            	$(previewContainerForMyDriver).find("#previewpanel").append("<iframe class='previewfrm' id='previewfrm' frameborder='no' border='0' scrolling='no'></iframe>");
				            	$(previewContainerForMyDriver).find("#previewfrm").attr("src",url);
				            	$(previewContainerForMyDriver).find("#previewpanel").css("overflow","hidden");
				            	$(previewContainerForMyDriver).find("#previewpanel").css("padding-bottom","70px");
				            	$(previewContainerForMyDriver).find("#fslistbtn").hide();
				            }else{
				            	$(previewContainerForMyDriver).find("#previewpanel").append("<iframe class='previewfrm' id='previewfrm'  allowfullscreen='true' allowtransparency='true' ></iframe>");
				            	$(previewContainerForMyDriver).find("#previewfrm").attr("src",url);
				            	
//				            	var iframemy = parent.window.document.getElementById("previewfrm");      
//						        if (iframemy.attachEvent) {      
//						        	iframemy.attachEvent("onload", function() { 
//										 $.simpleAlert("close");
//						            });      
//						        } else {      
//						        	iframemy.onload = function() {  
//										 $.simpleAlert("close");
//						            };      
//						        }  
			        
			        
				            	 //var onlinedoctype="doc,docx,wps,rtf,ppt,pptx,dps,pdf";
					             var onlinedoctype=supportOfficeType;
				            	 if(onlinedoctype.indexOf(fileType)!=-1){
				            	 	$(previewContainerForMyDriver).find("#fslistbtn").show();
				            	 	$(previewContainerForMyDriver).find("#fsrefreshbtn").show();
				            	 }else{
				            	 	$(previewContainerForMyDriver).find("#fslistbtn").hide();
				            	 	$(previewContainerForMyDriver).find("#fsrefreshbtn").hide();
				            	 }
					            	 
				            }
				            
					    }else{
					    	$(previewContainerForMyDriver).find("#previewpanel").empty();
							 var str="";
							 str+="<div class='unpreview-panel'>";
//							 str+="<span class='file_icon_v file-type-rar_v'></span>";
							 str+="<span class='unpreview-panel-text'><table style='width:auto;height:100%;margin:0px 25px;'><tr><td>"+fileName+"</td></tr></table></span>";
							 str+="<hr style='border:none;color:#202428;'/>";
							 str+="<div class='unpreview-panel-text-type'>"+fileType+"</div>";
							 str+="<div class='unpreview-txt'></div>";
							 if(canDownloadFlag!=undefined && canDownloadFlag=='0'){
								  str+="<div class='unpreview-download-btn button blue'>下载文件（"+filesize+"）</div>";
							 }
							 str+="</div>";
							 $(previewContainerForMyDriver).find("#previewpanel").append(str);
							  $(previewContainerForMyDriver).find("#fullscreenpanel").hide();
							 $.simpleAlert("文件转换失败", responseObject['result']);
							 $(previewContainerForMyDriver).find(".unpreview-download-btn").click(function(){
								 singledownload(fileId);
							 });
							 
							 $(previewContainerForMyDriver).find("#fslistbtn").hide();
							 $(previewContainerForMyDriver).find("#fsrefreshbtn").hide();
						}
					}, 'json');
					
			 }else{
				 $(previewContainerForMyDriver).find("#previewpanel").empty();
				 var str="";
				 str+="<div class='unpreview-panel'>";
//				 str+="<span class='file_icon_v file-type-rar_v'></span>";
				 str+="<span class='unpreview-panel-text'><table style='width:auto;height:100%;margin:0px 25px;'><tr><td>"+fileName+"</td></tr></table></span>";
				 str+="<hr style='border:none;color:#202428;'/>";
				 str+="<div class='unpreview-panel-text-type'>"+fileType+"</div>";
				 str+="<div class='unpreview-txt'></div>";
				 if(canDownloadFlag!=undefined && canDownloadFlag=='0'){
					  str+="<div class='unpreview-download-btn button blue'>下载文件（"+filesize+"）</div>";
				 }
				 str+="</div>";
				 $(previewContainerForMyDriver).find("#previewpanel").append(str);
				  $(previewContainerForMyDriver).find("#fullscreenpanel").hide();
				 $(previewContainerForMyDriver).find("#fslistbtn").hide();
				 $(previewContainerForMyDriver).find("#fsrefreshbtn").hide();
			 }
         }

	}else{
		$(previewContainerForMyDriver).find("#previewpanel").empty();
		 var str="";
		 str+="<div class='unpreview-panel'>";
//		 str+="<span class='file_icon_v file-type-rar_v'></span>";
		 str+="<span class='unpreview-panel-text'><table style='width:auto;height:100%;margin:0px 25px;'><tr><td>"+fileName+"</td></tr></table></span>";
		 str+="<hr style='border:none;color:#202428;'/>";
		 str+="<div class='unpreview-panel-text-type'>"+fileType+"</div>";
		 str+="<div class='unpreview-txt'></div>";
		 if(canDownloadFlag!=undefined && canDownloadFlag=='0'){
			  str+="<div class='unpreview-download-btn button blue'>下载文件（"+filesize+"）</div>";
		 }
		 str+="</div>";
		 $(previewContainerForMyDriver).find("#previewpanel").append(str);
		 $(previewContainerForMyDriver).find("#fullscreenpanel").hide();
	}
	 $(previewContainerForMyDriver).find(".unpreview-download-btn").click(function(){
		 singledownload(fileId);
	 });	
	 
	 $(previewContainerForMyDriver).find("#fslistbtn").hide(); 
	 $(previewContainerForMyDriver).find("#fsrefreshbtn").hide();
	 
}

function showFullScreenPanel(fileId){
    var params = {
		fileId:fileId
	};
	var url = './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_get_detailinfo';
	awsui.ajax.post(url, params, function(responseObject) {
		if(responseObject['result'] == 'ok'){
	            var fileInfo = responseObject['data']['fileInfo'];
	            var fileId = fileInfo.id;
	    		var fileType= fileInfo.format;
	    		var filesize= fileInfo.filesize;
	    		filesize=formatSize(filesize);
	    		var canPreviewFlag=fileInfo.canPreviewFlagForPreview;
	    		var canDownloadFlag= fileInfo.canDownloadFlag;
	    		var fileName= fileInfo.filename;
	    		var replyuser= fileInfo.createUser;
	    		var userPhoto= fileInfo.userPhoto;
	            showFullScreenPanelExt(fileId,fileName,fileType,canPreviewFlag,canDownloadFlag,filesize,replyuser,userPhoto);
		}else{
			$.simpleAlert(responseObject['msg'], responseObject['result']);
		}
	}, 'json');
}


function showFullScreenPanelExt(fileId,fileName,fileType,canPreviewFlag,canDownloadFlag,filesize,replyuser,userPhoto){
	var outerheight=$(previewContainerForMyDriver).height();
	$(previewContainerForMyDriver).find("#fsouterpanel").css("height",outerheight);
	$(previewContainerForMyDriver).find("#fsouterpanel").show();
	$(previewContainerForMyDriver).find("#fullscreenpanel").show();
	$(previewContainerForMyDriver).find("#previewpanel").show();
	$(previewContainerForMyDriver).find("#fsattrpanel").show();
	$(previewContainerForMyDriver).find("#fstoolbar").show();
	 
	 var prewidth=$(previewContainerForMyDriver).find("#fullscreenpanel").width()-$(previewContainerForMyDriver).find("#fsattrpanel").width();
	 $(previewContainerForMyDriver).find("#previewpanel").css("width",prewidth+"px");
	 $(previewContainerForMyDriver).find("body").css("overflow","hidden");
	 
	 /*
	 var photoHtml='<div class="fs-replyer-photo awsui-user-profile" userid='+replyuser+'><img src="'+userPhoto+'"  class="previewuser-photo-cls"/></div>';
	 $(previewContainerForMyDriver).find(".toolbar-title").before(photoHtml);
	 //将文件标题显示
	 $(previewContainerForMyDriver).find(".toolbar-title").empty();
	 $(previewContainerForMyDriver).find(".toolbar-title").append(fileName);
	 */
	
	//文件类型图标
	var fileTypeIndex = fileName.lastIndexOf(".");
	var fileSuffix = fileName.substr(fileTypeIndex);
	fileSuffix = fileSuffix.toLowerCase();
	var fileIcon = getFileSuffixIcon(fileName.substr(fileTypeIndex)); 
	// 将文件标题显示
	$(previewContainerForMyDriver).find(".toolbar-title").empty();
	$(previewContainerForMyDriver).find(".toolbar-title").append(fileName);
	$(previewContainerForMyDriver).find(".toolbar-title").css('background-image',"url("+fileIcon+")");
	
	 
	 //左侧预览
	 previewMyFile(fileId,fileType,canPreviewFlag,canDownloadFlag,fileName,filesize);
	 
	 if(canDownloadFlag!=undefined && canDownloadFlag=='1'){
		 $(previewContainerForMyDriver).find("#fsdownloadbtn").hide();
	 }else if(canDownloadFlag!=undefined && canDownloadFlag=='0'){
		 $(previewContainerForMyDriver).find("#fsdownloadbtn").show();
	 }else{}
	 
	 $(previewContainerForMyDriver).find("#fsdownloadbtn").off('click').on('click',function(){
	 	
	 	 if(canPreviewFlag=="1"){
	 	 	 singledownload(fileId);
	 	 }else{
				// singledownload(fileId);
				 var sourceFileName=fileName;
			     var fileType = sourceFileName.lastIndexOf(".");
				 var fileSuffix = sourceFileName.substr(fileType).toLowerCase();
				 var fileSubType = sourceFileName.substr(fileType+1).toLowerCase();
			 	 //var onlinedoctype="doc,docx,wps,rtf,ppt,pptx,dps,pdf";
				 var onlinedoctype=supportOfficeType;
		    	 if(onlinedoctype.indexOf(fileSubType)!=-1){
				 	//文件类型图标
					var fileIcon = getFileSuffixIcon(sourceFileName.substr(fileType)); 
					var filePdf = sourceFileName.substr(0,sourceFileName.lastIndexOf("."))+".pdf";
				
				    $(previewContainerForMyDriver).find("#online_sourcefilename").html(sourceFileName);
				    $(previewContainerForMyDriver).find("#online_pdffilename").html(filePdf);
				    $(previewContainerForMyDriver).find("#sourceFileSize").html(filesize);
				    var pdfFileSize=formatSize(parent.window.document.getElementById("previewfrm").contentWindow.fileSize);
				    $(previewContainerForMyDriver).find("#pdfFileSize").html(pdfFileSize);
				 	$(previewContainerForMyDriver).find("#sourcedownloadurl").off('click').on('click',function(){
				 		 singledownload(fileId);
				    }); 
				    
				    
				    $(previewContainerForMyDriver).find("#pdfdownloadurl").attr("download",parent.window.document.getElementById("previewfrm").contentWindow.url);
				    $(previewContainerForMyDriver).find("#pdfdownloadurl").attr("href",parent.window.document.getElementById("previewfrm").contentWindow.url);
				    $(previewContainerForMyDriver).find("#online_file_pdffile").off('click').on('click',function(){
				 		 //window.open(parent.window.document.getElementById("previewfrm").contentWindow.url);
				    });
				    
				    
				     if(fileSubType=="pdf"){
				     	 $(previewContainerForMyDriver).find("#online_file_source").hide();
				    	 $(previewContainerForMyDriver).find("#show-fsdownload-popbox").popbox({
					        target:$(this),
					        width:350,
					        height:40
				         });
				    }else{
				    	  $(previewContainerForMyDriver).find("#online_file_source").show();
					     $(previewContainerForMyDriver).find("#show-fsdownload-popbox").popbox({
					        target:$(this),
					        width:350,
					        height:80
				         });
				    }
				    
				   
		    	 }else{
		    	 	 singledownload(fileId);
		    	 }
	 	 
	 	 }
	 });
	 
	 
	 $(previewContainerForMyDriver).find("#fslistbtn").off('click').on('click',function(){
	 	 $(previewContainerForMyDriver).find("#show-fsdownload-popbox").hide();
	    parent.window.document.getElementById("previewfrm").contentWindow.listShowEvent();
	 });
	 
	   $(previewContainerForMyDriver).find("#fsrefreshbtn").off('click').on('click',function(){
	   	 $(previewContainerForMyDriver).find("#show-fsdownload-popbox").hide();
	    parent.window.document.getElementById("previewfrm").contentWindow.fileReloadEvent();
	 });
	 //右侧评论
	 /**
	  * 隐藏评论
	  */
		var prewidth=$(previewContainerForMyDriver).find("#fullscreenpanel").width();
		$(previewContainerForMyDriver).find("#previewpanel").css("width","100%");
		$(previewContainerForMyDriver).find("#previewpanel").css("right","0px");
		$(previewContainerForMyDriver).find("body").css("overflow","hidden");
	 $(previewContainerForMyDriver).find("#fsattrpanel").css("display","none");
	 
	 $(previewContainerForMyDriver).find("#fsclosebtn").click(function(){
		 closeFsPanel();
		 $(previewContainerForMyDriver).find("#show-fsdownload-popbox").hide();
	 });
	 
	 $(previewContainerForMyDriver).find('#filepre_back').click(function () {
		 closeFsPanel();
		 $(previewContainerForMyDriver).find("#show-fsdownload-popbox").hide();
	});
	
	 
	  $(previewContainerForMyDriver).find("#previewpanel").click(function(){
		 $(previewContainerForMyDriver).find("#show-fsdownload-popbox").hide();
	 });
}

function closeFsPanel(){
	$(previewContainerForMyDriver).find("#fsouterpanel").hide();
	$(previewContainerForMyDriver).find("#fullscreenpanel").hide();
	$(previewContainerForMyDriver).find("#previewpanel").hide();
	$(previewContainerForMyDriver).find("#fsattrpanel").hide();
	$(previewContainerForMyDriver).find("#fstoolbar").hide();
}


var curCounts=0;
//加载文件数据     dirId:目录Id,searchVlaue:检索词
function loadFileData(navType,dirId,searchValue,orderCol, orderType,start,size){
	start=curCounts+1;
	//请求数据
	$.ajax({
		type : "POST",
		async:false,
		url : './jd?sid='+sid+'&cmd=com.actionsoft.apps.mydriver_loadfiledata&t='+Math.random(),  
		data :{"navType":navType,"dirId":dirId,"searchValue":searchValue,"orderCol":orderCol,"orderType":orderType,"start":start,"size":size},
		success : function(data){
			if(data['result'] == 'ok'){
				fileList = data["data"]['fileList'];
				renderMyDriverData(nowObj,fileList);
			}else{
				$.simpleAlert(data['msg'], data['result']);
			}
		}
	});
}


//单文件下载
function singledownload(fileId) {
	//单个文件 下载  请求数据
	$.ajax({
		type : "POST",
		async : true,
		url : './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_getdownloadurl&t=' + Math.random(),
		data : {"fileId" : fileId},
		dataType : 'json',
		success : function(response) {
			var msg = response.msg;
			if (response.result != 'ok') {
				$.simpleAlert(msg, 'warning', 2000, { model : true });
				return false;
			} else {
				//window.location.href=msg;
				window.open(msg);
			}
		}
	});
}


function showFSCommentPanel(sourceId){
	
	defautltReplyPageSize=20;
	replyCounts=0;
	replyCurCounts=0;
	replyCurrentLen=0;

	
	if($(previewContainerForMyDriver).find("#fsattrpanel").is(":visible") == false){
		$(previewContainerForMyDriver).find("#fsattrpanel").show("100");
		$(previewContainerForMyDriver).find("#fsreplypanel").empty();
		$(previewContainerForMyDriver).find("#fsreplypanel").append("<div class='fs-reply-box'></div><div class='fs-reply-list'></div>");
		var addreplystr="<div class='fs-reply-title' >写下你的看法:</div>";
		addreplystr+="<div class='fs-reply-panel'><textarea   class='txt emotion fs-replycontent' id='fscontent'  maxlength='5000'></textarea>";
		addreplystr+="<input type='button' class='button blue fs-reply-add-btn'   value='提交'/>";
		addreplystr+="</div>";
		$(previewContainerForMyDriver).find(".fs-reply-box").append(addreplystr);
		
		loadFSCommentData(sourceId,0,defautltReplyPageSize);
		var prewidth=$(previewContainerForMyDriver).find("#fullscreenpanel").width()-360;
		$(previewContainerForMyDriver).find("#previewpanel").css("width",prewidth+"px");
		$(previewContainerForMyDriver).find("#previewpanel").css("right","360px");
		$(previewContainerForMyDriver).find("body").css("overflow","hidden");
		$(previewContainerForMyDriver).find("#fsshowcommentbtn").attr("awsui-qtip","隐藏评论");
	}else{
		$(previewContainerForMyDriver).find("#fsattrpanel").hide("100");
		var prewidth=$(previewContainerForMyDriver).find("#fullscreenpanel").width();
		$(previewContainerForMyDriver).find("#previewpanel").css("width",prewidth+"px");
		$(previewContainerForMyDriver).find("#previewpanel").css("right","0px");
		$(previewContainerForMyDriver).find("body").css("overflow","hidden");
		$(previewContainerForMyDriver).find("#fsshowcommentbtn").attr("awsui-qtip","显示评论");
	}
	
	$(previewContainerForMyDriver).find(".fs-reply-add-btn").click(function(){
		addFSFileReply(sourceId);
	});
	/*
		$("#fsreplypanel").empty();
		$("#fsreplypanel").append("<div class='fs-reply-box'></div><div class='fs-reply-list'></div>");
		
		 var addreplystr="<div class='fs-reply-title' >写下你的看法:</div>";
	     addreplystr+="<div class='fs-reply-panel'><textarea   class='txt emotion fs-replycontent' id='fscontent'  maxlength='5000'></textarea>";
	     addreplystr+="<input type='button' class='button blue fs-reply-add-btn' onclick=addFSFileReply('"+sourceId+"'); value='提交'/>";
	     addreplystr+="</div>";
	     $(".fs-reply-box").append(addreplystr);
										     
		 loadFSCommentData(sourceId,0,defautltReplyPageSize);
		 */
	}

	//加载回复列表数据
	function loadFSCommentData(sourceId,start,size){
		start=replyCurCounts+1;
		  var params={
		    	sourceId:sourceId,
				start:start,
				size:size
		    };
			var url = './jd?sid='+sid+'&cmd=com.actionsoft.apps.mydriver_load_reply_list&t='+Math.random();
			awsui.ajax.post(url, params, function(responseObject) {
				if(responseObject['result'] == 'ok'){
					replyList = responseObject["data"]['commentList'];
					var len = replyList.length;
					replyCurrentLen=len;
					replyCounts = responseObject['data']['counts'];
					replyCurCounts= replyCurCounts+ len;
					showFSFileCommentList(replyList,sourceId);
				}else{
					$.simpleAlert(responseObject['msg'], responseObject['result']);
				}
			}, 'json');
			
	}


	//回复列表
	function showFSFileCommentList(replyList,messageid){
			 var replystr="";
			  if(replyList.length!=0){
			  	if(replyList.length > 0 && replyCurCounts <= defautltReplyPageSize){
			       replystr+='<div class="fs-reply-total-num" id="replytotal">共'+replyCounts+'条回复</div>';
			  	}
			  	 for(var i=0;i<replyList.length;i++){
	            	    var replyinfo = replyList[i];
					    var replyid=replyinfo['id'];
					    var index=replyinfo['index'];
					    var msgid=replyinfo['sourceId'];
					    var replycontent=replyinfo['content'];
					    var replytime=replyinfo['createTime'];
					    var replyuser=replyinfo['createUser'];
					    var replyusername=replyinfo['createUserName'];
					    var userPhoto=replyinfo['userPhoto'];
					     replystr+='<div class="fs-each-reply-panel">';
					     if(backgroundcanuseflag=="1"){
					     replystr+='    <div class="fs-replyer-photo awsui-user-profile" userid='+replyuser+'><img src="'+userPhoto+'"  class="user-photo-cls"/><br/><span class="fs-reply-index-num">#'+index+'</span></div>';
					     }else{
					     replystr+='    <div class="fs-replyer-photo"><img src="'+userPhoto+'"  class="user-photo-cls"/><br/><span class="fs-reply-index-num">#'+index+'</span></div>';
					     }
					     replystr+='    <div class="fs-replye-data">';
					     if(backgroundcanuseflag=="1"){
					     replystr+='        <div class="fs-replye-data-top awsui-user-profile" userid='+replyuser+'>'+replyusername+'</div>';
					     }else{
					     replystr+='        <div class="fs-replye-data-top">'+replyusername+'</div>';
					     }
					     replystr+='        <div class="fs-replye-data-top-right"><span class="fs-reply-time-cls">'+replytime+'</span>';
	                     if(replyuser==userid){
	                     //replystr+="            <span style='margin-right: 10px;'>&nbsp;<a onclick=toUpdateReply('"+msgid+"','"+replyid+"'); class='name reply-op-cls'>修改</a></span>";
	                     replystr+="            <span style='margin-right: 10px;'>&nbsp;<a  replyid='"+replyid+"' class='name fs-reply-op-cls'>删除</a></span>";
	                     }
					     replystr+='        </div>';
					     replystr+='        <div class="fs-replye-data-middle" style="word-break:break-all;word-wrap:break-word;"><p><pre>'+replycontent+'</pre></p><input type="hidden" id="reply'+replyid+'" value="'+replycontent+'"/></div>';
					     replystr+='    </div>';
					     replystr+='</div>';
	            }
			  }else{
			  	 replystr+="<div class='fs-nodata'>做第一个回复者吧！</div>";
			  }
			  $(previewContainerForMyDriver).find(".fs-reply-list").append(replystr);
			  $(previewContainerForMyDriver).find(".fs-reply-op-cls").click(function(){
                  var replyid=$(this).attr("replyid");
				  deleteFSReply(msgid,replyid);
			  });
			  
		      //分页信息
			    var size=20;
				if ( replyCurCounts>=size  && replyCurCounts < replyCounts  ) {
					replyMore = $("<div  class='fs-list_load_more'>加载更多...</div>");
					$(previewContainerForMyDriver).find(".fs-reply-list").append(replyMore);
					replyMore.click(function(e) {
						loadFSCommentData(messageid,"",defautltReplyPageSize);
						$(this).remove();
					});
				}
				
				if(myBrowser()!="Chrome"){
					$(previewContainerForMyDriver).find(".fs-reply-list").css("padding-bottom","70px");
				}else{
					$(previewContainerForMyDriver).find(".fs-reply-list").css("padding-bottom","10px");
				}
			    
	}

	//添加回复
	function addFSFileReply(sourceId){
	    var content=$(previewContainerForMyDriver).find("#fscontent").val();
	   //验证
		if(!content){
			$.simpleAlert('[评论内容]不允许为空', "info", 1000);
			return false;
		}
	    var params = {
			content:content,
			sourceId:sourceId
		};
		var url = './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_add_reply';
		awsui.ajax.post(url, params, function(responseObject) {
			if(responseObject['result'] == 'ok'){
					 replyCounts = 0;
			         replyCurCounts = 0;
			         $(previewContainerForMyDriver).find("#fscontent").val("");
			         $(previewContainerForMyDriver).find(".fs-reply-list").empty();
					 loadFSCommentData(sourceId,0,defautltReplyPageSize);
					
			}else{
				$.simpleAlert(responseObject['msg'], responseObject['result']);
			}
		}, 'json');
		
	}

	//删除回复
	function deleteFSReply(sourceId,commentId){
		 var msg = "确定要删除该条评论吗？"; 
		 if (confirm(msg)==true){ 
			 var params = {
						sourceId:sourceId,
						commentId:commentId
					};
					var url = './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_delete_reply_by_id';
					awsui.ajax.post(url, params, function(responseObject) {
						if(responseObject['result'] == 'ok'){
							     replyCounts = 0;
						         replyCurCounts = 0;
						         $(previewContainerForMyDriver).find("#fscontent").val("");
						         $(previewContainerForMyDriver).find(".fs-reply-list").empty();
								 loadFSCommentData(sourceId,0,defautltReplyPageSize);
						}else{
							$.simpleAlert(responseObject['msg'], responseObject['result']);
						}
					}, 'json');
		 }else{ 
		    return false; 
		 } 
	}
