var folderLayerTree;
var sid ;
var selectedNode;
$(document).ready(function(){
	initFolderLayerTree();
});
//初始化文件层级树
function initFolderLayerTree(){
	sid = frmMain.sid.value;
	var dataUrl = './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_getfiletreejson';
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
				folderId:''
			}
		}
	};
	folderLayerTree = awsui.tree.init($("#folderLayerTree"), setting);
	folderLayerTree.resizeTree();
}
function buildChildNode(treeNode){
	var dataUrl = './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_getfiletreejson';
	var dataModel = {
		url:dataUrl,
		method:"POST",
		dataType:"text",
		params:{
			folderId: treeNode.id
		}
	};
	if(treeNode.open != null){
		var result = folderLayerTree.getData(dataModel);
		folderLayerTree.buildChilren(result, treeNode);
	}
}
function selectNode(treeNode){
	selectedNode = treeNode;
}
