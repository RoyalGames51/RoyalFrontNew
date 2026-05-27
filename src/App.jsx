import { useState, useEffect } from 'react';
import { Container, Box, Image, Button } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import Nav from './components/Nav/nav';
import Footer from './components/footer/footer';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home/home';
import { AuthProvider } from './context/oauthContext';
import Perfil from './components/Perfil/perfil';
import BuyChips from './components/Buychips/buyChips';
import LogOut from './components/Logout/logout';
import Panel from './components/Panel/panelAdmin';
import GameGrid from './components/Juegos/juegos';
import News from './components/News/news';
import regaloBienvenida from '../src/assets/regalobienvenida.png';
import { useSelector, useDispatch } from 'react-redux';
import TermsAndConditions from './components/termsyConds/terminosYCondiciones';
import axios from 'axios';

import Diamantes from './components/Juegos/Diamantes/diamantes';
import API_URL from './api/rutaApi';

function App() {
  const [showWelcomeGift, setShowWelcomeGift] = useState(false);
  const { currentUser } = useSelector((state) => state);
  const dispatch = useDispatch();
  const location = useLocation(); // Hook para obtener la ubicación actual

  useEffect(() => {
    const checkWelcomeGift = async () => {
      if (currentUser?.id && !currentUser.firstChips) {
        const timer = setTimeout(() => setShowWelcomeGift(true), 2500);

        try {
          await axios.put(`${API_URL}/firstchips/${currentUser.id}`);
        } catch (error) {
          console.error('Error actualizando firstChips:', error);
        }

        return () => clearTimeout(timer);
      }
    };

    checkWelcomeGift();
  }, [currentUser, dispatch]);

  const handleCloseGift = () => {
    setShowWelcomeGift(false);
  };

  // Determinar si el footer debe mostrarse
  const shouldShowFooter = !location.pathname.includes('/play');

  return (
    <Container
      bg="#16130d"
      color="#e9e1d7"
      className="bg-background text-on-background min-h-screen"
      maxW="100%"
      w="100%"
      maxH="100%"
      h="100%"
      mt={0}
      p={0}
    >
      <AuthProvider>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
        
        <Route path="/perfil" element={<Perfil />} /> {/* Perfil propio */}
        <Route path="/perfil/:userNick" element={<Perfil isPublic={true} />} /> {/* Perfil público */}
          <Route path="/juegos" element={<GameGrid />} />
          <Route path="/chips" element={<BuyChips />} />
          <Route path="/logout" element={<LogOut />} />
          <Route path="/panel" element={<Panel />} />
          <Route path="/noticias" element={<News />} />
          <Route path="/terminos-y-condiciones" element={<TermsAndConditions />} />
          <Route path="/play/minas" element={<Diamantes />} />
        </Routes>
        {shouldShowFooter && <Footer />}
        {showWelcomeGift && currentUser?.id && (
          <Box
            position="fixed"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            bg="white"
            p="30px"
            boxShadow="2xl"
            borderRadius="15px"
            width="400px"
            textAlign="center"
            zIndex="10"
          >
            <Image src={regaloBienvenida} alt="Regalo de bienvenida" mb={4} />
            <Box fontSize="2xl" fontWeight="bold">¡Felicidades!</Box>
            <Box>Has ganado 1,000,000 de fichas por ser uno de los primeros 100 usuarios.</Box>
            <Button mt={4} colorScheme="teal" onClick={handleCloseGift}>
              ¡Gracias!
            </Button>
          </Box>
        )}
      </AuthProvider>
    </Container>
  );
}

export default App;
