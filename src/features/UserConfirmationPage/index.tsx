import { useEffect, useState } from "react";
import { auth } from "../../utils/auth";
import { Modal } from "../../common/Modal";
import { getConfimationTokenFromSessionStorage } from "../../utils/sessionStorage";

type Status = "waiting" | "confirmed" | "warning";

const UserConfirmationPage = () => {
  const [status, setStatus] = useState<Status>("waiting");

  useEffect(() => {
    const confirmation = async () => {
      try {
        const token = getConfimationTokenFromSessionStorage();
        if (!token) throw new Error("No token");
        await auth.confirm(token);
        setStatus("confirmed");
      } catch (error) {
        setStatus("warning");
      }
    };

    confirmation();
  }, []);

  return (
    <Modal
      title="Potwierdzenie rejestracji"
      description={
        status === "waiting"
          ? "Sprawdzam stan rejestracji..."
          : status === "confirmed"
          ? "Rejestracja udana, zamknij stronę"
          : "Link wygasł lub został użyty"
      }
      status={
        status === "waiting"
          ? "loading"
          : status === "confirmed"
          ? "check"
          : "warning"
      }
    />
  );
};

export default UserConfirmationPage;
