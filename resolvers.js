const { v4: uuidV4 } = require("uuid");


const resolvers = {
  Movie: {
    imdbData: async (parent, args, ctx) => {
      const movie = parent;
      const title = movie.get("title");
      const imdbData = await ctx.omdb.fetchOmdbData(title);

      return imdbData;
    }
  },
  Query: {
    allMovies: (_, __, ctx) => {
      const movies = ctx.db.Movie.findAll();
      return movies;
    },
    movie: async (_, { id }, ctx ) => {
      const movie = await ctx.db.Movie.findByPk(id);
      return movie;
    }
  },
  Mutation: {
    addMovie: async (_, { title, year }, ctx) => {
      const imdbData = await ctx.omdb.fetchOmdbData(title);
      const pitch = imdbData.Plot;

      const movie = await ctx.db.Movie.create({
        id: `movies/${uuidV4()}`,
        title,
        year,
        pitch
      })

      return movie.get({plain: true});
    },
    removeMovie: async (_, { id }, ctx) => {
      const movie = await ctx.db.Movie.findByPk(id)

      movie.destroy();

      return movie.get({ plain: true});
    }
  }
}

module.exports = resolvers;
