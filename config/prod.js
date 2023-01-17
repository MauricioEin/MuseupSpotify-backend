require('dotenv').config()

const dbName = process.env.DB_NAME
const dbKey = process.env.DB_KEY

module.exports = {
  dbURL: `mongodb+srv://${dbName}:${dbKey}@cluster0.7bgfjlk.mongodb.net/?retryWrites=true&w=majority`,
  dbName : 'station_db'
}
