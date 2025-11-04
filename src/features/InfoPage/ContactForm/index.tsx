import { useState } from "react";
import emailjs from "@emailjs/browser";
import { FormButton } from "../../../common/FormButton";
import { Input } from "../../../common/Input";
import { useAppDispatch } from "../../../hooks";
import { openModal } from "../../../Modal/modalSlice";
import { useTranslation } from "react-i18next";
import { Form } from "./styled";
import { TextArea } from "../../../common/TextArea";

const PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;
const SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;

export const ContactForm = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { t } = useTranslation("translation", { keyPrefix: "modal" });
  const dispatch = useAppDispatch();

  const sendEmail = (event: React.FormEvent) => {
    event.preventDefault();

    const templateParams = {
      from_email: email,
      owner: "To-do list app creator",
      message: message,
    };
    if (!PUBLIC_KEY || !SERVICE_ID || !TEMPLATE_ID) {
      throw new Error("EmailJS configuration is missing");
    }

    dispatch(
      openModal({
        title: { key: "modal.sendMessage.title" },
        type: "loading",
        message: t("sendMessage.message.loading"),
      }),
    );

    emailjs
      .send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
      .then((response) => {
        if (response.status === 200) {
          dispatch(
            openModal({
              type: "success",
              message: t("sendMessage.message.success"),
            }),
          );
          setEmail("");
          setMessage("");
        } else {
          throw new Error("Email sending failed");
        }
      })
      .catch((error) => {
        dispatch(
          openModal({
            type: "error",
            message: t("sendMessage.message.error.default"),
          }),
        );
        console.error("Email sending error:", error);
      });
  };

  return (
    <Form onSubmit={sendEmail}>
      <div>
        <label>{t("sendMessage.labels.email")}</label>
        <Input
          type="email"
          name="email"
          value={email}
          placeholder={t("sendMessage.placeholders.email")}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label>{t("sendMessage.labels.message")}</label>
        <TextArea
          name="message"
          value={message}
          placeholder={t("sendMessage.placeholders.message")}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
      </div>
      <FormButton>{t("sendMessage.button")}</FormButton>
    </Form>
  );
};
