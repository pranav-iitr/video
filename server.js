const app = require("express")();
const server = require("http").createServer(app)
const cors = require("cors");
const { Socket } = require("socket.io");

const io = require("socket.io")(server,{
    cors: {
        origin: "*",
        methods: ["GET","POST"]

    }
});

app.use(cors())
const PORT=process.env.PORT || 5000;
app.get("/", (req,res) =>{
    res.send("server is running")
});

server.listen(PORT,() => console.log(`server is listing to port ${PORT}`))

io.on("connection",(socket)=>{
    socket.emit(me,socket.id)

    socket.on('disconnect',() =>{
        socket.broadcast.emit("callended");
    });

    socket.on('calluser',({usertocall,signaldata,from,name}) =>{
        io.to(usertocall).emit("calluser", {signal:signaldata,from,name});
    });
    socket.on('answercall',(data) =>{
        io.to(data.to).emit("callaccepted", data.signal);
    }); 

});