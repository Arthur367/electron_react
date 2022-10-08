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
    return new Promise((resolve, reject) => {
      db.insert(data);
    }
    )
  }
  findAll() {
    return new Promise((resolve, reject) => {
      db.find({ data: "all" }).exec((err, docs) => {
        if (err) return reject(err);
        resolve(docs)
      });
    })
    // db.find({}, (err, docs) => {
    //   console.log(docs);
    //   return docs;
    // });
  }
  findAllPagination(page) {
    var perpage = 5;
    var page = Math.max(0, page);
    return new Promise((resolve, reject) => {
      db.find({ data: "all" }).sort({ createdAt: -1 }).skip(perpage * page).limit(perpage).exec((err, docs) => {
        if (err) return reject(err);
        resolve(docs);
      })
    });
  }
  findRequest() {
    return new Promise((resolve, reject) => {
      db.find({ data: "request" }).exec((err, docs) => {
        if (err) return reject(err);
        resolve(docs);
      })
    });
  }
  findRequestPagination(page) {
    var perpage = 5;
    var page = Math.max(0, page);
    return new Promise((resolve, reject) => {
      db.find({ data: "request" }).sort({ createdAt: -1 }).skip(perpage * page).limit(perpage).exec((err, docs) => {
        if (err) {

          return reject(err);
        };
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
  findResponsePagination(page) {
    var perpage = 5;
    var page = Math.max(0, page);
    return new Promise((resolve, reject) => {
      db.find({ data: "response" }).sort({ createdAt: -1 }).skip(perpage * page).limit(perpage).exec((err, docs) => {
        if (err) return reject(err);
        resolve(docs);
      })
    });
  }

  filterDateAll(start, end) {
    return new Promise((resolve, reject) => {
      db.find({ data: "all", created: { $gte: start, $lte: end } }).exec((err, docs) => {
        if (err) return reject(err); netbot123

        resolve(docs);
      });
    })
  }
  findDateAllPagination(page, start, end) {
    var perpage = 5;
    var page = Math.max(0, page);
    return new Promise((resolve, reject) => {
      db.find({ data: "all", created: { $gte: start, $lte: end } }).sort({ createdAt: -1 }).skip(perpage * page).limit(perpage).exec((err, docs) => {
        if (err) return reject(err);
        resolve(docs);
      })
    });
  }
  findDateRequestPagination(page, start, end) {
    var perpage = 5;
    var page = Math.max(0, page);
    return new Promise((resolve, reject) => {
      db.find({ data: "request", created: { $gte: start, $lte: end } }).sort({ createdAt: -1 }).skip(perpage * page).limit(perpage).exec((err, docs) => {
        if (err) return reject(err);
        resolve(docs);
      })
    });
  }
  findDateResponsePagination(page, start, end) {
    var perpage = 5;
    var page = Math.max(0, page);
    return new Promise((resolve, reject) => {
      db.find({ data: "response", created: { $gte: start, $lte: end } }).sort({ createdAt: -1 }).skip(perpage * page).limit(perpage).exec((err, docs) => {
        if (err) return reject(err);
        resolve(docs);
      })
    });
  }


}
module.exports = new StoreLogDB();
