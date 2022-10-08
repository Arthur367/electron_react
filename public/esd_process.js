const axios = require('axios');
const bodyParse = require('body-parser');
const express = require('express');
const app = express();
const path = require('path')
const qr = require('qr-image')
const Jimp = require("jimp")
const { SaveAllLogData, SaveRequestLog, SaveResponseLogData } = require('./schema')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
var Tremol = require("./nodejs_tremol_loader").load([path.join(__dirname, "./directapi/fp_core.js"), path.join(__dirname, "./directapi/fp.js")]);
var fp = new Tremol.FP();

//196.207.19.130 , 196.207.19.131 196.207.27.42



app.get('/', (req, res) => {
  console.log("total running");
  fp.ServerSetSettings("http://localhost:4444/");
  fp.ServerSetDeviceTcpSettings("196.207.19.130", 8000, "Password");
  var device = fp.ServerFindDevice();
  if (device) {
    fp.ServerSetDeviceSerialSettings(device.serialPort, device.baudRate, false); //If FD is connected on serial port or USB
    fp.PrintDiagnostics();
  }
  else {
    console.log("Device not found");
  }
  try {
    var status = fp.ReadStatus()
    console.log(status)
    if (status) {
      res.send("Ok")

    }

    if (!status) {
      console.log('error');
      res.send('Check Log and Code')
    }

    res.send("Done")
  } catch (e) {
    console.log(e)
  }


})

// app.post('/createReceipt', (req, res) => {
//   payload = req.body
//   items = payload.items_list
//   // while(true){       
//   fp.ServerSetSettings(req.headers.original);
//   fp.ServerSetDeviceTcpSettings(req.headers.hostname, req.headers.port, req.headers.password);
//   var device = fp.ServerFindDevice();
//   if (device) {
//     fp.ServerSetDeviceSerialSettings(device.serialPort, device.baudRate, false); //If FD is connected on serial port or USB
//     fp.PrintDiagnostics();
//   }
//   else {
//     console.log("Device not found");
//   }
//   try {
//     const status = fp.ReadStatus()
//     if (status) {
//       fp.OpenReceipt(1, "0000", Tremol.Enums.OptionFiscalReceiptPrintType);
//       for (const val of items) {
//         let hscode = val.hscode ? val.hscode : " "

//         fp.SellPLUfromExtDB(val.stockitemname, Tremol.Enums.OptionVATClass.VAT_Class_A, val.rate, " ", hscode, " ", 16, val.qty, 0);
//         console.log(val.stockitemname, Tremol.Enums.OptionVATClass.VAT_Class_A, val.rate, " ", hscode, " ", 16, val.qty, 0);
//       } const close = fp.CloseReceipt()
//       const dateTime = fp.ReadDateTime()
//       console.log(close, dateTime)
//       var response = { close, dateTime }
//       res.json(response)
//       // break;      
//     }
//   } catch (error) {
//     console.log(error);

//   }
//   // }
// })


app.post('/createInvoice', (req, res) => {
  payload = req.body
  items = payload.items_list
  while (true) {
    fp.ServerSetSettings(payload.original);
    fp.ServerSetDeviceTcpSettings(payload.hostname, payload.port, payload.password);
    var device = fp.ServerFindDevice();
    if (device) {
      fp.ServerSetDeviceSerialSettings(device.serialPort, device.baudRate, false); //If FD is connected on serial port or USB
      fp.PrintDiagnostics();
    }
    else {
      console.log("Device not found");
    }
    try {
      const status = fp.ReadStatus()
      if (status) {
        fp.OpenInvoiceWithFreeCustomerData("", payload.customer_pin, "", "", "", "", "", "")
        for (const val of items) {
          let hscode = val.hscode ? val.hscode : " "

          fp.SellPLUfromExtDB(val.stockitemname, Tremol.Enums.OptionVATClass.VAT_Class_A, val.rate, " ", hscode, " ", 16, val.qty, 0);
          console.log(val.stockitemname, Tremol.Enums.OptionVATClass.VAT_Class_A, val.rate, " ", hscode, " ", 16, val.qty, 0);
        }
        const close = fp.CloseReceipt()
        const dateTime = fp.ReadDateTime()
        console.log(close, dateTime)
        var response = { close, dateTime }
        res.json(response)
        break;
      }
    }
    catch (error) {
      console.log(error);

    }
  }
})

