import { Input } from "../../../../../common/Input";
import { TextArea } from "../../../../../common/TextArea";

interface Props {
  inputValue: string;
  textAreaValue: string;
  name: string;
  edited: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  textAreaRef: React.RefObject<HTMLTextAreaElement | null>;
  onChange: (v: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  placeholder: string;
}

export const TaskInput = ({
  inputValue,
  textAreaValue,
  name,
  edited,
  inputRef,
  textAreaRef,
  onChange,
  onKeyDown,
  placeholder,
}: Props) => {
  if (edited) {
    return (
      <TextArea
        ref={textAreaRef}
        value={textAreaValue}
        name={name}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
      />
    );
  }

  return (
    <Input
      ref={inputRef}
      value={inputValue}
      name={name}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
    />
  );
};
