$(document).ready(function() {
	$(".showpwdpanel").show("1000");
	$(".showfilepanel").hide("1000");
	$("#sharePwdBtn").click(function() {
		getSharePwd();
	});

	$("#sharepwdtxt").keydown(function(e) {
		var eCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
		if (eCode == 13) {
			getSharePwd();
		}
	});
	
	
	if(showpbflag=="1"){
		$(".linkshare-footer").hide();
	}else{
		$(".linkshare-footer").show();
	} 
	
	//导航栏配置信息
	$(".linkshare-header").css("background-color","#"+sharenavbgcolor);
	$(".linkshare-header").css("color","#"+sharenavfontcolor);
	$(".linkshare-header-logo-text").html(sharenavtitle);
	$(".linkshare-header-logo").find("img").attr("src",sharenavlogo);
	
	
	//图片预览  注册插件 
	$("a[rel=fancyboxgroup]").fancybox({
		'transitionIn' : 'none', 'transitionOut' : 'none', 'titlePosition' : 'over', 'showNavArrows' : 'true',
		'titleFormat' : function(title, currentArray, currentIndex, currentOpts) {
			return '<span id="fancybox-title-over">Image ' + (currentIndex + 1) + ' / ' + currentArray.length + (title.length ? ' &nbsp; ' + title : '') + '</span>';
		}
	});
	
});


//计算文件大小  util 中方法
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

function getSharePwd() {
	var sharePwdinput = $("#sharepwdtxt").val();
	if (sharePwdinput == '') {
//		alert("请输入提取密码");
		layer.msg('请输入提取密码',{ icon: 0,time: 2000  }, function(){ });
		return false;
	}
	if (sharePwdinput != '') {
		validePassword(sharePwdinput);
	} else {
		layer.msg('提取密码输入错误',{ icon: 2,time: 2000  }, function(){ });
//		alert("提取密码输入错误");
	}

}
			
var nowObj;
function renderMyDriverData(objectElement,datalist){
	var pmsgid="";
	var pisEnt;
	var pfileTypeFlag="2";
	/*
	var pfileName;
	var pfileType;
	var pcanpreviewflag;
	var pcandownloadflag;
	var pfileSize;
	*/
	nowObj=objectElement;
	var message = eval(datalist);
	if (message != false) { 
		 $(objectElement).empty();
         $(objectElement).append("<ul class='message-list-header'></ul><div class='message-list'></div><div id='Pagination'></div>");
	     var  headerstr="<li class='w50'><a class='return-pre-path' href='javascript:void(0);'> 返回 </a>文件(夹)名</li><li  class='w10'>大小</li><li  class='w10'>操作</li><li  class='w30'>分享时间</li>";
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
				var pid=messageinfo['pid'];
				pmsgid=pid;
				pisEnt=isEnt;
				
				if(fileIdForShare==msgid){
					$(".return-pre-path").hide();
				}
				
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
               if(canpreviewflag!=undefined && canpreviewflag=="0"){
            	   tablestr += '<li  class="w50 leftalign" onclick="openDir(\''+msgid+'\',\''+isEnt+'\',\''+fileTypeFlag+'\',\''+fileName+'\',\''+fileType+'\',\''+canpreviewflag+'\',\''+candownloadflag+'\',\''+fileSize+'\');" style="cursor:pointer; ">';
				}else{
					//不允许预览时 就不让点击
	               tablestr += '<li  class="w50 leftalign">';
				}

				tablestr += '<img class="file_icon file-type-'+fileType+'  '+entIconStr+'" border="0" width="24" height="24" style="margin:0px 5px 0px 10px;" />';
				var picType="bmp,jpg,jpeg,tiff,gif,pcx,tga,exif,fpx,svg,psd,cdr,pcd,dxf,ufo,eps,ai,raw,png";
				var fileDownloadurl= "./../r/df?repositoryName=!myfile2&contentTokenId="+msgid+"&appId=com.actionsoft.apps.mydriver&fileName="+fileName;
					//允许预览		
					if(fileType!="f"  &&  picType.indexOf(fileType.toLowerCase())!=-1){
						tablestr += '<a  class="fancyboxcls" rel="fancyboxgroup"    href="'+fileDownloadurl+'" >'+ fileName+'</a>';
					}else{
						tablestr += fileName;
					}
				

				tablestr += '</li>';
				tablestr += '<li  class="w10">'+formatSize(fileSize)+'</li>';	
				tablestr += '<li  class="w10">';
				//0允许 1不允许
				if( fileType!="f" && candownloadflag!=undefined && candownloadflag=="0"){
					//允许下载
					tablestr += '<a href="javascript:void(0);"  onclick="singledownload(\''+msgid+'\',\''+fileName+'\')">下载</a>';			
				}else{
					tablestr += '<a href="javascript:void(0);" >&nbsp;</a>';			
				}
				tablestr += '</li>';
				tablestr += '<li  class="w30 timecls">' + updateTime + '</li>';
				tablestr += '</ul>';		
			}
		}else{
			 tablestr += '<div class="apps-no-record">暂无数据</div>';
		}
		$(".message-list").append(tablestr);
		$(".message-list").css("height","350px");
		var wH = $(".widget-header").width();
		if (wH < 450) {
			$(".timecls").removeClass("w30");
			$(".timecls").css("width", "30%");
			$(".timecls").css("white-space", "");
			$(".timecls").css("overflow", "hidden");
			$(".timecls").css("line-height", "15px");
		}
		
	}    
	
	//图片预览  注册插件 
	$("a[rel=fancyboxgroup]").fancybox({
		'transitionIn' : 'none', 'transitionOut' : 'none', 'titlePosition' : 'over', 'showNavArrows' : 'true',
		'titleFormat' : function(title, currentArray, currentIndex, currentOpts) {
			return '<span id="fancybox-title-over">Image ' + (currentIndex + 1) + ' / ' + currentArray.length + (title.length ? ' &nbsp; ' + title : '') + '</span>';
		}
	});
	
	$(".return-pre-path").off("click").on("click",function(){
		renturnPreLevel(pmsgid,pfileTypeFlag);
	});
	renderFileIcon();    
}

