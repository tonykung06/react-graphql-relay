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
	fromGlobalId,
	nodeDefinitions,
	connectionDefinitions,
	connectionArgs,
	connectionFromPromisedArray,
	mutationWithClientMutationId
} from 'graphql-relay'

let db;
let counter = 42;
const myData = [42, 43, 44];
class Store {}
const store = new Store();
const nodeDefs = nodeDefinitions((globalId) => {
	const {type} = fromGlobalId(globalId);

	if (type === 'Store') {
		return store;
	}

	return null;
}, (obj) => {
	if (obj instanceof Store) {
		return StoreType;
	}

	return null;
});

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
		},
		createdAt: {
			type: GraphQLString,
			resolve: obj => obj.createdAt && new Date(obj.createdAt).toISOString()
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
			args: {
				...connectionArgs,//e.g. first: 5, last: 3
				query: {
					type: GraphQLString
				}
			},
			resolve: (_, args) => {
				const findParams = {};

				if (args.query) {
					findParams.title = new RegExp(args.query, 'i');
				}

				return connectionFromPromisedArray(
					db.collection('links').find(findParams).sort({
						createdAt: -1
					}).limit(args.first).toArray(),
					args
				);
			}
		}
	}),
	interfaces: [nodeDefs.nodeInterface]
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
			url,
			createdAt: Date.now()
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
			},
			node: nodeDefs.nodeField
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
