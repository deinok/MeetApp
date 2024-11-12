import React, { useState } from "react";
import activities from "./activites.json";
import { Card, Modal } from "antd-mobile";
import { useNavigate } from "react-router-dom"; 

const ActivitiesMobilePage: React.FC = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleCardClick = (activityName: string) => {
        setSelectedActivity(activityName);
        setIsModalVisible(true);
    };

    
    const handleConfirmJoin = () => {
        setIsModalVisible(false);
        navigate("/chat"); 
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const empresesjson = activities;
    const items = empresesjson.map((activity, index) => (
        <div className="card" key={index} onClick={() => handleCardClick(activity.name)}>
            <Card title={activity.name} style={{ color: "white", backgroundColor: "#5942F4" }}>
                {activity.description}
            </Card>
        </div>
    ));

    return (
        <>
            <h1>ActivitiesPage</h1>
            <div style={{ display: "flex", gap: "1em", flexDirection: "column" }}>{items}</div>

            {isModalVisible && (
                <Modal
                    visible={isModalVisible}
                    content={<p>¿Quieres unirte a {selectedActivity}?</p>}
                    closeOnMaskClick={true}
                    onClose={handleCancel}
                    actions={[
                        { key: "no", text: "No", onClick: handleCancel },
                        { key: "yes", text: "Sí", onClick: handleConfirmJoin },
                    ]}
                />
            )}
        </>
    );
};

export default ActivitiesMobilePage;
