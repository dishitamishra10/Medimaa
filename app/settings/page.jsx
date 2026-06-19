"use client";

import React from 'react';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useAuth } from '@/hooks/useAuth';
import AccessRestricted from '@/components/restricted-access/AccessRestricted';
import LoadingState from '@/components/loading/LoadingState';

const SettingsPage = () => {
  const { user, isLoading } = useAuth();

  if(isLoading){
    return(
      <LoadingState message="Loading settings…"/>
    )
  }

  if(!user){
    return (
      <AccessRestricted message="Log in to view and manage your account settings."/>
    )
  }


  return (
    <div>
      <ThemeToggle />
    </div>
  )
}

export default SettingsPage