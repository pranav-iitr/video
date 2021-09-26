import React , {createContext,useState,useEffect,useRef} from "react";
import { io, Socket } from 'socket.io-client';
import Peer from 'simple-peer';

const SocketContext = createContext()
const socket =io("http://localhost/5000")
const ContextProvider = ({children})=>{
    const [Stream, setStream] = useState(null)
    const [Me, setMe] = useState('')
    const [name, setName] = useState('')
    const [Call, setCall] = useState({})
    const [CallAccepted, setCallAccepted] = useState(false)
    const [CallEnded, setCallEnded] = useState(false)
    const myvideo = useRef()
    const userVideo = useRef()
    const connectionRef = useRef() 
    useEffect(()=>{
        navigator.mediaDevices.getUserMedia({video:true,audio:true})
            .then((currentStream)=>{
                setStream(currentStream)
                myvideo.current.src
            }
            )
        socket.on('me', (id)=> setMe(id)); 
        socket.on('calluser',({from, name:user ,signal}) =>   {
                setCall({isrecivedcall : true, from, name:callername , signal})

        } , [] )
    });

    const AnswerCall=() =>{
        setCallAccepted(true)
        const peer = new Peer({initiator: false , trickle:false,stream});

        peer.on('signal',(data)=>{
            socket.emit('answercall',{signal:data, to:call.from})
        })
        peer.on('stream',(currentStream)=>{
            userVideo.current.srcObject = currentStream;
        })

        peer.signal(call.signal)

        connectionRef.current=peer
    }
    const CallUser=(id) =>{

        const peer = new Peer({initiator: true , trickle:false, stream});

        peer.on('signal',(data)=>{
            socket.emit('calluser',{usertocall:id, signalData:data ,from:me,name:name})
        })
        peer.on('stream',(currentStream)=>{
            userVideo.current.srcObject = currentStream;
        }  )

        socket.on('callaccepted', (signal) =>{
                setCallAccepted(true)

                peer.signal(stream)

       
        })

        connectionRef.current=peer
    }
    const LeaveCall=() =>{
       setCallEnded=true;
       connectionRef.current.destroy;
       window.location.reload()
        


    }
 return (
    <SocketContext.Provider value={{
      call,
      callAccepted,
      myVideo,
      userVideo,
      stream,
      name,
      setName,
      callEnded,
      me,
      callUser,
      leaveCall,
      answerCall,
    }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };