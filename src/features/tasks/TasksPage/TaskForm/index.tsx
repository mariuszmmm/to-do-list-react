import { useAppSelector } from "../../../../hooks/redux";
import { Form } from "../../../../common/Form";
import { selectIsTasksSorting, } from "../../tasksSlice";
import { useTranslation } from "react-i18next";
import { InputWrapper } from "../../../../common/InputWrapper";
import { MicrophoneIcon } from "../../../../common/icons";
import { InputButton } from "../../../../common/InputButton";
import { useTaskForm } from "./hooks/useTaskForm";
import { TaskFormButtons } from "./TaskFormButtons";
import { TaskInput } from "./TaskInput";

export const TaskForm = () => {
  const { t } = useTranslation("translation", { keyPrefix: "tasksPage" });
  const isTasksSorting = useAppSelector(selectIsTasksSorting);

  const {
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
  } = useTaskForm();

  return (
    <Form ref={formRef} onSubmit={onSubmit} $singleInput>
      <InputWrapper disabled={isTasksSorting}>
        <TaskInput
          value={value}
          name="taskName"
          edited={!!editedTask}
          inputRef={inputRef}
          textAreaRef={textAreaRef}
          onChange={handleChange}
          onKeyDown={onCtrlEnter}
          placeholder={t("form.inputPlaceholder")}
        />

        <InputButton
          type="button"
          disabled={!speech.supportSpeech}
          onClick={toggleSpeechRecognition}
          $editedTask={!!editedTask}
        >
          <MicrophoneIcon $isActive={speech.isListening} />
        </InputButton>
      </InputWrapper>

      <TaskFormButtons
        edited={!!editedTask}
        disabled={speech.isActive || isTasksSorting}
        submitLabel={
          editedTask
            ? t("form.inputButton.saveChanges")
            : t("form.inputButton.addTask")
        }
        cancelLabel={t("form.inputButton.cancel")}
        onCancel={handleCancel}
      />
    </Form>
  );
};