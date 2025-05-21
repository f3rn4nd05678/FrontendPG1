import React from "react";

const Loader = ({ size = "medium", color = "blue", fullScreen = false }) => {
  let dimensions;
  
  switch (size) {
    case "small":
      dimensions = "w-4 h-4 border-2";
      break;
    case "large":
      dimensions = "w-12 h-12 border-4";
      break;
    case "medium":
    default:
      dimensions = "w-8 h-8 border-3";
      break;
  }

  let colorClass;
  
  switch (color) {
    case "white":
      colorClass = "border-white border-t-transparent";
      break;
    case "blue":
    default:
      colorClass = "border-plastihogar-blue border-t-transparent";
      break;
  }

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
        <div className={`${dimensions} ${colorClass} rounded-full animate-spin`}></div>
      </div>
    );
  }

  return <div className={`${dimensions} ${colorClass} rounded-full animate-spin`}></div>;
};

export default Loader;