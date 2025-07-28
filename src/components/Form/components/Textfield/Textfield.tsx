import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

interface TextFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  label?: string;
  name: TName;
  type?: string;
  placeholder?: string;
  id?: string;
  control?: ControllerProps<TFieldValues, TName>["control"];
}

export function TextField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  label,
  name,
  id,
  placeholder,
  type,
  control,
}: TextFieldProps<TFieldValues, TName>) {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel className={cn("text-sm font-poppins")}>{label}</FormLabel>
          <FormControl>
            {type === "long" ? (
              <Textarea
                id={id}
                placeholder={placeholder}
                {...field}
                className={cn(
                  "resize-none",
                  "border-zinc-500 placeholder:text-muted-foreground aria-invalid:placeholder:text-destructive/50 focus-visible:border-indigo-700 focus-visible:ring-indigo-700/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 font-poppins text-xs"
                )}
              />
            ) : (
              <Input
                id={id}
                placeholder={placeholder}
                type={type}
                {...field}
                className={cn(
                  "border-zinc-500 placeholder:text-muted-foreground aria-invalid:placeholder:text-destructive/50 focus-visible:border-indigo-700 focus-visible:ring-indigo-700/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 font-poppins text-xs"
                )}
              />
            )}
          </FormControl>
          <FormMessage className={cn("text-start text-xs")} />
        </FormItem>
      )}
    />
  );
}
