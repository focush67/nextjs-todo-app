import React from "react";

const CloseButton = ({ mode, data }: { mode: any; data: any }) => {
  return (
    <button
      onClick={() => {
        mode(false);
        data(null);
      }}
      className="text-gray-600 bg-red-800 text-white p-2 rounded-lg"
    >
      Close
    </button>
  );
};

export default CloseButton;
