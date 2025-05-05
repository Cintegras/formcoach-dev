import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import PrimaryButton from '@/components/PrimaryButton';
import {Edit, Loader2, Plus, Trash2} from 'lucide-react';
import {useWorkoutPlans} from '@/hooks/useWorkoutPlans';

const WorkoutPlansPage = () => {
    const navigate = useNavigate();
    const {plans, loading, error, deletePlan} = useWorkoutPlans();
    const [deletingPlanId, setDeletingPlanId] = useState<string | null>(null);

    const handleCreatePlan = () => {
        navigate('/workout-plan-editor');
    };

    const handleEditPlan = (planId: string) => {
        navigate(`/workout-plan-editor/${planId}`);
    };

    const handleDeletePlan = async (planId: string) => {
        if (window.confirm('Are you sure you want to delete this workout plan?')) {
            setDeletingPlanId(planId);
            await deletePlan(planId);
            setDeletingPlanId(null);
        }
    };

    return (
        <PageContainer>
            <div className="mt-8 mb-6">
                <h1 className="font-bold text-[28px] text-center text-[#B0E8E3]">
                    Workout Plans
                </h1>
                <p className="font-normal text-[14px] text-[#A4B1B7] text-center mt-2">
                    Create and manage your workout plans
                </p>
            </div>

            {/* Error message */}
            {error && (
                <div className="bg-red-500 bg-opacity-20 text-red-300 p-4 rounded-lg mb-4">
                    <p>{error.message}</p>
                </div>
            )}

            {/* Loading state */}
            {loading && !plans.length && (
                <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 text-[#00C4B4] animate-spin"/>
                    <p className="mt-4 text-[#A4B1B7]">Loading workout plans...</p>
                </div>
            )}

            {/* Empty state */}
            {!loading && !plans.length && (
                <div className="bg-[rgba(176,232,227,0.12)] rounded-lg p-8 text-center">
                    <p className="text-[#A4B1B7] mb-6">You don't have any workout plans yet.</p>
                    <PrimaryButton onClick={handleCreatePlan} className="bg-[#00C4B4] text-[#000000]">
                        <Plus size={16} className="mr-2"/>
                        Create Your First Plan
                    </PrimaryButton>
                </div>
            )}

            {/* Plans list */}
            {plans.length > 0 && (
                <div className="space-y-4 mb-6">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className="bg-[rgba(176,232,227,0.12)] rounded-lg p-4"
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-semibold text-[16px] text-[#B0E8E3]">
                                        {plan.name}
                                    </h3>
                                    <p className="font-normal text-[14px] text-[#A4B1B7]">
                                        {plan.description || 'No description'}
                                    </p>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleEditPlan(plan.id)}
                                        className="p-2 rounded-full bg-[rgba(176,232,227,0.2)] text-[#B0E8E3]"
                                    >
                                        <Edit size={16}/>
                                    </button>
                                    <button
                                        onClick={() => handleDeletePlan(plan.id)}
                                        className="p-2 rounded-full bg-[rgba(255,100,100,0.2)] text-[#FF6464]"
                                        disabled={deletingPlanId === plan.id}
                                    >
                                        {deletingPlanId === plan.id ? (
                                            <Loader2 size={16} className="animate-spin"/>
                                        ) : (
                                            <Trash2 size={16}/>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create plan button (when plans exist) */}
            {plans.length > 0 && (
                <PrimaryButton onClick={handleCreatePlan} className="bg-[#00C4B4] text-[#000000]">
                    <Plus size={16} className="mr-2"/>
                    Create New Plan
                </PrimaryButton>
            )}
        </PageContainer>
    );
};

export default WorkoutPlansPage;