import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Revenue Intelligence Copilot",
  description: "AI-powered revenue intelligence for sales and marketing",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <div className="flex min-h-screen">
          <nav className="w-56 bg-white border-r border-gray-200 p-4">
            <h1 className="text-lg font-bold mb-6">RIC</h1>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="block px-3 py-2 rounded text-sm hover:bg-gray-100"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="/chat"
                  className="block px-3 py-2 rounded text-sm hover:bg-gray-100"
                >
                  Chat
                </a>
              </li>
              <li>
                <a
                  href="/docs"
                  className="block px-3 py-2 rounded text-sm hover:bg-gray-100"
                >
                  Doc Finder
                </a>
              </li>
              <li>
                <a
                  href="/insights"
                  className="block px-3 py-2 rounded text-sm hover:bg-gray-100"
                >
                  Insights
                </a>
              </li>
              <li>
                <a
                  href="/assumptions"
                  className="block px-3 py-2 rounded text-sm hover:bg-gray-100"
                >
                  Assumptions
                </a>
              </li>
              <li>
                <a
                  href="/admin"
                  className="block px-3 py-2 rounded text-sm hover:bg-gray-100"
                >
                  Admin
                </a>
              </li>
            </ul>
          </nav>
          <main className="flex-1 p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
