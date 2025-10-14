'use client';

import { Card, CardContent } from '@/components/ui/card';
import LanguageSwitcher from '../../components/LanguageSwitcher';

interface WelcomeHeaderProps {
  welcome: string;
  guestName: string;
}

export default function WelcomeHeader({ welcome, guestName }: WelcomeHeaderProps) {
  return (
    <Card className="bg-[#CDB990] border-b border-t-0 border-x-0 rounded-b-[24px]">
      <CardContent className="px-2 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="space-y-1">
              <p className="text-white/90 text-sm font-medium tracking-wide leading-tight">
                {welcome}
              </p>
              <p className="text-white text-xl font-bold tracking-tight leading-tight">
                {guestName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
