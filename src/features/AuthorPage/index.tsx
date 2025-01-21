import Header from "../../common/Header";
import Section from "../../common/Section";
import Text from "../../common/Text";

const AuthorPage = () => (
  <>
    <Header title="O autorze" />
    <Section
      title="Mariusz Matusiewicz"
      body={
        <>
          <Text>
            Tworzenie <i>frontendu</i> to moja pasja, zwłaszcza
            z&nbsp;wykorzystaniem <strong>React</strong>. Uwielbiam zgłębiać
            nowe technologie i&nbsp;stale rozwijać swoje umiejętności.
            Największą satysfakcję daje mi projektowanie intuicyjnych
            i&nbsp;estetycznych interfejsów, które ułatwiają życie użytkownikom.
          </Text>
          <Text>
            Poza programowaniem kocham góry. Wędrówki to dla mnie sposób na
            odpoczynek i&nbsp;naładowanie baterii. Szczególnie bliskie mojemu
            sercu są <strong>Bieszczady</strong> – ich spokój i&nbsp;naturalne
            piękno inspirują mnie za&nbsp;każdym razem, gdy tam wracam. Łączę
            zamiłowanie do technologii z&nbsp;ciekawością świata. Dzięki temu
            z&nbsp;entuzjazmem podejmuję nowe wyzwania, które pozwalają mi
            rozwijać się i&nbsp;tworzyć projekty, z których mogę być dumny. 😊🚀
          </Text>
        </>
      }
    />
  </>
);

export default AuthorPage;
