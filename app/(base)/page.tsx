import { subtitle, title } from "@/components/primitives";
import BtnPanel from "./_components/button_panel";


export default function Page() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 my-auto md:py-[100px]">
      <div className="justify-center inline-block max-w-2xl text-center">
        <span className={title()}>Reserva&nbsp;</span>
        <span className={title({ color: "violet" })}>
          rápido y simple&nbsp;
        </span>
        <br className="hidden sm:block" />
        <span className={title()}>
          actividades en los locales de la universidad.
        </span>
        <div className={subtitle({ class: "mt-4" })}>
          ¡Planifica con confianza y optimiza tu tiempo!
        </div>
      </div>

      <div className="flex flex-col gap-5 sm:flex-row">
        <BtnPanel />
      </div>
    </section>
  );
}
