const { Telegraf } = require('telegraf');

function iniciarTelegramBot(ragService) {
    const token = process.env.TELEGRAM_BOT_TOKEN;

    if (!token) {
        console.warn('TELEGRAM_BOT_TOKEN no configurado; el bot de Telegram no se iniciará.');
        return null;
    }

    const bot = new Telegraf(token);

    bot.start((ctx) => {
        ctx.reply('Hola 👋 Soy el asistente de precios. Pregúntame, por ejemplo: "¿Cuánto cuesta la gorra negra?"');
    });

    bot.on('text', async (ctx) => {
        const texto = ctx.message.text;
        try {
            const resultado = await ragService.responder(texto);
            await ctx.reply(resultado.respuesta);
        } catch (error) {
            console.error('Error en el bot de Telegram:', error);
            await ctx.reply('Ocurrió un error al procesar tu consulta. Intenta de nuevo.');
        }
    });

    bot.launch();
    console.log('Bot de Telegram iniciado (modo polling, Telegraf).');

    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));

    return bot;
}

module.exports = iniciarTelegramBot;
