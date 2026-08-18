import tkinter as tk
janela = tk.Tk() # criando a janela 
janela.title("Meu Programa em Python") # Título da janela
janela.geometry("300x200") # Define o tamanho (Largura x Altura)
botao = tk.Button(janela, text="Clique Aqui", command= "mostrar_mensagem")
botao.pack(pady=10)
janela.mainloop()
