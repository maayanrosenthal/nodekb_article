const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//connect to DB
mongoose.connect('mongodb://localhost/nodekb');
var db = mongoose.connection;

//Check connection
db.once('open', function(){
  console.log('Connected to mongodb');
});

//Check for DB errors
db.on('error', function(err){
  console.log(err);
});

//Init app
const app = express();

//Bring in models
var Article = require('./models/article')

//Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Body Parse Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


//Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

//Home route
app.get('/', function(req, res){
  Article.find({}, function(err, articles){
    console.log(articles);
    if(err){
      console.log(err);
    }
    else{
      res.render('index',{
        title:'Articles',
        articles: articles
      });
    }
  });
});

//Get single articles
app.get('/article/:id', function(req, res){
  Article.findById(req.params.id, function(err, article){
    res.render('article', {
      article:article
    });
  });
});

//Add route
app.get('/article/add', function(req, res){
  res.render('add_article' ,{
    title:'Add Article'
  });
});

//Add submit post route
app.post('/article/add', function(req, res){
  let article = new Article();
  console.log('Submitted');
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  article.save(function(err){
    if(err){
      console.log(err);
      return;
    }
    else{
      res.redirect('/');
    }
  })
  return;
});

//Article route to edit form
app.get('/article/edit/:id', function(req, res){
  Article.findById(req.params.id, function(err, article){
    res.render('edit_article', {
      title: 'Edit Article',
      article:article
    });
  });
});

//Update submit
app.post('/article/edit/+:id', function(req, res){
  console.log('Submitted');
  let article = {};

  let query = {_id:req.params.id}

  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  Article.update(query, article, function(err){
    if(err){
      console.log(err);
      return;
    }
    else{
      res.redirect('/');
    }
  })
  return;
});

//Delete Article
app.delete('/article/:id', function(req, res){
  let query = {_id:req.params.id}

  Article.remove(query, function(err){
    if(err){
      console.log(err);
    }
    res.send("success");
  });
});

app.listen(3000, function(){
  console.log('Server started on port 3000');
});
