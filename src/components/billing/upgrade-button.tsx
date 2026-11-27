"use client";

import { useState, type ReactNode } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { UpgradeDialog } from "./upgrade-dialog";

export interface UpgradeButtonProps extends Omit<ButtonProps, "onClick"> {
  /** Etiqueta del botón; se usa `dict.billing.common.upgrade` si se omite. */
  children?: ReactNode;
  featureLabel?: string;
}

/** Abre el diálogo de upgrade desde cualquier punto de la aplicación. */
export function UpgradeButton({ children, featureLabel, ...rest }: UpgradeButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} {...rest}>
        {children}
      </Button>
      <UpgradeDialog open={open} onOpenChange={setOpen} featureLabel={featureLabel} />
    </>
  );
}
