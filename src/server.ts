import fastify from 'fastify';
import { knex } from './database/database';
import { env } from './database/env';

const server = fastify();

server.get('/', async (request, response) => {
  const tables = await knex('sqlite_schema').select('*');

  return tables;
});

server
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('Server running on http://localhost:3333/');
  });
