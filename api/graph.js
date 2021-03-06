let driver = require('../config/neo4j');
let uuidv4 = require('uuid/v4');

let identityEquals = function(objectID1, objectID2){
    if(null == objectID1 || null == objectID2){
        return false;
    }

    if(objectID1.high == objectID2.high 
        && objectID1.low == objectID2.low){
            return true;
    }
    return false;
}

let populatePartialGraph = function (param) {
    return new Promise(function (mainResolve, mainReject) {
        let combinedResult = {};
        let combinedProcessing = function(){
            return new Promise(function(resolve, reject) {
                let response = processCombinedResult(combinedResult, param);
                mainResolve(response);
            });
        };
        let neo4j = driver.session({defaultAccessMode: driver.session.WRITE})    
        neo4j.run('MATCH (n:Node {uuid : $uuid}) OPTIONAL MATCH (n)-[r*0..1]-(m) RETURN m', param).then(
            result => {
                combinedResult.nodeResult = result;
                return neo4j.run('MATCH (n:Node {uuid : $uuid})-[r]-() return r', param);
            },
            error => {mainReject(error);}
        ).then(
            result => {
                combinedResult.edgeResult = result;
                return combinedProcessing();
            },
            error => {mainReject(error);}
        ).catch(error => {
            mainReject(error);
        })
        .then(() => neo4j.close());
    });
}



let populateFullGraph = function (param) {
    return new Promise(function (mainResolve, mainReject) {
        let combinedResult = {};
        let combinedProcessing = function(){
            return new Promise(function(resolve, reject) {
                try{
                    let response = processCombinedResult(combinedResult, param);
                    mainResolve(response);
                }catch(error){
                    mainReject(error);
                }
            });
        };
        let neo4j = driver.session({defaultAccessMode: driver.session.WRITE})  
        neo4j.run('MATCH (n) RETURN n').then(
            result => {
                combinedResult.nodeResult = result;
                return neo4j.run('match ()-[r]->() return r');
            },
            error => {mainReject(error);}
        ).then(
            result => {
                combinedResult.edgeResult = result;
                return combinedProcessing();
            },
            error => {mainReject(error);}
        ).catch(error => {
            mainReject(error);
        })
        .then(() => neo4j.close());
    });
}

let disconnectedNodes = function (params) {
    return new Promise(function (mainResolve, mainReject) {
        let cypher = "MATCH (n:Node) WHERE NOT (n)--() RETURN n";
        let neo4j = driver.session({defaultAccessMode: driver.session.WRITE})  
        neo4j.run(cypher, params).then(
            result => {
                mainResolve(processNodeResult(result));
            },
            error => {mainReject(error);}
        ).catch(error => {
            mainReject(error);
        })
        .then(() => neo4j.close());
    });
}

let addNode = function (params) {
    params.uuid = uuidv4();
    return new Promise(function (mainResolve, mainReject) {
        let cypher = "Create (node:Node{name:$name, content:$content, uuid : $uuid, active:$active, size:$size, shape:$shape}) return node";
        let neo4j = driver.session({defaultAccessMode: driver.session.WRITE})  
        neo4j.run(cypher, params).then(
            result => {
                mainResolve(processNodeResult(result));
            },
            error => {mainReject(error);}
        ).catch(error => {
            mainReject(error);
        })
        .then(() => neo4j.close());
    });
}

let addEdge = function (params) {
    params.uuid = uuidv4();
    return new Promise(function (mainResolve, mainReject) {
        let cypher = `Match (from:Node {uuid : $fromuuid}), (to:Node {uuid : $touuid}) CREATE (from)-[relation:Connects{ uuid:$uuid, name:$name, width:$width, length:$length }]->(to) RETURN relation`;
        let neo4j = driver.session({defaultAccessMode: driver.session.WRITE})  
        neo4j.run(cypher, params).then(
            result => {
                mainResolve(processEdgeResult(result, params)); 
            },
            error => {
                mainReject(error);
            }
        ).catch(error => {
            mainReject(error);
        })
        .then(() => neo4j.close());
    });
}

let updateNode = function(params) {
    params.existinguuid = params.uuid;
    return new Promise(function (mainResolve, mainReject) {
        let cypher = "Match (node:Node {uuid : $existinguuid}) SET node={name:$name, content:$content, uuid : $uuid, active:$active, size:$size, shape:$shape} return node";
        let neo4j = driver.session({defaultAccessMode: driver.session.WRITE})  
        neo4j.run(cypher, params).then(
            result => {
                mainResolve(processNodeResult(result));
            },
            error => {mainReject(error);}
        ).catch(error => {
            mainReject(error);
        })
        .then(() => neo4j.close());
    });
}

