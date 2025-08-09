import React from 'react';

export default function ConversationList({ conversations, selectedWaId, onSelect }) {
  return (
    <div className="w-72 border-r border-gray-300 overflow-y-auto h-full">
      {conversations.map(({ wa_id, contactName, lastMessage, lastTimestamp }) => (
        <div
          key={wa_id}
          onClick={() => onSelect(wa_id)}
          className={`p-4 cursor-pointer border-b border-gray-200
            ${wa_id === selectedWaId ? 'bg-gray-200' : 'bg-white'}
            hover:bg-gray-100`}
        >
          <strong className="block text-lg">{contactName}</strong>
          <p className="text-gray-600 text-sm truncate">{lastMessage}</p>
          <small className="text-gray-400 text-xs">{new Date(lastTimestamp).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
}
