import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { translate } from "@/lib/translate";

export function EnvVarWarning() {
  return (
    <div className="flex gap-4 items-center">
      <Badge variant={"outline"} className="font-normal">
        {translate('supabase_env_required')}
      </Badge>
      <div className="flex gap-2">
        <Button size="sm" variant={"outline"} disabled>
          {translate('sign_in')}
        </Button>
        <Button size="sm" variant={"default"} disabled>
          {translate('sign_up')}
        </Button>
      </div>
    </div>
  );
}
