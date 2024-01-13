import { Col, Container, Row } from "react-bootstrap";
import logo from "../../assets/gdl-senza-sfondo.png";
import libri from "../../assets/libri-volanti.jpg";
import "./ChiSiamoStyles.css";

function ChiSiamo() {
  return (
    <Container className="d-flex flex-column">
      <Row className="d-flex flex-column">
        <img src={libri} alt="" className="libri-volanti" />
        <img src={logo} alt="" className="align-self-center gdl-logo" />
        <Col>
          <div className="paragrafo">
            <p className="mt-5">
              Benvenuti su GDLove - il luogo ideale per gli amanti dei libri che
              desiderano connettersi, esplorare nuove letture e partecipare a
              entusiasmanti discussioni letterarie. Siamo un team appassionato
              di lettori e sviluppatori che si sono uniti per creare
              un'esperienza coinvolgente e interattiva per tutti coloro che
              amano immergersi nel mondo della letteratura.
            </p>
            <h3 className="font-face-CinzelDecorative">Chi siamo:</h3>
            <p>
              Siamo un gruppo di appassionati di libri con una missione comune:
              rendere la lettura un'esperienza condivisa e arricchente. Il
              nostro team è composto da esperti del settore letterario,
              sviluppatori talentuosi e appassionati di tecnologia, tutti uniti
              dalla volontà di creare un ambiente virtuale che favorisca la
              connessione tra lettori di ogni parte del mondo.
            </p>
            <h3 className="font-face-CinzelDecorative">Cosa ci rende unici:</h3>
            <p>
              La nostra piattaforma offre un modo innovativo per partecipare a
              club del libro e gruppi di lettura virtuali. Abbiamo creato un
              sistema completo che non solo gestisce calendari di incontri, ma
              fornisce anche spazi dedicati per discussioni online approfondite.
              Vogliamo andare oltre la semplice condivisione di opinioni sui
              libri, incoraggiando la creazione di una comunità in cui gli
              utenti possano condividere risorse correlate ai libri in
              programma.
            </p>
            <h3 className="font-face-CinzelDecorative">I nostri Obiettivi:</h3>
            <ol>
              <li>
                <h6 className="font-face-CinzelDecorative">
                  Facilitare la partecipazione:
                </h6>{" "}
                Vogliamo rendere facile per tutti unirsi a gruppi di lettura
                virtuali, indipendentemente dalla loro ubicazione geografica o
                dal loro orario di disponibilità. La lettura è un'esperienza
                universale, e vogliamo rendere accessibile la condivisione di
                questa passione.
              </li>
              <li>
                <h6 className="font-face-CinzelDecorative mt-2">
                  Gestire calendari degli incontri:
                </h6>{" "}
                Il nostro sistema organizza in modo intuitivo gli appuntamenti
                dei club del libro, garantendo che gli utenti siano sempre
                aggiornati sugli eventi in programma.
              </li>
              <li>
                <h6 className="font-face-CinzelDecorative mt-2">
                  Offrire spazi per la discussione online:
                </h6>{" "}
                Abbiamo creato forum dinamici e interattivi dove gli utenti
                possono condividere le loro idee, esprimere le loro opinioni e
                approfondire le discussioni sui libri in modo più approfondito
                rispetto a una normale chat.
              </li>
            </ol>
            <p>
              Unisciti a noi su GDLove e immergiti in un'esperienza unica di
              lettura condivisa. Siamo entusiasti di accoglierti nella nostra
              magica comunità letteraria virtuale! 📚✨🔮
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default ChiSiamo;
