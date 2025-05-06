
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { deleteProfile } from '@/services/supabase/profiles';
import { supabase } from '@/integrations/supabase/client';

const TestOptionsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isClearCacheDialogOpen, setIsClearCacheDialogOpen] = useState(false);
  const [isSimulateDialogOpen, setIsSimulateDialogOpen] = useState(false);
  const [isResetMetricsDialogOpen, setIsResetMetricsDialogOpen] = useState(false);

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

      <div className="w-full max-w-[300px] mx-auto space-y-4">
        {/* Clear App Data Button */}
        <Button 
          variant="outline" 
          className="w-full justify-start bg-[rgba(176,232,227,0.12)] border-none text-white hover:bg-[rgba(176,232,227,0.2)]"
          onClick={() => setIsClearCacheDialogOpen(true)}
        >
          <Trash2 className="mr-2 text-[#00C4B4]" size={18} />
          Clear App Data (Dev)
        </Button>

        {/* Simulate Missing Profile Button */}
        <Button 
          variant="outline" 
          className="w-full justify-start bg-[rgba(176,232,227,0.12)] border-none text-white hover:bg-[rgba(176,232,227,0.2)]"
          onClick={() => setIsSimulateDialogOpen(true)}
        >
          <Trash2 className="mr-2 text-[#00C4B4]" size={18} />
          Simulate Missing Profile
        </Button>

        {/* Reset Progress Metrics Button (admin only) - We check for adminAccess in the ProfilePage component */}
        <Button 
          variant="outline" 
          className="w-full justify-start bg-[rgba(176,232,227,0.12)] border-none text-white hover:bg-[rgba(176,232,227,0.2)]"
          onClick={() => setIsResetMetricsDialogOpen(true)}
        >
          <Trash2 className="mr-2 text-red-500" size={18} />
          Reset Progress Metrics
        </Button>
      </div>

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

      {/* Simulate Missing Profile Dialog */}
      <Dialog open={isSimulateDialogOpen} onOpenChange={setIsSimulateDialogOpen}>
        <DialogContent className="bg-[#0C1518] border-[#243137] text-white">
          <DialogHeader>
            <DialogTitle className="text-red-400">Simulate Missing Profile</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p className="text-[#A4B1B7]">
              This will delete your profile data but keep your authentication. You'll be redirected to the profile setup page.
            </p>
            <p className="text-[#A4B1B7] mt-2">
              This action cannot be undone.
            </p>
          </div>

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

          <div className="py-4">
            <p className="text-[#A4B1B7]">
              This will delete all your progress metrics data including weight history, measurements, and other tracked metrics.
            </p>
            <p className="text-[#A4B1B7] mt-2">
              This action cannot be undone.
            </p>
          </div>

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
    </PageContainer>
  );
};

export default TestOptionsPage;
