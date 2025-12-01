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

// Download direto da API
document.getElementById('downloadBtn').addEventListener('click', async (e) => {
    e.preventDefault();
    const a = document.createElement('a');
    a.href = DWBT_API;
    a.download = 'ONX-Optimizer-latest.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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