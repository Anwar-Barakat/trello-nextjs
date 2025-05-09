"use client";

import { useEffect, useState } from "react";
import { getOrganizationLogs } from "@/actions/audit-log/get-organization-logs";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Clock,
    PlusCircle,
    TrashIcon,
    Pencil,
    ArrowUpDown,
    Copy,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type AuditLog = {
    id: string;
    entityId: string;
    entityType: string;
    action: string;
    userId: string;
    organizationId: string;
    createdAt: string | Date;
    user: {
        id: string;
        firstName: string | null;
        lastName: string | null;
        imageUrl: string;
    };
};

interface OrgActivitiesProps {
    organizationId: string;
}

export const OrgActivities = ({ organizationId }: OrgActivitiesProps) => {
    const [activities, setActivities] = useState<AuditLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                setIsLoading(true);
                const response = await getOrganizationLogs(organizationId);

                if (response.success && 'data' in response) {
                    setActivities(response.data as unknown as AuditLog[]);
                } else {
                    toast.error('message' in response ? response.message : "Please try again later");
                }
            } catch (error) {
                console.error("Error fetching organization activities:", error);
                toast.error("Unable to load activities");
            } finally {
                setIsLoading(false);
            }
        };

        if (organizationId) {
            fetchActivities();
        }
    }, [organizationId]);

    // Helper function to get action icon
    const getActionIcon = (action: string) => {
        switch (action) {
            case "CREATE":
                return <PlusCircle className="h-3 w-3 text-emerald-500" />;
            case "UPDATE":
                return <Pencil className="h-3 w-3 text-blue-500" />;
            case "DELETE":
                return <TrashIcon className="h-3 w-3 text-rose-500" />;
            case "REORDER":
                return <ArrowUpDown className="h-3 w-3 text-amber-500" />;
            case "COPY":
                return <Copy className="h-3 w-3 text-indigo-500" />;
            default:
                return <Clock className="h-3 w-3 text-muted-foreground" />;
        }
    };

    // Helper function to format entity type
    const formatEntityType = (type: string) => {
        return type.charAt(0) + type.slice(1).toLowerCase();
    };

    // Helper function to get user name
    const getUserName = (user: AuditLog["user"]) => {
        if (user.firstName && user.lastName) {
            return `${user.firstName} ${user.lastName}`;
        }

        return "Unknown User";
    };

    // Helper function to get initials for avatar
    const getInitials = (user: AuditLog["user"]) => {
        if (user.firstName && user.lastName) {
            return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
        }

        return "U";
    };

    // Helper function to format activity description
    const getActivityDescription = (activity: AuditLog) => {
        const action = activity.action.toLowerCase();
        const entityType = formatEntityType(activity.entityType);

        return `${action}d ${entityType}`;
    };

    if (isLoading) {
        return (
            <div className="space-y-2 mt-2">
                <h3 className="text-xs font-medium text-muted-foreground px-4">Recent Activity</h3>
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-2 px-4 py-2">
                        <Skeleton className="h-6 w-6 rounded-full" />
                        <div className="space-y-1 flex-1">
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-2 w-2/3" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!activities.length) {
        return (
            <div className="px-4 py-3">
                <h3 className="text-xs font-medium text-muted-foreground">Recent Activity</h3>
                <p className="text-xs text-muted-foreground mt-2">No recent activity found</p>
            </div>
        );
    }

    return (
        <div className="px-2 py-2">
            <h3 className="text-xs font-medium text-muted-foreground px-2 mb-2">Recent Activity</h3>
            <div className="space-y-1">
                {activities.map((activity) => (
                    <div
                        key={activity.id}
                        className="text-xs rounded-md px-2 py-1.5 hover:bg-muted/50 transition-colors"
                    >
                        <div className="flex items-center gap-1.5">
                            <Avatar className="h-5 w-5">
                                <AvatarImage src={activity.user.imageUrl} />
                                <AvatarFallback className="text-[8px]">
                                    {getInitials(activity.user)}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 flex flex-col">
                                <p className="leading-tight">
                                    <span className="font-medium">{getUserName(activity.user)}</span>
                                    {" "}
                                    <span className="text-muted-foreground">
                                        {getActivityDescription(activity)}
                                    </span>
                                </p>
                                <div className="flex items-center gap-1">
                                    {getActionIcon(activity.action)}
                                    <span className="text-[10px] text-muted-foreground">
                                        {format(new Date(activity.createdAt), "MMM dd, h:mm a")}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}; 