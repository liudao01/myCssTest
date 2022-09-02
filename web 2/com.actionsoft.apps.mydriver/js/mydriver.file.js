var defautltReplyPageSize=20;
var replyList;
var replyCounts=0;
var replyCurCounts=0;
var replyCurrentLen=0;
var replyMore;


var previewFlagSw;
var fileFlagSw;
var canPreviewFlagSw;
var canDownloadFlagSw;
var outerlinkFlagSw;
var showpbFlagSw;
var remindFlagSw;
var remindFlagSwExt;

function createMarkDownFile(){
	var url = encodeURI( "./w?sid=" + sid + "&cmd=com.actionsoft.apps.mydriver_loadmarkdownpage");
	var win_h = $(window).height()-100;
	var win_w = $(window).width()-200;
	var dlg=FrmDialog.open({
		width: win_w, height: win_h, title: 新建文件, url: url, id: "loadmarkdowndlgid",
		url:url,id:"loadmarkdowndlgid",
		buttons:[
			{
				text: 确定, cls: "blue", handler: function () {
			    //点击确定进行处理
			    var childwin = dlg.win();
			    var fileName=childwin.mdFileName.value;
			    if(fileName==""){
					$.simpleAlert(请输入文件标题, "info");
			    	return false;
			    }
		        var fileContent=childwin.testEditor.getMarkdown();       // 获取 Markdown 源码
                //var val2=childwin.testEditor.getHTML();           // 获取 Textarea 保存的 HTML 源码
                //var val3=childwin.testEditor.getPreviewedHTML();  
		        if(fileContent==""){
					$.simpleAlert(请填写文件内容, "info");
			    	return false;
			    }
		        saveMarkDownFile(fileName,fileContent,inEntPath);
					dlg.close();
				}
			}, {
				text: 关闭, handler: function () {
					dlg.close();
				}
			}
		],
		data:{},
		onClose:function(){ 
			//在关闭对话框的时候将新建的层隐藏
			if($(".all-new-panel-cls").is(":visible") == true){
				  $(".all-new-panel-cls").hide();
			}
	    }
        
	});
	$(".awsui-dialog .dlg-content").css("margin","0px");
	$(".awsui-dialog .dlg-content").css("border","none");
	$(".awsui-dialog .dlg-title").css("display","none");
	
	
}


function toUpdateMarkDownFile(fileId){
	var url = './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_getfilebyid';
	var params={
		fileId:fileId
	};
	awsui.ajax.post(url, params, function(responseObject) {
		if(responseObject['result'] == 'ok'){
			var fileName=responseObject["data"]["fileInfo"]["filename"];
			var fileContent=responseObject["data"]["fileInfo"]["fileContent"];
			showUpdateFileDlg(fileId,fileName,fileContent);
		}else{
			$.simpleAlert(responseObject['msg'], responseObject['result']);
		}
	}, 'json');
	return false;
	
}

//执行分享方法  发送分享请求数据
function createLinkShare(sourceIds){
	var url = './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_share_file_bylink';
	var params={
		sourceIds:sourceIds
	};
	awsui.ajax.post(url, params, function(responseObject) {
		if(responseObject['result'] == 'ok'){
			$.simpleAlert(分享成功, 'ok', 2000, {model: true});
			 $("#sharereturninfo").empty();
			 var shareId=responseObject['data']["shareId"];
			 var sharePwd=responseObject['data']["sharePwd"];
			 var sharePwd=responseObject['data']["sharePwd"];
			 var shareLink=responseObject['data']["shareLink"];
			 var deadLine=responseObject['data']["deadLine"];
			 var remindFlag=responseObject['data']["remindFlag"];
			// var QrCodeUrl=responseObject['data']["QrCodeUrl"];
			 
			 var sharestr="<input type='hidden'   value='"+shareId+"' id='shareid'/>";
			sharestr += "<input type='hidden' value='" + shareLink + " " + 提取密码 + "：" + sharePwd + "'   id='shareurlandpwd'/>";
			sharestr += "<table class='create-share-table'>";
			sharestr += "<tr><td width='100' class='linksharefirsttd'>" + 提取密码 + "：</td><td><input type='text' readonly value='" + sharePwd + "' class='share-return-txt'/></td></tr>";
			sharestr += "<tr><td class='linksharefirsttd'>" + 文件链接 + "：</td><td><input type='text' readonly value='" + shareLink + "' class='share-return-txt' id='shareurltxtcontent' style='width:430px;'/></td></tr>";
			sharestr += "<tr><td colspan='2'><span class='button green' id='copyBtn'  style='padding:6px 30px;' data-clipboard-target='shareurlandpwd' >" + 复制链接 + "</span></td></tr>";
			sharestr += "<tr><td class='linksharefirsttd'>" + 有效日期 + "：</td><td><input type='text' value='" + deadLine + "' class='share-return-txt'  id='share-deadline' style='width:430px;'/></td></tr>";
			sharestr += "<tr><td class='linksharefirsttd'>" + 发送通知给我 + "：</td><td><input type='checkbox' class='js-switch' id='remindflag' name='remindflag' checked value='0'/></td></tr>";
			 sharestr+="</table>";
	
			var linkShareStr="";
			linkShareStr+="";
			linkShareStr+="";
			linkShareStr+='<div id="easy-outer-nav-link" class="easy-outer-nav-link">';
			linkShareStr+='         <ul id="easy-tab-nav-link"  class="easy-tab-nav-link">';
			linkShareStr += '            <li class="current">' + 链接分享 + '</li>';
			linkShareStr += '            <li>' + 二维码 + '</li>';
			if(mailcanuseflag=="1"){
				linkShareStr += '            <li>' + 邮件 + '</li>';
			}
			linkShareStr+='         </ul>';
			linkShareStr+='         <div id="easy-content-nav-link" class="easy-content-nav-link">';
			linkShareStr+='	         <div style="display:block;" class="nav-config-panel" id="linkSharePanel">';
			linkShareStr+=sharestr;
			linkShareStr+='	         </div> ';
			linkShareStr+='	         <div class="nav-config-panel" id="qrCodePanel" style="text-align:center;"><div class="share-link-url-qrcode"></div></div> ';
			if(mailcanuseflag=="1"){
			linkShareStr+='		     <div class="nav-config-panel" id="mailInfo">';
				linkShareStr += '		      <h3 style="height:40px;line-height:40px;"><font>' + 输入邮箱进行共享 + '</font></h3>';
				linkShareStr += '		         <input type="text" value="" placeholder="example@actionsoft.com.cn ' + 多个账号用分号隔开 + '" class="awsui-textbox" id="emailAddressInput"/>';
				linkShareStr += '		         <span class="button blue sendMailBtn" >' + 发送 + '</span>';
			linkShareStr+='		     </div>';
			}
			linkShareStr+='       </div>';
			linkShareStr+=' </div>';
		   $("#sharereturninfo").append(linkShareStr);
		   easyTabInit("easy-tab-nav-link","easy-content-nav-link");
		   var qrCodeOption = {
			   render : "canvas",    //设置渲染方式
			   text : shareLink,    //扫描二维码后显示的内容,可以直接填一个网址，扫描二维码后自动跳向该链接
			   width : 160,               //二维码的宽度,string/number
			   height : 160              //二维码的高度，string/number
		   };
			$(".share-link-url-qrcode").qrcode(qrCodeOption);
			if (language == "en") {
				$(".create-share-table").find(".linksharefirsttd").attr("width", "200");
			}
			
			$(".sendMailBtn").off('click').on('click',function(){
				 var mailAddress=$("#emailAddressInput").val();
				 sendMail(mailAddress,shareId);
			});
		   $("#emailAddressInput").keydown(function(e) {
				var eCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
				if (eCode == 13) {
				    var mailAddress=$("#emailAddressInput").val();
					sendMail(mailAddress,shareId);
				}
			});
		   //是否发送访问提醒
			var preopt = {ontext: 发送, offtext: 不发送, swwidth: 150, swheight: 20, fontSize: 13};
		    remindFlagSw = $('#remindflag').switchButton(preopt); 
			$("#remindflag").val(remindFlag);
			if(remindFlag=="0"){
			 	//允许提醒
				remindFlagSw.changeStatus(true);
		  	    $('#remindflag').attr("checked",'checked');
			}else{
				remindFlagSw.changeStatus(false);
				$('#remindflag').removeAttr("checked"); 
			}
			
			$("input[name='remindflag']").on("change",function(){
				       var deadline = $("#share-deadline").val();
					   var remindFlag=$("#remindflag").prop("checked");
					   updateShareInfo(shareId,deadline,remindFlag);
			});
		   
		   //处理复制
		  if(myBrowser()=="IE"){
		  	$("#copyBtn").click(function(){
		  	  var t=document.getElementById("shareurlandpwd"); 
              t.select(); 
		  	  window.clipboardData.setData('text',t.createTextRange().text);
				$.simpleAlert(复制成功, 'ok');
		  	});
		  } else{
		   var clip = new ZeroClipboard($('#copyBtn'));
	       clip.setText($("#shareurlandpwd").val());
	       clip.on("copy", function(e){
			   $.simpleAlert(复制成功, 'ok');
			});
	       
	       $("#copyBtn").click(function(){
	    	   clip.on('error', function (event) {
				   $.simpleAlert(您的浏览器无法复制该链接请手动复制, 'warning');
					ZeroClipboard.destroy();
			  });  
		   });
		  }
			var langStr = "zh-cn";
			if (language == "cn") {
				langStr = "zh-cn";
			} else if (language == "big5") {
				langStr = "zh-tw";
			} else if (language == "en") {
				langStr = "en";
			} else {
				langStr = "zh-cn";
			}
			$("#share-deadline").off('click').on('click', function () {
				//渲染截止日期
				WdatePicker({
					el: 'share-deadline',
					lang: langStr,
					isShowClear: false,
					readOnly: true,
					dateFmt: "yyyy-MM-dd",
					onpicked: function (dp) {
						var deadline = dp.cal.getDateStr("yyyy-MM-dd");
						var remindFlag = $("#remindflag").prop("checked");
						updateShareInfo(shareId, deadline, remindFlag);
					},
					skin: 'twoer'
				});
			});
    
	      
		}else{
			$.simpleAlert(responseObject['msg'], responseObject['result']);
		}
	}, 'json');
	return false;
}

function updateShareInfo(shareId,deadline,remindFlag,listFlag,fileId){
	if(remindFlag){
		remindFlag="0";
    }else{
    	remindFlag="1";
    }
    var url = './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_update_share_info';
	var params={
		shareId:shareId,
		deadline:deadline,
		remindFlag:remindFlag
	};
	awsui.ajax.post(url, params, function(responseObject) {
		if(responseObject['result'] == 'ok'){
			$.simpleAlert(修改成功, 'ok', 2000, {model: true});
			if(listFlag!=undefined && listFlag=="1"){
				getFileSharelinkMsg(fileId);
			}
		}else{
			$.simpleAlert(responseObject['msg'], responseObject['result']);
		}
	}, 'json');
	return false;
	
}

function toHistoryFile(historyId){
		var readOnly="1";
		var params={
		    historyId:historyId	
		};
		var win_h = $(window).height()-100;
		var win_w = $(window).width()-200;
		var url = encodeURI( "./w?sid=" + sid + "&cmd=com.actionsoft.apps.mydriver_gethistoryfilebyid");
		var dlg=FrmDialog.open({
			width: win_w, height: win_h, title: 查看文件, url: url, id: "loadmarkdowndlgid",
			url:url,id:"loadmarkdowndlgid",
			buttons:[
				{
					text: 关闭, handler: function () {
						dlg.close();
					}
				}
			],
			data:params,
			onClose:function(){
				$(".awsui-dialog .dlg-content").css("margin-top","20px");
				$(".awsui-dialog .dlg-content").css("border","1px solid #D9D9D9");
				$(".awsui-dialog .dlg-title").css("display","block");
			}
		});
		$(".awsui-dialog .dlg-content").css("margin","0px");
		$(".awsui-dialog .dlg-content").css("border","none");
		$(".awsui-dialog .dlg-title").css("display","none");
	
}

function toPreviewMarkDownFile(fileId){
	var url = './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_getfilebyid';
	var params={
		fileId:fileId
	};
	awsui.ajax.post(url, params, function(responseObject) {
		if(responseObject['result'] == 'ok'){
			var fileName=responseObject["data"]["fileInfo"]["filename"];
			var fileContent=responseObject["data"]["fileInfo"]["fileContent"];
			showPreviewFileDlg(fileId,fileName,fileContent);
		}else{
			$.simpleAlert(responseObject['msg'], responseObject['result']);
		}
	}, 'json');
	return false;
	
}

function showUpdateFileDlg(fileId){
	var params={};
	if(fileId!=undefined && fileId!=""){
		params.fileId=fileId;
	}
	var win_h = $(window).height()-100;
	var win_w = $(window).width()-200;
	var url = encodeURI( "./w?sid=" + sid + "&cmd=com.actionsoft.apps.mydriver_loadmarkdownpage");
	var dlg=FrmDialog.open({
		width: win_w, height: win_h, title: 修改文件, url: url, id: "loadmarkdowndlgid",
		url:url,id:"loadmarkdowndlgid",
		buttons:[
			{
				text: 查看历史记录, cls: "red floatleft", handler: function () {
			   openFileHistoryDlg(fileId);  
			   dlg.close();  
		}},
			{
				text: 确定, cls: "blue", handler: function () {
			    //点击确定进行处理
			    var childwin = dlg.win();
			    var fileName=childwin.mdFileName.value;
			     if(fileName==""){
					 $.simpleAlert(请输入文件标题, "info");
			    	return false;
			    }
		        var fileContent=childwin.testEditor.getMarkdown();  
		        if(fileContent==""){
					$.simpleAlert(请填写文件内容, "info");
			    	return false;
			    }
		        // 获取 Markdown 源码
		        updateMarkDownFile(fileId,fileName,fileContent);
		        dlg.close();  
		    
		}},
			{
				text: 关闭, handler: function () {
					dlg.close();
				}
			}
		],
		data:params
        
	});
	$(".awsui-dialog .dlg-content").css("margin","0px");
	$(".awsui-dialog .dlg-content").css("border","none");
	$(".awsui-dialog .dlg-title").css("display","none");
	
	
}


function showPreviewFileDlg(fileId){
	var readOnly="1";
	var params={
		readOnly:readOnly
	};
	if(fileId!=undefined && fileId!=""){
		params.fileId=fileId;
	}
	var win_h = $(window).height()-100;
	var win_w = $(window).width()-200;
	var url = encodeURI( "./w?sid=" + sid + "&cmd=com.actionsoft.apps.mydriver_loadmarkdownpage");
	var dlg=FrmDialog.open({
		width: win_w, height: win_h, title: 查看文件, url: url, id: "loadmarkdowndlgid",
		url:url,id:"loadmarkdowndlgid",
		buttons:[
			{
				text: 关闭, handler: function () {
					dlg.close();
				}
			}
		],
		data:params
	});
	$(".awsui-dialog .dlg-content").css("margin","0px");
	$(".awsui-dialog .dlg-content").css("border","none");
	$(".awsui-dialog .dlg-title").css("display","none");
}

function updateMarkDownFile(fileId,fileName,fileContent){
	var timestr=getTimeStr1();
	fileName=fileName+".md";
	if(!fileContent){
		$.simpleAlert('[' + 内容 + ']' + 不允许为空, "info", 2000);
		return false;
	}
	var params = {
		fileId:fileId,
		fileName:fileName,
		timestr:timestr,
		fileContent:fileContent
	};
	var url = './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_updatefile';
	awsui.ajax.post(url, params, function(responseObject) {
		if(responseObject['result'] == 'ok'){
			$.simpleAlert(修改成功, 'ok', 2000, {model: true});
			  //刷新列表
			  var dirId = $('#currentDirId').val();
			  openDir(dirId);
		}else{
			$.simpleAlert(responseObject['msg'], responseObject['result']);
		}
	}, 'json');
	return false;
}

