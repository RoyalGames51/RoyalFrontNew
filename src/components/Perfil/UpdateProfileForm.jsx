import React, { useState, useEffect } from "react";
import { VStack, Input, Button } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "../../redux/actions";

const UpdateProfileForm = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.currentUser);

  const [formData, setFormData] = useState({
    nick: "",
    age: "",
    description: "",
    country: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        nick: user.nick || "",
        age: user.age || "",
        description: user.description || "",
        country: user.country || "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUpdate = () => {
    if (!user || !user.id) {
      console.error("El ID del usuario es inválido.");
      return;
    }
    dispatch(updateUserProfile(user.id, formData));
  };

  return (
    <VStack spacing="4" align="start">
      <Input
        placeholder="Nick"
        name="nick"
        value={formData.nick}
        onChange={handleInputChange}
      />
      <Input
        placeholder="Descripción"
        name="description"
        value={formData.description}
        onChange={handleInputChange}
      />
      <Input
        placeholder="Edad"
        name="age"
        value={formData.age}
        onChange={handleInputChange}
      />
      <Input
        placeholder="País"
        name="country"
        value={formData.country}
        onChange={handleInputChange}
      />
      <Button colorScheme="blue" onClick={handleUpdate}>
        Actualizar Perfil
      </Button>
    </VStack>
  );
};

export default UpdateProfileForm;
