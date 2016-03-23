import fs from 'fs';
import express from 'express';
import {MongoClient} from 'mongodb';
import config from './config';
import makeSchema from './data/schema';
import GraphQLHTTP from 'express-graphql';
import {graphql} from 'graphql';
import {introspectionQuery} from 'graphql/utilities';

const app = express();
// let db;

app.use(express.static('public'));

app.get('/data/links', (req, res) => {
	db.collection('links').find({}).toArray((err, links) => {
		if (err) {
			throw err;
		}

		res.json(links);
	});
});

(async () => {
	try {
		const db = await MongoClient.connect(config.MONGO_CONNECTION);
		const schema = makeSchema(db);

		app.use('/graphql', GraphQLHTTP({
			schema,
			graphiql: true
		}));

		app.listen(3000, () => {
			console.log('express server listen at port 3000');
		});

		const json = await graphql(schema, introspectionQuery);
		fs.writeFile('./data/schema.json', JSON.stringify(json, null, 4), err => {
			if (err) {
				throw err;
			}

			console.log('JSON schema is created');
		});
		// fs.stat('./data/schema.json', (err, stat) => {
		// 	if (err) {
		// 		fs.writeFile('./data/schema.json', JSON.stringify(json, null, 4), err => {
		// 			if (err) {
		// 				throw err;
		// 			}

		// 			console.log('JSON schema is created');
		// 		});
		// 	}
		// });
	} catch (e) {
		console.log(e);
	}
})();

// MongoClient.connect(config.MONGO_CONNECTION, (err, database) => {
// 	if (err) {
// 		throw err;
// 	}

// 	db = database;

// 	//example query: /graphql?query={counter,message}
// 	//example mutation: /graphql?query=mutation{incrementCounter}
// 	//
// 	//introspection on the capability provided by the graphql server, i.e. the graphql structure:
// 	//{__type(name: "ReadAnything"){fields{name}}}
// 	//
// 	//1. field argument
// 	//2. aliases
// 	//3. fragments
// 	//
// 	//benefits:
// 	//1. easy-to-write queries if you know the data that you need
// 	//2. the queries describes the shape of the response
// 	//3. no over-fetching and under-fetching
// 	//4. can customize the data that you get with aliases and field arguments
// 	//5. can query objects and their connections, and nest as deep as you need, and get all that data in a single round trip
// 	//6. as views change their data requirement, we don't need to change the graphql server as long as it is using the capabilities published by the server
// 	//7. built-in accurate and always up-to-date documentation
// 	//8. queries are composable and re-usable by taking advantages of fragments
// 	//9. can re-use existing logic in the server code
// 	//10. mutations are just queries, same structure and same benefits
// 	app.use('/graphql', GraphQLHTTP({
// 		schema: schema(db),
// 		graphiql: true //providing type system UI at /graphql
// 	}));

// 	app.listen(3000, () => {
// 		console.log('express server listen at port 3000');
// 	});
// });