function saveMarkDownFile(fileName,fileContent,inEntPath){
	var timestr=getTimeStr1();
	fileName=fileName+".md";
	if(!fileContent){
		$.simpleAlert('[内容]不允许为空', "info", 2000); 
		return false;
	}
	var dirId = $('#currentDirId').val();
	var params = {
		pid:dirId,
		fileName:fileName,
		timestr:timestr,
		fileContent:fileContent,
		isEnt:inEntPath
	};
	var url = './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_createfile';
	awsui.ajax.post(url, params, function(responseObject) {
		if(responseObject['result'] == 'ok'){
			$.simpleAlert(创建成功, 'ok', 2000, {model: true});
			  //刷新列表
			  var dirId = $('#currentDirId').val();
			  openDir(dirId);
		}else{
			$.simpleAlert(responseObject['msg'], responseObject['result']);
		}
	}, 'json');
	return false;
}
function renderMDEditor(){
	testEditor = editormd("test-editormd", {
        width   : "95%",
        height  : 640,
        syncScrolling : "single",
        toolbarIcons :'simple',
        emoji: true,
        path:"",
       // path    : "../apps/com.actionsoft.apps.mydriver/lib/editormd/lib/",
        pluginPath :"../apps/com.actionsoft.apps.mydriver/lib/editormd/plugins/"
    });
}





function openFileHistoryDlg(fileId){
	getFileHistoryMsg(fileId);
	$("#msg-history-dlg").dialog({
		title: 历史修改记录,
		model:true,draggable:true,width:700,height:450,
		buttons:[
			{
				text: 返回编辑页, cls: "blue", handler: function () {
				$("#msg-history-dlg").dialog("close");
				toUpdateMarkDownFile(fileId);
			}},{
				text: 关闭, handler: function () {
				$("#msg-history-dlg").dialog("close");
			}}
		]
	});
}

function getFileHistoryMsg(fileId){
	 var url = './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_get_file_history_data';
	awsui.ajax.post(url, {fileId:fileId}, function(responseObject) {
		if(responseObject['result'] == 'ok'){
			  historyList = responseObject["data"]['historyList'];
			  showFileHistoryView(historyList);
		}else{
			$.simpleAlert(responseObject['msg'], responseObject['result']);
		}
	}, 'json');
}

function showFileHistoryView(historyList){
	$("#msg-history-dlg-content").empty();
    $("#msg-history-dlg-content").append("<ul class='historymessage-list-header'></ul><div class='historymessage-list'></div>");
	var headerstr = "<li class='w10'>" + 序号 + "</li><li class='w30'>" + 名称 + "</li><li  class='w20'>" + 修改人 + "</li><li  class='w30'>" + 修改时间 + "</li><li  class='w10'>" + 操作 + "</li>";
	$(".historymessage-list-header").append(headerstr);
    var tablestr="";
    if(historyList.length!=0){
		for(var i = 0;i< historyList.length;i++){
			var messageinfo = historyList[i];
			var fileId=messageinfo["sourceId"];
			var historyId=messageinfo["id"];
			
			tablestr += '<ul  class="historymessage-list-row">';
			tablestr += '<li  class="w10">'+(i+1)+'</li>';
			tablestr += '<li  class="w30 leftalign">'+messageinfo["fileName"]+'</li>';
			tablestr += '<li  class="w20 centeralign">'+messageinfo["createUserName"]+'</li>';
			tablestr += '<li  class="w30 centeralign">'+messageinfo["createTime"]+'</li>';
			tablestr += '<li  class="w10 centeralign">';
			tablestr += '&nbsp;<a  href="javascript:void(0);" style="color:blue;" onclick=toHistoryFile("' + historyId + '")>' + 查看 + '</a>';
			tablestr += '</li>';
			tablestr += '</ul>';		
		}
	}else{
		tablestr += '<div class="apps-no-record"><span>' + 序号 + '</span></div>';
	}
	$(".historymessage-list").append(tablestr);
	 
	var h1=$("#msg-history-dlg-content").height();
	$(".historymessage-list").css("height","295px");
}




//显示修改文件的对话框
function openSelectShareDlg(fileId,fileName){
	renderSelectShareForm(fileId,fileName);
	$("#select-share-dlg").dialog({
		title: 文件分享,
		model:true,
		draggable:true,
		width:600,
		height:450,
		buttons: [
			{
				text: 关闭, handler: function () {
				$("#select-share-dlg").dialog("close");
			}}
		],
	   onClose:function(){
		  //获取分享状态并渲染标识
		   var params={
				   fileId:fileId
				};
				var url = './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_get_share_flag';
				awsui.ajax.post(url, params, function(responseObject) {
					if(responseObject['result'] == 'ok'){
						var shareflag=responseObject["data"]["shareflag"];
						if(shareflag){
							if(currentView==VIEW_TYPE_LIST && current_nav!=NAV_MYSHARE){
								  //list
								  var thisObj=$(".file-list").find(".file-list-row[rowid="+fileId+"]");
								  if($(thisObj).find(".c1").find(".triangle-topleft")>0){
									  $(thisObj).find(".c1").find(".triangle-topleft").remove();
								  }else{
									  $(thisObj).find(".c1").append("<div class='triangle-topleft'></div>");
									  $(thisObj).find(".c1").find(".lh40").css("float","left");
								  }
								}
								if(currentView==VIEW_TYPE_ICON){
								 //平铺
								 /* 
								  var thisObj=$(".file-list").find(".v_item[rowid="+fileId+"]");
								  $(thisObj).find(".v_item-top").attr("canpreviewflag",canPreviewFlag);
								  $(thisObj).find(".v_item-top").attr("candownloadflag",canDownloadFlag);
								  */
								}
						}else{
							
						}
						 
					}else{
						$.simpleAlert(responseObject['msg'], responseObject['result']);
					}
				}, 'json');
							
		},
	});
    $(".awsui-dialog .dlg-content").css("margin","0px");
	$(".awsui-dialog .dlg-content").css("border","none");
	$(".awsui-dialog .dlg-title").css("display","none");
	
	return false;
}


function renderSelectShareForm(fileId,fileName){
	var mdFileFlag=endWidthStr(fileName,".md");
	$("#select-share-dlg-content").empty();
	var navTabStr="";
	navTabStr+='<div id="easy-outer-nav" class="easy-outer-nav">';
	navTabStr+='         <ul id="easy-tab-nav"  class="easy-tab-nav">';
	navTabStr += '            <li class="current"><span class="sharetopeople-nav-icon"></span><span  class="nav-title-text">' + 分享给同事 + '</span></li>';
	if(networkcanuseflag=="1"  && !mdFileFlag){
		navTabStr += '            <li><span class="sharetonetwork-nav-icon"></span><span  class="nav-title-text">' + 分享到同事圈 + '</span></li>';
	}
	if(outerLinkFlag=="0"){
		navTabStr += '            <li><span class="linkshare-nav-icon"></span><span  class="nav-title-text">' + 公开链接 + '</span></li>';
	}
	navTabStr+='         </ul> ';
	navTabStr+='         <div id="easy-content-nav" class="easy-content-nav">';
	navTabStr += '	         <div style="display:block;" class="nav-config-panel" id="shareToUserPanel"></div> ';
	if(networkcanuseflag=="1" && !mdFileFlag){
		navTabStr += '		     <div class="nav-config-panel" id="memberInfo"></div>';
	}
	if(outerLinkFlag=="0"){
		navTabStr += '		     <div class="nav-config-panel" id="fileInfo" style="height:280px;overflow-y:scroll;overflow-x:hidden;"></div>';
	}
	
	navTabStr+='       </div>';
    navTabStr+=' </div>';
	$("#select-share-dlg-content").append(navTabStr);
	easyTabInit("easy-tab-nav","easy-content-nav");
	
	
	//分享给同事
	$("#shareToUserPanel").empty();
	var contentstr1="";
//	contentstr1+="<h3 style='height:40px;line-height:40px;'><font>按照组织,角色,团队选择分享人</font></h3>";
	contentstr1 += "<span id='sharefiletopeopleac'  style='padding:6px 30px;margin:15px 0px 10px 0px;' class='button blue'>" + 设置btn + "</span>";
	contentstr1+="<div id='ac-panel' class='ac-panel'></div>";
	$("#shareToUserPanel").append(contentstr1);
	$("#sharefiletopeopleac").click(function(){
		 openSelectUserDlg(fileId);
	});
	getFileShareAcData(fileId);
	
	//分享到工作网络
	$("#memberInfo").empty();
	var contentstr1="";
//	contentstr1+="<h3 style='height:40px;line-height:40px;'><font>选择要分享到的工作网络或者小组</font></h3>";
	contentstr1+="";
	contentstr1 += "<span class='button blue' style='padding:6px 30px;margin:15px 0px 10px 0px;'  id='selectnetworkbtn'>" + 设置btn + "</span>";
	contentstr1+="";
	$("#memberInfo").append(contentstr1);
	$("#selectnetworkbtn").click(function(){
		 shareToNetWork(fileId);
	});
	
	
	//链接分享
	$("#fileInfo").empty();
	var contentstr1="";
//	contentstr1+="<h3 style='height:40px;line-height:40px;'><font>创建文件外部访问链接</font></h3>";
	contentstr1+="";
	contentstr1 += "<span class='button blue' style='padding:6px 30px;margin:15px 0px 10px 0px;' id='createshareurl'>" + 创建链接 + "</span>";
	contentstr1+="<span   id='sharereturninfo'></span>";
	$("#fileInfo").append(contentstr1);
	$("#createshareurl").click(function(){
		createLinkShare(fileId);
	});
	
}

//加入收藏
function addFavorite(messageId,rowObj){
	var params={
		dataId:messageId
	};
	var url = './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_addfavorite';
				awsui.ajax.post(url, params, function(responseObject) {
					if(responseObject['result'] == 'ok'){
						$.simpleAlert(收藏成功, 'ok', 2000, {model: true});
						 if(rowObj!=undefined){
						         //修改状态值及描述
								 $(rowObj).attr("favoriteflag","1");
							 $(rowObj).find(".icon-addfavorite-sfile").html('<img width="24" height="24" border="0" src="../apps/com.actionsoft.apps.mydriver/img/icon_mmenu_sc.png"/>' + 取消收藏);
						  }else{
						  	    $(".v_item-top[rowid='"+messageId+"']").attr("favoriteflag","1");
						  	    var memuParent=$(".v_item-top[rowid='"+messageId+"']");
					            $(memuParent).find(".contextMenu").find("li[tit='unfavorite']").show();
					            $(memuParent).find(".contextMenu").find("li[tit='favorite']").hide();
						  }
						 
					}else{
						$.simpleAlert(responseObject['msg'], responseObject['result']);
					}
	}, 'json');
}

//取消收藏
function cancelFavorite(messageId,rowObj){
	var params={
		dataId:messageId
	};
	var url = './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_cancel_favorite';
	awsui.ajax.post(url, params, function(responseObject) {
		if(responseObject['result'] == 'ok'){
			$.simpleAlert(取消收藏成功, 'ok', 2000, {model: true});
			  if(rowObj!=undefined){
			         //修改状态值及描述
					 $(rowObj).attr("favoriteflag","0");
				  $(rowObj).find(".icon-addfavorite-sfile").html('<img width="24" height="24" border="0" src="../apps/com.actionsoft.apps.mydriver/img/icon_mmenu_sc.png"/>' + 收藏);
			  }else{
			  	    $(".v_item-top[rowid='"+messageId+"']").attr("favoriteflag","0");
//		            $("#contextMenu").find("li[tit='unfavorite']").hide();
//	    		 	$("#contextMenu").find("li[tit='favorite']").show();
    		 	    var memuParent=$(".v_item-top[rowid='"+messageId+"']");
		            $(memuParent).find(".contextMenu").find("li[tit='unfavorite']").hide();
		            $(memuParent).find(".contextMenu").find("li[tit='favorite']").show();
			  }
			 
		}else{
			$.simpleAlert(responseObject['msg'], responseObject['result']);
		}
	}, 'json');
}

//显示修改文件的对话框
function openFileModifyDlg(fileId){
	var url = './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_getfilebyid';
	var params={
		fileId:fileId
	};
	awsui.ajax.post(url, params, function(responseObject) {
		if(responseObject['result'] == 'ok'){
			var fileName=responseObject["data"]["fileInfo"]["filename"];
			var fileContent=responseObject["data"]["fileInfo"]["fileContent"];
			var userType=responseObject["data"]["fileInfo"]["userType"];
			renderModifyFileForm(responseObject["data"]["fileInfo"],userType);
			var buttons=[{
				text: 保存, cls: "blue",
					handler:function(){
						saveUpdateFileInfo();
						$("#file-modify-dlg").dialog("close");
					}},
				{
					text: 关闭, handler: function () {
						$("#file-modify-dlg").dialog("close");
					}}
				];
			 
			
			$("#file-modify-dlg").dialog({
				title: 文件修改, model: true, draggable: false, width: 700, height: 450,
				buttons: buttons
			});
			
			$(".awsui-dialog .dlg-content").css("margin","0px");
			$(".awsui-dialog .dlg-content").css("border","none");
			$(".awsui-dialog .dlg-title").css("display","none");
			
			$("#aws-form-ux-tab_fileattr").find("a").click(function(){
					var i=$(this).index();
					if(i=="0"){
						$("#file-modify-dlg").find(".blue").show();
					}else{
						$("#file-modify-dlg").find(".blue").hide();
					}
			});
			
	
		}else{
			$.simpleAlert(responseObject['msg'], responseObject['result']);
		}
	}, 'json');
	return false;
}

