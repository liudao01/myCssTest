	
var leftNavTree;	
//列表页windowresize
function resizeTree(){
	var treeH=$(".mydriver-left-tree").height()-40;
	$("#left-nav-tree").css("height",treeH+"px");
}

function loadLeftNavTree(){
	var treeH=$(".mydriver-left-tree").height()-40;
	$("#left-nav-tree").css("height",treeH+"px");
	$("#left-nav-tree").empty();
	var sid=$('#sid').val();
	var dataUrl= './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_load_nav_tree_json';
	var setting = {
		sort:true,
		checkInherit:true,
		showIcon : true,
		dblClickToExpand : true,
		animate : true,
		remember : true,
		autoHeight : true,
		dataModel : {
			url : dataUrl,
			method : "POST",
			dataType : "json"
		}, 
	 
		event : { 
			beforeExpand: buildChildFileNode,
			onClick:getSelectFileNode
		}
		
	}; 
	
	leftNavTree=awsui.tree.init($("#left-nav-tree"), setting); 
	$("#tree_icon_commonlabel").off("click").on("click",function(e){
		showLabelPanel();
		e.stopPropagation();
	});
	
}


function buildChildFileNode(treeNode){
	var pid=treeNode.id;
	if(treeNode.id=="recyclebin"){
		 //回收站
		 pid="";
	 }else if(treeNode.id=="configcenter"){
	    //管理员设置
		 pid="";
	 }else if(treeNode.id=="configcenter1"){
	    //管理员设置
		 pid="";
	 }else if(treeNode.id=="configcenter2"){
	    //管理员设置
		 pid="";
	 }else if(treeNode.id=="configcenter3"){
	    //管理员设置
		 pid="";
	 }else if(treeNode.id=="sharecenter"){
		 //分享中心
		 pid="";
	 }else if(treeNode.id=="usershare"){
		 //同事间分享
		 pid="";
	 }else if(treeNode.id=="linkshare"){
		 //链接分享
		 pid="";
	 }else if(treeNode.id=="commonlabel"){
		 //常用标签header
		 pid="";
	 }else if(treeNode.id=="labels"){
		 
	 }else if(treeNode.id=="files"){
		 
	 }else{
		 
	 }
	if (!leftNavTree.exsitsChildren(treeNode.id)) {
		var sid=$('#sid').val();
		var dataUrl = './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_load_nav_tree_json';
		var dataModel = {
			url:dataUrl,
			method:"POST",
			dataType:"text",
			params:{
				pid:pid
			}
		};
		if(treeNode.open != null){
			var result = leftNavTree.getData(dataModel);
			if(treeNode.id=="0" && result.length==1){
				//空栏目的时候
				return false;
			}else{
			    leftNavTree.buildChilren(result, treeNode);
			}
		}
	}
	resizeTree();
}

function renderTreeEvent(){
	return false;
	$(".left-nav-tree").off("click").on("click",function(e){
		//在关闭对话框的时候将新建的层隐藏
		if($(".all-new-panel-cls").is(":visible") == true){
			  $(".all-new-panel-cls").hide();
		}
	});
	
	
	$(".left-nav-tree").find(".tree-items").off("click").on("click",function(e){
		//在关闭对话框的时候将新建的层隐藏
		if($(".all-new-panel-cls").is(":visible") == true){
			  $(".all-new-panel-cls").hide();
		}
	});
}
function getSelectFileNode(treeNode){
	 selectedfileTreeNode=treeNode;
	 if(treeNode.id=="recyclebin"){
		 //回收站
		 changeNav(NAV_RECILEBIN);
	 }else if(treeNode.id=="configcenter"){
	    //管理员设置
		 return false;
	 }else if(treeNode.id=="configcenter1"){
	    //管理员设置 容量
	     changeNav(NAV_MONITOR);
	 }else if(treeNode.id=="configcenter2"){
	    //管理员设置 日志
	      changeNav(NAV_LOG);
	 }else if(treeNode.id=="configcenter3"){
	    //管理员设置  管理员
	     changeNav(NAV_ADMINCONFIG);
	 }else if(treeNode.id=="sharecenter"){
		 //分享中心
		 return false;
	 }else if(treeNode.id=="usershare"){
		 //同事间分享
		 //changeNav(NAV_SHAREME);
		 changeNav(NAV_MYSHARE);
	 }else if(treeNode.id=="linkshare"){
		 //链接分享
		 changeNav(NAV_LINKSHARE);
	 }else if(treeNode.id=="commonlabel"){
		 //常用标签header
	 }else if(treeNode.id.indexOf("eachlabel")!=-1){
	 	  //标签点击
		  changeNav("label_"+treeNode.name);
	 }else if(treeNode.id=="files"){
		 
	 }else if(treeNode.id=="root"){
		 changeNav(NAV_ALLFILE);
	 }else if(treeNode.id=="entroot"){
		  changeNav(NAV_ENTALLFILE);
	 }else{
	 	current_nav="allfile";
	 	inEntPath=0;
	 	if(treeNode.isEnt=="1"){
	 		current_nav="entallfile";
	 		inEntPath=1;
	 	}
		openDir(treeNode.id); 
	 }
	if($(".all-new-panel-cls").is(":visible") == true){
		  $(".all-new-panel-cls").hide();
	}
	
   //回收站
   if(current_nav!=NAV_RECILEBIN){
	   	 $(".tool-btn-cleanrecycle").hide();
	     $(".tool-btn-restoreall").hide();
   }
   
	 renderTreeEvent();
}