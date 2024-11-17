// src/components/ChatPageMobile.tsx

import React, { useEffect, useState } from 'react';
import { HubConnectionBuilder, HubConnection } from '@microsoft/signalr';
import { BASE_CHAT_HUB_URL } from '../../../configs/GeneralApiType';
import './chatPage.css';
import { useAuthUser } from 'react-auth-kit';

const ChatPageMobile: React.FC = () => {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [messages, setMessages] = useState<{ user: string; message: string; date: Date }[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const auth = useAuthUser();
  const user = auth()?.user;
  const userId = user.id; 
  const activityId = "9cbb1e2a-5eab-4d56-bb7a-e3e0a5d1f472"; 
  

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(BASE_CHAT_HUB_URL, { withCredentials: false })
      .withAutomaticReconnect()
      .build();
    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection.start()
        .then(async () => {
          console.log("Conectado al hub de mensajes");

          await connection.invoke("JoinChat", userId, activityId);

          connection.on("NotifyJoinChat", (joinedUserId: string, joinedActivityId: string) => {
            if (joinedActivityId === activityId && joinedUserId !== userId) {
              console.log(`El usuario ${joinedUserId} se ha unido al chat.`);
              setMessages((prevMessages) => [
                ...prevMessages,
                { user: "System", message: `El usuario ${joinedUserId} se ha unido al chat.`, date: new Date() }
              ]);
            }
          });
        })
        .catch(error => console.error("Error al conectar con el hub:", error));
    }

    return () => {
      connection?.stop();
    };
  }, [connection]);
  const sendMessage = async () => {
    if (connection && inputMessage.trim()) {
      try {
        await connection.send("SendMessage", userId, inputMessage);
        setMessages((prevMessages) => [
          ...prevMessages,
          { user: userId, message: inputMessage, date: new Date() }
        ]); 
        setInputMessage("");
      } catch (error) {
        console.error("Error al enviar mensaje:", error);
      }
    }
  };

  return (
    <div className="chat-container">
      <h2>Chat en Tiempo Real</h2>

      <div className="messages-container">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.user === userId ? 'sent' : 'received'}`}>
            <span className="user">{msg.user}:</span>
            <span className="text">{msg.message}</span>
            <span className="date">{msg.date.toLocaleTimeString()}</span>
          </div>
        ))}
      </div>

      <div className="input-container">
        <input
          type="text"
          placeholder="Escribe un mensaje..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()} 
        />
        <button onClick={sendMessage}>Enviar</button>
      </div>
    </div>
  );
};

export default ChatPageMobile;
function auth() {
  throw new Error('Function not implemented.');
}