function renderModifyFileForm(fileInfo, userType) {
	var fileId=fileInfo.id;
	var canPreviewFlag=fileInfo.canPreviewFlag;
	var canDownloadFlag=fileInfo.canDownloadFlag;
	var path=fileInfo.path;
	var pathHtml = 根目录 + "/";
	if(path.length>0){
		for (var i=0; i < path.length; i++) {
		  pathHtml+=path[i].name+"/";
		};
	}
	//form style tab
	$("#file-modify-dlg-content").empty();
	var navTabStr="";
	navTabStr+='<div id="aws-form-ux-tab_fileattr" class="aws-form-ux-tab" border="0" name="aws-form-ux-tab_fileattr" style="height:36px;" >';
	navTabStr += '	<a class="active" border="0">' + 基本信息 + '</a> ';
	navTabStr += '	<a border="0">' + 标签 + '</a>';
	if(userType!="1"){
		navTabStr += '	<a border="0">' + 管理分享 + '</a>';
		navTabStr += '	<a border="0">' + 日志 + '</a>';
	}
	navTabStr+='</div>';
	navTabStr+='<div id="tabcontent_fileattr" class="aws-form-ux-tab-content" border="0">';
	navTabStr += '	<div class="aws-form-ux-tab-item" border="0" id="basicAttr"></div>';
	navTabStr += '	<div class="aws-form-ux-tab-item" border="0" id="labelAttr" style="display:none;"></div>';
	if(userType!="1"){
		navTabStr += '	<div class="aws-form-ux-tab-item" border="0" id="shareAttr" style="display:none;"></div>';
		navTabStr += '	<div class="aws-form-ux-tab-item" border="0" id="logAttr" style="display:none;"></div>';
	}
	navTabStr+='</div>';
	$("#file-modify-dlg-content").append(navTabStr);
	easyTabInitFormTab("aws-form-ux-tab_fileattr","tabcontent_fileattr");
	
	//基本属性
	var tableStr="";
	tableStr+="<input type='hidden' id='updateFileId' value='"+fileId+"'>";
	tableStr+="<table class='awsui-ux file-attr-table' style='padding:0px 0px;'>";
	tableStr += "<tr><td class='awsui-ux-title attr-title'>ID</td><td style='width:510px;height: auto;display: block;'>" + fileId + "</td></tr>";
	tableStr += "<tr><td class='awsui-ux-title attr-title'>" + 所属目录 + "</td><td style='width:510px;height: auto;display: block;word-break: break-all;word-wrap: break-all;white-space:normal;overflow:hidden;'>" + pathHtml + "</td></tr>";
	tableStr += "<tr><td class='awsui-ux-title attr-title'>" + 文件名称 + "</td><td>" + fileInfo.filename + "</td></tr>";
	//是文件夹
	if(fileInfo.filetype=='2'){
		tableStr += "<tr><td class='awsui-ux-title attr-title'>" + 文件夹容量 + "</td><td><input type='text' class='attr-txt' id='foldercapacity' value='" + fileInfo.folderCapacity + "'  onafterpaste='pastevent(this);' onkeyup='keyupevent(this);'   disabled/>&nbsp;&nbsp;M</td></tr>";
//		tableStr+="<tr><td class='awsui-ux-title attr-title'>文件夹容量</td><td><input type='text' class='attr-txt' id='foldercapacity' value='"+fileInfo.folderCapacity+"'  onafterpaste='pastevent(this);' onkeyup='keyupevent(this);'  />&nbsp;&nbsp;M</td></tr>";
		tableStr += "<tr><td class='awsui-ux-title attr-title'>" + 该目录已用 + "</td><td>" + fileInfo.folderUsedCapacity + "&nbsp;&nbsp;M</td></tr>";
	}
	//是文件
	if(fileInfo.filetype=='1'){
		tableStr += "<tr class='previewfalgtrcls'><td class='awsui-ux-title attr-title'>" + 允许预览 + "</td><td><input type='checkbox' class='js-switch' id='canpreviewflag' name='canpreviewflag' checked value='0'/></td></tr>";
		tableStr += "<tr><td class='awsui-ux-title attr-title'>" + 允许下载 + "</td><td><input type='checkbox' class='js-switch' id='candownloadflag' name='candownloadflag' checked value='0'/></td></tr>";
	}
	tableStr += "<tr><td class='awsui-ux-title attr-title'>" + 文件描述 + "</td><td>";
	if(userType=="1"){
	tableStr+=fileInfo.filedesc;
	}else{
	tableStr+="<textarea id='filedesc' class='filedesctxt'>"+fileInfo.filedesc+"</textarea>";
	}
	tableStr+="</td></tr>";
	tableStr += "<tr><td class='awsui-ux-title attr-title'>" + 创建时间 + "</td><td>" + fileInfo.createtime + "&nbsp;&nbsp;" + fileInfo.createUserName + "</td></tr>";
	tableStr += "<tr><td class='awsui-ux-title attr-title'>" + 修改时间 + "</td><td>" + fileInfo.updatetime + "&nbsp;&nbsp;" + fileInfo.updateUserName + "</td></tr>";

	
    //tableStr+="<tr><td colspan='2' style='width:640px;'><div id='ac-panel-owner' class='ac-panel-owner' style='height:auto;'></div></td></tr>";
    //tableStr+="<tr><td colspan='2' style='width:640px;'><div id='ac-panel-viewer' class='ac-panel-viewer' style='height:auto;'></div></td></tr>";
	tableStr+="</table>";
	var linkShareStr="";
	if(fileInfo.isEnt!=undefined && fileInfo.isEnt=="1"){
		linkShareStr+='<div id="easy-outer-ac-info" class="easy-outer-ac-info">';
		linkShareStr+='         <ul id="easy-tab-ac-info"  class="easy-tab-ac-info">';
		linkShareStr += '            <li class="current">' + 所有者 + '</li>';
		linkShareStr += '            <li>' + 查看者 + '</li>';
		if(fileInfo.isEnt!=undefined && fileInfo.isEnt=="1"){
			//userType  1 查看者  2编辑者  3所有者 4创建者
			if(userType=="3" || userType=="4"){
				linkShareStr += "<span class='button green fileacbtn' style='background-color:#64BD63;border:#64BD63;margin:5px 0px;' id='ownerac'>" + 授权 + "</span>";
				if (entfileAcApplyToSub == "0" && fileInfo.filetype == '2') {
					linkShareStr += "<span class='button green fileacbtn' style='background-color:#64BD63;border:#64BD63;margin:5px 0px;' id='ownerapplytosub'>" + 权限应用到下级 + "</span>";
				}
			}
	    }
	    if(fileInfo.isEnt!=undefined && fileInfo.isEnt=="1"){
	    	if(userType=="3" || userType=="4"){
				linkShareStr += "<span class='button green fileacbtn' style='background-color:#64BD63;border:#64BD63;margin:5px 0px;' id='viewerac'>" + 授权 + "</span>";
				if (entfileAcApplyToSub == "0" && fileInfo.filetype == '2') {
					linkShareStr += "<span class='button green fileacbtn' style='background-color:#64BD63;border:#64BD63;margin:5px 0px;' id='viewerapplytosub'>" + 权限应用到下级 + "</span>";
				}
			}
	    }
		linkShareStr+='         </ul>';
		linkShareStr+='         <div id="easy-content-ac-info" class="easy-content-ac-info">';
		linkShareStr+='	         <div style="display:block;" class="nav-config-panel" id="acownertabcontent">';
		linkShareStr+='	          ';
		linkShareStr+='	           <div id="ac-panel-owner" class="ac-panel-owner" style="height:auto;"></div>';
		linkShareStr+='	         </div>';
		linkShareStr+='		     <div class="nav-config-panel" id="acownertabcontent">';
	    linkShareStr+='	           <div id="ac-panel-viewer" class="ac-panel-viewer" style="height:auto;"></div>';
		linkShareStr+='		     </div>';
		linkShareStr+='         </div>';
		linkShareStr+='</div>';
	}
	$("#basicAttr").empty();
	$("#basicAttr").append(tableStr+linkShareStr);
	$("#viewerac").hide();
	$("#viewerapplytosub").hide();
	if (language == "en") {
		$(".attr-title").css("padding", "0px 10px").css("width", "110px");
	}
	
	$(".easy-tab-ac-info li").off("click").on("click",function(){
		var liTxt=$(this).html();
		if (liTxt == 所有者) {
			$("#ownerac").show();
			$("#ownerapplytosub").show();
			$("#viewerac").hide();
			$("#viewerapplytosub").hide();
		} else if (liTxt == 查看者) {
			$("#ownerac").hide();
			$("#ownerapplytosub").hide();
			$("#viewerac").show();
			$("#viewerapplytosub").show();
		}
	});
	
	if(myBrowser()!="Chrome"){
		$("#basicAttr").css("height","290px");
	}else{
		$("#basicAttr").css("height","290px");
	}
	if(fileInfo.isEnt!=undefined && fileInfo.isEnt=="1"){
      easyTabInit("easy-tab-ac-info","easy-content-ac-info");
	}
   
   
	//是文件夹
	if(fileInfo.filetype=='2'){
		/*
		$("#foldercapacity").numberbox({
			defaultValue : fileInfo.folderCapacity,
			uplength : 10,
			min : 0,
			max : 1024
		}); 
		*/
	}  
	
	$("#foldercapacity").css("height","18px").css("line-height","18px");
	
	//标签面板
	var tableStr="";
	tableStr+="<div id='attr-label-content' style='padding-top:10px;' ></div>";
	$("#labelAttr").empty();
	$("#labelAttr").append(tableStr);
	
	//只有所有者和创建者可以查看文件的日志和管理分享
	if(userType!=undefined && ( userType=="4" || userType=="3")){
	 //管理分享
	 getFileSharelinkMsg(fileId);
     //文件日志
     getFileLogMsg(fileId);
	}
     
	if(fileId!=undefined){
		getLabelDatas(fileId,"1");
	} 
	//查看者 所有者 和创建者都可以看到ac数据
	if(userType=="1" ||userType=="3" || userType=="4"){
	registerFileAttrEvent();
	getOwnerAcData(fileId);
	getViewerAcData(fileId);
	}
	
	if(fileInfo.filetype=='1'){
		var disabledFlag=false;
		 if(userType=="1"){
		 	disabledFlag=true;
		 }
		var preopt = {ontext: 是, offtext: 否, swwidth: 150, swheight: 20, fontSize: 13, disabled: disabledFlag};
		canPreviewFlagSW = $('#canpreviewflag').switchButton(preopt);
		var downopt = {ontext: 是, offtext: 否, swwidth: 150, swheight: 20, fontSize: 13, disabled: disabledFlag};
		 canDownloadFlagSw = $('#candownloadflag').switchButton(downopt); 
	 
		$("#canpreviewflag").val(canPreviewFlag);
		if(canPreviewFlag=="0"){
		 	//可以预览
			canPreviewFlagSW.changeStatus(true);
	  	    $('#canpreviewflag').attr("checked",'checked');
		}else{
			canPreviewFlagSW.changeStatus(false);
			$('#canpreviewflag').removeAttr("checked"); 
		}
		
		$("#candownloadflag").val(canDownloadFlag);
		if(canDownloadFlag=="0"){
		 	//可下载
			canDownloadFlagSw.changeStatus(true);
	  	    $('#candownloadflag').attr("checked",'checked');
		}else{
			canDownloadFlagSw.changeStatus(false);
			$('#candownloadflag').removeAttr("checked"); 
		}
	}
	
	 var fileType=fileInfo.format;
	 var picType="bmp,jpg,jpeg,tif,tiff,gif,png,ico";
	 if(fileType!="f" && fileType!="" && picType.indexOf(fileType.toLowerCase())!=-1){
		 $(".previewfalgtrcls").hide();
     }
	
}

 

function keyupevent(obj){
	obj.value=obj.value.replace(/\D/g,'');
}

function pastevent(obj){
	obj.value=obj.value.replace(/\D/g,'');
}



function registerFileAttrEvent(){
	 //注册栏目管理员点击事件
    var fileId=$("#updateFileId").val();
    var owneractype="mydriver.owneractype";
    var editoractype="mydriver.editoractype";
    var vieweractype="mydriver.vieweractype";
	$("#ownerac").off('click').on('click', function (event) {
    	openMyDriverFileAc(fileId,owneractype);
    });
	$("#ac-panel-owner").off('click').on('click', function (event) {
    	openMyDriverFileAc(fileId,owneractype);
    });
	$("#viewerac").off('click').on('click', function (event) {
    	openMyDriverFileAc(fileId,vieweractype);
    });
	$("#ownerapplytosub").off('click').on('click', function (event) {
		showApplyToSubDlg("owner");
	});
	$("#viewerapplytosub").off('click').on('click', function (event) {
		showApplyToSubDlg("viewer");
	});
}

function showApplyToSubDlg(actype) {
	var content = "";
	if (actype == "owner") {
		content = "您确定要将当前文件夹的所有者权限应用到下级文件（夹）吗？";
	} else if (actype == "viewer") {
		content = "您确定要将当前文件夹的查看者权限应用到下级文件（夹）吗？";
	}
	$("#applytosub-dlg-content").html(content);
	$("#applytosub-dlg").dialog({
		title: 应用到下级, model: false, draggable: true, width: 250, height: 130,
		buttons: [{
			text: 追加, cls: "blue", handler: function () {
				doApplyToSub(actype, "0");
			}
		}, {
			text: 覆盖, cls: "blue", handler: function () {
				doApplyToSub(actype, "1");
			}
		},
			{
				text: 取消, handler: function () {
					$("#applytosub-dlg").dialog("close");
				}
			}
		]
	});
	$(".awsui-dialog .dlg-content").css("margin", "0px");
	$(".awsui-dialog .dlg-content").css("border", "none");
	$(".awsui-dialog .dlg-title").css("margin-bottom", "5px");
}

function doApplyToSub(acType, type) {
	var fileId = $("#updateFileId").val();
	var params = {
		fileId: fileId,
		acType: acType,
		type: type
	};
	$.simpleAlert("正在处理，请稍候...", "loading");
	var url = './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_entfile_ac_applytosub';
	awsui.ajax.post(url, params, function (responseObject) {
		$.simpleAlert("close");
		if (responseObject['result'] == 'ok') {
			//成功
			var acListCount = responseObject.data.acListCount;
			$("#applytosub-dlg").dialog("close");
			if (acListCount == 0) {
				$.simpleAlert("当前文件夹还没有授权信息");
			} else {
				$.simpleAlert("应用成功", responseObject['result']);
			}
		} else {
			$.simpleAlert(responseObject['msg'], responseObject['result']);
		}
	}, 'json');
}


function saveUpdateFileInfo(){
	var fileId=$("#updateFileId").val();
	var fileDesc=$("#filedesc").val();
	var foldercapacity=$("#foldercapacity").val();
	var canpreviewflag=$("#canpreviewflag").prop("checked");
	if(canpreviewflag){
		canpreviewflag="0";
    }else{
    	canpreviewflag="1";
    }
	
	var candownloadflag=$("#candownloadflag").prop("checked");
	if(candownloadflag){
		candownloadflag="0";
    }else{
    	candownloadflag="1";
    }
	var params = {
		fileId:fileId,
		fileDesc:fileDesc,
		folderCapacity:foldercapacity,
		canPreviewFlag:canpreviewflag,
		canDownloadFlag:candownloadflag
	};
	var url = './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_update_file_info';
	awsui.ajax.post(url, params, function(responseObject) {
		if(responseObject['result'] == 'ok'){
			$.simpleAlert(修改成功, 'ok', 1000, {model: true});
			//局部刷新该条数据的基本属性
			if(currentView==VIEW_TYPE_LIST){
			  //list
			  var thisObj=$(".file-list").find(".file-list-row[rowid="+fileId+"]");
			  $(thisObj).find(".row-check").attr("canpreviewflag",canpreviewflag);
			  $(thisObj).find(".row-check").attr("candownloadflag",candownloadflag);
			}
			if(currentView==VIEW_TYPE_ICON){
			 //平铺
			  var thisObj=$(".file-list").find(".v_item[rowid="+fileId+"]");
			  $(thisObj).find(".v_item-top").attr("canpreviewflag",canpreviewflag);
			  $(thisObj).find(".v_item-top").attr("candownloadflag",candownloadflag);
			}
			
		}else{
			$.simpleAlert(responseObject['msg'], responseObject['result']);
		}
	}, 'json');
}



//打开AC授权窗口
function openMyDriverFileAc(resourceId,resourceType){
		var dlg = FrmDialog.open({
			title: 选择用户, width: 700, height: 380, url: "./w", id: "moduleacid",
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
				dlg.win().saveAC();
				if(resourceType=="mydriver.owneractype"){
				  getOwnerAcData(resourceId);
				}else{
				  getViewerAcData(resourceId);
				}
			}
		}, {
			text: 关闭,
			handler : function() {
				dlg.close();
				if(resourceType=="mydriver.owneractype"){
				  getOwnerAcData(resourceId);
				}else{
				  getViewerAcData(resourceId);
				}
			}
		}]

	});
}
function showLabelPanel(fileId){
	
	if(fileId!=undefined){
		getLabelDatas(fileId,"0");
	}else{
		getUserLabelDatas();
	}
   $("#file-label-dlg").dialog({
	   title: 文件标签, model: true, draggable: true, width: 600, height: 450,
	   buttons: [
		   {
			   text: 关闭, handler: function () {
				$("#file-label-dlg").dialog("close");
			}}
		]
	});
	
	$(".awsui-dialog .dlg-content").css("margin","0px");
	$(".awsui-dialog .dlg-content").css("border","none");
	//$(".awsui-dialog .dlg-title").css("display","none");
}



function getLabelDatas(fileId,type){
     var params = {
		fileId:fileId
	};
	var url = './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_get_detailinfo';
	awsui.ajax.post(url, params, function(responseObject) {
		if(responseObject['result'] == 'ok'){
	            var labels = responseObject['data']['labels'];
	            var userType = responseObject['data']['userType'];
	            if(type!=undefined && type=="1"){
		            $("#attr-label-content").empty();
					var fileStr="";
					fileStr+="<div  id='fileForLabelPanels'></div>";
				    $("#attr-label-content").append(fileStr);
	            }else{
		            $("#file-label-dlg-content").empty();
					var fileStr="";
					fileStr+="<div  id='fileForLabelPanels'></div>";
				    $("#file-label-dlg-content").append(fileStr);
	            }
			    renderFileLabelsInfo(labels,fileId,userType);
		}else{
			$.simpleAlert(responseObject['msg'], responseObject['result']);
		}
	}, 'json');
	
}


function getUserLabelDatas(fileId){
     var params = { };
	var url = './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_get_user_labels';
	awsui.ajax.post(url, params, function(responseObject) {
		if(responseObject['result'] == 'ok'){
	            var labels = responseObject['data']['labels'];
	            var commonLabels = responseObject['data']['commonLabels'];

	            $("#file-label-dlg-content").empty();
				var fileStr="";
			fileStr += "<h3>" + 常用标签 + "</h3>";
				fileStr+="<div  id='fileCommonLabelPanels'></div>";
				fileStr+="<br/><br/>";
			fileStr += "<h3>" + 所有标签 + "</h3>";
				fileStr+="<div  id='fileLabelPanels'></div>";
			    $("#file-label-dlg-content").append(fileStr);
				renderUserCommonFileLabelsInfo(commonLabels);
				renderUserFileLabelsInfo(labels);
		}else{
			$.simpleAlert(responseObject['msg'], responseObject['result']);
		}
	}, 'json');
	
}

