import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Bazar = () => {
  const { currentUser } = useSelector((state) => state);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser?.id) {
      navigate("/");
      return;
    }

    // Redireccionar al bazar con el parámetro jugadorID
    const bazarUrl = `https://baazaar.s3.us-east-2.amazonaws.com/bazar/index.html?jugadorID=${currentUser.id}`;
    window.location.href = bazarUrl;
  }, [currentUser, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <p className="text-on-surface font-body-lg">Redireccionando al Bazar...</p>
      </div>
    </div>
  );
};

export default Bazar;
