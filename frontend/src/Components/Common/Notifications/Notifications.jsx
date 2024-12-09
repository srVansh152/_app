import React from "react";

const Notification = ({ notifications, onClose }) => {
  return (
    <div className="fixed right-8 top-16 space-y-4 z-50">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 rounded-md shadow-lg w-96 transition-all duration-300 ease-in-out ${
            notification.notificationType === "success"
              ? "bg-green-500 text-white"
              : notification.notificationType === "error"
              ? "bg-red-500 text-white"
              : "bg-white text-black"
          }`}
        >
          <div className="flex justify-between items-center">
            <p className="font-bold text-xl">Notification</p>
            <button
              onClick={() => onClose(notification.id)}
              className="text-black font-bold hover:text-gray-200"
              aria-label="Close notification"
            >
              &times;
            </button>
          </div>
          <div className="mt-3 bg-white rounded-lg shadow-md p-3">
            <h1 className="text-lg font-bold mb-2">Announcement</h1>
            <p className="font-bold">Description:</p>
            <p>{notification.notificationMessage}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notification;
