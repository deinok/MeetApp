import React, { useEffect, useState } from 'react';
import { HubConnectionBuilder, HubConnection } from '@microsoft/signalr';
import { BASE_CHAT_HUB_URL } from '../../../configs/GeneralApiType';
import './chatPage.css';
import { useAuthUser } from 'react-auth-kit';
import { useParams } from 'react-router-dom';

const ChatPageMobile: React.FC = () => {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [messages, setMessages] = useState<{ user: string; message: string; date?: Date, activityId?: string }[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const { activityId } = useParams<{ activityId: string }>();
  const auth = useAuthUser();
  const user = auth()?.user;
  const userId = user.id; 
  

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

  useEffect(() => {
    if (connection) {
      connection.on("NotifySendMessage", (senderId: string, activityId: string, message: string) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { user: senderId,  activityId: activityId , message: message }
        ]);
        console.log(`Mensaje recibido de ${senderId}: ${message}`)

      });
    }
  
    return () => {
      connection?.off("NotifySendMessage");
    };
  }, [connection]);
  

  const sendMessage = async () => {
    if (connection && inputMessage.trim()) {
      try {
        await connection.send("SendMessage", userId, activityId, inputMessage);
        setMessages((prevMessages) => [
          ...prevMessages,
          { user: userId, message: inputMessage, date: new Date() }
        ]); 
        setInputMessage(inputMessage);
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
            <span className="date">{msg.date?.toLocaleTimeString()}</span>
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


