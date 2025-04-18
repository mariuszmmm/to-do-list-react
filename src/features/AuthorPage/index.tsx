import { useEffect } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Header } from "../../common/Header";
import { Section } from "../../common/Section";
import { Text } from "../../common/Text";

const AuthorPage = () => {
  const { t } = useTranslation("translation", {
    keyPrefix: "authorPage",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Header title={t("title")} />
      <Section
        title="Mariusz Matusiewicz"
        body={
          <>
            <Text>
              <Trans i18nKey="authorPage.description.part1" />
            </Text>
            <Text>
              <Trans i18nKey="authorPage.description.part2" />
            </Text>
          </>
        }
      />
    </>
  );
};

export default AuthorPage;
