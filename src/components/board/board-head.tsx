'use client'

import React from 'react'
import { CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useOrganization } from '@clerk/nextjs';
import Image from 'next/image';
import { Building2 } from 'lucide-react';

const BoardHead = () => {
  const { organization, isLoaded } = useOrganization();
  
  if (!organization || !isLoaded) return null;

  return (
    <CardHeader className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-primary/20 shadow-lg">
          {organization.imageUrl ? (
            <Image
              src={organization.imageUrl}
              alt={organization.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-primary/10 flex items-center justify-center">
              <Building2 className="w-8 h-8 text-primary/50" />
            </div>
          )}
        </div>
        <div className="space-y-1">
          <CardTitle className="text-3xl font-bold tracking-tight">
            {organization.name}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Manage your organization settings and preferences 
          </CardDescription>
        </div>
      </div>
    </CardHeader>
  )
}

export default BoardHead;
