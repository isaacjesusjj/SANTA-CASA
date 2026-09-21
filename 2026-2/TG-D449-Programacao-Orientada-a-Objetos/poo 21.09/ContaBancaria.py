class ContaBancaria:
    def __init__(self, nome, saldo=0):
        self.nome = nome
        self.__saldo = saldo

    @property
    def saldo(self):
        return self.__saldo

    def _definir_saldo(self, valor):
        self.__saldo = valor

    def depositar(self, valor):
        if valor > 0:
            self.__saldo += valor
            print(f"Depósito de R${valor:.2f} realizado com sucesso.")
            return True

        print("O valor do depósito deve ser positivo.")
        return False

    def sacar(self, valor):
        if 0 < valor <= self.__saldo:
            self.__saldo -= valor
            print(f"Saque de R${valor:.2f} realizado com sucesso.")
            return True
        else:
            print("Saldo insuficiente para realizar o saque.")
            return False

    def consultar_saldo(self):
        print(f"Saldo atual de {self.nome}: R${self.__saldo:.2f}")