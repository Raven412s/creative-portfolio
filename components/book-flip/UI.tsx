"use client"
import { atom, useAtom } from "jotai";
import { JSX } from "react";

const pictures: string[] = [
  "DSC00680",
  "DSC00933",
  "DSC00966",
  "DSC00983",
  "DSC01011",
  "DSC01040",
  "DSC01064",
  "DSC01071",
  "DSC01103",
  "DSC01145",
  "DSC01420",
  "DSC01461",
  "DSC01489",
  "DSC02031",
  "DSC02064",
  "DSC02069",
];

interface PageData {
  front: string
  back: string
}

export const pageAtom = atom<number>(0);

export const pages: PageData[] = [
  {
    front: "book-cover",
    back: pictures[0],
  },
];

for (let i = 1; i < pictures.length - 1; i += 2) {
  pages.push({
    front: pictures[i % pictures.length],
    back: pictures[(i + 1) % pictures.length],
  });
}

pages.push({
  front: pictures[pictures.length - 1],
  back: "book-back",
});

export const UI = (): JSX.Element => {
  const [page, setPage] = useAtom(pageAtom);

  return (
    <main className="pointer-events-none select-none z-10 absolute inset-0 flex justify-end flex-col">
      <div className="w-full overflow-auto pointer-events-auto flex justify-center">
        <div className="overflow-auto flex items-center gap-4 max-w-full p-4 md:p-6 lg:p-10">
          {[...pages].map((_: PageData, index: number) => (
            <button
              key={index}
              className={`border-transparent hover:border-white transition-all duration-300 px-1 py-1 sm:px-2 sm:py-1 md:px-2.5 md:py-1 lg:px-4 lg:py-3 rounded-full text-lg uppercase shrink-0 border ${
                index === page
                  ? "bg-white/90 text-black"
                  : "bg-black/30 text-white"
              }`}
              onClick={() => setPage(index)}
            >
              {index === 0 ? "Cover" : `Page ${index}`}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
};