import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#07070A] px-6 text-center">
      <div>
        <p className="text-[11px] uppercase tracking-[0.32em] text-yellow-400">404</p>
        <h1 className="mt-4 font-display text-4xl text-white sm:text-6xl">This chamber is empty.</h1>
        <p className="mx-auto mt-4 max-w-md text-zinc-400">
          The path does not match a furnace, a calculator, or a project brief.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-yellow-400 px-5 py-3 text-sm font-semibold text-black hover:shadow-[0_0_25px_#FACC15]"
        >
          Return to Alpha Equipments
        </Link>
      </div>
    </main>
  );
}
