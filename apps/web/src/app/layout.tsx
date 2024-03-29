import '../styles/tailwind.css';
import GlobalProvider from "../providers";

export const metadata = {
  title: 'Welcome to app',
  description: 'Generated by create-nx-workspace',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light" dir="ltr" suppressHydrationWarning={true}>
      <body className={`bg-white dark:bg-white h-full`}>
        <GlobalProvider options={{ key: 'mui' }}>{children}</GlobalProvider>
      </body>
    </html>
  );
}
