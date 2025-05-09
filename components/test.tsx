// import { useState } from 'react';
// import { Check, User, Briefcase, Heart, Book, Music, Film, Globe, Code, Camera, Coffee, CheckCircle, ArrowLeft, ArrowRight, MapPin, Bus, Car, Train, Bike, Utensils, DollarSign, ShoppingBag, Dumbbell, Ticket, Palette, Moon, Mountains, Gamepad, Calendar } from 'lucide-react';

// // Main component
// export default function UserProfileForm() {
//   // States to track current section and selections
//   const [currentSection, setCurrentSection] = useState('occupation');
//   const [formData, setFormData] = useState({
//     occupation: '',
//     company: '',
//     experience: '',
//     interests: [],
//     cuisines: [],
//     transportation: [],
//     completed: false
//   });

//   // Predefined occupation options
//   const occupationOptions = [
//     { id: 'student', label: 'Student', icon: <Book size={24} /> },
//     { id: 'professional', label: 'Professional', icon: <Briefcase size={24} /> },
//     { id: 'entrepreneur', label: 'Entrepreneur', icon: <Globe size={24} /> },
//     { id: 'freelancer', label: 'Freelancer', icon: <Camera size={24} /> },
//     { id: 'other', label: 'Other', icon: <Coffee size={24} /> }
//   ];

//   // Predefined company options
//   const companyOptions = [
//     { id: 'tech', label: 'Tech Company', icon: <Code size={24} /> },
//     { id: 'finance', label: 'Financial Institution', icon: <Briefcase size={24} /> },
//     { id: 'education', label: 'Educational Institution', icon: <Book size={24} /> },
//     { id: 'healthcare', label: 'Healthcare', icon: <Heart size={24} /> },
//     { id: 'media', label: 'Media & Entertainment', icon: <Film size={24} /> },
//     { id: 'self', label: 'Self-Employed', icon: <User size={24} /> }
//   ];

//   // Experience level options
//   const experienceLevels = [
//     { id: 'beginner', label: 'Beginner', icon: <CheckCircle size={24} /> },
//     { id: 'intermediate', label: 'Intermediate', icon: <CheckCircle size={24} /> },
//     { id: 'advanced', label: 'Advanced', icon: <CheckCircle size={24} /> },
//     { id: 'expert', label: 'Expert', icon: <CheckCircle size={24} /> }
//   ];

//   // Interest options
//   const interestOptions = [
//     { id: 'tech', label: 'Technology', icon: <Code size={24} /> },
//     { id: 'music', label: 'Music', icon: <Music size={24} /> },
//     { id: 'movies', label: 'Movies', icon: <Film size={24} /> },
//     { id: 'concerts', label: 'Concerts', icon: <Ticket size={24} /> },
//     { id: 'art', label: 'Art', icon: <Palette size={24} /> },
//     { id: 'fitness', label: 'Fitness', icon: <Dumbbell size={24} /> },
//     { id: 'cafes', label: 'Cafés', icon: <Coffee size={24} /> },
//     { id: 'food', label: 'Food', icon: <Utensils size={24} /> },
//     { id: 'nightlife', label: 'Nightlife', icon: <Moon size={24} /> },
//     { id: 'shopping', label: 'Shopping', icon: <ShoppingBag size={24} /> },
//     { id: 'outdoors', label: 'Outdoor Activities', icon: <Mountains size={24} /> },
//     { id: 'gaming', label: 'Gaming', icon: <Gamepad size={24} /> },
//     { id: 'events', label: 'Events', icon: <Calendar size={24} /> },
//     { id: 'travel', label: 'Travel', icon: <Globe size={24} /> }
//   ];

