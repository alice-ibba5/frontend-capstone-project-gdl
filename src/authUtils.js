import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export const IsAuthenticated = () => {
  const navigate = useNavigate();

  try {
    // Recupera il token dal cookie, dall'archivio locale o da qualsiasi altra fonte tu stia utilizzando
    const token = localStorage.getItem("token");

    if (!token) {
      // Il token non è presente, l'utente non è autenticato
      return false;
    }

    // Decodifica il token per ottenere le informazioni contenute al suo interno
    const decodedToken = jwtDecode(token);

    // Verifica la scadenza del token
    const currentTime = Math.floor(Date.now() / 1000);
    if (decodedToken.exp < currentTime) {
      // Il token è scaduto, reindirizzamento alla pagina di login
      navigate("/");
      return false;
    }

    // Altre verifiche personalizzate secondo le tue esigenze

    // Se tutte le verifiche passano, il token è valido
    return true;
  } catch (error) {
    // Errore durante la decodifica del token (potrebbe essere scaduto o la struttura del token è invalida)
    navigate("/"); // Reindirizzamento alla pagina di login in caso di errore
    return false;
  }
};
