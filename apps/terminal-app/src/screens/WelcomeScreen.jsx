import { ScreenLayout, LocQarLogo } from '../components/Layout'

export default function WelcomeScreen({ onNext }) {
  return (
    <ScreenLayout>
      <div className="flex-1 flex flex-col items-center justify-center animate-fade">
        <LocQarLogo size="lg" />

        <div className="mt-20 text-center">
          <h2 className="text-4xl font-light text-white tracking-wide">Welcome</h2>
          <div className="w-12 h-px bg-locqar-red mx-auto mt-4 animate-line" />
        </div>

        <button
          onClick={onNext}
          className="mt-16 px-20 py-5 rounded-full text-lg font-medium tracking-wider uppercase
            bg-locqar-red text-white
            hover:bg-red-700 active:scale-[0.98] transition-all animate-breathe"
        >
          Start
        </button>
      </div>
    </ScreenLayout>
  )
}
