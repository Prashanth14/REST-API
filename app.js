const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
const app = express();
const port = 7016;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

//Connecting to Database
mongoose.connect("mongodb://localhost:27017/WikiDb", { useNewUrlParser: true, useUnifiedTopology: true });
var Schema = mongoose.Schema;

//creating Schema
var articleSchema = new Schema({
    title: String,
    content: String
});

//creating a Model
var docs = mongoose.model('articles', articleSchema);

//creating a document
var doc1 = new docs({ title: "SOAP", content: "It is also another kind of architectural design for designing API's" });
//doc1.save();


app.get('/', (req, res) => {
    res.send('Hello From Server');
});

app.route('/articles')
    .get((req, res) => {
        docs.find((err, foundArticles) => {
            if (!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            }
        });
    })
    .post((req, res) => {
        const newArticle = new docs({
            title: req.body.title,
            content: req.body.content
        })
        newArticle.save(err => {
            if (!err) {
                res.send('Successfully added a new article');
            } else {
                res.send(err);
            }
        });
    })
    .delete((req, res) => {
        docs.deleteMany(err => {
            if (!err) {
                res.send('Successfully deleted all articles');
            } else {
                res.send(err);
            }
        });
    });


app.route('/articles/:articleTitle')

.get((req, res) => {
    docs.findOne({ title: req.params.articleTitle }, (err, foundArticle) => {
        if (!err) {
            res.send(foundArticle);
        } else {
            res.send(err);
        }
    });
})

.put((req, res) => {

    docs.update({ title: req.params.articleTitle }, { title: req.body.title, content: req.body.content }, { overwrite: true }, (err) => {
        if (!err) {
            res.send('Successfully Updated a specified article');
        } else {
            res.send(err);
        }
    })

})

.patch((req, res) => {
    docs.update({ title: req.params.articleTitle }, { $set: req.body }, (err) => {
        if (!err) {
            res.send('Successfully Updated ');
        } else {
            res.send(err);
        }
    });
})

.delete((req, res) => {
    docs.deleteOne({ title: req.params.articleTitle }, err => {
        if (!err) {
            res.send('Successfully Deleted');
        } else {
            res.send(err);
        }
    });
});

app.listen(port, (req, res) => {
    console.log(`The server is Listening to ${port}`);
});