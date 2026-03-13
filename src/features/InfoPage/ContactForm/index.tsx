import { useState } from "react";
import emailjs from "@emailjs/browser";
import { FormButton } from "../../../common/FormButton";
import { Input } from "../../../common/Input";
import { useAppDispatch } from "../../../hooks";
import { openModal } from "../../../Modal/modalSlice";
import { useTranslation } from "react-i18next";
import { Form, FieldWrapper, Label } from "./styled";
import { TextArea } from "../../../common/TextArea";

const APP_NAME = "To-Do List App";
const APP_URL = "to-do-list.myprojects.pl";
const APP_AUTHOR_URL = "myprojects.pl";

const PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;
const SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;

export const ContactForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const { t } = useTranslation("translation", { keyPrefix: "modal" });
  const dispatch = useAppDispatch();

  const sendEmail = (event: React.SyntheticEvent) => {
    event.preventDefault();

    // Honeypot – jeśli bot wypełnił ukryte pole, cicho odrzucamy
    if (honeypot) return;

    if (!PUBLIC_KEY || !SERVICE_ID || !TEMPLATE_ID) {
      throw new Error("EmailJS configuration is missing");
    }

    const templateParams = {
      from_name: name,
      from_email: email,
      reply_to: email,
      message: message,
      app_name: APP_NAME,
      app_url: APP_URL,
      app_author_url: APP_AUTHOR_URL,
      auto_lang: t("sendMessage.autoReply.lang"),
      auto_subject: APP_NAME,
      auto_greeting: t("sendMessage.autoReply.greeting"),
      auto_intro: t("sendMessage.autoReply.intro"),
      auto_message_label: t("sendMessage.autoReply.messageLabel"),
      auto_regards: t("sendMessage.autoReply.regards"),
      auto_footer: t("sendMessage.autoReply.footer"),
    };

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
              title: { key: "modal.sendMessage.title" },
              type: "success",
              message: t("sendMessage.message.success"),
            }),
          );
          setName("");
          setEmail("");
          setMessage("");
        } else {
          throw new Error("Email sending failed");
        }
      })
      .catch((error) => {
        dispatch(
          openModal({
            title: { key: "modal.sendMessage.title" },
            type: "error",
            message: t("sendMessage.message.error.default"),
          }),
        );
        console.error("Email sending error:", error);
      });
  };

  return (
    <Form onSubmit={sendEmail}>
      <FieldWrapper>
        <Label>{t("sendMessage.labels.name")}</Label>
        <Input
          type="text"
          name="name"
          value={name}
          placeholder={t("sendMessage.placeholders.name")}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </FieldWrapper>
      <FieldWrapper>
        <Label>{t("sendMessage.labels.email")}</Label>
        <Input
          type="email"
          name="email"
          value={email}
          placeholder={t("sendMessage.placeholders.email")}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </FieldWrapper>
      <FieldWrapper>
        <Label>{t("sendMessage.labels.message")}</Label>
        <TextArea
          name="message"
          value={message}
          placeholder={t("sendMessage.placeholders.message")}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
      </FieldWrapper>
      <FormButton>{t("sendMessage.button")}</FormButton>
      {/* Honeypot – pułapka na boty, niewidoczna dla użytkowników */}
      <input
        type="text"
        name="website"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        style={{ display: "none" }}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
    </Form>
  );
};