// app.post('/createCreditNote', (req, res) => {
//   payload = req.body
//   items = payload.items_list
//   while (true) {
//     fp.ServerSetSettings(req.headers.original);
//     fp.ServerSetDeviceTcpSettings(req.headers.hostname, req.headers.port, req.headers.password);
//     var device = fp.ServerFindDevice();
//     if (device) {
//       fp.ServerSetDeviceSerialSettings(device.serialPort, device.baudRate, false); //If FD is connected on serial port or USB
//       fp.PrintDiagnostics();
//     }
//     else {
//       console.log("Device not found");
//     }
//     try {
//       const status = fp.ReadStatus()
//       if (status) {
//         fp.OpenCreditNoteWithFreeCustomerData("", payload.customer_pin, "", "", "", "", payload.rel_doc_number, "")
//         for (const val of items) {
//           let hscode = val.hscode ? val.hscode : " "
//           fp.SellPLUfromExtDB(val.stockitemname, Tremol.Enums.OptionVATClass.VAT_Class_A, val.rate, " ", hscode, " ", 16, val.qty, 0);
//           console.log(val.stockitemname, Tremol.Enums.OptionVATClass.VAT_Class_A, val.rate, " ", hscode, " ", 16, val.qty, 0);
//           const close = fp.CloseReceipt()
//           const dateTime = fp.ReadDateTime()
//           console.log(close, dateTime)
//           var response = { close, dateTime }
//           res.json(response)
//           break;
//         }
//       }
//     } catch (error) {
//       console.log(error)

//     }
//   }
// })


// app.post('/createDebitNote', (req, res) => {
//   payload = req.body
//   items = payload.items_list
//   while (true) {
//     fp.ServerSetSettings(req.headers.original);
//     fp.ServerSetDeviceTcpSettings(req.headers.hostname, req.headers.port, req.headers.password);
//     var device = fp.ServerFindDevice();
//     if (device) {
//       fp.ServerSetDeviceSerialSettings(device.serialPort, device.baudRate, false); //If FD is connected on serial port or USB
//       fp.PrintDiagnostics();
//     }
//     else {
//       console.log("Device not found");
//     }
//     try {
//       const status = fp.ReadStatus()
//       if (status) {

//         fp.OpenDebitNoteWithFreeCustomerData("", payload.customer_pin, "", "", "", "", payload.rel_doc_number, "")
//         for (const val of items) {
//           let hscode = val.hscode ? val.hscode : " "

//           fp.SellPLUfromExtDB(val.stockitemname, Tremol.Enums.OptionVATClass.VAT_Class_A, val.rate, " ", hscode, " ", 16, val.qty, 0);
//           console.log(val.stockitemname, Tremol.Enums.OptionVATClass.VAT_Class_A, val.rate, " ", hscode, " ", 16, val.qty, 0);
//         }
//         const close = fp.CloseReceipt()
//         const dateTime = fp.ReadDateTime()
//         console.log(close, dateTime)
//         var response = { close, dateTime }
//         res.json(response)
//         break;
//       }
//     } catch (error) {
//       console.log(error)
//     }

//   }
// })

