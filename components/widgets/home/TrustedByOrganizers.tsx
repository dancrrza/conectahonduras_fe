import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { TrustedByOrganizersSection } from "@/sanity/types/sections.types";
import { getImageUrl } from "@/sanity/lib/image-builder";
import { translate } from "@/i18n/lib/translate";

export default function TrustedByOrganizers(props: TrustedByOrganizersSection) {
  if (!props.items || !props.items.length) {
    return null;
  }

  return (
    <div className="py-15">
      {/* Heading */}
      <h2 className="text-4xl font-extrabold text-foreground text-center mb-15 tracking-tight">
        {translate("trusted_by_organizers")}
      </h2>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {props.items.map((item) => (
          <Card
            key={item.name}
            className="bg-card border border-border rounded-2xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
          >
            <CardContent className="flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12 rounded-full ring-2 ring-border">
                  <AvatarImage src={getImageUrl(item.avatar)} alt={item.name} />
                </Avatar>
                <div>
                  <p className="text-foreground font-bold text-base leading-tight">
                    {item.name}
                  </p>
                  <p className="text-muted-foreground text-sm">{item.role}</p>
                </div>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {item.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
