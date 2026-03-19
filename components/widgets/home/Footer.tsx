import { Instagram, Twitter, Linkedin } from "lucide-react";
import Image from "next/image";
import { translate } from "@/i18n/lib/translate";

const footerLinks = {
  // [translate("discover")]: [
  //   translate("featured_events_link"),
  //   translate("this_weekend"),
  //   translate("trending"),
  //   translate("categories"),
  // ],
  // [translate("organizers")]: [
  //   translate("post_an_event"),
  //   translate("promote_brand"),
  //   translate("pricing"),
  //   translate("success_stories"),
  // ],
  // [translate("company")]: [
  //   translate("about_us"),
  //   translate("careers"),
  //   translate("contact"),
  //   translate("legal"),
  // ],
};

export default function Footer() {
  return (
    <footer className="w-full bg-header">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="flex flex-col gap-5">
            <Image src="/logo.png" alt="logo" width={168} height={48} />
            <p className="text-[#7a93b0] text-sm leading-relaxed max-w-[220px]">
              {translate("footer_description")}
            </p>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading} className="flex flex-col gap-4">
              <h4 className="text-white font-bold text-sm">{heading}</h4>
              <ul className="flex flex-col gap-3">
                {/*{links.map((link) => (*/}
                {/*  <li key={link}>*/}
                {/*    <a*/}
                {/*      href="#"*/}
                {/*      className="text-[#7a93b0] text-sm hover:text-white transition-colors duration-150"*/}
                {/*    >*/}
                {/*      {link}*/}
                {/*    </a>*/}
                {/*  </li>*/}
                {/*))}*/}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#ffffff0a]">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between gap-4 flex-wrap">
          <p className="text-[#7a93b0] text-sm">
            {translate("footer_copyright")}
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-[#7a93b0] hover:text-white transition-colors duration-150"
              aria-label="Instagram"
            >
              <Instagram size={18} />
            </a>
            <a
              href="#"
              className="text-[#7a93b0] hover:text-white transition-colors duration-150"
              aria-label="Twitter / X"
            >
              <Twitter size={18} />
            </a>
            <a
              href="#"
              className="text-[#7a93b0] hover:text-white transition-colors duration-150"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
