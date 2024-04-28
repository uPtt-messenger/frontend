import { ChakraProvider } from "@chakra-ui/react";
import Head from "next/head";
import theme from "../lib/theme";

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Head>
        <title>uPtt Messenger</title>
      </Head>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;