import dotenv from "dotenv";
dotenv.config();
import passport from "passport";
import GoogleStrategy from "passport-google-oauth20/lib/strategy.js";
import userEntity from "../models/userModel.js";
import { RoleService } from "../services/roleService.js";
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await userEntity
          .findOne({
            email: profile.emails[0].value,
          })
          .populate("role_id");
        if (!user) {
          const role = await new RoleService().getRoleByName({ name: "user" });
          user = await userEntity.create({
            full_name: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos[0].value,
            role_id: role._id,
            login_method: "google",
          });
        }
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);
export default passport;
