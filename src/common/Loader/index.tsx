import { ThreeDots } from "react-loader-spinner";
import { Wrapper } from "./styled";
import { useTheme } from "styled-components";

export const Loader = ({ loading = true, isDarkTheme }: { loading?: boolean, isDarkTheme?: boolean }) => {
  const theme = useTheme();

  return (
    <Wrapper>
      <ThreeDots
        visible={loading}
        width="1rem"
        height="1rem"
        color={theme.colors.nav.text}
      />
    </Wrapper>
  );
};
