var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var User = require("./Database/modules/User.js");
var News = require("./Database/modules/News.js");
var Halaqa = require("./Database/modules/Halqa.js");
var Shamosa = require("./Database/modules/Shamosa.js");

var multer = require("multer");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  require("express-session")({
    key: "session",
    secret: "SUPER SECRET SECRET",
    store: require("mongoose-session")(mongoose)
  })
);

mongoose.connect(
  "mongodb://admin:admin@ds163699.mlab.com:63699/kshamsdb",
  () => {
    console.log("Database is connected.");
  }
);

var db = mongoose.connection;
/////////////#############################################################################################################////////
//Upload Image
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(
      null,
      "/home/osamaths/Documents/Repos/kashams_lldonia/Back-End/uploads/"
    );
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + ".jpg");
  }
});
var upload = multer({ storage: storage, limits: { fileSize: 1000000 } }).single(
  "NewsImage"
);
// Get
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/TemplatesHTML/welcome.html");
});
// newsImage
app.post("/news/image", function(req, res) {
  console.log("inside /uploads");
  console.log(req.file);
  upload(req, res, function(err) {
    if (err) res.send("ErrorImageUpload");
    else res.send("Correct");
  });
});
/////////////#############################################################################################################////////
//SignUp
app.post("/user/signup", (req, res) => {
  var newUser = {
    gender: req.body.gender,
    username: req.body.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    major: req.body.major,
    password: req.body.password,
    phonenumber: req.body.phonenumber,
    currentAmiraId: req.body.currentAmiraId,
    userType: req.body.userType
  };
  User.findOne({ username: newUser.username }, (err, user) => {
    if (!user) {
      User.create(newUser, (err, doc) => {
        if (err) {
          res.send({ message: err });
        }
        res.send(true + doc);
      });
    } else {
      res.send({ message: "Username is already exist." });
    }
  });
});
//Update info user
app.post("/info/update", checkSession, (req, res) => {
  User.findOne({ _id: req.body._id }, (err, users) => {
    var updateInfo = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      major: req.body.major,
      phonenumber: req.body.phonenumber,
      password: req.body.password
    };
    users.update(updateInfo, function(err, doc) {
      if (err) return err;
      else {
        res.send(doc);
      }
    });
  });
});
//Login
app.post("/user/login", (req, res) => {
  console.log("loging in...", req.body);
  User.findOne({ username: req.body.username }, (err, user) => {
    if (user) {
      if (req.body.password === user.password) {
        req.session.userId = user._id;
        res.send(true);
      } else {
        res.send({ message: "Wrong password!" });
      }
    } else {
      res.send({ message: "Username '" + req.body.username + "' Not Found." });
    }
  });
});
//Logout
app.get("/user/logout", checkSession, (req, res) => {
  req.session.destroy(err => {
    if (err) res.negotiate(err);
  });

  res.send(true);
});
//////////////##############################################################################################################////
// Check session
function checkSession(req, res, next) {
  if (!req.session.userId) {
    res.send({ message: "No access!" });
  }
  next();
}
//////////////##############################################################################################################////
//addNews
app.post("/news/add", checkSession, (req, res) => {
  var newNews = {
    text: req.body.text,
    image: req.body.image
  };
  News.create(newNews, function(err, doc) {
    if (err) return err;
    else {
      res.send(doc);
    }
  });
});
//Update news
app.post("/news/update", checkSession, (req, res) => {
  News.findOne({ _id: req.body._id }, (err, news) => {
    var newNews = {
      text: req.body.text,
      image: req.body.image
    };
    news.update(newNews, function(err, doc) {
      if (err) return err;
      else {
        res.send(doc);
      }
    });
  });
});
//Delete news
app.delete("/news/delete/:id", checkSession, (req, res) => {
  var id = req.params.id;
  News.findOneAndRemove({ _id: id }, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(500).send();
    }
    return res.status(300).send();
  });
});
//////////////##############################################################################################################////
//addNShamosa
app.post("/shamosa/add", (req, res) => {
  var newShamosa = {
    text: req.body.text,
    image: req.body.image,
    like: req.body.like
  };
  Shamosa.create(newShamosa, function(err, doc) {
    if (err) return err;
    else {
      res.send(doc);
    }
  });
});
//Delete Shamosa
app.delete("/shamosa/delete/:id", (req, res) => {
  var id = req.params.id;
  Shamosa.findOneAndRemove({ _id: id }, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(500).send();
    }
    return res.status(300).send();
  });
});
// Likes
app.post("/shamosa/like", checkSession, (req, res) => {
  var like = 0;
  Shamosa.update({ _id: req.body._id }, { $set: { like: like + 1 } }, function(
    err,
    doc
  ) {
    if (err) return err;
    else {
      res.send(doc);
    }
  });
});
// get shamosa
app.post("/get/shamosa/posts", checkSession, (req, res) => {
  Shamosa.find((err, docs) => {
    if (err) return err;

    var result = slicePosts(docs, req.body.end, req.body.amount, req.body.flag);
    res.send(result);
  });
});
function slicePosts(array, end, amount, flag) {
  if (flag) {
    end = array.length;
  }
  var start = end - amount;
  return array.slice(start, end);
}

