import { Box, Button, Input, Stack, Text, FormControl, FormLabel, Icon, Divider } from "@chakra-ui/react";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { administrarUser } from "../../redux/actions";
import axios from 'axios';
import API_URL from '../../api/rutaApi';
import Swal from 'sweetalert2';

export default function Panel() {
  const [userId, setUserId] = useState("");
  const [chipsAmount, setChipsAmount] = useState("");
  const dispatch = useDispatch();
  const administradorUser = useSelector((state) => state.administradorUser);
  const [userData, setUserData] = useState({
    nick: "",
    email: "",
  });
  
  const [userFound, setUserFound] = useState(null);

  const handleSearchUser = async () => {
    try {
      await dispatch(administrarUser(userId));
    } catch (error) {
      setUserFound(false);
      console.error("Error al buscar usuario:", error);
    }
  };

  useEffect(() => {
    if (administradorUser && administradorUser.nick === userId) {
      setUserFound(true);
    } else if (administradorUser && userData.nick && administradorUser.nick !== userId) {
      setUserFound(false);
    }
  }, [administradorUser]);

  const handleAddChips = async () => {
    try {
      const response = await axios.put(`${API_URL}/add/chips`, {
        userId: administradorUser.id,
        amount: Number(chipsAmount),
      });
      Swal.fire("Éxito", "Fichas agregadas correctamente", "success");
      console.log('Fichas agregadas:', response.data);
    } catch (error) {
      Swal.fire("Error", "No se pudo agregar fichas", "error");
      console.error('Error al agregar fichas:', error);
    }
  };

  const handleRemoveChips = async () => {
    try {
      const response = await axios.put(`${API_URL}/remove/chips`, {
        userId: administradorUser.id,
        amount: Number(chipsAmount),
      });
      Swal.fire("Éxito", "Fichas quitadas correctamente", "success");
      console.log('Fichas quitadas:', response.data);
    } catch (error) {
      Swal.fire("Error", "No se pudo quitar fichas", "error");
      console.error('Error al quitar fichas:', error);
    }
  };

  const handleBanUser = async () => {
    try {
      const response = await axios.put(`${API_URL}/user-ban`, {
        id: administradorUser.id,
      });
      Swal.fire("Éxito", "Usuario baneado correctamente", "success");
      console.log('Usuario baneado:', response.data);
    } catch (error) {
      Swal.fire("Error", "No se pudo banear al usuario", "error");
      console.error('Error al banear usuario:', error);
    }
  };

  const handleDeactivateUser = async () => {
    try {
      const response = await axios.put(`${API_URL}/inactivar-user`, {
        id: administradorUser.id,
      });
      Swal.fire("Éxito", "Usuario inactivado correctamente", "success");
      console.log('Usuario inactivado:', response.data);
    } catch (error) {
      Swal.fire("Error", "No se pudo inactivar al usuario", "error");
      console.error('Error al inactivar usuario:', error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const response = await axios.delete(`${API_URL}/user-delete/${administradorUser.id}`);
      Swal.fire("Éxito", "Usuario eliminado correctamente", "success");
      console.log('Usuario eliminado:', response.data);
    } catch (error) {
      Swal.fire("Error", "No se pudo eliminar al usuario", "error");
      console.error('Error al eliminar usuario:', error);
    }
  };

  const handleUpdateUser = async () => {
    try {
      const response = await axios.put(`${API_URL}/actualizar-usuario/${administradorUser.id}`, {
        nick: userData.nick
      });
      Swal.fire("Éxito", "Usuario actualizado correctamente", "success");
      console.log('Usuario actualizado:', response.data);
    } catch (error) {
      Swal.fire("Error", "No se pudo actualizar al usuario", "error");
      console.error('Error al actualizar usuario:', error);
    }
  };

  return (
    <Box p={8} maxW="600px" mx="auto" borderWidth="1px" borderRadius="lg" bgColor="#FFFFFF" mt={8} textAlign="center">
      <Text fontSize="2xl" fontWeight="bold" mb={6}>Panel de Administración</Text>

      <FormControl mb={6}>
        <FormLabel fontSize="lg">Nick del Usuario</FormLabel>
        <Input
          maxW="100%"
          value={userId}
          onChange={(e) => {
            setUserId(e.target.value);
            setUserFound(null);
          }}
          placeholder="Ingresa el nick del usuario"
          mb={2}
        />
        <Button colorScheme="blue" onClick={handleSearchUser}>Buscar usuario</Button>
        {userFound === true && <Icon as={CheckIcon} color="green.500" ml={2} />}
        {userFound === false && <Icon as={CloseIcon} color="red.500" ml={2} />}
      </FormControl>

      <Divider my={4} />

      <FormControl mb={6}>
        <FormLabel fontSize="lg">Cantidad de Fichas</FormLabel>
        <Input
          maxW="100%"
          value={chipsAmount}
          onChange={(e) => setChipsAmount(e.target.value)}
          placeholder="Cantidad de fichas"
          type="number"
          mb={2}
        />
        <Stack direction="row" spacing={4} justify="center" mt={2}>
          <Button colorScheme="green" onClick={handleAddChips}>Agregar Fichas</Button>
          <Button colorScheme="red" onClick={handleRemoveChips}>Quitar Fichas</Button>
        </Stack>
      </FormControl>

      <Divider my={4} />

      <FormControl mb={6}>
        <FormLabel fontSize="lg">Actualizar Datos de Usuario</FormLabel>
        <Input
          maxW="100%"
          value={userData.nick}
          onChange={(e) => setUserData({ ...userData, nick: e.target.value })}
          placeholder="Nuevo nombre de usuario"
          mb={2}
        />
        <Button colorScheme="blue" onClick={handleUpdateUser}>Actualizar Usuario</Button>
      </FormControl>

      <Divider my={4} />

      <Stack direction="row" spacing={4} justify="center">
        <Button colorScheme="orange" onClick={handleBanUser}>Banear Usuario</Button>
        <Button colorScheme="yellow" onClick={handleDeactivateUser}>Inactivar Usuario</Button>
        <Button colorScheme="red" onClick={handleDeleteUser}>Eliminar Usuario</Button>
      </Stack>
    </Box>
  );
}
