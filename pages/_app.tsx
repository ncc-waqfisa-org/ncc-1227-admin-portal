import "../styles/globals.css";
import type { AppProps } from "next/app";
// import { Amplify, DataStore, Storage } from "aws-amplify";
// import awsExports from "../src/aws-exports";
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
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BatchProvider } from "../context/BatchContext";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { initializeAwsConfig } from "../src/aws_config";
import { Toaster } from "../components/ui/sonner";

// initialize aws config
initializeAwsConfig();

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

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 60 * 1000,
      },
    },
  });

  const dir = locale === "ar" ? "rtl" : "ltr";
  return (
    <div dir={dir} className={locale === "ar" ? "font-IBMArabic" : "font-IBM"}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppProvider>
            <BatchProvider>
              <StudentProvider>
                <EducationProvider>
                  <NextNProgress color="#E1BA3D" />
                  <Component {...pageProps} />
                </EducationProvider>
              </StudentProvider>
            </BatchProvider>
          </AppProvider>
        </AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
      <Toaster />
    </div>
  );
}

export default appWithTranslation(App);
