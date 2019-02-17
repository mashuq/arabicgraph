var express = require('express');
var graph = require('../api/graph');
var router = express.Router();

router.post('/addnode', function (req, res, next) {
  graph.addNode(req.body).then(
    result => { res.send(result) },
    error => { res.status(500).send(error) }
  );
});

router.post('/addedge', function (req, res, next) {
  graph.addEdge(req.body).then(
    result => { res.send(result) },
    error => { res.status(500).send(error) }
  );
});

router.post('/updatenode', function (req, res, next) {
  graph.updateNode(req.body).then(
    result => { res.send(result); },
    error => {res.status(500).send(error)}
  );
});

router.post('/updateedge', function (req, res, next) {
  graph.updateEdge(req.body).then(
    result => { res.send(result); },
    error => {res.status(500).send(error)}
  );
});

router.post('/getnodedata', function (req, res, next) {
  graph.getNodeData(req.body).then(
    result => { res.send(result) },
    error => { res.status(500).send(error) }
  );
});

router.post('/getedgedata', function (req, res, next) {
  graph.getEdgeData(req.body).then(
    result => { res.send(result) },
    error => { res.status(500).send(error) }
  );
});

router.get('/graph', function (req, res, next) {
  graph.populateFullGraph().then(
    result => {res.send(result);},
    error => { res.status(500).send(error) }
  );
});

module.exports = router;
