const dotenv = require('dotenv');
const path = require('path');

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (envFound.error) {
    // This error should crash whole process

    throw new Error('.env file Not Found');
}

module.exports = {
    /**
     * Your favorite port
     */
    port: parseInt(process.env.PORT, 10),

    /**
     * That long string from mlab
     */
    databaseURL: process.env.MONGODB_URI,

    /**
     * Your secret sauce
     */
    jwtSecret: process.env.JWT_SECRET,
    jwtAlgorithm: process.env.JWT_ALGO,

    /**
     * Used by winston logger
     */
    logs: {
        level: process.env.LOG_LEVEL || 'silly'
    },

    /**
     * API configs
     */

    api: {
        prefix: '/api'
    },

    /**
     * Mandrill email credentials
     */
    emails: {
        apiKey: process.env.MANDRILL_API_KEY,
        fromName: process.env.MANDRILL_FROM_NAME,
        fromEmail: process.env.MAILGUN_from_EMAIL
    },

    /**
     * Public path
     */
    publicPath: path.join(__dirname, '../../public')
};
