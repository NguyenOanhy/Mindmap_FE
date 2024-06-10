import { Flex } from "@chakra-ui/react";
import React, { useState } from "react";
import Divider from "./Divider";
import Footer from "./Footer";
import Messages from "./Messages";
import axios from 'axios';
import Swal from 'sweetalert2';

const Chat = () => {
  const [messages, setMessages] = useState([
    { from: "computer", text: "Hi, my name is Claude" },
    { from: "me", text: "Hey there" },
    { from: "me", text: "My name is 4 PLUS 1" },
    {
      from: "computer",
      text:
        "Nice to meet you. You can send me message and i'll reply you some messages."
    },
    { from: "me", text: "Nice to meet you too" },
    {
      from: "computer",
      text:
        "What do you want to ask?"
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const fetchData = async (text) => {
    try {
      const response = await axios.post('https://01ihcy5z6h.execute-api.us-east-1.amazonaws.com/dev/chatbot', { text: text });
      setMessages((old) => [...old, { from: "computer", text: response.data }]);
    } catch (error) {
      console.log(error);
      if (error.response.status === 429) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Too many requests from this IP, please try again later.',
        });
      }
      else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong! Please try again.',
        });
      }
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim().length) {
      return;
    }
    const data = inputMessage;

    setMessages((old) => [...old, { from: "me", text: data }]);
    setInputMessage("");

    fetchData(data)
  };

  return (
    <Flex position="absolute" bottom="4" top="0" w="100%" h="100%" justify="center">
    <Flex w={["100%", "100%", "50%"]} flexDir="column">
      <Divider />
        <Messages messages={messages} />
      <Divider />
      <Footer
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        handleSendMessage={handleSendMessage}
      />
    </Flex>
  </Flex>
  );
};

export default Chat;
