const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const config = require('../config/googleOAuth.json');

process.env.GOOGLE_CLIENT_ID = config.web.client_id;
process.env.GOOGLE_CLIENT_SECRET = config.web.client_secret;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/google/callback",
    passReqToCallback: true
  },
  function(request, accessToken, refreshToken, profile, done) {
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return done(err, user);
    // });
    return done(null, profile);
  }
));

passport.serializeUser(function(user, done) {
    done(null, user)
});

passport.deserializeUser(function(user, done) {
    done(null, user)
});