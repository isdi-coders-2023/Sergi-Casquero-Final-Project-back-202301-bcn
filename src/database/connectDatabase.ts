import mongoose from "mongoose";
import createDebug from "debug";

export const debug = createDebug("rockfit:database");

const connectDatabase = async (url: string) => {
  mongoose.set("strictQuery", false);
  mongoose.set("debug", true);
  mongoose.set("toJSON", {
    virtuals: true,
    transform(doc, ret) {
      delete ret._id;
      delete ret.__v;
    },
  });

  try {
    await mongoose.connect(url);
    debug("Connected to database");
  } catch (error) {
    throw new Error("Error while connecting to data base.");
  }
};

export default connectDatabase;
