const mongose = require('mongoose');

const connectDatabase = () => {
    mongose.connect(process.env.MONGODB_URI, {
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    .then(() => {
        console.log("MongoDb Database bağlantısı başarılı");
    })
    .catch(err =>{
        console.error(err);
    })
}
module.exports = connectDatabase;