app.post('/esd', (req, res) => {

  payload = req.body
  items = payload.items_list
  led = payload.led_list
  // store.set("log", "ESD App Running")

  let item_array = []
  if (items) {
    for (const val of items) {
      let hscode = val.hscode ? val.hscode : " "
      array_item = hscode + " " + val.stockitemname + " " + String(val.qty) + " " + String(val.rate) + " " + String(val.amt)
      item_array.push(array_item)
    }
  }
  if (led) {
    for (const val of led) {
      let hscode = val.hscode ? val.hscode : " "
      array_item = hscode + " " + val.stockitemname + " " + String(val.qty) + " " + String(val.rate) + " " + String(val.amt)
      item_array.push(array_item)
    }
  }

  payload.items_list = item_array
  qr_image_path = payload.qr_image_path

  const options = {
    headers: {
      'Authorization': req.headers.authorization,
      'Content-Type': 'application/json',
      'Content-Length': JSON.stringify(payload).length
    }
  };

  axios.post(req.headers.hostname, payload, options)
    .then((x) => {
      var result = JSON.stringify(x.data.replace(/\\/g, ""));
      responseBody = result;
      var result1 = JSON.parse(result);
      var result2 = JSON.parse(result1);
      res.setHeader('Content-Type', 'application/json');
      res.send(result1);
      if (qr_image_path) {
        var qrcode = result2['verify_url']
        var file_name = path.join(qr_image_path, `${result2["cu_invoice_number"]}.png`);

        var qr_png = qr.image(qrcode, { type: 'png' });

        var tempFile = qr_png.pipe(require('fs').createWriteStream(file_name));

        tempFile.on('open', function (fd) {
          Jimp.read(file_name, function (err, image) {
            if (err) {
              //   console.log(err)
            } else {
              image.write(path.join(qr_image_path, `${result2["cu_invoice_number"]}.jpeg`));
            }
          });
        })
      }
      const request = req
      SaveAllLogData(request, res, payload, result1);
      SaveRequestLog(request, payload);
      SaveResponseLogData(req, res, result1);

    }).catch(ex => {

      if (ex['response']) {
        let err = ex['response'].data;
        if (typeof err == 'object') {
          res.setHeader('Content-Type', 'application/json');
          res.status(500).send(err);
          SaveAllLogData(req, res, payload, message);
          SaveRequestLog(req, payload)
          SaveResponseLogData(req, res, err)
        } else {
          const error_message = JSON.stringify(err.replace(/\\/g, ""));
          const message = JSON.parse(error_message);
          res.setHeader('Content-Type', 'application/json');
          res.status(500).send(message);
          SaveAllLogData(req, res, payload, message);
          SaveRequestLog(req, payload)
          SaveResponseLogData(req, res, err)
          // store.set("log", message)
        }
      } else {

        res.setHeader('Content-Type', 'application/json');
        var message = { "error_status": "Unknown Error, Try Again" };
        res.status(500).send(message);
        SaveAllLogData(req, res, payload, message);
        SaveRequestLog(req, payload)
        SaveResponseLogData(req, res, message)

      }
    });
})

app.post('/device', (req, res) => {
  payload = req.payload;
  const options = {
    headers: {
      'Authorization': req.headers.authorization,
      'Content-Type': 'application/json',
    }
  };
  axios.get(req.headers.hostname, options)
    .then((x) => {
      if (x.status == '200') {
        res.setHeader('Content-Type', 'application/json');
        const message = { 'status': true, 'message': 'Connected' };
        res.send(message);
        SaveAllLogData(req, res, payload, message);
        SaveRequestLog(req, payload);
        SaveResponseLogData(req, res);
      } else {
        res.setHeader('Content-Type', 'application/json');
        const message = { 'status': false, 'error_status': 'device not connected' };
        res.status(500).send(message);
        SaveAllLogData(req, res, payload, message);
        SaveRequestLog(req, payload);
        SaveResponseLogData(req, res, message);
      }
    }).catch(ex => {
      if (ex['response']['data']) {
        let err = ex['response']['data'];
        if (typeof err == 'object') {
          res.setHeader('Content-Type', 'application/json');
          res.status(500).send(err);
          SaveAllLogData(req, res, payload, err);
          SaveRequestLog(req, payload);
          SaveResponseLogData(req, res, err);
        } else {
          const error_message = JSON.stringify(err.replace(/\\/g, ""));
          const message = JSON.parse(error_message);
          res.setHeader('Content-Type', 'application/json');
          res.status(500).send(message);
          SaveAllLogData(request, res, payload, message);
          SaveRequestLog(request, payload);
          SaveResponseLogData(req, res, message);
        }
      } else {
        res.setHeader('Content-Type', 'application/json');
        const message = { "error_status": "Unknown Error, Try Again" };
        res.status(500).send(message);
        SaveAllLogData(req, res, payload, message);
        SaveRequestLog(req, payload);
        SaveResponseLogData(req, res, message);
      }
    })
})

