import { useHistory } from "react-router-dom"; 
import axios from "axios";
import ChatItem from "./ChatItem";
import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { AiOutlineDown } from "react-icons/ai";
import { BiSearch } from "react-icons/bi";
import Avatar from '@mui/material/Avatar';
import Input from '@mui/material/Input';
 


const ChatAPI = require("twilio-chat");

function Chat() {
    const email = localStorage.getItem('email');
    const room = window.location.pathname.split('/')[1];

    // eslint-disable-next-line no-unused-vars
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [channel, setChannel] = useState(null);
    const [text, setText] = useState("");
    
    // const messages = []
    
    const roomsList = ["general" ,"patients","staffs"];
    let scrollDiv = useRef(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async() => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      console.log(scrollDiv)
      let token = "";

      if (!email) {
          history.push("/");
      }

      setLoading(true)

      try {
        token = await getToken(email);
      //   console.log(token)
      } catch {
        throw new Error("Unable to get token, please reload this page");
      }

      const client = await ChatAPI.Client.create(token);

      client.on("tokenAboutToExpire", async () => {
          const token = await getToken(email);
          client.updateToken(token);
      });

      client.on("tokenExpired", async () => {
          const token = await getToken(email);
          client.updateToken(token);
      });

      client.on("channelJoined", async (channel) => {
          // getting list of all messages since this is an existing channel
          const newMessages = await channel.getMessages();
          console.log(newMessages)
          // messages.push(newMessages.items || [])
          setMessages(newMessages.items || []);
          //  scrollToBottom();
        });
      
        try {
          const channel = await client.getChannelByUniqueName(room);
            console.log(channel)
            joinChannel(channel);
            setChannel(channel)
        } catch(err) {
          try {
            const channel = await client.createChannel({
              uniqueName: room,
              friendlyName: room,
            });
        
            joinChannel(channel);
          //   console.log("channel:"+channel)
          } catch {
            throw new Error("Unable to create channel, please reload this page");
          }
        } 


  }, [])
  const handleKeyDown = event => {
    console.log('User pressed: ', event.key);

    // console.log(message);

    if (event.key === 'Enter') {
      // 👇️ your logic here
      console.log('Enter key pressed ✅');
    }
  };

  const updateText = e => setText(e);

  const joinChannel = async (channel) => {
      if (channel.channelState.status !== "joined") {
       await channel.join();
     }
   
     setChannel(channel);
     setLoading(false)
   
     channel.on('messageAdded', function(message) {
      handleMessageAdded(message)
    });
  //    scrollToBottom();
   };


  let history = useHistory();

  const changeRoom = room =>{
      history.push(room);
  }

  const getToken = async (email) => {
      const response = await axios.get(`http://localhost:5000/token/${email}`);
      const { data } = response;
      return data.token;
    }

    const handleMessageAdded = message => {
      setMessages(messages =>[...messages, message]);
      // messages.push(message)
      console.log(message)
      console.log("messages:"+messages)
      scrollToBottom();
    };
    
    const scrollToBottom = () => {
      const scrollHeight = scrollDiv.current.scrollHeight;
      const height = scrollDiv.current.clientHeight;
      const maxScrollTop = scrollHeight - height;
      scrollDiv.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    };

    const sendMessage = () => {
      if (text) {
          console.log(String(text).trim())
          setLoading(true)
          channel.sendMessage(String(text).trim());
          setText('');
          setLoading(false)
      }
    };

    return (
      <div>
        <div className="chatScreen">
          <div className="messagepanel">
          <h4>{email}</h4>

            <div className="sidebar_msg">
              <div className="sidebar_8">
                <div className="sidebar_m"> messages </div>
                <div className="angle">
                  <AiOutlineDown />
                </div>
              </div>
            </div>
            <div className="Div">1 </div>

            <div className="seach_box">
              <div className="search_logo">
                <BiSearch />
              </div>
              <div className="search_m">search messages</div>
              {roomsList.map((room) => (
                <p key={room} onClick={() => changeRoom(room)}>
                  {room}
                </p>
              ))}

            </div>
            <div className="Div"></div>

              
             
            </div>
            
          <div className="chatpanel" ref={scrollDiv}>
            <div className="chatHeader">
              {/* <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" /> */}

              {room === "chat" ? "Choose A Room" : room}
            </div>

            <div className="chatContents">
              {messages &&
                room !== "chat" &&
                messages.map((message) => (
                  <ChatItem
                    key={message.index}
                    message={message}
                    email={email}
                  />
                ))}
            </div>

            {room !== "chat" && (
              <div className="footer">
              <div className="chatFooter">
                <Input
                  type="text"
                  placeholder="Type Message"
                  onChange={(e) => updateText(e.target.value)}
                  value={text}
                  onKeyDown={handleKeyDown}

                />
                <button onClick={sendMessage}>Send</button>
              </div>
              </div>
            )}
          </div>
          {/* <div className="Group">
              <div className="Rpm">
              © 2020 - Rpm.doctor
                <div className="Rectangle"></div>
              </div>
            </div> */}
        </div>
      </div>
    );
}

export default Chat
