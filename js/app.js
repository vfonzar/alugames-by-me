document.addEventListener("DOMContentLoaded", function () {
    const botoes = document.querySelectorAll(".dashboard__item__button");
    const modal = document.getElementById("modal");
    const modalMessage = document.getElementById("modal-message");
    const modalClose = document.getElementById("modal-close");
    const canvas = document.getElementById("fireworks");
    const ctx = canvas.getContext("2d");

    // Ajusta o tamanho do canvas para a tela
    function ajustarCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    ajustarCanvas();
    window.addEventListener("resize", ajustarCanvas);

    // Criação dos fogos de artifício
    class Firework {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.color = color;
            this.particles = [];
            this.exploded = false;
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
        for (let i = 0; i < 3; i++) { // Altere esse número para mais ou menos fogos
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

                exibirModal(`${nomeJogo} alugado com sucesso!`, true); // true ativa os fogos
            } else {
                imagem.classList.remove("dashboard__item__img--rented");
                this.textContent = "Alugar";
                this.classList.remove("dashboard__item__button--return");

                exibirModal(`Você devolveu o jogo ${nomeJogo}`, false);
            }
        });
    });

    function exibirModal(mensagem, ativarFogos) {
        modalMessage.textContent = mensagem;
        modal.classList.add("show");

        if (ativarFogos) {
            fireworks = [];
            criarFogos();
            animarFogos();
        }

        setTimeout(() => {
            modal.classList.remove("show");
        }, 3000);
    }

    modalClose.addEventListener("click", function () {
        modal.classList.remove("show");
    });
});