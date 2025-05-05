import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';
import {ArrowLeft, GripVertical, Loader2, Plus, Save, Trash2} from 'lucide-react';
import {useWorkoutPlan} from '@/hooks/useWorkoutPlans';

interface ExerciseFormData {
    name: string;
    sets: number;
    reps: string;
    rest_seconds: number;
    notes: string;
}

const WorkoutPlanEditor = () => {
    const navigate = useNavigate();
    const {planId} = useParams<{ planId: string }>();
    const isEditing = !!planId;

    // Use the workout plan hook
    const {
        plan,
        exercises,
        loading,
        error,
        updatePlan,
        addExercise,
        updateExercise,
        removeExercise,
        reorderExercises
    } = useWorkoutPlan(planId || null);

    // Form state
    const [planName, setPlanName] = useState('');
    const [planDescription, setPlanDescription] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Exercise form state
    const [showExerciseForm, setShowExerciseForm] = useState(false);
    const [currentExercise, setCurrentExercise] = useState<string | null>(null);
    const [exerciseForm, setExerciseForm] = useState<ExerciseFormData>({
        name: '',
        sets: 3,
        reps: '10',
        rest_seconds: 60,
        notes: ''
    });

    // Initialize form with plan data when loaded
    useEffect(() => {
        if (plan) {
            setPlanName(plan.name);
            setPlanDescription(plan.description || '');
        }
    }, [plan]);

    // Handle plan save
    const handleSavePlan = async () => {
        setIsSaving(true);

        try {
            if (isEditing) {
                // Update existing plan
                await updatePlan({
                    name: planName,
                    description: planDescription
                });
            } else {
                // Create new plan and navigate to edit page
                const newPlan = await updatePlan({
                    name: planName,
                    description: planDescription
                });

                if (newPlan) {
                    navigate(`/workout-plan-editor/${newPlan.id}`, {replace: true});
                }
            }
        } catch (err) {
            console.error('Error saving workout plan:', err);
        } finally {
            setIsSaving(false);
        }
    };

    // Handle adding/editing exercise
    const handleSaveExercise = async () => {
        if (currentExercise) {
            // Update existing exercise
            await updateExercise(currentExercise, exerciseForm);
        } else {
            // Add new exercise
            await addExercise(exerciseForm);
        }

        // Reset form and hide it
        setExerciseForm({
            name: '',
            sets: 3,
            reps: '10',
            rest_seconds: 60,
            notes: ''
        });
        setCurrentExercise(null);
        setShowExerciseForm(false);
    };

    // Handle editing an exercise
    const handleEditExercise = (exercise: any) => {
        setCurrentExercise(exercise.id);
        setExerciseForm({
            name: exercise.name,
            sets: exercise.sets,
            reps: exercise.reps,
            rest_seconds: exercise.rest_seconds || 60,
            notes: exercise.notes || ''
        });
        setShowExerciseForm(true);
    };

    // Handle removing an exercise
    const handleRemoveExercise = async (exerciseId: string) => {
        if (window.confirm('Are you sure you want to remove this exercise?')) {
            await removeExercise(exerciseId);
        }
    };

    return (
        <PageContainer>
            <div className="mt-8 mb-6">
                <h1 className="font-bold text-[28px] text-center text-[#B0E8E3]">
                    {isEditing ? 'Edit Workout Plan' : 'Create Workout Plan'}
                </h1>
                <p className="font-normal text-[14px] text-[#A4B1B7] text-center mt-2">
                    {isEditing ? 'Modify your workout plan' : 'Design a new workout plan'}
                </p>
            </div>

            {/* Error message */}
            {error && (
                <div className="bg-red-500 bg-opacity-20 text-red-300 p-4 rounded-lg mb-4">
                    <p>{error.message}</p>
                </div>
            )}

            {/* Loading state */}
            {loading && !plan && (
                <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 text-[#00C4B4] animate-spin"/>
                    <p className="mt-4 text-[#A4B1B7]">Loading workout plan...</p>
                </div>
            )}

            {/* Plan form */}
            {(!loading || plan) && (
                <div className="space-y-4 mb-6">
                    <div className="bg-[rgba(176,232,227,0.12)] rounded-lg p-4">
                        <label className="block text-[#B0E8E3] mb-2">Plan Name</label>
                        <input
                            type="text"
                            value={planName}
                            onChange={(e) => setPlanName(e.target.value)}
                            className="w-full bg-[#020D0C] border border-[#1C1C1E] rounded-lg p-3 text-white"
                            placeholder="Enter plan name"
                        />
                    </div>

                    <div className="bg-[rgba(176,232,227,0.12)] rounded-lg p-4">
                        <label className="block text-[#B0E8E3] mb-2">Description (Optional)</label>
                        <textarea
                            value={planDescription}
                            onChange={(e) => setPlanDescription(e.target.value)}
                            className="w-full bg-[#020D0C] border border-[#1C1C1E] rounded-lg p-3 text-white"
                            placeholder="Enter plan description"
                            rows={3}
                        />
                    </div>
                </div>
            )}

            {/* Exercises section (only for editing) */}
            {isEditing && (
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-[#B0E8E3] text-xl font-semibold">Exercises</h2>
                        <button
                            onClick={() => {
                                setCurrentExercise(null);
                                setExerciseForm({
                                    name: '',
                                    sets: 3,
                                    reps: '10',
                                    rest_seconds: 60,
                                    notes: ''
                                });
                                setShowExerciseForm(true);
                            }}
                            className="p-2 rounded-full bg-[rgba(176,232,227,0.2)] text-[#B0E8E3]"
                        >
                            <Plus size={16}/>
                        </button>
                    </div>

                    {/* Exercise list */}
                    {exercises.length === 0 ? (
                        <div className="bg-[rgba(176,232,227,0.08)] rounded-lg p-6 text-center">
                            <p className="text-[#A4B1B7]">No exercises added yet.</p>
                            <button
                                onClick={() => {
                                    setCurrentExercise(null);
                                    setShowExerciseForm(true);
                                }}
                                className="mt-4 text-[#00C4B4]"
                            >
                                Add your first exercise
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {exercises.map((exercise, index) => (
                                <div
                                    key={exercise.id}
                                    className="bg-[rgba(176,232,227,0.12)] rounded-lg p-4 flex items-center"
                                >
                                    <div className="mr-3 cursor-move text-[#A4B1B7]">
                                        <GripVertical size={16}/>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-[16px] text-[#B0E8E3]">
                                            {exercise.name}
                                        </h3>
                                        <p className="font-normal text-[14px] text-[#A4B1B7]">
                                            {exercise.sets} sets × {exercise.reps} reps
                                        </p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEditExercise(exercise)}
                                            className="p-2 rounded-full bg-[rgba(176,232,227,0.2)] text-[#B0E8E3]"
                                        >
                                            <Save size={16}/>
                                        </button>
                                        <button
                                            onClick={() => handleRemoveExercise(exercise.id)}
                                            className="p-2 rounded-full bg-[rgba(255,100,100,0.2)] text-[#FF6464]"
                                        >
                                            <Trash2 size={16}/>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Exercise form */}
                    {showExerciseForm && (
                        <div className="mt-4 bg-[rgba(176,232,227,0.16)] rounded-lg p-4">
                            <h3 className="text-[#B0E8E3] font-semibold mb-3">
                                {currentExercise ? 'Edit Exercise' : 'Add Exercise'}
                            </h3>

                            <div className="space-y-3">
                                <div>
                                    <label className="block text-[#A4B1B7] mb-1">Exercise Name</label>
                                    <input
                                        type="text"
                                        value={exerciseForm.name}
                                        onChange={(e) => setExerciseForm({...exerciseForm, name: e.target.value})}
                                        className="w-full bg-[#020D0C] border border-[#1C1C1E] rounded-lg p-2 text-white"
                                        placeholder="e.g., Bench Press"
                                    />
                                </div>

                                <div className="flex space-x-3">
                                    <div className="flex-1">
                                        <label className="block text-[#A4B1B7] mb-1">Sets</label>
                                        <input
                                            type="number"
                                            value={exerciseForm.sets}
                                            onChange={(e) => setExerciseForm({
                                                ...exerciseForm,
                                                sets: parseInt(e.target.value) || 0
                                            })}
                                            className="w-full bg-[#020D0C] border border-[#1C1C1E] rounded-lg p-2 text-white"
                                            min="1"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-[#A4B1B7] mb-1">Reps</label>
                                        <input
                                            type="text"
                                            value={exerciseForm.reps}
                                            onChange={(e) => setExerciseForm({...exerciseForm, reps: e.target.value})}
                                            className="w-full bg-[#020D0C] border border-[#1C1C1E] rounded-lg p-2 text-white"
                                            placeholder="e.g., 10 or 8-12"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-[#A4B1B7] mb-1">Rest (sec)</label>
                                        <input
                                            type="number"
                                            value={exerciseForm.rest_seconds}
                                            onChange={(e) => setExerciseForm({
                                                ...exerciseForm,
                                                rest_seconds: parseInt(e.target.value) || 0
                                            })}
                                            className="w-full bg-[#020D0C] border border-[#1C1C1E] rounded-lg p-2 text-white"
                                            min="0"
                                            step="5"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[#A4B1B7] mb-1">Notes (Optional)</label>
                                    <textarea
                                        value={exerciseForm.notes}
                                        onChange={(e) => setExerciseForm({...exerciseForm, notes: e.target.value})}
                                        className="w-full bg-[#020D0C] border border-[#1C1C1E] rounded-lg p-2 text-white"
                                        placeholder="Any additional instructions"
                                        rows={2}
                                    />
                                </div>

                                <div className="flex space-x-3 pt-2">
                                    <PrimaryButton
                                        onClick={handleSaveExercise}
                                        className="flex-1 bg-[#00C4B4] text-[#000000]"
                                    >
                                        {currentExercise ? 'Update Exercise' : 'Add Exercise'}
                                    </PrimaryButton>
                                    <SecondaryButton
                                        onClick={() => setShowExerciseForm(false)}
                                        className="flex-1"
                                    >
                                        Cancel
                                    </SecondaryButton>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Action buttons */}
            <div className="mt-8 space-y-3">
                <PrimaryButton
                    onClick={handleSavePlan}
                    disabled={!planName.trim() || isSaving}
                    className="bg-[#00C4B4] text-[#000000]"
                >
                    {isSaving ? (
                        <>
                            <Loader2 size={16} className="mr-2 animate-spin"/>
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save size={16} className="mr-2"/>
                            {isEditing ? 'Save Changes' : 'Create Plan'}
                        </>
                    )}
                </PrimaryButton>

                <button
                    onClick={() => navigate('/workout-plans')}
                    className="w-full flex items-center justify-center text-[#A4B1B7] mt-4"
                >
                    <ArrowLeft size={16} className="mr-1"/>
                    <span>Back to Workout Plans</span>
                </button>
            </div>
        </PageContainer>
    );
};

export default WorkoutPlanEditor;