app.get('/dtr', (req, res) => {

  export_location = req.headers.exportpath
  import_location = req.headers.importpath
  error_location = req.headers.errorpath
  file_name = req.headers.filename
  invoice_number = req.headers.invoicenumber
  print_delay = req.headers.printdelay ? parseInt(req.headers.printdelay) : 8000
  qr_image_path = req.headers.qrimagepath
  payload = req.payload

  file_path = path.join(import_location, `R_${file_name}`)
  error_file_path = path.join(error_location, `R_${file_name}`)

  setTimeout(() => {
    fs.readFile(file_path, 'utf-8', function (err, data) {
      if (err) {
        res.setHeader('Content-Type', 'application/json');
        const message = {
          "error_status": "Could not process invoice, check error log",
          "internal_error": String(err)
        }
        res.status(500).send(message);
        SaveAllLogData(req, res, payload, message);
        SaveRequestLog(req, payload);
        SaveResponseLogData(req, res, message);
      } else {

        x = data.split(/\r?\n/)
        var cu_date = x.find(element => element.includes("DATE"));
        var cu_serial = x.find(element => element.includes("CUSN:"));
        cu_serial = cu_serial + "_" + cu_date.replace("|", "");
        cu_serial = cu_serial.trim().replace("CUSN:", "").replace("|", "").replace(/\s/g, '').replace(/\u0011/g, "")
        var cu_invoice = x.find(element => element.includes("CUIN:"));
        cu_invoice = cu_invoice.trim().replace("CUIN:", "").replace("|", "").replace(/\s/g, '').replace(/\u0011/g, "")
        var verify_url = x.find(element => element.includes("https:"));
        verify_url = verify_url.trim().replace("|", "")

        if (qr_image_path) {
          var qrcode = verify_url;
          var file_name = path.join(qr_image_path, `${cu_invoice}.png`);

          var qr_png = qr.image(qrcode, { type: 'png' });

          var tempFile = qr_png.pipe(require('fs').createWriteStream(file_name));

          tempFile.on('open', function (fd) {
            Jimp.read(file_name, function (err, image) {
              if (err) {
                //   console.log(err)
              } else {
                image.write(path.join(qr_image_path, `${cu_invoice}.jpeg`));
              }
            });
          })
        }

        res.setHeader('Content-Type', 'application/json');
        const message = {
          "invoice_number": invoice_number,
          "cu_serial_number": cu_serial,
          "cu_invoice_number": cu_invoice,
          "verify_url": verify_url,
          "description": "Invoice Signed Success"
        };
        res.send(message);
        SaveAllLogData(req, res, payload, message);
        SaveRequestLog(req, payload);
        SaveResponseLogData(req, res, message);
      }
    })
  }, print_delay)

})

app.post('/ace', (req, res) => {
  payload = req.body
  items = payload.items_list
  led = payload.led_list

  let item_array = []
  if (items) {
    for (const val of items) {
      let hscode = val.hscode ? val.hscode : ""
      let item_detail = {
        "HSDesc": val.stockitemname,
        "TaxRate": val.taxrate,
        "ItemAmount": val.amt,
        "TaxAmount": val.taxamount,
        "TransactionType": "1",
        "UnitPrice": val.rate,
        "HSCode": hscode,
        "Quantity": val.qty
      }
      item_array.push(item_detail)
    }
  }
  if (led) {
    for (const val of led) {
      let hscode = val.hscode ? val.hscode : ""
      let item_detail = {
        "HSDesc": val.stockitemname,
        "TaxRate": val.taxrate,
        "ItemAmount": val.amt,
        "TaxAmount": val.taxamount,
        "TransactionType": "1",
        "UnitPrice": val.rate,
        "HSCode": hscode,
        "Quantity": val.qty
      }
      item_array.push(item_detail)
    }
  }

  //payload.items_list = item_array
  qr_image_path = payload.qr_image_path


  let ace_req = {
    Invoice: {
      SenderId: req.headers.senderid,
      InvoiceTimestamp: payload.timestamp,
      InvoiceCategory: payload.vouchertype,
      TraderSystemInvoiceNumber: payload.invoice_number,
      RelevantInvoiceNumber: payload.rel_doc_number ? payload.rel_doc_number : "",
      PINOfBuyer: payload.customer_pin,
      Discount: payload.net_discount_total,
      InvoiceType: "Original",
      ItemDetails: item_array,
      TotalInvoiceAmount: payload.grand_total,
      TotalTaxableAmount: payload.net_subtotal,
      TotalTaxAmount: payload.tax_total,
      ExemptionNumber: payload.customer_exid ? payload.customer_exid : ""
    }
  }
  const json = JSON.stringify(ace_req);

  const options = {
    headers: {
      //'Authorization': req.headers.authorization,
      'Content-Type': 'application/json',
      // 'Content-Length': JSON.stringify(payload).length
    }
  };


  axios.post(req.headers.hostname, json, options)
    .then((x) => {
      // console.log(x.data)
      if (x) {
        let result = {
          "error_status": "",
          "invoice_number": x.data.Existing.TraderSystemInvoiceNumber,
          "cu_serial_number": payload.deviceno + " " + x.data.Existing.CommitedTimestamp,
          "cu_invoice_number": x.data.Existing.ControlCode,
          "verify_url": x.data.Existing.QRCode,
          "description": "Invoice Signed Successfully"
        }
        // var result = JSON.stringify(x.data.replace(/\\/g, ""));
        // var result1 = JSON.parse(result);
        // var result2 = JSON.parse(result1);

        res.setHeader('Content-Type', 'application/json');
        res.send(result);
        SaveAllLogData(req, res, json, result);
        SaveRequestLog(req, json);
        SaveResponseLogData(req, res, result);
      }

      if (qr_image_path) {
        var qrcode = x.data.Existing.QRCode
        var file_name = path.join(qr_image_path, `${x.data.Existing.ControlCode}.png`);

        var qr_png = qr.image(qrcode, { type: 'png' });

        var tempFile = qr_png.pipe(require('fs').createWriteStream(file_name));

        tempFile.on('open', function (fd) {
          Jimp.read(file_name, function (err, image) {
            if (err) {
              //   console.log(err)
            } else {
              image.write(path.join(qr_image_path, `${x.data.Existing.ControlCode}.jpeg`));
            }
          });
        })
      }

    }).catch(ex => {
      // console.log(ex.response)
      // console.log(ex.response.data['Error'].message)
      let error = {
        "error_status": ex.response.data['Error'].message,
        "verify_url": "",
      }

      res.setHeader('Content-Type', 'application/json');
      res.status(500).send(error);
      SaveAllLogData(req, res, json, error);
      SaveRequestLog(req, json);
      SaveResponseLogData(req, res, error);

    });
})

