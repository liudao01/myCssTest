/**
* @author zhangz
*/
var NAV_ALLFILE = "allfile";
var NAV_OTHERFILE = "otherfile";
var NAV_MYSHARE = "myshare";
var NAV_SHAREME = "shareme";
var NAV_LINKSHARE="linkshare";
var NAV_RECILEBIN = "recycle";
var NAV_ENTALLFILE='entallfile';
var NAV_MONITOR = "monitor";
var NAV_LOG = "log";
var NAV_ADMINCONFIG = "adminconfig";
var VIEW_TYPE_LIST = 0;
var VIEW_TYPE_ICON = 1;
var fileList;
var current_nav = NAV_ALLFILE;
var current_path_list;
var current_path = '';
var current_colModels;
var mydriver = 'mydriver';
var currentTimestr = '';
var currentView = VIEW_TYPE_LIST;
var logpagenow = 1;
var alllogcounts=1;//日志的总条数
var logpagesize=15;
var counts=0;
var curCounts=0;
var currentLen=0;
var _more;
var vtype=0;
var filesizelist;
var foldersizelist;
var entfoldersizelist;
var filesize_colModels;
var filesize_colModels1;
var filter;
var currentsumfilesize=0;//网盘监控当前已使用的总容量
var allcapacity=0;//网盘总容量
var currentordertype;
var currentordercol;
var currentfilecat="";
var currentcat="";
var inEntPath=0;//0非企业文件夹路径  0企业文件夹路径
var folderCapacity;
var	currentFolderUsedSize;
var showUploadBtnFlag=0;
var	showNewFolderBtnFlag=0;
var	showNewOnlineFileFlag=0;

