const {Telegraf} = require('telegraf');
const bot = new Telegraf('6130887277:AAEP7wGNyK1nD_VGvWAhPRL66XQ9P1HGJJ4');

bot.command('start', soo => { 
    bot.telegram.sendMessage(soo.chat.id, 'Алеееееее!')
    bot.telegram.sendSticker(soo.chat.id, 'CAACAgIAAxkBAAEJMCVkefo_OHJKy2sZRZPqPpHYQtVLrgACtwMAAn60IAWw5lycHup4ry8E');
});

bot.on('text', soo => {
    bot.telegram.sendMessage(soo.chat.id, 'echo: ' + soo.message.text, {})
});

bot.launch();