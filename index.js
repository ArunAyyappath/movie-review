require('dotenv').config();

const { env : { TOKEN_KEY } } = process;

console.log(TOKEN_KEY);
const telegramBot = require('node-telegram-bot-api');

let token = TOKEN_KEY;

const bot =  new telegramBot(token, { polling: true });

bot.onText(/\/start/, (message, match) => {
  const chatId = message.chat.id;
  console.log(message.chat.first_name);
  bot.sendMessage(chatId, '');
});

bot.on('message', (msg) => {
  let chatId = msg.chat.id;
  console.log(msg.text);
  bot.sendMessage(chatId, `Hai ${msg.text}`);
});

