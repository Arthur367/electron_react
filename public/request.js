const Datastore = require('nedb-promises');
const Ajv = require('ajv');
const logSchema = require('./schema');

class LogStore {
  constructor() {
    const ajv = new Ajv({
      allErrors: true,
      useDefaults: true,
    });

    this.schemaValidator = ajv.compile(logSchema);
    const dbpath = `${process.cwd()}/esdlog.db`;
    this.db = Datastore.create({
      filename: dbpath,
      timestampData: true,
    });
  }
  validate(data) {
    return this.schemaValidator(data);
  }

  create(data) {
    const isValid = this.validate(data);
    if (isValid) {
      return this.db.insert(data);
    }
  }

  read(_id) {
    return this.db.findOne({ _id }).exec()
  }

  readAll() {
    return this.db.find()
  }

  readActive() {
    return this.db.find({ isDone: false }).exec();
  }

  archive({ _id }) {
    return this.db.update({ _id }, { $set: { isDone: true } })
  }
}

module.exports = new LogStore();
