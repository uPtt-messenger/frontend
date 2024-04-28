import React from "react";
import Head from "next/head";
import { Button, Link as ChakraLink } from "@chakra-ui/react";

export default function NextPage() {
  return (
    <React.Fragment>
      <Head>
        <title>Next - Nextron (with-chakra-ui)</title>
      </Head>
      <Button
        as={ChakraLink}
        href="/home"
        variant="outline"
        colorScheme="teal"
        rounded="button"
        width="full"
      >
        Go to home page
      </Button>
    </React.Fragment>
  );
}
