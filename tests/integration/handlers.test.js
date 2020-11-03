const request = require('supertest');
let server;

describe('handlers /api/book', () => {
  const book = {
    author: 'John Doe',
    title: 'First Novel',
    isbn: '99-A',
    releaseDate: ''
  };

  const bookToUpdate = {
    title: 'Second Novel',
    isbn: '99-A'
  };

  beforeAll(() => { server = require('../../index'); });
  afterAll(done => {
    server.close();
  });

  describe('post method', () => {
    it('should create a new book and return 200 status', async () => {
      const response = await request(server).post('/api/book').send(book);

      expect(response.status).toBe(200);
    });

    it('should return error if book is already present', async () => {
      const response = await request(server).post('/api/book').send(book);

      expect(response.error.text).toContain('book already exists');
    });

    it('should return error with status 400 if payload is invalid', async () => {
      const response = await request(server).post('/api/book').send(book);

      expect(response.status).toBe(400);
    });
  });

  describe('GET method', () => {
    it('should return all the books', async () => {
      const response = await request(server).get('/api/book');

      expect(JSON.parse(response.text)).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ isbn: '99-A' })
        ])
      );
    });

    it('should return a book if valid isbn is passed', async () => {
      const response = await request(server).get('/api/book?isbn=99-A');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('isbn', '99-A');
    });
  });

  describe('PUT Method', () => {
    it('should update book values', async () => {
      const result = await request(server).put('/api/book').send(bookToUpdate);

      expect(result.status).toBe(200);
    });

    it('should return 404 not found error', async () => {
      const response = await request(server).put('/api/book').send({ isbn: '9' });

      expect(response.error.text).toContain('Unable to find the book you are trying to update.');
    });
  });

  describe('DELETE method', () => {
    it('should successfully delete a book using isbn id', async () => {
      const response = await request(server).delete('/api/book').send({
        isbn: '99-A'
      });

      expect(response.status).toBe(200);
    });

    it('should return 404 not found if invalid isbn is passed to delete a book', async () => {
      const response = await request(server).delete('/delete').send({
        isbn: '100'
      });

      expect(response.status).toBe(404);
    });
  });
});
