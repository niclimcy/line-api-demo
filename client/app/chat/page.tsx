"use client";
import { useState, useEffect, useRef, FormEvent, ChangeEvent } from "react";
import io from "socket.io-client";
import {
  Box,
  Flex,
  Input,
  Button,
  VStack,
  HStack,
  Text,
} from "@chakra-ui/react";

export default function Chat() {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<any>(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:3000", { withCredentials: true });

    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onMessage(msg: string) {
      setMessages((prevMessages) => [...prevMessages, msg]);
    }

    const socket = socketRef.current;
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("chat message", onMessage);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("chat message", onMessage);
      socket.close();
    };
  }, []);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input) {
      socketRef.current.emit("chat message", input);
      setInput("");
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <Flex
      minH="100vh"
      alignItems="center"
      justifyContent="center"
      m={0}
      fontFamily="sans-serif"
      flexDirection="column"
      px={{ base: 4, md: 0 }} // Add padding on smaller breakpoints
    >
      <Box
        w={{ base: "full", md: "md", lg: "lg" }}
        h="80vh"
        overflowY="auto"
        p={4}
        ref={messagesContainerRef}
        borderWidth={1}
        borderRadius="lg"
      >
        <VStack spacing={4} alignItems="flex-start">
          {messages.map((msg, index) => (
            <HStack
              key={index}
              alignSelf="flex-end"
              borderRadius="lg"
              p={2}
              bg="blue.100"
            >
              <Text>{msg}</Text>
            </HStack>
          ))}
        </VStack>
      </Box>
      <Flex
        as="form"
        onSubmit={handleSubmit}
        mt={4}
        w={{ base: "full", md: "md", lg: "lg" }}
        px={{ base: 4, md: 0 }} // Add padding on smaller breakpoints
      >
        <Input
          autoComplete="off"
          borderRadius="full"
          px={4}
          py={2}
          flexGrow={1}
          focusBorderColor="blue.500"
          placeholder="Type your message..."
          value={input}
          onChange={handleInputChange}
        />
        <Button
          type="submit"
          bg="blue.500"
          _hover={{ bg: "blue.600" }}
          color="white"
          fontWeight="semibold"
          px={4}
          py={2}
          borderRadius="full"
          ml={4}
        >
          Send
        </Button>
      </Flex>
    </Flex>
  );
}
