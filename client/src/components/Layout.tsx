import { Link } from "wouter";
import { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { LogOut, User, Home, Menu } from "lucide-react";
import { Drawer, DrawerTrigger, DrawerContent } from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gradient-primary text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold tracking-wide">Psych Test Simulator</h1>
          <nav className="flex items-center space-x-4">
            <ul className="flex space-x-6 items-center">
              <li>
                <Link href="/" className="text-white hover:text-light transition-colors duration-200 flex items-center">
                  <Home className="w-4 h-4 mr-1" />
                  Home
                </Link>
              </li>
              
              {isAuthenticated && isAdmin && (
                <li>
                  <Link href="/admin" className="text-white hover:text-light transition-colors duration-200">
                    Admin
                  </Link>
                </li>
              )}
              
              {isAuthenticated ? (
                <>
                  <li className="text-white text-sm opacity-80 px-2 py-1 bg-white/10 rounded-full flex items-center">
                    <User className="w-3 h-3 mr-1" />
                    {user?.username || "User"}
                  </li>
                  <li>
                    <button 
                      onClick={logout}
                      className="text-white hover:text-light transition-colors duration-200 flex items-center"
                    >
                      <LogOut className="w-4 h-4 mr-1" />
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link href="/admin-login" className="text-white hover:text-light transition-colors duration-200">
                    Login
                  </Link>
                </li>
              )}
            </ul>
            {/* Hamburger Drawer Trigger */}
            <Drawer>
              <DrawerTrigger asChild>
                <button className="ml-4 p-2 rounded hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white">
                  <Menu className="w-7 h-7" />
                </button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="p-4">
                  <Tabs defaultValue="privacy" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 mb-4">
                      <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
                      <TabsTrigger value="about">About Us</TabsTrigger>
                      <TabsTrigger value="contact">Contact Us</TabsTrigger>
                      <TabsTrigger value="terms">Terms & Conditions</TabsTrigger>
                    </TabsList>
                    <TabsContent value="privacy">
                      <h3 className="text-xl font-semibold mb-2">Privacy Policy</h3>
                      <p className="text-gray-700">We respect your privacy. All user data is kept confidential and is not shared with third parties. For more details, please contact us.</p>
                    </TabsContent>
                    <TabsContent value="about">
                      <h3 className="text-xl font-semibold mb-2">About Us</h3>
                      <p className="text-gray-700">This platform simulates SSB psychological tests to help candidates prepare for real assessments. Our mission is to provide a realistic and helpful practice environment.
                        We as a team are fully committed to provide best solution and option.
                      </p>
                    </TabsContent>
                    <TabsContent value="contact">
                      <h3 className="text-xl font-semibold mb-2">Contact Us</h3>
                      <p className="text-gray-700">For any queries or support, email us at <a href="mailto:inikhilthhp@gmail.com" className="text-blue-600 underline">inikhilthhp@gmail.com</a>.</p>
                    </TabsContent>
                    <TabsContent value="terms">
                      <h3 className="text-xl font-semibold mb-2">Terms & Conditions</h3>
                      <p className="text-gray-700">By using this platform, you agree to our terms and conditions. Please use the simulator responsibly and do not misuse the content provided as it takes lot of hard work to filter and prepare this.</p>
                    </TabsContent>
                  </Tabs>
                </div>
              </DrawerContent>
            </Drawer>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="bg-neutral text-white py-5">
        <div className="w-1/2 mx-auto px-4 text-center text-sm">
          <p>© {new Date().getFullYear()} Psych Test Simulator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
