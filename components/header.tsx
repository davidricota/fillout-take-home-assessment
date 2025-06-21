import Image from "next/image";

export function Header() {
  return (
    <header className="flex items-center justify-center border-b border-gray-200 bg-gray-50 px-6 py-4 md:justify-start">
      <Image
        src="/logo-fillout.svg"
        alt="Fillout Logo"
        width={100}
        height={25}
        priority
      />
    </header>
  );
}