function renderFileLabelsInfo(labels,fileId,userType){
	    $("#fileCommonLabelPanels").empty();
	    $("#fileForLabelPanels").empty();
	var enterP = 输入数据后敲回车试试 + "，" + 最多 + filelabelnum + 个;
	    var superInputStr="";
		superInputStr+='<div id="fileForLabelAddPanel" class="awsui-superinput superInputPanel">';
	superInputStr += ' <input placeholder="' + enterP + '" value = "" type = "text" maxlength = "60" id = "fileForLabelAddInput" class="labelSuperInput" / > ';
		superInputStr+='</div>';
		$("#fileForLabelPanels").append(superInputStr);
		
		 var len = labels.length;
		 var defaultVal = new Array();
		 if(len>0){
	        for (var i=0; i<len; i++) {
				var data = labels[i];
				var labelName=data["labelName"];
				defaultVal[data["id"]]=labelName;
			}
	     }
		    var options={
		       maxLength:filelabelnum,
		       defaultVal:defaultVal,
		       onClose:function(elem){
		       	 var relationId=$(elem).attr("id");
		       	 var input= $("#fileForLabelAddInput");
		       	 deleteFileLabel(relationId);
		       	  $("#fileForLabelAddInput").focus();
		       	},
		       onAdd:function(){
		          var labelName=$("#fileForLabelAddInput").val();
		       	  saveFileLabel(fileId,labelName);
		       	  $("#fileForLabelAddInput").focus();
		       }
		    };
			result = $("#fileForLabelAddPanel").superInputExt(options);
	
}


function renderUserFileLabelsInfo(labels){
	    $("#fileLabelPanels").empty();
	    var superInputStr="";
	     var len = labels.length;
		 if(len>0){
	        for (var i=0; i<len; i++) {
				var data = labels[i];
				var labelName=data["labelName"];
				var labelid=data["id"];
				 superInputStr+="<span class='label-supertext-items'>"+labelName+"<span id='"+labelid+"' class='forms-icon down close alllabelcls'></span></span>";
			}
	     }
	
		$("#fileLabelPanels").append(superInputStr);
		$(".alllabelcls").click(function(){
			var labelId=$(this).attr("id");
			 deleteUserLabel(labelId,"0","1");
		});
	    return false;
	    
	    $("#fileLabelPanels").empty();
	var enterP = 输入数据后敲回车试试 + "，" + 最多 + " 30 " + 个;
	    var superInputStr="";
		superInputStr+='<div id="fileLabelAddPanel" class="awsui-superinput superInputPanel">';
	superInputStr += ' <input placeholder="' + enterP + '" value="" type="text"  maxlength="60"    id="fileLabelAddInput" class="labelSuperInput"/>';
		superInputStr+='</div>';
		$("#fileLabelPanels").append(superInputStr);
		
		//$("#fileLabelAddPanel").find(".awsui-supertext-items").remove();
		 var len = labels.length;
		 var defaultVal = new Array();
		 if(len>0){
	        for (var i=0; i<len; i++) {
				var data = labels[i];
				var labelName=data["labelName"];
				defaultVal[data["id"]]=labelName;
			}
	     }
		    var options={
		       maxLength:30,
		       defaultVal:defaultVal,
		       onClose:function(elem){
		       	  var labelId=$(elem).attr("id");
		       	  var input= $("#fileLabelAddInput");
		       	 if(labelId!=undefined && input.val() != ""){
			        	deleteUserLabel(labelId,"0");
		       	  }else{
		       	  	renderUserFileLabelsInfo(labels);
		       	  }
		       	  $("#fileLabelAddInput").focus();
		       	},
		       onAdd:function(){
		          var labelName=$("#fileLabelAddInput").val();
		       	  saveUserLabel("0",labelName);
		       	  $("#fileLabelAddInput").focus();
		       }
		    };
			result = $("#fileLabelAddPanel").superInputExt(options);

			var input= $("#fileLabelAddInput");
		    input.on("keyup", function(e) {
				if (e.keyCode == 8 && input.val() == "") {
					return false;
			  }
			});
			
            
		   /*
			$("#fileLabelAddPanel").find(".awsui-supertext-items .close").remove();
			$("#fileLabelAddPanel").find("#fileLabelAddInput").remove();
			$("#fileLabelAddPanel").css("border","none");
			$("#fileLabelAddPanel").css("min-height","0px");
			$("#fileLabelAddPanel").css("background","none");
			*/
	
}

function renderCommonLabelNav(labels){
	$("#label-panel").empty();
	var labelStr="";
	var len = labels.length;
		 if(len>0){
	        for (var i=0; i<len; i++) {
				var data = labels[i];
				var labelName=data["labelName"];
				 labelStr+='<div class="todo-navigate-group-item" name="label_'+labelName+'" title="'+labelName+'"><span>'+labelName+'</span></div>';
			}
	     }
	$("#label-panel").append(labelStr);
	//切换左侧导航
	registerEventOfLeft();
	
	if(useTreeNavFlag=="0"){
    	//加载左侧树形导航
        loadLeftNavTree();
    }
}

function renderUserCommonFileLabelsInfo(commonlabels){
	    $("#attr-label-content").empty();
	    $("#fileCommonLabelPanels").empty();
	var enterP = 输入数据后敲回车试试 + "，" + 最多 + commonlabelnum + 个;
	
	    var superInputStr="";
		superInputStr+='<div id="fileCommonLabelAddPanel" class="awsui-superinput superInputPanel">';
	superInputStr += ' <input placeholder="' + enterP + '" value="" type="text"   maxlength="60"   id="fileCommonLabelAddInput" class="labelSuperInput"/>';
		superInputStr+='</div>';
		$("#fileCommonLabelPanels").append(superInputStr);
		
					
		//$("#fileCommonLabelAddPanel").find(".awsui-supertext-items").remove();
		 var len1 = commonlabels.length;
		 var defaultVal1 = new Array();
		 if(len1>0){
	        for (var i=0; i<len1; i++) {
				var data = commonlabels[i];
				var labelName=data["labelName"];
				defaultVal1[data["id"]]=labelName;
			}
	     }
		    var options1={
		       maxLength:commonlabelnum,
		       defaultVal:defaultVal1,
		       onClose:function(elem){
		       	 var labelId=$(elem).attr("id");
		       	 var input= $("#fileCommonLabelAddInput");
		       	  deleteUserLabel(labelId,"1");
		       	  $("#fileCommonLabelAddInput").focus();
		       	},
		       onAdd:function(){
		          var labelName=$("#fileCommonLabelAddInput").val();
		       	  saveUserLabel("1",labelName);
		       	  $("#fileCommonLabelAddInput").focus();
		       }
		    };
			result = $("#fileCommonLabelAddPanel").superInputExt(options1);
		   /*
			$("#fileCommonLabelAddPanel").find(".awsui-supertext-items .close").remove();
			$("#fileCommonLabelAddPanel").find("#fileLabelAddInput").remove();
			$("#fileCommonLabelAddPanel").css("border","none");
			$("#fileCommonLabelAddPanel").css("min-height","0px");
			$("#fileCommonLabelAddPanel").css("background","none");
			*/
	
}


 function saveFileLabel(sourceId,labelName){
    var params = {
		sourceId:sourceId,
		labelName:labelName
	};
	var url = './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_save_label';
	awsui.ajax.post(url, params, function(responseObject) {
		if(responseObject['result'] == 'ok'){
	        var labels = responseObject['data']['labels'];
	        var userType = responseObject['data']['userType'];
	            
	            $("#file-label-dlg-content").empty();
				var fileStr="";
				fileStr+="<div  id='fileForLabelPanels'></div>";
			    $("#file-label-dlg-content").append(fileStr);
    
				renderFileLabelsInfo(labels,sourceId,userType);
				$("#fileForLabelAddInput").focus();
		}else{
			$.simpleAlert(responseObject['msg'], responseObject['result']);
		}
	}, 'json');
}

function forbitBackSpace(){
	 if(event.keyCode == 8 ||event.keyCode == 229){
        return false;
     } 
}

 function saveUserLabel(isCommon,labelName){
    var params = {
		isCommon:isCommon,
		labelName:labelName
	};
	var url = './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_save_user_label';
	awsui.ajax.post(url, params, function(responseObject) {
		if(responseObject['result'] == 'ok'){
	        var labels = responseObject['data']['labels'];
	        var commonLabels = responseObject['data']['commonLabels'];
	        renderUserCommonFileLabelsInfo(commonLabels);
			renderUserFileLabelsInfo(labels);
			//常用标签
			if(isCommon=="1"){
				renderCommonLabelNav(commonLabels);
				$("#fileCommonLabelAddInput").focus();
			}
		}else{
			$.simpleAlert(responseObject['msg'], responseObject['result']);
		}
	}, 'json');
}

function deleteFileLabel(relationId){
	var params = {
		relationId:relationId
	};
	var url = './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_delete_label_gl';
	awsui.ajax.post(url, params, function(responseObject) {
		if(responseObject['result'] == 'ok'){
			$.simpleAlert(删除成功, 'ok', 1000, {model: true});
		}else{
			$.simpleAlert(responseObject['msg'], responseObject['result']);
		}
	}, 'json');
}

function deleteUserLabel(labelId,isCommon,alldeletecommon){
	var params = {
		isCommon:isCommon,
		labelId:labelId
	};
	var url = './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_delete_label';
	awsui.ajax.post(url, params, function(responseObject) {
		if(responseObject['result'] == 'ok'){
			$.simpleAlert(删除成功, 'ok', 1000, {model: true});
	        var labels = responseObject['data']['labels'];
	        var commonLabels = responseObject['data']['commonLabels'];
	        renderUserCommonFileLabelsInfo(commonLabels);
			renderUserFileLabelsInfo(labels);
			if(isCommon=="1"){
				renderCommonLabelNav(commonLabels);
			}
			
			if(alldeletecommon!=undefined && alldeletecommon=="1"){
				renderCommonLabelNav(commonLabels);
			}
		}else{
			$.simpleAlert(responseObject['msg'], responseObject['result']);
		}
	}, 'json');
}


function showCommentPanel(sourceId){
	defautltReplyPageSize=20;
	replyCounts=0;
	replyCurCounts=0;
	replyCurrentLen=0;

	$("#file-comment-dlg-content").empty();
	$("#file-comment-dlg-content").append("<div class='reply-box'></div><div class='reply-list'></div>");
	
	 var addreplystr="<div class='reply-title' >写下你的看法:</div>";
     addreplystr+="<div class='reply-panel'><textarea   class='txt emotion replycontent' id='content'  maxlength='5000'></textarea>";
     addreplystr+="<input type='button' class='button blue reply-add-btn' onclick=addFileReply('"+sourceId+"'); value='提交'/>";
     addreplystr+="</div>";
     $(".reply-box").append(addreplystr);
									     
	 loadCommentData(sourceId,0,defautltReplyPageSize);
   $("#file-comment-dlg").dialog({
		title:"文件评论",model:true,draggable:true,width:600,height:450,
		buttons:[ 
			{text:"关闭",handler:function(){
				$("#file-comment-dlg").dialog("close");
			}}
		]
	});
	
	$(".awsui-dialog .dlg-content").css("margin","0px");
	$(".awsui-dialog .dlg-content").css("border","none");
	$(".awsui-dialog .dlg-title").css("display","none");
}

//加载回复列表数据
function loadCommentData(sourceId,start,size){
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
				showFileCommentList(replyList,sourceId);
			}else{
				$.simpleAlert(responseObject['msg'], responseObject['result']);
			}
		}, 'json');
		
}


//回复列表
function showFileCommentList(replyList,messageid){
		 var replystr="";
		  if(replyList.length!=0){
		  	if(replyList.length > 0 && replyCurCounts <= defautltReplyPageSize){
		       replystr+='<div class="reply-total-num" id="replytotal">共'+replyCounts+'条回复</div>';
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
				     replystr+='<div class="each-reply-panel">';
				     if(backgroundcanuseflag=="1"){
				     replystr+='    <div class="replyer-photo awsui-user-profile" userid='+replyuser+'><img src="'+userPhoto+'"  class="user-photo-cls"/><br/><span class="reply-index-num">#'+index+'</span></div>';
				     }else{
				     replystr+='    <div class="replyer-photo"><img src="'+userPhoto+'"  class="user-photo-cls"/><br/><span class="reply-index-num">#'+index+'</span></div>';
				     }
				     replystr+='    <div class="replye-data">';
				     if(backgroundcanuseflag=="1"){
				     replystr+='        <div class="replye-data-top awsui-user-profile" userid='+replyuser+'>'+replyusername+'</div>';
				     }else{
				     replystr+='        <div class="replye-data-top">'+replyusername+'</div>';
				     }
				     replystr+='        <div class="replye-data-top-right"><span class="reply-time-cls">'+replytime+'</span>';
                     if(replyuser==userid){
                     //replystr+="            <span style='margin-right: 10px;'>&nbsp;<a onclick=toUpdateReply('"+msgid+"','"+replyid+"'); class='name reply-op-cls'>修改</a></span>";
                     replystr+="            <span style='margin-right: 10px;'>&nbsp;<a onclick=deleteReply('"+msgid+"','"+replyid+"'); class='name reply-op-cls'>删除</a></span>";
                     }
				     replystr+='        </div>';
				     replystr+='        <div class="replye-data-middle" style="word-break:break-all;word-wrap:break-word;"><p>'+replycontent+'</p><input type="hidden" id="reply'+replyid+'" value="'+replycontent+'"/></div>';
				     replystr+='    </div>';
				     replystr+='</div>';
            }
		  }else{
		  	 replystr+="<div class='nodata'>做第一个回复者吧！</div>";
		  }
		  $(".reply-list").append(replystr);
		  
	      //分页信息
		    var size=20;
			if ( replyCurCounts>=size  && replyCurCounts < replyCounts  ) {
				replyMore = $("<div  class='list_load_more'>加载更多...</div>");
				$(".reply-list").append(replyMore);
				replyMore.click(function(e) {
					loadCommentData(messageid,"",defautltReplyPageSize);
					$(this).remove();
				});
			}
		    
}

//添加回复
function addFileReply(sourceId){
    var content=$("#content").val();
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
				 $("#content").val("");
				 $(".reply-list").empty();
				 loadCommentData(sourceId,0,defautltReplyPageSize);
				
		}else{
			$.simpleAlert(responseObject['msg'], responseObject['result']);
		}
	}, 'json');
	
}

//删除回复
function deleteReply(sourceId,commentId){
	var options = {
		title : "提示",
		content : "确定要删除该条评论吗？",
		onConfirm : function() {
				var params = {
					sourceId:sourceId,
					commentId:commentId
				};
				var url = './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_delete_reply_by_id';
				awsui.ajax.post(url, params, function(responseObject) {
					if(responseObject['result'] == 'ok'){
						     replyCounts = 0;
					         replyCurCounts = 0;
							 $("#content").val("");
							 $(".reply-list").empty();
							 loadCommentData(sourceId,0,defautltReplyPageSize);
					}else{
						$.simpleAlert(responseObject['msg'], responseObject['result']);
					}
				}, 'json');
				 
		}
	};
	$.confirm(options); 
}


