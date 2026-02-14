"use client";

import { z } from "zod";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { InputOTPSchema } from "@/lib/tambo/schemas/form-schemas";

type InputOTPProps = z.infer<typeof InputOTPSchema>;

export function TamboInputOTP({ length }: InputOTPProps) {
  return (
    <InputOTP maxLength={length}>
      <InputOTPGroup>
        {Array.from({ length }, (_, i) => (
          <InputOTPSlot key={i} index={i} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
}
