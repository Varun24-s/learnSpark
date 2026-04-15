import { SensoryProvider } from "@/context/SensoryContext";
import "@/app/globals.css";

export const metadata = {
  title: "LearnSpark — Fun Learning for Every Child",
  description:
    "An inclusive learning platform designed for children. Learn numbers, shapes, and more with sensory-friendly interactive interactive activities.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SensoryProvider>{children}</SensoryProvider>
      </body>
    </html>
  );
}
