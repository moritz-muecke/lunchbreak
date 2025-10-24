/**
 * Header component with logo
 * Clean, minimal design with just the logo
 */

import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-slate-50 to-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-center">
          <Image
            src="/lunchbreak.png"
            alt="Lunchbreak Logo"
            width={250}
            height={250}
            className="rounded-xl"
          />
        </div>
      </div>
    </header>
  );
}