function renturnPreLevel(pmsgid,pfileTypeFlag){
	 var params = {
				fileId:pmsgid,
				shareUserId:shareUserId
			};
			var url = './../r/jd?cmd=com.actionsoft.apps.mydriver_linkshare_get_detailinfo';
				$.ajax({
					type : "POST",
					async : true,
					url : url,
					data :params,
					dataType : 'json',
					success : function(responseObject) {
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
				    		var userPhoto= fileInfo.userPhotoOut;
				    		var pfileTypeFlag="2";
				    		if(pmsgid==fileIdForShare){
				    			renderMyDriverData($(".preview-html-page"),mydriverdata);
				    		}else{
				    			openDir(fileInfo.pid,fileInfo.isEnt,pfileTypeFlag);
				    		}
						}else{
							alert(responseObject['msg']);
						}
					}
				});
				return false;
}

function beforeHref(obj,url){
	 return false;
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
		var useUrlPreviewType="bmp,jpg,jpeg,tif,tiff,gif,png,ico";
		if(useUrlPreviewType.indexOf(fileType)==-1  ){
			showFullScreenPanel(dirId,fileName,fileType,canPreviewFlag,canDownloadFlag,fileSize);
		}
	}
}

function previewMyFile(fileId,fileType,canPreviewFlag,canDownloadFlag,fileName,filesize) {
	//文件不允许预览
	if(canPreviewFlag!=undefined && canPreviewFlag=='0'){
		$("#previewpanel").empty();
		//判断文件类型，只有部分类型文件支持预览
		//var canPreviewType="txt,doc,docx,xls,xlsx,ppt,pptx,bmp,jpg,jpeg,tiff,gif,pcx,tga,exif,fpx,svg,psd,cdr,pcd,dxf,ufo,eps,ai,raw,png,pdf";
		 
		var useUrlPreviewType="bmp,jpg,jpeg,tif,tiff,gif,png,ico";
		if(useUrlPreviewType.indexOf(fileType)!=-1  ){
	    var url = './../r/jd?cmd=com.actionsoft.apps.mydriver_linkshare_preview_file_url';
	    var params={ fileId:fileId,shareUserId:shareUserId };
		 layer.msg('loading',{ icon: 2 ,type:3}, function(){ });
       	$.ajax({
			type : "POST",
			async : true,
			url : url,
			data :params,
			dataType : 'json',
			success : function(responseObject) {
      			if (responseObject['result'] == 'ok') {
      				layer.close(layer.index);
      				var url = responseObject["data"]['url'];
		            url=url.replace("./df","./../r/df");
      				$('#previewpanel').empty();
      				$('#previewpanel').append("<iframe frameBorder='0' class='previewfrm' id='previewfrm'></iframe>");
      				if(responseObject.data.isImg === true){
      					$('#previewfrm').attr("src", './../r/w?cmd=com.actionsoft.apps.mydriver_linkshare_preview_file_url_img&fileId='+fileId+'&shareUserId='+shareUserId);
      				}else{
      					$('#previewfrm').attr("src", url);
      				}
      				$("#fslistbtn").hide();
      				$("#fsrefreshbtn").hide();
      			} else {
      				alert(responseObject['msg']);
      			}
			}
		 });
		 return false;
       }else{
			 if(canPreviewType.indexOf(fileType)!=-1){
//                 var options={content:"文件正在加载，请稍侯。。。"};
                 // layer.load(2, options);
				    var params={
				    	fileId:fileId
				    };
					var url = './../r/jd?cmd=com.actionsoft.apps.mydriver_linkshare_preview_office_file&shareUserId='+shareUserId;
					$.ajax({
						type : "POST",
						async : true,
						url : url,
						data :params,
						dataType : 'json',
						success : function(responseObject) {
							if(responseObject['result'] == 'ok'){
//								$.simpleAlert("close");
					            var url = responseObject["data"]['url'];
					            url=url.replace("./w","./../r/w");
					            $("#previewpanel").empty();
					            if(fileType=="md"){
					            	$("#previewpanel").append("<iframe class='previewfrm' id='previewfrm' frameborder='no' border='0' scrolling='no'></iframe>");
					            	$("#previewfrm").attr("src",url);
					            	$("#previewpanel").css("overflow","hidden");
					            	$("#previewpanel").css("padding-bottom","70px");
					            	$("#fslistbtn").hide();
					            	$("#fsrefreshbtn").hide();
					            }else{
					            	$("#previewpanel").append("<iframe class='previewfrm' id='previewfrm' frameborder='no' border='0'  allowfullscreen='true' allowtransparency='true' ></iframe>");
					            	$("#previewfrm").attr("src",url);
//					            	var iframemy = document.getElementById("previewfrm");      
//							        if (iframemy.attachEvent) {      
//							        	iframemy.attachEvent("onload", function() { 
//							        		layer.close(layer.index);
//							            });      
//							        } else {      
//							        	iframemy.onload = function() {  
//							        		layer.close(layer.index);
//							            };      
//							        }  
					            	//var onlinedoctype="doc,docx,wps,rtf,ppt,pptx,dps,pdf";
					            	 var onlinedoctype=supportOfficeType;
					            	 if(onlinedoctype.indexOf(fileType)!=-1){
					            	 	$("#fslistbtn").show();
					            	 	$("#fsrefreshbtn").show();
					            	 }else{
					            	 	$("#fslistbtn").hide();
					            	 	$("#fsrefreshbtn").hide();
					            	 }
					            }
					            
					            //是否发送提醒
					            if(remindFlag!=undefined && remindFlag=="0"){
					            	sendAccessLog(shareId,"3");
					            }
						    }else{
						    	 $("#previewpanel").empty();
								 var str="";
								 str+="<div class='unpreview-panel'>";
//								 str+="<span class='file_icon_v file-type-rar_v'></span>";
								 str+="<span class='unpreview-panel-text'><table style='width:auto;height:100%;margin:0px 25px;'><tr><td>"+fileName+"</td></tr></table></span>";
								 str+="<hr style='border:none;color:#202428;'/>";
								 str+="<div class='unpreview-panel-text-type'>"+fileType+"</div>";
								 str+="<div class='unpreview-txt'></div>";
								 if(canDownloadFlag!=undefined && canDownloadFlag=='0'){
									  str+="<div class='unpreview-download-btn button blue'>下载文件（"+filesize+"）</div>";
								 }
								 str+="</div>";
								 $("#previewpanel").append(str);
//								 alert("文件转换失败");
								 layer.msg('文件转换失败',{ icon: 2,time: 2000  }, function(){ });
								 
								 $(".unpreview-download-btn").click(function(){
									 singledownload(fileId);
								 });
								 
								 $("#fslistbtn").hide();
								 $("#fsrefreshbtn").hide();
								 
							}
						}
					 });
					 return false;
			 }else{
				 $("#previewpanel").empty();
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
				 $("#previewpanel").append(str);
				 
				 $("#fslistbtn").hide();
				 $("#fsrefreshbtn").hide();
			 }
	   }

	}else{
		 $("#previewpanel").empty();
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
		 $("#previewpanel").append(str);
	}
	$(".unpreview-download-btn").click(function(){
		 singledownload(fileId,fileName);
	});
}


