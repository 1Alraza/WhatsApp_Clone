import React from 'react';

export default function ChatWindow({ messages }) {
  if (!messages.length) return (
    <div className="p-4 text-center text-gray-500 flex-grow">No messages yet</div>
  );

  const contactName =
    messages.find(m => !m.fromMe && m.contactName.trim() !== '')?.contactName
    || messages.find(m => m.fromMe && m.contactName.trim() !== '')?.contactName
    || 'Unknown';

  const contactNumber = messages.find(m => !m.fromMe)?.wa_id || messages[0].wa_id || '';

  return (
    <div className="flex flex-col h-full border-l border-gray-300 bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-300 bg-gray-50">
        <h2 className="font-semibold text-lg">{contactName}</h2>
        <p className="text-sm text-gray-600">{contactNumber}</p>
      </div>

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
        {messages
          .slice()
          .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)) // oldest to newest
          .map(msg => {
            const isSent = msg.fromMe;
            const alignment = isSent
              ? 'self-end bg-green-600 text-white'
              : 'self-start bg-gray-200 text-gray-900';

            const senderDisplayName = isSent ? 'You' : msg.contactName || 'Unknown';
            const receiverDisplayName = isSent ? msg.contactName || 'Unknown' : 'You';

            return (
              <div
                key={msg.messageId || msg._id}
                className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg break-words ${alignment}`}
              >
                {/* Sender name */}
                <div className="text-xs font-semibold mb-1">{senderDisplayName}</div>

                {/* Message text */}
                <div className="text-sm whitespace-pre-wrap">{msg.text}</div>

                {/* Timestamp and status */}
                <div className="text-xs mt-1 flex justify-between text-gray-300 items-center">
                  <span>{new Date(msg.timestamp).toLocaleString()}</span>
                  {isSent && (
                    <span className="flex items-center space-x-1">
                      {msg.status === 'sent' && (
                        <span>✓</span> // single tick gray
                      )}
                      {msg.status === 'delivered' && (
                        <span>✓✓</span> // double tick gray
                      )}
                      {msg.status === 'read' && (
                        <>
                          {/* Two blue ticks SVG */}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="inline h-4 w-4 text-blue-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="inline h-4 w-4 text-blue-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </>
                      )}
                    </span>
                  )}
                </div>

                {/* Show receiver for sent messages */}
                {isSent && (
                  <div className="text-xs text-gray-400 mt-0.5">To: {receiverDisplayName}</div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
