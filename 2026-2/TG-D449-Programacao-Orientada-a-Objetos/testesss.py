import tkinter as tk
from tkinter import messagebox

def mostrar_mensagem():
    # Cria uma pequena caixa de alerta ao clicar no botão
    messagebox.showinfo("Saudação", "Olá Mundo! Este é meu primeiro programa gráfico.")

def main():
    # 1. Criando a janela principal
    janela = tk.Tk()
    janela.title("Meu Programa em Python") # Título da janela
    janela.geometry("300x200") # Define o tamanho (Largura x Altura)

    # 2. Criando um rótulo (Label) de texto
    label_boas_vindas = tk.Label(janela, text="Hello World!", font=("Arial", 16, "bold"))
    label_boas_vindas.pack(pady=20) # Adiciona à janela com um espaçamento (padding)

    # 3. Criando um botão
    # O parâmetro 'command' indica qual função será executada ao clicar
    botao = tk.Button(janela, text="Clique Aqui", command=mostrar_mensagem)
    botao.pack(pady=10)

    # 4. Iniciando o loop da interface gráfica
    # Sem isso, a janela abre e fecha instantaneamente
    janela.mainloop()

if __name__ == "__main__":
    main()