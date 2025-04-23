'use client';
import { createContext, useContext, useState } from 'react';

const AlertContext = createContext();

export function SSEFProjectAlertProvider({ children }) {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [resolver, setResolver] = useState(null);
  const [editableData, setEditableData] = useState(null);

  const showAlert = (msg, data = null) => {
    setMessage(msg);
    setEditableData({...data,
        forms_received: data?.forms_received === 1,
        poster_received: data?.poster_received === 1});
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
                <input type="text" placeholder="SSEF Code" value={editableData.ssef_code || ''} readOnly className="border border-gray-300 rounded-md p-2 w-full bg-gray-100 cursor-not-allowed"/>

                <div className="flex items-center gap-2">
                    <label>Forms Received</label>
                    <input type="checkbox" checked={editableData.forms_received || false} onChange={(e) => handleInputChange('forms_received', e.target.checked)} className="border border-gray-300 rounded-md"/>
                </div>

                <div className="flex items-center gap-2">
                    <label>Poster Received</label>
                    <input type="checkbox" checked={editableData.poster_received || false} onChange={(e) => handleInputChange('poster_received', e.target.checked)} className="border border-gray-300 rounded-md"/>
                </div>

                <input type="text" placeholder="Result" value={editableData.result || ''} onChange={(e) => handleInputChange('result', e.target.value)} className="border border-gray-300 rounded-md p-2 w-full"/>
                <input type="text" placeholder="PID" value={editableData.pid || ''} onChange={(e) => handleInputChange('pid', e.target.value)} className="border border-gray-300 rounded-md p-2 w-full"/>
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

export function useSSEFProjectAlert() {
  const context = useContext(AlertContext);
  return { showSSEFProjectAlert: context.showAlert };  
}