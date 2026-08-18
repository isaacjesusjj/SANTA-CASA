class Pessoa:
    # Construtora 
    def __init__(self, nome, idade, cpf, email):
        self.nome = nome
        self.idade = idade
        self.cpf = cpf
        self.email = email
    # Método para apresentar os dados da pessoa
    def apresentar(self):
        print(f"Nome: {self.nome}, Idade: {self.idade}, CPF: {self.cpf}, Email: {self.email}")