import {
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaFacebook,
  FaYoutube,
  FaTiktok,
  FaGithub,
} from "react-icons/fa";
import { IconType } from "react-icons";
import Link from "next/link";

const ICON_MAP: Record<string, IconType> = {
  instagram: FaInstagram,
  twitter: FaTwitter,
  linkedin: FaLinkedin,
  facebook: FaFacebook,
  youtube: FaYoutube,
  tiktok: FaTiktok,
  github: FaGithub,
};

type SocialIconProps = {
  platform: string;
  url: string;
  size?: number;
  className?: string;
};

export default function SocialIcon({
  platform,
  url,
  size = 18,
  className = "text-white hover:text-primary transition-colors duration-150 mb-0",
}: SocialIconProps) {
  const Icon = ICON_MAP[platform.toLowerCase()];

  if (!Icon) return null;

  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={platform}
      className={className}
    >
      <Icon size={size} />
    </Link>
  );
}
