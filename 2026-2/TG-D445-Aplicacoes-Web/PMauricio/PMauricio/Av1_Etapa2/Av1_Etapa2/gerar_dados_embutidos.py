# Gera dados/dados_embutidos.js a partir dos arquivos dados/*.json
#
# Para que serve: quando a urna.html é aberta com duplo clique (sem servidor), o
# navegador não deixa o JavaScript ler os .json. Esta cópia dos MESMOS dados em um
# arquivo .js resolve isso. Quando houver servidor (Live Server, GitHub Pages),
# a urna lê os .json normalmente.
#
# Quando rodar: sempre que editar ou trocar algum arquivo de dados/*.json.
# Como rodar (dentro da pasta da urna):   python gerar_dados_embutidos.py

import json
import os
from datetime import datetime, timezone

pasta_base = os.path.dirname(os.path.abspath(__file__))
pasta_dados = os.path.join(pasta_base, "dados")

partidos = {}
for nome_arquivo in sorted(os.listdir(pasta_dados)):
    if nome_arquivo.lower().endswith(".json"):
        with open(os.path.join(pasta_dados, nome_arquivo), encoding="utf-8") as f:
            partidos[nome_arquivo[:-5]] = json.load(f)

conteudo = {
    "geradoEm": datetime.now(timezone.utc).isoformat(),
    "partidos": partidos
}

saida = os.path.join(pasta_dados, "dados_embutidos.js")
with open(saida, "w", encoding="utf-8") as f:
    f.write("// ARQUIVO GERADO por gerar_dados_embutidos.py - não edite à mão.\n")
    f.write("// É uma cópia dos arquivos dados/*.json para a urna funcionar com duplo clique.\n")
    f.write("const DADOS_EMBUTIDOS = ")
    f.write(json.dumps(conteudo, ensure_ascii=False, indent=2))
    f.write(";\n")

print("Gerado:", saida)
for nome, lista in partidos.items():
    quantidade = len(lista) if isinstance(lista, list) else len(lista.get("candidaturas", []))
    print("  ", nome, "-", quantidade, "candidaturas")
