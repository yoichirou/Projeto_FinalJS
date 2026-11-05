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
            //criei o elemento
            let mydiv = document.createElement('div');
            // Adicionei elemento a tarefa
            mydiv.textContent = dataFromFrom.get('tarefa');
            mydiv.classList.add('tarefa-item'); 
            mydiv.classList.add('ativas');
            
            // BOTÃO EDITAR
            let editar = document.createElement('button');
            editar.setAttribute('datatitle', dataFromFrom.get('tarefa'));
            editar.textContent = 'Editar';       
            editar.addEventListener('click', function(){            
                inputtarefa.value = this.getAttribute('datatitle')  
                mydiv.remove() 
                if(mydiv.classList.contains('ativas'))          
                    {
                        if (ativas > 0) {
                        ativas--; 
                        }
                        updatecontador()
                    }     
                else
                    {
                        if (conluidas > 0) {
                        conluidas--; 
                        }
                        updatecontador()
                    }                              
            });

            // BOTAO DO GUARDAR EDICAO
            guardaredicao.addEventListener('click', function(){               
                mydiv.textContent = inputtarefa.value;
            })

            // CHECKBOX "CONCLUIDO"            
            let concluido = document.createElement('input');
            concluido.type = 'checkbox'; 
                concluido.addEventListener('click', function(){  

                    if(concluido.checked)
                    {                    
                        conluidas++;                   
                        if (ativas > 0) {
                        ativas--; 
                        }
                        console.log("contador checked: " + ativas)
                        console.log("concluida checked: " + conluidas) 
                        mydiv.classList.replace("ativas","concluida");
                        updatecontador()                        
                    }
                    else  
                    {
                        ativas++;                        
                        if (conluidas > 0) {
                        conluidas--; 
                        }
                        console.log("contador unchecked: " + ativas)
                        console.log("concluida unchecked: " + conluidas)
                        mydiv.classList.replace("concluida","ativas");
                        updatecontador() 
                    }
                    
                })
            
            // BOTAO REMOVER
            let remover = document.createElement('button');
            remover.textContent = 'Remover';       
                remover.addEventListener('click', function(){
                mydiv.remove()                                
                if (ativas > 0) {
                        ativas--; 
                        }
                if (conluidas > 0) {
                        conluidas--; 
                        }
                updatecontador()                
                })          

             // FILTRO DAS TAREFAS               
            filtro.addEventListener('change',function(e){
                const valorSelecionado = e.target.value;       

                const todasAsTarefas = listatarefa.querySelectorAll('.tarefa-item');

                todasAsTarefas.forEach(mydiv => {
                    if(valorSelecionado == "ativo")
                    {
                        if (mydiv.classList.contains("ativas")) {
                            mydiv.style.display = "flex";
                        } else {
                            mydiv.style.display = "none";
                        }
                    }
                else if (valorSelecionado == "concluido" )
                    {
                        if (mydiv.classList.contains("concluida")) {
                            mydiv.style.display = "flex";;
                        } else {
                            mydiv.style.display = "none";
                        }
                    } 
                else
                {
                    mydiv.style.display = "flex";;
                }

            });

    })


            // Contador de Ativas sempre que add 1 Tarefa    
            ativas++;
            updatecontador()
            
            //Sempre que add 1 tarefa adiciona ao UL (listatarefa)
            listatarefa.appendChild(mydiv);
            mydiv.appendChild(remover);
            mydiv.appendChild(editar);
            mydiv.appendChild(concluido);            

            this.reset();

           
            
        }         

    })

}




function updatecontador()
{
    document.getElementById("ativas").textContent = ativas; 
    document.getElementById("concluidas").textContent = conluidas;            
    console.log("contador: " + ativas)
    console.log("concluida: " + conluidas)
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



