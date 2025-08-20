import Fastify from 'fastify';
import userRouter from './src/routes/user.js';
import fastifyMongodb from '@fastify/mongodb';

const fastify = new Fastify({ logger: true });

fastify.register(fastifyMongodb, {
  forceClose: true,
  url: 'mongodb+srv://silpakammara:srinidhi@cluster0.xc3vqug.mongodb.net/fastify_auth_user?retryWrites=true&w=majority&appName=Cluster0'
});

fastify.register(userRouter);

fastify.get('/',(request,reply)=>{
    return {
        message:"welcome to auth service"
    };
})
 

const start = async () => {
    const PORT=process.env.PORT || 4000;
  try {
    await fastify.listen({ port: PORT })
    fastify.log.info(`Server listening on http://localhost:${PORT}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
