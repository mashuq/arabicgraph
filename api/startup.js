var neo4j = require('../config/neo4j');
const rootUUID = "19257b55-210b-46ea-aea3-87f24d2faf60";
const root = "Root";
var app = require('express')();


let getNode = function(){
    return neo4j.run('Match (root:Node {uuid : $uuid}) RETURN root', { uuid: rootUUID });
}

let createNode = function(){
    return neo4j.run('Create (root:Node {uuid : $uuid, name : $name, acive:$active}) RETURN root', 
    { uuid: rootUUID, name: root, active : true });
}

let rootNodeExists = function(){
    return new Promise(function(resolve, reject) {
        resolve("Root Node Already Created");
    });
}

let createRootNode = function(server){
    getNode().then(
        result => {
            if(result.records.length == 0){
                return createNode();
            }else{
                return rootNodeExists(); 
            }
        }, 
        error =>{
            console.log(error);
            console.log("Cannot get root node, stopping server");
            server.close();
        }
    ).then(
        result => { 
            console.log(result);
        }, 
        error =>{
            console.log(error);
            console.log("Cannot create root node, stopping server");
            server.close();
        }
    )
}

let startup = {
    createRootNode:createRootNode,
    rootUUID:rootUUID
}

module.exports = startup;