function sendAccessLog(shareId,logType){
	    var clientIp=$("#clientIp").val();
	    var params={
	    	shareId:shareId,
	    	logType:logType,
	    	clientIp:clientIp
	    };
		var url = './../r/jd?cmd=com.actionsoft.apps.mydriver_send_access_notification';
		$.ajax({
			type : "POST",
			async : true,
			url : url,
			data :params,
			dataType : 'json',
			success : function(responseObject) {
				if(responseObject['result'] == 'ok'){
		             
				}else{
					alert(responseObject['msg']);
				}
			}
		});
		return false;
}

function showFullScreenPanel(fileId){
    var params = {
		fileId:fileId,
		shareUserId:shareUserId
	};
	var url = './../r/jd?cmd=com.actionsoft.apps.mydriver_linkshare_get_detailinfo';
		$.ajax({
			type : "POST",
			async : true,
			url : url,
			data :params,
			dataType : 'json',
			success : function(responseObject) {
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
		    		var userPhoto= fileInfo.userPhotoOut;
		            showFullScreenPanelExt(fileId,fileName,fileType,canPreviewFlag,canDownloadFlag,filesize,replyuser,userPhoto);
				}else{
					alert(responseObject['msg']);
				}
			}
		});
		return false;
		
}


//外部链接预览不显示右侧评论区域
function showFullScreenPanelExt(fileId,fileName,fileType,canPreviewFlag,canDownloadFlag,fileSize,replyuser,userPhoto){
	var outerheight=$(window).height();
	 $("#fsouterpanel").css("height",outerheight);
	 $("#fsouterpanel").show();
	 $("#fullscreenpanel").show();
	 $("#previewpanel").show();
	 $("#fstoolbar").show();
	 
	 var prewidth=$("#fullscreenpanel").width();
	 $("#previewpanel").css("width",prewidth+"px");
	 $("#previewpanel").css("right","0px");
	 $("body").css("overflow","hidden");
	 
	 /*
	  var tooltitleWidth=$("#fstoolbar").width()-330;
	 $(".toolbar-title").css("width",tooltitleWidth+"px");
	 
	 userPhoto=userPhotoForShare.replace("./df","./../r/df");
	 var photoHtml='<div class="fs-replyer-photo awsui-user-profile" userid='+replyuser+'><img src="'+userPhoto+'"  class="previewuser-photo-cls"/></div>';
	 $(".toolbar-title").before(photoHtml);
	 //将文件标题显示
	 $(".toolbar-title").empty();
	 $(".toolbar-title").append(fileName);
	 */
		//文件类型图标
	var fileTypeIndex = fileName.lastIndexOf(".");
	var fileSuffix = fileName.substr(fileTypeIndex);
	fileSuffix = fileSuffix.toLowerCase();
	var fileIcon = getFileSuffixIcon(fileName.substr(fileTypeIndex)); 
	// 将文件标题显示
	$(".toolbar-title").empty();
	$(".toolbar-title").append(fileName);
	$(".toolbar-title").css('background-image',"url("+fileIcon+")");
	 
	 //左侧预览
	 previewMyFile(fileId,fileType,canPreviewFlag,canDownloadFlag,fileName,fileSize);
	 
	 if(canDownloadFlag!=undefined && canDownloadFlag=='1'){
		 $("#fsdownloadbtn").hide();
	 }else if(canDownloadFlag!=undefined && canDownloadFlag=='0'){
		 $("#fsdownloadbtn").show();
	 }else{}
	 
	 $("#fsdownloadbtn").off('click').on('click',function(){
	 	 if(canPreviewFlag=="1"){
	 	 	 singledownload(fileId);
	 	 }else{
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
			
			    $("#online_sourcefilename").html(sourceFileName);
			    $("#online_pdffilename").html(filePdf);
			    $("#sourceFileSize").html(fileSize);
			    var pdfFileSize=formatSize(document.getElementById("previewfrm").contentWindow.fileSize);
			    $("#pdfFileSize").html(pdfFileSize);
			 	$("#sourcedownloadurl").off('click').on('click',function(){
			 		 singledownload(fileId);
			    }); 
			    
			    var pdfUrl=document.getElementById("previewfrm").contentWindow.url.replace("./df","./../r/df");
			    $("#pdfdownloadurl").attr("download",pdfUrl);
			    $("#pdfdownloadurl").attr("href",pdfUrl);
			    
			    $("#online_file_pdffile").off('click').on('click',function(){
			 		// window.open(pdfUrl);
			    });
			    
			    if(fileSubType=="pdf"){
			    	$("#online_file_source").hide();
			    	 $("#show-fsdownload-popbox").popbox({
					        target:$(this),
					        width:350,
					        height:40
				     });
			    }else{
			    	$("#online_file_source").show();
				    $("#show-fsdownload-popbox").popbox({
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
	 
	 $("#fslistbtn").off('click').on('click',function(){
	    document.getElementById("previewfrm").contentWindow.listShowEvent();
	 });
	 
	  $("#fsrefreshbtn").off('click').on('click',function(){
	    document.getElementById("previewfrm").contentWindow.fileReloadEvent();
	 });
	 
	 $("#fsclosebtn").click(function(){
		 closeFsPanel();
	 });
	 
	$('#filepre_back').click(function () {
		 closeFsPanel();
	});
	
}

function closeFsPanel(){
	 $("#fsouterpanel").hide();
	 $("#fullscreenpanel").hide();
	 $("#previewpanel").hide();
	 $("#fstoolbar").hide();
}

var curCounts=0;
//加载文件数据     dirId:目录Id,searchVlaue:检索词
function loadFileData(navType,dirId,searchValue,orderCol, orderType,start,size){
	start=curCounts+1;
	var url='./../r/jd?cmd=com.actionsoft.apps.mydriver_linkshare_loadfiledata&t='+Math.random();
	//请求数据
	$.ajax({
		type : "POST",
		async:false,
		url : url,  
		data :{"navType":navType,"dirId":dirId,"searchValue":searchValue,"orderCol":orderCol,"orderType":orderType,"start":start,"size":size,"shareUserId":shareUserId},
		success : function(data){
			if(data['result'] == 'ok'){
				fileList = data["data"]['fileList'];
				renderMyDriverData(nowObj,fileList);
			}else{
				alert(data['msg']);
			}
		}
	});
}


function savepic(picurl) {
	var re;
	if (document.all.downfileIframe == null) {
		objIframe = document.createElement("IFRAME");
		document.body.insertBefore(objIframe);
		objIframe.outerHTML = "<iframe name=downfileIframe style='width:400px;hieght:300px' src="+ picurl + "></iframe>";
		re = setTimeout("savepic()", 1)
	} else {
		clearTimeout(re)
		pic = window.open(picurl, "downfileIframe")
	}
} 


//单文件下载
function singledownload(fileId,fileName) {
	/*//是否发送提醒
	if(remindFlag!=undefined && remindFlag=="0"){
		sendAccessLog(shareId,"4");
	}*/
	//var picurl= "./../r/df?repositoryName=!myfile2&contentTokenId="+fileId+"&appId=com.actionsoft.apps.mydriver&fileName="+fileName+"&t="+Math.random();
   // window.location.href=picurl;
	//$("#fsdownloadbtn").attr("href",picurl);
	
	//单个文件 下载  请求数据
	$.ajax({
		type : "POST",
		async : true,
		url : './../r/jd?cmd=com.actionsoft.apps.mydriver_linkshare_downloadurl&t=' + Math.random(),
		data : {"fileId" : fileId},
		dataType : 'json',
		success : function(response) {
			var msg = response.msg;
			if (response.result != 'ok') {
				alert(msg);
				return false;
			} else {
//				$("#downfileIframe").attr("src",msg);
//				window.location.href=msg;
				window.open(msg);
				 //是否发送提醒
	            if(remindFlag!=undefined && remindFlag=="0"){
	            	sendAccessLog(shareId,"4");
	            }
			}
		}
	});
	return false;
}

function validePassword(sharePwdinput){
	   var url = './../r/jd?cmd=com.actionsoft.apps.mydriver_linkshare_validate_password';
	   var params={ 
				shareId:shareId,
				inputPass:sharePwdinput
		   };
		$.ajax({
			type : "POST",
			async : true,
			url : url,
			data :params,
			dataType : 'json',
			success : function(responseObject) {
				if (responseObject['result'] == 'ok') {
					var isTrue=responseObject["data"]["isTrue"];
					if(isTrue){
//						alert("提取密码输入成功");
						layer.msg('提取密码输入成功',{ icon: 1,time: 1000  }, function(){ });
						$(".showpwdpanel").hide("1000");
						$(".showfilepanel").show("1000");
						renderMyDriverData($(".preview-html-page"),mydriverdata);
						if(remindFlag!=undefined && remindFlag=="0"){
			            	sendAccessLog(shareId,"1");
			            }
					}else{
						layer.msg('提取密码输入错误',{ icon: 2,time: 2000  }, function(){ });
//						alert("提取密码输入错误");
						if(remindFlag!=undefined && remindFlag=="0"){
			            	sendAccessLog(shareId,"2");
			            }
				    }
				} else {
					alert(responseObject['msg']);
				}
			}
		});
		return false;
		
}


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