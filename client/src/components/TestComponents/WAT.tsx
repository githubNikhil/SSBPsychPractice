import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TestTimer from "@/components/TestTimer";
import TestCompletion from "@/components/TestComponents/TestCompletion";
import { TEST_DURATIONS, calculateProgress } from "@/lib/testUtils";
import { WATContent } from "@shared/schema";
import multi_ships from "../../../../attached_assets/multi_ships.jpg";
import bellSound from "../../../../attached_assets/bellSound.mp3";

export default function WAT() {
  const [, setLocation] = useLocation();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [resetTimer, setResetTimer] = useState(0);
  const searchParams = new URLSearchParams(window.location.search);
  const mode = searchParams.get('mode');// Will be 'full' when ?mode=full is in URL
  
  const isFullMode=mode==='full'?true:false;

  // Fetch WAT words
  const {
    data: words = [],
    isLoading,
    error,
  } = useQuery<WATContent[]>({
    queryKey: ["/api/wat"],
  });

  // Timer completion handler - moves to next word
  const handleTimerComplete = useCallback(() => {
    if (
      currentWordIndex <
      Math.min(words.length, TEST_DURATIONS.WAT.TOTAL_WORDS) - 1
    ) {
      setCurrentWordIndex((prevIndex) => prevIndex + 1);
      setResetTimer(prev => prev + 1); // Force timer reset
    } else {
      if(isFullMode){
        console.log('Mode full in WAT found and setting same in test-completion');
        setLocation(`/test-completion?mode=full&test=SRT`);
      }
      else{
        setIsTestComplete(true);
      }
    }
  }, [currentWordIndex, words.length, isFullMode]);

  // Calculate progress percentage
  const progressPercentage = calculateProgress(
    currentWordIndex + 1,
    Math.min(words.length, TEST_DURATIONS.WAT.TOTAL_WORDS)
  );

  // Current word
  const currentWord = words[currentWordIndex];

  const audio = new Audio(bellSound);

  // Play sound when a new word is displayed
  useEffect(() => {
    if (currentWord) {
      // Attempt to play the audio and handle any errors
      const playAudio = async () => {
        try {
          await audio.play();
        } catch (error) {
          console.error("Error playing sound:", error);
        }
      };

      playAudio();
    }
  }, [currentWord]);

  if (isTestComplete) {
    return <TestCompletion testName="Word Association Test" />;
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <img
        src={multi_ships}
        alt="Jet Logo"
        className="absolute top-0 left-0 w-screen h-screen object-cover opacity-90" // Full-screen image
      />
      <div className="max-w-lg mx-auto z-20">
        <Card>
          <CardHeader className="p-4 border-b border-gray-200 bg-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                <span>
                  {currentWordIndex + 1} of{" "}
                  {Math.min(words.length, TEST_DURATIONS.WAT.TOTAL_WORDS)}
                </span>
              </div>
            </div>

            <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
              <div
                className="bg-olive-green h-2 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </CardHeader>

          <CardContent className="p-6 bg-white">
            <div className="text-center mb-6">
              <TestTimer
                key={resetTimer}
                initialTime={TEST_DURATIONS.WAT.DISPLAY_TIME}
                onTimeComplete={handleTimerComplete}
                labelText="Please write the very first though that comes to your mind"
              />
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-center h-40 rounded-lg bg-light-blue bg-opacity-20">
                {isLoading ? (
                  <div className="text-center">Loading words...</div>
                ) : error ? (
                  <div className="text-center text-red-500">
                    Error loading words
                  </div>
                ) : currentWord ? (
                  <h2 className="text-3xl font-semibold text-gray-800">
                    {currentWord.word}
                  </h2>
                ) : (
                  <div className="text-center text-gray-500">
                    No words available
                  </div>
                )}
              </div>
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
