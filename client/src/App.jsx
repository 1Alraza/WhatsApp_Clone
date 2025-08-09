import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ConversationList from './components/ConversationList';
import ChatWindow from './components/ChatWindow';
import SendMessageInput from './components/SendMessageInput';

const MY_WA_ID = '918329446654';

export default function App() {
  const [conversations, setConversations] = useState([]);
  const [selectedWaId, setSelectedWaId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false); // For small screens toggle

  // Fetch conversations
  useEffect(() => {
    axios.get('http://localhost:3000/api/messages')
      .then(res => {
        const data = res.data;
        const grouped = data.reduce((acc, msg) => {
          if (!acc[msg.wa_id]) acc[msg.wa_id] = [];
          acc[msg.wa_id].push(msg);
          return acc;
        }, {});

        const convoArray = Object.entries(grouped).map(([wa_id, msgs]) => {
          msgs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          const contactName = msgs.find(m => m.contactName && m.contactName.trim() !== '')?.contactName || wa_id;

          return {
            wa_id,
            contactName,
            lastMessage: msgs[0].text,
            lastTimestamp: msgs[0].timestamp,
          };
        });

        setConversations(convoArray);
        if (convoArray.length) setSelectedWaId(convoArray[0].wa_id);
      })
      .catch(console.error);
  }, []);

  // Fetch messages for selected conversation
  useEffect(() => {
    if (!selectedWaId) {
      setMessages([]);
      return;
    }

    axios.get(`http://localhost:3000/api/messages?wa_id=${selectedWaId}`)
      .then(res => {
        const msgs = res.data.map(msg => ({
          ...msg,
          fromMe: msg.from === MY_WA_ID,
          contactName: msg.contactName || '',
        }));
        msgs.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        setMessages(msgs);
      })
      .catch(console.error);

    // Close sidebar on mobile after selecting conversation
    setSidebarOpen(false);
  }, [selectedWaId]);

  const handleSendMessage = async (text) => {
    if (!selectedWaId) return;

    const contact = conversations.find(c => c.wa_id === selectedWaId);
    const contactName = contact?.contactName || '';

    try {
      const res = await axios.post('http://localhost:3000/api/send', {
        to: selectedWaId,
        text,
        contactName,
      });

      let data = res.data.data;

      data = {
        ...data,
        fromMe: true,
        from: MY_WA_ID,
        contactName,
        wa_id: selectedWaId,
        status: 'sent',
      };

      setMessages(prev => [...prev, data]);

      setConversations(prev => prev.map(c =>
        c.wa_id === selectedWaId
          ? { ...c, lastMessage: text, lastTimestamp: new Date().toISOString() }
          : c
      ));
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <>
      {/* Sidebar overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300 ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      <div className="grid grid-cols-[18rem_1fr] h-screen">
        {/* Sidebar */}
        <aside
          className={`bg-white border-r border-gray-300 overflow-y-auto z-50 md:static absolute top-0 left-0 bottom-0 transform md:translate-x-0 transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <ConversationList
            conversations={conversations}
            selectedWaId={selectedWaId}
            onSelect={setSelectedWaId}
          />
        </aside>

        {/* Main chat area */}
        <main className="flex flex-col">
          {/* Mobile header with hamburger */}
          <header className="md:hidden flex items-center justify-between p-4 border-b border-gray-300 bg-gray-50">
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open conversations"
              className="p-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              {/* Hamburger icon */}
              <svg
                className="h-6 w-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <h1 className="font-semibold text-lg">
              {conversations.find(c => c.wa_id === selectedWaId)?.contactName || 'Select Conversation'}
            </h1>
            <div style={{ width: 40 }} /> {/* Empty for spacing */}
          </header>

          <ChatWindow messages={messages} />
          <SendMessageInput onSend={handleSendMessage} />
        </main>
      </div>
    </>
  );
}