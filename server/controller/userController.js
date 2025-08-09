import Message from '../models/Message.js';

export const getMessages = async (req, res) => {
  try {
    const { wa_id } = req.query; // Optional filter by WA ID
    let filter = {};

    if (wa_id) {
      filter = {
        $or: [
          { wa_id: wa_id }, // Match contact's WA ID
          { from: wa_id },  // Or sent from WA ID
          { to: wa_id }     // Or sent to WA ID
        ]
      };
    }

    const messages = await Message.find(filter).sort({ timestamp: 1 }); // Sort oldest to newest
    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { to, text, contactName } = req.body; // Contact info from frontend
    if (!to || !text) {
      return res.status(400).json({ error: 'Missing "to" or "text" fields' });
    }

    const MY_WA_ID = process.env.MY_WA_ID || '918329446654'; // Your WA ID

    const newMessage = new Message({
      messageId: `local-${Date.now()}`, // Local unique ID
      wa_id: to,
      contactName: contactName || '',
      fromMe: true, // Mark as sent by me
      from: MY_WA_ID,
      to,
      text,
      type: 'text',
      timestamp: new Date(),
      status: 'sent', // Default sent status
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await newMessage.save(); // Save to DB

    res.status(201).json({ message: 'Message saved', data: newMessage });
  } catch (err) {
    console.error('Error saving new message:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
