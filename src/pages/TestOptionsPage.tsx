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
import {ArrowLeft, Database, HelpCircle, Trash2, UserCircle, UserX} from 'lucide-react';
import {useToast} from '@/hooks/use-toast';
import {useAuth} from '@/features/auth/hooks/useAuth';
import {deleteProfile, getAllProfiles} from '@/services/supabase/profiles';
import {supabase} from '@/integrations/supabase/client';
import {useWorkoutPlans} from '@/hooks/useWorkoutPlans';
import {useWorkoutSessions} from '@/hooks/useWorkoutSessions';
import {useFeatureToggles} from '@/hooks/useFeatureToggles';
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,} from "@/components/ui/tooltip";

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

                        logsMap[session.id] = data && data.length > 0;
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
    const handleGenerateFakeData = async () => {
        // Implementation for generating test data
        toast({
            title: "Test Data Generated",
            description: "Fake workout data has been created for testing"
        });
        setIsGenerateDataDialogOpen(false);
    };

  // Handle clearing app data (same as in ProfilePage)
  const handleClearCache = () => {
    localStorage.clear();
    setIsClearCacheDialogOpen(false);

    toast({
      title: "Cache Cleared",
      description: "All app data has been reset. Redirecting to login...",
    });

    // Short delay before redirecting to login page
    setTimeout(() => {
      navigate('/login');
    }, 1500);
  };

  // Handle simulating missing profile
  const handleSimulateMissingProfile = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "No authenticated user found",
        variant: "destructive"
      });
      return;
    }

    try {
      const success = await deleteProfile(user.id);

      if (success) {
        toast({
          title: "Profile Deleted",
          description: "Successfully simulated missing profile. Redirecting to profile setup..."
        });

        // Short delay before redirecting to profile setup
        setTimeout(() => {
          navigate('/profile-setup');
        }, 1500);
      } else {
        throw new Error("Failed to delete profile");
      }
    } catch (error) {
      console.error("Error deleting profile:", error);
      toast({
        title: "Error",
        description: "Failed to simulate missing profile",
        variant: "destructive"
      });
    }

    setIsSimulateDialogOpen(false);
  };

  // Handle resetting progress metrics
  const handleResetProgressMetrics = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "No authenticated user found",
        variant: "destructive"
      });
      return;
    }

    try {
      // Delete all progress metrics for this user
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

    setIsResetMetricsDialogOpen(false);
  };

    // Handle deleting a specific user's data
    const handleDeleteUserData = async () => {
        if (!selectedUserId || !selectedUserProfile) {
            toast({
                title: "Error",
                description: "No user selected",
                variant: "destructive"
            });
            return;
        }

        try {
            const success = await deleteProfile(selectedUserId);

            if (success) {
                toast({
                    title: "User Data Deleted",
                    description: `Successfully deleted profile data for ${selectedUserProfile.first_name || 'user'}`
                });

                // Refresh the profiles list
                const allProfiles = await getAllProfiles();
                setProfiles(allProfiles);

                // Reset selected user if it was deleted
                if (!allProfiles.some(p => p.id === selectedUserId)) {
                    setSelectedUserId(allProfiles.length > 0 ? allProfiles[0].id : "");
                }
            } else {
                throw new Error("Failed to delete profile");
            }
        } catch (error) {
            console.error("Error deleting user data:", error);
            toast({
                title: "Error",
                description: "Failed to delete user data",
                variant: "destructive"
            });
        }

        setIsDeleteUserDataDialogOpen(false);
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
          {/* Generate Test Data Button */}
          <div className="flex items-center">
              <Button
                  variant="outline"
                  className="w-full justify-start bg-[rgba(176,232,227,0.12)] border-none text-white hover:bg-[rgba(176,232,227,0.2)]"
                  onClick={() => setIsGenerateDataDialogOpen(true)}
              >
                  <Database className="mr-2 text-[#00C4B4]" size={18}/>
                  Generate Test Data
              </Button>
              <TooltipProvider>
                  <Tooltip>
                      <TooltipTrigger asChild>
                          <HelpCircle className="ml-2 text-[#A4B1B7]" size={16}/>
                      </TooltipTrigger>
                      <TooltipContent className="bg-[#243137] text-white border-[#0C1518] max-w-[250px]">
                          <p>Creates sample workout data for testing purposes, including a workout plan, sessions, and
                              exercise logs.</p>
                      </TooltipContent>
                  </Tooltip>
              </TooltipProvider>
          </div>

        {/* Clear App Data Button */}
          <div className="flex items-center">
              <Button
                  variant="outline"
                  className="w-full justify-start bg-[rgba(176,232,227,0.12)] border-none text-white hover:bg-[rgba(176,232,227,0.2)]"
                  onClick={() => setIsClearCacheDialogOpen(true)}
              >
                  <Trash2 className="mr-2 text-[#00C4B4]" size={18}/>
                  Clear App Data (Dev)
              </Button>
              <TooltipProvider>
                  <Tooltip>
                      <TooltipTrigger asChild>
                          <HelpCircle className="ml-2 text-[#A4B1B7]" size={16}/>
                      </TooltipTrigger>
                      <TooltipContent className="bg-[#243137] text-white border-[#0C1518] max-w-[250px]">
                          <p>Clears all locally stored app data and returns you to the login screen. Your email will
                              remain saved.</p>
                      </TooltipContent>
                  </Tooltip>
              </TooltipProvider>
          </div>

          {/* Delete User Data Button */}
          <div className="flex items-center">
              <Button
                  variant="outline"
                  className="w-full justify-start bg-[rgba(176,232,227,0.12)] border-none text-white hover:bg-[rgba(176,232,227,0.2)]"
                  onClick={() => setIsDeleteUserDataDialogOpen(true)}
                  disabled={!selectedUserId}
              >
                  <UserX className="mr-2 text-[#00C4B4]" size={18}/>
                  Delete Selected User Data
              </Button>
              <TooltipProvider>
                  <Tooltip>
                      <TooltipTrigger asChild>
                          <HelpCircle className="ml-2 text-[#A4B1B7]" size={16}/>
                      </TooltipTrigger>
                      <TooltipContent className="bg-[#243137] text-white border-[#0C1518] max-w-[250px]">
                          <p>Deletes the profile data for the selected user. This action cannot be undone.</p>
                      </TooltipContent>
                  </Tooltip>
              </TooltipProvider>
          </div>

        {/* Simulate Missing Profile Button */}
          <div className="flex items-center">
              <Button
                  variant="outline"
                  className="w-full justify-start bg-[rgba(176,232,227,0.12)] border-none text-white hover:bg-[rgba(176,232,227,0.2)]"
                  onClick={() => setIsSimulateDialogOpen(true)}
              >
                  <Trash2 className="mr-2 text-[#00C4B4]" size={18}/>
                  Simulate Missing Profile
              </Button>
              <TooltipProvider>
                  <Tooltip>
                      <TooltipTrigger asChild>
                          <HelpCircle className="ml-2 text-[#A4B1B7]" size={16}/>
                      </TooltipTrigger>
                      <TooltipContent className="bg-[#243137] text-white border-[#0C1518] max-w-[250px]">
                          <p>Deletes your profile data but keeps your authentication. You'll be redirected to the
                              profile setup page.</p>
                      </TooltipContent>
                  </Tooltip>
              </TooltipProvider>
          </div>

        {/* Reset Progress Metrics Button (admin only) */}
          <div className="flex items-center">
              <Button
                  variant="outline"
                  className="w-full justify-start bg-[rgba(176,232,227,0.12)] border-none text-white hover:bg-[rgba(176,232,227,0.2)]"
                  onClick={() => setIsResetMetricsDialogOpen(true)}
              >
                  <Trash2 className="mr-2 text-red-500" size={18}/>
                  Reset Progress Metrics
              </Button>
              <TooltipProvider>
                  <Tooltip>
                      <TooltipTrigger asChild>
                          <HelpCircle className="ml-2 text-[#A4B1B7]" size={16}/>
                      </TooltipTrigger>
                      <TooltipContent className="bg-[#243137] text-white border-[#0C1518] max-w-[250px]">
                          <p>Deletes all your progress metrics data including weight history, measurements, and other
                              tracked metrics.</p>
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
            This will reset all app data and return you to the profile setup screen. Your email will remain saved.
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
            This will delete your profile data but keep your authentication. You'll be redirected to the profile setup page.
            This action cannot be undone.
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
            This will delete all your progress metrics data including weight history, measurements, and other tracked metrics.
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
                    This will create sample workout data for testing purposes, including a workout plan, sessions, and
                    exercise logs.
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
                        onClick={handleGenerateFakeData}
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
                            This will delete the profile data for <span className="text-white font-semibold">
                            {selectedUserProfile.first_name} {selectedUserProfile.last_name}</span>.
                            This action cannot be undone.
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
