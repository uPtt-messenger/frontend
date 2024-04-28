import React from 'react';
import { Avatar, Box, Button, Flex, IconButton, Input, Link as ChakraLink, Text, VStack } from '@chakra-ui/react';
import { AddIcon, SearchIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';

export default function Component() {
  const bg = 'white';
  const borderColor = 'gray.200';
  const hoverBg = 'gray.100';
  const messageBgSelf = 'blue.500';
  const messageBgOther = 'gray.100';

  const chats = [
    { id: 1, name: 'Person0', message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum nec odio ipsum. Suspendisse cursus malesuada facilisis. Nunc consectetur, risus et ac facilisis, risus metus feugiat velit, nec placerat nisi sem in lacus.", time: '9:15 AM' },
    { id: 2, name: 'Person0', message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum nec odio ipsum. Suspendisse cursus malesuada facilisis. Nunc consectetur, risus et ac facilisis, risus metus feugiat velit, nec placerat nisi sem in lacus.", time: '9:15 AM' },
    { id: 3, name: 'You', message: "これはサンプルテキストです。この文章は単にダミーテキストの役割を果たしています。このテキストには実際の意味はありません。", time: '9:20 AM' },
    { id: 4, name: 'Person0', message: "在彼此瞭解的過程中，我們逐漸發現，這就是我們對事物的認識。我們不能否認，只有敢於面對真相，才能獲得真實的自我。每一個成功者，都有一顆不屈的心。", time: '9:25 AM' }
  ];

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
        <Flex align="center" justify="space-between" px="4" py="3" borderBottom="1px" borderColor={borderColor}>
          <Text fontSize="lg" fontWeight="semibold">聊天訊息</Text>
          <IconButton icon={<AddIcon />} aria-label="Add chat" variant="ghost" size="sm" />
        </Flex>
        <Box flex="1" overflowY="auto">
          {[...Array(3)].map((_, index) => (
            <ChakraLink as={NextLink} href="#" _hover={{ bg: hoverBg }} display="flex" alignItems="center" gap="3" p="3" maxW="100%" overflowX="hidden">
              <Avatar name={`Person ${index}`} />
              <Box flex="1" overflowX="hidden">
                <Flex justify="space-between">
                  <Text fontWeight="semibold">Person{index}</Text>
                  <Text fontSize="xs" color="gray.500">5 分鐘前</Text>
                </Flex>
                <Text fontSize="sm" color="gray.500" isTruncated>
					訊息訊息訊息訊息訊息訊息訊息訊息
                </Text>
              </Box>
            </ChakraLink>
          ))}
        </Box>
      </Box>
      <Flex flexDirection="column" flex="1" bg={bg}>
        <Flex align="center" justify="space-between" px="4" py="3" borderBottom="1px" borderColor={borderColor}>
          <Flex align="center" gap="3">
            <Avatar name="P0" />
            <Text fontWeight="semibold">Person 0</Text>
          </Flex>
          <Flex gap="2">
            <IconButton icon={<SearchIcon />} aria-label="Search" variant="ghost" size="sm" />
          </Flex>
        </Flex>
        <Box flex="1" overflowY="auto" p="4" spacing="4">
		<VStack flex="1" overflowY="auto" p="4" spacing="4">
          {chats.map((chat, index) => (
             <Flex key={index} justifyContent={chat.name === 'You' ? 'flex-end' : 'flex-start'} w="full">
			 {chat.name !== 'You' && <Avatar name={chat.name} mr={2} />}
			 <Box bg={chat.name === 'You' ? messageBgSelf : messageBgOther} color={chat.name === 'You' ? 'white' : 'black' } rounded="lg" p="3" maxW="70%" marginLeft={chat.name === 'You' ? "3" : "0"}>
			   <Text fontSize="sm">{chat.message}</Text>
			   <Text fontSize="xs" mt="1">{chat.time}</Text>
			 </Box>
		   </Flex>
          ))}
        </VStack>

        </Box>
        <Flex borderTop="1px" borderColor={borderColor} p="4" alignItems="center">
          <Input flex="1" placeholder="輸入訊息..."/>
          <Button ml="3" colorScheme="blue">傳送</Button>
        </Flex>
      </Flex>
    </Flex>
  )
}
