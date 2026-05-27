import React from "react";
import { useSelector } from "react-redux";
import { Box, Spinner, Center } from "@chakra-ui/react";

const Diamantes = () => {
  // Obtener el jugadorID del estado global
  const currentUser = useSelector((state) => state.currentUser);
  const jugadorID = currentUser?.id || "default-id"; // Valor por defecto si no hay usuario

  // URL del juego con el jugadorID
  const gameURL = `https://html-classic.itch.zone/html/12360255/juego28/index.html?jugadorID=${jugadorID}`;

  return (
    <Box
      w="100vw"
      h="calc(100vh - 60px)" // Asegúrate de que esto reste exactamente la altura de la Navbar
      bg="gray.900"
      display="flex"
      flexDirection="column"
    >
      {/* Contenedor del juego */}
      {jugadorID ? (
        <Box
          flex="1" // Ocupa el espacio restante considerando la Navbar
          position="relative"
          w="100%"
          bg="gray.800"
          overflow="hidden"
        >
          <iframe
            src={gameURL}
            title="Juego Minas"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: "none",
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

export default Diamantes;
