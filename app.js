const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { post } = require('got');

const config = require(__dirname + '/config');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

mongoose.connect(config.URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Article = mongoose.model('Article', articleSchema);

app
  .route('/articles')
  .get((req, res, next) => {
    Article.find({}, (err, articles) => {
      if (err) {
        console.log(err);
      } else {
        res.send(articles);
      }
    });
  })
  .post((req, res, next) => {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle.save((err) => {
      if (err) {
        res.send(err);
      } else {
        res.send('Successfully added a new article.');
      }
    });
  })
  .delete((req, res, next) => {
    Article.deleteMany({}, (err) => {
      if (err) {
        res.send(err);
      } else {
        res.send('Successfully deleted all articles.');
      }
    });
  });

app
  .route('/articles/:articleTitle')
  .get((req, res, next) => {
    Article.findOne({ title: req.params.articleTitle }, (err, article) => {
      if (err) {
        res.send(err);
      } else {
        if (article) {
          res.send(article);
        } else {
          res.send('Article not found!');
        }
      }
    });
  })
  .put((req, res, next) => {
    Article.findOneAndUpdate(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      (err, response) => {
        if (err) {
          res.send(err);
        } else {
          res.send('Successfully updated article.');
        }
      }
    );
  })
  .patch((req, res, next) => {
    Article.findOneAndUpdate(
      { title: req.params.articleTitle },
      { $set: req.body },
      (err) => {
        if (err) {
          res.send(err);
        } else {
          res.send('Successfully patched article.');
        }
      }
    );
  })
  .delete((req, res, next) => {
    Article.findOneAndDelete({ title: req.params.articleTitle }, (err) => {
      if (err) {
        res.send(err);
      } else {
        res.send('Successfully deleted article.');
      }
    });
  });

app.listen(3000, () => {
  console.log('Server started!');
});
