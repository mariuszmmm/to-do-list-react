import { FormButton } from "../../../../../common/FormButton";
import { FormButtonWrapper } from "../../../../../common/FormButtonWrapper";

interface Props {
  edited: boolean;
  disabled: boolean;
  onCancel: () => void;
  submitLabel: string;
  cancelLabel: string;
}

export const TaskFormButtons = ({
  edited,
  disabled,
  onCancel,
  submitLabel,
  cancelLabel,
}: Props) => (
  <FormButtonWrapper>
    <FormButton type="submit" disabled={disabled} $singleInput>
      {submitLabel}
    </FormButton>

    {edited && (
      <FormButton type="button" disabled={disabled} $singleInput $cancel onClick={onCancel}>
        {cancelLabel}
      </FormButton>
    )}
  </FormButtonWrapper>
);
