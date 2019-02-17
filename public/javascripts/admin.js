let nodeIds, nodesArray, nodes, edgesArray, edges, network, fromNodeUUID, toNodeUUID;

$(function () {
    createGraph();
    populateGraph();
});

$("#savenode").on("click", function () {
    if ($("input:hidden", "#node").val()) {
        $.post("/admin/updateNode", $("#node").serialize(), function (data) {
            populateGraph();
        });
    } else {
        $.post("/admin/addnode", $("#node").serialize(), function (data) {
            addNode(data);
        });
    }
    clearNodeForm();
});

$("#newnode").on("click", function () {
    clearNodeForm();
});

function clearNodeForm() {
    $("#node").trigger('reset');
    $("#node input[type=hidden]").val('');
}

function populateGraph() {
    $.get("/admin/graph", function (data) {
        populateFullGraph(data);
    });
}

function addNode(data) {
    preProcessNodeData(data);
    nodes.add(data.nodes[0]);
}

function populateFullGraph(data) {
    preProcessNodeData(data);
    nodesArray = data.nodes;
    edgesArray = data.edges;
    nodes.clear();
    edges.clear();
    nodes.add(nodesArray);
    edges.add(edgesArray);
}

function preProcessNodeData(data) {
    if (data == null || data.nodes == null) {
        return;
    }
    for (let node of data.nodes) {
        let label = node.name;
        node.name = node.label;
        node.label = label;
        node.id = node.uuid;
    }
}

function createGraph() {
    nodesArray = [];
    nodes = new vis.DataSet(nodesArray);

    edgesArray = [];
    edges = new vis.DataSet(edgesArray);

    let container = document.getElementById('graph');
    let data = {
        nodes: nodes,
        edges: edges
    };
    let options = {
        selectable: true,
        multiselect: true,
    };
    network = new vis.Network(container, data, options);
    network.setOptions({
        nodes: { shadow: true },
        edges: {
            shadow: true,
            arrows: {
                to: {
                    enabled: true, scaleFactor: 1, type: 'arrow'
                }
            }
        },
        interaction: {
            selectable: true,
            multiselect: true,
        },
    });
    network.on("click", function (params) {
        let currentUUID = this.getNodeAt(params.pointer.DOM);
        if(null == fromNodeUUID && null == toNodeUUID){
            fromNodeUUID = currentUUID;
        }else if(null != fromNodeUUID && null == toNodeUUID){
            toNodeUUID = currentUUID;            
        }else{
            fromNodeUUID = toNodeUUID;
            toNodeUUID = currentUUID;
        }
        populateNodeForm(currentUUID);
    });
}

function populateNodeForm(uuid) {
    $.post("/admin/getnodedata", { uuid: uuid }, function (data) {
        let node = data.nodes[0];
        $("#node input[name=name]").val(node.name);
        $("#node textarea[name=description]").val(node.description);
        $("#node textarea[name=example]").val(node.example);
        $("#node select[name=active]").val(node.active);
        $("#node input[name=uuid]").val(node.uuid);
        if(uuid == fromNodeUUID){
            $("#edge input[name=fromname]").val(node.name);
            $("#edge input[name=fromuuid]").val(node.uuid);
        }
        if(uuid == toNodeUUID){
            if($("#edge input[name=touuid]").val()){
                $("#edge input[name=fromname]").val($("#edge input[name=toname]").val());
                $("#edge input[name=fromuuid]").val($("#edge input[name=touuid]").val());
            }

            $("#edge input[name=toname]").val(node.name);
            $("#edge input[name=touuid]").val(node.uuid);
        }
    });
}

