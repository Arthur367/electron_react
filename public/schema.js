const storedbdata = require('../src/storedbdata');

var date = new Date();
class SaveLogData {

  SaveAllLogData(req, res, payload, result1) {
    var digits;
    var url = req.url;
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var method = req.method;


    // time elapsed from request start
    var elapsed = process.hrtime(req._startAt)

    // cover to milliseconds
    var ms = (elapsed[0] * 1e3) + (elapsed[1] * 1e-6)

    // return truncated value
    var time = ms.toFixed(digits === undefined ? 3 : digits)
    var all = {
      "data": "all",
      "created": date.getTime(),
      "request": {
        "device": url,
        "url": req.headers.hostname,
        "ip": ip,
        "method": method,
        "request_data": payload,
        "date": date.toLocaleDateString(),
        "time": date.toLocaleTimeString()
      },
      "response": {
        "statusCode": res.statusCode,
        "statusTime": `${time}ms`,
        "ip": ip,
        "date": date.toLocaleDateString,
        "time": date.toLocaleTimeString(),
        "data": result1,
      }
    }
    return storedbdata.create(all);
  };
  SaveRequestLog(req, payload) {
    var url = req.url;
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var method = req.method;
    var request = {
      "data": "request",
      "created": date.getTime(),
      "request": {
        "device": url,
        "url": req.headers.hostname,
        "ip": ip,
        "method": method,
        "request_data": payload,
        "date": date.toLocaleDateString(),
        "time": date.toLocaleTimeString()
      },
    }
    return storedbdata.create(request);
  }

  SaveResponseLogData(req, res, result1, mTime) {
    var digits;
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    // time elapsed from request start
    var elapsed = process.hrtime(req._startAt)
    // cover to milliseconds
    var ms = (elapsed[0] * 1e3) + (elapsed[1] * 1e-6)

    // return truncated value
    var time = ms.toFixed(digits === undefined ? 3 : digits)
    var response = {
      "data": "response",
      "created": date.getTime(),
      "response": { "statusCode": res.statusCode, "ip": ip, "date": date.toLocaleDateString, "time": date.toLocaleTimeString(), "statusTime": `${mTime}`, "data": result1, }

    }
    return storedbdata.create(response);
  }


}
module.exports = new SaveLogData();
