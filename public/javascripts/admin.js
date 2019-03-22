let nodesArray, nodes, edgesArray, edges, network, fromNodeUUID, toNodeUUID, content;
let view = 'incremental';
let nodeIds = [];
let edgeIds = [];
const rootUUID = "19257b55-210b-46ea-aea3-87f24d2faf60";
let currentNodeUUID = rootUUID;

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

$(function () {
    createGraph();
    populatePartialGraph(rootUUID);
    initCKEditor();
    $('.ui.radio.checkbox').checkbox();
    $('input[type=radio][name=view]').val(['incremental']);

    $.fn.serializeObject = function () {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };

});

function initCKEditor() {
    content = CKEDITOR.replace('content');
}

function populatePartialGraph(uuid) {
    $.post("/partialgraph", { uuid: uuid }, function (data) {
        addNodeAndEdge(data);
    });
    $.get("/admin/disconnectednodes", function (data) {
        addNodeAndEdge(data);
    });
}

function addNodeAndEdge(data) {
    preProcessNodeData(data);
    data.nodes.forEach(function (element) {
        nodes.add(element);
    });
    data.edges.forEach(function (element) {
        edges.add(element);
    });
}

$('input[type=radio][name=view]').change(function () {
    view = this.value;
    if (view == 'full') {
        populateGraph();
    } else if (view == 'incremental' || view == 'single') {
        clearNetwork();
        populatePartialGraph(rootUUID);
    }
});

function clearNetwork() {
    nodeIds.length = 0;
    edgeIds.length = 0;
    nodes.clear();
    edges.clear();
}

function clearPartialNetwork(nodeId) {
    nodeIds.splice(nodeIds.indexOf(nodeId), 1);
    nodes.remove(nodeIds);
    nodeIds.length = 0;
    nodeIds.push(nodeId);

    edgeIds.length = 0;
    edges.clear();
}

function removeNode(nodeId) {
    nodeIds.splice(nodeIds.indexOf(nodeId), 1);
    nodes.remove([nodeId]);
}

function removeEdge(edgeId) {
    edgeIds.splice(edgeIds.indexOf(edgeId), 1);
    edges.remove([edgeId]);
}

$("#deletenode").on("click", function () {
    if ($("input:hidden", "#node").val()) {
        let result = confirm("Are you sure?");
        if (result) {
            let param = $("#node").serialize(); 
            $.post("/admin/deletenode", param, function (data) {                
                removeNode(data.uuid);
            });
        }
    }
    clearNodeForm();
});

$("#savenode").on("click", function () {
    let formData = $("#node").serializeObject();
    formData.content = content.getData();
    if ($("input:hidden", "#node").val()) {
        $.post("/admin/updatenode", formData, function (data) {
            removeNode(data.nodes[0].uuid);
            addNode(data);
        });
    } else {
        $.post("/admin/addnode", formData, function (data) {
            addNode(data);
        });
    }
    clearNodeForm();
});

$("#saveedge").on("click", function () {
    if ($("input:hidden[name=uuid]", "#edge").val()) {
        $.post("/admin/updateedge", $("#edge").serialize(), function (data) {
            let existingEdge = edges.get(data.edges[0].uuid);
            data.edges[0].from = existingEdge.from;
            data.edges[0].to = existingEdge.to;
            removeEdge(data.edges[0].uuid);
            addEdge(data);
        });
    } else {
        $.post("/admin/addedge", $("#edge").serialize(), function (data) {
            addEdge(data);
        });
    }
    clearEdgeForm();
});

$("#deleteedge").on("click", function () {
    if ($("input:hidden[name=uuid]", "#edge").val()) {
        let result = confirm("Are you sure?");
        if (result) {
            let param =  $("#edge").serialize();
            $.post("/admin/deleteedge",param, function (data) {
                removeEdge(data.uuid);
            });
        }
    }
    clearEdgeForm();
});

$("#newnode").on("click", function () {
    clearNodeForm();
});

$("#newedge").on("click", function () {
    clearEdgeForm();
});



