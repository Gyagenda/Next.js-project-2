"use client";
import { asyncWrapProviders } from "async_hooks";
import {Button} from "./button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import router from "next/dist/shared/lib/router/router";
import { useRouter } from "next/dist/client/components/navigation";

function LogOutButton() {
     const { toast } = useToast();
     const router = useRouter();
     
  const [loading, setLoading] = useState(false);

  const handleLogOut = async () => {
    setLoading(true);
    const { errorMessage } = await logOutAction();
      if (!errorMessage) {
      router.push(`/?toastType=logOut`);
    } else {
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  return (
    <Button 
      variant="outline"
      onClick={handleLogOut}
      disabled={loading}
      className="w-24"
    >
      {loading ? <Loader2 className="animate-spin" /> : "Log Out"}
    </Button>
  );
}

 export default LogOutButton;
async function logOutAction(): Promise<{ errorMessage: string | null }> {
    try {
        const response = await fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            return { errorMessage: 'Failed to log out. Please try again.' };
        }

        return { errorMessage: null };
    } catch (error) {
        return { errorMessage: 'Network error. Please check your connection and try again.' };
    }
}
function useToast(): { toast: any; } {
    return {
        toast: ({ title, description, variant }: { title: string; description: string; variant?: string }) => {
            if (variant === "destructive") {
                toast.error(`${title}: ${description}`);
            } else {
                toast.success(`${title}: ${description}`);
            }
        }
    };
}

