'use client';

import { Fragment, useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Link as SitecoreLink, Image } from '@sitecore-content-sdk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Default as Logo } from '@/components/logo/Logo.dev';
import { GlobalHeaderProps } from './global-header.props';
import { Button } from '@/components/ui/button';
import { Url } from 'next/dist/shared/lib/router/router';
import { getFieldValue } from '@/lib/component-props';

export const Default: React.FC<GlobalHeaderProps> = (props) => {
  const { fields, page } = props ?? {};
  const { logo, headerContact } = fields?.data?.item ?? {};
  const links = fields?.data?.item?.children?.results ?? [];
  const logoField = getFieldValue(logo);
  const headerContactField = getFieldValue(headerContact);
  const [isOpen, setIsOpen] = useState(false);
  const pageEditing = page.mode.isEditing;

  const [visible, setVisible] = useState(true);
  const [prevScrollY, setPrevScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 10) {
        setVisible(true);
      } else if (currentScrollY < prevScrollY) {
        setVisible(true);
      } else if (currentScrollY > 10 && currentScrollY > prevScrollY) {
        setVisible(false);
      }
      setPrevScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollY]);

  return (
    <AnimatePresence mode="wait">
      <motion.header
        initial={{ opacity: 1 }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className={cn(
          'bg-background @container sticky top-0 z-50 flex h-[96px] w-full items-center justify-center border-b'
        )}
      >
        <div className="@xl:px-8 mx-auto flex h-16 w-full max-w-screen-xl items-center px-4">
          <div className="mr-8">
            {pageEditing ? (
              <Image field={logoField} className="h-10 w-auto" />
            ) : (
              logoField?.value && (
                <Link
                  href="/"
                  className="flex w-[164px] items-stretch space-x-2 [&_.image-container]:w-full"
                >
                  <Logo logo={logoField} className="w-full" />
                </Link>
              )
            )}
          </div>
          {/* Desktop Navigation */}
          <div className="@lg:flex @lg:flex-1 hidden">
            <NavigationMenu>
              <NavigationMenuList>
                {links &&
                  links.length > 0 &&
                  links.map((item, i) => {
                    const linkField = getFieldValue(item.link);

                    return (
                      <Fragment key={`desktop-nav-menu-list-item-${i}`}>
                        {pageEditing ? (
                          linkField ? (
                            <Button
                              variant="ghost"
                              asChild
                              className="font-body text-base font-medium"
                            >
                              <SitecoreLink field={linkField} />
                            </Button>
                          ) : null
                        ) : (
                          linkField?.value?.href && (
                            <NavigationMenuItem>
                              <Button
                                variant="ghost"
                                asChild
                                className="font-body text-base font-medium"
                              >
                                <Link href={linkField.value.href as string}>
                                  {linkField.value.text}
                                </Link>
                              </Button>
                            </NavigationMenuItem>
                          )
                        )}
                      </Fragment>
                    );
                  })}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          {/* Desktop CTA */}
          {pageEditing ? (
            <div className="@lg:flex @lg:items-center @lg:justify-end hidden">
              {headerContactField ? (
                <Button variant="outline" asChild className="font-heading text-medium rounded-full">
                  <SitecoreLink field={headerContactField} />
                </Button>
              ) : null}
            </div>
          ) : (
            headerContactField?.value?.href && (
              <div className="@lg:flex @lg:items-center @lg:justify-end hidden">
                <Button variant="outline" asChild className="font-heading text-medium rounded-full">
                  <Link href={headerContactField.value.href as Url}>
                    {headerContactField.value.text}
                  </Link>
                </Button>
              </div>
            )
          )}
          {/* Mobile Navigation */}
          <div className="@lg:hidden flex flex-1 justify-end">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-transparent [&_svg]:size-8">
                  <Menu />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="[&>button_svg]:size-8">
                <nav className="mt-[70px] flex flex-col space-y-4">
                  {links &&
                    links.length > 0 &&
                    links.map((item) => {
                      const linkField = getFieldValue(item.link);

                      return (
                        linkField?.value?.href && (
                          <Button
                            key={`${linkField.value.text}-mobile`}
                            variant="ghost"
                            asChild
                            onClick={() => setIsOpen(false)}
                          >
                            <Link href={linkField.value.href as string}>
                              {linkField.value.text}
                            </Link>
                          </Button>
                        )
                      );
                    })}
                  {headerContactField?.value?.href && (
                    <Button
                      variant="outline"
                      asChild
                      className="rounded-full"
                      onClick={() => setIsOpen(false)}
                    >
                      <Link href={headerContactField.value.href as Url}>
                        {headerContactField.value.text}
                      </Link>
                    </Button>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </motion.header>
    </AnimatePresence>
  );
};
