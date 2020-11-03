const books = [{
  author: 'John Doe',
  title: 'First Novel',
  isbn: '99-A',
  releaseDate: ''
}, {
  author: 'John Smith',
  title: 'Second Novel',
  isbn: '99-B',
  releaseDate: new Date()
}];

module.exports.addBook = (data) => {
  if (!data.author) {
    return { statusCode: 400, message: 'Author is required and cannot be empty.' };
  }
  if (!data.title) {
    return { statusCode: 400, message: 'Title is required and cannot be empty.' };
  }
  if (!data.isbn) {
    return { statusCode: 400, message: 'ISBN is required and cannot be empty.' };
  }

  return { statusCode: 200, message: 'Book added successfully.' };
};

module.exports.fetchBooks = () => {
  return books;
};

module.exports.fetchOneBook = (id) => {
  const book = books.find(book => book.isbn === id);

  return book;
};

module.exports.updateBook = (data) => {
  const book = books.find(book => book.isbn === data.isbn);

  if (!book) {
    return { statusCode: 400, message: 'Cannot find book to update.' };
  }

  if (!data.author) {
    return { statusCode: 400, message: 'Author is required and cannot be empty.' };
  }
  if (!data.title) {
    return { statusCode: 400, message: 'Title is required and cannot be empty.' };
  }
  if (!data.isbn) {
    return { statusCode: 400, message: 'ISBN is required and cannot be empty.' };
  }

  return { statusCode: 200, message: 'Book updated successfully.' };
};

module.exports.deleteBook = (data) => {
  const book = books.find(book => book.isbn === data.isbn);

  if (!book) {
    return { statusCode: 400, message: 'Unable to find the book you are trying to delete.' };
  } else {
    return { statusCode: 200, message: 'Book deleted successfully.' };
  }
};
