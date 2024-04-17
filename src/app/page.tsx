import HowToPlay from '@/components/home/HowToPlay'
import GameRules from '@/components/home/GameRules'
import CreateOrPlay from '@/components/home/CreateOrPlay'

export default function Page() {
  return (
    <main className="py-24 flex min-h-screen flex-col items-center justify-between">
      <CreateOrPlay/>
      <HowToPlay/>
      <GameRules/>
    </main>
  );
}
