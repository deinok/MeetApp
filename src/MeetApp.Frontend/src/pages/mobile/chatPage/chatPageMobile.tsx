import React, { useEffect, useState } from "react";
import { HubConnectionBuilder, HubConnection } from "@microsoft/signalr";
import { BASE_CHAT_HUB_URL, BASE_URL } from "../../../configs/GeneralApiType";
import "./chatPage.css";
import { useAuthUser } from "react-auth-kit";
import { useParams } from "react-router-dom";
import { Button, Modal, Switch } from "antd-mobile";
import { CheckOutline, CloseOutline, RightOutline } from "antd-mobile-icons";
import { use } from "i18next";
import dayjs from "dayjs";
import { QRCode } from "antd";

const ChatPageMobile: React.FC = () => {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [messages, setMessages] = useState<
    { user: string; message: string; date?: Date; activityId?: string }[]
  >([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { activityId } = useParams<{ activityId: string }>();
  const user = useAuthUser()()?.user;
  const userId = user.id;
  const translateUrl = `${BASE_URL}/api/v1/text-translation`;
  const [autoTranslate, setAutoTranslate] = useState(false);

  const handleCardClick = () => {
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(BASE_CHAT_HUB_URL, { withCredentials: false })
      .withAutomaticReconnect()
      .build();
    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(async () => {
          console.log("Conectado al hub de mensajes");

          await connection.invoke("JoinChat", userId, activityId);

          connection.on(
            "NotifyJoinChat",
            (joinedUserId: string, joinedActivityId: string) => {
              if (joinedActivityId === activityId && joinedUserId !== userId) {
                console.log(`El usuario ${joinedUserId} se ha unido al chat.`);
                setMessages((prevMessages) => [
                  ...prevMessages,
                  {
                    user: "System",
                    message: `El usuario ${joinedUserId} se ha unido al chat.`,
                    date: new Date(),
                  },
                ]);
              }
            }
          );
        })
        .catch((error) =>
          console.error("Error al conectar con el hub:", error)
        );
    }

    return () => {
      connection?.stop();
    };
  }, [connection]);

  useEffect(() => {
    if (connection) {
      connection.on(
        "NotifySendMessage",
        async (senderId: string, activityId: string, message: string) => {
          const messageToShow =
            sessionStorage.getItem("autoTranslate") === "true"
              ? await translateMessage(message)
              : message;
          setMessages((prevMessages) => [
            ...prevMessages,
            { user: senderId, activityId: activityId, message: messageToShow },
          ]);
          console.log(`Mensaje recibido de ${senderId}: ${message}`);
          console.log(sessionStorage.getItem("autoTranslate"));
        }
      );
    }

    return () => {
      connection?.off("NotifySendMessage");
    };
  }, [connection]);

  const sendMessage = async () => {
    if (connection && inputMessage.trim()) {
      try {
        await connection.send("SendMessage", userId, activityId, inputMessage);
        const messageToShow =
          sessionStorage.getItem("autoTranslate") === "true"
            ? await translateMessage(inputMessage)
            : inputMessage;
        setMessages((prevMessages) => [
          ...prevMessages,
          { user: userId, message: messageToShow, date: new Date() },
        ]);
        setInputMessage("");
        console.log(sessionStorage.getItem("autoTranslate"));
      } catch (error) {
        console.error("Error al enviar mensaje:", error);
      }
    }
  };

  const translateMessage = async (msg: string) => {
    try {
      const response = await fetch(translateUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: msg,
          targetLanguage: localStorage.getItem("language") || "en",
        }),
      });

      if (response.ok) {
        return (await response.json()).text;
      } else {
        return msg;
      }
    } catch (error) {
      return msg;
    }
  };

  useEffect(() => {
    console.log("The switch state has changed to:", autoTranslate);
    sessionStorage.setItem("autoTranslate", autoTranslate.toString());
    // Add your logic here if needed
  }, [autoTranslate]);

  const handleSwitchChange = (checked: boolean) => {
    setAutoTranslate(checked);
  };

  return (
    
    <div className="chat-container">
      <h2>Chat en Tiempo Real</h2>

      <Switch
        checked={autoTranslate}
        onChange={handleSwitchChange}
        style={{ margin: "10px", alignSelf: "end" }}
        checkedText={<CheckOutline fontSize={18} />}
        uncheckedText={<CloseOutline fontSize={18} />}
      />
      <div
        className="chat-profile"
        onClick={handleCardClick}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleCardClick();
          }
        }}
      >
        <p>{activityId}</p>
      </div>
      <div className="messages-container">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.user === userId ? "sent" : "received"}`}
          >
            <p className="user">{msg.user}:</p>
            <p className="text">{msg.message}</p>
            <p className="date">
              {msg.date?.toLocaleTimeString(undefined, {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        ))}
      </div>

      <div className="input-container">
        <input
          type="text"
          placeholder="Escribe un mensaje..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <Button color="primary" onClick={sendMessage}>
          <RightOutline />
        </Button>
      </div>
      {isModalVisible && (
        <Modal
          visible={isModalVisible}
          content={<div><strong>ActivityId:</strong> {activityId}<div style={{ height: "auto", margin: "0 auto", maxWidth: 200, width: "100%" }}>
          <QRCode
            size={250}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={"https://meet-app-udl.azurewebsites.net/"}
          />
        </div></div>}
          closeOnMaskClick={true}
          onClose={handleCancel}
          actions={[
            { key: "cancel", text: "cancel", onClick: handleCancel },
          ]}
        />
      )}
    </div>
  );
};

export default ChatPageMobile;
