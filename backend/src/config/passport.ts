import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { User } from "../models/User.js";
import { env } from "./env.js";

// Dummy serialize/deserialize to appease passport if session is used
passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

const serverUrl = env.isProd ? "https://your-prod-api.com" : "http://localhost:4000";

if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${serverUrl}/api/auth/google/callback`,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id });
          if (user) {
            return done(null, user);
          }

          const email = profile.emails?.[0]?.value?.toLowerCase();
          if (email) {
            user = await User.findOne({ email });
            if (user) {
              user.googleId = profile.id;
              await user.save();
              return done(null, user);
            }
          }

          user = await User.create({
            email: email || `${profile.id}@google.oauth`,
            googleId: profile.id,
            avatar: profile.photos?.[0]?.value || null,
          });

          return done(null, user);
        } catch (err) {
          return done(err, undefined);
        }
      }
    )
  );
}

if (env.FACEBOOK_APP_ID && env.FACEBOOK_APP_SECRET) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: env.FACEBOOK_APP_ID,
        clientSecret: env.FACEBOOK_APP_SECRET,
        callbackURL: `${serverUrl}/api/auth/facebook/callback`,
        profileFields: ["id", "emails", "name", "picture.type(large)"],
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ facebookId: profile.id });
          if (user) {
            return done(null, user);
          }

          const email = profile.emails?.[0]?.value?.toLowerCase();
          if (email) {
            user = await User.findOne({ email });
            if (user) {
              user.facebookId = profile.id;
              await user.save();
              return done(null, user);
            }
          }

          user = await User.create({
            email: email || `${profile.id}@facebook.oauth`,
            facebookId: profile.id,
            avatar: profile.photos?.[0]?.value || null,
          });

          return done(null, user);
        } catch (err) {
          return done(err, undefined);
        }
      }
    )
  );
}

export default passport;
