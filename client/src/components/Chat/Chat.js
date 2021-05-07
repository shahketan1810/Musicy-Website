import React, { useState, useEffect } from "react";
//import {Redirect, BrowserRouter as Router} from 'react-router-dom';
import queryString from 'query-string';
import io from "socket.io-client";
import ReactPlayer from 'react-player'

import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';

import './Chat.css';


let socket;

const Chat = ({ location }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [songurl, setSongUrl] = useState('');
  const [musicState, setMusicState] = useState(true);
  const ENDPOINT = 'localhost:5000';

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT);

    setRoom(room);
    setName(name);

    socket.emit('join', { name, room }, (error) => {
      if(error) {
        window.location = `http://localhost:3000/join?room=${room}`;
      }
    });
  }, [ENDPOINT, location.search]);
  
  useEffect(() => {
    socket.on('message', message => {
      setMessages([ ...messages, message ]);
      if(message.text.length>5 && message.text[0]==='!' && message.text.slice(1,5)==='play'){
        setSongUrl(message.songLink);
      }
      if(message.text.length === 5 && message.text[0]==='!'){
        let command;
        command = message.text.slice(1,5);
        if(command==='stop'){
          setMusicState(false);
          return;
        }
        if(command==='play'){
          setMusicState(true);
          return;
        }
      }
    });

    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });

  }, [messages]);

  const sendMessage = (event) => {
    event.preventDefault();

    if(message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  }

  return (
    <div className="outerContainer">
      <div className="container">
          <InfoBar room={room} />
          <Messages messages={messages} name={name} />
          <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
      <TextContainer users={users}/>
      <ReactPlayer playing={musicState} url={songurl} style={{display:'none'}}/>
    </div>
  );
}

export default Chat;