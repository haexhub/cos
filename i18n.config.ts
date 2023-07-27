export default defineI18nConfig(() => ({
  messages: {
    en: {
      welcome: "Welcome",
      account: {
        login: "Sign in to your account",
        create: "Create new account",
        alreadyExist: "I already have an account",
        loginWithKey: "Login with a saved key",
        paste: "Paste",
        json: "JSON",
        qr: "QR",
      },
    },
    de: {
      welcome: "Willkommen",
      account: {
        login: "Melde dich mit deinem Account an",
        loginWithKey: "Login mit gespeicherten Schlüssel",
        create: "Erstelle neuen Account",
        alreadyExist: "Ich habe bereits einen Account",
        paste: "Einfügen",
        json: "JSON",
        qr: "QR",
      },
    },
  },
}));
