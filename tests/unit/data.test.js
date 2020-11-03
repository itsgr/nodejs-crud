const mock = require('../../utils/mock');

describe('Create', () => {
  it('Should add new book', () => {
    const response = mock.addBook({
      author: 'John Doe',
      title: 'First Novel',
      isbn: '99-A',
      releaseDate: ''
    });

    expect(response.statusCode).toBe(200);
    expect(response.message).toContain('Book added successfully.');
  });

  it('Should return error', () => {
    const response = mock.addBook({
      title: 'First Novel',
      isbn: '99-A',
      releaseDate: ''
    });

    expect(response.statusCode).toBe(400);
    expect(response.message).toContain('Author is required and cannot be empty.');
  });
});

describe('Read', () => {
  it('Should return all books', () => {
    const response = mock.fetchBooks();

    expect(response).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ isbn: expect.any(String) })
      ])
    );
  });

  it('Should return requested book', () => {
    const response = mock.fetchOneBook('99-B');

    expect(response).toMatchObject({
      author: expect.any(String),
      title: expect.any(String),
      isbn: expect.any(String),
      releaseDate: expect.any(Date)
    });
  });
});

describe('Update', () => {
  it('Should update existing book', () => {
    const response = mock.updateBook({
      author: 'Author',
      title: 'Title',
      isbn: '99-A',
      releaseDate: ''
    });

    expect(response.statusCode).toBe(200);
    expect(response.message).toContain('Book updated successfully.');
  });

  it('Should return error for invalid isbn', () => {
    const response = mock.updateBook({
      author: 'Author',
      title: 'Title',
      isbn: '99',
      releaseDate: ''
    });

    expect(response.statusCode).toBe(400);
    expect(response.message).toContain('Cannot find book to update.');
  });
});

describe('Delete', () => {
  it('Should remove requested book', () => {
    const response = mock.deleteBook({
      author: 'Author',
      title: 'Title',
      isbn: '99-A',
      releaseDate: ''
    });

    expect(response.statusCode).toBe(200);
    expect(response.message).toContain('Book deleted successfully.');
  });

  it('Should return error for invalid isbn', () => {
    const response = mock.deleteBook({
      author: 'Author',
      title: 'Title',
      isbn: '99',
      releaseDate: ''
    });

    expect(response.statusCode).toBe(400);
    expect(response.message).toContain('Unable to find the book you are trying to delete.');
  });
});