function renderSearchPopboxData(type){
    $("#show-search-popbox").empty();
    var searchHtml="";
    if(type!=undefined && type=="share"){
    	searchHtml+='';
    	searchHtml+='<span class="span_search_share" style="">';
    	searchHtml+='分享人  <input id="shareowner" class="txt"  placeholder="选择分享人"  name="shareowner"   readonly="readonly"   type="text"     style="height: 17px;width:120px;"/>';
	    searchHtml+='<input id="shareowneruid"  name="shareowneruid"   type="hidden"/>';
	    searchHtml+='<button class="button blue"    type="button" style="margin:10px 10px 0px 10px;" onclick="searchShare();">搜索</button> ';
	    searchHtml+='<button class="button gray"    type="button" style="margin:10px 10px 0px 10px;" onclick="cleanShareSearch();">重置</button> ';
		searchHtml+='</span>';
		$("#show-search-popbox").append(searchHtml);
		
		
		$("#shareowner").address({
	    	callback : function(){
	    		$(".show-search-btn").click();	
	    	},
		    valueType:1,//0 aliasname  / 1 uid  /2 uname  取值类型
		    separator:" ",//逗号 空格……分隔符
		    inDialog:false,//是否在dialog内部
		    target:null,
		 	filter:{
		 		"addressType": "user",//地址簿类型
			    "isAdvMode": true,//是否启用高级模式
			    "addressSetting": {
			        "rootDetpId": "",
			        "isDisplayMap": false,
			        "isDisplayOtherMap": false,
			        "layerFrom": "",
			        "layerTo": "",
			        "range": "department|role|team",
			        "delimiter": ",",
			        "choiceType": "single",
			        "leafType": "user",//叶子节点类型，可选值：user:XXX，xx:XXX
			        "filterClass": ""//过滤事件
			    },
			    "sourceField": "USERNAME,UID",//字典的数据源字段
			    "targetField": "shareowner,shareowneruid"//回填字段
		 	}
	    });
		
    }else if(type!=undefined && type=="file"){
    	searchHtml+='<span class="span_search"  style="">';
		searchHtml += '  <input id="searchvalue" type="text"  placeholder="' + 按文件夹名搜索 + '"  style="width: 150px;height:30px;line-height:30px;padding-top:1px;margin-top:0;"/>';
    	searchHtml+='</span>';
    	$("#show-search-popbox").append(searchHtml);
    	
    	 //  文件  实时查询    
    	$("#searchvalue").buttonedit({
    		onLiveSearch : function(e) {
                searchFile();
    		}
    	});
    	$("#searchvalue").css("width","150px");
    	$(".awsui-buttonedit-wrap").css("width","140px");
    	
    }else if(type!=undefined && type=="log"){
    	searchHtml+='<div class="log-search"  style="float:right;margin:5px 10px 0 10px;">';
		//searchHtml+='<div id="testDiv" class="awsui-box" style="position: absolute; width:auto; height:auto; padding: 5px; border: 1px solid #ccc; border-radius: 5px; background: white; z-index: 1; display: none; ">';
		searchHtml+='<table width="280">';
		searchHtml+='<tr   height="30">';
		searchHtml += '<td align="center" width="50">' + 用户 + '</td>';
		searchHtml+='<td>';
		searchHtml += '<input type="text" style="width:193px;"  placeholder="' + 选择用户 + '"   class="txt" id="loguserid" readonly="readonly" name="loguserid">';
//		searchHtml+='<input type="text" style="width:203px;"  placeholder="选择用户"   class="txt" id="logusername" readonly="readonly" name="logusername" onclick="openSelectUserDlgForLog();"  > <input id="loguserid"  name="loguserid"   type="hidden"/>';
//		searchHtml+='	<select style="height: 25px;width: 200px"  id="opttype" name="opttime"><option value="">--请选择--</option><option value="1">上传</option><option value="2">新建文件夹</option><option value="3">重命名</option> <option value="4">移动</option> <option value="5">删除</option><option value="6">彻底删除</option><option value="7">还原</option><option value="8">分享</option><option value="9">取消分享</option><option value="10">下载</option><option value="11">清空回收站</option><option value="12">全部还原</option></select>';
		searchHtml+='</td>';
		searchHtml+='</tr>';
		searchHtml+='<tr   height="30">';
		searchHtml += '<td align="center" width="50">' + 类型 + '</td>';
		searchHtml+='<td>';
		searchHtml+='	<select style="height: 25px;width: 200px"  id="opttype" name="opttime">';
		searchHtml += '	 <option value="">--' + 请选择 + '--</option>' +
			'<option value="1">' + 上传 + '</option>' +
			'<option value="2">' + 新建文件夹 + '</option>' +
			'<option value="3">' + 重命名 + '</option> ' +
			'<option value="4">' + 移动 + '</option> ' +
			'<option value="5">' + 删除 + '</option>' +
			'<option value="6">' + 彻底删除 + '</option>' +
			'<option value="7">' + 还原 + '</option>' +
			'<option value="8">' + 分享 + '</option>' +
			'<option value="9">' + 取消分享 + '</option>' +
			'<option value="10">' + 下载 + '</option>' +
			'<option value="11">' + 清空回收站 + '</option>' +
			'<option value="12">' + 全部还原 + '</option>';
		searchHtml += '    <option value="13">' + 修改 + '</option>' +
			'<option value="14">' + 添加标签 + '</option>' +
			'<option value="15">' + 删除标签 + '</option>' +
			'<option value="16">' + 收藏 + '</option>' +
			'<option value="17">' + 取消收藏 + '</option>';
		//searchHtml+='    <option value="18">评论文件</option><option value="19">删除评论</option>';
		searchHtml += '    <option value="20">' + 设置权限 + '</option>' +
			'<option value="21">' + 链接分享 + '</option>' +
			'<option value="22">' + 工作网络分享 + '</option>' +
			'<option value="23">' + 新建文档 + '</option>' +
			'<option value="24">' + 修改文档 + '</option>';
		searchHtml+='	</select>';
		searchHtml+='</td>';
		searchHtml+='</tr>';
		searchHtml+='<tr   height="30">';
		searchHtml += '<td align="center">' + 日期 + '</td>';
		searchHtml+='	<td><span id="datepickerRange" style="display: inline-block;width: 200px;"></span></td>';
		searchHtml+='</tr>';
		searchHtml+='<tr   height="30">';
		searchHtml+='<td colspan="2"  align="center">';
		searchHtml += '<button class="button blue"   type="button"  onclick="searchLog();">' + 搜索 + '</button> ';
		searchHtml += '      <button class="button gray"   type="button"  onclick="cleanSearch();">' + 重置 + '</button>';
		searchHtml+='  </td>';
		searchHtml+='</tr>';
		searchHtml+='</table> ';  
		//searchHtml+='</div>';
	    searchHtml+='</div>';
	    $("#show-search-popbox").append(searchHtml);
		$("#loguserid").address({
	    	callback : function(){
	    		$(".show-search-btn").click();	
	    	},
		    valueType:1,//0 aliasname  / 1 uid  /2 uname  取值类型
		    separator:" ",//逗号 空格……分隔符
		    inDialog:false,//是否在dialog内部
		    target:null,
		 	filter:{
		 		"addressType": "user",//地址簿类型
			    "isAdvMode": true,//是否启用高级模式
			    "addressSetting": {
			        "rootDetpId": "",
			        "isDisplayMap": false,
			        "isDisplayOtherMap": false,
			        "layerFrom": "",
			        "layerTo": "",
			        "range": "department|role|team",
			        "delimiter": ",",
			        "choiceType": "single",
			        "leafType": "user",//叶子节点类型，可选值：user:XXX，xx:XXX
			        "filterClass": ""//过滤事件
			    },
				"sourceField": "UID",//字典的数据源字段
				"targetField": "loguserid"//回填字段
		 	}
	    });
	    
	    $("#show-search-popbox").css("overflow","visible");
    }else{
    	searchHtml+="";
    	$("#show-search-popbox").append(searchHtml);

    }
    
}

function renderCapPopboxData(){
	    $("#show-cap-popbox").empty();
	    var piefilestr="";
		piefilestr="<div id='each-pie-file-panel' class='awsui-chart' ><div class='awsui-chart-main'></div></div>";
		$("#each-pie-file-panel").css("border","1px solid #BBD7E6");
        $(".awsui-chart").css("border-color","#BBD7E6");
		$("#show-cap-popbox").append(piefilestr);
		
          var used=parseFloat(currentFolderUsedSize).toFixed(2);
          var sum=parseFloat(folderCapacity).toFixed(2)-parseFloat(currentFolderUsedSize).toFixed(2);
          var eachOption = {
             	color:['#5CB85C','#C4DAED'],
			  title: {text: 当前目录统计, subtext: '', x: 'left'},
			    tooltip : { trigger: 'item',  formatter: "{a} <br/>{b} : {c}M ({d}%)" },
			  legend: {orient: 'horizontal', x: 'right', data: [已使用, 剩余]},
			    calculable : false,
			  series: [{
				  type: 'pie', radius: '55%', center: ['50%', '60%'],
				  data: [{value: used, name: 已使用}, {value: sum, name: 剩余}],
			    itemStyle: {
			    	normal: { label: {show: false}, labelLine: {show: false} },
	                emphasis: {
	                    shadowBlur: 10,
	                    shadowOffsetX: 0,
	                    shadowColor: 'rgba(0, 0, 0, 0.5)'
	                }
               }
            }]
			};
		  var eachChart = echarts.init(document.getElementById('each-pie-file-panel')); 
		  eachChart.setOption(eachOption); 
}



//显示管理员配置数据
function showAdminConifgView(){
	var url = './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_get_admin_config';
	var params={ };
	awsui.ajax.post(url, params, function(responseObject) {
		if(responseObject['result'] == 'ok'){
			var capacity=responseObject["data"]["capacity"];
			var usercapacity=responseObject["data"]["usercapacity"];
			var filesize=responseObject["data"]["filesize"];
			var folderlevel=responseObject["data"]["folderlevel"];
			var previewflag=responseObject["data"]["previewflag"];
			var userfoldercapacity=responseObject["data"]["userfoldercapacity"];
			var entfoldercapacity=responseObject["data"]["entfoldercapacity"];
			var mydriveradmin=responseObject["data"]["mydriveradmin"];
			var mydriveradminusername=responseObject["data"]["mydriveradminusername"];
			var onlinefileflag=responseObject["data"]["onlinefileflag"];
			var sharedate=responseObject["data"]["sharedate"];
			var entfiletitle= responseObject["data"]["entfiletitle"];
			var selffiletitle= responseObject["data"]["selffiletitle"];
			var filelabelnum= responseObject["data"]["filelabelnum"];
			var commonlabelnum= responseObject["data"]["commonlabelnum"];
			var outerlinkflag =responseObject["data"]["outerlinkflag"]; 
			var showpbflag =responseObject["data"]["showpbflag"];
			var sharenavbgcolor =responseObject["data"]["sharenavbgcolor"]; 
			var sharenavfontcolor = responseObject["data"]["sharenavfontcolor"];
			var sharenavlogo =responseObject["data"]["sharenavlogo"]; 
			var sharenavtitle =responseObject["data"]["sharenavtitle"]; 
			renderAdminConfigView(capacity,usercapacity,filesize,folderlevel,previewflag,userfoldercapacity,entfoldercapacity,mydriveradmin,mydriveradminusername,onlinefileflag,sharedate,entfiletitle,selffiletitle,filelabelnum,commonlabelnum,outerlinkflag,sharenavbgcolor,sharenavfontcolor,sharenavlogo,sharenavtitle,showpbflag);
			var pathHtml = "<a no=''>" + 管理员设置 + "</a>";
			$("#link_path").empty();
			$("#link_path").append(pathHtml);
			
		}else{
			$.simpleAlert(responseObject['msg'], responseObject['result']);
		}
	}, 'json');
	return false;
	 
}

