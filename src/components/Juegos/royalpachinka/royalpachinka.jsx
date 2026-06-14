import React from "react";
import { useSelector } from "react-redux";
import { Box, Spinner, Center } from "@chakra-ui/react";

const RoyalPachinka = () => {
  const currentUser = useSelector((state) => state.currentUser);
  const jugadorID = currentUser?.id || "default-id";
  const gameURL = `https://royalpachinka.s3.us-east-2.amazonaws.com/pachinka/index.html?jugadorID=${jugadorID}`;

  return (
    <Box
      w="100vw"
      h="calc(100vh - 60px)"
      bg="gray.900"
      display="flex"
      flexDirection="column"
    >
      {jugadorID ? (
        <Box
          flex="1"
          position="relative"
          w="100%"
          bg="gray.800"
          overflow="hidden"
        >
          {/* <iframe
            src={gameURL}
            title="Royal Pachinka"
            style={{
              position: "absolute",
              top: "60px",
              left: 0,
              width: "100%",
              height: "calc(100% - 60px)",
              border: "none",
            }}
          /> */}
          <iframe
    src={gameURL}
    title="Royal Pachinka"
    style={{
        width: "100%",
        height: "100%",
        border: "none"
    }}
/>
        </Box>
      ) : (
        <Center h="100%">
          <Spinner size="xl" color="teal.300" />
        </Center>
      )}
    </Box>
  );
};

export default RoyalPachinka;
