let nodeIds, nodesArray, nodes, edgesArray, edges, network, fromNodeUUID, toNodeUUID, content;

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

$(function () {
    createGraph();
    populateGraph();
});


function populateGraph() {
    $.get("/graph", function (data) {
        populateFullGraph(data);
    });
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
        for (let node of data.nodes) {
            let label = node.name.replaceAll("\\\\n", "\n");
            node.name = node.label;
            node.label = label;
            node.id = node.uuid;
            /*if(_.sample([true, false])){
                node.color = randomColor({luminosity: 'dark'});
                node.font = {size:25, color:'white', face:'Lateef'}
            }else{
                node.color = randomColor({luminosity: 'light'});
                node.font = {size:25, color:'black', face:'Lateef'}
            }*/
            node.color = randomColor();
            node.font = {color:'black', face:'Lateef'}
            node.shape = 'dot';
        }
    }
    if (null != data.edges) {
        for (let edge of data.edges) {
            let label = edge.name;
            edge.name = edge.label;
            edge.label = '';
            edge.id = edge.uuid;
            edge.font = { align: 'horizontal' };
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
            let currentNodeUUID = this.getSelectedNodes()[0];            
            populateNodeForm(currentNodeUUID);
            network.focus(currentNodeUUID, {animation:true});
        }
    });

    network.on("doubleClick", function (params) {
        $('.ui.modal').modal('show');
    });    
}

function populateNodeForm(uuid) {
    $("#content").html('');
    $.post("/admin/getnodedata", { uuid: uuid }, function (data) {
        let node = data.nodes[0];
        $("#content").html(node.content);        
    });
}


