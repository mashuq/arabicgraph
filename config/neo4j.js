var neo4j = require('neo4j-driver');
var driver = neo4j.driver(
    'neo4j://localhost:7687',
    neo4j.auth.basic('neo4j', 'root'),
    { encrypted: 'ENCRYPTION_ON' }
);
var neo4jSession = driver.session()

module.exports = neo4jSession;