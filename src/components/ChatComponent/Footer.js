import React from "react";
import { Flex, Input, Button } from "@chakra-ui/react";

const Footer = ({ inputMessage, setInputMessage, handleSendMessage }) => {
  return (
    <Flex w="100%" mt="5">
      <Input
        placeholder="Type something..."
        border="none"
        borderRadius="20px"
        _focus={{
          border: "1px solid black",
        }}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            handleSendMessage();
          }
        }}
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
      />
      <Button
        bg="#06325E"
        color="white"
        borderRadius="10px"
        _hover={{
          bg: "white",
          color: "#06325E",
          border: "1px solid #06325E",
          
        }}
        disabled={inputMessage.trim().length <= 0}
        onClick={handleSendMessage}
      >
        Send
      </Button>
    </Flex>
  );
};

export default Footer;
