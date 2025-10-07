'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardDescription, CardTitle, CardAction  } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import LanguageSwitcher from '../../components/LanguageSwitcher';

interface WelcomeHeaderProps {
  welcome: string;
  guestName: string;
}

export default function WelcomeHeader({ welcome, guestName }: WelcomeHeaderProps) {
  return (
    <Card className="bg-[#CDB990] border-0 rounded-b-[24px]">
      <CardContent className="px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src="" alt="Guest" />
              <AvatarFallback className="bg-white text-gray-600">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-white text-md font-bold">{welcome}, {guestName}</p>
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
