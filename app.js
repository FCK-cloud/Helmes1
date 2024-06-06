// Configure o Firebase com suas credenciais
const firebaseConfig = {
    apiKey: "AIzaSyA8YxeMLScsXI0FQyVEyI0moohuGi8Oylk",
    authDomain: "bonde-dos-carecas.firebaseapp.com",
    projectId: "bonde-dos-carecas",
    storageBucket: "bonde-dos-carecas.appspot.com",
    messagingSenderId: "602397118220",
    appId: "1:602397118220:web:e81dba4259efb93bc14329"
};

firebase.initializeApp(firebaseConfig); // Inicialize o Firebase
const database = firebase.database(); // Inicialize o banco de dados
const storage = firebase.storage(); // Inicialize o storage

function enviarDadosParaFirebase() {
    const nomeAluno = document.getElementById('nome').value;
    const turma = document.getElementById('turma').value;
    const curso = document.getElementById('curso').value;
    const endereco = document.getElementById('endereco').value;
    const imagem = document.getElementById('imagem').files[0]; // Obtém o arquivo de 
    imagem
    if (imagem) {
        const storageRef = storage.ref('imagens/' + imagem.name);
        storageRef.put(imagem).then(snapshot => {
            snapshot.ref.getDownloadURL().then(downloadURL => {
                const dados = {
                    nomeAluno: nomeAluno,
                    turma: turma,
                    curso: curso,
                    endereco: endereco,
                    imagemURL: downloadURL // Salva a URL da imagem
                };
                database.ref('alunos').push(dados)
                    .then(() => {
                        alert('Dados enviados com sucesso!');
                        document.getElementById('nome').value = '';
                        document.getElementById('turma').value = '';
                        document.getElementById('curso').value = '';
                        document.getElementById('endereco').value = '';
                        document.getElementById('imagem').value = '';
                    })
                    .catch(error => {
                        console.error('Erro ao enviar os dados: ', error);
                    });
            });
        }).catch(error => {
            console.error('Erro ao fazer upload da imagem: ', error);
        });
    } else {
        alert('Por favor, selecione uma imagem.');
    }
}
function consultarAlunoPorNome() {
    const nome = document.getElementById('nomeConsulta').value.trim();
    const alunosRef = database.ref('alunos');
    alunosRef.orderByChild('nomeAluno').equalTo(nome).once('value', snapshot => {
        const data = snapshot.val();
        const lista = document.getElementById('listaAlunos');
        lista.innerHTML = ''; // Limpar lista anterior
        if (data) {
            Object.keys(data).forEach(key => {
                const aluno = data[key];
                const item = document.createElement('li');
                item.innerHTML = `Nome: ${aluno.nomeAluno}, Turma: ${aluno.turma}, Curso: 
   ${aluno.curso}, Endereco: ${aluno.endereco}, Imagem: <img src="${aluno.imagemURL}" alt="Imagem do Aluno" 
   style="width:100px; height:auto;">`;
                lista.appendChild(item);
            });
        } else {
            lista.innerHTML = '<li>Nenhum aluno encontrado com esse nome.</li>';
        }
    }).catch(error => {
        console.error('Erro ao buscar alunos: ', error);
    });
}