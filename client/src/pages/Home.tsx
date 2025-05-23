import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import Heli_logo from '../../../attached_assets/Heli_logo.png';
import tank from '../../../attached_assets/Tank.png';

export default function Home() {
  const [, setLocation] = useLocation();

  const handlePracticePsych = () => {
    setLocation("/test-selection");
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral mb-3">
            Psychological Test Simulator
          </h1>
          <p className="text-slate-600 max-w-lg mx-auto">
            Experience realistic psychological testing scenarios designed for Services Selection Board (SSB) evaluations. This simulator helps candidates familiarize themselves with the format, timing, and types of tests encountered during actual SSB interviews.
          </p>
            <p 
            className="text-red-500 animate-fade"
            style={{
              animation: "fade 2s infinite",
            }}
            >
            * For best experience please view in landscape mode
            </p>
            <style>
            {`
              @keyframes fade {
              20%, 100% { opacity: 1; }
              50% { opacity: 0; }
              }
            `}
            </style>
        </div>
        
        <Card className="bg-transparent rounded-xl shadow-lg overflow-hidden border-0 relative">
          <img 
            src={tank} 
            alt="Tank" 
            className="absolute inset-0 w-full h-full object-cover opacity-35"
          />
          <div className="h-2 bg-gradient-primary"></div>
          <CardContent className="p-8 relative z-10">
            <div className="flex flex-col items-center">
              {/* <div className="w-16 h-16 rounded-full bg-light-accent flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
            <path d="M2 17l10 5 10-5"></path>
            <path d="M2 12l10 5 10-5"></path>
          </svg>
              </div> */}
              
              <h2 className="text-2xl font-semibold text-center mb-4 text-primary">
          Ready to Begin Testing?
              </h2>
              
              <p className="mb-8 text-center text-gray-600 max-w-md">
          <strong>Practice standardized psychological tests with precise timing and professional presentation. Select a specific test or take the full assessment.
              </strong></p>
              
              <Button 
          className="bg-secondary text-white font-medium py-4 px-8 rounded-lg shadow-md text-lg relative group"
          onClick={handlePracticePsych}
              >
          <span className="block group-hover:hidden">
            Practice Psych
          </span>
          <span className="hidden group-hover:block text-2xl">
            <img 
              src={Heli_logo} 
              alt="Heli_logo" 
              className="w-full h-full object-contain"
            />
          </span>
          <span className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/80 to-secondary/60 group-hover:bg-opacity-90 rounded-lg transition-all duration-300"></span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
