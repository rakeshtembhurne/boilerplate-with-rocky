"use client";

import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { SectionColumns } from "@/components/dashboard/section-columns";
import { useDeleteAccountModal } from "@/components/modals/delete-account-modal";
import { Icons } from "@/components/shared/icons";

export function DeleteAccountSection() {
  const { setShowDeleteAccountModal, DeleteAccountModal } =
    useDeleteAccountModal();

  const userPaidPlan = true;

  return (
    <>
      <DeleteAccountModal />
      <div className="rounded-lg border bg-card p-6">
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">Delete Account</h3>
            <p className="text-sm text-muted-foreground">
              This is a danger zone - Be careful!
            </p>
          </div>

          <div className="rounded-lg border border-red-400 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/20">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Are you sure?</span>

                  {userPaidPlan ? (
                    <div className="flex items-center gap-1.5 rounded-md bg-red-600/10 px-2 py-1 text-xs font-medium text-red-600 dark:bg-red-500/10 dark:text-red-500">
                      <div className="rounded-full bg-red-600 p-[3px]">
                        <Icons.close size={10} className="text-background" />
                      </div>
                      Active Subscription
                    </div>
                  ) : null}
                </div>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your {siteConfig.name} account
                  {userPaidPlan ? " and your subscription" : ""}. This action cannot
                  be undone - please proceed with caution.
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={() => setShowDeleteAccountModal(true)}
              >
                <Icons.trash className="mr-2 size-4" />
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
