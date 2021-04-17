import React from 'react';

import './Message.css';


const Message = ({ message: { text, user }, name }) => {
  let isSentByCurrentUser = false;
  let isAdmin = false;

  const trimmedName = name.trim().toLowerCase();

  if(user === trimmedName) {
    isSentByCurrentUser = true;
  }

  if(user === 'admin' || user==='Admin'){
    isAdmin = true;
  }

  return (
    isSentByCurrentUser
      ? (
        <div className="messageContainer justifyEnd">
          <div className="messageBox backgroundDark">
            <p className="messageText colorWhite">{text}</p>
          </div>
        </div>
        )
        : ( 
          isAdmin 
          ? (
            <div className="adminContainer">
                <p className="adminText">{text}</p>
            </div>
          ) 
          : (
            <div className="messageContainer justifyStart">
              <div className="messageBox backgroundBlue">
                <p className="messageText colorWhite">{text}</p>
              </div>
              <p className="sentText pl-10 ">{user}</p>
            </div>
          )
        )
  );
}

export default Message;