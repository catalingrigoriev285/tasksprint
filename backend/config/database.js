const moongose = require('mongoose');

const connectToDatabase = async () => {
    try {
        await moongose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

module.exports = connectToDatabase;