export const metadata = {
  title: 'Todo App',
  description: 'full-stack Todo application with Gemini summary.',
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}