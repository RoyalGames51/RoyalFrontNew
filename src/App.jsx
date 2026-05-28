import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
        {showWelcomeGift && currentUser?.id && createPortal(
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
            onClick={handleCloseGift}
          >
            <div
              className="glass-card rounded-xl p-8 shadow-2xl relative max-w-sm w-full text-center space-y-6 border border-[#1A1A26] select-none"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Atmospheric background spot */}
              <div className="bg-glow-spot -top-20 -left-20 pointer-events-none"></div>

              <img
                src={regaloBienvenida}
                alt="Regalo de bienvenida"
                className="w-48 h-auto mx-auto object-contain drop-shadow-[0_0_20px_rgba(201,168,76,0.35)]"
              />

              <div className="space-y-2 relative z-10">
                <h2 className="font-headline-md text-headline-md text-white">¡Felicidades!</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Has ganado 1,000,000 de fichas por ser uno de los primeros 100 usuarios.
                </p>
              </div>

              <button
                onClick={handleCloseGift}
                className="gold-gradient gold-glow gold-glow-hover w-full py-3.5 px-4 rounded-lg font-headline-sm text-headline-sm text-[#0A0A0F] uppercase tracking-wider transition-all duration-300 transform active:scale-[0.98] cursor-pointer relative z-10"
              >
                ¡Gracias!
              </button>
            </div>
          </div>,
          document.body
        )}
      </AuthProvider>
    </Container>
  );
}

export default App;
