import React from "react";
import { ListItem } from "@material-ui/core";
// import Avatar from '@mui/material/Avatar';

function ChatItem(props) {
  
    const message = props.message;
    const email = props.email;
    const isOwnMessage = message.author === email;

    console.log(props.email)

    return (
      <ListItem style={styles.listItem(isOwnMessage)}>
        <div style={styles.author}>{message.author}</div>
        <div style={styles.container(isOwnMessage)}>
        {/* <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" /> */}
          {message.body}
          <div>
         

            {new Date(message.dateCreated.toISOString()).toLocaleString()}
           
          </div>
        </div>
      </ListItem>
    );
  }


const styles = {
  listItem: (isOwnMessage) => ({
    flexDirection: "column",
    alignItems: isOwnMessage ? "flex-end" : "flex-start",
  }),
  container: (isOwnMessage) => ({
    maxWidth: "75%",
    borderRadius: 15,
    padding: 16,
    color: "black",
    fontSize: 10,
    backgroundColor: isOwnMessage ? "#009688" : "#F1F1F1",
  }),
  author: { fontSize: 10, color: "gray" },
  timestamp: { fontSize: 8, color: "white", textAlign: "right", paddingTop: 4 },
};

export default ChatItem;