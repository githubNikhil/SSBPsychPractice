import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TestTimer from "@/components/TestTimer";
import TestCompletion from "@/components/TestComponents/TestCompletion";
import { TEST_DURATIONS, calculateProgress } from "@/lib/testUtils";
import { SRTContent } from "@shared/schema";
import vikrant from '../../../../attached_assets/vikrant.jpg';
import bellSound from "../../../../attached_assets/bellSound.mp3";

export default function SRT() {
  const [, setLocation] = useLocation();
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [totalScenariosCompleted, setTotalScenariosCompleted] = useState(0);
  const searchParams = new URLSearchParams(window.location.search);
  const mode = searchParams.get('mode');
  const isFullMode = mode === 'full';

  const { data: scenarios = [], isLoading, error } = useQuery<SRTContent[]>({
    queryKey: ['/api/srt'],
  });

  // Handle global timer completion
  const handleTimerComplete = () => {
    if (isFullMode) {
      setLocation(`/test-completion?mode=full&test=SDT`);
    } else {
      setIsTestComplete(true);
    }
  };

  // Handle next button click
  const handleNext = () => {
    if (currentScenarioIndex < scenarios.length - 1) {
      setCurrentScenarioIndex(prev => prev + 1);
      setTotalScenariosCompleted(prev => prev + 1);
      playBellSound();
    }
  };

  const playBellSound = async () => {
    try {
      const audio = new Audio(bellSound);
      await audio.play();
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  const progressPercentage = calculateProgress(
    currentScenarioIndex + 1,
    Math.min(scenarios.length, TEST_DURATIONS.SRT.TOTAL_SCENARIOS)
  );

  if (isTestComplete) {
    return <TestCompletion 
      testName="Situation Reaction Test" 
      // additionalInfo={`Total scenarios completed: ${totalScenariosCompleted}`}
    />;
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <img
        src={vikrant}
        alt="Jet Logo"
        className="absolute top-0 left-0 w-screen h-screen object-cover opacity-70"
      />
      <div className="max-w-lg mx-auto z-10">
        <Card>
          <CardHeader className="p-4 border-b border-gray-200 bg-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                <span>Situation number: {totalScenariosCompleted+1}</span>
              </div>
              <TestTimer
                initialTime={TEST_DURATIONS.SRT.TOTAL_TIME}
                onTimeComplete={handleTimerComplete}
                labelText="Total Time Remaining"
              />
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
              <div
                className="bg-olive-green h-2 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </CardHeader>

          <CardContent className="p-6 bg-white">
            <div className="mb-6">
              <div className="p-4 rounded-lg bg-gray-200">
                {isLoading ? (
                  <div className="text-center">Loading scenarios...</div>
                ) : error ? (
                  <div className="text-center text-red-500">Error loading scenarios</div>
                ) : scenarios[currentScenarioIndex] ? (
                  <p className="text-gray-800">{scenarios[currentScenarioIndex].scenario}</p>
                ) : (
                  <div className="text-center text-gray-500">No more scenarios available</div>
                )}
              </div>
            </div>
            <div className="flex justify-end">
              <Button
              className="w-full mt-4 hover:opacity-100 bg-blue-400 hover:bg-blue-600"
              onClick={handleNext}
              disabled={currentScenarioIndex >= scenarios.length - 1}
              >
              Next Situation
              </Button>
            </div>
          </CardContent>

          <CardFooter className="p-4 border-t border-gray-200 bg-gray-200 rounded-b-lg">
            <Button
              variant="secondary"
              className="w-full mt-4 hover:opacity-100 bg-orange-400 hover:bg-orange-500"
              onClick={() => setLocation("/test-selection")}
            >
              Exit Test
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}