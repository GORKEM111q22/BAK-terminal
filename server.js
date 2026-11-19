'use strict';
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const crypto = require('crypto');
const app = express();
app.disable('x-powered-by');
app.use(express.static(path.join(__dirname, 'public')));
app.get('/health', (_req,res) => res.json({ok:true}));
const server = http.createServer(app);
const io = new Server(server, { maxHttpBufferSize: 8 * 1024, cors: {origin: false} });
const members = new Map();
const roomCounts = room => [...members.values()].filter(x=>x.room===room).length;
const clean = (s,max) => typeof s === 'string' ? s.trim().slice(0,max).replace(/[\u0000-\u001f\u007f]/g,'') : '';
function system(room,text) { io.to(room).emit('system', {text, time:Date.now()}); }
function update(room) { io.to(room).emit('count', roomCounts(room)); }
io.on('connection', socket => {
  let lastMessage = 0;
  socket.on('join', (data,ack) => {
    if (typeof ack !== 'function') return;
    if (members.has(socket.id)) return ack({ok:false,error:'Zaten bir odaya katıldın.'});
    const name = clean(data?.name, 20);
    const room = clean(data?.room, 32).toUpperCase();
    if (!/^[\p{L}\p{N}_ .-]{2,20}$/u.test(name)) return ack({ok:false,error:'İsim 2-20 karakter olmalı.'});
    if (!/^[A-Z0-9-]{6,32}$/.test(room)) return ack({ok:false,error:'Oda kodu 6-32 karakter, A-Z, 0-9 veya tire içermeli.'});
    if (roomCounts(room) >= 50) return ack({ok:false,error:'Oda dolu (50 kişi).'});
    members.set(socket.id,{name,room}); socket.join(room);
    ack({ok:true,name,room,count:roomCounts(room)});
    system(room, `${name} odaya katıldı.`); update(room);
  });
  socket.on('message',(raw,ack)=>{
    const user=members.get(socket.id);
    if (!user) return typeof ack==='function' && ack({ok:false,error:'Önce odaya katıl.'});
    const now=Date.now();
    if(now-lastMessage<650) return typeof ack==='function' && ack({ok:false,error:'Biraz yavaş yaz.'});
    const text=clean(raw,1000);
    if(!text) return typeof ack==='function' && ack({ok:false,error:'Boş mesaj gönderilemez.'});
    lastMessage=now;
    io.to(user.room).emit('message',{id:crypto.randomUUID(),name:user.name,text,time:now,sender:socket.id});
    if(typeof ack==='function') ack({ok:true});
  });
  socket.on('disconnect',()=>{
    const user=members.get(socket.id); if(!user) return;
    members.delete(socket.id); system(user.room,`${user.name} ayrıldı.`); update(user.room);
  });
});
const port=Number(process.env.PORT)||3000;
server.listen(port,'0.0.0.0',()=>console.log(`BAK Terminal port ${port} üzerinde çalışıyor`));
