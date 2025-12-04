# 📤 Como Fazer Push do Código

## Opção 1: Usando HTTPS (Mais Fácil)

```bash
cd /Users/pdrooh/Documents/psicologia

# Mudar remote para HTTPS
git remote set-url origin https://github.com/pdrooh/serena-app.git

# Fazer push
git push -u origin main
```

Você será solicitado a fazer login no GitHub.

---

## Opção 2: Usando GitHub Desktop

1. Baixe: https://desktop.github.com
2. Abra o GitHub Desktop
3. File > Add Local Repository
4. Selecione: `/Users/pdrooh/Documents/psicologia`
5. Clique em "Publish repository"
6. Escolha: `pdrooh/serena-app`

---

## Opção 3: Interface Web do GitHub

1. Acesse: https://github.com/pdrooh/serena-app
2. Clique em "uploading an existing file"
3. Arraste todos os arquivos
4. Commit

---

## Opção 4: Configurar SSH (Para Futuro)

Se quiser usar SSH:

```bash
# Gerar chave SSH
ssh-keygen -t ed25519 -C "seu-email@example.com"

# Copiar chave pública
cat ~/.ssh/id_ed25519.pub

# Adicionar no GitHub:
# 1. Vá em GitHub > Settings > SSH and GPG keys
# 2. Clique "New SSH key"
# 3. Cole a chave
```

Depois:
```bash
git remote set-url origin git@github.com:pdrooh/serena-app.git
git push -u origin main
```

---

**Recomendação:** Use a Opção 1 (HTTPS) - é a mais simples!

