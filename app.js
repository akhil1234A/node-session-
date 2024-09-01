const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const session = require('express-session');
const app = express();

// Set up Handlebars as the view engine
const hbs = exphbs.create();
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (e.g., CSS from Bootstrap)
app.use(express.static(path.join(__dirname, 'public')));

// Parse URL-encoded bodies (for form submissions)
app.use(express.urlencoded({ extended: true }));

// Set up session management
app.use(session({
  secret: '1727c63eeb7a205d210b0e891f49491ddeac2e03b0efc74bbabb73f242efe7e5d5df944a7e532f8799a064a520a4ad460d634b017781b9963133d2fac2f59fe4', 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Middleware to protect routes
function ensureAuthenticated(req, res, next) {
  if (req.session.loggedIn) {
    return next();
  }
  res.redirect('/login');
}

// Middleware to prevent caching
const preventCaching = (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
};

// Apply to routes that require authentication
app.use('/home', preventCaching);

app.get('/card',(req,res)=>{
  res.render('cards');
}); 

// Define routes
app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.render('login', { errorMessage: req.session.errorMessage || null });
  req.session.errorMessage = null; // Clear error message after rendering
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Predefined username and password
  const validUsername = 'akhil';
  const validPassword = 'akhil123';

  if (username === validUsername && password === validPassword) {
    req.session.loggedIn = true;
    res.redirect('/home');
  } else {
    req.session.errorMessage = 'Incorrect username or password';
    res.redirect('/login');
  }
});

app.get('/home', ensureAuthenticated, (req, res) => {
  res.render('home');
});

app.post('/signout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.redirect('/home'); // Redirect to home if there's an error destroying the session
    }
    res.clearCookie('connect.sid'); // Clear the session cookie
    res.redirect('/login');
  });
});

app.get('/check-session', (req, res) => {
  if (req.session.loggedIn) {
    res.status(200).send('Session active');
  } else {
    res.status(401).send('Session inactive');
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
