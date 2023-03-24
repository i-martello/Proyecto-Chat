import mongoose from 'mongoose'

const connectDB = (url: string | undefined) => {
  mongoose.connect(url!)
}

export default connectDB