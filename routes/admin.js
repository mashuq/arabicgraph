var express = require('express');
var graph = require('../api/graph');
var router = express.Router();

router.post('/addnode', function(req, res, next) {
  graph.addNewNode(req.body).then(
    result=>{res.send(result)},
    error=>{res.status(500).send(error)}
  );
});

router.post('/updatenode', function(req, res, next) {
  graph.updateNewNode(req.body).then(
    result=>{res.send(result);},
    error=>{
      console.log(error);
      res.status(500).send(error)}
  );
});

router.post('/getnodedata', function(req, res, next) {
  graph.getNodeData(req.body).then(
    result=>{res.send(result)}
  );
});

router.get('/graph', function(req, res, next) {
  graph.populateFullGraph().then(
    result=>{
      res.send(result);
    }
  );
});

module.exports = router;
