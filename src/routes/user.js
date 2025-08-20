import { authHandler } from "../hooks/auth.js";
import {pipeline} from 'node:stream/promises';
import multipart from "@fastify/multipart"
import fs from "node:fs";

const createUserSchema = {
  body: {
    type: "object",
    required: ["name", "email", "password"],
    properties: {
      name: { type: "string" },
      email: { type: "string", format: "email" },
      password: { type: "string", minLength: 6 }
    },
  },
  response: {
    201: {
      description: "User created successfully",
      type: "object",
      properties: {
        id: { type: "string" }
      }
    }
  }
}

async function userRouter(fastify, opts) {
  fastify.register(multipart,{
    limits: {
    fieldNameSize: 100, 
    fieldSize: 100,     
    fields: 10,         
    fileSize: 1000000,   
    files: 1,           
    headerPairs: 2000,  
    parts: 1000         
  }
  })

  fastify.post("/api/users", { schema: createUserSchema }, async (request, reply) => {
    const { name, email, password } = request.body;
    const userCollection = fastify.mongo.db.collection("users");
    const result = await userCollection.insertOne({ name, email,password });

    const insertedId=result.insertedId
    fastify.log.info(`User created with ID: ${insertedId}`);

    console.log(request.body);
    reply.code(201);
    return {
      id: insertedId,
    };
  });

 fastify.get("/api/users", async (request, reply) => {
      const {q}=request.query;
      console.log(q);

      const userCollection=fastify.mongo.db.collection("users")

      let query={}
      if(q){
        query={
            name:{$regex:q, $options:'i'}
        };
      }
      const user=await userCollection.find(query).toArray()
      fastify.log.info("user list returned")
      return user;
 })

 fastify.get("/api/users/:id", {preHandler:authHandler} ,async(request,reply)=>{
    
    console.log('User ID:', request.userId);
    const id= new fastify.mongo.ObjectId(request.params.id);
    const userCollection=fastify.mongo.db.collection("users")
    const user=await userCollection.findOne({_id:id})
    return user;

 })


 fastify.post('/api/upload',async(request,reply)=>{
   const data=await request.file();
if (data.fieldname === 'image') {
  var filename = data.filename;
} else {
  reply.code(400).send({ error: "Only 'image' field is allowed for upload." });
  return;
}
   console.log('File received:', data);
    await pipeline(data.file, fs.createWriteStream(`static/${filename}`));
     reply.send();
     
 })

}
export default userRouter;
