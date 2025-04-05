// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const senhaExistente = localStorage.getItem("senhaAdmin");

  const [senha, setSenha] = useState("");
  const [pin, setPin] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!senhaExistente) {
      if (!senha || !pin) return alert("Preencha todos os campos");
      localStorage.setItem("senhaAdmin", senha);
      localStorage.setItem("pinAdmin", pin);
      alert("Senha cadastrada com sucesso!");
      localStorage.setItem("auth", "true");
      navigate("./admin");
    } else {
      const senhaSalva = localStorage.getItem("senhaAdmin");
      if (senha === senhaSalva) {
        localStorage.setItem("auth", "true");
        navigate("./admin");
      } else {
        alert("Senha incorreta!");
      }
    }
  };

  return (
    <div style={estilos.container}>
      <div style={estilos.card}>
        <h2 style={estilos.titulo}>
          {senhaExistente ? "Login do Admin" : "Cadastrar Senha do Admin"}
        </h2>
        <form onSubmit={handleSubmit} style={estilos.form}>
          <div style={estilos.inputGroup}>
            <label style={estilos.label}>Senha:</label>
            <input
              type="password"
              placeholder="Digite a senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              style={estilos.input}
            />
          </div>

          {!senhaExistente && (
            <div style={estilos.inputGroup}>
              <label style={estilos.label}>PIN de Segurança:</label>
              <input
                type="password"
                placeholder="Digite um PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                style={estilos.input}
              />
            </div>
          )}

          <button type="submit" style={estilos.botao}>
            {senhaExistente ? "Entrar" : "Cadastrar"}
          </button>

          {senhaExistente && (
            <Link to="./redefinir" style={estilos.link}>
              Esqueceu a senha?
            </Link>
          )}
        </form>
      </div>
    </div>
  );
}

// Estilos em JavaScript
const estilos = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f5f5f5",
    padding: "20px",
  },
  card: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px",
  },
  titulo: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: "5px",
    fontWeight: "bold",
    fontSize: "14px",
    color: "#444",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  botao: {
    padding: "10px",
    backgroundColor: "#28a745",
    color: "#fff",
    fontWeight: "bold",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  link: {
    marginTop: "10px",
    textAlign: "center",
    fontSize: "14px",
    color: "#007bff",
    textDecoration: "none",
  },
};
