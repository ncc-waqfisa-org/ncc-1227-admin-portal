import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Amplify } from "aws-amplify";
import awsExports from "../src/aws-exports";
import "@aws-amplify/ui-react/styles.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  BarElement,
  ArcElement,
} from "chart.js";
import { StudentProvider } from "../context/StudentContext";
import { AppProvider } from "../context/AppContext";
import { AuthProvider } from "../hooks/use-auth";
import { EducationProvider } from "../context/EducationContext";
import NextNProgress from "nextjs-progressbar";
import { useRouter } from "next/router";
import { appWithTranslation } from "next-i18next";

Amplify.configure({ ...awsExports, ssr: true });

//register chart js imports
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend,
  Filler,
  BarElement,
  ArcElement
);

function App({ Component, pageProps }: AppProps) {
  const { locale } = useRouter();

  const dir = locale === "ar" ? "rtl" : "ltr";
  return (
    <div dir={dir} className={locale === "ar" ? "font-IBMArabic" : "font-IBM"}>
      <AuthProvider>
        <AppProvider>
          <StudentProvider>
            <EducationProvider>
              <NextNProgress color="#E1BA3D" />
              <Component {...pageProps} />
            </EducationProvider>
          </StudentProvider>
        </AppProvider>
      </AuthProvider>
    </div>
  );
}

export default appWithTranslation(App);
