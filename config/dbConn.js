const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI, {
            //prevent deprecation warnings
            useUnifiedTopology: true,
            useNewUrlParser: true
        })
    } catch (err) {
        console.error(err);
    }
}

module.exports = connectDB;