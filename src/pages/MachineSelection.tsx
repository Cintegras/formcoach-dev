
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import { CardGradient, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card-gradient';
import PrimaryButton from '@/components/PrimaryButton';

interface Machine {
  id: string;
  name: string;
  brand: string;
}

const MachineSelection = () => {
  const navigate = useNavigate();
  
  const machines: Machine[] = [
    { id: "leg-press", name: "Leg Press", brand: "Matrix" },
    { id: "seated-leg-curl", name: "Seated Leg Curl", brand: "Matrix" },
    { id: "leg-extension", name: "Leg Extension", brand: "Matrix" },
    { id: "chest-press", name: "Chest Press", brand: "Matrix" },
    { id: "lat-pulldown", name: "Lat Pulldown", brand: "Cable Pulley" },
    { id: "seated-row", name: "Seated Row", brand: "Cable" },
    { id: "triceps-pushdown", name: "Triceps Pushdown", brand: "Matrix" },
    { id: "biceps-curl", name: "Biceps Curl", brand: "Matrix" },
  ];

  const [selectedMachines, setSelectedMachines] = useState<string[]>([]);

  const toggleMachine = (machineId: string) => {
    setSelectedMachines(prev => 
      prev.includes(machineId)
        ? prev.filter(id => id !== machineId)
        : [...prev, machineId]
    );
  };

  return (
    <PageContainer>
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-white">Machine Selection</h1>
        <p className="text-gray-300 mt-2">Select the machines you'll be using</p>
      </div>
      
      <CardGradient>
        <CardHeader>
          <CardTitle>Available Machines</CardTitle>
          <CardDescription className="text-gray-300">
            Tap to select the machines for your workout routine
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {machines.map(machine => (
              <button
                key={machine.id}
                className={`p-4 rounded-lg border text-left transition-all ${
                  selectedMachines.includes(machine.id)
                    ? "bg-teal-500/20 border-teal-400"
                    : "bg-gray-800/50 border-gray-700 hover:bg-gray-700/50"
                }`}
                onClick={() => toggleMachine(machine.id)}
              >
                <h3 className="font-medium text-white">{machine.name}</h3>
                <p className="text-sm text-gray-400">{machine.brand}</p>
              </button>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <PrimaryButton 
            onClick={() => navigate('/start-workout')} 
            disabled={selectedMachines.length === 0}
          >
            Continue
          </PrimaryButton>
        </CardFooter>
      </CardGradient>
    </PageContainer>
  );
};

export default MachineSelection;
