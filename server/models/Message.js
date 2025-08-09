import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  messageId: { type: String, required: true, unique: true },
  wa_id: { type: String, required: true },
  contactName: { type: String },
  fromMe: { type: Boolean, required: true },
  from: { type: String },
  to: { type: String },
  text: { type: String },
  type: { type: String, required: true },
  timestamp: { type: Date, required: true },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read', 'received'],
    default: 'sent'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Auto-update updatedAt before saving
MessageSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Message = mongoose.model('Message', MessageSchema);

export default Message;
