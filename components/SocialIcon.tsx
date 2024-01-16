import { SocialIcon } from "@/lib/definitions";
import { Image } from "@nextui-org/react";
import Link from "next/link";

export const SocialIconComponent = ({
  social_name,
  "social-fa-icon-type": faType,
  "social-fa-icon-name": faName,
  social_link,
  icon_url
}: SocialIcon) => (
  <Link href={social_link}>
    <div className="flex items-center gap-3">
      {icon_url ? (
        <Image src={icon_url} alt={social_name} width={100} height={100} />
      ) : faType && faName ? (
        <i className={`${faType} ${faName}`}></i>
      ) : null}
      <p className="line-clamp-1 hover:text-gray-500">{social_name}</p>
    </div>
  </Link>
);