function renderAdminConfigView(capacity,usercapacity,filesize,folderlevel,previewflag,userfoldercapacity,entfoldercapacity,mydriveradmin,mydriveradminusername,onlinefileflag,sharedate,entfiletitle,selffiletitle,filelabelnum,commonlabelnum,outerlinkflag,sharenavbgcolor,sharenavfontcolor,sharenavlogo,sharenavtitle,showpbflag){
	var tableStr="";
	tableStr+="<table width='700' height='500px;' style='padding:0 0 0 20px;' class='config-table'>";
	tableStr += "<tr><td align='left' colspan='3'><legend><h3>" + 基本设置 + "<h3></legend></td></tr>";
	tableStr += "<tr><td align='right' class='firsttdcls' style='width:120px;padding:0px 10px;'>" + 文件可预览 + "</td><td style='width:360px;padding:0px 10px;'><input type='checkbox' class='js-switch' id='acpreviewflag' name='acpreviewflag' checked value='0'/></td><td style='width:100px;'></td></tr>";
	tableStr += "<tr><td align='right' class='firsttdcls' style='width:120px;padding:0px 10px;'>" + 新建在线文档 + "</td><td style='width:360px;padding:0px 10px;'><input type='checkbox' class='js-switch' id='accreateonlinefileflag' name='accreateonlinefileflag' checked value='0'/></td><td  ></td></tr>";
	tableStr += "<tr><td align='right' class='firsttdcls' style='width:120px;padding:0px 10px;'>" + 文件夹层级 + "</td><td style='width:360px;padding:0px 10px;'><input type='text' id='acfolderlevel' class='txt' style='width:343px;'  maxlength='2' onkeyup='textkeyupfun(this)'  onafterpaste='textkeyupfun(this)'   /></td><td  ></td></tr>";
	tableStr += "<tr><td align='right' class='firsttdcls' style='width:120px;padding:0px 10px;'>" + 文件标签个数限制 + "</td><td style='width:360px;padding:0px 10px;'><input type='text' id='acfilelabelnum' class='txt' style='width:343px;'  maxlength='2' onkeyup='textkeyupfun(this)'  onafterpaste='textkeyupfun(this)'   /></td><td  ></td></tr>";
	tableStr += "<tr><td align='right' class='firsttdcls' style='width:120px;padding:0px 10px;'>" + 常用标签个数限制 + "</td><td style='width:360px;padding:0px 10px;'><input type='text' id='accommonlabelnum' class='txt' style='width:343px;'  maxlength='2' onkeyup='textkeyupfun(this)'  onafterpaste='textkeyupfun(this)'   /></td><td  ></td></tr>";
	tableStr += '<tr><td align="right" class="firsttdcls" style="width:120px;padding:0px 10px;">' + 单文件大小 + '</td><td style="width:360px;padding:0px 10px;"><input type="text" id="acfilesize" class="txt" style="width:343px;" maxlength="3" onkeyup="textkeyupfun(this)"  onafterpaste="textkeyupfun(this)" /></td><td  style="width:100px;"><font color="grey">' + 单位 + '：M</font></td></tr>';
	tableStr += "<tr><td align='right' class='firsttdcls' style='width:120px;padding:0px 10px;'>" + 企业文件导航标题 + "</td><td style='width:360px;padding:0px 10px;'><input type='text' id='acentfiletitle' class='txt' style='width:343px;'   /></td><td  ></td></tr>";
	tableStr += "<tr><td align='right' class='firsttdcls' style='width:120px;padding:0px 10px;'>" + 个人文件导航标题 + "</td><td style='width:360px;padding:0px 10px;'><input type='text' id='acselffiletitle' class='txt' style='width:343px;'   /></td><td  ></td></tr>";
	tableStr += "<tr><td align='right' class='firsttdcls' style='width:120px;padding:0px 10px;'>" + 网盘管理员 + "</td><td style='width:360px;padding:0px 10px;'><div class='address-wrap'><input type='text' id='acmydriveradmin'   style='width:340px;'  readonly  /><input type='hidden' id='acmydriveradminuid'/></div></td><td  ></td></tr>";
	tableStr += "<tr><td align='left' colspan='3'><legend><h3>" + 容量设置 + "<h3></legend></td></tr>";
	tableStr += "<tr><td align='right' class='firsttdcls' style='width:120px;padding:0px 10px;'>" + 个人网盘总容量 + "</td><td style='width:360px;padding:0px 10px;'><input type='text' id='acusercapacity' class='txt' style='width:343px;'  maxlength='5' onkeyup='textkeyupfun(this)'  onafterpaste='textkeyupfun(this)'   /></td><td  ><font color='grey'>" + 单位 + "：G</font></td></tr>";
	tableStr += "<tr><td align='right' class='firsttdcls' style='width:120px;padding:0px 10px;'>" + 个人文件夹容量 + "</td><td style='width:360px;padding:0px 10px;'><input type='text' id='acuserfoldercapacity' class='txt' style='width:343px;'   maxlength='5' onkeyup='textkeyupfun(this)'  onafterpaste='textkeyupfun(this)'  /></td><td  ><font color='grey'>" + 单位 + "：M</font></td></tr>";
	tableStr += "<tr><td align='right' class='firsttdcls' style='width:120px;padding:0px 10px;'>" + 企业文件夹容量 + "</td><td style='width:360px;padding:0px 10px;'><input type='text' id='acentfoldercapacity' class='txt' style='width:343px;'   maxlength='5' onkeyup='textkeyupfun(this)'  onafterpaste='textkeyupfun(this)'  /></td><td  ><font color='grey'>" + 单位 + "：M</font></td></tr>";
	tableStr += "<tr><td align='right' class='firsttdcls' style='width:120px;padding:0px 10px;'>" + 网盘总容量 + "</td><td style='width:360px;padding:0px 10px;'><input type='text' id='accapacity' readonly class='txt' style='width:343px;border:none;'   maxlength='5' onkeyup='textkeyupfun(this)'  onafterpaste='textkeyupfun(this)'  /></td><td  ><font color='grey'>" + 单位 + "：G </font></td></tr>";
	tableStr += "<tr><td align='left' colspan='3'><legend><h3>" + 公开链接设置 + "<h3></legend></td></tr>";
	tableStr += "<tr><td align='right' class='firsttdcls' style='width:120px;padding:0px 10px;'>" + 创建公开链接 + "</td><td style='width:360px;padding:0px 10px;'><input type='checkbox' class='js-switch' id='acouterlinkflag' name='acouterlinkflag' checked value='0'/></td><td  ></td></tr>";
	tableStr += "<tr><td align='right' class='firsttdcls' style='width:120px;padding:0px 10px;'>" + 链接分享有效期 + "</td><td style='width:360px;padding:0px 10px;'><input type='text' id='acsharedate' class='txt' style='width:343px;'  maxlength='3' onkeyup='textkeyupfun(this)'  onafterpaste='textkeyupfun(this)'   /></td><td  ><font color='grey'>" + 单位 + "：" + 天 + "</font></td></tr>";
	tableStr += "<tr><td align='right' class='firsttdcls' style='width:120px;padding:0px 10px;'>" + 导航栏背景色 + "</td><td style='width:360px;padding:0px 10px;'><input type='text' id='acsharenavbgcolor' class='txt color' style='width:343px;'   /></td><td  ></td></tr>";
	tableStr += "<tr><td align='right' class='firsttdcls' style='width:120px;padding:0px 10px;'>" + 导航栏字体颜色 + "</td><td style='width:360px;padding:0px 10px;'><input type='text' id='acsharenavfontcolor' class='txt color' style='width:343px;'   /></td><td  ></td></tr>";
	tableStr += "<tr><td align='right' class='firsttdcls' style='width:120px;padding:0px 10px;'>" + 导航栏logo + "</td><td style='width:360px;padding:0px 10px;'><input type='text' id='acsharenavlogo' class='txt' style='width:343px;'   /></td><td  ></td></tr>";
	tableStr += "<tr><td align='right' class='firsttdcls' style='width:120px;padding:0px 10px;'>" + 导航栏文字 + "</td><td style='width:360px;padding:0px 10px;'><input type='text' id='acsharenavtitle' class='txt' style='width:343px;'   /></td><td  ></td></tr>";
	tableStr += "<tr><td align='right' class='firsttdcls' style='width:120px;padding:0px 10px;'>" + 显示 + "Powered By</td><td style='width:360px;padding:0px 10px;'><input type='checkbox' class='js-switch' id='acshowpbflag' name='acshowpbflag' checked value='0'/></td><td></td></tr>";
	tableStr += "<tr><td align='right' class='firsttdcls' style='width:120px;padding:0px 10px;'>" + 邮件通知 + "</td><td style='width:360px;padding:0px 10px;'><span class='button blue updateMailBtn'>" + 设置模板 + "</span></td><td></td></tr>";
	tableStr += "<tr><td align='center' colspan='3'><span class='button blue' id='save-admin-config' style='margin: 10px 15px 0 0;padding:5px 30px;'>" + 保存Btn + "</span></td></tr>";
	tableStr+="</table>";
	var rightH=$("#mydriver-right").height();
	$(".right-center-content").append(tableStr);
	$(".right-center-content").css("height",(rightH-10)+"px");
	$(".right-center-content").css("overflow-y","scroll");
	if (language == "en") {
		$(".right-center-content").find("table").attr("width", "830");
		$(".right-center-content").find(".firsttdcls").css("width", "270px");
	}
	
	
	jscolor.init();
	$("#acsharenavfontcolor").css("background","#"+sharenavfontcolor);
	$("#acsharenavbgcolor").css("background","#"+sharenavbgcolor);
	var navOpts = {ontext: 是, offtext: 否, swwidth: 150, swheight: 20, fontSize: 13};
	previewFlagSw = $('#acpreviewflag').switchButton(navOpts);
	var fileOpts = {ontext: 可以, offtext: 不可以, swwidth: 150, swheight: 20, fontSize: 13};
	fileFlagSw = $('#accreateonlinefileflag').switchButton(fileOpts);
	var outerlinkOpts = {ontext: 允许, offtext: 不允许, swwidth: 150, swheight: 20, fontSize: 13};
	outerlinkFlagSw = $('#acouterlinkflag').switchButton(outerlinkOpts);
	var showpbOpts = {ontext: 显示, offtext: 不显示, swwidth: 150, swheight: 20, fontSize: 13};
	 showpbFlagSw =  $('#acshowpbflag').switchButton(showpbOpts); 
	  
	 $("#save-admin-config").click(function(){
	 	saveAdminConfigData();
	 });
	 
	$("#acuserfoldercapacity").val(userfoldercapacity);
	$("#acentfoldercapacity").val(entfoldercapacity);
	$("#accapacity").val(capacity);
	$("#acusercapacity").val(usercapacity);
	$("#acfilesize").val(filesize);
	$("#acfolderlevel").val(folderlevel);
	$("#acpreviewflag").val(previewflag);
	$("#accreateonlinefileflag").val(onlinefileflag);
	$("#acouterlinkflag").val(outerlinkflag);
	$("#acshowpbflag").val(showpbflag);
	//$("#acmydriveradmin").val(mydriveradminusername);
	$("#acmydriveradmin").val(mydriveradmin);
	$("#acmydriveradminuid").val(mydriveradmin);
	$("#acsharedate").val(sharedate);
	$("#acentfiletitle").val(entfiletitle);
	$("#acselffiletitle").val(selffiletitle);
	$("#acfilelabelnum").val(filelabelnum);
	$("#accommonlabelnum").val(commonlabelnum);
	$("#acsharenavbgcolor").val(sharenavbgcolor);
	$("#acsharenavfontcolor").val(sharenavfontcolor);
	$("#acsharenavlogo").val(sharenavlogo);
	$("#acsharenavtitle").val(sharenavtitle);
	
	if(previewflag=="0"){
	 	//可以预览
  	    previewFlagSw.changeStatus(true);
  	    $('#acpreviewflag').attr("checked",'checked');
	}else{
		previewFlagSw.changeStatus(false);
		$('#acpreviewflag').removeAttr("checked"); 
	}
	
	if(onlinefileflag=="0"){
	 	//可以新建在线文档
  	    fileFlagSw.changeStatus(true);
  	    $('#accreateonlinefileflag').attr("checked",'checked');
	}else{
		fileFlagSw.changeStatus(false);
		$('#accreateonlinefileflag').removeAttr("checked"); 
	}
	
	
	if(outerlinkflag=="0"){
	 	//可以新建在线文档
		outerlinkFlagSw.changeStatus(true);
  	    $('#acouterlinkflag').attr("checked",'checked');
	}else{
		outerlinkFlagSw.changeStatus(false);
		$('#acouterlinkflag').removeAttr("checked"); 
	}
	
	if(showpbflag=="0"){
	 	//可以新建在线文档
		showpbFlagSw.changeStatus(true);
  	    $('#acshowpbflag').attr("checked",'checked');
	}else{
		showpbFlagSw.changeStatus(false);
		$('#acshowpbflag').removeAttr("checked"); 
	}
	/*
	// 设置网盘管理员
		$("#acmydriveradmin").address({
	    valueType:1,//0 aliasname  / 1 uid  /2 uname  取值类型
	    separator:",",//逗号 空格……分隔符
	    inDialog:false,//是否在dialog内部
	    target:null//回填对象
    });
    */
		
		$("#acmydriveradmin").address({
	    	callback : function(){
				mydriverDeleteAddressItem();
	    	},
		    valueType:1,//0 aliasname  / 1 uid  /2 uname  取值类型
		    separator:" ",//逗号 空格……分隔符
		    inDialog:false,//是否在dialog内部
		    target:null,
		 	filter:{
		 		"addressType": "user",//地址簿类型
			    "isAdvMode": true,//是否启用高级模式
			    "addressSetting": {
			        "rootDetpId": "",
			        "isDisplayMap": false,
			        "isDisplayOtherMap": false,
			        "layerFrom": "",
			        "layerTo": "",
			        "range": "department|role|team",
			        "delimiter": ",",
			        "choiceType": "multiple",
			        "leafType": "user",//叶子节点类型，可选值：user:XXX，xx:XXX
			        "filterClass": ""//过滤事件
			    },
			    "sourceField": "USERNAME,UID",//字典的数据源字段
			    "targetField": "acmydriveradmin,acmydriveradminuid"//回填字段
		 	}
	    });
    $(".awsui-buttonedit-search").css("margin-top","10px");
    //$(".awsui-buttonedit-search").css("top","3px");

	//单项删除处理
	mydriverDeleteAddressItem();
    $(".updateMailBtn").off('click').on('click',function(){
    	openUpdateMailTemplate();
    });
}

function mydriverDeleteAddressItem(){
	$("#awsui-address-acmydriveradmin").find(".awsui-item-del").removeAttr("onclick").off("click").on("click",function(){
		//单项删除
		var div = $(this).parent();
		var deleteValue = div.attr("sourceid");
		var $input = $("#acmydriveradminuid");
		var inputValue = $input.val();
		var tempArr = inputValue.split(' ');
		var value = '';
		for (var i = 0; i < tempArr.length; i++) {
			if (tempArr[i] == deleteValue) continue;
			value += tempArr[i];
			if (i < tempArr.length - 1) {
				value += ' ';
			}
		}
		$("#acmydriveradminuid").val(value);
		deleteItem($(this));
		return false;
	});
}

//打开AC授权窗口
function openUpdateMailTemplate(){
	$.openSidebar({
		url: "./w?sid=" + sid + "&cmd=com.actionsoft.apps.addons.mail_GET_EMAIL_TEMPLATE_PAGE&id=" + templateId,
		title: "修改模板",
		closeText: "收起",
		width: "80%",
		isMode: true,
		duration: "slow",
		color: "#fff",
		iframeId: "templatePage"
	});
	return false;
	
}



function textkeyupfun(obj){
	obj.value=obj.value.replace(/\D/g,'');
}

 //保存管理员设置
function saveAdminConfigData(){
	var url = './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_save_admin_config';
	var capacity=$("#accapacity").val();
	var usercapacity=$("#acusercapacity").val();
	var filesize=$("#acfilesize").val();
	var folderlevel=$("#acfolderlevel").val();
	//var previewflag=$('input[name="acpreviewflag"]:checked').val();
    var previewflag=$("#acpreviewflag").prop("checked");
	var mydriveradmin=$("#acmydriveradminuid").val();
	var onlinefileflag=$("#accreateonlinefileflag").prop("checked");
	var outerlinkflag=$("#acouterlinkflag").prop("checked");
	var showpbflag=$("#acshowpbflag").prop("checked");

	var sharedate=$("#acsharedate").val();
	var entfiletitle=$("#acentfiletitle").val();
	var selffiletitle=$("#acselffiletitle").val();
	var filelabelnum=$("#acfilelabelnum").val();
	var commonlabelnum=$("#accommonlabelnum").val();
	var sharenavbgcolor=$("#acsharenavbgcolor").val();
	var sharenavfontcolor=$("#acsharenavfontcolor").val();
	var sharenavlogo=$("#acsharenavlogo").val();
	var sharenavtitle=$("#acsharenavtitle").val();
	
	if(onlinefileflag){
    	onlinefileflag="0";
    }else{
    	onlinefileflag="1";
    }
    if(previewflag){
    	previewflag="0";
    }else{
    	previewflag="1";
    }
    if(outerlinkflag){
    	outerlinkflag="0";
    }else{
    	outerlinkflag="1";
    }
    
    if(showpbflag){
    	showpbflag="0";
    }else{
    	showpbflag="1";
    }
    
    var userfoldercapacity=$("#acuserfoldercapacity").val();
    var entfoldercapacity=$("#acentfoldercapacity").val();
    
    if($.trim(folderlevel)==""){
		$.simpleAlert(文件夹层级 + 不允许为空);
		return false;
	}
    
    if($.trim(filelabelnum)==""){
		$.simpleAlert(文件标签个数 + 不允许为空);
		return false;
	}
   
    if($.trim(commonlabelnum)==""){
		$.simpleAlert(常用标签个数 + 不允许为空);
		return false;
	}
    
    if($.trim(filesize)==""){
		$.simpleAlert(单文件大小 + 不允许为空);
		return false;
	}
    
    if($.trim(sharedate)==""){
		$.simpleAlert(链接有效期 + 不允许为空);
		return false;
	}
    
    if($.trim(usercapacity)==""){
		$.simpleAlert(个人网盘总容量 + 不允许为空);
		return false;
	}
	
	if($.trim(userfoldercapacity)==""){
		$.simpleAlert(个人文件夹容量 + 不允许为空);
		return false;
	}
	
	if($.trim(entfoldercapacity)==""){
		$.simpleAlert(企业文件夹容量 + 不允许为空);
		return false;
	}
	
	var params={
		capacity:capacity,
		usercapacity:usercapacity,
		userfoldercapacity:userfoldercapacity,
		entfoldercapacity:entfoldercapacity,
		filesize:filesize,
		folderlevel:folderlevel,
		previewflag:previewflag,
		mydriveradmin:mydriveradmin,
		onlinefileflag:onlinefileflag,
		outerlinkflag:outerlinkflag,
		showpbflag:showpbflag,
		sharedate:sharedate,
		entfiletitle:entfiletitle,
		selffiletitle:selffiletitle,
		filelabelnum:filelabelnum,
		commonlabelnum:commonlabelnum,
		sharenavbgcolor:sharenavbgcolor,
		sharenavfontcolor:sharenavfontcolor,
		sharenavlogo:sharenavlogo,
		sharenavtitle:sharenavtitle
	};
	awsui.ajax.post(url, params, function(responseObject) {
		if(responseObject['result'] == 'ok'){
			//$.simpleAlert('保存成功','ok',2000,{model:true});
			var options = {
				title: 提示, content: 保存成功管理员设置刷新后生效是否刷新, onConfirm: function () {
					window.location.reload(true);
				}
			};
			$.confirm(options);

		}else{
			$.simpleAlert(responseObject['msg'], responseObject['result']);
		}
	}, 'json');
	return false;
}

function refreshUserCapacity() {
	renderUserCapacity();
}


function renderUserCapacity(){
	$(".left-set-panel").empty();
	var capstr="";
	capstr+="<span class='cap-icon'></span>";
	capstr+="<div class='captxt'>"+currentUsedSize+"M/"+allSize+"M"+"</div>";
	capstr+="<div class='outerpanel'>";
	capstr+="<div class='usedcls'></div>";
	capstr+="<div class='allcls'></div>";
	capstr+="</div>";
	$(".left-set-panel").append(capstr);
	
	var outwidth=$(".outerpanel").width();
	var pernum=currentUsedSize*outwidth/allSize;
	$(".usedcls").css("width",pernum+"px");
	$(".allcls").css("width",(outwidth-pernum)+"px");
	
	if(parseFloat(currentUsedSize)>=parseFloat(allSize)){
		$.simpleAlert(您的网盘容量已经使用完毕 + "！", "warning");
		showUploadBtnFlag="0";
		showNewFolderBtnFlag="0";
		showNewOnlineFileFlag="0";
		chargeAllNewBtnVisible();
		//$(".tool-btn-newdir").hide();
		//$(".tool-btn-upload").hide();
	}
}

function  chargeDriverCapacity(){
	if(parseFloat(mydriverUsedSize)>=parseFloat(mydriverAllSize)){
		awsui.MessageBox.alert(提示, 网盘总空间已经使用完毕 + '，' + 请联系管理员 + '！');
		showUploadBtnFlag="0";
		showNewFolderBtnFlag="0";
		showNewOnlineFileFlag="0";
		chargeAllNewBtnVisible();
		//$(".tool-btn-newdir").hide();
		//$(".tool-btn-upload").hide();
	}
}

function checkFilePermit(){
	var url = './jd?sid=' + sid + '&cmd=com.actionsoft.apps.cms_charge_manage_module&t='+Math.random();
	awsui.ajax.post(url,{moduleId:nowSelectModule}, function(responseObject) {
		if(responseObject['result'] == 'ok'){
			
		}else{
			$.simpleAlert(responseObject['msg'], responseObject['result']);
		}
	}, 'json');
}


function getFileLogMsg(fileId){
	 var url = './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_get_file_log_data';
	awsui.ajax.post(url, {fileId:fileId}, function(responseObject) {
		if(responseObject['result'] == 'ok'){
			  logList = responseObject["data"]['logList'];
			  showFileLogView(logList);
		}else{
			$.simpleAlert(responseObject['msg'], responseObject['result']);
		}
	}, 'json');
}

