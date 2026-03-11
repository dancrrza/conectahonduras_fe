"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/sanity/lib/image-builder";
import { translate } from "@/lib/translate";
import { ProfilePill } from "./ProfilePill";
import type { HeaderProps } from "@/types/header";

export function DesktopHeader({ data, profile }: HeaderProps) {
  return (
    <header className="fixed top-0 w-full z-50 bg-header backdrop-blur-xl">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src={getImageUrl(data.logo)}
              alt=""
              width={168}
              height={48}
            />
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {data.navLinks.map((link) => (
              <Link
                key={link._key}
                href={link.url}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center w-[180px] justify-end gap-2">
            {profile ? (
              <ProfilePill profile={profile} />
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    {translate("login")}
                  </Button>
                </Link>
                <Link href="/auth/sign-up">
                  <Button>{translate("sign_up")}</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
