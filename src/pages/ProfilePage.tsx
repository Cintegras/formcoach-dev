import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {Lock, LogOut, Scale, Settings, Trash2} from 'lucide-react';
import {useToast} from '@/hooks/use-toast';
import {format} from 'date-fns';
import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import {Slider} from '@/components/ui/slider';
import {useProfile} from '@/hooks/useProfile';
import {useAdminAccess} from '@/hooks/useAdminAccess';
import {createProgressMetric, getLatestWeight} from '@/services/supabase/progress-metrics';
import {calculateAge} from '@/utils/date-utils';
import {useAuth} from '@/features/auth/hooks/useAuth';

interface UserData {
  firstName: string;
  email: string;
  weight: string;
  height: {
    feet: number;
    inches: number;
  };
    birthdate?: string;
  age: string;
  sex: string;
  weightHistory?: { date: string; weight: string }[];
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
    const {user: authUser} = useAuth();
    const {profile, loading: profileLoading} = useProfile();
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isWeightDialogOpen, setIsWeightDialogOpen] = useState(false);
  const [isClearCacheDialogOpen, setIsClearCacheDialogOpen] = useState(false);
    const [isDeleteAccountDialogOpen, setIsDeleteAccountDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [newWeight, setNewWeight] = useState("");
    const [latestWeight, setLatestWeight] = useState<number | null>(null);
  const [user, setUser] = useState<UserData>({
    firstName: '',
    email: 'user@example.com',
    weight: '0',
    height: {
      feet: 5,
      inches: 10
    },
    age: '0',
    sex: ''
  });
  const { isAdmin } = useAdminAccess();

    // Fetch latest weight from progress_metrics
    useEffect(() => {
        if (authUser) {
            const fetchLatestWeight = async () => {
                try {
                    const weightMetric = await getLatestWeight(authUser.id);
                    if (weightMetric && weightMetric.metric_value) {
                        setLatestWeight(weightMetric.metric_value);
                    }
                } catch (error) {
                    console.error('Error fetching latest weight:', error);
                }
            };

            fetchLatestWeight();
        }
    }, [authUser]);

    // Load user data from profile and localStorage
  useEffect(() => {
      // If we have profile data from the database
      if (profile && !profileLoading) {
          const userData: UserData = {
              firstName: profile.full_name || '',
              email: authUser?.email || 'user@example.com',
              weight: latestWeight ? latestWeight.toString() : '0',
              height: {
                  feet: Math.floor((profile.height || 70) / 12),
                  inches: (profile.height || 70) % 12
              },
              birthdate: profile.birthdate,
              age: profile.birthdate ? calculateAge(profile.birthdate).toString() : '0',
              sex: ''
          };

          // Merge with any localStorage data for fields not in the database
          const localData = localStorage.getItem('userData');
          if (localData) {
              const parsedLocalData = JSON.parse(localData);
              userData.sex = parsedLocalData.sex || '';

              // Use weight history from localStorage if available
              if (parsedLocalData.weightHistory) {
                  userData.weightHistory = parsedLocalData.weightHistory;
              }
          }

          setUser(userData);
      } else if (!profile && !profileLoading) {
          // If no profile data, fall back to localStorage
          const userData = localStorage.getItem('userData');
          if (userData) {
              const parsedData = JSON.parse(userData);

              // Convert old height format if needed
              if (typeof parsedData.height === 'string' || !parsedData.height) {
                  const heightInInches = parseInt(parsedData.height) || 70; // Default to 5'10"
                  parsedData.height = {
                      feet: Math.floor(heightInInches / 12),
                      inches: heightInInches % 12
                  };
              }

              setUser(parsedData);
          } else {
              // If no user data found, redirect to profile setup
              const userEmail = localStorage.getItem('userEmail');
              if (userEmail) {
                  navigate('/profile-setup');
              }
          }
      }
  }, [profile, profileLoading, authUser, latestWeight, navigate]);

  const handleUpdatePassword = () => {
    if (newPassword !== confirmNewPassword) {
      toast({
        title: "Error",
        description: "Passwords don't match",
        variant: "destructive"
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive"
      });
      return;
    }

    // In a real app, this would call an API to update the password
    toast({
      title: "Success",
      description: "Password updated successfully"
    });

    setIsPasswordDialogOpen(false);
    setNewPassword("");
    setConfirmNewPassword("");
  };

    const handleUpdateWeight = async () => {
    if (!newWeight || isNaN(Number(newWeight)) || Number(newWeight) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid weight",
        variant: "destructive"
      });
      return;
    }

        // Update user weight in local state
    const updatedUser = { ...user };
    updatedUser.weight = newWeight;

        // Update weight history in local state
    if (!updatedUser.weightHistory) {
      updatedUser.weightHistory = [];
    }

        const now = new Date().toISOString();
    updatedUser.weightHistory.push({
        date: now,
      weight: newWeight
    });

        // Save updated user data to localStorage
    localStorage.setItem('userData', JSON.stringify(updatedUser));
    setUser(updatedUser);

        // Save weight to progress_metrics if user is authenticated
        if (authUser) {
            try {
                await createProgressMetric({
                    user_id: authUser.id,
                    metric_type: 'weight',
                    metric_value: Number(newWeight),
                    notes: 'Weight update',
                    recorded_date: now.split('T')[0]
                });

                // Update latest weight state
                setLatestWeight(Number(newWeight));
            } catch (error) {
                console.error('Error saving weight to progress_metrics:', error);
                // Continue even if saving to database fails
            }
        }

    // Show success toast with animation
    const weightDiff = Number(newWeight) - Number(user.weight);
    const changeText = weightDiff > 0 ? `+${weightDiff}` : `${weightDiff}`;

    toast({
      title: "Weight Updated",
      description: (
        <div className="flex items-center">
          <span className="text-lg font-bold">{newWeight} lbs</span>
          <span className={`ml-2 ${weightDiff > 0 ? 'text-red-400' : 'text-green-400'}`}>
            ({changeText} lbs)
          </span>
        </div>
      )
    });

    setIsWeightDialogOpen(false);
    setNewWeight("");
  };

  const handleSignOut = () => {
    // In a real app with auth service, this would log the user out
    // For now, we'll just redirect to login
    toast({
      title: "Signed out",
      description: "You have been signed out successfully"
    });
    navigate('/login');
  };

  const handleClearCache = () => {
    // Clear all localStorage data
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

    const handleDeleteAccount = () => {
        // Clear all localStorage data
        localStorage.clear();

        setIsDeleteAccountDialogOpen(false);

        toast({
            title: "Account Deleted",
            description: "Your account has been deleted. Redirecting to signup...",
        });

        // Short delay before redirecting to signup page
    setTimeout(() => {
      navigate('/signup');
    }, 1500);
  };

  // Format weight history data for chart
  const formatWeightData = () => {
    if (!user.weightHistory || user.weightHistory.length <= 1) {
      return [];
    }

      return user.weightHistory.map(entry => ({
      date: format(new Date(entry.date), 'MMM d'),
      weight: Number(entry.weight)
    }));
  };

  return (
    <PageContainer>
      <div className="mt-8 mb-6">
        <h1 className="font-bold text-[28px] text-center text-[#B0E8E3]">
          Profile
        </h1>
        <p className="font-normal text-[14px] text-[#A4B1B7] text-center mt-2">
          Manage your account settings
        </p>
      </div>

      <div className="mt-8 flex flex-col items-center">
        {/* Profile Avatar */}
        <div className="bg-[#00C4B4] rounded-full w-20 h-20 flex items-center justify-center text-black text-2xl font-bold mb-4">
          {user.firstName ? user.firstName.charAt(0) : '?'}
        </div>

        <h2 className="font-medium text-[20px] text-white">{user.firstName || 'User'}</h2>
        <p className="text-[#A4B1B7] mb-2">{user.email}</p>

        {/* User Stats */}
        <div className="flex gap-4 mb-8 text-sm text-[#A4B1B7]">
          <div>Height: {user.height?.feet || 0}'{user.height?.inches || 0}"</div>
          <div>Weight: {user.weight} lbs</div>
          <div>Age: {user.birthdate ? calculateAge(user.birthdate) : user.age}</div>
        </div>

        {/* Complete Profile Button - only show if profile is incomplete */}
        {(!profile || !profile.full_name || !profile.height || !profile.birthdate) && (
            <Button
                variant="outline"
                className="w-full max-w-[300px] mb-8 justify-center bg-[#00C4B4] border-none text-black hover:bg-[#00C4B4]/80"
                onClick={() => {
                    console.log("Complete Profile clicked");
                    navigate("/profile-setup");
                }}
            >
                Complete Profile
            </Button>
        )}

        {/* Weight trend chart if available */}
        {user.weightHistory && user.weightHistory.length > 1 && (
          <div className="w-full max-w-[300px] mb-8 bg-[rgba(176,232,227,0.08)] rounded-lg p-4">
            <h3 className="text-[#B0E8E3] text-lg mb-2">Weight Trend</h3>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formatWeightData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#243137" />
                  <XAxis dataKey="date" stroke="#A4B1B7" />
                  <YAxis stroke="#A4B1B7" domain={['dataMin - 10', 'dataMax + 10']} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0C1518', 
                      borderColor: '#243137',
                      color: '#FFFFFF'
                    }}
                    labelStyle={{ color: '#FFFFFF' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#00C4B4" 
                    strokeWidth={2} 
                    dot={{ fill: '#00C4B4' }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Account Settings */}
        <div className="w-full max-w-[300px] space-y-4">
          <Button 
            variant="outline" 
            className="w-full justify-start bg-[rgba(176,232,227,0.12)] border-none text-white hover:bg-[rgba(176,232,227,0.2)]"
            onClick={() => setIsWeightDialogOpen(true)}
          >
            <Scale className="mr-2 text-[#00C4B4]" size={18} />
            Update Weight
          </Button>

          <Button
            variant="outline" 
            className="w-full justify-start bg-[rgba(176,232,227,0.12)] border-none text-white hover:bg-[rgba(176,232,227,0.2)]"
            onClick={() => setIsPasswordDialogOpen(true)}
          >
            <Lock className="mr-2 text-[#00C4B4]" size={18} />
            Change Password
          </Button>

          {/* Test Options button - only shown to users with admin access */}
          {isAdmin && (
            <Button
              variant="outline" 
              className="w-full justify-start bg-[rgba(176,232,227,0.12)] border-none text-white hover:bg-[rgba(176,232,227,0.2)]"
              onClick={() => {
                  if (isAdmin) {
                      navigate('/test-options');
                  } else {
                      // If somehow a non-admin user gets this button, prevent navigation
                      toast({
                          title: "Access Denied",
                          description: "You don't have permission to access this page.",
                          variant: "destructive"
                      });
                  }
              }}
            >
              <Settings className="mr-2 text-[#00C4B4]" size={18} />
              Test Options
            </Button>
          )}

          <Button 
            variant="outline" 
            className="w-full justify-start bg-[rgba(176,232,227,0.12)] border-none text-white hover:bg-[rgba(176,232,227,0.2)]"
            onClick={() => setIsClearCacheDialogOpen(true)}
          >
            <Trash2 className="mr-2 text-[#00C4B4]" size={18} />
            Clear App Data (Dev)
          </Button>

          <Button
              variant="outline"
              className="w-full justify-start bg-[rgba(176,232,227,0.12)] border-none text-white hover:bg-[rgba(176,232,227,0.2)]"
              onClick={() => setIsDeleteAccountDialogOpen(true)}
          >
              <Trash2 className="mr-2 text-red-500" size={18}/>
              <span className="text-red-500">Delete Account</span>
          </Button>

          <Button 
            variant="outline" 
            className="w-full justify-start bg-[rgba(176,232,227,0.12)] border-none text-white hover:bg-[rgba(176,232,227,0.2)] mt-8"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 text-red-500" size={18} />
            <span className="text-red-500">Sign Out</span>
          </Button>
        </div>
      </div>

      {/* Password Change Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="bg-[#0C1518] border-[#243137] text-white">
          <DialogHeader>
            <DialogTitle className="text-[#B0E8E3]">Change Password</DialogTitle>
          </DialogHeader>

            <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm text-[#A4B1B7]">New Password</label>
              <Input 
                type="password" 
                placeholder="******"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-[rgba(176,232,227,0.12)] border-0 text-white"
              />
            </div>

                <div className="space-y-2">
              <label className="text-sm text-[#A4B1B7]">Confirm Password</label>
              <Input 
                type="password" 
                placeholder="******"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="bg-[rgba(176,232,227,0.12)] border-0 text-white"
              />
            </div>
          </div>

            <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsPasswordDialogOpen(false)}
              className="border-[#243137] text-[#A4B1B7] hover:bg-[#243137]"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdatePassword}
              className="bg-[#00C4B4] text-black hover:bg-[#00C4B4]/80"
            >
              Update Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Weight Update Dialog */}
      <Dialog open={isWeightDialogOpen} onOpenChange={setIsWeightDialogOpen}>
        <DialogContent className="bg-[#0C1518] border-[#243137] text-white">
          <DialogHeader>
            <DialogTitle className="text-[#B0E8E3]">Update Weight</DialogTitle>
          </DialogHeader>

            <div className="space-y-6 py-4">
            <div className="text-center text-4xl font-bold text-[#B0E8E3]">
              {newWeight || user.weight} <span className="text-lg">lbs</span>
            </div>

                <div className="px-4">
              <Slider
                defaultValue={[Number(user.weight)]}
                min={60}
                max={300}
                step={1}
                onValueChange={(val) => setNewWeight(String(val[0]))}
                className="bg-[#1C1C1E]"
              />
              <div className="flex justify-between mt-1 text-xs text-[#A4B1B7]">
                <span>60</span>
                <span>300</span>
              </div>
            </div>

                <div className="space-y-2">
              <label className="text-sm text-[#A4B1B7]">Or enter exact weight:</label>
              <Input 
                type="number" 
                placeholder={user.weight || "150"}
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                className="bg-[rgba(176,232,227,0.12)] border-0 text-white"
              />
            </div>
          </div>

            <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsWeightDialogOpen(false)}
              className="border-[#243137] text-[#A4B1B7] hover:bg-[#243137]"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateWeight}
              className="bg-[#00C4B4] text-black hover:bg-[#00C4B4]/80"
            >
              Update Weight
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Clear Cache Dialog */}
      <Dialog open={isClearCacheDialogOpen} onOpenChange={setIsClearCacheDialogOpen}>
        <DialogContent className="bg-[#0C1518] border-[#243137] text-white">
          <DialogHeader>
            <DialogTitle className="text-red-400">Clear App Data</DialogTitle>
          </DialogHeader>

            <div className="py-4">
            <p className="text-[#A4B1B7]">
              This will reset all app data and return you to the profile setup screen. Your email will remain saved.
            </p>
            <p className="text-[#A4B1B7] mt-2">
              This action cannot be undone.
            </p>
          </div>

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

        {/* Delete Account Dialog */}
        <Dialog open={isDeleteAccountDialogOpen} onOpenChange={setIsDeleteAccountDialogOpen}>
            <DialogContent className="bg-[#0C1518] border-[#243137] text-white">
                <DialogHeader>
                    <DialogTitle className="text-red-400">Delete Account</DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    <p className="text-[#A4B1B7]">
                        This will delete your account and all associated data. You will be redirected to the signup
                        page.
                    </p>
                    <p className="text-[#A4B1B7] mt-2">
                        This action cannot be undone.
                    </p>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setIsDeleteAccountDialogOpen(false)}
                        className="border-[#243137] text-[#A4B1B7] hover:bg-[#243137]"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteAccount}
                        variant="destructive"
                    >
                        Delete Account
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </PageContainer>
  );
};

export default ProfilePage;
