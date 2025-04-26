import { useState, useMemo, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TestTimer from "@/components/TestTimer";
import TestCompletion from "@/components/TestComponents/TestCompletion";
import { TEST_DURATIONS, calculateProgress, generateBlankSlide } from "@/lib/testUtils";
import bellSound from "../../../../attached_assets/bellSound.mp3";


interface TATProps {
  onTestComplete?: () => void;
}

export default function TAT({ onTestComplete }: TATProps = {}) {
  const [location] = useLocation();
  const [, setLocation] = useLocation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImage, setShowImage] = useState(true);
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [displayTime, setDisplayTime] = useState(TEST_DURATIONS.TAT.DISPLAY_TIME);
  const searchParams = new URLSearchParams(window.location.search);
  const mode = searchParams.get('mode');// Will be 'full' when ?mode=full is in URL
  
  const isFullMode=mode==='full'?true:false;
  // Fetch random TAT image set
  const { data, isLoading, error } = useQuery<{ success: boolean; images: string[] }>({
    queryKey: ['/api/tat/random-set'],
  });

  // Extract filename from full path
  const getImageFilename = (fullPath: string) => {
    return fullPath.split('/').pop() || fullPath;
  };

  // Process image URLs
  const processImageUrl = (imageUrl: string) => {
    try {
      let imageName = getImageFilename(imageUrl);
      // Create absolute URL from relative path
      const url = new URL(`../../../../uploads/images/${imageName}`, import.meta.url).href;
      console.log('HREF image URL:', url);
      return url;
    } catch (error) {
      console.error('Error processing image URL:', error);
      return imageUrl;
    }
  };

  // Process images when data is available
  const processedImages = useMemo(() => {
    if (!data?.success || !data?.images) return [];
    return data.images.map(img => processImageUrl(img));
  }, [data]);

  // Add blank slide at the end
  const allImages = [...processedImages, generateBlankSlide().imageurl];

  // Timer completion handler - toggles between image display and gap
  const handleTimerComplete = useCallback(() => {
    if (showImage) {
      // Image time completed, start gap timer
      setShowImage(false);
      setDisplayTime(TEST_DURATIONS.TAT.GAP_TIME);
    } else {
      // Gap time completed, show next image or complete test
      if (currentImageIndex < allImages.length - 1) {
        setCurrentImageIndex(prevIndex => prevIndex + 1);
        setShowImage(true);
        setDisplayTime(TEST_DURATIONS.TAT.DISPLAY_TIME);
      } else {
        // Redirect to TestCompletion with mode=full if applicable
        if (isFullMode) {
          console.log('Mode full in TAT found and setting same in test-completion');
          setLocation(`/test-completion?mode=full&test=WAT`);
        } else {
          setIsTestComplete(true);
        }
      }
    }
  }, [showImage, currentImageIndex, allImages.length, isFullMode, setLocation]);

  // Calculate progress percentage
  const progressPercentage = calculateProgress(currentImageIndex + 1, TEST_DURATIONS.TAT.TOTAL_IMAGES);

  // Current image
  const currentImage = allImages[currentImageIndex];
  
  const audio = new Audio(bellSound);

  // Play sound when a new image is displayed
  useEffect(() => {
    if (showImage && currentImage) { // Replace with the actual path to your sound file

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
  }, [showImage, currentImage]);

  if (isTestComplete) {
    if (onTestComplete) {
      onTestComplete();
      return null;
    }
    return <TestCompletion testName="Thematic Apperception Test" />;
  }

  return (
    <div className="max-w-lg mx-auto">
      <Card>
        <CardHeader className="p-4 border-b border-gray-200 bg-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-olive-green">Thematic Apperception Test</h3>
            <div className="text-sm text-gray-500">
              <span>{currentImageIndex + 1} of {TEST_DURATIONS.TAT.TOTAL_IMAGES}</span>
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
              initialTime={displayTime} 
              onTimeComplete={handleTimerComplete}
            />
          </div>

          <div className="flex items-center justify-center mb-6 rounded-lg overflow-hidden h-80">
            {isLoading ? (
              <div className="text-center">Loading images...</div>
            ) : error ? (
              <div className="text-center text-red-500">Error loading images</div>
            ) : showImage && currentImage ? (
              <img 
                src={currentImage}
                alt={`TAT image ${currentImageIndex + 1}`} 
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-lg font-medium bg-gray-200 text-gray-600">
                Please write your story around picture...
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 border-t border-gray-200 bg-gray-200 rounded-b-lg">
          <Button 
            variant="secondary"
            className="w-full"
            onClick={() => setLocation("/test-selection")}
          >
            Exit Test
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}