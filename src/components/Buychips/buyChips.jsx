import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import API_URL from '../../api/rutaApi';
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

import {
  Box,
  Grid,
  Image,
  Text,
  Select,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  VStack,
  Flex,
} from "@chakra-ui/react";
import quinientosmil from "../../assets/500000.jpg";
import millon from "../../assets/millon.jpg";
import cincomillones from "../../assets/5millones.jpg";
import quincemillones from "../../assets/15millones.jpg";
import cincuentamillones from "../../assets/50millones.jpg";
import doscincuenta from "../../assets/250millones.jpg";
import billon from "../../assets/1billon.jpg";
import veinticeisb from "../../assets/26billones.jpg";

export default function BuyChips() {
  const [country, setCountry] = useState("Estados Unidos"); // Por defecto: EEUU
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChip, setSelectedChip] = useState(null);
  const [paypalOrderId, setPaypalOrderId] = useState(null);

  // Configuración de precios y monedas por país
  const countryConfig = {
    argentina: { currency: "ARS", exchangeRate: 1000 },
    brasil: { currency: "BRL", exchangeRate: 5 },
    "Estados Unidos": { currency: "USD", exchangeRate: 1 },
    espana: { currency: "EUR", exchangeRate: 0.9 },
    mexico: { currency: "MXN", exchangeRate: 20 },
    "resto del mundo": { currency: "USD", exchangeRate: 1 },
  };

  const chipOptions = [
    { id: 1, basePrice: 1, amount: 500000, image: quinientosmil },
    { id: 2, basePrice: 2, amount: 1000000, image: millon },
    { id: 3, basePrice: 6, amount: 5000000, image: cincomillones },
    { id: 4, basePrice: 15, amount: 15000000, image: quincemillones },
    { id: 5, basePrice: 50, amount: 50000000, image: cincuentamillones },
    { id: 6, basePrice: 200, amount: 250000000, image: doscincuenta },
    { id: 7, basePrice: 500, amount: 1000000000, image: billon },
    { id: 8, basePrice: 1000, amount: 2600000000, image: veinticeisb },
  ];

  const handleCountryChange = (e) => setCountry(e.target.value);



const openPaymentModal = (chip) => {
  setSelectedChip(chip);
  setIsModalOpen(true);
};

