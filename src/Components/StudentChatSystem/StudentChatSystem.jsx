import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const StudentChatSystem = () => {
  const teacherId = "6877415b70653e04bafe38fc";
  const studentId = "68763209c2235ba05a26a889";
  const classId = "684011dd1c848dcd5128b0ac";
  const role = "student";
  const userId = "68763209c2235ba05a26a889";

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const socketRef = useRef(null);

  useEffect(() => {
    axios.get(`http://192.168.1.5:4000/api/messages/${teacherId}/${studentId}`)
      .then(res => setMessages(res.data));

    socketRef.current = io('http://192.168.1.5:4000', {
      query: { userId, role }
    });

    socketRef.current.on('new_message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (!text.trim()) return;

    socketRef.current.emit('send_message', {
      studentId, teacherId, classId, message: text, sender: role
    });

    setMessages(prev => [...prev, { message: text, sender: role }]);
    setText('');
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white rounded-lg shadow-lg flex flex-col h-96 border">
      <h1 className='text-center'>STUDENT</h1>

      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 flex ${msg.sender === role ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`px-3 py-2 rounded-lg text-sm ${msg.sender === role ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'
              }`}>
              {msg.message}
            </div>
          </div>
        ))}
      </div>
      <div className="p-2 border-t flex">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none"
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default StudentChatSystem;
