import Message from '../models/Message.js';

export const getMessages = async (req, res) => {
  try {
    const { wa_id } = req.query;
    let filter = {};

    if (wa_id) {
      filter = {
        $or: [
          { wa_id: wa_id },
          { from: wa_id },
          { to: wa_id }
        ]
      };
    }

    const messages = await Message.find(filter).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { to, text, contactName } = req.body;  // accept contactName from frontend
    if (!to || !text) {
      return res.status(400).json({ error: 'Missing "to" or "text" fields' });
    }

    const MY_WA_ID = process.env.MY_WA_ID || '918329446654'; // Your WhatsApp ID

    const newMessage = new Message({
      messageId: `local-${Date.now()}`,  // unique local ID
      wa_id: to,
      contactName: contactName || '',   // save contactName for sent message
      fromMe: true,
      from: MY_WA_ID,                   // use your WA ID as sender
      to,
      text,
      type: 'text',
      timestamp: new Date(),
      status: 'sent',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await newMessage.save();

    res.status(201).json({ message: 'Message saved', data: newMessage });
  } catch (err) {
    console.error('Error saving new message:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};