$(function () {
    createGraph();
});

function createGraph() {
    nodesArray = [
        {id: 1, label: 'Node 1'},
        {id: 2, label: 'Node 2'},
        {id: 3, label: 'Node 3'},
        {id: 4, label: 'Node 4'},
        {id: 5, label: 'Node 5'}
    ];
    nodes = new vis.DataSet(nodesArray);

    edgesArray = [
        {from: 1, to: 3},
        {from: 1, to: 2},
        {from: 2, to: 4},
        {from: 2, to: 5}
    ];
    edges = new vis.DataSet(edgesArray);

    let container = document.getElementById('graph');
    let data = {
      nodes: nodes,
      edges: edges
    };
    let options = {
        physics: {
            enabled: false
        },
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
      }
    });
    network.on("click", function (params) {
      selectedNodeUUID = this.getNodeAt(params.pointer.DOM);
    });
  }