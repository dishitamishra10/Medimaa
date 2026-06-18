import React from 'react';
import Link from 'next/link';
import ThemeToggle from '@/components/ui/ThemeToggle';

const SettingsPage = () => {
  return (
    <div>
      <ThemeToggle/>
      <br></br>
      <Link href='/share-access'>Send access request</Link>
    </div>
  )
}

export default SettingsPage