
export const validateToken=()=>{
        return new Promise((resolve, reject)=>{
            resolve({userId:'123'});
            // reject(new Error("Invalid token"));
        })
}
   
   export const authHandler = (request,reply,done)=>{
       console.log('checking with....', request.body);

       validateToken().then((user)=>{
        request.userId=user.userId;
          done();
       }).catch(err=>{
        reply.code(401).send({ error: err.message });
       })
       
    }
