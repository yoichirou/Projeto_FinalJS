// Meter o Data e Hora atuais.
document.getElementById("time-hour").textContent = "Data/Hora: " + new Date().toLocaleString('pt-PT');
// Meter a temperatura em Lisboa.

//Resto das variaveis.
let loginDiv = document.querySelector('#login-message');
let loginbtn = document.querySelector('#login');
let logout = document.querySelector("#logout");
let theme = document.querySelector('#theme')
let botaoadd = document.getElementsByClassName("add")
let guardaredicao = document.getElementById('guardar')
let inputtarefa = document.getElementById("tarefa")
const listatarefa = document.getElementById("lista-tarefas")
document.body.classList = localStorage.getItem('theme')
let contador = 0;
let ativo = 0;



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

    if (localStorage.getItem('theme') == 'day') {
        document.body.classList.remove('day');
        document.body.classList.add('night');
        localStorage.setItem('theme', 'night')
    }
    else {
        document.body.classList.add('day');
        document.body.classList.remove('night');
        localStorage.setItem('theme', 'day')
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
            let myLi = document.createElement('li');
            myLi.textContent = dataFromFrom.get('tarefa');
            // BOTÃO EDITAR
            let editar = document.createElement('button');
            editar.setAttribute('datatitle', dataFromFrom.get('tarefa'));
            editar.textContent = 'Editar';       
            editar.addEventListener('click', function(){            
            inputtarefa.value = this.getAttribute('datatitle')            
            });
            // CHECKBOX "CONCLUIDO"
            
            let concluido = document.createElement('input');
            concluido.type = 'checkbox'; 
                concluido.addEventListener('click', function(){
                    document.getElementById("ativa").textContent = ativo;

                    
                })
            
            // BOTAO REMOVER
            let remover = document.createElement('button');
            remover.textContent = 'Remover';       
                remover.addEventListener('click', function(){
                this.remove();
                myLi.remove();
                editar.remove(); 
                concluido.remove();
                contador--;
                // updatecontador();                
                })

            contador++;
            // updatecontador();

            listatarefa.appendChild(myLi);
            listatarefa.appendChild(remover);
            listatarefa.appendChild(editar);
            listatarefa.appendChild(concluido);
            // console.log("contador: " + contador)
            // console.log("concluida: " + ativo)

            this.reset();
        }   
        
        if(document.getElementById("ativa").checked = true)
                    {                    
                        ativo++;
                        contador--;
                        updatecontador();
                    }
                    else
                    {
                        ativo--;
                        contador++;
                        updatecontador();
                    }


    })

}

function updatecontador()
{
    document.getElementById("contador").textContent = contador;
    console.log("contador: " + contador)
    console.log("concluida: " + ativo)
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



