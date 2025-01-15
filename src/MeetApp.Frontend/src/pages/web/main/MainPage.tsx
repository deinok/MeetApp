import { isDesktop } from "react-device-detect";
if (isDesktop) import("./MainPageStyles.css");

import React, { useEffect, useRef, useState } from "react";
import {
  Layout,
  Divider,
  Card,
  Steps,
  notification,
  QRCode,
  Input,
  Modal,
  Button,
  message,
} from "antd";
import { useAuthUser } from "react-auth-kit";
import { useTranslation } from "react-i18next";
import { Html5Qrcode } from "html5-qrcode";
import { BASE_URL } from "../../../configs/GeneralApiType";

const { Content } = Layout;
const { Step } = Steps;

const MainPage: React.FC = () => {
  const { t } = useTranslation("mainpage");
  const user = useAuthUser()()?.user;

  const urlCheckQr = `${BASE_URL}/api/v1/activities/checkQrCode`;

  const [qrValue, setQrValue] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const startScanner = () => {
    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode("scanner-container");
      Html5Qrcode.getCameras()
        .then((cameras) => {
          if (cameras.length > 0) {
            scannerRef.current?.start(
              cameras[0].id,
              { fps: 10, qrbox: { width: 250, height: 250 } },
              (decodedText) => {
                setQrValue(decodedText);
                stopScanner();
                setIsModalVisible(false); // Close modal after scanning
              },
              (error) => {
                // console.error("Error scanning QR code:", error);
              }
            );
          } else {
            console.error("No cameras found.");
          }
        })
        .catch((error) => {
          console.error("Error accessing cameras:", error);
        });
    }
  };

  const checkQrCode = () => {
    if (qrValue) {
      try {
        const url = urlCheckQr;
        fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ activityId: qrValue, businessId: user?.id }),
        }).then((response) => {
          if (response.ok) {
            console.log("QR code checked successfully");
            message.success("QR validated successfully");
          } else {
            console.error("QR code is not valid");
            message.error("QR code is not valid");
          }
        });
      } catch (error) {
        console.error("Error checking QR code:", error);
      }
    } else {
      console.error("No QR code scanned");
    }
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.stop().then(() => {
        scannerRef.current?.clear();
        scannerRef.current = null;
      });
    }
  };

  const handleModalClose = () => {
    stopScanner();
    setIsModalVisible(false);
  };

  const openScanner = () => {
    setIsModalVisible(true);
    setTimeout(startScanner, 300); // Espera a que el modal se renderice
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQrValue(e.target.value); // Allow manual input of the QR value
  };

  return (
    <>
      <Divider>
        <h1>{t("title", { name: user?.bussinesName })}</h1>
      </Divider>
      <div className="main-content">
        <Card className="qr-card" title={t("qr_validation")} bordered={true}>
          <div className="qr-body">
            <span className="qr-instruction">{t("qr_instruction")}</span>
            <QRCode
              className="qr"
              errorLevel="H"
              value="https://meet-app-udl.azurewebsites.net/"
              onClick={openScanner}
            />
            <Input
              className="qr-input"
              placeholder="Scanned QR Code Value"
              value={qrValue}
              onChange={handleInputChange}
            />
          </div>
          <Divider></Divider>
          <Button type="primary" onClick={checkQrCode}>
            {t("code_check")}
          </Button>
        </Card>
      </div>

      <Modal
        title="Scan QR Code"
        open={isModalVisible}
        footer={null}
        onCancel={handleModalClose}
      >
        <div id="scanner-container" style={{ width: "100%" }} />
      </Modal>
    </>
  );
};

export default MainPage;