function showFileLogView(logList){
	$("#logAttr").empty();
    $("#logAttr").append("<ul class='logmessage-list-header'></ul><div class='logmessage-list'></div>");
	var headerstr = "<li class='w10'>" + 序号 + "</li><li  class='w10'>" + 类型 + "</li><li class='w30'>" + 描述 + "</li><li  class='w20'>" + 操作人 + "</li><li  class='w30'>" + 操作时间 + "</li>";
	$(".logmessage-list-header").append(headerstr);
    var tablestr="";
    if(logList.length!=0){
		for(var i = 0;i< logList.length;i++){
			var messageinfo = logList[i];
			var fileId=messageinfo["sourceId"];
			
			tablestr += '<ul  class="logmessage-list-row">';
			tablestr += '<li  class="w10">'+(i+1)+'</li>';
			tablestr += '<li  class="w10 centeralign">'+messageinfo["logtype"]+'</li>';
			tablestr += '<li  class="w30 leftalign"  awsui-qtip=" '+messageinfo["optComment"]+'">'+messageinfo["optComment"]+'</li>';
			tablestr += '<li  class="w20 centeralign">'+messageinfo["optUser"]+'</li>';
			tablestr += '<li  class="w30 centeralign">'+messageinfo["logTime"]+'</li>';
			tablestr += '</ul>';		
		}
	}else{
		tablestr += '<div class="apps-no-record"><span>暂无数据</span></div>';
	}
	$(".logmessage-list").append(tablestr);
	 
	var h1=$("#logAttr").height();
	$(".logmessage-list").css("height","260px");
}




function getFileSharelinkMsg(fileId){
	 var url = './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_get_file_sharelink_data';
	awsui.ajax.post(url, {fileId:fileId}, function(responseObject) {
		if(responseObject['result'] == 'ok'){
			  linkList = responseObject["data"]['linkList'];
			  showFileSharelinkView(linkList);
		}else{
			$.simpleAlert(responseObject['msg'], responseObject['result']);
		}
	}, 'json');
}

function showFileSharelinkView(linkList){
	$("#shareAttr").empty();
    var tablestr="";
    if(linkList.length!=0){
        $("#shareAttr").append("<div class='sharemessage-list'></div>");
//        $("#shareAttr").append("<ul class='sharemessage-list-header'></ul><div class='sharemessage-list'></div>");
//        var  headerstr="<li  class='w20'>分享人</li><li  class='w30'>分享时间</li><li  class='w20'>有效期</li><li class='w30'>操作</li>";
//	     $(".sharemessage-list-header").append(headerstr);
		for(var i = 0;i< linkList.length;i++){
			var messageinfo = linkList[i];
			var fileId=messageinfo["sourceId"];
			var QrCodeUrl=messageinfo["QrCodeUrl"];
			tablestr += '<div class="each-share-row">';
			tablestr += '<ul  class="sharemessage-list-row">';
			tablestr += '<li  class="w70 leftalign">' + messageinfo["sourceOwner"] + 分享于 +
				'：' + messageinfo["shareTime"] + "，" + 有效期至 + "：" + messageinfo["deadLine"];
			tablestr += '<li  class="w30 shareopli"><a sourceid="' + fileId + '" shareid="' + messageinfo["id"] + '" href="javascript:void(0);" class="cancelAcls">' + 取消分享linkshare + '</a>&nbsp;&nbsp;';
			tablestr += '<a sourceid="' + fileId + '" shareid="' + messageinfo["id"] + '" href="javascript:void(0);" class="accessAcls">' + 访问记录 + '</a>&nbsp;&nbsp;';
			tablestr += '<a sourceid="' + fileId + '" shareid="' + messageinfo["id"] + '"  remindflag="' + messageinfo["remindFlag"] + '" qrcodeurl="' + QrCodeUrl + '"    deadline="' + messageinfo["deadLine"] + '" href="javascript:void(0);" class="updateShareAcls">' + 修改 + '</a>';
			tablestr += '</li>';		
			tablestr += '</ul>';		
			var linkurl=messageinfo["shareLink"]+" 提取密码："+messageinfo["sharePwd"];
			tablestr += '<ul  class="sharemessage-listlink-row" linkurl="'+linkurl+'">';
			tablestr += '<li  class="w90 leftalign linkli" style="" title="' + messageinfo["shareLink"] + '">' + messageinfo["shareLink"] + " " + 提取密码 + " ：" + messageinfo["sharePwd"];
			//tablestr += '<input type="hidden" value="'+messageinfo["shareLink"]+" 提取密码："+messageinfo["sharePwd"]+'" class="cancopytxt"/>';
			tablestr += '</li>';
			tablestr += '<li  class="w10 leftalign copybtnli" style="cursor:pointer;color:blue;" title="'+messageinfo["shareLink"]+'">';
			tablestr += '<span style="display:none;">' + 点击复制 + '</span>';
			tablestr += '<div style="display:block;">' + 点击复制 + '</div>';
			tablestr += '</li>';
			tablestr += '</ul>';	
			tablestr += '</div>';	
		}
	    $(".sharemessage-list").append(tablestr);
	}else{
		tablestr += '<div class="apps-no-record"><span>' + 暂无数据 + '</span></div>';
		 $("#shareAttr").append(tablestr);
	}
	
		  
	//复制链接
	 if(myBrowser()=="IE"){
	    $(".linkli").off('click').on('click',function(){
//		  var t=$(this).find(".cancopytxt").val(); 
//	      t.select(); 
		  var t=$(this).text();
	  	  window.clipboardData.setData('text',t);
			$.simpleAlert(复制成功, 'ok');
	  	});
	    
	    $(".copybtnli").off('click').on('click',function(){
			  var t=$(this).prev().text();
		  	  window.clipboardData.setData('text',t);
			$.simpleAlert(复制成功, 'ok');
		  	});
	    
	    
	  } else{
	  	$(".sharemessage-listlink-row").bind("mouseenter",function(event){
	  		   $(this).find(".copybtnli").find("span").show();
	  		   $(this).find(".copybtnli").find("div").hide();
		       var clip2 = new ZeroClipboard($(this).find(".copybtnli"));
		 	   var selecttxt=$(this).find(".linkli").text(); 
		 	   clip2.setText(selecttxt);
		 	   clip2.on("copy", function(e){
				   $.simpleAlert(复制成功, 'ok');
				});
			event.stopPropagation();
		 	   return false;
		});
		 $(".sharemessage-listlink-row").find(".copybtnli").find("span").off('click').on('click', function () {
			 var clip = new ZeroClipboard($(this).find(".copybtnli"));
			 clip.on('error', function (event) {
				 $.simpleAlert(您的浏览器无法复制该链接请手动复制, 'warning');
				 ZeroClipboard.destroy();
			 });
		 });
		 
	  	
	  	$(".sharemessage-listlink-row").bind("mouseleave",function(event){
	  	      $(this).find(".copybtnli").find("span").hide();
 		      $(this).find(".copybtnli").find("div").show();
		 	  event.stopPropagation();
		 	  return false;
		});
	  
	  }
	  
	  $(".cancelAcls").click(function(){
	  	 //点击取消分享
	   var shareid = $(this).attr('shareid');
	   var sourceid = $(this).attr('sourceid');
		  var options = {
			  title: 提示, content: 取消分享后该条分享记录将被删除确定要取消分享吗, onConfirm: function () {
	   	cancelShareLink(shareid,sourceid);
	   	 }  };  $.confirm(options); 
	   return false;
	  });
	  
	   $(".accessAcls").click(function(){
	   	 var shareid = $(this).attr('shareid');
	   	 openAccessLogDlg(shareid);
	     return false;
	   });
	   
	   $(".updateShareAcls").click(function(){
	   	 var fileId = $(this).attr('sourceid');
	   	 var shareid = $(this).attr('shareid');
	   	 var remindFlag = $(this).attr('remindflag');
	   	 var deadLine = $(this).attr('deadline');
	   	 var QrCodeUrl = $(this).attr('qrcodeurl');
	   	 showUpdateShareDlg(fileId,shareid,remindFlag,deadLine,QrCodeUrl);
	     return false;
	   });
	  
	   
	var h1=$("#shareAttr").height();
	$(".sharemessage-list").css("height","290px");
}

function showUpdateShareDlg(fileId,shareId,remindFlag,deadLine,QrCodeUrl){
	 $("#file-shareupdate-dlg-content").empty();
	 
	 var sharestr="";
	 sharestr+="<table class='create-share-table'>";
	sharestr += "<tr><td>" + 有效日期 + "：</td><td><input type='text' value='" + deadLine + "' class='share-return-txt'  id='share-deadline' style='width:250px;'/></td></tr>";
	sharestr += "<tr><td>" + 发送通知给我 + "：</td><td><input type='checkbox' class='js-switch' id='remindflagExt' name='remindflagExt' checked value='0'/></td></tr>";
	 sharestr+="</table>";
	 
    var linkShareStr="";
	linkShareStr+="";
	linkShareStr+="";
	linkShareStr+='<div id="easy-outer-nav-link-update" class="easy-outer-nav-link">';
	linkShareStr+='         <ul id="easy-tab-nav-link-update"  class="easy-tab-nav-link">';
	linkShareStr += '            <li class="current">' + 链接分享 + '</li>';
	linkShareStr += '            <li>' + 二维码 + '</li>';
	if(mailcanuseflag=="1"){
		linkShareStr += '            <li>' + 邮件 + '</li>';
	}
	linkShareStr+='         </ul>';
	linkShareStr+='         <div id="easy-content-nav-link-update" class="easy-content-nav-link">';
	linkShareStr+='	         <div style="display:block;" class="nav-config-panel" id="linkSharePanelUpdate">';
	linkShareStr+=sharestr;
	linkShareStr+='	         </div> ';
	linkShareStr+='	         <div class="nav-config-panel" id="qrCodePanelUpdate" style="text-align:center;"><img src="'+QrCodeUrl+'" width="160" height="160"/></div> ';
	if(mailcanuseflag=="1"){
	linkShareStr+='		     <div class="nav-config-panel" id="mailInfoUpdate">';
		linkShareStr += '		      <h3 style="height:40px;line-height:40px;"><font>' + 输入邮箱进行共享 + '</font></h3>';
		linkShareStr += '		         <input type="text" value="" placeholder="example@actionsoft.com.cn ' + 多个账号用分号隔开 + '" class="awsui-textbox" id="emailAddressUpdateInput"/>';
		linkShareStr += '		         <span class="button blue sendMailUpdateBtn" >' + 发送 + '</span>';
	linkShareStr+='		     </div>';
	}
	linkShareStr+='       </div>';
	linkShareStr+=' </div>';
    $("#file-shareupdate-dlg-content").append(linkShareStr);
    easyTabInit("easy-tab-nav-link-update","easy-content-nav-link-update");
	//是否发送访问提醒
	var preopt = {ontext: 发送, offtext: 不发送, swwidth: 150, swheight: 20, fontSize: 13};
    remindFlagSwExt = $('#remindflagExt').switchButton(preopt); 
	$("#remindflagExt").val(remindFlag);
	if(remindFlag=="0"){
	 	//允许提醒
		remindFlagSwExt.changeStatus(true);
  	    $('#remindflagExt').attr("checked",'checked');
	}else{
		remindFlagSwExt.changeStatus(false);
		$('#remindflagExt').removeAttr("checked"); 
	}
	$(".sendMailUpdateBtn").off('click').on('click',function(){
		 var mailAddress=$("#emailAddressUpdateInput").val();
		 sendMail(mailAddress,shareId);
	});
	
	$("#emailAddressUpdateInput").keydown(function(e) {
		var eCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
		if (eCode == 13) {
			 var mailAddress=$("#emailAddressUpdateInput").val();
			 sendMail(mailAddress,shareId);
		}
	});
	
	$("#share-deadline").off('click').on('click',function(){
		  //渲染截止日期
		  WdatePicker({
		 	el: 'share-deadline',
            isShowClear: false,
            readOnly: true,
            dateFmt: "yyyy-MM-dd",
			skin: 'twoer'
           });
	     });
			
    $("#file-shareupdate-dlg").dialog({
		title: 分享信息修改, model: true, draggable: true, width: 650, height: 320,
		buttons: [
			{
				text: 保存, cls: "blue", handler: function () {
				var deadline = $("#share-deadline").val();
				var remindFlag=$("#remindflagExt").prop("checked");
				updateShareInfo(shareId,deadline,remindFlag,"1",fileId);
				$("#file-shareupdate-dlg").dialog("close");
		    }},
			{
				text: 关闭, handler: function () {
				$("#file-shareupdate-dlg").dialog("close");
			}}
		]
	});
	
}

function sendMail(mailAddress,shareId){
	$.simpleAlert(正在发送, "loading");
	   //发送邮件
	    var url = './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_send_mail';
		awsui.ajax.post(url, {mailAddress:mailAddress,shareId:shareId}, function(responseObject) {
			$.simpleAlert("close");
			if(responseObject['result'] == 'ok'){
				$.simpleAlert(发送成功, 'ok', 2000, {model: true});
			}else{
//				$.simpleAlert(responseObject['msg'], responseObject['result']);
				$.simpleAlert(发送失败, 'error', 2000, {model: true});
			}
		}, 'json');
		
	}


//取消分享
function cancelShareLink(sourceIds,fileId){
	//请求数据
		$.ajax({
			type : "POST",
			async:true,
			url : './jd?sid='+sid+'&cmd=com.actionsoft.apps.mydriver_cancelsharedirorfile&t='+Math.random(),  
			data :{"sourceIds":sourceIds},
			dataType:'json',
			success : function(response){
				var msg = response.msg;
				if (response.result!='ok') {
					$.simpleAlert(msg,'warning',2000,{model:true});
					return false;
				}else{
					$.simpleAlert(取消分享成功, 'ok', 2000, {model: true});
					getFileSharelinkMsg(fileId);
				}
			}
		});
}
 
 
 function openAccessLogDlg(shareId){
	getAccessLogMsg(shareId);
	$("#msg-access-dlg").dialog({
		title: 链接访问记录,
		model:true,draggable:false,width:700,height:450,
		buttons:[{
			text: 关闭, handler: function () {
				$("#msg-access-dlg").dialog("close");
			}}
		]
	});
}

function getAccessLogMsg(shareId){
	 var url = './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_get_access_log_data';
	awsui.ajax.post(url, {shareId:shareId}, function(responseObject) {
		if(responseObject['result'] == 'ok'){
			  var accessLogList = responseObject["data"]['logList'];
			  showAccessLogView(accessLogList);
		}else{
			$.simpleAlert(responseObject['msg'], responseObject['result']);
		}
	}, 'json');
}

function showAccessLogView(accessLogList){
	$("#msg-access-dlg-content").empty();
    $("#msg-access-dlg-content").append("<ul class='accessmessage-list-header'></ul><div class='accessmessage-list'></div>");
	var headerstr = "<li class='w10'>" + 序号 + "</li><li  class='w20'>" + 用户 + "</li><li  class='w20'>" + 类型 + "</li><li class='w20'>" + 访问时间 + "</li><li  class='w30'>" + 访问ip + "</li>";
	$(".accessmessage-list-header").append(headerstr);
    var tablestr="";
    if(accessLogList.length!=0){
		for(var i = 0;i< accessLogList.length;i++){
			var messageinfo = accessLogList[i];
			var fileId=messageinfo["sourceId"];
			
			tablestr += '<ul  class="accessmessage-list-row">';
			tablestr += '<li  class="w10">'+(i+1)+'</li>';
			tablestr += '<li  class="w20 leftalign">'+messageinfo["createUser"]+'</li>';
			tablestr += '<li  class="w20 leftalign">'+messageinfo["logType"]+'</li>';
			tablestr += '<li  class="w20 centeralign">'+messageinfo["createTime"]+'</li>';
			tablestr += '<li  class="w30 centeralign">'+messageinfo["ip"]+'</li>';
			tablestr += '</ul>';		
		}
	}else{
		tablestr += '<div class="apps-no-record"><span>' + 暂无数据 + '</span></div>';
	}
	$(".accessmessage-list").append(tablestr);
	 
	var h1=$("#msg-access-dlg-content").height();
	$(".accessmessage-list").css("height","295px");
}


function getOwnerAcData(fileId){
    var params={
    	fileId:fileId
    };
	var url = './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_get_owner_aclist';
	awsui.ajax.post(url, params, function(responseObject) {
		if(responseObject['result'] == 'ok'){
			var userModelList = responseObject["data"]['userModelList'];
			renderOwnerAcData(userModelList);
	}else{
			$.simpleAlert(responseObject['msg'], responseObject['result']);
		}
	}, 'json');
}


function getViewerAcData(fileId){
    var params={
    	fileId:fileId
    };
	var url = './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_get_viewer_aclist';
	awsui.ajax.post(url, params, function(responseObject) {
		if(responseObject['result'] == 'ok'){
			var userModelList = responseObject["data"]['userModelList'];
			renderViewerAcData(userModelList);
	}else{
			$.simpleAlert(responseObject['msg'], responseObject['result']);
		}
	}, 'json');
}

