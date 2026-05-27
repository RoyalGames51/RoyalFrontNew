import { Box, Heading, Text, Stack, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const TermsAndConditions = () => {
  const navigate = useNavigate();

  return (
    <Box p={6} maxWidth="800px" mx="auto" 
    border={"1px"} borderColor={"black.200"} mt={"2%"} 
    borderRadius={"10px"}
    bgColor={"white"}>
      <Heading as="h1" size="xl" mb={6} textAlign="center">
        Términos y Condiciones de Uso
      </Heading>

      <Stack spacing={5}>
        <Text fontSize="lg">
          **Fecha de actualización:** 13/11/2024
        </Text>

        <Text>
          Bienvenido a ROYALGAMES.ME. Al acceder a esta página y utilizar nuestros servicios,
          aceptas los siguientes Términos y Condiciones de uso. Si no estás de
          acuerdo con alguna de las disposiciones, te pedimos que no utilices
          nuestros servicios.
        </Text>

        <Heading as="h2" size="md" mt={4}>
          1. Uso de fichas ficticias
        </Heading>
        <Text>
          Los juegos en ROYALGAMES.ME están diseñados para ser
          disfrutados exclusivamente con fichas ficticias. Estas fichas no
          tienen valor monetario y no pueden ser canjeadas por dinero u otros
          bienes o servicios.
        </Text>

        <Heading as="h2" size="md" mt={4}>
          2. Registro y seguridad de la cuenta
        </Heading>
        <Text>
          Para participar en los juegos, es necesario registrarse y crear una
          cuenta. Al hacerlo, te comprometes a proporcionar información precisa,
          actualizada y completa.
        </Text>

        <Heading as="h2" size="md" mt={4}>
          3. Uso permitido
        </Heading>
        <Text>
          La página está destinada exclusivamente para entretenimiento personal
          y no puede ser utilizada para actividades ilegales, apuestas, o
          cualquier propósito no autorizado.
        </Text>

        <Heading as="h2" size="md" mt={4}>
          4. Normas de conducta
        </Heading>
        <Text>
          Nos esforzamos por mantener un entorno amigable y seguro. No se
          tolerarán comportamientos abusivos, lenguaje ofensivo, ni actos de
          acoso hacia otros usuarios.
        </Text>

        <Heading as="h2" size="md" mt={4}>
          5. Compra y uso de fichas
        </Heading>
        <Text>
          ROYALGAMES.ME puede ofrecer la opción de adquirir fichas
          adicionales mediante compras en la plataforma. Al realizar una compra,
          aceptas que las fichas adquiridas no tienen valor monetario y no son
          reembolsables.
        </Text>

        <Heading as="h2" size="md" mt={4}>
          6. Privacidad y manejo de datos personales
        </Heading>
        <Text>
          La privacidad de nuestros usuarios es una prioridad para nosotros.
          Consulta nuestra Política de Privacidad para entender cómo recopilamos,
          usamos y protegemos tu información personal.
        </Text>

        <Heading as="h2" size="md" mt={4}>
          7. Limitación de responsabilidad
        </Heading>
        <Text>
          ROYALGAMES.ME no se hace responsable de ningún daño directo o
          indirecto derivado del uso de nuestra plataforma.
        </Text>

        <Heading as="h2" size="md" mt={4}>
          8. Propiedad intelectual
        </Heading>
        <Text>
          Todo el contenido de ROYALGAMES.ME está protegido por leyes de
          propiedad intelectual. No se permite la copia, reproducción o
          modificación de ningún material sin nuestro consentimiento previo.
        </Text>

        <Heading as="h2" size="md" mt={4}>
          9. Modificaciones de los Términos y Condiciones
        </Heading>
        <Text>
          Nos reservamos el derecho de modificar estos Términos y Condiciones en
          cualquier momento. Los cambios se notificarán mediante una actualización
          en esta sección.
        </Text>

        <Heading as="h2" size="md" mt={4}>
          10. Jurisdicción y ley aplicable
        </Heading>
        <Text>
          Estos Términos y Condiciones se regirán e interpretarán de acuerdo con
          las leyes del pais correspondiente al usuario.
        </Text>
      </Stack>

      <Button mt={8} colorScheme="teal" onClick={() => navigate(-1)}>
        Aceptar y Volver
      </Button>
    </Box>
  );
};

export default TermsAndConditions;