//   // Cuisine options
//   const cuisineOptions = [
//     { id: 'italian', label: 'Italian', icon: <Utensils size={24} /> },
//     { id: 'mexican', label: 'Mexican', icon: <Utensils size={24} /> },
//     { id: 'asian', label: 'Asian', icon: <Utensils size={24} /> },
//     { id: 'american', label: 'American', icon: <Utensils size={24} /> },
//     { id: 'mediterranean', label: 'Mediterranean', icon: <Utensils size={24} /> },
//     { id: 'vegetarian', label: 'Vegetarian', icon: <Utensils size={24} /> },
//     { id: 'fastfood', label: 'Fast Food', icon: <Utensils size={24} /> },
//     { id: 'budget', label: 'Affordable Eats', icon: <DollarSign size={24} /> },
//     { id: 'grocery', label: 'Budget Grocery', icon: <ShoppingBag size={24} /> }
//   ];

//   // Transportation options
//   const transportationOptions = [
//     { id: 'car', label: 'Car', icon: <Car size={24} /> },
//     { id: 'bicycle', label: 'Bicycle', icon: <Bike size={24} /> },
//     { id: 'bus', label: 'Bus', icon: <Bus size={24} /> },
//     { id: 'subway', label: 'Subway/Train', icon: <Train size={24} /> },
//     { id: 'walk', label: 'Walking', icon: <MapPin size={24} /> },
//     { id: 'rideshare', label: 'Rideshare', icon: <Car size={24} /> }
//   ];

//   // Navigation control - get next and previous sections
//   const sections = ['occupation', 'company', 'experience', 'interests', 'cuisines', 'transportation', 'summary'];
  
//   const goToNextSection = () => {
//     const currentIndex = sections.indexOf(currentSection);
//     if (currentIndex < sections.length - 1) {
//       setCurrentSection(sections[currentIndex + 1]);
//     }
//   };
  
//   const goToPreviousSection = () => {
//     const currentIndex = sections.indexOf(currentSection);
//     if (currentIndex > 0) {
//       setCurrentSection(sections[currentIndex - 1]);
//     }
//   };

//   // Handle selecting an occupation
//   const selectOccupation = (occupation) => {
//     setFormData({ ...formData, occupation });
//     goToNextSection();
//   };

//   // Handle selecting a company
//   const selectCompany = (company) => {
//     setFormData({ ...formData, company });
//     goToNextSection();
//   };

//   // Handle selecting an experience level
//   const selectExperience = (experience) => {
//     setFormData({ ...formData, experience });
//     goToNextSection();
//   };

//   // Handle interest selection (toggle)
//   const toggleInterest = (interestId) => {
//     setFormData(prev => {
//       if (prev.interests.includes(interestId)) {
//         return { 
//           ...prev, 
//           interests: prev.interests.filter(id => id !== interestId) 
//         };
//       } else {
//         return { 
//           ...prev, 
//           interests: [...prev.interests, interestId] 
//         };
//       }
//     });
//   };

//   // Handle cuisine selection (toggle)
//   const toggleCuisine = (cuisineId) => {
//     setFormData(prev => {
//       if (prev.cuisines.includes(cuisineId)) {
//         return { 
//           ...prev, 
//           cuisines: prev.cuisines.filter(id => id !== cuisineId) 
//         };
//       } else {
//         return { 
//           ...prev, 
//           cuisines: [...prev.cuisines, cuisineId] 
//         };
//       }
//     });
//   };

//   // Handle transportation selection (toggle)
//   const toggleTransportation = (transportId) => {
//     setFormData(prev => {
//       if (prev.transportation.includes(transportId)) {
//         return { 
//           ...prev, 
//           transportation: prev.transportation.filter(id => id !== transportId) 
//         };
//       } else {
//         return { 
//           ...prev, 
//           transportation: [...prev.transportation, transportId] 
//         };
//       }
//     });
//   };

//   // Handle form completion
//   const completeProfile = () => {
//     setFormData({ ...formData, completed: true });
//     setCurrentSection('summary');
//   };

