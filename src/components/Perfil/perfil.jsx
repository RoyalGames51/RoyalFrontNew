import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Heading,
  VStack,
  Text,
  Image,
  Divider,
} from "@chakra-ui/react";
import GameGrid from "./../Juegos/juegos";
import UpdateProfileForm from "./UpdateProfileForm";
import { useParams } from "react-router-dom";
import { fetchFavoriteGames, fetchPublicFavorites, viewedUserProfile } from "./../../redux/actions/index";

const Perfil = ({ isPublic = false }) => {
  const dispatch = useDispatch();
  const { userNick } = useParams();
  
  const currentUser = useSelector((state) => state.currentUser);
  const viewedUser = useSelector((state) => state.viewedUserProfile);



  useEffect(() => {
    if (isPublic) {
      // Primero obtenemos el perfil del usuario público
      dispatch(viewedUserProfile(userNick));
    }
  }, [dispatch, userNick, isPublic]);
  
  useEffect(() => {
    if (isPublic && viewedUser?.id) {
      // Una vez que el perfil está cargado, obtenemos los juegos favoritos
      dispatch(fetchPublicFavorites(viewedUser.id));
    }
  }, [dispatch, isPublic, viewedUser?.id]);
  
  useEffect(() => {
    if (!isPublic && currentUser?.id) {
      // Para el usuario logueado, cargamos sus favoritos
      dispatch(fetchFavoriteGames(currentUser.id));
    }
  }, [dispatch, isPublic, currentUser?.id]);
  

  const user = isPublic ? viewedUser : currentUser;

  if (!user) {
    return (
      <Box w="90%" m="0 auto" p="20px" textAlign="center">
        <Text fontSize="2xl" color="red.500">
          {isPublic ? "Perfil no encontrado." : "Debes iniciar sesión para ver tu perfil."}
        </Text>
      </Box>
    );
  }

  return (
    <Box w="90%" m="0 auto" p="20px" bg="gray.100" borderRadius="15px" boxShadow="lg">
      <Heading textAlign="center" mb="6" fontSize="3xl">
        {isPublic ? `Perfil de ${user.nick}` : `Tu Perfil`}
      </Heading>

      <Tabs variant="soft-rounded" colorScheme="teal" isFitted>
        <TabList mb="4">
          <Tab fontSize="lg" fontWeight="bold">Información</Tab>
          <Tab fontSize="lg" fontWeight="bold">Juegos Favoritos</Tab>
          {!isPublic && <Tab fontSize="lg" fontWeight="bold">Configuración</Tab>}
        </TabList>

        <TabPanels>
          <TabPanel>
            <VStack spacing="6" align="center">
              <Image
                borderRadius="full"
                boxSize="220px"
                src={user.image || user.avatar || "https://via.placeholder.com/220"}
                alt={`${user.nick} avatar`}
                boxShadow="md"
              />
              <Text fontSize="3xl" fontWeight="bold" color="teal.600">
                {user.nick}
              </Text>
              <Text fontSize="lg" color="gray.500">
                {user.email || "Email no disponible"}
              </Text>
              <Divider />
              <Box w="100%" maxW="600px" bg="white" p={6} borderRadius="xl" boxShadow="sm">
                <VStack spacing="4" align="stretch">
                  <Text fontSize="xl" fontWeight="semibold">
                    Fichas: <Box as="span" color="teal.600">{new Intl.NumberFormat('es-ES').format(user.chips || 0)}</Box>
                  </Text>
                  <Text fontSize="lg">
                    Género: <Box as="span" fontWeight="semibold">{user.sexo || "No definido"}</Box>
                  </Text>
                  <Text fontSize="lg">
                    País: <Box as="span" fontWeight="semibold">{user.country || "No especificado"}</Box>
                  </Text>
                  {user.age && (
                    <Text fontSize="lg">
                      Edad: <Box as="span" fontWeight="semibold">{user.age} años</Box>
                    </Text>
                  )}
                  {user.description && (
                    <Text fontSize="lg" color="gray.600">
                      "{user.description}"
                    </Text>
                  )}
                </VStack>
              </Box>
            </VStack>
          </TabPanel>

          
          <TabPanel>
  <Heading size="lg" mb="4" textAlign="center">
    Juegos Favoritos
  </Heading>
  <GameGrid  onlyFavorites={true} isPublicProfile={isPublic}  />
</TabPanel>
          

          {!isPublic && (
            <TabPanel>
              <Heading size="lg" mb="4" textAlign="center">
                Configuración del Perfil
              </Heading>
              <UpdateProfileForm />
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Perfil;
