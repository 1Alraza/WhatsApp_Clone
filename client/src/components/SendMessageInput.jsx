import { useState } from 'react';

export default function SendMessageInput({ onSend }) {
  const [text, setText] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-300 flex gap-2">
      <input
        type="text"
        placeholder="Type a message"
        value={text}
        onChange={e => setText(e.target.value)}
        className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-green-400"
      />
      <button
        type="submit"
        className="bg-green-500 hover:bg-green-600 text-white rounded-full px-6 py-2 text-lg"
      >
        Send
      </button>
    </form>
  );
}