//   // Reset the form
//   const resetForm = () => {
//     setFormData({
//       occupation: '',
//       company: '',
//       experience: '',
//       interests: [],
//       cuisines: [],
//       transportation: [],
//       completed: false
//     });
//     setCurrentSection('occupation');
//   };

//   // Get label from ID for display
//   const getLabelById = (array, id) => {
//     const item = array.find(item => item.id === id);
//     return item ? item.label : '';
//   };

//   // Render progress indicator
//   const renderProgress = () => {
//     const currentIndex = sections.indexOf(currentSection);
    
//     return (
//       <div className="flex justify-between mb-6 px-2">
//         {sections.slice(0, -1).map((section, index) => (
//           <div 
//             key={section}
//             onClick={() => {
//               // Allow clicking on previous steps but not future ones
//               if (index <= currentIndex) {
//                 setCurrentSection(section);
//               }
//             }}
//             className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer
//               ${index < currentIndex ? 'bg-green-500 text-white' : 
//                 index === currentIndex ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}
//           >
//             {index < currentIndex ? (
//               <Check size={16} />
//             ) : (
//               index + 1
//             )}
//           </div>
//         ))}
//       </div>
//     );
//   };

//   // Navigation buttons
//   const renderNavButtons = () => {
//     const currentIndex = sections.indexOf(currentSection);
//     const isFirstSection = currentIndex === 0;
//     const isLastSection = currentIndex === sections.length - 2; // Before summary
    
//     return (
//       <div className="flex justify-between mt-6">
//         {!isFirstSection && (
//           <button
//             onClick={goToPreviousSection}
//             className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
//           >
//             <ArrowLeft size={16} className="mr-1" /> Back
//           </button>
//         )}
        
//         {currentSection === 'interests' || currentSection === 'cuisines' || currentSection === 'transportation' ? (
//           <button
//             onClick={goToNextSection}
//             className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors ml-auto"
//           >
//             {isLastSection ? 'Complete' : 'Next'} <ArrowRight size={16} className="ml-1" />
//           </button>
//         ) : null}
//       </div>
//     );
//   };

//   // Render appropriate section
//   const renderSection = () => {
//     switch (currentSection) {
//       case 'occupation':
//         return (
//           <div className="animate-fadeIn">
//             <h2 className="text-xl font-semibold mb-4 text-indigo-700 text-center">
//               What is your occupation?
//             </h2>
            
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
//               {occupationOptions.map((occupation) => (
//                 <div
//                   key={occupation.id}
//                   onClick={() => selectOccupation(occupation.id)}
//                   className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-indigo-300 cursor-pointer transition-all flex flex-col items-center"
//                 >
//                   <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-3">
//                     {occupation.icon}
//                   </div>
//                   <span className="font-medium text-gray-800">{occupation.label}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         );
      
//       case 'company':
//         return (
//           <div className="animate-fadeIn">
//             <h2 className="text-xl font-semibold mb-4 text-indigo-700 text-center">
//               Select your company/institution type
//             </h2>
            
//             <div className="grid grid-cols-2 gap-3">
//               {companyOptions.map((company) => (
//                 <div
//                   key={company.id}
//                   onClick={() => selectCompany(company.id)}
//                   className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-indigo-300 cursor-pointer transition-all flex flex-col items-center"
//                 >
//                   <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-3">
//                     {company.icon}
//                   </div>
//                   <span className="font-medium text-gray-800">{company.label}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         );
      
//       case 'experience':
//         return (
//           <div className="animate-fadeIn">
//             <h2 className="text-xl font-semibold mb-4 text-indigo-700 text-center">
//               What is your experience level?
//             </h2>
            
//             <div className="grid grid-cols-2 gap-4">
//               {experienceLevels.map((level) => (
//                 <div
//                   key={level.id}
//                   onClick={() => selectExperience(level.id)}
//                   className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-indigo-300 cursor-pointer transition-all flex flex-col items-center"
//                 >
//                   <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-3">
//                     {level.icon}
//                   </div>
//                   <span className="font-medium text-gray-800">{level.label}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         );
      
