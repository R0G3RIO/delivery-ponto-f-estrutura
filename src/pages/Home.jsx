import React, { useState, useEffect } from "react";
import banner from "../assets/banner-cardapio.png";
import bannerFeijoada from "../assets/banner-feijoada.png"; // <- adicione esse banner à pasta

const enderecoLocal = "Rua David Marcassa Lopes, 540 - Pinhal";
const telefone = "11956477885";

const hoje = new Date();
const diaIndex = hoje.getDay();
const diaSemana = [
  "domingo", "segunda", "terca", "quarta", "quinta", "sexta", "sabado"
][diaIndex];

export default function Home() {
  const [opcoes, setOpcoes] = useState([]);
  const [bebidas, setBebidas] = useState([]);
  const [aviso, setAviso] = useState("");
  const [opcaoSelecionada, setOpcaoSelecionada] = useState(null);
  const [bebidaSelecionada, setBebidaSelecionada] = useState(null);
  const [tamanho, setTamanho] = useState("Mini");
  const [tipoEntrega, setTipoEntrega] = useState("retirada");
  const [endereco, setEndereco] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [nomeCliente, setNomeCliente] = useState("");
  const [telefoneCliente, setTelefoneCliente] = useState("");
  const [mostrarResumo, setMostrarResumo] = useState(false);

  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem("cardapio") || "{}");
    const bebidasSalvas = JSON.parse(localStorage.getItem("bebidas") || "[]");
    const avisoSalvo = localStorage.getItem("aviso") || "";

    let opcoesHoje = dados[diaSemana] || [];

    // Adiciona feijoada automaticamente quarta/sábado
    if (["quarta", "sabado"].includes(diaSemana)) {
      const feijoadaJaAdicionada = opcoesHoje.some(op => op.nome === "Feijoada");
      if (!feijoadaJaAdicionada) {
        opcoesHoje.push({
          nome: "Feijoada",
          descricao: "Acompanha arroz, couve, torresmo, farofa e banana frita.",
          tamanhos: {
            mini: "23,00",
            media: "25,00",
            grande: "27,00"
          }
        });
      }
    }

    setOpcoes(opcoesHoje);
    setBebidas(bebidasSalvas);
    setAviso(avisoSalvo);
  }, []);

  const selecionarOpcao = (index) => {
    setOpcaoSelecionada(index);
    setTamanho("Mini");
    setTipoEntrega("retirada");
    setEndereco("");
    setQuantidade(1);
    setNomeCliente("");
    setTelefoneCliente("");
    setBebidaSelecionada(null);
    setMostrarResumo(false);
  };

  const calcularTotal = () => {
    const opcao = opcoes[opcaoSelecionada];
    const precoMarmita = parseFloat(opcao?.tamanhos[tamanho.toLowerCase()]?.replace(",", ".") || 0);
    const precoBebida = bebidaSelecionada ? parseFloat(bebidas.find(b => b.id === bebidaSelecionada)?.preco || 0) : 0;
    return (precoMarmita + precoBebida) * quantidade;
  };

  const finalizarPedido = () => {
    if (!nomeCliente || !telefoneCliente) {
      alert("Por favor, preencha o nome e telefone do cliente.");
      return;
    }

    const opcao = opcoes[opcaoSelecionada];
    const precoMarmita = parseFloat(opcao?.tamanhos[tamanho.toLowerCase()]?.replace(",", ".") || 0);
    const precoBebida = bebidaSelecionada ? parseFloat(bebidas.find(b => b.id === bebidaSelecionada)?.preco || 0) : 0;
    const valorTotal = (precoMarmita + precoBebida) * quantidade;

    const enderecoFinal = tipoEntrega === "entrega" ? endereco : "Retirada no local";
    const bebidaTexto = bebidaSelecionada
      ? `🥤 *Bebida:* ${bebidas.find(b => b.id === bebidaSelecionada)?.nome} (R$ ${precoBebida.toFixed(2)})\n`
      : "";

    const mensagem = `
🍽 *Pedido de Marmita - ${nomeCliente}*
📞 *Telefone:* ${telefoneCliente}
📅 *Dia:* ${diaSemana.toUpperCase()}
🍱 *${opcao.nome}*
📝 ${opcao.descricao}
📦 *Tamanho:* ${tamanho}
🔢 *Quantidade:* ${quantidade}
${bebidaTexto}🚚 *Entrega:* ${enderecoFinal}
💰 *Total:* R$ ${valorTotal.toFixed(2)}
`;

    const url = `https://wa.me/55${telefone}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
  };

  const isFeijoadaDia = ["quarta", "sabado"].includes(diaSemana);

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: 16 }}>
     <img
    src={isFeijoadaDia ? bannerFeijoada : banner}
    alt="Banner"
    style={{
    borderRadius: "22px",
    marginBottom: "1.5rem",
    width: isFeijoadaDia ? "55%" : "100%",
    height: isFeijoadaDia ? "auto" : "220px",
    objectFit: "cover",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    boxShadow: isFeijoadaDia ? "0 4px 8px rgba(0,0,0,0.2)" : "none"
  }}
/>


      {aviso && (
        <div style={{
          backgroundColor: "#fff3cd",
          padding: 12,
          borderRadius: 8,
          marginBottom: 16,
          borderLeft: "4px solid #ffeeba"
        }}>
          ⚠️ <strong>Aviso:</strong> {aviso}
        </div>
      )}

      {opcoes.length === 0 ? (
        <p style={{ textAlign: "center", color: "#666" }}>
          Nenhuma opção cadastrada para hoje ({diaSemana}).
        </p>
      ) : (
        opcoes.map((opcao, index) => {
          const isFeijoada = opcao.nome.toLowerCase() === "feijoada";
          return (
            <div key={index} style={{ marginBottom: 24 }}>
              <button
                onClick={() => selecionarOpcao(index)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: 12,
                  borderRadius: 12,
                  backgroundColor: isFeijoada ? "#fff3e0" : "#333",
                  color: isFeijoada ? "#000" : "#fff",
                  border: isFeijoada ? "2px solid #fb8c00" : "none",
                  cursor: "pointer",
                  marginBottom: 8,
                }}
              >
                <strong style={{
                  color: isFeijoada ? "#d84315" : "#ffa726",
                  fontSize: 16
                }}>
                  {opcao.nome}
                </strong>
                <br />
                <span>{opcao.descricao}</span>
              </button>

              {opcaoSelecionada === index && !mostrarResumo && (
                <div style={{
                  border: "1px solid #ccc",
                  borderRadius: 8,
                  padding: 12,
                }}>
                  <div style={{ marginBottom: 12 }}>
                    <label>Nome:</label>
                    <input
                      type="text"
                      value={nomeCliente}
                      onChange={(e) => setNomeCliente(e.target.value)}
                      style={{ width: "100%", padding: 8, borderRadius: 4, marginTop: 4 }}
                    />
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <label>Telefone:</label>
                    <input
                      type="tel"
                      value={telefoneCliente}
                      onChange={(e) => setTelefoneCliente(e.target.value)}
                      style={{ width: "100%", padding: 8, borderRadius: 4, marginTop: 4 }}
                    />
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <label>Tamanho:</label><br />
                    {["Mini", "Media", "Grande"].map((tam) => (
                      <label key={tam} style={{ marginRight: 12 }}>
                        <input
                          type="radio"
                          name="tamanho"
                          value={tam}
                          checked={tamanho === tam}
                          onChange={(e) => setTamanho(e.target.value)}
                        /> {tam} - R$ {opcao.tamanhos[tam.toLowerCase()]}
                      </label>
                    ))}
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <label>Entrega ou Retirada:</label><br />
                    {["retirada", "entrega"].map((tipo) => (
                      <label key={tipo} style={{ marginRight: 12 }}>
                        <input
                          type="radio"
                          name="entrega"
                          value={tipo}
                          checked={tipoEntrega === tipo}
                          onChange={(e) => setTipoEntrega(e.target.value)}
                        /> {tipo}
                      </label>
                    ))}
                    {tipoEntrega === "entrega" && (
                      <input
                        type="text"
                        placeholder="Digite o endereço"
                        value={endereco}
                        onChange={(e) => setEndereco(e.target.value)}
                        style={{ width: "100%", marginTop: 8, padding: 8, borderRadius: 4 }}
                      />
                    )}
                  </div>
                  {bebidas.length > 0 && (
                    <div style={{ marginBottom: 12 }}>
                      <label>Bebida:</label>
                      <select
                        value={bebidaSelecionada || ""}
                        onChange={(e) => setBebidaSelecionada(e.target.value)}
                        style={{ width: "100%", padding: 8, borderRadius: 4 }}
                      >
                        <option value="">Nenhuma</option>
                        {bebidas.map(b => (
                          <option key={b.id} value={b.id}>
                            {b.nome} - R$ {b.preco}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div style={{ marginBottom: 12 }}>
                    <label>Quantidade:</label>
                    <input
                      type="number"
                      value={quantidade}
                      onChange={(e) => setQuantidade(Number(e.target.value))}
                      style={{ width: 80, padding: 8, marginLeft: 8 }}
                      min={1}
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (!nomeCliente || !telefoneCliente) {
                        alert("Preencha todos os campos");
                        return;
                      }
                      setMostrarResumo(true);
                    }}
                    style={{
                      width: "100%",
                      padding: 10,
                      backgroundColor: "#007bff",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      cursor: "pointer"
                    }}
                  >
                    Ver Resumo
                  </button>
                </div>
              )}

              {opcaoSelecionada === index && mostrarResumo && (
                <div style={{
                  border: "1px solid #4caf50",
                  backgroundColor: "#e8f5e9",
                  borderRadius: 8,
                  padding: 12,
                  marginTop: 12
                }}>
                  <p><strong>Cliente:</strong> {nomeCliente}</p>
                  <p><strong>Telefone:</strong> {telefoneCliente}</p>
                  <p><strong>Opção:</strong> {opcao.nome}</p>
                  <p><strong>Tamanho:</strong> {tamanho}</p>
                  <p><strong>Quantidade:</strong> {quantidade}</p>
                  {bebidaSelecionada && (
                    <p><strong>Bebida:</strong> {bebidas.find(b => b.id === bebidaSelecionada)?.nome}</p>
                  )}
                  {tipoEntrega === "entrega" && (
                    <p><strong>Endereço:</strong> {endereco}</p>
                  )}
                  <p><strong>Total:</strong> R$ {calcularTotal().toFixed(2)}</p>

                  <div style={{ display: "flex", gap: "10px", marginTop: 10 }}>
                    <button
                      onClick={() => setMostrarResumo(false)}
                      style={{
                        flex: 1,
                        backgroundColor: "#aaa",
                        color: "#fff",
                        padding: 10,
                        border: "none",
                        borderRadius: 6
                      }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={finalizarPedido}
                      style={{
                        flex: 1,
                        backgroundColor: "#4caf50",
                        color: "#fff",
                        padding: 10,
                        border: "none",
                        borderRadius: 6
                      }}
                    >
                      Enviar Pedido
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}

      <div style={{ textAlign: "center", marginTop: "2rem", fontSize: "14px", color: "#444" }}>
        <p style={{ fontWeight: "bold", color: "#d35400" }}>
          P: R$21,00 &nbsp;&nbsp; M: R$23,00 &nbsp;&nbsp; G: R$25,00
        </p>
        <p style={{ fontStyle: "italic", marginBottom: "0.5rem" }}>
          Todas as opções acompanham salada
        </p>
        <p>📍 {enderecoLocal}</p>
        <p>📦 DELIVERY E RETIRADA</p>
        <p>📞 (11) 95647-7885</p>
        <p style={{ fontSize: "12px", marginTop: "0.5rem" }}>
          *Cobramos taxa de entrega
        </p>
      </div>
    </div>
  );
}
