import Link from "next/link"
import { getMessages } from '@/messages';

interface BottomNavigationProps {
  locale?: string;
}

export default function Component({ locale = "en" }: BottomNavigationProps) {
  const currentLocale = (locale || 'en') as 'en' | 'ar';
  const isRTL = currentLocale === 'ar';
  const t = getMessages(currentLocale);

  const navItems = [
    {
      href: `/${locale}`,
      icon: <HomeIcon className="h-6 w-6" />,
      label: t.bottomNavHome
    },
    {
      href: `/${locale}/unit-information`,
      icon: <InfoIcon className="h-6 w-6" />,
      label: t.bottomNavUnitInfo
    },
    {
      href: `/${locale}/partners`,
      icon: <GiftIcon className="h-6 w-6" />,
      label: t.bottomNavPartners
    },
    {
      href: `/${locale}/emergency`,
      icon: <PhoneIcon className="h-6 w-6" />,
      label: t.bottomNavContact
    }
  ];

  // Reverse the array for RTL
  const orderedItems = isRTL ? [...navItems].reverse() : navItems;

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 flex h-14 w-full items-center justify-around bg-background shadow-[0_-2px_4px_rgba(0,0,0,0.1)] md:h-16"
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
    >
      {orderedItems.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className="flex flex-col items-center justify-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary focus:text-primary"
          prefetch={false}
          style={{ flexDirection: 'column' }}
        >
          {item.icon}
          <span className="text-center">{item.label}</span>
        </Link>
      ))}
    </nav>
  )
}

function HomeIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function GiftIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 12 20 22 4 22 4 12" />
      <rect x="2" y="7" width="20" height="5" />
      <line x1="12" y1="22" x2="12" y2="7" />
      <path d="M12 7c-1.657 0-3-1.343-3-3 0-.552.448-1 1-1 1.105 0 2 .895 2 2" />
      <path d="M12 7c1.657 0 3-1.343 3-3 0-.552-.448-1-1-1-1.105 0-2 .895-2 2" />
    </svg>
  )
}

function InfoIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <circle cx="12" cy="8" r="1" />
    </svg>
  )
}

function PhoneIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}
