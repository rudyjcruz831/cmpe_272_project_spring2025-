"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function QuestionnairePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [userType, setUserType] = React.useState<'student' | 'worker' | ''>('');
  const [answers, setAnswers] = React.useState({
    budget: "",
    location: "",
    mustHaves: "",
    anyOther: "",
    institution: "",
    hobbies: "",
  });

  const handleChange = (field: keyof typeof answers) => (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setAnswers((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const validateForm = () => {
    if (!answers.budget.trim()) {
      toast.error("Please provide your budget range");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      
      const submissionData = {
        ...answers,
        userType,
      };

      const response = await fetch('/api/questionnaire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit questionnaire');
      }

      toast.success("Thank you for your submission!", {
        description: "We'll use your preferences to find the perfect property for you.",
        duration: 5000,
      });
      
      // Clear the form
      setAnswers({
        budget: "",
        location: "",
        mustHaves: "",
        anyOther: "",
        institution: "",
        hobbies: "",
      });
      setUserType('');
      
      // Redirect after a short delay to allow the user to see the success message
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error) {
      console.error('Error submitting questionnaire:', error);
      toast.error("Failed to submit preferences", {
        description: "Please try again. If the problem persists, contact support.",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Property Preferences</h1>
      <p className="text-gray-600 mb-6">
        Help us understand your housing needs better by answering these questions.
        Your responses will help us find the perfect property for you.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <Label>Are you a student or worker?</Label>
          <RadioGroup
            value={userType}
            onValueChange={(value) => setUserType(value as 'student' | 'worker')}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="student" id="student" />
              <Label htmlFor="student">Student</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="worker" id="worker" />
              <Label htmlFor="worker">Worker</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="institution">
            {userType === 'student' ? 'Which school do you attend?' : 'Where do you work?'}
          </Label>
          <Textarea
            id="institution"
            value={answers.institution}
            onChange={handleChange("institution")}
            placeholder={userType === 'student' ? 'e.g. San Jose State University' : 'e.g. Google, Apple, etc.'}
            className="mt-1 w-full"
          />
        </div>

        <div>
          <Label htmlFor="budget">What is your budget range? *</Label>
          <Textarea
            id="budget"
            value={answers.budget}
            onChange={handleChange("budget")}
            placeholder="e.g. $1,200–$1,800 per month"
            className="mt-1 w-full"
            required
          />
        </div>

        <div>
          <Label htmlFor="location">Preferred location / neighborhood?</Label>
          <Textarea
            id="location"
            value={answers.location}
            onChange={handleChange("location")}
            placeholder="e.g. Downtown San Jose, East Bay, …"
            className="mt-1 w-full"
          />
        </div>

        <div>
          <Label htmlFor="mustHaves">Any must-have features?</Label>
          <Textarea
            id="mustHaves"
            value={answers.mustHaves}
            onChange={handleChange("mustHaves")}
            placeholder="e.g. In-unit laundry, pet-friendly, parking…"
            className="mt-1 w-full"
          />
        </div>

        <div>
          <Label htmlFor="hobbies">What are your hobbies or interests?</Label>
          <Textarea
            id="hobbies"
            value={answers.hobbies}
            onChange={handleChange("hobbies")}
            placeholder="e.g. Hiking, reading, gaming, sports…"
            className="mt-1 w-full"
          />
        </div>

        <div>
          <Label htmlFor="anyOther">Anything else you'd like us to know?</Label>
          <Textarea
            id="anyOther"
            value={answers.anyOther}
            onChange={handleChange("anyOther")}
            placeholder="Open-ended…"
            className="mt-1 w-full"
          />
        </div>

        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? "Submitting..." : "Submit Preferences"}
        </Button>
      </form>
    </div>
  );
}
