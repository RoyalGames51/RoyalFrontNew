import { IconButton, Button, Stack,Icon } from "@chakra-ui/react";
import { FaSignOutAlt } from "react-icons/fa";
import {  useDispatch } from "react-redux";
import { useAuth } from "../../context/oauthContext";
import { useNavigate } from "react-router";
import { logout } from "../../redux/actions";
import Swal from "sweetalert2";

const LogOut = ({ insideMenu }) => {
  const navigate = useNavigate();
  const auth = useAuth();
  const dispatch = useDispatch();


  const handleLogOut = async () => {
    try {
      await auth.logOut();
      
      // Dispatch de la acción logout de Redux (limpia token y usuario)
      dispatch(logout());
      
      Swal.fire({
        title: "¡Sesión cerrada con éxito!",
        icon: "success"
      }).then(() => {
        // Redirigir después de mostrar el mensaje
        window.location.href = '/';
      });
    } catch (error) {
      console.error(`Error al cerrar sesión: ${error.message}`);
      Swal.fire({
        title: "Error",
        text: "Hubo un error al cerrar sesión",
        icon: "error"
      });
    }
  };
  

  return (
    <Stack direction="row" spacing={4} data-inside-menu={insideMenu ? true : undefined}>
      {/* <IconButton
        variant="solid"
        aria-label="Cerrar sesión"
        icon={<Icon as={FaSignOutAlt} />}
        
      /> */}
      <Button onClick={handleLogOut}
      aria-label="Cerrar sesión"
      rightIcon={<FaSignOutAlt/>}
      bgColor={"#AEE56F"}>
        Cerrar Sesión
      </Button>
    </Stack>
  );
};

export default LogOut;
