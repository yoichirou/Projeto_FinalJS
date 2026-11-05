// Meter o Data e Hora atuais.
document.getElementById("time-hour").textContent = "Data/Hora: " + new Date().toLocaleString('pt-PT');
// Meter a temperatura em Lisboa.

//Resto das variaveis.
let loginDiv = document.querySelector('#login-message');
let loginbtn = document.querySelector('#login');
let logout = document.querySelector("#logout");
let theme = document.querySelector('#theme')
let filtro = document.getElementById("select")
let botaoadd = document.getElementsByClassName("add")
let guardaredicao = document.getElementById('guardar')
let inputtarefa = document.getElementById("tarefa")
const listatarefa = document.getElementById("lista-tarefas")
document.body.classList = localStorage.getItem('theme')

// Váriaveis dos contadores.
let ativas = 0;
let conluidas = 0;



//************************************** */
// Função do Login
//************************************** */

function login() {

    if (localStorage.getItem('user')) {
        loginDiv.textContent = 'Olá ' + localStorage.getItem('user') + '!';

    }
    else {
        let myUser = prompt('Qual é o seu nome?')

        //armazenar no localstorage
        localStorage.setItem('user', myUser);

        loginDiv.textContent = 'Olá ' + localStorage.getItem('user') + '!';

    }


}

//************************************** */
// Função mudar o Tema
//************************************** */

function changeMode() {

    if (localStorage.getItem('theme') == 'night') {
        document.body.classList.remove('night');
        document.body.classList.add('day');
        localStorage.setItem('theme', 'day')
    }
    else {
        document.body.classList.remove('day');
        document.body.classList.add('night');
        localStorage.setItem('theme', 'night')
    }
}

//************************************** */
//função do tempo
//************************************** */
function obterTempoLisboa() {
    // Coordenadas fixas de Lisboa: latitude 38.7167, longitude -9.1333
    fetch('https://api.open-meteo.com/v1/forecast?latitude=38.7251&longitude=-9.1498&hourly=temperature_2m&timezone=Europe%2FLondon')
        .then(resposta => resposta.json())
        .then(d => {
            const temp = d.hourly.temperature_2m[0];
            document.getElementById("weather").textContent = `📍 Lisboa: ${temp}°C`;
        })
}
//executa a função do weather mal a pagina corre!
obterTempoLisboa();


//************************************** */
// FUNCAO PARA CONTROLAR FORMULARIO
//************************************** */
const myForm = document.getElementById("tarefas") //tarefas - nome do formulario

if (myForm) {
    myForm.addEventListener('submit', function (e) { // submit e o que conecta ao botao
        e.preventDefault();

        const dataFromFrom = new FormData(this);

        if (dataFromFrom.get('tarefa') !== '') // tarefa nome do input do formulario
        {
            guardaredicao.disabled = false;
            // Criei o elemento
            let mydiv = document.createElement('div');
            // Adicionei o conteudo do form ao elemento.
            mydiv.textContent = dataFromFrom.get('tarefa');
            // Adicionei 2 classes a DIV para o filtro.
            mydiv.classList.add('tarefa-item');
            mydiv.classList.add('ativas');

            //***************** */
            //* BOTÃO EDITAR
            //***************** */

            // Criei o elemento
            let editar = document.createElement('button');
            // Adicionei um atributo ao botão com o conteudo do input.
            editar.setAttribute('datatitle', dataFromFrom.get('tarefa'));
            // Nome do Botão
            editar.textContent = 'Editar';
            // Função do Botão "Editar"     
            editar.addEventListener('click', function () {
                // Inseri no input do form a informação do DATATITLE do botão         
                inputtarefa.value = this.getAttribute('datatitle')
                // Removo a div para alterações.
                mydiv.remove()
                // Faco verificações em relação aos contadores 
                if (mydiv.classList.contains('ativas')) {
                    if (ativas > 0) {
                        ativas--;
                    }
                    updatecontador()
                }
                else {
                    if (conluidas > 0) {
                        conluidas--;
                    }
                    updatecontador()
                }
            });

            // BOTAO DO GUARDAR EDICAO
            // Guarda a informação que esta no botão novamente para a div.
            guardaredicao.addEventListener('click', function () {
                mydiv.textContent = inputtarefa.value;
            })

            // CHECKBOX "CONCLUIDO"
            //Criei elemento (input = checkbox)            
            let concluido = document.createElement('input');
            concluido.type = 'checkbox';
            // Evento do botão
            concluido.addEventListener('click', function () {
                //Verifica que a checkbox esta "selecionada"
                if (concluido.checked) {
                    conluidas++;
                    if (ativas > 0) {
                        ativas--;
                    }
                    mydiv.classList.replace("ativas", "concluida");
                    updatecontador()
                }
                else  // Quando deixa de estar "selecionada"
                {
                    ativas++;
                    if (conluidas > 0) {
                        conluidas--;
                    }
                    mydiv.classList.replace("concluida", "ativas");
                    updatecontador()
                }

            })

            // BOTAO REMOVER
            // Criei elemento "Botão"
            let remover = document.createElement('button');
            // Nome do botão
            remover.textContent = 'Remover';
            // Evento do botão
            remover.addEventListener('click', function () {
                mydiv.remove()
                if (ativas > 0) {
                    ativas--;
                }
                if (conluidas > 0) {
                    conluidas--;
                }
                updatecontador()
            })

            // Contador de Ativas sempre que add 1 Tarefa    
            ativas++;
            updatecontador()

            //Sempre que add 1 tarefa adiciona ao UL (listatarefa)
            listatarefa.appendChild(mydiv);
            // Adiciona td a div em cima.
            mydiv.appendChild(remover);
            mydiv.appendChild(editar);
            mydiv.appendChild(concluido);

            //Limpa o input value
            this.reset();

        }

    })

}

// FILTRO DAS TAREFAS               
filtro.addEventListener('change', function (e) {
    // Seleciona o valor que pretendemos (Todos, Ativos, Concluidos)
    const valorSelecionado = e.target.value;
    // Seleciona tudo q tenha aquela tag
    const todasAsTarefas = listatarefa.querySelectorAll('.tarefa-item');

    // loop para indentificar o que pretendemos
    todasAsTarefas.forEach(mydiv => {
        if (valorSelecionado == "ativo") {
            if (mydiv.classList.contains("ativas")) {
                mydiv.style.display = "flex";
            } else {
                mydiv.style.display = "none";
            }
        }
        else if (valorSelecionado == "concluido") {
            if (mydiv.classList.contains("concluida")) {
                mydiv.style.display = "flex";;
            } else {
                mydiv.style.display = "none";
            }
        }
        else {
            mydiv.style.display = "flex";;
        }

    });

})

// Função para atualizar os contadores.
function updatecontador() {
    document.getElementById("ativas").textContent = ativas;
    document.getElementById("concluidas").textContent = conluidas;    
}

//************************************** */
// Eventos para Botões
//************************************** */

if (logout) {
    logout.addEventListener('click', function () {
        localStorage.removeItem('user');
        loginDiv.textContent = '';
    })
}

if (loginbtn) {
    loginbtn.addEventListener("click", () => login());
}

if (theme) {
    theme.addEventListener('click', () => changeMode())
}



