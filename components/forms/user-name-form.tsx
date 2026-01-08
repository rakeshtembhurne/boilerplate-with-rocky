"use client";

import { useState, useTransition } from "react";
import { updateUserName, type FormData } from "@/actions/update-user-name";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { useSession } from "@/lib/next-auth-compat";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { userNameSchema } from "@/lib/validations/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionColumns } from "@/components/dashboard/section-columns";
import { Icons } from "@/components/shared/icons";

interface UserNameFormProps {
  user: Pick<User, "id" | "name">;
}

export function UserNameForm({ user }: UserNameFormProps) {
  const { data: session } = useSession();
  const [updated, setUpdated] = useState(false);
  const [isPending, startTransition] = useTransition();
  const updateUserNameWithId = updateUserName.bind(null, user.id);

  const checkUpdate = (value) => {
    setUpdated(user.name !== value);
  };

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userNameSchema),
    defaultValues: {
      name: user?.name || "",
    },
  });

  const onSubmit = handleSubmit((data) => {
    startTransition(async () => {
      const { status } = await updateUserNameWithId(data);

      if (status !== "success") {
        toast.error("Something went wrong.", {
          description: "Your name was not updated. Please try again.",
        });
      } else {
        // betterAuth automatically updates the session atom
        setUpdated(false);
        toast.success("Your name has been updated.");
      }
    });
  });

  return (
    <div className="rounded-lg border bg-card p-6">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Your Name</h3>
          <p className="text-sm text-muted-foreground">
            Please enter a display name you are comfortable with.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
            <div className="flex-1">
              <Label htmlFor="name" className="sr-only">
                Name
              </Label>
              <Input
                id="name"
                className="w-full"
                {...register("name")}
                onChange={(e) => checkUpdate(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            <Button
              type="submit"
              variant={updated ? "default" : "disable"}
              disabled={isPending || !updated}
              className="sm:w-auto"
            >
              {isPending ? (
                <Icons.spinner className="size-4 animate-spin" />
              ) : (
                <>
                  Save Changes
                </>
              )}
            </Button>
          </div>

          {errors?.name && (
            <p className="text-sm text-red-600">
              {errors.name.message}
            </p>
          )}
          <p className="text-xs text-muted-foreground">Max 32 characters</p>
        </div>
      </form>
    </div>
  );
}
