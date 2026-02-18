import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Maria R.",
    role: "Event Manager, Museo ID",
    avatar: "https://i.pravatar.cc/80?img=47",
    initials: "MR",
    quote:
      '"ConectaHonduras has transformed how we reach local audiences. Our gallery openings have seen a 40% increase in attendance."',
  },
  {
    name: "Carlos M.",
    role: "Founder, TechTegus",
    avatar: "https://i.pravatar.cc/80?img=12",
    initials: "CM",
    quote:
      '"Finally a centralized place for tech events. It\'s incredibly easy to post and the community is very engaged."',
  },
  {
    name: "Sofia L.",
    role: "Wellness Coach",
    avatar: "https://i.pravatar.cc/80?img=45",
    initials: "SL",
    quote:
      '"I fill my yoga workshops in days now. The platform is beautiful and so simple to use for small business owners."',
  },
];

export default function TrustedByOrganizers() {
  return (
    <div className="py-15">
      {/* Heading */}
      <h2 className="text-4xl font-extrabold text-white text-center mb-15 tracking-tight">
        Trusted by Organizers
      </h2>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <Card
            key={i}
            className="bg-[#1a2840] border border-[#ffffff10] rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-sky-500/40 hover:shadow-[0_16px_40px_rgba(0,0,0,0.5)]"
          >
            <CardContent className="flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12 rounded-full ring-2 ring-[#ffffff15]">
                  <AvatarImage src={t.avatar} alt={t.name} />
                  <AvatarFallback className="bg-[#295598] text-white text-sm font-semibold">
                    {t.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-white font-bold text-base leading-tight">
                    {t.name}
                  </p>
                  <p className="text-[#8fa3c0] text-sm">{t.role}</p>
                </div>
              </div>
              <p className="text-[#c8d8ec] text-sm leading-relaxed">
                {t.quote}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
