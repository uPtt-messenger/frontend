import React, { useState, useEffect } from "react";
import {
  Link as ChakraLink,
  Button,
  FormControl,
  FormLabel,
  Input,
  Box,
  VStack,
  Flex,
  Text,
} from "@chakra-ui/react";
import Router from "next/router";
import useMessage from "../hooks/useMessage";
import type { StatusMessage } from "../hooks/useMessage";

export default function SignInComponent() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { sendMessage, messages } = useMessage();

  useEffect(() => {
    const msg = messages.find(
      (msg) => msg.category === "status" && msg.action === "login",
    ) as StatusMessage;
    if (msg) {
      if (msg.state === "SUCCESS") {
        Router.push({
          pathname: "/home",
          query: { username },
        });
      } else {
        setError("登入失敗：" + msg.message);
      }
    }
  }, [messages]);

  const login = async (e) => {
    e.preventDefault();
    try {
      sendMessage({
        category: "login",
        username,
        password,
      });
    } catch (err) {
      setError("登入失敗：failed to connect to backend");
      console.error(err);
    }
  };

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg="gray.100"
      px={4}
      py={12}
      color="gray.800"
    >
      <Box bg="white" p={8} maxW="md" w="full" boxShadow="base" rounded="lg">
        <VStack spacing={8}>
          <Box>
            <Text
              align="center"
              fontSize="2xl"
              fontWeight="bold"
              textColor="gray.900"
              mb={3}
            >
              登入 uPTT Messenger
            </Text>
            <Text align="center" fontSize="sm">
              還沒有 PTT 帳號嗎？{" "}
              <ChakraLink color="blue.600" _hover={{ color: "blue.500" }}>
                點此註冊去
              </ChakraLink>
            </Text>
          </Box>
          <Box as="form" mt={4} w="full" method="POST">
            <VStack spacing={6}>
              <FormControl id="text" isRequired>
                <FormLabel>PTT 帳號</FormLabel>
                <Input
                  type="text"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  variant="filled"
                  focusBorderColor="blue.500"
                />
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel>密碼</FormLabel>
                <Input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  variant="filled"
                  focusBorderColor="blue.500"
                />
              </FormControl>
              <Text color="red.500">{error}</Text>
              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                fontSize="md"
                w="full"
                isDisabled={!username || !password}
                onClick={login}
              >
                登入
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Box>
    </Flex>
  );
}
