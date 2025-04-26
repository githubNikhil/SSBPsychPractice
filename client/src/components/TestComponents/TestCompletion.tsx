import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import flag_heli from "../../../../attached_assets/Flag_heli.jpg";
import bellSound from "../../../../attached_assets/longBell.mp3";

interface TestCompletionProps {
  testName: string;
}

export default function TestCompletion({ testName }: TestCompletionProps) {
  const [location, setLocation] = useLocation();
  const [isGapScreen, setIsGapScreen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    const audio = new Audio(bellSound);
    audio.play().catch(error => console.error('Error playing sound:', error));
  }, []);

  const searchParams = new URLSearchParams(window.location.search);
  const mode = searchParams.get('mode'); // Will be 'full' when ?mode=full is in URL
  const test = searchParams.get('test');
  

  // Check if mode=full is present in the query parameters
  const isFullMode = mode==='full'?true:false;

  // Handle the 1-minute gap screen and redirection
  useEffect(() => {
    if (isFullMode) {
      setIsGapScreen(true);

      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            redirectToNextTest();
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isFullMode]);

  // console.log("test::"+test+" testName::"+testName);
  // Redirect to the next test in the sequence
  const redirectToNextTest = () => {
    switch (test) {
      case "WAT":
        setLocation("/wat-test?mode=full"); // Redirect to WAT
        break;
      case "SRT":
        setLocation("/srt-test?mode=full"); // Redirect to SRT
        break;
      case "SDT":
        setLocation("/sdt-selection"); // Redirect to SDT
        break;
      // case "SDT":
      //   setLocation("/test-selection"); // Redirect to Test Selection after SDT
      //   break;
      default:
        setLocation("/"); // Fallback to home
        break;
    }
  };

  if (isGapScreen) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <img
          src={flag_heli}
          alt="Jet Logo"
          className="absolute top-0 left-0 w-screen h-screen object-cover opacity-95"
        />
        <div className="max-w-lg mx-auto z-20">
          <Card className="p-8 text-center">
            <CardContent className="pt-6 pb-4 flex flex-col items-center">
              <h2 className="text-2xl font-semibold text-olive-green mb-4">
                Please Wait
              </h2>
              <p className="mb-6 text-gray-500">
                Relax, Crack your fingers. Your next test is comin up in : {timeLeft} seconds.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <img
        src={flag_heli}
        alt="Jet Logo"
        className="absolute top-0 left-0 w-screen h-screen object-cover opacity-95"
      />
      <div className="max-w-lg mx-auto z-20">
        <Card className="p-8 text-center">
          <CardContent className="pt-6 pb-4 flex flex-col items-center">
            <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold text-olive-green mb-4">
              Test Completed
            </h2>
            <p className="mb-6 text-gray-500">
              You have successfully completed the Test
            </p>
            <div className="space-y-4">
              <Link href="/">
                <Button
                  className="bg-olive-green hover:bg-olive-green/90 text-white font-medium py-3 px-6 rounded-lg w-full"
                >
                  Return to Home
                </Button>
              </Link>
              <Link href="/test-selection">
                <Button variant="outline" className="w-full">
                  Take Another Test
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
