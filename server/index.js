const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
var useragent = require('express-useragent');
const expressip = require('express-ip');
var geoip = require('geoip-lite');


const app = express();
app.use(useragent.express());
app.use(expressip().getIpInfoMiddleware);
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());




mongoose.connect("mongodb://localhost:27017/platform", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

let db = mongoose.connection;
db.on("open", () => {
  console.log("Connected to mongoDB");
});
db.on("error", error => {
  console.log(error);
});

let todoModel = require("./todo_schema");
let adModel = require("./ad_schema");
let countryModel = require("./country_schema")

// ROUTES

app.get("/", (req, res) => {
  res.send("hello");
});



// FETCH TO-DO

// completed
app.get("/todo/completed", (req, res) => {
  todoModel.find({ completed: true }, (err, todos) => {
    if (err) {
      res.send("Error while fetching Todos");
    } else {
      res.json(todos);
    }
  });
});

// uncompleted
app.get("/todo/uncompleted", (req, res) => {
  todoModel.find({ completed: false }, (err, todos) => {
    if (err) {
      res.send("Error while fetching Todos");
    } else {
      res.json(todos);
    }
  });
});




// update
app.post("/todo/complete/:id", (req, res) => {
  todoModel.findByIdAndUpdate(
    req.params.id,
    { completed: true },
    (err, todo) => {
      if (!err) {
        res.send("Good Work");
      }
    }
  );
});

// delete todo
app.delete("/todo/:id", (req, res) => {
  let query = { _id: req.params.id };
  todoModel.deleteOne(query, err => {
    if (err) {
      res.send("Error while deleting todo");
    } else {
      res.send("Todo deleted");
    }
  });
});


// uncompleted
app.get("/ad/all", (req, res) => {

  const options = {
    page: 1,
    limit: 20
  };

  adModel.paginate({}, options, function(err, result) {
    if (err) {
      res.send("Error while fetching countries");
    } else {

      res.json(result);
    }
  })
});



app.post("/ad/listing", (req, res) => {
  // const ipInfo = req.ipInfo;
  // console.log(ipInfo)
  // var ip = "207.97.227.239";
  // var geo = geoip.lookup(ip);
  // console.log(geo);

  let opt = req.body.options;
  const options = {
    page: opt.page,
    limit: opt.limit
  };
  let queries = req.body.filter;
  let q = {}
  if (queries != null) {
    q = queries
    for (let key in q) {
      if (isEmpty(q[key])){
        delete  q[key]
      }
    }
  }

  console.log(q);
  adModel.paginate(q, options, function(err, result) {
    if (err) {
      res.send("Error while fetching countries");
    } else {
      res.json(result);
    }
  })
});


function isEmpty(str) {
  return (!str || 0 === str.length);
}


// update
app.post("/ad/update/", (req, res) => {
  adModel.findByIdAndUpdate(
      req.body.ad._id,
      req.body.ad,
      (err, ad) => {
        if (!err) {
          res.json({message: 'Create' + req.body.ad.title + 'success!' , type : 'success'});
        }
      }
  );
});

// add todo
app.post("/ad/add", (req, res) => {
  let newAd = new adModel(req.body.ad);

  newAd.save(err => {
    if (err) {
      console.log(err);
      res.json({message: 'Create ' + newAd.title + ' failed!' , type : 'fail'});
    } else {
      res.json({message: 'Create ' + newAd.title + ' success!' , type : 'success'});
    }
  });
});


// uncompleted
app.get("/country/all", (req, res) => {
  countryModel.find({}, (err, countries) => {
    if (err) {
      res.send("Error while fetching ads");
    } else {
      res.json(countries);
    }
  });

});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
