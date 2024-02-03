import Container from "../../common/Container";
import Header from "../../common/Header";
import Section from "../../common/Section";

const AboutAutor = () => {

  return (
    <Container>
      <Header title="O autorze" />
      <Section
        title="Mariusz Matusiewicz"
        body={
          <>
            <p>Z wykształcenia jestem elektronikiem. Zajmuję się amatorsko wideofilmowaniem i montażem wideo. Interesuję się także systemem automatyki domowej <i>Fibaro</i>.</p>
            <p>Oprócz tego, <strong>uwielbiam wędrówki po górach,</strong>, a moim ulubionym miejscem są <i>Bieszczady</i>.</p>
            <p>Obecnie uczę się <strong>programowania frontend</strong> w ramach kursu <strong>'YouCode'</strong>. Chciałbym wykorzystać zdobyte umiejętności do udziału w fascynujących projektach, gdzie mógłbym wprowadzić innowacyjne rozwiązania i tworzyć wyjątkowe aplikacje.</p>
          </>}
      />
    </Container>
  );
};

export default AboutAutor;