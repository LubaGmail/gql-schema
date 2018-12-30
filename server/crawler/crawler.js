const genres = require('../data/genres');
const performances = require('../data/performances');

const _ = require('lodash');
const graphql = require('graphql');

/** 
    Schema does:
    1 Define types
    2 Define relationship between types (1 : N, N : N, et al)
    3 Root queies, i.e. place to jump to start quering the graph
 */

const { GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLList
} = graphql;

// audience:  children, adult, all ages
const GenreType = new GraphQLObjectType({
    name: 'Genre',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        audience: { type: GraphQLString },
    })
});

const PerformanceType = new GraphQLObjectType({
    name: 'Performance',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        genreId: {type: GraphQLString},
        //
        // N : 1        Perf : Genre
        // IMPORTANT! ref to the element of RootQuery genreById
        genreById: {
            type: GenreType,
            resolve (parent, args) {
                return _.find(performances, {id: parent.genreId});
            }
        } 
    })
});

// Entry point to the Graph
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        // the client will query on this name - genres
        genres: {
            type: new GraphQLList(GenreType),
            resolve(parent, args) {
                return genres
            }
        },

        // other queries...  
       
        genreById: {
            type: GenreType,
            args: { id: { type: GraphQLString } },
            resolve(parent, args) {
                // logic goes here
                return _.find(genres, { id: args.id })
            }
        },

        genreByName: {
            type: GenreType,
            args: { name: { type: GraphQLString } },
            resolve(parent, args) {
                // logic goes here
                return _.find(genres, { name: args.name })
            }
        },

        genreByAudience: {
            type: new GraphQLList(GenreType),
            args: { audience: { type: GraphQLString } },
            resolve(parent, args) {
                // logic goes here
                return _.filter(genres, {audience: args.audience})
            }
        },
        
        // All performances 

        performances: {
            type: new GraphQLList(PerformanceType),
            resolve(parent, args) {
                return performances
            }
        },

        // other queries

        performanceById: {
            type: PerformanceType,
            args: { id: { type: GraphQLString } },
            resolve(parent, args) {
                // logic goes here
                return _.find(performances, { id: args.id })
            }
        },
    }, 
});

// End point
module.exports = new GraphQLSchema({
    query: RootQuery
});

