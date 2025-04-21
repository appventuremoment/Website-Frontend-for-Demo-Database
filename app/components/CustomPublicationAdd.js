'use client';
import { createContext, useContext, useState } from 'react';

const AlertContext = createContext();

export function PubAddProvider({ children }) {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [resolver, setResolver] = useState(null);
  const [formData, setFormData] = useState({
    project_code: '',
    journal: '',
    publisher: '',
    publication_date: '',
    link: '',
  });

  const showAlert = (msg) => {
    setMessage(msg);
    setFormData({
      project_code: '',
      journal: '',
      publisher: '',
      publication_date: '',
      link: '',
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
      project_code: '',
      journal: '',
      publisher: '',
      publication_date: '',
      link: '',
    });
    setResolver(null);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
            <div className="w-full flex flex-col gap-2 mb-4">
              <input type="text" placeholder="Project Code" value={formData.project_code} onChange={(e) => handleInputChange('project_code', e.target.value)} className="border border-gray-300 rounded-md p-2 w-full"/>
              <input type="text" placeholder="Link" value={formData.link} onChange={(e) => handleInputChange('link', e.target.value)} className="border border-gray-300 rounded-md p-2 w-full"/>
              <input type="text" placeholder="Journal" value={formData.journal} onChange={(e) => handleInputChange('journal', e.target.value)} className="border border-gray-300 rounded-md p-2 w-full"/>
              <input type="text" placeholder="Publisher" value={formData.publisher} onChange={(e) => handleInputChange('publisher', e.target.value)} className="border border-gray-300 rounded-md p-2 w-full"/>
              <input type="date" placeholder="Publication Date" value={formData.publication_date} onChange={(e) => handleInputChange('publication_date', e.target.value)} className="border border-gray-300 rounded-md p-2 w-full"/>
            </div>
            <div className="flex gap-4">
              <button onClick={() => handleResponse(formData)} className="bg-green-600 hover:bg-green-500 text-white px-4 py-1 rounded-md border border-green-700 transform transition-all duration-200">Add</button>
              <button onClick={() => handleResponse(null)} className="bg-red-600 hover:bg-red-500 text-white px-4 py-1 rounded-md border border-red-700 transform transition-all duration-200">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
}

export function usePubAddAlert() {
  const context = useContext(AlertContext);
  return { showAddPubAlert: context.showAlert };
}