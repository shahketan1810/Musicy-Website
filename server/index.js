if (process.env.NODE_ENV !== "production"){
  require('dotenv').config();
}

const http = require('http');
const express = require('express');
const axios = require('axios');
const sanitizeHtml =  require('sanitize-html');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server,{
  cors:{
      origin:'*',
  }
});

app.use(router);

io.on('connect', (socket) => {
  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if(error) return callback(error);

    socket.emit(sanitizeHtml('message'), { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`});
    socket.broadcast.to(user.room).emit(sanitizeHtml('message'), { user: 'admin', text: `${user.name} has joined!` });

    socket.join(user.room);

    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

    callback();
  });

  socket.on('sendMessage', async (message, callback) => {
    const user = getUser(socket.id);
    let song = '';
    let  title = '';
    const setSong = (url) =>{
      song = url;
    }
    const setTitle = (res) =>{
      title = res;
    }
    if(message.length>6 && message[0]==='!' && message.slice(1,5)==='play'){
      let songName;
      message = sanitizeHtml(message);
      songName = message.slice(6);
      songName = songName.replace(' ','+');
      const getURL = async()=>{
        try{
          let ans = await axios.get(`https://www.googleapis.com/youtube/v3/search?q=${songName}&key=${process.env.API_KEY}`);
          let url = `https://www.youtube.com/watch?v=${ans.data.items[0].id.videoId}`;
          setSong(url);
          let titleData = await axios.get(`https://noembed.com/embed?url=${url}`);
          let res = titleData.data.title;
          setTitle(res);
        }
        catch(e){
          console.log(e);
          return;
        }
      }
      await getURL();
    }
    io.to(user.room).emit(sanitizeHtml('message'), { user: user.name, text: message, songLink: song});
    if(message.length>6 && message[0]==='!' && message.slice(1,5)==='play'){
      io.to(user.room).emit(sanitizeHtml('message'), { user: 'admin', text: `Playing "${title}"`});
    }
    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if(user) {
      io.to(user.room).emit(sanitizeHtml('message'), { user: 'Admin', text: `${user.name} has left.` });
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
    }
  })
});

server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`));