let deleteNode = function(params) {
    return new Promise(function (mainResolve, mainReject) {
        let cypher = "Match (node:Node {uuid : $uuid}) OPTIONAL MATCH (node)-[r]-()  DELETE node,r";
        let neo4j = driver.session({defaultAccessMode: driver.session.WRITE})  
        neo4j.run(cypher, params).then(
            result => {
                mainResolve(params);
            },
            error => {mainReject(error);}
        ).catch(error => {
            mainReject(error);
        })
        .then(() => neo4j.close());
    });
}

let updateEdge = function(params) {
    params.existinguuid = params.uuid;
    return new Promise(function (mainResolve, mainReject) {
        let cypher = "Match ()-[r]->() Where r.uuid=$existinguuid SET r={name:$name, uuid:$uuid, width:$width, length:$length} RETURN r";
        let neo4j = driver.session({defaultAccessMode: driver.session.WRITE})  
        neo4j.run(cypher, params).then(
            result => {
                mainResolve(processEdgeResult(result));
            },
            error => {mainReject(error);}
        ).catch(error => {
            mainReject(error);
        })
        .then(() => neo4j.close());
    });
}

let deleteEdge = function(params) {
    return new Promise(function (mainResolve, mainReject) {
        let cypher = "Match ()-[r]->() Where r.uuid=$uuid DELETE r";
        let neo4j = driver.session({defaultAccessMode: driver.session.WRITE})  
        neo4j.run(cypher, params).then(
            result => {
                mainResolve(params);
            },
            error => {mainReject(error);}
        ).catch(error => {
            mainReject(error);
        })
        .then(() => neo4j.close());
    });
}

let getNodeData = function (params) {
    return new Promise(function (mainResolve, mainReject) {
        let cypher = "Match (node:Node {uuid : $uuid}) RETURN node";
        let neo4j = driver.session({defaultAccessMode: driver.session.WRITE})  
        neo4j.run(cypher, params).then(
            result => {
                mainResolve(processNodeResult(result));
            },
            error => {mainReject(error);}
        ).catch(error => {
            mainReject(error);
        })
        .then(() => neo4j.close());
    });
}

let getEdgeData = function (params) {
    return new Promise(function (mainResolve, mainReject) {
        let cypher = "Match ()-[r]->() Where r.uuid=$uuid RETURN r";
        let neo4j = driver.session({defaultAccessMode: driver.session.WRITE})  
        neo4j.run(cypher, params).then(
            result => {
                mainResolve(processEdgeResult(result));
            },
            error => {mainReject(error);}
        ).catch(error => {
            mainReject(error);
        })
        .then(() => neo4j.close());
    });
}




let graph = {
    populateFullGraph: populateFullGraph,
    addNode: addNode,
    getNodeData:getNodeData,
    updateNode:updateNode,
    addEdge:addEdge,
    getEdgeData:getEdgeData,
    updateEdge:updateEdge,
    deleteNode:deleteNode,
    deleteEdge:deleteEdge,
    populatePartialGraph:populatePartialGraph,
    disconnectedNodes:disconnectedNodes
}

module.exports = graph;

function getNodeProperties(result){
    return result.records[0]._fields[0].properties;
}

function processNodeResult(result) {
    let response = { nodes: [] };
    for (let record of result.records) {
        let nodeRecord = record._fields[0];
        let node = {};
        node.label = nodeRecord.labels[0];
        Object.assign(node, nodeRecord.properties);
        response.nodes.push(node);
    }    
    return response;
}

function processEdgeResult(result, param = null) {
    let response = { edges: [] };
    for (let record of result.records) {
        let relationshipRecord = record._fields[0];        
        let edge = relationshipRecord.properties;  
        if(null != param){
            edge.from = param.fromuuid;
            edge.to = param.touuid;
        }      
        response.edges.push(edge);
    }
    return response;
}

function processCombinedResult(combinedResult, param) {
    let response = { nodes: [], edges: [] };
    for (let record of combinedResult.nodeResult.records) {
        let nodeRecord = record._fields[0];
        let node = {};
        Object.assign(node, nodeRecord.properties);
        delete node.content;
        response.nodes.push(node);
    }
    for (let record of combinedResult.edgeResult.records) {
        let relationshipRecord = record._fields[0];
        let startObjectID = relationshipRecord.start;
        let endObjectID = relationshipRecord.end;
        let startID, endID = '';
        for (let record of combinedResult.nodeResult.records) {
            let nodeRecord = record._fields[0];
            if (identityEquals(startObjectID, nodeRecord.identity)) {
                startID = nodeRecord.properties.uuid;
            }
            if (identityEquals(endObjectID, nodeRecord.identity)) {
                endID = nodeRecord.properties.uuid;
            }
        }
        let edge = { from: startID, to: endID };
        Object.assign(edge, relationshipRecord.properties);
        if(edge.from == undefined && param.parentUUID != undefined){
            edge.from = param.parentUUID;
        }
        response.edges.push(edge);
    }
    return response;
}
