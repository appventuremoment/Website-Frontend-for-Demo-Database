'use client';
import { createContext, useContext, useState } from 'react';

const AlertContext = createContext();

export function ProjectAlertProvider({ children }) {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [resolver, setResolver] = useState(null);
  const [editableData, setEditableData] = useState(null);

  const showAlert = (msg, data = null) => {
    setMessage(msg);
    setEditableData({
      ...data,
      taken: data?.taken === 1,
      present_ready: data?.present_ready === 1,
      poster_received: data?.poster_received === 1
    });
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
              <p className="text-center text-base md:text-lg lg:text-xl break-words overflow-x-hidden overflow-y-auto max-h-full">
                {message || "Message was left empty, please contact an administrator"}
              </p>
            </div>
            {editableData && (
              <div className="w-full flex flex-col gap-2 mb-4">
                <input type="text" placeholder="Project Code" value={editableData.internal_code || ''} readOnly className="border border-gray-300 rounded-md p-2 w-full bg-gray-100 cursor-not-allowed"/>
                <input type="text" placeholder="Project Title" value={editableData.title || ''} onChange={(e) => handleInputChange('title', e.target.value)} className="border border-gray-300 rounded-md p-2 w-full"/>
                <input type="text" placeholder="Field of Study" value={editableData.field_of_study || ''} onChange={(e) => handleInputChange('field_of_study', e.target.value)} className="border border-gray-300 rounded-md p-2 w-full"/>
                <div className="flex items-center gap-2">
                  <label>Taken</label>
                  <input type="checkbox" checked={editableData.taken || false} onChange={(e) => handleInputChange('taken', e.target.checked)} className="border border-gray-300 rounded-md"/>
                </div>

                <div className="flex items-center gap-2">
                  <label>Ready to Present</label>
                  <input type="checkbox" checked={editableData.present_ready || false} onChange={(e) => handleInputChange('present_ready', e.target.checked)} className="border border-gray-300 rounded-md"/>
                </div>

                <div className="flex items-center gap-2">
                  <label>Poster Received</label>
                  <input type="checkbox" checked={editableData.poster_received || false} onChange={(e) => handleInputChange('poster_received', e.target.checked)} className="border border-gray-300 rounded-md"/>
                </div>

                <input type="text" placeholder="Internal Mentor Email" value={editableData.IMemail || ''} onChange={(e) => handleInputChange('IMemail', e.target.value)} className="border border-gray-300 rounded-md p-2 w-full"/>
                <input type="text" placeholder="External Mentor Email" value={editableData.EMemail || ''} onChange={(e) => handleInputChange('EMemail', e.target.value)} className="border border-gray-300 rounded-md p-2 w-full"/>
                <input type="text" placeholder="External Company" value={editableData.ecompany_name || ''} onChange={(e) => handleInputChange('ecompany_name', e.target.value)} className="border border-gray-300 rounded-md p-2 w-full"/>
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

export function useProjectAlert() {
  const context = useContext(AlertContext);
  return { showProjectAlert: context.showAlert };
}