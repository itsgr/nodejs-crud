const fs = require('fs').promises;
const path = require('path');
const filePath = path.join(__dirname, '/../.data/data.json'); // Default path for data storage

const lib = {};

/**
 * [Create a new book record]
 * @param  {[object]}  data [object with details about new book to add]
 * @return {Promise}        [promise object with status of file creation]
 */
lib.create = async (data) => {
  try {
    // Fetch all books
    const isBookPresent = await lib.read(data);
    // Check if books are present
    if (isBookPresent) {
      const allBooks = JSON.parse(isBookPresent);
      // Check if book we are about to add is already available
      if (allBooks.length === 0) {
        // If book is not available, push it into empty array received from read file and write to filePath
        allBooks.push(data);
        return await fs.writeFile(filePath, JSON.stringify(allBooks));
      } else {
        // If book is already available, throw an error
        const book = allBooks.find(book => book.isbn === data.isbn);

        if (book) {
          throw new Error('This book already exists.');
        } else {
          allBooks.push(data);
          return await fs.writeFile(filePath, JSON.stringify(allBooks));
        }
      }
    } else {
      // If books are absent, write the data to file
      return await fs.writeFile(filePath, JSON.stringify([data]));
    }
  } catch (e) {
    throw new Error(e);
  }
};

/**
 * [Read a specific book]
 * @param  {[object]}  data [object with details about new book to add]
 * @return {Promise}        [promise object with content of file]
 */
lib.read = async function (data) {
  try {
    return await fs.readFile(filePath, { encoding: 'utf-8' });
  } catch (e) {
    return false;
  }
};

/**
 * [Update a specified book]
 * @param  {[object]}  data [object with details about new book to add]
 * @return {Promise}        [promise object with status for file creation]
 */
lib.update = async (data) => {
  try {
    const allBooks = await lib.read();
    if (!allBooks) {
      throw new Error('Unable to find the book you are trying to update.');
    } else {
      const books = JSON.parse(allBooks);
      const bookToUpdate = books.find(book => book.isbn === data.isbn);

      if (bookToUpdate) {
        if (data.author) {
          bookToUpdate.author = data.author;
        }
        if (data.title) {
          bookToUpdate.title = data.title;
        }
        if (data.isbn) {
          bookToUpdate.isbn = data.isbn;
        }
        if (data.releaseDate) {
          bookToUpdate.releaseDate = data.releaseDate;
        }
        const filteredArray = books.filter(book => book.isbn !== data.isbn);
        filteredArray.push(bookToUpdate);

        return await fs.writeFile(filePath, JSON.stringify(filteredArray));
      } else {
        throw new Error('Unable to find the book you are trying to update.');
      }
    }
  } catch (e) {
    throw new Error(e);
  }
};

/**
 * [Delete a specified book]
 * @param  {[object]}  data [object with details about new book to add]
 * @return {Promise}        [promise object with status for file deletion]
 */
lib.delete = async (data) => {
  try {
    const allBooks = await lib.read();
    if (!allBooks) {
      throw new Error('Unable to find the book you are trying to delete.');
    } else {
      const books = JSON.parse(allBooks);
      const isBookPresent = books.find(book => book.isbn === data.isbn);
      if (!isBookPresent) {
        throw new Error('Unable to find the book you are trying to delete.');
      } else {
        const updatedBooks = books.filter(book => book.isbn !== data.isbn);
        return await fs.writeFile(filePath, JSON.stringify(updatedBooks));
      }
    }
  } catch (e) {
    if (e.message.includes('ENOENT')) {
      throw new Error('The book you are trying to delete does not exist.');
    }
    throw new Error(e);
  }
};

module.exports = lib;
