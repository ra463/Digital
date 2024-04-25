const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Book title is required. Please enter a valid title"],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "Book author is required. Please enter a valid author"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    publish_year: {
      type: Number,
      required: [true, "Please provide publish year"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Please enter price"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

schema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

schema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

schema.methods.getToken = async function () {
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

module.exports = mongoose.model("Book", schema);
