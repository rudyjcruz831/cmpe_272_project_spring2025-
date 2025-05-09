"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

export default function PersonalRecsTest() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [userType, setUserType] = useState<'student' | 'worker' | ''>('');
  const [formData, setFormData] = useState({
    budget: "",
    location: "",
    mustHaves: "",
    anyOther: "",
    institution: "",
    hobbies: "",
  });

  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse(null);

    // First check if the API is running
    try {
      const testResponse = await fetch("http://localhost:8000/");
      if (!testResponse.ok) {
        throw new Error("API server is not responding");
      }
      console.log("API server is running");
    } catch (error) {
      console.error("API server check failed:", error);
      toast.error("API server is not responding. Please make sure it's running.");
      setIsLoading(false);
      return;
    }

    try {
      console.log("Sending request to recommend_places endpoint");
      const response = await fetch("http://localhost:8000/recommend_places", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userType,
          submittedAt: new Date().toISOString(),
        }),
      });

      console.log("Response status:", response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("Error response:", errorData);
        throw new Error(
          errorData?.error || 
          `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      console.log("Success response:", data);
      setResponse(data);
      toast.success("Recommendations received successfully!");
    } catch (error) {
      console.error("Error details:", error);
      toast.error(error instanceof Error ? error.message : "Failed to get recommendations");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Personal Recommendations Test</h1>
      <p className="text-gray-600 mb-6">
        Test the personal recommendations API by filling out the form below.
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
            value={formData.institution}
            onChange={handleChange("institution")}
            placeholder={userType === 'student' ? 'e.g. San Jose State University' : 'e.g. Google, Apple, etc.'}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="budget">What is your budget range?</Label>
          <Textarea
            id="budget"
            value={formData.budget}
            onChange={handleChange("budget")}
            placeholder="e.g. $1,200–$1,800 per month"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="location">Preferred location / neighborhood?</Label>
          <Textarea
            id="location"
            value={formData.location}
            onChange={handleChange("location")}
            placeholder="e.g. Downtown San Jose, East Bay, …"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="mustHaves">Any must-have features?</Label>
          <Textarea
            id="mustHaves"
            value={formData.mustHaves}
            onChange={handleChange("mustHaves")}
            placeholder="e.g. In-unit laundry, pet-friendly, parking…"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="hobbies">What are your hobbies or interests?</Label>
          <Textarea
            id="hobbies"
            value={formData.hobbies}
            onChange={handleChange("hobbies")}
            placeholder="e.g. Hiking, reading, gaming, sports…"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="anyOther">Anything else you'd like us to know?</Label>
          <Textarea
            id="anyOther"
            value={formData.anyOther}
            onChange={handleChange("anyOther")}
            placeholder="Open-ended…"
            className="mt-1"
          />
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Getting Recommendations..." : "Get Recommendations"}
        </Button>
      </form>

      {response && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Response:</h2>
          <pre className="whitespace-pre-wrap text-sm">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 