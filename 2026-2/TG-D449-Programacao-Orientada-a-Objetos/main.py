from pessoa import Pessoa

def main():
    #1. criando um objeto com dados inseridos diretamente no código
    p1 = Pessoa("João", 30, "123.456.789-00", "joao@email.com")

    #2. criando um objeto com dados inseridos pelo usuário
    print("--- Bem-vindo ao sistema de cadastro de pessoas! ---")
    nome_in = input("Digite o nome da pessoa: ")
    idade_in = int(input("Digite a idade da pessoa: "))
    cpf_in = input("Digite o CPF da pessoa: ")
    email_in = input("Digite o email da pessoa: ")

    p2 = Pessoa(nome_in, idade_in, cpf_in, email_in)

    #3. usando os objetos criados
    print("\n--- Resultados ---")
    p1.apresentar()
    p2.apresentar()

# Execução principal
if __name__ == "__main__":
    main()
    