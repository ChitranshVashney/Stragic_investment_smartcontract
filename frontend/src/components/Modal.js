"use client";
import { useState } from 'react';

const Modal = ({ isOpen, onClose, onSave, children }) => {
  const modalClass = isOpen ? '' : 'hidden';

  return (
    <div className={`fixed inset-0 overflow-y-auto ${modalClass}`}>
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-md w-full">
          {/* Modal Header */}
          {/* <div className="bg-gray-200 p-4">
            <h2 className="text-lg font-semibold">Select Tokens</h2>
          </div> */}

          {/* Modal Body */}
          <div className="p-4">{children}</div>

          {/* Modal Footer */}
          <div className="bg-gray-200 p-4 flex justify-end">
            <button onClick={onSave} className="text-white bg-blue-500 px-4 py-2 rounded-full">
              Save
            </button>
            <button onClick={onClose} className="text-gray-600 ml-2">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
