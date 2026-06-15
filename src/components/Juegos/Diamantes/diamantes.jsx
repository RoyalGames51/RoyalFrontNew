import React from "react";
import { useSelector } from "react-redux";
import { Box, Spinner, Center } from "@chakra-ui/react";

const Diamantes = () => {
  // Obtener el jugadorID del estado global
  const currentUser = useSelector((state) => state.currentUser);
  const jugadorID = currentUser?.id || "default-id"; // Valor por defecto si no hay usuario

  // URL del juego con el jugadorID
  const gameURL = `https://minasroyal.s3.us-east-2.amazonaws.com/minas22/index.html?jugadorID=${jugadorID}`;
  

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
            title="Juego Minas"
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

export default Diamantes;
