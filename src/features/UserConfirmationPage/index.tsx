import { useEffect, useState } from "react";
import { auth } from "../../api/auth";
import { getConfimationTokenFromSessionStorage } from "../../utils/sessionStorage";
import { useAppDispatch } from "../../hooks";
import { openModal } from "../../Modal/modalSlice";
import { Text } from "../../common/Text";
import { Container } from "../../common/Container";
import { setAccountMode } from "../AccountPage/accountSlice";

type Status = "waiting" | "success" | "error";

const UserConfirmationPage = () => {
  const [status, setStatus] = useState<Status>("waiting");
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setAccountMode("userConfirmation"));
    const confirmation = async () => {
      try {
        dispatch(
          openModal({
            title: "Potwierdzenie rejestracji",
            message: "Sprawdzam stan rejestracji...",
            type: "loading",
          })
        );
        const token = getConfimationTokenFromSessionStorage();
        if (!token) throw new Error("No token");
        await auth.confirm(token);
        dispatch(
          openModal({
            message: "Rejestracja udana, zamknij stronę.",
            type: "success",
          })
        );
        setStatus("success");
      } catch (error) {
        dispatch(
          openModal({
            message: "Link wygasł lub został użyty.",
            type: "error",
          })
        );
        setStatus("error");
      }
    };

    confirmation();
  }, [dispatch]);

  return (
    <>
      {status !== "waiting" ? (
        <Container>
          <Text>
            <b>
              Rejestracja {status === "error" && "nie"}udana,
              <br />
              zamknij stronę.
            </b>
          </Text>
        </Container>
      ) : null}
    </>
  );
};

export default UserConfirmationPage;