//////////////##############################################################################################################////
// Availabe amiras
app.get("/get/available/amiras", checkSession, (req, res) => {
  var finalUsers = [];
  User.find({ userType: "amira" }, (err, users) => {
    for (var i = 0; i < users.length; i++) {
      if (users[i].people.length < 6) finalUsers.push(users[i]);
    }
    res.send(finalUsers);
  });
});
//add amira to user
app.post("/add/amiraforuser", checkSession, (req, res) => {
  User.update(
    { _id: req.body.userId },
    { currentAmiraId: req.body.amiraId },
    (err, user) => {
      if (err) return err;
      console.log("current amira added");

      User.update(
        { _id: req.body.amiraId },
        { $push: { people: req.body.userId } },
        (err, user) => {
          if (err) return err;
          console.log("people");
          res.send("Done");
        }
      );
    }
  );
});
//////////////##############################################################################################################////
//create HalaqaSchema
app.post("/create/halqa", (req, res) => {
  var newHalaqa = {
    name: req.body.name,
    teacher: req.body.teacher,
    time: req.body.time,
    place: req.body.place
  };
  Halaqa.create(newHalaqa, function(err, doc) {
    if (err) return err;
    else {
      res.send(doc);
    }
  });
});
//students length
app.post("/students/length", (req, res) => {
  var newHalaqa = {
    _id: req.body._id
  };
  Halaqa.update(newHalaqa, function(err, doc) {
    if (err) return err;
    else {
      res.send(students.length);
    }
  });
});
//halaqa student existing
app.post("/halqa/student/exist", (req, res) => {
  var newUser = { students: req.body.studentId };
  Halaqa.findOne({ students: newUser.students }, (err, user) => {
    if (!user) {
      Halaqa.update(
        { _id: req.body._id },
        { $push: { students: req.body.studentId } },
        (err, user) => {
          if (err) return err;
          console.log("student is added into halaqa");
          res.send("Done");
        }
      );
    } else {
      res.send({ message: "Student is already exist." });
    }
  });
});
//Delete Halqa
app.delete("/halqa/delete/:id", (req, res) => {
  var id = req.params.id;
  Halaqa.findOneAndRemove({ _id: id }, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(500).send();
    }
    return res.status(300).send();
  });
});
/////////////##############################################################################################################////

//The 404 Route (ALWAYS KEEP this as the last route)
app.get("*", function(req, res) {
  res.sendFile(__dirname + "/TemplatesHTML/pagenotfound.html");
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, function() {
  console.log("app listening on port " + PORT);
});
