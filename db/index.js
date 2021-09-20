const mongoose = require('mongoose')

module.exports.connect = async function(dbConfig) {
    try {
        await mongoose.connect(`mongodb://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);
        // console.log('Database connected successfully.')
    }
    catch (e) {
        console.log(e);
        process.abort();
    }
}
module.exports.disconnect = async function () {
    await mongoose.disconnect();
}