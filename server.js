const express = require('express');
const app = express();
const hbs = require('hbs');
const bodyParser = require('body-parser');
const {mongoose} = require('./db/mongoose');
const {ObjectID} = require('mongodb');
const {Products} = require('./models/products');
const jsreport = require('jsreport');
const path = require('path');
const socketIO = require('socket.io');
const http = require('http');

var server = http.createServer(app);
var io = socketIO(server);

const port = process.env.PORT || 3000;

app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

//route for quantiy and predicted.
app.post('/placeOrder', (req, res) => {
  var id = req.body.productId;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send({error : "Unable to place order"});
  }
 
  if(req.body.quantity){

    Products.findByIdAndUpdate(id, {$inc: {quantity : req.body.quantity}}, {new: true}).then((product) => {
    if (!product) {
      return res.status(404).send();
    }

    io.sockets.emit('newMessage', {
      key: 'placeOrderCallback',
      data: product
    });
     //res.send(product);
    }).catch((e) => {
      res.status(400).send();
    })
  }

  if(req.body.predicted){
    var updatedProduct = {};
    updatedProduct.predicted = req.body.predicted;

    Products.findByIdAndUpdate(id, {$set: updatedProduct}, {new: true}).then((product) => {
    if (!product) {
      return res.status(404).send();
    }

    io.sockets.emit('newMessage', {
      key: 'placeOrderCallback',
      data: product
    });

    //res.send(product);
    }).catch((e) => {
      res.status(400).send();
    })
  }
});

//route for quantiy done.
app.post('/orderProcessed', (req, res) => {
  var id = req.body.productId;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send({error : "Unable to process quantity"});
  }

  if(req.body.quantity){

    Products.findByIdAndUpdate(id, {$set: {quantity : 0},$inc: {createdTillNow : req.body.quantity}}, {new: true}).then((product) => {
    if (!product) {
      return res.status(404).send();
    }

    io.sockets.emit('newMessage', {
      key: 'orderProcessedCallback',
      data: product
    });

      //res.send(product);
    }).catch((e) => {
      res.status(400).send();
    })
  }
});

app.get('/getProducts', (req, res) => {
  Products.find().then((products) => {
    res.render('products.hbs', {
    "pageTitle": 'FAASOS',
    "welcomeMessage": 'Welcome to my Faasos',
    "currentYear": new Date().getFullYear(),
    "products" : products 
  });
}, (e) => {
    res.status(400).send(e);
  });
});


//To Generate PDF Report.
app.get('/generateProductsReport', (req, res) => {
  Products.find().then((products) => {
    jsreport.render({
      template: {
        content: "<table> " +
            "<thead>"+
              "<th>Dish Name</th>"+
              "<th>Produced</th>"+
              "<th>Predicted</th>"+
            "</thead>"+
            "<tbody>"+
                "{{#each products}}"+
                "<tr>"+
                  "<td>{{this.productName}}</td>"+
                  "<td>{{this.createdTillNow}}</td>"+
                  "<td>{{this.predicted}}</td>"+
                "</tr>"+
                "{{/each}}"+
            "</tbody>"+
          "</table>",
        phantom: {
          header: "<h2>Kitchen System Report</h2>",
        },
        recipe: "phantom-pdf",
        engine: "handlebars"
      },
      data : {"products" : products}
    }).then(function(out) {
        //pipes pdf with Hello world from JSREPORT
        out.stream.pipe(res);
    }).catch(function(e) {    
        res.end(e.message);
    });
  });
});

/*app.listen(port, () => {
  console.log('Started on port 3000');
});*/

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
