import { Link, useLocation } from "wouter";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Jet_main from '../../../../attached_assets/Jet_main.png';

export default function SDTSelection() {
  const [, setLocation] = useLocation();

  const handleStudentSelection = () => {
    setLocation("/sdt-test?type=student");
  };

  const handleProfessionalSelection = () => {
    setLocation("/sdt-test?type=professional");
  };

  return (
  <div className="relative min-h-screen flex items-center justify-center">
    <img
      src={Jet_main}
      alt="Jet Logo"
      className="absolute top-0 left-0 w-screen h-screen object-cover opacity-70" // Full-screen image
    />
    <div className="max-w-lg mx-auto z-10">  {/* Ensure the card is above the image */}
      <Card>
        <CardHeader className="p-4 border-b border-gray-200 bg-blue-200 rounded-lg">
          <h3 className="text-3xl font-semibold text-olive-green text-center">(SDT) Self Description Test</h3>
        </CardHeader>
        
        <CardContent className="p-6 bg-white rounded-lg shadow-md">
          <div className="text-center mb-8">
            <h4 className="text-xl font-medium mb-6">What Describes You the Best?</h4>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
                  <div className="flex flex-col space-y-4 w-full">
                  <Button 
                    className="w-full bg-primary text-grey font-medium py-4 px-8 rounded-lg shadow-md text-lg hover:bg-primary/80 relative group"
                    onClick={handleStudentSelection}
                  >
                    Student
                  </Button>
                  <Button 
                    className="w-full bg-primary text-grey font-medium py-4 px-8 rounded-lg shadow-md text-lg hover:bg-primary/80 relative group"
                    onClick={handleProfessionalSelection}
                  >
                    Working Professional
                  </Button>
                  </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 border-t border-gray-200 bg-gray-200 rounded-b-lg">
          <Button 
            variant="secondary"
            className="w-full mt-4 hover:opacity-100 bg-orange-400 hover:bg-orange-500"
            onClick={() => setLocation("/test-selection")}
          >
            Back
          </Button>
        </CardFooter>
      </Card>
    </div>
</div>


  );
}
