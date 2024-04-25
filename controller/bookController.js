const Book = require("../model/Book");
const catchAsyncError = require("../utils/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");

// only admin can add books i.e role = admin
exports.addBook = catchAsyncError(async (req, res, next) => {
  const { title, author, description, publish_year, price } = req.body;
  const book = await Book.create({
    title,
    author,
    description,
    publish_year,
    price,
  });
  res.status(200).json({
    success: true,
    message: "Book Added Successfully",
    book,
  });
});

exports.updateBook = catchAsyncError(async (req, res, next) => {
  const { title, author, description, publish_year, price } = req.body;

  const book = await Book.findById(req.params.id);
  if (!book) return next(new ErrorHandler("Book not found", 400));

  if (title) book.title = title;
  if (author) book.author = author;
  if (description) book.description = description;
  if (publish_year) book.publish_year = publish_year;
  if (price) book.price = price;

  await book.save();
  res.status(200).json({
    success: true,
    message: "Book Updated Successfully",
  });
});

exports.deleteBook = catchAsyncError(async (req, res, next) => {
  const book = await Book.findById(req.params.id);
  if (!book) return next(new ErrorHandler("Book not found", 400));

  await book.deleteOne();
  res.status(200).json({
    success: true,
    message: "Book Deleted Successfully",
  });
});

exports.getAllBooks = catchAsyncError(async (req, res, next) => {
  const { author, year, resultPerPage, currentPage } = req.query;
  const query = {};

  // filtering by author and year
  if (author) {
    const authorExp = new RegExp(author, "i");
    query.author = { $regex: authorExp };
  }

  if (year) {
    query.publish_year = parseInt(year);
  }

  const bookCount = await Book.countDocuments(query);

  const limit = Number(resultPerPage);
  const page = Number(currentPage);
  const skip = (page - 1) * limit;

  const books = await Book.find(query).skip(skip).limit(limit).lean();

  res.status(200).json({
    success: true,
    bookCount,
    books,
  });
});

exports.getBook = catchAsyncError(async (req, res, next) => {
  const book = await Book.findById(req.params.id);
  if (!book) return next(new ErrorHandler("Book not found", 400));
  res.status(200).json({
    success: true,
    book,
  });
});
