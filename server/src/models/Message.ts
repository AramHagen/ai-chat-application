import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  chatId: mongoose.Types.ObjectId;
  role: 'user' | 'assistant';
  content: string;
  feedback: 'positive' | 'negative' | null;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    chatId: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    feedback: { type: String, enum: ['positive', 'negative', null], default: null },
  },
  { timestamps: true }
);

export default mongoose.model<IMessage>('Message', MessageSchema);