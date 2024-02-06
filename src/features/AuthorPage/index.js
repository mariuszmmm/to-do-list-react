import Header from "../../common/Header";
import Section from "../../common/Section";

const AuthorPage = () => {

  return (
    <>
      <Header title="O autorze" />
      <Section
        title="Mariusz Matusiewicz"
        body={
          <>
            <p>Z wykształcenia jestem elektronikiem. Zajmuję się amatorsko wideofilmowaniem<br />i montażem wideo. Interesuję się także systemem automatyki domowej <i>Fibaro</i>.</p><br />
            <p>Oprócz tego, <strong>uwielbiam wędrówki po górach</strong>, a moim ulubionym miejscem są <i>Bieszczady</i>.</p><br />
            <p>Obecnie uczę się <strong>programowania frontend</strong> w ramach kursu <strong>'YouCode'</strong>.<br />Chciałbym wykorzystać zdobyte umiejętności do udziału w fascynujących projektach,<br />gdzie mógłbym wprowadzić innowacyjne rozwiązania i tworzyć wyjątkowe aplikacje. 😊🚀🌟</p>
          </>}
      />
    </>
  );
};

export default AuthorPage;