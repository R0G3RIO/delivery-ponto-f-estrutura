import React, { useState, useEffect } from "react";

const diasSemana = ["domingo", "segunda", "terca", "quarta", "quinta", "sexta", "sabado"];

export default function Admin() {
  const [opcoes, setOpcoes] = useState({});
  const [diaSelecionado, setDiaSelecionado] = useState(diasSemana[new Date().getDay()]);
  const [form, setForm] = useState({ nome: "", descricao: "", precoMini: "21,00", precoMedia: "23,00", precoGrande: "25,00" });
  const [bebidas, setBebidas] = useState([]);
  const [novaBebida, setNovaBebida] = useState({ nome: "", preco: "" });
  const [aviso, setAviso] = useState("");

  useEffect(() => {
    const localCardapio = localStorage.getItem("cardapio");
    const bebidasSalvas = localStorage.getItem("bebidas");
    const avisoSalvo = localStorage.getItem("aviso");

    if (localCardapio) setOpcoes(JSON.parse(localCardapio));
    else {
      const vazio = {};
      diasSemana.forEach((dia) => (vazio[dia] = []));
      setOpcoes(vazio);
    }
    if (bebidasSalvas) setBebidas(JSON.parse(bebidasSalvas));
    if (avisoSalvo) setAviso(avisoSalvo);
  }, []);

  useEffect(() => {
    localStorage.setItem("cardapio", JSON.stringify(opcoes));
  }, [opcoes]);

  const adicionarOpcao = () => {
    const nova = {
      nome: form.nome,
      descricao: form.descricao,
      tamanhos: {
        mini: form.precoMini,
        media: form.precoMedia,
        grande: form.precoGrande
      }
    };
    const atualizado = {
      ...opcoes,
      [diaSelecionado]: [...(opcoes[diaSelecionado] || []), nova]
    };
    setOpcoes(atualizado);
    setForm({ nome: "", descricao: "", precoMini: "21,00", precoMedia: "23,00", precoGrande: "25,00" });
  };

  const removerOpcao = (index) => {
    const atualizado = {
      ...opcoes,
      [diaSelecionado]: opcoes[diaSelecionado].filter((_, i) => i !== index)
    };
    setOpcoes(atualizado);
  };

  const adicionarBebida = () => {
    if (!novaBebida.nome || !novaBebida.preco) return;
    const nova = { id: Date.now().toString(), nome: novaBebida.nome, preco: novaBebida.preco };
    const atualizadas = [...bebidas, nova];
    setBebidas(atualizadas);
    localStorage.setItem("bebidas", JSON.stringify(atualizadas));
    setNovaBebida({ nome: "", preco: "" });
  };

  const removerBebida = (id) => {
    const atualizadas = bebidas.filter((b) => b.id !== id);
    setBebidas(atualizadas);
    localStorage.setItem("bebidas", JSON.stringify(atualizadas));
  };

  const salvarAviso = () => localStorage.setItem("aviso", aviso);
  const removerAviso = () => { setAviso(""); localStorage.removeItem("aviso"); };

  return (
    <div style={estilos.container}>
      <div style={estilos.card}>
        <h1 style={estilos.titulo}>Painel Admin</h1>

        {/* Cardápio */}
        <section style={estilos.bloco}>
          <h2 style={estilos.subtitulo}>Cardápio do Dia</h2>
          <select style={estilos.input} value={diaSelecionado} onChange={e => setDiaSelecionado(e.target.value)}>
            {diasSemana.map(dia => <option key={dia}>{dia}</option>)}
          </select>

          <input style={estilos.input} placeholder="Nome da opção" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
          <textarea style={estilos.input} placeholder="Descrição" value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} />

          <div style={estilos.inlineInputs}>
            <input style={estilos.input} placeholder="Mini" value={form.precoMini} onChange={e => setForm({ ...form, precoMini: e.target.value })} />
            <input style={estilos.input} placeholder="Média" value={form.precoMedia} onChange={e => setForm({ ...form, precoMedia: e.target.value })} />
            <input style={estilos.input} placeholder="Grande" value={form.precoGrande} onChange={e => setForm({ ...form, precoGrande: e.target.value })} />
          </div>
          <button style={estilos.botaoVerde} onClick={adicionarOpcao}>➕ Adicionar Opção</button>

          <ul>
            {(opcoes[diaSelecionado] || []).map((op, i) => (
              <li key={i} style={estilos.listaItem}>
                <div>
                  <strong>{op.nome}</strong>
                  <p>{op.descricao}</p>
                  <small>Mini: R${op.tamanhos.mini} | Média: R${op.tamanhos.media} | Grande: R${op.tamanhos.grande}</small>
                </div>
                <button style={estilos.botaoRemover} onClick={() => removerOpcao(i)}>Remover</button>
              </li>
            ))}
          </ul>
        </section>

        {/* Bebidas */}
        <section style={estilos.bloco}>
          <h2 style={estilos.subtitulo}>Bebidas</h2>
          <input style={estilos.input} placeholder="Nome da bebida" value={novaBebida.nome} onChange={e => setNovaBebida({ ...novaBebida, nome: e.target.value })} />
          <input style={estilos.input} placeholder="Preço" type="number" value={novaBebida.preco} onChange={e => setNovaBebida({ ...novaBebida, preco: e.target.value })} />
          <button style={estilos.botaoAzul} onClick={adicionarBebida}>Adicionar Bebida</button>

          <ul>
            {bebidas.map((b) => (
              <li key={b.id} style={estilos.listaItem}>
                <span>{b.nome} - R${b.preco}</span>
                <button style={estilos.botaoRemover} onClick={() => removerBebida(b.id)}>Remover</button>
              </li>
            ))}
          </ul>
        </section>

        {/* Aviso */}
        <section style={estilos.bloco}>
          <h2 style={estilos.subtitulo}>Aviso do Dia</h2>
          <textarea style={estilos.input} placeholder="Digite o aviso..." value={aviso} onChange={e => setAviso(e.target.value)} />
          <div style={estilos.inlineInputs}>
            <button style={estilos.botaoAmarelo} onClick={salvarAviso}>Salvar Aviso</button>
            <button style={estilos.botaoRemover} onClick={removerAviso}>Remover Aviso</button>
          </div>
        </section>
      </div>
    </div>
  );
}

const estilos = {
  container: {
    display: "flex",
    justifyContent: "center",
    padding: "2rem",
    background: "#f9f9f9",
    minHeight: "100vh",
  },
  card: {
    width: "100%",
    maxWidth: "700px",
    background: "#fff",
    padding: "2rem",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  titulo: {
    fontSize: "24px",
    marginBottom: "20px",
    textAlign: "center",
    color: "#333"
  },
  bloco: {
    marginBottom: "2rem"
  },
  subtitulo: {
    fontSize: "18px",
    marginBottom: "10px",
    color: "#444",
    fontWeight: "bold"
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "14px"
  },
  inlineInputs: {
    display: "flex",
    gap: "10px"
  },
  botaoVerde: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "10px"
  },
  botaoAzul: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold"
  },
  botaoAmarelo: {
    flex: 1,
    padding: "10px",
    backgroundColor: "#ffc107",
    color: "#000",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold"
  },
  botaoRemover: {
    padding: "6px 10px",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "13px"
  },
  listaItem: {
    backgroundColor: "#f1f1f1",
    padding: "10px",
    borderRadius: "6px",
    marginTop: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  }
};
