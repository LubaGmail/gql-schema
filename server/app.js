const express = require('express');
const graphqlHTTP = require('express-graphql');
const crawler = require('./crawler/crawler');
const app = express();              // assume express framework instance which provides HTTP utilities

/**
 *  Type Relationship, a.k.a normalization
 *  N : 1
 *  Endpoint: http://localhost:4000/graphql
 */

// user graphiql client
app.use('/graphql', graphqlHTTP({
    schema: crawler,
    graphiql: true
}));

app.listen(4000, () => console.log('Example app listening on port 4000'))
