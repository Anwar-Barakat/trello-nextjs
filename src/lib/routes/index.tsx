import {
  LucideIcon,
  Activity,
  CreditCard,
  Layout,
  Settings,
} from "lucide-react";

export interface RouteConfig {
  label: string;
  icon: LucideIcon;
  href: string;
}

export const generateOrganizationRoutes = (
  organizationId: string
): RouteConfig[] => {
  return [
    {
      label: "Boards",
      icon: Layout,
      href: `/organization/${organizationId}`,
    },
    {
      label: "Activity",
      icon: Activity,
      href: `/organization/${organizationId}/activity`,
    },
    {
      label: "Settings",
      icon: Settings,
      href: `/organization/${organizationId}/setting`,
    },
    {
      label: "Billing",
      icon: CreditCard,
      href: `/organization/${organizationId}/billing`,
    },
  ];
};
