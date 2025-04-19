'use client';
import { createContext, useContext, useState } from 'react';

const AlertContext = createContext();

export function AlertProvider({ children }) {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');

  const showAlert = (msg) => {
    setMessage(msg);
    setIsVisible(true);
  };

  const closeAlert = () => {
    setMessage("This alert should never be visible, please contact an administrator");
    setIsVisible(false);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {isVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{ zIndex: 9000 }}>
          <div className="bg-white rounded-md border border-gray-500 w-80 md:w-96 flex flex-col items-center p-4 relative">
            <div className="w-full h-24 flex items-center justify-center overflow-hidden mb-8">
              <p className="text-center text-base md:text-lg lg:text-xl break-words overflow-x-hidden overflow-y-auto max-h-full">{message || "Message was left empty, please contact an administrator"}</p>
            </div>
            <button onClick={closeAlert} className="absolute bottom-4 bg-green-600 hover:bg-green-500 text-white px-4 py-1 rounded-md border border-green-700 transform transition-all duration-200">OK</button>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  return useContext(AlertContext);
}