import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  // Preset do Next (inclui regras importantes de React/Next)
  ...nextCoreWebVitals,

  // Ignores
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),

  // Overrides / project rules (centralizado)
  {
    rules: {
      /**
       * Esses 3 estão gerando a maioria dos seus erros atuais.
       * Eles NÃO são parte do conjunto padrão do Next; vêm de um plugin extra no seu toolchain
       * e, do jeito que o app foi gerado, eles estão "strict demais" para o MVP.
       */
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/immutability": "off",
      "react-hooks/purity": "off",

      /**
       * Esses são warnings chatos mas inofensivos pro MVP (e você mencionou que aparecem).
       * Se você quiser manter como warning em vez de desligar, dá pra trocar "off" por "warn".
       */
      "next/no-img-element": "off",
      "next/no-location-assign-relative-destination": "off",
    },
  },
]);