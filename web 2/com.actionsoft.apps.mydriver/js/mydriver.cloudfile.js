var fileTree;
var sid;
var selectedfileTreeNode;
$(document).ready(function () {
	var winH = $(window).height();
	if(winH == 0){
		winH = $("body").height();
	}
	$("#fileTree").height(winH);
	initFileTree();
});

//初始化文件层级树
function initFileTree() {
	//sid = frmMain.sid.value;
	sid = $("#sid").val();
	var dataUrl = './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_load_cloud_tree_json';
	//相当于刷新树
	$("#fileTree").html('');
	var setting = {
		sort: true,
		checkbox: true,
		checkInherit: true,
		showIcon: true,
		dblClickToExpand: true,
		animate: true,
		remember: true,
		autoHeight: true,
		event: {
			beforeExpand: buildChildFileNode,
			onCheck: checkMyDriverFile,
			onClick: getSelectFileNode
		},
		dataModel: {
			url: dataUrl,
			method: "POST",
			dataType: "text",
			params: {
				folderId: ''
			}
		}
	};
	fileTree = awsui.tree.init($("#fileTree"), setting);
	//fileTree.resizeTree();
}

function expandChildNode(curNode) {
	var itemId = fileTree.config.treeObj.find("[tbindex='" + curNode.id + "']");
	fileTree.expandNode(itemId, true);
	var nodes = fileTree.getChildrenByPid(curNode.id);
	if (nodes.length > 0) {
		for (var j = 0; j < nodes.length; j++) {
			var node = nodes[j];
			if (node.nodetype == "2") {
				expandChildNode(node);
			}
		}
	}
}

function checkMyDriverFile(node) {
	var curNode = fileTree.getNodeById($(node).val());
	if ($(node).prop("checked")) {
		if (curNode.nodetype == "2") {
			expandChildNode(curNode);
		}
	}
	return false;
}

function getSelectFileNode(treeNode) {
	selectedfileTreeNode = treeNode;
}

function buildChildFileNode(treeNode) {
	if (!fileTree.exsitsChildren(treeNode.id)) {
		var sid = $('#sid').val();
		var dataUrl = './jd?sid=' + sid + '&cmd=com.actionsoft.apps.mydriver_load_cloud_tree_json';
		var dataModel = {
			url: dataUrl,
			method: "POST",
			dataType: "text",
			params: {
				dirId: treeNode.id
			}
		};
		if (treeNode.open != null) {
			var result = fileTree.getData(dataModel);
			if (treeNode.id == "0" && result.length == 1) {
				//空栏目的时候
				return false;
			} else {
				fileTree.buildChilren(result, treeNode);
			}
		}
	}
}

function getFiles() {
	var files = [];
	var nodes = fileTree.getCheckedNodes();
	if (nodes != undefined && nodes.length > 0) {
		var fileIds = [];
		var fileNames = [];
		for (var i = 0; i < nodes.length; i++) {
			var fileInfo = nodes[i];
			if (fileInfo.nodetype == "1") {
				//限制附件个数
				var file = {};
				file.fileId = fileInfo.id;
				file.fileName = fileInfo.name;
				file.fileSize = fileInfo.fileSize;
				file.cloudInfo = fileInfo.cloudInfo;
				file.cloudId = fileInfo.cloudId;
				file.cloudAppId = fileInfo.cloudAppId;
				files.push(file);
			}
		}
	}
	return files;
}
