require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

var corsOptions = {
    origin: process.env.CLIENT_ORIGIN || "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
const Role = require("./app/models/role.model");

console.log(db.url);

db.mongoose
    .connect(db.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Connected to the database!");
    })
    .catch(err => {
        console.log("Cannot connect to the database!", err);
        process.exit();
    });

function initial() {
    Role.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new Role({
                name: "user"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }
                console.log("added 'user' to roles collection");
            });
            new Role({
                name: "admin"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }
                console.log("added 'admin' to roles collection");
            });
        }
    });
}

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Hello world!" });
});

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

const path = require("path");

app.use(express.static(path.resolve(__dirname, "./client/build")));

// app.get("/", function (request, response) {
//     response.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
// });

// set port, listen for requests
// const PORT = process.env.NODE_DOCKER_PORT || process.env.PORT || 8080;
const PORT = process.env.SERVER_PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
