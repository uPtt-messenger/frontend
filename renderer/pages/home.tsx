"use client";
import { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  Link as ChakraLink,
  Text,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { AddIcon, SearchIcon } from "@chakra-ui/icons";
import { withRouter } from "next/router";
import NextLink from "next/link";
import useUptt from "../hooks/useUptt";

const bg = "white";
const borderColor = "gray.200";
const hoverBg = "gray.100";
const messageBgSelf = "blue.500";
const messageBgOther = "gray.100";

const MessageForm = ({
  onSubmit,
}: {
  onSubmit: ({ chatMessage }: { chatMessage: string }) => void;
}) => {
  const [chatMessage, setChatMessage] = useState("");

  return (
    <Flex
      borderTop="1px"
      borderColor={borderColor}
      p="4"
      alignItems="center"
      as="form"
      onSubmit={(event) => {
        event.preventDefault();
        if (chatMessage) {
          onSubmit({ chatMessage });
          setChatMessage("");
        }
      }}
    >
      <Input
        flex="1"
        placeholder="輸入訊息..."
        value={chatMessage}
        onChange={(e) => setChatMessage(e.target.value)}
      />
      <Button ml="3" colorScheme="blue" type="submit">
        傳送
      </Button>
    </Flex>
  );
};

const ModalForm = ({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: ({
    name,
    chatMessage,
  }: {
    name: string;
    chatMessage: string;
  }) => void;
}) => {
  const [name, setName] = useState("");
  const [chatMessage, setChatMessage] = useState("");

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>輸入訊息</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form
            id="new-chat-message"
            onSubmit={(event) => {
              event.preventDefault();
              onSubmit({ name, chatMessage });
            }}
          >
            <FormControl>
              <FormLabel>Id</FormLabel>
              <Input
                isRequired
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>訊息</FormLabel>
              <Input
                isRequired
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
              />
            </FormControl>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button type="submit" form="new-chat-message">
            傳送
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

function Component({ router }) {
  const username = (router.query.username ?? "").toLowerCase();
  const {
    initializing, // @TODO: 如何處理 initializing
    chats,
    isSendingChatMessage,
    sendChatMessage,
  } = useUptt({ username });
  const [currentUser, setCurrentUser] = useState<string | undefined>();
  const withUserChat = chats.chatMap[currentUser] ?? [];

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Flex height="100vh" width="full">
      <Box
        width="72"
        borderRight="1px"
        borderColor={borderColor}
        bg={bg}
        display="flex"
        flexDirection="column"
      >
        <Flex
          align="center"
          justify="space-between"
          px="4"
          py="3"
          borderBottom="1px"
          borderColor={borderColor}
        >
          <Text fontSize="lg" fontWeight="semibold">
            聊天訊息
          </Text>
          <IconButton
            icon={<AddIcon />}
            aria-label="Add chat"
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsModalOpen(true);
            }}
          />
        </Flex>
        <Box flex="1" overflowY="auto">
          {Object.entries(chats?.chatMap ?? {}).map(([name, chat]) => {
            const lastMessage = chat[chat.length - 1];
            return (
              <ChakraLink
                key={name}
                onClick={() => {
                  setCurrentUser(name);
                }}
                as={NextLink}
                href="#"
                _hover={{ bg: hoverBg }}
                display="flex"
                alignItems="center"
                gap="3"
                p="3"
                maxW="100%"
                overflowX="hidden"
              >
                <Avatar name={name} />
                <Box flex="1" overflowX="hidden">
                  <Flex justify="space-between">
                    <Text fontWeight="semibold">{name}</Text>
                    <Text fontSize="xs" color="gray.500">
                      {new Date(lastMessage.date).toLocaleDateString("zh-TW")}
                    </Text>
                  </Flex>
                  <Text fontSize="sm" color="gray.500" isTruncated>
                    {lastMessage.chatMessage}
                  </Text>
                </Box>
              </ChakraLink>
            );
          })}
        </Box>
      </Box>
      <Flex flexDirection="column" flex="1" bg={bg}>
        <Flex
          align="center"
          justify="space-between"
          px="4"
          py="3"
          borderBottom="1px"
          borderColor={borderColor}
        >
          <Flex align="center" gap="3">
            <Avatar name="P0" />
            <Text fontWeight="semibold">Person 0</Text>
          </Flex>
          <Flex gap="2">
            <IconButton
              icon={<SearchIcon />}
              aria-label="Search"
              variant="ghost"
              size="sm"
            />
          </Flex>
        </Flex>
        <Box flex="1" overflowY="auto" p="4">
          <VStack flex="1" overflowY="auto" p="4" spacing="4">
            {withUserChat.map(({ date, chatMessage, name }) => (
              <Flex
                key={`${date}_${chatMessage}_${name}`}
                justifyContent={
                  name === currentUser ? "flex-start" : "flex-end"
                }
                w="full"
              >
                {name == currentUser && <Avatar name={name} mr={2} />}
                <Box
                  bg={name !== currentUser ? messageBgSelf : messageBgOther}
                  color={name !== currentUser ? "white" : "black"}
                  rounded="lg"
                  p="3"
                  maxW="70%"
                  marginLeft={name !== currentUser ? "3" : "0"}
                >
                  <Text fontSize="sm">{chatMessage}</Text>
                  <Text fontSize="xs" mt="1">
                    {new Date(date).toLocaleDateString("zh-TW")}
                  </Text>
                </Box>
              </Flex>
            ))}
          </VStack>
        </Box>
        <MessageForm
          onSubmit={({ chatMessage }) => {
            sendChatMessage({ name: currentUser, chatMessage });
          }}
        />
      </Flex>
      <ModalForm
        key={`isModalOpen:${isModalOpen}`}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        onSubmit={({ name, chatMessage }) => {
          sendChatMessage({ name, chatMessage });
          setIsModalOpen(false);
        }}
      />
    </Flex>
  );
}

export default withRouter(Component);
