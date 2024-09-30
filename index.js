import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

var posts = [];

function Post(title, content) {
  this.title = title;
  this.content = content;
  this.url = `/posts/${title.toLowerCase().split(' ').join('-').replace(/[^a-z0-9-]/g, '')}-${Math.floor(10000 + Math.random() * 90000)}`;
}

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index.ejs', { posts: posts });
});

app.get('/create', (req, res) => {
  res.render('create.ejs');
});

app.post('/submit', (req, res) => {
  const title = req.body.title;
  const content = req.body.content;

  const post = new Post(title, content);
  posts.push(post);

  res.redirect('/');
});

app.post('/delete', (req, res) => {
  const title = req.body.title;
  posts = posts.filter(p => p.title !== title);

  res.redirect('/');
});

app.post('/edit', (req, res) => {
  res.render('edit.ejs', { post: posts.find(p => p.title === req.body.title) });
});

app.post('/resubmit', (req, res) => {
  const title = req.body.title;
  const newContent = req.body.content;

  const postIndex = posts.findIndex(p => p.title === title);
  if (postIndex !== -1) {
    posts[postIndex].content = newContent;
  }

  res.redirect('/');
});

app.get('/posts/:url', (req, res) => {
  const post = posts.find(p => p.url === `/posts/${req.params.url}`);

  if (post) {
    res.render('postview.ejs', { post: post });
  } else {
    res.status(404).send('Post not found');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});