// === CONFIGURAÇÃO ===
const GRC_TOKEN = "6Ldnwx0sAAAAADTa_Whis-SwnStwiOC3v_O4dcob"; // Troque aqui
const DC_LINK = "https://discord.gg/6aXc5c8JuA";
const GH_LINK = "https://github.com/LuGB18";
const DWBT_API = "https://onxbd.vercel.app/api/download";
const SUPORTE_API = "https://onxbd.vercel.app/api/suporte";
// =====================

// Aplicar links externos
document.querySelector('.btn-secondary').href = DC_LINK;
document.querySelector('footer a').href = GH_LINK;

// Link de Download
document.getElementById('downloadBtn').addEventListener('click', async (e) => {
  e.preventDefault();

  const btn = document.getElementById('downloadBtn');
  const originalText = btn.textContent;

  // Feedback visual enquanto carrega
  btn.textContent = "Buscando link...";
  btn.style.pointerEvents = "none";

  try {
    const response = await fetch(DWBT_API);

    if (!response.ok) {
      throw new Error("Servidor retornou erro " + response.status);
    }

    const data = await response.json();

    // Verifica se veio o campo "link"
    if (data.link && typeof data.link === "string") {
      // Abre em nova aba → navegador inicia o download automaticamente
      window.open(data.link, '_blank');

      // Opcional: muda o texto por 3 segundos pra confirmar
      btn.textContent = "Download iniciado!";
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.pointerEvents = "auto";
      }, 3000);
    } else {
      throw new Error("Link não encontrado na resposta do servidor");
    }

  } catch (err) {
    console.error(err);
    alert("Erro ao obter o link de download.\nTente novamente ou entre no Discord para pegar manualmente.");
    btn.textContent = originalText;
    btn.style.pointerEvents = "auto";
  }
});

// Modal Bug Report
const modal = document.getElementById('bugModal');
const openBtn = document.getElementById('openBugReport');
const closeBtn = document.querySelector('.close');

openBtn.onclick = () => modal.style.display = "block";
closeBtn.onclick = () => modal.style.display = "none";
window.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; };

// Função auxiliar para Base64 (nativa do navegador)
const encodeBase64 = (str) => btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode('0x' + p1)));

// Envio do formulário (novo formato exigido pelo seu backend)
document.getElementById('bugForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const status = document.getElementById('formStatus');
    status.textContent = "Validando reCAPTCHA...";
    status.style.color = "#60a5fa";

    grecaptcha.ready(() => {
        grecaptcha.execute(GRC_TOKEN, { action: 'submit_bug' }).then(async (token) => {
            const formData = {
                username: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                telefone: document.getElementById('phone').value.trim() || "Não informado",
                mensagem: document.getElementById('message').value.trim()
            };

            // Validação rápida
            if (!formData.username || !formData.email || !formData.mensagem) {
                status.textContent = "Preencha todos os campos obrigatórios!";
                status.style.color = "#ff6b6b";
                return;
            }

            // Codifica cada campo em Base64 individualmente
            const payload = {
                user: {
                    username: encodeBase64(formData.username),
                    email: encodeBase64(formData.email),
                    telefone: encodeBase64(formData.telefone),
                    mensagem: encodeBase64(formData.mensagem)
                },
                captcha: {
                    response: token
                }
            };

            status.textContent = "Enviando reporte...";

            try {
                const res = await fetch(SUPORTE_API, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (res.ok) {
                    status.textContent = "Reporte enviado com sucesso! Muito obrigado pelo feedback!";
                    status.style.color = "#4ade80";
                    document.getElementById('bugForm').reset();
                } else {
                    const erro = await res.text();
                    status.textContent = "Erro do servidor. Tente novamente mais tarde.";
                    status.style.color = "#ff6b6b";
                    console.error("Erro:", erro);
                }
                } catch (err) {
                    status.textContent = "Falha na conexão. Verifique sua internet.";
                    status.style.color = "#ff6b6b";
                    console.error(err);
                }
            });
    });
});