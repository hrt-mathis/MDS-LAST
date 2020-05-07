const { v4: uuidV4 } = require("uuid");
const Sequelize = require("sequelize");
const { ApolloServer, gql } = require("apollo-server");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./data.db"
})

const Movie = sequelize.define("movies", {
  id: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  title: {
    type: Sequelize.STRING
  },
  year: {
    type: Sequelize.INTEGER
  },
})

sequelize.sync();

const typeDefs = gql`
  type Movie {
    id: ID!
    title: String!
    year: Int
  }

  type Query {
    allMovies: [Movie]
    movie(id: ID): Movie
  }

  type Mutation {
    addMovie(title: String!, year: Int): Movie
  }
`

const resolvers = {
  Query: {
    allMovies: () => {
      const movies = Movie.findAll();
      return movies;
    },
    movie: (_, { id } ) => {
      const movie = Movie.findByPk(id);
      return movie;
    }
  },
  Mutation: {
    addMovie: async (_, { title, year}) => {
      const movie = await Movie.create({
        id: `movies/${uuidV4()}`,
        title,
        year
      })

      return movie.get({plain: true});
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen()
      .then(info => console.log(`server listening at ${info.url}`))
