export default function HowItWorks() {
  return (
    <div className="h-screen snap-start flex flex-col items-center justify-between p-20">
      <div className="text-center">
        <h2 className="text-4xl font-bold">Jak to działa</h2>
        <p className="mt-4 text-lg">
          Dowiedz się jak nasza firma działa i jak możemy Ci pomóc
        </p>
      </div>
      <div className="flex flex-col gap-20">
        <div className="flex flex-row gap-40">
          <div className="relative w-20 aspect-square bg-primary rounded-full flex items-center justify-center text-4xl">
            1
            <div className="absolute text-sm text-center -bottom-12 left-1/2 transform -translate-x-1/2">
              Zarejestruj się
            </div>
          </div>
          <div className="relative w-20 aspect-square bg-primary rounded-full flex items-center justify-center text-4xl">
            3
            <div className="absolute text-sm text-center -bottom-12 left-1/2 transform -translate-x-1/2">
              Utwórz stronę
            </div>
          </div>
          <div className="relative w-20 aspect-square bg-primary rounded-full flex items-center justify-center text-4xl">
            5
            <div className="absolute text-sm text-center -bottom-12 left-1/2 transform -translate-x-1/2">
              Opublikuj stronę
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-40 translate-x-1/5">
          <div className="relative w-20 aspect-square bg-primary rounded-full flex items-center justify-center text-4xl">
            2
            <div className="absolute text-sm text-center -bottom-12 left-1/2 transform -translate-x-1/2">
              Wybierz plan
            </div>
          </div>
          <div className="relative w-20 aspect-square bg-primary rounded-full flex items-center justify-center text-4xl">
            4
            <div className="absolute text-sm text-center -bottom-17 left-1/2 transform -translate-x-1/2">
              Stwórz swoją stronę
            </div>
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
}
