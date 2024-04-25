const express = require("express");
const { auth, isAdmin } = require("../middleware/auth");
const {
  addBook,
  updateBook,
  deleteBook,
  getAllBooks,
  getBook,
} = require("../controller/bookController");

const router = express.Router();

router.post("/add-book", auth, isAdmin, addBook);
router.put("/update-book", auth, isAdmin, updateBook);
router.delete("/delete-book/:id", auth, isAdmin, deleteBook);
router.get("/get-all-books", getAllBooks);
router.get("/get-book/:id", auth, getBook);

module.exports = router;
