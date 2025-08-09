import Message from './models/Message.js';

export async function savePayload(payload) {
  try {
    const entries = payload.metaData.entry; // Extract 'entry' array from payload

    for (const entry of entries) {
      for (const change of entry.changes) {
        const value = change.value;

        // Incoming message handling 
        if (value.messages && value.contacts) {
          const messages = value.messages;
          const contacts = value.contacts;

          for (let i = 0; i < messages.length; i++) {
            const msg = messages[i];
            const contact = contacts[i] || contacts[0]; // Fallback to first contact

            // Prepare a message object to store in DB
            const messageDoc = {
              messageId: msg.id,
              from: msg.from, // Sender's WA ID
              to: value.metadata.display_phone_number, // Business WA number
              text: msg.text?.body || '', // If text exists, else empty
              timestamp: new Date(msg.timestamp * 1000), // Convert UNIX to Date
              type: msg.type, // text/image/etc.
              status: 'received', // Incoming message default status
              wa_id: contact.wa_id,
              contactName: contact.profile?.name || 'Unknown',
              fromMe: false, // Mark as incoming
              createdAt: new Date(),
              updatedAt: new Date(),
            };

            console.log(`Saving message from ${messageDoc.contactName}: ${messageDoc.text}`);

            // Save message to DB (update if messageId already exists)
            await Message.findOneAndUpdate(
              { messageId: messageDoc.messageId },
              messageDoc,
              { upsert: true, new: true }
            );
          }
        }

        // Message status updates
        if (value.statuses) {
          for (const status of value.statuses) {
            const update = {
              status: status.status, // delivered/read/sent
              updatedAt: new Date(status.timestamp * 1000),
            };

            console.log(`Updating status for message ${status.id} to ${status.status}`);

            // Update status in DB based on messageId
            await Message.findOneAndUpdate(
              { messageId: status.id },
              update
            );
          }
        }
      }
    }
  } catch (error) {
    console.error('Error saving payload:', error);
  }
}
