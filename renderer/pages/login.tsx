import React from "react";
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

export default function SignInComponent() {
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
                  name="user"
                  variant="filled"
                  focusBorderColor="blue.500"
                />
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel>密碼</FormLabel>
                <Input
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  variant="filled"
                  focusBorderColor="blue.500"
                />
              </FormControl>
              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                fontSize="md"
                w="full"
                onClick={() => Router.push("/home")}
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
