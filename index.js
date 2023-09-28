const telegramAPI = require("node-telegram-bot-api");

const { gameNumbers, againOptions } = require("./options");

const token = "6492126293:AAEnoB70TmeD9prihzo4NKteSHrN7sYBS_8";

const bot = new telegramAPI(token, { polling: true });

const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    `Сейчас я загадаю цифру от 0 до 9, а ты должен её отгадать`
  );
  const randomNum = Math.floor(Math.random() * 10);
  chats[chatId] = randomNum;
  await bot.sendMessage(chatId, "Отгадывай", gameNumbers);
};

const start = () => {
  bot.setMyCommands([
    { command: "/start", description: "Начальное приветствие" },
    { command: "/info", description: "Получение информации о пользователе" },
    { command: "/game", description: "Игра угадай цифру от 0 до 9" },
  ]);

  bot.on("message", async (msg) => {
    const msgText = msg.text;
    const chatId = msg.chat.id;

    if (msgText === "/start") {
      await bot.sendSticker(
        chatId,
        "https://tlgrm.eu/_/stickers/ccd/a8d/ccda8d5d-d492-4393-8bb7-e33f77c24907/1.webp"
      );
      return bot.sendMessage(chatId, "Привет!");
    }

    if (msgText === "/info") {
      return bot.sendMessage(
        chatId,
        `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`
      );
    }

    if (msgText === "/game") {
      return startGame(chatId);
    }

    return bot.sendMessage(chatId, "Я тебя не понимаю, попробуй ещё раз");
  });

  bot.on("callback_query", async (msg) => {
    const msgData = msg.data;
    const chatId = msg.message.chat.id;

    if (msgData === "/again") {
      return startGame(chatId);
    }

    if (msgData === chats[chatId]) {
      return bot.sendMessage(
        chatId,
        `Поздравляю, ты отгадал цифру ${chats[chatId]}`,
        againOptions
      );
    } else {
      return bot.sendMessage(
        chatId,
        `Ты не угадал, я загадал цифру ${chats[chatId]}`,
        againOptions
      );
    }
  });
};

start();