function clearNodeForm() {
    $("#node").trigger('reset');
    $("#node input[type=hidden]").val('');
    content.setData(null);
}

function clearEdgeForm() {
    $("#edge").trigger('reset');
    $("#edge input[type=hidden]").val('');
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

function addEdge(data) {
    preProcessNodeData(data);
    edges.add(data.edges[0]);
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
    if (data == null) {
        return;
    }
    if (null != data.nodes) {
        let dataNodes = data.nodes.filter(function (value, index, arr) {
            return !nodeIds.includes(value.uuid);
        });
        data.nodes = dataNodes;
        for (let node of data.nodes) {
            let label = node.name.replaceAll("\\\\n", "\n");
            node.name = node.label;
            node.label = label;
            node.id = node.uuid;
            nodeIds.push(node.uuid);
        }
    }
    if (null != data.edges) {
        let dataEdges = data.edges.filter(function (value, index, arr) {
            return !edgeIds.includes(value.uuid);
        });
        data.edges = dataEdges;

        for (let edge of data.edges) {
            let label = edge.name;
            edge.name = edge.label;
            edge.label = label;
            edge.id = edge.uuid;
            edge.font = { align: 'horizontal' };
            edgeIds.push(edge.uuid);
        }
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
            multiselect: false,
            selectConnectedEdges: false,
        },
    });
    network.on("click", function (params) {
        if (this.getSelectedNodes()) {
            currentNodeUUID = this.getSelectedNodes()[0];
            if (currentNodeUUID) {
                if (null == fromNodeUUID && null == toNodeUUID) {
                    fromNodeUUID = currentNodeUUID;
                } else if (null != fromNodeUUID && null == toNodeUUID) {
                    toNodeUUID = currentNodeUUID;
                } else {
                    fromNodeUUID = toNodeUUID;
                    toNodeUUID = currentNodeUUID;
                }
                populateNodeForm(currentNodeUUID);

                network.focus(currentNodeUUID, { animation: true });
                if (view == 'single') {
                    clearPartialNetwork(currentNodeUUID);
                }
                if (view == 'single' || view == 'incremental') {
                    populatePartialGraph(currentNodeUUID);
                }
            }
        }
        if (this.getSelectedEdges()) {
            let currentEdgeUUID = this.getSelectedEdges()[0];
            if (currentEdgeUUID) {
                populateEdgeForm(currentEdgeUUID);
            }
        }
    });
}

function populateNodeForm(uuid) {
    $.post("/admin/getnodedata", { uuid: uuid }, function (data) {
        let node = data.nodes[0];
        $("#node input[name=name]").val(node.name);
        content.setData(node.content);
        $("#node select[name=active]").val(node.active);
        $("#node select[name=size]").val(node.size);
        $("#node select[name=shape]").val(node.shape);
        $("#node input[name=uuid]").val(node.uuid);
        if (uuid == fromNodeUUID) {
            $("#edge input[name=fromname]").val(node.name);
            $("#edge input[name=fromuuid]").val(node.uuid);
        }
        if (uuid == toNodeUUID) {
            if ($("#edge input[name=touuid]").val()) {
                $("#edge input[name=fromname]").val($("#edge input[name=toname]").val());
                $("#edge input[name=fromuuid]").val($("#edge input[name=touuid]").val());
            }
            $("#edge input[name=toname]").val(node.name);
            $("#edge input[name=touuid]").val(node.uuid);
            //Cleanup
            $("#edge input[name=name]").val(null);
            $("#edge input[name=uuid]").val(null);
        }
    });
}

function populateEdgeForm(uuid) {
    $.post("/admin/getedgedata", { uuid: uuid }, function (data) {
        let edge = data.edges[0];
        clearNodeForm();
        clearEdgeForm();
        $("#edge input[name=name]").val(edge.name);
        $("#edge input[name=uuid]").val(edge.uuid);
        $("#edge select[name=width]").val(edge.width);
        $("#edge select[name=length]").val(edge.length);
    });
}

