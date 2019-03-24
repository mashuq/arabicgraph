const incremental = 'incremental', single = 'single', full = 'full';
let nodesArray, nodes, edgesArray, edges, network, fromNodeUUID, toNodeUUID, content, view = incremental, searchContent = [];
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
    if (null !== location.hash) {
        currentNodeUUID = location.hash.substr(1);
        if (!currentNodeUUID) currentNodeUUID = rootUUID;
    } else {
        currentNodeUUID = rootUUID;
    }
    window.history.replaceState({ id: currentNodeUUID }, null, `#${currentNodeUUID}`);
    load(currentNodeUUID);
    loadSearch();
    $('.ui.radio.checkbox').checkbox();
    $('input[type=radio][name=view]').val([incremental]);
});

function loadSearch() {
    $.get("/graph", function (data) {
        searchContent = data.nodes.map(obj => ({ title: obj.name.replaceAll("\\\\n", "<br /> "), id: obj.uuid }));
        $('.ui.search').search({
            source: searchContent,
            onSelect: function (result, response) {
                if (result.id) {
                    $('input[type=radio][name=view]').val([single]);
                    currentNodeUUID = result.id;
                    window.history.pushState({ id: currentNodeUUID }, null, `#${currentNodeUUID}`);
                    clearNetwork();
                    view = incremental;
                    load(currentNodeUUID);
                    view = single;                    
                }
            }
        });
    });
}



window.onpopstate = function (event) {
    if (event.state) { state = event.state; }
    load(state.id);
};

$('input[type=radio][name=view]').change(function () {
    view = this.value;
    if (view == full) {
        populateGraph();
    } else if (view == incremental || view == single) {
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

function populatePartialGraph(uuid) {
    $.post("/partialgraph", { uuid: uuid }, function (data) {
        addNodeAndEdge(data);
        network.selectNodes([uuid], false);
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
        let dataNodes = data.nodes.filter(function (value, index, arr) {
            return !nodeIds.includes(value.uuid);
        });
        data.nodes = dataNodes;

        for (let node of data.nodes) {
            let color = randomColor({
                luminosity: 'dark'
            });
            let label = node.name.replaceAll("\\\\n", "\n");
            node.name = node.label;
            node.label = label;
            node.id = node.uuid;
            node.color = { background: color, border: color, highlight: { background: '#C8C8C8', border: '#696969' } };
            node.font = { color: 'black', face: 'Lateef', size: 25 }
            node.mass = 3;
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
            if (this.getSelectedNodes()[0] === currentNodeUUID) {
                return;
            }
            currentNodeUUID = this.getSelectedNodes()[0];
            if (currentNodeUUID) {
                window.history.pushState({ id: currentNodeUUID }, null, `#${currentNodeUUID}`);
                load(currentNodeUUID);
            }
        }
    });

    network.on("stabilized", function (params) {
        network.focus(currentNodeUUID, { animation: true });
    });

    network.on("doubleClick", function (params) {
        if (currentNodeUUID) {
            $('.ui.modal').modal('show');
        }
    });
}

function load(currentNodeUUID) {    
    populateNodeForm(currentNodeUUID);
    network.focus(currentNodeUUID, { animation: true });
    if (view == single) {
        clearPartialNetwork(currentNodeUUID);
    }
    if (view == single || view == incremental) {
        populatePartialGraph(currentNodeUUID);
    }    
}

function populateNodeForm(uuid) {
    $("#content").html('');
    $.post("/admin/getnodedata", { uuid: uuid }, function (data) {
        let node = data.nodes[0];
        let title = node.name.replaceAll("\\\\n", " ");
        document.title = "Arabic Graph: " + title;
        let path = location.pathname + location.search + location.hash;
        gtag('config', gaid, {
            'page_title': title,
            'page_path': path,
        });
        $("#content").html(node.content);
    });
}

$('.message .close')
    .on('click', function () {
        $(this)
            .closest('.message')
            .transition('fade')
            ;
    })
    ;