$(document).ready(function(){
	
	//注册左侧导航事件	
	registerEventOfLeft();
	if(fileIdForShare!=""){
		//首页
		if(shareToMeFlag!=""){
			if(shareToMeFlag=="1"){
				//直接定位到别人的分享中
				changeNav(NAV_SHAREME);
				showFullScreenPanel(fileIdForShare);
			}else if(shareToMeFlag=="2"){
				//直接定位到链接共享
				changeNav(NAV_LINKSHARE);
				showFullScreenPanel(fileIdForShare);
			}else if(shareToMeFlag=="0"){
				//直接定位企业
				changeNav(current_nav);
				if(fileTypeForShare!=undefined && fileTypeForShare=="1"){
					//文件
					showFullScreenPanel(fileIdForShare);
				}else if(fileTypeForShare!=undefined && fileTypeForShare=="2"){
					//文件夹
					showCommentPanel(fileIdForShare);
				}
			}else{
				//正常进入网盘 加载右侧区域
				changeNav(current_nav);
			}
			fileIdForShare="";
			window.parent.$(".metro-main-frame-refresh").click(function(){
				try{
					var mainUrl="./w?sid="+sid+"&cmd=com.actionsoft.apps.mydriver_home";
					window.parent.$("iframe.metro-main-frame").attr("src",mainUrl);
				}catch (e) { }
			});
			
		}
		
		if(downFileFlag!=undefined && downFileFlag!="" && downFileFlag=="1"){
			  changeNav(NAV_SHAREME);
			  window.location.href=downFileUrl;
		}else{
			 //正常进入网盘 加载右侧区域
			 changeNav(current_nav);
		}
	}else{
		//正常进入网盘 加载右侧区域
		  changeNav(current_nav);
	}
	
	
	
	
	$(window).resize(function(){
			windowresize();
     });
    
	
	var layoutTitle="";
	layoutTitle = " <span class='button all-new-cls'>" + 新建Btn + "</span>";

	 
    
    if(useTreeNavFlag=="0"){
    	//使用树形导航
    	 $("#mydriver-left").hide();
    	 $("#mydriver-left-tree").show();
    	 //布局
		$("#todo-layout").layout({
			head : { target : "#mydriver-layout-head", height : "70px" },
			left: {
				target: "#mydriver-left-tree",
				title: layoutTitle,
				dragable : false, nogradient : false, afterDrag : function() {resizeRightWidth();} },
			separater : { target : "#mydriver-layout-separater", width : 2 },
			right : { target : "#mydriver-right" }
		});
		
		//布局完成后加载左侧树形导航
	    loadLeftNavTree();
    }else{
    	 $("#mydriver-left").show();
    	 $("#mydriver-left-tree").hide();
		//布局
		$("#todo-layout").layout({
			head : { target : "#mydriver-layout-head", height : "70px" },
			left: {
				target: "#mydriver-left",
				title: layoutTitle,
				dragable : false, nogradient : false, afterDrag : function() {resizeRightWidth();} },
			separater : { target : "#mydriver-layout-separater", width : 2 },
			right : { target : "#mydriver-right" }
		});
    }
	//隐藏
	$(".awsui-layout-left-op").hide();
	
	$("#mydriver-layout-separater").css("width","-1px");
	//判断用户是否能看到管理员面板
	if((isMyDriverAdmin!=undefined && isMyDriverAdmin=="1") ||(isAdmin!=undefined && isAdmin=="1")){
		$("#mydriver-admin-panel").show();
	}
	
	//管理员面板
	$("#admin-panel").css("display","none");
	$("#adminCenter").find(".icon").attr("class", "icon nav-arrow-img-down");
	$("#adminCenter").click(function(){
		if($("#admin-panel").css("display")=='block'){
			$("#admin-panel").css("display","none");
			$(this).find(".icon").attr("class", "icon nav-arrow-img-down");
		}else{
			$("#admin-panel").css("display","block");
			$(this).find(".icon").attr("class", "icon nav-arrow-img-up");
		}
	});
	
	//分享面板
	$("#share-panel").css("display","none");
	$("#shareCenter").find(".icon").attr("class", "icon nav-arrow-img-down");
	$("#shareCenter").click(function(){
		if($("#share-panel").css("display")=='block'){
			$("#share-panel").css("display","none");
			$(this).find(".icon").attr("class", "icon nav-arrow-img-down");
		}else{
			$("#share-panel").css("display","block");
			$(this).find(".icon").attr("class", "icon nav-arrow-img-up");
		}
	});
	
	//分类面板
//	$("#catetory-panel").css("display","none");
//	$("#catetoryCenter").find(".icon").attr("class", "icon nav-arrow-img-down");
	$("#catetoryCenter").click(function(){
		if($("#catetory-panel").css("display")=='block'){
			$("#catetory-panel").css("display","none");
			$(this).find(".icon").attr("class", "icon nav-arrow-img-down");
		}else{
			$("#catetory-panel").css("display","block");
			$(this).find(".icon").attr("class", "icon nav-arrow-img-up");
		}
	});
	
	//企业分类
	$("#ent-catetory-panel").css("display","none");
	$("#ent-catetoryCenter").find(".icon").attr("class", "icon nav-arrow-img-down");
	$("#entCatetoryCenter").click(function(){
		if($("#ent-catetory-panel").css("display")=='block'){
			$("#ent-catetory-panel").css("display","none");
			$(this).find(".icon").attr("class", "icon nav-arrow-img-down");
		}else{
			$("#ent-catetory-panel").css("display","block");
			$(this).find(".icon").attr("class", "icon nav-arrow-img-up");
		}
	});
	
	
	
	//标签面板
	$("#label-panel").css("display","none");
	$("#labelCenter").find(".icon").attr("class", "icon nav-arrow-img-down");
	$("#labelCenter").click(function(){
		if($("#label-panel").css("display")=='block'){
			$("#label-panel").css("display","none");
			$(this).find(".icon").attr("class", "icon nav-arrow-img-down");
		}else{
			$("#label-panel").css("display","block");
			$(this).find(".icon").attr("class", "icon nav-arrow-img-up");
		}
	});
	
	//标签管理
	$(".filelabel-icon").click(function(e){
		showLabelPanel();
		e.stopPropagation();
	});
	
    if( current_nav!=NAV_RECILEBIN &&current_nav!=NAV_MONITOR && current_nav!=NAV_ADMINCONFIG && current_nav!=NAV_SHAREME && current_nav!=NAV_MYSHARE && current_nav!=NAV_LINKSHARE && current_nav!=NAV_LOG){
			    chargeAllNewBtnVisible();
	}
	$('#createdir').off('click').on('click',function(e){
		createFolder();
		$('.newFileMenu').hide();
		e.stopPropagation();
	});
	$('#createfile').off('click').on('click',function(e){
		createMarkDownFile();
		e.stopPropagation();
	});
	
	//清空回收站
	$("#clean-recycle").click(function(){
		var options = {
			title: 提示, content: 确定要清空回收站吗 + "？", onConfirm: function () {
				cleanRecycle();
			}
		};
		$.confirm(options);
	});
	
	//全部还原
	$("#restore-all").click(function(){
		var options = {
			title: 提示, content: 确定要全部还原回收站中文件或文件夹吗 + "？", onConfirm: function () {
				restoreAll();
			}
		};
		$.confirm(options);
	});
	
	//图片预览  注册插件
	$("a[rel=fancyboxgroup]").fancybox({
		'transitionIn' : 'none','transitionOut' : 'none',		'titlePosition' : 'over',
		'showNavArrows' : 'true',
		'titleFormat' : function(title, currentArray, currentIndex, currentOpts) {
			return '<span id="fancybox-title-over">Image ' + (currentIndex + 1) + ' / ' + currentArray.length + (title.length ? ' &nbsp; ' + title : '') + '</span>';
		},
		'onClosed':function(){ alert("close fun"); },
		'onCleanup':function(){ alert("onCleanup fun"); }
	});
	
	
	//图片预览  注册插件
	$("a[rel=fancyboxgroup2]").fancybox({
		'transitionIn' : 'none','transitionOut' : 'none',		'titlePosition' : 'over',
		'showNavArrows' : 'true',
		'titleFormat' : function(title, currentArray, currentIndex, currentOpts) {
			return '<span id="fancybox-title-over">Image ' + (currentIndex + 1) + ' / ' + currentArray.length + (title.length ? ' &nbsp; ' + title : '') + '</span>';
		},
		'onClosed':function(){ alert("close fun"); },
		'onCleanup':function(){ alert("onCleanup fun"); }
	});
	
	//图片预览  注册插件  进度条上的
	$("a[rel=fancyboxgroup1]").fancybox({
		'transitionIn' : 'none', 'transitionOut' : 'none', 'titlePosition' : 'over', 'showNavArrows' : 'true',
		'titleFormat' : function(title, currentArray, currentIndex, currentOpts) {
			return '<span id="fancybox-title-over">Image ' + (currentIndex + 1) + ' / ' + currentArray.length + (title.length ? ' &nbsp; ' + title : '') + '</span>';
		}
	});
	
	/*
	 //  文件  实时查询
	$("#searchvalue").buttonedit({
		onLiveSearch : function(e) {
            searchFile();
		}
	});
	$("#searchvalue").css("width","150px");
	$(".awsui-buttonedit-wrap").css("width","120px");
	
	*/
	//注册平铺列表切换
    $("#barCmdViewSmall").click(function(){
		 //平铺
    	var vtype=$(this).attr("vtype");
    	changeShowType(vtype);
	});
    $("#barCmdViewList").click(function(){
		 //列表
    	var vtype=$(this).attr("vtype");
    	changeShowType(vtype);
	});
	
	//注册平铺列表切换
    $("#mysharepanel").siblings().removeClass('current');
	$("#mysharepanel").addClass('current');
    $("#mysharepanel").click(function(){
		 //我的分享
		changeNav(NAV_MYSHARE);
		$(this).siblings().removeClass('current');
		$(this).addClass('current');
	});
	
    $("#sharemepanel").click(function(){
		 //分享给我
		 changeNav(NAV_SHAREME);
		 $(this).siblings().removeClass('current');
		 $(this).addClass('current');
	});
	
	//每个目录下容量统计图表
	$(".show-cap-btn").click(function(){
		$("#show-cap-popbox").popbox({
		        target:$(this),
		        width:400,
		        height:300
	     });
		renderCapPopboxData();
	});
	
	//每个目录下容量统计图表
	$(".show-search-btn").click(function(){
		$(".show-search-btn").data("popbox", false);
		$("#show-search-popbox").popbox({
		        target:$(this),
		        width:250,
		        height:100
	     });
		if($("#show-search-popbox").find(".log-search").length>0){
			$("#show-search-popbox").popbox({
		        target:$(this),
		        width:300,
		        height:150
	        });
		}else{
			$("#show-search-popbox").popbox({
		        target:$(this),
		        width:250,
		        height:100
	       });
		}
//		renderSearchPopboxData("file");
	});
	
   
   if(shareToMeFlag=="1"){
	   $("#sharemepanel").click();
	   //个人文件夹面板折叠
	   $("#catetory-panel").css("display","none");
 	   $("#catetoryCenter").find(".icon").attr("class", "icon nav-arrow-img-down");
 	   //分享面板展开
 	   $("#share-panel").css("display","block");
	   $("#share-panel").find(".icon").attr("class", "icon nav-arrow-img-up");
	}
	
	$(".all-new-cls").click(function(event){
		if($(".all-new-panel-cls").is(":visible") == true){
		  $(".all-new-panel-cls").hide();
		}else{
		  $(".all-new-panel-cls").show();
		}
		 event.stopPropagation();
	});
	$("#todo-layout").click(function(){
		 $(".all-new-panel-cls").hide(function(){
		 });
	});
	
	renderFileIcon();
});
function renderFileIcon(){
	$(".file-list-row img").each(function(i,ele){
		try{
			var imgUrl=$(ele).css("background-image");
			var imgUrl = imgUrl.replace(/"/g, "");
			var imgUrl = imgUrl.replace("'", "");
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
	
	$(".file-list-row li").each(function(i,ele){
		if(current_nav==NAV_LINKSHARE || current_nav==NAV_RECILEBIN){
			$(ele).css("cursor","auto");
		}
	});
	
}
function upfileFun(cat,filters){
	//var filter1 = [["Images (*.jpg; *.jpeg; *.gif; *.png; *.bmp)","*.jpg; *.jpeg; *.gif; *.png; *.bmp"]];

	if(singlefilesize==0){
	   singlefilesize=1024;
	}
	var timestr=getTimeStr1();
	$("#upfile-"+cat).upfile({
		sid: sid,
		appId: appId,
		groupValue: userid,
		fileValue: timestr,
		repositoryName: "-myfile",
		sizeLimit: parseInt(singlefilesize)*1024*1024,
		numLimit:0,
		filesToFilter:filters,
		add:function(e, data) {
			var returnflag=true;
			$.each(data.files, function(index, file) {
				returnflag = upfileAddCallBackFunction(file.name, file.type, file.size);
			});
			return returnflag;
		},
		progress:function(e,data) {
			$.each(data.files, function(index, file) {
			    upfileProgressCallBackFunction(file.name, data.loaded, data.total);
			});
		},
		done:function(e,data) {
			var oldname="";
			$.each(data.result, function(index, dom) {
				if (index == "data") {
					oldname = dom["data"]["attrs"]["fileName"];
				}
			});

			$.each(data.files, function(index, file) {
					var dirId = $('#currentDirId').val();
					var addflag=addFileData(dirId,file.name,file.size,oldname,timestr,inEntPath);//保存上传的file
					if(addflag){
					    openDir(current_path['id']);//重新加载模板面板
				     }
		        $('.p_item[fileName="'+file.name+'"]').removeAttr("fileName");
		        
			});
		},
		complete:function(){
			setTimeout(function(){ $(".progress_wrap").animate({  height: "0px"   },'fast',function(){ $('.dlg_hd .min').removeClass('min').addClass('max'); }); },"2000");
			//在关闭对话框的时候将新建的层隐藏
			if($(".all-new-panel-cls").is(":visible") == true){
				  $(".all-new-panel-cls").hide();
			}
		},
		error:function(e,data) {
			$.each(data.files, function(index, file) {
                 $.simpleAlert(file.name);
			});
		}

	});
}


//文件上传  add回调
function upfileAddCallBackFunction(name,type,size){
	var addflag=true;
	var limitsize = parseInt(singlefilesize) * 1024 * 1024;
	if (size == 0) {
		$.simpleAlert(空附件不允许上传);
	    addflag=false;
	} else if (size > limitsize) {
		$.simpleAlert(文件大小超出所限制的 + singlefilesize + "M", 'warning');
		addflag=false;
	}else{
			if($(".box").is(":visible") == false){
				$(".box").slideToggle("fast",function(){ });
				$(".progress_wrap").animate({  height: "170px" },'fast',function(){ $('.dlg_hd .max').removeClass('max').addClass('min'); });
				$('.dlg_hd .zom').bind('click',function(){
					if($(this).hasClass('min')){
						$(".progress_wrap").animate({  height: "0px"   },'fast',function(){ $('.dlg_hd .min').removeClass('min').addClass('max'); });
					}else{
						$(".progress_wrap").animate({  height: "170px" },'fast',function(){ $('.dlg_hd .max').removeClass('max').addClass('min'); });
					}
				});
				$('.dlg_hd .upd-close').off('click').on('click',function(){
					$(".box").hide();
					 $('.progress_content').empty();
			   });
			}else{
				$(".progress_wrap").animate({  height: "170px" },'fast',function(){ $('.dlg_hd .max').removeClass('max').addClass('min'); });
			}
			
		var item = "<div class='p_item'  fileName='"+name+"'><div class='inner_mask'></div><div class='inner_result'><div class='ph_title'></div><div class='ph_size'></div><div class='ph_loaded'></div></div>";
		$('.progress_content').append(item);
		addflag=true;
	}
	return addflag;
}
//文件上传  progress 回调
function upfileProgressCallBackFunction(name,bytesLoaded,bytesTotal){
	//将数据显示
	var percent = Math.floor((bytesLoaded/bytesTotal)*100);
 	$('.p_item[fileName="'+name+'"]').find('.inner_mask').css('width',percent+'%');
    $('.p_item[fileName="'+name+'"]').find('.ph_title').html(name);
    $('.p_item[fileName="'+name+'"]').find('.ph_size').html(formatSize(bytesTotal));
    $('.p_item[fileName="'+name+'"]').find('.ph_loaded').html(percent+'%');
}

//日期区间确定按钮回调函数
function datepickerCallBackFun(start,end){
	 $('#begintime').val(start);
	 $('#endtime').val(end);
}

//日期区间清空按钮回调函数
function emptybtnFun(){
	 $('#begintime').val('');
	 $('#endtime').val('');
}

//保存创建的文件夹内容
function saveTemplate(parentDirId, dirName,isEnt) {
	var url = './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_adddir';
	awsui.ajax.request({
		url : url,
		method : 'POST',
		dataType : 'json',
		data : {
			parentDirId : parentDirId,
			isEnt:isEnt,
			dirName : dirName
		},
		success : function(response, options) {
			if (response['result'] == 'ok') {
				openDir(parentDirId);
				//重新加载模板面板
				$("#mydriver_right_dialog").dialog("close");
				$.simpleAlert(新建成功, 'ok', 2000, {model: true});
				if(useTreeNavFlag=="0"){
			    	//加载左侧树形导航
			        //loadLeftNavTree();
					//刷新树节点
					if(parentDirId==undefined || parentDirId==""){
						if(isEnt=="0"){
							parentDirId="root";
						}else{
							parentDirId="entroot";
						}
					}
					leftNavTree.addNode((response.data.treeData), leftNavTree.getNodeDomById(parentDirId), function () {
						leftNavTree.initStyles();
						leftNavTree.initIcon(response.data.treeData);
					});
					var node = leftNavTree.getNodeById(parentDirId);
					loadLeftNavTreeNode(node);
			    }
			} else {
				//awsui.MessageBox.alert('提示', response['msg']);
				$.simpleAlert(response['msg'], response['result']);
			}
		}
	});
}

//保存上传的文件
function addFileData(dirId, filename, filesize, oldname, currentTimestr,inEntPath) {
	var url='./jd?sid='+sid+'&cmd=com.actionsoft.apps.mydriver_addfile&t='+Math.random();
	var params={
		"dirId": dirId,
		"filename" : filename,
		"filesize" : filesize,
		"oldname" : oldname,
		"timestr" : currentTimestr,
		"isEnt":inEntPath
	};
	     var fileDownloadurl="";
		 $.ajax({
			type : "POST",async:false,url : url,data :params,
			success : function(response){
				 if (response['result'] == 'ok') {
						fileDownloadurl=response['data']['downloadurl'];
						var fileType =response['data']['filetype'];
						var filesize =response['data']['filesize'];
						var name =response['data']['driName'];
						 var picType="bmp,jpg,jpeg,tif,tiff,gif,png,ico";
						 if(fileType!="f"  &&  picType.indexOf(fileType.toLowerCase())!=-1){
						 	if(fileDownloadurl==''){ fileDownloadurl='#'; }
						 	titlehtmls='<a rel="fancyboxgroup1"  href="'+fileDownloadurl+'"  style="cursor: pointer;">'+name+'</a>';
						 }else{
							if(fileDownloadurl==''){ fileDownloadurl='#'; }
							titlehtmls='<a href="'+fileDownloadurl+'" style="cursor: pointer;">'+name+'</a>';
						 }
						  $('.p_item[fileName="'+filename+'"]').find('.ph_title').html(titlehtmls);
						  $('.p_item[fileName="'+filename+'"]').find('.ph_size').html(formatSize(filesize));
					 //重新渲染网盘的个人容量
					 currentUsedSize = response['data']['currentUsedSize'];
					 allSize = response['data']['allSize'];
					 refreshUserCapacity();
				 } else {
						$('.p_item[fileName="'+filename+'"]').find('.ph_title').html("<font color='red'>【上传失败】</font>"+filename);
						$('.p_item[fileName="'+filename+'"]').find('.ph_loaded').html("");
						
						
						$.simpleAlert(response['msg'], response['result']);
					}
			}
		});
		return true;
	 
}

//点击表头排序
function sortFile(col, obj) {
	if(col!='attr'){
		$(".file-list").empty();
		var ordertype = $(obj).attr("ordertype");
		currentordertype=ordertype;
		if (ordertype == "desc") {
			$(obj).attr("ordertype", "asc");
			currentordertype="asc";
			$(obj).children("img").attr("class", "title-arrow-img-down");
		} else {
			$(obj).attr("ordertype", "desc");
			currentordertype="desc";
			$(obj).children("img").attr("class", "title-arrow-img-up");
		}
		var dirId = $('#currentDirId').val();
		openDirForSortFile(dirId, col, ordertype, "", "");
	}
}


//注册左侧导航区域事件
function registerEventOfLeft() {
	//切换左侧导航
	$(".todo-navigate-group-item").click(function() {
		changeNav($(this).attr("name"));
	});
}



//打开目录
/**
 * dirId 目录
 * keepSearchFlag
 */
function openDir(dirId,keepSearchFlag){
	if(keepSearchFlag!=undefined && keepSearchFlag=="1"){
	}else{
		$('#searchvalue').val("");
	}
	var searchValue=$('#searchvalue').val();
	counts = 0;
	curCounts = 0;
	$('.file-list').empty();
	loadFileData(current_nav,dirId,searchValue,"", "","","");//请求数据
    showView(vtype);//展示列表或者缩略图
     windowresize();
	$('#currentDirId').val(dirId);
	return false;
}

//打开目录  for
function openDirForSortFile(dirId,orderCol, orderType,start,size){
	var searchValue=$('#searchvalue').val();
 
	counts = 0;
	curCounts = 0;
	$('.file-list').empty();
	if(orderType=="desc"){
		orderType="asc";
	}else{
		orderType="desc";
	}
	loadFileData(current_nav,dirId,searchValue,orderCol, orderType,start,size);//请求数据
    showView(vtype);//展示列表或者缩略图
     windowresize();
	$('#currentDirId').val(dirId);
	return false;
}



//加载文件数据     dirId:目录Id,searchVlaue:检索词
function loadFileData(navType,dirId,searchValue,orderCol, orderType,start,size){
	start=curCounts+1;
	var params={
			navType:navType,
			dirId:dirId,
			searchValue:searchValue,
			orderCol:orderCol,
			orderType:orderType,
			start:start,
			size:size,
			isEnt:inEntPath
	};
	var url='./jd?sid='+sid+'&cmd=com.actionsoft.apps.mydriver_loadfiledata&t='+Math.random();
	//请求数据
	$.ajax({
		type : "POST",async:false,url : url,data :params,
		success : function(data){
			if(data['result'] == 'ok'){
				fileList = data["data"]['fileList'];
				var len = fileList.length;
				currentLen=len;
				counts = data['data']['counts'];
				curCounts= curCounts+ len;
				currentordertype=data['data']['ordertype'];
                currentordercol=data['data']['ordercol'];
				current_path_list = data["data"]['path'];
				currentfilecat=data["data"]["currentfilecat"];

				showUploadBtnFlag=data["data"]["showUploadBtnFlag"];
				showNewFolderBtnFlag=data["data"]["showNewFolderBtnFlag"];
				showNewOnlineFileFlag=data["data"]["showNewOnlineFileFlag"];

			
			
				if(current_path_list.length > 0){
					current_path = current_path_list[current_path_list.length-1];
				}else{
					current_path="";
				}
				folderCapacity=data["data"]["folderCapacity"];
				currentFolderUsedSize=data["data"]["currentFolderUsedSize"];
				//changenav的时候还未判断使用情况 在读取数据后进行判断
				if( current_nav!=NAV_RECILEBIN &&current_nav!=NAV_MONITOR && current_nav!=NAV_ADMINCONFIG && current_nav!=NAV_SHAREME && current_nav!=NAV_MYSHARE && current_nav!=NAV_LINKSHARE && current_nav!=NAV_LOG){
				    chargeAllNewBtnVisible();
				}
				
			}else{
				$.simpleAlert(data['msg'], data['result']);
			}
		}
	});
}
function setNewBtnUnVisible(){
	$(".tool-btn-upload").hide();
	$(".new-file-btn-cls").css("opacity","0.5");
	$(".new-file-btn-cls").css("filter","Alpha(opacity=50)");
	$(".new-file-btn-cls").off("click");
	
	var oldid=$(".upfile-cat").attr("id");
	$("#"+oldid).unbind("click");//取消绑定上传事件
	$("#createdir").hide();
	$(".new-dir-btn-cls").css("opacity","0.5");
	$(".new-dir-btn-cls").css("filter","Alpha(opacity=50)");
	$(".new-dir-btn-cls").off("click");
	
	
	$("#createfile").hide();
	$(".new-onlinefile-btn-cls").css("opacity","0.5");
	$(".new-onlinefile-btn-cls").css("filter","Alpha(opacity=50)");
	$(".new-onlinefile-btn-cls").off("click");
}

function chargeAllNewBtnVisible(){
	//console.log(current_nav);
	//console.log("showUploadBtnFlag:"+showUploadBtnFlag);
	//console.log("showNewFolderBtnFlag:"+showNewFolderBtnFlag);
	//console.log("showNewOnlineFileFlag:"+showNewOnlineFileFlag);
	//上传按钮
	if(showUploadBtnFlag!=undefined && showUploadBtnFlag=="1"){
		$(".tool-btn-upload").show();
		$(".new-file-btn-cls").css("opacity","1");
		$(".new-file-btn-cls").css("filter","Alpha(opacity=100)");
		$(".new-file-btn-cls").off("click").on("click",function(){
			alert("上传文件");
		});
		changeUpfileFilter(current_nav);
	}else{
		$(".tool-btn-upload").hide();
		$(".new-file-btn-cls").css("opacity","0.5");
		$(".new-file-btn-cls").css("filter","Alpha(opacity=50)");
		$(".new-file-btn-cls").off("click");
		
		var oldid=$(".upfile-cat").attr("id");
		 $("#"+oldid).unbind("click");//取消绑定上传事件
	}
	
	if(showNewFolderBtnFlag!=undefined && showNewFolderBtnFlag=="1"){
		if(current_nav=="entallfile" || current_nav=="allfile"){
			$("#createdir").show();
			$(".new-dir-btn-cls").css("opacity","1");
			$(".new-dir-btn-cls").css("filter","Alpha(opacity=100)");
			$(".new-dir-btn-cls").off("click").on("click",function(){
				//alert("新建文件夹");
				createFolder();
			});
		}else{
			$("#createdir").hide();
			$(".new-dir-btn-cls").css("opacity","0.5");
			$(".new-dir-btn-cls").css("filter","Alpha(opacity=50)");
			$(".new-dir-btn-cls").off("click");
		}
		
	}else{
		$("#createdir").hide();
		$(".new-dir-btn-cls").css("opacity","0.5");
		$(".new-dir-btn-cls").css("filter","Alpha(opacity=50)");
		$(".new-dir-btn-cls").off("click");
	}
	
	// 0可以 1不可以
	if(showNewOnlineFileFlag!=undefined && showNewOnlineFileFlag=="1"){
		
        if(current_nav=="entallfile" || current_nav=="allfile" || current_nav=="ent_文档" || current_nav=="文档"  ){
        	$("#createfile").show();
    		$(".new-onlinefile-btn-cls").css("opacity","1");
    		$(".new-onlinefile-btn-cls").css("filter","Alpha(opacity=100)");
    		$(".new-onlinefile-btn-cls").off("click").on("click",function(){
    			//alert("新建在线文件");
    			createMarkDownFile();
    		});
		}else{
			$("#createfile").hide();
			$(".new-onlinefile-btn-cls").css("opacity","0.5");
			$(".new-onlinefile-btn-cls").css("filter","Alpha(opacity=50)");
			$(".new-onlinefile-btn-cls").off("click");
		}
	}else{
		$("#createfile").hide();
		$(".new-onlinefile-btn-cls").css("opacity","0.5");
		$(".new-onlinefile-btn-cls").css("filter","Alpha(opacity=50)");
		$(".new-onlinefile-btn-cls").off("click");
	}
	var span = $(".eachnav").find("div.todo-navigate-group-header");
	var ul = $(".eachnav").find("div.eachnav-panel");
    span.off("click").on("click",function(){
     if($(this).next().is(":visible") == true){
		 $(this).next().css("display", "none");
            $(this).find(".icon").attr("class", "icon nav-arrow-img-down");
   	  }else{
		 $(this).next().css("display", "block");
		 ul.each(function () {
			 $(this).css("display", "none");
		 });
		 $(this).next().css("display", "block");
              $(this).find(".icon").attr("class", "icon nav-arrow-img-up");
	 }
	});
}

//日志列表
function showLogList(){
	$(".awsui-buttonedit-superior").css("top","");
	var listStr = '';
	  $(".file-list").empty();
	var loadingStr = '<div id="progressBar" class="progressBar">' + 加载提示 + '</div>';
	  $(".file-list").append(loadingStr);
	if(fileList != null){
		for(var i = 0;i< fileList.length;i++){
			var fileInfo = fileList[i];
			var fileId = fileInfo['id'];
			listStr += '<ul class="logfile-list-row clearfix" rowid="'+fileId+'">';
			for(var j = 0;j < current_colModels.length;j++){
				var col = current_colModels[j];
				var colKey = col["name"];
				var colValue = fileInfo[colKey];
				if(col.formatter){
					colValue = eval(col.formatter +'("'+colValue+'");');
				}
				listStr+= '<li class="fl filename '+col["cls"]+'"><div class="lh40">';
				listStr +='<a class="log_file_title" awsui-qtip=" '+colValue+'">'+colValue+'</a>';
				listStr += '</div></li>';
			}
			listStr += '</ul>';
		}
	}
	
	  $(".file-list").empty();
	  if(listStr == ''){
		//listStr = '<p  class="nodata">没有数据</p>';
		  listStr = ' <div class="apps-no-record"><span>' + 没有日志 + '</span></div>';
	   }
	   
	   
	var pathHtml = getLinkNav(current_nav,current_path_list);
	$(".file-list").append(listStr);
	registerLogListViewEvent();
	resize1();
}


//网盘监控
function showMonitorView() {
    $("#link_path").empty();
	$("#link_path").append('<a no="">' + 容量统计 + '</a>&nbsp;');

    $(".right-center-head").css("height","0px");
	loadMonitorData(NAV_MONITOR);
	$(".file-list-header").hide();
	$(".file-list").empty();
	var monitorstr = "<div class='monitor-content'><div class='monitor-bottom-pie'></div><div class='monitor-bottom-box1' id='monitor-bottom-box1'></div>";
	$(".file-list").append(monitorstr);
	
	//tab 渲染
	$("#monitor-bottom-box1").empty();
	var navTabStr="";
	navTabStr+='<div id="aws-form-ux-tab-monitorattr" class="aws-form-ux-tab" border="0" name="aws-form-ux-tab-monitorattr" >';
	navTabStr += '	<a class="active" border="0">' + 个人文件总大小前十 + '</a> ';
	navTabStr += '	<a border="0">' + 个人文件夹使用量前十 + '</a>';
	navTabStr += '	<a border="0">' + 企业文件夹使用量前十 + '</a>';
	navTabStr+='</div>';
	navTabStr+='<div id="tabcontent-monitorattr" class="aws-form-ux-tab-content" border="0">';
	navTabStr += '	<div class="aws-form-ux-tab-item" border="0" id="usersFileAttr" style=""></div>';
	navTabStr += '	<div class="aws-form-ux-tab-item" border="0" id="usersFolderAttr" style="display:none;"></div>';
	navTabStr += '	<div class="aws-form-ux-tab-item" border="0" id="entFolderAttr" style="display:none;"></div>';
	navTabStr+='</div>';
	$("#monitor-bottom-box1").append(navTabStr);
	easyTabInitFormTab("aws-form-ux-tab-monitorattr","tabcontent-monitorattr");

 
	
//  饼图---------------------------
    $(".monitor-bottom-pie").empty();
    var piefilestr="";
	piefilestr="<div id='pie-file-panel' class='awsui-chart' style='border-color:#BBD7E6;'><div class='awsui-chart-main'></div></div>";
	$("#pie-file-panel").css("border","1px solid #BBD7E6");
    $(".awsui-chart").css("border-color","#BBD7E6");
	$(".monitor-bottom-pie").append(piefilestr);
      var used=parseFloat(currentsumfilesize).toFixed(2);
      var sum=parseFloat(allcapacity).toFixed(2)-parseFloat(currentsumfilesize).toFixed(2);
      
      var chartoptions = {
		  title: {text: 网盘总容量统计, subtext: '', x: 'left'},
		    tooltip : { trigger: 'item',  formatter: "{a} <br/>{b} : {c}M ({d}%)" },
		  legend: {orient: 'horizontal', x: 'right', data: [已使用, 剩余]},
		    calculable : true,
		  series: [{type: 'pie', radius: '55%', center: ['50%', '60%'], data: [{value: used, name: 已使用}, {value: sum, name: 剩余}]}]
		};
		//$("#pie-file-panel").chart(chartoptions);
	var allChart = echarts.init(document.getElementById('pie-file-panel'));
	allChart.setOption(chartoptions);
		resize();
		
		
		
    //用户文件-------------------
    $("#usersFileAttr").empty();
	var headerHtml = '<ul class="monitor-header-title"><li>' + 用户总文件大小统计 + '</li></ul><ul class="monitor-header">';
	for (var i = 0; i < filesize_colModels.length; i++) {
		var col = filesize_colModels[i];
		headerHtml += '<li class="col ' + col["cls"] + '"   ><div class="lh40">';
		headerHtml += '<span >' + col["title"] + '</span></div></li>';
	}
	headerHtml+="</ul>";
	var listStr="";
	if(filesizelist != null){
	for(var i = 0;i< filesizelist.length;i++){
		var fileInfo = filesizelist[i];
		var fileId = fileInfo['id'];
		listStr += '<ul class="logfile-list-row clearfix  monitor-border" rowid="'+fileId+'">';
		for(var j = 0;j < filesize_colModels.length;j++){
			var col = filesize_colModels[j];
			var colKey = col["name"];
			var colValue = fileInfo[colKey];
			if(col.formatter){
				colValue = eval(col.formatter +'("'+colValue+'");');
			}
			if(colKey=="orgId"){
				listStr+= '<li class="monitor_li_align fl filename '+col["cls"]+'"><div class="lh40" style="padding-left:20px;text-align:left;">';
			}else{
				listStr+= '<li class="monitor_li_align fl filename '+col["cls"]+'"><div class="lh40" >';
			}
			
			listStr +='<a >'+colValue+'</a>';
			listStr += '</div></li>';
		}
		listStr += '</ul>';
	}
  }
  $("#usersFileAttr").append(headerHtml+listStr);

  
    //个人文件夹---------------------------
    $("#usersFolderAttr").empty();
	var headerHtml1 = '<ul class="monitor-header-title"><li>' + 网盘中使用量最大的前十个个人文件夹 + '</li></ul><ul class="monitor-header">';
	for (var i = 0; i < filesize_colModels1.length; i++) {
		var col = filesize_colModels1[i];
		headerHtml1 += '<li class="col ' + col["cls"] + '"   ><div class="lh40">';
		headerHtml1 += '<span >' + col["title"] + '</span></div></li>';
	}
	headerHtml1+="</ul>";
	var listStr1="";
	if(foldersizelist != null){
	for(var i = 0;i< 10;i++){
		var fileInfo = foldersizelist[i];
		try{
			var fileId = fileInfo['id'];
			listStr1 += '<ul class="logfile-list-row clearfix  monitor-border" rowid="'+fileId+'">';
			for(var j = 0;j < filesize_colModels1.length;j++){
				var col = filesize_colModels1[j];
				var colKey = col["name"];
				var colValue = fileInfo[colKey];
				if(col.formatter){
					colValue = eval(col.formatter +'("'+colValue+'");');
				}
				if(colKey=="orgId"){
					listStr1+= '<li class="monitor_li_align fl filename '+col["cls"]+'"><div class="lh40" style="padding-left:20px;text-align:left;">';
				}else{
					listStr1+= '<li class="monitor_li_align fl filename '+col["cls"]+'"><div class="lh40" >';
				}
				
				listStr1 +='<a >'+colValue+'</a>';
				listStr1 += '</div></li>';
			}
			listStr1 += '</ul>';
		}catch(e){
		}
	}
  }
  $("#usersFolderAttr").append(headerHtml1+listStr1);
	
	    //企业文件夹---------------------------
	    $("#entFolderAttr").empty();
	var headerHtml1 = '<ul class="monitor-header-title"><li>' + 网盘中使用量最大的前十个企业文件夹 + '</li></ul><ul class="monitor-header">';
		for (var i = 0; i < filesize_colModels1.length; i++) {
			var col = filesize_colModels1[i];
			headerHtml1 += '<li class="col ' + col["cls"] + '"   ><div class="lh40">';
			headerHtml1 += '<span >' + col["title"] + '</span></div></li>';
		}
		headerHtml1+="</ul>";
		var listStr1="";
		if(entfoldersizelist != null){
		for(var i = 0;i< 10;i++){
			var fileInfo = entfoldersizelist[i];
			try{
				var fileId = fileInfo['id'];
				listStr1 += '<ul class="logfile-list-row clearfix  monitor-border" rowid="'+fileId+'">';
				for(var j = 0;j < filesize_colModels1.length;j++){
					var col = filesize_colModels1[j];
					var colKey = col["name"];
					var colValue = fileInfo[colKey];
					if(col.formatter){
						colValue = eval(col.formatter +'("'+colValue+'");');
					}
					if(colKey=="orgId"){
						listStr1+= '<li class="monitor_li_align fl filename '+col["cls"]+'"><div class="lh40" style="padding-left:20px;text-align:left;">';
					}else{
						listStr1+= '<li class="monitor_li_align fl filename '+col["cls"]+'"><div class="lh40" >';
					}
					
					listStr1 +='<a >'+colValue+'</a>';
					listStr1 += '</div></li>';
				}
				listStr1 += '</ul>';
			}catch(e){
			}
		}
	  }
	  $("#entFolderAttr").append(headerHtml1+listStr1);
			
		
}

//加载网盘监控数据
function loadMonitorData(navType) {
	$.simpleAlert(加载提示, "loading", 3000, {model: true});
	//请求数据
	$.ajax({
		type : "POST",
		async : false,
		url : './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_loadfiledata&t=' + Math.random(),
		data : {"navType":navType},
		success : function(data) {
			if (data['result'] == 'ok') {
				filesizelist = data["data"]['filesizelist'];
				foldersizelist = data["data"]['foldersizelist'];
				entfoldersizelist = data["data"]['entfoldersizelist'];
				currentsumfilesize = data["data"]['currentsumfilesize'];//当前已使用容量
				allcapacity = data["data"]['allcapacity'];//总容量
				current_path_list = data["data"]['path'];
				if (current_path_list.length > 0) {
					current_path = current_path_list[current_path_list.length - 1];
				} else {
					current_path = "";
				}
			}else{
				$.simpleAlert(data['msg'], data['result']);
			}
			$.simpleAlert("close");
		}
	});
}




//切换列表展示
function getListView(){
	vtype=0;
	var listStr = '';
	if(fileList != null){
		
		for(var i = 0;i< fileList.length;i++){
			var fileInfo = fileList[i];
			var fileId = fileInfo['id'];
			var pid = fileInfo['pid'];
			var fileDownloadurl = fileInfo['downloadUrl'];
			var fileType = fileInfo['format'];
			var types = fileInfo['filetype'];
			var filesize = fileInfo['filesize'];
			filesize=formatSize(filesize);
			var userType = fileInfo['userType'];
			var myindex=fileInfo['index'];
			var picType="bmp,jpg,jpeg,tif,tiff,gif,png,ico";
			var favoriteFlag=fileInfo['favoriteFlag'];
			var isonlinefile=fileInfo['isonlinefile'];
			var shareLink=fileInfo['shareLink'];
			var sharePwd=fileInfo['sharePwd'];
			var shareid=fileInfo['shareid'];
			var shareflag=fileInfo['shareflag'];
			var isEnt=fileInfo['isEnt'];
			
			var canPreviewFlag=fileInfo['canPreviewFlag'];
			var canDownloadFlag=fileInfo['canDownloadFlag'];
			
			if(current_nav==NAV_ALLFILE || current_nav==NAV_OTHERFILE || '文档,图片,音频,视频'.indexOf(current_nav)!=-1){
				listStr += '<ul class="file-list-row clearfix" rowid="'+fileId+'" filesize="'+filesize+'"   userType="'+userType+'"  favoriteflag="'+favoriteFlag+'"  isonlinefile="'+isonlinefile+'"   onclick="checkThisRow(this);">';
			}else if(current_nav==NAV_MYSHARE){
				listStr += '<ul class="file-list-row clearfix" rowid="'+fileId+'" filesize="'+filesize+'"   shareid="'+shareid+'"  onclick="checkThisRow(this);">';
			}else if(current_nav==NAV_LINKSHARE){
				listStr += '<ul class="file-list-row clearfix" rowid="'+fileId+'" filesize="'+filesize+'"   shareid="'+shareid+'"  linkurl="'+shareLink+'" sharepwd="'+sharePwd+'"   onclick="checkThisRow(this);">';
			}else{
				listStr += '<ul class="file-list-row clearfix" rowid="'+fileId+'" filesize="'+filesize+'"   userType="'+userType+'"   favoriteflag="'+favoriteFlag+'"  onclick="checkThisRow(this);">';
			}
			for(var j = 0;j < current_colModels.length;j++){
				var col = current_colModels[j];
				var colKey = col["name"];
				//代表某一列的值filename filesize updatetime
				var colValue = fileInfo[colKey];
				if(col.formatter){
					colValue = eval(col.formatter +'("'+colValue+'");');
				}
				listStr+= '<li class="fl filename '+col["cls"]+'">';
				//分享的文件有此标识
				if(j == 0 && shareflag){
				   listStr+= '<div class="triangle-topleft"></div>';
				}
				listStr+= ' <div class="lh40">';
				if(j == 0){
					// 判读不同分类下文件列表中的按钮信息
				    if(current_nav==NAV_RECILEBIN){
						listStr += '<ul class="tools clearfix"  rowid="' + fileId + '" isent="' + isEnt + '"  pid="' + pid + '"  rowfiletype="' + fileType + '"  rowname="' + colValue + '" ><li awsui-qtip="' + 还原 + '"><em class="restore"></em></li><li awsui-qtip="' + 彻底删除 + '"><em class="delete-thorough"></em></li></ul>';
				    }else if(current_nav==NAV_MYSHARE){
						listStr += '<ul class="tools clearfix"  rowid="' + fileId + '" isent="' + isEnt + '"  pid="' + pid + '"   rowfiletype="' + fileType + '"  rowname="' + colValue + '" ><li awsui-qtip="' + 分享 + '"><em class="share"></em></li><li awsui-qtip="' + 取消分享 + '"><em class="unshare"></em></li></ul>';
				    }else if(current_nav==NAV_LINKSHARE){
						listStr += '<ul class="tools clearfix"  rowid="' + fileId + '" isent="' + isEnt + '"  pid="' + pid + '"    rowfiletype="' + fileType + '"  rowname="' + colValue + '" ><li awsui-qtip="' + 取消分享 + '"><em class="unshare"></em></li><li awsui-qtip="' + 复制链接和密码 + '"><em class="copysharelinkurl"></em></li></ul>';
				    }else if(current_nav==NAV_SHAREME){
				    	if(fileId!=""){
				    		if(canDownloadFlag!=undefined && canDownloadFlag=="0"){
				    		   listStr+='<ul class="tools clearfix"     rowid="'+fileId+'" isent="'+isEnt+'"  pid="'+pid+'"   rowfiletype="'+fileType+'"   rowname="'+colValue+'"  ><li awsui-qtip="下载"><em class="download"></em></li></ul>';
				    		}
				    	}
				    }else{
				    	listStr+='<ul class="tools clearfix"    rowid="'+fileId+'"  isent="'+isEnt+'"  pid="'+pid+'"   rowfiletype="'+fileType+'"    rowname="'+colValue+'" >';
				    	//分享 下载  创建者 拥有者
				    	if(userType!=undefined && ( userType=="4" || userType=="3")){
							listStr += '<li awsui-qtip="' + 分享 + '"><em class="share"></em></li>';
				    	   if(canDownloadFlag!=undefined && canDownloadFlag=="0"){
							   listStr += '<li awsui-qtip="' + 下载 + '"><em class="download"></em></li>';
				    	   }
				    	}
				    	listStr+='<li><em class="more"></em><div class="more-sfile-menu" style="display: none;"><div class="more-sfile-inner">';
					   
				    	if(favoritecanuseflag=="1" && favoriteFlag=="0"){
							listStr += ' <div class="icon-addfavorite-sfile"><img width="24" height="24" border="0" src="../apps/com.actionsoft.apps.mydriver/img/icon_mmenu_sc.png"/>' + 收藏 + '</div>';
				    	}else if(favoritecanuseflag=="1" && favoriteFlag=="1"){
							listStr += ' <div class="icon-addfavorite-sfile"><img width="24" height="24" border="0" src="../apps/com.actionsoft.apps.mydriver/img/icon_mmenu_sc.png"/>' + 取消收藏 + '</div>';
				    	}
				    	listStr+='<div class="more-sfile-inner-separator"></div>';

					   //文件操作  创建者 拥有者 编辑者
					    if(userType!=undefined && ( userType=="4" || userType=="3")){
					    	if(isonlinefile!=undefined && isonlinefile=="1" ){
								listStr += ' <div class="icon-editmd-sfile"><img width="24" height="24" border="0" src="../apps/com.actionsoft.apps.mydriver/img/icon_mmenu_bjwd.png"/>' + 编辑文档 + ' ...</div>';
							}
							listStr += '<div class="icon-move-sfile"><img width="24" height="24" border="0" src="../apps/com.actionsoft.apps.mydriver/img/icon_mmenu_yd.png"/>' + 移动到 + ' ...</div>';
							listStr += '<div class="icon-rename-sfile"><img width="24" height="24" border="0" src="../apps/com.actionsoft.apps.mydriver/img/icon_mmenu_cmm.png"/>' + 重命名 + '</div>';
							listStr += '<div class="icon-delete-sfile"><img width="24" height="24" border="0" src="../apps/com.actionsoft.apps.mydriver/img/icon_mmenu_scwj.png"/>' + 删除 + '</div>';
				    	    listStr+='<div class="more-sfile-inner-separator"></div>';
				    	}
				    	/*
				    	//20170224 该版本隐藏评论功能
					    listStr+='<div class="icon-comment-sfile"><img width="24" height="24" border="0"/>评论</div>';
					    */
						listStr += '<div class="icon-modify-sfile"><img width="24" height="24" border="0" src="../apps/com.actionsoft.apps.mydriver/img/icon_mmenu_sx.png"/>' + 详细信息 + ' ...</div>';
				    	listStr+='</div></div></li>';
				    	listStr+='</ul>';
				    }
				    
				    listStr +='<span style="display:inline-block;width:40px;text-align:center;">'+myindex+'</span>';
				    
				    //如果是我的分享和链接分享的话 隐藏域中值为分享表中id
				    if(current_nav==NAV_MYSHARE || current_nav==NAV_LINKSHARE ){
				        listStr +='<input class="row-check" value="'+shareid+'" canpreviewflag="'+canPreviewFlag+'"  isent="'+isEnt+'"   pid="'+pid+'" candownloadflag="'+canDownloadFlag+'"   userType="'+userType+'"    rowfiletype="'+fileType+'"   rowname="'+colValue+'"  type="checkbox"/>';
					}else{
				        listStr +='<input class="row-check" value="'+fileId+'"  canpreviewflag="'+canPreviewFlag+'"  isent="'+isEnt+'"   pid="'+pid+'"  candownloadflag="'+canDownloadFlag+'"    userType="'+userType+'"  rowfiletype="'+fileType+'"   rowname="'+colValue+'"  type="checkbox"/>';
					}
					 if(fileType=="" && types=="2"){
					 	fileType="f";
					 }
					
					if(current_nav==NAV_MYSHARE  || current_nav==NAV_SHAREME ){
						if(fileInfo['sourceid']==""){
							listStr += '<span class="share_icon file-type-'+fileType+'"></span>';
							if(isDir(fileType)){
                                listStr +='<a class="filetitle file_url_a_nocss"  onclick="openShareFileLayer(\''+fileId+'\');" >'+colValue+'</a>';
							}else{
								listStr +='<a class="filetitle file_url_a_nocss"  onclick="openShareFullScreen(\''+fileId+'\');">'+colValue+'</a>';
							}
				    	}else{
				    		if(isEnt=="1"  && isDir(fileType)){
								//企业文件夹
								entIconStr="file-type-enticon";
							}else if(isEnt=="0"  && isDir(fileType)){
								entIconStr="file-type-selficon";
							}else{
								entIconStr="";
							}
				    		
				    		listStr += '<img class="file_icon file-type-'+fileType+'  '+entIconStr+'" border="0" width="24" height="24"  />';
				    		if(isDir(fileType)){
                                listStr +='<a class="filetitle file_url_a_nocss"  onclick="openShareFileLayer(\''+fileId+'\');" >'+colValue+'</a>';
							}else{
								 if(fileType!="f" && fileType!="" && picType.indexOf(fileType.toLowerCase())!=-1){
									 listStr +='<a class="filetitle file_url_a_nocss"    rel="fancyboxgroup"  href="'+fileDownloadurl+'"  onclick="beforeHref(this,\''+fileDownloadurl+'\')" >'+colValue+'</a>';
								 }else{
									 listStr +='<a class="filetitle file_url_a_nocss"  onclick="openShareFullScreen(\''+fileId+'\');">'+colValue+'</a>';
 
								 }
							 
							}
						}
				    	
				    }else if(current_nav==NAV_LINKSHARE){
				    	if(fileInfo['sourceid']==""){
							listStr += '<span class="share_icon file-type-'+fileType+'"></span>';
                            listStr +='<a class="filetitle file_url_a_nocss"  >'+colValue+'</a>';
				    	}else{
				    		if(isEnt=="1"  && isDir(fileType)){
								//企业文件夹
								entIconStr="file-type-enticon";
							}else if(isEnt=="0"  && isDir(fileType)){
								entIconStr="file-type-selficon";
							}else{
								entIconStr="";
							}
				    		
				    		listStr += '<img class="file_icon file-type-'+fileType+'  '+entIconStr+'" border="0" width="24" height="24"  />';
				    		listStr +='<a class="filetitle file_url_a_nocss"  >'+colValue+'</a>';
						}
				    }else if(current_nav==NAV_RECILEBIN){
				    	if(isEnt=="1"  && isDir(fileType)){
							//企业文件夹
							entIconStr="file-type-enticon";
						}else if(isEnt=="0"  && isDir(fileType)){
							entIconStr="file-type-selficon";
						}else{
							entIconStr="";
						}
				    	
			    		 listStr += '<img class="file_icon file-type-'+fileType+'  '+entIconStr+'" border="0" width="24" height="24"  />';
//				    	 listStr += '<span class="file_icon file-type-'+fileType+'"></span>';
                         listStr +='<a class="filetitle file_url_a_nocss" >'+colValue+'</a>';
				    }else {
						if(fileType == 'f'){
							var entIconStr="";
							if(isEnt=="1"){
								//企业文件夹
								entIconStr="file-type-enticon";
							}else{
								entIconStr="file-type-selficon";
							}
							/*
							if(current_nav==NAV_ENTALLFILE){
								entIconStr="file-type-enticon";
							}else if(current_nav==NAV_ALLFILE){
								entIconStr="file-type-selficon";
							}
							*/
				    		listStr += '<img class="file_icon file-type-'+fileType+'  '+entIconStr+'" border="0" width="24" height="24"   onclick="openDir(\''+fileId+'\');"/>';
//				            listStr += '<span class="file_icon file-type-'+fileType+'  '+entIconStr+'"  onclick="openDir(\''+fileId+'\');"></span>';
							listStr += '<a class="filetitle dir_url_a" onclick="openDir(\''+fileId+'\');">'+colValue+'</a>';
						}else{
				    		 listStr += '<img class="file_icon file-type-'+fileType+'" border="0" width="24" height="24" />';
//							 listStr += '<span class="file_icon file-type-'+fileType+'"></span>';
							 //如果文件类型位图片类型  添加fancybox的属性
							 if(fileType!="f" && fileType!="" && picType.indexOf(fileType.toLowerCase())!=-1){
								 if(fileDownloadurl==undefined){
										if(fileDownloadurl==''){ fileDownloadurl='#'; }
										listStr += '<a class="filetitle file_url_a" >'+colValue+'</a>';
								}else{
									if(fileDownloadurl==''){ fileDownloadurl='#'; }
									//listStr += '<a class="filetitle file_url_a"  rel="fancyboxgroup"  onclick="beforeHref(this,\''+fileDownloadurl+'\');"   href="'+fileDownloadurl+'">'+colValue+'</a>';
									listStr += '<a class="filetitle file_url_a"  rel="fancyboxgroup"  onclick="beforeHref(this,\''+fileDownloadurl+'\');"   href="'+fileDownloadurl+'" >'+colValue+'</a>';
								}
							 }else{
								if(fileDownloadurl==''){ fileDownloadurl='#'; }
						    	listStr += '<a class="filetitle file_url_a"  href="javascript:void(0);" >'+colValue+'</a>';
							 }
							
						}
				    }
					

				
				}else{
					listStr +='<span class="'+colKey+'">'+colValue+'</span>';
				}
				listStr += '</div></li>';
			}
			listStr += '</ul>';
		}
	}
	
	
	  windowresize();
	  if(listStr == ''){
			//listStr = '<p  class="nodata">没有数据</p>';
		  listStr = '<div class="apps-no-record"><span>' + 没有文件 + '</span></div>';
	  }
	   
	$(".file-list").append(listStr);
	$("#fileCount").html(curCounts);

    //处理表头
	listheader = getListHeaderHtml(current_colModels,current_nav,currentordercol,currentordertype);
	$(".file-list-header").html(listheader);
		
   //分页信息
    var size=$("#size").val();
	if ( curCounts>=size  && curCounts < counts  ) {
		_more = $("<div  class='list_load_more'>" + 加载更多 + "</div>");
		var dirId = current_path['id'];
		$(".file-list").append(_more);
		_more.click(function(e) {
			//loadFileData(navType,dirId,searchValue,orderCol, orderType,start,size)；
			loadFileData(current_nav, dirId, '',currentordercol,currentordertype);
		    showView(vtype);
			$(this).remove();
		});
	}

	//渲染右侧top区域
	var pathHtml = getLinkNav(current_nav,current_path_list);
	/*
	$("#barCmdViewSmall").removeClass("select");
	$("#barCmdViewList").addClass("select");
	*/
	$("#barCmdViewSmall").show();
	$("#barCmdViewList").hide();
	registerListViewEvent();
	windowresize();
	resize();
	//处理非搜索页  属性只显示 创建人：
	var searchvalue = $('#searchvalue').val();
	if(searchvalue==""){
		$(".attr").each(function(i,ele){
			var oldVal=$(ele).html();
			var indexs=oldVal.lastIndexOf("<br>");
			if(indexs=="-1"){
				indexs=oldVal.lastIndexOf("<BR>");
			}
			if(indexs!="-1"){
				var newVal=oldVal.substring(indexs+4);
				$(ele).html(newVal);
			}
		});
		$(".attr").css("line-height","40px");
	}else{
		$(".attr").each(function(i,ele){
			$(ele).attr("awsui-qtip",$(ele).html());
		});
	}
	
	var initWidth = ($("#todo-layout").width()-200)*0.6-99;
	$(".file-list-row").find('.filetitle').css("width",initWidth+"px");
	
	renderFileIcon();

}
function beforeHref(obj,url){
	 $(obj).parent().find('.row-check').prop('checked',false);
}


// js获取项目根路径，如： http://localhost:8088/portal
function getRootPath(){
    	var curWwwPath=window.document.location.href;
    	var pathName=window.document.location.pathname;
    	var pos=curWwwPath.indexOf(pathName);
    	var localhostPaht=curWwwPath.substring(0,pos);
    	var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
    	return(localhostPaht+projectName);
}

//切换大图展示
function getIconView(){
	vtype=1;
	var listStr = '';
//	var picType="bmp,jpg,jpeg,tif,tiff,gif,png,ico";
	var picType="bmp,jpg,jpeg,tif,tiff,gif,pcx,tga,exif,fpx,svg,cdr,pcd,dxf,ufo,eps,ai,raw,png,ico,pic";
	if(fileList != null){
		for(var i = 0;i< fileList.length;i++){
			var fileInfo = fileList[i];
			var fileId = fileInfo['id'];
			var pid = fileInfo['pid'];
			var fileName = fileInfo['filename'];
			var fileType = fileInfo['format'];
			var filesize = fileInfo['filesize'];
			filesize=formatSize(filesize)
			var types = fileInfo['filetype'];
			var downloadurl = fileInfo['downloadUrl'];
			var thumDownloadUrl = fileInfo['thumDownloadUrl'];
			
			var favoriteFlag=fileInfo['favoriteFlag'];
			var isonlinefile=fileInfo['isonlinefile'];
			var shareLink=fileInfo['shareLink'];
			var sharePwd=fileInfo['sharePwd'];
			var shareid=fileInfo['shareid'];
			var userType=fileInfo['userType'];
			
			var canPreviewFlag=fileInfo['canPreviewFlag'];
			var canDownloadFlag=fileInfo['canDownloadFlag'];
			var isEnt=fileInfo['isEnt'];
			
			
			
			 if(fileType=="" && types=="2"){
			    fileType="f";
			}
			if(fileType=="" && types=="1"){
				//处理没有后缀的文件
				fileType="nosubfix";
			}
			
			listStr += '<div class="v_item" rowid="'+fileId+'" >';
			listStr +='<ul  class="awsui-menu contextMenu"></ul>';
			 //如果文件类型是图片类型  上面的文件的图标
			 if(fileType!="f"  && picType.indexOf(fileType.toLowerCase())!=-1){
			 	var filepath=downloadurl;
			 	/*
				var filepath=getRootPath()+"/r"+ downloadurl.substr(1);
				if(thumDownloadUrl!=undefined && thumDownloadUrl!=""){
				   filepath=getRootPath()+"/r"+ thumDownloadUrl.substr(1);
				}
				*/
				 listStr += '<div class="v_item-top" isent="'+isEnt+'"  canpreviewflag="'+canPreviewFlag+'"  candownloadflag="'+canDownloadFlag+'"    rowid="'+fileId+'" pid="'+pid+'"  filesize="'+filesize+'" shareid="'+shareid+'" isonlinefile="'+isonlinefile+'" favoriteFlag="'+favoriteFlag+'"   rowfiletype="'+fileType+'"    rowname="'+fileName+'"   userType="'+userType+'" ><span class="file_icon_v file-type-'+fileType+'_v" style="background:url('+filepath+') no-repeat center;background-size:100px 100px;"><span class="chk_icon"></span><span class="icon_more_menu"></span></span></div>';
			 }else{
				 var entIconStr="";
				 if(current_nav==NAV_ENTALLFILE && fileType=="f" ){
					 entIconStr="file-type-enticon-large";
				 }
				 listStr += '<div class="v_item-top" isent="'+isEnt+'"  canpreviewflag="'+canPreviewFlag+'"  candownloadflag="'+canDownloadFlag+'"   rowid="'+fileId+'" pid="'+pid+'"    filesize="'+filesize+'"  shareid="'+shareid+'" isonlinefile="'+isonlinefile+'" favoriteFlag="'+favoriteFlag+'"  rowfiletype="'+fileType+'"    rowname="'+fileName+'"   userType="'+userType+'" ><span class="file_icon_v file-type-'+fileType+'_v '+entIconStr+'" ><span class="chk_icon"></span><span class="icon_more_menu"></span></span></div>';
			 }
			
			 //底部的文件名
			if(fileType == 'f'){
				listStr += '<div class="v_item-bottom"><div class="dir_url_a name" onclick="openDir(\''+fileId+'\');"  awsui-qtip="'+fileName+'" >'+fileName+'</div></div>';
			}else{
				 if(fileType!="f"  && picType.indexOf(fileType.toLowerCase())!=-1){
				 	// listStr += '<div class="v_item-bottom"><div class="name"><a class="fancyboxcls" rel="fancyboxgroup" href="'+downloadurl+'"  awsui-qtip="'+fileName+'" style="color:black;">'+fileName+'</a></div></div>';
					 if(downloadurl==undefined){
							if(downloadurl==''){ downloadurl='#'; }
							listStr += '<div class="v_item-bottom"><div class="name"><a class="fancyboxcls"   awsui-qtip="'+fileName+'" style="color:black;">'+fileName+'</a></div></div>';
					}else{
						if(downloadurl==''){ downloadurl='#'; }
						listStr += '<div class="v_item-bottom"><div class="name"><a class="fancyboxcls" rel="fancyboxgroup" href="'+downloadurl+'"    awsui-qtip="'+fileName+'" style="color:black;">'+fileName+'</a></div></div>';
					}
				 }else{
				    listStr += '<div class="v_item-bottom"><div class="name"  awsui-qtip="'+fileName+'"><a   href="javascript:void(0);" >'+ fileName+'</a></div></div>';
				 }
			}
			listStr += '</div>';
		}
		resize();

		if(listStr == ''){
			listStr = ' <div class="apps-no-record"><span>' + 没有文件 + '</span></div>';
		}
		//处理表头
		iconheader = getIconHeaderHtml(current_colModels,current_nav);
		$(".file-list-header").html(iconheader);

		$(".file-list").append(listStr);
		$("#fileCount").html(curCounts);//在右上角显示共多少个文件
        //分页处理部分
    	  var size=$("#size").val();
	if ( curCounts>=(parseInt(size)-1) && curCounts < counts  ) {
		_more = $("<div  class='v_item'><div class='icon_load_more'  title='" + 加载更多 + "'></div></div>");
//		_more = $("<div  class='v_item'><div class='icon_load_more'><a> 加载更多>></a></div></div>");
			var dirId = current_path['id'];
			$(".file-list").append(_more);
			_more.click(function(e) {
				loadFileList(current_nav, dirId, '',1);
				$(this).remove();
			});
		}

		//渲染右侧top区域
		var pathHtml = getLinkNav(current_nav,current_path_list);
		//切换视图样式
		/*
		$("#barCmdViewList").removeClass("select");
		$("#barCmdViewSmall").addClass("select");
		*/
		$("#barCmdViewSmall").hide();
		$("#barCmdViewList").show();
		registerIconViewEvent();
	}
}

//切换视图  点击右上角的列表和缩略图图标切换两种视图   0列表  1缩略图
function showView(viewType){
	var currentViewType = $(".bar-view-group-item.select").attr("vtype");
	//if(currentViewType != viewType){
		if(viewType == "0"){
			getListView();
			currentView = VIEW_TYPE_LIST;
		}else if(viewType == "1"){
			getIconView();
			currentView = VIEW_TYPE_ICON;
		}
	//}
   $('.header_batch_area').remove();//让表头不显示按钮
   $('.file-list-header').show();//显示标题信息  防止删除一条数据后（等操作），表头刷新不了产生的问题
   
   
   //回收站
   if(current_nav==NAV_RECILEBIN){
		   	 if(fileList.length == 0){//当数据为空的时候    清空回收站和全部还原   不能点击
		   	 	    $(".tool-btn-cleanrecycle").hide();
				    $(".tool-btn-restoreall").hide();
		   }else{
		   		    $(".tool-btn-cleanrecycle").show();
				    $(".tool-btn-restoreall").show();
		   }
   }
  
}

/**
 * 平铺列表视图切换
 * @param viewType
 */
function changeShowType(viewType){
	counts = 0;
	curCounts = 0;
	$('.file-list').empty();
	var searchvalue = $('#searchvalue').val();
	var dirId = current_path['id'];
    loadFileData(current_nav, dirId, searchvalue);
	showView(viewType);
}

//检索文件
function searchFile() {
	var dirId = current_path['id'];
	var searchvalue =  $('#searchvalue').val();
 
		counts = 0;
		curCounts = 0;
		$('.file-list').empty();
	var dirId = current_path['id'];
	loadFileData(current_nav, dirId, searchvalue);
	showView(vtype);
	$('#searchvalue').val(searchvalue);
}

//日志搜索重置按钮事件
function cleanSearch() {
	$('.awsui-address-del').click();// 地址簿触发全部删除按钮
    $('#loguserid').val("");
	$('#opttype').val("");
    $('#begintime').val("");
	$('#endtime').val("");
	var fblwidth=window.screen.width;
	if(fblwidth>1600){
		fblwidth=fblwidth-40;
	}
	fblwidth=fblwidth-550;
	
	var options = {
		callbackfun : datepickerCallBackFun,
		showLeft : -fblwidth,
		showTop : -20,
		emptyBtnCallbackfun : emptybtnFun,
		startTime : "",
		endTime : "",
		emptyBtn : true,
		isShowToday : true
	};
	$("#datepickerRange").datepickerRange(options);
    $("#navigationIntervalStart").html("");
	$("#navigationIntervalEnd").html("");
	pageLog();
	initpagelog();
	
	
	$('#opttype').off("click").on("click",function(){
		jQuery(".navigationDatepickerDivAws").hide();
	});
   //datezone  修改
	jQuery("#navigationInterval").unbind("click").bind("click",function(){
		var disp = jQuery(".navigationDatepickerDivAws").css("display");
		if( disp == "none" ){
			datepickerStartClick = false;
			jQuery("#datepickerStart").addClass("inputSelect");
			jQuery("#datepickerEnd").removeClass("inputSelect");
			var offset = jQuery(this).offset();
		    jQuery("div.navigationDatepickerDivAws").css("left",jQuery("#testDiv").width()-jQuery(".navigationDatepickerDivAws").width()+270);
			jQuery("div.navigationDatepickerDivAws").css("top","110px");
			jQuery(".navigationDatepickerDivAws").show();
			jQuery("#navigationInterval").find(".report-navigation-time-interval-downarrow").removeClass("report-navigation-icon-downarrow-black-down").addClass("report-navigation-icon-downarrow-black-up");
			setDivTimeOutColse(".navigationDatepickerDivAws");
		} else {
			jQuery(".navigationDatepickerDivAws").hide();
			jQuery("#navigationInterval").find(".report-navigation-time-interval-downarrow").addClass("report-navigation-icon-downarrow-black-down").removeClass("report-navigation-icon-downarrow-black-up");
		}
	});
	
	
}

function searchLog(){
	pageLog();
	initpagelog();
	
	//关闭搜索框
	$("#show-search-popbox").hide();
	$(".awsui-popbox-arrow-inner").hide();
	$(".awsui-popbox-arrow").hide();
}


function pageLog(start){
	var userid = $('#loguserid').val();
	var opttype = $('#opttype').val();
	var begintime = $('#begintime').val();
	var endtime = $('#endtime').val();
	loadFileDataForLog(current_nav,"","","","",start,"",userid,opttype,begintime,endtime);
	logpagenow=logpagenow+1;
    showLogList();
}

//初始化日志分页信息
function initpagelog(){
  $("#Pagination").pagination(alllogcounts, {
	pageLimit : logpagesize,
	showItem : 10,
	linkTo:"javascript:void(0);",
	ellipseCount : 0,
	callback : function(pageNum,start1, dom) {
	    logpagenow=pageNum+1;
	    //start= pageNum*logpagesize + 1;
	    pageLog(start1);
	}
 });
}

//日志数据加载
function loadFileDataForLog(navType,dirId,searchValue,orderCol, orderType,start,size,username,opttype,begintime,endtime){
	//请求数据
	$.ajax({
		type : "POST",
		async:false,
		url: './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_loadfiledata&t=' + Math.random(),
		data :{"navType":navType,"dirId":dirId,"searchValue":searchValue,"orderCol":orderCol,"orderType":orderType,"start":start,"size":size,"username":username,"opttype":opttype,"begintime":begintime,"endtime":endtime},
		success : function(data){
			if(data['result'] == 'ok'){
				fileList = data["data"]['fileList'];
				current_path_list = data["data"]['path'];
				alllogcounts=data["data"]["counts"];
				logpagesize=data["data"]["logpagesize"];
				frmMain.start.value = fileList.length;
				if(current_path_list.length > 0){
					current_path = current_path_list[current_path_list.length-1];
				}else{
					current_path="";
				}
			}else{
				$.simpleAlert(data['msg'], data['result']);
			}
		}
	});
	
}

//刷新文件列表
function loadFileList(current_nav, dirId, searchValue,vtype) {
	loadFileData(current_nav, dirId, '');
	showView(vtype);
}


//新建文件夹
function createFolder(){
	var reg = new RegExp('^[^\\\\\\/:*?\\"<>|]+$');
	$('#foldername').val('');//清空上一次的值
	$("#createfolder_dlg").dialog({
		title: 新建文件夹,
		buttons: [
			{
				text: 确定, cls: "blue", handler: function () {
			var dirName=$.trim($('#foldername').val());
			//文件夹名称不为空的时候才能创建
			
			if(dirName!=""){
				 if(!reg.test(dirName)){//不能包含特殊字符
					 $.simpleAlert(文件夹名字不能包含 + ' \\  / : * ? " < > |');
				 	return false;
				 }else{
				 	saveTemplate(current_path['id'],dirName,inEntPath);
				 }
			    $("#createfolder_dlg").dialog("close");
			}else{
				$.simpleAlert(文件夹名字不允许为空);
				return false;
			}

		}},
			{
				text: 关闭, handler: function () {
					$("#createfolder_dlg").dialog("close");
				}
			}
	]
	});

}

//清空回收站
function cleanRecycle(){
	$.ajax({
		type : "POST",
		async: false,
		url : './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_cleanrecycle',
		dataType:'json',
		success : function(response){
				if(response['result'] =='ok'){
					$.simpleAlert(操作成功, 'ok', 2000, {model: true});
					openDir(current_path['id']);//重新加载模板面板
				} else {
			    	$.simpleAlert(response['msg'],'warning',2000,{model:true});
			    	return false;
				}
		}
	});
	return false;
}

//全部还原
function restoreAll(){
	$.ajax({
		type : "POST",
		async: false,
		url : './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_restoreall',
		dataType:'json',
		success : function(response){
				if(response['result'] =='ok'){
					$.simpleAlert(操作成功, 'ok', 2000, {model: true});
					openDir(current_path['id']);//重新加载模板面板
					//刷新容量
					//重新渲染网盘的个人容量
					currentUsedSize = response['data']['currentUsedSize'];
					allSize = response['data']['allSize'];
					refreshUserCapacity();
				} else {
			    	$.simpleAlert(response['msg'],'warning',2000,{model:true});
			    	return false;
				}
		}
	});
	return false;
	
}


function setActiveNav(navType){
	//渲染左侧导航样式
	$(".todo-navigate-group-item").removeClass("current");
	$(".todo-navigate-group-item[name="+navType+"]").addClass("current");
}

function checkThisRow(dom){
	var rowid = $(dom).attr('rowid');
	var userType = $(dom).attr('userType');
	if(userType!=undefined && (userType=="4" || userType=="3")){
		    //单选一行
			var val = $(dom).find('.row-check').prop('checked');
			$(dom).find('.row-check').prop('checked',!val);
			$(dom).siblings().find('.row-check').prop('checked',false);
			//选中样式
			$(dom).addClass('active').siblings().removeClass('active');
			//动态显示工具条
			$(dom).find('.tools').css('display','block');
			$(dom).siblings().find('.tools').css('display','none');
			//批量按钮区变动检测
			changeFileHeader();
			
			if($(".folder-generator").length!=0){//当重命名的框还没有显示时
				$(dom).find('.tools').css('display','none');
				$(dom).siblings().find('.tools').css('display','none');
			}
	}
	
}


//注册icon视图时的事件
function registerIconViewEvent(){
	$('.v_item').bind("mouseenter",function(event){
		$(this).find(".v_item-top").find('.file_icon_v').addClass('fileicon_v_checked');
		$(this).find(".v_item-top").addClass('hover');
	});
	$('.v_item').bind("mouseleave",function(event){
		if($(this).find('.v_item-top').find(".file_icon_v").attr('select')!='true'){
			$(this).find(".v_item-top").find('.file_icon_v').removeClass('fileicon_v_checked');
			$(this).find(".v_item-top").removeClass('hover');
		}
	});
	
	$('.v_item-top').bind("mouseenter",function(event){
		$(this).addClass('hover');
		$(this).find('.chk_icon').off('click').on('click',function(event){
			var parent = $(this).parent();
			if(parent.attr('select')!='true'){
				$(this).addClass('chk_icon_checked');
				parent.addClass('fileicon_v_checked');
				parent.attr('select','true');
				event.stopPropagation();
			}else{
				$(this).removeClass('chk_icon_checked');
				parent.removeClass('fileicon_v_checked');
				parent.attr('select','false');
				event.stopPropagation();
			}
			event.stopPropagation();
			changeFileHeader();
		});
		
		$(this).find('.icon_more_menu').off('click').on('click',function(event){
						var rowid = $(this).parent().parent().attr('rowid');
						var pid = $(this).parent().parent().attr('pid');
						var isent = $(this).parent().parent().attr('isent');
						var rowfiletype= $(this).parent().parent().attr('rowfiletype');
						var rowname= $(this).parent().parent().attr('rowname');
						var favoriteFlag= $(this).parent().parent().attr('favoriteFlag');
						var isonlinefile= $(this).parent().parent().attr('isonlinefile');
						var userType= $(this).parent().parent().attr('userType');
						var canDownloadFlag= $(this).parent().parent().attr('candownloadflag');
						var curr_obj = $(this);
						var scrollTopD=$(".file-list").scrollTop();
						var left = event.pageX;
						var allW=$("#todo-layout").width();
						var leftP=left-270;
						var menuLeft=$(this).offset().left;
						if(allW-menuLeft<280){
							leftP=left-420;
						}
						var top = event.pageY+scrollTopD;
						var memuParent=$(this).parent().parent().parent();
							 if(isDir(rowfiletype)){
								 var option = { left:leftP, top:top-100,
								items:[
									{
										text: 打开, icon: "../apps/com.actionsoft.apps.mydriver/img/icon_mmenu_dk.png", tit: "open", method: function () {
											openDir(rowid);
											$(memuParent).find('.contextMenu').menu("close");
										}
									},
									{
										text: 下载, icon: "../apps/com.actionsoft.apps.mydriver/img/icon_mmenu_xz.png", tit: "downfile", method: function () {
											downFileForIcon(rowid, rowname, 'd');
											$(memuParent).find('.contextMenu').menu("close");
										}
									},
									{text:"", tit:""},
									{
										text: 分享 + " ...", icon: "../apps/com.actionsoft.apps.mydriver/img/icon_mmenu_fx.png", tit: "share", method: function () {
											openSelectShareDlg(rowid, rowname);
											$(memuParent).find('.contextMenu').menu("close");
										}
									},
									{
										text: 取消收藏, icon: "../apps/com.actionsoft.apps.mydriver/img/icon_mmenu_sc.png", tit: "unfavorite", method: function () {
											cancelFavorite(rowid);
											$(memuParent).find('.contextMenu').menu("close");
										}
									},
									{
										text: 收藏, icon: "../apps/com.actionsoft.apps.mydriver/img/icon_mmenu_sc.png", tit: "favorite", method: function () {
											addFavorite(rowid);
											$(memuParent).find('.contextMenu').menu("close");
										}
									},
									{text:"", tit:""},
									{
										text: 移动到 + " ...", icon: "../apps/com.actionsoft.apps.mydriver/img/icon_mmenu_yd.png", tit: "move", method: function () {
											openMoveFileDlg(rowid, rowfiletype, pid, isent);
											$(memuParent).find('.contextMenu').menu("close");
										}
									},
									{
										text: 重命名, icon: "../apps/com.actionsoft.apps.mydriver/img/icon_mmenu_cmm.png", tit: "rename", method: function () {
											editFileName(rowid, 'd');
											$(memuParent).find('.contextMenu').menu("close");
										}
									},
									{
										text: 删除, icon: "../apps/com.actionsoft.apps.mydriver/img/icon_mmenu_scwj.png", tit: "delete", method: function () {
											delFile(rowid);
											$(memuParent).find('.contextMenu').menu("close");
										}
									},
									//{text:"标签", tit:"label", method:function(){ showLabelPanel(rowid); $(memuParent).find('.contextMenu').menu("close"); }},
									/*
									 //20170224该版本隐藏评论功能
									 * {text:"评论",icon:"../apps/com.actionsoft.apps.mydriver/img/exe-32.png",  tit:"comment", method:function(){ showCommentPanel(rowid); $(memuParent).find('.contextMenu').menu("close"); }},
									 */
									{text:"", tit:""},
									{
										text: 详细信息 + " ...", icon: "../apps/com.actionsoft.apps.mydriver/img/icon_mmenu_sx.png", tit: "modify", method: function () {
											openFileModifyDlg(rowid);
											$(memuParent).find('.contextMenu').menu("close");
										}
									}

								]  };
								 $(memuParent).find('.contextMenu').menu(option);
				    		 }else{
				    			 var option = { left:leftP, top:top-100,
								items:[
									{
										text: 编辑文档 + " ...", icon: "../apps/com.actionsoft.apps.mydriver/img/icon_mmenu_bjwd.png", tit: "editfile", method: function () {
											toUpdateMarkDownFile(rowid);
											$(memuParent).find('.contextMenu').menu("close");
										}
									},
									{
										text: 下载, icon: "../apps/com.actionsoft.apps.mydriver/img/icon_mmenu_xz.png", tit: "downfile", method: function () {
											downFileForIcon(rowid, rowname, 'f');
											$(memuParent).find('.contextMenu').menu("close");
										}
									},
								    {text:"", tit:""},
									{
										text: 分享 + " ...", icon: "../apps/com.actionsoft.apps.mydriver/img/icon_mmenu_fx.png", tit: "share", method: function () {
											openSelectShareDlg(rowid, rowname);
											$(memuParent).find('.contextMenu').menu("close");
										}
									},
									{
										text: 取消收藏, icon: "../apps/com.actionsoft.apps.mydriver/img/icon_mmenu_sc.png", tit: "unfavorite", method: function () {
											cancelFavorite(rowid);
											$(memuParent).find('.contextMenu').menu("close");
										}
									},
									{
										text: 收藏, icon: "../apps/com.actionsoft.apps.mydriver/img/icon_mmenu_sc.png", tit: "favorite", method: function () {
											addFavorite(rowid);
											$(memuParent).find('.contextMenu').menu("close");
										}
									},
									{text:"", tit:""},
									{
										text: 移动到 + " ...", icon: "../apps/com.actionsoft.apps.mydriver/img/icon_mmenu_yd.png", tit: "move", method: function () {
											openMoveFileDlg(rowid, rowfiletype, pid, isent);
											$(memuParent).find('.contextMenu').menu("close");
										}
									},
									{
										text: 重命名, icon: "../apps/com.actionsoft.apps.mydriver/img/icon_mmenu_cmm.png", tit: "rename", method: function () {
											editFileName(rowid, 'f');
											$(memuParent).find('.contextMenu').menu("close");
										}
									},
									{
										text: 删除, icon: "../apps/com.actionsoft.apps.mydriver/img/icon_mmenu_scwj.png", tit: "delete", method: function () {
											delFile(rowid);
											$(memuParent).find('.contextMenu').menu("close");
										}
									},
									//{text:"标签", tit:"label", method:function(){ showLabelPanel(rowid); $(memuParent).find('.contextMenu').menu("close"); }},
									/*
									 // 20170224该版本隐藏评论功能
									 *{text:"评论",icon:"../apps/com.actionsoft.apps.mydriver/img/exe-32.png",  tit:"comment", method:function(){ showCommentPanel(rowid); $(memuParent).find('.contextMenu').menu("close"); }},
									 */
									{text:"", tit:""},
									{
										text: 详细信息 + " ...", icon: "../apps/com.actionsoft.apps.mydriver/img/icon_mmenu_sx.png", tit: "modify", method: function () {
											openFileModifyDlg(rowid);
											$(memuParent).find('.contextMenu').menu("close");
										}
									}

								] };
				    			 $(memuParent).find('.contextMenu').menu(option);
							 }
			//空的分隔样式
			$(".awsui-menu").find("li[tit='']").css("height", "1px").css("line-height", "1px");
				    		 //在线文档
				    		 if(isonlinefile!=undefined && isonlinefile=="1" ){
				    			 $(memuParent).find('.contextMenu').find("li[tit='editfile']").show();
						     }else{
						    	 $(memuParent).find('.contextMenu').find("li[tit='editfile']").hide();
							 }
				    		//判断显示收藏还是取消收藏
					    	if(favoritecanuseflag=="1" && favoriteFlag=="0"){
					    		$(memuParent).find('.contextMenu').find("li[tit='unfavorite']").hide();
					    		$(memuParent).find('.contextMenu').find("li[tit='favorite']").show();
						    }else if(favoritecanuseflag=="1" && favoriteFlag=="1"){
						    	$(memuParent).find('.contextMenu').find("li[tit='unfavorite']").show();
						    	$(memuParent).find('.contextMenu').find("li[tit='favorite']").hide();
						    }
						    
						     if(userType!=undefined && ( userType=="4" || userType=="3")){
						     	 $(memuParent).find('.contextMenu').find("li[tit='share']").show();
						     	 $(memuParent).find('.contextMenu').find("li[tit='move']").show();
						     	 $(memuParent).find('.contextMenu').find("li[tit='rename']").show();
						     	 $(memuParent).find('.contextMenu').find("li[tit='delete']").show();
						     }
						     
						     if(userType!=undefined &&  userType=="1"){
						     	 $(memuParent).find('.contextMenu').find("li[tit='share']").hide();
						     	 $(memuParent).find('.contextMenu').find("li[tit='move']").hide();
						     	 $(memuParent).find('.contextMenu').find("li[tit='rename']").hide();
						     	 $(memuParent).find('.contextMenu').find("li[tit='delete']").hide();
						     }
						    
						    //判断是否允许下载
						    if(canDownloadFlag!=undefined && canDownloadFlag=="1"){
						    	$(memuParent).find('.contextMenu').find("li[tit='downfile']").hide();
				    	   }
						     
					        event.stopPropagation();
		});
	});
	
	$(".contextMenu img").each(function(i,ele){
		try{
			$(ele).attr("width","24");
			$(ele).attr("height","24");
		}catch(e){}
	});
	
	$('.v_item-top').bind("mouseleave",function(event){
		$(this).removeClass('hover');
		$(this).find('.chk_icon').off('click');
	});
	
	//打开  打开文件夹
	$('.v_item-top').off('click').on("click",function(event){
		var rowid = $(this).attr('rowid');
		var rowfiletype= $(this).attr('rowfiletype');
		//处理icon视图中图标点击的时候选中，而不只是 chk_icon选中
		if($(this).find('.chk_icon').parent().attr('select')!='true'){
			$(this).find('.chk_icon').addClass('chk_icon_checked');
			$(this).find('.file_icon_v').addClass('fileicon_v_checked');
			$(this).find('.file_icon_v').attr('select','true');
		}else{
			$(this).find('.chk_icon').removeClass('chk_icon_checked');
			$(this).find('.file_icon_v').removeClass('fileicon_v_checked');
			$(this).find('.file_icon_v').attr('select','false');
		}
		event.stopPropagation();
		changeFileHeader();
	});
	
	//checkbox全选
	$('#chkall').off('click').on('click',checkAll);
	$('.v_item-bottom').on('click', function (event) {
		 var fileId = $(this).prev().attr('rowid');
		 var fileType=$(this).prev().attr("rowfiletype");
		 var picType="bmp,jpg,jpeg,tif,tiff,gif,png,ico";
		 if(fileType!="f" && fileType!="" && picType.indexOf(fileType.toLowerCase())!=-1){
	     }else{
	    	 showFullScreenPanel(fileId);
	     }
	});
	$('.v_item-bottom').on('click', "input[type=text]", function (e) {
		e.stopPropagation();//阻止冒泡
	});
}

function downFileForIcon(fileId,rowname,filetype){
		if (filetype=="d") {//文件夹
			mutifiledownloadForDir(fileId,rowname);
		} else {
			singledownload(fileId);
			return false;
		}
		return false;
}

/*注册右侧操作区域事件*/
function registerListViewEvent(){
	//列表
	$(".file-list-row").bind("mouseenter",function(event){
		$(this).addClass("active");
		//动态显示工具条
		$(this).find('.tools').css('display','block');
		
		
		var width = $(".file-list").width()*0.6-($(this).find('.tools').width())-90;
	   $(this).find('.filetitle').css("width",width+"px");
		$(this).siblings().find('.tools').css('display', 'none');
	});
	$(".file-list-row").bind("mouseleave",function(event){
		$(this).removeClass("active");
		$(this).find('.more-sfile-menu').css('display','none');
		$(this).find('.tools').css('display','none');
		$(this).siblings().find('.tools').css('display','none');
		
		var width = $(".file-list").width()*0.6-99;
	   $(this).find('.filetitle').css("width",width+"px");
	});
	//checkbox全选
	$('#chkall').off('click').on('click',checkAll);
	
	//选中一行
	$('.row-check').off('click').on('click',function(e){
			//单选一行
			var val = $(this).prop('checked');
			$(this).prop('checked',val);
			//选中样式
			$(this).parent().parent().parent().addClass('active');
			e.stopPropagation();
			var userType = getSelectItemsForUserType();
		changeFileHeader(userType);
		
	});
	
	
	
	//点击文件名
	$('.filetitle').off('click').on('click',function(e){
		if( current_nav!=NAV_RECILEBIN &&current_nav!=NAV_MONITOR && current_nav!=NAV_ADMINCONFIG && current_nav!=NAV_SHAREME && current_nav!=NAV_MYSHARE && current_nav!=NAV_LINKSHARE && current_nav!=NAV_LOG){
			 var fileId = $(this).parent().parent().parent().attr('rowid');
			 var fileType=$(this).parent().find(".tools").attr("rowfiletype");
			 var picType="bmp,jpg,jpeg,tif,tiff,gif,png,ico";
			 if(fileType!="f" && fileType!="" && picType.indexOf(fileType.toLowerCase())!=-1){
		     }else{
		    	 showFullScreenPanel(fileId);
		     }
			 
		}
	});
	//分享
	$(".share").off('click').on('click',function(){
		 var fileId = $(this).parent().parent().attr('rowid');
		 var fileName = $(this).parent().parent().attr('rowname');
	     openSelectShareDlg(fileId,fileName);
		 return false;
	});
	
	$(".download").off('mouseenter').on('mouseenter',function(){
		var moreDom =  $(this).parent().parent().find('.more-sfile-menu');
		moreDom.hide();
		return false;
	});
	$(".share").off('mouseenter').on('mouseenter',function(){
		 var moreDom =  $(this).parent().parent().find('.more-sfile-menu');
		 moreDom.hide();
		 return false;
	});
	//取消分享  列表行上
	$(".unshare").off('click').on('click',function(){
		//点击取消分享
		var shareid = $(this).parent().parent().parent().parent().parent().attr('shareid');
		var options = {
			title: 提示, content: 取消分享后该条分享记录将被删除确定要取消分享吗, onConfirm: function () {
				cancelShare(shareid);
			}
		};
		$.confirm(options);
	   return false;
	});
	

	//  点击行上的下载
	$(".download").off('click').on('click', function() {
		var fileId = $(this).parent().parent().attr('rowid');
		var rowname = $(this).parent().parent().attr('rowname');
		var rowfiletype= $(this).parent().parent().attr('rowfiletype');
		if (isDir(rowfiletype)) {
			//如果是文件夹
			mutifiledownloadForDir(fileId,rowname);
		} else {
			var fileurl=$(this).parent().parent().parent().find(".filetitle").attr("href");
			singledownload(fileId);
			return false;
		}
		return false;
	});
	
	//还原
	$(".restore").off('click').on('click',function(){
		var rowid  =  $(this).parent().parent().attr('rowid');
		var options = {
			title: 提示, content: 确定要还原该文件或文件夹吗 + "？", onConfirm: function () {
				restoreDirOrFile(rowid);
			}
		};
			$.confirm(options);
			return false;
	});
	
	//彻底删除
	$(".delete-thorough").off('click').on('click',function(){
		var rowid  =  $(this).parent().parent().attr('rowid');
		var options = {
			title: 提示,
			content: 彻底删除提示,
				onConfirm: function(){
					deleteThroughFolderOrFile(rowid);
				}
			};
			$.confirm(options);
			return false;
	});
	
	
	//更多
	$(".more").off('click').on('click',function(){
		var moreDom =  $(this).parent().find('.more-sfile-menu');
		var filenameDiv = $(this).parent().parent().parent();
		var rowid  =  $(this).parent().parent().attr('rowid');
		var pid  =  $(this).parent().parent().attr('pid');
		var rowisent = $(this).parent().parent().attr('isent');
		var rowFavoriteFlag  =  $(this).parent().parent().parent().parent().parent().attr('favoriteflag');
		var rowfiletype  =  $(this).parent().parent().attr('rowfiletype');
		moreDom.show();
		moreDom.find('.icon-rename-sfile').off('click').on('click',function(){
			moreDom.hide();
			if(isDir(rowfiletype)){
				editFileName(rowid,'d');
			}else{
				editFileName(rowid,'f');
			}
			
			$(".hba_buttons").hide();
		});
		
		moreDom.find('.icon-modify-sfile').off('click').on('click',function(){
			moreDom.hide();
			openFileModifyDlg(rowid);
			$(".hba_buttons").hide();
		});
	    
	    moreDom.find('.icon-editmd-sfile').off('click').on('click',function(){
			moreDom.hide();
			showUpdateFileDlg(rowid);
			$(".hba_buttons").hide();
		});
		
		
		//移动文件夹
		moreDom.find('.icon-move-sfile').off('click').on('click',function(){
			openMoveFileDlg(rowid,rowfiletype,pid);
		});
 
		moreDom.find('.icon-delete-sfile').off('click').on('click',function(){
			delFile(rowid);
		});
		
		moreDom.find('.icon-sharetonetwork-sfile').off('click').on('click',function(){
			shareToNetWork(rowid);
		});
		
		moreDom.find('.icon-addfavorite-sfile').off('click').on('click',function(){
			var rowObj=moreDom.parent().parent().parent().parent().parent();
			if(rowFavoriteFlag=="0"){
				addFavorite(rowid,rowObj);
			}else if(rowFavoriteFlag=="1"){
				cancelFavorite(rowid,rowObj);
			}
			
		});
		
		
		moreDom.find('.icon-label-sfile').off('click').on('click',function(){
			showLabelPanel(rowid);
		});
		
		
		moreDom.find('.icon-comment-sfile').off('click').on('click',function(){
			showCommentPanel(rowid);
		});
		
		$(".file-list-row img").each(function(i,ele){
			try{
				var imgUrl=$(ele).css("background-image");
				var imgUrl = imgUrl.replace(/"/g, "");
				var imgUrl = imgUrl.replace("'", "");
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
		
		$(".more-sfile-inner img").each(function(i,ele){
			try{
				var imgUrl=$(ele).css("background-image");
				var imgUrl = imgUrl.replace(/"/g, "");
				var imgUrl = imgUrl.replace("'", "");
				var imgUrl=imgUrl.split("(")[1];
				var arr=imgUrl.split(")")[0];
				var ePClass=$(ele).parent().attr("class");
			}catch(e){}
		});
		return false;
	});
	
	
	//复制链接
	 if(myBrowser()=="IE"){
	 	   $(".copysharelinkurl").off('click').on('click',function(){
		 	      var fileurl=$(this).parent().parent().parent().parent().parent().attr("linkurl");
		 	      var sharepwd=$(this).parent().parent().parent().parent().parent().attr("sharepwd");
			   window.clipboardData.setData('text', fileurl + " " + 提取密码 + "：" + sharepwd);
			   $.simpleAlert(复制成功, 'ok');
		  	});
	       return false;
	 }else{
		 $(".file-list-row").bind("mouseenter",function(event){
		 	   var clip = new ZeroClipboard($(this).find(".copysharelinkurl"));
			 clip.setText($(this).attr("linkurl") + " " + 提取密码 + "：" + $(this).attr("sharepwd"));
		       clip.on("copy", function(e){
				   $.simpleAlert(复制成功, 'ok');
				});
		});
		 
		 $(".copysharelinkurl").off('click').on('click',function(){
			 var clip = new ZeroClipboard($(this).find(".copysharelinkurl"));
			 clip.on('error', function (event) {
				 $.simpleAlert(您的浏览器无法复制该链接请手动复制, 'warning');
					ZeroClipboard.destroy();
			  });
	  	});
      return false;
      
	
	 }
	 
}


/*注册右侧操作区域事件*/
function registerLogListViewEvent(){
	//列表
	$(".logfile-list-row").bind("mouseenter",function(event){
		$(this).addClass("active");
	});
	
	$(".logfile-list-row").bind("mouseleave",function(event){
		$(this).removeClass("active");
	});
}
//删除文件
function delFile(rowid){
	var options = {
		title: 提示,
		content: 确认要把所选文件或文件夹放入回收站吗 + "<br/>" + 删除的文件或文件夹可以在回收站还原,
		onConfirm: function(){
			removeFolderOrFile(rowid);
		}
	};
	$.confirm(options);
	return false;
}
//分享到工作网络
function shareToNetWork(rowid) {
	openNetWorkDlg(rowid);
}
//选择工作网络弹出框
function openNetWorkDlg(messageid){
	var url = encodeURI( "./w?sid=" + sid + "&cmd=com.actionsoft.apps.mydriver_getnetworktreepage");
	var dlg=FrmDialog.open({
		width: 500, height: 400, title: 分享到同事圈,
		url:url,id:"selectnetworkdlgid",
		buttons:[
			{
				text: 确定, cls: "blue", handler: function () {
			var childwin = dlg.win();
			var selectNode=childwin.selectedNode;
			if(selectNode!=undefined){
				var selectedId = childwin.selectedNode.id;
				var selectedNodeType = childwin.selectedNode.nodetype;
			    if(selectedNodeType!="1"){
			    	saveStream(dlg,messageid,"",selectedId);
			    }else{
			    	saveStream(dlg,messageid,selectedId,"");
			    }
			}else{
				$.simpleAlert(请选择一个工作网络或者小组);
			}
			  }
		  }, {
				text: 关闭, handler: function () {
					dlg.close();
				}
			}
		],
		data: {}
  
	});
}

//保存信息流
	function saveStream(dlg,messageid, teamid, networkid) {
		$.simpleAlert(正在处理请稍侯, "loading");
		var basepath = getRootPath();
		var params = {
			messageid : messageid,
			teamid : teamid,
			networkid : networkid,
			basepath : basepath
		};
		var url = './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_addstream';
		awsui.ajax.post(url, params, function(responseObject) {
			if (responseObject['result'] == 'ok') {
				$.simpleAlert(分享成功, 'ok', 2000, {model: true});
				//延迟一下执行
				setTimeout(function(){
					dlg.close();
					$.simpleAlert("close");
				},2000);
			} else {
				$.simpleAlert(responseObject['msg'], responseObject['result']);
			}
		}, 'json');
	}

//关闭平台弹窗
function closeDialog(){
	FrmDialog.close();
}

//删除文件或文件夹
function removeFolderOrFile(sourceIds){
	$.ajax({
		type : "POST",
		async: false,
		url: './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_deletedirorfile&t=' + Math.random(),
		data :{"sourceIds":sourceIds},
		dataType:'json',
		success : function(response){
			var msg = response.msg;
			if (response.result!='ok') {
				$.simpleAlert(msg,'warning',2000,{model:true});
				return false;
			}else{
				$.simpleAlert(删除成功, 'ok', 2000, {model: true});
				//刷新列表
				var dirId = $('#currentDirId').val();
				openDir(dirId);
				if(useTreeNavFlag=="0"){
			    	//加载左侧树形导航
			        //loadLeftNavTree();
				    if(dirId==undefined || dirId==""){
					    if(current_nav=="allfile"){
							dirId="root";
						}else if(current_nav=="entallfile"){
							dirId="entroot";
						}
				    }
			        var node = leftNavTree.getNodeById(dirId);
			        loadLeftNavTreeNode(node);
			    }
				//重新渲染网盘的个人容量
				currentUsedSize = response['data']['currentUsedSize'];
				allSize = response['data']['allSize'];
				refreshUserCapacity();
				
			}
		}
	});
	
}

function loadLeftNavTreeNode(treeNode) {
    var pid=treeNode.id;
	if(treeNode.id=="root"){
		pid="";
	}else if(treeNode.id=="entroot"){
		pid="";
	}
	var isEnt=treeNode.isEnt;
	var dataUrl = './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_load_nav_tree_json&isdir=0&pid=' + pid+"&isEnt="+isEnt;
	leftNavTree.setting.dataModel.url = dataUrl;
	leftNavTree.setting.dataModel.dataType = "text";
	leftNavTree.setting.dataModel.method = "POST";
	var data = leftNavTree.getData(leftNavTree.setting.dataModel, pid);
	leftNavTree.buildChilren(data, treeNode, 'reload');
	//
	leftNavTree.initStyles();
	leftNavTree.initIcon(data);
}


//彻底删除文件或者文件夹的方法
function deleteThroughFolderOrFile(sourceId){
	deleteThoroughFun(sourceId,"com.actionsoft.apps.mydriver_deletethoroughdirorfile");
}

//彻底删除文件或者文件夹的方法  不是回收站的那个
function deleteThroughFolderOrFileCommon(sourceId){
	deleteThoroughFun(sourceId,"com.actionsoft.apps.mydriver_deletethoroughdirorfilecommon");
}

function deleteThoroughFun(sourceId,cmd){
	$.ajax({
		type : "POST",
		async: false,
		url: './jd?sid=' + sid + '&cmd=' + cmd + '&t=' + Math.random(),
		data :{"sourceId":sourceId},
		dataType:'json',
		success : function(response){
			var msg = response.msg;
			if (response.result!='ok') {
				$.simpleAlert(msg,'warning',2000,{model:true});
				return false;
			}else{
				$.simpleAlert(删除成功, 'ok', 2000, {model: true});
				//刷新列表
				var dirId = $('#currentDirId').val();
				if(dirId !=''){
					openDir(dirId);
				}else{
					changeNav(current_nav);
				}
				
				if(useTreeNavFlag=="0"){
				    //loadLeftNavTree();
				    if(dirId==undefined || dirId==""){
					    if(current_nav=="allfile"){
							dirId="root";
						}else if(current_nav=="entallfile"){
							dirId="entroot";
						}
				    }
			        var node = leftNavTree.getNodeById(dirId);
			        loadLeftNavTreeNode(node);
		        }
				//重新渲染网盘的个人容量
				currentUsedSize = response['data']['currentUsedSize'];
				allSize = response['data']['allSize'];
				refreshUserCapacity();
			}
		}
	});
}


//还原处理方法
function restoreDirOrFile(sourceIds){
	$.ajax({
		type : "POST",
		async: false,
		url: './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_recoverdirorfile&t=' + Math.random(),
		data :{"sourceIds":sourceIds},
		dataType:'json',
		success : function(response){
			var msg = response.msg;
			if (response.result!='ok') {
				$.simpleAlert(msg,'warning',2000,{model:true});
				return false;
			}else{
				$.simpleAlert(操作成功, 'ok', 2000, {model: true});
				//刷新列表
				var dirId = $('#currentDirId').val();
				if(dirId !=''){
					openDir(dirId);
				}else{
					changeNav(current_nav);
				}
				if(useTreeNavFlag=="0"){
		    	   //加载左侧树形导航
		           loadLeftNavTree();
		        }
				//重新渲染网盘的个人容量
				currentUsedSize = response['data']['currentUsedSize'];
				allSize = response['data']['allSize'];
				refreshUserCapacity();
			}
		}
	});
	
}

//取消编辑
function cancelEdit(){
	var dirId = $('#currentDirId').val();
	//刷新列表
	openDir(dirId,"1");
	$(".hba_buttons").show();//显示表头图标
	windowresize();
	return false;
}
//编辑文件或文件名
function saveEdit(dom,rowid,oldname,filesubfix){
	//查找到他的兄弟input
	var reg = new RegExp('^[^\\\\\\/:*?\\"<>|]+$');
	var inputdom = $(dom).parent().children('input');
	
	var dirId = $('#currentDirId').val();
	var newname = inputdom.val();
	newname=$.trim(newname);
	if (newname == "") {
		$.simpleAlert("文件名称不允许为空");
		return false;
	} else if (!reg.test(newname)) {//不能包含特殊字符
		$.simpleAlert('文件夹名字不能包含 \\  / : * ? " < > |');
		return false;
	}

	newname=newname+filesubfix;
	if(oldname != newname){
		$.ajax({
			type : "POST",
			async: false,
			url: './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_renamedirorfile&t=' + Math.random(),
			data :{"sourceId":rowid,'newName':newname},
			dataType:'json',
			success : function(response){
				var msg = response.msg;
				if (response.result!='ok') {
					$.simpleAlert(msg,'warning',2000,{model:true});
					return false;
				}else{
					$.simpleAlert(修改成功, 'ok', 2000, {model: true});
					if(useTreeNavFlag=="0"){
				    	//加载左侧树形导航
				        //loadLeftNavTree();
					    var dirId = $('#currentDirId').val();
					    if(dirId==undefined || dirId==""){
						    if(current_nav=="allfile"){
								dirId="root";
							}else if(current_nav=="entallfile"){
								dirId="entroot";
							}
					    }
				        var node = leftNavTree.getNodeById(dirId);
				        loadLeftNavTreeNode(node);
				    }
				}
			}
		});
	}
	//刷新列表
	openDir(dirId,"1");
	$(".hba_buttons").show();//显示表头图标
	windowresize();
	return false;
}

//获得子部门树ui方法
function getChildFolder(rowids){
	var childArrs = [];
	$.ajax({
		type : "POST",
		async: false,
		url: './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_getchildfolders&t=' + Math.random(),
		data :{"folderId":rowids.toString()},
		dataType:'json',
		success : function(data){
			childArrs = data;
		}
	});
	return childArrs;
}

Array.prototype.contains = function(obj) {
	for(i=0;i<this.length;i++)
	{
		if(this[i].id == obj)
			return true;
	}
		return false;
};
//移动到文件夹逻辑
function moveFolder(rowids,rowfiletype,pid,dlg,rowisent){
	var childwin = dlg.win();
	
	var selectNode=childwin.selectedNode;
	if(selectNode==undefined){
		$.simpleAlert(请选择要移动到的目标文件夹, 'info', 2000, {model: true});
		return false;
	}
	var selectedId = childwin.selectedNode.id;//获取选中的tree节点id
	var isEnt= childwin.selectedNode.isEnt;
	
	
	if(typeof rowids=="object" && rowids.length>1){
		//移动多个文件的时候
		var eachrowid="";
		for (var ri = 0; ri < rowids.length; ri++) {
			var forderids="";//获取rowids文件下的文件夹id的拼接str
			var childFolders = getChildFolder(rowids[ri]);
			for (var i=0; i < childFolders.length; i++) {
				forderids=forderids+","+childFolders[i].id;
			};
			eachrowid=rowids[ri].toString();
			
			if(isDir(rowfiletype[ri])){
				
				if(isEnt=="1" ){
					//企业文件夹
					if(selectedId=="entroot" && pid[ri] == ""   && rowisent[ri]==isEnt){
						$.simpleAlert(不能将文件移动到自身或其子文件夹下, 'info', 2000, {model: true});
						return false;
					}
				}else{
					if(selectedId=="root" && pid[ri] == ""   && rowisent[ri]==isEnt){
						$.simpleAlert(不能将文件移动到自身或其子文件夹下, 'info', 2000, {model: true});
						return false;
					}
				}
				
				if(selectedId=="root" && pid[ri] == ""){
					$.simpleAlert(不能将文件移动到自身或其子文件夹下, 'info', 2000, {model: true});
					return false;
				}
				
				if( eachrowid == selectedId || eachrowid.indexOf(selectedId)!=-1 || forderids.indexOf(selectedId)!=-1){
					$.simpleAlert(不能将文件移动到自身或其子文件夹下, 'info', 2000, {model: true});
					return false;
				}
			}else{
				
				if(selectedId== pid[ri] ){
					$.simpleAlert(不能将文件移动到自身或其子文件夹下, 'info', 2000, {model: true});
						return false;
				}
				
				if(isEnt=="1" ){
					//企业文件夹
					if(selectedId=="entroot" && pid[ri] == ""  && rowisent[ri]==isEnt){
						$.simpleAlert(不能将文件移动到自身或其子文件夹下, 'info', 2000, {model: true});
						return false;
					}
				}else{
					if(selectedId=="root" && pid[ri] == ""   && rowisent[ri]==isEnt){
						$.simpleAlert(不能将文件移动到自身或其子文件夹下, 'info', 2000, {model: true});
						return false;
					}
				}
			}
		}
	}else{
		//移动单个文件的时候
		var forderids="";//获取rowids文件下的文件夹id的拼接str
		var childFolders = getChildFolder(rowids);
		for (var i=0; i < childFolders.length; i++) {
			forderids=forderids+","+childFolders[i].id;
		};
		rowids=rowids.toString();
		
		if(isDir(rowfiletype)){
			
			//移动文件夹如果选的是自己
			if(rowids==selectedId){
				$.simpleAlert(不能将文件移动到自身或其子文件夹下, 'info', 2000, {model: true});
				return false;
			}
			
			if(isEnt=="1" ){
				//企业文件夹
				if(selectedId=="entroot" && pid == "" && rowisent==isEnt){
					$.simpleAlert(不能将文件移动到自身或其子文件夹下, 'info', 2000, {model: true});
					return false;
				}
			}else{
				if(selectedId=="root" && pid == "" && rowisent==isEnt){
					$.simpleAlert(不能将文件移动到自身或其子文件夹下, 'info', 2000, {model: true});
					return false;
				}
			}
			
			
			if( rowids == selectedId || rowids.indexOf(selectedId)!=-1 || forderids.indexOf(selectedId)!=-1){
				$.simpleAlert(不能将文件移动到自身或其子文件夹下, 'info', 2000, {model: true});
				return false;
			}
		}else{
			
			if(selectedId== pid ){
				$.simpleAlert(不能将文件移动到自身或其子文件夹下, 'info', 2000, {model: true});
					return false;
			}
			
			if(isEnt=="1" ){
				//企业文件夹
				if(selectedId=="entroot" && pid == "" && rowisent==isEnt){
					$.simpleAlert(不能将文件移动到自身或其子文件夹下, 'info', 2000, {model: true});
					return false;
				}
			}else{
				if(selectedId=="root" && pid == "" && rowisent==isEnt){
					$.simpleAlert(不能将文件移动到自身或其子文件夹下, 'info', 2000, {model: true});
					return false;
				}
			}
		}
	}
	
	if(selectedId=="entroot"){
		if((isMyDriverAdmin!=undefined && isMyDriverAdmin=="1") ||(isAdmin!=undefined && isAdmin=="1")){
		}else{
			$.simpleAlert(只有网盘管理员可以将文件移入企业文件夹根目录, 'info', 2000, {model: true});
			return false;
		}
	}
	
	if(selectedId =='root' ||selectedId =='entroot'){
		selectedId="";//当选择根目录的时候将id设置为""
	}
	
	var params={
		sourceId:rowids.toString(),
		targetDirId:selectedId,
		isEnt:isEnt
	};
	$.ajax({
		type : "POST",
		async: false,
		url: './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_movedirorfile&t=' + Math.random(),
		data :params,
		dataType:'json',
		success : function(data){
			dlg.close();
			if(data.result!='ok'){
				$.simpleAlert(data.msg,'warning',2000,{model:true});
			}else{
				if(data["data"]["moveflag"]==false){
					$.simpleAlert(文件夹的层级超出限制, 'info', 2000, {model: true});
				}else{
					$.simpleAlert(移动成功, 'ok', 2000, {model: true});
				  //刷新列表
				  var dirId = $('#currentDirId').val();
				  openDir(dirId);
				  if(useTreeNavFlag=="0"){
			    	  //加载左侧树形导航
			          //loadLeftNavTree();
		              //var dirId = $('#currentDirId').val();
		              
		              if(dirId==""){
						if(isEnt=="0"){
							dirId="root";
						}else{
							dirId="entroot";
						}
				      }
			          var node = leftNavTree.getNodeById(dirId);
			          loadLeftNavTreeNode(node);
			          
			          //目标节点
			          
			          if(selectedId==""){
						if(isEnt=="0"){
							selectedId="root";
						}else{
							selectedId="entroot";
						}
				    }
			          var nodeTarget = leftNavTree.getNodeById(selectedId);
			          loadLeftNavTreeNode(nodeTarget);
			      }
				}
				
				
			}
		}
	});
}

//当有选中文件时改变header为按钮区  每次点击复选框都会执行
function changeFileHeader(userType){
	//计算是否有选中的记录 有的话就改变，否则就不变
	var html = 已选中 + "&nbsp;" + '%s' + "&nbsp;" + 个文件夹;
	var selectItems = getSelectItems();
	var selectRowsType=getSelectItemsForRowType();
	var showScanBtnFlag=false;
	var picType="bmp,jpg,jpeg,tif,tiff,gif,png,ico";
	for(var eachobj in selectRowsType) { // 这个是关键
		var eachstr= selectRowsType[eachobj].toString();
		if(eachstr!="f" && eachstr!="" && picType.indexOf(eachstr.toLowerCase())!=-1){
			showScanBtnFlag=true;
			break;
		}
	}
	
	var info = html.replace('%s',selectItems.length);
	var header =$("<div class='header_batch_area'></div>");
	var content = "<input type='checkbox' class='hba_checkall'/><span class='hba_info'>"+info+"</span>";
	// 判读不同分类下文表头中的按钮信息
    if(current_nav==NAV_RECILEBIN){
		content += "<div class='hba_buttons'><a class='hba_button' id='icon-restore'><em class='icon-restore'></em><b>" + 还原 + "</b></a><a class='hba_button redbtn' style='padding:5px 10px 5px 10px' id='hba_delthorough'><b>" + 彻底删除 + "</b></a></div>";
    }else if(current_nav==NAV_MYSHARE){
		content += "<div class='hba_buttons'><a class='hba_button' id='icon-unshare'><em class='icon-unshare'></em><b>" + 取消分享 + "</b></a></div>";
    }else if(current_nav==NAV_LINKSHARE){
		content += "<div class='hba_buttons'><a class='hba_button' id='icon-unshare'><em class='icon-unshare'></em><b>" + 取消分享 + "</b></a></div>";
    }else if(current_nav==NAV_SHAREME){
		content += "<div class='hba_buttons'><a class='hba_button' id='hba_download'><em class='hba_download'></em><b>" + 下载 + "</b></a></div>";
    }else{
			   //判断选中的文件的selectRowsType中是否包含图片 如果包含图片的话显示预览，如果不包含图片的话不显示预览
		       if(showScanBtnFlag){
				   content += "<div class='hba_buttons'><a class='hba_button' id='hba_download'><em class='hba_download'></em><b>" + 下载 + "</b></a><a class='hba_button redbtn' style='padding:5px 10px 5px 10px' id='hba_del'><b>" + 删除 + "</b></a><a class='hba_button redbtn' style='padding:5px 10px 5px 10px' id='hba_delthorough'><b>" + 彻底删除 + "</b></a><a class='hba_button' id='hba_scan'><em class='hba_scan'></em><b>" + 预览 + "</b></a><a class='hba_button' id='hba_more'><em class='hba_more'></em><b>" + 更多 + "</b></a></div>";
		       }else{
				   content += "<div class='hba_buttons'><a class='hba_button' id='hba_download'><em class='hba_download'></em><b>" + 下载 + "</b></a><a class='hba_button redbtn' style='padding:5px 10px 5px 10px' id='hba_del'><b>" + 删除 + "</b></a><a class='hba_button redbtn' style='padding:5px 10px 5px 10px' id='hba_delthorough'><b>" + 彻底删除 + "</b></a><a class='hba_button' id='hba_more'><em class='hba_more'></em><b>" + 更多 + "</b></a></div>";
		       }
    }
	var item_num;//总记录数
	var checked;//是否选中全选
	if(currentView==VIEW_TYPE_LIST){
		item_num = $('.row-check').length;
	}
	if(currentView==VIEW_TYPE_ICON){
		item_num = $('.v_item-top').length;
	}
	//选中条数和总条数相等且不为0条
	checked = (selectItems.length==item_num && item_num!=0);
	if(selectItems.length>0){
		   $('.header_batch_area ').remove();//每次选中一个文件先清除按钮然后再重新添加
			header.append($(content));
			$('.right-center-content').prepend(header);
			registBatchButtonsEvent();
			$('.hba_info').html(info);
			//绑定新dom的checkall事件
			$('.hba_checkall').off('click').on('click',checkAll);
			$('.hba_checkall').prop('checked',checked);
			$('.file-list-header').hide();
	}else{
		$('.header_batch_area').remove();
		$('.file-list-header').show();
		//给原来header checkall赋值
		$('#chkall').prop('checked',checked);
	}
	
	
    if($.browser.isFirefox){
    	$(".hba_scan").css("margin-top","0px");
    }
}



//获取选中行的文件 的用户类型
function getSelectItemsForUserType(){
	/*
	var selectedItems = [];
		$('.row-check').each(function(){
			if($(this).prop('checked')){
				selectedItems.push($(this).attr('userType'));
			}
		});
	return selectedItems;
	*/
	var selectedItems = [];
	if(currentView == VIEW_TYPE_LIST){
		$('.row-check').each(function(){
			if($(this).prop('checked')){
				 selectedItems.push($(this).attr('userType'));
			}
		});
	}else if(currentView == VIEW_TYPE_ICON){
		$(".file_icon_v[select='true']").each(function(){
			selectedItems.push($(this).parent().attr('userType'));
		});
	}
	return selectedItems;
}

//获取选中的文件或文件夹
function getSelectItems(){
	var selectedItems = [];
	if(currentView == VIEW_TYPE_LIST){
		$('.row-check').each(function(){
			if($(this).prop('checked')){
				  selectedItems.push($(this).val());
			}
		});
	}else if(currentView == VIEW_TYPE_ICON){
		$(".file_icon_v[select='true']").each(function(){
			selectedItems.push($(this).parent().attr('rowid'));
		});
	}
	return selectedItems;
}

//获取选中的文件或文件夹
function getSelectItemsForRowName(){
	var selectedItems = [];
	if(currentView == VIEW_TYPE_LIST){
		$('.row-check').each(function(){
			if($(this).prop('checked')){
				 selectedItems.push($(this).attr('rowname'));
			}
		});
	}else if(currentView == VIEW_TYPE_ICON){
		$(".file_icon_v[select='true']").each(function(){
			selectedItems.push($(this).parent().attr('rowname'));
		});
	}
	return selectedItems;
}

//获取选中的文件或文件夹
function getSelectItemsForPID(){
	var selectedItems = [];
	if(currentView == VIEW_TYPE_LIST){
		$('.row-check').each(function(){
			if($(this).prop('checked')){
				 selectedItems.push($(this).attr('pid'));
			}
		});
	}else if(currentView == VIEW_TYPE_ICON){
		$(".file_icon_v[select='true']").each(function(){
			selectedItems.push($(this).parent().attr('pid'));
		});
	}
	return selectedItems;
}

function getSelectItemsForIsEnt(){
	var selectedItems = [];
	if(currentView == VIEW_TYPE_LIST){
		$('.row-check').each(function(){
			if($(this).prop('checked')){
				 selectedItems.push($(this).attr('isent'));
			}
		});
	}else if(currentView == VIEW_TYPE_ICON){
		$(".file_icon_v[select='true']").each(function(){
			selectedItems.push($(this).parent().attr('isent'));
		});
	}
	return selectedItems;
}



//获取选中文件的rowfiletype
function getSelectItemsForRowType(){
	var selectedItems = [];
	if(currentView == VIEW_TYPE_LIST){
		$('.row-check').each(function(){
			if($(this).prop('checked')){
				selectedItems.push($(this).attr('rowfiletype'));
			}
		});
	}else if(currentView == VIEW_TYPE_ICON){
		$(".file_icon_v[select='true']").each(function(){
			selectedItems.push($(this).parent().attr('rowfiletype'));
		});
	}
	return selectedItems;
}


//获取选中文件的
function getSelectItemsForDownloadFlag(){
	var selectedItems = [];
	if(currentView == VIEW_TYPE_LIST){
		$('.row-check').each(function(){
			if($(this).prop('checked')){
				selectedItems.push($(this).attr('candownloadflag'));
			}
		});
	}else if(currentView == VIEW_TYPE_ICON){
		$(".file_icon_v[select='true']").each(function(){
			selectedItems.push($(this).parent().attr('candownloadflag'));
		});
	}
	return selectedItems;
}

//check框全选/反选事件
function checkAll(){
	//listview情况
	if(currentView==VIEW_TYPE_LIST){
		var checked = $(this).prop('checked');
		$('.row-check').each(function(){
			$(this).prop('checked',checked);
		});
	}
	//iconview情况
	if(currentView==VIEW_TYPE_ICON){
		if($(this).prop('checked')){
			$('.v_item-top').each(function(){
				$(this).find('.file_icon_v').addClass('fileicon_v_checked').attr('select','true');
				$(this).find('.chk_icon').addClass('chk_icon_checked');
			});
		}else{
			$('.v_item-top').each(function(){
				$(this).find('.file_icon_v').removeClass('fileicon_v_checked').attr('select','false');
				$(this).find('.chk_icon').removeClass('chk_icon_checked');
			});
		}
	}
	//标题区变为按钮区
	changeFileHeader();
}
//绑定批量按钮事件
function registBatchButtonsEvent(){
	//获取选中的文件
	$('#hba_share').off('click').on('click',function(){
		var selectItems = getSelectItems().toString();
		 openSelectUserDlg(selectItems);
		 return false;
	});
	
	var userTypes=getSelectItemsForUserType().toString();
	var hasViewerFlag=false;
	for (var i=0; i < getSelectItemsForUserType().length; i++) {
	       if( getSelectItemsForUserType()[i]=="1"){
	       	hasViewerFlag=true;
	       	break;
	       }
	};

	if (hasViewerFlag) {
			$("#hba_del").hide();
			$("#hba_delthorough").hide();
			$("#hba_more").hide();
	} else {
			$("#hba_del").show();
			$("#hba_delthorough").show();
			$("#hba_more").show();
	}
	$('#hba_download').off('click').on('click', function() {
		var selectItems = getSelectItems().toString();
		var flag=false;
		for (var i=0; i < getSelectItems().length; i++) {
		       if( getSelectItems()[i]!=""){
		       	flag=true;
		       	break;
		       }
		};
		
		if(flag){
			var selectrowname=getSelectItemsForRowName();
			var selectrowtype=getSelectItemsForRowType();
			var selectdownloadflag=getSelectItemsForDownloadFlag();
	 
			if(selectdownloadflag.length==1  ){
				if( $.inArray("1",selectdownloadflag)>=0){
					$.simpleAlert("文件不允许下载",'warning',2000,{model:true});
					return false;
				}else{
					if(getSelectItems().length==1  &&  !isDir( selectrowtype[0] ) ){//单个文件 并且这个文件不是文件夹的时候
						singledownload(selectItems);
					}else if(getSelectItems().length==1  &&  isDir(selectrowtype[0] ) ){
						 mutifiledownloadForDir(selectItems,selectrowname[0]);
					}else{
					   mutifiledownload(selectItems);
					}
				}
			}else if(selectdownloadflag.length>1){
				if(getSelectItems().length==1  &&  !isDir( selectrowtype[0] ) ){//单个文件 并且这个文件不是文件夹的时候
					singledownload(selectItems);
				}else if(getSelectItems().length==1  &&  isDir(selectrowtype[0] ) ){
					 mutifiledownloadForDir(selectItems,selectrowname[0]);
				}else{
				   mutifiledownload(selectItems);
				}
			}
		}else{
			$.simpleAlert("文件已被删除，不能下载",'warning',2000,{model:true});
		}
		return false;
	});
	
	//批量删除事件处理
	$('#hba_del').off('click').on('click',function(){
			var selectItems = getSelectItems();
		var options = {
			title: 提示, content: 确认要把所选文件或文件夹放入回收站吗 + "？<br/>" + 删除的文件或文件夹可以在回收站还原, onConfirm: function () {
				removeFolderOrFile(selectItems.toString());
			}
		};
		$.confirm(options);
			return false;
	});
	
	//批量彻底删除事件处理
	$('#hba_delthorough').off('click').on('click',function(){
			var selectItems = getSelectItems();
		var options = {
			title: 提示, content: 确认要把所选文件或文件夹彻底删除吗 + "？<br/>" + 彻底删除的文件或文件夹不可恢复, onConfirm: function () {
				deleteThroughFolderOrFileCommon(selectItems.toString());
			}
		};
		$.confirm(options);
			return false;
	});
	
	//回收站批量彻底删除
	$('#hba_recycledelthorough').off('click').on('click',function(){
			var selectItems = getSelectItems();
		var options = {
			title: 提示, content: 确认要把所选文件或文件夹彻底删除吗 + "？<br/>" + 彻底删除的文件或文件夹不可恢复, onConfirm: function () {
				deleteThroughFolderOrFile(selectItems.toString());
			}
		};
		$.confirm(options);
			return false;
	});
	
 
	//预览
	$('#hba_scan').click(function(){
		 var picone=getSelectTopOnePic();
         $("ul.file-list-row[rowid='"+picone+"']").find("a").click();
         $("div.v_item[rowid='"+picone+"']").find("a").click();
	});
	
	//批量还原事件处理
	$('#icon-restore').off('click').on('click',function(){
			var selectItems = getSelectItems();
		var options = {
			title: 提示, content: 确认要还原选中的文件或文件夹吗 + "？", onConfirm: function () {
				restoreDirOrFile(selectItems.toString());
			}
		};
		$.confirm(options);
			return false;
	});
	
	//批量取消分享
	$('#icon-unshare').off('click').on('click',function(){
			var selectItems = getSelectItems();
		var options = {
			title: 提示, content: 取消分享后该条分享记录将被删除确定要取消分享吗, onConfirm: function () {
				cancelShare(selectItems.toString());
			}
		};
		$.confirm(options);
	        return false;
	});
	
	//更多  批量上的更多
	$('#hba_more').bind('mouseenter',function(){
		var toggleMenu = "<ul class='toggleMenu'><li><a href='#' id='batch_rename'>" + 重命名 + "</a></li><li><a href='#' id='batch_move'>" + 移动到 + "</a></li></ul>";
		if($(this).find('.toggleMenu').length==0){
			$(this).append($(toggleMenu));
		}else{
			$('.toggleMenu').show();
		}
		var selectItems = getSelectItems();
	    var selectItemstype = getSelectItemsForRowType();

		if(selectItems.length>1){
			$('#batch_rename').addClass('disable');
			$('#batch_rename').attr('disabled', "true");
		}else{
			$('#batch_rename').removeClass('disable');
			$('#batch_rename').removeAttr('disabled');
		}
		
		if($('.folder-generator').length>0){
			 if(!$('.folder-generator').is(':hidden')){
		 	     $('#batch_rename').addClass('disable');
				 $('#batch_rename').attr('disabled', "true");
			 }else{
				 $('#batch_rename').removeClass('disable');
				 $('#batch_rename').removeAttr('disabled');
			 }
		}
		$('#batch_rename').off('click').on('click',function(e){
			if(isDir(selectItemstype[0])){//判断是否是文件夹
				editFileName(selectItems[0],'d');
			}else{
				editFileName(selectItems[0],'f');
			}
			
			$('.toggleMenu').hide();
			e.stopPropagation();
		});
		$('#batch_move').off('click').on('click',function(e){
			var selectItems = getSelectItems();
			var rowtypes = getSelectItemsForRowType();
			var pids = getSelectItemsForPID();
			var selectItems = getSelectItems();
			var rowisent = getSelectItemsForIsEnt();
			openMoveFileDlg(selectItems,rowtypes,pids,rowisent);
			$('.toggleMenu').hide();
			e.stopPropagation();
		});
	});
	$('#hba_more').bind('mouseleave',function(){
		$('.toggleMenu').hide();
	});
}

//获取选中的第一条记录
function getSelectTopOnePic(){
	var selectRowsType=getSelectItemsForRowType();
	var showScanBtnFlag=false;
	var picType="bmp,jpg,jpeg,tif,tiff,gif,png,ico";
	var beginindex;
	for(var eachobj in selectRowsType) { // 这个是关键
		var eachstr= selectRowsType[eachobj].toString();
		if(eachstr!="f" && eachstr!="" && picType.indexOf(eachstr.toLowerCase())!=-1){
			beginindex=eachobj;
			showScanBtnFlag=true;
			break;
		}
	}
	var topone=getSelectItems();
	return topone[beginindex];
}

//批量下载
function mutifiledownload(sourceids){
// **** 注意：增加方法，在批量下载之前通过ajax去验证文件的大小，如果大于512M，则不允许批量下载。
	$.ajax({
		type : "POST",
		async: false,
		url: './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_getallfilesize&t=' + Math.random(),
		data :{"sourceIds" : sourceids},
		dataType:'json',
		success : function(data){
			if(data.result!='ok'){
				$.simpleAlert(data.msg,'warning',2000,{model:true});
			}else{
					if (data.data.lengthflag) {
						var params = {
							'repositoryName' : '!myfile',
							'groupValue' : 'tmp',
							'fileValue' : sourceids,
							'fileName' : new Date().getTime() + '.zip',
							'appId' : appId
						};
						window.location.href = './df?sid=' + sid + '&' + $.param(params);
					}else{
						$.simpleAlert(所选文件太大请选择单个文件进行下载, 'warning', 2000, {model: true});
					}
			}
		}
	});
	
}

//批量下载
function mutifiledownloadForDir(sourceids,filename){
// **** 注意：增加方法，在批量下载之前通过ajax去验证文件的大小，如果大于512M，则不允许批量下载。
	$.ajax({
		type : "POST",
		async: false,
		url: './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_getallfilesize&t=' + Math.random(),
		data :{"sourceIds" : sourceids},
		dataType:'json',
		success : function(data){
			if(data.result!='ok'){
				$.simpleAlert(data.msg,'warning',2000,{model:true});
			}else{
				
				    var repositoryName="!myfile";
				    if(current_nav=="entallfile"){
				    	repositoryName="!myfileent";
				    }
					if (data.data.lengthflag) {
						var params = {
							'repositoryName' : repositoryName,
							'groupValue' : 'tmp',
							'fileValue' : sourceids,
							'fileName' : filename+ '.zip',
							'appId' : appId,
						};
						window.location.href = './df?sid=' + sid + '&' + $.param(params);
					}else{
						$.simpleAlert(所选文件太大请选择单个文件进行下载, 'warning', 2000, {model: true});
					}
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
					window.open(msg);
//					window.location.href=msg;
					//window.open("", "_blank", msg);
				}
			}
		});
	}

//编辑文件名字
function editFileName(rowid,typeparm){
	var model;
	var filenameDiv;
	var filename;
    var filetitle;
    var subfix;//除了文件名外的部分
	if(currentView == VIEW_TYPE_LIST){
		model = $("ul.file-list-row[rowid='"+rowid+"']");//获取整行的ul
		var moreDom =  model.find('.tools');//行上的工具条
		filenameDiv = model.find('.lh40').eq(0);//每行的第一个单元格文字所在的div
		filename = filenameDiv.find('.filetitle').eq(0).text();//class filetitle是 a的class 获取第一个单元格的文字
		var index1 =filename.lastIndexOf('.');//截取.的位置
		if(typeparm=="f" && index1!="-1"){
			filetitle=filename.substring(0,index1);//获取文件名
    	    subfix=filename.substring(index1);
		}else{//如果是文件夹的话就不包含.
			filetitle=filename;//文件夹的话名字不变
    	    subfix="";
		}
		filenameDiv.find('.filetitle').remove();//移除a标签
		moreDom.hide();//隐藏工具条
		$(".file-list-row").unbind("mouseenter");
	}else{
		model = $("div.v_item[rowid='"+rowid+"']");
		filenameDiv = model.find('.v_item-bottom').eq(0);
		filename = filenameDiv.find('.name').eq(0).text();
		var index1 =filename.lastIndexOf('.');//截取.的位置
		if(typeparm=="f" && index1!="-1"){
			filetitle=filename.substring(0,index1);//获取文件名
    	    subfix=filename.substring(index1);
		}else{//如果是文件夹的话就不包含.
			filetitle=filename;//文件夹的话名字不变
    	    subfix="";
		}
		
		filenameDiv.find('.name').remove();
		//屏蔽右键事件
		$('.v_item-top').off('mouseup');
	}
		//拼接修改的ui界面
		if($(".folder-generator").length==0){//当重命名的框还没有显示时
			if(currentView == VIEW_TYPE_LIST){
				filenameDiv.append("<form class='folder-generator' style='margin-top:4px;display:inline-block;padding-left: -2px;line-height: 25px;'><input type='text' style='height:18px;width:120px;'  maxlength=300    /><a   class='b-in-blk img-ico ic-chname-ok'   ></a><a   class='b-in-blk img-ico ic-chname-failure' onclick='cancelEdit();'></a></form>");
			}else{
				filenameDiv.append("<form class='folder-generator' style='margin-top:0px;display:inline-block;padding-left: -2px;line-height: 25px;'><input type='text' style='height:18px;'  maxlength=300  /><a   class='b-in-blk img-ico ic-chname-ok' ></a><a   class='b-in-blk img-ico ic-chname-failure' onclick='cancelEdit();'></a></form>");
			}
			filenameDiv.find(".folder-generator").find("input").val(filetitle);
			filenameDiv.find(".folder-generator").find(".ic-chname-ok").off('click').on('click',function(){
				saveEdit($(this),rowid,filename,subfix);
			});
//		filenameDiv.append("<form class='folder-generator' style='margin-top:4px;display:inline-block;padding-left: -2px;line-height: 25px;'><input type='text' style='height:18px;width:120px;'  maxlength=40 value='"+filetitle+"'  /><a   class='b-in-blk img-ico ic-chname-ok'  onclick='saveEdit(this,\""+rowid+"\",\""+filename+"\",\""+subfix+"\")'></a><a   class='b-in-blk img-ico ic-chname-failure' onclick='cancelEdit();'></a></form>");
			//让header上的图标处于不可使用的状态
			$(".hba_buttons").hide();
			//阻止input冒泡
			$('#folderGeneratorHandler').click(function(e){
				e.stopPropagation();
			});
		}
		
}

//取消分享
function cancelShare(sourceIds){
	//请求数据
		$.ajax({
			type : "POST",
			async:true,
			url: './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_cancelsharedirorfile&t=' + Math.random(),
			data :{"sourceIds":sourceIds},
			dataType:'json',
			success : function(response){
				var msg = response.msg;
				if (response.result!='ok') {
					$.simpleAlert(msg,'warning',2000,{model:true});
					return false;
				}else{
					$.simpleAlert(取消分享成功, 'ok', 2000, {model: true});
					//刷新列表
					var dirId = $('#currentDirId').val();
					if(dirId !=''){ openDir(dirId); }else{ changeNav(current_nav); }
				}
			}
		});
}

//执行分享方法  发送分享请求数据
function doShareFun(useridsstr,sourceIds){
			$.ajax({
			type : "POST",
			async:true,
				url: './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_sharedirorfile&t=' + Math.random(),
			data :{"sourceIds":sourceIds,"userids":useridsstr},
			dataType:'json',
			success : function(response){
				var msg = response.msg;
				if (response.result!='ok') {
					$.simpleAlert(msg,'warning',2000,{model:true});
					return false;
				}else{
					if(response['data']['sharesuccessmsg']){
						$.simpleAlert(分享成功, 'ok', 2000, {model: true});
					}
				}
			}
		});
		return false;
}

//打开选中用户的用户树窗口    使用AC授权
function openSelectUserDlg(rowids){
	 openShareAC(rowids,'mydriver.actype');
}

//打开AC授权窗口
function openShareAC(resourceId,resourceType){
		var dlg = FrmDialog.open({
			title: 选择分享范围, width: 700, height: 500, url: "./w", id: "shareacid",
		data : {
			sid : sid,
			cmd : "CLIENT_COMMON_AC_ACTION_OPEN",
			resourceId : resourceId,
			resourceType : resourceType
		},
		buttons : [{
			text: 添加,
			cls : "blue",
			handler : function() {
				var selectList = dlg.win().tree.getCheckedNodes();
				dlg.win().saveAC();
				if(selectList.length!=0){
					doShareFun("",resourceId);
					getFileShareAcData(resourceId);
				}
			}
		}, {
			text: 关闭,
			handler : function() {
				getFileShareAcData(resourceId);
				dlg.close();
			}
		}]

	});
}


//打开移动文件窗口
function openMoveFileDlg(rowids,rowfiletype,pid,isent){
	var url = encodeURI( "./w?sid=" + sid + "&cmd=com.actionsoft.apps.mydriver_getfoldertreepage");
    var dlg=FrmDialog.open({
		width: 500, height: 300, title: 移动到,
		url:url,id:"movedlgid",
		buttons:[
			{
				text: 确定, cls: "blue", handler: function () {
			moveFolder(rowids,rowfiletype,pid,dlg,isent);
		}},
			{
				text: 取消, handler: function () {
					dlg.close();
				}
			}
	],
		data:{}
	});
}


//选择用户弹出框
function openSelectUserDlgForShare(){
	var url = encodeURI( "./w?sid=" + sid + "&cmd=com.actionsoft.apps.mydriver_getusertreepage");
	var dlg=FrmDialog.open({
		width: 500, height: 400, title: 选择用户,
		url:url, id:"selectuserdlgid",
		buttons:[
			{
				text: 确定, cls: "blue", handler: function () {
			var childwin = dlg.win();
					var selectedId = childwin.selectedNode.id;
					var selectedUID = childwin.selectedNode.uid;
					var selectedUserName = childwin.selectedNode.name;
					var selectedNodeType = childwin.selectedNode.nodetype;
		    if(selectedNodeType!="1"){
				$.simpleAlert(请选择用户, 'warning', 2000, {model: true});
		    }else{
		    	$("#shareowneruid").val(selectedUID);
		    	$("#shareowner").val(selectedUserName);
		    	dlg.close();
		    }
		}},
			{
				text: 取消, handler: function () {
					dlg.close();
				}
			}
		],
		onClose:function(){
			$(".show-search-btn").click();
		},
		data:{}
	});
}


//选择用户弹出框
function openSelectUserDlgForLog(){
	var url = encodeURI( "./w?sid=" + sid + "&cmd=com.actionsoft.apps.mydriver_getusertreepageforlog");
	var dlg=FrmDialog.open({
		width: 500, height: 400, title: 选择用户,
		url:url,id:"selectuserdlgforlogid",
		buttons:[
			{
				text: 确定, cls: "blue", handler: function () {
			var childwin = dlg.win();
				  var selectedId = childwin.selectedNode.id;
				  var selectedUID = childwin.selectedNode.uid;
				  var selectedUserName = childwin.selectedNode.name;
				  var selectedNodeType = childwin.selectedNode.nodetype;
		    if(selectedNodeType!="1"){
				$.simpleAlert(请选择用户, 'warning', 2000, {model: true});
		    }else{
		    	$("#loguserid").val(selectedUID);
		    	dlg.close();
		    }
				}
			}, {
				text: 关闭, handler: function () {
					dlg.close();
				}
			}
		],
		onClose:function(){
			$(".show-search-btn").click();
		},
		data:{}
	});
}
//获取选中的用户id
function getCheckedUserValue() {
		var childwin = FrmDialog.win();
	var selectedId = childwin.selectedNode.id;
	var selectedUID = childwin.selectedNode.uid;
	var selectedUserName = childwin.selectedNode.name;
}

//判断一个对象是不是array
function isArray(obj) {
	return Object.prototype.toString.call(obj) === '[object Array]';
}

//判断是不是文件夹
function isDir(rowfiletype){
	if(rowfiletype=="" || rowfiletype=="f"){
		return true;
	}else{
		return false;
	}
}

//为搜索输入框添加事件
function testEnter() {
    if (event.keyCode == 8) {
		searchFile();
		return false;
	}
}

//别人的分享搜索
function searchShare(){
		var shareowneruid = $.trim($('#shareowneruid').val());
		var shareowner = $.trim($('#shareowner').val());
 
		if(shareowneruid!=""){
			counts = 0;
			curCounts = 0;
			$('.file-list').empty();
			var dirId = current_path['id'];
			loadFileData(current_nav, dirId, shareowneruid);
			showView(vtype);
			$('#shareowneruid').val(shareowneruid);
			$('#shareowner').val(shareowner);
		}
		
		//关闭搜索框
		$("#show-search-popbox").hide();
		$(".awsui-popbox-arrow-inner").hide();
		$(".awsui-popbox-arrow").hide();
		
}

	function cleanShareSearch() {
	  changeNav(current_nav);
	}


function hideRightPanelEle(){
	    //$(".tool-btn-upload").hide();
		//$(".tool-btn-newdir").hide();
		//$(".tool-btn-newfile").hide();
		$(".tool-btn-cleanrecycle").hide();
		$(".tool-btn-restoreall").hide();
//		$(".span_search").hide();
//		$(".span_search_log").hide();
//		$(".log-search").hide();
//		$(".span_search_share").hide();
		$(".bar-view-group").hide();
		$(".switch-share-panel").hide();
		$(".list-info").hide();
		$(".span_dir_path").hide();
		$(".show-cap-btn").hide();
		$(".show-search-btn").hide();
}
//切换左侧导航
function changeNav(navType){
	
	if(navType == NAV_ENTALLFILE || navType.indexOf("ent")!=-1){
		inEntPath=1;
	}else{
		inEntPath=0;
	}
	setActiveNav(navType);
	$('#searchvalue').val("");//清空搜索条件
	$(".right-center-main").empty();
	$(".right-center-main").append("<div class='right-center-content'><ul class='file-list-header'></ul><div class='file-list'></div></div>");
	hideRightPanelEle();
	//渲染右侧工具条&渲染右侧列表标题
	var listHeaderHtml = '';
	if(navType == NAV_MYSHARE){
	   //我的分享
		$(".list-info").show();
		$(".switch-share-panel").show();
		//$(".switch-share-panel-item.select").attr("vtype",1);
        $(".switch-share-panel-item").removeClass("current");
		$(".switch-share-panel-item[vtype='1']").addClass("current");
		current_colModels = awsui.decode('[{"cls":"c1","title":"' + 文件名 + '","name":"filename"},{"cls":"c2","title":"' + 分享人 + '","name":"sourceowner"},{"cls":"c3","title":"' + 分享时间 + '","name":"sharetime"}]');
	}else if(navType == NAV_LINKSHARE){
		//链接分享
		$(".span_dir_path").show();
		$(".list-info").show();
		current_colModels = awsui.decode('[{"cls":"c1","title":"' + 文件名 + '","name":"filename"},{"cls":"c2","title":"' + 分享人 + '","name":"sourceowner"},{"cls":"c3","title":"' + 分享时间 + '","name":"sharetime"}]');
	}else if(navType == NAV_SHAREME){
		//分享给我的
		$(".list-info").show();
		//$(".span_dir_path").show();
//		$(".span_search_share").show();
		$(".show-search-btn").show();
		renderSearchPopboxData("share");
	    $("#shareowneruid").val("");
		$("#shareowner").val("");
		$(".switch-share-panel").show();
		//$(".switch-share-panel-item.select").attr("vtype",0);
        $(".switch-share-panel-item").removeClass("current");
        $(".switch-share-panel-item[vtype='1']").addClass("current");
		current_colModels = awsui.decode('[{"cls":"c1","title":"' + 文件名 + '","name":"filename"},{"cls":"c2","title":"' + 分享人 + '","name":"sourceowner"},{"cls":"c3","title":"' + 分享时间 + '","name":"sharetime"}]');
	}else if(navType == NAV_RECILEBIN){
		//回收站
		$(".tool-btn-cleanrecycle").show();
		$(".tool-btn-restoreall").show();
//		$(".span_search").show();
		$(".show-search-btn").show();
		renderSearchPopboxData("file");
		$(".list-info").show();
		$(".span_dir_path").show();
		current_colModels = awsui.decode('[{"cls":"c1","title":"' + 文件名 + '","name":"filename"},{"cls":"c2","title":"' + 大小 + '","name":"filesize","formatter":"formatSize"},{"cls":"c3","title":"' + 删除时间 + '","name":"createtime"}]');
	}else if(navType == NAV_ALLFILE){
		//个人文件夹 所有文件
		//$(".tool-btn-upload").show();
		//$(".tool-btn-newdir").show();
		//$(".tool-btn-newfile").show();
//		$(".span_search").show();
		$(".show-search-btn").show();
		renderSearchPopboxData("file");
		$(".bar-view-group").show();
		$(".list-info").show();
		
		$(".span_dir_path").show();
		$(".show-cap-btn").show();
		current_colModels = awsui.decode('[{"cls":"c1","title":"' + 文件名 + '","name":"filename"},{"cls":"c42","title":"' + 大小 + '","name":"filesize","formatter":"formatSize"},{"cls":"c43","title":"' + 修改时间 + '","name":"updatetime"},{"cls":"c44","title":"' + 属性 + '","name":"attr"}]');
	}else if(navType == NAV_ENTALLFILE){
		//企业文件夹  所有文件
//		$(".span_search").show();
		$(".show-search-btn").show();
		renderSearchPopboxData("file");
		$(".bar-view-group").show();
		$(".list-info").show();
		$(".span_dir_path").show();
		$(".show-cap-btn").show();
		//是系统管理员或者是网盘管理员
		if((isMyDriverAdmin!=undefined && isMyDriverAdmin=="1") ||(isAdmin!=undefined && isAdmin=="1")){
			//$(".tool-btn-upload").show();
			//$(".tool-btn-newdir").show();
			//$(".tool-btn-newfile").show();
		}
		current_colModels = awsui.decode('[{"cls":"c1","title":"' + 文件名 + '","name":"filename"},{"cls":"c42","title":"' + 大小 + '","name":"filesize","formatter":"formatSize"},{"cls":"c43","title":"' + 修改时间 + '","name":"updatetime"},{"cls":"c44","title":"' + 属性 + '","name":"attr"}]');
	}else if(navType == NAV_MONITOR){
		//网盘监控
		$(".span_dir_path").show();
		current_colModels = "";
	}else if(navType == NAV_LOG){
		//网盘日志
//		$(".span_search_log").show();
//		$(".log-search").show();
		$(".show-search-btn").show();
		renderSearchPopboxData("log");
		$(".span_dir_path").show();
		current_colModels = awsui.decode('[{"cls":"logindex","title":"' + 序号 + '","name":"index"},{"cls":"c1_5","title":"' + 用户 + '","name":"optuser"},{"cls":"c2_5","title":"' + 操作时间 + '","name":"opttime"},{"cls":"c3_5","title":"' + 操作类型 + '","name":"logtype"},{"cls":"c4_5","title":"' + 操作对象 + '","name":"filename",wrap:"false"},{"cls":"c5_5","title":"' + 描述 + '","name":"comment"}]');
	}else if(navType == NAV_ADMINCONFIG){
		//管理员面板
		$(".span_dir_path").show();
	}else if(navType.indexOf("label_")!=-1 ){
		$(".span_dir_path").show();
		current_colModels = awsui.decode('[{"cls":"c1","title":"' + 文件名 + '","name":"filename"},{"cls":"c42","title":"' + 大小 + '","name":"filesize","formatter":"formatSize"},{"cls":"c43","title":"' + 修改时间 + '","name":"updatetime"},{"cls":"c44","title":"' + 属性 + '","name":"attr"}]');
	}else{
		//$(".tool-btn-upload").show();
		//$(".tool-btn-newdir").show();
		//$(".tool-btn-newfile").show();
//		$(".span_search").show();
		$(".show-search-btn").show();
		renderSearchPopboxData("file");
		$(".bar-view-group").show();
		$(".list-info").show();
		$(".span_dir_path").show();
		current_colModels = awsui.decode('[{"cls":"c1","title":"' + 文件名 + '","name":"filename"},{"cls":"c42","title":"' + 大小 + '","name":"filesize","formatter":"formatSize"},{"cls":"c43","title":"' + 修改时间 + '","name":"updatetime"},{"cls":"c44","title":"' + 属性 + '","name":"attr"}]');
	}
	
	$(".bar-view-group-item.select").attr("vtype",currentView);
	counts=0;
	curCounts=0;
	//当点击的导航不是网盘监控的时候
	if(navType == NAV_MONITOR){
		$(".right-center-head").css("height","0px");
		resize();
		windowresize();
		filesize_colModels = awsui.decode('[{"title":"' + 排名 + '","name":"index","cls":"monitor1"},{"title":"' + 部门 + '","name":"orgId","cls":"monitor2"},{"title":"' + 用户名 + '","name":"createuser","cls":"monitor3"},{"title":"' + 文件总大小 + '","name":"filenum","formatter":"formatSize","cls":"monitor4"}]');
		filesize_colModels1 = awsui.decode('[{"title":"' + 排名 + '","name":"index","cls":"monitor1"},{"title":"' + 文件夹名 + '","name":"orgId","cls":"monitor2"},{"title":"' + 用户名 + '","name":"createuser","cls":"monitor3"},{"title":"' + 文件总大小 + '","name":"filenum","formatter":"formatSize","cls":"monitor4"}]');
		current_nav = navType;
		showMonitorView();
	}else if(navType == NAV_LOG){
		$(".right-center-main").empty();
	    $(".right-center-main").append("<div class='right-center-content'><ul class='file-list-header'></ul><div class='file-list'></div> <div id='Pagination' style='padding:3px;display:block;border:1px solid #d0d0d0; height:30px;background:#f0f4f5'></div></div>");
		$(".right-center-head").css("height","40px");
		listHeaderHtml = getListHeaderHtml(current_colModels,navType);
		$(".file-list-header").html(listHeaderHtml);
		current_nav = navType;
		$('#username').val(""); $('#opttype').val(""); $('#begintime').val(""); $('#endtime').val("");//清空搜索条件
		cleanSearch();
	}else if(navType == NAV_ADMINCONFIG){
		$(".right-center-main").empty();
	    $(".right-center-main").append("<div class='right-center-content'></div>");
		current_nav = navType;
		showAdminConifgView();
	}else{
		$(".right-center-head").css("height","40px");
		resize();
		windowresize();
		current_nav = navType;
		loadFileList(navType,'','',0);
		
	}
	
	
	$('#currentDirId').val("");//点击过其他文件夹后如果点击左侧导航树将上传文件使用的dirid清空，防止上传路径有误
	chargeAllNewBtnVisible();
	if( current_nav==NAV_RECILEBIN || current_nav==NAV_MONITOR  ||  current_nav==NAV_ADMINCONFIG  ||  current_nav==NAV_SHAREME  ||   current_nav==NAV_MYSHARE  ||  current_nav==NAV_LINKSHARE  ||  current_nav==NAV_LOG){
    	setNewBtnUnVisible();
    }
	
	//切换分类的时候文件filter过滤
	//changeUpfileFilter(navType);
	
	//总容量判断
	chargeDriverCapacity();
	//个人容量显示
    renderUserCapacity();
}

//切换文件上传filger
function changeUpfileFilter(navType){
	var nofilter;
	var oldid=$(".upfile-cat").attr("id");
	var strs="";
	if(currentfilecat!=undefined){
		var catarr= currentfilecat.split(",");
		if(catarr.length>0){
			for (var i=0; i < catarr.length; i++) {
			      strs+= "*."+catarr[i]+";";
			};
		}
	}
	 //更改不同导航中上传的filter
	 $("#"+oldid).unbind("click");//取消绑定上传事件
	if(navType=="allfile" || navType=="entallfile"){
	    $(".upfile-cat").attr("id","upfile-allfile");
	    currentcat="allfile";
	    upfileFun("allfile",nofilter);
	} else if(navType=="图片" || navType=="ent_图片"){
		 nofilter = [["Images ("+strs+")",strs]];
		 $(".upfile-cat").attr("id","upfile-picture");
		 currentcat="picture";
	     upfileFun("picture",nofilter);
	}else if(navType=="文档" || navType=="ent_文档"){
		$(".upfile-cat").attr("id","upfile-document");
		   nofilter = [["Document ("+strs+")",strs]];
		   currentcat="document";
	       upfileFun("document",nofilter);
	}else if(navType=="音频" || navType=="ent_音频"){
		$(".upfile-cat").attr("id","upfile-audio");
		   nofilter = [["Audio ("+strs+")",strs]];
		   currentcat="audio";
		   upfileFun("audio",nofilter);
	      // $("#upfile-audio" ).bind("click", function() {  upfileFun("audio",nofilter);});
	}else if(navType=="视频" || navType=="ent_视频"){
		$(".upfile-cat").attr("id","upfile-vedio");
		  nofilter = [["Vedio ("+strs+")",strs]];
		  currentcat="vedio";
	      upfileFun("vedio",nofilter);
	} else{
	    $(".upfile-cat").attr("id","upfile-otherfile");
		 currentcat="otherfile";
	     upfileFun("otherfile",nofilter);
	}
	
}
//获取面包屑html
//如果打开的处理全部之外超过五级，中间使用省略号，每级的字数也要固定超过。。。
function getLinkNav(navType,pathArr){
	/*
	if (navType == "allfile") navType = selffiletitlei18n;
	if (navType == "otherfile") navType = 其他;
	if (navType == "entallfile") navType = entfiletitlei18n;
	if (navType == "entotherfile") navType = 其他;
	*/
	if(navType=="entallfile"){
		navType = entfiletitlei18n;
	}else if(navType=="entotherfile"){
		navType = 其他;
	} else if (navType.startWith("ent") && (navType != "entallfile" || navType != "entotherfile")) {
		navType = navType.substring(4);
		navType = $(".todo-navigate-group-item[name=" + navType + "]").attr("i18nname");
	} else if (navType.indexOf("label_") != -1) {
		navType=navType.substring(6);
	} else if (navType == "recycle") {
		navType = 回收站 + "（*" + 回收站不占用盘空间 + "）";
	} else if (navType == "myshare") {
		navType = 我的分享;
	} else if (navType == "shareme") {
		navType = 别人的分享;
	} else if (navType == "linkshare") {
		navType = 链接分享 + "(*" + 超过有效期一个月的链接将被系统自动清除 + ")";
	} else if (navType == "log") {
		navType = 网盘日志;
	}
	else if (navType == "monitor") {
		navType = 容量统计;
	} else if (navType == "adminconfig") {
		navType = 管理员设置;
	} else {
		navType = $(".todo-navigate-group-item[name=" + navType + "]").attr("i18nname");
	}
	var pathHtml = '';
	if(pathArr.length > 0){
		pathHtml = '<a class="access" onclick="openDir(\'\');" no="">'+navType+'</a>';
	}else{
		pathHtml = '<a no="">' + navType + '</a>';
		pathHtml += '&nbsp;';
	}
	
	 if(pathArr.length>5){
	 	pathHtml = pathHtml+"&gt;...";
	 }
	 
	 var rightTopWidth=$("#todo-layout").width()-200;
	 var pathWidth=rightTopWidth-160;
	    if(pathArr.length>5){
	    	var alllength=pathArr.length;
				for(var i = alllength-5;i < pathArr.length; i++){
					var path = pathArr[i];
					var pathname=path['name'];
					/*
					var strLength=getStrLength(pathname);
				    if(strLength>8){
				    	pathname=cutStr(pathname,8);
				    }
					*/
					if(i == pathArr.length - 1){
				     	pathHtml += '&gt;<a no="'+path['id']+'"  awsui-qtip="'+path['name']+'" >'+pathname+'</a>';
					}else{
						pathHtml += '&gt;<a class="access" onclick="openDir(\''+path['id']+'\');" no="'+path['id']+'"   awsui-qtip="'+path['name']+'" >'+pathname+'</a>';
					}
				}
	
			
		}else{
				for(var i = 0;i < pathArr.length; i++){
					var path = pathArr[i];
					var pathname=path['name'];
					/*
					var strLength=getStrLength(pathname);
				    if(strLength>8){
				    	pathname=cutStr(pathname,8);
				    }
					*/
					if(i == pathArr.length - 1){
				     	pathHtml += '&gt;<a no="'+path['id']+'"   awsui-qtip="'+path['name']+'" >'+pathname+'</a>';
					}else{
						pathHtml += '&gt;<a class="access" onclick="openDir(\''+path['id']+'\');" no="'+path['id']+'"   awsui-qtip="'+path['name']+'" >'+pathname+'</a>';
					}
				}
		}
    $("#link_path").empty();
	$("#link_path").append(pathHtml);
	var linkPathWidth=$("#link_path").width();
	var eachLinkWidth=pathWidth/$("#link_path").find("a").length-15;
	if(pathWidth<linkPathWidth){
		$("#link_path").find("a").css("max-width",eachLinkWidth+"px");
	}
	return pathHtml;
}

//获取列表标题列
function getListHeaderHtml(current_colModels,navType,ordercol,ordertype) {
		var headerHtml = '';
		for (var i = 0; i < current_colModels.length; i++) {
			var col = current_colModels[i];
			headerHtml += '<li class="col ' + col["cls"] + '"   ><div class="lh40">';
			if (navType == NAV_LOG) {
				headerHtml += '<span >' + col["title"] + '</span></div></li>';
			} else {
				if (i == 0) {
					headerHtml += '<span style="display:inline-block;width:40px;text-align:center;border-right:0px solid #e5e5e5;margin-right:5px;">' + 序号 + '</span><input class="input-chkall" id="chkall" value="0" type="checkbox">';
				}
				
				if(col.name==ordercol  && ordertype=="desc"){
				   headerHtml += '<span class="name" onclick="sortFile(\'' + col.name + '\',this);" ordertype="'+ordertype+'">' + col["title"] + '<span  class="title-arrow-img-down"></span></span></div></li>';
				}else if(col.name==ordercol  && ordertype=="asc"){
				   headerHtml += '<span class="name" onclick="sortFile(\'' + col.name + '\',this);" ordertype="'+ordertype+'">' + col["title"] + '<span  class="title-arrow-img-up"></span></span></div></li>';
				}else{
				   headerHtml += '<span class="name" onclick="sortFile(\'' + col.name + '\',this);" ordertype="'+ordertype+'">' + col["title"] + '</span></div></li>';
				}
			}
		}
		return headerHtml;
	}
	
//缩略图标题列
function getIconHeaderHtml(current_colModels) {
	    var headerHtml = '';
		   headerHtml +='<li style="width:100%"><div class="lh40"><span style="display:inline-block;width:40px;text-align:center;margin-right:5px;"></span><input class="input-chkall" id="chkall" value="0" type="checkbox" style="margin-top:0px;vertical-align: middle;"> </div></li>';
		return headerHtml;
}
//计算列表区高度
function resize(){
	var win_h = $(window).height();
	//var list_y = $('.file-list').offset().top;
	var list_y =113;
	$(".file-list").css("height",(win_h-list_y)+"px");
}
//计算列表区高度  网盘日志单独
function resize1(){
	var win_h = $(window).height();
	var list_y = $('.file-list').offset().top;
	$(".file-list").css("height",(win_h-list_y-30)+"px");
}
function resizeRightWidth(){
}

//列表页windowresize
function windowresize(){
	var width = $(".file-list").width()*0.6-99;
	$(".filetitle").css("width",width);
}

function showFileTree(){
var url = encodeURI( "./w?sid=" + sid + "&cmd=com.actionsoft.apps.mydriver_getfiletreepage");
    var dlg=FrmDialog.open({
		width: 450, height: 400, title: 选择文件,
		url:url,
		id:"movedlgid",
		buttons:[
			{
				text: 确定, cls: "blue", handler: function () {
			 
		}},
			{
				text: 取消, handler: function () {
					dlg.close();
				}
			}
	],
		data:{}
	});
	
}

function openShareFileLayer(fileid){
	 renderModuleTree(fileid);
	//选择
	$("#module-tree-dlg").dialog({
		title: 查看分享,
		model:true,draggable:false,width:700,height:450,
		buttons:[{
			text: 关闭, handler: function () {
				$("#module-tree-dlg").dialog("close");
			}}
		]
	});
}


var siteTree="";
var selectedNode;
var bulidFolderId="";
function renderModuleTree(folderid){
	bulidFolderId=folderid;
	$("#module-tree-dlg").empty();
	$("#module-tree-dlg").append('<div id="module-tree-dlg-content" style="padding-top:10px;height:350px;overflow:auto;"><div id="module-tree"></div></div>');
	$("#module-tree").empty();
	var sid=$('#sid').val();
	var dataUrl= './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_getsharefiletreejson&t='+Math.random();
	var setting = {
		showIcon:true,
		dblClickToExpand:true,
		animate:true,
		remember:true,
		autoHeight:true,
		event:{
			beforeExpand: buildChildNode,
			onClick: selectNode
		},
		dataModel:{
			url:dataUrl,
			method:"POST",
			dataType:"text",
			params:{
				folderId:folderid,
				pid:""
			}
		}
	};
	
	siteTree=awsui.tree.init($("#module-tree"), setting);
}
 
 
	
function selectNode(treeNode){
	selectedNode = treeNode;
}

function buildChildNode(treeNode){
 
	var dataUrl = './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_getsharefiletreejson';
	var dataModel = {
		url:dataUrl,
		method:"POST",
		dataType:"text",
		params:{
			folderId:bulidFolderId,
			pid: treeNode.id
		}
	};
	if(treeNode.open != null){
		var result = siteTree.getData(dataModel);
		siteTree.buildChilren(result, treeNode);
	}
	registerEvent();
}


function registerEvent(){
	    $("#module-tree").css("width","100%");
	    $("#module-tree").css("height","100%");
		
	var treeWidth=$("#module-tree").width();
	$(".tree-items").each(function(i,ele){
		var fileId = $(ele).attr('tbindex');
		var rowname = $(ele).find('.txt-text').html();
		var nodetype = $(ele).find('.txt-text').attr("nodetype");
		var format = $(ele).find('.txt-text').attr("format");
		var canPreviewFlag = $(ele).find('.txt-text').attr("canPreviewFlag");
		var canDownloadFlag = $(ele).find('.txt-text').attr("canDownloadFlag");
		
	    var myObj= $(ele).find('.txt-text').offset();
	    var mytextWidth=$(ele).find('.txt-text').width();
	    //var offetLeft = myObj.left;
	    //var myWidth=treeWidth - offetLeft;
	    $("#module-tree").css("overflow","scroll");
		if(canDownloadFlag!=undefined && canDownloadFlag=="0"){
			$(ele).find('.txt-op').off("click").on('click',function(){
				if (nodetype=="2") {
					mutifiledownloadForDir(fileId,rowname);
				} else {
					singledownload(fileId);
					return false;
				}
				return false;
			});
		}
	});
 
	$("#module-tree").find(".txt-1").off('click').on('click',function(e){
		var nodetype = $(this).parent().attr("nodetype");
		if (nodetype=="1") {
			var rowname = $(this).parent().html();
			var fileId = $(this).parent().attr("fileId");
			var format = $(this).parent().attr("format");
			var canPreviewFlag = $(this).parent().attr("canPreviewFlag");
			var downloadurl = $(this).parent().attr("downloadurl");
			var canDownloadFlag = $(this).parent().attr("canDownloadFlag");
		
			 var picType="bmp,jpg,jpeg,tif,tiff,gif,png,ico";
			 if( picType.indexOf(format.toLowerCase())!=-1){
			   showFullScreenPanel(fileId);
			   return false;
		     }else{
		    	showFullScreenPanel(fileId);
		     }
		}
	 });
	 
}

function showdownbtn(obj){
	 $(obj).next().css("display","inline-block");
}

function hidedownbtn(obj){
	$(obj).next().css("display","none");
	
}



/*
function openShareFileLayer(fileid){
	$("#sharefolderid").val(fileid);
	var url = encodeURI( "./w?sid=" + sid + "&cmd=com.actionsoft.apps.mydriver_getsharefiletreepage");
    var dlg=FrmDialog.open({
		width:680,height:500,
		title:"查看分享",
		url:url,
		id:"movedlgid",
		buttons:[ {text:'关闭',handler:function(){ dlg.close(); }}
	],
		data:{}
	});
    
    $("#id-awsui-win-frm-2013movedlgid").css("z-index","400");
}
*/

function openShareFullScreen(fileId){
	showFullScreenPanel(fileId);
    
}

