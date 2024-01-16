export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  // Verifica se il token è presente e valido (puoi implementare la tua logica di validazione)
  return token !== null /* Altra logica di validazione */;
};