//       case 'interests':
//         return (
//           <div className="animate-fadeIn">
//             <h2 className="text-xl font-semibold mb-4 text-indigo-700 text-center">
//               Select your interests
//             </h2>
//             <p className="text-gray-600 mb-4 text-center">Select all that apply</p>
            
//             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
//               {interestOptions.map((interest) => (
//                 <div
//                   key={interest.id}
//                   onClick={() => toggleInterest(interest.id)}
//                   className={`
//                     flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer transition-all
//                     ${formData.interests.includes(interest.id)
//                       ? 'bg-indigo-600 text-white shadow-md transform scale-105'
//                       : 'bg-white text-gray-700 border border-gray-200 hover:bg-indigo-50'
//                     }
//                   `}
//                 >
//                   <div className="mb-2">
//                     {interest.icon}
//                   </div>
//                   <span className="font-medium">{interest.label}</span>
//                   {formData.interests.includes(interest.id) && (
//                     <Check size={16} className="mt-1" />
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         );
        
//       case 'cuisines':
//         return (
//           <div className="animate-fadeIn">
//             <h2 className="text-xl font-semibold mb-4 text-indigo-700 text-center">
//               What cuisines & dining options do you prefer?
//             </h2>
//             <p className="text-gray-600 mb-4 text-center">Select all that apply</p>
            
//             <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
//               {cuisineOptions.map((cuisine) => (
//                 <div
//                   key={cuisine.id}
//                   onClick={() => toggleCuisine(cuisine.id)}
//                   className={`
//                     flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer transition-all
//                     ${formData.cuisines.includes(cuisine.id)
//                       ? 'bg-indigo-600 text-white shadow-md transform scale-105'
//                       : 'bg-white text-gray-700 border border-gray-200 hover:bg-indigo-50'
//                     }
//                   `}
//                 >
//                   <div className="mb-2">
//                     {cuisine.icon}
//                   </div>
//                   <span className="font-medium">{cuisine.label}</span>
//                   {formData.cuisines.includes(cuisine.id) && (
//                     <Check size={16} className="mt-1" />
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         );
        
//       case 'transportation':
//         return (
//           <div className="animate-fadeIn">
//             <h2 className="text-xl font-semibold mb-4 text-indigo-700 text-center">
//               What transportation options do you use?
//             </h2>
//             <p className="text-gray-600 mb-4 text-center">Select all that apply</p>
            
//             <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
//               {transportationOptions.map((transport) => (
//                 <div
//                   key={transport.id}
//                   onClick={() => toggleTransportation(transport.id)}
//                   className={`
//                     flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer transition-all
//                     ${formData.transportation.includes(transport.id)
//                       ? 'bg-indigo-600 text-white shadow-md transform scale-105'
//                       : 'bg-white text-gray-700 border border-gray-200 hover:bg-indigo-50'
//                     }
//                   `}
//                 >
//                   <div className="mb-2">
//                     {transport.icon}
//                   </div>
//                   <span className="font-medium">{transport.label}</span>
//                   {formData.transportation.includes(transport.id) && (
//                     <Check size={16} className="mt-1" />
//                   )}
//                 </div>
//               ))}
//             </div>
            
//             <div className="flex justify-center mt-4">
//               <button
//                 onClick={completeProfile}
//                 className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg shadow hover:bg-indigo-700 transition-colors"
//               >
//                 Complete Profile
//               </button>
//             </div>
//           </div>
//         );
      
//       case 'summary':
//         // Find the corresponding objects to get labels
//         const occupationLabel = getLabelById(occupationOptions, formData.occupation);
//         const companyLabel = getLabelById(companyOptions, formData.company);
//         const experienceLabel = getLabelById(experienceLevels, formData.experience);
        
