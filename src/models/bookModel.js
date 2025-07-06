import mongoose, { model, Schema, Types } from "mongoose";
const bookSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    bookedBy: { type: Types.ObjectId, ref: "User", required: true },
    eventId: { type: Types.ObjectId, ref: "Event", required: true },
  },
  { timestamps: true }
);

const Book = model("Book", bookSchema);
export default Book;
