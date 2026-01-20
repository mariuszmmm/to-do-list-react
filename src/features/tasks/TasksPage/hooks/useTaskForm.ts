import { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import {
  addTask,
  saveEditedTask,
  setTaskToEdit,
  selectEditedTask,
  selectTasks,
  selectTaskListMetaData,
} from "../../tasksSlice";

import { clearInputAutoFocusFlag } from "../../../../utils/setFirstLoadFlagIfRoot";
import { useAutoFocusFlag } from "./useAutoFocusFlag";
import { useSpeechToText } from "../../../../hooks";

export const useTaskForm = () => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectTasks);
  const taskListMetaData = useAppSelector(selectTaskListMetaData);
  const editedTask = useAppSelector(selectEditedTask);
  const shouldAutoFocus = useAutoFocusFlag("inputAutoFocusFirstLoad");
  const [inputValue, setInputValue] = useState("");
  const [textAreaValue, setTextAreaValue] = useState("");
  const previousValueRef = useRef("");
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const speech = useSpeechToText({
    prevText: editedTask?.content ? `${editedTask.content} ` : `${inputValue} `,
  });

  const toggleSpeechRecognition = useCallback(() => {
    if (speech.isListening) {
      speech.stop();
    } else {
      speech.start(`${editedTask ? textAreaRef.current?.value : inputValue} `);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speech.isListening, editedTask]);

  const handleChange = useCallback(
    (v: string) => {
      if (!editedTask) {
        setInputValue(v.length === 1 ? v.toUpperCase() : v);
      } else {
        setTextAreaValue(v);
      }
    },
    [editedTask],
  );

  const submit = useCallback(() => {
    const content = (editedTask ? textAreaValue : inputValue).trim();
    if (content) {
      if (!editedTask) {
        dispatch(
          addTask({ content, stateForUndo: { tasks, taskListMetaData } }),
        );
      } else if (content !== previousValueRef.current) {
        dispatch(
          saveEditedTask({
            id: editedTask.id,
            content,
            stateForUndo: { tasks, taskListMetaData },
          }),
        );
      } else dispatch(setTaskToEdit(null));
    }

    setInputValue("");
    setTextAreaValue("");
    speech.clear();
  }, [
    inputValue,
    textAreaValue,
    editedTask,
    dispatch,
    tasks,
    taskListMetaData,
    speech,
  ]);

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (speech.isListening) {
        speech.stop();
        inputRef.current?.blur();
      }
      submit();
      const activeInput = editedTask ? textAreaRef.current : inputRef.current;
      activeInput?.focus();
    },

    [submit, speech, editedTask],
  );

  const onCtrlEnter = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  }, []);

  const handleCancel = useCallback(() => {
    inputValue && setInputValue("");
    textAreaValue && setTextAreaValue("");
    editedTask && dispatch(setTaskToEdit(null));
    speech.clear();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue, textAreaValue, editedTask, dispatch]);

  useEffect(() => {
    if (!shouldAutoFocus) return;
    inputRef.current?.focus();
    clearInputAutoFocusFlag();
  }, [shouldAutoFocus]);

  useEffect(() => {
    if (!editedTask && speech.text) {
      setInputValue(speech.text);
      inputRef.current?.focus();
      if (inputRef.current) {
        requestAnimationFrame(() => {
          inputRef.current?.focus();
          inputRef.current!.scrollLeft = inputRef.current!.scrollWidth;
          inputRef.current!.scrollTop = inputRef.current!.scrollHeight;
        });
      }
    }

    if (editedTask && speech.text) {
      setTextAreaValue(speech.text);
      textAreaRef.current?.focus();
      if (textAreaRef.current) {
        requestAnimationFrame(() => {
          textAreaRef.current?.focus();
          textAreaRef.current!.scrollLeft = textAreaRef.current!.scrollWidth;
          textAreaRef.current!.scrollTop = textAreaRef.current!.scrollHeight;
        });
      }
    }
  }, [speech.text, editedTask]);

  useEffect(() => {
    if (speech.isListening) {
      speech.stop();
      speech.clear();
    }
    setTextAreaValue(editedTask?.content || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editedTask]);

  return {
    inputValue,
    textAreaValue,
    editedTask,
    formRef,
    inputRef,
    textAreaRef,
    handleChange,
    toggleSpeechRecognition,
    onSubmit,
    onCtrlEnter,
    handleCancel,
    speech,
  };
};
