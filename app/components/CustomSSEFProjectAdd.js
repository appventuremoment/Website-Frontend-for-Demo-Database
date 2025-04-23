'use client';
import { createContext, useContext, useState } from 'react';

const AlertContext = createContext();

export function SSEFProjectAddProvider({ children }) {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [resolver, setResolver] = useState(null);
  const [formData, setFormData] = useState({
    ssef_code: '',
    forms_received: 0,
    poster_received: 0,
    result: '',
    pid: '',
  });

  const showAlert = (msg) => {
    setMessage(msg);
    setFormData({
      ssef_code: '',
      forms_received: 0,
      poster_received: 0,
      result: '',
      pid: '',
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
    setFormData({
      ssef_code: '',
      forms_received: 0,
      poster_received: 0,
      result: '',
      pid: '',
    });
    setResolver(null);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: typeof value === 'boolean' ? (value ? 1 : 0) : value,
    }));
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {isVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{ zIndex: 9000 }}>
          <div className="bg-white rounded-md border border-gray-500 w-80 md:w-96 flex flex-col items-center p-4 relative">
            <div className="w-full h-24 flex items-center justify-center overflow-hidden mb-8">
              <p className="text-center text-base md:text-lg lg:text-xl break-words overflow-x-hidden overflow-y-auto max-h-full">
                {message || 'Message was left empty, please contact an administrator'}
              </p>
            </div>
            <div className="w-full flex flex-col gap-4 mb-4">
              <input type="text" placeholder="SSEF Code" value={formData.ssef_code} onChange={(e) => handleInputChange('ssef_code', e.target.value)} className="border border-gray-300 rounded-md p-2 w-full" />
              <div className="flex items-center gap-2">
                <label>Forms Received</label>
                <input type="checkbox" checked={formData.forms_received === 1} onChange={(e) => handleInputChange('forms_received', e.target.checked)} className="border border-gray-300 rounded-md" />
              </div>
              <div className="flex items-center gap-2">
                <label>Poster Received</label>
                <input type="checkbox" checked={formData.poster_received === 1} onChange={(e) => handleInputChange('poster_received', e.target.checked)} className="border border-gray-300 rounded-md" />
              </div>
              <input type="text" placeholder="Result" value={formData.result} onChange={(e) => handleInputChange('result', e.target.value)} className="border border-gray-300 rounded-md p-2 w-full" />
              <input type="text" placeholder="Project code" value={formData.pid} onChange={(e) => handleInputChange('pid', e.target.value)} className="border border-gray-300 rounded-md p-2 w-full" />
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => handleResponse(formData)}
                className="bg-green-600 hover:bg-green-500 text-white px-4 py-1 rounded-md border border-green-700 transform transition-all duration-200"
              >
                Save
              </button>
              <button
                onClick={() => handleResponse(null)}
                className="bg-red-600 hover:bg-red-500 text-white px-4 py-1 rounded-md border border-red-700 transform transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
}

export function useSSEFProjectAddAlert() {
  const context = useContext(AlertContext);
  return { showSSEFProjectAddAlert: context.showAlert };
}