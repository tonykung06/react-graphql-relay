import {
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLInt,
	GraphQLString,
	GraphQLList
} from 'graphql';

let db;
let counter = 42;
const myData = [42, 43, 44];

const LinkType = new GraphQLObjectType({
	name: 'Link',
	fields: () => ({
		_id: {
			type: GraphQLString
		},
		title: {
			type: GraphQLString
		},
		url: {
			type: GraphQLString
		}
	})
});

const schema = new GraphQLSchema({
	query: new GraphQLObjectType({
		name: 'ReadAnything',
		fields: () => ({
			counter: {
				type: GraphQLInt,
				resolve: () => counter
			},
			message: {
				type: GraphQLString,
				resolve: () => 'my message'
			},
			myData: {
				type: new GraphQLList(GraphQLInt),
				resolve: () => myData
			},
			links: {
				type: new GraphQLList(LinkType),
				resolve: () => db.collection('links').find({}).toArray()
			}
		})
	}),
	mutation: new GraphQLObjectType({
		name: 'MutateAnything',
		fields: () => ({
			incrementCounter: {
				type: GraphQLInt,
				resolve: () => ++counter
			}
		})
	})
});

export default (injectedDb) => {
	db = injectedDb;
	return schema;
}
