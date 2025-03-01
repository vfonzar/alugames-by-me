document.addEventListener("DOMContentLoaded", function () {
    const botoes = document.querySelectorAll(".dashboard__item__button");
    const modal = document.getElementById("modal");
    const modalMessage = document.getElementById("modal-message");
    const modalPlayButton = document.getElementById("modal-play");
    const modalClose = document.getElementById("modal-close");
    const trailerModal = document.getElementById("trailer-modal");
    const trailerFrame = document.getElementById("trailer-frame");
    const trailerClose = document.getElementById("trailer-close");
    const canvas = document.getElementById("fireworks");
    const ctx = canvas.getContext("2d");

    function ajustarCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    ajustarCanvas();
    window.addEventListener("resize", ajustarCanvas);

    class Firework {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.color = color;
            this.particles = [];
            for (let i = 0; i < 50; i++) {
                this.particles.push({
                    x: this.x,
                    y: this.y,
                    vx: (Math.random() - 0.5) * 4,
                    vy: (Math.random() - 0.5) * 4,
                    alpha: 2,
                    size: Math.random() * 3 + 1
                });
            }
        }

        update() {
            this.particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.alpha -= 0.01;
            });
        }

        draw() {
            this.particles.forEach(p => {
                ctx.globalAlpha = p.alpha;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            });
        }
    }

    let fireworks = [];

    function criarFogos() {
        for (let i = 0; i < 3; i++) {
            fireworks.push(new Firework(
                Math.random() * canvas.width, 
                Math.random() * canvas.height / 2, 
                `hsl(${Math.random() * 360}, 100%, 60%)`
            ));
        }
    }

    function animarFogos() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        fireworks.forEach((f, i) => {
            f.update();
            f.draw();
            if (f.particles[0].alpha <= 0) fireworks.splice(i, 1);
        });
        requestAnimationFrame(animarFogos);
    }

    botoes.forEach(botao => {
        botao.addEventListener("click", function (event) {
            event.preventDefault();

            const item = this.closest(".dashboard__items__item");
            const imagem = item.querySelector(".dashboard__item__img");
            const nomeJogo = item.querySelector(".dashboard__item__name").textContent;
            const botaoTexto = this.textContent.trim();

            if (botaoTexto === "Alugar") {
                imagem.classList.add("dashboard__item__img--rented");
                this.textContent = "Devolver";
                this.classList.add("dashboard__item__button--return");
                exibirModal(`Aproveite o melhor de ${nomeJogo}!`, true, nomeJogo);
            } else {
                imagem.classList.remove("dashboard__item__img--rented");
                this.textContent = "Alugar";
                this.classList.remove("dashboard__item__button--return");
                exibirModal(`Obrigado por jogar ${nomeJogo}!`, false, nomeJogo);
            }
        });
    });

    let modalTimeout;

    function exibirModal(mensagem, ativarFogos, nomeJogo) {
        modalMessage.textContent = mensagem;
        modal.classList.add("show");
        modalMessage.style.marginBottom = "20px";
    
        if (ativarFogos) {
            fireworks = [];
            criarFogos();
            animarFogos();
        }
    
        clearTimeout(modalTimeout);
    
        // 🔥 Normalizando o nome do jogo para evitar erros de comparação
        nomeJogo = nomeJogo.trim().toLowerCase();
    
        if (!ativarFogos) {
            modalPlayButton.style.display = "none";
            modalPlayButton.setAttribute("disabled", "true");
            modalPlayButton.style.cursor = "not-allowed";
            modalPlayButton.style.opacity = "0.5";
            modalPlayButton.style.pointerEvents = "none";
        } else {
            modalPlayButton.style.display = "block";
            modalPlayButton.removeAttribute("disabled");
            modalPlayButton.style.cursor = "pointer";
            modalPlayButton.style.opacity = "1";
            modalPlayButton.style.pointerEvents = "auto";
    
            // 🔥 Se for Takenoko ou Ticket to Ride, desativa o botão
            if (nomeJogo.includes("takenoko") || nomeJogo.includes("ticket to ride")) {
                modalPlayButton.setAttribute("disabled", "true");
                modalPlayButton.style.cursor = "not-allowed";
                modalPlayButton.style.opacity = "0.5";
                modalPlayButton.style.pointerEvents = "all"; // 🔥 Permite capturar clique
    
                // 🚫 Adiciona um evento de clique que impede a ação e reforça o feedback visual
                modalPlayButton.onclick = function (event) {
                    event.preventDefault();
                    modalPlayButton.style.cursor = "not-allowed";
                };
            } else {
                // 🔄 Se for Monopoly, reativa normalmente
                modalPlayButton.removeAttribute("disabled");
                modalPlayButton.style.cursor = "pointer";
                modalPlayButton.style.opacity = "1";
                modalPlayButton.style.pointerEvents = "auto";
                modalPlayButton.onclick = null; // 🔥 Remove qualquer evento antigo
            }
        }
    
        modalTimeout = setTimeout(() => {
            modal.classList.remove("show");
        }, 12000);
    }

    modalClose.addEventListener("click", () => {
        modal.classList.remove("show");
    });

    modalPlayButton.addEventListener("click", function () {
        abrirTrailer();
    });

    function abrirTrailer() {
        trailerFrame.style.display = "none";

        // Criando o spinner
        const spinner = document.createElement("div");
        spinner.classList.add("spinner");

        // Adicionando o spinner ao modal
        trailerModal.querySelector(".modal__trailer").appendChild(spinner);

        // 🔥 Fecha o modal principal ANTES de carregar o trailer
        modal.classList.remove("show");

        // Exibe o modal do trailer
        trailerModal.classList.add("show");

        // Definindo URL do Trailer (Apenas Monopoly Disponível)
        setTimeout(() => {
            trailerFrame.src = "https://www.youtube.com/embed/QgbEPQfLzw8";
            trailerFrame.style.display = "block";
            spinner.remove(); // 🔥 Remove o spinner após carregar
        }, 1500);
    }

    trailerClose.addEventListener("click", () => {
        trailerModal.classList.remove("show");
        trailerFrame.src = "";
    });
});