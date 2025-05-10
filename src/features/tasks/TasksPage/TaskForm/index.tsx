import { useState, useRef, useEffect, FormEventHandler } from "react";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { nanoid } from "@reduxjs/toolkit";
import { Input } from "../../../../common/Input";
import { Form } from "../../../../common/Form";
import { FormButton } from "../../../../common/FormButton";
import {
  addTask,
  setTaskToEdit,
  saveEditedTask,
  selectEditedTask,
  selectTasks,
  selectListName,
} from "../../tasksSlice";
import { useTranslation } from "react-i18next";
import { InputWrapper } from "../../../../common/InputWrapper";
import { MicrophoneIcon } from "../../../../common/icons";
import { InputButton } from "../../../../common/InputButton";
import { useSpeechToText } from "../../../../hooks";
import { FormButtonWrapper } from "../../../../common/FormButtonWrapper";

export const TaskForm = () => {
  const tasks = useAppSelector(selectTasks);
  const listName = useAppSelector(selectListName);
  const editedTask = useAppSelector(selectEditedTask);
  const [taskContent, setTaskContent] = useState("");
  const [previousContent, setPreviousContent] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const { t } = useTranslation("translation", {
    keyPrefix: "tasksPage",
  });

  const {
    text,
    isListening,
    isActive,
    isInterimSupported,
    supportSpeech,
    start,
    stop,
  } = useSpeechToText({
    prevText: !!editedTask?.content
      ? `${editedTask.content} `
      : `${taskContent} `,
  });

  const formatedDate = new Date().toISOString();

  const addTaskContent = () => {
    const content = taskContent.trim();
    if (content) {
      editedTask === null
        ? dispatch(
            addTask({
              task: {
                id: nanoid(),
                content,
                done: false,
                date: formatedDate,
              },
              stateForUndo: { tasks, listName },
            })
          )
        : content !== previousContent
        ? dispatch(
            saveEditedTask({
              task: {
                id: editedTask.id,
                content,
                done: editedTask.done,
                date: editedTask.date,
                editedDate: formatedDate,
              },
              stateForUndo: { tasks, listName },
            })
          )
        : dispatch(setTaskToEdit(null));
    }
    setTaskContent("");
  };

  const onFormSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (isListening) stop();
    addTaskContent();
  };

  useEffect(() => {
    if (!editedTask) return;
    if (isListening) stop();
    console.log("TEST");
    setTaskContent(editedTask.content);
    setPreviousContent(editedTask.content);
    setTimeout(() => {
      const input = inputRef.current;
      if (input) {
        input.focus();
        input.scrollLeft = input.scrollWidth;
      }
    }, 0);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editedTask]);

  useEffect(() => {
    if (!!editedTask || isListening || !isInterimSupported) return;
    addTaskContent();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening, isInterimSupported]);

  useEffect(() => {
    if (!text) return;
    setTaskContent(text);
    setTimeout(() => {
      const input = inputRef.current;
      if (input) {
        input.focus();
        input.scrollLeft = input.scrollWidth;
      }
    }, 1);
  }, [text]);

  return (
    <Form onSubmit={onFormSubmit} $singleInput>
      <InputWrapper>
        <Input
          value={taskContent}
          name="taskName"
          placeholder={t("form.inputPlaceholder")}
          onChange={({ target }) => setTaskContent(target.value)}
          ref={inputRef}
        />
        <InputButton
          type="button"
          onClick={() => {
            if (!isListening && inputRef.current) {
              inputRef.current.focus();
              start();
            } else {
              stop();
            }
          }}
          disabled={!supportSpeech}
        >
          <MicrophoneIcon $isActive={isListening} />
        </InputButton>
      </InputWrapper>
      <FormButtonWrapper>
        {editedTask !== null && (
          <FormButton
            type="button"
            $singleInput
            disabled={isActive}
            $cancel
            onClick={() => {
              dispatch(setTaskToEdit(null));
              setTaskContent("");
            }}
          >
            {t("form.inputButton.cancel")}
          </FormButton>
        )}
        <FormButton type="submit" $singleInput disabled={isActive}>
          {editedTask !== null
            ? t("form.inputButton.saveChanges")
            : t("form.inputButton.addTask")}
        </FormButton>
      </FormButtonWrapper>
    </Form>
  );
};
