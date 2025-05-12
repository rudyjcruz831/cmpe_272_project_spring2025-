"use client";

import { useState, useEffect } from 'react';
import { Check, User, Briefcase, Heart, Book, Music, Film, Globe, Code, Camera, Coffee, ArrowLeft, ArrowRight, MapPin, Bus, Car, Train, Bike, Utensils, DollarSign, ShoppingBag, Dumbbell, Ticket, Palette, Moon, Gamepad, Calendar, Download, Save, Send } from 'lucide-react';

// Define the form data type for TypeScript
interface FormData {
  occupation: string;
  company: string;
  interests: string[];
  transportation: string[];
  completed: boolean;
  serverId?: string;
}

// Main component
export default function UserProfileForm() {
  // States to track current section and selections
  const [currentSection, setCurrentSection] = useState<string>('occupation');
  const [formData, setFormData] = useState<FormData>({
    occupation: '',
    company: '',
    interests: [],
    transportation: [],
    completed: false
  });
  const [submitStatus, setSubmitStatus] = useState({
    isSubmitting: false,
    isSuccess: false,
    error: null as string | null
  });

  // Check for saved data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('userProfileData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
        // If there's complete data, show the summary
        if (parsedData.completed) {
          setCurrentSection('summary');
        }
      } catch (error) {
        console.error('Error parsing saved profile data:', error);
      }
    }
  }, []);

  // Predefined occupation options
  const occupationOptions = [
    { id: 'student', label: 'Student', icon: <Book size={24} /> },
    { id: 'professional', label: 'Professional', icon: <Briefcase size={24} /> },
    { id: 'freelancer', label: 'Freelancer', icon: <Camera size={24} /> },
    { id: 'other', label: 'Other', icon: <Coffee size={24} /> }
  ];

  // Company options
  const companyOptions = [
    { id: 'tech', label: 'Tech Company', icon: <Code size={24} /> },
    { id: 'finance', label: 'Financial Institution', icon: <Briefcase size={24} /> },
    { id: 'education', label: 'Educational Institution', icon: <Book size={24} /> },
    { id: 'healthcare', label: 'Healthcare', icon: <Heart size={24} /> },
    { id: 'media', label: 'Media & Entertainment', icon: <Film size={24} /> },
    { id: 'self', label: 'Self-Employed', icon: <User size={24} /> }
  ];

  // Interest options
  const interestOptions = [
    { id: 'tech', label: 'Technology', icon: <Code size={24} /> },
    { id: 'music', label: 'Music', icon: <Music size={24} /> },
    { id: 'movies', label: 'Movies', icon: <Film size={24} /> },
    { id: 'concerts', label: 'Concerts', icon: <Ticket size={24} /> },
    { id: 'art', label: 'Art', icon: <Palette size={24} /> },
    { id: 'fitness', label: 'Fitness', icon: <Dumbbell size={24} /> },
    { id: 'cafes', label: 'Cafés', icon: <Coffee size={24} /> },
    { id: 'food', label: 'Food', icon: <Utensils size={24} /> },
    { id: 'nightlife', label: 'Nightlife', icon: <Moon size={24} /> },
    { id: 'shopping', label: 'Shopping', icon: <ShoppingBag size={24} /> },
    { id: 'outdoors', label: 'Outdoor Activities', icon: <Globe size={24} /> },
    { id: 'gaming', label: 'Gaming', icon: <Gamepad size={24} /> },
    { id: 'events', label: 'Events', icon: <Calendar size={24} /> },
    { id: 'travel', label: 'Travel', icon: <Globe size={24} /> }
  ];

  // Transportation options
  const transportationOptions = [
    { id: 'car', label: 'Car', icon: <Car size={24} /> },
    { id: 'bicycle', label: 'Bicycle', icon: <Bike size={24} /> },
    { id: 'bus', label: 'Bus', icon: <Bus size={24} /> },
    { id: 'subway', label: 'Subway/Train', icon: <Train size={24} /> },
    { id: 'walk', label: 'Walking', icon: <MapPin size={24} /> },
    { id: 'rideshare', label: 'Rideshare', icon: <Car size={24} /> }
  ];

  // Navigation control - get next and previous sections
  // Removed 'cuisines' from the sections array
  const sections = ['occupation', 'company', 'interests', 'transportation', 'summary'];
  
  const goToNextSection = () => {
    const currentIndex = sections.indexOf(currentSection);
    if (currentIndex < sections.length - 1) {
      setCurrentSection(sections[currentIndex + 1]);
    }
  };
  
  const goToPreviousSection = () => {
    const currentIndex = sections.indexOf(currentSection);
    if (currentIndex > 0) {
      setCurrentSection(sections[currentIndex - 1]);
    }
  };

  // Handle selecting an occupation
  const selectOccupation = (occupation: string) => {
    setFormData({ ...formData, occupation });
    goToNextSection();
  };

  // Handle selecting a company
  const selectCompany = (company: string) => {
    setFormData({ ...formData, company });
    goToNextSection();
  };

  // Handle interest selection (toggle)
  const toggleInterest = (interestId: string) => {
    setFormData(prev => {
      if (prev.interests.includes(interestId)) {
        return { 
          ...prev, 
          interests: prev.interests.filter(id => id !== interestId) 
        };
      } else {
        return { 
          ...prev, 
          interests: [...prev.interests, interestId] 
        };
      }
    });
  };

  // Handle transportation selection (toggle)
  const toggleTransportation = (transportId: string) => {
    setFormData(prev => {
      if (prev.transportation.includes(transportId)) {
        return { 
          ...prev, 
          transportation: prev.transportation.filter(id => id !== transportId) 
        };
      } else {
        return { 
          ...prev, 
          transportation: [...prev.transportation, transportId] 
        };
      }
    });
  };

  // Save data to localStorage
  const saveToLocalStorage = (data: FormData) => {
    try {
      localStorage.setItem('userProfileData', JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  };

  // Handle form completion
  const completeProfile = () => {
    const updatedFormData = { ...formData, completed: true };
    setFormData(updatedFormData);
    saveToLocalStorage(updatedFormData);
    setCurrentSection('summary');
  };

  // Submit form data to server
  const submitFormData = async () => {
    // Only proceed if not already submitting
    if (submitStatus.isSubmitting) return;
    
    setSubmitStatus({ isSubmitting: true, isSuccess: false, error: null });
    
    try {
      // Replace with your actual API endpoint
      const response = await fetch('http://localhost:8000/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit profile data');
      }
      
      const result = await response.json();
      setSubmitStatus({ isSubmitting: false, isSuccess: true, error: null });
      
      // You could store the ID or other data returned from your server
      setFormData(prev => ({ ...prev, serverId: result.id }));
      
      return result;
    } catch (error) {
      console.error('Error submitting profile:', error);
      setSubmitStatus({ 
        isSubmitting: false, 
        isSuccess: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      return null;
    }
  };

  // Export profile as JSON file
  const exportProfileAsJson = () => {
    try {
      const dataStr = JSON.stringify(formData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      
      link.href = url;
      link.download = `profile-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error('Error exporting profile:', error);
      alert('Failed to export profile data');
    }
  };

  // Reset the form
  const resetForm = () => {
    localStorage.removeItem('userProfileData');
    setFormData({
      occupation: '',
      company: '',
      interests: [],
      transportation: [],
      completed: false
    });
    setCurrentSection('occupation');
    setSubmitStatus({ isSubmitting: false, isSuccess: false, error: null });
  };

  // Get label from ID for display
  const getLabelById = (array: Array<{ id: string; label: string }>, id: string) => {
    const item = array.find(item => item.id === id);
    return item ? item.label : '';
  };

  // Render progress indicator
  const renderProgress = () => {
    const currentIndex = sections.indexOf(currentSection);
    
    return (
      <div className="flex justify-between mb-6 px-2">
        {sections.slice(0, -1).map((section, index) => (
          <div 
            key={section}
            onClick={() => {
              // Allow clicking on previous steps but not future ones
              if (index <= currentIndex) {
                setCurrentSection(section);
              }
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer
              ${index < currentIndex ? 'bg-[#8A9969] text-white' : 
                index === currentIndex ? 'bg-[#CEA268] text-white' : 'bg-gray-200 text-gray-500'}`}
          >
            {index < currentIndex ? (
              <Check size={16} />
            ) : (
              index + 1
            )}
          </div>
        ))}
      </div>
    );
  };

  // Navigation buttons
  const renderNavButtons = () => {
    const currentIndex = sections.indexOf(currentSection);
    const isFirstSection = currentIndex === 0;
    const isLastSection = currentIndex === sections.length - 2; // Before summary
    
    return (
      <div className="flex justify-between mt-6">
        {!isFirstSection && (
          <button
            onClick={goToPreviousSection}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft size={16} className="mr-1" /> Back
          </button>
        )}
        
        {currentSection === 'interests' || currentSection === 'transportation' ? (
          <button
            onClick={goToNextSection}
            className="flex items-center px-4 py-2 bg-[#CEA268] text-white rounded-lg hover:bg-[#b89058] transition-colors ml-auto"
          >
            {isLastSection ? 'Complete' : 'Next'} <ArrowRight size={16} className="ml-1" />
          </button>
        ) : null}
      </div>
    );
  };

  // Render appropriate section
  const renderSection = () => {
    switch (currentSection) {
      case 'occupation':
        return (
          <div className="animate-fadeIn">
            <h2 className="text-xl font-semibold mb-4 text-[#8A9969] text-center">
              What is your occupation?
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {occupationOptions.map((occupation) => (
                <div
                  key={occupation.id}
                  onClick={() => selectOccupation(occupation.id)}
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-[#CEA268] cursor-pointer transition-all flex flex-col items-center"
                >
                  <div className="w-12 h-12 bg-[#f5ebdd] rounded-full flex items-center justify-center text-[#CEA268] mb-3">
                    {occupation.icon}
                  </div>
                  <span className="font-medium text-gray-800">{occupation.label}</span>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'company':
        return (
          <div className="animate-fadeIn">
            <h2 className="text-xl font-semibold mb-4 text-[#8A9969] text-center">
              Select your company/institution type
            </h2>
            
            <div className="grid grid-cols-2 gap-3">
              {companyOptions.map((company) => (
                <div
                  key={company.id}
                  onClick={() => selectCompany(company.id)}
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-[#CEA268] cursor-pointer transition-all flex flex-col items-center"
                >
                  <div className="w-12 h-12 bg-[#f5ebdd] rounded-full flex items-center justify-center text-[#CEA268] mb-3">
                    {company.icon}
                  </div>
                  <span className="font-medium text-gray-800">{company.label}</span>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'interests':
        return (
          <div className="animate-fadeIn">
            <h2 className="text-xl font-semibold mb-4 text-[#8A9969] text-center">
              Select your interests
            </h2>
            <p className="text-gray-600 mb-4 text-center">Select all that apply</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
              {interestOptions.map((interest) => (
                <div
                  key={interest.id}
                  onClick={() => toggleInterest(interest.id)}
                  className={`
                    flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer transition-all
                    ${formData.interests.includes(interest.id)
                      ? 'bg-[#CEA268] text-white shadow-md transform scale-105'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-[#f5ebdd]'
                    }
                  `}
                >
                  <div className="mb-2">
                    {interest.icon}
                  </div>
                  <span className="font-medium">{interest.label}</span>
                  {formData.interests.includes(interest.id) && (
                    <Check size={16} className="mt-1" />
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'transportation':
        return (
          <div className="animate-fadeIn">
            <h2 className="text-xl font-semibold mb-4 text-[#8A9969] text-center">
              How do you get around?
            </h2>
            <p className="text-gray-600 mb-4 text-center">Select all that apply</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {transportationOptions.map((option) => (
                <div
                  key={option.id}
                  onClick={() => toggleTransportation(option.id)}
                  className={`
                    flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer transition-all
                    ${formData.transportation.includes(option.id)
                      ? 'bg-[#CEA268] text-white shadow-md transform scale-105'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-[#f5ebdd]'
                    }
                  `}
                >
                  <div className="mb-2">
                    {option.icon}
                  </div>
                  <span className="font-medium">{option.label}</span>
                  {formData.transportation.includes(option.id) && (
                    <Check size={16} className="mt-1" />
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={completeProfile}
                className="flex items-center px-6 py-2 bg-[#8A9969] text-white rounded-lg hover:bg-[#798859] transition-colors"
                disabled={formData.transportation.length === 0}
              >
                Complete Profile <Check size={16} className="ml-2" />
              </button>
            </div>
          </div>
        );
      
      case 'summary':
        return (
          <div className="animate-fadeIn">
            <h2 className="text-xl font-semibold mb-6 text-black text-center">
              Your Profile Summary
            </h2>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-[#CEA268] mb-2">Occupation</h3>
                <p className="text-gray-700">
                  {getLabelById(occupationOptions, formData.occupation)}
                </p>
              </div>
              
              <div className="mb-4">
                <h3 className="text-lg font-medium text-[#CEA268] mb-2">Company/Institution</h3>
                <p className="text-gray-700">
                  {getLabelById(companyOptions, formData.company)}
                </p>
              </div>
              
              <div className="mb-4">
                <h3 className="text-lg font-medium text-[#CEA268] mb-2">Interests</h3>
                {formData.interests.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {formData.interests.map(interestId => (
                      <span 
                        key={interestId}
                        className="bg-[#f5ebdd] text-[#CEA268] px-3 py-1 rounded-full text-sm"
                      >
                        {getLabelById(interestOptions, interestId)}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No interests selected</p>
                )}
              </div>
              
              <div className="mb-4">
                <h3 className="text-lg font-medium text-[#CEA268] mb-2">Transportation</h3>
                {formData.transportation.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {formData.transportation.map(transportId => (
                      <span 
                        key={transportId}
                        className="bg-[#f0f3eb] text-[#8A9969] px-3 py-1 rounded-full text-sm"
                      >
                        {getLabelById(transportationOptions, transportId)}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No transportation methods selected</p>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={resetForm}
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Reset Profile
              </button>
              
              <button
                onClick={exportProfileAsJson}
                className="flex items-center px-4 py-2 bg-[#f5ebdd] text-[#CEA268] rounded-lg hover:bg-[#f0e6d6] transition-colors"
              >
                <Download size={16} className="mr-2" /> Export Data
              </button>
              
              <button
                onClick={submitFormData}
                className={`flex items-center px-4 py-2 ${
                  submitStatus.isSuccess 
                    ? 'bg-[#8A9969] text-white' 
                    : 'bg-[#CEA268] text-white'
                } rounded-lg hover:opacity-90 transition-colors`}
                disabled={submitStatus.isSubmitting}
              >
                {submitStatus.isSubmitting ? (
                  'Submitting...'
                ) : submitStatus.isSuccess ? (
                  <>
                    <Check size={16} className="mr-2" /> Submitted
                  </>
                ) : (
                  <>
                    <Send size={16} className="mr-2" /> Submit
                  </>
                )}
              </button>
            </div>
            
            {submitStatus.error && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-center">
                {submitStatus.error}
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-black text-center">User Profile</h1>
      
      {currentSection !== 'summary' && renderProgress()}
      
      {renderSection()}
      
      {currentSection !== 'summary' && renderNavButtons()}
    </div>
  );
}