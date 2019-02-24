let nodesArray, nodes, edgesArray, edges, network, fromNodeUUID, toNodeUUID, content;

let nodeIds = [];
let edgeIds = [];
const rootUUID = "19257b55-210b-46ea-aea3-87f24d2faf60";
let currentNodeUUID = rootUUID;

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

$(function () {
    createGraph();
    populatePartialGraph(rootUUID);
});

function populatePartialGraph(uuid){
    $.post("/partialgraph", { uuid: uuid }, function (data) {
        addNodeAndEdge(data);  
    });
}

function addNodeAndEdge(data) {
    preProcessNodeData(data);
    data.nodes.forEach(function(element) {
        nodes.add(element);
    });
    data.edges.forEach(function(element) {
        edges.add(element);
    });   
}

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
        let dataNodes = data.nodes.filter(function(value, index, arr){
            return !nodeIds.includes(value.uuid);        
        });        
        data.nodes = dataNodes;        

        for (let node of data.nodes) {
            let color = randomColor();
            let label = node.name.replaceAll("\\\\n", "\n");
            node.name = node.label;
            node.label = label;
            node.id = node.uuid;
            node.color = {background:color, border:color, highlight:{background:'#C8C8C8', border: '#C8C8C8'}};
            node.font = {color:'black', face:'Lateef'}
            node.shape = 'dot';
            node.size = 35;
            node.mass = 3;
            nodeIds.push(node.uuid);
        }
    }
    if (null != data.edges) {
        let dataEdges = data.edges.filter(function(value, index, arr){
            return !edgeIds.includes(value.uuid);        
        });        
        data.edges = dataEdges;

        for (let edge of data.edges) {
            let label = edge.name;
            edge.name = edge.label;
            edge.label = '';
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
            populateNodeForm(currentNodeUUID);
            network.focus(currentNodeUUID, {animation:true});
            populatePartialGraph(currentNodeUUID);
        }
    });

    network.on("stabilized", function (params) {
        network.focus(currentNodeUUID, {animation:true});
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

$('.message .close')
  .on('click', function() {
    $(this)
      .closest('.message')
      .transition('fade')
    ;
  })
;


