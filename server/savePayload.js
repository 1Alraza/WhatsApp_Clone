import Message from './models/Message.js';

export async function savePayload(payload) {
  try {
    const entries = payload.metaData.entry;

    for (const entry of entries) {
      for (const change of entry.changes) {
        const value = change.value;

        // Process incoming messages
        if (value.messages && value.contacts) {
          const messages = value.messages;
          const contacts = value.contacts;

          for (let i = 0; i < messages.length; i++) {
            const msg = messages[i];
            const contact = contacts[i] || contacts[0];

            const messageDoc = {
              messageId: msg.id,
              from: msg.from,
              to: value.metadata.display_phone_number,
              text: msg.text?.body || '',
              timestamp: new Date(msg.timestamp * 1000),
              type: msg.type,
              status: 'received',
              wa_id: contact.wa_id,
              contactName: contact.profile?.name || 'Unknown',
              fromMe: false,
              createdAt: new Date(),
              updatedAt: new Date(),
            };

            console.log(`Saving message from ${messageDoc.contactName}: ${messageDoc.text}`);

            await Message.findOneAndUpdate(
              { messageId: messageDoc.messageId },
              messageDoc,
              { upsert: true, new: true }
            );
          }
        }

        // Process message status updates
        if (value.statuses) {
          for (const status of value.statuses) {
            const update = {
              status: status.status,
              updatedAt: new Date(status.timestamp * 1000),
            };

            console.log(`Updating status for message ${status.id} to ${status.status}`);

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
