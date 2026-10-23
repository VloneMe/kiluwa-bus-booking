import React from "react";

interface ResponseErrorProps {
  message: string;
}

const ResponseError: React.FC<ResponseErrorProps> = ({ message }) => {
  return (
    <div className="app-response-error" role="alert">
      <div className="app-response-error__inner">
        <strong className="app-response-error__label">Hitilafu</strong>
        <span className="app-response-error__message">{message}</span>
      </div>
    </div>
  );
};

export default ResponseError;
