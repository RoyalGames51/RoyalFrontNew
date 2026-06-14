import React from "react";
import { useSelector } from "react-redux";
import { Box, Spinner, Center } from "@chakra-ui/react";

const RoyalPachinka = () => {
  const currentUser = useSelector((state) => state.currentUser);
  const jugadorID = currentUser?.id || "default-id";
  const gameURL = `https://royalpachinka.s3.us-east-2.amazonaws.com/pachinka/index.html?jugadorID=${jugadorID}`;

  return (
    <Box
      w="100%"
      h="100vh"
      bg="gray.900"
      display="flex"
      flexDirection="column"
      position="fixed"
      top="0"
      left="0"
      right="0"
      overflow="hidden"
    >
      {jugadorID ? (
        <Box
          flex="1"
          position="relative"
          w="100%"
          h="100%"
          bg="gray.800"
          overflow="hidden"
        >
          <iframe
            src={gameURL}
            title="Royal Pachinka"
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              display: "block",
            }}
          />
        </Box>
      ) : (
        <Center h="100%">
          <Spinner size={{ base: "md", md: "xl" }} color="teal.300" />
        </Center>
      )}
    </Box>
  );
};

export default RoyalPachinka;
