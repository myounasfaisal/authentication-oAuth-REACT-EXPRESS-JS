import dotenv from "dotenv";
dotenv.config();
import { Strategy as GithubStrategy } from "passport-github2";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/user.model.js";

// Configure Google OAuth 2.0 strategy
passport.use(
  new GoogleStrategy(  
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `/api/v1/users/auth/google/callback`,//From The frontend User Can get search params and make request 
      scope: ["profile", "email", "openid"],
       // Request profile and email from Google
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Google strategy configured");
        // Check if the user already exists in your database
        let user = await User.findOne({ email: profile.emails[0].value }).select("-password");

      

        if (!user) {
          // Create a new user if they don't exist
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value, // Google provides the user's email
          });
        }

        // Pass the user object to the next middleware
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.use(new GithubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "/api/v1/users/auth/github/callback"
},
async function(accessToken, refreshToken, profile, done) {
  try {
    console.log("Github strategy configured");
    // Check if the user already exists in your database
    let user = await User.findOne({ githubId: profile.id });


    if (!user) {
      // Create a new user if they don't exist
      user = await User.create({
        githubId: profile.id,
        name: profile.displayName,
        email: profile.username, // Github provides the user's username
      });
    }

    // Pass the user object to the next middleware
    done(null, user);
  } catch (error) {
    done(error, null);
  }
}
));


// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});