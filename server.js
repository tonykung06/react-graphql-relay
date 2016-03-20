import express from 'express';
import {MongoClient} from 'mongodb';
import config from './config';
import schema from './data/schema';
import GraphQLHTTP from 'express-graphql';

const app = express();
let db;

app.use(express.static('public'));

app.get('/data/links', (req, res) => {
	db.collection('links').find({}).toArray((err, links) => {
		if (err) {
			throw err;
		}

		res.json(links);
	});
});

MongoClient.connect(config.MONGO_CONNECTION, (err, database) => {
	if (err) {
		throw err;
	}

	db = database;

	//example query: /graphql?query={counter,message}
	//example mutation: /graphql?query=mutation{incrementCounter}
	//
	//introspection on the capability provided by the graphql server, i.e. the graphql structure:
	//{__type(name: "ReadAnything"){fields{name}}}
	app.use('/graphql', GraphQLHTTP({
		schema: schema(db),
		graphiql: true //providing type system UI at /graphql
	}));

	app.listen(3000, () => {
		console.log('express server listen at port 3000');
	});
});