// Fontes locais (fontsource): o render não depende de internet.
import "@fontsource/unbounded/latin-500.css";
import "@fontsource/unbounded/latin-700.css";
import "@fontsource/unbounded/latin-800.css";
import "@fontsource/unbounded/latin-900.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/inter/latin-700.css";
import "@fontsource/inter/latin-800.css";
import "@fontsource/montserrat/latin-700.css";
import "@fontsource/montserrat/latin-800.css";
import "@fontsource/montserrat/latin-900.css";
import "@fontsource/montserrat/latin-800-italic.css";
import "@fontsource/montserrat/latin-900-italic.css";
import "@fontsource/anton/latin-400.css";
import brandJson from "../../brand.json";

export const brand = {
  ...brandJson,
  font: { display: "Unbounded, sans-serif", text: "Inter, sans-serif", titulo: "Montserrat, sans-serif", impacto: "Anton, sans-serif" },
};
export const C = brandJson.cores;
