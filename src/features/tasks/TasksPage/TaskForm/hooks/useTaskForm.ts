import { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/redux";
import {
  addTask,
  saveEditedTask,
  setTaskToEdit,
  selectEditedTask,
  selectTasks,
  selectTaskListMetaData,
} from "../../../tasksSlice";
import { useSpeechToText } from "../../../../../hooks";
import { clearInputAutoFocusFlag } from "../../../../../utils/setFirstLoadFlagIfRoot";
import { useAutoFocusFlag } from "./useAutoFocusFlag";

/**
 * Hook for managing task form logic: add/edit tasks, speech-to-text, autofocus, and keyboard shortcuts.
 * Handles form state, input focus, and integration with Redux actions.
 */
export const useTaskForm = () => {
  const dispatch = useAppDispatch();

  const tasks = useAppSelector(selectTasks);
  const taskListMetaData = useAppSelector(selectTaskListMetaData);
  const editedTask = useAppSelector(selectEditedTask);
  const shouldAutoFocus = useAutoFocusFlag("inputAutoFocusFirstLoad");

  const [value, setValue] = useState("");
  const previousValueRef = useRef("");

  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const speech = useSpeechToText({
    prevText: editedTask?.content ? `${editedTask.content} ` : `${value} `,
  });

  // Autofocus input or textarea depending on edit mode
  useEffect(() => {
    if (editedTask) {
      setValue(editedTask.content);
      previousValueRef.current = editedTask.content;
      textAreaRef.current?.focus();
    } else {
      if (!shouldAutoFocus) return;
      inputRef.current?.focus();
    }
  }, [editedTask, shouldAutoFocus]);

  // Handle input value change, capitalize first letter for new tasks
  const handleChange = useCallback(
    (v: string) => {
      if (!editedTask) {
        setValue(v.length === 1 ? v.toUpperCase() : v);
      } else {
        setValue(v);
      }
    },
    [editedTask]
  );

  // Toggle speech recognition and focus the correct input
  const toggleSpeechRecognition = useCallback(() => {
    if (speech.isListening) {
      speech.stop();
    } else {
      const activeInput = editedTask ? textAreaRef.current : inputRef.current;
      activeInput?.focus();
      speech.start();
    }
  }, [speech, inputRef, textAreaRef, editedTask]);

  // Submit form: add or edit a task, clear value after
  const submit = useCallback(() => {
    const content = value;
    if (content) {
      if (!editedTask) {
        dispatch(
          addTask({ content, stateForUndo: { tasks, taskListMetaData } })
        );
      } else if (content !== previousValueRef.current) {
        dispatch(
          saveEditedTask({
            id: editedTask.id,
            content,
            stateForUndo: { tasks, taskListMetaData },
          })
        );
      } else dispatch(setTaskToEdit(null));
    }

    setValue("");
  }, [value, editedTask, dispatch, tasks, taskListMetaData]);

  // Handle form submit event, stop speech if active
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

    [submit, speech, editedTask]
  );

  // Allow Ctrl+Enter to submit the form
  const onCtrlEnter = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  }, []);

  // Update input value when speech recognition result changes
  useEffect(() => {
    if (speech.text) {
      setValue(speech.text);
      inputRef.current?.focus();
      const activeInput = editedTask ? textAreaRef.current : inputRef.current;
      if (activeInput) {
        requestAnimationFrame(() => {
          activeInput.focus();
          activeInput.scrollLeft = activeInput.scrollWidth;
          activeInput.scrollTop = activeInput.scrollHeight;
        });
      }
    }
  }, [speech.text, editedTask]);

  // Stop speech recognition if edited task changes
  useEffect(() => {
    if (speech.isListening) {
      speech.stop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editedTask]);

  // Cancel editing: clear value and reset edit mode
  const handleCancel = useCallback(() => {
    if (value && editedTask) {
      setValue("");
      dispatch(setTaskToEdit(null));
    }
  }, [value, editedTask, dispatch]);

  // Clear autofocus flag on first load
  useEffect(() => {
    clearInputAutoFocusFlag();
  }, []);

  return {
    value,
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
