const fetch = require('node-fetch');

exports.handler = async (event) => {
  // Só aceita requisições POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body);
    const WEBHOOK_URL = 'https://discord.com/api/webhooks/1366890541396004904/FF9cc4w2EjQUcL1VkPRviHptp7Z37GSADzjiuE4s5aHInQ7YLWRnCOETf6tF6zmA1DZc';

    // Formata a mensagem para o Discord
    const embed = {
      title: data.status === 'confirmed' ? '✅ Pagamento Confirmado' : '🛒 Nova Compra',
      description: `Compra no DayZ Black Market`,
      color: data.status === 'confirmed' ? 0x2ecc71 : 0xe67e22,
      fields: [
        { name: 'Cliente', value: data.user || 'Não identificado' },
        { name: 'Total', value: `R$ ${data.total.toFixed(2)}` },
        { 
          name: 'Itens', 
          value: data.items.map(i => `• ${i.name} (x${i.quantity})`).join('\n') 
        }
      ],
      timestamp: new Date().toISOString()
    };

    // Envia para o Discord
    await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        username: 'DayZ Bot',
        embeds: [embed] 
      })
    });

    return { statusCode: 200, body: 'Notificação enviada!' };
  } catch (error) {
    return { statusCode: 500, body: 'Erro: ' + error.message };
  }
};