function renderOwnerAcData(userModelList){
	$("#ac-panel-owner").empty();
    var tablestr="";
    if(userModelList.length!=0){
	    $("#ac-panel-owner").append("<ul class='acdata-list-header'></ul><div class='acdata-list'></div>");
		var headerstr = "<li class='w10'>" + 序号 + "</li><li  class='w20'>" + 类型 + "</li><li class='w70'>" + 名称 + "</li>";
		$(".acdata-list-header").append(headerstr);
		for(var i = 0;i< userModelList.length;i++){
			var messageinfo = userModelList[i];
			if(i==(userModelList.length-1)){
				tablestr += '<ul  class="acdata-list-row"  style="border-bottom:none;">';
			}else{
				tablestr += '<ul  class="acdata-list-row">';
			}
				tablestr += '<li  class="w10">'+(i+1)+'</li>';
				tablestr += '<li  class="w20 centeralign">'+messageinfo["type"]+'</li>';
				tablestr += '<li  class="w70 leftalign"  title="'+messageinfo["name"]+'">'+messageinfo["name"]+'</li>';
				tablestr += '</ul>';		
		}
	  $("#ac-panel-owner").append(tablestr);
	}
}

function renderViewerAcData(userModelList){
	$("#ac-panel-viewer").empty();
    var tablestr="";
    if(userModelList.length!=0){
	    $("#ac-panel-viewer").append("<ul class='acdata-list-header'></ul><div class='acdata-list'></div>");
		var headerstr = "<li class='w10'>" + 序号 + "</li><li  class='w20'>" + 类型 + "</li><li class='w70'>" + 名称 + "</li>";
		$(".acdata-list-header").append(headerstr);
		for(var i = 0;i< userModelList.length;i++){
			var messageinfo = userModelList[i];
			if(i==(userModelList.length-1)){
				tablestr += '<ul  class="acdata-list-row"  style="border-bottom:none;">';
			}else{
				tablestr += '<ul  class="acdata-list-row">';
			}
			//tablestr += '<ul  class="acdata-list-row">';
			tablestr += '<li  class="w10">'+(i+1)+'</li>';
			tablestr += '<li  class="w20 centeralign">'+messageinfo["type"]+'</li>';
			tablestr += '<li  class="w70 leftalign"  title="'+messageinfo["name"]+'">'+messageinfo["name"]+'</li>';
			tablestr += '</ul>';		
		}
	  $("#ac-panel-viewer").append(tablestr);
	}
}

function getFileShareAcData(fileId){
    var params={
    	fileId:fileId
    };
	var url = './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_get_share_aclist';
	awsui.ajax.post(url, params, function(responseObject) {
		if(responseObject['result'] == 'ok'){
			var userModelList = responseObject["data"]['userModelList'];
			renderShareAcData(userModelList);
	}else{
			$.simpleAlert(responseObject['msg'], responseObject['result']);
		}
	}, 'json');
}


function renderShareAcData(userModelList){
	$("#ac-panel").empty();
    var tablestr="";
    if(userModelList.length!=0){
	    $("#ac-panel").append("<ul class='acdata-list-header'></ul><div class='acdata-list'></div>");
		var headerstr = "<li class='w10'>" + 序号 + "</li><li  class='w20'>" + 类型 + "</li><li class='w70'>" + 名称 + "</li>";
		$(".acdata-list-header").append(headerstr);
		for(var i = 0;i< userModelList.length;i++){
			var messageinfo = userModelList[i];
			
			tablestr += '<ul  class="acdata-list-row">';
			tablestr += '<li  class="w10">'+(i+1)+'</li>';
			tablestr += '<li  class="w20 centeralign">'+messageinfo["type"]+'</li>';
			tablestr += '<li  class="w70 leftalign" title="'+messageinfo["name"]+'">'+messageinfo["name"]+'</li>';
			tablestr += '</ul>';		
		}
	  $("#ac-panel").append(tablestr);
	}
}


function previewMyFile(fileId,fileType,canPreviewFlag,canDownloadFlag,fileName,filesize) {
	
	//文件不允许预览
	if(canPreviewFlag!=undefined && canPreviewFlag=='0'){
		 $("#previewpanel").empty();
//		 var useUrlPreviewType="pdf,bpm,jpg,jpeg,png,gif,ico";
		 var useUrlPreviewType="bmp,jpg,jpeg,tif,tiff,gif,png,ico";
		 if(useUrlPreviewType.indexOf(fileType)!=-1  ){
			   var url = './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_preview_office_file';
			   var params={ fileId:fileId  };
			 $.simpleAlert(加载提示, "loading");
         	   awsui.ajax.post(url, params, function(responseObject) {
        			if (responseObject['result'] == 'ok') {
        				$.simpleAlert("close");
        				var url = responseObject["data"]['url'];
        				$('#previewpanel').empty();
        				$('#previewpanel').append("<iframe frameBorder='0' class='previewfrm' id='previewfrm'  allowfullscreen='true' allowtransparency='true'  ></iframe>");
        				if(responseObject.data.isImg === true){
        					$('#previewfrm').attr("src", './w?sid='+sid+'&cmd=com.actionsoft.apps.mydriver_preview_file_url_img&fileId='+fileId);
        				}else{
        					$('#previewfrm').attr("src", responseObject.data.url);
        				}
        				$("#fslistbtn").hide();
        				$("#fsrefreshbtn").hide();
        			} else {
        				$.simpleAlert(responseObject['msg'], responseObject['result']);
        			}
		      }, 'json');
         	   return false;
        	
         }else{
	 			//判断文件类型，只有部分类型文件支持预览
				 if(canPreviewType.indexOf(fileType)!=-1){
//					 $.simpleAlert("文件正在加载，请稍侯...", "loading");
					    var params={
					    	fileId:fileId
					    };
						var url = './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_preview_office_file';
						awsui.ajax.post(url, params, function(responseObject) {
							if(responseObject['result'] == 'ok'){
					            var url = responseObject["data"]['url'];
					            //window.open(url);
					            $("#previewpanel").empty();
					            if(fileType=="md"){
					            	$("#previewpanel").append("<iframe class='previewfrm' id='previewfrm' frameborder='no' border='0' scrolling='no'></iframe>");
					            	$("#previewfrm").attr("src",url);
					            	$("#previewpanel").css("overflow","hidden");
									//$("#previewpanel").css("padding-bottom","70px");
					            	
					            	$("#fslistbtn").hide();
					            	$("#fsrefreshbtn").hide();
					            }else{
					            	$("#previewpanel").append("<iframe class='previewfrm' id='previewfrm' frameborder='no' border='0'   allowfullscreen='true' allowtransparency='true' ></iframe>");
					            	$("#previewfrm").attr("src",url);
//					            	var iframemy = document.getElementById("previewfrm");      
//							        if (iframemy.attachEvent) {      
//							        	iframemy.attachEvent("onload", function() { 
//											 $.simpleAlert("close");
//							            });      
//							        } else {      
//							        	iframemy.onload = function() {  
//		 									 $.simpleAlert("close");
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
					            
						    }else{
						    	 $("#previewpanel").empty();
								 var str="";
								 str+="<div class='unpreview-panel'>";
	//							 str+="<span class='file_icon_v file-type-rar_v'></span>";
								 str+="<span class='unpreview-panel-text'><table style='width:auto;height:100%;margin:0px 25px;'><tr><td>"+fileName+"</td></tr></table></span>";
								 str+="<hr style='border:none;color:#202428;'/>";
								 str+="<div class='unpreview-panel-text-type'>"+fileType+"</div>";
								 str+="<div class='unpreview-txt'></div>";
								 if(canDownloadFlag!=undefined && canDownloadFlag=='0'){
									 str += "<div class='unpreview-download-btn button blue'>" + 下载文件 + "（" + filesize + "）</div>";
								 }
								 str+="</div>";
								 $("#previewpanel").append(str);
								$.simpleAlert(文件转换失败, responseObject['result']);
								
								 $(".unpreview-download-btn").click(function(){
									 singledownload(fileId);
								 });
								 
								 $("#fslistbtn").hide();
								 $("#fsrefreshbtn").hide();
							}
						}, 'json');
						
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
						 str += "<div class='unpreview-download-btn button blue'>" + 下载文件 + "（" + filesize + "）</div>";
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
			 str += "<div class='unpreview-download-btn button blue'>" + 下载文件 + "（" + filesize + "）</div>";
		 }
		 str+="</div>";
		 $("#previewpanel").append(str);
		 $("#fslistbtn").hide();
		 $("#fsrefreshbtn").hide();
	}
	 $(".unpreview-download-btn").click(function(){
		 singledownload(fileId);
	 });
	 
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
	 var zhezhao=$("#fullscreenpanel"); 
	 $("#fullscreenpanel").show();
	 $("#previewpanel").show();
	 $("#fsattrpanel").show();
	 $("#fstoolbar").show();
	 
	 var prewidth=$("#fullscreenpanel").width()-$("#fsattrpanel").width();
	 $("#previewpanel").css("width",prewidth+"px");
	 $("body").css("overflow","hidden");
	 
	 /*
	 var tooltitleWidth=$("#fstoolbar").width()-330;
	 $(".toolbar-title").css("width",tooltitleWidth+"px");

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
	
	
	 
	 
	 if(canDownloadFlag!=undefined && canDownloadFlag=='1'){
		 $("#fsdownloadbtn").hide();
	 }else if(canDownloadFlag!=undefined && canDownloadFlag=='0'){
		 $("#fsdownloadbtn").show();
	 }else{}
	 
	 //下载按钮
	 $("#fsdownloadbtn").off('click').on('click',function(){
    	 var sourceFileName=fileName;
	     var fileType = sourceFileName.lastIndexOf(".");
		 var fileSuffix = sourceFileName.substr(fileType).toLowerCase();
		 var fileSubType = sourceFileName.substr(fileType+1).toLowerCase();
		 var onlinedoctype=supportOfficeType;
	 	 
	 	 if(canPreviewFlag=="1"){
	 	 	 singledownload(fileId);
	 	 }else{
	    	 if(onlinedoctype.indexOf(fileSubType)!=-1){
			 	//文件类型图标
				var fileIcon = getFileSuffixIcon(sourceFileName.substr(fileType)); 
				var filePdf = sourceFileName.substr(0,sourceFileName.lastIndexOf("."))+".pdf";
			
			    $("#online_sourcefilename").html(sourceFileName);
			    $("#online_pdffilename").html(filePdf);
			    $("#sourceFileSize").html(filesize);
			    $("#pdfdownloadurl").attr("download",document.getElementById("previewfrm").contentWindow.url);
			    $("#pdfdownloadurl").attr("href",document.getElementById("previewfrm").contentWindow.url);
			    var pdfFileSize=formatSize(document.getElementById("previewfrm").contentWindow.fileSize);
			    $("#pdfFileSize").html(pdfFileSize);
			 	$("#sourcedownloadurl").off('click').on('click',function(){
			 		 singledownload(fileId);
			    }); 
			    $("#online_file_pdffile").off('click').on('click',function(){
			 		// window.open(document.getElementById("previewfrm").contentWindow.url);
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
	 //右侧评论
	 /**
	  * 隐藏评论
	  */
	 var prewidth=$("#fullscreenpanel").width();
	 $("#previewpanel").css("width","100%");
	 $("#previewpanel").css("right","0px");
	 $("body").css("overflow","hidden");
	 $("#fsattrpanel").css("display","none");
	 /*
     $("#fsattrpanel").css("display","none");
	 showFSCommentPanel(fileId);
	 $("#fsshowcommentbtn").off('click').on('click',function(){
		 showFSCommentPanel(fileId);
	 });
	 */
	 $("#fsclosebtn").click(function(){
		 closeFsPanel();
		 $.simpleAlert("close");
	 });
	 
	 $('#filepre_back').click(function () {
		 closeFsPanel();
		 $.simpleAlert("close");
	});
	
	 
	 //左侧预览
	 previewMyFile(fileId,fileType,canPreviewFlag,canDownloadFlag,fileName,filesize);
	
}

function showDownloadPopbox(){
		renderCapPopboxData();
	
}

function closeFsPanel(){
	 $("#fullscreenpanel").hide();
	 $("#previewpanel").hide();
	 $("#fsattrpanel").hide();
	 $("#fstoolbar").hide();
}




function showFSCommentPanel(sourceId){
	defautltReplyPageSize=20;
	replyCounts=0;
	replyCurCounts=0;
	replyCurrentLen=0;
	if($("#fsattrpanel").is(":visible") == false){
		$("#fsattrpanel").show("100");
		$("#fsreplypanel").empty();
		$("#fsreplypanel").append("<div class='fs-reply-box'></div><div class='fs-reply-list'></div>");
		var addreplystr="<div class='fs-reply-title' >写下你的看法:</div>";
		addreplystr+="<div class='fs-reply-panel'><textarea   class='txt emotion fs-replycontent' id='fscontent'  maxlength='5000'></textarea>";
		addreplystr+="<input type='button' class='button blue fs-reply-add-btn' onclick=addFSFileReply('"+sourceId+"'); value='提交'/>";
		addreplystr+="</div>";
		$(".fs-reply-box").append(addreplystr);
		
		loadFSCommentData(sourceId,0,defautltReplyPageSize);
		var prewidth=$("#fullscreenpanel").width()-360;
		$("#previewpanel").css("width",prewidth+"px");
		$("#previewpanel").css("right","360px");
		$("body").css("overflow","hidden");
		$("#fsshowcommentbtn").attr("awsui-qtip","隐藏评论");
	}else{
		$("#fsattrpanel").hide("100");
		var prewidth=$("#fullscreenpanel").width();
		$("#previewpanel").css("width",prewidth+"px");
		$("#previewpanel").css("right","0px");
		$("body").css("overflow","hidden");
		$("#fsshowcommentbtn").attr("awsui-qtip","显示评论");
	}
	

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
	                     replystr+="            <span style='margin-right: 10px;'>&nbsp;<a onclick=deleteFSReply('"+msgid+"','"+replyid+"'); class='name fs-reply-op-cls'>删除</a></span>";
	                     }
					     replystr+='        </div>';
					     replystr+='        <div class="fs-replye-data-middle" style="word-break:break-all;word-wrap:break-word;"><p>'+replycontent+'</p><input type="hidden" id="reply'+replyid+'" value="'+replycontent+'"/></div>';
					     replystr+='    </div>';
					     replystr+='</div>';
	            }
			  }else{
			  	 replystr+="<div class='fs-nodata'>做第一个回复者吧！</div>";
			  }
			  $(".fs-reply-list").append(replystr);
			  
		      //分页信息
			    var size=20;
				if ( replyCurCounts>=size  && replyCurCounts < replyCounts  ) {
					replyMore = $("<div  class='fs-list_load_more'>加载更多...</div>");
					$(".fs-reply-list").append(replyMore);
					replyMore.click(function(e) {
						loadFSCommentData(messageid,"",defautltReplyPageSize);
						$(this).remove();
					});
				}
				
				if(myBrowser()!="Chrome"){
					$(".fs-reply-list").css("padding-bottom","70px");
				}else{
					$(".fs-reply-list").css("padding-bottom","10px");
				}
			    
 			
	}

	//添加回复
	function addFSFileReply(sourceId){
	    var content=$("#fscontent").val();
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
					 $("#fscontent").val("");
					 $(".fs-reply-list").empty();
					 loadFSCommentData(sourceId,0,defautltReplyPageSize);
					
			}else{
				$.simpleAlert(responseObject['msg'], responseObject['result']);
			}
		}, 'json');
		
	}

	//删除回复
	function deleteFSReply(sourceId,commentId){
		var options = {
			title : "提示",
			content : "确定要删除该条评论吗？",
			onConfirm : function() {
					var params = {
						sourceId:sourceId,
						commentId:commentId
					};
					var url = './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_delete_reply_by_id';
					awsui.ajax.post(url, params, function(responseObject) {
						if(responseObject['result'] == 'ok'){
							     replyCounts = 0;
						         replyCurCounts = 0;
								 $("#fscontent").val("");
								 $(".fs-reply-list").empty();
								 loadFSCommentData(sourceId,0,defautltReplyPageSize);
						}else{
							$.simpleAlert(responseObject['msg'], responseObject['result']);
						}
					}, 'json');
					 
			}
		};
		$.confirm(options); 
	}

