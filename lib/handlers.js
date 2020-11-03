const _data = require('./data');

// Request handlers
const handlers = {};

/**
 * [Create handler to invoke create new book function]
 * @param  {[object]}  data [object with request headers and request data]
 * @return {object}         [object with statusCode and message about success or failure]
 */
handlers.create = async (data) => {
  if (data.method.toLowerCase() !== 'post') {
    return { statusCode: 405, Error: 'Method not allowed.' };
  }

  if (data && data.payload) {
    const author = data.payload.author && data.payload.author.trim().length > 0 ? data.payload.author.trim() : null;
    const title = data.payload.title && data.payload.title.trim().length > 0 ? data.payload.title.trim() : null;
    const isbn = data.payload.isbn && data.payload.isbn.trim().length > 0 ? data.payload.isbn.trim() : null;
    const releaseDate = data.payload.releaseDate ? data.payload.releaseDate : null;

    if (!author) {
      return { statusCode: 400, message: 'Author is required and cannot be empty.' };
    }
    if (!title) {
      return { statusCode: 400, message: 'Title is required and cannot be empty.' };
    }
    if (!isbn) {
      return { statusCode: 400, message: 'ISBN is required and cannot be empty.' };
    }

    try {
      await _data.create({
        author,
        title,
        isbn,
        releaseDate
      });

      return { statusCode: 200, message: 'Book added successfully.' };
    } catch (e) {
      return { statusCode: 400, message: e.message };
    }
  } else {
    return { statusCode: 400, message: 'Invalid payload.' };
  }
};

/**
 * [Read handler to invoke read existing book function]
 * @param  {[object]}  data [object with request headers and request data]
 * @return {object}         [object with statusCode and message about success or failure]
 */
handlers.read = async (data) => {
  try {
    if (data.method.toLowerCase() !== 'get') {
      return { statusCode: 405, Error: 'Method not allowed.' };
    }

    const book = await _data.read();
    if (!book) {
      return { statusCode: 404, message: 'The book you are looking for not found.' };
    } else {
      const allBooks = JSON.parse(book);
      const searchedBook = allBooks.find(book => book.isbn === data.queryString.isbn);

      if (searchedBook) {
        return { statusCode: 200, message: searchedBook };
      } else {
        return { statusCode: 404, message: 'The book you are looking for not found.' };
      }
    }
  } catch (e) {
    console.log('error in reading file', e);
    return { statusCode: 400, message: 'Oops, something went wrong while adding book.' };
  }
};

/**
 * [Read handler to invoke read existing book function]
 * @param  {[object]}  data [object with request headers and request data]
 * @return {object}         [object with statusCode and message about success or failure]
 */
handlers.readAll = async (data) => {
  try {
    if (data.method.toLowerCase() !== 'get') {
      return { statusCode: 405, Error: 'Method not allowed.' };
    }

    const allBooks = await _data.read();
    if (!allBooks) {
      return { statusCode: 404, message: 'No book found.' };
    }
    return { statusCode: 200, message: JSON.parse(allBooks) };
  } catch (e) {
    console.log('error in reading file', e);
    return { statusCode: 400, message: 'Oops, something went wrong while adding book.' };
  }
};

/**
 * [Update handler to invoke update existing book function]
 * @param  {[object]}  data [object with request headers and request data]
 * @return {object}         [object with statusCode and message about success or failure]
 */
handlers.update = async (data) => {
  if (data.method.toLowerCase() !== 'put') {
    return { statusCode: 405, Error: 'Method not allowed.' };
  }

  // TODO: Allow author or title or isbn to be empty

  if (data && data.payload) {
    const author = data.payload.author && data.payload.author.length > 0 ? data.payload.author.trim() : null;
    const title = data.payload.title && data.payload.title.length > 0 ? data.payload.title.trim() : null;
    const isbn = data.payload.isbn && data.payload.isbn.length > 0 ? data.payload.isbn.trim() : null;
    const releaseDate = data.payload.releaseDate ? data.payload.releaseDate.trim() : null;

    try {
      await _data.update({
        author: author,
        title: title,
        isbn: isbn,
        releaseDate: releaseDate
      });

      return { statusCode: 200, message: 'Book updated successfully.' };
    } catch (e) {
      return { statusCode: 400, message: e.message };
    }
  }
};

/**
 * [Delete handler to invoke delete an existing book function]
 * @param  {[object]}  data [object with request headers and request data]
 * @return {object}         [object with statusCode and message about success or failure]
 */
handlers.delete = async (data) => {
  try {
    if (data.method.toLowerCase() !== 'delete') {
      return { statusCode: 405, Error: 'Method not allowed.' };
    }
    if (!data || !data.payload) {
      return { statusCode: 400, message: 'ISBN is required to delete a book record.' };
    }
    await _data.delete(data.payload);
    return { statusCode: 200, message: 'Book deleted successfully.' };
  } catch (e) {
    if (e && e.message === 'The book you are trying to delete does not exist.') {
      return { statusCode: 404, message: e.message };
    }
    return { statusCode: 400, message: e.message };
  }
};

// Not found, 404 handler
handlers.notFound = () => {
  return Promise.resolve({ statusCode: 404, message: 'Endpoint not found.' });
};

module.exports = handlers;
