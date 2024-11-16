import React, { useEffect, useState } from 'react';
import { HubConnectionBuilder, HubConnection } from '@microsoft/signalr';
// import { MessageBox, MessageList, Input } from 'react-chat-elements';
// import 'react-chat-elements/dist/main.css';
import { BASE_CHAT_HUB_URL } from '../../../configs/GeneralApiType';

const ChatPageMobile = () => {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [messages, setMessages] = useState<{ user: string; message: string; date: Date }[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const userId = "weathered-tree-7";

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(BASE_CHAT_HUB_URL, {withCredentials: false}) 
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection.start()
        .then(() => {
          console.log("Conectado al hub de mensajes");

          connection.on("ReceiveMessage", (user: string, message: string) => {
            setMessages((prevMessages) => [
              ...prevMessages,
              { user, message, date: new Date() }
            ]);
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
        setInputMessage(""); 
      } catch (error) {
        console.error("Error al enviar mensaje:", error);
      }
    }
  };

  return (
    <h1>CHAAAAt</h1>
    // <div style={{ padding: '10px' }}>
    //   <h2>Chat en Tiempo Real</h2>
    //   <div style={{ border: "1px solid #ccc", padding: "10px", maxHeight: "400px", overflowY: "scroll" }}>
    //     <MessageList
    //       className="message-list"
    //       lockable={true}
    //       toBottomHeight={'100%'}
    //       // dataSource={messages.map((msg, index) => ({
    //       //   position: msg.user === userId ? 'right' : 'left', 
    //       //   type: 'text',
    //       //   text: msg.message,
    //       //   date: msg.date,
    //       //   id: `${index}`, 
    //       //   title: msg.user, 
    //       //   focus: false, 
    //       // }))}
    //       dataSource={messages.map((msg, index) => ({
    //         position: msg.user === userId ? 'right' : 'left',
    //         type: 'text',
    //         text: msg.message,
    //         date: msg.date,
    //         id: `${index}`,
    //         title: msg.user,
    //         focus: false,
    //       }))}
    //     />
    //   </div>
    //   <Input
    //     placeholder="Escribe un mensaje..."
    //     defaultValue=""
    //     multiline={true}
    //     value={inputMessage}
    //     onChange={(e) => setInputMessage(e.target.value)}
    //     rightButtons={
    //       <button onClick={sendMessage}>Enviar</button>
    //     }
    //     maxHeight={100} // Add the maxHeight property
    //   />
    // </div>
  );
};

export default ChatPageMobile;
