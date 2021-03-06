var express = require('express');
var graph = require('../api/graph');
var passport = require('../api/passport');
var router = express.Router();

function logError(error) {
  console.log(error);
}

/* GET home page. */
router.get('/', require('connect-ensure-login').ensureLoggedIn(), function (req, res, next) {
  res.render('admin', { title: 'Arabic Graph Admin' });
});


router.post('/addnode', function (req, res, next) {
  graph.addNode(req.body).then(
    result => { res.send(result) },
    error => { logError(error); res.status(500).send(error) }
  );
});

router.post('/addedge', function (req, res, next) {
  graph.addEdge(req.body).then(
    result => { res.send(result) },
    error => { logError(error); res.status(500).send(error) }
  );
});

router.post('/updatenode', function (req, res, next) {
  graph.updateNode(req.body).then(
    result => { res.send(result); },
    error => { logError(error); res.status(500).send(error) }
  );
});

router.post('/updateedge', function (req, res, next) {
  graph.updateEdge(req.body).then(
    result => { res.send(result); },
    error => { logError(error); res.status(500).send(error) }
  );
});

router.post('/deletenode', function (req, res, next) {
  graph.deleteNode(req.body).then(
    result => { res.send(result); },
    error => { logError(error); res.status(500).send(error) }
  );
});

router.post('/deleteedge', function (req, res, next) {
  graph.deleteEdge(req.body).then(
    result => { res.send(result); },
    error => { logError(error); res.status(500).send(error) }
  );
});

router.post('/getnodedata', function (req, res, next) {
  graph.getNodeData(req.body).then(
    result => { res.send(result) },
    error => { logError(error); res.status(500).send(error) }
  );
});

router.post('/getedgedata', function (req, res, next) {
  graph.getEdgeData(req.body).then(
    result => { res.send(result) },
    error => { logError(error); res.status(500).send(error) }
  );
});

router.get('/graph', function (req, res, next) {
  graph.populateFullGraph().then(
    result => { res.send(result); },
    error => { logError(error); res.status(500).send(error) }
  );
});

router.get('/disconnectednodes', function (req, res, next) {
  graph.disconnectedNodes().then(
    result => { res.send(result); },
    error => { logError(error); res.status(500).send(error) }
  );
});




module.exports = router;
