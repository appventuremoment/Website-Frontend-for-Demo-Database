'use client';
import { createContext, useContext, useState } from 'react';

const AlertContext = createContext();

export function PubAlertProvider({ children }) {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [resolver, setResolver] = useState(null);
  const [editableData, setEditableData] = useState(null);

  const showAlert = (msg, data = null) => {
    setMessage(msg);
    setEditableData(data);
    setIsVisible(true);

    return new Promise((resolve) => {
      setResolver(() => resolve);
    });
  };

  const handleResponse = (response) => {
    if (resolver) resolver(response);
    setIsVisible(false);
    setMessage('');
    setEditableData(null);
    setResolver(null);
  };

  const handleInputChange = (field, value) => {
    setEditableData((prev) => ({ ...prev, [field]: value }));
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
            {editableData && (
              <div className="w-full flex flex-col gap-4 mb-4">
                <input type="text" placeholder="Project Name" value={editableData.title || ''} readOnly className="border border-gray-300 rounded-md p-2 w-full bg-gray-100 cursor-not-allowed"/>
                <input type="text" placeholder="Field of Study" value={editableData.field_of_study || ''} readOnly className="border border-gray-300 rounded-md p-2 w-full bg-gray-100 cursor-not-allowed"/>
                <input type="text" placeholder="Journal" value={editableData.journal || ''} onChange={(e) => handleInputChange('journal', e.target.value)} className="border border-gray-300 rounded-md p-2 w-full"/>
                <input type="text" placeholder="Publisher" value={editableData.publisher || ''} onChange={(e) => handleInputChange('publisher', e.target.value)} className="border border-gray-300 rounded-md p-2 w-full"/>
                <input type="date" placeholder="Publication Date" value={editableData.publication_date || ''} onChange={(e) => handleInputChange('publication_date', e.target.value)} className="border border-gray-300 rounded-md p-2 w-full"/>
              </div>
            )}
            <div className="flex gap-4">
              <button onClick={() => handleResponse(editableData)} className="bg-green-600 hover:bg-green-500 text-white px-4 py-1 rounded-md border border-green-700 transform transition-all duration-200">Save</button>
              <button onClick={() => handleResponse(null)} className="bg-red-600 hover:bg-red-500 text-white px-4 py-1 rounded-md border border-red-700 transform transition-all duration-200">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
}

export function usePubAlert() {
  const context = useContext(AlertContext);
  return { showPubAlert: context.showAlert };  
}