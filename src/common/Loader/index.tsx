import { ThreeDots } from "react-loader-spinner";
import { theme } from "../../theme/theme";
import { Wrapper } from "./styled";

export const Loader = ({ loading = true }: { loading?: boolean }) => {
  return (
    <Wrapper>
      <ThreeDots
        visible={loading}
        width="1rem"
        height="1rem"
        color={theme.color.white}
      />
    </Wrapper>
  );
};
