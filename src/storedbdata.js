const Datastore = require('nedb');

const db = new Datastore({
  filename: 'log.db',
  timestampData: true,
  autoload: true
});
class StoreLogDB {
  constructor() {

  }
  create(data) {
    return db.insert(data);
  }
  findAll() {
    return new Promise((resolve, reject) => {
      db.find({ data: "all" }, (err, docs) => {
        if (err) return reject(err);
        resolve(docs)
      });
    })
    // db.find({}, (err, docs) => {
    //   console.log(docs);
    //   return docs;
    // });
  }
  findRequest() {
    return new Promise((resolve, reject) => {
      db.find({ data: "request" }, (err, docs) => {
        if (err) return reject(err);
        resolve(docs);
      })
    });
  }
  findResponse() {
    return new Promise((resolve, reject) => {
      db.find({ data: "response" }, (err, docs) => {
        if (err) return reject(err);
        resolve(docs);
      })
    })
  }

}
module.exports = new StoreLogDB();