app.post('/datecs', (req, res) => {
  payload = req.body
  items = payload.items_list
  led = payload.led_list
  transaction_type = ""
  if (payload.vouchertype == "Tax Invoice") {
    transaction_type = 0
  } else if (payload.vouchertype == "Credit Note") {
    transaction_type = 1
  } else if (payload.vouchertype == "Debit Note") {
    transaction_type = 2
  }

  let item_array = []
  if (items) {
    for (const val of items) {
      let hscode = val.hscode ? val.hscode : ""
      let item_detail = {
        "name": val.stockitemname,
        "unitPrice": val.rate,
        "hsCode": hscode,
        "quantity": val.qty
      }
      item_array.push(item_detail)
    }
  }
  if (led) {
    for (const val of led) {
      let hscode = val.hscode ? val.hscode : ""
      let item_detail = {
        "name": val.stockitemname,
        "unitPrice": val.rate,
        "hsCode": hscode,
        "quantity": val.qty
      }
      item_array.push(item_detail)
    }
  }

  //payload.items_list = item_array
  qr_image_path = payload.qr_image_path


  let ace_req = {
    invoiceType: 0,
    transactionType: transaction_type,
    cashier: "name",
    buyer: {
      pinOfBuyer: payload.customer_pin
    },
    items: item_array,
    payment: {
      amount: payload.grand_total,

    },
    relevantNumber: payload.rel_doc_number ? payload.rel_doc_number : "",
    TraderSystemInvoiceNumber: payload.invoice_number,
    ExemptionNumber: payload.customer_exid ? payload.customer_exid : ""
  }
  const json = JSON.stringify(ace_req);

  const options = {
    headers: {
      //'Authorization': req.headers.authorization,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'RequestId': req.headers.requestid
      // 'Content-Length': JSON.stringify(payload).length
    }
  };


  axios.post(req.headers.hostname, json, options)
    .then((x) => {
      // console.log(x.data)
      if (x) {
        let result = {
          "error_status": "",
          "invoice_number": x.data.invoiceExtension,
          "cu_serial_number": x.data.msn + " " + x.data.DateTime,
          "cu_invoice_number": x.data.mtn,
          "verify_url": x.data.verificationUrl,
          "description": "Invoice Signed Successfully"
        }
        // var result = JSON.stringify(x.data.replace(/\\/g, ""));
        // var result1 = JSON.parse(result);
        // var result2 = JSON.parse(result1);

        res.setHeader('Content-Type', 'application/json');
        res.send(result);
        SaveAllLogData(req, res, json, result);
        SaveRequestLog(req, json);
        SaveResponseLogData(req, res, result);
      }

      if (qr_image_path) {
        var qrcode = x.data.Existing.QRCode
        var file_name = path.join(qr_image_path, `${x.data.Existing.ControlCode}.png`);

        var qr_png = qr.image(qrcode, { type: 'png' });

        var tempFile = qr_png.pipe(require('fs').createWriteStream(file_name));

        tempFile.on('open', function (fd) {
          Jimp.read(file_name, function (err, image) {
            if (err) {
              //   console.log(err)
            } else {
              image.write(path.join(qr_image_path, `${x.data.Existing.ControlCode}.jpeg`));
            }
          });
        })
      }

    }).catch(ex => {
      // console.log(ex.response)
      // console.log(ex.response.data['Error'].message)
      let error = {
        "error_status": ex.message,
        "verify_url": "",
      }

      res.setHeader('Content-Type', 'application/json');
      res.status(500).send(error);
      SaveAllLogData(req, res, json, error);
      SaveRequestLog(req, json);
      SaveResponseLogData(req, res, error);

    });
})


