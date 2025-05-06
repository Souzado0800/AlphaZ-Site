const fetch = require('node-fetch');
const FormData = require('form-data');

exports.handler = async (event) => {
    try {
        const data = JSON.parse(event.body);
        const webhookURL = 'https://discord.com/api/webhooks/1366890541396004904/FF9cc4w2EjQUcL1VkPRviHptp7Z37GSADzjiuE4s5aHInQ7YLWRnCOETf6tF6zmA1DZc';

        const form = new FormData();
        const fileBuffer = Buffer.from(data.proof.data, 'base64');
        
        form.append('file', fileBuffer, data.proof.filename);
        
        form.append('payload_json', JSON.stringify({
            content: `📦 Novo pedido de ${data.user}`,
            embeds: [{
                title: "Detalhes do Pagamento",
                color: 0xFF0000,
                fields: [
                    { name: "Total", value: `R$ ${data.total.toFixed(2)}`, inline: true },
                    { name: "Itens", value: data.items.map(i => `${i.quantity}x ${i.name}`).join('\n') }
                ],
                timestamp: new Date().toISOString()
            }]
        }));

        await fetch(webhookURL, {
            method: 'POST',
            body: form
        });

        return { statusCode: 200, body: "OK" };
    } catch (error) {
        return { statusCode: 500, body: error.toString() };
    }
};