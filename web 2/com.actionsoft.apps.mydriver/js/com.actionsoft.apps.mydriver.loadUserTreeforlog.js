var userLayerForLogTree;
var sid ;
var selectedNode;
$(document).ready(function(){
	initUserLayerForLogTree();
});
//初始化文件层级树
function initUserLayerForLogTree(){
	sid = frmMain.sid.value;
	var dataUrl = './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_getusertreejson';
	//相当于刷新树
	$("#userLayerTreeforlog").html('');
	var setting = {
		showIcon:true,
		dblClickToExpand:true,
		animate:true,
		remember:true,
		autoHeight:true,
		event:{
			//beforeExpand: buildChildNode,
			onClick: selectNode
		},
		dataModel:{
			url:dataUrl,
			method:"POST",
			dataType:"text",
			params:{
				userId:'root'
			}
		}
	};
	userLayerForLogTree = awsui.tree.init($("#userLayerTreeforlog"), setting);
	userLayerForLogTree.resizeTree();
}
function buildChildNode(treeNode){
	var dataUrl = './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_getusertreejson';
	var dataModel = {
		url:dataUrl,
		method:"POST",
		dataType:"text",
		params:{
			userId: treeNode.id
		}
	};
	if(treeNode.open != null){
		var result = userLayerForLogTree.getData(dataModel);
		userLayerForLogTree.buildChilren(result, treeNode);
	}
}
function selectNode(treeNode){
	selectedNode = treeNode;
}
