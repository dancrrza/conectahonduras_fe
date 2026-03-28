import Image from "next/image";
import { getImageUrl } from "@/sanity/lib/image-builder";
import { fetchFooterByType } from "@/sanity/queries/footer";
import Link from "next/link";
import { DynamicIcon } from "lucide-react/dynamic";
import SocialIcon from "@/components/widgets/footer/SocialIcon";

export default async function Footer() {
  const data = await fetchFooterByType();

  if (!data) {
    return null;
  }

  return (
    <footer className="footer-bg text-white">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="flex flex-col gap-5">
            {data.logo && (
              <Image
                src={getImageUrl(data.logo)}
                alt="logo"
                width={168}
                height={48}
              />
            )}
            <p className="text-white text-sm leading-relaxed max-w-[220px] mb-0">
              {data.description}
            </p>
          </div>

          {/* Link Columns */}
          {data.linkGroups.map((linkGroup) => (
            <div key={linkGroup.heading} className="flex flex-col gap-4">
              <h4 className="text-white font-bold text-sm capitalize mb-0">
                {linkGroup.heading}
              </h4>
              <ul className="flex flex-col gap-3">
                {linkGroup.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.url}
                      className="text-white text-sm hover:text-primary transition-colors duration-150 capitalize mb-0"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="container mx-auto px-6 py-5 flex items-center justify-between gap-4 flex-wrap">
          <p className="text-white text-sm mb-0">{data.copyrightText}</p>

          {data.socialLinks.length > 0 && (
            <div className="flex items-center gap-4">
              {data.socialLinks
                .filter((link) => link.platform)
                .map((link) => (
                  <SocialIcon
                    key={link.url}
                    platform={link.platform}
                    url={link.url}
                  />
                ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
