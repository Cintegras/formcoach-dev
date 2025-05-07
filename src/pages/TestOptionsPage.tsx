import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import {Button} from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {ArrowLeft, ChevronDown, Database, HelpCircle, Settings, Trash2, UserCircle, UserX} from 'lucide-react';
import {useToast} from '@/hooks/use-toast';
import {useAuth} from '@/features/auth/hooks/useAuth';
import {getAllProfiles} from '@/services/supabase/profiles';
import {supabase} from '@/integrations/supabase/client';
import {useWorkoutPlans} from '@/hooks/useWorkoutPlans';
import {useWorkoutSessions} from '@/hooks/useWorkoutSessions';
import {useFeatureToggles} from '@/hooks/useFeatureToggles';
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,} from "@/components/ui/tooltip";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu";
import {resetUserAppData} from '@/utils/resetUserAppData';

const TestOptionsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
    const [isSetCurrentUserDialogOpen, setIsSetCurrentUserDialogOpen] = useState(false);
  const [isClearCacheDialogOpen, setIsClearCacheDialogOpen] = useState(false);
  const [isSimulateDialogOpen, setIsSimulateDialogOpen] = useState(false);
  const [isResetMetricsDialogOpen, setIsResetMetricsDialogOpen] = useState(false);
    const [isGenerateDataDialogOpen, setIsGenerateDataDialogOpen] = useState(false);
    const [isDeleteUserDataDialogOpen, setIsDeleteUserDataDialogOpen] = useState(false);

    // State for user profiles
    const [profiles, setProfiles] = useState<any[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string>("");
    const [selectedUserProfile, setSelectedUserProfile] = useState<any>(null);

    // Get user's workout plans
    const {plans} = useWorkoutPlans();
    // Find the active plan (assuming the first plan is the active one, or the one with is_active=true if available)
    const activePlan = plans.find(p => p.is_active) || plans[0] || null;

    // Get recent workout sessions (limit to 3)
    const {sessions} = useWorkoutSessions(null);
    const recentSessions = sessions.slice(0, 3);

    // Track which sessions have exercise logs
    const [sessionsWithLogs, setSessionsWithLogs] = useState<Record<string, boolean>>({});

    // Get form coach access status
    const {formCoachEnabled, workoutCount} = useFeatureToggles();

    // Format date for display
    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Unknown';
        return new Date(dateString).toLocaleDateString();
    };

    // Check if a session has exercise logs
    const hasExerciseLogs = (sessionId: string) => {
        return sessionsWithLogs[sessionId] || false;
    };

    // Effect to check for exercise logs
    useEffect(() => {
        const checkExerciseLogs = async () => {
            const logsMap: Record<string, boolean> = {};

            for (const session of recentSessions) {
                if (session.id) {
                    try {
                        const {data, error} = await supabase
                            .from('exercise_logs')
                            .select('id')
                            .eq('workout_session_id', session.id)
                            .limit(1);

                        logsMap[session.id] = Boolean(data && data.length > 0);
                    } catch (error) {
                        console.error('Error checking exercise logs:', error);
                        logsMap[session.id] = false;
                    }
                }
            }

            setSessionsWithLogs(logsMap);
        };

        if (recentSessions.length > 0) {
            checkExerciseLogs();
        }
    }, [recentSessions]);

    // Effect to fetch all profiles
    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const allProfiles = await getAllProfiles();
                setProfiles(allProfiles);

                // If there are profiles and no selected user, select the first one
                if (allProfiles.length > 0 && !selectedUserId) {
                    setSelectedUserId(allProfiles[0].id);
                }
            } catch (error) {
                console.error('Error fetching profiles:', error);
                toast({
                    title: "Error",
                    description: "Failed to fetch user profiles",
                    variant: "destructive"
                });
            }
        };

        fetchProfiles();
    }, [toast]);

    // Effect to update selected user profile when selectedUserId changes
    useEffect(() => {
        if (selectedUserId) {
            const profile = profiles.find(p => p.id === selectedUserId);
            setSelectedUserProfile(profile || null);
        } else {
            setSelectedUserProfile(null);
        }
    }, [selectedUserId, profiles]);

    // Handle generating test data
    // Generate test data including workout plans, sessions, and exercise logs
    const handleGenerateTestData = async () => {
        if (!user) {
            toast({
                title: "Error",
                description: "No authenticated user found",
                variant: "destructive"
            });
            return;
        }

        setIsGenerateDataDialogOpen(false);

        // Show loading toast
        toast({
            title: "Generating test data...",
            description: "Please wait while we create sample workout data.",
        });

        try {
            // 1. Create a workout plan
            const {data: workoutPlan, error: planError} = await supabase
                .from('workout_plans')
                .insert({
                    user_id: user.id,
                    name: `Test Plan ${new Date().toLocaleDateString()}`,
                    description: 'Automatically generated test plan',
                    is_active: true,
                    difficulty: 'intermediate',
                    created_at: new Date().toISOString()
                })
                .select()
                .single();

            if (planError) {
                throw new Error(`Error creating workout plan: ${planError.message}`);
            }

            // 2. Create workout sessions (3 sessions)
            const sessionPromises: Promise<{ data: any; error: any }>[] = [];
            for (let i = 0; i < 3; i++) {
                // Create session with date offset (today, yesterday, 2 days ago)
                const sessionDate = new Date();
                sessionDate.setDate(sessionDate.getDate() - i);

                const sessionPromise = supabase
                    .from('workout_sessions')
                    .insert({
                        user_id: user.id,
                        workout_plan_id: workoutPlan.id,
                        name: `Test Session ${i + 1}`,
                        status: i === 0 ? 'in_progress' : 'completed',
                        created_at: sessionDate.toISOString(),
                        completed_at: i === 0 ? null : sessionDate.toISOString()
                    })
                    .select()
                    .single();

                sessionPromises.push(sessionPromise as any);
            }

            const sessionResults = await Promise.all(sessionPromises);
            const sessions = sessionResults.map((result: { data: any, error: any }) => {
                if (result.error) {
                    console.error('Error creating session:', result.error);
                    return null;
                }
                return result.data as any;  // Type assertion to avoid TS2339
            }).filter(Boolean);

            // 3. Create exercise logs for each session
            const exerciseTypes = ['squat', 'bench_press', 'deadlift', 'shoulder_press', 'row'];
            const exercisePromises: Promise<any>[] = [];

            for (const session of sessions) {
                // Add 2-3 exercises per session
                const exerciseCount = Math.floor(Math.random() * 2) + 2;

                for (let i = 0; i < exerciseCount; i++) {
                    const exerciseType = exerciseTypes[Math.floor(Math.random() * exerciseTypes.length)];
                    const sets = Math.floor(Math.random() * 3) + 2; // 2-4 sets

                    exercisePromises.push(
                        (async () => {
                            const {data, error} = await supabase
                                .from('exercise_logs')
                                .insert({
                            workout_session_id: session.id,
                                    exercise_id: exerciseType,
                                    sets_completed: sets,
                                    reps_completed: [Math.floor(Math.random() * 5) + 8],
                                    weights_used: [Math.floor(Math.random() * 50) + 50],
                                    form_feedback: 'Automatically generated test exercise',
                                    created_at: session.created_at,
                                })
                                .select();

                            if (error) throw error;
                            return data?.[0] || null;
                        })()
                    );
                }
            }

            await Promise.all(exercisePromises);

            toast({
                title: "Test Data Generated",
                description: `Created 1 workout plan, ${sessions.length} sessions, and multiple exercises`
            });
        } catch (error) {
            console.error("Error generating test data:", error);
            toast({
                title: "Error",
                description: "Failed to generate test data",
                variant: "destructive"
            });
        }
    };

    // Handle clearing app data using the shared utility
    const handleClearCache = async () => {
    setIsClearCacheDialogOpen(false);

        // Show loading toast
    toast({
        title: "Clearing data...",
        description: "Please wait while we reset your app data.",
    });

        try {
            // First reset server-side data if user is logged in
            if (user) {
                const success = await resetUserAppData(user.id);
                if (!success) {
                    console.warn("Failed to reset user app data");
                }
            }

            // Then clear localStorage and set the force_profile_setup flag
            localStorage.clear();
            localStorage.setItem("force_profile_setup", "true");

            toast({
                title: "Data Cleared",
                description: "App data cleared and profile reset. Redirecting to login...",
            });

            // Redirect to login
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (error) {
            console.error("Error clearing data:", error);
            toast({
                title: "Error",
                description: "There was a problem clearing your data. Please try again.",
                variant: "destructive",
            });
        }
  };

    // Handle simulating missing profile using the shared utility
  const handleSimulateMissingProfile = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "No authenticated user found",
        variant: "destructive"
      });
      return;
    }

      setIsSimulateDialogOpen(false);

      // Show loading toast
      toast({
          title: "Simulating missing profile...",
          description: "Please wait while we reset your profile data.",
      });

    try {
        // Use the shared utility to reset user data
        const success = await resetUserAppData(user.id);

      if (success) {
        toast({
            title: "Profile Reset",
          description: "Successfully simulated missing profile. Redirecting to profile setup..."
        });

          // Set force_profile_setup flag
          localStorage.setItem("force_profile_setup", "true");

        // Short delay before redirecting to profile setup
        setTimeout(() => {
          navigate('/profile-setup');
        }, 1500);
      } else {
          throw new Error("Failed to reset profile");
      }
    } catch (error) {
        console.error("Error simulating missing profile:", error);
      toast({
        title: "Error",
        description: "Failed to simulate missing profile",
        variant: "destructive"
      });
    }
  };

    // Handle resetting progress metrics using the shared utility
  const handleResetProgressMetrics = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "No authenticated user found",
        variant: "destructive"
      });
      return;
    }

      setIsResetMetricsDialogOpen(false);

      // Show loading toast
      toast({
          title: "Resetting metrics...",
          description: "Please wait while we reset your progress metrics.",
      });

    try {
        // Delete all progress metrics for this user using the shared utility
        // This will only delete progress_metrics and not affect other tables
      const { error } = await supabase
        .from('progress_metrics')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Progress Metrics Reset",
        description: "Successfully deleted all progress metrics data"
      });
    } catch (error) {
      console.error("Error resetting progress metrics:", error);
      toast({
        title: "Error",
        description: "Failed to reset progress metrics",
        variant: "destructive"
      });
    }
  };

    // Handle deleting a specific user's data using the shared utility
    const handleDeleteUserData = async () => {
        if (!selectedUserId || !selectedUserProfile) {
            toast({
                title: "Error",
                description: "No user selected",
                variant: "destructive"
            });
            return;
        }

        setIsDeleteUserDataDialogOpen(false);

        // Show loading toast
        toast({
            title: "Deleting data...",
            description: "Please wait while we delete the user data.",
        });

        try {
            // Use the shared utility to reset all user data
            const success = await resetUserAppData(selectedUserId);

            if (success) {
                toast({
                    title: "User Data Deleted",
                    description: `Successfully reset data for ${selectedUserProfile.full_name || 'user'}`
                });

                // Refresh the profiles list
                const allProfiles = await getAllProfiles();
                setProfiles(allProfiles);

                // Reset selected user if needed
                if (allProfiles.length > 0) {
                    // Find the same user (they should still exist but with reset fields)
                    const updatedUser = allProfiles.find(p => p.id === selectedUserId);
                    if (updatedUser) {
                        setSelectedUserId(updatedUser.id);
                    } else {
                        setSelectedUserId(allProfiles[0].id);
                    }
                } else {
                    setSelectedUserId("");
                }
            } else {
                throw new Error("Failed to reset user data");
            }
        } catch (error) {
            console.error("Error deleting user data:", error);
            toast({
                title: "Error",
                description: "Failed to delete user data",
                variant: "destructive"
            });
        }
    };

    // Handle setting the selected user as the current user
    const handleSetCurrentUser = async () => {
        if (!selectedUserId || !selectedUserProfile) {
            toast({
                title: "Error",
                description: "No user selected",
                variant: "destructive"
            });
            return;
        }

        try {
            // Store the user data in localStorage to simulate a session
            localStorage.setItem('supabase.auth.token', JSON.stringify({
                currentSession: {
                    user: {
                        id: selectedUserId,
                        email: selectedUserProfile.email || 'test@example.com',
                        user_metadata: {
                            full_name: selectedUserProfile.full_name || 'Test User'
                        }
                    }
                }
            }));

            // Set profile_complete flag
            localStorage.setItem('profile_complete', 'true');

            toast({
                title: "User Set",
                description: `Successfully set ${selectedUserProfile.full_name || 'user'} as the current user. Reloading...`
            });

            // Reload the page to apply the changes
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (error) {
            console.error("Error setting current user:", error);
            toast({
                title: "Error",
                description: "Failed to set current user",
                variant: "destructive"
            });
        }

        setIsSetCurrentUserDialogOpen(false);
    };

  return (
    <PageContainer>
      <div className="mt-8 mb-6">
        <h1 className="font-bold text-[28px] text-center text-[#B0E8E3]">
          Test Options
        </h1>
        <p className="font-normal text-[14px] text-[#A4B1B7] text-center mt-2">
          Developer testing tools
        </p>
      </div>

      <Button
        variant="outline"
        className="mb-8 flex items-center text-[#A4B1B7]"
        onClick={() => navigate('/profile')}
      >
        <ArrowLeft size={16} className="mr-2" />
        Back to Profile
      </Button>

        {/* User Workout Plan Section */}
        <div className="w-full max-w-[300px] mx-auto mb-6 p-4 bg-[rgba(176,232,227,0.08)] rounded-lg">
            <div className="flex items-center mb-2">
                <h3 className="text-[#B0E8E3] text-lg">Current Workout Plan</h3>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <HelpCircle className="ml-2 text-[#A4B1B7]" size={16}/>
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#243137] text-white border-[#0C1518] max-w-[250px]">
                            <p>Displays information about the current user's active workout plan.</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            {activePlan ? (
                <>
                    <div className="text-white">Name: {activePlan.name}</div>
                    <div className="text-[#A4B1B7]">ID: {activePlan.id}</div>
                </>
            ) : (
                <div className="text-[#A4B1B7]">No active workout plan</div>
            )}
        </div>

        {/* Recent Workout Sessions Section */}
        <div className="w-full max-w-[300px] mx-auto mb-6 p-4 bg-[rgba(176,232,227,0.08)] rounded-lg">
            <div className="flex items-center mb-2">
                <h3 className="text-[#B0E8E3] text-lg">Recent Workout Sessions</h3>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <HelpCircle className="ml-2 text-[#A4B1B7]" size={16}/>
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#243137] text-white border-[#0C1518] max-w-[250px]">
                            <p>Shows the most recent workout sessions for the current user, including whether they have
                                associated exercise logs.</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            {recentSessions.length > 0 ? (
                recentSessions.map(session => (
                    <div key={session.id} className="mb-3 pb-3 border-b border-[#243137]">
                        <div className="text-white">Session: {formatDate(session.created_at)}</div>
                        <div className="text-[#A4B1B7]">
                            Plan ID: {session.workout_plan_id ?
                            <span className="text-green-400">✓</span> :
                            <span className="text-red-400">✗</span>}
                        </div>
                        <div className="text-[#A4B1B7]">
                            Exercise Logs: {hasExerciseLogs(session.id) ?
                            <span className="text-green-400">✓</span> :
                            <span className="text-red-400">✗</span>}
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-[#A4B1B7]">No recent workout sessions</div>
            )}
        </div>

        {/* Form Coach Access Section */}
        <div className="w-full max-w-[300px] mx-auto mb-6 p-4 bg-[rgba(176,232,227,0.08)] rounded-lg">
            <div className="flex items-center mb-2">
                <h3 className="text-[#B0E8E3] text-lg">Form Coach Access</h3>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <HelpCircle className="ml-2 text-[#A4B1B7]" size={16}/>
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#243137] text-white border-[#0C1518] max-w-[250px]">
                            <p>Displays the current user's Form Coach access status and workout count.</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <div className="text-white">
                Status: {formCoachEnabled ?
                <span className="text-green-400">Enabled</span> :
                <span className="text-red-400">Disabled</span>}
            </div>
            <div className="text-[#A4B1B7]">Workout Count: {workoutCount}</div>
        </div>

        {/* User Selection Section */}
        <div className="w-full max-w-[300px] mx-auto mb-6 p-4 bg-[rgba(176,232,227,0.08)] rounded-lg">
            <div className="flex items-center mb-2">
                <h3 className="text-[#B0E8E3] text-lg">Select User</h3>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <HelpCircle className="ml-2 text-[#A4B1B7]" size={16}/>
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#243137] text-white border-[#0C1518] max-w-[250px]">
                            <p>Select a user to view their information or perform actions on their account. You can also
                                set them as the current user for testing.</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <Select
                value={selectedUserId}
                onValueChange={(value) => setSelectedUserId(value)}
            >
                <SelectTrigger className="w-full bg-[#0C1518] border-[#243137] text-white">
                    <SelectValue placeholder="Select a user"/>
                </SelectTrigger>
                <SelectContent className="bg-[#0C1518] border-[#243137] text-white">
                    {profiles.map((profile) => (
                        <SelectItem key={profile.id} value={profile.id}>
                            {profile.full_name || 'No name'}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {selectedUserProfile && (
                <div className="mt-2">
                    <div className="text-white">Name: {selectedUserProfile.full_name || 'N/A'}</div>
                    <div className="text-[#A4B1B7]">Username: {selectedUserProfile.username || 'N/A'}</div>
                    <div className="text-[#A4B1B7]">User Type: {selectedUserProfile.user_type || 'N/A'}</div>
                    <div className="text-[#A4B1B7]">Tester
                        Description: {selectedUserProfile.tester_description || 'N/A'}</div>
                    <div className="text-[#A4B1B7]">ID: {selectedUserProfile.id}</div>

                    <div className="flex items-center mt-3">
                        <Button
                            variant="outline"
                            className="w-full justify-start bg-[rgba(176,232,227,0.12)] border-none text-white hover:bg-[rgba(176,232,227,0.2)]"
                            onClick={() => setIsSetCurrentUserDialogOpen(true)}
                            disabled={!selectedUserId}
                        >
                            <UserCircle className="mr-2 text-[#00C4B4]" size={18}/>
                            Set as Current User
                        </Button>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <HelpCircle className="ml-2 text-[#A4B1B7]" size={16}/>
                                </TooltipTrigger>
                                <TooltipContent className="bg-[#243137] text-white border-[#0C1518] max-w-[250px]">
                                    <p>Sets the selected user as the current user without requiring login. Useful for
                                        testing with different user accounts.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            )}
        </div>

      <div className="w-full max-w-[300px] mx-auto space-y-4">
          {/* Developer Actions Dropdown */}
          <div className="flex items-center">
              <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                      <Button
                          variant="outline"
                          className="w-full justify-between bg-[rgba(176,232,227,0.12)] border-none text-white hover:bg-[rgba(176,232,227,0.2)]"
                      >
                          <div className="flex items-center">
                              <Settings className="mr-2 text-[#00C4B4]" size={18}/>
                              ⚙️ Developer Actions
                          </div>
                          <ChevronDown className="ml-2 h-4 w-4 text-[#A4B1B7]"/>
                      </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-[#0C1518] border-[#243137] text-white">
                      <DropdownMenuItem
                          onClick={() => setIsClearCacheDialogOpen(true)}
                          className="cursor-pointer hover:bg-[rgba(176,232,227,0.12)]"
                      >
                          <Trash2 className="mr-2 text-[#00C4B4]" size={16}/>
                          Clear App Data (Dev)
                      </DropdownMenuItem>
                      <DropdownMenuItem
                          onClick={() => setIsDeleteUserDataDialogOpen(true)}
                          className="cursor-pointer hover:bg-[rgba(176,232,227,0.12)]"
                          disabled={!selectedUserId}
                      >
                          <UserX className="mr-2 text-[#00C4B4]" size={16}/>
                          Delete Selected User Data
                      </DropdownMenuItem>
                      <DropdownMenuItem
                          onClick={() => setIsSimulateDialogOpen(true)}
                          className="cursor-pointer hover:bg-[rgba(176,232,227,0.12)]"
                      >
                          <Trash2 className="mr-2 text-[#00C4B4]" size={16}/>
                          Simulate Missing Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem
                          onClick={() => setIsResetMetricsDialogOpen(true)}
                          className="cursor-pointer hover:bg-[rgba(176,232,227,0.12)]"
                      >
                          <Trash2 className="mr-2 text-red-500" size={16}/>
                          Reset Progress Metrics
                      </DropdownMenuItem>
                      <DropdownMenuItem
                          onClick={() => setIsGenerateDataDialogOpen(true)}
                          className="cursor-pointer hover:bg-[rgba(176,232,227,0.12)]"
                      >
                          <Database className="mr-2 text-[#00C4B4]" size={16}/>
                          Generate Test Data
                      </DropdownMenuItem>
                  </DropdownMenuContent>
              </DropdownMenu>
              <TooltipProvider>
                  <Tooltip>
                      <TooltipTrigger asChild>
                          <HelpCircle className="ml-2 text-[#A4B1B7]" size={16}/>
                      </TooltipTrigger>
                      <TooltipContent className="bg-[#243137] text-white border-[#0C1518] max-w-[250px]">
                          <p>Developer tools for testing and data management. Use these actions to reset data, generate
                              test content, or simulate specific user scenarios.</p>
                      </TooltipContent>
                  </Tooltip>
              </TooltipProvider>
          </div>
      </div>

      {/* Clear Cache Dialog */}
      <Dialog open={isClearCacheDialogOpen} onOpenChange={setIsClearCacheDialogOpen}>
        <DialogContent className="bg-[#0C1518] border-[#243137] text-white">
          <DialogHeader>
            <DialogTitle className="text-red-400">Clear App Data</DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-[#A4B1B7]">
              This will reset all app data including workout plans, sessions, exercise logs, and profile information.
              Your account will remain but you'll be redirected to login. User type and tester description will be
              preserved.
            This action cannot be undone.
          </DialogDescription>
          <DialogFooter>
              <Button
                  variant="outline"
              onClick={() => setIsClearCacheDialogOpen(false)}
              className="border-[#243137] text-[#A4B1B7] hover:bg-[#243137]"
            >
              Cancel
            </Button>
              <Button
              onClick={handleClearCache}
              variant="destructive"
            >
              Clear All Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Simulate Missing Profile Dialog */}
      <Dialog open={isSimulateDialogOpen} onOpenChange={setIsSimulateDialogOpen}>
        <DialogContent className="bg-[#0C1518] border-[#243137] text-white">
          <DialogHeader>
            <DialogTitle className="text-red-400">Simulate Missing Profile</DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-[#A4B1B7]">
              This will reset your profile data (name, height, goals, etc.) while preserving your account.
              All workout data will also be cleared. You'll be redirected to the profile setup page.
              User type and tester description will be preserved.
          </DialogDescription>
          <DialogFooter>
              <Button
                  variant="outline"
              onClick={() => setIsSimulateDialogOpen(false)}
              className="border-[#243137] text-[#A4B1B7] hover:bg-[#243137]"
            >
              Cancel
            </Button>
              <Button
              onClick={handleSimulateMissingProfile}
              variant="destructive"
            >
              Delete Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Progress Metrics Dialog */}
      <Dialog open={isResetMetricsDialogOpen} onOpenChange={setIsResetMetricsDialogOpen}>
        <DialogContent className="bg-[#0C1518] border-[#243137] text-white">
          <DialogHeader>
            <DialogTitle className="text-red-400">Reset Progress Metrics</DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-[#A4B1B7]">
              This will delete only your progress metrics data including weight history, measurements, and other tracked
              metrics.
              Your workout plans, sessions, and profile information will remain intact.
            This action cannot be undone.
          </DialogDescription>
          <DialogFooter>
              <Button
                  variant="outline"
              onClick={() => setIsResetMetricsDialogOpen(false)}
              className="border-[#243137] text-[#A4B1B7] hover:bg-[#243137]"
            >
              Cancel
            </Button>
              <Button
              onClick={handleResetProgressMetrics}
              variant="destructive"
            >
              Reset Metrics
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

        {/* Generate Test Data Dialog */}
        <Dialog open={isGenerateDataDialogOpen} onOpenChange={setIsGenerateDataDialogOpen}>
            <DialogContent className="bg-[#0C1518] border-[#243137] text-white">
                <DialogHeader>
                    <DialogTitle className="text-[#B0E8E3]">Generate Test Data</DialogTitle>
                </DialogHeader>
                <DialogDescription className="text-[#A4B1B7]">
                    This will create a complete set of sample workout data for testing purposes:
                    • 1 workout plan with today's date
                    • 3 workout sessions (today, yesterday, and 2 days ago)
                    • Multiple exercise logs with random exercises, sets, reps, and weights
                    This data will be added to your current account without affecting existing data.
                </DialogDescription>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setIsGenerateDataDialogOpen(false)}
                        className="border-[#243137] text-[#A4B1B7] hover:bg-[#243137]"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleGenerateTestData}
                        className="bg-[#00C4B4] text-black hover:bg-[#00C4B4]/80"
                    >
                        Generate Data
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        {/* Delete User Data Dialog */}
        <Dialog open={isDeleteUserDataDialogOpen} onOpenChange={setIsDeleteUserDataDialogOpen}>
            <DialogContent className="bg-[#0C1518] border-[#243137] text-white">
                <DialogHeader>
                    <DialogTitle className="text-red-400">Delete User Data</DialogTitle>
                </DialogHeader>
                <DialogDescription className="text-[#A4B1B7]">
                    {selectedUserProfile ? (
                        <>
                            This will reset all data for <span className="text-white font-semibold">
                            {selectedUserProfile.full_name || selectedUserProfile.username || 'the selected user'}</span> including
                            workout plans, sessions, exercise logs, and profile information.
                            Their account will remain but all personal data will be cleared.
                            User type and tester description will be preserved.
                        </>
                    ) : (
                        "Please select a user first."
                    )}
                </DialogDescription>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setIsDeleteUserDataDialogOpen(false)}
                        className="border-[#243137] text-[#A4B1B7] hover:bg-[#243137]"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteUserData}
                        variant="destructive"
                        disabled={!selectedUserProfile}
                    >
                        Delete User Data
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        {/* Set Current User Dialog */}
        <Dialog open={isSetCurrentUserDialogOpen} onOpenChange={setIsSetCurrentUserDialogOpen}>
            <DialogContent className="bg-[#0C1518] border-[#243137] text-white">
                <DialogHeader>
                    <DialogTitle className="text-[#B0E8E3]">Set Current User</DialogTitle>
                </DialogHeader>
                <DialogDescription className="text-[#A4B1B7]">
                    {selectedUserProfile ? (
                        <>
                            This will set <span className="text-white font-semibold">
                            {selectedUserProfile.full_name || selectedUserProfile.username || 'the selected user'}</span> as
                            the current user without requiring login.
                            The page will reload to apply the changes.
                        </>
                    ) : (
                        "Please select a user first."
                    )}
                </DialogDescription>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setIsSetCurrentUserDialogOpen(false)}
                        className="border-[#243137] text-[#A4B1B7] hover:bg-[#243137]"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSetCurrentUser}
                        className="bg-[#00C4B4] text-black hover:bg-[#00C4B4]/80"
                        disabled={!selectedUserProfile}
                    >
                        Set as Current User
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </PageContainer>
  );
};

export default TestOptionsPage;
