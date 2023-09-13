import mongoose from 'mongoose'
import  color  from 'colors'

const connectDB = async (HOST) => {
    try {
        const conn = await mongoose.connect(HOST, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`.bgMagenta);
      } catch (error) {
        // console.error(error);
      }
}

export default connectDB