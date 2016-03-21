import {
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLInt,
	GraphQLString,
	GraphQLList,
	GraphQLNonNull,
	GraphQLID
} from 'graphql';

import {
	globalIdField,
	connectionDefinitions,
	connectionArgs,
	connectionFromPromisedArray,
	mutationWithClientMutationId
} from 'graphql-relay'

let db;
let counter = 42;
const myData = [42, 43, 44];
const store = {};

const LinkType = new GraphQLObjectType({
	name: 'Link',
	fields: () => ({
		// _id: {
		// 	type: GraphQLString
		// },
		id: {
			type: new GraphQLNonNull(GraphQLID),
			resolve: obj => obj._id
		},
		title: {
			type: GraphQLString
		},
		url: {
			type: GraphQLString
		}
	})
});

const linkConnection = connectionDefinitions({
	name: 'Link',
	nodeType: LinkType
});

const StoreType = new GraphQLObjectType({
	name: 'Store',
	fields: () => ({
		// query {
		//   store {
		//     linkConnection(first: 2, after: "YXJyYXljb25uZWN0aW9uOjM=") {
		//       pageInfo {
		//         hasNextPage
		//       }
		//       edges {
		//         cursor //giving the "YXJyYXljb25uZWN0aW9uOjM=" which is used in after arg
		//         node {
		//           id,
		//           title,
		//           url
		//         }
		//       }
		//     }
		//   }
		// }
		id: globalIdField('Store'),
		linkConnection: {
			type: linkConnection.connectionType,
			args: connectionArgs,//e.g. first: 5, last: 3
			resolve: (_, args) => connectionFromPromisedArray(
				db.collection('links').find({}).limit(args.first).toArray(),
				args
			)
		}
	})
});

//e.g.
// mutation CreateLinkMutation($input: CreateLinkInput!) {
//   createLink(input: $input) {
//     clientMutationId,
//     link {
//       id,
//       title,
//       url
//     }
//   }
// }

// {
//   "input": {
//   	"clientMutationId": 44,
//   	"title": "test",
//   	"url": "hk.yahoo.com"
//   }
// }

//e.g.2
// mutation CeateLinkMutation($input: CreateLinkInput!) {
//   createLink(input: $input) {
//     clientMutationId
//     linkEdge {
//       node {
//         id
//         title
//         url
//       }
//     }
//   }
// }
const createLinkMutation = mutationWithClientMutationId({
	name: 'CreateLink',
	inputFields: {
		title: {
			type: new GraphQLNonNull(GraphQLString)
		},
		url: {
			type: new GraphQLNonNull(GraphQLString)
		}
	},
	outputFields: {
		// link: {
		// 	type: LinkType,
		// 	resolve: obj => obj.ops[0]
		// }
		linkEdge: {
			type: linkConnection.edgeType,
			resolve: obj => ({
				node: obj.ops[0],
				cursor: obj.insertedId
			})
		},
		store: {
			type: StoreType,
			resolve: () => store
		}
	},
	mutateAndGetPayload: ({title, url}) => {
		return db.collection('links').insertOne({
			title,
			url
		});
	}
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
			},
			store: {
				type: StoreType,
				resolve: () => store
			}
		})
	}),
	mutation: new GraphQLObjectType({
		name: 'MutateAnything',
		fields: () => ({
			incrementCounter: {
				type: GraphQLInt,
				resolve: () => ++counter
			},
			createLink: createLinkMutation
		})
	})
});

export default (injectedDb) => {
	db = injectedDb;
	return schema;
}
