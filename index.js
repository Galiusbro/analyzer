const express = require("express");
const OpenAI = require("openai");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(express.json());

app.post("/api", async (req, res) => {
  try {
    const { text } = req.body;

    const messages = [
      { role: "system", content: "You are a helpful assistant." },
      {
        role: "user",
        content: `If this data is similar to the recipe data - reply with (hello), 
else:
Extract just the JSON without the characters before and after the JSON from the following receipt text: ${text}.
Please return the information in the following JSON format:
{
    "storeName": "",
    "date": "", - in the format of "YYYY-MM-DD hh:mm"
    "address": "",
    "totalPrice": , - number
    "taxAndServ": , - number
    "mainCategory": "",
    "lineItems": [
      { 
        productName: "", 
        category: "", 
        itemPrice: , - number
        quantity: , - number
        totalPrice: , - number
        "modifiers": [] - if needed
      },
    ],
    "locale": {
        "language": "", - in the format of "en-US"
        "country": "", - in the format of "US"
        "currency": "" - in the format of "USD"
    }
}
also if have additional information put it in description field`,
      },
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
    });

    res.json({
      response: response.choices[0].message.content,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
