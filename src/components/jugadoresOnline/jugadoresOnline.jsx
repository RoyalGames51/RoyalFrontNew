import React, { useEffect, useState } from "react";
import { Box, Avatar, Text, Flex, Spinner, Link } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import axios from "axios";
import API_URL from "../../api/rutaApi";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch usuarios desde la base de datos
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/getUsers`
        ); // Cambia la URL según tu backend
        
        const allUsers = response.data;
        
        // Seleccionar un máximo de 7 usuarios aleatorios
        const randomUsers = allUsers
          .sort(() => Math.random() - 0.5) // Mezclar aleatoriamente
          .slice(0, 7); // Tomar los primeros 7 usuarios
        
        setUsers(randomUsers);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Box
      w="300px"
      h="60%"
      bg="gray.100"
      borderRadius="10px"
      p="4"
      ml="3%"
      boxShadow="md"
    >
      {loading ? (
        <Flex justify="center" align="center" h="100%">
          <Spinner size="lg" color="teal.500" />
        </Flex>
      ) : (
        users.map((user) => (
          <Link
            as={RouterLink}
            to={`/perfil/${user.nick}`}
            key={user.id}
            _hover={{ textDecoration: "none" }}
          >
            <Flex
              align="center"
              p="3"
              mb="2"
              bg="white"
              borderRadius="md"
              boxShadow="sm"
              _hover={{ bg: "gray.200", cursor: "pointer" }}
            >
              <Avatar
                size="md"
                name={user.nick}
                src={user.avatar || "https://via.placeholder.com/150"} // Asegúrate de que el backend envíe la URL del avatar
                mr="3"
              />
              <Box>
                <Text fontWeight="bold">{user.nick.charAt(0).toUpperCase() + user.nick.slice(1)}</Text>
                <Text fontSize="sm" color="gray.500">
                  Jugando
                </Text>
              </Box>
            </Flex>
          </Link>
        ))
      )}
    </Box>
  );
}
