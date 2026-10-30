# Entrelinhas

Portal fictício criado para um trabalho escolar sobre *A metamorfose*, de Franz Kafka.

## Executar localmente

Requer Node.js 22.12 ou superior (linha 22 LTS).

```bash
npm ci
npm run dev
```

Para testar a versão de produção localmente:

```bash
npm run build
npm run preview
```

## Publicar no GitHub Pages

O Vite está configurado com a base `/Entrelinhas/`. O workflow em `.github/workflows/deploy.yml` instala dependências com `npm ci`, compila e publica somente `dist` quando há push para `main`; também pode ser iniciado manualmente pela aba Actions.

1. Envie o projeto para o repositório `rionneoficial-pixel/Entrelinhas` na branch `main`.
2. No GitHub, abra **Settings → Pages** e selecione **GitHub Actions** em **Build and deployment → Source**.
3. Acompanhe o workflow **Deploy static content to Pages** na aba **Actions**.

Após a publicação, o site estará em <https://rionneoficial-pixel.github.io/Entrelinhas/>. A matéria abre por navegação hash em <https://rionneoficial-pixel.github.io/Entrelinhas/#/caso-samsa>, sem exigir rotas de servidor.

As interações são locais ao navegador; o projeto não usa servidor, cadastro ou serviços pagos.
