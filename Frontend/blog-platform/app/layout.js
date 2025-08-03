import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/AuthContext"
import { SidebarProvider } from "@/contexts/SidebarContext"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { Chatbot } from "@/components/Chatbot"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "BlogPlatform - Share Your Stories",
  description: "A modern blog platform for sharing your thoughts and connecting with others",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <SidebarProvider>
              <div className="min-h-screen bg-background">
                <Header />
                <div className="flex">
                  <Sidebar />
                  <main className="flex-1 md:ml-0 min-h-[calc(100vh-4rem)]">{children}</main>
                </div>
                <Chatbot />
              </div>
              <Toaster />
            </SidebarProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
