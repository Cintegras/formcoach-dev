import React, {useCallback, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '@/features/auth/hooks/useAuth';
import {useWorkoutSessions} from '@/hooks/useWorkoutSessions';
import {useExerciseLogs, logCompletedExercise} from '@/hooks/useExerciseLogs';
import {supabase} from '@/integrations/supabase/client';
import PageContainer from '@/components/PageContainer';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {ArrowLeft, Plus, Trash2} from 'lucide-react';
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {useToast} from '@/hooks/use-toast';

interface Set {
    reps: string;
    weight: string;
}

const LogWorkout = () => {
    const navigate = useNavigate();
    const {user} = useAuth();
    const {activeSession, endSession} = useWorkoutSessions();
    const {logs} = useExerciseLogs(activeSession?.id, true);
    const {toast} = useToast();

    const [exercises, setExercises] = useState<any[]>([]);
    const [exerciseId, setExerciseId] = useState<string | null>(null);
    const [sets, setSets] = useState<Set[]>([{reps: '', weight: ''}]);
    const [videoUrl, setVideoUrl] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [isEndWorkoutDialogOpen, setIsEndWorkoutDialogOpen] = useState(false);

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const {data, error} = await supabase
                    .from('exercises')
                    .select('*');

                if (error) {
                    throw new Error(error.message);
                }

                setExercises(data || []);
            } catch (err) {
                console.error('Error fetching exercises:', err);
            }
        };

        fetchExercises();
    }, []);

    const addSet = () => {
        setSets([...sets, {reps: '', weight: ''}]);
    };

    const removeSet = (index: number) => {
        const newSets = [...sets];
        newSets.splice(index, 1);
        setSets(newSets);
    };

    const updateSet = (index: number, field: string, value: string) => {
        const newSets = [...sets];
        newSets[index][field] = value;
        setSets(newSets);
    };

    const handleVideoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVideoUrl(e.target.value);
    };

    // Inside the handleLogExercise function
    const handleLogExercise = async () => {
        setIsLoading(true);
        try {
            if (!activeSession) {
                throw new Error("No active workout session");
            }

            if (exerciseId === null) {
                throw new Error("No exercise selected");
            }

            if (sets.length === 0) {
                throw new Error("No sets added");
            }

            const setsCompleted = sets.length;
            const repsCompleted = sets.map(set => parseInt(set.reps) || 0);
            const weightsUsed = sets.map(set => parseInt(set.weight) || 0);

            // Fix: Convert the arrays to the proper format for the API
            const logResult = await logCompletedExercise(
                exerciseId,
                setsCompleted,
                repsCompleted, // Now properly passing number[]
                weightsUsed,   // Now properly passing number[]
                videoUrl || undefined,
                activeSession.id
            );

            if (!logResult) {
                throw new Error("Failed to log exercise");
            }

            toast({
                title: "Exercise Logged",
                description: "Exercise has been logged successfully."
            });

            // Reset the state
            setExerciseId(null);
            setSets([{reps: '', weight: ''}]);
            setVideoUrl('');
        } catch (error: any) {
            console.error("Error logging exercise:", error);
            toast({
                title: "Error",
                description: error.message || "Failed to log exercise",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleEndWorkout = async () => {
        setIsLoading(true);
        try {
            if (!activeSession) {
                throw new Error("No active workout session");
            }

            await endSession(activeSession.id);

            toast({
                title: "Workout Ended",
                description: "Workout session has been ended successfully."
            });

            navigate('/');
        } catch (error: any) {
            console.error("Error ending workout:", error);
            toast({
                title: "Error",
                description: error.message || "Failed to end workout",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
            setIsEndWorkoutDialogOpen(false);
        }
    };

    return (
        <PageContainer>
            <div className="mt-8 mb-6">
                <h1 className="font-bold text-[28px] text-center text-[#B0E8E3]">
                    Log Workout
                </h1>
                <p className="font-normal text-[14px] text-[#A4B1B7] text-center mt-2">
                    Record your exercises and track your progress
                </p>
            </div>

            <Button
                variant="outline"
                className="mb-8 flex items-center text-[#A4B1B7]"
                onClick={() => navigate('/')}
            >
                <ArrowLeft size={16} className="mr-2"/>
                Back to Home
            </Button>

            <div className="space-y-6">
                {/* Exercise Selection */}
                <div>
                    <Label htmlFor="exercise" className="text-[#A4B1B7]">Select Exercise</Label>
                    <Select onValueChange={(value) => setExerciseId(value)} value={exerciseId || undefined}>
                        <SelectTrigger className="bg-[rgba(176,232,227,0.12)] border-none text-white">
                            <SelectValue placeholder="Choose an exercise"/>
                        </SelectTrigger>
                        <SelectContent className="bg-[#0C1518] border-[#243137] text-white">
                            {exercises.map((exercise) => (
                                <SelectItem key={exercise.id} value={exercise.id}>
                                    {exercise.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Sets Input */}
                <div>
                    <Label className="text-[#A4B1B7]">Sets</Label>
                    <div className="space-y-2">
                        {sets.map((set, index) => (
                            <div key={index} className="flex items-center space-x-4">
                                <Input
                                    type="number"
                                    placeholder="Reps"
                                    value={set.reps}
                                    onChange={(e) => updateSet(index, 'reps', e.target.value)}
                                    className="bg-[rgba(176,232,227,0.12)] border-0 text-white w-24"
                                />
                                <Input
                                    type="number"
                                    placeholder="Weight (lbs)"
                                    value={set.weight}
                                    onChange={(e) => updateSet(index, 'weight', e.target.value)}
                                    className="bg-[rgba(176,232,227,0.12)] border-0 text-white w-24"
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeSet(index)}
                                    className="hover:bg-[rgba(176,232,227,0.2)] text-red-500"
                                >
                                    <Trash2 className="h-4 w-4"/>
                                </Button>
                            </div>
                        ))}
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={addSet}
                            className="w-full justify-center bg-[rgba(176,232,227,0.12)] border-none text-white hover:bg-[rgba(176,232,227,0.2)]"
                        >
                            Add Set <Plus className="h-4 w-4 ml-2"/>
                        </Button>
                    </div>
                </div>

                {/* Video URL Input */}
                <div>
                    <Label htmlFor="videoUrl" className="text-[#A4B1B7]">Video URL (Optional)</Label>
                    <Input
                        type="url"
                        id="videoUrl"
                        placeholder="Enter video URL"
                        value={videoUrl}
                        onChange={handleVideoUrlChange}
                        className="bg-[rgba(176,232,227,0.12)] border-0 text-white"
                    />
                </div>

                {/* Log Exercise Button */}
                <Button
                    className="w-full justify-center bg-[#00C4B4] border-none text-black hover:bg-[#00C4B4]/80"
                    onClick={handleLogExercise}
                    disabled={isLoading || !exerciseId || sets.length === 0}
                >
                    {isLoading ? 'Logging...' : 'Log Exercise'}
                </Button>

                {/* End Workout Button */}
                <Button
                    variant="destructive"
                    className="w-full justify-center bg-[rgba(220,53,69,0.12)] border-none text-red-500 hover:bg-[rgba(220,53,69,0.2)]"
                    onClick={() => setIsEndWorkoutDialogOpen(true)}
                    disabled={isLoading}
                >
                    End Workout
                </Button>
            </div>

            {/* End Workout Confirmation Dialog */}
            <Dialog open={isEndWorkoutDialogOpen} onOpenChange={setIsEndWorkoutDialogOpen}>
                <DialogContent className="bg-[#0C1518] border-[#243137] text-white">
                    <DialogHeader>
                        <DialogTitle className="text-red-400">End Workout</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-[#A4B1B7]">
                            Are you sure you want to end this workout session?
                        </p>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsEndWorkoutDialogOpen(false)}
                            className="border-[#243137] text-[#A4B1B7] hover:bg-[#243137]"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleEndWorkout}
                            variant="destructive"
                        >
                            End Workout
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </PageContainer>
    );
};

export default LogWorkout;
