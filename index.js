require('dotenv').config();
const { Telegraf } = require('telegraf')
const { env : { TOKEN_KEY, MOVIE_API_KEY } } = process;
const axios = require('axios');
const _ = require('underscore');
const bot = new Telegraf(TOKEN_KEY);

const welcomeMessage = (ctx) => {
  const { from: { first_name } } = ctx;
  return(`Welcome ${first_name} 😊! \nI'm  Movie-review Bot.\nSend me name of the movie, i will give you\nthe details and rating.`);
}

const getRatingValue = (Rating, movie) => {
  let formatValue = '';
  Rating.map(value => {
    formatValue += `\n${value.Source}: ${value.Value},`
  });
  if(_.property('imdbRating')(movie)) {
    formatValue += `\nImdb Rating: ${_.property('imdbRating')(movie)}/10`
  }
  return formatValue;
}

const setUpTheStructure = (movie) => {
  let header = ['Title', 'Year', 'Country', 'Rated',
    'Released', 'Genre', 'Runtime', 'Director', 'Plot', 'Ratings'];
  let movieFormatted = '';
  header.map((value) => {
    let movieProperty = _.property(value)(movie);
    if (value !== 'Ratings' && movieProperty) {
      movieFormatted += `\n${value}: ${movieProperty},`
    } else if (movieProperty) {
      movieFormatted += `
      \nRatings: ${getRatingValue(movieProperty, movie)}`;
    }
  })
  return movieFormatted;
}

// basic commands
bot.start((ctx) => {
  ctx.reply(welcomeMessage(ctx));
});
bot.help((ctx) => ctx.reply(welcomeMessage(ctx)));

// listen to commands
bot.on(['sticker', 'photo'], (ctx) => ctx.reply('👍'));
bot.hears('hi', (ctx) => (ctx.reply('Hey there')));
bot.on('text', (ctx) => {
  const { message: { text } } = ctx
  ctx.reply(`looking for. . . ${text}`);

  axios.get(`${MOVIE_API_KEY}&t=${text}`).then((res) => {
    const { data } = res;
    if (data.Response !== 'False') {
      const response = data;
      const { Poster } = response;
      ctx.replyWithPhoto({
        url: Poster
      }, {
        caption: setUpTheStructure(response),
      })
    } else {
      ctx.reply(`Sorry i cannot find ${text} 😢.`);
    }
  }).catch((error) => {
    ctx.reply(`Sorry i cannot find ${text} 😢.`);
  });

});
bot.launch();
