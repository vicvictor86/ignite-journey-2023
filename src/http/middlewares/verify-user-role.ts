/* eslint-disable consistent-return */
import { FastifyReply, FastifyRequest } from 'fastify';

export function verifyUseRole(roleToVerify: 'ADMIN' | 'MEMBER') {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { role } = request.user;

    if (role !== roleToVerify) {
      return reply.status(401).send({ message: 'Unauthorized' });
    }
  };
}
