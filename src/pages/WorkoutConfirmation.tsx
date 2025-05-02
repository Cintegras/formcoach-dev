import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import PageContainer from '@/components/PageContainer';
import PrimaryButton from '@/components/PrimaryButton';
import { ArrowLeft } from 'lucide-react';
import { GripVertical } from 'lucide-react';

interface ExerciseItem {
  id: string;
  name: string;
  sets?: number;
  reps?: string;
  isCardio?: boolean;
  duration?: string;
  completed: boolean;
  selected: boolean;
}

const WorkoutConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the selected exercises from location state with proper IDs
  const initialExercises = location.state?.selectedExercises || [];
  
  // Ensure each exercise has a unique string ID
  const processedExercises = initialExercises.map((exercise: ExerciseItem, index: number) => ({
    ...exercise,
    id: exercise.id || `exercise-${index}`
  }));
  
  const [exercises, setExercises] = useState<ExerciseItem[]>(processedExercises);
  
  // Function to reorder exercises after drag and drop
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(exercises);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setExercises(items);
  };

  // Start the workout
  const startWorkout = () => {
    // Find the first exercise
    const firstExercise = exercises[0];
    
    // If there are no exercises, go to home
    if (!firstExercise) {
      navigate('/');
      return;
    }
    
    // If the first exercise is the cardio warmup, go there first
    if (firstExercise.isCardio) {
      navigate('/cardio-warmup', { state: { exercises, currentIndex: 0 } });
    } else {
      // Otherwise, go to the first strength training exercise
      navigate(`/workout-tracking/${firstExercise.id}`, { 
        state: { exercises, currentIndex: 0 } 
      });
    }
  };

  // Go back to workout plan
  const goBack = () => {
    navigate('/workout-plan');
  };

  return (
    <PageContainer>
      <div className="mt-8 mb-6">
        <h1 className="font-bold text-[28px] text-center text-[#B0E8E3]">
          Confirm Your Workout
        </h1>
        <p className="font-normal text-[14px] text-[#A4B1B7] text-center mt-2">
          Drag and drop to reorder exercises
        </p>
      </div>
      
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable-exercises">
          {(provided) => (
            <div 
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-3 min-h-[200px]"
            >
              {exercises.map((exercise, index) => (
                <Draggable 
                  key={exercise.id} 
                  draggableId={exercise.id} 
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="bg-[#1C1C1E] rounded-lg p-4 flex justify-between items-center"
                      style={{
                        ...provided.draggableProps.style,
                        backgroundColor: "rgba(176, 232, 227, 0.12)",
                      }}
                    >
                      <div className="flex items-center w-full">
                        <div 
                          {...provided.dragHandleProps}
                          className="mr-3 cursor-grab"
                        >
                          <GripVertical size={20} className="text-[#A4B1B7]" />
                        </div>
                        <div>
                          <span className="font-normal text-[16px] text-[#A4B1B7] mr-2">
                            {index + 1}.
                          </span>
                          <span className="font-semibold text-[16px] text-[#A4B1B7]">
                            {exercise.name}
                          </span>
                          <p className="font-normal text-[14px] text-[#A4B1B7]">
                            {exercise.isCardio
                              ? exercise.duration
                              : `${exercise.sets} sets × ${exercise.reps} reps`
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className="mt-8 space-y-3">
        <PrimaryButton 
          onClick={startWorkout}
          className="bg-[#00C4B4] text-[#000000]"
        >
          Start Workout
        </PrimaryButton>
        
        <button 
          onClick={goBack}
          className="w-full flex items-center justify-center text-[#A4B1B7] mt-4"
        >
          <ArrowLeft size={16} className="mr-1" />
          <span>Back to Edit Workout</span>
        </button>
      </div>
    </PageContainer>
  );
};

export default WorkoutConfirmation;
