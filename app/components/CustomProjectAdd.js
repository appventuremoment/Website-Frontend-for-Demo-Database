'use client';
import { createContext, useContext, useState } from 'react';

const AlertContext = createContext();

export function ProjectAddProvider({ children }) {
  const [isVisible, setIsVisible] = useState(0);
  const [message, setMessage] = useState('');
  const [resolver, setResolver] = useState(null);
  const [formData, setFormData] = useState({
    internal_code: '',
    title: '',
    field_of_study: '',
    taken: 0,
    present_ready: 0,
    poster_received: 0,
    EMemail: '',
    IMemail: '',
    ecompany_name: ''
  });

  const showAlert = (msg) => {
    setMessage(msg);
    setFormData({
      internal_code: '',
      title: '',
      field_of_study: '',
      taken: 0,
      present_ready: 0,
      poster_received: 0,
      EMemail: '',
      IMemail: '',
      ecompany_name: ''
    });
    setIsVisible(true);
    return new Promise((resolve) => {
      setResolver(() => resolve);
    });
  };

  const handleResponse = (response) => {
    if (resolver) resolver(response);
    setIsVisible(0);
    setMessage('');
    setFormData({
      internal_code: '',
      title: '',
      field_of_study: '',
      taken: 0,
      present_ready: 0,
      poster_received: 0,
      EMemail: '',
      IMemail: '',
      ecompany_name: ''
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
                {message || "Message was left empty, please contact an administrator"}
              </p>
            </div>
            <div className="w-full flex flex-col gap-2 mb-4">
              <input type="text" placeholder="Project Code" value={formData.internal_code} onChange={(e) => handleInputChange('internal_code', e.target.value)} className="border border-gray-300 rounded-md p-2 w-full"/>
              <input type="text" placeholder="Project Title" value={formData.title} onChange={(e) => handleInputChange('title', e.target.value)} className="border border-gray-300 rounded-md p-2 w-full"/>
              <input type="text" placeholder="Field of Study" value={formData.field_of_study} onChange={(e) => handleInputChange('field_of_study', e.target.value)} className="border border-gray-300 rounded-md p-2 w-full"/>
             
             <div className="flex items-center gap-2">
                <label>Taken</label>
                <input type="checkbox" checked={formData.taken === 1} onChange={(e) => handleInputChange('taken', e.target.checked)} className="border border-gray-300 rounded-md" />
                </div>
                <div className="flex items-center gap-2">
                <label>Ready to Present</label>
                <input type="checkbox" checked={formData.present_ready === 1} onChange={(e) => handleInputChange('present_ready', e.target.checked)} className="border border-gray-300 rounded-md" />
                </div>
                <div className="flex items-center gap-2">
                <label>Poster Received</label>
                <input type="checkbox" checked={formData.poster_received === 1} onChange={(e) => handleInputChange('poster_received', e.target.checked)} className="border border-gray-300 rounded-md" />
                </div>
              <input type="text" placeholder="Internal Mentor Email" value={formData.IMemail} onChange={(e) => handleInputChange('IMemail', e.target.value)} className="border border-gray-300 rounded-md p-2 w-full"/>
              <input type="text" placeholder="External Mentor Email" value={formData.EMemail} onChange={(e) => handleInputChange('EMemail', e.target.value)} className="border border-gray-300 rounded-md p-2 w-full"/>
              <input type="text" placeholder="External Company" value={formData.ecompany_name} onChange={(e) => handleInputChange('ecompany_name', e.target.value)} className="border border-gray-300 rounded-md p-2 w-full"/>
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

export function useProjectAddAlert() {
  const context = useContext(AlertContext);
  return { showProjectAddAlert: context.showAlert };
}