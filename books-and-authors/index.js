const { ApolloServer, gql, UserInputError } = require("apollo-server");
const mongoose = require("mongoose");
const MONGODB_URI = require("./mongoCridentials");
const Book = require("./models/book");
const Author = require("./models/author");

console.log("connecting to", MONGODB_URI);

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connection to MongoDB:", error.message);
  });

/*let authors = [
  {
    name: "Robert Martin",
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: "Martin Fowler",
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963,
  },
  {
    name: "Fyodor Dostoevsky",
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821,
  },
  {
    name: "Joshua Kerievsky", // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  {
    name: "Sandi Metz", // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
];*/

/*
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
 */

/*let books = [
  {
    title: "Clean Code",
    published: 2008,
    author: "Robert Martin",
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring"],
  },
  {
    title: "Agile software development",
    published: 2002,
    author: "Robert Martin",
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ["agile", "patterns", "design"],
  },
  {
    title: "Refactoring, edition 2",
    published: 2018,
    author: "Martin Fowler",
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring"],
  },
  {
    title: "Refactoring to patterns",
    published: 2008,
    author: "Joshua Kerievsky",
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring", "patterns"],
  },
  {
    title: "Practical Object-Oriented Design, An Agile Primer Using Ruby",
    published: 2012,
    author: "Sandi Metz",
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring", "design"],
  },
  {
    title: "Crime and punishment",
    published: 1866,
    author: "Fyodor Dostoevsky",
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ["classic", "crime"],
  },
  {
    title: "The Demon ",
    published: 1872,
    author: "Fyodor Dostoevsky",
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ["classic", "revolution"],
  },
];
*/

const typeDefs = gql`
  type Book {
    id: ID!
    title: String!
    published: Int!
    author: Author!
    genres: [String!]
  }

  type Author {
    id: ID!
    name: String!
    born: Int
    bookCount: Int!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book

    editAuthor(name: String!, setBornTo: Int!): Author
  }
`;

const resolvers = {
  Author: {
    bookCount: async (root) => {
      let booksAmount = 0;
      await Book.count({ author: root.id }, async (err, count) => {
        booksAmount = count;
      });
      return booksAmount;
    },
  },

  Query: {
    bookCount: () => {
      return Book.collection.countDocuments();
    },
    authorCount: () => {
      return Author.collection.countDocuments();
    },
    allBooks: async (root, args) => {
      //no genre, no author
      if (!args.author && !args.genre) {
        const books = await Book.find({}).populate("author");
        return books;
      }

      //no genre, yes author
      /*if (!args.genre && args.author) {
        return books.filter((book) => book.author === args.author);
      }*/

      //yes genre, no author
      if (!args.author && args.genre) {
        const books = await Book.find({
          genres: { $in: args.genre },
        }).populate("author");
        return books;
      }

      //yes genre, yes author
      /*return books.filter(
        (book) =>
          book.author === args.author &&
          book.genres.find((genre) => genre === args.genre)
      );*/
    },
    allAuthors: async () => {
      const authors = await Author.find({});
      return authors;
    },
  },

  Mutation: {
    addBook: async (root, args) => {
      if (!args.author || !args.title) {
        throw new UserInputError("author and title can't be empty");
      }
      let author = null;
      await Author.exists({ name: args.author }).then(async (exists) => {
        if (exists) {
          author = await Author.findOne({ name: args.author });
        } else {
          author = new Author({
            name: args.author,
            born: null,
          });
          author = await author.save();
        }
      });
      const newBook = new Book({
        ...args,
        author,
      });
      await newBook.save();
      return newBook;
    },

    editAuthor: async (root, args) => {
      const authorToUpdate = Author.findOne({ name: args.name });
      if (!authorToUpdate) {
        return null;
      }

      await Author.updateOne({ name: args.name }, { born: args.setBornTo });

      return authorToUpdate;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
