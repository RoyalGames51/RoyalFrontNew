import { useState } from "react";
import { Box, Text, Button, Stack } from "@chakra-ui/react";

export default function News() {
  // Datos de ejemplo con 8 novedades
  const novedades = [
    { id: 1, titulo: "Oferta de prelanzamiento", texto: "Tenemos una grandiosa oferta para ti, si recargas fichas antes del lanzamiento de la pagina (1/1/2025), tendras un descuento de 90%, no te pierdas esta grandiosa oportunidad!" },
    { id: 2, titulo: "Primer juego: 'Loteria Instantanea'", texto: "Nuestro primer juego lanzado sera la loteria instantanea, un juego donde elegiras un numero del 01 al 100 y si resulta ganador recibiras un grandioso premio." },
    { id: 3, titulo: "1 millon de fichas a los primeros 100 usuarios", texto: "Los 100 primeros usuarios que se registren en nuestra plataforma recibiran 1 millon de fichas en su cuenta." },
    // { id: 4, titulo: "Novedad 4", texto: "Duis sagittis ipsum. Praesent mauris. Fusce nec tellus." },
    // { id: 5, titulo: "Novedad 5", texto: "Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum." },
    // { id: 6, titulo: "Novedad 6", texto: "Curabitur sodales ligula in libero. Sed dignissim lacinia nunc." },
    // { id: 7, titulo: "Novedad 7", texto: "Curabitur tortor. Pellentesque nibh. Aenean quam." },
    { id: 4, titulo: "RoyalGames!!!", texto: "Nos alegra anunciar el proximo lanzamiento de nuestra pagina de juegos el 1/1/2025, ven a divertirte con nosotros, te esperan grandes sorpresas!" },
  ];

  const itemsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(1);

  // Calcular los índices de las novedades para la página actual
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const novedadesPagina = novedades.slice(startIdx, endIdx);

  // Funciones para cambiar de página
  const nextPage = () => setCurrentPage((prev) => (prev < Math.ceil(novedades.length / itemsPerPage) ? prev + 1 : prev));
  const prevPage = () => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));

  return (
    <Box w="80%" m="0 auto" p={5}>
      <Stack spacing={4}>
        {novedadesPagina.map((novedad) => (
          <Box key={novedad.id} bg="gray.100" p={4} borderRadius="md" boxShadow="md">
            <Text fontWeight="bold" fontSize="lg" color="blue.600">{novedad.titulo}</Text>
            <Text mt={2} color="gray.700">{novedad.texto}</Text>
          </Box>
        ))}
      </Stack>
      
      <Box display="flex" justifyContent="center" mt={5}>
        <Button onClick={prevPage} disabled={currentPage === 1} mr={3}>
          Anterior
        </Button>
        <Button onClick={nextPage} disabled={currentPage === Math.ceil(novedades.length / itemsPerPage)}>
          Siguiente
        </Button>
      </Box>
    </Box>
  );
}
