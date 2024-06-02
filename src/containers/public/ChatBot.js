import { ChakraProvider, theme } from "@chakra-ui/react";
import Chat from '../../components/ChatComponent/Chat';

const ChatBot = () => {
  return (
    <div>
      <ChakraProvider theme={theme}>
        <Chat />
      </ChakraProvider>
    </div>
  );
}

export default ChatBot;