import mongoose from 'mongoose';




  

export const dbConnection = () => {
   mongoose.connect(process.env.MONGO_URI).then(()=> {
       console.log(`DB is succesfully connected !! `);
   }).catch((err) => {
       console.log(`ERROR found in connection !! :- ${err}`);
   })
}

