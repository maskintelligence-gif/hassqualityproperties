import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Key, Map, Building2, Car, X, ArrowRight } from 'lucide-react';

export default function WelcomeOnboarding() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const hasSeen = localStorage.getItem('hass_onboarding_complete');
    if (!hasSeen) {
      // Small delay so it doesn't jar the user immediately on load
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('hass_onboarding_complete', 'true');
  };

  const handleGoalSelect = (selectedGoal: string) => {
    setGoal(selectedGoal);
    setStep(2);
  };

  const handleFinish = (budget: string) => {
    handleClose();
    
    // Map goals to categories for the Properties page
    let category = 'Real Estate';
    let type = 'All';
    
    switch (goal) {
      case 'buy_home':
        category = 'Real Estate';
        type = 'House';
        break;
      case 'rent':
        category = 'Rentals';
        break;
      case 'land':
        category = 'Real Estate';
        type = 'Land';
        break;
      case 'commercial':
        category = 'Real Estate';
        type = 'Commercial';
        break;
      case 'vehicle':
        category = 'Vehicles';
        break;
    }

    // Navigate to properties with the selected filters
    navigate('/properties', { state: { category, type, budget } });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden relative animate-in fade-in zoom-in duration-300"
      >
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors z-10 bg-white/80 backdrop-blur-sm"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Progress Bar */}
        <div className="w-full bg-gray-100 h-1.5 flex-shrink-0">
          <div 
            className="bg-emerald-500 h-1.5 transition-all duration-500"
            style={{ width: step === 1 ? '50%' : '100%' }}
          ></div>
        </div>

        <div className="p-6 md:p-10 overflow-y-auto flex-1">
          {step === 1 ? (
            <div className="animate-in slide-in-from-right-4 duration-500">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 pr-8">Welcome to Hass Quality!</h2>
              <p className="text-gray-600 mb-6">To help us personalize your experience, what are you looking for today?</p>
              
              <div className="space-y-3">
                <button onClick={() => handleGoalSelect('buy_home')} className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 hover:border-emerald-500 hover:bg-emerald-50 transition-all text-left group">
                  <div className="bg-emerald-100 p-3 rounded-lg text-emerald-600 group-hover:bg-emerald-200 transition-colors flex-shrink-0">
                    <Home className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Buy a Home</h3>
                    <p className="text-sm text-gray-500">Find your dream house or apartment</p>
                  </div>
                </button>

                <button onClick={() => handleGoalSelect('rent')} className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 hover:border-emerald-500 hover:bg-emerald-50 transition-all text-left group">
                  <div className="bg-emerald-100 p-3 rounded-lg text-emerald-600 group-hover:bg-emerald-200 transition-colors flex-shrink-0">
                    <Key className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Rent a Property</h3>
                    <p className="text-sm text-gray-500">Houses, apartments, and rooms for rent</p>
                  </div>
                </button>

                <button onClick={() => handleGoalSelect('land')} className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 hover:border-emerald-500 hover:bg-emerald-50 transition-all text-left group">
                  <div className="bg-emerald-100 p-3 rounded-lg text-emerald-600 group-hover:bg-emerald-200 transition-colors flex-shrink-0">
                    <Map className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Buy Land</h3>
                    <p className="text-sm text-gray-500">Plots, farms, and development land</p>
                  </div>
                </button>

                <button onClick={() => handleGoalSelect('commercial')} className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 hover:border-emerald-500 hover:bg-emerald-50 transition-all text-left group">
                  <div className="bg-emerald-100 p-3 rounded-lg text-emerald-600 group-hover:bg-emerald-200 transition-colors flex-shrink-0">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Commercial Space</h3>
                    <p className="text-sm text-gray-500">Offices, shops, and warehouses</p>
                  </div>
                </button>

                <button onClick={() => handleGoalSelect('vehicle')} className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 hover:border-emerald-500 hover:bg-emerald-50 transition-all text-left group">
                  <div className="bg-emerald-100 p-3 rounded-lg text-emerald-600 group-hover:bg-emerald-200 transition-colors flex-shrink-0">
                    <Car className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Buy a Vehicle</h3>
                    <p className="text-sm text-gray-500">Cars, trucks, and motorcycles</p>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-in slide-in-from-right-4 duration-500">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 pr-8">What's your budget?</h2>
              <p className="text-gray-600 mb-6">This helps us show you the most relevant options first.</p>
              
              <div className="space-y-3">
                {['Under 50M UGX', '50M - 200M UGX', '200M - 500M UGX', '500M+ UGX', 'Just browsing for now'].map((budget) => (
                  <button 
                    key={budget}
                    onClick={() => handleFinish(budget)} 
                    className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-gray-100 hover:border-emerald-500 hover:bg-emerald-50 transition-all text-left group font-semibold text-gray-700 hover:text-emerald-700"
                  >
                    {budget}
                    <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-600 flex-shrink-0" />
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setStep(1)}
                className="mt-6 text-sm text-gray-500 hover:text-gray-800 font-medium transition-colors"
              >
                ← Back to previous step
              </button>
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 p-4 text-center border-t border-gray-100 flex-shrink-0">
          <button 
            onClick={handleClose}
            className="text-sm text-gray-500 hover:text-gray-800 font-medium transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
