import axios from 'axios';
import { validateNick, validateEmail, validatePassword } from './validate';
import Swal from "sweetalert2";
import {
    FormControl,
    FormLabel,
    Input,
    Button,
    Link,
    Stack,
    Text,
    Flex, Image,
    Box,
    Checkbox,
    IconButton
} from "@chakra-ui/react";
import Select from 'react-select';
import { Radio, RadioGroup } from "@chakra-ui/react";

import { HStack } from "@chakra-ui/react"

import { CloseIcon } from '@chakra-ui/icons'; // Ícono para el botón de cerrar
import { useEffect, useState } from "react";
import { useAuth } from "../../context/oauthContext";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from 'react-redux';
import { promo1millon, getUserByEmail } from '../../redux/actions';
import registroimg from '../../assets/registro.png'
import API_URL from '../../api/rutaApi';

const RegistroForm = ({ onSwitchForm, className, children }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const auth = useAuth();

    const [errors, setErrors] = useState({
        nick: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const countUsers = useSelector((state) => state.counterUser);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [isTermsChecked, setIsTermsChecked] = useState(false);
    const [input, setInput] = useState({
        nick: "",
        email: "",
        password: "",
        confirmPassword: "",
        sexo: "",
    });



    useEffect(() => {
        dispatch(promo1millon());

    }, [dispatch]);

    const handleInputChange = (e) => {
        const property = e.target.name;
        const value = e.target.value;
        setInput({
            ...input,
            [property]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const nickError = await validateNick(input.nick);
        const emailError = validateEmail(input.email);
        const passwordError = validatePassword(input.password);
        const confirmPasswordError = input.password !== input.confirmPassword ? "Las contraseñas no coinciden" : "";

        if (nickError || emailError || passwordError || !input.sexo) {
            setErrors({
                nick: nickError || "",
                email: emailError || "",
                password: passwordError || "",
                confirmPassword: confirmPasswordError || "",
                sexo: input.sexo ? "" : "Debe seleccionar un genero"
            });
            return;
        }

        try {
            // Paso 1: Registrar y autenticar al usuario de inmediato
            const userPayload = {
                nick: input.nick,
                email: input.email,
                password: input.password,
                sexo: input.sexo,
            };
            const { signup: signupResponse } = await auth.register(
                input.nick,
                input.email,
                input.password,
                input.sexo,
            );
            console.log("Signup y login exitosos", signupResponse);

            // Paso 2: Agregar chips al nuevo usuario
            const id = signupResponse?.id;
            if (countUsers < 1000 && id) {
                await axios.put(`${API_URL}/add/chips`, {
                    userId: id,
                    amount: 1000000,
                });
            } else if (countUsers >= 1000 && id) {
                await axios.put(`${API_URL}/add/chips`, {
                    userId: id,
                    amount: 10000,
                });
            }

            // Refrescar el usuario para que la UI muestre las fichas correctas
            await dispatch(getUserByEmail(input.email));

            Swal.fire("¡Éxito!", "Tu cuenta ha sido creada exitosamente", "success");
            setIsRegisterOpen(false);
            navigate('/');
        } catch (error) {
            console.error("Error en el registro:", error);
            Swal.fire("Oops...", "Hubo un error en el registro", "error");
        }
    };

    const toggleRegisterBox = () => {
        setIsRegisterOpen(!isRegisterOpen);
    };

    return (
        <Box mr={"15px"}>
            <button
                onClick={toggleRegisterBox}
                type="button"
                className={className || "px-4 py-2 rounded-lg gold-gradient text-on-primary font-label-lg text-label-lg font-bold hover:opacity-90 transition-all shadow-sm"}
            >
                {children || "Registrarse"}
            </button>

            {isRegisterOpen && (
                <>
                    <form onSubmit={handleSubmit}>
                        {/* Fondo oscuro */}
                        <Box
                            position="fixed"
                            top="0"
                            left="0"
                            width="100vw"
                            height="100vh"
                            bg="rgba(0, 0, 0, 0.6)" // Fondo oscuro con opacidad
                            zIndex="9"
                            onClick={toggleRegisterBox} // Cerrar al hacer clic en el fondo
                        />

                        <Flex
                            position="fixed"
                            top="50%"
                            left="50%"
                            transform="translate(-50%, -50%)"
                            bg="white"

                            boxShadow="2xl"
                            borderRadius="15px"
                            width="700px"
                            zIndex="10"
                            align="center"
                            direction={"column"}
                        >
                            {/* Imagen al lado izquierdo */}
                            <Box
                                bg="#13d500"
                                color="white"
                                width="100%"
                                textAlign="center"
                                py={2}
                                borderTopRadius="15px"
                            >
                                <Text fontSize="1xl" fontWeight="bold">Regístrate en la mejor pagina de juegos online</Text>
                                {/* <IconButton
                            position="absolute"
                            top="10px"
                            right="10px"
                            aria-label="Cerrar registro"
                            icon={<CloseIcon />}
                            onClick={toggleRegisterBox}
                            bg="transparent"
                            _hover={{ bg: "red.100" }}
                        /> */}
                            </Box>
                            <Flex width="100%" p="30px">
                                {/* Formulario de registro */}
                                <Box
                                    flex={2}
                                    bgColor={"gray.100"}
                                    borderRadius={"20px"}
                                    p={2}
                                    border={"1px"}
                                    borderColor={"gray.300"}
                                >
                                    {/* Botón de cerrar */}


                                    <Stack spacing={4} pt={"10px"}>


                                        <FormControl isInvalid={errors.nick}>

                                            <Input
                                                placeholder="Nombre de usuario"
                                                type="text"
                                                name="nick"
                                                value={input.nick}
                                                onChange={handleInputChange}
                                                border={"1px"}
                                                borderColor={"gray.300"}
                                                borderRadius={"20px"}
                                            />
                                            {errors.nick && <Text color="red.500">{errors.nick}</Text>}
                                        </FormControl>

                                        <FormControl isInvalid={errors.email}>

                                            <Input
                                                placeholder="Correo electrónico"
                                                type="email"
                                                name="email"
                                                value={input.email}
                                                onChange={handleInputChange}
                                                border={"1px"}
                                                borderColor={"gray.300"}
                                                borderRadius={"20px"}
                                            />
                                            {errors.email && <Text color="red.500">{errors.email}</Text>}
                                        </FormControl>

                                        <FormControl isInvalid={errors.password}>

                                            <Input
                                                placeholder="Contraseña"
                                                type="password"
                                                name="password"
                                                value={input.password}
                                                onChange={handleInputChange}
                                                border={"1px"}
                                                borderColor={"gray.300"}
                                                borderRadius={"20px"}
                                            />
                                            {errors.password && <Text color="red.500">{errors.password}</Text>}
                                        </FormControl>
                                        <FormControl isInvalid={errors.confirmPassword}>
                                            <Input
                                                placeholder="Confirmar Contraseña"
                                                type="password"
                                                name="confirmPassword"
                                                value={input.confirmPassword}
                                                onChange={handleInputChange}
                                                border={"1px"}
                                                borderColor={"gray.300"}
                                                borderRadius={"20px"}
                                            />
                                            {errors.confirmPassword && <Text color="red.500">{errors.confirmPassword}</Text>}
                                        </FormControl>
                                        <FormControl isInvalid={errors.sexo}>
                                            <FormLabel>Género</FormLabel>
                                            <RadioGroup
                                                onChange={(value) => setInput({ ...input, sexo: value })}
                                                value={input.sexo}
                                            >
                                                <HStack spacing="24px">
                                                    <Radio value="H">Hombre</Radio>
                                                    <Radio value="M">Mujer</Radio>
                                                </HStack>
                                            </RadioGroup>
                                            {errors.sexo && <Text color="red.500">{errors.sexo}</Text>}
                                        </FormControl>

                                        <Checkbox
                                            isChecked={isTermsChecked}
                                            onChange={(e) => setIsTermsChecked(e.target.checked)}
                                        >
                                            <Flex align="center">
                                                <Text fontSize="12px">He leído y acepto los{" "}</Text>
                                                <Link
                                                    color="blue.500"
                                                    onClick={() => navigate("/terminos-y-condiciones")}
                                                    textDecoration="underline"
                                                    fontSize="12px"
                                                    ml="1"
                                                >
                                                    términos y condiciones
                                                </Link>
                                            </Flex>
                                        </Checkbox>

                                        <Button
                                            colorScheme="teal"
                                            variant="solid"
                                            width="100%"
                                            type="submit"
                                            isDisabled={!isTermsChecked}
                                        >
                                            Registrarse
                                        </Button>

                                    </Stack>

                                </Box>
                                <Box flex="2" pl="20px" >
                                    <Image src={registroimg} alt="Registro" boxSize="100%" borderRadius={"30px"} />
                                </Box>
                            </Flex>
                        </Flex>
                    </form>
                </>
            )}
        </Box>
    );
};

export default RegistroForm;
