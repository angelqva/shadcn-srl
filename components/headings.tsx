import { ReactNode } from "react";

export function Headings({
  children,
  action,
}: {
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="js-headings block mt-6 mb-14">
      <div className="flex flex-col-reverse md:flex-row gap-5 w-full justify-between">
        <div className="w-full max-w-3xl">{children}</div>
        {action && (
          <div className="flex justify-center min-w-fit">{action}</div>
        )}
      </div>
    </section>
  );
}
