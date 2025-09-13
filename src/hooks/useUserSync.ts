import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect, useState } from "react";

export function useUserSync() {
  const { user, isLoaded } = useUser();
  const createUser = useMutation(api.userInventory.createUser);
  const [isUserSynced, setIsUserSynced] = useState(false);

  useEffect(() => {
    if (isLoaded && user && !isUserSynced) {
      // Create user in Convex database if they don't exist
      createUser({
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        name: user.firstName || undefined,
        imageUrl: user.imageUrl || undefined,
      }).then(() => {
        setIsUserSynced(true);
      }).catch((error) => {
        console.error("Error creating user:", error);
        // Still mark as synced to avoid infinite retries
        setIsUserSynced(true);
      });
    }
  }, [isLoaded, user, createUser, isUserSynced]);

  return { isUserSynced, isLoaded };
}
