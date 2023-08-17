import mongoose from "mongoose";
const { Schema} = mongoose;

const setUserSchema = new Schema([{
     email: String,
     fullName: String,
     church: String,
}]);

const user = mongoose.model('user', setUserSchema);
export default user;

// celz4Auth1820