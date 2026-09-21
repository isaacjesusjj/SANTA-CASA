# import da classe
from ContaBancaria import ContaBancaria

# Herança e Polimorfismo
class ContaEspecial(ContaBancaria):
    def __init__(self, titular, limite):
        super().__init__(titular)
        self.limite = limite

    def sacar(self, valor):
        saldo_disponivel = self.saldo + self.limite
        if 0 < valor <= saldo_disponivel:
            self._definir_saldo(self.saldo - valor)
            print(f"Saque de R${valor:.2f} realizado com sucesso.")
            return True

        print("Erro: Saldo e limite insuficientes ou valor inválido.")
        return False

def main():
    print("Bem-vindo ao sistema do Banco!")
    nome = input("Digite o nome do titular para abrir a conta: ")
    limite_conta = float(input("Digite o limite aprovado para a Conta Especial: "))
    minha_conta = ContaEspecial(nome, limite_conta)

    while True:
        print("\n--- Caixa Eletrônico ---")
        print("1 para - Depositar")
        print("2 para - Sacar")
        print("3 para - Consultar Saldo")
        print("4 para - Sair")

        opcao = input("Escolha uma opção (1 ao 4): ")

        if opcao == '1':
            valor_deposito = float(input("Qual valor deseja depositar? R$ "))
            minha_conta.depositar(valor_deposito)
        elif opcao == '2':
            valor_saque = float(input("Qual valor deseja sacar? R$ "))
            minha_conta.sacar(valor_saque)
        elif opcao == '3':
            minha_conta.consultar_saldo()
        elif opcao == '4':
            print("Encerrando o sistema...")
            break
        else:
            print("Opção inválida! Tente novamente.")


if __name__ == "__main__":
    main()