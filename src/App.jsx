import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Container } from '@chakra-ui/react';
import { useLocation, Route, Routes } from 'react-router-dom';
import Nav from './components/Nav/nav';
import Sidebar from './components/Sidebar/sidebar';
import Footer from './components/footer/footer';
import Home from './components/Home/home';
import { AuthProvider } from './context/oauthContext';
import Perfil from './components/Perfil/perfil';
import BuyChips from './components/Buychips/buyChips';
import LogOut from './components/Logout/logout';
import GameGrid from './components/Juegos/juegos';
import News from './components/News/news';
import regaloBienvenida from '../src/assets/regalobienvenida.png';
import { useSelector } from 'react-redux';
import TermsAndConditions from './components/termsyConds/terminosYCondiciones';
import axios from 'axios';
import Diamantes from './components/Juegos/Diamantes/diamantes';
import RoyalJoker from './components/Juegos/RoyalJoker/royaljoker';
import RoyalPachinka from './components/Juegos/royalpachinka/royalpachinka';
import API_URL from './api/rutaApi';
import AboutUs from './components/AboutUs/aboutUs';
import UserManagement from './components/AdminPanel/UserManagement/userManagement';
import AdminDashboard from './components/AdminPanel/AdminDashboard/adminDashboard';
import SupportTicketsAdmin from './components/AdminPanel/SupportTickets/supportTickets';
import AdminDeposits from './components/AdminPanel/Deposits/deposits';
import AdminPrizes from './components/AdminPanel/Prizes/prizes';
import ResetPassword from './components/ResetPassword/resetPassword';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import RequireAuth from './components/ProtectedRoute/RequireAuth';
import PaymentSuccess from './components/PaymentStatus/PaymentSuccess';
import PaymentFailure from './components/PaymentStatus/PaymentFailure';
import PaymentPending from './components/PaymentStatus/PaymentPending';
import Bazar from './components/Bazar/bazar';
import Friends from './components/Friends/friends';
import Messages from './components/Messages/messages';
import GameDetail from './components/Juegos/GameDetail/gameDetail';
import Support from './components/Support/support';
import Contact from './components/Contact/contact';
import Faq from './components/Faq/faq';
import Privacidad from './components/Legal/privacidad';
import Cumplimiento from './components/Legal/cumplimiento';
import Careers from './components/Careers/careers';

function App() {
  const [showWelcomeGift, setShowWelcomeGift] = useState(false);
  const { currentUser } = useSelector((state) => state);
  const location = useLocation();

  useEffect(() => {
    const checkWelcomeGift = async () => {
      if (currentUser?.id && !currentUser.firstChips) {
        const timer = setTimeout(() => setShowWelcomeGift(true), 2500);

        try {
          await axios.put(`${API_URL}/firstchips/${currentUser.id}`);
        } catch (error) {
        }

        return () => clearTimeout(timer);
      }
    };

    checkWelcomeGift();
  }, [currentUser]);

  // Lightweight presence signal: lets the admin panel + "jugadores conectados" widget
  // approximate "online now" (and what page/game someone is on) by marking lastSeen
  // every couple of minutes while the app is open, and immediately on navigation.
  useEffect(() => {
    if (!currentUser?.id) return;
    const sendHeartbeat = () => {
      axios.put(`${API_URL}/users/heartbeat`, { currentPath: location.pathname }).catch(() => {});
    };
    sendHeartbeat();
    const interval = setInterval(sendHeartbeat, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, [currentUser?.id, location.pathname]);

  const handleCloseGift = () => {
    setShowWelcomeGift(false);
  };

  return (
    <Container
      bg="#16130d"
      color="#e9e1d7"
      className="bg-background text-on-background"
      maxW="100%"
      w="100%"
      mt={0}
      p={0}
      display="flex"
      flexDirection="column"
      minH="100vh"
    >
      <AuthProvider>
        <div className="flex flex-col flex-1">
          {(location.pathname !== "/" || currentUser?.id) && <Nav />}
          <Sidebar />
          <div
            className={`transition-all duration-300 flex flex-col flex-1 ${
              currentUser?.id && !location.pathname.includes('/play') ? 'md:pl-16 lg:pl-56' : ''
            }`}
          >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/perfil/:userNick" element={<Perfil isPublic={true} />} />
            <Route path="/juegos" element={<RequireAuth><GameGrid /></RequireAuth>} />
            <Route path="/juegos/:slug" element={<RequireAuth><GameDetail /></RequireAuth>} />
            <Route path="/chips" element={<BuyChips />} />
            <Route path="/logout" element={<LogOut />} />
            <Route path="/admin/users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
            <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/tickets" element={<ProtectedRoute><SupportTicketsAdmin /></ProtectedRoute>} />
            <Route path="/admin/deposits" element={<ProtectedRoute><AdminDeposits /></ProtectedRoute>} />
            <Route path="/admin/prizes" element={<ProtectedRoute><AdminPrizes /></ProtectedRoute>} />
            <Route path="/noticias" element={<News />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/terminos-y-condiciones" element={<TermsAndConditions />} />
            <Route path="/privacidad" element={<Privacidad />} />
            <Route path="/cumplimiento" element={<Cumplimiento />} />
            <Route path="/trabaja-con-nosotros" element={<Careers />} />
            <Route path="/play/minas" element={<RequireAuth><Diamantes /></RequireAuth>} />
            <Route path="/play/royaljoker" element={<RequireAuth><RoyalJoker /></RequireAuth>} />
            <Route path="/play/royalpachinka" element={<RequireAuth><RoyalPachinka /></RequireAuth>} />
            <Route path="/bazar" element={<Bazar />} />
            <Route path="/amigos" element={<Friends />} />
            <Route path="/mensajes" element={<Messages />} />
            <Route path="/mensajes/:nick" element={<Messages />} />
            <Route path="/ayuda" element={<Support />} />
            <Route path="/ayuda/:ticketId" element={<Support />} />
            <Route path="/contacto" element={<Contact />} />
            <Route path="/preguntas-frecuentes" element={<Faq />} />
            <Route path="/restablecer-contrasena" element={<ResetPassword />} />
            <Route path="/mercadopago/success" element={<PaymentSuccess />} />
            <Route path="/mercadopago/failure" element={<PaymentFailure />} />
            <Route path="/mercadopago/pending" element={<PaymentPending />} />
          </Routes>
          {!location.pathname.includes('/play') && <Footer />}
          </div>
        </div>
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
