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

  if(text[0]==='!'){
    let command= text.slice(1,5);
    if(command==='stop'){
     //do something 
    }
    else{
      let song = text.slice(6);
      let admintext = `'${song}' requested by ${user}`;
      song = song.split(' ').join('+');
      async function getURL(){
        let ans = await fetch(`https://www.googleapis.com/youtube/v3/search?q=${song}&key=AIzaSyAPIDZmHadGqC2Jje5_NO_36Z6UBS4dlTY`);
        let sol = await ans.json();
        let url = `https://www.youtube.com/watch?v=${sol.items[0].id.videoId}`;
        return url;
      }
      let link = getURL();
      console.log(link);
      if(isSentByCurrentUser){
        return (
          <div>
            <div className="messageContainer justifyEnd">
              <div className="messageBox backgroundDark">
                <p className="messageText colorWhite">{text}</p>
              </div>
            </div>
            <div className="adminContainer">
                <p className="adminText">{admintext}</p>
            </div>
            <div className="adminContainer">
            </div>
          </div>
        );
      }
      else{
        return (
          <div>
            <div className="messageContainer justifyStart">
              <div className="messageBox backgroundBlue">
                <p className="messageText colorWhite">{text}</p>
              </div>
              <p className="sentText pl-10 ">{user}</p>
            </div>
            <div className="adminContainer">
                <p className="adminText">{admintext}</p>
            </div>
          </div>
        );
      }
    }
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