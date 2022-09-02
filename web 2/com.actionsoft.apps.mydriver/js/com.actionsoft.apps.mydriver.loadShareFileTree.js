var folderLayerTree;
var sid ;
var selectedNode;
var folderid= window.parent.document.getElementById("sharefolderid").value;
$(document).ready(function(){
    folderid = window.parent.document.getElementById("sharefolderid").value;
	initFolderLayerTree();
});
//初始化文件层级树
function initFolderLayerTree(){
	//var folderid = parent.window.opener.document.getElementById("sharefolderid").value;
	sid = frmMain.sid.value;
	var dataUrl = './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_getsharefiletreejson';
	//相当于刷新树
	$("#folderLayerTree").html('');
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
	folderLayerTree = awsui.tree.init($("#folderLayerTree"), setting);
	registerEvent();
	folderLayerTree.resizeTree();
}
function buildChildNode(treeNode){
	var dataUrl = './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_getsharefiletreejson';
	var dataModel = {
		url:dataUrl,
		method:"POST",
		dataType:"text",
		params:{
			folderId:folderid,
			pid: treeNode.id
		}
	};
	if(treeNode.open != null){
		var result = folderLayerTree.getData(dataModel);
		folderLayerTree.buildChilren(result, treeNode);
	}
	registerEvent();
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
		
}
function selectNode(treeNode){
	selectedNode = treeNode;
}

function registerEvent(){
		
	var treeWidth=$("#folderLayerTree").width();
	$(".tree-items").each(function(i,ele){
		var fileId = $(ele).attr('tbindex');
		var rowname = $(ele).find('.txt-text').html();
		var nodetype = $(ele).find('.txt-text').attr("nodetype");
		var format = $(ele).find('.txt-text').attr("format");
		var canPreviewFlag = $(ele).find('.txt-text').attr("canPreviewFlag");
		var canDownloadFlag = $(ele).find('.txt-text').attr("canDownloadFlag");
		
	    var myObj= $(ele).find('.txt-text').offset();
	    var mytextWidth=$(ele).find('.txt-text').width();
	    var offetLeft = myObj.left;
	    var myWidth=treeWidth - offetLeft;
	    $("#folderLayerTree").css("overflow","scroll");
	    //分享给同事的文件都可以下载
		//if(canDownloadFlag!=undefined && canDownloadFlag=="0"){
			$(ele).find('.txt-op').off("click").on('click',function(){
				if (nodetype=="2") {
					parent.mutifiledownloadForDir(fileId,rowname);
				} else {
					parent.singledownload(fileId);
					return false;
				}
				return false;
			});
		//}
	});
 
	
	$("#folderLayerTree").find(".txt-text").click(function(){
		var nodetype = $(this).attr("nodetype");
		if (nodetype=="1") {
			var rowname = $(this).html();
			var fileId = $(this).attr("fileId");
			var format = $(this).attr("format");
			var canPreviewFlag = $(this).attr("canPreviewFlag");
			var downloadurl = $(this).attr("downloadurl");
			var canDownloadFlag = $(this).attr("canDownloadFlag");
			
			 var picType="bmp,jpg,jpeg,tif,tiff,gif,png,ico";
			 if( picType.indexOf(format.toLowerCase())!=-1){
			 	
		     }else{
		    	parent.showFullScreenPanel(fileId,rowname,format,canPreviewFlag,canDownloadFlag);
		     }
		}
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
	
}

function showdownbtn(obj){
	 $(obj).next().css("display","inline-block");
}

function hidedownbtn(obj){
	$(obj).next().css("display","none");
	
}
