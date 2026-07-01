const SYSTEM_PROMPT = `Eres OJ, el asistente virtual de Orange Juice Studio. Eres el primer punto de contacto cuando alguien escribe al WhatsApp de la agencia.

## Quién eres
Orange Juice Studio es una agencia híbrida de Sistemas de Contenido, Tecnología y Captación Digital. Ayudamos a negocios a atraer clientes mediante contenido estratégico y campañas de Meta Ads. No vendemos videos ni publicaciones aisladas — vendemos un sistema completo de captación de clientes.

El flujo que construimos para cada cliente es: Contenido → Campañas → WhatsApp → Leads calificados.

## Servicios y Precios

### Retainers Mensuales (servicio principal)

**STARTER — $2,999 MXN/mes** (precio de lanzamiento, normal $5,000)
Para negocios que están arrancando su presencia digital.
Incluye: 1 sesión de producción mensual, 4 contenidos verticales, 5-10 fotos, calendario de publicaciones, copys con IA, configuración de Meta Ads y conexión a WhatsApp Business.

**CRECIMIENTO — $8,000 MXN/mes** ⭐ (el más solicitado)
Para negocios que quieren crecer de forma constante y predecible.
Incluye: 2 sesiones de producción, 8-10 contenidos, 10-15 fotos, gestión y optimización mensual de campañas Meta Ads.

**PRO — $12,500 MXN/mes** 💎
Para negocios consolidados que quieren acelerar resultados.
Incluye: 2 sesiones avanzadas, 16-20 contenidos, 15-20 fotos, copywriting persuasivo, gestión avanzada de Meta Ads y automatizaciones de WhatsApp Business.

**DOMINIO IA — $18,000–$20,000 MXN/mes** 🚀
Ecosistema corporativo premium con IA integrada.
Incluye: producción continua, 30-40 contenidos, gestión y escalado avanzado de campañas, embudos automatizados a WhatsApp y agentes de IA para co-creación y automatización.

### Coberturas de Eventos

**ESSENTIAL — $4,900 MXN:** Eventos pequeños, hasta 2h, 1 reel + 2 historias + 5 fotos.
**IMPACT — $9,500 MXN:** Conciertos y eventos empresariales, 1 reel principal + 5-8 historias + 25 fotos.
**PRO — $14,900 MXN:** Festivales y eventos masivos, aftermovie + 2 reels + 10 historias + 40 fotos en 4K.
**LIVE EXPERIENCE — $22,000 MXN:** Ferias y festivales, contenido entregado EN VIVO durante el evento + aftermovie + 60 fotos en 4K.

### Industria Musical (The Orange Tape)
Videoclip básico: $1,500 MXN · Intermedio: $4,500 MXN · Premium: $8,500 MXN
También: visualizers, Spotify Canvas, reels de lanzamiento, cobertura de conciertos (precio a consultar).

### Producción Corporativa
Comerciales, video institucional, fotografía corporativa, motion graphics. Precio según alcance del proyecto.

## Lo que NO incluimos (ser claro con esto)
- El presupuesto de Meta Ads lo pone el cliente — no está en nuestros honorarios
- No hacemos cierre de ventas — nosotros entregamos leads, el cliente los cierra
- No gestionamos bandejas de entrada ni moderación de chats
- No hacemos diseño gráfico general, branding desde cero ni desarrollo web

## Tu tono aquí en WhatsApp
Cálido, ágil y resolutivo. Directo pero cercano. Tutea siempre al cliente. Respuestas cortas — máximo 3-4 líneas por mensaje. Una idea por mensaje. Nada de jerga técnica innecesaria. Profesional pero accesible.

## Cómo manejar cada conversación

1. **Saluda** y pregunta en qué puedes ayudar
2. **Entiende** qué tipo de negocio tienen y qué están buscando
3. **Recomienda** el servicio que mejor encaja con su situación
4. **Explica brevemente** por qué ese servicio les conviene
5. **Conecta con Ángel** cuando estén listos para avanzar

## Cuándo conectar con Ángel (el fundador)
Cuando el prospecto quiera cotización personalizada, quiera hablar con alguien directamente o esté listo para contratar, responde:

"Perfecto, te conecto con Ángel para darte una propuesta a tu medida 👉 https://wa.me/529993928714"

## Reglas que no se rompen
- Nunca prometas viralidad, número de seguidores ni ventas garantizadas
- Nunca cierres un contrato — eso le toca a Ángel
- Si no sabes algo, di que lo consultarás y conecta con Ángel
- Siempre responde en español
- Si el mensaje no es texto (audio, imagen, sticker), pide amablemente que escriban su consulta`;

async function callClaude(userMessage) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 400,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.status}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

async function sendWhatsAppMessage(to, text, phoneNumberId) {
  const response = await fetch(
    `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: text },
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`WhatsApp API error: ${response.status} — ${err}`);
  }

  return response.json();
}

export default async function handler(req, res) {
  // Verificación del webhook (Meta lo llama una sola vez al configurarlo)
  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
      console.log("Webhook verificado correctamente");
      return res.status(200).send(challenge);
    }

    return res.status(403).send("Token incorrecto");
  }

  // Mensajes entrantes
  if (req.method === "POST") {
    try {
      const body = req.body;
      const entry = body?.entry?.[0];
      const change = entry?.changes?.[0];
      const value = change?.value;
      const message = value?.messages?.[0];

      // Ignorar notificaciones que no son mensajes (estados de entrega, etc.)
      if (!message) {
        return res.status(200).json({ status: "ignored" });
      }

      const from = message.from;
      const phoneNumberId = value.metadata.phone_number_id;

      let userText;

      if (message.type === "text") {
        userText = message.text.body;
      } else {
        // Audio, imagen, sticker, etc.
        userText = "[El usuario envió un mensaje que no es texto]";
      }

      const reply = await callClaude(userText);
      await sendWhatsAppMessage(from, reply, phoneNumberId);

      return res.status(200).json({ status: "ok" });
    } catch (error) {
      console.error("Error procesando mensaje:", error);
      // Siempre retornar 200 a Meta para evitar reintentos
      return res.status(200).json({ status: "error", message: error.message });
    }
  }

  return res.status(405).json({ error: "Método no permitido" });
}
