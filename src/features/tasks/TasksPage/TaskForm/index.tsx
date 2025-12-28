import { useState, useRef, useEffect, FormEventHandler } from "react";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { Input } from "../../../../common/Input";
import { Form } from "../../../../common/Form";
import { FormButton } from "../../../../common/FormButton";
import {
  addTask,
  setTaskToEdit,
  saveEditedTask,
  selectEditedTask,
  selectTasks,
  selectTaskListMetaData,
  selectIsTasksSorting,
} from "../../tasksSlice";
import { useTranslation } from "react-i18next";
import { InputWrapper } from "../../../../common/InputWrapper";
import { MicrophoneIcon } from "../../../../common/icons";
import { InputButton } from "../../../../common/InputButton";
import { useSpeechToText } from "../../../../hooks";
import { FormButtonWrapper } from "../../../../common/FormButtonWrapper";
import { TextArea } from "../../../../common/TextArea";
import { clearInputAutoFocusFlag } from "../../../../utils/setFirstLoadFlagIfRoot";

export const TaskForm = () => {
  const tasks = useAppSelector(selectTasks);
  const taskListMetaData = useAppSelector(selectTaskListMetaData);
  const editedTask = useAppSelector(selectEditedTask);
  const [taskContent, setTaskContent] = useState("");
  const [previousContent, setPreviousContent] = useState("");
  const firstLoad = useRef(sessionStorage.getItem('inputAutoFocusFirstLoad'));
  const isTasksSorting = useAppSelector(selectIsTasksSorting);
  const inputRef = useRef<HTMLInputElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
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

  const addTaskContent = () => {
    const content = taskContent.trim();
    if (content) {
      !editedTask
        ? dispatch(
          addTask({
            content,
            stateForUndo: { tasks, taskListMetaData },
          }),
        )
        : content !== previousContent
          ? dispatch(
            saveEditedTask({
              id: editedTask.id, content, stateForUndo: { tasks, taskListMetaData },
            }),
          )
          : dispatch(setTaskToEdit(null));
    }
    setTaskContent("");
  };

  const onFormSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (!isListening) {
      setTimeout(() => inputRef.current!.focus(), 0);
    } else {
      stop();
      inputRef.current?.blur();
    }
    addTaskContent();
  };

  useEffect(() => {
    if (!editedTask) return;
    if (isListening) stop();
    setTaskContent(editedTask.content);
    setPreviousContent(editedTask.content);
    setTimeout(() => {
      const textArea = textAreaRef.current;
      if (textArea) {
        textArea.focus();
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

  useEffect(() => {
    clearInputAutoFocusFlag();
  }, [])

  return (
    <Form onSubmit={onFormSubmit} $singleInput>
      <InputWrapper disabled={isTasksSorting}>
        {editedTask ? (
          <TextArea
            value={taskContent}
            name="taskName"
            placeholder={t("form.inputPlaceholder")}
            onChange={({ target }) => setTaskContent(target.value)}
            ref={textAreaRef}
          />
        ) : (
          <Input
            value={taskContent}
            name="taskName"
            placeholder={t("form.inputPlaceholder")}
            onChange={({ target }) => {
              const value = target.value;
              if (value.length === 1) {
                setTaskContent(value.toUpperCase());
              } else {
                setTaskContent(value);
              }
            }}
            autoFocus={firstLoad.current === 'true'}
            ref={inputRef}
          />
        )}
        {
          // !editedTask && 
          (
            <InputButton
              type="button"
              onClick={() => {
                if (!isListening) {
                  inputRef.current && inputRef.current.focus()
                  textAreaRef.current && textAreaRef.current.focus();
                  start();
                } else {
                  stop();
                }
              }}
              disabled={!supportSpeech}
              $editedTask={!!editedTask}
            >
              <MicrophoneIcon $isActive={isListening} />
            </InputButton>
          )}
      </InputWrapper>
      <FormButtonWrapper>
        <FormButton type="submit" $singleInput disabled={isActive || isTasksSorting}>
          {!!editedTask
            ? t("form.inputButton.saveChanges")
            : t("form.inputButton.addTask")}
        </FormButton>
        {!!editedTask && (
          <FormButton
            type="button"
            $singleInput
            disabled={isActive || isTasksSorting}
            $cancel
            onClick={() => {
              dispatch(setTaskToEdit(null));
              setTaskContent("");
            }}
          >
            {t("form.inputButton.cancel")}
          </FormButton>
        )}
      </FormButtonWrapper>
    </Form>
  );
};
