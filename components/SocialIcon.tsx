import { SocialIcon } from "@/lib/definitions";
import { Image } from "@nextui-org/react";
import Link from "next/link";

export const SocialIconComponent = ({
  social_name,
  social_fa_icon_type: faType,
  social_fa_icon_name: faName,
  social_fa_icon_color: faColor,
  social_link,
  icon_url,
  icon_width,
  icon_height
}: SocialIcon) => {
  
  const width = icon_width && String(icon_width).length > 0 ? icon_width : 23;
  const height = icon_height && String(icon_height).length > 0 ? icon_height : 23;

  return (
    <Link href={social_link}>
      <div className="flex items-center gap-3">
        {icon_url.length > 0 ? (
          <Image src={icon_url} alt={social_name} width={width} height={height} />
        ) : (
          <i className={`${faType} ${faName}`} style={{ color: faColor }}></i>
        )}
        <p className="line-clamp-1 hover:text-gray-500">{social_name}</p>
      </div>
    </Link>
  );
};

