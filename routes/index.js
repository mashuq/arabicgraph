var express = require('express');
var graph = require('../api/graph');
var passport = require('../api/passport');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Arabic Graph' });
});

router.get('/graph', function (req, res, next) {
  graph.populateFullGraph().then(
    result => { res.send(result); },
    error => { logError(error); res.status(500).send(error) }
  );
});

router.post('/partialgraph', function (req, res, next) {
  graph.populatePartialGraph(req.body).then(
    result => { res.send(result); },
    error => { logError(error); res.status(500).send(error) }
  );
});

router.get('/login',
  function (req, res) {
    res.render('login');
  });

router.post('/login',
  passport.authenticate('local', { failureRedirect: '/login' }),
  function (req, res) {
    res.redirect('/admin');
  });

router.get('/logout',
  function (req, res) {
    req.logout();
    res.redirect('/');
});

function logError(error) {
  console.log(error);
}

module.exports = router;