useEffect(() => {
  if (isModalOpen && selectedChip && currency !== "ARS" && currency !== "MXN") {
    // Crear automáticamente la orden de PayPal si corresponde
    handlePaypalOrder();
  }
}, [isModalOpen, selectedChip]);

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedChip(null);
    setPaypalOrderId(null); // Limpiar la orden de PayPal
  };

  // Obtén la configuración del país actual
  const { currency, exchangeRate } = countryConfig[country];

  //paypal
  const handlePaypalOrder = async () => {
  

    try {
      const response = await axios.post(
        `${API_URL}/payments/paypal/create-order`,
        {
          price: (selectedChip.basePrice * exchangeRate).toFixed(2),
          userId: currentUser?.id || "guest",
          chips: selectedChip.amount,
        }
      );
      setPaypalOrderId(response.data.id); // Guarda la orden generada
    } catch (error) {
      console.error("Error al crear la orden de PayPal:", error);
    }
  };

  // Capturar orden de PayPal
  const handleApprove = async (data, actions) => {
    try {
      // Capturar el pago en el backend
      const orderId = data.orderID;
      await axios.put(`${API_URL}/add/chips`, {
        userId: currentUser?.id,
        amount: selectedChip.amount,
      });
      const pay = {
        userId: currentUser?.id,
        paymentPlataform: "PAYPAL",
        paymentId: orderId, // Usa orderId directamente
        date: new Date().toISOString(),
        chips: selectedChip.amount,
        price: selectedChip.basePrice,
      };
      const captureResponse = await axios.post(`${API_URL}/payments/paypal/capture-order`, {
        orderId: orderId, // Enviar el ID de la orden al backend
      });
  
    
  
      // Registrar el pago en el historial (opcional)
      
  
      await axios.post(`${API_URL}/newpay`, pay);
  
      // Mostrar mensaje de éxito al usuario
      alert('¡Pago completado y fichas acreditadas!');
    } catch (err) {
      console.error('Error en el manejo de la aprobación:', err);
      window.location.href = '/'
    }
  };
  


  // MercadoPago
  const { currentUser } = useSelector((state) => state);
  const createOrder = async () => {
    if (!selectedChip) return alert("Selecciona un paquete de fichas.");

    const price = (selectedChip.basePrice * exchangeRate).toFixed(2);
    const date = new Date().toISOString(); // Fecha actual para metadata

    const product = {
      price: parseFloat(price), // Enviar como número
      userId: currentUser?.id || "guest", // Asegúrate de que haya un ID de usuario
      chips: selectedChip.amount,
      paymentPlataform: "MercadoPago",
      date,
    };
    //paypal
    
    

    // Determinar la ruta de la orden según la moneda
    let apiUrl = `${API_URL}/payments/mepago/create-order`; // Ruta por defecto
    if (currency === "ARS") {
      apiUrl = `${API_URL}/payments/mepago/create-order`;
    } else if (currency === "MXN") {
      apiUrl = `${API_URL}/payments/mepago/create-order/mx`;
    }

    try {
      const response = await axios.post(apiUrl, product);
      window.location.href = response.data; // Redirige al link de MercadoPago
    } catch (error) {
      console.error("Error al crear la orden:", error);
    }
  };

  return (
    <PayPalScriptProvider
    options={{
      "client-id": "Aa4WplIP-3eiZtQyyqlQqlWMsnWSM0XQ1lDtr8ijR8m-1sPggFBbuPMGShmtBuajIlbt8bn2wkOx4iQa", // Reemplaza con tu Client ID de PayPal
      currency: "USD",
    }}
  >
    <Flex ml={"10%"}>
      <Box
        p={5}
        bgColor={"white"}
        m={3}
        borderRadius={"20px"}
        w={"65%"}
        boxShadow="0px 4px 10px rgba(0, 0, 0, 0.15)"
      >
        <Text fontSize="2xl" mb={4} textAlign={"center"} fontWeight="bold">
          Royal Chips
        </Text>

        <Select
          textAlign={"center"}
          mb={4}

          onChange={handleCountryChange}
          bgColor={"white"}
          w={"200px"}
          alignItems={"center"}
          border={"1px"}
          borderColor={"black"}
          value={country}
        >
          {!country && (
            <option value="" disabled>
              Selecciona tu país
            </option>
          )}
          {Object.keys(countryConfig).map((countryKey) => (
            <option key={countryKey} value={countryKey}>
              {countryKey.charAt(0).toUpperCase() + countryKey.slice(1)}
            </option>
          ))}
        </Select>

        {/* Ocultar opciones de fichas hasta que se elija un país */}
        {country && (
          <Grid templateColumns="repeat(4, 1fr)" gap={6}>
            {chipOptions.map((chip) => (
              <Box
                key={chip.id}
                textAlign="center"
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                onClick={() => openPaymentModal(chip)}
                cursor="pointer"
                p={4}
                bgColor={"#9eff00"}
                boxShadow="0px 4px 10px rgba(0, 0, 0, 0.15)"
              >
                <Image
                  borderRadius={"10px"}
                  src={chip.image}
                  alt={`Chip ${chip.amount}`}
                  mb={3}
                />
                <Text bgColor={"#000000"} borderRadius={"20px"} color={"white"}>
                  {currency} {(chip.basePrice * exchangeRate).toFixed(2)}
                </Text>
              </Box>
            ))}
          </Grid>
        )}

        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Selecciona un método de pago</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text mb={3}>{selectedChip?.amount}</Text>
              <VStack align="stretch">
                {/* Solo mostrar Mercado Pago en Argentina y México */}
                {(currency === "ARS" || currency === "MXN") && (
                  <Button variant="outline" onClick={createOrder}>
                    Mercado Pago
                  </Button>
                )}
                {/* Solo mostrar Paysafecard en España */}
                {currency === "EUR" && (
                  <Button variant="outline">Paysafecard</Button>
                )}
                    {currency !== "ARS" && currency !== "MXN" && currency !== "BRL" && (
          <>
            {paypalOrderId ? (
              <PayPalButtons
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [
                      {
                        amount: {
                          currency_code: "USD",
                          value: (selectedChip.basePrice * exchangeRate).toFixed(2),
                        },
                        description: `Compra de ${selectedChip.amount} chips`,
                        custom_id: JSON.stringify({
                          userId: currentUser?.id || "guest",
                          chips: selectedChip.amount,
                        }),
                      },
                    ],
                  });
                }}
                onApprove={(data, actions) => handleApprove(data, actions)}
                onError={(err) => {
                  console.error("Error en el proceso de pago:", err);
                  alert("Hubo un error con PayPal.");
                }}
              />
            ) : (
              <Text>Cargando botones de PayPal...</Text>
            )}
          </>
        )}

                
                {/* Opciones generales */}
                {currency !== "USD" && (
                  <Button variant="outline">Tarjeta de credito/debito</Button>
                )}


              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={closeModal}>
                Cerrar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
      <Box
        boxShadow="0px 4px 10px rgba(0, 0, 0, 0.15)"
        w={"20%"}
        m={3}
        borderRadius={"20px"}
        bgColor={"white"}
        h={"50%"}
      >
        <Text fontWeight={"bold"} textAlign={"center"} p={3}>
          ¿Qué son las RoyalChips?
        </Text>
        <Text p={6} fontSize={"13px"}>
          Las Royal Chips son la moneda oficial de la página. Con ellas podrás
          apostar en los juegos y comprar avatares personalizados. Cabe destacar
          que las Royal Chips son monedas ficticias, no intercambiables por
          dinero real, son solo para divertirse.
        </Text>
      </Box>
    </Flex>
 </PayPalScriptProvider>
  );
}