//         return (
//           <div className="animate-fadeIn">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-2xl font-bold text-indigo-700">Profile Created!</h2>
//               <button
//                 onClick={resetForm}
//                 className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors"
//               >
//                 Create New Profile
//               </button>
//             </div>
            
//             <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl p-6 mb-6">
//               <div className="flex items-center mb-4">
//                 <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-indigo-600 mr-4">
//                   <User size={32} />
//                 </div>
//                 <div>
//                   <h2 className="text-xl font-bold capitalize">{occupationLabel}</h2>
//                   <p className="text-indigo-100">{companyLabel}</p>
//                 </div>
//               </div>
              
//               <div className="bg-white bg-opacity-10 p-3 rounded-lg mb-4">
//                 <span className="text-sm text-indigo-100">Experience Level</span>
//                 <p className="font-medium">{experienceLabel}</p>
//               </div>
//             </div>
            
//             {/* Interests */}
//             <div className="bg-gray-50 rounded-xl p-6 mb-4">
//               <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
//                 <Heart size={20} className="mr-2 text-indigo-600" /> Your Interests
//               </h3>
              
//               {formData.interests.length > 0 ? (
//                 <div className="flex flex-wrap gap-2">
//                   {formData.interests.map(interestId => {
//                     const interest = interestOptions.find(opt => opt.id === interestId);
//                     return interest ? (
//                       <div key={interestId} className="flex items-center bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
//                         <span className="mr-1">{interest.icon}</span>
//                         <span>{interest.label}</span>
//                       </div>
//                     ) : null;
//                   })}
//                 </div>
//               ) : (
//                 <div className="text-gray-500 text-center py-2">
//                   No interests selected
//                 </div>
//               )}
//             </div>
            
//             {/* Cuisines */}
//             <div className="bg-gray-50 rounded-xl p-6 mb-4">
//               <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
//                 <Utensils size={20} className="mr-2 text-indigo-600" /> Dining Preferences
//               </h3>
              
//               {formData.cuisines.length > 0 ? (
//                 <div className="flex flex-wrap gap-2">
//                   {formData.cuisines.map(cuisineId => {
//                     const cuisine = cuisineOptions.find(opt => opt.id === cuisineId);
//                     return cuisine ? (
//                       <div key={cuisineId} className="flex items-center bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
//                         <span className="mr-1">{cuisine.icon}</span>
//                         <span>{cuisine.label}</span>
//                       </div>
//                     ) : null;
//                   })}
//                 </div>
//               ) : (
//                 <div className="text-gray-500 text-center py-2">
//                   No dining preferences selected
//                 </div>
//               )}
//             </div>
            
//             {/* Transportation */}
//             <div className="bg-gray-50 rounded-xl p-6">
//               <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
//                 <Car size={20} className="mr-2 text-indigo-600" /> Transportation Options
//               </h3>
              
//               {formData.transportation.length > 0 ? (
//                 <div className="flex flex-wrap gap-2">
//                   {formData.transportation.map(transportId => {
//                     const transport = transportationOptions.find(opt => opt.id === transportId);
//                     return transport ? (
//                       <div key={transportId} className="flex items-center bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
//                         <span className="mr-1">{transport.icon}</span>
//                         <span>{transport.label}</span>
//                       </div>
//                     ) : null;
//                   })}
//                 </div>
//               ) : (
//                 <div className="text-gray-500 text-center py-2">
//                   No transportation options selected
//                 </div>
//               )}
//             </div>
//           </div>
//         );
        
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
//       <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden">
//         <div className="p-6">
//           <h1 className="text-2xl font-bold text-center text-indigo-700 mb-4">
//             {currentSection === 'summary' ? 'Your Profile' : 'Create Your Profile'}
//           </h1>
          
//           {currentSection !== 'summary' && renderProgress()}
          
//           <div className="mt-4">
//             {renderSection()}
//           </div>
          
//           {currentSection !== 'summary' && renderNavButtons()}
//         </div>
//       </div>
//     </div>
//   );
// }