app.post('/total', (req, res) => {

  payload = req.body
  fp.ServerSetSettings("http://localhost:4444/");
  console.log(fp.ServerSetDeviceTcpSettings("196.207.27.42", 8000, "Password"))

  fp.ServerSetDeviceTcpSettings("196.207.19.131", 8000, "Password");
  if (device) {
    fp.ServerSetDeviceSerialSettings(device.serialPort, device.baudRate, false); //If FD is connected on serial port or USB
    fp.PrintDiagnostics();
  } else {
    console.log("Device not found")
  }
  payload = req.body
  print_host = req.headers.hostname;
  // printer_ip = req.headers.printerip + ':' + req.headers.printerport;

  fp.ServerSetSettings("http://localhost:4444/");
  fp.ServerSetDeviceTcpSettings("196.207.19.131", 8000, "Password");
  console.log(fp.ServerSetDeviceTcpSettings("196.207.19.131", 8000, "Password"))
  // fp.ServerSetSettings(print_host);
  // fp.ServerSetDeviceTcpSettings(req.headers.printerip, req.headers.printerport, req.headers.senderid);
  var device = fp.ServerFindDevice();

  if (device) {
    fp.ServerSetDeviceSerialSettings(device.serialPort, device.baudRate, false); //If FD is connected on serial port or USB
    fp.PrintDiagnostics();
  }
  else {
    let error = {
      "error_status": "Device Not Found"
    }

    res.setHeader('Content-Type', 'application/json');
    res.send(error);
  }

  const status = fp.ReadStatus()
  if (status) {
    try {
      fp.OpenInvoiceWithFreeCustomerData("", payload.customer_pin, "", "", "", "", "", "")
      for (const val of payload.item_list) {
        let hscode = val.hscode ? val.hscode : ""
        fp.SellPLUfromExtDB(val.stockitemname, val.taxrateclass, val.rate, " ", hscode, " ", val.taxrate, val.qty, 0);
      }
      res.send({ "msg": "yess" })

    } catch (e) {
      let error = {
        "error_status": String(e)
      }
      res.setHeader('Content-Type', 'application/json');
      res.send(error);
    }
    const close = fp.CloseReceipt()
    res.json(close)

  }
}


)

app.post('/trial', (req, res) => {
  payload = req.body
  items = payload.items_list
  led = payload.led_list

  let item_array = []
  if (items) {
    for (const val of items) {
      let hscode = val.hscode ? val.hscode : " "
      array_item = hscode + " " + val.stockitemname + " " + String(val.qty) + " " + String(val.rate) + " " + String(val.amt)
      item_array.push(array_item)
    }
  }
  if (led) {
    for (const val of led) {
      let hscode = val.hscode ? val.hscode : " "
      array_item = hscode + " " + val.stockitemname + " " + String(val.qty) + " " + String(val.rate) + " " + String(val.amt)
      item_array.push(array_item)
    }
  }

  payload.items_list = item_array
  qr_image_path = payload.qr_image_path

  const options = {
    headers: {
      'Authorization': req.headers.authorization,
      'Content-Type': 'application/json',
      'Content-Length': JSON.stringify(payload).length
    }
  };
  var startTime = (new Date()).getTime();
  return new Promise((resolve, reject) => {
    endTime = (new Date()).getTime();
    var time = endTime - startTime;
    resolve(res.send(item_array));
    SaveAllLogData(req, res, payload, item_array);
    SaveRequestLog(req, payload);
    SaveResponseLogData(req, res, item_array, time);

  })




})


app.listen(5001, () => {
  console.log('listen on port 5001')
})
