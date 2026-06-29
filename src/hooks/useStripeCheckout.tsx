import { useState, useCallback } from "react";
import { StripeEmbeddedCheckout } from "@/components/StripeEmbeddedCheckout";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface CheckoutOptions {
  priceId: string;
  returnUrl?: string;
}

export function useStripeCheckout() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<CheckoutOptions | null>(null);

  const openCheckout = useCallback((opts: CheckoutOptions) => {
    setOptions(opts);
    setIsOpen(true);
  }, []);

  const closeCheckout = useCallback(() => {
    setIsOpen(false);
    setOptions(null);
  }, []);

  const checkoutElement = isOpen && options ? (
    <Dialog open={isOpen} onOpenChange={(o) => !o && closeCheckout()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Complete your subscription</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <StripeEmbeddedCheckout {...options} />
        </div>
      </DialogContent>
    </Dialog>
  ) : null;

  return { openCheckout, closeCheckout, isOpen, checkoutElement };
}
