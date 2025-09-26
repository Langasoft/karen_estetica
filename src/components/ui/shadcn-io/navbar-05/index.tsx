'use client';

import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { BellIcon, HelpCircleIcon, UserIcon, ChevronDownIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ComponentProps } from 'react';

// Simple logo component for the navbar
const Logo = (props: React.SVGAttributes<SVGElement>) => {
  return (
    <svg width='1em' height='1em' viewBox='0 0 324 323' fill='currentColor' xmlns='http://www.w3.org/2000/svg' {...props}>
      <rect
        x='88.1023'
        y='144.792'
        width='151.802'
        height='36.5788'
        rx='18.2894'
        transform='rotate(-38.5799 88.1023 144.792)'
        fill='currentColor'
      />
      <rect
        x='85.3459'
        y='244.537'
        width='151.802'
        height='36.5788'
        rx='18.2894'
        transform='rotate(-38.5799 85.3459 244.537)'
        fill='currentColor'
      />
    </svg>
  );
};

// Hamburger icon component
const HamburgerIcon = ({ className, ...props }: React.SVGAttributes<SVGElement>) => (
  <svg
    className={cn('pointer-events-none', className)}
    width={16}
    height={16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M4 12L20 12"
      className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
    />
    <path
      d="M4 12H20"
      className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
    />
    <path
      d="M4 12H20"
      className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
    />
  </svg>
);

// Info Menu Component
const InfoMenu = ({ onItemClick }: { onItemClick?: (item: string) => void }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon" className="h-9 w-9">
        <HelpCircleIcon className="h-4 w-4" />
        <span className="sr-only">Help and Information</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-56">
      <DropdownMenuLabel>Ayuda</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        onClick={() => {
          if (typeof window !== 'undefined') {
            window.location.href = 'mailto:soporte@karencei.com?subject=Ayuda%20y%20soporte';
          }
          onItemClick?.('contact');
        }}
      >
        Contacta a Soporte
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => {
          if (typeof window !== 'undefined') {
            window.location.href = 'mailto:sugerencias@karencei.com?subject=Sugerencias';
          }
          onItemClick?.('feedback');
        }}
      >
        Envia tu opinion
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

// Notification Menu Component
const NotificationMenu = ({ onItemClick }: { onItemClick?: (item: string) => void }) => {
  const [count, setCount] = React.useState<number>(0);
  const [citas, setCitas] = React.useState<Array<{ id_agenda:number; fecha:string; hora:string; nombre_servicio?:string}>>([]);

  const load = async () => {
    const ci = typeof window !== 'undefined' ? localStorage.getItem('clientCi') : null;
    if (!ci) return;
    const res = await fetch(`/api/usuarios/notificaciones?ci=${ci}`);
    const data = await res.json();
    setCitas(data.citas || []);
    setCount((data.citas || []).length);
  };

  React.useEffect(() => {
    load();
  }, []);

  return (
    <DropdownMenu onOpenChange={(open)=>{
      if (open) {
        setCount(0); // marcar como leído
      }
    }}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 relative">
          <BellIcon className="h-4 w-4" />
          {count > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs rounded-full"
              style={{ backgroundColor: 'var(--brand-quaternary)', color: 'var(--brand-secondary)' }}
            >
              {count > 9 ? '9+' : count}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {citas.length === 0 && (
          <div className="px-3 py-2 text-sm text-muted-foreground">Sin próximas citas</div>
        )}
        {citas.map((cita) => (
          <DropdownMenuItem key={cita.id_agenda} className="flex flex-col items-start gap-0.5">
            <p className="text-sm font-medium">{cita.nombre_servicio || 'Cita'}</p>
            <p className="text-xs text-muted-foreground">{cita.fecha} {cita.hora}</p>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// User Menu Component
const UserMenu = ({
  userName = 'Usuario',
  userEmail = '',
  userAvatar,
  onItemClick
}: {
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  onItemClick?: (item: string) => void;
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" className="h-9 px-2 py-0 hover:bg-accent hover:text-accent-foreground">
        <Avatar className="h-7 w-7">
          <AvatarImage src={userAvatar} alt={userName} />
          <AvatarFallback className="text-xs">
            {userName.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <ChevronDownIcon className="h-3 w-3 ml-1" />
        <span className="sr-only">Menú de usuario</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-56">
      <DropdownMenuLabel>
        <div className="flex flex-col space-y-1">
          <p className="text-sm font-medium leading-none">{userName}</p>
          {userEmail && (
            <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
          )}
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => onItemClick?.('profile')}>
        Perfil
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onItemClick?.('password')}>
        Cambio de contraseña
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => onItemClick?.('logout')}>
        Salir
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

// Types
export interface Navbar05NavItem {
  href?: string;
  label: string;
}

export interface Navbar05Props extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode;
  logoHref?: string;
  navigationLinks?: Navbar05NavItem[];
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  notificationCount?: number;
  onNavItemClick?: (href: string) => void;
  onInfoItemClick?: (item: string) => void;
  onNotificationItemClick?: (item: string) => void;
  onUserItemClick?: (item: string) => void;
}

// Default navigation links
const defaultNavigationLinks: Navbar05NavItem[] = [
  { href: '#', label: 'Home' },
  { href: '#', label: 'Features' },
  { href: '#', label: 'Pricing' },
  { href: '#', label: 'About' },
];

export const Navbar05 = React.forwardRef<HTMLElement, Navbar05Props>(
  (
    {
      className,
      logo = <Logo />,
      logoHref = '#',
      navigationLinks = defaultNavigationLinks,
      userName = 'John Doe',
      userEmail = 'john@example.com',
      userAvatar,
      notificationCount = 3,
      onNavItemClick,
      onInfoItemClick,
      onNotificationItemClick,
      onUserItemClick,
      ...props
    },
    ref
  ) => {
    const [isMobile, setIsMobile] = useState(false);
    const containerRef = useRef<HTMLElement>(null);

    useEffect(() => {
      const checkWidth = () => {
        if (containerRef.current) {
          const width = containerRef.current.offsetWidth;
          setIsMobile(width < 768); // 768px is md breakpoint
        }
      };

      checkWidth();

      const resizeObserver = new ResizeObserver(checkWidth);
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }

      return () => {
        resizeObserver.disconnect();
      };
    }, []);

    // Combine refs
    const combinedRef = React.useCallback((node: HTMLElement | null) => {
      containerRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    }, [ref]);

    return (
      <header
        ref={combinedRef}
        className={cn(
          'sticky top-0 z-50 w-full border-b bg-[--brand-secondary]/70 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6 [&_*]:no-underline',
          className
        )}
        {...props}
      >
        <div className="mx-auto max-w-6xl px-4 md:px-6 flex h-16 items-center justify-between gap-4">
          {/* Left side */}
          <div className="flex items-center gap-2">
            {/* Mobile menu trigger */}
            {isMobile && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    className="group h-9 w-9 hover:bg-accent hover:text-accent-foreground"
                    variant="ghost"
                    size="icon"
                  >
                    <HamburgerIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-64 p-1">
                  <NavigationMenu className="max-w-none">
                    <NavigationMenuList className="flex-col items-start gap-0">
                      {navigationLinks.map((link, index) => (
                        <NavigationMenuItem key={index} className="w-full">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              if (onNavItemClick && link.href) onNavItemClick(link.href);
                            }}
                            className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer no-underline"
                          >
                            {link.label}
                          </button>
                        </NavigationMenuItem>
                      ))}
                    </NavigationMenuList>
                  </NavigationMenu>
                </PopoverContent>
              </Popover>
            )}
            {/* Main nav (brand + links) */}
            <div className="flex items-center gap-6">
              {/* Icono de configuración → /admin */}
              <a href="/admin" aria-label="Administración" className="inline-flex items-center justify-center hover:opacity-80 transition-opacity">
                <svg className="h-4 w-4 text-[--brand-quaternary]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a1.5 1.5 0 0 1-2.1 2.1l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V19a1.5 1.5 0 0 1-3 0v-.1a1 1 0 0 0-.6-.9 1 1 0 0 0-1.1.2l-.1.1a1.5 1.5 0 1 1-2.1-2.1l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H5a1.5 1.5 0 0 1 0-3h.1a1 1 0 0 0 .9-.6 1 1 0 0 0-.2-1.1l-.1-.1A1.5 1.5 0 0 1 7.8 5l.1.1a1 1 0 0 0 1.1.2H9a1 1 0 0 0 .6-.9V4a1.5 1.5 0 0 1 3 0v.1a1 1 0 0 0 .6.9 1 1 0 0 0 1.1-.2l.1-.1a1.5 1.5 0 0 1 2.1 2.1l-.1.1a1 1 0 0 0-.2 1.1 1 1 0 0 0 .9.6H19a1.5 1.5 0 0 1 0 3h-.1a1 1 0 0 0-.9.6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>

              <a href="/" className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold text-[--brand-quaternary] tracking-tight">Karen</span>
                <span className="text-2xl font-light text-[--brand-tertiary]">Estética Integral</span>
              </a>
              {/* Links se muestran en el lado derecho para evitar duplicados */}
            </div>
          </div>
          {/* Right side: enlaces + menús */}
          <div className="hidden sm:flex items-center gap-6 text-sm text-[--foreground]/80">
            {/* Enlaces primarios como en Navbar.tsx */}
            {navigationLinks.map((link, index) => (
              <a key={index} href={link.href} className="hover:text-[--brand-quaternary] transition-colors">
                {link.label}
              </a>
            ))}
            <div className="flex items-center gap-4 ml-2">
              <div className="flex items-center gap-2">
              {/* Info menu */}
              <InfoMenu onItemClick={onInfoItemClick} />
              {/* Notification */}
              <NotificationMenu 
                notificationCount={notificationCount}
                onItemClick={onNotificationItemClick}
              />
              </div>
              {/* User menu */}
              <UserMenu 
                userName={userName}
                userEmail={userEmail}
                userAvatar={userAvatar}
                onItemClick={onUserItemClick}
              />
            </div>
          </div>
        </div>
      </header>
    );
  }
);

Navbar05.displayName = 'Navbar05';

export { Logo, HamburgerIcon, InfoMenu, NotificationMenu, UserMenu };