import { useEffect } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Header } from "../../common/Header";
import { Section } from "../../common/Section";
import { Text } from "../../common/Text";
import { List, ListItem } from "./styled";
import { StyledLink } from "../../common/StyledLink";
import { ContactForm } from "./ContactForm";

const InfoPage = () => {
  const { t } = useTranslation("translation", {
    keyPrefix: "infoPage",
  });
  const translate = t as any;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Header title={t("howToStart.title")} />
      <Section
        body={
          <>
            <Header sub title={`🚀 ${t("howToStart.subTitle")}`} />
            <List>
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <ListItem key={num}>
                  <strong>
                    {translate(`howToStart.steps.step${num}.title`)}
                  </strong>
                  :
                  <br />
                  {translate(`howToStart.steps.step${num}.description`)}
                </ListItem>
              ))}
            </List>
          </>
        }
      />
      <br />
      <Header title={t("aboutApp.title")} />
      <Section
        body={
          <>
            <Header
              sub
              title={`⚙️ ${t("aboutApp.topics.features.subTitle")} `}
            />
            <List>
              <ListItem>
                <Trans i18nKey="infoPage.aboutApp.topics.features.description.part1" />
              </ListItem>
              <ListItem>
                <Trans i18nKey="infoPage.aboutApp.topics.features.description.part2" />
              </ListItem>
              <ListItem>
                <Trans i18nKey="infoPage.aboutApp.topics.features.description.part3" />
              </ListItem>
              <ListItem>
                <Trans i18nKey="infoPage.aboutApp.topics.features.description.part4" />
              </ListItem>
              <ListItem>
                <Trans i18nKey="infoPage.aboutApp.topics.features.description.part5" />
              </ListItem>
              <ListItem>
                <Trans i18nKey="infoPage.aboutApp.topics.features.description.part6" />
              </ListItem>
              <ListItem>
                <Trans i18nKey="infoPage.aboutApp.topics.features.description.part7" />
              </ListItem>
              <ListItem>
                <Trans i18nKey="infoPage.aboutApp.topics.features.description.part8" />
              </ListItem>
              <ListItem>
                <Trans i18nKey="infoPage.aboutApp.topics.features.description.part9" />
              </ListItem>
              <ListItem>
                <Trans i18nKey="infoPage.aboutApp.topics.features.description.part10" />
              </ListItem>
            </List>
            <br />
            <Header
              sub
              title={`🛠️ ${t("aboutApp.topics.technologies.subTitle")}`}
            />
            <List>
              <ListItem>- TypeScript, JavaScript (ES6+)</ListItem>
              <ListItem>- React, React Router</ListItem>
              <ListItem>- Redux, Redux Toolkit, Redux Saga</ListItem>
              <ListItem>- TanStack Query (react-query)</ListItem>
              <ListItem>- react-i18next, Cloud Translation API</ListItem>
              <ListItem>- Netlify, Netlify GoTrue.js</ListItem>
              <ListItem>- MongoDB, Cloudinary, Ably</ListItem>
              <ListItem>- EmailJS, @dnd-kit</ListItem>
              <ListItem>- Styled Components, CSS Grid, Flexbox</ListItem>
            </List>
            <br />
            <Header sub title={`🌐 ${t("aboutApp.topics.links.subTitle")}`} />
            <List>
              <ListItem>
                🚀{" "}
                <Trans i18nKey="infoPage.aboutApp.topics.links.description.newApp" />
                <br />
                <StyledLink
                  to="https://to-do-list.myprojects.pl"
                  target="_blank"
                >
                  {" "}
                  https://to-do-list.myprojects.pl
                </StyledLink>
              </ListItem>
              <ListItem>
                ⏳{" "}
                <Trans i18nKey="infoPage.aboutApp.topics.links.description.oldApp" />
                <br />
                <StyledLink
                  to="https://mariuszmmm.github.io/to-do-list-react"
                  target="_blank"
                >
                  {" "}
                  https://mariuszmmm.github.io/to-do-list-react
                </StyledLink>
              </ListItem>
            </List>
          </>
        }
      />
      <br />
      <Header title={t("aboutAuthor.title")} />
      <Section
        title={t("aboutAuthor.name")}
        body={
          <>
            <Text>
              <Trans i18nKey="infoPage.aboutAuthor.description.part1" />
            </Text>
            <Text>
              <Trans i18nKey="infoPage.aboutAuthor.description.part2" />
            </Text>
            <br />
            <Header sub title={`🔗 ${t("aboutAuthor.links.subTitle")}`} />
            <List>
              <ListItem>
                🏡{" "}
                <Trans i18nKey="infoPage.aboutAuthor.links.description.personalHomepage" />
                <br />
                <StyledLink to="https://myprojects.pl/" target="_blank">
                  {" "}
                  https://myprojects.pl
                </StyledLink>
              </ListItem>
              <ListItem>
                🐙{" "}
                <Trans i18nKey="infoPage.aboutAuthor.links.description.github" />
                <br />
                <StyledLink to="https://github.com/mariuszmmm" target="_blank">
                  {" "}
                  https://github.com/mariuszmmm
                </StyledLink>
              </ListItem>
            </List>
          </>
        }
      />
      <br />
      <Header title={t("contactForm.title")} />
      <Section title={t("contactForm.subTitle")} body={<ContactForm />} />
    </>
  );
};

export default InfoPage;
